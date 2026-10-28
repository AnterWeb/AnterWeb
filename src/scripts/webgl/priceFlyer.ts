// Flyer de precios en WebGL: hoja de papel clavada con una chinche 3D.
//
// Jerarquía:
//   board (se inclina con el cursor y entra volando con el scroll)
//   ├── pin            chinche fija: es el eje de todo
//   └── pivot          gira en Z alrededor de la chinche (balanceo con física de resorte)
//       ├── shadow     sombra de la hoja
//       └── paper      plano deformado por shader (ondula, se curva, hendidura bajo el cursor)
//
// Solo renderiza mientras está en pantalla. Con reduced motion dibuja un cuadro estático.
import {
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  NeutralToneMapping,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  Timer,
  Vector2,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gsap, ScrollTrigger, motionAllowed } from '../motion/gsap';
import { FLYER_HEIGHT, FLYER_WIDTH, PIN_X, PIN_Y, createFlyerCanvas } from './flyerTexture';
import { createPushPin } from './pushPin';
import type { PriceSheet } from '../../data/cms';
import paperVert from './shaders/paper.vert.glsl?raw';
import paperFrag from './shaders/paper.frag.glsl?raw';
import shadowVert from './shaders/shadow.vert.glsl?raw';
import shadowFrag from './shaders/shadow.frag.glsl?raw';

const FOV = 32;
const CAMERA_Z = 5;
const FILL = 0.9; // fracción de la caja de layout que ocupa la hoja
// El canvas es más grande que la caja (ver PriceFlyer.astro: inset negativo) para que
// las inclinaciones nunca recorten la hoja. Este margen debe coincidir con el CSS.
const BLEED_X = 0.25;
const BLEED_Y = 0.15;

// Resorte del balanceo
const REST_ANGLE = -0.05; // inclinación de reposo, como la tarjeta HTML
const STIFFNESS = 22;
const DAMPING = 3.4;
const MAX_TILT_X = 0.07;
const MAX_TILT_Y = 0.11;

export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export async function initPriceFlyer(stage: HTMLElement, sheet: PriceSheet) {
  const animate = motionAllowed();

  // Renderer, escena, cámara, luces (las luces solo afectan a la chinche; el papel usa su shader)
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping; // solo afecta a la chinche (el papel usa su propio shader)
  stage.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.z = CAMERA_Z;

  const key = new DirectionalLight('#ffffff', 2.4);
  key.position.set(-2, 3, 4);
  scene.add(new HemisphereLight('#f6f5ec', '#a99f8c', 0.9), key);

  // Reflejos de entorno: dan el brillo realista del plástico de la chinche.
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  // Medidas de la hoja y posición de la chinche en coordenadas del plano
  const height = 2;
  const width = height * (FLYER_WIDTH / FLYER_HEIGHT);
  const pinPos = new Vector2((PIN_X / FLYER_WIDTH - 0.5) * width, (0.5 - PIN_Y / FLYER_HEIGHT) * height);

  // Papel
  const texture = new CanvasTexture(await createFlyerCanvas(sheet));
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const paperMaterial = new ShaderMaterial({
    vertexShader: paperVert,
    fragmentShader: paperFrag,
    uniforms: {
      uMap: { value: texture },
      uTime: { value: 0 },
      uWave: { value: 1 },
      uBend: { value: 0.1 },
      uHover: { value: 0 },
      uPointer: { value: new Vector2() },
      uPin: { value: pinPos.clone() },
      uHalf: { value: new Vector2(width / 2, height / 2) },
    },
  });
  const paper = new Mesh(new PlaneGeometry(width, height, 48, 60), paperMaterial);

  const shadowMaterial = new ShaderMaterial({
    vertexShader: shadowVert,
    fragmentShader: shadowFrag,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uOpacity: { value: 0.3 },
      uColor: { value: new Color('#23261c') },
      uBox: { value: new Vector2(0.38, 0.4) },
      uRadius: { value: 0.06 },
      uSoft: { value: 0.11 },
    },
  });
  const shadow = new Mesh(new PlaneGeometry(width * 1.25, height * 1.2), shadowMaterial);

  // Pivote en la chinche: la hoja y su sombra se desplazan para que el giro ocurra en ese punto.
  const pivot = new Group();
  pivot.position.set(pinPos.x, pinPos.y, 0);
  paper.position.set(-pinPos.x, -pinPos.y, 0);
  shadow.position.set(-pinPos.x + 0.07, -pinPos.y - 0.1, -0.35);
  pivot.add(shadow, paper);

  const pin = createPushPin();
  pin.position.set(pinPos.x, pinPos.y, 0);

  const board = new Group();
  board.add(pivot, pin);
  scene.add(board);

  // Estado: los "target" los fijan cursor y scroll; el loop interpola o integra hacia ellos.
  const state = {
    enter: animate ? 0 : 1,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    hover: 0,
    targetHover: 0,
    pointer: new Vector2(),
    lastPointerX: 0,
    wave: 1,
    targetWave: 1,
    angle: REST_ANGLE,
    velocity: 0,
  };

  const kick = (amount: number) => {
    state.velocity = gsap.utils.clamp(-3, 3, state.velocity + amount);
  };

  // Ajusta la escala para que la hoja ocupe FILL de la caja de layout (no del canvas, que sangra).
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = stage;
    if (!w || !h) return;
    const canvasW = w * (1 + BLEED_X * 2);
    const canvasH = h * (1 + BLEED_Y * 2);
    renderer.setSize(canvasW, canvasH, false);
    camera.aspect = canvasW / canvasH;
    camera.updateProjectionMatrix();

    const visibleH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
    const visibleW = visibleH * camera.aspect;
    const boxH = visibleH / (1 + BLEED_Y * 2);
    const boxW = visibleW / (1 + BLEED_X * 2);
    board.scale.setScalar(Math.min((boxH * FILL) / height, (boxW * FILL) / width));
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  // Cursor → inclinación del tablero, hendidura en el papel y empujón al balanceo.
  const onPointerMove = (event: PointerEvent) => {
    const box = stage.getBoundingClientRect();
    const nx = ((event.clientX - box.left) / box.width) * 2 - 1;
    const ny = -(((event.clientY - box.top) / box.height) * 2 - 1);
    state.targetTiltY = nx * MAX_TILT_Y;
    state.targetTiltX = -ny * MAX_TILT_X;
    state.targetHover = 1;
    state.pointer.set((nx * width) / 2 / FILL, (ny * height) / 2 / FILL);

    const dx = event.clientX - state.lastPointerX;
    state.lastPointerX = event.clientX;
    if (Math.abs(dx) < 80) kick(dx * 0.0035);
  };
  const onPointerEnter = (event: PointerEvent) => {
    state.lastPointerX = event.clientX;
  };
  const onPointerLeave = () => {
    state.targetTiltX = 0;
    state.targetTiltY = 0;
    state.targetHover = 0;
  };

  const timer = new Timer();
  let running = false;
  let frame = 0;

  const render = () => {
    timer.update();
    const t = timer.getElapsed();
    const dt = Math.min(timer.getDelta(), 1 / 30);
    const ease = 0.06;

    state.tiltX += (state.targetTiltX - state.tiltX) * ease;
    state.tiltY += (state.targetTiltY - state.tiltY) * ease;
    state.hover += (state.targetHover - state.hover) * ease;
    state.wave += (state.targetWave - state.wave) * 0.05;
    state.targetWave += (1 - state.targetWave) * 0.04;

    // Balanceo alrededor de la chinche (resorte amortiguado).
    const accel = -STIFFNESS * (state.angle - REST_ANGLE) - DAMPING * state.velocity;
    state.velocity += accel * dt;
    state.angle += state.velocity * dt;
    pivot.rotation.z = state.angle;

    // Entrada: el tablero llega rotado y desde abajo, con la hoja más curvada.
    const out = 1 - state.enter;
    board.rotation.set(state.tiltX + out * 0.45, state.tiltY - out * 0.18, out * 0.1);
    board.position.y = -out * 0.9 + Math.sin(t * 0.7) * 0.012 * state.enter;
    shadowMaterial.uniforms.uOpacity.value = 0.3 * state.enter;

    const u = paperMaterial.uniforms;
    u.uTime.value = t;
    u.uWave.value = state.wave;
    u.uBend.value = 0.08 + out * 0.3;
    u.uHover.value = state.hover;
    u.uPointer.value.copy(state.pointer);

    renderer.render(scene, camera);
    if (running) frame = requestAnimationFrame(render);
  };

  if (!animate) {
    render();
    return;
  }

  stage.addEventListener('pointerenter', onPointerEnter);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerleave', onPointerLeave);

  // Solo anima mientras está en pantalla.
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) {
      running = true;
      timer.reset();
      frame = requestAnimationFrame(render);
    } else if (!entry.isIntersecting && running) {
      running = false;
      cancelAnimationFrame(frame);
    }
  }).observe(stage);

  // Entrada atada al scroll; al terminar de llegar, la hoja se mece sobre la chinche.
  let landed = false;
  gsap.to(state, {
    enter: 1,
    ease: 'none',
    scrollTrigger: { trigger: stage, start: 'top bottom', end: 'center 55%', scrub: 0.8 },
    onUpdate() {
      if (!landed && state.enter > 0.98) {
        landed = true;
        kick(0.5);
      }
      if (state.enter < 0.5) landed = false;
    },
  });

  // La velocidad del scroll agita el papel y lo hace mecerse.
  ScrollTrigger.create({
    trigger: stage,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const v = self.getVelocity();
      state.targetWave = Math.min(2.2, 1 + Math.abs(v) / 1600);
      kick(v * 0.00003);
    },
  });
}

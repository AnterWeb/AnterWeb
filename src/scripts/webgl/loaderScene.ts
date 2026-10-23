// Escena 3D de la pantalla de carga: un solo renderer de pantalla completa (transparente) para las tijeras
// (scissors.ts) y las solapas de papel (paperFlaps.ts). Lo carga con import() scripts/motion/loader.ts.
//
// El papel está en el plano z = PAPER_Z y la cámara lo ve de frente, así que un px de pantalla mide lo mismo
// en todo el plano: unitsPerPx(z) convierte medidas del DOM a unidades 3D sin descuadrar nada.
import {
  BackSide,
  BoxGeometry,
  CanvasTexture,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  NeutralToneMapping,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  VSMShadowMap,
  WebGLRenderer,
} from 'three';

const FOV = 26;
const CAMERA_Z = 12;

/**
 * Estudio de producto para los reflejos: cuarto oscuro, softboxes y una pared frontal en degradado.
 * El acero refleja franjas de luz sobre oscuro (cromo) y, al balancearse, el brillo le corre por la hoja.
 * Las luces van en HDR (color > 1), como en RoomEnvironment.
 */
function studio() {
  const room = new Scene();
  room.add(new Mesh(new BoxGeometry(24, 24, 24), new MeshBasicMaterial({ color: '#3a3d34', side: BackSide })));

  const panel = (w: number, h: number, color: string, intensity: number, [x, y, z]: number[]) => {
    const mesh = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color }));
    mesh.material.color.multiplyScalar(intensity);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    room.add(mesh);
  };
  panel(10, 3.2, '#ffffff', 6, [0, 9, 3]); // softbox cenital
  panel(1.4, 14, '#ffffff', 7, [-10, 1, 3]); // franja izquierda: filo brillante
  panel(1.1, 14, '#fff0dc', 4, [10, 0, 1]); // contraluz cálido a la derecha
  panel(16, 5, '#c5c8ad', 0.9, [0, -10, 3]); // rebote salvia desde abajo

  // Pared detrás de la cámara (lo que reflejan las caras): clara arriba, una franja oscura
  // (el "horizonte" del cromo) y un rebote medio abajo
  const gradient = document.createElement('canvas');
  gradient.width = 4;
  gradient.height = 256;
  const ctx = gradient.getContext('2d')!;
  const fill = ctx.createLinearGradient(0, 0, 0, 256);
  fill.addColorStop(0, '#ffffff');
  fill.addColorStop(0.22, '#e9e9e3');
  fill.addColorStop(0.32, '#4f5247');
  fill.addColorStop(0.4, '#25271f');
  fill.addColorStop(0.62, '#7d806f');
  fill.addColorStop(1, '#b4b6a5');
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, 4, 256);
  const wall = new Mesh(new PlaneGeometry(22, 22), new MeshBasicMaterial({ map: new CanvasTexture(gradient) }));
  wall.material.map!.colorSpace = SRGBColorSpace;
  wall.material.color.multiplyScalar(1.7);
  wall.position.set(0, 0, 11.5);
  wall.lookAt(0, 0, 0);
  room.add(wall);
  return room;
}

export type LoaderScene = ReturnType<typeof createLoaderScene>;

export function createLoaderScene(stage: HTMLElement) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = VSMShadowMap;
  stage.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.z = CAMERA_Z;

  // Reflejos de estudio: es lo que hace ver el acero como acero
  const pmrem = new PMREMGenerator(renderer);
  const room = studio();
  const environment = pmrem.fromScene(room, 0.02).texture;
  room.traverse((object) => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      object.material.map?.dispose();
      object.material.dispose();
    }
  });
  pmrem.dispose();
  scene.environment = environment;

  // Luz principal alta y a la izquierda: da la sombra y el brillo de los mangos. Llega de lado para que su
  // reflejo no blanquee las caras del acero (que viven de los reflejos del estudio)
  const key = new DirectionalLight('#ffffff', 1.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 9;
  key.shadow.blurSamples = 20;
  key.shadow.bias = -0.0004;
  scene.add(new HemisphereLight('#f6f5ec', '#8e9274', 0.25), key, key.target);

  const view = {
    renderer,
    scene,
    camera,
    key,
    width: 0,
    height: 0,
    /** unidades 3D por px de pantalla en el plano z */
    unitsPerPx: (z = 0) => (2 * (CAMERA_Z - z) * Math.tan(((FOV / 2) * Math.PI) / 180)) / view.height,
    render: () => renderer.render(scene, camera),
    onResize: [] as (() => void)[],
    dispose: () => {
      window.removeEventListener('resize', resize);
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };

  const resize = () => {
    view.width = window.innerWidth;
    view.height = window.innerHeight;
    renderer.setSize(view.width, view.height, false);
    camera.aspect = view.width / view.height;
    camera.updateProjectionMatrix();
    for (const callback of view.onResize) callback();
  };
  resize();
  window.addEventListener('resize', resize);

  return view;
}

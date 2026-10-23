// Tijeras de sastre en 3D para la pantalla de carga, sobre la escena de loaderScene.ts.
//   · Hojas de acero cepillado (anisotropía a lo largo de la hoja) con sección de cuña: gruesas en el lomo,
//     finas en el filo y apenas arqueadas, así el brillo cambia de una hoja a la otra y corre al moverse.
//   · Mangos de tubo laqueado en tinta (sección redonda: reflejos de plástico moldeado).
//   · Perno de cabeza abombada con ranura.
//   · Sombra suave real sobre el papel (ShadowMaterial), más clara cuanto más se levantan.
//
// Jerarquía (apuntan a +x; el perno está en el origen y el filo sobre y = 0):
//   rig        posición en pantalla, altura, escala e inclinación
//   ├── a      mango de arriba + hoja de abajo: gira en Z alrededor del perno
//   ├── b      mango de abajo + hoja de arriba (espejo de a)
//   └── screw  perno
import {
  BoxGeometry,
  CylinderGeometry,
  Curve,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Shape,
  ShadowMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
} from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { LoaderScene } from './loaderScene';

/** Largo del modelo en unidades: del borde del aro (-1.48) a la punta (2.05) */
const LENGTH = 3.53;
const TIP = 2.05;
/** Apertura máxima de cada mitad (rad) */
const MAX_OPEN = 0.3;
/** Altura de reposo sobre el papel (en largos de tijera): separa la sombra lo justo */
const REST_HEIGHT = 0.1;
/** Opacidad de la sombra apoyadas */
const SHADOW = 0.3;
/** Aro del mango: centro, semiejes de su línea media, grosor del tubo e inclinación */
const RING = { x: -1.08, y: 0.46, rx: 0.33, ry: 0.215, tube: 0.068, tilt: -0.2 };

export interface ScissorsState {
  /** posición del perno en px desde la izquierda de la pantalla */
  x: number;
  /** desplazamiento vertical del perno en px (positivo = abajo) */
  y: number;
  /** altura sobre el papel en largos de tijera: 0 = apoyadas; al subir se acercan a la cámara */
  lift: number;
  /** giro en el plano del papel (rad) */
  spin: number;
  /** 0 cerradas, 1 abiertas */
  open: number;
  /** inclinación hacia la cámara (rad): mueve los reflejos */
  roll: number;
  /** giro sobre el eje vertical (rad) */
  yaw: number;
}

export type Scissors = ReturnType<typeof createScissors>;

/** Contorno de una mitad: hoja + brazo que sube al aro. s = 1 es la mitad a; s = -1, su espejo. */
function bladeShape(s: 1 | -1) {
  const shape = new Shape();
  shape.moveTo(TIP, 0);
  shape.lineTo(0.17, 0); // filo
  shape.absarc(0, 0, 0.17, 0, 1.75 * s, s < 0); // cuerpo alrededor del perno
  shape.quadraticCurveTo(-0.38, 0.22 * s, -0.74, 0.44 * s); // brazo, borde exterior (termina dentro del aro)
  shape.lineTo(-0.84, 0.3 * s);
  shape.quadraticCurveTo(-0.42, 0.02 * s, -0.08, -0.19 * s); // brazo, borde interior
  shape.quadraticCurveTo(0.55, -0.31 * s, 1.2, -0.17 * s); // lomo de la hoja
  shape.quadraticCurveTo(1.75, -0.06 * s, TIP, 0);
  return shape;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Hoja extruida y luego tallada: el grosor baja hacia el filo (cuña) y la hoja se arquea un poco hacia
 * la otra. Las normales se recalculan suaves en las caras y quedan duras en las aristas del bisel.
 */
function bladeGeometry(s: 1 | -1) {
  const depth = 0.05;
  const raw = new ExtrudeGeometry(bladeShape(s), {
    depth,
    curveSegments: 72,
    bevelEnabled: true,
    bevelThickness: 0.016,
    bevelSize: 0.013,
    bevelSegments: 4,
  });
  raw.translate(0, 0, -depth / 2);

  const position = raw.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const fromEdge = -position.getY(i) * s; // la hoja de cada mitad queda del lado opuesto a su mango
    const blade = smoothstep(0.15, 0.45, x); // solo la hoja; el brazo y el perno quedan planos
    const wedge = 1 - blade * (1 - (0.28 + 0.72 * smoothstep(0, 0.2, fromEdge)));
    const bow = -0.045 * s * blade * (x / TIP) ** 2; // se arquean una hacia la otra, como en unas tijeras reales
    position.setZ(i, position.getZ(i) * wedge + bow);
  }

  raw.deleteAttribute('normal');
  const geometry = mergeVertices(raw, 1e-5);
  geometry.computeVertexNormals();
  raw.dispose();
  return geometry;
}

/** Línea media elíptica del aro (curva cerrada para TubeGeometry). */
class RingPath extends Curve<Vector3> {
  constructor(private readonly s: 1 | -1) {
    super();
  }

  getPoint(t: number, target = new Vector3()) {
    const angle = t * Math.PI * 2;
    const tilt = RING.tilt * this.s;
    const x = RING.rx * Math.cos(angle);
    const y = RING.ry * Math.sin(angle);
    return target.set(
      RING.x + x * Math.cos(tilt) - y * Math.sin(tilt),
      RING.y * this.s + x * Math.sin(tilt) + y * Math.cos(tilt),
      0,
    );
  }
}

export function createScissors(view: LoaderScene) {
  const steel = new MeshPhysicalMaterial({
    color: '#c9cdce',
    metalness: 1,
    roughness: 0.14,
    anisotropy: 0.6, // cepillado a lo largo de la hoja (eje u de la extrusión)
  });
  const lacquer = new MeshPhysicalMaterial({
    color: '#1f2219',
    metalness: 0,
    roughness: 0.38,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
  });
  const screwSteel = new MeshPhysicalMaterial({ color: '#cfd2d2', metalness: 1, roughness: 0.18 });

  const geometries: BufferGeometry[] = [];
  const mesh = (geometry: BufferGeometry, material: MeshPhysicalMaterial) => {
    geometries.push(geometry);
    const m = new Mesh(geometry, material);
    m.castShadow = true;
    return m;
  };

  const half = (s: 1 | -1) => {
    const group = new Group();
    group.add(mesh(bladeGeometry(s), steel), mesh(new TubeGeometry(new RingPath(s), 160, RING.tube, 24, true), lacquer));
    group.position.z = 0.046 * s; // las hojas pasan una sobre la otra
    return group;
  };
  const a = half(1);
  const b = half(-1);

  // Perno: vástago, cabeza abombada al frente y ranura
  const screw = new Group();
  const shaft = mesh(new CylinderGeometry(0.07, 0.07, 0.2, 40), screwSteel);
  shaft.rotation.x = Math.PI / 2;
  const dome = mesh(new SphereGeometry(0.092, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), screwSteel);
  dome.rotation.x = Math.PI / 2;
  dome.scale.set(1, 0.42, 1);
  dome.position.z = 0.085;
  const slot = mesh(new BoxGeometry(0.13, 0.016, 0.03), lacquer);
  slot.position.z = 0.122;
  slot.rotation.z = 0.6;
  screw.add(shaft, dome, slot);

  const rig = new Group();
  rig.add(a, b, screw);
  view.scene.add(rig);

  // El papel: solo recibe la sombra, en tono tinta para que se lea natural
  const shade = new ShadowMaterial({ color: '#23261c', opacity: SHADOW });
  const floor = new Mesh(new PlaneGeometry(1, 1), shade);
  floor.receiveShadow = true;
  view.scene.add(floor);

  let scale = 1;
  let unitsPerPx = 1;
  let fade = 1;

  const resize = () => {
    unitsPerPx = view.unitsPerPx();
    const lengthPx = Math.min(360, Math.max(170, view.width * 0.24));
    scale = (lengthPx * unitsPerPx) / LENGTH;
    rig.scale.setScalar(scale);
    floor.position.z = -LENGTH * REST_HEIGHT * scale;
    floor.scale.set(view.width * unitsPerPx * 1.3, view.height * unitsPerPx * 1.3, 1);

    // La cámara de sombra sigue a las tijeras (en draw) y cubre de sobra su sombra: así su borde nunca
    // queda a la vista sobre el papel
    const box = LENGTH * scale * 2.4;
    Object.assign(view.key.shadow.camera, { left: -box, right: box, top: box, bottom: -box, near: 0.1, far: 30 });
    view.key.shadow.camera.updateProjectionMatrix();
  };
  resize();
  view.onResize.push(resize);

  return {
    /** largo en pantalla (px) */
    length: () => (LENGTH * scale) / unitsPerPx,
    /** distancia del perno a la punta en pantalla (px) */
    tip: () => (TIP * scale) / unitsPerPx,
    /** altura del papel (z), donde se apoyan y cae su sombra */
    paperZ: () => floor.position.z,
    /** 1 = sombra normal, 0 = sin sombra (cuando el papel se enrolla, la sombra ya no tiene dónde caer) */
    setShadow: (value: number) => {
      fade = value;
    },
    draw: ({ x, y, lift, spin, open, roll, yaw }: ScissorsState) => {
      rig.position.set((x - view.width / 2) * unitsPerPx, -y * unitsPerPx, lift * LENGTH * scale);
      rig.rotation.set(roll, yaw, spin);
      a.rotation.z = -open * MAX_OPEN;
      b.rotation.z = open * MAX_OPEN;
      shade.opacity = SHADOW * fade * (1 - Math.min(1, lift) * 0.65); // al levantarse, la sombra se aclara
      view.key.target.position.copy(rig.position);
      view.key.position.set(rig.position.x - 5, rig.position.y + 6, 6);
    },
    dispose: () => {
      view.scene.remove(rig, floor);
      for (const geometry of geometries) geometry.dispose();
      floor.geometry.dispose();
      for (const material of [steel, lacquer, screwSteel, shade]) material.dispose();
    },
  };
}

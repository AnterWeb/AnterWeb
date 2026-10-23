// Solapas de papel de la pantalla de carga: al terminar el corte, la hoja HTML se cambia por estas dos
// mallas con su misma imagen (dibujada desde el DOM) y cada una se enrolla desde el corte hacia afuera,
// arriba hacia arriba y abajo hacia abajo. El rollo proyecta una sombra sobre la página que se descubre.
// En plano son idénticas a la hoja HTML (mismo color y posición), así el cambio no se nota.
import {
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  PlaneGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  Vector3,
} from 'three';
import { WORDMARK_HEIGHT, WORDMARK_WIDTH, wordmarkGlyphs } from '../../data/wordmark';
import type { LoaderScene } from './loaderScene';
import flapVert from './shaders/flap.vert.glsl?raw';
import flapFrag from './shaders/flap.frag.glsl?raw';
import flapShadowVert from './shaders/flapShadow.vert.glsl?raw';
import flapShadowFrag from './shaders/flapShadow.frag.glsl?raw';

/** Radio del rollo, en fracción del alto de la pantalla */
const ROLL_RADIUS = 0.045;
/** Color de las marcas de corte (el mismo color-mix del CSS) */
const CROP = 'rgb(35 38 28 / 0.38)';

export type PaperFlaps = ReturnType<typeof createPaperFlaps>;

/** La hoja tal como se ve: lino, la palabra y las marcas de corte, medidas del DOM. */
function drawSheet(loader: HTMLElement, width: number, height: number, dpr: number) {
  const tokens = getComputedStyle(document.documentElement);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = tokens.getPropertyValue('--lino').trim();
  ctx.fillRect(0, 0, width, height);

  // Las dos solapas tienen la palabra en el mismo lugar: basta con medir una
  const mark = loader.querySelector('.loader__mark svg')!.getBoundingClientRect();
  ctx.save();
  ctx.translate(mark.left, mark.top);
  ctx.scale(mark.width / WORDMARK_WIDTH, mark.height / WORDMARK_HEIGHT);
  ctx.fillStyle = tokens.getPropertyValue('--tinta').trim();
  for (const glyph of wordmarkGlyphs) ctx.fill(new Path2D(glyph.d));
  ctx.restore();

  ctx.strokeStyle = CROP;
  ctx.lineWidth = 1;
  for (const crop of loader.querySelectorAll<HTMLElement>('.loader__crop')) {
    const r = crop.getBoundingClientRect();
    const style = getComputedStyle(crop);
    const line = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };
    if (parseFloat(style.borderTopWidth)) line(r.left, r.top + 0.5, r.right, r.top + 0.5);
    if (parseFloat(style.borderBottomWidth)) line(r.left, r.bottom - 0.5, r.right, r.bottom - 0.5);
    if (parseFloat(style.borderLeftWidth)) line(r.left + 0.5, r.top, r.left + 0.5, r.bottom);
    if (parseFloat(style.borderRightWidth)) line(r.right - 0.5, r.top, r.right - 0.5, r.bottom);
  }
  return canvas;
}

export function createPaperFlaps(view: LoaderScene, loader: HTMLElement, paperZ: number) {
  const { width, height } = view;
  const unitsPerPx = view.unitsPerPx(paperZ);
  const w = width * unitsPerPx;
  const h = (height / 2) * unitsPerPx;
  const radius = height * ROLL_RADIUS * unitsPerPx;
  /** Hasta dónde llega el eje del rollo al final: toda la solapa enrollada y fuera de la pantalla */
  const end = h + radius * 2.6;

  const texture = new CanvasTexture(drawSheet(loader, width, height, view.renderer.getPixelRatio()));
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = false;

  const light = new Vector3(-0.3, 0.5, 0.81).normalize();
  const disposables: { dispose: () => void }[] = [texture];
  const meshes: Mesh[] = [];
  const curls: { value: number }[] = [];

  for (const side of [1, -1]) {
    // Cada solapa va del corte (y = 0) a su orilla; su uv toma su mitad de la hoja
    const geometry = new PlaneGeometry(w, h, 1, 200);
    geometry.translate(0, (side * h) / 2, 0);
    const uv = geometry.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setY(i, side > 0 ? 0.5 + uv.getY(i) * 0.5 : uv.getY(i) * 0.5);

    const curl = { value: 0 };
    curls.push(curl);
    const paper = new ShaderMaterial({
      vertexShader: flapVert,
      fragmentShader: flapFrag,
      side: DoubleSide, // al enrollarse se ve el reverso
      toneMapped: false,
      uniforms: {
        uCurl: curl,
        uRadius: { value: radius },
        uSide: { value: side },
        uMap: { value: texture },
        uBack: { value: new Color('#e3e4d2') },
        uLight: { value: light },
      },
    });
    const shadow = new ShaderMaterial({
      vertexShader: flapShadowVert,
      fragmentShader: flapShadowFrag,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        uCurl: curl,
        uSoft: { value: radius * 2.4 },
        uStrength: { value: 0.2 },
        uColor: { value: new Color('#23261c') },
      },
    });

    const flap = new Mesh(geometry, paper);
    const shade = new Mesh(geometry, shadow);
    flap.position.z = paperZ + 0.001;
    shade.position.z = paperZ - 0.002;
    shade.renderOrder = -1;
    meshes.push(flap, shade);
    disposables.push(geometry, paper, shadow);
  }
  view.scene.add(...meshes);

  return {
    /** 0 = hoja plana (igual a la HTML), 1 = las dos solapas enrolladas fuera de la pantalla */
    setProgress: (progress: number) => {
      for (const curl of curls) curl.value = progress * end;
    },
    dispose: () => {
      view.scene.remove(...meshes);
      for (const item of disposables) item.dispose();
    },
  };
}

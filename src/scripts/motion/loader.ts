// Pantalla de carga (components/layout/Loader.astro), en cuatro tiempos:
//   1. Papel: ANTER sube letra por letra y la puntada se dibuja atravesándola.
//   2. Aterrizaje: las tijeras 3D (webgl/scissors.ts) caen girando desde cerca de la cámara y se asientan;
//      la sombra se cierra conforme bajan. Si la página aún no carga, esperan abriendo y cerrando despacio.
//   3. Corte: cada tijeretazo abre suave, cierra rápido y empuja hacia adelante. Detrás queda la rendija
//      (--cut y --gap en el CSS), que también parte las letras.
//   4. Salida: se levantan hacia la cámara y se van por arriba; la hoja HTML se cambia por dos solapas 3D
//      (webgl/paperFlaps.ts) que se enrollan desde el corte, y entra el hero.
// Sin WebGL, o si Three.js tarda más de THREE_WAIT, la rendija corre sola y las solapas se deslizan (CSS).
// El hero espera a que se abra: afterLoader().
import { gsap, motionAllowed } from './gsap';
import { lockScroll } from './smooth';
import type { LoaderScene } from '../webgl/loaderScene';
import type { Scissors, ScissorsState } from '../webgl/scissors';
import type { PaperFlaps } from '../webgl/paperFlaps';

const DONE = 'loader:done';
const MAX_WAIT = 4000;
const THREE_WAIT = 1800;
/** Inclinación de reposo hacia la cámara: el reflejo del acero cae en la parte clara del estudio */
const ROLL = -0.26;
/** Apertura de la rendija (px) en el extremo ya cortado */
const GAP = 3;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const pageLoaded = () =>
  document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));

/** Corre `start` cuando la pantalla de carga se abre (o enseguida, si no hay). */
export function afterLoader(start: () => void) {
  if (!document.querySelector('[data-loader]') || document.documentElement.dataset.loaded) start();
  else document.addEventListener(DONE, start, { once: true });
}

function announce() {
  document.documentElement.dataset.loaded = 'true';
  document.dispatchEvent(new Event(DONE));
}

interface Parts {
  loader: HTMLElement;
  seam: HTMLElement;
  halves: NodeListOf<HTMLElement>;
}

/** La parte 3D: escena, tijeras y (al final) las solapas, con un solo cuadro de dibujo. */
interface Studio {
  view: LoaderScene;
  scissors: Scissors;
  flaps: (loader: HTMLElement) => PaperFlaps;
}

/** Three.js se carga aquí; si llega tarde, se descarta. */
function loadStudio(stage: HTMLElement): Promise<Studio | null> {
  let late = false;
  const created = Promise.all([
    import('../webgl/loaderScene'),
    import('../webgl/scissors'),
    import('../webgl/paperFlaps'),
  ])
    .then(([{ createLoaderScene }, { createScissors }, { createPaperFlaps }]) => {
      const view = createLoaderScene(stage);
      const scissors = createScissors(view);
      if (late) {
        scissors.dispose();
        view.dispose();
        return null;
      }
      return { view, scissors, flaps: (loader: HTMLElement) => createPaperFlaps(view, loader, scissors.paperZ()) };
    })
    .catch((error) => {
      console.error('[loader] escena 3D no disponible', error);
      return null;
    });
  return Promise.race([
    created,
    wait(THREE_WAIT).then(() => {
      late = true;
      return null;
    }),
  ]);
}

const setCut = (loader: HTMLElement, reach: number) => {
  loader.style.setProperty('--cut', `${reach}px`);
  loader.style.setProperty('--gap', reach > 0 ? `${GAP}px` : '0px');
};

/** Respaldo sin 3D: la hoja se abre en dos solapas HTML que se levantan un poco, como papel. */
function slideOpen({ loader, seam, halves }: Parts, onDone: () => void) {
  announce();
  lockScroll(false);
  setCut(loader, window.innerWidth);
  loader.classList.add('is-opening');
  const [top, bottom] = halves;
  gsap
    .timeline({ onComplete: onDone })
    .to(seam, { opacity: 0, duration: 0.3, ease: 'power1.out' }, 0)
    .to(top, { yPercent: -100, rotationX: 9, duration: 1.25, ease: 'power4.inOut' }, 0)
    .to(bottom, { yPercent: 100, rotationX: -9, duration: 1.25, ease: 'power4.inOut' }, 0);
}

/** Tiempos 2 a 4 con la escena 3D. Llama a onDone cuando las solapas ya salieron. */
function perform({ view, scissors, flaps }: Studio, parts: Parts, ready: Promise<unknown>, onDone: () => void) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const tip = scissors.tip();
  const landing = Math.max(width * 0.16, scissors.length() * 0.5); // en móvil, que no queden cortadas
  // Caen desde cerca de la cámara, abiertas y giradas
  const state: ScissorsState = { x: landing, y: -height * 0.1, lift: 1.5, spin: -1.15, open: 0.9, roll: -1, yaw: 0.6 };
  let reach = 0;
  let sheet: PaperFlaps | null = null;

  const frame = () => {
    scissors.draw(state);
    if (!sheet) {
      // El corte llega hasta donde se cruzan las hojas: junto al perno si están abiertas, en la punta si cierran
      if (state.lift < 0.04) reach = Math.max(reach, state.x + tip * (1 - state.open * 0.8));
      setCut(parts.loader, reach);
    }
    view.render();
  };
  gsap.ticker.add(frame);

  // La hoja HTML se cambia por las solapas 3D en el mismo cuadro (son idénticas en plano) y se enrollan
  const rollOpen = () => {
    announce();
    lockScroll(false);
    sheet = flaps(parts.loader);
    sheet.setProgress(0);
    frame();
    for (const half of parts.halves) half.style.visibility = 'hidden';
    parts.seam.style.visibility = 'hidden';

    const roll = { progress: 0, shadow: 1 };
    gsap
      .timeline({
        onComplete: () => {
          gsap.ticker.remove(frame);
          sheet?.dispose();
          onDone();
        },
      })
      .to(roll, { shadow: 0, duration: 0.35, ease: 'power1.out', onUpdate: () => scissors.setShadow(roll.shadow) }, 0)
      .to(roll, { progress: 1, duration: 1.45, ease: 'power2.inOut', onUpdate: () => sheet?.setProgress(roll.progress) }, 0);
  };

  const tl = gsap.timeline({ delay: 0.15 });

  // Tiempo 2: aterrizaje
  tl.to(state, { lift: 0, y: 0, spin: 0, roll: ROLL, yaw: 0.1, duration: 0.9, ease: 'power3.out' }, 0);
  tl.to(state, { open: 0.2, duration: 0.8, ease: 'power2.inOut' }, 0);

  // Si la página no está lista, esperan abriendo y cerrando despacio
  tl.call(() => {
    tl.pause();
    const idle = gsap.to(state, { open: 0.45, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    ready.then(() => {
      idle.kill();
      tl.resume();
    });
  });

  // Tiempo 3: el corte, en tijeretazos hasta que la punta sale por la derecha
  const end = width - tip * 0.95;
  const steps = width < 700 ? 3 : 4;
  for (let i = 1; i <= steps; i++) {
    tl.to(state, { open: 1, x: `-=${width * 0.006}`, yaw: 0.17, duration: 0.16, ease: 'power2.out' }, i > 1 ? '-=0.09' : '+=0.05');
    tl.to(state, { open: 0, duration: 0.11, ease: 'power3.in' });
    tl.to(state, { x: landing + ((end - landing) * i) / steps, yaw: 0.05, duration: 0.22, ease: 'power3.out' }, '<0.04');
  }

  // Tiempo 4: se levantan y se van por arriba; la hoja empieza a enrollarse mientras salen
  tl.to(
    state,
    { lift: 1.9, x: width * 1.04, y: -height * 0.6, spin: 0.6, roll: -1.1, yaw: -0.5, open: 0.55, duration: 0.8, ease: 'power2.in' },
    '+=0.06',
  );
  tl.call(rollOpen, [], '<0.18');
}

export async function initLoader(loader: HTMLElement) {
  if (!motionAllowed()) {
    loader.remove();
    announce();
    return;
  }

  loader.style.animation = 'none'; // ya corre el script: se cancela el respaldo CSS
  lockScroll(true);

  const parts: Parts = {
    loader,
    seam: loader.querySelector<HTMLElement>('[data-loader-seam]')!,
    halves: loader.querySelectorAll<HTMLElement>('[data-loader-half]'),
  };
  const stitch = loader.querySelector<HTMLElement>('[data-loader-stitch]')!;
  const letters = loader.querySelectorAll<SVGPathElement>('[data-loader-letter]');
  const perHalf = letters.length / 2;

  const ready = Promise.race([Promise.all([pageLoaded(), document.fonts.ready]), wait(MAX_WAIT)]);
  const studioReady = loadStudio(loader.querySelector<HTMLElement>('[data-loader-stage]')!);

  // Tiempo 1: la palabra (sus dos mitades suben juntas) y la puntada que la atraviesa
  gsap.fromTo(
    letters,
    { yPercent: 45, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: (i) => (i % perHalf) * 0.07 },
  );
  gsap.fromTo(stitch, { scaleX: 0 }, { scaleX: 1, duration: 1, delay: 0.15, ease: 'power2.inOut' });

  const studio = await studioReady;
  const finish = () => {
    if (studio) {
      studio.scissors.dispose();
      studio.view.dispose();
    }
    loader.remove();
  };

  if (studio) {
    perform(studio, parts, ready, finish);
    return;
  }

  // Sin 3D: la rendija corre sola por la puntada
  await Promise.all([ready, wait(1100)]);
  const cut = { reach: 0 };
  await gsap.to(cut, {
    reach: window.innerWidth,
    duration: 0.9,
    ease: 'power2.inOut',
    onUpdate: () => setCut(loader, cut.reach),
  });
  slideOpen(parts, finish);
}

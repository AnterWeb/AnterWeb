// Pantalla de carga (components/layout/Loader.astro), en tres tiempos:
//   1. Entrada: el clip del cuaderno (blanco y negro) se destapa de abajo hacia arriba, como las fotos del sitio,
//      y ANTER sube letra por letra debajo.
//   2. Espera: el cuaderno se hojea al menos una vuelta (MIN_TIME) y hasta que la página cargó (máximo MAX_WAIT).
//   3. Relevo: el clip vuela al lugar de la foto en blanco y negro del hero (la misma escena) mientras el fondo
//      se desvanece y entra el hero; al llegar, se funde en esa foto.
// El hero espera a que empiece el relevo: afterLoader().
import { gsap, motionAllowed } from './gsap';
import { lockScroll } from './smooth';

const DONE = 'loader:done';
/** Una vuelta del clip del cuaderno */
const MIN_TIME = 1800;
const MAX_WAIT = 4000;

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

/** La foto del hero donde aterriza el clip, si está a la vista. */
function landingSpot() {
  const photo = document.querySelector<HTMLElement>('.hero__photo--workshop');
  const box = photo?.getBoundingClientRect();
  return photo && box && box.width > 0 && box.bottom > 0 && box.top < window.innerHeight ? { photo, box } : null;
}

export async function initLoader(loader: HTMLElement) {
  if (!motionAllowed()) {
    loader.remove();
    announce();
    return;
  }

  loader.style.animation = 'none'; // ya corre el script: se cancela el respaldo CSS
  lockScroll(true);

  const panel = loader.querySelector<HTMLElement>('[data-loader-panel]')!;
  const film = loader.querySelector<HTMLElement>('[data-loader-film]')!;
  const video = film.querySelector('video')!;
  const letters = loader.querySelectorAll<SVGPathElement>('[data-loader-letter]');
  video.play().catch(() => {}); // si el navegador no deja, queda el póster

  // Tiempo 1: entrada
  const entrance = gsap
    .timeline()
    .to(film, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power4.inOut' }, 0)
    .fromTo(video, { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0)
    .fromTo(
      letters,
      { yPercent: 45, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, stagger: 0.07, ease: 'power3.out' },
      0.35,
    );

  // Tiempo 2: espera (también a que termine la entrada, por si el dispositivo va lento)
  await Promise.all([
    entrance,
    wait(MIN_TIME),
    Promise.race([Promise.all([pageLoaded(), document.fonts.ready]), wait(MAX_WAIT)]),
  ]);

  // Tiempo 3: relevo. El clip pasa a fixed en su lugar actual para poder volar sin depender del centrado.
  const from = film.getBoundingClientRect();
  const spacer = document.createElement('div'); // ocupa su lugar para que el wordmark no salte
  Object.assign(spacer.style, { width: `${from.width}px`, height: `${from.height}px` });
  film.before(spacer);
  Object.assign(film.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
  });

  const spot = landingSpot();
  // La foto destino ya se ve completa debajo del clip: así, al fundirse, no hay un destape a medias
  if (spot) gsap.set(spot.photo, { clipPath: 'inset(0% 0 0 0)' });

  const tl = gsap.timeline({
    onComplete: () => {
      video.pause();
      loader.remove();
    },
  });
  tl.to(letters, { yPercent: -30, opacity: 0, duration: 0.45, stagger: 0.03, ease: 'power2.in', overwrite: true }, 0);
  tl.to(panel, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0.2);
  tl.call(
    () => {
      announce();
      lockScroll(false);
    },
    [],
    0.2,
  );

  if (spot) {
    const { box } = spot;
    tl.to(film, { left: box.left, top: box.top, width: box.width, height: box.height, duration: 1.15, ease: 'power3.inOut' }, 0.1);
    tl.to(film, { opacity: 0, duration: 0.45, ease: 'power1.out' }, '>-0.05');
  } else {
    tl.to(film, { scale: 0.9, opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 0.1);
  }
}

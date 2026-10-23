// Hero (y 404): entrada y parallax por atributos.
//   data-photo   → se destapa con clip-path y su img hace zoom out
//   data-drift   → parallax yPercent al hacer scroll (puede envolver foto + pie)
//   data-letter  → letras del wordmark (span o path de SVG) suben con stagger
//   data-intro   → textos que entran al final
// En la landing, la entrada espera a que se abra la pantalla de carga (loader.ts).
import { gsap, MOTION_OK } from './gsap';
import { afterLoader } from './loader';

export function initHero(hero: HTMLElement) {
  const mm = gsap.matchMedia();

  mm.add(MOTION_OK, () => {
    const photos = hero.querySelectorAll<HTMLElement>('[data-photo]');
    const letters = hero.querySelectorAll<Element>('[data-letter]');
    const drifters = hero.querySelectorAll<HTMLElement>('[data-drift]');
    const intro = hero.querySelectorAll<HTMLElement>('[data-intro]');
    const wordmark = hero.querySelector<HTMLElement>('[data-wordmark]');

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    tl.to(photos, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, stagger: 0.12, ease: 'power4.inOut' })
      .fromTo(
        hero.querySelectorAll('[data-photo] img'),
        { scale: 1.18 },
        { scale: 1, duration: 1.8, stagger: 0.12, ease: 'power2.out' },
        '<',
      )
      // yPercent funciona igual en spans y en paths de SVG
      .fromTo(letters, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 1.2, stagger: 0.07 }, '-=1.1')
      .fromTo(
        intro,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power2.out' },
        '-=0.8',
      );
    afterLoader(() => tl.play());

    const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };

    drifters.forEach((el) => {
      gsap.to(el, { yPercent: Number(el.dataset.drift) * 100, ease: 'none', scrollTrigger: scrub });
    });

    if (wordmark) {
      gsap.to(wordmark, { yPercent: 18, opacity: 0.35, ease: 'none', scrollTrigger: scrub });
    }
  });
}

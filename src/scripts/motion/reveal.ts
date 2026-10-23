// Animaciones de scroll declaradas por atributos (estados iniciales en global.css).
//   data-reveal              → fade + subida al entrar en viewport
//   data-reveal-delay="0.2"  → retraso opcional en segundos
//   data-clip                → la imagen (o el video) se destapa de abajo hacia arriba, atada al scroll
//   data-parallax="-0.15"    → desplazamiento relativo (yPercent) mientras cruza el viewport
//   data-words               → cada .word pasa de tenue a sólida conforme avanzas
import { gsap, ScrollTrigger, MOTION_OK } from './gsap';

export function initReveals() {
  gsap.matchMedia().add(MOTION_OK, () => {
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        batch.forEach((el, i) => {
          const delay = Number((el as HTMLElement).dataset.revealDelay ?? 0) + i * 0.08;
          gsap.to(el, { opacity: 1, y: 0, duration: 1.1, delay, ease: 'power2.out' });
        }),
    });

    gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((el) => {
      const scrub = { trigger: el, start: 'top 92%', end: 'top 45%', scrub: 0.6 };
      gsap.to(el, { clipPath: 'inset(0% 0 0 0)', ease: 'none', scrollTrigger: scrub });
      const media = el.querySelector('img, video');
      if (media) gsap.fromTo(media, { scale: 1.22 }, { scale: 1, ease: 'none', scrollTrigger: scrub });
    });

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: 0 },
        {
          yPercent: Number(el.dataset.parallax) * 100,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
      gsap.to(el.querySelectorAll('.word'), {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    });
  });
}

// Clips del footer: se reproducen en loop solo mientras se ven y se pausan al salir de pantalla.
// Con reduced motion no se reproducen: queda el póster (el primer cuadro).
import { motionAllowed } from './gsap';

export function initFilms(root: HTMLElement) {
  if (!motionAllowed()) return;
  const videos = root.querySelectorAll<HTMLVideoElement>('video[data-film]');

  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting) video.play().catch(() => {});
        else video.pause();
      }),
    { rootMargin: '120px 0px' },
  );

  videos.forEach((video) => observer.observe(video));
}

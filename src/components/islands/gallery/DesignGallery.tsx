// Galería agrupada: Diseños (boceto de la clienta: Novias, Fiesta) y Piezas disponibles (la colección a la venta).
// Cada grupo es una tira horizontal; al hacer clic la foto vuela al lightbox (Flip), que recorre todas las fotos en orden.
// variant="shop": tarjetas que llenan la fila, con colores, precio y tallas (ver PieceOptions).
import { useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GalleryRow from './GalleryRow';
import Lightbox from './Lightbox';
import { captureCard, type FlipOrigin } from './transitions';
import type { GalleryGroup, GallerySlide } from './types';
import './gallery.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  groups: GalleryGroup[];
  variant?: 'shop';
}

export default function DesignGallery({ groups, variant }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const origin = useRef<FlipOrigin | null>(null);

  const slides = useMemo<GallerySlide[]>(
    () =>
      groups
        .flatMap((group) => group.items)
        .flatMap((item, itemIndex) => item.photos.map((photo, photoIndex) => ({ item, photo, itemIndex, photoIndex }))),
    [groups],
  );

  const cardFor = (id: string) => root.current?.querySelector<HTMLElement>(`[data-flip-id="${id}"]`) ?? null;

  const openAt = (id: string, photoIndex: number) => {
    origin.current = captureCard(cardFor(id));
    setOpen(slides.findIndex((slide) => slide.item.id === id && slide.photoIndex === photoIndex));
  };

  // Entrada: las tarjetas de cada fila suben en cascada al entrar en pantalla.
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.gallery__group', root.current).forEach((group) => {
          gsap.fromTo(
            group.querySelectorAll('.gallery__item, .gallery__group-head'),
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.07,
              ease: 'power2.out',
              scrollTrigger: { trigger: group, start: 'top 82%', once: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={variant ? `gallery gallery--${variant}` : 'gallery'}>
      {groups.map((group) => (
        <GalleryRow key={group.id} group={group} onOpen={openAt} />
      ))}

      {open !== null && (
        <Lightbox
          slides={slides}
          index={open}
          origin={origin.current}
          cardFor={cardFor}
          onClose={() => setOpen(null)}
          onNavigate={setOpen}
        />
      )}
    </div>
  );
}

// Clips del taller que cierran la página, alrededor del wordmark del footer. Los mandó la clienta (2026-10-23).
// Son loops MP4 sin audio en public/video/ y sus pósters en src/assets/video/ (ver docs/content/portfolio.md).
import type { ImageMetadata } from 'astro';
import cuadernoPoster from '../assets/video/cuaderno-poster.jpg';
import bocetoPoster from '../assets/video/boceto-poster.jpg';

export interface Film {
  id: string;
  src: string;
  poster: ImageMetadata;
  orientation: 'portrait' | 'landscape';
  /** desplazamiento del parallax (yPercent), como las fotos del collage */
  parallax: string;
  /** en blanco y negro, como la única foto B/N del hero */
  monochrome?: boolean;
  /** texto vertical en terracota junto al clip */
  note?: string;
}

// En orden de lectura: el boceto a la izquierda, el cuaderno a la derecha (también en móvil)
export const films: Film[] = [
  { id: 'boceto', src: '/video/boceto.mp4', poster: bocetoPoster, orientation: 'landscape', parallax: '-0.22' },
  {
    id: 'cuaderno',
    src: '/video/cuaderno.mp4',
    poster: cuadernoPoster,
    orientation: 'portrait',
    parallax: '-0.1',
    monochrome: true,
    note: 'est. 2024',
  },
];

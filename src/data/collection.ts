// Piezas disponibles: la colección a la venta, con precio y tallas por opción (color o prenda).
// Precios y tallas: los mandó la clienta (2026-10-23), en MXN. La galería, el lightbox y llms.txt leen de aquí.
// Cuando se venda una talla, agrégala a `soldOut` de su opción: la tarjeta la muestra tachada con "Sold out".
// Si se agotan todas sus tallas, la opción entera se ve "Sold out". No se publican cantidades por talla.

export const collectionTitle = 'Colección Otoño/Invierno 2026';

export const sizes = ['CH', 'M', 'G', 'EG'] as const;
export type Size = (typeof sizes)[number];

export interface CollectionOption {
  /** Lo que se elige en la tarjeta: un color ("Negro") o una prenda del conjunto ("Pantalón negro") */
  label: string;
  /** Nombre completo de la prenda cuando no es "modelo + color" (las prendas del conjunto) */
  name?: string;
  /** Color de la muestra, tomado de la foto */
  swatch: string;
  /** ids de `photos` (work.ts); la primera es la portada de la opción */
  photos: string[];
  /** object-position de la foto para esta opción (el conjunto comparte foto: el pantalón encuadra abajo) */
  focus?: string;
  price: number;
  sizes: Size[];
  soldOut?: Size[];
}

export interface CollectionPiece {
  id: string;
  title: string;
  options: CollectionOption[];
}

export const collection: CollectionPiece[] = [
  {
    id: 'vestido-halter',
    title: 'Vestido halter',
    options: [
      {
        label: 'Negro',
        swatch: '#1f1d1b',
        photos: ['disponible-negro-frente', 'disponible-negro-espalda'],
        price: 1500,
        sizes: ['CH', 'M', 'G'],
      },
      {
        label: 'Ivory',
        swatch: '#e2d3b3',
        photos: ['disponible-ivory-frente', 'disponible-ivory-espalda'],
        price: 900,
        sizes: ['CH', 'M', 'G'],
      },
    ],
  },
  {
    id: 'vestido-cuello-caido',
    title: 'Vestido cuello caído',
    options: [
      {
        label: 'Verde olivo',
        swatch: '#7f7a5c',
        photos: ['disponible-verde-frente', 'disponible-verde-espalda'],
        price: 1800,
        sizes: ['CH', 'M', 'G'],
      },
      {
        label: 'Café',
        swatch: '#7a4b2c',
        photos: ['disponible-cafe-frente', 'disponible-cafe-espalda'],
        price: 1800,
        sizes: ['CH', 'M', 'G'],
      },
    ],
  },
  {
    id: 'top-strapless',
    title: 'Top strapless',
    options: [
      { label: 'Café', swatch: '#3b2219', photos: ['disponible-top-cafe'], price: 300, sizes: ['CH', 'M', 'G'], soldOut: ['CH'] },
      { label: 'Blanco', swatch: '#f3f1ec', photos: ['disponible-top-blanco'], price: 300, sizes: ['CH', 'M', 'G'] },
    ],
  },
  {
    id: 'blusa-encaje',
    title: 'Blusa con encaje',
    options: [
      { label: 'Negra', swatch: '#1b1716', photos: ['disponible-blusa-negra'], price: 450, sizes: ['CH', 'M', 'G'] },
      { label: 'Café', swatch: '#5b2d21', photos: ['disponible-blusa-cafe'], price: 450, sizes: ['CH', 'M', 'G'], soldOut: ['CH'] },
    ],
  },
  {
    id: 'blusa-pantalon',
    title: 'Blusa de un hombro y pantalón',
    options: [
      {
        label: 'Blusa lila',
        name: 'Blusa de un hombro lila',
        swatch: '#c8aecb',
        photos: ['disponible-blusa-lila'],
        focus: '50% 20%',
        price: 500,
        sizes: ['CH', 'M', 'G', 'EG'],
      },
      {
        label: 'Pantalón negro',
        name: 'Pantalón negro',
        swatch: '#232321',
        photos: ['disponible-blusa-lila'],
        focus: '50% 100%',
        price: 800,
        sizes: ['CH', 'M', 'G', 'EG'],
      },
    ],
  },
];

/** Nombre de la prenda tal como se vende: "Vestido halter negro", "Blusa de un hombro lila". Lo usan el JSON-LD y llms.txt. */
export const productName = (piece: CollectionPiece, option: CollectionOption) =>
  option.name ?? `${piece.title} ${option.label.toLowerCase()}`;

/** La opción no tiene ninguna talla disponible. */
export const isSoldOut = (option: CollectionOption) => option.sizes.every((size) => option.soldOut?.includes(size));

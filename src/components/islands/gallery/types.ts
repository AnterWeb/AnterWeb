/** Foto serializable para la isla: ya optimizada en el servidor. */
export interface GalleryPhoto {
  alt: string;
  focus?: string;
  src: string;
  srcSet: string;
  full: string;
  width: number;
  height: number;
}

/** Una opción de una prenda a la venta (color o prenda del conjunto), ya lista para pintar. */
export interface GalleryOption {
  label: string;
  swatch: string;
  /** índices de `photos` de la pieza; el primero es la portada de la opción */
  photos: number[];
  /** encuadre de cada foto en esta opción (índice de `photos` → object-position) */
  focus: Record<number, string>;
  /** precio con formato ("$1,500") */
  price: string;
  sizes: { size: string; soldOut: boolean }[];
  /** todas sus tallas se vendieron */
  soldOut: boolean;
}

/** Una pieza (un vestido o una prenda a la venta) con todas sus fotos. */
export interface GalleryItem {
  id: string;
  title: string;
  /** nombre del grupo; lo muestra el lightbox */
  groupLabel: string;
  photos: GalleryPhoto[];
  /** solo las prendas a la venta: colores o prendas a elegir, con precio y tallas */
  options?: GalleryOption[];
}

/** Un grupo de la galería (Novias, Fiesta, la colección…) con sus piezas en orden. */
export interface GalleryGroup {
  id: string;
  label: string;
  items: GalleryItem[];
}

/** Una diapositiva del lightbox: cada foto de cada pieza, en orden. */
export interface GallerySlide {
  item: GalleryItem;
  photo: GalleryPhoto;
  /** posición de la pieza en toda la galería */
  itemIndex: number;
  /** posición de la foto dentro de la pieza */
  photoIndex: number;
}

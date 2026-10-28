// Solo servidor: lo importan las secciones .astro para preparar los datos de la isla.
// Arma los grupos de Diseños (portafolio) y el de Piezas disponibles (la colección a la venta)
// con las fotos ya optimizadas. El contenido sale del panel (data/cms.ts).
import { getImage } from 'astro:assets';
import { getCollection, getDesigns, isSoldOut, type CmsPhoto } from '../../../data/cms';
import { mxn } from '../../../data/format';
import type { GalleryGroup, GalleryItem, GalleryPhoto } from './types';

const toPhoto = async (photo: CmsPhoto): Promise<GalleryPhoto> => {
  const thumb = await getImage({ src: photo.image, widths: [400, 700], format: 'webp' });
  const full = await getImage({ src: photo.image, width: 1600, format: 'webp' });
  return {
    alt: photo.alt,
    focus: photo.focus,
    src: thumb.src,
    srcSet: thumb.srcSet.attribute,
    full: full.src,
    width: photo.image.width,
    height: photo.image.height,
  };
};

/** Diseños: un grupo por categoría (Novias, Fiesta). */
export const designGroups = async (): Promise<GalleryGroup[]> =>
  Promise.all(
    (await getDesigns()).map(async (row) => ({
      id: row.id,
      label: row.label,
      items: await Promise.all(
        row.pieces.map(async (piece) => ({
          id: piece.id,
          title: piece.title,
          groupLabel: row.label,
          photos: await Promise.all(piece.photos.map(toPhoto)),
        })),
      ),
    })),
  );

/**
 * Piezas disponibles: la colección en un solo grupo. Si dos opciones comparten foto (un conjunto),
 * se carga una vez y cada opción la encuadra a su manera (el pantalón, abajo).
 */
export const collectionGroup = async (): Promise<GalleryGroup> => {
  const { title, pieces } = await getCollection();
  return {
    id: 'coleccion',
    label: title,
    items: await Promise.all(
      pieces.map(async (piece): Promise<GalleryItem> => {
        const unique = [...new Map(piece.options.flatMap((option) => option.photos).map((p) => [p.image.src, p])).values()];
        const index = (photo: CmsPhoto) => unique.findIndex((p) => p.image.src === photo.image.src);
        return {
          id: piece.id,
          title: piece.title,
          groupLabel: title,
          photos: await Promise.all(unique.map(toPhoto)),
          options: piece.options.map((option) => ({
            label: option.label,
            swatch: option.swatch,
            photos: option.photos.map(index),
            focus: Object.fromEntries(option.photos.map((photo) => [index(photo), photo.focus])),
            price: mxn(option.price),
            sizes: option.sizes.map((size) => ({ size, soldOut: option.soldOut.includes(size) })),
            soldOut: isSoldOut(option),
          })),
        };
      }),
    ),
  };
};

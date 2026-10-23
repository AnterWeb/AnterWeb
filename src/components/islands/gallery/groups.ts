// Solo servidor: lo importan las secciones .astro para preparar los datos de la isla.
// Arma los grupos de Diseños (portafolio) y el de Piezas disponibles (la colección a la venta)
// con las fotos ya optimizadas.
import { getImage } from 'astro:assets';
import { byId, categories, pieces } from '../../../data/work';
import { collection, collectionTitle, isSoldOut } from '../../../data/collection';
import { mxn } from '../../../data/format';
import type { GalleryGroup, GalleryItem, GalleryPhoto } from './types';

const toPhoto = async (id: string): Promise<GalleryPhoto> => {
  const photo = byId(id);
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
export const designGroups = (): Promise<GalleryGroup[]> =>
  Promise.all(
    categories.map(async (category) => ({
      id: category.id,
      label: category.label,
      items: await Promise.all(
        pieces
          .filter((piece) => piece.category === category.id)
          .map(async (piece) => ({
            id: piece.id,
            title: piece.title,
            groupLabel: category.label,
            photos: await Promise.all(piece.photos.map(toPhoto)),
          })),
      ),
    })),
  );

/** Piezas disponibles: la colección en un solo grupo. Si dos opciones comparten foto, se carga una vez. */
export const collectionGroup = async (): Promise<GalleryGroup> => ({
  id: 'coleccion',
  label: collectionTitle,
  items: await Promise.all(
    collection.map(async (piece): Promise<GalleryItem> => {
      const ids = [...new Set(piece.options.flatMap((option) => option.photos))];
      return {
        id: piece.id,
        title: piece.title,
        groupLabel: collectionTitle,
        photos: await Promise.all(ids.map(toPhoto)),
        options: piece.options.map((option) => ({
          label: option.label,
          swatch: option.swatch,
          photos: option.photos.map((id) => ids.indexOf(id)),
          focus: option.focus,
          price: mxn(option.price),
          sizes: option.sizes.map((size) => ({ size, soldOut: option.soldOut?.includes(size) ?? false })),
          soldOut: isSoldOut(option),
        })),
      };
    }),
  ),
});

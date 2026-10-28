// Solo servidor: el contenido que la clienta edita en el panel (keystatic.config.tsx → src/content/*.json),
// ya listo para la página. Las rutas de foto se cambian por la imagen importada (astro:assets, se optimiza
// igual que siempre) y los encuadres por object-position. Lo leen las secciones, el SEO y llms.txt.
// Las fotos fijas del sitio (hero, Esencia, menú, 404) no son editables: siguen en work.ts.
import type { ImageMetadata } from 'astro';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig, { FRAMING } from '../../keystatic.config';
import { SIZES, type Size } from '../cms/fields';

const reader = createReader(process.cwd(), keystaticConfig);
const assets = import.meta.glob<ImageMetadata>('/src/assets/cms/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

export interface CmsPhoto {
  image: ImageMetadata;
  alt: string;
  /** object-position */
  focus: string;
}

interface StoredPhoto {
  imagen: string | null;
  descripcion: string;
  encuadre: keyof typeof FRAMING;
}

function photo({ imagen, descripcion, encuadre }: StoredPhoto): CmsPhoto {
  const image = imagen ? assets[imagen] : undefined;
  if (!image) throw new Error(`Foto del panel no encontrada: ${imagen}`);
  return { image, alt: descripcion, focus: FRAMING[encuadre] ?? FRAMING.centro };
}

async function read<K extends keyof typeof reader.singletons>(key: K) {
  const data = await reader.singletons[key].read();
  if (!data) throw new Error(`Falta el contenido del panel: src/content/${key}.json`);
  return data;
}

const slug = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// ---------- Colección a la venta ----------

export interface CollectionOption {
  /** Color o prenda del conjunto ("Negro", "Pantalón negro") */
  label: string;
  /** Nombre de venta si no es "modelo + color" */
  name?: string;
  swatch: string;
  photos: CmsPhoto[];
  price: number;
  /** Tallas que se hacen, en orden */
  sizes: Size[];
  soldOut: Size[];
}

export interface CollectionPiece {
  id: string;
  title: string;
  options: CollectionOption[];
}

export async function getCollection() {
  const data = await read('coleccion');
  const pieces: CollectionPiece[] = data.prendas.map((prenda, i) => ({
    id: `${slug(prenda.modelo)}-${i + 1}`,
    title: prenda.modelo,
    options: prenda.opciones.map((opcion) => {
      const sizes = SIZES.filter((size) => opcion.tallas[size]);
      return {
        label: opcion.color,
        name: opcion.nombre || undefined,
        swatch: opcion.muestra,
        photos: opcion.fotos.map(photo),
        price: opcion.precio ?? 0,
        sizes,
        soldOut: sizes.filter((size) => opcion.tallas[size] === 'agotada'),
      };
    }),
  }));
  return { title: `Colección ${data.temporada}`, season: data.temporada, intro: data.intro, pieces };
}

/** La opción no tiene ninguna talla disponible. */
export const isSoldOut = (option: CollectionOption) => option.sizes.every((size) => option.soldOut.includes(size));

/** Nombre de la prenda tal como se vende: "Vestido halter negro", "Blusa de un hombro lila". */
export const productName = (piece: CollectionPiece, option: CollectionOption) =>
  option.name ?? `${piece.title} ${option.label.toLowerCase()}`;

// ---------- Diseños (portafolio) ----------

export interface DesignPiece {
  id: string;
  title: string;
  photos: CmsPhoto[];
}

export async function getDesigns() {
  const data = await read('disenos');
  const row = (id: 'novias' | 'fiesta', label: string) => ({
    id,
    label,
    pieces: data[id].map((pieza, i): DesignPiece => ({
      id: `${id}-${i + 1}-${slug(pieza.nombre)}`,
      title: pieza.nombre,
      photos: pieza.fotos.map(photo),
    })),
  });
  return [row('novias', 'Novias'), row('fiesta', 'Fiesta')];
}

// ---------- Proceso ----------

export async function getProcess() {
  const data = await read('proceso');
  return {
    title: data.titulo,
    steps: data.pasos.map((paso) => ({ title: paso.titulo, body: paso.texto, photo: photo(paso.foto) })),
  };
}

// ---------- Servicios y hoja de precios ----------

/** La hoja de precios: la lista HTML, la textura WebGL del flyer y llms.txt la leen igual */
export interface PriceSheet {
  title: string;
  groups: { group: string; items: { label: string; price: number }[] }[];
  express: number;
  note: string;
}

export async function getServices() {
  const data = await read('servicios');
  const sheet: PriceSheet = {
    title: data.hoja.titulo,
    groups: data.hoja.grupos.map((grupo) => ({
      group: grupo.nombre,
      items: grupo.precios.map((precio) => ({ label: precio.concepto, price: precio.precio ?? 0 })),
    })),
    express: data.hoja.express ?? 0,
    note: data.hoja.nota,
  };
  return { services: data.servicios.map((servicio) => ({ title: servicio.titulo, body: servicio.texto })), sheet };
}

// ---------- Textos sueltos ----------

export const getTexts = () => read('textos');

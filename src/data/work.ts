// Fotos fijas del sitio: hero, collage de Esencia, previews del menú y 404. No se editan en el panel.
// Lo editable (Diseños, la colección y Proceso) vive en el panel: keystatic.config.tsx → src/content/ (data/cms.ts).
import type { ImageMetadata } from 'astro';

import noviaSalon from '../assets/work/novia-salon.jpg';
import noviaDetalle from '../assets/work/novia-detalle-flores.jpg';
import nocheNegro from '../assets/work/noche-negro-rosa.jpg';
import nocheAzul from '../assets/work/noche-azul-rey.jpg';
import tallerTerracota from '../assets/work/taller-terracota.jpg';
import verdeFrente from '../assets/work/disponible-verde-frente.jpg';
import procesoManos from '../assets/work/proceso-manos.jpg';
import procesoMaquina from '../assets/work/proceso-maquina.jpg';
import procesoMesa from '../assets/work/proceso-mesa.jpg';
import procesoRetrato from '../assets/work/proceso-retrato.jpg';
import procesoCorte from '../assets/work/proceso-corte.jpg';
import procesoPruebaTela from '../assets/work/proceso-prueba-tela.jpg';
import atelierBocetoBn from '../assets/work/atelier-boceto-bn.jpg';

export interface Photo {
  id: string;
  image: ImageMetadata;
  alt: string;
  /** object-position para encuadrar la prenda */
  focus?: string;
}

export const photos: Photo[] = [
  {
    id: 'novia-salon',
    image: noviaSalon,
    alt: 'Novia con vestido blanco de escote barco y cola, sosteniendo alcatraces junto a un ventanal',
  },
  {
    id: 'novia-detalle',
    image: noviaDetalle,
    alt: 'Detalle de flores blancas aplicadas sobre un vestido drapeado',
  },
  {
    id: 'noche-negro',
    image: nocheNegro,
    alt: 'Vestido largo negro strapless con una rosa de satín rosa en la cintura',
  },
  {
    id: 'taller-terracota',
    image: tallerTerracota,
    alt: 'Vestido de satín color terracota de un hombro sobre maniquí en el taller',
  },
  {
    id: 'noche-azul',
    image: nocheAzul,
    alt: 'Vestido largo azul rey con hombros caídos frente a un arreglo floral',
  },
  {
    id: 'disponible-verde-frente',
    image: verdeFrente,
    alt: 'Vestido midi de satín verde olivo con cuello caído, de frente',
  },
  {
    id: 'proceso-manos',
    image: procesoManos,
    alt: 'Manos drapeando satín rosa sobre un maniquí en el taller',
    focus: '55% 50%',
  },
  {
    id: 'proceso-maquina',
    image: procesoMaquina,
    alt: 'Aguja de una máquina de coser sobre tela rosa, con un carrete de hilo del mismo tono',
  },
  {
    id: 'proceso-mesa',
    image: procesoMesa,
    alt: 'Máquina de coser industrial con tela rosa sobre la mesa del taller',
  },
  {
    id: 'proceso-retrato',
    image: procesoRetrato,
    alt: 'La diseñadora de Anter House, con cinta métrica al cuello, trabaja en la mesa del taller',
  },
  {
    id: 'proceso-corte',
    image: procesoCorte,
    alt: 'Manos marcando una tela fucsia junto a unas tijeras sobre la mesa de corte',
    focus: '58% 50%',
  },
  {
    id: 'proceso-prueba-tela',
    image: procesoPruebaTela,
    alt: 'La diseñadora sonríe mientras prueba una tela fucsia sobre un maniquí',
  },
  {
    id: 'atelier-boceto-bn',
    image: atelierBocetoBn,
    alt: 'Foto en blanco y negro de la diseñadora inclinada sobre la mesa, dibujando un boceto',
  },
];

export const byId = (id: string) => {
  const photo = photos.find((p) => p.id === id);
  if (!photo) throw new Error(`Foto no encontrada: ${id}`);
  return photo;
};

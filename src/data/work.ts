// Portafolio: fotos sueltas y las piezas (prendas) que agrupan esas fotos.
// Una pieza = un vestido real; si tiene varias fotos, la galería las muestra en una sola tarjeta.
import type { ImageMetadata } from 'astro';

import noviaSalon from '../assets/work/novia-salon.jpg';
import noviaTerraza from '../assets/work/novia-terraza.jpg';
import noviaAlcatraces from '../assets/work/novia-alcatraces.jpg';
import noviaEspejo from '../assets/work/novia-espejo.jpg';
import noviaDetalle from '../assets/work/novia-detalle-flores.jpg';
import nocheNegro from '../assets/work/noche-negro-rosa.jpg';
import nocheAzul from '../assets/work/noche-azul-rey.jpg';
import nocheCoral from '../assets/work/noche-coral-lazo.jpg';
import nocheFucsia from '../assets/work/noche-fucsia-flores.jpg';
import tallerTerracota from '../assets/work/taller-terracota.jpg';
import tallerChampagne from '../assets/work/taller-champagne.jpg';
import noviaEspalda from '../assets/work/novia-espalda.jpg';
import lilaFrente from '../assets/work/fiesta-lila-frente.jpg';
import lilaCapa from '../assets/work/fiesta-lila-capa.jpg';
import lilaVuelo from '../assets/work/fiesta-lila-vuelo.jpg';
import fucsiaOlan from '../assets/work/fiesta-fucsia-olan.jpg';
import fucsiaOlanPose from '../assets/work/fiesta-fucsia-olan-pose.jpg';
import fucsiaOlanEntrada from '../assets/work/fiesta-fucsia-olan-entrada.jpg';
import ivoryFrente from '../assets/work/disponible-ivory-frente.jpg';
import ivoryEspalda from '../assets/work/disponible-ivory-espalda.jpg';
import negroFrente from '../assets/work/disponible-negro-frente.jpg';
import negroEspalda from '../assets/work/disponible-negro-espalda.jpg';
import verdeFrente from '../assets/work/disponible-verde-frente.jpg';
import verdeEspalda from '../assets/work/disponible-verde-espalda.jpg';
import cafeFrente from '../assets/work/disponible-cafe-frente.jpg';
import cafeEspalda from '../assets/work/disponible-cafe-espalda.jpg';
import topCafe from '../assets/work/disponible-top-cafe.jpg';
import topBlanco from '../assets/work/disponible-top-blanco.jpg';
import blusaNegra from '../assets/work/disponible-blusa-negra.jpg';
import blusaCafe from '../assets/work/disponible-blusa-cafe.jpg';
import blusaLila from '../assets/work/disponible-blusa-lila.jpg';
import procesoManos from '../assets/work/proceso-manos.jpg';
import procesoMaquina from '../assets/work/proceso-maquina.jpg';
import procesoMesa from '../assets/work/proceso-mesa.jpg';
import procesoRetrato from '../assets/work/proceso-retrato.jpg';
import procesoCorte from '../assets/work/proceso-corte.jpg';
import procesoPruebaTela from '../assets/work/proceso-prueba-tela.jpg';
import procesoBoceto from '../assets/work/proceso-boceto.jpg';
import procesoPatron from '../assets/work/proceso-patron.jpg';
import procesoPrueba from '../assets/work/proceso-prueba.jpg';
import procesoCostura from '../assets/work/proceso-costura.jpg';
import negroTaller from '../assets/work/noche-negro-taller.jpg';
import negroTallerBn from '../assets/work/noche-negro-taller-bn.jpg';
import atelierBocetoBn from '../assets/work/atelier-boceto-bn.jpg';

// Grupos de Diseños (boceto de la clienta), en el orden en que se muestran.
// Las prendas a la venta (Piezas disponibles) viven en collection.ts.
export type Category = 'novias' | 'fiesta';

export const categories: { id: Category; label: string }[] = [
  { id: 'novias', label: 'Novias' },
  { id: 'fiesta', label: 'Fiesta' },
];

export interface Photo {
  id: string;
  image: ImageMetadata;
  alt: string;
  /** object-position para encuadrar la prenda */
  focus?: string;
}

export interface Piece {
  id: string;
  title: string;
  category: Category;
  /** ids de `photos`; la primera es la portada de la tarjeta */
  photos: string[];
}

export const photos: Photo[] = [
  {
    id: 'novia-salon',
    image: noviaSalon,
    alt: 'Novia con vestido blanco de escote barco y cola, sosteniendo alcatraces junto a un ventanal',
  },
  {
    id: 'novia-alcatraces',
    image: noviaAlcatraces,
    alt: 'Detalle de vestido de novia con cintura plisada y ramo de alcatraces',
  },
  {
    id: 'novia-terraza',
    image: noviaTerraza,
    alt: 'Mujer con vestido blanco midi drapeado caminando por una terraza con columnas',
  },
  {
    id: 'novia-espejo',
    image: noviaEspejo,
    alt: 'Vestido blanco de satín con flores en la cintura y cola lateral, reflejado en un espejo',
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
    id: 'taller-champagne',
    image: tallerChampagne,
    alt: 'Vestido champagne asimétrico con drapeado lateral sobre maniquí',
  },
  {
    id: 'noche-fucsia',
    image: nocheFucsia,
    alt: 'Vestido largo fucsia con flores tridimensionales del mismo tono',
    focus: '72% 40%',
  },
  {
    id: 'noche-coral',
    image: nocheCoral,
    alt: 'Vestido largo coral de shantung con gran lazo en la cintura',
    focus: '30% 50%',
  },
  {
    id: 'novia-espalda',
    image: noviaEspalda,
    alt: 'Novia de espaldas junto a un balcón, con velo largo y moño en la espalda del vestido',
  },
  {
    id: 'fiesta-lila-frente',
    image: lilaFrente,
    alt: 'Mujer con vestido largo de satín lila de un hombro y abertura, caminando en un jardín entre edificios',
  },
  {
    id: 'fiesta-lila-capa',
    image: lilaCapa,
    alt: 'Vestido lila de un hombro con capa de gasa morada levantada al viento',
  },
  {
    id: 'fiesta-lila-vuelo',
    image: lilaVuelo,
    alt: 'Vestido lila de satín con la capa morada en movimiento, de cuerpo completo',
  },
  {
    id: 'fiesta-fucsia-olan',
    image: fucsiaOlan,
    alt: 'Vestido largo fucsia strapless con olán lateral y abertura, frente a un arreglo de flores blancas',
  },
  {
    id: 'fiesta-fucsia-olan-pose',
    image: fucsiaOlanPose,
    alt: 'Vestido fucsia de escote escultórico y abertura al frente, en un salón con velas',
  },
  {
    id: 'fiesta-fucsia-olan-entrada',
    image: fucsiaOlanEntrada,
    alt: 'Mujer con vestido fucsia del brazo de un señor de traje, entrando a un salón lleno de invitados',
    focus: '60% 50%',
  },
  {
    id: 'disponible-ivory-frente',
    image: ivoryFrente,
    alt: 'Vestido largo de satín ivory con cuello halter, de frente',
  },
  {
    id: 'disponible-ivory-espalda',
    image: ivoryEspalda,
    alt: 'Vestido largo de satín ivory con la espalda descubierta',
  },
  {
    id: 'disponible-negro-frente',
    image: negroFrente,
    alt: 'Vestido largo de satín negro con cuello halter, de frente',
  },
  {
    id: 'disponible-negro-espalda',
    image: negroEspalda,
    alt: 'Vestido largo de satín negro con la espalda descubierta',
  },
  {
    id: 'disponible-verde-frente',
    image: verdeFrente,
    alt: 'Vestido midi de satín verde olivo con cuello caído, de frente',
  },
  {
    id: 'disponible-verde-espalda',
    image: verdeEspalda,
    alt: 'Vestido midi de satín verde olivo, de espaldas',
  },
  {
    id: 'disponible-cafe-frente',
    image: cafeFrente,
    alt: 'Vestido midi de satín café con cuello caído y fruncido en la cadera, de frente',
  },
  {
    id: 'disponible-cafe-espalda',
    image: cafeEspalda,
    alt: 'Vestido midi de satín café, de espaldas',
  },
  {
    id: 'disponible-top-cafe',
    image: topCafe,
    alt: 'Top strapless café oscuro con jeans acampanados',
  },
  {
    id: 'disponible-top-blanco',
    image: topBlanco,
    alt: 'Top strapless blanco con jeans acampanados',
  },
  {
    id: 'disponible-blusa-negra',
    image: blusaNegra,
    alt: 'Blusa negra de satín con cuello caído y orilla asimétrica de encaje, con jeans',
  },
  {
    id: 'disponible-blusa-cafe',
    image: blusaCafe,
    alt: 'Blusa café de satín con cuello caído y orilla asimétrica de encaje, con jeans',
  },
  {
    id: 'disponible-blusa-lila',
    image: blusaLila,
    alt: 'Blusa lila de satín de un hombro con pantalón negro de satín',
  },
  // Sesión del taller (hero). No son piezas: no van en la galería.
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
  // Photoshoot profesional del taller (Pixieset). Sin tomas donde se lea el letrero de la pared.
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
    id: 'proceso-boceto',
    image: procesoBoceto,
    alt: 'Mano dibujando el boceto de un vestido en un cuaderno',
    focus: '40% 50%',
  },
  {
    id: 'proceso-patron',
    image: procesoPatron,
    alt: 'Patrón de papel con anotaciones, cinta métrica y lápiz',
  },
  {
    id: 'proceso-prueba',
    image: procesoPrueba,
    alt: 'La diseñadora ajusta un vestido negro strapless con una rosa de satín sobre un maniquí',
  },
  {
    id: 'proceso-costura',
    image: procesoCostura,
    alt: 'Máquina de coser industrial con hilo rosa y unas tijeras sobre la mesa',
  },
  {
    id: 'noche-negro-taller',
    image: negroTaller,
    alt: 'La diseñadora sonríe mientras ajusta el vestido negro strapless con rosa de satín sobre un maniquí',
  },
  {
    id: 'noche-negro-taller-bn',
    image: negroTallerBn,
    alt: 'Foto en blanco y negro de la diseñadora junto al vestido negro strapless con rosa, en el maniquí',
  },
  // Foto en blanco y negro del hero (photoshoot del taller).
  {
    id: 'atelier-boceto-bn',
    image: atelierBocetoBn,
    alt: 'Foto en blanco y negro de la diseñadora inclinada sobre la mesa, dibujando un boceto',
  },
];

// Novias: la clienta pidió títulos cortos (sin descripción) y una sola tarjeta por vestido.
export const pieces: Piece[] = [
  { id: 'novia', title: 'Vestido de novia', category: 'novias', photos: ['novia-salon', 'novia-alcatraces', 'novia-espalda'] },
  { id: 'despedida', title: 'Despedida', category: 'novias', photos: ['novia-terraza', 'novia-espejo', 'novia-detalle'] },
  { id: 'lila', title: 'Lila con capa', category: 'fiesta', photos: ['fiesta-lila-frente', 'fiesta-lila-capa', 'fiesta-lila-vuelo'] },
  { id: 'fucsia-olan', title: 'Fucsia strapless con olán', category: 'fiesta', photos: ['fiesta-fucsia-olan', 'fiesta-fucsia-olan-pose', 'fiesta-fucsia-olan-entrada'] },
  {
    id: 'negro',
    title: 'Strapless negro con rosa',
    category: 'fiesta',
    photos: ['noche-negro-taller', 'noche-negro', 'noche-negro-taller-bn'],
  },
  { id: 'terracota', title: 'Satín terracota, un hombro', category: 'fiesta', photos: ['taller-terracota'] },
  { id: 'azul', title: 'Azul rey, hombros caídos', category: 'fiesta', photos: ['noche-azul'] },
  { id: 'champagne', title: 'Champagne drapeado', category: 'fiesta', photos: ['taller-champagne'] },
  { id: 'fucsia', title: 'Fucsia con flores 3D', category: 'fiesta', photos: ['noche-fucsia'] },
  { id: 'coral', title: 'Shantung coral con lazo', category: 'fiesta', photos: ['noche-coral'] },
];

export const byId = (id: string) => {
  const photo = photos.find((p) => p.id === id);
  if (!photo) throw new Error(`Foto no encontrada: ${id}`);
  return photo;
};

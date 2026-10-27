// Servicios y lista de precios. Precios: flyer "Confección y ajustes" (docs/brand/refs/flyer-confeccion-ajustes.jpg).
// Textos de servicios: los dictó la clienta (2026-10-12; mamá y hermanas de novios pasaron a Vestidos a la medida
// el 2026-10-26). Precios en MXN. Actualizar aquí; la UI lee de este archivo.

export const services = [
  {
    n: '01',
    title: 'Vestidos a la medida',
    body: 'Mamá y hermanas de novios, fiesta y cocktail.',
  },
  {
    n: '02',
    title: 'Novias',
    body: 'Novias, despedidas y civiles.',
  },
  {
    n: '03',
    title: 'Ajustes',
    body: 'Bastillas, ajustes de talle, cambio de cierres y enmiendas.',
  },
];

/** Título de la hoja de precios (lista HTML y textura WebGL). */
export const priceListTitle = 'Servicios';

export const priceList = [
  {
    group: 'Bastillas',
    items: [
      { label: 'Pantalón y jeans', price: 160 },
      { label: 'Pantalón de vestir', price: 200 },
      { label: 'Pantalón de vestir forrado', price: 350 },
      { label: 'Vestido', price: 450 },
      { label: 'Vestido forrado', price: 600 },
    ],
  },
  {
    group: 'Ajustes',
    items: [
      { label: 'Ajustes de talle', price: 400 },
      { label: 'Cambio de cierre', price: 400 },
    ],
  },
];

export const expressSurcharge = 200;
export const priceNote = 'Precios sujetos a valoración de la prenda y trabajo requerido.';

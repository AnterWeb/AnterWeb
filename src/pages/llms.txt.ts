// llms.txt: resumen en texto plano para buscadores con IA (ChatGPT, Perplexity, Claude…).
// Se genera desde los mismos datos que la página para que precios y contacto nunca diverjan.
import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { expressSurcharge, priceList, priceNote, services } from '../data/services';
import { defaultDescription } from '../data/seo';
import { collection, collectionTitle, isSoldOut, productName, type CollectionOption } from '../data/collection';
import { mxn } from '../data/format';

const pesos = (value: number) => `${mxn(value)} MXN`;

/** Tallas que quedan de una opción de la colección. */
const available = (option: CollectionOption) =>
  isSoldOut(option) ? 'agotado' : `tallas ${option.sizes.filter((size) => !option.soldOut?.includes(size)).join(', ')}`;

export const GET: APIRoute = ({ site: siteUrl }) => {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${defaultDescription}`,
    '',
    '## Servicios',
    ...services.map((s) => `- ${s.title}: ${s.body}`),
    '',
    '## Precios de confección y ajustes',
    ...priceList.flatMap((group) => [
      `### ${group.group}`,
      ...group.items.map((item) => `- ${item.label}: ${pesos(item.price)}`),
    ]),
    `- Arreglo express: +${pesos(expressSurcharge)}`,
    '',
    `${priceNote}`,
    '',
    `## Piezas disponibles: ${collectionTitle}`,
    'Prendas terminadas a la venta. Para pedir una, escribe por WhatsApp.',
    ...collection.flatMap((piece) =>
      piece.options.map((option) => `- ${productName(piece, option)}: ${pesos(option.price)} (${available(option)})`),
    ),
    '',
    '## Contacto',
    `- Ubicación: ${site.area}, ${site.city}`,
    `- WhatsApp: ${site.whatsappDisplay} (${site.whatsappUrl.split('?')[0]})`,
    `- Instagram: ${site.instagramHandle} (${site.instagramUrl})`,
    '- Atención solo con cita previa.',
    '',
    `Sitio: ${new URL('/', siteUrl).href}`,
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

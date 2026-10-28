// SEO: textos por defecto y JSON-LD. Se construye con los mismos datos que la UI
// (site.ts y el contenido del panel, data/cms.ts) para que lo que ven buscadores y personas sea idéntico.
// Criterios: docs/seo.md (basado en las skills seo-audit, schema-markup y ai-seo).
import { site } from './site';
import { isSoldOut, productName, type CmsPhoto, type getCollection, type getServices } from './cms';

/** 50–60 caracteres, keyword primero, marca al final, sin guiones largos. */
export const defaultTitle = 'Vestidos a la medida y de novia en Monterrey | Anter House';

/** 150–160 caracteres con keyword y llamada a la acción. */
export const defaultDescription =
  'Taller de moda a la medida en Monterrey: vestidos de novia y de fiesta, colección Otoño/Invierno 2026 y ajustes desde $160 MXN. Agenda tu cita por WhatsApp.';

interface JsonLdData {
  imageUrl?: string;
  collection: Awaited<ReturnType<typeof getCollection>>;
  services: Awaited<ReturnType<typeof getServices>>;
  /** URL absoluta de una foto, para los productos */
  photoUrl: (photo: CmsPhoto) => string;
}

/**
 * Grafo JSON-LD: WebSite + negocio local con catálogo de servicios + la colección a la venta.
 * Sin datos inventados.
 */
export function buildJsonLd(siteUrl: URL, { imageUrl, collection, services: { services, sheet }, photoUrl }: JsonLdData) {
  const url = siteUrl.href;
  const id = (fragment: string) => `${url}#${fragment}`;

  // Cada opción de la colección (un color o una prenda del conjunto) es un producto con su precio y si hay tallas
  const products = collection.pieces.flatMap((piece) =>
    piece.options.map((option) => {
      const available = option.sizes.filter((size) => !option.soldOut.includes(size));
      return {
        '@type': 'Product',
        name: productName(piece, option),
        image: photoUrl(option.photos[0]),
        brand: { '@id': id('business') },
        ...(available.length > 0 && { size: available.join(', ') }),
        offers: {
          '@type': 'Offer',
          price: option.price,
          priceCurrency: 'MXN',
          availability: isSoldOut(option) ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          url: id('disponibles'),
          seller: { '@id': id('business') },
        },
      };
    }),
  );

  const priced = sheet.groups.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: `${group.group}: ${item.label}` },
      price: item.price,
      priceCurrency: 'MXN',
    })),
  );

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': id('website'),
        url,
        name: site.name,
        inLanguage: 'es-MX',
        publisher: { '@id': id('business') },
      },
      {
        // No existe un tipo "Dressmaker"; ClothingStore es el más cercano.
        '@type': 'ClothingStore',
        '@id': id('business'),
        name: site.name,
        alternateName: `${site.name} Bespoke Fashion`,
        description: defaultDescription,
        url,
        ...(imageUrl && { image: [imageUrl] }),
        telephone: '+52 81 1719 7371',
        sameAs: [site.instagramUrl],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Monterrey',
          addressRegion: 'Nuevo León',
          addressCountry: 'MX',
        },
        areaServed: { '@type': 'City', name: 'Monterrey' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Servicios',
          itemListElement: [
            ...services.map((service) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: service.title, description: service.body },
            })),
            ...priced,
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Arreglo express (cargo adicional)' },
              price: sheet.express,
              priceCurrency: 'MXN',
            },
          ],
        },
      },
      {
        '@type': 'ItemList',
        '@id': id('coleccion'),
        name: collection.title,
        itemListElement: products.map((item, index) => ({ '@type': 'ListItem', position: index + 1, item })),
      },
    ],
  };
}

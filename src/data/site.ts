// Datos de contacto de Anter House. Fuente: flyer "Confección y ajustes" (docs/brand/refs).
export const whatsappNumber = '528117197371';
const defaultMessage = 'Hola Anter House, me gustaría agendar una cita.';

/** Enlace wa.me con mensaje prellenado. Lo usan los botones y el formulario de contacto. */
export const whatsappLink = (message = defaultMessage) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

export const site = {
  name: 'Anter House',
  tagline: 'bespoke fashion',
  city: 'Monterrey, N.L.',
  area: 'Zona Costco Las Torres',
  whatsappDisplay: '81 1719 7371',
  whatsappUrl: whatsappLink(),
  instagramHandle: '@anter_house',
  instagramUrl: 'https://www.instagram.com/anter_house/',
};

/** Navegación principal. `preview` = id de la pieza (src/data/work.ts) que se muestra en el menú. */
export const nav = [
  { n: '01', label: 'Esencia', href: '#esencia', preview: 'novia-salon' },
  { n: '02', label: 'Diseños', href: '#disenos', preview: 'noche-negro' },
  { n: '03', label: 'Piezas disponibles', href: '#disponibles', preview: 'disponible-verde-frente' },
  { n: '04', label: 'Servicios', href: '#servicios', preview: 'taller-terracota' },
  { n: '05', label: 'Agenda tu cita', href: '#cita', preview: 'noche-azul' },
];

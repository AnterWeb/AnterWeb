// Panel de la clienta (Keystatic, en /keystatic): lo que cambia seguido en la página, sin tocar el diseño.
// Cada sección es un "singleton" que se guarda como JSON en src/content/ y sus fotos en src/assets/cms/<sección>/.
// El sitio lo lee en el build (src/data/cms.ts), así que guardar = un commit = Vercel publica en uno o dos minutos.
// Sin PUBLIC_KEYSTATIC_GITHUB_REPO guarda en los archivos locales (npm run dev); con ella, en ese repo de GitHub
// (el de la clienta, en producción; y en local para crear la GitHub App la primera vez). Ver docs/cms.md.
import { config, fields, singleton } from '@keystatic/core';
import { colorField, sizesField } from './src/cms/fields';
import { WORDMARK_HEIGHT, wordmarkGlyphs } from './src/data/wordmark';

const repo = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

/** Cómo se encuadra una foto en su tarjeta (object-position) */
export const FRAMING = {
  centro: '50% 50%',
  arriba: '50% 20%',
  abajo: '50% 100%',
  izquierda: '30% 50%',
  derecha: '70% 50%',
} as const;

const framing = fields.select({
  label: 'Encuadre en la tarjeta',
  description: 'Qué parte de la foto se ve cuando la tarjeta la recorta.',
  options: [
    { label: 'Centro', value: 'centro' },
    { label: 'Arriba', value: 'arriba' },
    { label: 'Abajo', value: 'abajo' },
    { label: 'Izquierda', value: 'izquierda' },
    { label: 'Derecha', value: 'derecha' },
  ],
  defaultValue: 'centro',
});

/** Una foto: la imagen, su descripción (para lectores de pantalla y Google) y su encuadre */
const photo = (section: string) =>
  fields.object({
    imagen: fields.image({
      label: 'Foto',
      directory: `src/assets/cms/${section}`,
      publicPath: `/src/assets/cms/${section}/`,
      validation: { isRequired: true },
    }),
    descripcion: fields.text({
      label: 'Qué se ve en la foto',
      description: 'No aparece en la página: lo leen los lectores de pantalla y Google.',
      validation: { length: { min: 1 } },
    }),
    encuadre: framing,
  });

const photos = (section: string, label = 'Fotos') =>
  fields.array(photo(section), {
    label,
    description: 'La primera es la portada. Arrastra para cambiar el orden.',
    itemLabel: (props) => props.fields.descripcion.value || 'Foto nueva',
    validation: { length: { min: 1 } },
  });

/** Una pieza de Diseños (un vestido): sus fotos se hojean en la misma tarjeta */
const designPiece = fields.object({
  nombre: fields.text({
    label: 'Nombre de la pieza',
    description: 'No aparece en la página (va sin descripción); sirve para ubicarla aquí y para lectores de pantalla.',
    validation: { length: { min: 1 } },
  }),
  fotos: photos('disenos'),
});

const designRow = (label: string) =>
  fields.array(designPiece, {
    label,
    description: 'Una tarjeta por vestido. Arrastra para cambiar el orden del carrusel.',
    itemLabel: (props) => {
      const count = props.fields.fotos.elements.length;
      return `${props.fields.nombre.value || 'Pieza nueva'} · ${count} ${count === 1 ? 'foto' : 'fotos'}`;
    },
  });

/** La A del logo, para la marca del panel */
function BrandMark() {
  const a = wordmarkGlyphs.find((glyph) => glyph.letter === 'A')!;
  return (
    <svg viewBox={`0 0 812 ${WORDMARK_HEIGHT}`} width="24" height="22" fill="currentColor" aria-hidden="true">
      <path d={a.d} />
    </svg>
  );
}

export default config({
  storage: repo ? { kind: 'github', repo } : { kind: 'local' },
  locale: 'es-ES',
  ui: {
    brand: { name: 'Anter House', mark: BrandMark },
    navigation: {
      Tienda: ['coleccion'],
      Portafolio: ['disenos'],
      Página: ['proceso', 'servicios', 'textos'],
    },
  },
  singletons: {
    coleccion: singleton({
      label: 'Colección a la venta',
      path: 'src/content/coleccion',
      format: { data: 'json' },
      schema: {
        temporada: fields.text({
          label: 'Temporada',
          description: 'Sale como "Colección …" arriba de las tarjetas y en la intro. Ejemplo: Otoño/Invierno 2026.',
          validation: { length: { min: 1 } },
        }),
        intro: fields.text({
          label: 'Texto de la intro',
          description: 'Va después de la temporada, junto al botón de WhatsApp.',
          multiline: true,
        }),
        prendas: fields.array(
          fields.object({
            modelo: fields.text({
              label: 'Modelo',
              description: 'El nombre de la tarjeta, sin el color. Ejemplo: Vestido halter.',
              validation: { length: { min: 1 } },
            }),
            opciones: fields.array(
              fields.object({
                color: fields.text({
                  label: 'Color',
                  description: 'Ejemplo: Negro, Ivory, Verde olivo. En un conjunto, la prenda: Pantalón negro.',
                  validation: { length: { min: 1 } },
                }),
                muestra: colorField({ label: 'Muestra', description: 'El círculo que se toca en la tarjeta para ver este color.' }),
                precio: fields.integer({ label: 'Precio (MXN)', validation: { isRequired: true, min: 0 } }),
                tallas: sizesField({ label: 'Tallas' }),
                fotos: photos('coleccion', 'Fotos de este color'),
                nombre: fields.text({
                  label: 'Nombre completo (opcional)',
                  description: 'Solo si no es "modelo + color", como las prendas de un conjunto. Lo usa Google.',
                }),
              }),
              {
                label: 'Colores',
                description: 'Cada color con sus fotos, precio y tallas. El primero con tallas es el que abre la tarjeta.',
                itemLabel: (props) => {
                  const sizes = props.fields.tallas.value;
                  const sold = Object.entries(sizes).filter(([, state]) => state === 'agotada').map(([size]) => size);
                  const all = Object.keys(sizes).length > 0 && sold.length === Object.keys(sizes).length;
                  const status = all ? ' · sold out' : sold.length ? ` · sold out ${sold.join(', ')}` : '';
                  return `${props.fields.color.value || 'Color nuevo'} · $${(props.fields.precio.value ?? 0).toLocaleString('es-MX')}${status}`;
                },
                validation: { length: { min: 1 } },
              },
            ),
          }),
          {
            label: 'Prendas',
            description: 'Una tarjeta por modelo. Arrastra para cambiar el orden.',
            itemLabel: (props) => {
              const colors = props.fields.opciones.elements.map((option) => option.fields.color.value).filter(Boolean);
              return `${props.fields.modelo.value || 'Prenda nueva'}${colors.length ? ` · ${colors.join(', ')}` : ''}`;
            },
          },
        ),
      },
    }),

    disenos: singleton({
      label: 'Diseños',
      path: 'src/content/disenos',
      format: { data: 'json' },
      schema: {
        novias: designRow('Novias'),
        fiesta: designRow('Fiesta'),
      },
    }),

    proceso: singleton({
      label: 'Proceso',
      path: 'src/content/proceso',
      format: { data: 'json' },
      schema: {
        titulo: fields.text({ label: 'Título', validation: { length: { min: 1 } } }),
        pasos: fields.array(
          fields.object({
            titulo: fields.text({ label: 'Paso', validation: { length: { min: 1 } } }),
            texto: fields.text({ label: 'Texto', multiline: true }),
            foto: photo('proceso'),
          }),
          { label: 'Pasos', itemLabel: (props) => props.fields.titulo.value || 'Paso nuevo' },
        ),
      },
    }),

    servicios: singleton({
      label: 'Servicios y precios',
      path: 'src/content/servicios',
      format: { data: 'json' },
      schema: {
        servicios: fields.array(
          fields.object({
            titulo: fields.text({ label: 'Servicio', validation: { length: { min: 1 } } }),
            texto: fields.text({ label: 'Texto', multiline: true }),
          }),
          { label: 'Servicios', itemLabel: (props) => props.fields.titulo.value || 'Servicio nuevo' },
        ),
        hoja: fields.object(
          {
            titulo: fields.text({ label: 'Título de la hoja', validation: { length: { min: 1 } } }),
            grupos: fields.array(
              fields.object({
                nombre: fields.text({ label: 'Grupo', validation: { length: { min: 1 } } }),
                precios: fields.array(
                  fields.object({
                    concepto: fields.text({ label: 'Concepto', validation: { length: { min: 1 } } }),
                    precio: fields.integer({ label: 'Precio (MXN)', validation: { isRequired: true, min: 0 } }),
                  }),
                  {
                    label: 'Precios',
                    itemLabel: (props) =>
                      `${props.fields.concepto.value || 'Concepto nuevo'} · $${(props.fields.precio.value ?? 0).toLocaleString('es-MX')}`,
                  },
                ),
              }),
              { label: 'Grupos de precios', itemLabel: (props) => props.fields.nombre.value || 'Grupo nuevo' },
            ),
            express: fields.integer({ label: 'Arreglo express: cargo adicional (MXN)', validation: { isRequired: true, min: 0 } }),
            nota: fields.text({ label: 'Nota al pie de la hoja' }),
          },
          { label: 'Hoja de precios (el flyer con la chinche)' },
        ),
      },
    }),

    textos: singleton({
      label: 'Textos de la página',
      path: 'src/content/textos',
      format: { data: 'json' },
      schema: {
        esencia: fields.object(
          {
            manifiesto: fields.text({ label: 'Manifiesto', description: 'El texto grande con la capital.', multiline: true }),
            entrada: fields.text({ label: 'Entrada del cuerpo', description: 'Las primeras palabras en mayúsculas. Ejemplo: Proceso personalizado:' }),
            cuerpo: fields.text({ label: 'Cuerpo', multiline: true }),
            cita: fields.text({ label: 'Cita destacada', multiline: true }),
            firma: fields.text({ label: 'Firma de la cita' }),
          },
          { label: 'Esencia' },
        ),
        disponibles: fields.object(
          { titulo: fields.text({ label: 'Título', description: 'Arriba de la colección. Ejemplo: Listas para estrenar.' }) },
          { label: 'Piezas disponibles' },
        ),
        cita: fields.object(
          {
            titulo: fields.text({ label: 'Título' }),
            intro: fields.text({ label: 'Texto', multiline: true }),
          },
          { label: 'Agenda tu cita' },
        ),
      },
    }),
  },
});

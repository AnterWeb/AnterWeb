# Landing (`src/pages/index.astro`)

Todo sobre fondo salvia continuo. Al entrar, la pantalla de carga (`layout/Loader.astro`): unas tijeras 3D cortan una hoja de papel de patrón con ANTER impreso y la hoja se enrolla descubriendo el hero (ver `docs/experience/motion.md` y `docs/experience/webgl.md`). Orden:

| # | Sección | Archivo | Qué hace |
|---|---|---|---|
| — | Hero | `sections/Hero.astro` | Collage de 4 fotos de la sesión del taller (manos drapeando satín, aguja de la máquina, la diseñadora bocetando en blanco y negro, mesa de costura), texto vertical "Hecho a tu medida, puntada a puntada.", "est. 2024" bajo la foto principal, índice numerado (lee `nav`) y wordmark SVG `ANTER / HOUSE / bespoke fashion` |
| 01 | Nuestra esencia | `sections/Essence.astro` | Página de revista: manifiesto con capital que se ilumina con el scroll, cuerpo a dos columnas, cita destacada y collage de 3 fotos de la diseñadora en el taller, sin pies de foto (la clienta los quitó y pidió agrandar las dos fotos chicas) |
| — | Proceso | `sections/Process.astro` | Cuatro pasos (Diseño, Patrón, Prueba, Costura) con foto del photoshoot, en columnas escalonadas con índice numerado. Datos en `data/process.ts`. Continúa a Esencia, así que no lleva número en el ticker ni entrada en el menú |
| 02 | Diseños | `sections/Designs.astro` + isla `gallery/` | Grupos según el boceto de la clienta (Novias, Fiesta): título + tira horizontal por grupo, una tarjeta por vestido (sus fotos se hojean con el mouse); lightbox con todas las fotos |
| 03 | Piezas disponibles | `sections/Available.astro` + isla `gallery/` | La colección Otoño/Invierno 2026 en un solo grupo, con la misma galería de Diseños. Cada tarjeta es un modelo con sus colores (muestras que cambian las fotos), precio y tallas; las tallas vendidas dicen "Sold out". Intro de la clienta y botón "Preguntar" a WhatsApp debajo. Datos en `data/collection.ts` |
| 04 | Servicios | `sections/Services.astro` | Solo la etiqueta "Servicios" (sin título), filas de índice sin fotos y el flyer de precios en WebGL titulado "Servicios" |
| 05 | Agenda tu cita | `sections/Appointment.astro` | Compacta y sin fotos: encabezado, "No dudes en contactarnos. Tu próxima cita está a tan solo un clic.", botón "Agenda por WhatsApp", directorio y contacto directo a la izquierda; formulario tipo Typeform que abre WhatsApp a la derecha |
| — | Footer | `layout/Footer.astro` | Enlaces y contacto, y el wordmark gigante que se arma con el scroll, con dos clips del taller alrededor (gramática del hero: escalas distintas, uno en blanco y negro, "est. 2024" vertical). Datos en `data/films.ts` |

## Copy

Toda la copy es un **borrador** que hay que validar con la clienta:

- Manifiesto y cuerpo de Esencia.
- Los tres textos de servicios (`data/services.ts`): ya los dictó la clienta (2026-10-12).
- Títulos de las piezas de Fiesta (`data/work.ts`); los de Novias los dio la clienta.
- Piezas disponibles: la intro, los precios y las tallas son de la clienta (2026-10-23). Siguen en borrador el título "Listas para estrenar." y los nombres de los modelos sin color ("Vestido halter", "Vestido cuello caído", "Top strapless", "Blusa con encaje", "Blusa de un hombro y pantalón").
- Proceso: Diseño, Patrón y Prueba son textos de la clienta (2026-10-23); siguen en borrador el título "Así nace cada pieza." y Costura.
- Cita: la intro es de la clienta (2026-10-23); el título y los textos del formulario siguen en borrador.

## Ideas para siguientes iteraciones

- FAQ visible (tiempos de entrega, express, cómo agendar), que además sumaría `FAQPage` al schema (ver `docs/seo.md`).
- Página por pieza o por colección si el portafolio crece.

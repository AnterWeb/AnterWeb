# Anter House — Guía del proyecto

Portafolio web de **Anter House, bespoke fashion**: taller de moda a la medida en Monterrey (novias, vestidos de fiesta, confección y ajustes) con una colección de prendas a la venta. Proyecto de Flouvia para la clienta.

Este archivo es el **índice**. `CLAUDE.md` es un symlink a este mismo archivo. Aquí solo van las reglas globales; cada área tiene su documento en `docs/`, que hay que leer antes de editarla.

## Inicio obligatorio

1. `git fetch` y `git status --short`: trae lo que haya en `main` y conserva cualquier trabajo local ajeno.
2. Abre el documento de `docs/` que corresponde a la tarea (tabla de abajo).
3. Verifica la fuente de verdad en código o datos antes de cambiar algo.
4. Al terminar, registra el cambio en [`docs/changelog.md`](./docs/changelog.md) y haz commit. El push a `main` publica la vista previa que ve la clienta: solo cuando lo pidan.

## Comandos

```bash
astro dev --port 4322 --background   # servidor local en segundo plano (4321 lo usa Flouvia)
astro dev stop | status | logs       # administrar el servidor en segundo plano
npm run build                        # build de producción → dist/
npm run preview                      # preview del build
npm run check                        # diagnóstico de tipos (Astro + TS)
npm run og                           # regenera la imagen para compartir (src/assets/og/portada.jpg)
SITE_URL=https://dominio.mx npm run build   # fuerza el dominio (en Vercel sale solo, ver Despliegue)
```

Runtime: Node `>=22.12.0` (ver `.nvmrc`).

## Despliegue

- Repo `Flouviamx/alter`. Un push a `main` despliega en Vercel; hoy la clienta ve `alter-psi-two.vercel.app`.
- El dominio de canonical, Open Graph, sitemap, robots y JSON-LD sale de `VERCEL_PROJECT_PRODUCTION_URL` (`astro.config.mjs`): cuando se conecte el dominio de la clienta como principal en Vercel, todo se ajusta sin tocar código. Nunca escribas el dominio a mano.
- Pendiente para la entrega (cuando compren el dominio): conectarlo en Vercel, alta en Search Console con el sitemap y perfil de Google Business. Ver [`docs/seo.md`](./docs/seo.md).

## Arquitectura en una mirada

| Capa | Decisión |
|---|---|
| Framework | Astro 7, salida estática |
| UI | Componentes `.astro`; React 19 solo en islas con estado real |
| Estilos | CSS a mano, scoped por componente, sobre los tokens de `src/styles/global.css` |
| Movimiento | GSAP 3: ScrollSmoother, ScrollTrigger y `useGSAP` |
| 3D | Three.js (r186) para el flyer de precios, cargado con `import()` |
| Tipografía | Italiana (display) + Jost (texto), self-hosted vía Fontsource |
| Imágenes | `astro:assets` (`<Image>` / `getImage`) desde `src/assets/` |
| Idioma | Solo español (`es-MX`) |

## Reglas globales

### Código

- **Código artesanal y estructurado.** Nada revuelto: cada pieza vive en su carpeta y tiene una sola responsabilidad. Ver [`docs/architecture/structure.md`](./docs/architecture/structure.md).
  - `components/layout/`: Loader, Header, Menu, SectionTicker, Footer.
  - `components/sections/`: una sección por archivo.
  - `components/blocks/`: piezas compuestas de una sección.
  - `components/ui/`: primitivas (`icons/` incluido).
  - `components/islands/<nombre>/`: islas React con sus subcomponentes, tipos y CSS.
  - `components/seo/`: el `<head>` de SEO.
- La lógica JS no vive en el markup: va en `src/scripts/` (`motion/`, `webgl/`), y el componente solo importa e inicializa.
- Contenido y datos en `src/data/`. La UI, el JSON-LD, la textura WebGL y `llms.txt` leen de ahí. Nunca hardcodees teléfonos, precios, piezas ni el dominio.
- Reutiliza primitivas existentes antes de crear variantes. Mantén los cambios enfocados.

### Marca y experiencia

- **La referencia es el hero:** estilo editorial de moda / collage *broken grid*. Fotos sueltas a distintas escalas, display fino de alto contraste, acentos verticales en terracota e índices numerados con líneas finas. Ver [`docs/brand/identity.md`](./docs/brand/identity.md).
- **Fondo hueso continuo** (`--fondo`, pedido de la clienta, 2026-10-26). No dividas secciones por color. Las fotos y el flyer son "objetos" sobre esa superficie. El salvia es el color del logo: queda como acento en el menú y el lightbox, nunca como fondo de página.
- **Escala contenida.** El único texto gigante es el wordmark (`ANTER`, `404`). Los títulos usan `--text-title`.
- Etiquetas de sección en Italiana terracota (`SectionHeading`). No uses el patrón `03 —— S E R V I C I O S` ni pies de foto `Fig. n` (la clienta los quitó).
- El wordmark `ANTER` siempre va en mayúsculas con tracking amplio. Terracota es solo acento.
- Todo movimiento respeta `prefers-reduced-motion` y el patrón anti-parpadeo. Ver [`docs/experience/motion.md`](./docs/experience/motion.md).
- El movimiento debe sentirse elegante: amortiguado y sutil, nunca exagerado.
- Las fotos son de clientas reales: alt descriptivo y recortes que respeten la prenda.
- **No repitas fotos fuera de la galería**: cada sección usa fotos distintas (ver `docs/content/portfolio.md`).
- **Una pieza = un vestido.** Fotos del mismo vestido van juntas en una sola tarjeta de la galería, nunca como piezas separadas. En la colección a la venta, una tarjeta = un modelo con sus colores.
- **Colección:** nunca se publican cantidades por talla, solo si hay o no. Cuando la clienta avise que algo se vendió, la talla va al `soldOut` de su opción en `src/data/collection.ts`.
- Fotos y videos sueltos no se "pegan": se integran con la gramática del hero (escalas distintas, texto vertical terracota, a lo más uno en blanco y negro). Los clips van como loops MP4 sin audio que solo corren en pantalla.
- **3D y WebGL a la vara de la chinche del flyer:** materiales físicos, reflejos de estudio, sombra real y coreografía en tiempos (nunca un desplazamiento lineal). Solo si alimentan el concepto del taller (papel, corte, tela); nunca adorno.
- Todo se valida en móvil (375 y 360 px): sin scroll horizontal ni texto fuera de pantalla.

## Directorio de documentación

| Dominio | Documento |
|---|---|
| Logo, paleta, tipografía, estilo editorial y tono | [`docs/brand/identity.md`](./docs/brand/identity.md) |
| Stack, carpetas y convenciones de código | [`docs/architecture/structure.md`](./docs/architecture/structure.md) |
| GSAP: ScrollSmoother, reveals, galería, ticker, pantalla de carga | [`docs/experience/motion.md`](./docs/experience/motion.md) |
| WebGL: flyer con chinche (Three.js) y satín de la galería | [`docs/experience/webgl.md`](./docs/experience/webgl.md) |
| Navegación: header flotante, menú y ticker | [`docs/experience/navigation.md`](./docs/experience/navigation.md) |
| Formulario de contacto tipo Typeform → WhatsApp | [`docs/experience/contact-form.md`](./docs/experience/contact-form.md) |
| Landing: secciones, orden y copy | [`docs/pages/home.md`](./docs/pages/home.md) |
| Página 404 | [`docs/pages/not-found.md`](./docs/pages/not-found.md) |
| SEO: meta, imagen para compartir, JSON-LD, robots, sitemap, llms.txt | [`docs/seo.md`](./docs/seo.md) |
| Portafolio, fotos, colección a la venta, clips, precios y contacto | [`docs/content/portfolio.md`](./docs/content/portfolio.md) |
| Historial de cambios y pendientes | [`docs/changelog.md`](./docs/changelog.md) |

Las imágenes de referencia de la clienta (logo, flyer, moodboard, boceto) están en [`docs/brand/refs/`](./docs/brand/refs/).

## Fuentes de verdad

| Tema | Fuente |
|---|---|
| Dominio de producción | `astro.config.mjs`: `VERCEL_PROJECT_PRODUCTION_URL` (o `SITE_URL` para forzarlo) |
| Tokens de color, tipografía y reset | `src/styles/global.css` |
| Wordmark ANTER (trazos del logo original) | `src/data/wordmark.ts` → `ui/Wordmark.astro` |
| Contacto y navegación | `src/data/site.ts` |
| Fotos, piezas (vestidos) y categorías | `src/data/work.ts` |
| Colección a la venta: colores, precios, tallas y sold out | `src/data/collection.ts` |
| Clips del footer | `src/data/films.ts` (MP4 en `public/video/`) |
| Pasos de la sección Proceso | `src/data/process.ts` |
| Servicios y precios | `src/data/services.ts` |
| Preguntas del formulario de contacto | `src/data/contactForm.ts` |
| Title, description y JSON-LD | `src/data/seo.ts` |
| Imagen para compartir | `scripts/og-image.mjs` → `src/assets/og/portada.jpg` (`npm run og`) |
| Pantalla de carga | `src/components/layout/Loader.astro` y `src/scripts/motion/loader.ts` (el clip del cuaderno de `src/data/films.ts`) |
| Plugins GSAP y condición de movimiento | `src/scripts/motion/gsap.ts` |

## Validación mínima

- Cambios de UI: revisar desktop (1440) y móvil (390), y con reduced motion activado.
- Cambios de datos, rutas o SEO: `npm run check` y `npm run build`; revisar `dist/robots.txt`, `dist/sitemap.xml` y el JSON-LD.
- Cambios de WebGL: verificar el fallback HTML (sin WebGL) y que el canvas no recorte la hoja.
- Pantalla de carga: capturar la secuencia cuadro por cuadro en desktop y móvil (el clip debe aterrizar sobre la foto B/N del hero) y probar reduced motion (no debe aparecer).
- Colección: elegir cada color en la tarjeta (fotos, precio y tallas) y revisar `dist/llms.txt` y los `Product` del JSON-LD.
- Después de un push con cambios de SEO: en el sitio publicado, el canonical apunta al dominio real y el `og:image` responde 200.
- Cualquier cambio: `git diff --check` y revisar el diff final.

## Documentación de Astro

Documentación completa: https://docs.astro.build. Guías útiles: [rutas](https://docs.astro.build/en/guides/routing/), [componentes](https://docs.astro.build/en/basics/astro-components/), [frameworks](https://docs.astro.build/en/guides/framework-components/) y [estilos](https://docs.astro.build/en/guides/styling/).

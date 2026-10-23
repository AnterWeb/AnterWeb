# Anter House — Guía del proyecto

Portafolio web de **Anter House, bespoke fashion**: taller de moda a la medida en Monterrey (novias, vestidos de noche, confección y ajustes). Proyecto de Flouvia para la clienta.

Este archivo es el **índice**. `CLAUDE.md` es un symlink a este mismo archivo. Aquí solo van las reglas globales; cada área tiene su documento en `docs/`, que hay que leer antes de editarla.

## Inicio obligatorio

1. Ejecuta `git status --short` y conserva cualquier trabajo local ajeno.
2. Abre el documento de `docs/` que corresponde a la tarea (tabla de abajo).
3. Verifica la fuente de verdad en código o datos antes de cambiar algo.
4. Al terminar, registra el cambio en [`docs/changelog.md`](./docs/changelog.md).

## Comandos

```bash
astro dev --port 4322 --background   # servidor local en segundo plano (4321 lo usa Flouvia)
astro dev stop | status | logs       # administrar el servidor en segundo plano
npm run build                        # build de producción → dist/
npm run preview                      # preview del build
npm run check                        # diagnóstico de tipos (Astro + TS)
SITE_URL=https://dominio.mx npm run build   # build con el dominio real
```

Runtime: Node `>=22.12.0` (ver `.nvmrc`).

## Arquitectura en una mirada

| Capa | Decisión |
|---|---|
| Framework | Astro 7, salida estática |
| UI | Componentes `.astro`; React 19 solo en islas con estado real |
| Estilos | CSS a mano, scoped por componente, sobre los tokens de `src/styles/global.css` |
| Movimiento | GSAP 3: ScrollSmoother, ScrollTrigger y `useGSAP` |
| 3D | Three.js (r186) para la pantalla de carga (tijeras y solapas de papel) y el flyer de precios, cargado con `import()` |
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
- **Fondo salvia continuo.** No dividas secciones por color. Las fotos y el flyer son "objetos" sobre esa superficie.
- **Escala contenida.** El único texto gigante es el wordmark (`ANTER`, `404`). Los títulos usan `--text-title`.
- Etiquetas de sección en Italiana terracota (`SectionHeading`). No uses el patrón `03 —— S E R V I C I O S`.
- El wordmark `ANTER` siempre va en mayúsculas con tracking amplio. Terracota es solo acento.
- Todo movimiento respeta `prefers-reduced-motion` y el patrón anti-parpadeo. Ver [`docs/experience/motion.md`](./docs/experience/motion.md).
- El movimiento debe sentirse elegante: amortiguado y sutil, nunca exagerado.
- Las fotos son de clientas reales: alt descriptivo y recortes que respeten la prenda.
- **No repitas fotos fuera de la galería**: cada sección usa fotos distintas (ver `docs/content/portfolio.md`).
- **Una pieza = un vestido.** Fotos del mismo vestido van juntas en una sola tarjeta de la galería, nunca como piezas separadas.
- Todo se valida en móvil (375 y 360 px): sin scroll horizontal ni texto fuera de pantalla.

## Directorio de documentación

| Dominio | Documento |
|---|---|
| Logo, paleta, tipografía, estilo editorial y tono | [`docs/brand/identity.md`](./docs/brand/identity.md) |
| Stack, carpetas y convenciones de código | [`docs/architecture/structure.md`](./docs/architecture/structure.md) |
| GSAP: ScrollSmoother, reveals, galería, ticker | [`docs/experience/motion.md`](./docs/experience/motion.md) |
| Three.js: pantalla de carga (tijeras y solapas) y flyer con chinche | [`docs/experience/webgl.md`](./docs/experience/webgl.md) |
| Navegación: header flotante, menú y ticker | [`docs/experience/navigation.md`](./docs/experience/navigation.md) |
| Formulario de contacto tipo Typeform → WhatsApp | [`docs/experience/contact-form.md`](./docs/experience/contact-form.md) |
| Landing: secciones, orden y copy | [`docs/pages/home.md`](./docs/pages/home.md) |
| Página 404 | [`docs/pages/not-found.md`](./docs/pages/not-found.md) |
| SEO: meta, JSON-LD, robots, sitemap, llms.txt | [`docs/seo.md`](./docs/seo.md) |
| Portafolio, fotos, precios y contacto | [`docs/content/portfolio.md`](./docs/content/portfolio.md) |
| Historial de cambios y pendientes | [`docs/changelog.md`](./docs/changelog.md) |

Las imágenes de referencia de la clienta (logo, flyer, moodboard, boceto) están en [`docs/brand/refs/`](./docs/brand/refs/).

## Fuentes de verdad

| Tema | Fuente |
|---|---|
| Dominio de producción | `SITE_URL` en `astro.config.mjs` |
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
| Plugins GSAP y condición de movimiento | `src/scripts/motion/gsap.ts` |

## Validación mínima

- Cambios de UI: revisar desktop (1440) y móvil (390), y con reduced motion activado.
- Cambios de datos, rutas o SEO: `npm run check` y `npm run build`; revisar `dist/robots.txt`, `dist/sitemap.xml` y el JSON-LD.
- Cambios de WebGL: verificar el fallback HTML (sin WebGL) y que el canvas no recorte la hoja.
- Cualquier cambio: `git diff --check` y revisar el diff final.

## Documentación de Astro

Documentación completa: https://docs.astro.build. Guías útiles: [rutas](https://docs.astro.build/en/guides/routing/), [componentes](https://docs.astro.build/en/basics/astro-components/), [frameworks](https://docs.astro.build/en/guides/framework-components/) y [estilos](https://docs.astro.build/en/guides/styling/).

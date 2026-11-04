# Stack y estructura

## Stack

| Paquete | Uso |
|---|---|
| `astro` 7 | Framework: página prerenderizada; solo el panel corre en servidor |
| `@astrojs/react`, `react` 19 | Isla de la galería |
| `gsap` 3 + `@gsap/react` | ScrollSmoother, ScrollTrigger, `useGSAP` |
| `three` r186 | Flyer de precios en WebGL (import dinámico) |
| `@fontsource/italiana`, `@fontsource-variable/jost` | Fuentes self-hosted |
| `@keystatic/core`, `@keystatic/astro` | Panel de la clienta (`/keystatic`) |
| `@astrojs/vercel` | Adaptador para las rutas del panel (solo cuando el panel va en el build) |
| `@vercel/analytics`, `@vercel/speed-insights` | Estadísticas sin cookies (en `Layout.astro`) |
| `@astrojs/check`, `typescript`, `@types/*` | `npm run check` |

## Carpetas

```
src/
├── assets/work/              fotos del portafolio (procesadas por astro:assets)
├── assets/video/             pósters de los clips del footer (los MP4 viven en public/video/)
├── assets/og/                portada.jpg: la imagen para compartir (la genera scripts/og-image.mjs)
├── components/
│   ├── layout/               Loader (pantalla de carga), Header, Menu, SectionTicker, Footer
│   ├── sections/             Hero, Essence, Process, Designs, Available, Services, Appointment, NotFound
│   ├── blocks/               PriceFlyer (WebGL + respaldo), PriceList (HTML)
│   ├── ui/                   Wordmark, Button, ArrowCircle, SectionHeading, WordReveal
│   │   └── icons/            InstagramIcon, WhatsAppIcon
│   ├── seo/                  Seo.astro (<head>: meta, OG, canonical, JSON-LD)
│   └── islands/
│       ├── gallery/          DesignGallery, GalleryRow, GalleryCard, PieceOptions (colores, precio y tallas), Lightbox, transitions (Flip), types, groups (solo servidor), gallery.css
│       └── contact/          ContactForm, StepText, StepChoice, StepSummary, StepHeader, FormProgress, message, contact.css
├── cms/                      panel de la clienta: AdminPage.astro, admin.tsx, admin.css, api.ts, fields.tsx (color y tallas), values.ts (tallas, estados y encuadres)
├── content/                  contenido del panel: coleccion, disenos, proceso, servicios, textos (.json)
├── assets/cms/               fotos del panel (las nombra Keystatic; no se tocan a mano)
├── data/                     cms.ts (lee el panel), site.ts, work.ts (fotos fijas), films.ts, seo.ts, contactForm.ts, wordmark.ts, format.ts
├── layouts/Layout.astro      <head>, slot "fixed", wrapper de ScrollSmoother
├── pages/                    index, 404, robots.txt, sitemap.xml, llms.txt
├── scripts/
│   ├── menu.ts, ticker.ts
│   ├── motion/               gsap, smooth, reveal, hero, pointerDepth, footer, films, loader
│   └── webgl/                priceFlyer, pushPin, flyerTexture, satin (WebGL puro), shaders/*.glsl
└── styles/global.css         tokens, reset, utilidades, estados iniciales de animación
keystatic.config.tsx          esquema del panel
tests/                        pruebas con node:test: contenido del panel (content.test.ts) y formulario (contact.test.ts)
.github/workflows/ci.yml      CI: check, pruebas y build en cada push a main y cada pull request
vercel.json                   headers de seguridad (todo el sitio; el panel con no-store y noindex)
.env.example                  variables del panel en modo GitHub (los valores viven en Vercel y en .env local)
scripts/og-image.mjs          genera la imagen para compartir con Chrome sin ventana (npm run og)
scripts/favicon.mjs           genera favicon.svg, favicon.ico y apple-touch-icon.png en public/ (npm run favicon)
```

## Convenciones

- **Páginas** solo componen. `index.astro` pone Loader, Header, Menu y SectionTicker en `slot="fixed"`, fuera del contenido que transforma ScrollSmoother.
- **Secciones** leen de `src/data/` y delegan en `blocks/` o `ui/`. Cada sección declara `data-section` y `data-section-label` para el ticker.
- **Estilos**: `<style>` scoped en cada `.astro`, con nombres BEM. Si un hijo renderiza el elemento (p. ej. `WordReveal`), el padre usa `:global()` acotado.
- **Scripts**: el componente hace `import { initX } from '../../scripts/...'` y llama `initX(elemento)`.
- **React** solo para estado real. Algo con `position: fixed` dentro de una isla va con portal a `body`, porque ScrollSmoother transforma el contenido.
- **Imágenes** siempre desde `src/assets/`: `<Image>` con `widths` y `sizes`, o `getImage()` para pasarlas a una isla o a OG.
- **Datos**: lo editable sale del panel con `data/cms.ts` (`getCollection`, `getDesigns`, `getProcess`, `getServices`, `getTexts`); las fotos fijas se piden por id con `byId('novia-salon')`. Ver `docs/cms.md` y `docs/content/portfolio.md`.
- `keystatic.config.tsx` (raíz) es el esquema del panel; la integración `cms()` de `astro.config.mjs` lo monta en `/keystatic` en local y, en producción, solo con `PUBLIC_KEYSTATIC_GITHUB_REPO`.
- **Pruebas:** `tests/*.test.ts` corren con `node --test` y la eliminación de tipos de Node 24, sin compilar ni dependencias. Importan módulos sin dependencias (`cms/values.ts`, `data/contactForm.ts`, `data/format.ts`) con su extensión `.ts`. Lo que depende de Astro (`astro:assets`, `import.meta.glob`) se cubre con el build.

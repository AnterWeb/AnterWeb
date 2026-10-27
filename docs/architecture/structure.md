# Stack y estructura

## Stack

| Paquete | Uso |
|---|---|
| `astro` 7 | Framework, salida estática |
| `@astrojs/react`, `react` 19 | Isla de la galería |
| `gsap` 3 + `@gsap/react` | ScrollSmoother, ScrollTrigger, `useGSAP` |
| `three` r186 | Flyer de precios en WebGL (import dinámico) |
| `@fontsource/italiana`, `@fontsource-variable/jost` | Fuentes self-hosted |
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
├── data/                     site.ts, work.ts, collection.ts, films.ts, process.ts, services.ts, seo.ts, contactForm.ts, wordmark.ts, format.ts
├── layouts/Layout.astro      <head>, slot "fixed", wrapper de ScrollSmoother
├── pages/                    index, 404, robots.txt, sitemap.xml, llms.txt
├── scripts/
│   ├── menu.ts, ticker.ts
│   ├── motion/               gsap, smooth, reveal, hero, pointerDepth, footer, films, loader
│   └── webgl/                priceFlyer, pushPin, flyerTexture, satin (WebGL puro), shaders/*.glsl
└── styles/global.css         tokens, reset, utilidades, estados iniciales de animación
scripts/og-image.mjs          genera la imagen para compartir con Chrome sin ventana (npm run og)
```

## Convenciones

- **Páginas** solo componen. `index.astro` pone Loader, Header, Menu y SectionTicker en `slot="fixed"`, fuera del contenido que transforma ScrollSmoother.
- **Secciones** leen de `src/data/` y delegan en `blocks/` o `ui/`. Cada sección declara `data-section` y `data-section-label` para el ticker.
- **Estilos**: `<style>` scoped en cada `.astro`, con nombres BEM. Si un hijo renderiza el elemento (p. ej. `WordReveal`), el padre usa `:global()` acotado.
- **Scripts**: el componente hace `import { initX } from '../../scripts/...'` y llama `initX(elemento)`.
- **React** solo para estado real. Algo con `position: fixed` dentro de una isla va con portal a `body`, porque ScrollSmoother transforma el contenido.
- **Imágenes** siempre desde `src/assets/`: `<Image>` con `widths` y `sizes`, o `getImage()` para pasarlas a una isla o a OG.
- **Datos**: las fotos se referencian por id con `byId('novia-salon')`; Diseños lee `pieces` (una prenda con varias fotos) y Piezas disponibles lee `collection` (prendas a la venta con colores, precio y tallas). Ver `docs/content/portfolio.md`.

# Anter House

Sitio de **Anter House, bespoke fashion**: taller de moda a la medida en Monterrey (novias, vestidos de fiesta, confección y ajustes) con una colección de prendas a la venta. La dueña actualiza la colección, las fotos, los precios y los textos desde un panel propio, sin tocar código.

**En línea:** https://anter-web.vercel.app · **Panel:** `/keystatic` (se entra con GitHub)

## Stack

| Capa | Herramienta |
|---|---|
| Framework | [Astro 7](https://astro.build): la página se prerenderiza; solo el panel corre en servidor |
| Interfaz | Componentes `.astro`; islas de React 19 donde hay estado (galería y formulario de cita) |
| Movimiento y 3D | GSAP 3 (ScrollSmoother, ScrollTrigger y Flip) y Three.js para la hoja de precios |
| Contenido | [Keystatic](https://keystatic.com): JSON en `src/content/` y fotos en `src/assets/cms/`; en producción, cada guardado es un commit |
| Hosting | Vercel, con headers de seguridad (`vercel.json`), Web Analytics y Speed Insights sin cookies |
| Calidad | `astro check` (TypeScript estricto), pruebas con `node:test` y CI en GitHub Actions |

## Empezar

Requisitos: Node 24 (`.nvmrc`) y npm.

```bash
npm ci
npm run dev        # http://localhost:4321, con el panel en /keystatic
```

El sitio no necesita variables para correr ni para compilar. Las del panel en modo GitHub están en [`.env.example`](./.env.example). Sin ellas, el panel local guarda en los archivos del proyecto y el build de producción sale 100 % estático.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local con el panel |
| `npm run build` / `npm run preview` | Build de producción y su vista previa |
| `npm run check` | Tipos de Astro y TypeScript |
| `npm test` | Pruebas del contenido del panel y de la lógica del formulario |
| `npm run verify` | `check`, `test` y `build`: lo mismo que corre la CI |
| `npm run og` | Regenera la imagen para compartir (`src/assets/og/portada.jpg`) |
| `npm run favicon` | Regenera el favicon y el ícono del iPhone (`public/`) |

## Cómo está organizado

```
src/
├── pages/          index, 404, robots.txt, sitemap.xml y llms.txt
├── components/     layout/ (carga, header, menú y footer), sections/ (una por sección), blocks/, ui/, seo/ e islands/ (React)
├── content/        lo que edita el panel (JSON)
├── assets/         fotos fijas del sitio (work/), fotos del panel (cms/), clips y portada para compartir
├── data/           lectura del panel (cms.ts), datos fijos, SEO y formulario
├── cms/            el panel: página, tema, campos a la medida y valores del esquema
├── scripts/        movimiento (GSAP) y WebGL
└── styles/         tokens y reset
keystatic.config.tsx   esquema del panel
tests/                 pruebas (node:test)
docs/                  documentación por área
```

## Publicación

Cada push a `main` publica en Vercel, y también cada guardado del panel, porque es un commit. La CI (`.github/workflows/ci.yml`) revisa tipos, pruebas y build en cada push y pull request. Si un build falla, Vercel deja en línea la versión anterior.

## Documentación

[`AGENTS.md`](./AGENTS.md) es la guía del proyecto: reglas, comandos y el índice de [`docs/`](./docs), con un documento por área (panel, SEO, movimiento, WebGL, formulario, contenido y marca). El historial está en [`docs/changelog.md`](./docs/changelog.md).

---

Diseño y desarrollo: [Flouvia](https://flouvia.com).

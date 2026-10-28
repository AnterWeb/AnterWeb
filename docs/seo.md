# SEO

Basado en las skills `seo-audit`, `schema-markup` y `ai-seo` (`~/Desktop/Claude Skills/marketingskills-main/skills/`).

## Dominio: una sola fuente

`astro.config.mjs` define `site`. En Vercel sale solo de `VERCEL_PROJECT_PRODUCTION_URL`, el dominio principal del proyecto: hoy `alter-psi-two.vercel.app` y, cuando se conecte el dominio de la clienta y quede como principal, ese, sin tocar código. `SITE_URL` lo fuerza a mano (`SITE_URL=https://… npm run build`); fuera de Vercel, el respaldo es `alter-psi-two.vercel.app`. Canonical, `og:url`, `og:image`, el sitemap, robots y el JSON-LD salen de ahí.

Hasta el 2026-10-23 el valor por defecto era `anter-house.vercel.app`, que no existe (404): el canonical apuntaba a una página inexistente y al compartir el enlace (WhatsApp, Instagram) no salía la imagen.

## `<head>`: `components/seo/Seo.astro`

| Elemento | Valor / regla |
|---|---|
| Title | `Vestidos a la medida y de novia en Monterrey \| Anter House`: 50–60 caracteres, keyword primero, sin guiones largos |
| Description | 150–160 caracteres con keyword, la colección y CTA (`data/seo.ts`) |
| Canonical | URL absoluta autorreferente (se omite si `noindex`) |
| Open Graph / Twitter | `website`, `es_MX` y la portada `src/assets/og/portada.jpg` (1200×630, ver abajo) |
| H1 | Oculto visualmente detrás del wordmark: "Anter House: vestidos a la medida y de novia en Monterrey" |

## Imagen para compartir (`npm run og`)

La vista previa al mandar el enlace (WhatsApp, Instagram, iMessage) es una portada de revista hecha con el sitio, sobre el fondo hueso: ANTER a todo lo ancho como cabecera, el satín drapeado (`proceso-manos`) subiendo detrás de sus letras, "HOUSE" y "bespoke fashion" a los lados, la colección como titular en Italiana y la diseñadora en blanco y negro con "Hecho a tu medida, puntada a puntada." en vertical.

- `scripts/og-image.mjs` la dibuja como HTML con las fuentes de Fontsource, los tokens de `global.css`, el wordmark de `data/wordmark.ts` y la temporada del panel (`src/content/coleccion.json`); la captura con Chrome sin ventana a 2x y la guarda reducida en `src/assets/og/portada.jpg`.
- Al cambiar de temporada o de fotos: `npm run og` (en la Mac; en otro sistema, `CHROME=ruta npm run og`) y commit de la imagen.
- WhatsApp a veces recorta la vista previa al centro en cuadrado: ahí quedan la foto principal y el centro de la cabecera.

## JSON-LD (`data/seo.ts → buildJsonLd`)

- `@graph` con `WebSite`, `ClothingStore` y un `ItemList` con la colección a la venta. No existe un tipo "Dressmaker"; `ClothingStore` es el más cercano.
- La colección (del panel, `data/cms.ts`): cada opción es un `Product` con su nombre de venta (`productName`: "Vestido halter negro"), foto, tallas disponibles y un `Offer` con precio en MXN, `InStock` o `SoldOut` y `NewCondition`. Al marcar tallas vendidas, el schema cambia solo.
- Lleva `hasOfferCatalog` con los servicios y **cada precio de la hoja**, generados desde el panel (Servicios y precios), así que coinciden con lo visible.
- Se omiten a propósito, porque no los tenemos: `streetAddress`, `postalCode`, `geo`, `openingHoursSpecification`, `priceRange` y `aggregateRating`. No inventarlos.
- Validar con Rich Results Test y validator.schema.org después de cada cambio.

## Archivos generados (`src/pages/`)

| Ruta | Archivo | Contenido |
|---|---|---|
| `/robots.txt` | `robots.txt.ts` | `Allow: /` para todos (incluidos los crawlers de IA) + sitemap absoluto |
| `/sitemap.xml` | `sitemap.xml.ts` | Solo URLs canónicas indexables (`/`), con `lastmod` de build. La 404 y las anclas no van |
| `/llms.txt` | `llms.txt.ts` | Resumen para buscadores con IA: servicios, precios en MXN, la colección con tallas disponibles y contacto, desde los mismos datos |

## Contenido on-page

- Los precios están en HTML real (`PriceList`), aunque visualmente se muestre el WebGL.
- Alt descriptivo en cada foto (el campo "Qué se ve en la foto" del panel; las fijas, en `data/work.ts`).
- El nombre, teléfono y zona son los mismos en el footer, el schema y `llms.txt`.

## Pendiente con la clienta

- Dominio de producción.
- Dirección completa, código postal y horario, o confirmar que atiende por zona.
- Logo en SVG/PNG.
- Precios de vestidos (rangos) y tiempos de entrega.
- Nombre y trayectoria de la diseñadora (E-E-A-T).
- Si existe un perfil de Google Business y si el WhatsApp recibe llamadas.

## Rendimiento

La pantalla de carga (`layout/Loader.astro`) tapa el hero unos 2 s (el clip del cuaderno; Three.js ya no se pide al abrir la landing). El HTML ya trae todo el contenido, así que no afecta lo que Google indexa, pero sí retrasa el LCP de la primera visita (la foto principal del hero aparece cuando se abre la hoja). Si las métricas de campo (Search Console › Métricas web principales) salen en "necesita mejorar", la opción es mostrarla una sola vez por sesión.

## Después del deploy

- Dar de alta el sitio en Google Search Console y Bing Webmaster Tools y enviar el sitemap.
- Crear o vincular el perfil de Google Business; es lo más importante para SEO local.
- Revisar una vez al mes cómo responden ChatGPT, Perplexity y Google a "vestidos de novia a la medida Monterrey".

# Panel de la clienta (Keystatic)

La clienta actualiza la página desde **`/keystatic`**: la colección (prendas, colores, fotos, precios, tallas y sold out), los carruseles de Diseños, el Proceso, los servicios con su hoja de precios y los textos de Esencia, Piezas disponibles y Cita. El diseño no se toca desde ahí: acomodo, tipografía, colores de la página y animaciones siguen en el código.

## Cómo funciona

| Pieza | Archivo |
|---|---|
| Esquema del panel (secciones, campos, textos de ayuda) | `keystatic.config.tsx` |
| Controles a la medida: muestra de color y tallas | `src/cms/fields.tsx` (paleta en `PRESET_COLORS`) |
| Página del panel con la identidad del sitio | `src/cms/AdminPage.astro`, `src/cms/admin.tsx`, `src/cms/admin.css` |
| Integración (monta `/keystatic` y `/api/keystatic`) | `cms()` en `astro.config.mjs`; la API es `src/cms/api.ts` |
| Contenido | `src/content/{coleccion,disenos,proceso,servicios,textos}.json` |
| Fotos del contenido | `src/assets/cms/<sección>/…` |
| Lectura para la página (fotos importadas, encuadres, tipos) | `src/data/cms.ts` |

- Cada sección es un *singleton* de Keystatic guardado como JSON. Guardar escribe esos archivos: en local, en disco; en producción, un commit a `main` del repo de la clienta, y Vercel publica en uno o dos minutos.
- La página lee el contenido en el build con el *reader* de Keystatic (`data/cms.ts`). Las rutas de foto se cambian por la imagen importada (`import.meta.glob` sobre `src/assets/cms/`), así que siguen pasando por `astro:assets`, el satín y el lightbox igual que antes.
- **Fotos:** Keystatic las nombra por su lugar (`prendas/0/opciones/1/fotos/0/imagen.jpg`) y las mueve al reordenar. No se editan a mano ni se usan desde fuera del panel. Las fotos fijas del sitio (hero, collage de Esencia, menú y 404) son otras y viven en `src/assets/work/` (`data/work.ts`): así la clienta no puede borrar una foto del hero al quitar una pieza.
- **Encuadre:** cada foto lleva Centro, Arriba, Abajo, Izquierda o Derecha (`FRAMING` en `keystatic.config.tsx` → `object-position`). En la colección cuenta por opción: dos colores pueden compartir foto y encuadrarla distinto (el pantalón, abajo).
- **Tallas:** cada talla está en "no se hace", "disponible" o "sold out" (`{ "CH": "agotada", "M": "disponible" }`). No se publican cantidades. Si todas las tallas de un color están vendidas, el color entero sale "Sold out".
- **Tema:** Keystar UI arma su tema con dos escalas; `admin.css` las reemplaza (slate → hueso a tinta, indigo → terracota), pone Jost e Italiana y deja el panel siempre en claro. La página del panel es propia (no la genérica de `@keystatic/astro`) para poder cargar ese CSS.
- Keystatic tiene la interfaz en español (`locale: 'es-ES'`), pero su traducción está incompleta: "Save", "Edit item" y "Done" salen en inglés.

## Qué no edita la clienta

Contacto (WhatsApp, Instagram, zona: `data/site.ts`), preguntas del formulario (`data/contactForm.ts`), SEO (`data/seo.ts`), las fotos fijas del sitio, la portada para compartir (`npm run og`, que lee la temporada de `src/content/coleccion.json`: al cambiar de temporada hay que regenerarla) y el diseño.

## En local

`npm run dev` y abrir `http://localhost:4322/keystatic`. Con `PUBLIC_KEYSTATIC_GITHUB_REPO` en `.env` (como quedó tras crear la GitHub App), el panel local también guarda en el repo de la clienta: cada guardado es un commit a `main` y se publica. Para probar sin publicar, comentar esa línea del `.env`: el panel guarda en los archivos del proyecto y esos cambios se suben con un commit como cualquier otro.

## En producción (activo desde el 2026-11-04)

La clienta entra en `https://anter-web.vercel.app/keystatic` (o en su dominio, cuando lo conecte) con su cuenta de GitHub, `AnterWeb`. Lo que guarda es un commit a `main` de `AnterWeb/AnterWeb`, y su Vercel publica en uno o dos minutos.

- **GitHub App:** `anterweb-keystatic`, de la cuenta `AnterWeb` e instalada solo en el repo `AnterWeb`. Se creó con el asistente de Keystatic (`/keystatic/setup`), que solo funciona en local porque escribe las llaves en `.env`.
- **Variables** (en el Vercel de la clienta, los tres entornos): `PUBLIC_KEYSTATIC_GITHUB_REPO`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` y `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Con ellas el build suma el adaptador de Vercel y las rutas del panel corren en servidor; el resto de la página sigue prerenderizada. Sin `PUBLIC_KEYSTATIC_GITHUB_REPO` el sitio vuelve a ser 100 % estático. Los valores viven en su Vercel y en el `.env` local; nunca en el repo ni en un chat.
- **Al conectar su dominio:** en la GitHub App (GitHub → Settings → Developer settings → GitHub Apps → anterweb-keystatic → General), agregar la URL de callback `https://<dominio>/api/keystatic/github/oauth/callback` (sin quitar la de `anter-web.vercel.app`) y cambiar la Homepage URL. Lo hace la dueña de la app, con la sesión de `AnterWeb`.

## Después de cambiar el esquema

Abrir cada sección del panel y guardarla una vez (Keystatic puede reacomodar nombres de fotos), `npm run check`, `npm run build` y revisar la sección en la página.

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

`npm run dev` y abrir `http://localhost:4322/keystatic`. Sin `PUBLIC_KEYSTATIC_GITHUB_REPO`, el panel guarda en los archivos del proyecto; esos cambios se suben con un commit como cualquier otro.

## Demostración en línea (mientras no hay GitHub)

Para que la clienta conozca el panel antes de la transferencia, se publica con `KEYSTATIC_DEMO=1` (por ejemplo, `vercel deploy --prod --build-env KEYSTATIC_DEMO=1`). Así el build suma el adaptador de Vercel y la función del panel lleva el contenido y sus fotos (`includeFiles`), para que `/keystatic` se pueda recorrer completo. Guardar no escribe nada: `src/cms/api.ts` responde con un aviso (en Vercel el disco es de solo lectura) y el panel muestra una píldora que lo explica. La lista de archivos de la API solo enseña el contenido del panel, no los archivos internos de la función. `/keystatic` no está enlazado ni en el sitemap y lleva `noindex`; todo lo que muestra ya es público en la página. Al activar el modo GitHub se quita `KEYSTATIC_DEMO`.

## Activarlo en producción (al transferir el proyecto)

Sin `PUBLIC_KEYSTATIC_GITHUB_REPO` el build de producción no incluye el panel y el sitio es 100 % estático. Para activarlo:

1. Repo y Vercel ya son de la clienta (`AnterWeb/AnterWeb`, publicado en `anter-web.vercel.app` desde el 2026-11-04).
2. En local, poner `PUBLIC_KEYSTATIC_GITHUB_REPO=AnterWeb/AnterWeb` en `.env`, correr `npm run dev` y abrir `/keystatic`. Keystatic guía la creación de la GitHub App y escribe en `.env` `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` y `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. `AnterWeb` es una cuenta personal y no una organización: un colaborador no puede crear ni instalar la app ahí, así que ese paso se hace con su sesión de GitHub (en llamada con ella).
3. En la configuración de esa GitHub App, agregar la URL de callback de producción: `https://<dominio>/api/keystatic/github/oauth/callback`.
4. Subir las cinco variables a Vercel (Production) y volver a publicar. Con ellas, el build suma el adaptador de Vercel y las rutas del panel corren en servidor; el resto de la página sigue prerenderizada.
5. La clienta entra en `https://<dominio>/keystatic` con su cuenta de GitHub.

## Después de cambiar el esquema

Abrir cada sección del panel y guardarla una vez (Keystatic puede reacomodar nombres de fotos), `npm run check`, `npm run build` y revisar la sección en la página.

# Changelog

## 2026-10-26: v0.10 (cuarta ronda de la clienta)

- **Pantalla de carga:** se quitaron las tijeras 3D y las solapas de papel (`webgl/loaderScene.ts`, `scissors.ts`, `paperFlaps.ts` y sus shaders). Ahora es el clip del cuaderno en blanco y negro al centro, con ANTER debajo; al terminar vuela a la foto B/N del hero y se funde en ella. Three.js vuelve a cargarse solo con el flyer.
- **Índice:** "Esencia" en lugar de "Nuestra esencia" (hero, menú, footer y ticker). El encabezado de la sección sigue diciendo "Nuestra esencia".
- **Esencia:** "hasta que la pieza quede perfecta".
- **Proceso:** sin los números 01–04.
- **Fondo hueso en todo el sitio** (`--fondo`, `#ECE6D9`): página, hero, velo del header, ticker, pantalla de carga, texto claro de las píldoras oscuras y el hueco del anillo de las muestras de color. El salvia queda como color del logo (favicon) y acento en el menú y el lightbox; `theme-color` pasa a hueso.
- **Diseños:** sin descripción en las tarjetas ni en el lightbox de Novias y Fiesta (el nombre queda para lectores de pantalla).
- **Favicon:** la A del logo en hueso sobre tinta (invertido en modo oscuro), en lugar de la A genérica dibujada a mano; ahora también hay `favicon.ico` y `apple-touch-icon.png` (`scripts/favicon.mjs`, `npm run favicon`).
- **Imagen para compartir:** la portada pasa al fondo hueso (`npm run og`).
- **Diseños:** "Piezas hechas una sola vez." en una sola línea (`SectionHeading wide`; en teléfono se achica lo justo).
- **Servicios:** "Mamá y hermanas de novios, fiesta y cocktail." pasa a Vestidos a la medida; Novias queda "Novias, despedidas y civiles.".

## 2026-10-23: v0.9.1 (SEO)

- **Dominio:** canonical, `og:url`, `og:image`, sitemap, robots y JSON-LD apuntaban a `anter-house.vercel.app`, que da 404 (al compartir el enlace no salía la imagen). Ahora salen de `VERCEL_PROJECT_PRODUCTION_URL`: hoy `alter-psi-two.vercel.app` y, cuando se conecte el dominio de la clienta, ese, sin tocar código.
- **JSON-LD:** la colección entra como `ItemList` de `Product` con precio, tallas y disponibilidad (`InStock`/`SoldOut`). `productName` da el nombre de venta de cada prenda (también en `llms.txt`).
- **Description:** menciona la colección Otoño/Invierno 2026.
- **Imagen para compartir:** en lugar del recorte horizontal de la novia (le cortaba la cabeza y no llevaba marca), una portada de revista hecha con las fotos, colores y tipografías del sitio (`scripts/og-image.mjs`, `npm run og`).

## 2026-10-23: v0.9 (tercera ronda de la clienta y pantalla de carga)

- **Nuestra esencia:** sin los pies "Fig. n" (la clienta los quitó). Las dos fotos chicas del collage crecen (corte de 26 % a 36 % del collage, prueba de tela de 24 % a 34 %) y el collage es un poco más alto. Se eliminó `ui/FigCaption.astro` y el campo `caption` de las fotos, que ya nadie usaba.
- **Proceso:** textos de la clienta para Diseño (antes Boceto), Patrón y Prueba. En Prueba se ajustó "Dependiendo el diseño" a "Dependiendo del diseño,". Costura no cambió.
- **Piezas disponibles:**
  - un solo grupo, "Colección Otoño/Invierno 2026", en lugar de Vestidos y Blusas y tops;
  - intro de la clienta: "Otoño/Invierno 2026. Adquiere tus piezas favoritas de nuestra colección limitada." y el botón de WhatsApp debajo;
  - cada tarjeta lleva muestras de color que cambian las fotos (con la ola de satín), el precio y las tallas; las tallas vendidas se tachan con "Sold out" (borde de puntada) y una opción agotada lleva sello sobre la foto;
  - datos nuevos en `data/collection.ts` (precios y tallas de la clienta, sin cantidades); el top "negro" era café oscuro y su foto pasó a `disponible-top-cafe`;
  - la blusa lila y el pantalón negro son dos opciones de la misma tarjeta (se venden por separado) que comparten foto: el pantalón encuadra abajo;
  - el lightbox muestra el color y el precio de cada foto; `llms.txt` lista la colección con precios y tallas disponibles.
- **Agenda tu cita:** "No dudes en contactarnos. Tu próxima cita está a tan solo un clic." en lugar de la explicación del formulario, y botón "Agenda por WhatsApp". El formulario sigue (decisión pendiente con la clienta).
- **Footer:** dos clips del taller que mandó la clienta (el boceto que se colorea y el cuaderno que se hojea), con la gramática del hero: escalas distintas, el cuaderno en blanco y negro y "est. 2024" vertical en terracota. Se convirtieron a loops MP4 sin audio (`public/video/`); solo se reproducen en pantalla y con reduced motion queda el póster. `data-clip` ahora también acerca videos.
- **Pantalla de carga** (`layout/Loader.astro`, `motion/loader.ts`, `webgl/loaderScene.ts`, `scissors.ts`, `paperFlaps.ts`): una hoja de papel de patrón con ANTER; unas tijeras de sastre en 3D (acero cepillado, mangos laqueados en tinta, sombra real) aterrizan, cortan la palabra en tijeretazos y se van; la hoja se enrolla desde el corte y entra el hero. Respaldos sin WebGL, sin JS y con reduced motion. Three.js ahora se pide al abrir la landing (el flyer lo reutiliza de la caché).
- `data/format.ts` (`mxn`) reemplaza las tres copias del formato de precio.

## 2026-10-16: v0.8 (photoshoot profesional)

- Llegó el photoshoot profesional del taller desde Pixieset: 85 fotos de la fotógrafa (camilatorrez.pixieset.com). En total se usan 10 nuevas, procesadas como siempre (enderezadas, 2400 px, sin metadatos).
- **Nuestra esencia:** el collage pasa de 3 fotos de novia, que ya estaban en la galería, a la diseñadora en su taller: retrato, corte a mano y prueba de tela. Esencia ahora respeta `focus`.
- **Sección nueva Proceso** (`sections/Process.astro`, `data/process.ts`):
  - Boceto, Patrón, Prueba y Costura, cada paso con su foto;
  - columnas escalonadas con índice numerado y línea fina;
  - va entre Esencia y Diseños, sin número en el ticker ni entrada en el menú.
- **Galería:** el "Strapless negro con rosa" suma 2 fotos del taller y abre con la profesional.
- **Hero:** la foto de la diseñadora con alfileres se cambia por una de ella bocetando en blanco y negro (`atelier-boceto-bn`), la única en blanco y negro del collage. También se ve en móvil. Se probó un retrato en blanco y negro que no gustó. Se eliminaron `proceso-alfileres` y ese retrato.
- Se probó una sección "El taller" con 14 fotos maquetadas como revista y se descartó por decisión del equipo.
- **Espacio entre secciones más corto:** `--section-y` pasa de `clamp(4.5rem, 9vw, 8rem)` a `clamp(3rem, 6vw, 5.25rem)`, unos 35 % menos.
- Regla nueva: no se usan tomas donde se lea el letrero "ANA GARCIA ATELIER" (la marca es Anter House).

## 2026-10-12: v0.7 (galería: Flip y satín)

- **Lightbox con GSAP Flip:**
  - al tocar una pieza, la foto vuela desde su tarjeta hasta pantalla completa;
  - al cerrar (botón, Esc o clic fuera) regresa a su tarjeta;
  - mientras carga la versión grande se ve la miniatura, así el vuelo nunca muestra un hueco;
  - el fondo es una capa aparte que se funde sin afectar la foto;
  - con reduced motion abre y cierra sin animación.
- **Efecto satín (WebGL puro):**
  - al hojear las fotos de una tarjeta con el mouse, una ola de tela cruza la imagen, la pliega levemente y deja un brillo tenue antes de mostrar la foto nueva;
  - usa un solo canvas para toda la página y replica el recorte de cada foto;
  - el fundido CSS queda como respaldo sin WebGL y con reduced motion.
- Se probaron y descartaron, por decisión del equipo:
  - un hilo de puntada animado (hero y separadores);
  - una etiqueta colgante "Disponible" en Piezas disponibles.

## 2026-10-12: v0.6 (segunda ronda de la clienta)

- **Diseños, Novias:**
  - una tarjeta por vestido: "Vestido de novia" (2 fotos) y "Despedida" (3 fotos), en lugar de 5 fotos sueltas que parecían vestidos distintos;
  - al pasar el mouse se hojean las fotos del mismo vestido, con rayitas que indican cuántas hay; el lightbox recorre foto por foto;
  - títulos cortos, sin descripción.
- `data/work.ts` separa `photos` (fotos sueltas, `byId`) de `pieces` (prendas con varias fotos). El título descriptivo de cada foto pasó a `caption`, que solo usa Esencia.
- **Servicios:**
  - se quitó la foto que seguía al cursor (`hoverPreview.ts` eliminado);
  - se quitó el título "Del boceto al último ajuste."; queda la etiqueta "Servicios";
  - la hoja de precios (HTML y WebGL) se titula "Servicios" (`priceListTitle`);
  - textos de la clienta: Vestidos a la medida (cocktail y fiesta), Novias (novias, mamás y hermanas de los novios, despedidas y civiles), Ajustes (bastillas, ajustes de talle, cambio de cierres y enmiendas).
- Formulario: opciones "Vestido de cocktail o fiesta" y "Ajustes", alineadas con los servicios.
- **Piezas disponibles** (sección nueva 03, `sections/Available.astro`):
  - prendas a la venta del correo "Completo": Vestidos (ivory y negro, verde y café) y Blusas y tops (top negro y blanco, blusa negra y café, blusa lila y pantalón negro);
  - misma galería que Diseños; cada modelo en dos colores es una tarjeta que se hojea;
  - botón "Preguntar" a WhatsApp;
  - en el menú, el hero y el ticker; Servicios pasa a 04 y Cita a 05.
- Fotos nuevas del correo "Fotos":
  - Fiesta suma "Lila con capa" y "Fucsia strapless con olán" (3 fotos cada una);
  - la novia de espaldas (`novia-espalda`) es el mismo vestido de novia, así que es su tercera foto.
- `islands/gallery/groups.ts` arma los grupos de cada sección (`categories[].section`).
- Fotos nuevas enderezadas, a 2400 px y sin metadatos (GPS).
- Servicios: `overflow-x: clip` para que el canvas del flyer no cree scroll horizontal en móvil con reduced motion (ya pasaba antes).
- **Hero:** las 4 fotos ahora son de la sesión del taller, como pidió la clienta para la página de inicio:
  - principal: manos drapeando satín rosa;
  - aguja de la máquina con hilo rosa;
  - la diseñadora prendiendo alfileres en el maniquí;
  - mesa de costura, recortada para quitar el desenfoque del primer plano.
  Se usan como `proceso-*` en `photos`, sin ser piezas, y el hero ahora respeta `focus`. Los vestidos que estaban en el hero siguen en la galería. Se descartaron, por menos pulidas, la foto de la diseñadora de frente (IMG_3862) y la caja de hilos (IMG_3867).

## 2026-10-08: v0.5 (cambios de la clienta)

- **Logo:** el wordmark `ANTER` ahora es un SVG reconstruido del logo original (97–99 % de coincidencia por letra), en hero, header, footer, 404, tarjeta de precios y flyer WebGL. En el hero es más chico.
- **Hero:**
  - se quitó la nota bajo el índice ("Moda a la medida en Monterrey…");
  - se agregó "est. 2024" bajo la foto del vestido blanco;
  - se conserva la frase "puntada a puntada".
- **Esencia:**
  - "Proceso personalizado:" como entrada;
  - "quede" en vez de "cae", "prenda" en vez de "vestido";
  - sin "y se termina a mano, puntada por puntada".
- Se eliminó la sección Statement ("Hecho a tu medida").
- **Diseños:**
  - por grupos según el boceto de la clienta (Novias, Fiesta), cada uno con su tira horizontal;
  - sin filtros ni recorrido fijado;
  - "noche" y "taller" se fusionan en Fiesta.
- Pendiente: la clienta mandará fotos nuevas de una sesión del taller para el hero.

## 2026-10-07: v0.4 (formulario y móvil)

- Agenda tu cita: sección compacta sin fotos con un formulario tipo Typeform.
  - 5–6 preguntas, con la de express condicional; resumen editable.
  - Arma el mensaje de WhatsApp. Ver `docs/experience/contact-form.md`.
- Statement: la nota "Del taller" queda solo en texto. Se quitaron fotos repetidas (Statement usa champagne + fucsia).
- Móvil:
  - auditoría a 375 y 360 px sin desbordes;
  - velo en el header para que el contenido no se encime;
  - ticker en píldora;
  - se oculta el pie vertical del Statement.
- `site.ts` exporta `whatsappLink(message)`.

## 2026-10-07: v0.3.2 (Statement compuesto)

- Statement: foto suelta arriba a la derecha y nota "Del taller" con foto abajo a la izquierda para llenar las esquinas vacías; pie vertical en la foto central.
- Nuevo `ui/FigCaption.astro`, compartido por Esencia y Statement.

## 2026-10-07: v0.3.1 (Esencia editorial)

- Esencia maquetada como revista de moda:
  - capital terracota en el manifiesto;
  - cuerpo a dos columnas con entrada en versalitas;
  - cita destacada con filete;
  - pies de foto "Fig. 1/2/3" en el collage.
- Se eliminó la fila de valores numerados.
- `WordReveal` acepta `dropCap`.

## 2026-10-07: v0.3 (WebGL, SEO, 404)

- Flyer de precios en Three.js:
  - papel con shader (ondula, se curva, hendidura con el cursor);
  - chinche roja 3D con clearcoat y reflejos de entorno;
  - la hoja cuelga y se mece alrededor de la chinche;
  - el canvas sangra para no recortar la hoja;
  - movimiento sutil y amortiguado.
- Íconos de Instagram y WhatsApp en el header, el menú, los botones de Cita y el footer.
- SEO:
  - componente `Seo.astro` con canonical, OG, Twitter y JSON-LD (`ClothingStore` + catálogo de precios);
  - H1 con keyword;
  - `robots.txt`, `sitemap.xml` y `llms.txt` generados desde los datos.
- Página 404 con estética de hero, `noindex` y status 404 real.
- `SITE_URL` en `astro.config.mjs` como fuente única del dominio (provisional).

## 2026-10-07: v0.2 (rediseño con la estética del hero)

- Fondo salvia continuo; se eliminaron las bandas de color entre secciones.
- Escala tipográfica contenida y secciones más cortas.
- ScrollSmoother; reveals atados al scroll (`data-clip`, `data-words`, `data-parallax`).
- Diseños: galería horizontal fijada con contador, filtros y lightbox (portal).
- Servicios: filas de índice con foto que sigue al cursor.
- Navegación nueva: header flotante, menú a pantalla completa con preview y ticker de sección.
- Etiquetas de sección en Italiana terracota en lugar de `03 —— SERVICIOS`.
- Footer con el wordmark que se arma con el scroll.

## 2026-10-07: v0.1

- Proyecto Astro 7 + React 19 + GSAP.
- Identidad extraída del logo y del flyer (paleta, tipografía).
- Primera landing.

## Pendientes

- Al entregar, cuando compren el dominio: conectarlo en Vercel como principal (canonical y Open Graph se ajustan solos), alta en Search Console con el sitemap y perfil de Google Business. Confirmar con la clienta dirección y horario si los quiere publicar (ver `docs/seo.md`).
- Logo vectorial y nombre de la fuente original.
- Validar la copy y los títulos de las piezas (incluidos los nombres de los modelos de la colección).
- Decidir con la clienta si el formulario de Cita se queda, se recorta o se quita (hoy convive con el botón directo a WhatsApp).
- Marcar en `data/collection.ts` las tallas que se vendan (por ejemplo, después del open house).
- Si se agrega una FAQ: sumar `FAQPage` al schema.

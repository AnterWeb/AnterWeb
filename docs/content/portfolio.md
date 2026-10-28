# Contenido: portafolio, colección, precios y contacto

Lo que cambia seguido (Diseños, la colección a la venta, Proceso, servicios y precios, y los textos de Esencia, Piezas disponibles y Cita) se edita en el **panel** (`/keystatic`, ver [`docs/cms.md`](../cms.md)) y vive en `src/content/*.json` con sus fotos en `src/assets/cms/`. `src/data/cms.ts` lo deja listo para la página. Lo fijo sigue en `src/data/`.

## Diseños (panel: Diseños)

Dos carruseles según el boceto de la clienta: **Novias** y **Fiesta**. Cada pieza es un vestido: una tarjeta con sus fotos, que se hojean con el mouse; el lightbox las recorre todas. La primera foto es la portada. Las piezas en maniquí (terracota, champagne) van en Fiesta.

- Desde el 2026-10-26 las tarjetas y el lightbox van sin descripción (pedido de la clienta). El nombre de cada pieza queda para ubicarla en el panel y para lectores de pantalla.
- Una pieza = un vestido: fotos del mismo vestido van juntas, nunca como piezas separadas.
- `islands/gallery/groups.ts` arma los grupos con las imágenes optimizadas: `designGroups()` para Diseños y `collectionGroup()` para Piezas disponibles.

## Colección a la venta (panel: Colección a la venta)

Piezas disponibles es la colección de temporada (hoy **Otoño/Invierno 2026**) en un solo grupo; la clienta tiene pocas prendas y pidió no separarlas en Vestidos y Blusas. Cada modelo es una tarjeta con sus **colores**: un color, o una prenda del conjunto en el caso de la blusa lila con pantalón (se venden por separado y comparten foto). Cada color tiene su muestra, fotos, precio (MXN) y tallas.

En la tarjeta, las muestras son radios: al elegir una pasan sus fotos (con la ola de satín) y cambian el precio y las tallas. La tarjeta abre en el primer color con tallas disponibles.

Precios y tallas los mandó la clienta (2026-10-23). El top que antes decía "negro" es café oscuro, así lo nombra la clienta.

### Marcar una talla vendida

La clienta lo hace en el panel: abre la prenda y el color, y toca la talla hasta que diga **Sold out**. **No se publican cantidades por talla**, solo si hay o no.

- La talla se ve tachada con "Sold out" y borde de puntada.
- Si se venden todas las tallas de un color, ese color entero sale "Sold out" (sello sobre la foto y muestra tachada) y la tarjeta abre en otro color si queda alguno.
- El JSON-LD (`Product` con `SoldOut`) y `llms.txt` se actualizan solos.

## Proceso, servicios y precios (panel)

- **Proceso:** título y pasos (Diseño, Patrón y Prueba con textos de la clienta; Costura en borrador), cada uno con su foto.
- **Servicios y precios:** las tres filas de Servicios y la hoja de precios del flyer "Confección y ajustes" (`docs/brand/refs/flyer-confeccion-ajustes.jpg`), en MXN, con el cargo del arreglo express y la nota. La hoja se titula "Servicios" por petición de la clienta. Un cambio de precio llega a la lista HTML, la textura WebGL del flyer, el formulario (cargo express), el JSON-LD y `llms.txt`.

## Fotos

Las nuevas se suben desde el panel. Si las prepara Flouvia: enderezar según EXIF, máximo 2400 px y **sin metadatos** (las fotos de celular traen ubicación GPS). Astro genera los tamaños responsive.

### Fotos fijas del sitio (`src/data/work.ts`)

No se editan en el panel, así la clienta no puede borrar una foto del hero al quitar una pieza. Son 13, en `src/assets/work/`, y se piden con `byId('…')`:

| Sección | Fotos |
|---|---|
| Hero | proceso-manos, proceso-maquina, atelier-boceto-bn (la única en blanco y negro), proceso-mesa |
| Esencia | proceso-retrato, proceso-corte, proceso-prueba-tela (sin pies de foto) |
| Menú (preview) | novia-salon, noche-negro, disponible-verde-frente, taller-terracota, noche-azul |
| 404 | taller-terracota, novia-detalle, noche-negro |

El preview del menú es efímero y puede repetir fotos de la galería. Servicios y Cita no llevan fotos.

### Photoshoot profesional del taller

- La fotógrafa entregó 85 fotos en Pixieset (`anaTereAtelier-N.jpg`, 7008×4672); el zip original queda con la clienta. Muchas de las restantes son casi iguales o versiones en blanco y negro.
- **Regla:** no se usan tomas donde se lea el letrero "ANA GARCIA ATELIER" de la pared, porque la marca del sitio es Anter House.

## Clips (`src/data/films.ts`)

Dos clips cortos que mandó la clienta (2026-10-23, `AnaTere1 2.mov` y `AnaTere2.mov`): el boceto que se colorea (960×640) y el cuaderno que se hojea (640×960, en blanco y negro con CSS). Van en el footer, y el del cuaderno es también la pantalla de carga (`filmById('cuaderno')`). Duraban 2.4 s y 1.9 s con un cuadro negro al inicio, así que se convirtieron (AVFoundation en la Mac, sin ffmpeg) a loops H.264 sin audio en `public/video/`:

- `boceto.mp4`: ida y vuelta (la cámara se desliza lento, así el loop es continuo).
- `cuaderno.mp4`: fundido de 4 cuadros entre el final y el inicio (las hojas se mueven rápido; un fundido más largo deja fantasmas de la mano).

Los pósters (`src/assets/video/*-poster.jpg`) son el primer cuadro del loop. Con reduced motion solo se ve el póster.

## Contacto (`src/data/site.ts`)

- WhatsApp: 81 1719 7371 (enlace `wa.me` con mensaje prellenado).
- Instagram: @anter_house.
- Zona: Costco Las Torres, Monterrey, N.L. Solo con cita previa.

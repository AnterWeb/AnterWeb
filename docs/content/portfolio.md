# Contenido: portafolio, precios y contacto

## Fotos y piezas (`src/data/work.ts`)

`work.ts` separa dos cosas:

- **`photos`**: cada foto suelta (`id`, `image`, `alt`, `focus`). Hero, Esencia, 404, menú, OG y la colección las piden con `byId('novia-salon')`.
- **`pieces`**: cada prenda del portafolio (`id`, `title`, `category`, `photos`). Diseños muestra **una tarjeta por pieza**; si tiene varias fotos, se hojean con el mouse y el lightbox las recorre todas. La primera foto es la portada.

Los grupos de Diseños salen de `categories`: Novias y Fiesta (boceto de la clienta). Las piezas en maniquí (terracota, champagne) van en Fiesta. Los nombres de archivo `noche-*` y `taller-*` son históricos.

`islands/gallery/groups.ts` arma los grupos con las imágenes optimizadas: `designGroups()` para Diseños y `collectionGroup()` para Piezas disponibles.

Fotos en `src/assets/work/`. Las nuevas se procesan con sharp: se enderezan según EXIF, se limitan a 2400 px y se guardan **sin metadatos** (las fotos de celular traen ubicación GPS). Astro genera los tamaños responsive.

| Pieza | Título | Grupo | Fotos (la primera es portada) |
|---|---|---|---|
| `novia` | Vestido de novia | novias | `novia-salon`, `novia-alcatraces`, `novia-espalda` |
| `despedida` | Despedida | novias | `novia-terraza`, `novia-espejo`, `novia-detalle` |
| `lila` | Lila con capa | fiesta | `fiesta-lila-frente`, `fiesta-lila-capa`, `fiesta-lila-vuelo` |
| `fucsia-olan` | Fucsia strapless con olán | fiesta | `fiesta-fucsia-olan`, `-pose`, `-entrada` |
| `negro` | Strapless negro con rosa | fiesta | `noche-negro-taller`, `noche-negro`, `noche-negro-taller-bn` |
| `terracota` | Satín terracota, un hombro | fiesta | `taller-terracota` |
| `azul` | Azul rey, hombros caídos | fiesta | `noche-azul` |
| `champagne` | Champagne drapeado | fiesta | `taller-champagne` |
| `fucsia` | Fucsia con flores 3D | fiesta | `noche-fucsia` (`focus` hacia la prenda) |
| `coral` | Shantung coral con lazo | fiesta | `noche-coral` |

Títulos: los de Novias los dio la clienta (2026-10-12); los de Fiesta son provisionales.

Las fotos `proceso-*` (sesión del taller) están en `photos` pero no en `pieces`: las usan el hero, Esencia y Proceso.

### Photoshoot profesional del taller

- La fotógrafa entregó 85 fotos en Pixieset (`anaTereAtelier-N.jpg`, 7008×4672). En el sitio hay 14; el zip original queda con la clienta. Muchas de las restantes son casi iguales o versiones en blanco y negro.
- **Regla:** no se usan tomas donde se lea el letrero "ANA GARCIA ATELIER" de la pared, porque la marca del sitio es Anter House.
- De la sesión salen las fotos del hero, de Esencia y de Proceso, y dos más del vestido negro con rosa (`noche-negro-taller*`), que es el mismo de la foto del evento. Si una foto necesita encuadre, `focus` también se aplica en el hero.

### Uso fuera de la galería (sin repetir)

| Sección | Fotos |
|---|---|
| Hero | proceso-manos, proceso-maquina, atelier-boceto-bn (la única en blanco y negro), proceso-mesa (sesión del taller, no son piezas) |
| Esencia | proceso-retrato, proceso-corte, proceso-prueba-tela (photoshoot del taller, sin pies de foto) |
| Proceso | proceso-boceto, proceso-patron, proceso-prueba, proceso-costura (`data/process.ts`) |
| Galería | todas |

El preview del menú es efímero y puede repetir (Piezas disponibles usa `disponible-verde-frente`). Servicios y Cita no llevan fotos.

### Clips del footer (`src/data/films.ts`)

Dos clips cortos que mandó la clienta (2026-10-23, `AnaTere1 2.mov` y `AnaTere2.mov`): el boceto que se colorea (960×640) y el cuaderno que se hojea (640×960, en blanco y negro con CSS). Duraban 2.4 s y 1.9 s con un cuadro negro al inicio, así que se convirtieron (AVFoundation en la Mac, sin ffmpeg) a loops H.264 sin audio en `public/video/`:

- `boceto.mp4`: ida y vuelta (la cámara se desliza lento, así el loop es continuo).
- `cuaderno.mp4`: fundido de 4 cuadros entre el final y el inicio (las hojas se mueven rápido; un fundido más largo deja fantasmas de la mano).

Los pósters (`src/assets/video/*-poster.jpg`) son el primer cuadro del loop. Con reduced motion solo se ve el póster.

### Agregar una pieza

1. Procesa cada foto (enderezar, 2400 px, sin metadatos) y cópiala a `src/assets/work/categoria-descripcion.jpg`.
2. Impórtalas en `work.ts` y agrega un objeto por foto en `photos` (`id`, `image`, `alt` y, si hace falta, `focus`).
3. Para Diseños, agrega la pieza en `pieces` con sus ids de foto en orden. Fotos del mismo vestido van en **una sola pieza**, nunca como piezas separadas. Para la colección a la venta, agrega el modelo en `collection.ts` con una opción por color.
4. La galería y el lightbox se actualizan solos.

## Colección a la venta (`src/data/collection.ts`)

Piezas disponibles es la **Colección Otoño/Invierno 2026** (`collectionTitle`), en un solo grupo (la clienta tiene pocas prendas y pidió no separarlas en Vestidos y Blusas). Cada modelo es una tarjeta con sus **opciones** (`options`): un color, o una prenda del conjunto en el caso de la blusa lila con pantalón. Cada opción tiene `label`, `swatch` (color de la muestra, tomado de la foto), `photos`, `price` (MXN), `sizes` y `soldOut`; `focus` encuadra la foto cuando dos opciones la comparten (el pantalón encuadra abajo).

En la tarjeta, las muestras de color son radios: al elegir una pasan sus fotos (con la ola de satín) y cambian el precio y las tallas. La tarjeta abre en la primera opción con tallas disponibles.

| Modelo | Opciones (precio, tallas) | Fotos |
|---|---|---|
| Vestido halter | Negro ($1,500, CH M G) · Ivory ($900, CH M G) | `disponible-negro-*`, `disponible-ivory-*` |
| Vestido cuello caído | Verde olivo y Café ($1,800, CH M G) | `disponible-verde-*`, `disponible-cafe-*` |
| Top strapless | Café ($300, CH vendida, M G) · Blanco ($300, CH M G) | `disponible-top-cafe`, `disponible-top-blanco` |
| Blusa con encaje | Negra ($450, CH M G) · Café ($450, CH vendida, M G) | `disponible-blusa-negra`, `disponible-blusa-cafe` |
| Blusa de un hombro y pantalón | Blusa lila ($500) · Pantalón negro ($800), los dos CH M G EG | `disponible-blusa-lila` (la comparten) |

Precios y tallas los mandó la clienta (2026-10-23). El top que antes decía "negro" es café oscuro (así lo nombra la clienta); su foto ahora es `disponible-top-cafe`.

### Marcar una talla vendida

La clienta avisa qué se vendió (por ejemplo, después de un open house). **No se publican cantidades por talla**, solo si hay o no:

1. En `collection.ts`, agrega la talla al `soldOut` de su opción: `soldOut: ['CH']`. La talla se ve tachada con "Sold out" y borde de puntada.
2. Si se venden todas las tallas de una opción, esa opción entera se ve "Sold out" (sello sobre la foto y muestra tachada); la tarjeta abre en otra opción si queda alguna.
3. Si una prenda ya no se va a vender, quita su opción (o el modelo completo). `llms.txt` se actualiza solo.

`islands/gallery/groups.ts → galleryGroups(section)` arma los grupos con las imágenes optimizadas para cada sección.

## Precios (`src/data/services.ts`)

Vienen del flyer "Confección y ajustes" (`docs/brand/refs/flyer-confeccion-ajustes.jpg`), en MXN. La hoja se titula "Servicios" (`priceListTitle`) por petición de la clienta. Al cambiar un precio se actualizan la lista HTML, la textura WebGL, el JSON-LD y `llms.txt`.

## Contacto (`src/data/site.ts`)

- WhatsApp: 81 1719 7371 (enlace `wa.me` con mensaje prellenado).
- Instagram: @anter_house.
- Zona: Costco Las Torres, Monterrey, N.L. Solo con cita previa.

# Navegación

No es una barra típica. Son tres piezas fijas, en `slot="fixed"` del Layout:

## Header flotante (`layout/Header.astro`)

- Sin fondo ni barra. A la izquierda va la marca apilada `ANTER / HOUSE`. A la derecha van los íconos de Instagram y WhatsApp, el enlace "Agenda tu cita" y el botón **Menú** (píldora tinta).
- Con el menú abierto (`html.menu-open`), el header pasa a tono claro.
- Un velo en degradado del color de la página (`::before`, `--fondo`) hace que el contenido se desvanezca bajo la marca al hacer scroll.

## Menú a pantalla completa (`layout/Menu.astro` + `scripts/menu.ts`)

- Overlay tinta que se abre con clip-path. Los ítems usan Italiana grande con stagger, como el índice del hero.
- Al pasar el cursor o enfocar un ítem aparece una foto de preview; la define `preview` en `data/site.ts → nav`.
- Al pie: WhatsApp, Instagram y ubicación con íconos.
- Esc cierra el menú y el foco vuelve al botón. El scroll se pausa mientras está abierto (`lockScroll`).

## Ticker de sección (`layout/SectionTicker.astro` + `scripts/ticker.ts`)

- Esquina inferior izquierda: `02 / 05 — Diseños` y una barra de progreso de lectura.
- Lee `data-section` y `data-section-label` de cada sección y anima el cambio de texto.
- Aparece al salir del hero y se oculta al llegar al footer.
- En móvil (≤ 640 px) se centra abajo, dentro de una píldora translúcida, para leerse sobre cualquier contenido.

Para agregar una sección a la navegación: súmala a `nav` en `data/site.ts` y ponle `id`, `data-section` y `data-section-label`.

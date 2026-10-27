# Movimiento (GSAP)

Principio: **elegante y amortiguado**. El movimiento acompaña al scroll; nunca compite con las fotos.

## Base

- `src/scripts/motion/gsap.ts` registra ScrollTrigger y ScrollSmoother una sola vez y exporta `MOTION_OK` y `motionAllowed()`.
- Todo efecto vive dentro de `gsap.matchMedia().add(MOTION_OK, …)`. Con reduced motion no se anima nada y el contenido queda visible.

## Scroll suave: `smooth.ts`

- ScrollSmoother con `smooth: 1.1` y `effects: false`; usamos atributos propios, no `data-speed`.
- `Layout.astro` envuelve el contenido en `#smooth-wrapper > #smooth-content`. Los elementos fijos van en `slot="fixed"`, fuera del wrapper.
- Las anclas `a[href^="#"]` se interceptan solo si el destino existe en la página. Al llegar con un hash (p. ej. `/#cita`), se desplaza al cargar.
- `lockScroll(true|false)` pausa el smoother; lo usan el menú y el lightbox.

## Anti-parpadeo

1. Un script inline en `<head>` añade `.js` a `<html>`.
2. `global.css`, solo bajo `prefers-reduced-motion: no-preference`, define los estados iniciales: `[data-reveal]` (opacity 0, y 28px), `[data-clip]` (clip-path cerrado) y `[data-words] .word` (opacity 0.18).
3. GSAP anima hacia el estado final con `gsap.to` o `fromTo`. No uses `gsap.from(..., { immediateRender: false })`.

## Atributos declarativos (`reveal.ts`)

| Atributo | Efecto |
|---|---|
| `data-reveal` (+ `data-reveal-delay`) | Fade y subida una vez al entrar (batch) |
| `data-clip` | La imagen (o el video) se destapa de abajo hacia arriba y el `img`/`video` interno pasa de 1.22 a 1, con scrub |
| `data-parallax="-0.15"` | Desplazamiento `yPercent` mientras cruza el viewport |
| `data-words` | Cada `.word` se ilumina con el scroll; lo genera `ui/WordReveal.astro` |

## Efectos por componente

| Script | Dónde | Qué hace |
|---|---|---|
| `loader.ts` | Pantalla de carga | El clip del cuaderno y su relevo a la foto B/N del hero (ver abajo) |
| `hero.ts` | Hero y 404 | Fotos con clip-path (`data-photo`), letras con stagger (`data-letter`, spans o paths del SVG) y parallax (`data-drift`, puede envolver foto + pie). En la landing la entrada espera a que se abra la pantalla de carga (`afterLoader`) |
| `pointerDepth.ts` | 404 | Fotos con profundidad según el cursor (`data-depth`) |
| `footer.ts` | Footer | El wordmark se arma letra por letra con el scroll |
| `films.ts` | Footer | Los clips se reproducen en loop solo mientras se ven (IntersectionObserver); con reduced motion queda el póster |
| `DesignGallery.tsx` | Diseños y Piezas disponibles | Las tarjetas de cada grupo suben en cascada al entrar |
| `islands/gallery/transitions.ts` | Lightbox | GSAP Flip: la foto vuela de la tarjeta al lightbox y regresa al cerrar |
| `webgl/satin.ts` | Tarjetas de la galería | Al hojear fotos con el mouse, una ola de satín cruza la imagen (ver `docs/experience/webgl.md`) |

## Galería (detalles)

- Cada grupo (Novias, Fiesta) es una tira con scroll horizontal nativo y `scroll-snap`; no hay pin ni scroll secuestrado.
- Una tarjeta por vestido. Si tiene varias fotos, la posición del mouse sobre la foto elige cuál se ve y unas rayitas abajo indican cuántas hay. Cada cambio pasa con la ola de satín (WebGL) sobre un fundido CSS de 0.6 s, que es el respaldo sin WebGL. Al salir, la portada vuelve solo con el fundido. En touch no hay hojeo: al tocar se abre el lightbox, que recorre foto por foto.
- **Lightbox con Flip:** la tarjeta (`.gallery__media`) y la foto del lightbox (`.lightbox__media`) comparten `data-flip-id`.
  - Al abrir, la foto crece desde el lugar exacto de la tarjeta mientras el fondo se oscurece. Los botones y el pie aparecen al final.
  - Mientras carga la foto grande se ve la miniatura en caché, así el vuelo nunca muestra un hueco.
  - Al cerrar, si la tarjeta está a la vista la foto regresa a ella (y se funde si la tarjeta muestra otra foto); si no, todo se desvanece.
- Las flechas solo aparecen si la tira desborda. El borde derecho se desvanece (máscara) mientras quedan piezas por ver.
- Con reduced motion no hay cascada de entrada, las fotos cambian sin fundido, el lightbox abre y cierra sin vuelo y las flechas desplazan sin animación.

## Pantalla de carga (`layout/Loader.astro` + `motion/loader.ts`)

El clip del cuaderno que se hojea (`data/films.ts`, en blanco y negro con CSS) al centro sobre el salvia, con ANTER debajo. Tres tiempos:

1. **Entrada:** el clip se destapa de abajo hacia arriba (`clip-path`, 1.1 s) y su video pasa de 1.2 a 1, como las fotos del sitio; las letras de ANTER suben en cascada.
2. **Espera:** al menos una vuelta del clip (`MIN_TIME`, 1.8 s), a que termine la entrada y a que la página cargue (evento `load` + fuentes, máximo 4 s).
3. **Relevo:** el clip vuela al lugar de la foto en blanco y negro del hero (`.hero__photo--workshop`, la misma escena: la diseñadora con su cuaderno) mientras el salvia se desvanece y entra el hero (`afterLoader` en `hero.ts`); al llegar, se funde en esa foto, que ya está destapada debajo. Si la foto no está a la vista, el clip se encoge y se desvanece.

Respaldos y reglas:

- Solo existe con JS y movimiento permitido. Con reduced motion el script la quita y el hero no espera.
- Si el script no corre, se desvanece sola a los 6 s (`loader-failsafe` en el CSS).
- El scroll queda bloqueado (`lockScroll`) hasta el relevo.
- Dura alrededor de 2 s. Se ve en cada carga de la landing (no en la 404).
- Hasta el 2026-10-26 la pantalla de carga eran unas tijeras 3D que cortaban una hoja de papel; la clienta pidió quitarlas y usar este clip.

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
| `loader.ts` | Pantalla de carga | La coreografía de las tijeras y la hoja (ver abajo) |
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

Una hoja de papel de patrón (lino) con ANTER impreso, marcas de corte en las esquinas y una puntada que atraviesa la palabra. Cuatro tiempos:

1. **Papel** (0–1.1 s): las letras suben en cascada y la puntada se dibuja de izquierda a derecha. Las dos solapas llevan la palabra en el mismo lugar; cada una recorta su mitad, así que se animan juntas (`stagger` por índice dentro de cada copia).
2. **Aterrizaje**: las tijeras 3D caen desde cerca de la cámara, abiertas y giradas, y se asientan con `power3.out`; la sombra se cierra y oscurece al bajar. Si la página aún no carga (evento `load` + fuentes, máximo 4 s), esperan abriendo y cerrando despacio.
3. **Corte**: tres o cuatro tijeretazos (tres en móvil). Cada uno abre en 0.16 s retrocediendo un poco, cierra en 0.11 s y empuja hacia adelante. El corte llega hasta donde se cruzan las hojas (junto al perno si están abiertas, en la punta si cierran) y deja una rendija en cuña (`--cut` y `--gap` en el `clip-path` de las solapas) que también parte las letras. La puntada solo queda delante del corte.
4. **Salida**: las tijeras se levantan hacia la cámara y salen por arriba a la derecha. La hoja HTML se cambia en el mismo cuadro por dos solapas 3D idénticas, que se enrollan desde el corte hacia afuera, y entra el hero (`afterLoader` en `hero.ts`).

Respaldos y reglas:

- Solo existe con JS y movimiento permitido. Con reduced motion el script la quita y el hero no espera.
- Si el script no corre, la hoja se desvanece sola a los 6 s (`loader-failsafe` en el CSS).
- Sin WebGL, o si Three.js tarda más de 1.8 s, la rendija corre sola por la puntada y las solapas HTML se deslizan con una leve inclinación (`slideOpen`).
- El scroll queda bloqueado (`lockScroll`) hasta que la hoja empieza a abrirse.
- Dura alrededor de 2.5 s hasta que asoma la página. Se ve en cada carga de la landing (no en la 404).

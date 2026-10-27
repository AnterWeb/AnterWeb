# WebGL

Dos piezas: el flyer de precios (Three.js) y el efecto satín de la galería (WebGL puro).

## Flyer de papel con chinche

Archivos: `components/blocks/PriceFlyer.astro` y `scripts/webgl/` (`priceFlyer.ts`, `pushPin.ts`, `flyerTexture.ts`, `shaders/*.glsl`).

## Carga

- `PriceFlyer.astro` observa el bloque y hace `import()` de `priceFlyer.ts` cuando está a 600 px del viewport. Three.js (unos 530 KB, unos 130 KB comprimido) no entra en la carga inicial.
- Sin WebGL, o si falla la inicialización, se queda la lista HTML (`PriceList.astro`).
- Con WebGL, la lista sigue en el DOM pero visualmente oculta, para lectores de pantalla y buscadores.

## Escena

```
board   (inclinación con el cursor + entrada con scroll)
├── pin     chinche fija: LatheGeometry + MeshPhysicalMaterial con clearcoat + sombra de contacto
└── pivot   balanceo en Z alrededor de la chinche (resorte amortiguado)
    ├── shadow  sombra suave de la hoja
    └── paper   ShaderMaterial: ondulación, curvatura lejos de la chinche y hendidura bajo el cursor
```

- **Textura:** se dibuja en canvas 2D desde `services.ts` (`flyerTexture.ts`), así que los precios nunca divergen de la UI. `PIN_X`/`PIN_Y` ubican la perforación.
- **Luz:** `RoomEnvironment` (PMREM) para los reflejos de la chinche, más luz hemisférica y direccional. El papel no usa luces de three: su shader sombrea con la normal real de la superficie deformada.
- **Tone mapping:** `NeutralToneMapping`, que solo afecta a la chinche.
- **Sin recortes:** el canvas sangra fuera de su caja (`BLEED_X`/`BLEED_Y` en `priceFlyer.ts` = `inset` negativo en el CSS) y tiene `pointer-events: none`. Los eventos los escucha la caja.
- **Rendimiento:** solo renderiza mientras está en pantalla (IntersectionObserver) y con DPR máximo de 2.

## Ajustes finos (`priceFlyer.ts`)

| Constante | Efecto |
|---|---|
| `MAX_TILT_X`, `MAX_TILT_Y` | Cuánto se inclina con el cursor |
| `STIFFNESS`, `DAMPING` | Resorte del balanceo: más rigidez da menos amplitud, más amortiguación lo detiene antes |
| `REST_ANGLE` | Inclinación de reposo de la hoja |
| `FILL` | Qué tanto ocupa la hoja de su caja |

El tamaño de la chinche está en `group.scale` de `pushPin.ts` (escala real: la cabeza mide alrededor del 6 % del ancho de la hoja).

Con reduced motion se dibuja un solo cuadro estático.

## Efecto satín al hojear fotos (`scripts/webgl/satin.ts`)

Al cambiar de foto en una tarjeta con el mouse, una ola cruza la imagen. La pliega levemente (desplazamiento de alrededor del 2 %), deja un brillo tenue en la cresta y detrás de ella ya está la foto nueva. Dura 0.8 s.

- **Sin Three.js:** es un solo rectángulo con `shaders/satin.vert.glsl` y `satin.frag.glsl`, unos pocos KB dentro de la isla de la galería.
- **Un solo canvas** para toda la página, creado en el primer cambio. Se inserta en la `.gallery__media` de la tarjeta (debajo de las rayitas), dibuja la ola y se esconde.
- **Coincidencia exacta:** el shader replica `object-fit: cover` y `object-position` de cada `<img>` (`coverOf`), y el canvas lleva el mismo zoom de hover (`scale: 1.05`). Las texturas salen de las mismas `<img>` ya cargadas y se guardan en un `WeakMap`.
- **Respaldo:** debajo siempre corre el fundido CSS de la tarjeta. Si no hay WebGL, si la foto destino aún no carga o si hay reduced motion, solo se ve ese fundido.
- **Ajustes:** `BAND` (ancho de la ola), la amplitud de `shift` y la intensidad del brillo en el shader; `DURATION` en `satin.ts`.

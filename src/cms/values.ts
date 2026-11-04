// Valores del esquema del panel que comparten el panel (keystatic.config.tsx, fields.tsx), la página (data/cms.ts)
// y las pruebas del contenido (tests/content.test.ts). Sin dependencias, para que Node lo importe tal cual.

/** Tallas de la colección, en el orden en que se muestran */
export const SIZES = ['CH', 'M', 'G', 'EG'] as const;
export type Size = (typeof SIZES)[number];

/** Estado de una talla que sí se hace; la que no se hace no aparece en el JSON */
export const SIZE_STATES = ['disponible', 'agotada'] as const;
export type SizeState = (typeof SIZE_STATES)[number];

/** Talla → estado */
export type SizesValue = Partial<Record<Size, SizeState>>;

/** Cómo se encuadra una foto en su tarjeta (object-position) */
export const FRAMING = {
  centro: '50% 50%',
  arriba: '50% 20%',
  abajo: '50% 100%',
  izquierda: '30% 50%',
  derecha: '70% 50%',
} as const;
export type Framing = keyof typeof FRAMING;

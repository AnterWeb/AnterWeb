// Campos a la medida del panel (Keystatic), con la gramática del sitio:
//   colorField  muestras redondas como las de la tarjeta de la colección, con los colores de las prendas
//   sizesField  las píldoras de talla de la tarjeta: se tocan para pasar de "disponible" a "sold out"
// Sus estilos viven en src/cms/admin.css.
import { useId, useRef } from 'react';
import type { BasicFormField } from '@keystatic/core';

export const SIZES = ['CH', 'M', 'G', 'EG'] as const;
export type Size = (typeof SIZES)[number];
export type SizeState = 'disponible' | 'agotada';
/** Talla → estado; una talla que no aparece no se hace en esa prenda */
export type SizesValue = Partial<Record<Size, SizeState>>;

/** Colores de prenda frecuentes: los de la colección y los básicos de fiesta */
export const PRESET_COLORS = [
  { name: 'Negro', hex: '#1f1d1b' },
  { name: 'Blanco', hex: '#f3f1ec' },
  { name: 'Ivory', hex: '#e2d3b3' },
  { name: 'Champagne', hex: '#d8c3a0' },
  { name: 'Verde olivo', hex: '#7f7a5c' },
  { name: 'Café', hex: '#7a4b2c' },
  { name: 'Chocolate', hex: '#3b2219' },
  { name: 'Vino', hex: '#5b2d21' },
  { name: 'Terracota', hex: '#b4552f' },
  { name: 'Lila', hex: '#c8aecb' },
  { name: 'Rosa', hex: '#e3b7b5' },
  { name: 'Fucsia', hex: '#c2246e' },
  { name: 'Azul rey', hex: '#2b4a9b' },
] as const;

const HEX = /^#[0-9a-f]{6}$/i;

function FieldShell({ label, description, children, invalid }: { label: string; description?: string; children: React.ReactNode; invalid?: string }) {
  const id = useId();
  return (
    <div className="ah-field" role="group" aria-labelledby={id}>
      <span id={id} className="ah-field__label">
        {label}
      </span>
      {description && <span className="ah-field__help">{description}</span>}
      {children}
      {invalid && <span className="ah-field__error">{invalid}</span>}
    </div>
  );
}

/** Muestra de color de una opción: se elige de la paleta o con el selector libre. */
export function colorField({ label, description }: { label: string; description?: string }): BasicFormField<string> {
  return {
    kind: 'form',
    label,
    Input({ value, onChange, forceValidation }) {
      const picker = useRef<HTMLInputElement>(null);
      const custom = HEX.test(value) && !PRESET_COLORS.some((color) => color.hex.toLowerCase() === value.toLowerCase());
      return (
        <FieldShell label={label} description={description} invalid={forceValidation && !HEX.test(value) ? 'Elige un color.' : undefined}>
          <div className="ah-swatches" role="radiogroup" aria-label={label}>
            {PRESET_COLORS.map((color) => {
              const checked = color.hex.toLowerCase() === value.toLowerCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  title={color.name}
                  className="ah-swatch"
                  style={{ '--swatch': color.hex } as React.CSSProperties}
                  onClick={() => onChange(color.hex)}
                >
                  <span className="ah-swatch__name">{color.name}</span>
                </button>
              );
            })}
            <button
              type="button"
              role="radio"
              aria-checked={custom}
              title="Otro color"
              className="ah-swatch ah-swatch--custom"
              style={custom ? ({ '--swatch': value } as React.CSSProperties) : undefined}
              onClick={() => picker.current?.click()}
            >
              <span className="ah-swatch__name">Otro</span>
            </button>
            <input
              ref={picker}
              className="ah-swatches__picker"
              type="color"
              value={HEX.test(value) ? value : '#1f1d1b'}
              onChange={(event) => onChange(event.target.value)}
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </FieldShell>
      );
    },
    defaultValue: () => '',
    parse: (value) => (typeof value === 'string' ? value : ''),
    serialize: (value) => ({ value: value || undefined }),
    validate: (value) => {
      if (!HEX.test(value)) throw new Error('Elige un color para la muestra.');
      return value;
    },
    reader: { parse: (value) => (typeof value === 'string' ? value : '') },
  };
}

const NEXT: Record<'no' | SizeState, 'no' | SizeState> = { no: 'disponible', disponible: 'agotada', agotada: 'no' };
const STATE_LABEL = { no: 'No se hace', disponible: 'Disponible', agotada: 'Sold out' };

/** Tallas de una opción: cada píldora pasa de "no se hace" a "disponible" a "sold out". */
export function sizesField({ label }: { label: string }): BasicFormField<SizesValue> {
  const parse = (value: unknown): SizesValue => {
    if (!value || typeof value !== 'object') return {};
    const sizes: SizesValue = {};
    for (const size of SIZES) {
      const state = (value as Record<string, unknown>)[size];
      if (state === 'disponible' || state === 'agotada') sizes[size] = state;
    }
    return sizes;
  };
  return {
    kind: 'form',
    label,
    Input({ value, onChange, forceValidation }) {
      const empty = !SIZES.some((size) => value[size]);
      return (
        <FieldShell
          label={label}
          description="Toca una talla para cambiarla: disponible, sold out o no se hace."
          invalid={forceValidation && empty ? 'Marca al menos una talla.' : undefined}
        >
          <div className="ah-sizes">
            {SIZES.map((size) => {
              const state = value[size] ?? 'no';
              return (
                <button
                  key={size}
                  type="button"
                  className="ah-size"
                  data-state={state}
                  aria-label={`${size}: ${STATE_LABEL[state]}`}
                  onClick={() => {
                    const next = { ...value };
                    const after = NEXT[state];
                    if (after === 'no') delete next[size];
                    else next[size] = after;
                    onChange(next);
                  }}
                >
                  <span className="ah-size__name">{size}</span>
                  <span className="ah-size__state">{STATE_LABEL[state]}</span>
                </button>
              );
            })}
          </div>
        </FieldShell>
      );
    },
    defaultValue: () => ({ CH: 'disponible', M: 'disponible', G: 'disponible' }),
    parse,
    serialize: (value) => ({ value: { ...value } }),
    validate: (value) => {
      if (!SIZES.some((size) => value[size])) throw new Error('Marca al menos una talla.');
      return value;
    },
    reader: { parse },
  };
}

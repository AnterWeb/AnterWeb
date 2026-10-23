// Debajo de una prenda a la venta: sus colores (o las prendas del conjunto), el precio y las tallas.
// Las muestras son radios: al elegir una, la tarjeta pasa a sus fotos. Las tallas vendidas se tachan con "Sold out".
import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import type { GalleryOption } from './types';

interface Props {
  title: string;
  options: GalleryOption[];
  choice: number;
  onChoose: (index: number) => void;
}

export default function PieceOptions({ title, options, choice, onChoose }: Props) {
  const group = useRef<HTMLDivElement>(null);
  const option = options[choice];

  // Patrón de radio: Tab entra a la muestra elegida y las flechas cambian de opción.
  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (choice + step + options.length) % options.length;
    onChoose(next);
    group.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div className="gallery__shop">
      <div className="gallery__shop-row">
        <div ref={group} className="gallery__swatches" role="radiogroup" aria-label={`${title}: opciones`} onKeyDown={onKeyDown}>
          {options.map((o, i) => (
            <button
              key={o.label}
              type="button"
              role="radio"
              className="gallery__swatch"
              aria-checked={i === choice}
              aria-label={o.soldOut ? `${o.label}, sold out` : o.label}
              tabIndex={i === choice ? 0 : -1}
              data-sold-out={o.soldOut}
              style={{ '--swatch': o.swatch } as CSSProperties}
              onClick={() => onChoose(i)}
            />
          ))}
          <span className="gallery__option" aria-hidden="true">
            {option.label}
          </span>
        </div>
        <span className="gallery__price">{option.price}</span>
      </div>

      <ul className="gallery__sizes" aria-label={`Tallas: ${option.label}`}>
        {option.sizes.map(({ size, soldOut }) => (
          <li key={size} data-sold-out={soldOut}>
            <span className="gallery__size">{size}</span>
            {soldOut && <span className="gallery__sold">Sold out</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

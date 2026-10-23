// Tarjeta de una pieza. Si tiene varias fotos, se hojean en la misma tarjeta:
// con el mouse, la posición horizontal sobre la foto elige la imagen; las rayitas de abajo indican cuántas hay.
// Cada cambio pasa con la ola de satín (scripts/webgl/satin.ts) sobre el fundido CSS.
// En touch no hay hover: al tocar se abre el lightbox, que recorre todas las fotos de la pieza.
// Prendas a la venta (item.options): abajo van sus colores, precio y tallas. Al elegir un color la tarjeta
// pasa a sus fotos (también con la ola) y solo se hojean las de ese color.
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { satinSwap } from '../../../scripts/webgl/satin';
import PieceOptions from './PieceOptions';
import type { GalleryItem } from './types';

interface Props {
  item: GalleryItem;
  index: number;
  onOpen: (id: string, photoIndex: number) => void;
}

export default function GalleryCard({ item, index, onOpen }: Props) {
  const { options } = item;
  // Abre en la primera opción con tallas disponibles
  const [choice, setChoice] = useState(() => Math.max(0, options?.findIndex((o) => !o.soldOut) ?? 0));
  const option = options?.[choice];
  /** Fotos que se hojean: las de la opción elegida o todas las de la pieza */
  const set = option?.photos ?? item.photos.map((_, i) => i);
  const [active, setActive] = useState(set[0]);
  const media = useRef<HTMLSpanElement>(null);
  const shown = useRef(active);
  /** El cambio viene de hojear o de elegir una opción: pasa con la ola */
  const wave = useRef(false);
  const count = set.length;

  // Al salir, la portada vuelve con el fundido simple.
  useEffect(() => {
    const previous = shown.current;
    shown.current = active;
    if (previous === active || !wave.current || !media.current) return;
    const imgs = media.current.querySelectorAll('img');
    satinSwap(media.current, imgs[previous], imgs[active], active > previous ? 1 : -1);
  }, [active]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (count < 2 || event.pointerType !== 'mouse') return;
    wave.current = true;
    const box = event.currentTarget.getBoundingClientRect();
    const next = Math.floor(((event.clientX - box.left) / box.width) * count);
    setActive(set[Math.min(count - 1, Math.max(0, next))]);
  };

  const onPointerLeave = () => {
    wave.current = false;
    setActive(set[0]);
  };

  const choose = (next: number) => {
    if (!options) return;
    wave.current = true;
    setChoice(next);
    setActive(options[next].photos[0]);
  };

  const name = option ? `${item.title}, ${option.label}` : item.title;

  return (
    <li className="gallery__item">
      <button
        type="button"
        className="gallery__card"
        onClick={() => onOpen(item.id, active)}
        aria-label={count > 1 ? `Ver ${name} (${count} fotos)` : `Ver ${name}`}
      >
        <span
          ref={media}
          className="gallery__media"
          data-flip-id={item.id}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          {item.photos.map((photo, i) => {
            const focus = option?.focus ?? photo.focus;
            return (
              <img
                key={photo.src}
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(max-width: 640px) 60vw, 17rem"
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                data-active={i === active}
                aria-hidden={i !== active}
                style={focus ? { objectPosition: focus } : undefined}
              />
            );
          })}

          {option?.soldOut && <span className="gallery__badge">Sold out</span>}

          {count > 1 && (
            <span className="gallery__dots" aria-hidden="true">
              {set.map((i) => (
                <span key={i} data-active={i === active} />
              ))}
            </span>
          )}
        </span>

        <span className="gallery__caption">
          <span className="gallery__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="gallery__item-title">{item.title}</span>
        </span>
      </button>

      {options && <PieceOptions title={item.title} options={options} choice={choice} onChoose={choose} />}
    </li>
  );
}

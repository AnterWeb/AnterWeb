// Favicon: la A del logo original (data/wordmark.ts) en hueso sobre tinta, con su alto contraste de trazo.
// En el modo oscuro del navegador se invierte (A tinta sobre hueso) para no perderse en la barra oscura.
// Genera en public/:
//   favicon.svg           el principal (navegadores actuales), con el cambio de modo oscuro
//   favicon.ico           16, 32 y 48 px en PNG, para navegadores viejos y buscadores
//   apple-touch-icon.png  180 px para el inicio del iPhone (sin esquinas: iOS las redondea)
// Uso: npm run favicon. Los colores salen de styles/global.css.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { wordmarkGlyphs } from '../src/data/wordmark.ts';

const root = resolve(import.meta.dirname, '..');
const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
const token = (name) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))[1];
const [tinta, hueso] = ['tinta', 'hueso'].map(token);

// La A mide 811.3 × 755 en las unidades del wordmark
const A = wordmarkGlyphs.find((glyph) => glyph.letter === 'A').d;
const A_WIDTH = 811.3;
const A_HEIGHT = 755;

/** Caja de 64 con la A centrada; `height` es el alto de la A. Sube 0.6 porque su masa visual está abajo. */
function icon({ height, radius, darkMode }) {
  const scale = height / A_HEIGHT;
  const x = (64 - A_WIDTH * scale) / 2;
  const y = (64 - height) / 2 - 0.6;
  const dark = darkMode
    ? `<style>@media (prefers-color-scheme: dark) { .fondo { fill: ${hueso} } .letra { fill: ${tinta} } }</style>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${dark}<rect class="fondo" width="64" height="64" rx="${radius}" fill="${tinta}"/><path class="letra" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(5)})" d="${A}" fill="${hueso}"/></svg>`;
}

const png = (svg, size) => sharp(Buffer.from(svg), { density: (72 * size * 4) / 64 }).resize(size, size).png().toBuffer();

/** ICO con PNG dentro (válido desde Windows Vista y en todos los navegadores). */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

const tab = icon({ height: 37, radius: 14 });
writeFileSync(join(root, 'public/favicon.svg'), icon({ height: 37, radius: 14, darkMode: true }));
writeFileSync(
  join(root, 'public/favicon.ico'),
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tab, size) })))),
);
await sharp(await png(icon({ height: 33, radius: 0 }), 180)).toFile(join(root, 'public/apple-touch-icon.png'));
console.log('Favicon listo: public/favicon.svg, favicon.ico y apple-touch-icon.png');

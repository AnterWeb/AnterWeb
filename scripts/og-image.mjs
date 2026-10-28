// Imagen para compartir (Open Graph, 1200×630): una portada de revista con las fotos, colores y tipografías
// del sitio. Se dibuja como HTML y se captura con Chrome sin ventana a 2x; luego se reduce a 1200×630 para que
// la letra quede nítida. Resultado: src/assets/og/portada.jpg, que usa components/seo/Seo.astro.
// La temporada sale del panel (src/content/coleccion.json) y los colores de styles/global.css: al cambiar la temporada,
// basta con volver a correr `npm run og` (en la Mac; en otro sistema, CHROME=ruta npm run og).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { WORDMARK_HEIGHT, WORDMARK_WIDTH, wordmarkGlyphs } from '../src/data/wordmark.ts';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = resolve(import.meta.dirname, '..');
const file = (path) => pathToFileURL(join(root, path)).href;
const output = join(root, 'src/assets/og/portada.jpg');

// Colores: los mismos tokens del sitio
const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
const token = (name) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))[1];
const [fondo, tinta, terracota] = ['hueso', 'tinta', 'terracota'].map(token);

// La temporada sale del panel (src/content/coleccion.json): "Otoño/Invierno 2026" → "Otoño/Invierno" + "2026"
const { temporada } = JSON.parse(readFileSync(join(root, 'src/content/coleccion.json'), 'utf8'));
const label = 'Colección';
const season = temporada.replace(/\s(\d{4})$/, '<br />$1');

const wordmark = `<svg viewBox="0 0 ${WORDMARK_WIDTH} ${WORDMARK_HEIGHT}" fill="currentColor">${wordmarkGlyphs
  .map((glyph) => `<path d="${glyph.d}" />`)
  .join('')}</svg>`;

const html = `<!doctype html>
<html lang="es-MX">
<meta charset="utf-8" />
<style>
  @font-face { font-family: Italiana; src: url(${file('node_modules/@fontsource/italiana/files/italiana-latin-400-normal.woff2')}); }
  @font-face { font-family: Jost; src: url(${file('node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2')}); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; background: ${fondo}; color: ${tinta}; font-family: Jost; font-weight: 350; -webkit-font-smoothing: antialiased; }
  .display { font-family: Italiana; font-weight: 400; line-height: 0.95; letter-spacing: 0.02em; }
  img { display: block; width: 100%; height: 100%; object-fit: cover; }

  /* Cabecera: el wordmark a todo lo ancho, por encima de la foto que sube detrás de sus letras */
  .masthead { position: absolute; z-index: 2; left: 80px; top: 36px; width: 1040px; }
  .masthead svg { display: block; width: 100%; height: auto; }

  /* Línea de la cabecera: HOUSE y bespoke fashion a los lados de la foto, unidos por filetes */
  .dateline { position: absolute; z-index: 2; top: 222px; display: flex; align-items: center; gap: 18px;
    font-size: 13px; letter-spacing: 0.55em; text-transform: uppercase; }
  .dateline::after { content: ''; width: 92px; height: 1px; background: currentColor; opacity: 0.35; }
  .dateline--start { left: 80px; }
  .dateline--end { right: 80px; flex-direction: row-reverse; letter-spacing: 0.42em; text-transform: none; font-size: 14px; }

  /* Foto principal: el satín drapeado a mano, sangrada abajo */
  .cover { position: absolute; z-index: 1; left: 440px; top: 148px; width: 320px; height: 500px; }
  .cover img { object-position: 52% 50%; }

  /* Titular de la colección */
  .feature { position: absolute; left: 80px; top: 316px; width: 320px; }
  .feature__label { font-size: 30px; color: ${terracota}; }
  .feature__season { margin-top: 10px; font-size: 45px; line-height: 1; }
  .feature__rule { width: 56px; height: 1px; margin: 26px 0 16px; background: ${terracota}; }
  .feature__note { font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; opacity: 0.8; }

  /* La diseñadora en blanco y negro, con el texto vertical del hero */
  .atelier { position: absolute; left: 862px; top: 300px; width: 170px; height: 226px; }
  .atelier img { object-position: 50% 30%; }
  .vertical { position: absolute; left: 1048px; top: 300px; writing-mode: vertical-rl; transform: rotate(180deg);
    font-size: 24px; line-height: 1.05; color: ${terracota}; white-space: nowrap; }
  .est { position: absolute; left: 862px; top: 540px; font-size: 19px; letter-spacing: 0.12em; }
</style>
<body>
  <div class="masthead">${wordmark}</div>
  <p class="dateline dateline--start">House</p>
  <p class="dateline dateline--end">bespoke fashion</p>

  <figure class="cover"><img src="${file('src/assets/work/proceso-manos.jpg')}" alt="" /></figure>

  <div class="feature">
    <p class="feature__label display">${label}</p>
    <p class="feature__season display">${season}</p>
    <div class="feature__rule"></div>
    <p class="feature__note">Monterrey, N.L.</p>
  </div>

  <figure class="atelier"><img src="${file('src/assets/work/atelier-boceto-bn.jpg')}" alt="" /></figure>
  <p class="vertical display">Hecho a tu medida,<br />puntada a puntada.</p>
  <p class="est display">est. 2024</p>
</body>
</html>`;

const work = mkdtempSync(join(tmpdir(), 'anter-og-'));
try {
  const page = join(work, 'portada.html');
  const shot = join(work, 'portada.png');
  writeFileSync(page, html);
  const run = spawnSync(
    CHROME,
    [
      '--headless=new',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      `--user-data-dir=${join(work, 'perfil')}`,
      '--force-device-scale-factor=2',
      '--window-size=1200,630',
      '--virtual-time-budget=5000',
      `--screenshot=${shot}`,
      pathToFileURL(page).href,
    ],
    { stdio: 'ignore' },
  );
  if (run.status !== 0) throw new Error(`Chrome no pudo capturar la portada (${CHROME}): define CHROME con su ruta.`);
  await sharp(shot).resize(1200, 630).jpeg({ quality: 90, mozjpeg: true }).toFile(output);
  console.log(`Portada lista: ${output}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}

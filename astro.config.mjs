// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// Dominio de producción: fuente única para canonical, Open Graph, sitemap, robots y JSON-LD.
// En Vercel sale solo de VERCEL_PROJECT_PRODUCTION_URL (el dominio principal del proyecto: hoy
// anter-web.vercel.app, el proyecto de la clienta; cuando se conecte el dominio de la clienta, ese). SITE_URL lo fuerza a mano.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const SITE_URL = process.env.SITE_URL ?? (productionHost ? `https://${productionHost}` : 'https://anter-web.vercel.app');

// Panel de la clienta (Keystatic, docs/cms.md): en local siempre; en producción cuando ya hay repo de GitHub
// conectado (PUBLIC_KEYSTATIC_GITHUB_REPO) o como demostración de solo lectura (KEYSTATIC_DEMO=1).
// Sin ninguno de los dos, el sitio sigue siendo 100 % estático.
const cmsDemo = process.env.KEYSTATIC_DEMO === '1';
const cmsEnabled = process.argv.includes('dev') || Boolean(process.env.PUBLIC_KEYSTATIC_GITHUB_REPO) || cmsDemo;

/** En la demostración, la función del panel lleva el contenido y sus fotos para poder leerlos */
const cmsFiles = () =>
  ['src/content', 'src/assets/cms'].flatMap((dir) =>
    readdirSync(dir, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => `${entry.parentPath}/${entry.name}`),
  );

/**
 * La integración de Keystatic, con nuestra página del panel (src/cms/AdminPage.astro, con la identidad del sitio)
 * y nuestra API (src/cms/api.ts, que en la demostración no guarda) en lugar de las genéricas.
 * El resto es igual a @keystatic/astro: el módulo virtual de la config.
 * @returns {import('astro').AstroIntegration}
 */
function cms() {
  return {
    name: 'anter-cms',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig, config }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'keystatic',
                resolveId(id) {
                  if (id === 'virtual:keystatic-config') return this.resolve('./keystatic.config', './a');
                  return null;
                },
              },
            ],
            optimizeDeps: { entries: ['keystatic.config.*', '.astro/keystatic-imports.js'] },
          },
        });
        const dotAstro = new URL('./.astro/', config.root);
        mkdirSync(dotAstro, { recursive: true });
        writeFileSync(
          new URL('keystatic-imports.js', dotAstro),
          'import "@keystatic/astro/ui";\nimport "@keystatic/astro/api";\nimport "@keystatic/core/ui";\n',
        );
        injectRoute({
          entrypoint: fileURLToPath(new URL('./src/cms/AdminPage.astro', import.meta.url)),
          pattern: '/keystatic/[...params]',
          prerender: false,
        });
        injectRoute({
          entrypoint: fileURLToPath(new URL('./src/cms/api.ts', import.meta.url)),
          pattern: '/api/keystatic/[...params]',
          prerender: false,
        });
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [react(), ...(cmsEnabled ? [cms()] : [])],
  // Las rutas del panel corren en servidor; el resto de la página sigue prerenderizada
  ...(cmsEnabled && { adapter: vercel(cmsDemo ? { includeFiles: cmsFiles() } : {}) }),
  vite: {
    define: { 'import.meta.env.KEYSTATIC_DEMO_MODE': JSON.stringify(cmsDemo) },
    // Three se importa de forma diferida; pre-optimizarlo evita el "504 Outdated Optimize Dep" en dev.
    optimizeDeps: {
      include: ['three', 'three/examples/jsm/environments/RoomEnvironment.js'],
    },
  },
});

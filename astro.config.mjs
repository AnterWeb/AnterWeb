// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { mkdirSync, writeFileSync } from 'node:fs';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// Dominio de producción: fuente única para canonical, Open Graph, sitemap, robots y JSON-LD.
// En Vercel sale solo de VERCEL_PROJECT_PRODUCTION_URL (el dominio principal del proyecto: hoy
// alter-psi-two.vercel.app; cuando se conecte el dominio de la clienta, ese). SITE_URL lo fuerza a mano.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const SITE_URL = process.env.SITE_URL ?? (productionHost ? `https://${productionHost}` : 'https://alter-psi-two.vercel.app');

// Panel de la clienta (Keystatic, docs/cms.md): en local siempre; en producción solo cuando ya hay repo
// de GitHub conectado (PUBLIC_KEYSTATIC_GITHUB_REPO). Sin él, el sitio sigue siendo 100 % estático.
const cmsEnabled = process.argv.includes('dev') || Boolean(process.env.PUBLIC_KEYSTATIC_GITHUB_REPO);

/**
 * La integración de Keystatic, con nuestra página del panel (src/cms/AdminPage.astro, con la identidad del sitio)
 * en lugar de la genérica. El resto es igual a @keystatic/astro: el módulo virtual de la config y la API.
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
          entrypoint: '@keystatic/astro/internal/keystatic-api.js',
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
  ...(cmsEnabled && { adapter: vercel() }),
  vite: {
    // Three se importa de forma diferida; pre-optimizarlo evita el "504 Outdated Optimize Dep" en dev.
    optimizeDeps: {
      include: ['three', 'three/examples/jsm/environments/RoomEnvironment.js'],
    },
  },
});

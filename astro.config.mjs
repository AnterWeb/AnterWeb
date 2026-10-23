// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// Dominio de producción: fuente única para canonical, Open Graph, sitemap, robots y JSON-LD.
// En Vercel sale solo de VERCEL_PROJECT_PRODUCTION_URL (el dominio principal del proyecto: hoy
// alter-psi-two.vercel.app; cuando se conecte el dominio de la clienta, ese). SITE_URL lo fuerza a mano.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const SITE_URL = process.env.SITE_URL ?? (productionHost ? `https://${productionHost}` : 'https://alter-psi-two.vercel.app');

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [react()],
  vite: {
    // Three se importa de forma diferida; pre-optimizarlo evita el "504 Outdated Optimize Dep" en dev.
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/environments/RoomEnvironment.js',
        'three/examples/jsm/utils/BufferGeometryUtils.js',
      ],
    },
  },
});

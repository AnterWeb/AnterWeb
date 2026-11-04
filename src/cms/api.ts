// API del panel (/api/keystatic/*): la de Keystatic tal cual. Vive en una ruta propia porque la página del panel
// también es propia (AdminPage.astro); las dos las monta la integración cms() de astro.config.mjs. Ver docs/cms.md.
import { makeHandler } from '@keystatic/astro/api';
import config from '../../keystatic.config';

export const prerender = false;

export const ALL = makeHandler({ config });

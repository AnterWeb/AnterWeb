// API del panel (/api/keystatic/*): la de Keystatic, salvo en la demostración (KEYSTATIC_DEMO), donde guardar
// responde con un aviso en vez de intentar escribir (en Vercel el disco es de solo lectura; ver docs/cms.md).
import type { APIRoute } from 'astro';
import { makeHandler } from '@keystatic/astro/api';
import config from '../../keystatic.config';

export const prerender = false;

const handler = makeHandler({ config });

export const ALL: APIRoute = (context) => {
  if (import.meta.env.KEYSTATIC_DEMO_MODE && context.request.method === 'POST') {
    return new Response('Demostración: aquí los cambios no se guardan.', { status: 403 });
  }
  return handler(context);
};

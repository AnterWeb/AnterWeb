// API del panel (/api/keystatic/*): la de Keystatic, salvo en la demostración (KEYSTATIC_DEMO):
//   · guardar responde con un aviso en vez de intentar escribir (en Vercel el disco es de solo lectura);
//   · la lista de archivos solo enseña el contenido del panel, no los archivos internos de la función.
// Ver docs/cms.md.
import type { APIRoute } from 'astro';
import { makeHandler } from '@keystatic/astro/api';
import config from '../../keystatic.config';

export const prerender = false;

const handler = makeHandler({ config });
const CONTENT = ['src/content', 'src/assets/cms'];
/** El contenido del panel y las carpetas que llevan a él (Keystatic recorre el árbol desde la raíz) */
const isContent = (path: string) =>
  CONTENT.some((dir) => path === dir || path.startsWith(`${dir}/`) || dir.startsWith(`${path}/`));

export const ALL: APIRoute = async (context) => {
  if (!import.meta.env.KEYSTATIC_DEMO_MODE) return handler(context);

  if (context.request.method === 'POST') {
    return new Response('Demostración: aquí los cambios no se guardan.', { status: 403 });
  }
  const response = await handler(context);
  if (context.params.params !== 'tree' || !response.ok) return response;
  const entries: { path: string }[] = await response.json();
  const visible = entries.filter((entry) => isContent(entry.path));
  return Response.json(visible, { headers: { 'x-robots-tag': 'noindex' } });
};

// robots.txt: todo indexable (incluidos crawlers de IA) menos el panel de la clienta y su API,
// y apunta al sitemap absoluto.
import type { APIRoute } from 'astro';

const LINES = ['User-agent: *', 'Allow: /', 'Disallow: /keystatic', 'Disallow: /api/', ''];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap.xml', site).href;
  const body = [...LINES, `Sitemap: ${sitemap}`, ''].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

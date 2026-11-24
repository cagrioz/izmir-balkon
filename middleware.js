// Serves the Markdown mirror when a client asks for it, such as an AI agent fetching with
// "Accept: text/markdown". Browsers never ask for it, so visitors always get the HTML page.
import { trackAICrawlerRequest } from '@datafast/ai-crawl';
import './public/tracking-config.js';

// Include discovery files and missing content URLs, but leave static assets alone.
export const config = { matcher: ['/((?!assets/|api/|_vercel/|_next/|.*\\.(?:js|css|png|jpg|jpeg|webp|svg|ico|woff2?|mp4)$).*)'] };
const markdownPages = new Set(['/', '/cam-balkon', '/kis-bahcesi', '/pergola', '/dograma', '/bilgi']);

export function trackCrawler(request, context, fetcher = fetch) {
  // A missing lifecycle hook must never turn tracking into a foreground request.
  if (!context?.waitUntil || !['GET', 'HEAD'].includes(request.method)) return;
  const url = new URL(request.url);
  if (!['izmirbalkon.com', 'www.izmirbalkon.com'].includes(url.hostname) ||
      url.searchParams.get('measurement') === 'off') return;
  if (typeof process !== 'undefined' && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') return;
  url.search = ''; url.hash = '';
  // Do not forward cookies, auth, referrers or user-supplied forwarding headers.
  const headers = new Headers({ 'user-agent': request.headers.get('user-agent') || '' });
  const ip = request.headers.get('x-vercel-forwarded-for');
  if (ip) headers.set('x-vercel-forwarded-for', ip);
  try {
    trackAICrawlerRequest(new Request(url, { method: request.method, headers }), context, {
      websiteId: globalThis.IZMIR_TRACKING.datafastWebsiteId,
      domain: 'izmirbalkon.com', timeoutMs: 1500, fetch: fetcher
    });
  } catch { /* Analytics must never prevent the page from being served. */ }
}

export function prefersMarkdown(accept) {
  const quality = type => {
    for (const part of String(accept || '').toLowerCase().split(',')) {
      const [name, ...params] = part.trim().split(';').map(item => item.trim());
      if (name !== type) continue;
      const q = params.find(param => param.startsWith('q='));
      return q ? Number(q.slice(2)) : 1;
    }
    return -1;
  };
  const markdown = quality('text/markdown');
  return markdown > 0 && markdown >= quality('text/html');
}

export default function middleware(request, context) {
  trackCrawler(request, context);
  if (!prefersMarkdown(request.headers.get('accept'))) return undefined;
  const url = new URL(request.url);
  if (!markdownPages.has(url.pathname)) return undefined;
  const target = url.pathname === '/' ? '/index.md' : `${url.pathname}.md`;
  return new Response(null, { headers: { 'x-middleware-rewrite': new URL(target, url).toString() } });
}

// Serves the Markdown mirror when a client asks for it, such as an AI agent fetching with
// "Accept: text/markdown". Browsers never ask for it, so visitors always get the HTML page.
export const config = { matcher: ['/', '/cam-balkon', '/kis-bahcesi', '/pergola', '/dograma', '/bilgi'] };

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

export default function middleware(request) {
  if (!prefersMarkdown(request.headers.get('accept'))) return undefined;
  const url = new URL(request.url);
  const target = url.pathname === '/' ? '/index.md' : `${url.pathname}.md`;
  return new Response(null, { headers: { 'x-middleware-rewrite': new URL(target, url).toString() } });
}

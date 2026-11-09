import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { renderAll } from './render.mjs';
import { prefersMarkdown } from '../middleware.js';
const root = resolve('public');
const types = { '.html':'text/html; charset=utf-8', '.md':'text/markdown; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.webp':'image/webp', '.png':'image/png', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8' };
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (path === '/cambalkon') {
      res.writeHead(308, { Location: '/cam-balkon' + new URL(req.url, 'http://localhost').search });
      return res.end();
    }
    const pageless = path === '/' ? '/index' : path;
    const generated = renderAll();
    const markdown = prefersMarkdown(req.headers.accept) && generated.has(`${pageless}.md`);
    const key = [markdown ? `${pageless}.md` : '', path, `${pageless}.html`].find(candidate => candidate && generated.has(candidate));
    if (key) {
      res.setHeader('Content-Type', types[extname(key)]);
      res.end(generated.get(key));
      return;
    }
    const file = resolve(root, '.' + (extname(path) ? path : `${path}.html`));
    if (!file.startsWith(root + '/')) throw new Error('Invalid path');
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', types['.html']);
    res.end(await readFile(resolve(root, '404.html')).catch(() => 'Not found'));
  }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));

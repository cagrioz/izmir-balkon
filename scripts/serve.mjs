import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { variants, renderVariant } from './variants.mjs';
const root = resolve('public');
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.webp':'image/webp', '.png':'image/png', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain' };
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const variant = variants.find(item => path === `/${item.slug}`);
    if (variant) {
      res.setHeader('Content-Type', types['.html']);
      res.end(renderVariant(await readFile(resolve(root, 'index.html'), 'utf8'), variant));
      return;
    }
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(root + '/')) throw new Error('Invalid path');
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.statusCode = 404; res.end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));

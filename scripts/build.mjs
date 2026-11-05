import { cp, rm, mkdir, readFile, writeFile } from 'node:fs/promises';
import { variants, renderVariant } from './variants.mjs';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
const html = await readFile('public/index.html', 'utf8');
for (const variant of variants) await writeFile(`dist/${variant.slug}.html`, renderVariant(html, variant));
console.log(`Static site built in dist/ with ${variants.length} ad landing pages`);

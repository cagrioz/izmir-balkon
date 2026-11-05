import { cp, rm, mkdir, writeFile } from 'node:fs/promises';
import { renderAll } from './render.mjs';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
const files = renderAll();
for (const [path, content] of files) await writeFile(`dist${path}`, content);
console.log(`Static site built in dist/ with ${files.size} generated files`);

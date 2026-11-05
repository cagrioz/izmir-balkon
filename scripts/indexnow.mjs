// Tells Bing and other IndexNow engines that the public pages changed. Run after a deploy.
import { SITE } from './facts.mjs';
const key = 'ab5d0e70e6c3f0301b96c4502ac448a3';
const urlList = ['/', '/cam-balkon', '/kis-bahcesi', '/pergola', '/dograma', '/bilgi'].map(path => SITE + (path === '/' ? '/' : path));
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${key}.txt`, urlList })
});
console.log('IndexNow', response.status, response.statusText);

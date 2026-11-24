import { test } from 'node:test';
import assert from 'node:assert/strict';
import middleware, { trackCrawler } from '../middleware.js';

const ua = 'Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)';
const request = (path = '/', headers = {}, method = 'GET') => new Request('https://izmirbalkon.com' + path, { method, headers: { 'user-agent': ua, ...headers } });
function harness(fetcher = async () => new Response('{}')) {
  const jobs = [], calls = [];
  return { jobs, calls, context: { waitUntil: p => jobs.push(p) }, fetcher: (...args) => { calls.push(args); return fetcher(...args); } };
}

test('crawler payload strips queries, referrers, cookies and untrusted IP headers', async () => {
  const h = harness();
  trackCrawler(request('/cam-balkon?email=private&gclid=private#private', {
    cookie: 'private', authorization: 'private', referer: 'https://private.test/',
    'cf-connecting-ip': '192.0.2.2', 'x-forwarded-for': '192.0.2.3', 'x-vercel-forwarded-for': '192.0.2.1'
  }), h.context, h.fetcher);
  await Promise.all(h.jobs);
  assert.equal(h.calls.length, 1);
  const [endpoint, init] = h.calls[0];
  assert.equal(endpoint, 'https://datafa.st/api/ai-crawls');
  const payload = JSON.parse(init.body);
  assert.equal(payload.websiteId, globalThis.IZMIR_TRACKING.datafastWebsiteId);
  assert.equal(payload.href, 'https://izmirbalkon.com/cam-balkon');
  assert.equal(payload.ai.ip, '192.0.2.1');
  assert.equal(payload.ai.statusCode, undefined); // request-only, no invented success
  assert.ok(!JSON.stringify(init).includes('private'));
});

test('normal humans, assets, preview hosts, QA and mutations produce no requests', async () => {
  const h = harness();
  for (const r of [request('/', {'user-agent': 'Mozilla/5.0 Chrome/131.0'}), request('/assets/work/image.webp'), request('/app.js'), request('/api/test'), request('/?measurement=off'), request('/', {}, 'POST'), new Request('https://preview.vercel.app/', {headers:{'user-agent':ua}})]) trackCrawler(r,h.context,h.fetcher);
  await Promise.all(h.jobs);
  assert.equal(h.calls.length, 0);
});

test('discovery, markdown, calculator and missing pages remain trackable', async () => {
  const h = harness();
  for (const path of ['/robots.txt','/llms.txt','/llms-full.txt','/sitemap.xml','/cam-balkon.md','/cam-balkon-hesaplama','/missing-page']) trackCrawler(request(path),h.context,h.fetcher);
  await Promise.all(h.jobs);
  assert.equal(h.calls.length, 7);
  assert.equal(JSON.parse(h.calls[0][1].body).ai.ip, null);
});

test('tracking never blocks HTML or alters existing Markdown routing', async () => {
  const h = harness(async () => { throw new Error('offline'); });
  assert.equal(trackCrawler(request(),h.context,h.fetcher), undefined);
  await Promise.all(h.jobs); // failure is handled
  assert.equal(middleware(request('/')), undefined);
  assert.equal(middleware(request('/cam-balkon', {accept:'text/markdown'})).headers.get('x-middleware-rewrite'), 'https://izmirbalkon.com/cam-balkon.md');
  assert.equal(middleware(request('/robots.txt', {accept:'text/markdown'})), undefined);
  assert.equal(middleware(request('/missing-page', {accept:'text/markdown'})), undefined);
  const never = harness(() => new Promise(() => {}));
  assert.equal(trackCrawler(request(),never.context,never.fetcher), undefined);
  assert.equal(never.jobs.length, 1);
});

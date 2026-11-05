import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { renderAll, reviews } from './render.mjs';
import { prefersMarkdown } from '../middleware.js';
import { SERVICES, HOME, VOC, HERO_QUOTES, PROCESS_QUOTE, DISTRICTS, ALL_FAQ, BUSINESS, GALLERY } from './facts.mjs';

const files = renderAll();
const htmlPages = [...files].filter(([path]) => path.endsWith('.html'));
const home = files.get('/index.html');
const decode = text => text.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const jsonLd = html => JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
const visibleText = html => decode(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

test('every page fills all tokens and references only files that exist', () => {
  for (const [path, html] of htmlPages) {
    assert.ok(!html.includes('{{'), path);
    const assets = new Set([...html.matchAll(/\/assets\/[\w./-]+\.\w+/g)].map(match => match[0]));
    assert.ok(assets.size > 0, path);
    for (const asset of assets) assert.ok(existsSync(new URL(`../public${asset}`, import.meta.url)), `${path}: ${asset}`);
  }
});

test('every internal link leads to a real page or file', () => {
  const known = new Set(['/', ...[...files.keys()], ...[...files.keys()].filter(path => path.endsWith('.html')).map(path => path.slice(0, -5)), '/gizlilik', '/llms.txt']);
  for (const [path, html] of htmlPages) {
    for (const [, href] of html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {
      if (href.startsWith('/assets/') || /\.(css|js)$/.test(href)) continue;
      assert.ok(known.has(href), `${path} links to ${href}`);
    }
  }
});

test('titles and descriptions are unique and fit search results', () => {
  const titles = new Set(), descriptions = new Set();
  for (const [path, html] of htmlPages) {
    const title = decode(html.match(/<title>(.*?)<\/title>/)[1]);
    const description = decode(html.match(/<meta name="description" content="(.*?)">/)[1]);
    assert.ok(title.length <= 65, `${path} title is ${title.length}: ${title}`);
    assert.ok(description.length <= 165, `${path} description is ${description.length}`);
    titles.add(title); descriptions.add(description);
    assert.equal((html.match(/<h1/g) || []).length, 1, path);
  }
  assert.equal(titles.size, htmlPages.length);
  assert.equal(descriptions.size, htmlPages.length);
});

test('each service page matches its ad and starts with its service selected', () => {
  for (const [key, service] of Object.entries(SERVICES)) {
    const html = files.get(`/${key}.html`);
    assert.ok(html.includes(`<span class="h1-key">${service.h1Key}</span>`), key);
    assert.ok(html.includes(`<link rel="canonical" href="https://izmirbalkon.com/${key}">`), key);
    assert.ok(html.includes(`<body data-service="${key}">`), key);
    assert.ok(html.includes(`data-pick-service="${key}" aria-pressed="true"`), key);
    assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1, key);
    assert.ok(html.includes(`<img class="hero-img" src="${service.hero.lg}"`), key);
    assert.ok(html.includes(`<link rel="alternate" type="text/markdown" href="/${key}.md"`), key);
  }
});

test('the hero has one primary action and shows the owner’s figures', () => {
  const hero = home.slice(home.indexOf('<section class="hero"'), home.indexOf('<section class="voc'));
  assert.equal((hero.match(/btn-primary/g) || []).length, 1);
  assert.ok(hero.includes('<strong>15+</strong>'));
  assert.ok(hero.includes('<strong>200+</strong>'));
});

test('photos carry no "representative" label and the gallery holds only own work', () => {
  for (const [path, html] of htmlPages) assert.ok(!/temsili/i.test(html), path);
  const gallery = home.slice(home.indexOf('<div class="work-track">'), home.indexOf('id="hizmetler"'));
  assert.ok(gallery.includes('/assets/work/'));
  assert.ok(!gallery.includes('/assets/stock/'));
});

test('all reviews are published verbatim with matching counts', () => {
  assert.equal(reviews.length, 21);
  assert.equal((home.match(/<article class="review">/g) || []).length, reviews.length);
  const page = decode(home);
  for (const review of reviews) {
    assert.ok(page.includes(review.text), review.name);
    assert.ok(page.includes(review.service), review.name);
    assert.ok(page.includes(`datetime="${review.date}"`), review.name);
  }
  assert.ok(home.includes('Tüm yorumları göster'));
});

test('customer quotes used as selling points are real words from that customer', () => {
  const quotes = [...VOC.map(([, quote, name]) => [quote, name]), ...HERO_QUOTES, PROCESS_QUOTE];
  for (const [quote, name] of quotes) {
    const source = reviews.find(review => review.name === name);
    assert.ok(source, name);
    assert.ok(source.text.includes(quote), `${name}: ${quote}`);
    assert.ok(decode(home).includes(quote), `shown: ${quote}`);
  }
});

test('pages never advertise a review count', () => {
  for (const [path, html] of htmlPages) assert.ok(!new RegExp(`\\b${reviews.length} (?:müşteri )?yorum`, 'i').test(visibleText(html)), path);
});

test('the hero rotates several real quotes, with one shown when JavaScript is off', () => {
  assert.ok(HERO_QUOTES.length >= 3);
  assert.equal((home.match(/class="quote is-on"/g) || []).length, 1);
  assert.equal((home.match(/class="quote[ "]/g) || []).length, HERO_QUOTES.length);
  assert.equal((home.match(/data-quote="\d"/g) || []).length, HERO_QUOTES.length);
  assert.ok(home.includes('data-quote-pause'));
});

test('the wizard offers a photo for every service and reserves room for its longest draft', () => {
  for (const [key] of Object.entries(SERVICES)) assert.ok(new RegExp(`data-pick-service="${key}"[^>]*><img src="/assets/tiles/${key}\\.webp"`).test(home), key);
  const ui = readFileSync(new URL('../public/ui.js', import.meta.url), 'utf8');
  assert.ok(ui.includes('ücretsiz keşif ve fiyat almak istiyorum.'), 'draft wording');
  const ghost = home.match(/data-ghost="([^"]+)"/)[1];
  const longestLabel = Math.max(...Object.keys(SERVICES).map(key => ui.match(new RegExp(`'?${key}'?: \\{ label: '[^']+', phrase: '([^']+)'`))[1].length));
  const unknown = 'Ölçüyü bilmiyorum, keşifte alınabilir.';
  const longestDistrict = Math.max(...DISTRICTS.map(name => name.length));
  assert.ok(ghost.length >= `Merhaba,  ilçesinde  için ücretsiz keşif ve fiyat almak istiyorum. ${unknown}`.length + longestLabel + longestDistrict);
});

test('gallery tiles keep each photo’s own shape and never use stock', () => {
  const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');
  assert.ok(css.includes('aspect-ratio: var(--r)'));
  for (const item of GALLERY.flat()) {
    assert.ok(home.includes(`style="--r:${(item.w / item.h).toFixed(3)}" href="/assets/work/${item.file}.webp"`), item.file);
  }
});

test('headings use the modern sans font, with no serif family left', () => {
  const css = readFileSync(new URL('../public/styles.css', import.meta.url), 'utf8');
  assert.ok(!/serif'|--serif|Georgia/.test(css.replace(/sans-serif/g, '')));
  assert.ok(css.includes("--sans: 'Manrope'"));
});

test('structured data is valid, truthful and matches the visible page', () => {
  for (const [path, html] of htmlPages) {
    const nodes = jsonLd(html);
    const business = nodes.find(node => node['@type'] === 'HomeAndConstructionBusiness');
    assert.equal(business.telephone, BUSINESS.phone, path);
    assert.equal(business.areaServed.length, DISTRICTS.length, path);
    assert.ok(!JSON.stringify(nodes).includes('aggregateRating'), path);
    const text = visibleText(html);
    for (const question of nodes.find(node => node['@type'] === 'FAQPage').mainEntity) {
      assert.ok(text.includes(question.name), `${path}: ${question.name}`);
      assert.ok(text.includes(question.acceptedAnswer.text), `${path}: answer to ${question.name}`);
    }
  }
  assert.equal(jsonLd(files.get('/bilgi.html')).filter(node => node['@type'] === 'Review').length, reviews.length);
});

test('Markdown mirrors and llms.txt carry the same facts and valid links', () => {
  for (const [key, data] of [['index', HOME], ...Object.entries(SERVICES)]) {
    const md = files.get(`/${key}.md`);
    assert.ok(md.startsWith(`# ${data.h1Key}`), key);
    assert.ok(md.includes(BUSINESS.phoneDisplay), key);
    for (const [question, answer] of data.faq) assert.ok(md.includes(question) && md.includes(answer), `${key}: ${question}`);
  }
  const full = files.get('/llms-full.txt');
  for (const review of reviews) assert.ok(full.includes(review.text), review.name);
  for (const [, items] of ALL_FAQ) for (const [question] of items) assert.ok(full.includes(question), question);
  const llms = files.get('/llms.txt');
  assert.ok(llms.startsWith('# İzmir Balkon\n\n> '));
  const links = [...llms.matchAll(/\]\(https:\/\/izmirbalkon\.com(\/[^)]*)\)/g)].map(match => match[1]);
  assert.ok(links.length >= 6);
  for (const link of links) assert.ok(files.has(link), link);
  assert.ok(/işletmenin beyanı/.test(files.get('/index.md')), 'owner figures are attributed');
});

test('the Markdown mirror is served only to clients that prefer it', () => {
  assert.equal(prefersMarkdown('text/markdown, text/html, */*'), true);
  assert.equal(prefersMarkdown('text/markdown'), true);
  assert.equal(prefersMarkdown('text/markdown;q=0.9, text/html;q=0.5'), true);
  assert.equal(prefersMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'), false);
  assert.equal(prefersMarkdown('text/html, text/markdown;q=0.9'), false);
  assert.equal(prefersMarkdown('text/markdown;q=0'), false);
  assert.equal(prefersMarkdown('*/*'), false);
  assert.equal(prefersMarkdown(null), false);
});

test('missing pages have a real 404 and crawlers are not blocked', () => {
  assert.ok(existsSync(new URL('../public/404.html', import.meta.url)));
  const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8');
  assert.ok(/User-agent: \*\nAllow: \//.test(robots));
  assert.ok(!/Disallow: \//.test(robots));
  assert.ok(robots.includes('Sitemap: https://izmirbalkon.com/sitemap.xml'));
});

test('no invented guarantee, discount or rating is advertised', () => {
  for (const [path, html] of htmlPages) {
    const text = visibleText(html);
    for (const pattern of [/\d\s*yıl (?:işçilik |yazılı )?garanti/i, /%\s?\d/, /\bkampanya\b|\bindirim\b/i, /\b5[.,]0\b/]) {
      assert.ok(!pattern.test(text), `${path}: ${pattern}`);
    }
  }
});

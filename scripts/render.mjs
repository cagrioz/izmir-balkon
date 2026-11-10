// Renders every page and machine-readable file from scripts/facts.mjs and public/reviews-data.js.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { SITE, UPDATED, UPDATED_TR, BUSINESS, DISTRICTS, SUMMARY, SUMMARY_EN, PRICE_FACTORS, QUOTE_QUESTIONS, STEPS, SERVICES, ESTIMATES, HOME, ALL_FAQ, VOC, HERO_QUOTES, PROCESS_QUOTE, FEATURED_REVIEWS, GALLERY, TERRACE_FRAME, PANEL_VIDEO, SERVICE_PROOF } from './facts.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const context = { window: {} };
runInNewContext(read('public/reviews-data.js'), context);
export const reviews = context.window.IZMIR_REVIEWS;

const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const formatDate = date => { const [y, m, d] = date.split('-'); return `${d} ${months[+m - 1]} ${y}`; };
const wa = text => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
const quoteMessage = phrase => `Merhaba, ${phrase} için ücretsiz keşif ve fiyat almak istiyorum.`;
const photoMessage = noun => `Merhaba, ücretsiz keşif istiyorum. ${noun} fotoğrafını gönderiyorum.`;
const serviceList = Object.entries(SERVICES);
const pathFor = key => (key === 'home' ? '/' : `/${key}`);
const mdFor = key => (key === 'home' ? '/index.md' : `/${key}.md`);

const tilePhoto = id => `/assets/tiles/${id}.webp`;
// Kept open in the wizard so the card does not grow with the message. Same wording as draftMessage in public/ui.js.
const LONGEST_DRAFT = 'Merhaba, Seferihisar ilçesinde pencere ve kapı doğraması için ücretsiz keşif ve fiyat almak istiyorum. Ölçüyü bilmiyorum, keşifte alınabilir.';

// Small size pictures for the wizard: glass panels for a balcony, a growing grid for area and count.
const artFrame = body => `<svg class="opt-art" viewBox="0 0 48 32" aria-hidden="true">${body}</svg>`;
const paneArt = count => {
  const cell = 6, gap = 2, width = count * cell + (count - 1) * gap, start = (48 - width) / 2;
  return artFrame(Array.from({ length: count }, (_, i) => `<rect x="${start + i * (cell + gap)}" y="4" width="${cell}" height="24" rx="1"/>`).join(''));
};
const gridArt = (cols, rows) => {
  const cell = 8, gap = 2, left = (48 - (cols * cell + (cols - 1) * gap)) / 2, top = (32 - (rows * cell + (rows - 1) * gap)) / 2;
  const cells = [];
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) cells.push(`<rect x="${left + c * (cell + gap)}" y="${top + r * (cell + gap)}" width="${cell}" height="${cell}" rx="1"/>`);
  return artFrame(cells.join(''));
};
const UNKNOWN_ART = artFrame('<rect x="9" y="3" width="30" height="26" rx="3" stroke-dasharray="3 2.5"/><text x="24" y="21.5">?</text>');
const GRID_ART = [gridArt(2, 1), gridArt(3, 2), gridArt(4, 3)];
const SIZE_ART = { 'cam-balkon': [paneArt(2), paneArt(4), paneArt(6)], 'kis-bahcesi': GRID_ART, pergola: GRID_ART, dograma: GRID_ART };
const SIZE_OPTIONS = {
  'cam-balkon': ['Balkonunuz yaklaşık kaç metre?', ['3 m’ye kadar', '3–6 m', '6 m’den fazla']],
  'kis-bahcesi': ['Alan yaklaşık kaç metrekare?', ['15 m²’ye kadar', '15–30 m²', '30 m²’den fazla']],
  pergola: ['Alan yaklaşık kaç metrekare?', ['15 m²’ye kadar', '15–30 m²', '30 m²’den fazla']],
  dograma: ['Kaç pencere veya kapı var?', ['1–3 adet', '4–8 adet', '9 adet ve üzeri']]
};

const sprite = `<svg class="sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/></symbol>
    <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.45L3.5 20.5l1.4-4.2A8.5 8.5 0 1 1 20.5 11.7Z"/><path d="M9 8.6c-.3 3 3.2 6.6 6.4 6.4l1.1-1.7-2.2-1.1-.9.8c-.9-.4-1.7-1.2-2.1-2.1l.8-.9-1.1-2.2Z"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
    <symbol id="i-back" viewBox="0 0 24 24"><path d="M19 12H5m6 6-6-6 6-6"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></symbol>
    <symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
    <symbol id="i-chevron-left" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></symbol>
    <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
    <symbol id="i-pause" viewBox="0 0 24 24"><path d="M8 5v14m8-14v14"/></symbol>
    <symbol id="i-play" viewBox="0 0 24 24"><path d="m7 4 13 8-13 8Z"/></symbol>
    <symbol id="i-stars" viewBox="0 0 120 24"><g id="i-star-one"><path d="m12 2.6 2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95L12 2.6Z"/></g><use href="#i-star-one" x="24"/><use href="#i-star-one" x="48"/><use href="#i-star-one" x="72"/><use href="#i-star-one" x="96"/></symbol>
  </defs></svg>`;

const header = (base, estimate = false) => `<header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="/"><img src="/assets/logo.svg" alt="" width="32" height="32"><span>İzmir Balkon</span></a>
      <nav class="header-nav" aria-label="Ana menü">
        <a href="${base}#islerimiz">İşlerimiz</a>
        <a href="${estimate ? '/' : base}#hizmetler">Hizmetler</a>
        <a href="${estimate ? '#fiyat-hesapla' : base + '#fiyat'}">Fiyat</a>
        <a href="${base}#yorumlar">Yorumlar</a>
        <a href="${base}#sorular">Sorular</a>
      </nav>
      <a class="header-call" href="tel:${BUSINESS.phone}" aria-label="Ara: ${BUSINESS.phoneDisplay}" data-contact="phone" data-position="header"><svg class="icon" aria-hidden="true"><use href="#i-phone"/></svg>${BUSINESS.phoneDisplay}</a>
      <a class="btn btn-primary header-cta" href="${base}${estimate ? '#fiyat-hesapla' : '#teklif'}"${base || estimate ? '' : ' data-open-wizard'}>${estimate ? 'Fiyatı hesapla' : 'Ücretsiz keşif al'}</a>
    </div>
  </header>`;

const footer = `<footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <a class="brand" href="/"><img src="/assets/logo.svg" alt="" width="32" height="32"><span>İzmir Balkon</span></a>
        <address>İzmir, Türkiye<br>Telefon ve WhatsApp: <a href="tel:${BUSINESS.phone}" data-contact="phone" data-position="footer">${BUSINESS.phoneDisplay}</a></address>
      </div>
      <nav aria-label="Hizmetler"><h2>Hizmetler</h2><ul>${serviceList.map(([key, s]) => `<li><a href="${pathFor(key)}">${esc(s.cardLabel || s.label)}</a></li>`).join('')}</ul></nav>
      <nav aria-label="Bilgi"><h2>Bilgi</h2><ul><li><a href="/bilgi">Tüm bilgiler ve sık sorulanlar</a></li><li><a href="/gizlilik">Gizlilik</a></li><li><a href="/llms.txt">AI ajanları için özet</a></li><li><button id="cookie-settings" type="button" aria-expanded="false" aria-controls="consent-banner" hidden>Ölçüm tercihleri</button></li></ul></nav>
    </div>
    <section class="wrap consent-banner" id="consent-banner" aria-labelledby="measurement-title" hidden>
      <h2 id="measurement-title">Ölçüm tercihleri</h2>
      <p>DataFast ziyaretleri çerezsiz sayar. Google Ads ilk ziyarette sınırlı sinyaller alır. Ölçümü buradan kapatabilirsiniz. <a href="/gizlilik">Gizlilik bilgileri</a></p>
      <label><input type="checkbox" id="allow-datafast"> DataFast ile ziyaretleri ve iletişim tıklamalarını ölç</label>
      <label><input type="checkbox" id="allow-google"> Google Ads ile reklam ve iletişim tıklamalarını ilişkilendir</label>
      <div class="consent-actions"><button type="button" id="reject-cookies">Tümünü kapat</button><button type="button" id="accept-cookies">Seçimimi kaydet</button></div>
    </section>
    <p class="wrap footer-legal">© <span id="year">2026</span> İzmir Balkon · Son güncelleme: <time datetime="${UPDATED}">${UPDATED_TR}</time></p>
  </footer>`;

function reviewCard(review) {
  const initial = review.name.trim()[0].toLocaleUpperCase('tr');
  let body = `<blockquote class="review-text">${esc(review.text)}</blockquote>`;
  // The platform name stays in the verbatim text, one tap away, not in the visible excerpt.
  if (review.name === 'Fatma T.') body = `<p class="review-text">… Çok memnun kaldım. Seçkin Bey işinde çok başarılı, ilgili ve gerçekten çok hızlı. Kesinlikle tavsiye ederim.</p><details class="review-full"><summary>Yorumun tamamı</summary><blockquote>${esc(review.text)}</blockquote></details>`;
  return `<article class="review"><svg class="stars" role="img" aria-label="5 üzerinden ${review.rating} yıldız"><use href="#i-stars"/></svg>${body}<footer class="review-meta"><span class="avatar" aria-hidden="true">${esc(initial)}</span><span><strong>${esc(review.name)}</strong><small>${esc(review.service)} · <time datetime="${review.date}">${formatDate(review.date)}</time></small></span></footer></article>`;
}
const featuredReviews = FEATURED_REVIEWS.map(name => reviews.find(review => review.name === name));
const otherReviews = reviews.filter(review => !FEATURED_REVIEWS.includes(review.name)).sort((a, b) => b.date.localeCompare(a.date));

const factsList = [
  ['Hizmetler', 'Cam balkon, kış bahçesi, pergola, PVC ve alüminyum doğrama, sineklik, cam değişimi'],
  ['Hizmet bölgesi', 'İzmir’in 30 ilçesinin tamamı'],
  ['Keşif', 'Ücretsiz, yerinde'],
  ['Deneyim', `${BUSINESS.experience}`],
  ['Müşteri', `${BUSINESS.customers} müşteri`],
  ['Telefon ve WhatsApp', `<a href="tel:${BUSINESS.phone}" data-contact="phone" data-position="facts">${BUSINESS.phoneDisplay}</a>`]
].map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('');

const heroQuotes = HERO_QUOTES.map(([quote, name], index) => {
  const source = reviews.find(review => review.name === name);
  return `<figure class="quote${index === 0 ? ' is-on' : ''}"><blockquote>“${esc(quote)}”</blockquote><figcaption>${esc(name)} · ${esc(source.service)}</figcaption></figure>`;
}).join('');
const quoteDots = HERO_QUOTES.map((_, index) => `<button class="quote-dot" type="button" data-quote="${index}" aria-label="${index + 1}. yorum"${index === 0 ? ' aria-current="true"' : ''}></button>`).join('');

const galleryItem = item => {
  const full = `/assets/work/${item.file}.webp`;
  const srcset = item.sm ? ` srcset="/assets/work/${item.file}-sm.webp ${item.sm}w, ${full} ${item.w}w" sizes="(min-width: 60rem) ${item.vw}vw, 84vw"` : '';
  return `<a class="work" style="--r:${(item.w / item.h).toFixed(3)}" href="${full}" data-gallery data-title="${esc(item.title)}" data-note="${esc(item.note)}."><span class="work-media"><img src="${item.sm ? `/assets/work/${item.file}-sm.webp` : full}"${srcset} width="${item.w}" height="${item.h}" loading="lazy" decoding="async" alt="${esc(item.alt)}"></span><span class="work-label"><strong>${esc(item.title)}</strong><small>${esc(item.note)}</small></span></a>`;
};
const videoItem = v => `<a class="work work-film" style="--r:1.5" href="${esc(v.file)}" target="_blank" rel="noopener"><span class="work-media"><img src="${esc(v.cover)}" width="${v.w}" height="${v.h}" loading="lazy" decoding="async" alt=""><span class="play-symbol" aria-hidden="true">▶</span></span><span class="work-label"><strong>${esc(v.title)}</strong><small>${esc(v.note)}</small></span></a>`;
const gallery = GALLERY.map(row => `<div class="work-row">${row.map(galleryItem).join('')}</div>`).join('');

const faqHtml = items => items.map(([q, a], index) => `<details${index === 0 ? ' open' : ''}><summary><h3>${esc(q)}</h3><svg class="icon" aria-hidden="true"><use href="#i-chevron-down"/></svg></summary><p>${esc(a)}</p></details>`).join('');

function businessNode() {
  return {
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE}/#isletme`,
    name: BUSINESS.name,
    url: `${SITE}/`,
    logo: `${SITE}/assets/logo.svg`,
    image: `${SITE}/assets/work/villa-kose.jpg`,
    telephone: BUSINESS.phone,
    description: SUMMARY,
    slogan: 'Rüzgâra kapalı, manzaraya açık.',
    address: { '@type': 'PostalAddress', addressLocality: BUSINESS.city, addressRegion: BUSINESS.city, addressCountry: 'TR' },
    areaServed: DISTRICTS.map(name => ({ '@type': 'AdministrativeArea', name: `${name}, İzmir` })),
    knowsAbout: ['Cam balkon', 'Katlanır cam balkon', 'Sürme cam balkon', 'Kış bahçesi', 'Pergola', 'PVC doğrama', 'Alüminyum doğrama', 'Sineklik', 'Cam değişimi'],
    contactPoint: { '@type': 'ContactPoint', telephone: BUSINESS.phone, contactType: 'sales', areaServed: 'TR', availableLanguage: 'tr' },
    potentialAction: { '@type': 'CommunicateAction', name: 'WhatsApp’tan ücretsiz keşif ve fiyat isteyin', target: { '@type': 'EntryPoint', urlTemplate: `https://wa.me/${BUSINESS.whatsapp}?text={mesaj}` } },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Hizmetler', itemListElement: serviceList.map(([key, s]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', '@id': `${SITE}${pathFor(key)}#hizmet`, name: s.cardLabel || s.label, url: `${SITE}${pathFor(key)}` } })) }
  };
}
const websiteNode = { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: BUSINESS.name, inLanguage: 'tr', publisher: { '@id': `${SITE}/#isletme` } };
const faqNode = (items, url) => ({ '@type': 'FAQPage', '@id': `${url}#sss`, mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const webPageNode = (url, title, description, image) => ({ '@type': 'WebPage', '@id': `${url}#sayfa`, url, name: title, description, inLanguage: 'tr', isPartOf: { '@id': `${SITE}/#site` }, about: { '@id': `${SITE}/#isletme` }, dateModified: UPDATED, ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}) });
const breadcrumb = (url, name) => ({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: BUSINESS.name, item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name, item: url }] });
const graph = nodes => JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');

function fill(template, tokens) {
  const out = template.replace(/\{\{(\w+)\}\}/g, (_, name) => {
    if (!(name in tokens)) throw new Error(`Missing template token: ${name}`);
    return tokens[name];
  });
  return out;
}

export function renderPage(key) {
  const data = key === 'home' ? HOME : SERVICES[key];
  const selected = key === 'home' ? 'cam-balkon' : key;
  const url = key === 'home' ? `${SITE}/` : `${SITE}/${key}`;
  const { hero } = data;
  const heroSet = `${hero.sm} 800w, ${hero.lg} ${hero.w}w`;
  const heroSizes = '(min-width: 60rem) 62vw, 100vw';
  const mobileMedia = '(width < 40rem)';
  const mobileSource = hero.mobile ? `<source media="${mobileMedia}" type="image/avif" srcset="${hero.mobile}">` : '';
  const proof = SERVICE_PROOF[key];
  const pageFaq = proof?.faq || data.faq;
  const nodes = [businessNode(), websiteNode, webPageNode(url, data.title, data.description, `${SITE}${hero.og}`), faqNode(pageFaq, url)];
  if (key !== 'home') {
    nodes.push(breadcrumb(url, data.cardLabel || data.label));
    nodes.push({ '@type': 'Service', '@id': `${url}#hizmet`, name: data.cardLabel || data.label, serviceType: data.cardLabel || data.label, description: data.summary, url, provider: { '@id': `${SITE}/#isletme` }, areaServed: { '@type': 'City', name: 'İzmir' }, offers: { '@type': 'Offer', name: 'Ücretsiz keşif', price: 0, priceCurrency: 'TRY' } });
  }
  const estimate = ESTIMATES[key];
  const base = read('src/template.html')
    .replace('{{mainContent}}', read(estimate ? 'src/service-content.html' : 'src/home-content.html').trimEnd())
    .replace('{{quoteCard}}', read(estimate ? 'src/service-estimate.html' : 'src/home-wizard.html').trimEnd())
    .replace('{{quoteSheet}}', estimate ? '' : read('src/home-sheet.html').trimEnd());
  return fill(base, {
    quoteTarget: estimate ? 'href="#fiyat-hesapla"' : 'href="#teklif" data-open-wizard',
    bandAction: estimate ? 'Yaklaşık fiyatı gör' : 'Ücretsiz keşif al',
    priceAction: estimate ? 'Ölçünüzle hesaplayın' : 'Ölçünüze özel fiyat alın',
    styles: read('public/styles.css') + (estimate ? read('public/estimate.css') : ''),
    estimateAssets: estimate ? '<script type="module" src="/estimate.js"></script>' : '',
    ...(estimate && {
      workTitle: esc(proof.title),
      workItems: proof.files.map(id => id === 'video' ? videoItem(PANEL_VIDEO) : galleryItem([TERRACE_FRAME, ...GALLERY.flat()].find(item => item.file === id))).join(''),
      resultNote: estimate.ownerRange ? 'Net teklif için ücretsiz keşif.' : 'Piyasa örneğidir. Net fiyat keşifte belirlenir.',
      rateDetails: estimate.ownerRange ? '' : `<details class="estimate-source"><summary>Fiyatın kaynağı</summary><p>${esc(estimate.scope)} <a href="${esc(estimate.url)}" target="_blank" rel="noopener noreferrer">${esc(estimate.source)}</a> · Kasım 2026.</p></details>`,
      estimateTitle: esc(estimate.title), estimateSubtitle: estimate.ownerRange ? '' : `<p>${esc(estimate.model)}</p>`, model: esc(estimate.model), quantityLabel: esc(estimate.label),
      inputMode: estimate.unit === 'adet' ? 'numeric' : 'decimal', example: esc(estimate.example),
      unit: esc(estimate.unit), hint: esc(estimate.hint),
      rateLow: estimate.low, rateHigh: estimate.high,
      unitRange: [estimate.low, estimate.high].map(n => n.toLocaleString('tr-TR')).join('–'),
      taxLabel: estimate.unit === 'adet' ? ' · KDV hariç' : '',
      estimateWa: wa(quoteMessage(data.phrase))
    }),
    title: esc(data.title),
    description: esc(data.description),
    canonical: url,
    mdUrl: mdFor(key),
    ogImage: `${SITE}${hero.og}`,
    ogW: hero.ogW,
    ogH: hero.ogH,
    preload: (hero.mobile ? `<link rel="preload" as="image" type="image/avif" media="${mobileMedia}" href="${hero.mobile}" fetchpriority="high">` : '') +
      `<link rel="preload" as="image" ${hero.mobile ? 'media="(min-width: 40rem)" ' : ''}href="${hero.lg}" imagesrcset="${heroSet}" imagesizes="${heroSizes}" fetchpriority="high">`,
    jsonld: graph(nodes),
    sprite,
    header: header('', Boolean(estimate)),
    footer,
    service: selected,
    heroImg: `<picture>${mobileSource}<img class="hero-img" src="${hero.lg}" srcset="${hero.sm} 800w, ${hero.lg} ${hero.w}w" sizes="(min-width: 60rem) 62vw, 100vw" width="${hero.w}" height="${hero.h}" fetchpriority="high"${hero.pos ? ` style="object-position:${hero.pos}"` : ''} alt="${esc(hero.alt)}"></picture>`,
    h1Key: esc(data.h1Key),
    h1Line: esc(data.h1Line),
    heroLead: estimate ? '' : `<p class="hero-lead">${esc(data.lead)}</p>`,
    tiles: serviceList.map(([id, s]) => `<button class="tile" type="button" data-pick-service="${id}" aria-pressed="${id === selected}"><img src="${tilePhoto(id)}" width="384" height="256" decoding="async" alt=""><span class="tile-label">${esc(s.label)}</span><svg class="icon tile-check" aria-hidden="true"><use href="#i-check"/></svg></button>`).join(''),
    picked: esc(SERVICES[selected].label),
    pickedPhoto: tilePhoto(selected),
    longestDraft: esc(LONGEST_DRAFT),
    sizes: serviceList.map(([id]) => {
      const [question, options] = SIZE_OPTIONS[id];
      return `<div class="wiz-sizes" data-for="${id}" hidden><p class="wiz-q" id="q-size-${id}" tabindex="-1">${esc(question)}</p><div class="wiz-opts" role="group" aria-labelledby="q-size-${id}">${options.map((option, index) => `<button class="opt" type="button" data-pick-size="${esc(option)}">${SIZE_ART[id][index]}<span>${esc(option)}</span></button>`).join('')}<button class="opt" type="button" data-pick-size="">${UNKNOWN_ART}<span>Bilmiyorum</span></button></div></div>`;
    }).join(''),
    districtOptions: DISTRICTS.map(name => `<option>${esc(name)}</option>`).join(''),
    heroQuotes,
    quoteDots,
    gallery,
    voc: VOC.map(([label, quote, name]) => `<li><strong>${esc(label)}</strong><blockquote>“${quote[0] === quote[0].toLocaleUpperCase('tr') ? '' : '… '}${esc(quote)}”</blockquote><cite>${esc(name)}</cite></li>`).join(''),
    svcCards: serviceList.map(([id, s]) => `<a class="svc svc-${id}${id === key ? ' is-current' : ''}" href="${id === key ? '#fiyat-hesapla' : pathFor(id)}"><img src="${s.cardImg.src}" width="${s.cardImg.w}" height="${s.cardImg.h}" loading="lazy" decoding="async"${s.cardImg.pos ? ` style="object-position:${s.cardImg.pos}"` : ''} alt=""><span class="svc-body"><strong>${esc(s.cardLabel || s.label)}</strong><small>${esc(s.card)}</small><span class="svc-go">Fiyat alın<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg></span></span></a>`).join(''),
    priceList: PRICE_FACTORS.map(([name, text]) => `<li><strong>${esc(name)}</strong><span>${esc(text)}</span></li>`).join(''),
    askList: QUOTE_QUESTIONS.map(text => `<li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>${esc(text)}</li>`).join(''),
    steps: STEPS.map(([name, text]) => `<li><strong>${esc(name)}</strong><span>${esc(text)}</span></li>`).join(''),
    processQuote: esc(PROCESS_QUOTE[0]),
    processQuoteBy: esc(PROCESS_QUOTE[1]),
    reviewsFeatured: (estimate ? featuredReviews.slice(0,3) : featuredReviews).map(reviewCard).join(''),
    reviewsRest: otherReviews.map(reviewCard).join(''),
    faqTitle: esc(data.faqTitle),
    faq: faqHtml(pageFaq),
    aboutText: esc(key === 'home' ? SUMMARY : `${data.summary} ${SUMMARY}`),
    factsList,
    districtList: esc(DISTRICTS.join(', ')),
    closingWa: wa(photoMessage(data.photoNoun)),
    dockWa: wa(quoteMessage(data.phrase))
  });
}

export function renderBilgi() {
  const url = `${SITE}/bilgi`;
  const title = 'İzmir Balkon: Hizmetler, Fiyat, Bölgeler ve Sık Sorulanlar';
  const description = 'İzmir Balkon hakkında tüm bilgiler: cam balkon, kış bahçesi, pergola ve doğrama, fiyatı belirleyen etkenler, 30 ilçe, sık sorulanlar ve müşteri yorumları.';
  const allFaq = ALL_FAQ.flatMap(([, items]) => items);
  const reviewNodes = reviews.map(review => ({ '@type': 'Review', author: { '@type': 'Person', name: review.name }, datePublished: review.date, reviewBody: review.text, reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 }, itemReviewed: { '@id': `${SITE}/#isletme` } }));
  return fill(read('src/bilgi.html'), {
    title: esc(title),
    description: esc(description),
    canonical: url,
    mdUrl: '/bilgi.md',
    ogImage: `${SITE}/assets/work/villa-kose.jpg`,
    jsonld: graph([businessNode(), websiteNode, webPageNode(url, title, description), faqNode(allFaq, url), breadcrumb(url, 'Tüm bilgiler'), ...reviewNodes]),
    sprite,
    header: header('/'),
    footer,
    summary: esc(SUMMARY),
    factsList,
    wa: wa('Merhaba, ücretsiz keşif ve fiyat almak istiyorum.'),
    servicesDoc: serviceList.map(([id, s]) => `<h3><a href="${pathFor(id)}">${esc(s.cardLabel || s.label)}</a></h3><p>${esc(s.summary)}</p>`).join(''),
    priceDoc: PRICE_FACTORS.map(([name, text]) => `<li><strong>${esc(name)}:</strong> ${esc(text)}</li>`).join(''),
    askDoc: QUOTE_QUESTIONS.map(text => `<li>${esc(text)}</li>`).join(''),
    stepsDoc: STEPS.map(([name, text]) => `<li><strong>${esc(name)}:</strong> ${esc(text)}</li>`).join(''),
    faqDoc: ALL_FAQ.map(([group, items]) => `<h2>${esc(group)}</h2>${items.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}`).join(''),
    districtList: esc(DISTRICTS.join(', ')),
    reviewsAll: reviews.map(reviewCard).join(''),
    updated: UPDATED,
    updatedTr: UPDATED_TR
  });
}

const CONTACT_MD = `## İletişim

- Telefon: [${BUSINESS.phoneDisplay}](tel:${BUSINESS.phone})
- WhatsApp: [${BUSINESS.phoneDisplay}](https://wa.me/${BUSINESS.whatsapp})
- Hazır mesajla WhatsApp: \`https://wa.me/${BUSINESS.whatsapp}?text=<URL kodlu mesaj>\`. Mesajda hizmeti, yaklaşık ölçüyü ve ilçeyi yazın. Bağlantı yalnızca taslak açar; mesajı kullanıcı gönderir.`;
const FACTS_MD = `- İşletme: ${BUSINESS.name}, İzmir, Türkiye
- Hizmetler: cam balkon, kış bahçesi, pergola, PVC ve alüminyum doğrama, sineklik, cam değişimi
- Hizmet bölgesi: İzmir’in 30 ilçesinin tamamı
- Keşif: ücretsiz, yerinde
- Deneyim: ${BUSINESS.experience} (işletmenin beyanı)
- Müşteri: ${BUSINESS.customers} (işletmenin beyanı)
- Yayınlanan müşteri yorumu: ${reviews.length}, hepsi 5 üzerinden 5 yıldız
- Fiyat: internette tek fiyat yayınlanmaz; ölçüye göre net fiyat verilir
- Son güncelleme: ${UPDATED}`;
const faqMd = items => items.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n');
const reviewMd = review => `> ${review.text}\n>\n> ${review.name}, ${review.service}, ${review.date}, ${review.rating}/5`;

export function renderPageMarkdown(key) {
  const data = key === 'home' ? HOME : SERVICES[key];
  const url = key === 'home' ? `${SITE}/` : `${SITE}/${key}`;
  return `# ${data.h1Key}

${data.h1Line} ${data.lead}

Web sayfası: ${url}${ESTIMATES[key] ? '\n\n' + ESTIMATES[key].model + ': ' + [ESTIMATES[key].low, ESTIMATES[key].high].map(x => x.toLocaleString('tr-TR')).join('–') + ' TL/' + ESTIMATES[key].unit + '. ' + (ESTIMATES[key].ownerRange ? 'İzmir Balkon yaklaşık fiyatı. Net teklif ücretsiz keşifte belirlenir.' : 'Örnek piyasa aralığı. ' + ESTIMATES[key].scope) : ''}

${data.summary}

## Kısa bilgiler

${FACTS_MD}

## Hizmetler

${serviceList.map(([id, s]) => `- [${s.cardLabel || s.label}](${SITE}${mdFor(id)}): ${s.card}`).join('\n')}

## Fiyat neye göre değişir?

${PRICE_FACTORS.map(([name, text]) => `- ${name}: ${text}`).join('\n')}

Teklifleri karşılaştırırken sorulacaklar:

${QUOTE_QUESTIONS.map(text => `- ${text}`).join('\n')}

## Çalışma şekli

${STEPS.map(([name, text], index) => `${index + 1}. ${name}: ${text}`).join('\n')}

## ${data.faqTitle}

${faqMd(data.faq)}

## Seçme müşteri yorumları

${featuredReviews.map(reviewMd).join('\n\n')}

Tüm yorumlar ve bilgiler: ${SITE}/bilgi.md

${CONTACT_MD}
`;
}

export function renderBilgiMarkdown() {
  return `# İzmir Balkon hakkında tüm bilgiler

${SUMMARY}

${SUMMARY_EN}

Web sayfası: ${SITE}/bilgi

## Kısa bilgiler

${FACTS_MD}

## Hizmetler

${serviceList.map(([id, s]) => `### ${s.cardLabel || s.label}\n\n${s.summary}\n\nSayfa: ${SITE}${pathFor(id)}`).join('\n\n')}

## Fiyat neye göre değişir?

${PRICE_FACTORS.map(([name, text]) => `- ${name}: ${text}`).join('\n')}

Teklifleri karşılaştırırken sorulacaklar:

${QUOTE_QUESTIONS.map(text => `- ${text}`).join('\n')}

## Çalışma şekli

${STEPS.map(([name, text], index) => `${index + 1}. ${name}: ${text}`).join('\n')}

${ALL_FAQ.map(([group, items]) => `## ${group}\n\n${faqMd(items)}`).join('\n\n')}

## Hizmet verilen ilçeler

${DISTRICTS.join(', ')}

## Müşteri yorumları

Pencere, kapı, cam ve sineklik işlerinden sonra bırakılan yorumlar, kelimesi kelimesine.

${reviews.map(reviewMd).join('\n\n')}

${CONTACT_MD}
`;
}

export function renderLlms() {
  return `# İzmir Balkon

> ${SUMMARY}

${SUMMARY_EN}

Telefon ve WhatsApp: ${BUSINESS.phoneDisplay}. Keşif ücretsiz. Deneyim ve müşteri sayısı işletmenin beyanıdır: ${BUSINESS.experience} deneyim, ${BUSINESS.customers} müşteri. Yayınlanan ${reviews.length} müşteri yorumunun hepsi 5 yıldızdır.

## Hizmetler

${serviceList.map(([id, s]) => `- [${s.cardLabel || s.label}](${SITE}${mdFor(id)}): ${s.summary}`).join('\n')}

## Bilgi

- [Tüm bilgiler](${SITE}/bilgi.md): hizmetler, fiyatı belirleyen etkenler, 30 ilçe, sık sorulanlar ve ${reviews.length} müşteri yorumu
- [Ana sayfa](${SITE}/index.md): genel tanıtım ve sık sorulanlar

## Kullanıcı adına iletişim

- Arama: tel:${BUSINESS.phone}
- WhatsApp taslağı: https://wa.me/${BUSINESS.whatsapp}?text=<URL kodlu mesaj>. Mesajda hizmeti, yaklaşık ölçüyü ve ilçeyi yazın. Bağlantı yalnızca taslak açar; mesajı kullanıcı gönderir.
- Fiyat bilgisi internette yayınlanmaz. Kullanıcıya fiyat uydurmayın; ölçüye göre net fiyatı işletmeden istemesini önerin.

## Optional

- [llms-full.txt](${SITE}/llms-full.txt): tüm bilgilerin tek dosyası
`;
}

export function renderSitemap() {
  const entry = (loc, images = []) => `<url><loc>${loc}</loc><lastmod>${UPDATED}</lastmod>${images.map(([src, caption]) => `<image:image><image:loc>${SITE}${src}</image:loc><image:caption>${esc(caption)}</image:caption></image:image>`).join('')}</url>`;
  const ownWork = GALLERY.flat().map(item => [`/assets/work/${item.file}.webp`, `İzmir Balkon uygulaması: ${item.title}`]);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entry(`${SITE}/`, ownWork)}${serviceList.map(([id]) => entry(`${SITE}/${id}`)).join('')}${entry(`${SITE}/bilgi`)}</urlset>
`;
}

// Every generated file, keyed by its public path. The build and the dev server both use this.
export function renderAll() {
  const files = new Map();
  files.set('/index.html', renderPage('home'));
  files.set('/index.md', renderPageMarkdown('home'));
  for (const [key] of serviceList) {
    files.set(`/${key}.html`, renderPage(key));
    files.set(`/${key}.md`, renderPageMarkdown(key));
  }
  files.set('/bilgi.html', renderBilgi());
  files.set('/bilgi.md', renderBilgiMarkdown());
  files.set('/llms.txt', renderLlms());
  files.set('/llms-full.txt', renderBilgiMarkdown());
  files.set('/sitemap.xml', renderSitemap());
  return files;
}

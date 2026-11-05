// Ad landing pages. Each ad group gets its own URL whose headline, photo and first wizard step
// match the ad, so the visitor sees what they clicked on. All of them render from public/index.html.
const SITE = 'https://izmirbalkon.com';
const wa = text => `https://wa.me/905423551213?text=${encodeURIComponent(text)}`;
const heroPreload = (lg, sm, lgW) => `<link rel="preload" as="image" href="${lg}" imagesrcset="${sm} 800w, ${lg} ${lgW}w" imagesizes="100vw" fetchpriority="high">`;
const heroImg = (lg, sm, lgW, h, alt) => `<img class="hero-img" src="${lg}" srcset="${sm} 800w, ${lg} ${lgW}w" sizes="100vw" width="${lgW}" height="${h}" fetchpriority="high" alt="${alt}">`;
const h1 = (key, line) => `<span class="h1-key">${key}</span> <span class="h1-line">${line}</span>`;
const pageTitle = name => `${name} | Ücretsiz Keşif, Ölçünüze Özel Fiyat · İzmir Balkon`;
const pageDescription = name => `İzmir’in 30 ilçesinde ${name}. Ücretsiz keşif, ölçünüze özel net fiyat. 3 kısa soruyu yanıtlayın, WhatsApp’tan yazın ya da arayın: 0542 355 12 13.`;
const ogTitle = name => `İzmir’de ${name} | Ücretsiz keşif · İzmir Balkon`;
const TAG = '<span class="photo-tag">Temsili görsel</span>';

const base = {
  title: `<title>${pageTitle('İzmir Cam Balkon')}</title>`,
  description: `<meta name="description" content="${pageDescription('cam balkon')}">`,
  canonical: `<link rel="canonical" href="${SITE}/">`,
  ogTitle: `<meta property="og:title" content="${ogTitle('cam balkon')}">`,
  ogUrl: `<meta property="og:url" content="${SITE}/">`,
  ogImage: `<meta property="og:image" content="${SITE}/assets/stock/cam-balkon.jpg">`,
  preload: heroPreload('/assets/stock/cam-balkon.webp', '/assets/stock/cam-balkon-sm.webp', 1600),
  heroImg: heroImg('/assets/stock/cam-balkon.webp', '/assets/stock/cam-balkon-sm.webp', 1600, 1066, 'Çerçevesiz camlarla kapatılmış balkonda hasır koltuklar; camların ardında ağaçlar ve binalar görünüyor'),
  heroTag: TAG,
  h1: h1('İzmir’de cam balkon', 'Rüzgâra kapalı, manzaraya açık.'),
  body: '<body data-service="">',
  dockWa: wa('Merhaba, cam balkon için ücretsiz keşif ve fiyat almak istiyorum.'),
  closingWa: wa('Merhaba, ücretsiz keşif istiyorum. Balkonumun fotoğrafını gönderiyorum.'),
  bubble: 'Merhaba, ücretsiz keşif istiyorum. Balkonumun fotoğrafını gönderiyorum.',
  count: 'data-wiz-count aria-live="polite">Adım 1 / 3<',
  at: 'class="wiz" data-at="service"',
  stepService: '<div class="wiz-step" data-step="service">',
  stepSize: '<div class="wiz-step" data-step="size" hidden>'
};

function page(key, { slug = key, name, canonicalSlug = slug, picked, sizesAttr, hero, line, keyLine, photoNoun, dockPhrase, heroTag = TAG }) {
  const canonical = canonicalSlug ? `${SITE}/${canonicalSlug}` : `${SITE}/`;
  const bubble = `Merhaba, ücretsiz keşif istiyorum. ${photoNoun} fotoğrafını gönderiyorum.`;
  return {
    slug,
    service: key,
    canonical,
    h1: keyLine,
    replace: {
      title: `<title>${pageTitle(name.title)}</title>`,
      description: `<meta name="description" content="${pageDescription(name.text)}">`,
      canonical: `<link rel="canonical" href="${canonical}">`,
      ogTitle: `<meta property="og:title" content="${ogTitle(name.text)}">`,
      ogUrl: `<meta property="og:url" content="${canonical}">`,
      ogImage: `<meta property="og:image" content="${SITE}${hero.og}">`,
      preload: heroPreload(hero.lg, hero.sm, hero.w),
      heroImg: heroImg(hero.lg, hero.sm, hero.w, hero.h, hero.alt),
      heroTag,
      h1: h1(keyLine, line),
      body: `<body data-service="${key}">`,
      dockWa: wa(`Merhaba, ${dockPhrase} için ücretsiz keşif ve fiyat almak istiyorum.`),
      closingWa: wa(bubble),
      bubble,
      // The service is already chosen by the ad, so the visitor starts one step in.
      count: base.count.replace('Adım 1', 'Adım 2'),
      at: 'class="wiz" data-at="size"',
      stepService: '<div class="wiz-step" data-step="service" hidden>',
      stepSize: '<div class="wiz-step" data-step="size">'
    },
    extra: [
      [`<div class="wiz-sizes" data-for="${key}" hidden>`, `<div class="wiz-sizes" data-for="${key}">`],
      ['<span data-wiz-service>Cam balkon</span>', `<span data-wiz-service>${picked}</span>`]
    ]
  };
}

export const variants = [
  page('cam-balkon', {
    name: { title: 'İzmir Cam Balkon', text: 'cam balkon' },
    // Same promise as the home page, so the home page stays the one indexed version.
    canonicalSlug: '',
    picked: 'Cam balkon',
    hero: { lg: '/assets/stock/cam-balkon.webp', sm: '/assets/stock/cam-balkon-sm.webp', w: 1600, h: 1066, og: '/assets/stock/cam-balkon.jpg', alt: 'Çerçevesiz camlarla kapatılmış balkonda hasır koltuklar; camların ardında ağaçlar ve binalar görünüyor' },
    keyLine: 'İzmir’de cam balkon',
    line: 'Rüzgâra kapalı, manzaraya açık.',
    photoNoun: 'Balkonumun',
    dockPhrase: 'cam balkon'
  }),
  page('kis-bahcesi', {
    name: { title: 'İzmir Kış Bahçesi', text: 'kış bahçesi' },
    picked: 'Kış bahçesi',
    hero: { lg: '/assets/stock/kis-bahcesi.webp', sm: '/assets/stock/kis-bahcesi-sm.webp', w: 1600, h: 900, og: '/assets/stock/kis-bahcesi.jpg', alt: 'Cam çatılı kış bahçesinde hasır koltuk takımı; camların ardında yeşil bahçe görünüyor' },
    keyLine: 'İzmir’de kış bahçesi',
    line: 'Yağmura kapalı, gökyüzüne açık.',
    photoNoun: 'Terasımın',
    dockPhrase: 'kış bahçesi'
  }),
  page('pergola', {
    name: { title: 'İzmir Pergola Sistemleri', text: 'pergola' },
    picked: 'Pergola',
    hero: { lg: '/assets/stock/pergola.webp', sm: '/assets/stock/pergola-sm.webp', w: 1600, h: 1066, og: '/assets/stock/pergola.jpg', alt: 'Taş döşemeli terasta beyaz pergola altında yemek masası; ötede gün batımında bahçe' },
    keyLine: 'İzmir’de pergola',
    line: 'Güneşe gölge, yağmura çatı.',
    photoNoun: 'Terasımın',
    dockPhrase: 'pergola'
  }),
  page('dograma', {
    name: { title: 'İzmir PVC ve Alüminyum Doğrama', text: 'PVC ve alüminyum doğrama' },
    picked: 'Pencere ve kapı',
    hero: { lg: '/assets/work/villa-kose.webp', sm: '/assets/work/villa-kose-sm.webp', w: 1419, h: 716, og: '/assets/work/villa-kose.jpg', alt: 'Çimenli bahçeye bakan villanın köşesinde koyu çerçeveli, geniş sürme doğrama camları' },
    keyLine: 'İzmir’de PVC ve alüminyum doğrama',
    line: 'Sese ve soğuğa kapalı, ışığa açık.',
    photoNoun: 'Pencerelerimin',
    dockPhrase: 'pencere ve kapı doğraması',
    // This one is the business's own finished job, so it carries no "representative" tag.
    heroTag: ''
  })
];

export function renderVariant(html, variant) {
  let out = html;
  for (const [field, from] of Object.entries(base)) {
    if (!out.includes(from)) throw new Error(`index.html no longer contains the ${field} marker: ${from}`);
    out = out.replaceAll(from, variant.replace[field]);
  }
  for (const [from, to] of variant.extra) {
    if (!out.includes(from)) throw new Error(`index.html no longer contains: ${from}`);
    out = out.replaceAll(from, to);
  }
  return out;
}

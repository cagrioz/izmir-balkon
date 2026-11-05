// The single source for every fact the site states. HTML, Markdown, JSON-LD and llms.txt
// all render from here, so people and AI agents always read the same thing.
export const SITE = 'https://izmirbalkon.com';
export const UPDATED = '2026-11-05';
export const UPDATED_TR = '5 Kasım 2026';

export const BUSINESS = {
  name: 'İzmir Balkon',
  phone: '+905423551213',
  phoneDisplay: '0542 355 12 13',
  whatsapp: '905423551213',
  city: 'İzmir',
  // Stated by the owner on 5 November 2026. See docs/ASSETS.md.
  experience: '15+ yıl',
  customers: '200+',
  districtCount: 30
};

export const DISTRICTS = ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'];

export const SUMMARY = 'İzmir Balkon, İzmir’in 30 ilçesinde cam balkon, kış bahçesi, pergola, PVC ve alüminyum doğrama işleri yapan yerel bir firmadır. 15 yılı aşkın deneyimiyle yerinde ücretsiz keşif yapar, ölçüye göre net fiyat verir ve montajı üstlenir.';
export const SUMMARY_EN = 'İzmir Balkon is a local glazing company serving all 30 districts of İzmir, Turkey: glass balcony enclosures, winter gardens, pergolas, and PVC and aluminium windows and doors. It offers a free on-site survey and a clear quote based on measurements.';

export const PRICE_FACTORS = [
  ['Ölçü', 'Kapatılacak alanın eni ve yüksekliği.'],
  ['Sistem', 'Katlanır, sürme, kış bahçesi ya da pergola.'],
  ['Cam', 'Camın tipi ve kalınlığı.'],
  ['Profil', 'Profil, renk ve aksesuar seçimi.']
];
export const QUOTE_QUESTIONS = ['Montaj ve KDV fiyata dahil mi?', 'Camın kalınlığı ve tipi ne?', 'Profilin markası ve rengi ne?', 'Garanti koşulları neler?'];
export const STEPS = [
  ['Ücretsiz keşif', 'Yerinde bakar, ölçü alırız.'],
  ['Net teklif', 'Sistemi ve fiyatı netleştiririz.'],
  ['Planlı montaj', 'Kararlaştırdığımız gün montajı yaparız.']
];

const PERMISSION_NOTE = 'Bu genel bir bilgilendirmedir, hukuki danışmanlık değildir.';
const FAQ = {
  price: ['İzmir’de cam balkon fiyatı ne kadar?', 'Fiyat ölçüye, sisteme, cam ve profile göre değişir; bu yüzden tek bir metrekare fiyatı yanıltıcı olur. Ölçünüze göre net fiyat söyleriz. Yaklaşık ölçünüzü ve bir fotoğrafı WhatsApp’tan gönderirseniz keşiften önce de konuşabiliriz.'],
  use: ['Cam balkon ne işe yarar?', 'Balkonu rüzgâr, yağmur ve tozdan korur. İmbat esince camları kapatır, hava güzelken açarsınız; balkonu yılın daha büyük bölümünde kullanırsınız.'],
  fold: ['Katlanır mı, sürme mi?', 'Katlanırda kanatlar yana toplanır, balkon açık kalır. Sürmede paneller ray üzerinde kayar, içeride yer kaplamaz. Hangisinin uygun olduğuna keşifte birlikte bakarız.'],
  permit: ['Apartmanda cam balkon için izin gerekir mi?', `Balkon kapatma dış cepheyi etkilediği için kat maliklerinin yazılı onayı gerekebilir. Yönetim planında aksi yazmıyorsa bu oran genellikle beşte dörttür. Başlamadan önce yönetim planınıza bakın ve yöneticinize danışın. ${PERMISSION_NOTE}`],
  gardenWhat: ['Kış bahçesi nedir?', 'Teras ya da bahçenin çatısı ve yanları camla kapatılarak yıl boyu kullanılabilen bir oturma alanına dönüştürülmesidir.'],
  gardenVsPergola: ['Kış bahçesi ile pergola arasındaki fark nedir?', 'Kış bahçesinde çatı ve yanlar kapalıdır, alan oda gibi kullanılır. Pergolada öncelik gölge ve yağmur korumasıdır, yanlar genellikle açık kalır.'],
  gardenPrice: ['Kış bahçesi fiyatı neye göre değişir?', 'Alanın ölçüsüne, çatı ve cam sistemine, profile göre değişir. Ölçünüze göre net fiyatı keşifte söyleriz.'],
  gardenPermit: ['Kış bahçesi için izin gerekir mi?', `Binanın durumuna göre değişir. Ortak alanı ya da dış cepheyi etkiliyorsa kat maliklerinin onayı, bazı durumlarda belediye izni gerekebilir. Başlamadan önce yönetim planınıza bakın, belediyenize danışın. ${PERMISSION_NOTE}`],
  pergolaUse: ['Pergola ne işe yarar?', 'Teras ve bahçede gölge ve yağmur koruması sağlar, açık alanı daha çok kullanmanızı sağlar.'],
  pergolaPrice: ['Pergola fiyatı neye göre değişir?', 'Alanın ölçüsüne, sistem tipine ve profile göre değişir. Ölçünüze göre net fiyatı keşifte söyleriz.'],
  pvcVsAlu: ['PVC mi, alüminyum mu?', 'PVC doğrama ev pencerelerinde yaygındır. Alüminyum, ince profille geniş cam açıklıkları, sürme sistemler ve mağaza girişleri için tercih edilir. Hangisinin uygun olduğuna keşifte birlikte bakarız.'],
  pvcPrice: ['Pencere ve kapı fiyatı neye göre değişir?', 'Adete, ölçüye, profil ve cam tipine göre değişir. Ölçünüze göre net fiyatı keşifte söyleriz.'],
  small: ['Sadece cam değişimi veya sineklik de yapıyor musunuz?', 'Evet, cam değişimi ve sineklik işleri de yapıyoruz.'],
  send: ['Fiyat almak için ne göndermeliyim?', 'Hizmeti, yaklaşık ölçüyü ve ilçenizi yazmanız yeterli. Bir fotoğraf eklerseniz fiyat daha net çıkar. Net fiyatı keşifte söyleriz.'],
  free: ['Keşif gerçekten ücretsiz mi?', 'Evet, keşif ücretsizdir. İlçenizi söyleyin, uygun bir gün planlayalım.'],
  areas: ['Hangi ilçelere geliyorsunuz?', `İzmir’in 30 ilçesinin tamamına geliyoruz: ${DISTRICTS.join(', ')}.`],
  time: ['Ne kadar sürede tamamlanır?', 'Süre ölçüye, sisteme ve iş planına göre değişir. Takvimi teklifle birlikte netleştiririz.'],
  pay: ['Ödemeyi nasıl yapıyoruz?', 'Ödeme koşullarını teklifle birlikte konuşuruz.']
};
const COMMON = [FAQ.send, FAQ.free, FAQ.areas, FAQ.time, FAQ.pay];

export const SERVICES = {
  'cam-balkon': {
    label: 'Cam balkon', phrase: 'cam balkon', fact: 'Yaklaşık ölçü', photoNoun: 'Balkonumun',
    title: 'İzmir Cam Balkon: Ücretsiz Keşif, Net Fiyat | İzmir Balkon',
    description: 'İzmir’in 30 ilçesinde katlanır ve sürme cam balkon. 15+ yıl deneyim, ücretsiz keşif, ölçünüze özel net fiyat. WhatsApp veya telefon: 0542 355 12 13.',
    h1Key: 'İzmir’de cam balkon', h1Line: 'Rüzgâra kapalı, manzaraya açık.',
    lead: 'Katlanır ve sürme cam balkon. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
    summary: 'Cam balkon, balkonu rüzgâr, yağmur ve tozdan koruyan, istendiğinde açılan cam kapatma sistemidir. İzmir Balkon katlanır ve sürme sistem uygular.',
    card: 'Katlanır veya sürme. Rüzgârı, yağmuru ve tozu dışarıda bırakır, istediğinizde açılır.',
    faqTitle: 'Cam balkon hakkında sık sorulanlar',
    faq: [FAQ.price, FAQ.use, FAQ.fold, FAQ.permit, ...COMMON],
    hero: { lg: '/assets/stock/cam-balkon.webp', sm: '/assets/stock/cam-balkon-sm.webp', w: 1600, h: 1066, og: '/assets/stock/cam-balkon.jpg', ogW: 1200, ogH: 800, alt: 'Ahşap terası çerçevesiz cam panellerle kapatılmış balkon; camların ardında dağ manzarası' },
    cardImg: { src: '/assets/stock/cam-balkon-sm.webp', w: 800, h: 533 }
  },
  'kis-bahcesi': {
    label: 'Kış bahçesi', phrase: 'kış bahçesi', fact: 'Yaklaşık alan', photoNoun: 'Terasımın',
    title: 'İzmir Kış Bahçesi: Ücretsiz Keşif, Net Fiyat | İzmir Balkon',
    description: 'İzmir’in 30 ilçesinde teras ve bahçeye kış bahçesi. 15+ yıl deneyim, ücretsiz keşif, ölçünüze özel net fiyat. WhatsApp veya telefon: 0542 355 12 13.',
    h1Key: 'İzmir’de kış bahçesi', h1Line: 'Yağmura kapalı, gökyüzüne açık.',
    lead: 'Terasınız ya da bahçeniz yıl boyu oturma alanına dönüşsün. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
    summary: 'Kış bahçesi, teras ya da bahçenin çatısı ve yanları camla kapatılarak yıl boyu kullanılabilen bir oturma alanına dönüştürülmesidir.',
    card: 'Terasınız ya da bahçeniz, çatısıyla birlikte camla kapalı bir oturma alanına dönüşür.',
    faqTitle: 'Kış bahçesi hakkında sık sorulanlar',
    faq: [FAQ.gardenWhat, FAQ.gardenPrice, FAQ.gardenVsPergola, FAQ.gardenPermit, ...COMMON],
    hero: { lg: '/assets/stock/kis-bahcesi.webp', sm: '/assets/stock/kis-bahcesi-sm.webp', w: 1600, h: 900, og: '/assets/stock/kis-bahcesi.jpg', ogW: 1200, ogH: 675, alt: 'Cam çatılı kış bahçesinde hasır koltuk takımı; camların ardında yeşil bahçe görünüyor' },
    cardImg: { src: '/assets/stock/kis-bahcesi-sm.webp', w: 800, h: 450 }
  },
  pergola: {
    label: 'Pergola', phrase: 'pergola', fact: 'Yaklaşık alan', photoNoun: 'Terasımın',
    title: 'İzmir Pergola Sistemleri: Ücretsiz Keşif | İzmir Balkon',
    description: 'İzmir’in 30 ilçesinde teras ve bahçeye pergola. 15+ yıl deneyim, ücretsiz keşif, ölçünüze özel net fiyat. WhatsApp veya telefon: 0542 355 12 13.',
    h1Key: 'İzmir’de pergola', h1Line: 'Güneşe gölge, yağmura çatı.',
    lead: 'Teras ve bahçeniz için gölge ve yağmur koruması. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
    summary: 'Pergola, teras ve bahçede gölge ve yağmur koruması sağlayan çatı sistemidir. Yanlar genellikle açık kalır.',
    card: 'Teras ve bahçeniz için gölge ve yağmur koruması.',
    faqTitle: 'Pergola hakkında sık sorulanlar',
    faq: [FAQ.pergolaUse, FAQ.pergolaPrice, FAQ.gardenVsPergola, ...COMMON],
    hero: { lg: '/assets/stock/pergola.webp', sm: '/assets/stock/pergola-sm.webp', w: 1600, h: 1066, og: '/assets/stock/pergola.jpg', ogW: 1200, ogH: 800, alt: 'Taş döşemeli terasta beyaz pergola altında yemek masası; ötede gün batımında bahçe' },
    cardImg: { src: '/assets/stock/pergola-sm.webp', w: 800, h: 533 }
  },
  dograma: {
    label: 'Pencere ve kapı', phrase: 'pencere ve kapı doğraması', fact: 'Yaklaşık adet', photoNoun: 'Pencerelerimin',
    cardLabel: 'PVC ve alüminyum doğrama',
    title: 'İzmir PVC ve Alüminyum Doğrama: Ücretsiz Keşif | İzmir Balkon',
    description: 'İzmir’in 30 ilçesinde PVC ve alüminyum pencere, kapı, sürme sistem, sineklik ve cam değişimi. 15+ yıl deneyim, ücretsiz keşif. 0542 355 12 13.',
    h1Key: 'İzmir’de PVC ve alüminyum doğrama', h1Line: 'Sese ve soğuğa kapalı, ışığa açık.',
    lead: 'Pencere, kapı, sürme sistem, sineklik ve cam değişimi. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
    summary: 'İzmir Balkon, ev ve iş yerleri için PVC ve alüminyum pencere, kapı ve sürme sistem uygular; sineklik ve cam değişimi de yapar.',
    card: 'Pencere, kapı, sürme sistem, sineklik ve cam değişimi.',
    faqTitle: 'Doğrama hakkında sık sorulanlar',
    faq: [FAQ.pvcVsAlu, FAQ.pvcPrice, FAQ.small, ...COMMON],
    hero: { lg: '/assets/work/villa-kose.webp', sm: '/assets/work/villa-kose-sm.webp', w: 1419, h: 716, og: '/assets/work/villa-kose.jpg', ogW: 1419, ogH: 716, alt: 'Çimenli bahçeye bakan villanın köşesinde koyu çerçeveli, geniş sürme doğrama camları' },
    cardImg: { src: '/assets/work/villa-kose-sm.webp', w: 800, h: 404 }
  }
};

export const HOME = {
  ...SERVICES['cam-balkon'],
  title: 'İzmir Cam Balkon ve Kış Bahçesi: Ücretsiz Keşif | İzmir Balkon',
  description: 'İzmir’in 30 ilçesinde cam balkon, kış bahçesi, pergola ve doğrama. 15+ yıl deneyim, ücretsiz keşif, ölçünüze özel net fiyat. 0542 355 12 13.',
  h1Key: 'İzmir’de cam balkon ve kış bahçesi',
  lead: 'Cam balkon, kış bahçesi, pergola ve doğrama. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
  summary: SUMMARY,
  faqTitle: 'Sık sorulanlar',
  faq: [FAQ.price, FAQ.fold, FAQ.gardenVsPergola, FAQ.permit, ...COMMON]
};

export const ALL_FAQ = [
  ['Fiyat', [FAQ.price, FAQ.gardenPrice, FAQ.pergolaPrice, FAQ.pvcPrice, FAQ.send, FAQ.pay]],
  ['Cam balkon', [FAQ.use, FAQ.fold, FAQ.permit]],
  ['Kış bahçesi ve pergola', [FAQ.gardenWhat, FAQ.gardenVsPergola, FAQ.pergolaUse, FAQ.gardenPermit]],
  ['Doğrama', [FAQ.pvcVsAlu, FAQ.small]],
  ['Keşif ve montaj', [FAQ.free, FAQ.areas, FAQ.time]]
];

export const VOC = [
  ['Ölçü', 'Ölçüler tam oturdu, kapı ve pencereler çok rahat çalışıyor, ne ısı ne de ses sızdırıyor.', 'Enes D.'],
  ['Zaman', 'Söz verdikleri günden önce gelip çok temiz güzel işlerini kısa zamanda bitirdiler', 'Metin B.'],
  ['Temizlik', 'Montaj sonrası etrafı tertemiz bırakmaları da ayrı bir incelikti.', 'Enes D.'],
  ['Fiyat', 'şişirilmiş, keyfi fiyatlar da vermiyor, ödeme konusunda da yardımcı oluyor.', 'Buse D.']
];
export const HERO_QUOTE = ['İşçilik kalitesi tek kelimeyle muazzam; insan kendi evine yapsa ancak bu kadar özenir.', 'Erdem E.'];
export const PROCESS_QUOTE = ['Ustam geldi ölçü aldı. Fiyat çıkardı. Acelemiz vardı. Sağolsun dediği günde de bitirdi.', 'Mustafa Kürşat A.'];
export const FEATURED_REVIEWS = ['Erdem E.', 'Enes D.', 'Mustafa Kürşat A.', 'Ebru C.', 'Metin B.', 'Dilek A.'];

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

const VILLA_HERO = { lg: '/assets/work/villa-kose.webp', sm: '/assets/work/villa-kose-sm.webp', w: 1419, h: 716, og: '/assets/work/villa-kose.jpg', ogW: 1419, ogH: 716, pos: '42% 50%', alt: 'Çimenli bahçeye bakan villanın köşesinde koyu çerçeveli, geniş sürme doğrama camları' };

export const SERVICES = {
  'cam-balkon': {
    label: 'Cam balkon', phrase: 'cam balkon', fact: 'Yaklaşık ölçü', photoNoun: 'Balkonumun',
    title: 'İzmir Cam Balkon Fiyat Hesaplama | İzmir Balkon',
    description: 'Balkonunuzun cam alanını girin, yaklaşık fiyatı görün. İzmir’de ücretsiz keşif ve ölçünüze özel teklif isteyin.',
    h1Key: 'İzmir’de cam balkon', h1Line: 'Katlanır ve sürme cam sistemleri',
    lead: 'Katlanır ve sürme cam balkon. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
    summary: 'Cam balkon, balkonu rüzgâr, yağmur ve tozdan koruyan, istendiğinde açılan cam kapatma sistemidir. İzmir Balkon katlanır ve sürme sistem uygular.',
    card: 'Katlanır veya sürme. Rüzgârı, yağmuru ve tozu dışarıda bırakır, istediğinizde açılır.',
    faqTitle: 'Cam balkon hakkında sık sorulanlar',
    faq: [FAQ.price, FAQ.use, FAQ.fold, FAQ.permit, ...COMMON],
    hero: { lg: '/assets/work/cam-balkon-genis.webp', sm: '/assets/work/cam-balkon-genis-sm.webp', w: 1086, h: 796, og: '/assets/work/cam-balkon-genis.jpg', ogW: 1086, ogH: 796, pos: '50% 72%', alt: 'Usta, balkon girişine taktığı çerçevesiz cam panellerin üst kısmında son ayarı yapıyor' },
    cardImg: { src: '/assets/stock/balkon-sm.webp', w: 800, h: 533, pos: '66% 50%' }
  },
  'kis-bahcesi': {
    label: 'Kış bahçesi', phrase: 'kış bahçesi', fact: 'Yaklaşık alan', photoNoun: 'Terasımın',
    title: 'İzmir Kış Bahçesi Fiyat Hesaplama | İzmir Balkon',
    description: 'Kış bahçenizin zemin alanına göre panel çatı ve sürme cam için yaklaşık bütçeyi görün. Ölçünüze özel teklif ve ücretsiz keşif isteyin.',
    h1Key: 'İzmir’de kış bahçesi', h1Line: 'Teras ve bahçeler için cam kapama',
    lead: 'Terasınız ya da bahçeniz yıl boyu oturma alanına dönüşsün. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
    summary: 'Kış bahçesi, teras ya da bahçenin çatısı ve yanları camla kapatılarak yıl boyu kullanılabilen bir oturma alanına dönüştürülmesidir.',
    card: 'Terasınız ya da bahçeniz, çatısıyla birlikte camla kapalı bir oturma alanına dönüşür.',
    faqTitle: 'Kış bahçesi hakkında sık sorulanlar',
    faq: [FAQ.gardenWhat, FAQ.gardenPrice, FAQ.gardenVsPergola, FAQ.gardenPermit, ...COMMON],
    hero: { lg: '/assets/stock/sunroom.webp', sm: '/assets/stock/sunroom-sm.webp', w: 1600, h: 1066, og: '/assets/stock/sunroom.jpg', ogW: 1200, ogH: 800, pos: '50% 90%', alt: 'Bahçeli evin yanına eklenmiş, açık renk çerçeveli camlı kış bahçesi; önünde çimen ve ağaçlar' },
    cardImg: { src: '/assets/stock/sunroom-sm.webp', w: 800, h: 533, pos: '58% 60%' }
  },
  pergola: {
    label: 'Pergola', phrase: 'pergola', fact: 'Yaklaşık alan', photoNoun: 'Terasımın',
    title: 'İzmir Pergola Fiyat Hesaplama | İzmir Balkon',
    description: 'Terasınızın ölçüsünü girin, sabit pergola için yaklaşık fiyat aralığını görün. İzmir’de ücretsiz keşif ve net teklif için bize yazın.',
    h1Key: 'İzmir’de pergola', h1Line: 'Teras ve bahçeler için gölgelendirme',
    lead: 'Teras ve bahçeniz için gölge ve yağmur koruması. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
    summary: 'Pergola, teras ve bahçede gölge ve yağmur koruması sağlayan çatı sistemidir. Yanlar genellikle açık kalır.',
    card: 'Teras ve bahçeniz için gölge ve yağmur koruması.',
    faqTitle: 'Pergola hakkında sık sorulanlar',
    faq: [FAQ.pergolaUse, FAQ.pergolaPrice, FAQ.gardenVsPergola, ...COMMON],
    hero: { lg: '/assets/stock/pergola.webp', sm: '/assets/stock/pergola-sm.webp', w: 1600, h: 1066, og: '/assets/stock/pergola.jpg', ogW: 1200, ogH: 800, pos: '70% 45%', alt: 'Taş döşemeli terasta beyaz pergola altında yemek masası; ötede gün batımında bahçe' },
    cardImg: { src: '/assets/stock/pergola-sm.webp', w: 800, h: 533, pos: '72% 50%' }
  },
  dograma: {
    label: 'Pencere ve kapı', phrase: 'pencere ve kapı doğraması', fact: 'Yaklaşık adet', photoNoun: 'Pencerelerimin',
    cardLabel: 'PVC ve alüminyum doğrama',
    title: 'İzmir PVC Pencere ve Doğrama Fiyatları | İzmir Balkon',
    description: 'Standart PVC pencere için adede göre yaklaşık bütçeyi görün. Farklı ölçüler, kapılar ve alüminyum doğrama için İzmir’de ücretsiz keşif isteyin.',
    h1Key: 'İzmir’de PVC ve alüminyum doğrama', h1Line: 'Pencere, kapı ve sürme sistemler',
    lead: 'Pencere, kapı, sürme sistem, sineklik ve cam değişimi. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
    summary: 'İzmir Balkon, ev ve iş yerleri için PVC ve alüminyum pencere, kapı ve sürme sistem uygular; sineklik ve cam değişimi de yapar.',
    card: 'Pencere, kapı, sürme sistem, sineklik ve cam değişimi.',
    faqTitle: 'Doğrama hakkında sık sorulanlar',
    faq: [FAQ.pvcVsAlu, FAQ.pvcPrice, FAQ.small, ...COMMON],
    hero: VILLA_HERO,
    cardImg: { src: '/assets/work/villa-kose-sm.webp', w: 800, h: 404, pos: '42% 50%' }
  }
};

export const HOME = {
  ...SERVICES['cam-balkon'],
  title: 'İzmir Cam Balkon ve Kış Bahçesi: Ücretsiz Keşif | İzmir Balkon',
  description: 'İzmir’in 30 ilçesinde cam balkon, kış bahçesi, pergola ve doğrama. 15+ yıl deneyim, ücretsiz keşif, ölçünüze özel net fiyat. 0542 355 12 13.',
  h1Key: 'İzmir’de cam balkon ve kış bahçesi', h1Line: 'Rüzgâra kapalı, manzaraya açık.',
  lead: 'Cam balkon, kış bahçesi, pergola ve doğrama. Ücretsiz keşifte ölçünüzü alır, net fiyatı söyleriz.',
  summary: SUMMARY,
  hero: VILLA_HERO,
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
export const HERO_QUOTES = [
  ['İşçilik kalitesi tek kelimeyle muazzam; insan kendi evine yapsa ancak bu kadar özenir.', 'Erdem E.'],
  ['İşini özenle ve titizlikle yapan, söz verdiği zamanda gelen ve işini hakkıyla yapan bir usta.', 'Dilek A.'],
  ['Zamanında geldi, hızlı çalıştı ve ortaya gerçekten temiz ve kaliteli bir iş çıkardı.', 'Dilfuza S.'],
  ['Eğitim kurumunuzun camlarını 3 günde bitirdi. Hem kaliteli hem de hızlı bir işçilik.', 'Ebru C.'],
  ['Gerçekten işini hakkıyla yapan, ilgili ve saygılı bir usta.', 'Özkan K.']
];
export const PROCESS_QUOTE = ['Ustam geldi ölçü aldı. Fiyat çıkardı. Acelemiz vardı. Sağolsun dediği günde de bitirdi.', 'Mustafa Kürşat A.'];
export const FEATURED_REVIEWS = ['Erdem E.', 'Enes D.', 'Mustafa Kürşat A.', 'Ebru C.', 'Metin B.', 'Dilek A.'];

// The owner's own photographs only. Each keeps its own ratio; rows are justified by these ratios.
export const GALLERY = [
  [
    { file: 'villa-kose', sm: 800, w: 1419, h: 716, title: 'Köşe sürme doğrama', note: 'Villa, tamamlanmış uygulama', alt: 'Çimenli bahçeye bakan villanın köşesinde koyu çerçeveli, geniş sürme doğrama camları', vw: 62 },
    { file: 'cam-balkon-usta', sm: 520, w: 786, h: 760, title: 'Çerçevesiz cam', note: 'Montajda son ayar', alt: 'Usta, çerçevesiz camın üst kısmında elini uzatmış ayar yapıyor', vw: 33 }
  ],
  [
    { file: 'villa-detay', sm: 480, w: 685, h: 1000, title: 'Sürme doğrama ve sineklik', note: 'Aynı villadan yakın plan', alt: 'Koyu çerçeveli sürme doğramanın yakından görünümü; camda bahçe yansıyor, sağda sineklik kanadı', vw: 20 },
    { file: 'cam-bolme-tamam', sm: 600, w: 1200, h: 1600, title: 'Alüminyum cam bölme', note: 'İç mekân, tamamlanmış', alt: 'Koyu alüminyum çerçeveli, camlı kapısı olan köşe cam bölme', vw: 22 },
    { file: 'dis-kapi', w: 828, h: 465, title: 'Dış kapı doğraması', note: 'Koyu çerçeve, çift kanat', alt: 'Taş duvarlı evde koyu çerçeveli, çift kanatlı camlı dış kapı', vw: 52 }
  ],
  [
    { file: 'cam-korkuluk', sm: 600, w: 1200, h: 1600, title: 'Cam korkuluk', note: 'İç mekân, tamamlanmış', alt: 'Resepsiyon alanında cam korkuluk', vw: 22 },
    { file: 'villa-dis', w: 774, h: 390, title: 'Villa doğramaları', note: 'İki katlı villa, dış görünüm', alt: 'İki katlı beyaz villanın koyu çerçeveli geniş pencereleri; önünde havuz', vw: 54 },
    { file: 'cam-bolme-tamam-ic', sm: 600, w: 1200, h: 1600, title: 'Cam bölme, iç görünüm', note: 'İç mekân, tamamlanmış', alt: 'Koyu çerçeveli cam bölmenin içinde masalar ve sandalyeler', vw: 22 }
  ]
];

// Indicative business range for balconies; external comparisons for other services. Keep scopes and units with the rates.
export const ESTIMATES = {
  'cam-balkon': {
    title: 'Cam balkon fiyatı', model: 'Cam balkon', ownerRange: true,
    label: 'Kapanacak cam alanı', hint: 'Toplam cephe uzunluğu × cam yüksekliği.',
    example: '7,5', unit: 'm²', low: 6000, high: 6500,
    scope: 'Sistem ve montaj koşullarına göre değişir.'
  },
  pergola: {
    title: 'Pergola kaç TL tutar?', model: 'Sabit pergola',
    label: 'Gölgelenecek alan', hint: 'Terasın eni × pergolanın açılacağı mesafe.',
    example: '15', unit: 'm²', low: 6000, high: 9000,
    source: 'İzmir Tente Branda', url: 'https://izmirtentebranda.com/izmir-tente-fiyatlari-2026/',
    scope: 'İzmir için yayımlanan 2026 sabit sistem örneği. Motorlu sistem ve yan camlar bu hesapta yok. KDV ve montaj kapsamı keşifte netleşir.'
  },
  'kis-bahcesi': {
    title: 'Kış bahçesi kaç TL tutar?', model: 'Panel çatı ve tek camlı sürme cephe',
    label: 'Kapatılacak zemin alanı', hint: 'Zeminin eni × boyu.',
    example: '20', unit: 'm²', low: 3500, high: 5500,
    source: 'Kış Bahçesi İzmir', url: 'https://www.kisbahcesiizmir.com.tr/kis-bahcesi-fiyatlari-izmir/',
    scope: 'İzmir için yayımlanan 2026 örneği; panel çatı ve tek camlı sürme cephe içindir. Cam çatı ve zemin hazırlığı ayrı değerlendirilir. KDV durumu belirtilmemiş.'
  },
  dograma: {
    title: 'PVC pencere kaç TL tutar?', model: '100 × 120 cm çift kanatlı PVC pencere',
    label: 'Bu ölçüde kaç pencere var?', hint: 'Diğer ölçüler ve kapılar için fotoğraf gönderin.',
    example: '3', unit: 'adet', low: 8000, high: 12000,
    source: 'Egepen Akçayapı', url: 'https://egepenakcayapi.com.tr/products/pvc-dograma/',
    scope: 'İstanbul için yayımlanan 2026 karşılaştırması; montaj dahil, KDV hariç. İzmir teklifimiz yerinde ölçüyle belirlenir.'
  }
};

// Page-specific selections keep related jobs distinct from finished examples of the service.
export const TERRACE_FRAME = { file: 'teras-iskelet', sm: 360, w: 768, h: 960, title: 'Terasın taşıyıcı iskeleti', note: 'Montaj aşaması', alt: 'Taş cepheli evin terasına monte edilen siyah metal iskelet; üstü ve yanları henüz açık', vw: 32 };
export const PANEL_VIDEO = { file: '/assets/work/kanat-acilisi.mp4', cover: '/assets/work/kanat-kapak.webp', title: 'Cam kanat nasıl açılır?', note: 'Videoyu izle · 19 sn', w: 320, h: 570 };
export const SERVICE_PROOF = {
  'cam-balkon': { files: ['video', 'cam-balkon-usta'], title: 'Cam balkon işçiliği', faq: [FAQ.fold, FAQ.free, FAQ.send] },
  pergola: { files: ['teras-iskelet'], title: 'Teras montajından', faq: [FAQ.gardenVsPergola, FAQ.pergolaPrice, FAQ.free] },
  'kis-bahcesi': { files: ['teras-iskelet', 'villa-kose'], title: 'Teras ve doğrama işlerimiz', faq: [FAQ.gardenVsPergola, FAQ.gardenPrice, FAQ.free] },
  dograma: { files: ['villa-kose', 'dis-kapi', 'cam-bolme-tamam'], title: 'Doğrama işlerimiz', faq: [FAQ.pvcVsAlu, FAQ.small, FAQ.free] }
};

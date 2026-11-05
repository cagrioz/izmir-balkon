import { DISTRICTS, SITE } from './facts.mjs';
export const campaign = 'İzmir Balkon | Arama | Taslak';
export const groups = [
  ['Cam balkon', '/cam-balkon', ['cam balkon','balkon kapatma','katlanır cam balkon','sürme cam balkon'], ['İzmir Cam Balkon','Katlanır Cam Balkon','Sürme Cam Balkon','Balkon Kapatma'], 'Cam balkon için ücretsiz keşif. Ölçünüze göre net fiyatı birlikte belirleyelim.'],
  ['Kış bahçesi', '/kis-bahcesi', ['kış bahçesi','cam kış bahçesi'], ['İzmir Kış Bahçesi','Teras İçin Kış Bahçesi','Bahçenize Camlı Alan','Kış Bahçesi Sistemleri'], 'Teras ve bahçeniz için kış bahçesi. İzmir genelinde ücretsiz keşif isteyin.'],
  ['Pergola', '/pergola', ['pergola','pergola sistemleri'], ['İzmir Pergola','Teras İçin Pergola','Bahçeniz İçin Pergola','Pergola Sistemleri'], 'Teras ve bahçeniz için pergola. Ölçü ve sistem seçimini ücretsiz keşifte konuşalım.'],
  ['Doğrama', '/dograma', ['pvc doğrama','alüminyum doğrama','pencere doğrama','kapı doğrama'], ['İzmir PVC Doğrama','Alüminyum Doğrama','Pencere ve Kapı Doğrama','İzmir Pencere ve Kapı'], 'PVC ve alüminyum doğrama. Pencere ve kapılarınız için ücretsiz keşif isteyin.'],
  ['Marka', '/', ['izmir balkon'], ['İzmir Balkon','İzmir Balkon İletişim','Cam Balkon ve Doğrama','İzmir Balkon Keşif'], 'İzmir Balkon: cam balkon, kış bahçesi, pergola ve doğrama için ücretsiz keşif.']
].map(([name,path,terms,headlines,description]) => ({
  name, url:SITE+path, terms,
  headlines:[...headlines,'Ücretsiz Keşif','Ölçüye Göre Net Fiyat','İzmir’in 30 İlçesinde','Yerinde Ölçü Alalım','WhatsApp’tan Bize Yazın','Keşif İçin Bizi Arayın','Size Uygun Sistemi Seçelim','İşinizi Birlikte Planlayalım'],
  descriptions:[description,'İzmir’in 30 ilçesinde hizmet. Yerinde ölçü alalım, size uygun sistemi konuşalım.','Yaklaşık ölçünüzü ve ilçenizi WhatsApp’tan yazın. Ücretsiz keşif için iletişime geçin.','Ölçüye göre net fiyat. Projenizi konuşmak için arayın veya WhatsApp’tan yazın.'],
  keywords:[...new Set(terms.flatMap(term=>name==='Marka'?[term,'izmir balkon iletişim']:['izmir '+term,...DISTRICTS.map(d=>d.toLocaleLowerCase('tr')+' '+term)]))]
}));
export const negatives = [
  'iş ilanı','iş ilanları','eleman aranıyor','iş başvurusu','maaş','staj','kariyer',
  'kendin yap','nasıl yapılır','yapım videosu','montaj eğitimi','diy','ikinci el','2 el','2. el','sahibinden','letgo','hurda',
  'istanbul','ankara','bursa','antalya','adana','mersin','konya','kayseri','gaziantep','diyarbakır','şanlıurfa','samsun','trabzon','erzurum','eskişehir','kocaeli','sakarya','tekirdağ','balıkesir','denizli','aydın','muğla','manisa','afyonkarahisar','uşak','kütahya','bilecik','bolu','düzce','zonguldak','karabük','bartın','kastamonu','sinop','çorum','amasya','tokat','ordu','giresun','rize','artvin','ardahan','kars','ığdır','ağrı','van','hakkari','şırnak','siirt','batman','mardin','bitlis','muş','bingöl','tunceli','elazığ','malatya','erzincan','bayburt','gümüşhane','sivas','yozgat','kırşehir','kırıkkale','nevşehir','aksaray','niğde','karaman','ısparta','burdur','hatay','osmaniye','kahramanmaraş','adıyaman','kilis','çanakkale','edirne','kırklareli','yalova','çankırı'
];
export const sitelinks = [
  ['Cam Balkon','Katlanır ve sürme seçenekleri','Ücretsiz keşifte konuşalım','/cam-balkon'],
  ['Kış Bahçesi','Teras ve bahçe için çözümler','Ölçünüze göre net fiyat','/kis-bahcesi'],
  ['Pergola','Teras ve bahçenizi değerlendirin','Ücretsiz keşif isteyin','/pergola'],
  ['PVC ve Alüminyum Doğrama','Pencere ve kapı uygulamaları','İzmir genelinde ücretsiz keşif','/dograma']
];
export const callouts = ['Ücretsiz Keşif','İzmir’in 30 İlçesi','Ölçüye Göre Net Fiyat'];
export const snippets = {header:'Hizmetler',values:['Cam balkon','Kış bahçesi','Pergola','PVC doğrama','Alüminyum doğrama']};
export const images = [
  {file:'public/assets/work/cam-balkon-genis.jpg',group:'Cam balkon',note:'Montaj fotoğrafı; tamamlanmış iş diye sunmayın.'},
  {file:'public/assets/work/villa-kose.jpg',group:'Doğrama',note:'Gerçek sürme doğrama işi.'}
];

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { campaign, groups, negatives, sitelinks, callouts, snippets, images } from './ads-data.mjs';
const length = s => [...s].length;
const check = (s,max,label) => assert.ok(s && length(s)<=max, `${label}: ${length(s)}/${max}: ${s}`);
export function validate() {
  assert.equal(groups.length,5); assert.equal(new Set(groups.map(g=>g.url)).size,5);
  for(const g of groups) {
    assert.ok(g.headlines.length>=3&&g.headlines.length<=15); assert.ok(g.descriptions.length>=2&&g.descriptions.length<=4);
    g.headlines.forEach(s=>check(s,30,'Headline')); g.descriptions.forEach(s=>check(s,90,'Description'));
    g.keywords.forEach(s=>{check(s,80,'Keyword'); assert.ok(s.split(/\s+/).length<=10);});
    assert.ok(!/15\+|200\+|ısıcam|giyotin|bioklimatik|garanti|indirim|en iyi|birinci|\d+\s*TL/i.test([...g.headlines,...g.descriptions,...g.keywords].join(' ')));
  }
  sitelinks.forEach(([title,a,b])=>{check(title,25,'Sitelink'); check(a,35,'Sitelink line 1');check(b,35,'Sitelink line 2');});
  callouts.forEach(s=>check(s,25,'Callout')); snippets.values.forEach(s=>check(s,25,'Snippet'));
  negatives.forEach(s=>check(s,80,'Negative keyword'));
  for(const item of images) assert.ok(item.file.startsWith('public/assets/work/')&&existsSync(item.file));
}
validate();
const csv=(headers,rows)=>'\uFEFF'+[headers,...rows].map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n';
const outputs = new Map();
outputs.set('ads-editor.csv',csv(['Campaign','Ad group','Ad type','Status','Final URL',...Array.from({length:15},(_,i)=>`Headline ${i+1}`),...Array.from({length:4},(_,i)=>`Description ${i+1}`)],groups.map(g=>[campaign,g.name,'Responsive search ad','Paused',g.url,...Array.from({length:15},(_,i)=>g.headlines[i]||''),...g.descriptions])));
outputs.set('keywords-editor.csv',csv(['Campaign','Ad group','Keyword','Criterion Type','Status','Final URL'],groups.flatMap(g=>g.keywords.flatMap(k=>['Phrase','Exact'].map(m=>[campaign,g.name,k,m,'Paused',g.url])))));
outputs.set('negatives-editor.csv',csv(['Campaign','Keyword','Criterion Type'],negatives.map(k=>[campaign,k,'Negative phrase'])));
outputs.set('sitelinks-editor.csv',csv(['Campaign','Link text','Description line 1','Description line 2','Final URL'],sitelinks.map(([t,a,b,p])=>[campaign,t,a,b,'https://izmirbalkon.com'+p])));
outputs.set('callouts-editor.csv',csv(['Campaign','Callout text'],callouts.map(t=>[campaign,t])));
outputs.set('call-editor.csv',csv(['Campaign','Country code','Phone number'],[[campaign,'TR','05423551213']]));
outputs.set('settings.csv',csv(['Campaign','Status','Network','Search Partners','Display','Location','Location option','Language','Bidding recommendation','Bid cap','Daily budget'],[[campaign,'Paused','Search','Off','Off','İzmir, Türkiye','Presence','Turkish','Manual CPC or Maximize Clicks','','']]));
outputs.set('campaign-pack-tr.md',`# İzmir Balkon — Google Ads taslak paketi\n\nBu paket hesapta kampanya oluşturmaz. Bütçe ve teklif üst sınırı boş bırakılmıştır.\n\n${groups.map(g=>`## ${g.name}\n\nSon URL: ${g.url}\n\n### Başlıklar\n\n${g.headlines.map(h=>`- ${h} (${length(h)}/30)`).join('\n')}\n\n### Açıklamalar\n\n${g.descriptions.map(d=>`- ${d} (${length(d)}/90)`).join('\n')}\n\nAnahtar kelimeler: ${g.keywords.length} ifade × sıralı ve tam eşleme. İzmir ve 30 ilçe varyantları keywords-editor.csv dosyasındadır. Marka grubunda yalnızca marka niyeti kullanılır.`).join('\n\n')}\n\n## Ek öğeler\n\n### Site bağlantıları\n\n${sitelinks.map(([t,a,b,p])=>`- ${t}: ${a} / ${b} — https://izmirbalkon.com${p}`).join('\n')}\n\n### Açıklama metinleri\n\n${callouts.join(' · ')}\n\n### Yapılandırılmış snippet\n\nBaşlık: **${snippets.header}** (İngilizce arayüz: Service catalog). Değerler: ${snippets.values.join(' · ')}. Editor içinde Ad assets > Structured snippets bölümünden Türkçe dilini ve uygun hazır başlığı seçin; çeviri başlığını serbest metin olarak girmeyin.\n\n### Telefon öğesi\n\nTR / 0542 355 12 13. Yanıtlanabilen saatleri işletme belirlemeli. Bu öğeye tıklama, sitedeki phone_click olayından farklıdır.\n\n### Görseller\n\n${images.map(i=>`- ${i.file} — ${i.group}: ${i.note}`).join('\n')}\n\nKış bahçesi ve pergola için doğrulanmış işletme fotoğrafı yok: görsel öğesi eklemeyin. public/assets/stock/ hiçbir reklam görselinde kullanılmaz. Görselleri Editor'a otomatik içe aktarmayın; uygun kırpım ve kaliteyi önizleyip sonra seçin.\n`);
for(const [file,content] of outputs) {
  const path='docs/ads/'+file;
  if(process.argv.includes('--check')) assert.equal(readFileSync(path,'utf8'),content,`${file} is stale; run node scripts/ads-pack.mjs`);
  else writeFileSync(path,content);
}
console.log(`Ads pack validated: ${groups.length} groups, ${groups.reduce((n,g)=>n+g.keywords.length*2,0)} positive keyword rows; all text limits pass.`);

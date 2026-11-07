import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');

function setup(config = {}, stored = '', search = '', legacy = '', previous = '') {
  const appended = [], events = [], handlers = new Map(), storage = new Map();
  if (legacy) storage.set('izmir_balkon_measurement_v1', legacy);
  if (previous) storage.set('izmir_balkon_measurement_v2', previous);
  if (stored) storage.set('izmir_balkon_measurement_v3', stored);
  const node = (name) => ({hidden:true, addEventListener:(event, fn)=>handlers.set(name + ':' + event, fn)});
  const nodes = Object.fromEntries(['consent-banner','cookie-settings','accept-cookies','reject-cookies'].map(name=>[name,node(name)]));
  const link = {getAttribute:()=> 'tel:+905423551213',dataset:{contact:'phone',position:'hero'}, addEventListener:(event,fn)=>handlers.set(event === 'click' ? 'phone' : 'phone:'+event,fn)};
  const whatsapp = {getAttribute:()=> 'https://wa.me/905423551213?text=private',dataset:{contact:'whatsapp',position:'wizard'}, addEventListener:(event,fn)=>handlers.set(event === 'click' ? 'wizard' : 'wizard:'+event,fn)};
  const other = {getAttribute:()=> 'https://wa.me/905423551213',dataset:{contact:'whatsapp',position:'footer'}, addEventListener:(event,fn)=>handlers.set(event === 'click' ? 'other' : 'other:'+event,fn)};
  const window = {IZMIR_TRACKING:config, history:{state:null,replaceState:(_,__,url)=>events.push({url})}};
  const document = {
    getElementById:id=>nodes[id] || null,
    querySelectorAll:selector=>selector === '[data-contact]' ? [link,whatsapp,other] : [],
    dispatchEvent:event=>events.push(event.detail),
    createElement:()=>({attributes:{},setAttribute(key,value){this.attributes[key]=value;}}), head:{append:script=>appended.push(script)},
    addEventListener:(name,fn)=>handlers.set('document:'+name,fn)
  };
  runInNewContext(source, {window, document, localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},location:{origin:'https://izmirbalkon.com',pathname:'/',search,reload:()=>events.push('reload')},CustomEvent:class{constructor(_,options){this.detail=options.detail}},Date,encodeURIComponent,URL,URLSearchParams});
  return {window,nodes,appended,events,handlers,storage,whatsapp};
}
const configured = {googleAdsId:'AW-123456789',ga4Id:'G-ABC123',callClickLabel:'call_label'};

test('unconfigured public build never loads Google or shows an unnecessary consent banner',()=>{
  const s=setup(); s.handlers.get('phone')();
  assert.equal(s.appended.length,0); assert.equal(s.nodes['consent-banner'].hidden,true);
  assert.equal(s.window.dataLayer.length,0); assert.equal(s.events[0].event,'phone_click');
});
test('configured site blocks all measurement before consent, including contact clicks',()=>{
  const s=setup(configured); s.handlers.get('phone')();
  assert.equal(s.nodes['consent-banner'].hidden,false); assert.equal(s.appended.length,0);
  assert.equal(s.window.dataLayer.length,0);
});
test('refusal persists and keeps Google scripts blocked',()=>{
  const s=setup(configured); s.handlers.get('reject-cookies:click')(); s.handlers.get('phone')();
  assert.equal(s.storage.get('izmir_balkon_measurement_v3'),'denied');
  assert.equal(s.appended.length,0); assert.equal(s.window.dataLayer.length,0);
});
test('consented click sends an intent event and configured conversion without form data',()=>{
  const s=setup(configured); s.handlers.get('accept-cookies:click')(); s.handlers.get('phone')();
  assert.equal(s.appended.length,1); assert.equal(s.appended[0].src,'https://www.googletagmanager.com/gtag/js?id=AW-123456789');
  const intent=s.window.dataLayer.find(e=>e.event==='phone_click');
  assert.deepEqual(Object.keys(intent).sort(),['contact_channel','cta_position','event']);
  const conversion=s.window.dataLayer.find(e=>e[0]==='event'&&e[1]==='conversion');
  assert.equal(conversion[2].send_to,'AW-123456789/call_label');
  assert.ok(!JSON.stringify(s.window.dataLayer).includes('generate_lead'));
});
test('revoking a saved grant updates consent and reloads into blocked state',()=>{
  const s=setup(configured,'granted'); assert.equal(s.appended.length,1);
  s.handlers.get('reject-cookies:click')();
  assert.equal(s.storage.get('izmir_balkon_measurement_v3'),'denied'); assert.ok(s.events.includes('reload'));
  const denied=setup(configured,'denied'); assert.equal(denied.appended.length,0);
});
test('malformed public measurement IDs cannot load a third party script',()=>{
  const s=setup({googleAdsId:'https://other.example',ga4Id:'G-<script>'},'granted');
  assert.equal(s.appended.length,0);
});
test('wizard progress reports the step only, and nothing without consent',()=>{
  const blocked=setup(configured); blocked.handlers.get('document:izmir:funnel')({detail:{step:'size'}});
  assert.equal(blocked.window.dataLayer.length,0);
  const s=setup(configured); s.handlers.get('accept-cookies:click')();
  s.handlers.get('document:izmir:funnel')({detail:{step:'size',service:'pergola',district:'Bornova'}});
  const step=s.window.dataLayer.find(e=>e.event==='quote_step');
  assert.deepEqual(Object.keys(step).sort(),['event','quote_step']);
  assert.equal(step.quote_step,'size');
  const sent=JSON.stringify(s.window.dataLayer);
  assert.ok(!sent.includes('Bornova')); assert.ok(!sent.includes('pergola'));
});

const conversions = s => s.window.dataLayer.filter(e => e[0] === 'event' && e[1] === 'conversion');
test('allowlists attribution parameters, preserving duplicates and stripping unrelated queries and fragment', () => {
  const s = setup(configured, 'granted', '?gclid=abc&gbraid=def&wbraid=ghi&utm_source=google&utm_campaign=a%20b&utm_custom=x&utm_source=two&email=private&phone=secret&redirect=https%3A%2F%2Fevil.test&notutm_source=no');
  const configs = s.window.dataLayer.filter(e => e[0] === 'config');
  for (const c of configs) assert.equal(c[2].page_location, 'https://izmirbalkon.com/?gclid=abc&gbraid=def&wbraid=ghi&utm_source=google&utm_campaign=a+b&utm_custom=x&utm_source=two');
  assert.ok(!JSON.stringify(s.window.dataLayer).includes('private'));
});
test('wizard and other WhatsApp labels are separate, exactly once per click', () => {
  const s = setup({...configured, wizardWhatsappClickLabel:'wizard_label', whatsappClickLabel:'other_label'});
  s.handlers.get('wizard')(); s.handlers.get('other')();
  assert.equal(conversions(s).length, 0);
  s.handlers.get('accept-cookies:click')(); s.handlers.get('accept-cookies:click')();
  for (const [key,label] of [['phone','call_label'],['wizard','wizard_label'],['other','other_label']]) {
    const before=conversions(s).length; s.handlers.get(key)();
    assert.equal(conversions(s).length,before+1);
    assert.equal(conversions(s).at(-1)[2].send_to, 'AW-123456789/'+label);
  }
  assert.equal(s.appended.length,1);
  const defaults=s.window.dataLayer.find(e=>e[0]==='consent'&&e[1]==='default');
  assert.equal(defaults[2].ad_user_data,'granted');
  assert.equal(defaults[2].ad_personalization,'denied');
});
test('missing wizard label never falls back to secondary label; refusal blocks all three', () => {
  const s=setup({...configured,whatsappClickLabel:'other_label'},'granted');
  s.handlers.get('wizard')(); assert.equal(conversions(s).length,0);
  const denied=setup({...configured,wizardWhatsappClickLabel:'wizard_label',whatsappClickLabel:'other_label'},'denied');
  for(const key of ['phone','wizard','other']) denied.handlers.get(key)();
  assert.equal(denied.appended.length,0); assert.equal(denied.window.dataLayer.length,0);
});

const datafastConfig = {...configured, datafastWebsiteId:'dfid_publicTest123'};
const clickEvent = () => ({stopped:false, stopPropagation(){this.stopped=true;}});
test('DataFast is blocked before consent and after refusal; old Google-only grants need fresh consent', () => {
  for (const [saved,legacy] of [['',''],['denied',''],['','granted'],['','denied']]) {
    const s=setup(datafastConfig,saved,'',legacy);
    s.handlers.get('wizard')(clickEvent());
    assert.equal(s.appended.length,0); assert.equal(s.window.datafast,undefined);
    assert.equal(s.nodes['consent-banner'].hidden, saved==='denied'||legacy==='denied');
  }
});
test('DataFast loads once after consent with clean URL and no payment capture', () => {
  const s=setup(datafastConfig,'','?utm_source=google&gclid=abc&message=private');
  s.handlers.get('accept-cookies:click')(); s.handlers.get('accept-cookies:click')();
  assert.equal(s.appended.length,2);
  const script=s.appended.find(x=>x.src.includes('datafa.st'));
  assert.equal(script.src,'https://datafa.st/js/script.cookieless.js');
  assert.equal(script.attributes['data-website-id'],'dfid_publicTest123');
  assert.equal(script.attributes['data-disable-payments'],'true');
  assert.equal(s.events.find(x=>x.url).url,'https://izmirbalkon.com/?utm_source=google&gclid=abc&utm_medium=cpc');
});
test('three DataFast contact goals fire once without draft data or automatic outbound-link capture', () => {
  const s=setup(datafastConfig,'granted');
  for (const [key,goal] of [['phone','phone_click'],['wizard','wizard_whatsapp_click'],['other','whatsapp_click']]) {
    const event=clickEvent(); s.handlers.get(key)(event);
    assert.equal(event.stopped,true);
    assert.equal(s.window.datafast.q.at(-1)[0],goal);
    assert.equal(s.window.datafast.q.at(-1).length,1);
    for (const keyboardKey of ['Enter',' ']) {
      const keyboard=clickEvent(); keyboard.key=keyboardKey; s.handlers.get(key+':keydown')(keyboard);
      assert.equal(keyboard.stopped,true);
    }
  }
  assert.equal(s.window.datafast.q.length,3);
  assert.ok(!JSON.stringify(s.window.datafast.q).includes('private'));
});
test('incomplete wizard generates no conversion in either provider', () => {
  const s=setup({...datafastConfig,wizardWhatsappClickLabel:'wizard_label'},'granted');
  s.whatsapp.getAttribute=()=>null;
  s.handlers.get('wizard')(clickEvent());
  assert.equal(conversions(s).length,0); assert.equal(s.window.datafast.q,undefined);
});
test('DataFast-only configuration works and progress sends allowed step names only', () => {
  const s=setup({datafastWebsiteId:'dfid_publicTest123'},'granted');
  assert.equal(s.appended.length,1);
  for(const step of ['service','size','district','secret']) s.handlers.get('document:izmir:funnel')({detail:{step, district:'private'}});
  assert.deepEqual(Array.from(s.window.datafast.q, e=>e[0]), ['quote_step_service','quote_step_size','quote_step_district']);
  s.handlers.get('reject-cookies:click')();
  const before=s.window.datafast.q.length; s.handlers.get('phone')(clickEvent());
  assert.equal(s.window.datafast.q.length,before); assert.ok(s.events.includes('reload'));
});


test('v1 and v2 grants require fresh consent while prior refusals remain blocked', () => {
  for (const version of [1, 2]) {
    for (const choice of ['granted', 'denied']) {
      const s = setup(datafastConfig, '', '', version === 1 ? choice : '', version === 2 ? choice : '');
      assert.equal(s.appended.length, 0);
      assert.equal(s.nodes['consent-banner'].hidden, choice === 'denied');
      for (const key of ['phone','wizard','other']) s.handlers.get(key)(clickEvent());
      assert.equal(conversions(s).length, 0);
      s.handlers.get('accept-cookies:click')();
      assert.equal(s.storage.get('izmir_balkon_measurement_v3'), 'granted');
      assert.equal(s.appended.length, 2);
      const consent = s.window.dataLayer.find(e => e[0] === 'consent');
      assert.equal(consent[2].ad_user_data, 'granted');
      assert.equal(consent[2].ad_personalization, 'denied');
    }
  }
});
test('revocation denies all consent signals and v3 choice takes precedence over old choices', () => {
  const s = setup(datafastConfig, 'granted', '', 'denied', 'denied');
  assert.equal(s.appended.length, 2);
  s.handlers.get('reject-cookies:click')();
  const update = s.window.dataLayer.find(e => e[0] === 'consent' && e[1] === 'update');
  assert.deepEqual(Object.values(update[2]), ['denied','denied','denied','denied']);
  assert.ok(s.events.includes('reload'));
  const blocked = setup(datafastConfig, 'denied', '', 'granted', 'granted');
  assert.equal(blocked.appended.length, 0);
  assert.equal(blocked.nodes['consent-banner'].hidden, true);
});

test('DataFast classifies auto-tagged landings only after consent and respects explicit UTMs', () => {
  for (const key of ['gclid', 'gbraid', 'wbraid']) {
    const s = setup(datafastConfig, 'granted', '?' + key + '=test&message=private');
    const url = new URL(s.events.find(event => event.url).url);
    assert.deepEqual(Object.fromEntries(url.searchParams), { [key]: 'test', utm_source: 'google', utm_medium: 'cpc' });
  }
  for (const query of ['?gclid=', '?utm_source=newsletter&gclid=x', '?utm_source=google&utm_medium=custom&wbraid=x', '?utm_campaign=brand']) {
    const s = setup(datafastConfig, 'granted', query);
    assert.equal(new URL(s.events.find(event => event.url).url).search, query);
  }
});

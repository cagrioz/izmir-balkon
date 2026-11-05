import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');

function setup(config = {}, stored = '', search = '') {
  const appended = [], events = [], handlers = new Map(), storage = new Map();
  if (stored) storage.set('izmir_balkon_measurement_v1', stored);
  const node = (name) => ({hidden:true, addEventListener:(event, fn)=>handlers.set(name + ':' + event, fn)});
  const nodes = Object.fromEntries(['consent-banner','cookie-settings','accept-cookies','reject-cookies'].map(name=>[name,node(name)]));
  const link = {dataset:{contact:'phone',position:'hero'}, addEventListener:(_,fn)=>handlers.set('phone',fn)};
  const whatsapp = {dataset:{contact:'whatsapp',position:'wizard'}, addEventListener:(_,fn)=>handlers.set('wizard',fn)};
  const other = {dataset:{contact:'whatsapp',position:'footer'}, addEventListener:(_,fn)=>handlers.set('other',fn)};
  const window = {IZMIR_TRACKING:config};
  const document = {
    getElementById:id=>nodes[id] || null,
    querySelectorAll:selector=>selector === '[data-contact]' ? [link,whatsapp,other] : [],
    dispatchEvent:event=>events.push(event.detail),
    createElement:()=>({}), head:{append:script=>appended.push(script)},
    addEventListener:(name,fn)=>handlers.set('document:'+name,fn)
  };
  runInNewContext(source, {window, document, localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},location:{origin:'https://izmirbalkon.com',pathname:'/',search,reload:()=>events.push('reload')},CustomEvent:class{constructor(_,options){this.detail=options.detail}},Date,encodeURIComponent,URL,URLSearchParams});
  return {window,nodes,appended,events,handlers,storage};
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
  assert.equal(s.storage.get('izmir_balkon_measurement_v1'),'denied');
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
  assert.equal(s.storage.get('izmir_balkon_measurement_v1'),'denied'); assert.ok(s.events.includes('reload'));
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
  assert.equal(defaults[2].ad_user_data,'denied');
  assert.equal(defaults[2].ad_personalization,'denied');
});
test('missing wizard label never falls back to secondary label; refusal blocks all three', () => {
  const s=setup({...configured,whatsappClickLabel:'other_label'},'granted');
  s.handlers.get('wizard')(); assert.equal(conversions(s).length,0);
  const denied=setup({...configured,wizardWhatsappClickLabel:'wizard_label',whatsappClickLabel:'other_label'},'denied');
  for(const key of ['phone','wizard','other']) denied.handlers.get(key)();
  assert.equal(denied.appended.length,0); assert.equal(denied.window.dataLayer.length,0);
});

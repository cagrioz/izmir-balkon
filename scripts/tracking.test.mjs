import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');

function setup(config = {}, stored = '') {
  const appended = [], events = [], handlers = new Map(), storage = new Map();
  if (stored) storage.set('izmir_balkon_measurement_v1', stored);
  const node = (name) => ({hidden:true, addEventListener:(event, fn)=>handlers.set(name + ':' + event, fn)});
  const nodes = Object.fromEntries(['consent-banner','cookie-settings','accept-cookies','reject-cookies'].map(name=>[name,node(name)]));
  const link = {dataset:{contact:'phone',position:'hero'}, addEventListener:(_,fn)=>handlers.set('phone',fn)};
  const window = {IZMIR_TRACKING:config};
  const document = {
    getElementById:id=>nodes[id] || null,
    querySelectorAll:selector=>selector === '[data-contact]' ? [link] : [],
    dispatchEvent:event=>events.push(event.detail),
    createElement:()=>({}), head:{append:script=>appended.push(script)},
    addEventListener:(name,fn)=>handlers.set('document:'+name,fn)
  };
  runInNewContext(source, {window, document, localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},location:{origin:'https://izmirbalkon.com',pathname:'/',reload:()=>events.push('reload')},CustomEvent:class{constructor(_,options){this.detail=options.detail}},Date,encodeURIComponent});
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

import test from 'node:test';
import assert from 'node:assert/strict';
import { ESTIMATES } from './facts.mjs';
import { estimateTotal, initEstimate } from '../public/estimate.js';
import { renderAll } from './render.mjs';

test('area accepts Turkish decimals; window pricing is per whole opening', () => {
  const calc = (s, key) => { const {unit, low, high} = ESTIMATES[key]; return estimateTotal(s, unit, low, high); };
  assert.deepEqual(calc('7,5','cam-balkon'), { quantity: 7.5, low: 45000, high: 48750 });
  assert.deepEqual(calc('7.5','cam-balkon'), calc('7,5','cam-balkon'));
  assert.deepEqual(calc('2','dograma'), { quantity: 2, low: 16000, high: 24000 });
  for (const raw of ['', '-1', '1,5', '0', '1e2', '1.000', '12 m²']) assert.equal(calc(raw,'dograma'), null);
  for (const raw of ['0','1e2','1,000','-7','NaN']) assert.equal(calc(raw,'pergola'), null);
});
test('calculator reports one valid committed calculation, never amount or draft data', () => {
  const handlers = new Map(), events = [];
  const nodes = {
    '#quantity': {value:'', setAttribute(){}, addEventListener:(type, handler) => handlers.set(type, handler)},
    '#estimate-send': {href:'https://wa.me/905423551213?text=private'},
    '#result-label': {textContent:'Birim fiyat'}, '#result-value': {textContent:'6.000–6.500 TL'}
  };
  initEstimate({dataset:{unit:'m²', model:'Cam balkon', low:'6000', high:'6500', tax:''},
    querySelector:selector => nodes[selector], ownerDocument:{dispatchEvent:event => events.push(event)}});
  assert.equal(events.length, 0);
  nodes['#quantity'].value = '-1'; handlers.get('change')();
  assert.equal(events.length, 0);
  nodes['#quantity'].value = '7,5'; handlers.get('input')();
  assert.equal(events.length, 0);
  handlers.get('change')();
  nodes['#quantity'].value = '10'; handlers.get('input')(); handlers.get('change')();
  assert.equal(events.length, 1);
  assert.equal(events[0].type, 'izmir:funnel');
  assert.deepEqual(events[0].detail, {step:'estimate'});
  assert.ok(nodes['#estimate-send'].href.includes('text='));
});
test('service calculators link sources and have usable no-script contact, home keeps its original flow', () => {
  const pages = renderAll(), home = pages.get('/index.html');
  assert.ok(home.includes('data-wiz-next') && !home.includes('estimate.js'));
  for (const [key, ref] of Object.entries(ESTIMATES)) {
    const html = pages.get('/' + key + '.html');
    assert.ok(html.includes('id="estimate-send" href="https://wa.me/'));
    if (!ref.ownerRange) assert.ok(html.includes(ref.url));
    else assert.ok(!html.includes('Piyasa örneğidir') && html.includes('6.000–6.500 TL'));
    assert.ok(!html.includes('data-open-wizard') && !html.includes('href="#teklif"'));
    assert.ok(html.includes('href="#fiyat-hesapla"') && html.includes('src="/estimate.js"'));
  }
});

test('only the balcony page links the film and no page preloads the MP4', () => {
  for (const [path, html] of renderAll()) {
    if (!path.endsWith('.html')) continue;
    assert.equal(html.includes('kanat-acilisi.mp4'), path === '/cam-balkon.html');
    assert.ok(!/<(?:video|source|link)\b[^>]*\.mp4/i.test(html));
  }
});

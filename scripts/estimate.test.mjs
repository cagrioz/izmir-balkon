import test from 'node:test';
import assert from 'node:assert/strict';
import { ESTIMATES } from './facts.mjs';
import { estimateTotal } from '../public/estimate.js';
import { renderAll } from './render.mjs';

test('area accepts Turkish decimals; window pricing is per whole opening', () => {
  const calc = (s, key) => { const {unit, low, high} = ESTIMATES[key]; return estimateTotal(s, unit, low, high); };
  assert.deepEqual(calc('7,5','cam-balkon'), { quantity: 7.5, low: 30000, high: 33750 });
  assert.deepEqual(calc('7.5','cam-balkon'), calc('7,5','cam-balkon'));
  assert.deepEqual(calc('2','dograma'), { quantity: 2, low: 16000, high: 24000 });
  for (const raw of ['', '-1', '1,5', '0', '1e2', '1.000', '12 m²']) assert.equal(calc(raw,'dograma'), null);
  for (const raw of ['0','1e2','1,000','-7','NaN']) assert.equal(calc(raw,'pergola'), null);
});
test('service calculators link sources and have usable no-script contact, home keeps its original flow', () => {
  const pages = renderAll(), home = pages.get('/index.html');
  assert.ok(home.includes('data-wiz-next') && !home.includes('estimate.js'));
  for (const [key, ref] of Object.entries(ESTIMATES)) {
    const html = pages.get('/' + key + '.html');
    assert.ok(html.includes(ref.url) && html.includes('id="estimate-send" href="https://wa.me/'));
    assert.ok(!html.includes('data-open-wizard') && !html.includes('href="#teklif"'));
    assert.ok(html.includes('href="#fiyat-hesapla"') && html.includes('src="/estimate.js"'));
  }
});

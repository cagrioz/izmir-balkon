// Only loaded on service pages. Typing does not send a request or count as a conversion.
const format = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
export function estimateTotal(raw, unit, low, high) {
  const text = raw.trim();
  if (!text) return null;
  const pattern = unit === 'adet' ? /^\d{1,4}$/ : /^\d{1,4}(?:[,.]\d{1,2})?$/;
  const quantity = Number(text.replace(',', '.'));
  if (!pattern.test(text) || !(quantity > 0)) return null;
  return { quantity, low: Math.round(low * quantity), high: Math.round(high * quantity) };
}
export function glassArea(shape, dimensions) {
  const keys = {I: ['front', 'height'], L: ['front', 'left', 'height'], U: ['front', 'left', 'right', 'height']}[shape];
  if (!keys) return null;
  const numbers = keys.map(key => estimateTotal(String(dimensions[key] ?? ''), 'm²', 1, 1)?.quantity);
  if (numbers.some(number => !number || number > 100)) return null;
  const height = numbers.pop();
  return Math.round(numbers.reduce((sum, n) => sum + n, 0) * height * 100) / 100;
}
export function initEstimate(card) {
  const { unit, model, low, high } = card.dataset;
  const input = card.querySelector('#quantity'), send = card.querySelector('#estimate-send');
  const label = card.querySelector('#result-label'), value = card.querySelector('#result-value');
  const baseLink = send.href, baseLabel = label.textContent, baseValue = value.textContent;
  let estimateTracked = false;
  let shape = 'I';
  const shapeButtons = [...(card.querySelectorAll?.('[data-shape]') || [])];
  const dimensionInputs = [...(card.querySelectorAll?.('[data-dimension]') || [])];
  function setArea() {
    if (!shapeButtons.length) return;
    const dimensions = Object.fromEntries(dimensionInputs.map(node => [node.dataset.dimension, node.value]));
    const area = glassArea(shape, dimensions);
    input.value = area === null ? '' : String(area);
  }
  function trackEstimate() {
    if (estimateTracked || !estimateTotal(input.value, unit, +low, +high)) return;
    estimateTracked = true;
    card.ownerDocument.dispatchEvent(new CustomEvent('izmir:funnel', { detail: { step: 'estimate' } }));
  }
  function update() {
    setArea();
    const total = estimateTotal(input.value, unit, +low, +high);
    const invalid = !total && !!input.value.trim();
    input.setAttribute('aria-invalid', String(invalid));
    if (!total) {
      label.textContent = invalid ? 'Ölçüyü kontrol edin' : baseLabel;
      value.textContent = invalid ? (unit === 'adet' ? 'Pozitif bir tam sayı girin.' : 'Örneğin 7,5 yazın.') : baseValue;
      send.href = baseLink;
      return;
    }
    const size = format.format(total.quantity) + ' ' + unit;
    const range = format.format(total.low) + '–' + format.format(total.high) + ' TL';
    label.textContent = size + ' için tahmini toplam' + card.dataset.tax;
    value.textContent = range;
    const link = new URL(baseLink);
    link.searchParams.set('text', 'Merhaba, ' + model + ' için teklif almak istiyorum. Yaklaşık ölçüm: ' + size + '. Yaklaşık tutar: ' + range + card.dataset.tax + '. ' + (shapeButtons.length ? 'Balkon şekli: ' + shape + '. ' : '') + 'Ücretsiz keşif için görüşebilir miyiz?');
    send.href = link.href;
  }
  input.addEventListener('input', update);
  // One real completed calculation per page, not every keystroke. Never send
  // the entered area, price, or WhatsApp draft to analytics.
  input.addEventListener('change', trackEstimate);
  shapeButtons.forEach(button => button.addEventListener('click', () => {
    shape = button.dataset.shape;
    shapeButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    for (const side of ['left', 'right']) {
      const active = side === 'left' ? shape !== 'I' : shape === 'U';
      const wrapper = card.querySelector(`[data-side="${side}"]`);
      wrapper.classList.toggle('dimension-inactive', !active);
      wrapper.querySelector('input').disabled = !active;
    }
    update();
  }));
  dimensionInputs.forEach(node => {
    node.addEventListener('input', update);
    node.addEventListener('change', trackEstimate);
  });
  update();
}
if (typeof document !== 'undefined') {
  const card = document.querySelector('#fiyat-hesapla');
  if (card) initEstimate(card);
}

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
export function initEstimate(card) {
  const { unit, model, low, high } = card.dataset;
  const input = card.querySelector('#quantity'), send = card.querySelector('#estimate-send');
  const label = card.querySelector('#result-label'), value = card.querySelector('#result-value');
  const baseLink = send.href, baseLabel = label.textContent, baseValue = value.textContent;
  function update() {
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
    link.searchParams.set('text', 'Merhaba, ' + model + ' için teklif almak istiyorum. Yaklaşık ölçüm: ' + size + '. Yaklaşık tutar: ' + range + card.dataset.tax + '. Ücretsiz keşif için görüşebilir miyiz?');
    send.href = link.href;
  }
  card.querySelector('#estimate-input').hidden = false;
  input.addEventListener('input', update);
  update();
}
if (typeof document !== 'undefined') {
  const card = document.querySelector('#fiyat-hesapla');
  if (card) initEstimate(card);
}

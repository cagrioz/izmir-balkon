(() => {
  'use strict';
  const config = window.IZMIR_TRACKING || {};
  const adsId = /^AW-\d+$/.test(config.googleAdsId || '') ? config.googleAdsId : '';
  const ga4Id = /^G-[A-Z0-9]+$/.test(config.ga4Id || '') ? config.ga4Id : '';
  const hasTracking = Boolean(adsId || ga4Id);
  const preferenceKey = 'izmir_balkon_measurement_v1';
  let consent = '';
  let loaded = false;
  try { consent = localStorage.getItem(preferenceKey) || ''; } catch {}
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  const banner = document.getElementById('consent-banner');
  const settings = document.getElementById('cookie-settings');

  function enableTracking() {
    if (loaded || !hasTracking || consent !== 'granted') return;
    loaded = true;
    gtag('consent', 'default', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    // Do not send arbitrary URL query strings or form selections to analytics.
    const pageLocation = location.origin + location.pathname;
    if (adsId) gtag('config', adsId, { allow_ad_personalization_signals: false, page_location: pageLocation });
    if (ga4Id) gtag('config', ga4Id, { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: pageLocation });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(adsId || ga4Id);
    document.head.append(script);
  }
  function chooseConsent(value) {
    consent = value;
    try { localStorage.setItem(preferenceKey, value); } catch {}
    if (banner) banner.hidden = true;
    if (value === 'granted') enableTracking();
    else if (loaded) {
      gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      // Stop loaded Google scripts after revocation; new page does not load them.
      location.reload();
    }
  }
  function contactEvent(channel, position) {
    const event = channel === 'phone' ? 'phone_click' : 'whatsapp_click';
    // Ephemeral integration hook: a click is an intent signal, never a confirmed lead.
    document.dispatchEvent(new CustomEvent('izmir:contact', { detail: { event, position } }));
    if (!hasTracking || consent !== 'granted') return;
    window.dataLayer.push({ event, contact_channel: channel, cta_position: position });
    const label = channel === 'phone' ? config.callClickLabel : config.whatsappClickLabel;
    if (ga4Id) gtag('event', event, { send_to: ga4Id, contact_channel: channel, cta_position: position });
    if (adsId && /^[\w-]+$/.test(label || '')) {
      gtag('event', 'conversion', { send_to: adsId + '/' + label, transport_type: 'beacon' });
    }
  }

  if (hasTracking) {
    if (settings) settings.hidden = false;
    if (banner) banner.hidden = Boolean(consent);
    enableTracking();
  }
  document.getElementById('accept-cookies')?.addEventListener('click', () => chooseConsent('granted'));
  document.getElementById('reject-cookies')?.addEventListener('click', () => chooseConsent('denied'));
  settings?.addEventListener('click', () => { if (banner) banner.hidden = false; });
  document.querySelectorAll('[data-contact]').forEach(link => {
    link.addEventListener('click', () => contactEvent(link.dataset.contact, link.dataset.position));
  });
  // Wizard progress. Step names only: the visitor's service, size and district stay in the browser.
  document.addEventListener('izmir:funnel', event => {
    if (!hasTracking || consent !== 'granted') return;
    const step = event.detail.step;
    window.dataLayer.push({ event: 'quote_step', quote_step: step });
    if (ga4Id) gtag('event', 'quote_step', { send_to: ga4Id, quote_step: step });
  });
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

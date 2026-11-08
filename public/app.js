(() => {
  'use strict';
  const config = window.IZMIR_TRACKING || {};
  const adsId = /^AW-\d+$/.test(config.googleAdsId || '') ? config.googleAdsId : '';
  const ga4Id = /^G-[A-Z0-9]+$/.test(config.ga4Id || '') ? config.ga4Id : '';
  const datafastId = /^dfid_[A-Za-z0-9]+$/.test(config.datafastWebsiteId || '') ? config.datafastWebsiteId : '';
  const hasTracking = Boolean(adsId || ga4Id || datafastId);
  const googleId = adsId || ga4Id;
  const preferenceKey = 'izmir_balkon_measurement_v4';
  let preference = '';
  try {
    const saved = localStorage.getItem(preferenceKey);
    if (['both', 'google', 'datafast', 'none'].includes(saved)) {
      preference = saved;
    } else {
      const previous = localStorage.getItem('izmir_balkon_measurement_v3');
      if (previous === 'granted') preference = 'both';
      else if (previous === 'denied' || ['izmir_balkon_measurement_v2', 'izmir_balkon_measurement_v1']
        .some(key => localStorage.getItem(key) === 'denied')) preference = 'none';
    }
  } catch {
    // A browser that blocks preference storage cannot reliably remember a refusal.
    preference = 'none';
  }

  const settings = document.getElementById('cookie-settings');
  const banner = document.getElementById('consent-banner');
  const googleOption = document.getElementById('allow-google');
  const datafastOption = document.getElementById('allow-datafast');
  let googleLoaded = false;
  let datafastLoaded = false;
  const permits = provider => preference === 'both' || preference === provider ||
    (provider === 'datafast' && preference === '');
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  // Keep attribution in memory until a visitor enables it. Vendor scripts may read location.href directly.
  const cleanPage = location.origin + location.pathname;
  const attributedPage = new URL(cleanPage);
  for (const [key, value] of new URLSearchParams(location.search)) {
    if (/^(gclid|gbraid|wbraid|utm_[a-z0-9_]+)$/.test(key)) attributedPage.searchParams.append(key, value);
  }
  function measurementUrl() {
    const url = new URL(attributedPage.href);
    if (permits('datafast') && datafastId) {
      const params = url.searchParams;
      const googleClick = ['gclid', 'gbraid', 'wbraid'].some(key => params.get(key)?.trim());
      if (googleClick && (!params.has('utm_source') || params.get('utm_source')?.toLowerCase() === 'google')) {
        if (!params.has('utm_source')) params.set('utm_source', 'google');
        if (!params.has('utm_medium')) params.set('utm_medium', 'cpc');
      }
      if (!permits('google')) {
        for (const key of ['gclid', 'gbraid', 'wbraid']) params.delete(key);
      }
    }
    return url.href;
  }
  function googleConsent() {
    const state = permits('google') ? 'granted' : 'denied';
    return { ad_storage: state, analytics_storage: state, ad_user_data: state, ad_personalization: 'denied' };
  }
  function configureTracking() {
    const googleActive = googleId && (!preference || permits('google'));
    const datafastActive = datafastId && permits('datafast');
    if (!googleActive && !datafastActive) return;
    const pageLocation = datafastActive || permits('google') ? measurementUrl() : cleanPage;
    // Keep working in-page links, discard arbitrary fragments before loading vendor code.
    const anchor = location.hash && /^#[a-z][a-z0-9-]*$/.test(location.hash) &&
      document.getElementById(location.hash.slice(1)) ? location.hash : '';
    if (location.href !== pageLocation + anchor) {
      window.history.replaceState(window.history.state, '', pageLocation + anchor);
    }
    if (googleActive) {
      gtag('consent', googleLoaded ? 'update' : 'default', googleConsent());
      gtag('set', 'ads_data_redaction', true);
      gtag('set', 'url_passthrough', false);
      gtag('set', {
        page_location: permits('google') ? pageLocation : cleanPage,
        page_referrer: document.referrer ? new URL(document.referrer).origin : '',
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
      if (!googleLoaded) {
        googleLoaded = true;
        gtag('js', new Date());
        if (adsId) gtag('config', adsId);
        if (ga4Id) gtag('config', ga4Id);
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(googleId);
        document.head.append(script);
      }
    }
    if (datafastActive && !datafastLoaded) {
      datafastLoaded = true;
      window.datafast = window.datafast || function () {
        (window.datafast.q = window.datafast.q || []).push(arguments);
      };
      const script = document.createElement('script');
      script.defer = true;
      script.src = 'https://datafa.st/js/script.cookieless.js';
      script.setAttribute('data-website-id', datafastId);
      script.setAttribute('data-domain', 'izmirbalkon.com');
      script.setAttribute('data-disable-payments', 'true');
      document.head.append(script);
    }
  }
  function chooseConsent(value) {
    preference = value;
    try { localStorage.setItem(preferenceKey, value); } catch {}
    if (banner) banner.hidden = true;
    settings?.setAttribute('aria-expanded', 'false');
    settings?.focus();
    if ((googleLoaded && !permits('google')) || (datafastLoaded && !permits('datafast'))) {
      if (googleLoaded && !permits('google')) gtag('consent', 'update', googleConsent());
      // Reload to stop a running vendor. Retain allowed attribution if the other vendor was enabled.
      if (value !== 'none') window.history.replaceState(window.history.state, '', measurementUrl());
      location.reload();
      return;
    }
    configureTracking();
  }
  function contactEvent(channel, position) {
    const event = channel === 'phone' ? 'phone_click' : 'whatsapp_click';
    // Ephemeral integration hook: a click is an intent signal, never a confirmed lead.
    document.dispatchEvent(new CustomEvent('izmir:contact', { detail: { event, position } }));
    if (datafastLoaded && permits('datafast')) window.datafast(channel === 'phone' ? 'phone_click'
      : position === 'wizard' ? 'wizard_whatsapp_click' : 'whatsapp_click');
    if (!googleLoaded || (preference && !permits('google'))) return;
    window.dataLayer.push({ event, contact_channel: channel, cta_position: position });
    const label = channel === 'phone' ? config.callClickLabel
      : position === 'wizard' ? config.wizardWhatsappClickLabel : config.whatsappClickLabel;
    if (ga4Id) gtag('event', event, { send_to: ga4Id, contact_channel: channel, cta_position: position });
    if (adsId && /^[\w-]+$/.test(label || '')) {
      gtag('event', 'conversion', { send_to: adsId + '/' + label, transport_type: 'beacon' });
    }
  }

  if (hasTracking) {
    if (settings) settings.hidden = false;
    if (googleOption) googleOption.disabled = !googleId;
    if (datafastOption) datafastOption.disabled = !datafastId;
    configureTracking();
  }
  document.getElementById('accept-cookies')?.addEventListener('click', () => {
    const google = googleOption.checked && !!googleId;
    const datafast = datafastOption.checked && !!datafastId;
    chooseConsent(google && datafast ? 'both' : google ? 'google' : datafast ? 'datafast' : 'none');
  });
  document.getElementById('reject-cookies')?.addEventListener('click', () => chooseConsent('none'));
  settings?.addEventListener('click', () => {
    if (!banner) return;
    banner.hidden = !banner.hidden;
    settings.setAttribute('aria-expanded', String(!banner.hidden));
    if (!banner.hidden) {
      datafastOption.checked = permits('datafast') && !!datafastId;
      googleOption.checked = permits('google') && !!googleId;
      banner.scrollIntoView({ block: 'nearest' });
      (datafastId ? datafastOption : googleOption).focus();
    }
  });
  if (hasTracking && location.hash === '#cookie-settings') settings?.click();
  document.querySelectorAll('[data-contact]').forEach(link => {
    // DataFast automatically records external link URLs. Keep WhatsApp drafts
    // away from its delegated click/Enter handlers; our explicit goal has no data.
    link.addEventListener('keydown', event => {
      if (datafastId && (event.key === 'Enter' || event.key === ' ')) event.stopPropagation();
    });
    link.addEventListener('click', event => {
      if (datafastId) event.stopPropagation();
      if (!link.getAttribute('href')) return; // Unfinished wizard is not a contact.
      contactEvent(link.dataset.contact, link.dataset.position);
    });
  });
  // Wizard progress. Step names only: the visitor's service, size and district stay in the browser.
  document.addEventListener('izmir:funnel', event => {
    if (!preference || preference === 'none') return;
    const step = event.detail.step;
    if (!['service', 'size', 'district'].includes(step)) return;
    if (datafastLoaded && permits('datafast')) window.datafast('quote_step_' + step);
    if (!googleLoaded || !permits('google')) return;
    window.dataLayer.push({ event: 'quote_step', quote_step: step });
    if (ga4Id) gtag('event', 'quote_step', { send_to: ga4Id, quote_step: step });
  });
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

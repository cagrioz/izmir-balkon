(() => {
  'use strict';

  const WHATSAPP = 'https://wa.me/905423551213';
  const SERVICES = {
    'cam-balkon': { label: 'Cam balkon', phrase: 'cam balkon', fact: 'Yaklaşık ölçü' },
    'kis-bahcesi': { label: 'Kış bahçesi', phrase: 'kış bahçesi', fact: 'Yaklaşık alan' },
    pergola: { label: 'Pergola', phrase: 'pergola', fact: 'Yaklaşık alan' },
    dograma: { label: 'Pencere ve kapı', phrase: 'pencere ve kapı doğraması', fact: 'Yaklaşık adet' }
  };

  function initLightbox() {
    const dialog = document.getElementById('lightbox');
    const links = [...document.querySelectorAll('a[data-gallery]')];
    // Without <dialog> support the tiles stay plain links to the full image.
    if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;

    const slides = links.map(link => ({
      src: link.href,
      title: link.dataset.title,
      note: link.dataset.note,
      alt: link.dataset.alt || link.querySelector('img')?.alt || link.dataset.title
    }));
    const title = document.getElementById('lightbox-title');
    const note = document.getElementById('lightbox-note');
    const count = document.getElementById('lightbox-count');
    const image = document.createElement('img');
    image.decoding = 'async';
    dialog.querySelector('.lightbox-stage').prepend(image);
    let index = 0;
    let opener = null;

    function wrap(position) {
      return (position + slides.length) % slides.length;
    }
    function show(position) {
      index = wrap(position);
      const slide = slides[index];
      image.src = slide.src;
      image.alt = slide.alt;
      title.textContent = slide.title;
      note.textContent = slide.note;
      count.textContent = `${index + 1} / ${slides.length}`;
      // Warm the neighbours so prev/next does not flash the previous photo for long.
      new Image().src = slides[wrap(index + 1)].src;
      new Image().src = slides[wrap(index - 1)].src;
    }

    links.forEach((link, position) => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        show(position);
        dialog.showModal();
      });
    });
    dialog.querySelector('[data-lightbox="close"]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-lightbox="prev"]').addEventListener('click', () => show(index - 1));
    dialog.querySelector('[data-lightbox="next"]').addEventListener('click', () => show(index + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
    dialog.addEventListener('close', () => opener?.focus());
  }

  // A few taps build a WhatsApp draft. Nothing is sent or stored: the visitor sends it themselves.
  function draftMessage(service, size, district) {
    const item = SERVICES[service];
    const detail = size ? `${item.fact}: ${size}.` : 'Ölçüyü bilmiyorum, keşifte alınabilir.';
    return `Merhaba, ${district} ilçesinde ${item.phrase} için ücretsiz keşif ve fiyat almak istiyorum. ${detail}`;
  }
  const draftLink = text => `${WHATSAPP}?text=${encodeURIComponent(text)}`;

  function initWizard() {
    const wiz = document.getElementById('teklif');
    if (!wiz) return {};
    const count = wiz.querySelector('[data-wiz-count]');
    const steps = Object.fromEntries([...wiz.querySelectorAll('[data-step]')].map(step => [step.dataset.step, step]));
    const order = ['service', 'size', 'district'];
    const serviceName = wiz.querySelector('[data-wiz-service]');
    const summary = wiz.querySelector('[data-wiz-summary]');
    const photos = [...wiz.querySelectorAll('[data-wiz-photo]')];
    const district = wiz.querySelector('#district');
    const bubble = wiz.querySelector('[data-wiz-bubble]');
    const send = wiz.querySelector('#wiz-send');
    const tiles = [...wiz.querySelectorAll('[data-pick-service]')];
    const state = { service: document.body.dataset.service || 'cam-balkon', size: '' };

    function funnel(step) {
      // Step names only. Service, size and district never leave the browser through analytics.
      document.dispatchEvent(new CustomEvent('izmir:funnel', { detail: { step } }));
    }
    function refreshFinish() {
      const text = draftMessage(state.service, state.size, district.value || '…');
      bubble.textContent = text;
      // Without an href the button stays visible but inert, so nothing moves when a district is chosen.
      if (district.value) send.href = draftLink(text);
      else send.removeAttribute('href');
    }
    function currentQuestion() {
      return wiz.querySelector('[data-step]:not([hidden]) .wiz-sizes:not([hidden]) .wiz-q, [data-step="service"]:not([hidden]) .wiz-q, [data-step="district"]:not([hidden]) .wiz-q');
    }
    function go(step) {
      order.forEach(name => { steps[name].hidden = name !== step; });
      wiz.dataset.at = step;
      count.textContent = `Adım ${order.indexOf(step) + 1} / ${order.length}`;
      if (step === 'size') {
        serviceName.textContent = SERVICES[state.service].label;
        wiz.querySelectorAll('.wiz-sizes').forEach(group => { group.hidden = group.dataset.for !== state.service; });
      }
      if (step === 'district') {
        summary.textContent = state.size ? `${SERVICES[state.service].label} · ${state.size}` : SERVICES[state.service].label;
        refreshFinish();
      }
      currentQuestion()?.focus({ preventScroll: true });
    }
    function chooseService(service) {
      state.service = service;
      state.size = '';
      tiles.forEach(tile => {
        const picked = tile.dataset.pickService === service;
        tile.setAttribute('aria-pressed', String(picked));
        if (picked) photos.forEach(photo => { photo.src = tile.querySelector('img').getAttribute('src'); });
      });
    }

    wiz.addEventListener('click', event => {
      const tile = event.target.closest('[data-pick-service]');
      if (tile) chooseService(tile.dataset.pickService);
      if (tile || event.target.closest('[data-wiz-next]')) {
        funnel('service');
        go('size');
        return;
      }
      const sizeButton = event.target.closest('[data-pick-size]');
      if (sizeButton) {
        state.size = sizeButton.dataset.pickSize;
        funnel('size');
        go('district');
        return;
      }
      const backButton = event.target.closest('[data-wiz-go]');
      if (backButton) go(backButton.dataset.wizGo);
    });
    district.addEventListener('change', () => {
      if (district.value) funnel('district');
      refreshFinish();
      if (district.value) send.scrollIntoView({ block: 'nearest' });
    });

    return { focusCurrent: () => currentQuestion()?.focus({ preventScroll: true }) };
  }

  // Keeps visitors where they are: the one wizard moves into a sheet, then back to the hero.
  function initSheet(wizard) {
    const sheet = document.getElementById('teklif-sheet');
    const card = document.getElementById('teklif');
    const home = document.getElementById('teklif-yuva');
    // Without <dialog> support the links remain jumps to the wizard in the hero.
    if (!sheet || !card || !home || typeof sheet.showModal !== 'function') return;
    const body = sheet.querySelector('.sheet-body');
    let opener = null;

    document.querySelectorAll('[data-open-wizard]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        opener = link;
        // Hold the hero's height before anything changes, so the page behind does not jump.
        home.style.minHeight = `${home.offsetHeight}px`;
        body.append(card);
        sheet.showModal();
        wizard.focusCurrent?.();
      });
    });
    sheet.querySelector('[data-sheet-close]').addEventListener('click', () => sheet.close());
    sheet.addEventListener('click', event => {
      if (event.target === sheet) sheet.close();
    });
    sheet.addEventListener('close', () => {
      home.append(card);
      home.style.minHeight = '';
      opener?.focus({ preventScroll: true });
    });
  }

  // The wizard is the page's action until it scrolls away. The dock then takes over, and
  // steps aside wherever a section on screen already carries its own action.
  function initContactShortcuts() {
    const slot = document.getElementById('teklif-yuva');
    const dock = document.querySelector('.dock');
    const sections = [document.getElementById('kesif-cagri'), document.getElementById('son-adim')].filter(Boolean);
    if (!slot || !dock) return;
    let scheduled = 0;

    function update() {
      scheduled = 0;
      const pastHero = slot.getBoundingClientRect().bottom <= 0;
      const actionOnScreen = sections.some(section => {
        const box = section.getBoundingClientRect();
        return box.top < window.innerHeight && box.bottom > 0;
      });
      dock.hidden = !pastHero || actionOnScreen;
    }
    function schedule() {
      if (!scheduled) scheduled = requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(schedule);
      [slot, ...sections].forEach(element => observer.observe(element));
    } else {
      window.addEventListener('scroll', schedule, { passive: true });
    }
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    schedule();
  }

  // Customer words in the hero change by themselves. Hovering, keyboard focus, an open dialog or
  // a hidden tab holds them still, the pause button stops them, and reduced motion never starts them.
  function initQuotes() {
    const box = document.querySelector('[data-quotes]');
    if (!box) return;
    const slides = [...box.querySelectorAll('.quote')];
    const dots = [...box.querySelectorAll('[data-quote]')];
    const pause = box.querySelector('[data-quote-pause]');
    const icon = pause.querySelector('use');
    const stage = box.querySelector('.quotes');
    let index = 0;
    let timer = 0;
    let held = false;
    let onScreen = true;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, position) => slide.classList.toggle('is-on', position === index));
      dots.forEach((dot, position) => {
        if (position === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }
    function setRunning(running) {
      clearInterval(timer);
      timer = running ? setInterval(() => {
        if (!held && onScreen && !document.hidden && !document.querySelector('dialog[open]')) show(index + 1);
      }, 6000) : 0;
      stage.setAttribute('aria-live', running ? 'off' : 'polite');
      icon.setAttribute('href', running ? '#i-pause' : '#i-play');
      pause.setAttribute('aria-label', running ? 'Yorumların dönmesini durdur' : 'Yorumları döndür');
    }

    dots.forEach((dot, position) => dot.addEventListener('click', () => show(position)));
    pause.addEventListener('click', () => setRunning(!timer));
    box.addEventListener('mouseenter', () => { held = true; });
    box.addEventListener('mouseleave', () => { held = false; });
    box.addEventListener('focusin', () => { held = true; });
    box.addEventListener('focusout', () => { held = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { onScreen = entries[entries.length - 1].isIntersecting; }).observe(box);
    }
    setRunning(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  // WebMCP: lets an in-browser AI agent read the facts and prepare a draft directly. The API is
  // experimental, so browsers without it simply skip this and the page behaves the same.
  function initAgentTools() {
    const modelContext = document.modelContext || navigator.modelContext;
    if (!modelContext?.registerTool) return;
    const districts = [...document.querySelectorAll('#district option')].map(option => option.value).filter(Boolean);
    const register = tool => {
      try {
        Promise.resolve(modelContext.registerTool(tool)).catch(() => {});
      } catch {}
    };
    register({
      name: 'get_business_facts',
      description: 'Returns İzmir Balkon’s services, service area, contact details and how pricing works.',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => (await fetch('/llms.txt')).text()
    });
    register({
      name: 'prepare_quote_message',
      description: 'Builds a WhatsApp draft link asking İzmir Balkon for a free survey and a quote. It sends nothing: the user reviews and sends the message.',
      inputSchema: {
        type: 'object',
        properties: {
          service: { type: 'string', enum: Object.keys(SERVICES), description: 'The service wanted.' },
          district: { type: 'string', enum: districts, description: 'The İzmir district of the property.' },
          size: { type: 'string', description: 'Approximate size, for example "4 m" or "20 m²". Leave out if unknown.' }
        },
        required: ['service', 'district']
      },
      annotations: { readOnlyHint: true },
      execute: async ({ service, district, size }) => {
        const text = draftMessage(service, size || '', district);
        return JSON.stringify({ message: text, whatsapp_url: draftLink(text), phone: '+905423551213' });
      }
    });
  }

  // Long comments are clamped, never rewritten: the full text is one tap away.
  function initReviewClamp() {
    document.querySelectorAll('blockquote.review-text').forEach(text => {
      const lines = parseFloat(getComputedStyle(text).lineHeight) * 6;
      if (text.scrollHeight <= lines + 2) return;
      text.classList.add('is-clamped');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'review-more';
      button.textContent = 'Devamını oku';
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => {
        const open = text.classList.toggle('is-clamped');
        button.textContent = open ? 'Devamını oku' : 'Daha az göster';
        button.setAttribute('aria-expanded', String(!open));
      });
      text.after(button);
    });
  }

  initLightbox();
  initSheet(initWizard());
  initContactShortcuts();
  initReviewClamp();
  initQuotes();
  initAgentTools();
})();

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

  // Three taps build a WhatsApp draft. Nothing is sent or stored: the visitor sends it themselves.
  function initWizard() {
    const wiz = document.getElementById('teklif');
    if (!wiz) return {};
    const count = wiz.querySelector('[data-wiz-count]');
    const steps = Object.fromEntries([...wiz.querySelectorAll('[data-step]')].map(step => [step.dataset.step, step]));
    const order = ['service', 'size', 'district'];
    const serviceName = wiz.querySelector('[data-wiz-service]');
    const district = wiz.querySelector('#district');
    const finish = wiz.querySelector('[data-wiz-finish]');
    const bubble = wiz.querySelector('[data-wiz-bubble]');
    const send = wiz.querySelector('#wiz-send');
    const state = { service: document.body.dataset.service || '', size: '' };

    function funnel(step) {
      // Step names only. Service, size and district never leave the browser through analytics.
      document.dispatchEvent(new CustomEvent('izmir:funnel', { detail: { step } }));
    }
    function message() {
      const service = SERVICES[state.service];
      const detail = state.size ? `${service.fact}: ${state.size}.` : 'Ölçüyü bilmiyorum, keşifte alınabilir.';
      return `Merhaba, ${district.value} ilçesinde ${service.phrase} için ücretsiz keşif ve fiyat almak istiyorum. ${detail}`;
    }
    function refreshFinish() {
      finish.hidden = !district.value;
      if (!district.value) return;
      const text = message();
      bubble.textContent = text;
      send.href = `${WHATSAPP}?text=${encodeURIComponent(text)}`;
    }
    function go(step, { focus = true } = {}) {
      order.forEach(name => { steps[name].hidden = name !== step; });
      wiz.dataset.at = step;
      count.textContent = `Adım ${order.indexOf(step) + 1} / ${order.length}`;
      if (step === 'size') {
        serviceName.textContent = SERVICES[state.service].label;
        wiz.querySelectorAll('.wiz-sizes').forEach(group => { group.hidden = group.dataset.for !== state.service; });
      }
      if (step === 'district') refreshFinish();
      if (focus) {
        const target = step === 'size' ? steps.size.querySelector('.wiz-sizes:not([hidden]) .wiz-q') : steps[step].querySelector('.wiz-q');
        target?.focus({ preventScroll: true });
      }
    }
    function pickService(service) {
      if (!SERVICES[service]) return;
      state.service = service;
      state.size = '';
      funnel('service');
    }

    wiz.addEventListener('click', event => {
      const serviceButton = event.target.closest('[data-pick-service]');
      if (serviceButton) {
        pickService(serviceButton.dataset.pickService);
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
      if (!finish.hidden) send.scrollIntoView({ block: 'nearest' });
    });

    if (state.service && SERVICES[state.service]) go('size', { focus: false });
    else go('service', { focus: false });

    return {
      preselect(service) {
        if (SERVICES[service]) {
          pickService(service);
          go('size', { focus: false });
        }
      },
      focusCurrent() {
        wiz.querySelector('[data-step]:not([hidden]) .wiz-sizes:not([hidden]) .wiz-q, [data-step="service"]:not([hidden]) .wiz-q, [data-step="district"]:not([hidden]) .wiz-q')?.focus({ preventScroll: true });
      }
    };
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
        if (link.dataset.service) wizard.preselect?.(link.dataset.service);
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

  // The wizard is the page's action until it scrolls away. Only then do shortcuts appear,
  // and they step aside again when the closing section carries its own action.
  function initContactShortcuts() {
    const slot = document.getElementById('teklif-yuva');
    const closing = document.getElementById('son-adim');
    const dock = document.querySelector('.dock');
    const header = document.querySelector('.site-header');
    if (!slot || !closing || !dock || !header) return;
    let scheduled = 0;

    function update() {
      scheduled = 0;
      const pastHero = slot.getBoundingClientRect().bottom <= 0;
      const box = closing.getBoundingClientRect();
      const closingVisible = box.top < window.innerHeight && box.bottom > 0;
      header.classList.toggle('is-past-hero', pastHero);
      dock.hidden = !pastHero || closingVisible;
    }
    function schedule() {
      if (!scheduled) scheduled = requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(schedule);
      observer.observe(slot);
      observer.observe(closing);
    } else {
      window.addEventListener('scroll', schedule, { passive: true });
    }
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    schedule();
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
})();

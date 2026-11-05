(() => {
  'use strict';

  function initLightbox() {
    const dialog = document.getElementById('lightbox');
    const links = [...document.querySelectorAll('a[data-gallery]')];
    // Without <dialog> support the tiles stay plain links to the full image.
    if (!dialog || !links.length || typeof dialog.showModal !== 'function') return null;

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
    function open(position, trigger) {
      opener = trigger;
      show(position);
      dialog.showModal();
    }

    links.forEach((link, position) => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        open(position, link);
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

    // Lets the hero open the same sequence from the photo it is showing.
    return (href, trigger) => {
      const position = links.findIndex(link => link.getAttribute('href') === href);
      if (position >= 0) open(position, trigger);
    };
  }

  // Manual only, no autoplay. Without JS the first slide simply stays as a static photo.
  function initSlider(openLightbox) {
    const slider = document.querySelector('[data-slider]');
    if (!slider) return;
    const slides = [...slider.querySelectorAll('.slider-slide')];
    const thumbs = [...slider.querySelectorAll('[data-slider-thumb]')];
    const frame = slider.querySelector('.slider-frame');
    const controls = slider.querySelector('.slider-controls');
    const counter = slider.querySelector('.slider-counter');
    const expand = slider.querySelector('[data-slider-expand]');
    const position = slider.querySelector('[data-slider-position]');
    const title = slider.querySelector('[data-slider-title]');
    const note = slider.querySelector('[data-slider-note]');
    const warmed = new Set([0]);
    const pad = number => String(number).padStart(2, '0');
    let index = 0;
    let swipe = null;

    function wrap(target) {
      return (target + slides.length) % slides.length;
    }
    // Load a neighbour only once the visitor shows interest, so unused slides cost nothing.
    function warm(target) {
      const next = wrap(target);
      if (warmed.has(next)) return;
      warmed.add(next);
      const source = slides[next].querySelector('img');
      const preload = new Image();
      preload.sizes = source.sizes;
      preload.srcset = source.srcset;
      preload.src = source.src;
    }
    function warmNeighbours() {
      warm(index + 1);
      warm(index - 1);
    }
    function show(target) {
      slides[index].hidden = true;
      thumbs[index].removeAttribute('aria-current');
      index = wrap(target);
      const slide = slides[index];
      slider.classList.add('is-switching');
      slide.hidden = false;
      thumbs[index].setAttribute('aria-current', 'true');
      counter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      position.textContent = `Fotoğraf ${index + 1} / ${slides.length}: `;
      title.textContent = slide.dataset.title;
      note.textContent = slide.dataset.note;
      warmNeighbours();
    }

    controls.hidden = false;
    slider.querySelector('[data-slider-prev]').addEventListener('click', () => show(index - 1));
    slider.querySelector('[data-slider-next]').addEventListener('click', () => show(index + 1));
    thumbs.forEach((thumb, target) => thumb.addEventListener('click', () => show(target)));
    if (openLightbox) {
      expand.hidden = false;
      expand.addEventListener('click', () => openLightbox(slides[index].dataset.full, expand));
    }
    slider.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.preventDefault();
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
    slider.addEventListener('pointerenter', warmNeighbours, { once: true });
    slider.addEventListener('focusin', warmNeighbours, { once: true });
    frame.addEventListener('pointerdown', event => {
      warmNeighbours();
      swipe = event.pointerType === 'mouse' || event.target.closest('.slider-controls, .slider-expand') ? null : { x: event.clientX, y: event.clientY };
    });
    frame.addEventListener('pointerup', event => {
      if (!swipe) return;
      const dx = event.clientX - swipe.x;
      const dy = event.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
    });
    frame.addEventListener('pointercancel', () => { swipe = null; });
  }

  const REVIEWS_INITIAL = 6;
  const EXCERPT_LIMIT = 170;
  const BRAND_WORD = /armut/i;
  const REVIEW_GROUPS = [
    { id: 'all', label: 'Tümü' },
    { id: 'cam', label: 'Pencere ve cam' },
    { id: 'sineklik', label: 'Sineklik' },
    { id: 'diger', label: 'Diğer' }
  ];

  function reviewGroup(service) {
    const name = service.toLocaleLowerCase('tr');
    if (name.includes('sinekl')) return 'sineklik';
    if (/pencere|cam|pimapen|pvc|doğrama|kapı|balkon/.test(name)) return 'cam';
    return 'diger';
  }

  // Whole sentences from the customer's own text, with every gap marked by an ellipsis.
  // The platform name stays out of the short view but is never edited out of the full text.
  function reviewExcerpt(text) {
    const clean = text.trim();
    if (clean.length <= EXCERPT_LIMIT && !BRAND_WORD.test(clean)) return '';
    let excerpt = '';
    let skipped = false;
    for (const part of clean.match(/[^.!?…]+(?:[.!?…]+|$)/gu) || [clean]) {
      const sentence = part.trim();
      if (BRAND_WORD.test(sentence)) {
        skipped = true;
        continue;
      }
      const next = excerpt ? `${excerpt}${skipped ? ' … ' : ' '}${sentence}` : sentence;
      if (next.length > EXCERPT_LIMIT) break;
      excerpt = next;
      skipped = false;
    }
    if (!excerpt) {
      const longest = clean.split(/\S*armut\S*/i).map(piece => piece.trim()).sort((a, b) => b.length - a.length)[0];
      const cut = longest.slice(0, EXCERPT_LIMIT);
      excerpt = (longest.length > EXCERPT_LIMIT ? cut.slice(0, cut.lastIndexOf(' ')) : cut).replace(/[\s,;:–-]+$/, '');
    }
    if (!excerpt) return '…';
    const pieces = excerpt.split(' … ');
    return `${clean.startsWith(pieces[0]) ? '' : '… '}${excerpt}${clean.endsWith(pieces[pieces.length - 1]) ? '' : ' …'}`;
  }

  function starIcon(filled) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', filled ? 'star' : 'star star-off');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#i-star');
    svg.append(use);
    return svg;
  }

  function reviewCard(review, id) {
    const card = document.createElement('article');
    card.className = 'review';
    card.tabIndex = -1;

    const stars = document.createElement('span');
    stars.className = 'stars';
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', `5 üzerinden ${review.rating} yıldız`);
    for (let star = 1; star <= 5; star += 1) stars.append(starIcon(star <= review.rating));

    const quote = document.createElement('blockquote');
    quote.className = 'review-text';
    quote.id = id;
    const excerpt = reviewExcerpt(review.text);
    quote.textContent = excerpt || review.text;
    card.append(stars, quote);

    if (excerpt) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'review-toggle';
      toggle.textContent = 'Yorumun tamamı';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', id);
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        toggle.textContent = expanded ? 'Yorumun tamamı' : 'Kısalt';
        quote.textContent = expanded ? excerpt : review.text;
      });
      card.append(toggle);
    }

    const meta = document.createElement('footer');
    meta.className = 'review-meta';
    const name = document.createElement('strong');
    name.textContent = review.name;
    const service = document.createElement('span');
    service.textContent = review.service;
    const time = document.createElement('time');
    time.dateTime = review.date;
    const [year, month, day] = review.date.split('-').map(Number);
    time.textContent = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(year, month - 1, day));
    meta.append(name, service, time);
    card.append(meta);
    return card;
  }

  // Everything counted or listed here comes from reviews-data.js, so new rows appear by themselves.
  // Without the data or without JS, the static reviews in the page stay in place.
  function initReviews() {
    const list = document.querySelector('[data-reviews-list]');
    const reviews = (Array.isArray(window.IZMIR_REVIEWS) ? window.IZMIR_REVIEWS : [])
      .filter(review => review && review.text && review.name && review.service && /^\d{4}-\d{2}-\d{2}$/.test(review.date) && review.rating >= 1 && review.rating <= 5)
      .map(review => ({ ...review, group: reviewGroup(review.service) }));
    if (!list || !reviews.length) return;

    const filters = document.querySelector('[data-review-filters]');
    const more = document.querySelector('[data-reviews-more]');
    const status = document.querySelector('[data-reviews-status]');
    const count = document.querySelector('[data-reviews-count]');
    const heroLink = document.querySelector('[data-reviews-link]');
    let group = 'all';
    let shown = 0;
    let cardId = 0;

    function matching() {
      return group === 'all' ? reviews : reviews.filter(review => review.group === group);
    }
    function reveal(limit) {
      const items = matching();
      const added = items.slice(shown, limit).map(review => {
        cardId += 1;
        return reviewCard(review, `yorum-${cardId}`);
      });
      list.append(...added);
      shown = Math.min(limit, items.length);
      const rest = items.length - shown;
      more.hidden = rest === 0;
      more.textContent = group === 'all' ? `Tüm yorumları göster (${rest} yorum daha)` : `${rest} yorum daha göster`;
      return added;
    }

    list.replaceChildren();
    reveal(REVIEWS_INITIAL);
    count.querySelector('strong').textContent = reviews.length;
    count.hidden = false;
    if (heroLink) heroLink.textContent = `${reviews.length} müşteri yorumunu okuyun`;

    more.addEventListener('click', () => {
      // The button is about to disappear, so focus moves to the first newly shown review.
      reveal(matching().length)[0]?.focus({ preventScroll: true });
    });

    const available = REVIEW_GROUPS.filter(item => item.id === 'all' || reviews.some(review => review.group === item.id));
    if (available.length < 3) return;
    const buttons = available.map(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'review-filter';
      button.setAttribute('aria-pressed', String(item.id === group));
      const total = item.id === 'all' ? reviews.length : reviews.filter(review => review.group === item.id).length;
      const number = document.createElement('span');
      number.textContent = total;
      button.append(item.label, number);
      button.addEventListener('click', () => {
        group = item.id;
        buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        list.replaceChildren();
        shown = 0;
        reveal(REVIEWS_INITIAL);
        status.textContent = `${item.label}: ${total} yorum`;
      });
      return button;
    });
    filters.append(...buttons);
    filters.hidden = false;
  }

  // Contact shortcuts wait until the hero phone has really scrolled above the viewport,
  // not merely because it starts below the fold on a short screen.
  function initContactShortcuts() {
    const heroCall = document.getElementById('hero-call');
    const contact = document.getElementById('kesif');
    const dock = document.querySelector('.dock');
    const header = document.querySelector('.site-header');
    if (!heroCall || !contact || !dock || !header) return;
    let scheduled = 0;

    function update() {
      scheduled = 0;
      const pastHero = heroCall.getBoundingClientRect().bottom <= 0;
      const box = contact.getBoundingClientRect();
      const contactVisible = box.top < window.innerHeight && box.bottom > 0;
      header.classList.toggle('is-past-hero', pastHero);
      dock.hidden = !pastHero || contactVisible;
    }
    function schedule() {
      if (!scheduled) scheduled = requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(schedule);
      observer.observe(heroCall);
      observer.observe(contact);
    } else {
      window.addEventListener('scroll', schedule, { passive: true });
    }
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    schedule();
  }

  initSlider(initLightbox());
  initReviews();
  initContactShortcuts();
})();

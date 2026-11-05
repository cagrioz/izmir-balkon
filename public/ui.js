(() => {
  'use strict';

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

  // Manual only, no autoplay. Without JS the first slide simply stays as a static photo.
  function initSlider() {
    const slider = document.querySelector('[data-slider]');
    if (!slider) return;
    const slides = [...slider.querySelectorAll('.slider-slide')];
    const frame = slider.querySelector('.slider-frame');
    const controls = slider.querySelector('.slider-controls');
    const counter = slider.querySelector('.slider-counter');
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
      index = wrap(target);
      const slide = slides[index];
      slider.classList.add('is-switching');
      slide.hidden = false;
      counter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      position.textContent = `Fotoğraf ${index + 1} / ${slides.length}: `;
      title.textContent = slide.dataset.title;
      note.textContent = slide.dataset.note;
      warmNeighbours();
    }

    controls.hidden = false;
    slider.querySelector('[data-slider-prev]').addEventListener('click', () => show(index - 1));
    slider.querySelector('[data-slider-next]').addEventListener('click', () => show(index + 1));
    slider.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.preventDefault();
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
    slider.addEventListener('pointerenter', warmNeighbours, { once: true });
    slider.addEventListener('focusin', warmNeighbours, { once: true });
    frame.addEventListener('pointerdown', event => {
      warmNeighbours();
      swipe = event.pointerType === 'mouse' || event.target.closest('.slider-controls') ? null : { x: event.clientX, y: event.clientY };
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

  initLightbox();
  initSlider();
  initContactShortcuts();
})();

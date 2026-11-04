(() => {
  'use strict';
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
})();

/**
 * ─────────────────────────────────────────────────────────────
 * GALLERY MODULE WITH KEYBOARD-ACCESSIBLE LIGHTBOX
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

export async function initGalleryPage() {
  const container = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty');
  const yearFilter = document.getElementById('gallery-year-filter');
  const typeFilter = document.getElementById('gallery-type-filter');

  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!container) return;

  const albums = await store.getGallery();
  let currentYear = 'all';
  let currentType = 'all';

  let flatItems = [];
  let currentIndex = 0;

  function render() {
    let filtered = albums;
    if (currentYear !== 'all') {
      filtered = filtered.filter(a => a.year === currentYear);
    }
    if (currentType !== 'all') {
      filtered = filtered.filter(a => a.type === currentType);
    }

    if (filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';

    // Build flat items list for lightbox
    flatItems = [];
    filtered.forEach(album => {
      if (album.items && album.items.length > 0) {
        album.items.forEach(item => {
          flatItems.push({
            src: item.src,
            alt: item.alt || album.title,
            caption: `${album.title} — ${item.caption || ''}`,
            year: album.year,
            type: album.type
          });
        });
      } else {
        flatItems.push({
          src: album.cover_image,
          alt: album.title,
          caption: album.title,
          year: album.year,
          type: album.type
        });
      }
    });

    container.innerHTML = filtered.map((a, idx) => `
      <div class="col-4">
        <div class="card card--lift" style="cursor: pointer;" data-album-index="${idx}">
          <div style="position: relative; aspect-ratio: 16/10; overflow: hidden; background: var(--c-navy);">
            <img src="${a.cover_image}" alt="${a.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
            <span class="badge badge--gold" style="position: absolute; top: 12px; left: 12px;">
              ${a.type === 'video' ? '▶ Video' : '📷 Photos'}
            </span>
            <span class="badge badge--dark" style="position: absolute; bottom: 12px; right: 12px;">
              ${a.count_or_duration}
            </span>
          </div>
          <div class="card-body">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--c-flame-text); text-transform: uppercase;">${a.category} • ${a.year}</span>
            <h3 style="font-size: 1.125rem; margin-top: 4px; margin-bottom: 8px;">${a.title}</h3>
            <p style="font-size: 0.875rem; color: var(--c-text-muted);">${a.description}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click triggers to open lightbox
    const cards = container.querySelectorAll('[data-album-index]');
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        openLightbox(idx);
      });
    });
  }

  function openLightbox(index) {
    if (flatItems.length === 0) return;
    currentIndex = index;
    updateLightboxUI();
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.focus();
  }

  function closeLightbox() {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function nextImage() {
    if (flatItems.length === 0) return;
    currentIndex = (currentIndex + 1) % flatItems.length;
    updateLightboxUI();
  }

  function prevImage() {
    if (flatItems.length === 0) return;
    currentIndex = (currentIndex - 1 + flatItems.length) % flatItems.length;
    updateLightboxUI();
  }

  function updateLightboxUI() {
    const item = flatItems[currentIndex];
    if (!item) return;

    modalImg.src = item.src;
    modalImg.alt = item.alt;
    modalCaption.textContent = item.caption;
    modalCounter.textContent = `${currentIndex + 1} of ${flatItems.length}`;
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  if (yearFilter) {
    yearFilter.addEventListener('change', (e) => {
      currentYear = e.target.value;
      render();
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      currentType = e.target.value;
      render();
    });
  }

  render();
}

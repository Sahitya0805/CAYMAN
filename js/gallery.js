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
      <div class="circular-gallery-card" data-album-index="${idx}" role="button" tabindex="0" aria-label="View photo album: ${a.title}">
        <!-- Circular Photo Frame with Gold Ring -->
        <div class="circular-photo-wrapper">
          <img src="${a.cover_image}" alt="${a.title}" class="circular-photo-img" loading="lazy">
          <div class="circular-photo-overlay">
            <div class="circular-zoom-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </div>
          </div>
        </div>

        <!-- Details below circular photo -->
        <h3 class="circular-card-title">${a.title}</h3>
        <span class="circular-card-subtitle">${a.category}</span>
        <span class="circular-badge-pill">
          ${a.type === 'video' ? '▶ Video Highlight' : '📷 ' + a.count_or_duration}
        </span>
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

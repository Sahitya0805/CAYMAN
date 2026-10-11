/**
 * ─────────────────────────────────────────────────────────────
 * GALLERY MODULE
 * Filtering by Year & Category, Fullscreen Lightbox with Zoom & Controls
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

export async function initGalleryPage() {
  const grid = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty');
  const yearFilter = document.getElementById('gallery-year-filter');
  const catFilter = document.getElementById('gallery-cat-filter');
  const countEl = document.getElementById('gallery-count');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!grid) return;

  const photos = await store.getGallery();
  let currentYear = yearFilter ? yearFilter.value : 'all';
  let currentCat = catFilter ? catFilter.value : 'all';
  let activeFiltered = [];
  let currentIndex = 0;

  function render() {
    activeFiltered = photos.filter(item => {
      const matchYear = currentYear === 'all' || item.year === currentYear;
      const matchCat = currentCat === 'all' || item.category === currentCat;
      return matchYear && matchCat;
    });

    if (countEl) {
      countEl.textContent = `Showing ${activeFiltered.length} Verified Photos`;
    }

    if (activeFiltered.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = activeFiltered.map((p, idx) => `
      <article class="gallery-card futuristic-card" data-index="${idx}" tabindex="0" role="button" aria-label="${p.title}">
        <div class="gallery-card__img-wrap">
          <img src="${p.src}" alt="${p.title}" class="gallery-card__img" loading="lazy">
          <div class="gallery-card__badge-row">
            <span class="gallery-card__category">${p.category}</span>
            <span class="gallery-card__year">${p.year}</span>
          </div>
        </div>
        <div class="gallery-card__meta">
          <h3 class="gallery-card__title">${p.title}</h3>
          <p class="gallery-card__caption">${p.caption || ''}</p>
          <div class="gallery-card__footer">
            <span>${p.date || p.year}</span>
            <span>View Fullscreen ↗</span>
          </div>
        </div>
      </article>
    `).join('');

    // Attach card click handlers for Lightbox
    grid.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(idx);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(card.getAttribute('data-index'), 10);
          openLightbox(idx);
        }
      });
    });
  }

  function openLightbox(index) {
    if (!activeFiltered[index]) return;
    currentIndex = index;
    updateLightboxContent();
    if (lightboxModal) {
      lightboxModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  function updateLightboxContent() {
    const item = activeFiltered[currentIndex];
    if (!item) return;

    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.caption;
    if (lightboxCounter) {
      lightboxCounter.textContent = `Photo ${currentIndex + 1} of ${activeFiltered.length} • ${item.year} // ${item.category}`;
    }
  }

  function showNext() {
    if (activeFiltered.length === 0) return;
    currentIndex = (currentIndex + 1) % activeFiltered.length;
    updateLightboxContent();
  }

  function showPrev() {
    if (activeFiltered.length === 0) return;
    currentIndex = (currentIndex - 1 + activeFiltered.length) % activeFiltered.length;
    updateLightboxContent();
  }

  // Filter Listeners
  if (yearFilter) {
    yearFilter.addEventListener('change', (e) => {
      currentYear = e.target.value;
      render();
    });
  }
  if (catFilter) {
    catFilter.addEventListener('change', (e) => {
      currentCat = e.target.value;
      render();
    });
  }

  // Lightbox Controls
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-img-wrap')) {
        closeLightbox();
      }
    });
  }

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  render();
}

/**
 * ─────────────────────────────────────────────────────────────
 * CSK OFFICIAL ALBUM GALLERY MODULE
 * Pill Filter Bar (2026, 2025, 2024... CSK) + 4-Column Album Grid
 * Fullscreen Lightbox with Zoom, Captions & Keyboard Controls
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

export async function initGalleryPage() {
  const grid = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty');
  const pillsBar = document.getElementById('gallery-pills-bar');
  const btnShowAll = document.getElementById('btn-show-all-albums');

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
  let currentCategory = 'all'; // Default shows all genuine photos
  let activeFiltered = [];
  let currentIndex = 0;

  function render() {
    activeFiltered = photos.filter(item => {
      if (currentCategory === 'all') return true;
      return (item.category || '').toLowerCase() === currentCategory.toLowerCase();
    });

    if (activeFiltered.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';

    grid.innerHTML = activeFiltered.map((p, idx) => `
      <article class="csk-album-card cyber-reveal is-revealed" data-index="${idx}" tabindex="0" role="button" aria-label="${p.title}" style="animation-delay: ${idx * 0.04}s;">
        <!-- High-Res Album Cover Image -->
        <img src="${p.src}" alt="${p.title}" class="csk-album-img" loading="lazy">

        <!-- Top-Right Share Button (Matching CSK Reference) -->
        <div class="csk-card-share-btn" title="Share Album" aria-label="Share">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </div>

        <!-- Bottom Gradient Overlay Strip (Exact CSK Reference) -->
        <div class="csk-album-overlay">
          <div class="csk-album-info">
            <div class="csk-album-title-row">
              <span class="csk-album-icon-badge" title="Photo Album">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="3" width="20" height="18" rx="3" fill="#060E1D"></rect>
                  <circle cx="8" cy="8.5" r="2" fill="#F59E0B"></circle>
                  <path d="M21 16l-5-5-8 8" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"></path>
                </svg>
              </span>
              <h3 class="csk-album-title">${p.title}</h3>
            </div>
            <span class="csk-album-tag">ALBUM</span>
          </div>

          <!-- Bottom-Right Whistle Podu Circular Watermark Badge -->
          <div class="csk-whistle-badge" title="Whistle Podu">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 5a7 7 0 1 0 7 7V5h-7z"></path>
              <path d="M18 10h4"></path>
              <circle cx="11" cy="12" r="2.5"></circle>
            </svg>
          </div>
        </div>
      </article>
    `).join('');

    // Attach card click handlers for Lightbox
    grid.querySelectorAll('.csk-album-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If share icon clicked, trigger web share or copy URL
        if (e.target.closest('.csk-card-share-btn')) {
          e.stopPropagation();
          const idx = parseInt(card.getAttribute('data-index'), 10);
          const item = activeFiltered[idx];
          if (navigator.share) {
            navigator.share({ title: item.title, text: item.caption, url: window.location.href });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Album link copied to clipboard!');
          }
          return;
        }

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

  // Pill Filter Button Listeners
  if (pillsBar) {
    pillsBar.querySelectorAll('.gallery-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pillsBar.querySelectorAll('.gallery-pill-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentCategory = btn.getAttribute('data-category') || 'all';
        render();
      });
    });
  }

  if (btnShowAll) {
    btnShowAll.addEventListener('click', () => {
      if (pillsBar) {
        pillsBar.querySelectorAll('.gallery-pill-btn').forEach(b => {
          if (b.getAttribute('data-category') === 'all') b.classList.add('is-active');
          else b.classList.remove('is-active');
        });
      }
      currentCategory = 'all';
      render();
    });
  }

  // Lightbox Implementation
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
    if (lightboxDesc) lightboxDesc.textContent = item.caption || '';
    if (lightboxCounter) {
      lightboxCounter.textContent = `Photo ${currentIndex + 1} of ${activeFiltered.length} • Season ${item.year}`;
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

  // Lightbox Event Listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') showNext();
    else if (e.key === 'ArrowLeft') showPrev();
  });

  // Initial Render
  render();
}

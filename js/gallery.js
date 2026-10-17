import { store } from './content-store.js';

export async function initGalleryPage() {
  const grid = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty');
  const emptyTitle = document.getElementById('empty-title');
  const emptyDesc = document.getElementById('empty-desc');
  const pillsBar = document.getElementById('gallery-pills-bar');
  const mediaTypesBar = document.getElementById('gallery-media-types');
  const btnShowAll = document.getElementById('btn-show-all-albums');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!grid) return;

  const items = await store.getGallery();
  let currentMediaType = 'all'; // 'all', 'photo', 'video'
  let currentCategory = 'all';  // 'all', 'Matchday Action', etc.
  let activeFiltered = [];
  let currentIndex = 0;

  // Initialize Media Type Counts
  function updateCounts() {
    const totalAll = items.length;
    const totalPhotos = items.filter(p => (p.type || 'photo') === 'photo').length;
    const totalVideos = items.filter(p => p.type === 'video').length;

    const elAll = document.getElementById('count-all');
    const elPhotos = document.getElementById('count-photos');
    const elVideos = document.getElementById('count-videos');

    if (elAll) elAll.textContent = totalAll;
    if (elPhotos) elPhotos.textContent = totalPhotos;
    if (elVideos) elVideos.textContent = totalVideos;
  }
  updateCounts();

  function render() {
    activeFiltered = items.filter(item => {
      const itemType = item.type || 'photo';
      if (currentMediaType !== 'all' && itemType !== currentMediaType) {
        return false;
      }
      if (currentCategory !== 'all' && (item.category || '').toLowerCase() !== currentCategory.toLowerCase()) {
        return false;
      }
      return true;
    });

    if (activeFiltered.length === 0) {
      grid.style.display = 'none';
      if (emptyState) {
        emptyState.style.display = 'block';
        if (emptyTitle) {
          const typeWord = currentMediaType === 'video' ? 'Videos' : (currentMediaType === 'photo' ? 'Photos' : 'Media Items');
          emptyTitle.textContent = `No ${typeWord} Found for Selected Filter`;
        }
        if (emptyDesc) {
          emptyDesc.textContent = `Try selecting "All Categories" or switching media types to view more club archives.`;
        }
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';

    grid.innerHTML = activeFiltered.map((p, idx) => {
      const isVideo = p.type === 'video';
      const thumbSrc = isVideo ? (p.poster || p.src) : p.src;
      const tagLabel = isVideo ? 'VIDEO' : 'ALBUM';

      return `
        <article class="csk-album-card cyber-reveal is-revealed" data-index="${idx}" tabindex="0" role="button" aria-label="${p.title}" style="animation-delay: ${idx * 0.03}s;">
          <!-- High-Res Cover Image / Poster -->
          <img src="${thumbSrc}" alt="${p.title}" class="csk-album-img" loading="lazy">

          ${isVideo ? `
            <!-- Video Top-Left Duration Badge -->
            <div class="csk-video-badge" title="Official Video Footage">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>VIDEO</span>
              ${p.duration ? `<span class="csk-video-duration">${p.duration}</span>` : ''}
            </div>

            <!-- Pulsing Center Play Button Overlay -->
            <div class="csk-card-play-btn" aria-hidden="true" title="Play Video">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <polygon points="6 4 20 12 6 20 6 4"/>
              </svg>
            </div>
          ` : ''}

          <!-- Top-Right Share Button -->
          <div class="csk-card-share-btn" title="Share Media" aria-label="Share">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </div>

          <!-- Bottom Gradient Overlay Strip -->
          <div class="csk-album-overlay">
            <div class="csk-album-info">
              <div class="csk-album-title-row">
                <span class="csk-album-icon-badge" title="${isVideo ? 'Video Clip' : 'Photo Album'}">
                  ${isVideo ? `
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  ` : `
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="2" y="3" width="20" height="18" rx="3" fill="#060E1D"></rect>
                      <circle cx="8" cy="8.5" r="2" fill="#F59E0B"></circle>
                      <path d="M21 16l-5-5-8 8" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"></path>
                    </svg>
                  `}
                </span>
                <h3 class="csk-album-title">${p.title}</h3>
              </div>
              <span class="csk-album-tag" ${isVideo ? 'style="background: rgba(2, 132, 199, 0.4); color: #38BDF8; border-color: rgba(56, 189, 248, 0.4);"' : ''}>${tagLabel}</span>
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
      `;
    }).join('');

    // Attach card click handlers for Lightbox
    grid.querySelectorAll('.csk-album-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.csk-card-share-btn')) {
          e.stopPropagation();
          const idx = parseInt(card.getAttribute('data-index'), 10);
          const item = activeFiltered[idx];
          if (navigator.share) {
            navigator.share({ title: item.title, text: item.caption, url: window.location.href });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
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

  // Media Type Filter Listeners (All / Photos / Videos)
  if (mediaTypesBar) {
    mediaTypesBar.querySelectorAll('.gallery-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mediaTypesBar.querySelectorAll('.gallery-type-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentMediaType = btn.getAttribute('data-type') || 'all';
        render();
      });
    });
  }

  // Category Pill Filter Listeners
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
      if (mediaTypesBar) {
        mediaTypesBar.querySelectorAll('.gallery-type-btn').forEach(b => {
          if (b.getAttribute('data-type') === 'all') b.classList.add('is-active');
          else b.classList.remove('is-active');
        });
      }
      if (pillsBar) {
        pillsBar.querySelectorAll('.gallery-pill-btn').forEach(b => {
          if (b.getAttribute('data-category') === 'all') b.classList.add('is-active');
          else b.classList.remove('is-active');
        });
      }
      currentMediaType = 'all';
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
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
    if (lightboxModal) {
      lightboxModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  function updateLightboxContent() {
    const item = activeFiltered[currentIndex];
    if (!item) return;

    const isVideo = item.type === 'video';

    if (isVideo) {
      if (lightboxImg) {
        lightboxImg.style.display = 'none';
        lightboxImg.src = '';
      }
      if (lightboxVideo) {
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = item.src;
        if (item.poster) lightboxVideo.poster = item.poster;
        lightboxVideo.play().catch(() => {});
      }
    } else {
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxVideo.style.display = 'none';
      }
      if (lightboxImg) {
        lightboxImg.style.display = 'block';
        lightboxImg.src = item.src;
        lightboxImg.alt = item.title;
      }
    }

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.caption || '';
    if (lightboxCounter) {
      const typeLabel = isVideo ? 'Video' : 'Photo';
      const durText = isVideo && item.duration ? ` • ${item.duration}` : '';
      lightboxCounter.textContent = `${typeLabel} ${currentIndex + 1} of ${activeFiltered.length} • Season ${item.year}${durText}`;
    }
  }

  function showNext() {
    if (activeFiltered.length === 0) return;
    if (lightboxVideo) {
      lightboxVideo.pause();
    }
    currentIndex = (currentIndex + 1) % activeFiltered.length;
    updateLightboxContent();
  }

  function showPrev() {
    if (activeFiltered.length === 0) return;
    if (lightboxVideo) {
      lightboxVideo.pause();
    }
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

import { store } from './content-store.js?v=20261018_clean_v3';

export async function initGalleryPage() {
  const grid = document.getElementById('gallery-grid');
  const emptyState = document.getElementById('gallery-empty');
  const emptyTitle = document.getElementById('empty-title');
  const emptyDesc = document.getElementById('empty-desc');
  const pillsBar = document.getElementById('gallery-pills-bar');
  const mediaTypesBar = document.getElementById('gallery-media-types');
  const btnShowAll = document.getElementById('btn-show-all-albums');
  const resultsSummary = document.getElementById('gallery-results-summary');
  const searchInput = document.getElementById('gallery-search-input');
  const viewToggle = document.getElementById('gallery-view-toggle');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCategory = document.getElementById('lightbox-category');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!grid) return;

  const items = await store.getGallery();
  let currentMediaType = 'all'; // 'all', 'photo', 'video'
  let currentCategory = 'all';  // 'all', 'Matchday Action', etc.
  let searchQuery = '';
  let activeFiltered = [];
  let currentIndex = 0;

  // Initialize Media Type Counts & Hero Telemetry
  function updateCounts() {
    const totalAll = items.length;
    const totalPhotos = items.filter(p => (p.type || 'photo') === 'photo').length;
    const totalVideos = items.filter(p => p.type === 'video').length;

    const elAll = document.getElementById('count-all');
    const elPhotos = document.getElementById('count-photos');
    const elVideos = document.getElementById('count-videos');
    const heroTotal = document.getElementById('hero-stat-total');
    const heroPhotos = document.getElementById('hero-stat-photos');
    const heroVideos = document.getElementById('hero-stat-videos');

    if (elAll) elAll.textContent = totalAll;
    if (elPhotos) elPhotos.textContent = totalPhotos;
    if (elVideos) elVideos.textContent = totalVideos;
    if (heroTotal) heroTotal.textContent = totalAll;
    if (heroPhotos) heroPhotos.textContent = totalPhotos;
    if (heroVideos) heroVideos.textContent = totalVideos;
  }
  updateCounts();

  function render() {
    const q = searchQuery.trim().toLowerCase();
    activeFiltered = items.filter(item => {
      const itemType = item.type || 'photo';
      if (currentMediaType !== 'all' && itemType !== currentMediaType) {
        return false;
      }
      if (currentCategory !== 'all' && (item.category || '').toLowerCase() !== currentCategory.toLowerCase()) {
        return false;
      }
      if (q) {
        const hay = `${item.title || ''} ${item.caption || ''} ${item.category || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    // In "All Media" view, always show photos before videos
    if (currentMediaType === 'all') {
      activeFiltered.sort((a, b) => {
        const aIsVideo = (a.type === 'video') ? 1 : 0;
        const bIsVideo = (b.type === 'video') ? 1 : 0;
        return aIsVideo - bIsVideo;
      });
    }

    if (resultsSummary) {
      const catText = currentCategory === 'all' ? 'All Categories' : currentCategory;
      resultsSummary.textContent = `${activeFiltered.length} ${activeFiltered.length === 1 ? 'item' : 'items'} • ${catText}`;
    }

    if (activeFiltered.length === 0) {
      grid.style.display = 'none';
      if (emptyState) {
        emptyState.style.display = 'block';
        if (emptyTitle) {
          const typeWord = currentMediaType === 'video' ? 'Videos' : (currentMediaType === 'photo' ? 'Photos' : 'Media Items');
          emptyTitle.textContent = `No ${typeWord} Found for Selected Filter`;
        }
        if (emptyDesc) {
          emptyDesc.textContent = `Try clearing your search or selecting "All Categories" to view all club archives.`;
        }
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';

    grid.innerHTML = activeFiltered.map((p, idx) => {
      const isVideo = p.type === 'video';
      const thumbSrc = isVideo ? (p.poster || p.src) : p.src;
      const isPersonPhoto = !isVideo && (p.title || '').startsWith('Image of');
      const categoryLabel = isPersonPhoto ? 'Cayman Super Kings' : (p.category || (isVideo ? 'Video Clip' : 'Club Archive'));
      const indexStr = String(idx + 1).padStart(2, '0');

      return `
        <article class="csk-album-card cyber-reveal is-revealed ${isVideo ? 'is-video-card' : ''}" data-index="${idx}" tabindex="0" role="button" aria-label="${p.title}" style="animation-delay: ${Math.min(idx * 0.03, 0.35)}s;">
          <div class="csk-album-media-wrap">
            <!-- High-Res Cover Image / Poster -->
            <img src="${thumbSrc}" alt="${p.title}" class="csk-album-img ${isVideo ? 'csk-video-poster-img' : ''}" loading="lazy" onerror="this.onerror=null; this.src='assets/csk-official-logo.png'; this.style.objectFit='contain'; this.style.padding='40px';">

            ${isVideo ? `
              <div class="csk-video-badge" title="Official Video Footage">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
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

            <!-- Bottom Gradient Overlay Strip -->
            <div class="csk-album-overlay">
              <div class="csk-album-info">
                <div class="csk-album-meta-top">
                  <span class="csk-album-tag ${isVideo ? 'is-video-tag' : ''}">${categoryLabel}</span>
                </div>
                <h3 class="csk-album-title">${p.title}</h3>
                ${p.caption ? `<p class="csk-album-caption">${p.caption}</p>` : ''}
              </div>
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

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      render();
    });
  }

  // Grid Density Toggle Listener (4-col vs 3-col Cinema)
  if (viewToggle) {
    viewToggle.querySelectorAll('.gallery-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        viewToggle.querySelectorAll('.gallery-view-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cols = btn.getAttribute('data-cols');
        if (cols === '3') {
          grid.classList.add('is-cinema-grid');
        } else {
          grid.classList.remove('is-cinema-grid');
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
      if (searchInput) searchInput.value = '';
      searchQuery = '';
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

    if (lightboxCategory) {
      lightboxCategory.textContent = item.category || (isVideo ? 'Video Clip' : 'Photo');
    }
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.caption || '';
    if (lightboxCounter) {
      const typeLabel = isVideo ? 'Video' : 'Photo';
      const durText = isVideo && item.duration ? ` • ${item.duration}` : '';
      lightboxCounter.textContent = `${typeLabel} ${currentIndex + 1} of ${activeFiltered.length} • ${item.year || '2026'}${durText}`;
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

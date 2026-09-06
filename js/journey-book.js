/**
 * Cayman Super Kings — Our Journey 3D Book Controller
 * Realistic 5-page interactive book with realistic turning animations, Web Audio page flip sounds,
 * 3D parallax tilt, chapter tabs, corner curling, and touch swipe.
 */

document.addEventListener('DOMContentLoaded', () => {
  initJourneyBook();
});

function initJourneyBook() {
  const book = document.getElementById('journey-book');
  const wrapper = document.querySelector('.book-perspective-wrapper');
  if (!book) return;

  const pages = book.querySelectorAll('.book-page');
  const prevBtn = document.getElementById('book-prev-btn');
  const nextBtn = document.getElementById('book-next-btn');
  const pageIndicator = document.getElementById('book-page-indicator');
  const progressBar = document.getElementById('book-progress-fill');
  const chapterTabs = document.querySelectorAll('.book-tab-btn');
  const totalPages = pages.length; // 5 pages (0 to 4)

  let currentPage = 0;
  let isTurning = false;

  // Web Audio API Realistic Paper Rustle Synthesizer
  function playPageFlipSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const bufferSize = Math.floor(ctx.sampleRate * 0.18); // 180ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Exponential decay white noise with micro flutter
        const envelope = Math.exp(-i / (bufferSize * 0.35));
        const flutter = 1 + 0.3 * Math.sin((i / bufferSize) * 30);
        data[i] = (Math.random() * 2 - 1) * envelope * flutter;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.16);
      filter.Q.value = 1.4;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.17);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start();
      noise.stop(ctx.currentTime + 0.18);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function updateBookState(direction = 'none') {
    pages.forEach((page, index) => {
      // Clear all active/transitional classes
      page.classList.remove('page-active', 'page-turned', 'page-incoming', 'flipping-forward', 'flipping-backward');
      
      if (index < currentPage) {
        // Already turned to the left
        page.classList.add('page-turned');
        page.style.zIndex = index + 1;
        page.setAttribute('aria-hidden', 'true');
      } else if (index === currentPage) {
        // Currently active / visible page
        page.classList.add('page-active');
        if (direction === 'forward') {
          page.classList.add('flipping-forward');
        } else if (direction === 'backward') {
          page.classList.add('flipping-backward');
        }
        page.style.zIndex = 10;
        page.setAttribute('aria-hidden', 'false');
      } else {
        // Upcoming pages stacked to the right
        page.classList.add('page-incoming');
        page.style.zIndex = totalPages - index;
        page.setAttribute('aria-hidden', 'true');
      }
    });

    // Update controls
    if (prevBtn) {
      prevBtn.disabled = currentPage === 0;
      prevBtn.setAttribute('aria-disabled', String(currentPage === 0));
    }
    if (nextBtn) {
      nextBtn.disabled = currentPage === totalPages - 1;
      nextBtn.setAttribute('aria-disabled', String(currentPage === totalPages - 1));
    }

    // Update indicator
    if (pageIndicator) {
      pageIndicator.textContent = `Chapter 0${currentPage + 1} of 0${totalPages}`;
    }

    // Update Progress bar
    if (progressBar) {
      const progressPercent = ((currentPage + 1) / totalPages) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Update Chapter Bookmark Tabs
    chapterTabs.forEach((tab, index) => {
      if (index === currentPage) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Unlock transition after animation completes
    setTimeout(() => {
      isTurning = false;
      pages.forEach(p => p.classList.remove('flipping-forward', 'flipping-backward'));
    }, 750);
  }

  function turnToPage(index) {
    if (isTurning || index < 0 || index >= totalPages || index === currentPage) return;
    isTurning = true;
    const direction = index > currentPage ? 'forward' : 'backward';
    currentPage = index;
    playPageFlipSound();
    updateBookState(direction);
  }

  function nextPage() {
    if (isTurning || currentPage >= totalPages - 1) return;
    isTurning = true;
    currentPage++;
    playPageFlipSound();
    updateBookState('forward');
  }

  function prevPage() {
    if (isTurning || currentPage <= 0) return;
    isTurning = true;
    currentPage--;
    playPageFlipSound();
    updateBookState('backward');
  }

  // Button Listeners
  if (nextBtn) nextBtn.addEventListener('click', nextPage);
  if (prevBtn) prevBtn.addEventListener('click', prevPage);

  // Tab Listeners
  chapterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPage = parseInt(tab.getAttribute('data-page'), 10);
      if (!isNaN(targetPage)) {
        turnToPage(targetPage);
      }
    });
  });

  // Corner Curl Listeners
  document.querySelectorAll('.page-corner-curl').forEach(curl => {
    curl.addEventListener('click', (e) => {
      e.stopPropagation();
      nextPage();
    });
  });

  document.querySelectorAll('.page-corner-curl-prev').forEach(curl => {
    curl.addEventListener('click', (e) => {
      e.stopPropagation();
      prevPage();
    });
  });

  // Click on Page to Flip Forward or Backward
  pages.forEach((page, index) => {
    page.addEventListener('click', (e) => {
      if (e.target.closest('a, button, input, .page-corner-curl, .page-corner-curl-prev')) return;

      const rect = page.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      
      if (index === currentPage) {
        if (clickX > rect.width * 0.5) {
          nextPage();
        } else {
          prevPage();
        }
      }
    });
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  book.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  book.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance < 0) {
        nextPage(); // Swipe Left -> Next Page
      } else {
        prevPage(); // Swipe Right -> Prev Page
      }
    }
  }

  // Keyboard navigation when book is in focus
  book.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      prevPage();
    }
  });

  // 3D Parallax Tilt Effect on Book Wrapper
  if (wrapper && window.innerWidth > 900) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      const tiltX = -y * 8; // deg
      const tiltY = x * 10; // deg
      
      book.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      book.style.transform = 'rotateX(0deg) rotateY(0deg)';
      book.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    wrapper.addEventListener('mouseenter', () => {
      book.style.transition = 'transform 0.15s ease-out';
    });
  }

  // Initialize first state
  updateBookState('none');
}

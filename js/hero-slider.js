/**
 * ─────────────────────────────────────────────────────────────
 * HERO IMAGE SLIDER MODULE (3 Featured Matchday Photos)
 * Automatically cycles through hero photos with smooth
 * crossfade transitions and interactive dot indicators.
 * ─────────────────────────────────────────────────────────────
 */

let heroSliderAutoplayTimer = null;
let currentSlideIndex = 0;
let isHeroSliderBound = false;

export function initHeroSlider() {
  const container = document.getElementById('hero-cinematic') || document.getElementById('hero-slider');
  if (!container) return;

  const slides = container.querySelectorAll('.hero-slide');
  const dots = container.querySelectorAll('.slide-indicator-dot, .slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!slides || slides.length === 0) return;

  const slideCount = slides.length;
  const interval = 3500; // 3.5s smooth auto crossfade

  function renderSlide(targetIndex) {
    currentSlideIndex = (targetIndex + slideCount) % slideCount;

    slides.forEach((slide, idx) => {
      const isActive = idx === currentSlideIndex;
      slide.classList.toggle('active', isActive);
      slide.style.opacity = isActive ? '1' : '0';
      slide.style.zIndex = isActive ? '3' : '1';
      slide.style.pointerEvents = isActive ? 'auto' : 'none';
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlideIndex);
    });
  }

  function nextSlide() {
    renderSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    renderSlide(currentSlideIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    heroSliderAutoplayTimer = setInterval(nextSlide, interval);
  }

  function stopAutoplay() {
    if (heroSliderAutoplayTimer) {
      clearInterval(heroSliderAutoplayTimer);
      heroSliderAutoplayTimer = null;
    }
  }

  // Initial render
  renderSlide(currentSlideIndex);

  // Bind event listeners only once
  if (!isHeroSliderBound) {
    isHeroSliderBound = true;

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        startAutoplay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        renderSlide(idx);
        startAutoplay();
      });
    });

    // Handle tab visibility so it resumes cleanly when tab is focused
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      }
    });
  }

  // Start autoplay
  startAutoplay();
}

// Auto-run when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
  } else {
    initHeroSlider();
  }
}


/**
 * ─────────────────────────────────────────────────────────────
 * CSK PROFESSIONAL BRANDED SPLASH & PAGE TRANSITION LOADER
 * Displays official crest, clean brand typography, and
 * professional candy-striped loading progress bar.
 * ─────────────────────────────────────────────────────────────
 */

const PROFESSIONAL_SPLASH_TEMPLATE = `
  <div class="csk-splash-screen__backdrop"></div>
  <div class="csk-splash-screen__content">
    <!-- Official Crest -->
    <div class="csk-splash-screen__logo-wrap">
      <img src="assets/csk-official-logo.png" alt="Cayman Super Kings" class="csk-splash-screen__image">
    </div>

    <!-- Professional Brand Heading -->
    <div class="csk-splash-brand-wrap">
      <h1 class="csk-splash-brand-title">CAYMAN SUPER KINGS</h1>
      <p class="csk-splash-motto">★ ONE TEAM • ONE DREAM ★</p>
    </div>

    <!-- Clean Professional Loader -->
    <div class="csk-splash-screen__loader-wrap">
      <span class="csk-splash-screen__loader-text">LOADING ...</span>
      <div class="csk-splash-screen__progress">
        <div class="csk-splash-screen__bar" id="csk-splash-bar"></div>
      </div>
    </div>
  </div>
`;

export function initSplashLoader() {
  let splash = document.getElementById('csk-splash-screen');

  if (!splash) {
    splash = document.createElement('div');
    splash.id = 'csk-splash-screen';
    splash.className = 'csk-splash-screen';
    splash.setAttribute('aria-hidden', 'false');
    splash.innerHTML = PROFESSIONAL_SPLASH_TEMPLATE;
    document.body.prepend(splash);
  } else {
    splash.innerHTML = PROFESSIONAL_SPLASH_TEMPLATE;
  }

  const barEl = document.getElementById('csk-splash-bar');

  // Smooth linear progress bar fill
  let progress = 0;
  const durationMs = 750;
  const startTime = performance.now();

  function updateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / durationMs, 1);
    
    progress = Math.floor(rawProgress * 100);

    if (barEl) {
      barEl.style.width = `${progress}%`;
    }

    if (rawProgress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(() => {
        splash.classList.add('is-hidden');
        splash.classList.remove('is-active');
        splash.setAttribute('aria-hidden', 'true');
      }, 140);
    }
  }

  requestAnimationFrame(updateProgress);

  // Handle browser back/forward history cache (pageshow)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      splash.classList.add('is-hidden');
      splash.classList.remove('is-active');
      splash.setAttribute('aria-hidden', 'true');
    }
  });
}




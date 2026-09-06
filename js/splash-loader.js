/**
 * ─────────────────────────────────────────────────────────────
 * CSK SPLASH & PAGE TRANSITION LOADER
 * Displays branded full-screen splash animation on initial load
 * and dismisses smoothly in 1 clean go.
 * ─────────────────────────────────────────────────────────────
 */

export function initSplashLoader() {
  let splash = document.getElementById('csk-splash-screen');

  // Create if missing in DOM
  if (!splash) {
    splash = document.createElement('div');
    splash.id = 'csk-splash-screen';
    splash.className = 'csk-splash-screen';
    splash.setAttribute('aria-hidden', 'false');
    splash.innerHTML = `
      <div class="csk-splash-screen__backdrop"></div>
      <div class="csk-splash-screen__content">
        <div class="csk-splash-screen__logo-wrap">
          <img src="assets/csk-splash.png" alt="Cayman Super Kings" class="csk-splash-screen__image">
        </div>
        <div class="csk-splash-screen__loader-wrap">
          <span class="csk-splash-screen__loader-text">Loading ...</span>
          <div class="csk-splash-screen__progress">
            <div class="csk-splash-screen__bar"></div>
          </div>
        </div>
      </div>
    `;
    document.body.prepend(splash);
  }

  // Handle initial page load dismissal in 1 clean go
  const hideSplash = () => {
    setTimeout(() => {
      splash.classList.add('is-hidden');
      splash.classList.remove('is-active');
      splash.setAttribute('aria-hidden', 'true');
    }, 850);
  };

  if (document.readyState === 'complete') {
    hideSplash();
  } else {
    window.addEventListener('load', hideSplash, { once: true });
    // Fallback safety timeout
    setTimeout(hideSplash, 1100);
  }

  // Handle browser back/forward history cache (pageshow)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      splash.classList.add('is-hidden');
      splash.classList.remove('is-active');
      splash.setAttribute('aria-hidden', 'true');
    }
  });
}


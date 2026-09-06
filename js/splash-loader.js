/**
 * ─────────────────────────────────────────────────────────────
 * CSK SPLASH & PAGE TRANSITION LOADER
 * Displays branded full-screen splash animation on initial load
 * and during inter-page navigation transitions.
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

  // Handle initial page load dismissal
  const hideSplash = () => {
    setTimeout(() => {
      splash.classList.add('is-hidden');
      splash.classList.remove('is-active');
      splash.setAttribute('aria-hidden', 'true');
    }, 750);
  };

  if (document.readyState === 'complete') {
    hideSplash();
  } else {
    window.addEventListener('load', hideSplash);
    // Fallback safety timeout
    setTimeout(hideSplash, 1200);
  }

  // Handle browser back/forward history cache (pageshow)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      splash.classList.add('is-hidden');
      splash.classList.remove('is-active');
      splash.setAttribute('aria-hidden', 'true');
    }
  });

  // Intercept internal navigation clicks (Navbar, CTAs, page links)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignore in-page hash anchors, protocols, download, new tabs
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:') ||
      link.getAttribute('target') === '_blank' ||
      link.hasAttribute('download')
    ) {
      return;
    }

    // Check external urls
    if (href.startsWith('http://') || href.startsWith('https://')) {
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
      } catch (err) {
        return;
      }
    }

    // Check current page comparison
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const targetClean = href.split('?')[0].split('#')[0].split('/').pop() || 'index.html';

    // If clicking same page anchor without changing page
    if (currentPath === targetClean && (href.includes('#') || href === currentPath)) {
      return;
    }

    // Trigger splash transition
    e.preventDefault();
    splash.classList.remove('is-hidden');
    splash.classList.add('is-active');
    splash.setAttribute('aria-hidden', 'false');

    // Smooth navigation delay
    setTimeout(() => {
      window.location.href = href;
    }, 480);
  });
}

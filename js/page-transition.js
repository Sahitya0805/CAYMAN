/**
 * ─────────────────────────────────────────────────────────────
 * CSK CRICKET THEMED PAGE TRANSITION SYSTEM
 * Seamless, thrilling cricket broadcast stinger transition
 * between pages: spinning red leather ball, laser Hawk-Eye trail,
 * swinging willow bat, LED Zing impact burst, and stadium shutters.
 * ─────────────────────────────────────────────────────────────
 */

const COMMENTARY_CALLS = [
  "🏏 BOUNDARY DRIVE THROUGH COVERS!",
  "⚡ 155 KM/H IN-SWINGING YORKER!",
  "🔥 SMASHED OVER EXTRA COVER FOR SIX!",
  "🎯 LASER ROCKET DOWN THE 22-YARD CORRIDOR!",
  "⚡ CRACKING PULL SHOT TO THE FENCE!",
  "🏟️ MAXIMUM INTO THE GRANDSTAND!"
];

let transitionOverlay = null;
let isTransiting = false;

function createCricketTransitionDOM() {
  if (document.getElementById('csk-cricket-transition')) {
    return document.getElementById('csk-cricket-transition');
  }

  const el = document.createElement('div');
  el.id = 'csk-cricket-transition';
  el.className = 'csk-cricket-transition';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <!-- Dual Stadium Cyber Shutters -->
    <div class="csk-trans-shutter csk-trans-shutter--top"></div>
    <div class="csk-trans-shutter csk-trans-shutter--bottom"></div>

    <!-- Stadium Floodlight Flare -->
    <div class="csk-trans-flare"></div>

    <!-- Center Cricket Arena -->
    <div class="csk-trans-arena">
      <!-- Fast Sweeping Willow Bat -->
      <div class="csk-trans-bat" id="csk-trans-bat">
        <svg viewBox="0 0 32 64" class="cricket-bat-svg" width="34" height="68">
          <rect x="14" y="2" width="4" height="18" rx="2" fill="#E2E8F0" stroke="#0F172A" stroke-width="1" />
          <line x1="14" y1="6" x2="18" y2="6" stroke="#EF4444" stroke-width="1.2" />
          <line x1="14" y1="10" x2="18" y2="10" stroke="#EF4444" stroke-width="1.2" />
          <line x1="14" y1="14" x2="18" y2="14" stroke="#EF4444" stroke-width="1.2" />
          <path d="M12 20 L20 20 L21 54 C21 58 19 60 16 60 C13 60 11 58 11 54 Z" fill="#FBBF24" stroke="#D97706" stroke-width="1" />
          <path d="M14 26 L18 26 L17 44 L15 44 Z" fill="#EF4444" />
        </svg>
      </div>

      <!-- High Velocity Red Leather Cricket Ball & Laser Trail -->
      <div class="csk-trans-ball-track" id="csk-trans-ball-track">
        <div class="csk-trans-laser-trail"></div>
        <div class="csk-trans-ball">
          <div class="csk-trans-seam"></div>
          <div class="csk-trans-seam-glow"></div>
        </div>
      </div>

      <!-- Matchday Speed & Commentary Telemetry HUD -->
      <div class="csk-trans-hud">
        <div class="csk-trans-brand">
          <span class="csk-trans-radar-dot"></span>
          <span class="csk-trans-brand-text">CAYMAN SUPER KINGS</span>
        </div>
        <div class="csk-trans-telemetry">
          <span class="csk-trans-speed-val" id="csk-trans-speed">154.8</span>
          <span class="csk-trans-speed-unit">KM/H</span>
          <span class="csk-trans-call" id="csk-trans-call">🏏 BOUNDARY POWERPLAY!</span>
        </div>
      </div>

      <!-- Zing LED Wicket Impact Flash -->
      <div class="csk-trans-zing-burst" id="csk-trans-zing"></div>
    </div>
  `;

  document.body.appendChild(el);
  return el;
}

export function initPageTransitions() {
  transitionOverlay = createCricketTransitionDOM();

  // If incoming page was loaded via a cricket transition, play exit reveal
  try {
    if (sessionStorage.getItem('csk_page_transiting') === 'true') {
      sessionStorage.removeItem('csk_page_transiting');
      playExitReveal();
    }
  } catch (err) {}

  // Intercept all internal navigation link clicks
  document.addEventListener('click', handleLinkClick);

  // Clear transition when navigating via back/forward browser cache
  window.addEventListener('pageshow', (event) => {
    isTransiting = false;
    if (transitionOverlay) {
      transitionOverlay.classList.remove('is-active', 'is-entering', 'is-exiting');
      transitionOverlay.style.display = 'none';
    }
  });
}

function handleLinkClick(e) {
  // Find nearest anchor
  const link = e.target.closest('a');
  if (!link) return;

  // Don't intercept if modified clicks (new tab, new window)
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;

  // Don't intercept target="_blank"
  if (link.target === '_blank') return;

  // Don't intercept download links or specific opt-outs
  if (link.hasAttribute('download') || link.classList.contains('no-transition')) return;

  const href = link.getAttribute('href');
  if (!href) return;

  // Ignore javascript, mailto, tel
  if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

  // Ignore in-page hash links (e.g. href="#squad-section")
  if (href.startsWith('#')) return;

  // Check if link is to an internal page
  let targetUrl;
  try {
    targetUrl = new URL(link.href, window.location.href);
  } catch (err) {
    return;
  }

  // Only intercept same-origin links
  if (targetUrl.origin !== window.location.origin) return;

  // If clicking on the exact current page with hash only
  if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && targetUrl.hash) {
    return;
  }

  // If already transiting, prevent double-trigger
  if (isTransiting) {
    e.preventDefault();
    return;
  }

  // Intercept and launch cricket stinger transition!
  e.preventDefault();
  triggerCricketTransition(targetUrl.href);
}

function triggerCricketTransition(destinationUrl) {
  if (!transitionOverlay) {
    transitionOverlay = createCricketTransitionDOM();
  }

  isTransiting = true;

  // Randomize speed gun & commentary for live match atmosphere
  const randomSpeed = (148.0 + Math.random() * 12.5).toFixed(1);
  const randomCall = COMMENTARY_CALLS[Math.floor(Math.random() * COMMENTARY_CALLS.length)];

  const speedEl = document.getElementById('csk-trans-speed');
  const callEl = document.getElementById('csk-trans-call');
  if (speedEl) speedEl.textContent = randomSpeed;
  if (callEl) callEl.textContent = randomCall;

  // Set session flag so incoming page knows to reveal smoothly
  try {
    sessionStorage.setItem('csk_page_transiting', 'true');
  } catch (err) {}

  // Trigger animations
  transitionOverlay.style.display = 'block';
  transitionOverlay.classList.remove('is-exiting');
  transitionOverlay.classList.add('is-active', 'is-entering');

  // Trigger cricket strike
  const batEl = document.getElementById('csk-trans-bat');
  const ballTrack = document.getElementById('csk-trans-ball-track');
  const zingEl = document.getElementById('csk-trans-zing');

  if (batEl) batEl.classList.add('is-striking');
  if (ballTrack) ballTrack.classList.add('is-flying');
  if (zingEl) {
    setTimeout(() => {
      zingEl.classList.add('is-bursting');
    }, 120);
  }

  // Navigate after snappy cricket stinger duration (340ms)
  setTimeout(() => {
    window.location.href = destinationUrl;
  }, 340);

  // Safety fallback in case navigation hangs
  setTimeout(() => {
    if (isTransiting) {
      isTransiting = false;
      playExitReveal();
    }
  }, 1200);
}

function playExitReveal() {
  if (!transitionOverlay) {
    transitionOverlay = createCricketTransitionDOM();
  }

  transitionOverlay.style.display = 'block';
  transitionOverlay.classList.remove('is-entering');
  transitionOverlay.classList.add('is-active', 'is-exiting');

  // Sweep shutters open and finish exit
  setTimeout(() => {
    transitionOverlay.classList.remove('is-active', 'is-exiting');
    transitionOverlay.style.display = 'none';
    isTransiting = false;

    // Reset element classes
    const batEl = document.getElementById('csk-trans-bat');
    const ballTrack = document.getElementById('csk-trans-ball-track');
    const zingEl = document.getElementById('csk-trans-zing');
    if (batEl) batEl.classList.remove('is-striking');
    if (ballTrack) ballTrack.classList.remove('is-flying');
    if (zingEl) zingEl.classList.remove('is-bursting');
  }, 280);
}

/**
 * ─────────────────────────────────────────────────────────────
 * CSK ARENA TECH BRANDED SPLASH & TRANSITION LOADER
 * Features dark blue arena backdrop, live status telemetry,
 * candy-striped capsule hazard bar, and sub-step checklist.
 * ─────────────────────────────────────────────────────────────
 */

const ARENA_SPLASH_TEMPLATE = `
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

    <!-- Arena Tech Loader (Exact Reference Match) -->
    <div class="csk-arena-loader">
      <div class="arena-loader-header">
        <span class="arena-loader-status" id="arena-loader-status">INITIALIZING SYSTEM...</span>
        <span class="arena-loader-pct tabular-nums" id="arena-loader-pct">0%</span>
      </div>

      <div class="arena-loader-track">
        <div class="arena-loader-fill" id="arena-loader-fill"></div>
      </div>

      <div class="arena-loader-steps">
        <span class="arena-step" id="arena-step-1"><span class="step-dot" id="step-dot-1">●</span> ASSETS VERIFIED</span>
        <span class="arena-step" id="arena-step-2"><span class="step-dot" id="step-dot-2">○</span> SYNCING ROSTER</span>
        <span class="arena-step" id="arena-step-3"><span class="step-dot" id="step-dot-3">○</span> CONNECTING ARENA</span>
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
    splash.innerHTML = ARENA_SPLASH_TEMPLATE;
    document.body.prepend(splash);
  } else {
    splash.innerHTML = ARENA_SPLASH_TEMPLATE;
  }

  const fillEl = document.getElementById('arena-loader-fill');
  const pctEl = document.getElementById('arena-loader-pct');
  const statusEl = document.getElementById('arena-loader-status');
  const step1 = document.getElementById('arena-step-1');
  const step2 = document.getElementById('arena-step-2');
  const step3 = document.getElementById('arena-step-3');
  const dot1 = document.getElementById('step-dot-1');
  const dot2 = document.getElementById('step-dot-2');
  const dot3 = document.getElementById('step-dot-3');

  let progress = 0;
  const durationMs = 800;
  const startTime = performance.now();

  function updateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / durationMs, 1);
    
    progress = Math.floor(rawProgress * 100);

    if (fillEl) fillEl.style.width = `${progress}%`;
    if (pctEl) pctEl.textContent = `${progress}%`;

    // Telemetry Status & Sub-step progression
    if (progress < 35) {
      if (statusEl) statusEl.textContent = 'LOADING ASSETS...';
      if (step1) step1.className = 'arena-step is-active';
      if (dot1) dot1.textContent = '●';
    } else if (progress < 75) {
      if (statusEl) statusEl.textContent = 'SYNCING ROSTER...';
      if (step1) step1.className = 'arena-step is-complete';
      if (step2) step2.className = 'arena-step is-active';
      if (dot2) dot2.textContent = '●';
    } else if (progress < 96) {
      if (statusEl) statusEl.textContent = 'CONNECTING ARENA...';
      if (step1) step1.className = 'arena-step is-complete';
      if (step2) step2.className = 'arena-step is-complete';
      if (step3) step3.className = 'arena-step is-active';
      if (dot3) dot3.textContent = '●';
    } else {
      if (statusEl) statusEl.textContent = 'WELCOME TO THE ARENA!';
      if (step1) step1.className = 'arena-step is-complete';
      if (step2) step2.className = 'arena-step is-complete';
      if (step3) step3.className = 'arena-step is-complete';
      if (dot3) dot3.textContent = '●';
    }

    if (rawProgress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(() => {
        splash.classList.add('is-hidden');
        splash.classList.remove('is-active');
        splash.setAttribute('aria-hidden', 'true');
      }, 150);
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







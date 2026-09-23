/**
 * ─────────────────────────────────────────────────────────────
 * CSK CRICKET POWERPLAY MATCHDAY SPLASH LOADER (CRICKET VIBES)
 * Features real English willow cricket bat, 22-yard turf pitch,
 * spinning cherry red leather ball with white stitched seam,
 * wooden LED Zing smart stumps, and live cricket commentary.
 * ─────────────────────────────────────────────────────────────
 */

export const ARENA_SPLASH_TEMPLATE = `
  <div class="csk-splash-screen__backdrop"></div>

  <div class="csk-splash-screen__content">
    <!-- Stadium Lion Crest & Cricket Seam Orbit -->
    <div class="csk-splash-screen__logo-wrap">
      <div class="csk-splash-seam-ring">
        <svg viewBox="0 0 160 160" class="seam-svg">
          <circle cx="80" cy="80" r="74" fill="none" stroke="rgba(56, 189, 248, 0.25)" stroke-width="1.5" />
          <circle cx="80" cy="80" r="74" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="6 8" class="seam-spin-circle" />
          <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(239, 68, 68, 0.6)" stroke-width="1.5" stroke-dasharray="4 6" class="seam-spin-reverse" />
        </svg>
      </div>
      <img src="assets/csk-official-logo.png?v=20260907_6" alt="Cayman Super Kings" class="csk-splash-screen__image">
    </div>

    <!-- Cricket Franchise Heading -->
    <div class="csk-splash-brand-wrap">
      <h1 class="csk-splash-brand-title">CAYMAN SUPER KINGS</h1>
      <div class="csk-splash-cricket-pill">
        <span class="cricket-live-beacon"></span>
        <span class="csk-splash-motto">🏏 MATCHDAY POWERPLAY // 22-YARD ARENA</span>
      </div>
    </div>

    <!-- 22-YARD CRICKET PITCH ARENA & BAT-BALL STRIKE LOADER (RIGHT TO LEFT ACTION) -->
    <div class="csk-cricket-pitch-loader">
      <!-- Top Scoreboard HUD: Speed Gun & Live Match Commentary -->
      <div class="pitch-loader-hud">
        <div class="pitch-commentary" id="arena-loader-status">🏏 BOWLER IN STRIDE... POLISHING LEATHER SEAM</div>
        <div class="pitch-speed-readout">
          <span class="speed-label">SPEED:</span>
          <span class="speed-val" id="arena-loader-speed">138.4</span> <span class="speed-unit">KM/H</span>
          <span class="pitch-pct tabular-nums" id="arena-loader-pct">0%</span>
        </div>
      </div>

      <!-- 22-Yard Stadium Pitch Corridor (Right-to-Left Bowling Action) -->
      <div class="pitch-corridor">
        <!-- Target at Left End: LED Zing Stumps -->
        <div class="pitch-stumps-target" id="pitch-stumps-target">
          <div class="zing-bails">
            <span class="bail-led bail-left"></span>
            <span class="bail-led bail-right"></span>
          </div>
          <div class="zing-wickets">
            <span class="wicket-led off-stump"></span>
            <span class="wicket-led middle-stump"></span>
            <span class="wicket-led leg-stump"></span>
          </div>
        </div>

        <!-- Striker's Batsman at Left End near Wickets -->
        <div class="pitch-bat-wrap" id="pitch-bat-wrap">
          <svg viewBox="0 0 32 64" class="cricket-bat-svg" width="24" height="48">
            <!-- Rubber Grip Handle -->
            <rect x="14" y="2" width="4" height="18" rx="2" fill="#E2E8F0" stroke="#0F172A" stroke-width="1" />
            <line x1="14" y1="6" x2="18" y2="6" stroke="#EF4444" stroke-width="1.2" />
            <line x1="14" y1="10" x2="18" y2="10" stroke="#EF4444" stroke-width="1.2" />
            <line x1="14" y1="14" x2="18" y2="14" stroke="#EF4444" stroke-width="1.2" />
            <!-- English Willow Blade with Wood Grain -->
            <path d="M12 20 L20 20 L21 54 C21 58 19 60 16 60 C13 60 11 58 11 54 Z" fill="#FBBF24" stroke="#D97706" stroke-width="1" />
            <!-- CSK Flame Accent on Blade -->
            <path d="M14 26 L18 26 L17 44 L15 44 Z" fill="#EF4444" />
          </svg>
        </div>

        <!-- Striker Crease Mark at Left -->
        <div class="pitch-crease-mark pitch-crease--striker">
          <span class="crease-label">STRIKER</span>
        </div>
        
        <!-- 22-Yard Turf Surface Track (Green Grass Gradient) -->
        <div class="pitch-mat">
          <!-- Pitch Grass Texture Stripes -->
          <div class="pitch-turf-stripes"></div>
          
          <!-- Hawk-Eye Trajectory Trail (Fills from Right to Left) -->
          <div class="pitch-fill-trail" id="arena-loader-fill"></div>
          
          <!-- High Velocity Moving Red Leather Cricket Ball (Right to Left) -->
          <div class="pitch-ball-runner" id="pitch-ball-runner">
            <div class="ball-heat-tail"></div>
            <div class="pitch-cricket-ball">
              <span class="seam-stitch"></span>
            </div>
          </div>
        </div>

        <!-- Bowler Crease Mark at Right -->
        <div class="pitch-crease-mark pitch-crease--bowler">
          <span class="crease-label">BOWLER</span>
        </div>

        <!-- Explosive Impact Flash Badge (Triggers on Wicket Hit at Left) -->
        <div class="pitch-impact-burst" id="pitch-impact-burst">
          <span>⚡ TIMBER! CLEAN BOWLED!</span>
        </div>
      </div>

      <!-- Matchday Status Sub-steps -->
      <div class="arena-loader-steps">
        <span class="arena-step is-active" id="arena-step-1"><span class="step-dot" id="step-dot-1">●</span> 🏏 LEATHER SEAM</span>
        <span class="arena-step" id="arena-step-2"><span class="step-dot" id="step-dot-2">○</span> 📐 HAWK-EYE READY</span>
        <span class="arena-step" id="arena-step-3"><span class="step-dot" id="step-dot-3">○</span> 🏟️ FORTRESS LIT</span>
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
  const ballRunner = document.getElementById('pitch-ball-runner');
  const batWrap = document.getElementById('pitch-bat-wrap');
  const stumpsTarget = document.getElementById('pitch-stumps-target');
  const impactBurst = document.getElementById('pitch-impact-burst');
  const pctEl = document.getElementById('arena-loader-pct');
  const speedEl = document.getElementById('arena-loader-speed');
  const statusEl = document.getElementById('arena-loader-status');
  const step1 = document.getElementById('arena-step-1');
  const step2 = document.getElementById('arena-step-2');
  const step3 = document.getElementById('arena-step-3');
  const dot1 = document.getElementById('step-dot-1');
  const dot2 = document.getElementById('step-dot-2');
  const dot3 = document.getElementById('step-dot-3');

  let isDismissed = false;
  function dismissSplash() {
    if (isDismissed) return;
    isDismissed = true;
    splash.classList.add('is-hidden');
    splash.classList.remove('is-active');
    splash.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (splash.parentNode) {
        splash.style.display = 'none';
      }
    }, 450);
  }

  // Click anywhere to skip instantly
  splash.addEventListener('click', dismissSplash);

  let progress = 0;
  const durationMs = 1250;
  const startTime = performance.now();

  function updateProgress(currentTime) {
    if (isDismissed) return;

    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / durationMs, 1);
    
    progress = Math.floor(rawProgress * 100);

    // Update trail fill and cricket ball position straight from RIGHT to LEFT into the wickets
    const ballPos = (rawProgress * 100).toFixed(1);
    if (fillEl) fillEl.style.width = `${ballPos}%`;
    if (ballRunner) {
      ballRunner.style.right = `calc(${ballPos}% - 4px)`;
      ballRunner.style.left = 'auto';
    }
    if (pctEl) pctEl.textContent = `${progress}%`;

    // Dynamic speed gun calculation (136.5 km/h -> 156.8 km/h)
    const currentSpeed = (136.5 + rawProgress * 20.3).toFixed(1);
    if (speedEl) speedEl.textContent = currentSpeed;

    // Bat swing backlift dynamics
    if (batWrap) {
      if (progress > 35 && progress < 80) {
        batWrap.classList.add('is-swinging');
      } else if (progress >= 80) {
        batWrap.classList.add('is-followthrough');
      }
    }

    // Cricket matchday bowling trajectory & wicket hit progression (Right to Left)
    if (progress < 28) {
      if (statusEl) statusEl.innerHTML = '🏏 BOWLER IN STRIDE... POLISHING LEATHER SEAM';
      if (step1) step1.className = 'arena-step is-active';
      if (dot1) dot1.textContent = '●';
    } else if (progress < 60) {
      if (statusEl) statusEl.innerHTML = '⚡ 154 KM/H IN-SWINGING YORKER DOWN THE CORRIDOR...';
      if (step1) step1.className = 'arena-step is-complete';
      if (step2) step2.className = 'arena-step is-active';
      if (dot2) dot2.textContent = '●';
    } else if (progress < 86) {
      if (statusEl) statusEl.innerHTML = '🎯 ROCKET TRAJECTORY DIRECTLY AT MIDDLE STUMP!';
      if (step1) step1.className = 'arena-step is-complete';
      if (step2) step2.className = 'arena-step is-complete';
      if (step3) step3.className = 'arena-step is-active';
      if (dot3) dot3.textContent = '●';
    } else {
      // 86% - 100%: BALL SMASHES THE WICKETS ON THE LEFT
      if (statusEl) statusEl.innerHTML = '💥 TIMBER! CLEAN BOWLED! 156.8 KM/H WICKET!';
      if (step1) step1.className = 'arena-step is-complete';
      if (step2) step2.className = 'arena-step is-complete';
      if (step3) step3.className = 'arena-step is-complete';
      if (dot3) dot3.textContent = '●';
      if (stumpsTarget) stumpsTarget.classList.add('is-hit');
      if (impactBurst) impactBurst.classList.add('is-visible');
    }

    if (rawProgress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      // Hold bowled celebration for 420ms so the user enjoys the shattering wicket impact
      setTimeout(dismissSplash, 420);
    }
  }

  requestAnimationFrame(updateProgress);

  // Fallback safety timeout
  setTimeout(dismissSplash, 2100);

  // Handle browser back/forward history cache (pageshow)
  window.addEventListener('pageshow', (event) => {
    dismissSplash();
  });
}

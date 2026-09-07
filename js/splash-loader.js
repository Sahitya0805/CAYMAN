/**
 * ─────────────────────────────────────────────────────────────
 * CSK ULTRA-DYNAMIC CRAZY STADIUM SPLASH LOADER
 * High-octane particle canvas, glowing crest shockwaves,
 * live digital percentage charge, and seamless transition.
 * ─────────────────────────────────────────────────────────────
 */

const SPLASH_TEMPLATE = `
  <canvas id="csk-splash-canvas" class="csk-splash-canvas"></canvas>
  <div class="csk-splash-screen__sunburst"></div>
  <div class="csk-splash-screen__backdrop"></div>
  <div class="csk-splash-screen__content">
    <!-- Concentric Shockwave Rings -->
    <div class="csk-splash-rings" aria-hidden="true">
      <div class="csk-splash-ring csk-splash-ring--1"></div>
      <div class="csk-splash-ring csk-splash-ring--2"></div>
      <div class="csk-splash-ring csk-splash-ring--3"></div>
    </div>

    <!-- 3D Floating Crest -->
    <div class="csk-splash-screen__logo-wrap">
      <div class="csk-splash-crest-glow"></div>
      <img src="assets/csk-official-logo.png" alt="Cayman Super Kings Crest" class="csk-splash-screen__image">
    </div>

    <!-- Shimmer Brand Title & Motto -->
    <div class="csk-splash-brand-wrap">
      <h1 class="csk-splash-brand-title">CAYMAN SUPER KINGS</h1>
      <div class="csk-splash-motto-row">
        <span class="splash-star">★</span>
        <span class="csk-splash-motto">WHISTLE PODU • THE PRIDE OF CAYMAN</span>
        <span class="splash-star">★</span>
      </div>
    </div>

    <!-- Tactical Live HUD Progress & Laser Bar -->
    <div class="csk-splash-screen__loader-wrap">
      <div class="csk-splash-status-row">
        <span class="csk-splash-status-text" id="csk-splash-status">⚡ IGNITING THE LION'S ROAR...</span>
        <span class="csk-splash-pct tabular-nums" id="csk-splash-pct">0%</span>
      </div>
      <div class="csk-splash-screen__progress">
        <div class="csk-splash-screen__bar" id="csk-splash-bar">
          <span class="csk-splash-ball-spark"></span>
        </div>
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
    splash.innerHTML = SPLASH_TEMPLATE;
    document.body.prepend(splash);
  } else {
    // Refresh innerHTML to ensure crazy template is active
    splash.innerHTML = SPLASH_TEMPLATE;
  }

  // Start Particle Spark System
  const cancelParticles = initSparkCanvas();

  // Start Progress Animation
  const statusEl = document.getElementById('csk-splash-status');
  const pctEl = document.getElementById('csk-splash-pct');
  const barEl = document.getElementById('csk-splash-bar');

  const statusPhases = [
    { max: 25, text: '⚡ IGNITING THE LION\'S ROAR...' },
    { max: 55, text: '🏏 POWERING UP MATCH ENGINE...' },
    { max: 80, text: '✨ CHARGING STADIUM FLOODLIGHTS...' },
    { max: 96, text: '🦁 UNLEASHING THE CHAMPIONS!' },
    { max: 100, text: '🔥 WHISTLE PODU!' }
  ];

  let progress = 0;
  const durationMs = 950;
  const startTime = performance.now();

  function updateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / durationMs, 1);
    
    // Smooth ease-out quad curve
    progress = Math.floor(rawProgress * 100);

    if (barEl) barEl.style.width = `${progress}%`;
    if (pctEl) pctEl.textContent = `${progress}%`;

    if (statusEl) {
      const currentPhase = statusPhases.find(p => progress <= p.max) || statusPhases[statusPhases.length - 1];
      if (statusEl.textContent !== currentPhase.text) {
        statusEl.textContent = currentPhase.text;
      }
    }

    if (rawProgress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      // Completed - brief hold for maximum impact then smooth dismissal
      setTimeout(() => {
        splash.classList.add('is-hidden');
        splash.classList.remove('is-active');
        splash.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          cancelParticles();
        }, 600);
      }, 160);
    }
  }

  requestAnimationFrame(updateProgress);

  // Handle browser back/forward history cache (pageshow)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      splash.classList.add('is-hidden');
      splash.classList.remove('is-active');
      splash.setAttribute('aria-hidden', 'true');
      cancelParticles();
    }
  });
}

function initSparkCanvas() {
  const canvas = document.getElementById('csk-splash-canvas');
  if (!canvas) return () => {};

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let isRunning = true;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = ['#FAB81E', '#F2600C', '#FFFFFF', '#FFF2A1', '#00D2FF'];
  const particleCount = 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: -(Math.random() * 2 + 0.8),
      vx: (Math.random() - 0.5) * 0.9,
      alpha: Math.random() * 0.8 + 0.2,
      fadeSpeed: Math.random() * 0.015 + 0.005
    });
  }

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.vy;
      p.x += p.vx;
      p.alpha += Math.sin(Date.now() * 0.005 + i) * 0.02;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
        p.alpha = Math.random() * 0.8 + 0.2;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    animationId = requestAnimationFrame(render);
  }

  render();

  return () => {
    isRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resizeCanvas);
  };
}



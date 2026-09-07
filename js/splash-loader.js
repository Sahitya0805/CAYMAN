/**
 * ─────────────────────────────────────────────────────────────
 * CSK PROFESSIONAL ATTRACTIVE BRANDED SPLASH LOADER
 * Displays official crest with golden aura, ambient spark particles,
 * and high-precision candy-striped loading progress bar.
 * ─────────────────────────────────────────────────────────────
 */

const PROFESSIONAL_SPLASH_TEMPLATE = `
  <canvas id="csk-splash-canvas" class="csk-splash-canvas"></canvas>
  <div class="csk-splash-screen__backdrop"></div>
  <div class="csk-splash-screen__content">
    <!-- Official Crest with Ambient Glow -->
    <div class="csk-splash-screen__logo-wrap">
      <div class="csk-splash-crest-glow"></div>
      <img src="assets/csk-official-logo.png" alt="Cayman Super Kings" class="csk-splash-screen__image">
    </div>

    <!-- Professional Brand Heading -->
    <div class="csk-splash-brand-wrap">
      <h1 class="csk-splash-brand-title">CAYMAN SUPER KINGS</h1>
      <div class="csk-splash-motto-row">
        <span class="splash-star">★</span>
        <p class="csk-splash-motto">ONE TEAM • ONE DREAM</p>
        <span class="splash-star">★</span>
      </div>
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

  const cancelParticles = initSparkCanvas();
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
        setTimeout(() => {
          cancelParticles();
        }, 500);
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

  const colors = ['#FAB81E', '#F2600C', '#FFFFFF', '#FFF4B8'];
  const particleCount = 28;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: -(Math.random() * 1.5 + 0.5),
      vx: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.7 + 0.3
    });
  }

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y += p.vy;
      p.x += p.vx;
      p.alpha += Math.sin(Date.now() * 0.004 + i) * 0.015;

      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
        p.alpha = Math.random() * 0.7 + 0.3;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
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





/**
 * ─────────────────────────────────────────────────────────────
 * CRICKET BACKGROUND VIDEO & CINEMATIC EMERALD STADIUM ENGINE
 * ─────────────────────────────────────────────────────────────
 * Provides high-energy looping background video stream +
 * real-time dynamic cinematic stadium atmospheric lighting,
 * particle spark trails, and cricket action visual enhancements.
 */

export function initCricketVideoBackground() {
  const videoWrapper = document.getElementById('hero-video-container');
  if (!videoWrapper) return;

  // Insert High-Energy HTML5 Video Player
  videoWrapper.innerHTML = `
    <div class="video-bg-layer">
      <video id="cricket-bg-video" autoplay muted loop playsinline poster="assets/placeholders/hero-team.svg">
        <!-- High Quality MP4 Cricket Visual Streams with fallbacks -->
        <source src="https://assets.mixkit.co/videos/preview/mixkit-cricket-player-hitting-a-ball-with-his-bat-42171-large.mp4" type="video/mp4">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-cricket-batsman-hitting-the-ball-42170-large.mp4" type="video/mp4">
      </video>
      <div class="video-overlay-emerald"></div>
      <div class="video-grid-mesh"></div>
      <canvas id="stadium-canvas" class="stadium-canvas"></canvas>
    </div>
    <div class="video-controls-bar">
      <button id="video-toggle-btn" class="btn-video-toggle" aria-label="Pause Background Video">
        <span class="video-icon">⏸</span> <span class="video-label">LIVE STADIUM FEED</span>
      </button>
    </div>
  `;

  const video = document.getElementById('cricket-bg-video');
  const toggleBtn = document.getElementById('video-toggle-btn');
  const icon = toggleBtn?.querySelector('.video-icon');

  if (video && toggleBtn) {
    // Ensure autoplay works
    video.play().catch(() => {
      console.log('Video autoplay prevented; user can toggle manually.');
    });

    toggleBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        if (icon) icon.textContent = '⏸';
        toggleBtn.classList.remove('paused');
      } else {
        video.pause();
        if (icon) icon.textContent = '▶';
        toggleBtn.classList.add('paused');
      }
    });
  }

  // Init Dynamic Stadium Particle & Floodlight Canvas
  initStadiumCanvas();
}

function initStadiumCanvas() {
  const canvas = document.getElementById('stadium-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || 600;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles: Cricket energy orbs (Emerald & Electric Yellow)
  const particles = [];
  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.5 + 1,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 0.8 - 0.2,
      color: Math.random() > 0.4 ? 'rgba(0, 245, 212, ' : 'rgba(255, 230, 0, ',
      alpha: Math.random() * 0.7 + 0.3
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw Stadium Floodlight Atmospheric Beams
    const grad1 = ctx.createRadialGradient(width * 0.85, 0, 10, width * 0.85, 0, width * 0.6);
    grad1.addColorStop(0, 'rgba(0, 245, 212, 0.15)');
    grad1.addColorStop(0.5, 'rgba(6, 36, 46, 0.05)');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, width, height);

    const grad2 = ctx.createRadialGradient(width * 0.15, height * 0.2, 10, width * 0.15, height * 0.2, width * 0.5);
    grad2.addColorStop(0, 'rgba(255, 230, 0, 0.12)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, width, height);

    // Render floating energy particles
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color.includes('245') ? '#00F5D4' : '#FFE600';
      ctx.fill();
    });

    animationFrame = requestAnimationFrame(animate);
  }

  animate();
}

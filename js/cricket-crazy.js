/**
 * ─────────────────────────────────────────────────────────────
 * CSK CRAZY CRICKET ATMOSPHERE & INTERACTIVE ENGINE
 * - Floating Stadium Matchday Sparks Canvas
 * - Web Audio Stadium Whistle / Crowd Cheer Synthesizer
 * - Interactive "Tap to Roar for CSK" Fan Celebration
 * - Live Match Countdown Clock
 * - Interactive 3D Hero Tilt Parallax
 * - Animated Championship Stats Counter
 * ─────────────────────────────────────────────────────────────
 */

export function initCricketCrazy() {
  initHeroSparksCanvas();
  initHeroParallax();
  initRoarButton();
  initMatchCountdown();
  initStatsCounter();
}

/**
 * 1. FLOATING STADIUM SPARK PARTICLES (Lightweight 60fps Canvas)
 */
function initHeroSparksCanvas() {
  const canvas = document.getElementById('csk-hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  const particles = [];
  const particleCount = Math.min(36, Math.floor(width / 35));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      hue: Math.random() > 0.4 ? '#FAB81E' : '#FFFFFF',
      pulse: Math.random() * 0.05
    });
  }

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', resize);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.opacity += Math.sin(Date.now() * p.pulse) * 0.01;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(0.9, p.opacity));
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.hue;
      ctx.fillStyle = p.hue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/**
 * 2. INTERACTIVE 3D HERO MOUSE PARALLAX
 */
function initHeroParallax() {
  const hero = document.querySelector('.hero-single-section');
  const content = document.querySelector('.hero-single__content');
  if (!hero || !content || window.innerWidth < 992) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    content.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg) translateZ(10px)`;
  });

  hero.addEventListener('mouseleave', () => {
    content.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  });
}

/**
 * 3. INTERACTIVE FAN ROAR BUTTON & CELEBRATION
 */
function initRoarButton() {
  const roarBtn = document.getElementById('hero-roar-btn');
  const countBadge = document.getElementById('hero-roar-count');
  if (!roarBtn) return;

  // Initial count
  let roars = parseInt(localStorage.getItem('csk_fan_roars') || '14892', 10);
  if (countBadge) countBadge.textContent = `${(roars / 1000).toFixed(1)}K`;

  roarBtn.addEventListener('click', (e) => {
    e.preventDefault();
    roars += 1;
    localStorage.setItem('csk_fan_roars', roars);
    if (countBadge) countBadge.textContent = `${(roars / 1000).toFixed(1)}K`;

    // Button animation
    roarBtn.classList.add('roar-active');
    setTimeout(() => roarBtn.classList.remove('roar-active'), 600);

    // Play Whistle Podu audio synth
    playWhistleSound();

    // Trigger Spark / Confetti explosion
    createCelebrationSparks(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);

    // Display temporary celebratory toast
    showRoarToast();
  });
}

/**
 * Web Audio API synthesized cricket whistle sound effect
 */
function playWhistleSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;

    // Pitch sweep (signature stadium whistle bend)
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(1700, now + 0.28);
    osc.frequency.exponentialRampToValueAtTime(2500, now + 0.42);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.58);
  } catch (err) {
    // Audio contexts blocked until user interaction
  }
}

/**
 * Confetti & Spark Burst across screen
 */
function createCelebrationSparks(originX, originY) {
  const container = document.createElement('div');
  container.className = 'csk-confetti-container';
  document.body.appendChild(container);

  const colors = ['#FAB81E', '#FFE082', '#FFFFFF', '#0B2C62', '#FF6B00'];
  const count = 35;

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'csk-confetti-piece';

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
    const velocity = Math.random() * 180 + 80;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity - 60;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 6;

    spark.style.cssText = `
      position: fixed;
      left: ${originX}px;
      top: ${originY}px;
      width: ${size}px;
      height: ${size * (Math.random() > 0.5 ? 1 : 2)}px;
      background: ${color};
      border-radius: 2px;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 0 10px ${color};
      transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg);
      transition: transform 0.85s cubic-bezier(0.12, 0.8, 0.32, 1), opacity 0.85s ease;
    `;

    container.appendChild(spark);

    requestAnimationFrame(() => {
      spark.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${Math.random() * 720}deg) scale(${Math.random() * 0.5 + 0.5})`;
      spark.style.opacity = '0';
    });
  }

  setTimeout(() => container.remove(), 950);
}

function showRoarToast() {
  let toast = document.querySelector('.csk-roar-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'csk-roar-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>🦁</span> <strong>WHISTLE PODU!</strong> <span>Your roar joined the Yellow Army!</span>`;
  toast.classList.add('is-visible');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2600);
}

/**
 * 4. LIVE MATCH COUNTDOWN CLOCK
 */
function initMatchCountdown() {
  const cdContainer = document.getElementById('match-countdown');
  if (!cdContainer) return;

  const targetDateStr = cdContainer.getAttribute('data-target') || '2026-09-20T18:00:00-05:00';
  const targetDate = new Date(targetDateStr).getTime();

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMins = document.getElementById('cd-mins');
  const elSecs = document.getElementById('cd-secs');

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(mins).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/**
 * 5. ANIMATED STATS COUNTER ON SCROLL
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-ticker-num');
  if (!statNumbers.length) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNumbers.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-count'));
            if (isNaN(target)) return;

            const isDecimal = String(target).includes('.');
            const isSuffixK = el.textContent.includes('K');
            const isPercent = el.textContent.includes('%');
            const isMultiplier = el.textContent.includes('x');

            let current = 0;
            const duration = 1400;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }

              let display = isDecimal ? current.toFixed(1) : Math.floor(current);
              if (isSuffixK) display = `${(current / 1000).toFixed(0)}K+`;
              else if (isPercent) display = `${display}%`;
              else if (isMultiplier) display = `${display}x`;

              el.textContent = display;
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  const container = document.querySelector('.championship-stats-ticker');
  if (container) observer.observe(container);
}

/**
 * ─────────────────────────────────────────────────────────────
 * ADVANCED FUTURISTIC CYBER HUD & ANIMATIONS ENGINE
 * Interactive 3D tilt, cyber scroll laser, holographic specular glare,
 * digital text decryption, magnetic ripples, and live telemetry.
 * ─────────────────────────────────────────────────────────────
 */

export function initFuturisticSystem() {
  initCyberScrollProgress();
  initCyberScrollReveals();
  initTiltPhysics();
  initCyberMouseSpotlight();
  initTextDecryptionScramble();
  initCyberShockwaveRipples();
  initLiveTelemetryHUD();
  initTelemetryCounters();
}

/**
 * 1. Cyber Scroll Laser Progress Indicator (Top Telemetry Beam)
 */
function initCyberScrollProgress() {
  if (document.getElementById('cyber-scroll-laser')) return;

  const beam = document.createElement('div');
  beam.id = 'cyber-scroll-laser';
  beam.className = 'cyber-scroll-laser';
  beam.innerHTML = '<span class="cyber-scroll-laser-tip"></span>';
  document.body.appendChild(beam);

  function updateScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    beam.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}

/**
 * 2. High-performance 3D Tilt Physics with Specular Lighting
 */
function initTiltPhysics() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cards = document.querySelectorAll(
    '.fixture-ticket, .roster-stage-card, .squad-player-stage-card, .sponsor-card, .tier-card, .card-delivers-centerpiece, .card-funds-transparency'
  );

  cards.forEach(card => {
    let isHovered = false;

    card.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    card.addEventListener('mousemove', (e) => {
      if (!isHovered) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
      const rotateY = ((x - centerX) / centerX) * 6;  // max 6deg

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      
      // Update specular spotlight position variables
      card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      card.style.transform = '';
      card.style.removeProperty('--mouse-x');
      card.style.removeProperty('--mouse-y');
    });
  });
}

/**
 * 3. Cyber Mouse Spotlight (Dynamic Specular Illumination)
 */
function initCyberMouseSpotlight() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const spotlightElements = document.querySelectorAll('.roster-grid, .squad-stage-grid, .tiers-grid, .fixtures-ticket-grid');
  
  spotlightElements.forEach(grid => {
    grid.addEventListener('mousemove', (e) => {
      const cards = grid.querySelectorAll('.squad-player-stage-card, .tier-card, .fixture-ticket');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  });
}

/**
 * 4. Digital Matrix Text Decryption (Cyber Scramble Effect)
 */
function initTextDecryptionScramble() {
  const titles = document.querySelectorAll(
    '.section-title, .journey-book-title, .tiers-section-title, .cta-heading, .centerpiece-title'
  );
  if (titles.length === 0) return;

  const glyphs = '01#$%=+*&<>Δ⚡';

  function scramble(el) {
    if (el.dataset.scrambled) return;
    el.dataset.scrambled = 'true';

    const originalText = el.textContent.trim();
    const length = originalText.length;
    let iteration = 0;
    const maxIterations = 14;

    const interval = setInterval(() => {
      el.textContent = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '\n' || char === '\t') return char;
          if (index < (iteration / maxIterations) * length) {
            return originalText[index];
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      iteration++;
      if (iteration > maxIterations) {
        clearInterval(interval);
        el.textContent = originalText;
      }
    }, 35);
  }

  if (!('IntersectionObserver' in window)) {
    titles.forEach(scramble);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scramble(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  titles.forEach(t => observer.observe(t));
}

/**
 * 5. Interactive Click Ripple Shockwave (Stadium Energy Wave)
 */
function initCyberShockwaveRipples() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(
      '.btn, .btn-primary, .btn-sponsor-primary, .squad-explore-redirect-btn, .filter-pill, .squad-filter-btn, .footer-action-btn, .hud-read-more-link'
    );
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'cyber-shockwave';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    // Ensure trigger has relative positioning and overflow hidden
    const prevPosition = window.getComputedStyle(trigger).position;
    if (prevPosition === 'static') {
      trigger.style.position = 'relative';
    }
    trigger.style.overflow = 'hidden';

    trigger.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}

/**
 * 6. Live Telemetry HUD Chip (Arena Telemetry Status)
 */
function initLiveTelemetryHUD() {
  if (document.getElementById('cyber-telemetry-chip')) return;

  const chip = document.createElement('div');
  chip.id = 'cyber-telemetry-chip';
  chip.className = 'cyber-telemetry-chip';
  chip.innerHTML = `
    <span class="live-radar-dot" style="width: 8px; height: 8px; background: #38BDF8; box-shadow: 0 0 8px #38BDF8;"></span>
    <span>ARENA HUD // 22-YARD SYS ONLINE</span>
  `;
  document.body.appendChild(chip);
}

/**
 * 7. Cyber Stagger Scroll Reveal using IntersectionObserver
 */
function initCyberScrollReveals() {
  const elements = document.querySelectorAll('.section, .section-title, .fixture-ticket, .roster-stage-card, .card, .csk-album-card');
  
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, idx * 40);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => {
    el.classList.add('cyber-reveal');
    observer.observe(el);
  });
}

/**
 * 8. Telemetry Number Counters
 */
function initTelemetryCounters() {
  const counters = document.querySelectorAll('.stat-item__value, .club-stat-pill strong, .lead-stat-num');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));

  function animateValue(el) {
    const text = el.textContent.trim();
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num) || num === 0) return;

    const prefix = text.startsWith('+') ? '+' : (text.startsWith('$') ? '$' : '');
    const suffix = text.endsWith('%') ? '%' : (text.endsWith('+') ? '+' : '');
    const duration = 1200;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(ease * num);

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = text;
      }
    }

    requestAnimationFrame(step);
  }
}

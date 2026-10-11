/**
 * ─────────────────────────────────────────────────────────────
 * FUTURISTIC HUD & ANIMATIONS MODULE
 * Interactive 3D tilt, cyber scroll reveals, and telemetry effects
 * ─────────────────────────────────────────────────────────────
 */

export function initFuturisticSystem() {
  initCyberScrollReveals();
  initTiltPhysics();
  initTelemetryCounters();
  initMobileNavEnhancements();
}

/**
 * High-performance 3D Tilt Physics with specular lighting
 */
function initTiltPhysics() {
  // Only apply tilt on pointer-capable devices (not touch screens)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cards = document.querySelectorAll('.fixture-ticket, .roster-stage-card, .squad-player-stage-card, .sponsor-card');
    
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

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        card.style.transform = '';
      });
    });
  }
}

/**
 * Cyber Stagger Scroll Reveal using IntersectionObserver
 */
function initCyberScrollReveals() {
  const elements = document.querySelectorAll('.section, .section-title, .fixture-ticket, .roster-stage-card, .card, .site-header');
  
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Add subtle staggered delay for siblings
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
 * Telemetry Number Counters
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
      // Ease out cubic
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

/**
 * Mobile Navigation Backdrop Scrim
 */
function initMobileNavEnhancements() {
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  backdrop.addEventListener('click', () => {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');
    if (menu && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
      }
      document.body.classList.remove('nav-open');
    }
  });
}

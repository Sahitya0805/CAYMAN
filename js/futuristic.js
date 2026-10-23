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

  // Next-Gen Cyber Motion Additions (Additive without changing existing ones)
  initCyberCursorReticle();
  initCyberTargetingCorners();
  initCyberWarpDrive();
  initMagneticButtons();
  initStadiumFloodlights();

  // Dynamic observer for dynamically rendered squad, match, and detail pages
  const dynamicContainers = document.querySelectorAll('#squad-grid, .roster-grid, #matches-grid-container, #player-profile-content, #match-detail-content, #gallery-grid');
  dynamicContainers.forEach(c => {
    const obs = new MutationObserver(() => {
      initCyberTargetingCorners();
      initTiltPhysics();
      initStadiumFloodlights();
    });
    obs.observe(c, { childList: true });
  });
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
    <span class="cyber-audio-eq" title="Live Broadcast Telemetry Feed">
      <span class="eq-bar"></span>
      <span class="eq-bar"></span>
      <span class="eq-bar"></span>
      <span class="eq-bar"></span>
    </span>
  `;
  document.body.appendChild(chip);
}

/**
 * 7. Cyber Stagger Scroll Reveal using IntersectionObserver
 */
function initCyberScrollReveals() {
  const selectors = [
    'section',
    '.section',
    '.section-head',
    '.section-title',
    '.section-subtitle',
    '.youth-photo-card',
    '.youth-cohort-card',
    '.squad-player-stage-card',
    '.fixture-ticket',
    '.roster-stage-card',
    '.card',
    '.csk-album-card',
    '.tier-card',
    '.sponsor-card',
    '.about-feature-card',
    '.history-milestone-card',
    '.timeline-item',
    '.sponsors-hero-title',
    '.centerpiece-title'
  ].join(', ');

  const elements = document.querySelectorAll(selectors);
  
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
    // threshold 0: tall sections (e.g. the squad grid on phones) can never
    // have 8% of their height on screen at once, so they would never reveal
    threshold: 0,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => {
    if (!el.classList.contains('cyber-reveal')) {
      el.classList.add('cyber-reveal');
    }
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

/**
 * 9. Cyber Plasma Photon Cursor Aura (Desktop Holographic Reticle Follower)
 */
function initCyberCursorReticle() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (document.getElementById('cyber-cursor-follower')) return;

  const follower = document.createElement('div');
  follower.id = 'cyber-cursor-follower';
  follower.className = 'cyber-cursor-follower';
  follower.innerHTML = `
    <div class="cyber-cursor-ring"></div>
    <div class="cyber-cursor-dot"></div>
  `;
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    follower.style.opacity = '1';
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .fixture-ticket, .squad-player-stage-card, .tier-card, input, select, .filter-pill, .filter-group')) {
      follower.classList.add('is-hovering');
    } else {
      follower.classList.remove('is-hovering');
    }
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    follower.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

/**
 * 10. Cyber Targeting Brackets (Sci-Fi Corner Reticles on Cards)
 */
function initCyberTargetingCorners() {
  const targetCards = document.querySelectorAll(
    '.fixture-ticket, .squad-player-stage-card, .tier-card, .roster-stage-card'
  );

  targetCards.forEach(card => {
    if (card.querySelector('.cyber-reticle-bracket')) return;

    const bTL = document.createElement('span');
    bTL.className = 'cyber-reticle-bracket bracket-tl';
    const bTR = document.createElement('span');
    bTR.className = 'cyber-reticle-bracket bracket-tr';
    const bBL = document.createElement('span');
    bBL.className = 'cyber-reticle-bracket bracket-bl';
    const bBR = document.createElement('span');
    bBR.className = 'cyber-reticle-bracket bracket-br';

    card.appendChild(bTL);
    card.appendChild(bTR);
    card.appendChild(bBL);
    card.appendChild(bBR);
  });
}

/**
 * 11. Cyber Warp Velocity Streaks (Rapid Scroll Hyperdrive Particles)
 */
function initCyberWarpDrive() {
  if (document.getElementById('cyber-warp-canvas')) return;

  const warpWrap = document.createElement('div');
  warpWrap.id = 'cyber-warp-canvas';
  warpWrap.className = 'cyber-warp-canvas';
  warpWrap.innerHTML = `
    <div class="warp-line warp-left"></div>
    <div class="warp-line warp-right"></div>
  `;
  document.body.appendChild(warpWrap);

  let lastScrollY = window.scrollY;
  let scrollTimeout = null;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const velocity = Math.abs(currentScrollY - lastScrollY);
    lastScrollY = currentScrollY;

    if (velocity > 32) {
      warpWrap.classList.add('is-warping');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        warpWrap.classList.remove('is-warping');
      }, 180);
    }
  }, { passive: true });
}

/**
 * 12. Interactive Magnetic Physics on Core Interactive Controls
 */
function initMagneticButtons() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const magneticTargets = document.querySelectorAll(
    '.btn-primary, .btn-sponsor-primary, .btn-live-sync, .ticket-btn-pill, .squad-explore-redirect-btn'
  );

  magneticTargets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/**
 * 13. IPL / SRH Style 5-Bulb Diagonal Stadium Floodlight Rigs
 */
export function getStadiumFloodlightRigHTML(uid = 'csk-fl') {
  const bankSVG = (side) => {
    const id = `${uid}-${side}`;
    return `
      <svg class="csk-stadium-bank csk-stadium-bank--${side}" viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="${id}-beam-1" x1="106" y1="18" x2="365" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
            <stop offset="28%" stop-color="#FFFFFF" stop-opacity="0.55" />
            <stop offset="68%" stop-color="#E0F2FE" stop-opacity="0.16" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${id}-beam-2" x1="82" y1="42" x2="325" y2="164" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
            <stop offset="28%" stop-color="#FFFFFF" stop-opacity="0.55" />
            <stop offset="68%" stop-color="#E0F2FE" stop-opacity="0.16" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${id}-beam-3" x1="58" y1="66" x2="282" y2="198" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
            <stop offset="28%" stop-color="#FFFFFF" stop-opacity="0.55" />
            <stop offset="68%" stop-color="#E0F2FE" stop-opacity="0.16" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${id}-beam-4" x1="34" y1="90" x2="236" y2="232" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
            <stop offset="28%" stop-color="#FFFFFF" stop-opacity="0.52" />
            <stop offset="68%" stop-color="#E0F2FE" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="${id}-beam-5" x1="10" y1="114" x2="185" y2="264" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
            <stop offset="28%" stop-color="#FFFFFF" stop-opacity="0.50" />
            <stop offset="68%" stop-color="#E0F2FE" stop-opacity="0.14" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </linearGradient>
          <radialGradient id="${id}-haze" cx="0.22" cy="0.26" r="0.65">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32" />
            <stop offset="45%" stop-color="#BAE6FD" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
          </radialGradient>
          <filter id="${id}-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5.5" />
          </filter>
          <filter id="${id}-blur-core" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id="${id}-bulb-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Ambient Volumetric Stadium Haze -->
        <ellipse cx="145" cy="110" rx="165" ry="110" fill="url(#${id}-haze)" />

        <!-- Outer Soft Volumetric Light Cones -->
        <g filter="url(#${id}-blur-soft)">
          <polygon points="102,13 111,23 375,148 345,102" fill="url(#${id}-beam-1)" />
          <polygon points="78,37 87,47 335,184 305,138" fill="url(#${id}-beam-2)" />
          <polygon points="54,61 63,71 292,220 262,172" fill="url(#${id}-beam-3)" />
          <polygon points="30,85 39,95 246,254 216,206" fill="url(#${id}-beam-4)" />
          <polygon points="6,109 15,119 195,284 166,238" fill="url(#${id}-beam-5)" />
        </g>

        <!-- Intense Inner Core Light Beams -->
        <g filter="url(#${id}-blur-core)">
          <polygon points="104,15 109,21 350,132 336,112" fill="url(#${id}-beam-1)" />
          <polygon points="80,39 85,45 312,168 298,148" fill="url(#${id}-beam-2)" />
          <polygon points="56,63 61,69 270,202 256,182" fill="url(#${id}-beam-3)" />
          <polygon points="32,87 37,93 226,236 212,216" fill="url(#${id}-beam-4)" />
          <polygon points="8,111 13,117 178,266 164,248" fill="url(#${id}-beam-5)" />
        </g>

        <!-- 5 Diagonal Stadium Floodlight Lamp Fixtures -->
        <g filter="url(#${id}-bulb-bloom)">
          <!-- Lamp 1 (Top-Inner) -->
          <g transform="translate(106, 18) rotate(-42)">
            <ellipse cx="0" cy="0" rx="11.5" ry="8.5" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" />
            <ellipse cx="0" cy="1.2" rx="8.2" ry="6" fill="rgba(255,255,255,0.45)" stroke="#FFFFFF" stroke-width="1" />
            <ellipse cx="0" cy="2" rx="5.6" ry="4.2" fill="#FFFFFF" />
          </g>
          <!-- Lamp 2 -->
          <g transform="translate(82, 42) rotate(-42)">
            <ellipse cx="0" cy="0" rx="11.5" ry="8.5" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" />
            <ellipse cx="0" cy="1.2" rx="8.2" ry="6" fill="rgba(255,255,255,0.45)" stroke="#FFFFFF" stroke-width="1" />
            <ellipse cx="0" cy="2" rx="5.6" ry="4.2" fill="#FFFFFF" />
          </g>
          <!-- Lamp 3 -->
          <g transform="translate(58, 66) rotate(-42)">
            <ellipse cx="0" cy="0" rx="11.5" ry="8.5" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" />
            <ellipse cx="0" cy="1.2" rx="8.2" ry="6" fill="rgba(255,255,255,0.45)" stroke="#FFFFFF" stroke-width="1" />
            <ellipse cx="0" cy="2" rx="5.6" ry="4.2" fill="#FFFFFF" />
          </g>
          <!-- Lamp 4 -->
          <g transform="translate(34, 90) rotate(-42)">
            <ellipse cx="0" cy="0" rx="11.5" ry="8.5" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" />
            <ellipse cx="0" cy="1.2" rx="8.2" ry="6" fill="rgba(255,255,255,0.45)" stroke="#FFFFFF" stroke-width="1" />
            <ellipse cx="0" cy="2" rx="5.6" ry="4.2" fill="#FFFFFF" />
          </g>
          <!-- Lamp 5 (Bottom-Outer) -->
          <g transform="translate(10, 114) rotate(-42)">
            <ellipse cx="0" cy="0" rx="11.5" ry="8.5" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.85)" stroke-width="1.4" />
            <ellipse cx="0" cy="1.2" rx="8.2" ry="6" fill="rgba(255,255,255,0.45)" stroke="#FFFFFF" stroke-width="1" />
            <ellipse cx="0" cy="2" rx="5.6" ry="4.2" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    `;
  };

  return `
    <div class="csk-stadium-lights-rig__truss-top"></div>
    <div class="csk-stadium-lights-rig__truss-bottom"></div>
    ${bankSVG('left')}
    ${bankSVG('right')}
  `;
}

function initStadiumFloodlights() {
  const targets = document.querySelectorAll(
    '.hero-cinematic-sports, .section--navy, .csk-gallery-hero, .csk-player-hero, .match-detail-hero, #squad-section, #matches-section, .squad-stadium-hero, .squad-stage-section, .matches-hero-banner, .youth-hero-section, .sponsors-hero, .editorial-hero'
  );

  targets.forEach((sec, index) => {
    if (sec.querySelector('.csk-stadium-lights-rig')) return;
    const computedPos = window.getComputedStyle(sec).position;
    if (computedPos === 'static') {
      sec.style.position = 'relative';
    }
    if (window.getComputedStyle(sec).overflow === 'visible') {
      sec.style.overflow = 'hidden';
    }
    const rig = document.createElement('div');
    rig.className = 'csk-stadium-lights-rig';
    rig.setAttribute('aria-hidden', 'true');
    rig.innerHTML = getStadiumFloodlightRigHTML(`csk-fl-${index}`);
    sec.insertBefore(rig, sec.firstChild);
  });
}




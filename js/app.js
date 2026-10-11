/**
 * ─────────────────────────────────────────────────────────────
 * MAIN APPLICATION MODULE
 * Handles sitewide header, mobile nav, announcement bar & footer
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';
import { initHeroSlider } from './hero-slider.js';
import { initSplashLoader } from './splash-loader.js';
import { initCricketCrazy } from './cricket-crazy.js';
import { createStadiumPlayerCard } from './squad.js';
import { initFuturisticSystem } from './futuristic.js';

// Initialize splash loader immediately to handle smooth page entrance
initSplashLoader();

async function startApp() {
  initHeroSlider();
  initMobileNav();
  highlightActiveNav();
  initSmoothScroll();
  initRosterCardInteractions();
  initCricketCrazy();
  initFuturisticSystem();
  await initHomepageRoster();
  await initAnnouncementBar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

async function initHomepageRoster() {
  const rosterGrid = document.querySelector('.roster-grid');
  if (!rosterGrid) return;

  const squad = await store.getSquad();
  if (!squad || squad.length === 0) return;

  // Strictly sort by priority 1 to 18
  squad.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  rosterGrid.innerHTML = squad.map(p => createStadiumPlayerCard(p)).join('');
}

function initRosterCardInteractions() {
  document.addEventListener('click', (e) => {
    // Read more click - allow normal navigation
    if (e.target.closest('.hud-read-more-link')) {
      return;
    }

    const card = e.target.closest('.roster-stage-card');
    if (card) {
      const isAlreadyActive = card.classList.contains('is-active');
      document.querySelectorAll('.roster-stage-card.is-active').forEach(c => c.classList.remove('is-active'));
      if (!isAlreadyActive) {
        card.classList.add('is-active');
      }
    } else if (!e.target.closest('.squad-player-stage-card')) {
      document.querySelectorAll('.roster-stage-card.is-active').forEach(c => c.classList.remove('is-active'));
    }
  });
}

function initMobileNav() {
  if (typeof window.toggleCSKMobileNav === 'function') {
    return;
  }
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (toggle && menu) {
    // Ensure backdrop exists
    let backdrop = document.querySelector('.mobile-nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-nav-backdrop';
      document.body.appendChild(backdrop);
    }

    function toggleMenu(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.classList.toggle('active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    }

    function closeMenu() {
      if (menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    }

    // Support click & pointerup with debounce
    let lastToggleTime = 0;
    const handleToggle = (e) => {
      const now = Date.now();
      if (now - lastToggleTime < 250) return;
      lastToggleTime = now;
      toggleMenu(e);
    };

    toggle.addEventListener('click', handleToggle);
    backdrop.addEventListener('click', closeMenu);

    // Close when clicking any nav link
    const navLinks = menu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });

    // Auto close on window resize beyond mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }
}

async function initAnnouncementBar() {
  const textEl = document.querySelector('.announcement-text');
  const linkEl = document.querySelector('.announcement-link');
  if (!textEl) return;

  const fixtures = await store.getFixtures();
  const results = fixtures.filter(f => f.status === 'result');
  if (results.length > 0) {
    const latest = results[0];
    textEl.innerHTML = `<strong>Latest Result:</strong> CSK (${latest.score_csk}) defeated ${latest.opponent} (${latest.score_opp}) — ${latest.result_text}`;
    if (linkEl) {
      linkEl.href = `match-detail.html?slug=${latest.slug}`;
      linkEl.innerHTML = `Match Report ↗`;
    }
  } else {
    textEl.textContent = 'Cayman Super Kings — 2026 CICA Season Underway';
    if (linkEl) linkEl.href = 'matches.html';
  }
}

function highlightActiveNav() {
  const currentFile = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  let targetNav = currentFile;
  
  if (currentFile === 'match-detail') targetNav = 'matches';
  if (currentFile === 'player-detail') targetNav = 'squad';
  if (currentFile === 'article') targetNav = 'news';

  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('/').pop().replace('.html', '');
    if (cleanHref === targetNav) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initSmoothScroll() {
  // Smooth scroll for in-page anchors (e.g., #ground, #consent)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

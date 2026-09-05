/**
 * ─────────────────────────────────────────────────────────────
 * MAIN APPLICATION MODULE
 * Handles sitewide header, mobile nav, announcement bar & footer
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

document.addEventListener('DOMContentLoaded', async () => {
  initMobileNav();
  await initAnnouncementBar();
  highlightActiveNav();
  initSmoothScroll();
});

function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.classList.toggle('active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });

    // Close when clicking any nav link
    const navLinks = menu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
        document.body.classList.remove('nav-open');
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
  const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const links = document.querySelectorAll('.nav-link, .nav-cta');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('/').pop().replace('.html', '') || 'index';
    if (cleanHref === currentPath || (currentPath === 'index' && cleanHref === '')) {
      link.classList.add('active');
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

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
});

function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
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
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

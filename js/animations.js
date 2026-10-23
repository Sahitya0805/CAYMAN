/**
 * ─────────────────────────────────────────────────────────────
 * SITEWIDE MOTION
 * - Hero headline word-by-word entrance on every page
 * - Staggered scroll reveals for headings, text, images, cards,
 *   list items and buttons (including content rendered later by JS)
 * - Image "zoom-settle" reveals, heading accent bars, sticky
 *   header that tightens on scroll
 * Everything is skipped for people who prefer reduced motion, and
 * content is only hidden once this script is running, so nothing
 * can stay invisible if JavaScript fails.
 * ─────────────────────────────────────────────────────────────
 */
(function () {
  const root = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('anim-on');

  // Elements other scripts already animate, or that must never be hidden
  const SKIP = [
    '.cyber-reveal', '.site-header', '.mobile-nav', '#csk-splash-screen', '.csk-splash-screen',
    '.lightbox-modal', '.vlb', '[role="dialog"]', '.hero-slides-wrapper', '.hero-cinematic-overlay',
    '.cyber-hud-chip', '.cyber-scroll-progress', '[data-no-anim]', 'svg', 'option', 'script', 'style',
    '.csk-stadium-lights-rig', '.lineup-spots', '.lineup-tip', '.journey-book-section'
  ].join(',');

  // Parents come before children in document order, so a tagged card
  // animates as one unit and its contents are left alone.
  const TARGETS = [
    // containers / cards
    '[class*="-card"]:not([class*="-card-"])', '.card', 'figure', 'blockquote', 'table', 'form',
    '.fixture-ticket', '.timeline-item', '.data-table', '.table-responsive',
    // media
    'img', 'video', 'picture',
    // text
    'h1', 'h2', 'h3', 'h4', 'p', 'li',
    '[class*="eyebrow"]', '[class*="-pill"]:not(button)', '[class*="badge"]',
    // actions
    '.btn', 'a[class*="btn"]', 'button[class*="btn"]'
  ].join(',');

  const HEADLINE_SPLIT = '.hero-cinematic-headline, .youth-hero-title, .squad-hero-main-title, .sponsors-hero-title, .csk-gallery-hero__title';

  /* ── Hero headline: split into words that rise in turn ─────── */
  function splitHeadline(h) {
    if (h.dataset.split) return;
    h.dataset.split = '1';
    let i = 0;
    const wrapWord = word => {
      const s = document.createElement('span');
      s.className = 'anim-word';
      s.style.setProperty('--wi', i++);
      s.textContent = word;
      return s;
    };
    [...h.childNodes].forEach(node => {
      if (node.nodeType === 3) {
        const parts = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          frag.appendChild(/^\s+$/.test(p) ? document.createTextNode(p) : wrapWord(p));
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        // keep styled spans (e.g. gradient text) intact, animate as one word
        node.classList.add('anim-word');
        node.style.setProperty('--wi', i++);
      }
    });
    h.classList.add('anim-headline');
    requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('anim-in')));
  }
  document.querySelectorAll(HEADLINE_SPLIT).forEach(splitHeadline);

  /* ── Scroll reveals ───────────────────────────────────────── */
  const io = new IntersectionObserver(entries => {
    const showing = entries.filter(e => e.isIntersecting).map(e => e.target);
    showing.sort((a, b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return (ra.top - rb.top) || (ra.left - rb.left);
    });
    showing.forEach((el, n) => {
      el.style.setProperty('--ad', `${Math.min(n * 70, 560)}ms`);
      el.classList.add('anim-in');
      io.unobserve(el);
      // clean up after the animation so hover effects are not affected
      setTimeout(() => el.classList.add('anim-done'), 1400 + Math.min(n * 70, 560));
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  function variantFor(el) {
    const tag = el.tagName;
    if (tag === 'IMG' || tag === 'VIDEO' || tag === 'PICTURE' || tag === 'FIGURE') return 'zoom';
    if (tag === 'LI') return 'left';
    if (/^H[1-4]$/.test(tag)) return 'rise';
    if (/btn/.test(el.className) || tag === 'BUTTON') return 'pop';
    if (/eyebrow|pill|badge/.test(el.className)) return 'drop';
    if (/card|ticket|timeline|table|form|figure|blockquote/i.test(el.className + ' ' + tag)) return 'card';
    return 'fade';
  }

  function eligible(el) {
    if (el.dataset.anim || el.classList.contains('anim-headline')) return false;
    if (el.closest(SKIP)) return false;
    if (el.closest('[data-anim]')) return false; // parent already animates
    if (el.closest(HEADLINE_SPLIT)) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return false;
    if (el.tagName === 'IMG' && (el.width && el.width < 48) && (el.height && el.height < 48)) return false; // icons
    return true;
  }

  function scan(scope) {
    const base = scope || document.body;
    const list = base.querySelectorAll ? base.querySelectorAll(TARGETS) : [];
    const candidates = base.matches && base.matches(TARGETS) ? [base, ...list] : [...list];
    candidates.forEach(el => {
      if (!eligible(el)) return;
      el.dataset.anim = variantFor(el);
      io.observe(el);
    });
  }

  function start() {
    scan(document.querySelector('main') || document.body);
    const footer = document.querySelector('footer');
    if (footer) scan(footer);
    // pages render cards, scorecards and galleries after fetching data
    const mo = new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1) scan(n); }));
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ── Header tightens once the page scrolls ───────────────── */
  function headerOnScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { start(); headerOnScroll(); });
  } else {
    start(); headerOnScroll();
  }

  // Safety net: never leave anything hidden (e.g. very long pages printed)
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('[data-anim]').forEach(el => el.classList.add('anim-in', 'anim-done'));
  });
})();

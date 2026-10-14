/**
 * ─────────────────────────────────────────────────────────────
 * BULLETPROOF MOBILE NAVIGATION CONTROLLER (IPL / FRANCHISE STYLE)
 * Body-level drawer injection ensuring 100% visibility, zero stacking
 * context conflicts, smooth touch response, and automatic page routing.
 * ─────────────────────────────────────────────────────────────
 */
(function() {
  var drawerId = 'csk-mobile-drawer';

  function getActivePage() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('squad') !== -1 || path.indexOf('player-detail') !== -1) return 'squad';
    if (path.indexOf('match') !== -1) return 'matches';
    if (path.indexOf('kids') !== -1 || path.indexOf('youth') !== -1) return 'kids';
    if (path.indexOf('about') !== -1 || path.indexOf('history') !== -1) return 'about';
    if (path.indexOf('gallery') !== -1) return 'gallery';
    if (path.indexOf('partner') !== -1 || path.indexOf('sponsor') !== -1) return 'partner';
    if (path.indexOf('contact') !== -1) return 'contact';
    return 'home';
  }

  function ensureDrawer() {
    var drawer = document.getElementById(drawerId);
    if (drawer) return drawer;

    var active = getActivePage();

    drawer = document.createElement('div');
    drawer.id = drawerId;
    drawer.className = 'csk-mobile-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = [
      '<div class="csk-drawer-backdrop"></div>',
      '<div class="csk-drawer-sheet">',
      '  <div class="csk-drawer-header">',
      '    <div class="csk-drawer-brand">',
      '      <img src="assets/csk-official-logo.png?v=20260923_10" alt="CSK Crest" class="csk-drawer-logo">',
      '      <div class="csk-drawer-brand-text">',
      '        <span class="csk-drawer-title">CAYMAN SUPER KINGS</span>',
      '        <span class="csk-drawer-sub">ONE TEAM • ONE DREAM</span>',
      '      </div>',
      '    </div>',
      '    <button class="csk-drawer-close" aria-label="Close menu">&times;</button>',
      '  </div>',
      '  <nav class="csk-drawer-nav">',
      '    <a href="index.html" class="csk-drawer-link ' + (active === 'home' ? 'is-active' : '') + '">',
      '      <span class="csk-drawer-icon">🏠</span>',
      '      <span class="csk-drawer-label">Home</span>',
      '    </a>',
      '    <a href="squad.html" class="csk-drawer-link ' + (active === 'squad' ? 'is-active' : '') + '">',
      '      <span class="csk-drawer-icon">🏏</span>',
      '      <span class="csk-drawer-label">Squad</span>',
      '      <span class="csk-drawer-pill">18 PLAYERS</span>',
      '    </a>',
      '    <a href="matches.html" class="csk-drawer-link ' + (active === 'matches' ? 'is-active' : '') + '">',
      '      <span class="csk-drawer-icon">📅</span>',
      '      <span class="csk-drawer-label">Matches</span>',
      '      <span class="csk-drawer-pill">FIXTURES</span>',
      '    </a>',
      '    <a href="kids.html" class="csk-drawer-link ' + (active === 'kids' ? 'is-active' : '') + '">',
      '      <span class="csk-drawer-icon">🧒</span>',
      '      <span class="csk-drawer-label">Kids Academy</span>',
      '      <span class="csk-drawer-pill">JUNIORS</span>',
      '    </a>',
      '    <a href="about.html" class="csk-drawer-link ' + (active === 'about' ? 'is-active' : '') + '">',
      '      <span class="csk-drawer-icon">📖</span>',
      '      <span class="csk-drawer-label">History</span>',
      '      <span class="csk-drawer-pill">TIMELINE</span>',
      '    </a>',
      '    <a href="gallery.html" class="csk-drawer-link ' + (active === 'gallery' ? 'is-active' : '') + '">',
      '      <span class="csk-drawer-icon">📸</span>',
      '      <span class="csk-drawer-label">Gallery</span>',
      '      <span class="csk-drawer-pill">PHOTOS</span>',
      '    </a>',
      '    <a href="partner.html" class="csk-drawer-link ' + (active === 'partner' ? 'is-active' : '') + '">',
      '      <span class="csk-drawer-icon">🤝</span>',
      '      <span class="csk-drawer-label">Sponsors</span>',
      '      <span class="csk-drawer-pill">2027</span>',
      '    </a>',
      '    <a href="contact.html" class="csk-drawer-link ' + (active === 'contact' ? 'is-active' : '') + '">',
      '      <span class="csk-drawer-icon">✉️</span>',
      '      <span class="csk-drawer-label">Contact</span>',
      '    </a>',
      '  </nav>',
      '  <div class="csk-drawer-footer">',
      '    <a href="https://www.instagram.com/caymansuperkings?igsi=aXBpaHY2azlxNGF1" target="_blank" rel="noopener noreferrer" class="csk-drawer-insta-btn">',
      '      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
      '      <span>Follow @caymansuperkings ↗</span>',
      '    </a>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(drawer);

    // Event listeners inside drawer
    var backdrop = drawer.querySelector('.csk-drawer-backdrop');
    if (backdrop) backdrop.addEventListener('click', window.closeCSKMobileNav);

    var closeBtn = drawer.querySelector('.csk-drawer-close');
    if (closeBtn) closeBtn.addEventListener('click', window.closeCSKMobileNav);

    var links = drawer.querySelectorAll('.csk-drawer-link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        window.closeCSKMobileNav();
      });
    }

    return drawer;
  }

  window.toggleCSKMobileNav = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    var drawer = ensureDrawer();
    var isOpen = drawer.classList.contains('is-active');

    if (isOpen) {
      window.closeCSKMobileNav();
    } else {
      window.openCSKMobileNav();
    }
  };

  window.openCSKMobileNav = function() {
    var drawer = ensureDrawer();
    drawer.classList.add('is-active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');

    var toggles = document.querySelectorAll('.mobile-toggle');
    toggles.forEach(function(t) {
      t.classList.add('active');
      t.setAttribute('aria-expanded', 'true');
    });

    var menu = document.querySelector('.nav-menu');
    if (menu) menu.classList.add('is-open');
  };

  window.closeCSKMobileNav = function() {
    var drawer = document.getElementById(drawerId);
    if (drawer) {
      drawer.classList.remove('is-active');
      drawer.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('nav-open');

    var toggles = document.querySelectorAll('.mobile-toggle');
    toggles.forEach(function(t) {
      t.classList.remove('active');
      t.setAttribute('aria-expanded', 'false');
    });

    var menu = document.querySelector('.nav-menu');
    if (menu) menu.classList.remove('is-open');
  };

  function bindMobileNav() {
    ensureDrawer();

    var toggles = document.querySelectorAll('.mobile-toggle');
    toggles.forEach(function(t) {
      t.setAttribute('onclick', 'toggleCSKMobileNav(event)');
      t.onclick = function(e) {
        window.toggleCSKMobileNav(e);
      };
    });

    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.closeCSKMobileNav();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindMobileNav);
  } else {
    bindMobileNav();
  }
})();

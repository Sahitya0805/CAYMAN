/**
 * ─────────────────────────────────────────────────────────────
 * BULLETPROOF MOBILE NAVIGATION SCRIPT
 * Standalone vanilla JS navigation controller ensuring immediate,
 * zero-delay response on iOS, Android, and all touch devices.
 * ─────────────────────────────────────────────────────────────
 */
(function() {
  window.toggleCSKMobileNav = function(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var menu = document.querySelector('.nav-menu');
    var toggle = document.querySelector('.mobile-toggle');
    var backdrop = document.querySelector('.mobile-nav-backdrop');
    
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-nav-backdrop';
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', function() {
        window.closeCSKMobileNav();
      });
    }

    if (!menu) return;
    var isOpen = menu.classList.toggle('is-open');
    if (toggle) {
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    }
    document.body.classList.toggle('nav-open', isOpen);
  };

  window.closeCSKMobileNav = function() {
    var menu = document.querySelector('.nav-menu');
    var toggle = document.querySelector('.mobile-toggle');
    if (menu) menu.classList.remove('is-open');
    if (toggle) {
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('nav-open');
  };

  function bindMobileNav() {
    var toggle = document.querySelector('.mobile-toggle');
    if (toggle) {
      toggle.setAttribute('onclick', 'toggleCSKMobileNav(event)');
      toggle.onclick = function(e) {
        window.toggleCSKMobileNav(e);
      };
    }

    var links = document.querySelectorAll('.nav-menu a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function() {
        window.closeCSKMobileNav();
      });
    }

    document.addEventListener('click', function(e) {
      var menu = document.querySelector('.nav-menu');
      var toggle = document.querySelector('.mobile-toggle');
      if (menu && menu.classList.contains('is-open')) {
        if (!menu.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
          window.closeCSKMobileNav();
        }
      }
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

/**
 * ─────────────────────────────────────────────────────────────
 * GALLERY — "Media Vault"
 * Spotlight reel · sticky filter dock · masonry wall with hover
 * video previews · full-screen viewer (filmstrip, swipe,
 * slideshow, share links via #m=<id>).
 * Data: content/gallery.json (unchanged)
 * ─────────────────────────────────────────────────────────────
 */
import { store } from './content-store.js?v=20261018_clean_v3';

const FEATURED_IDS = ['photo-01', 'photo-02', 'photo-00', 'video-06', 'photo-19', 'photo-25'];
const SPOT_MS = 6500;

const CATEGORY_COLORS = {
  'Matchday Action': '#38BDF8',
  'Training & Youth': '#22C55E',
  'Trophy Celebrations': '#FCD34D',
  'Behind the Scenes': '#C084FC'
};
const CATEGORY_LABELS = {
  'Training & Youth': 'Training & Academy'
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* "Image of Gokul Krishnan" → "Gokul Krishnan" */
function displayTitle(item) {
  return (item.title || '').replace(/^Image of\s+/i, '');
}
function colorOf(cat) { return CATEGORY_COLORS[cat] || '#38BDF8'; }
function labelOf(cat) { return CATEGORY_LABELS[cat] || cat || 'Club Archive'; }
function thumbOf(item) { return item.type === 'video' ? (item.poster || item.src) : item.src; }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fallbackImg(img) {
  img.onerror = null;
  img.src = 'assets/csk-official-logo.png';
  img.style.objectFit = 'contain';
  img.style.padding = '30px';
}
window.__vaultImgFallback = fallbackImg;

export async function initGalleryPage() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const items = (await store.getGallery()) || [];
  // Photos first, then videos — matches the previous ordering
  items.sort((a, b) => (a.type === 'video') - (b.type === 'video'));

  const state = { type: 'all', category: 'all', q: '', layout: 'masonry' };
  let filtered = [];

  initCounts(items);
  initSpotlight(items);
  initDock();
  render();
  initViewer();

  /* ── Counts in hero + segmented control ─────────────────── */
  function initCounts(list) {
    const photos = list.filter(i => (i.type || 'photo') === 'photo').length;
    const videos = list.filter(i => i.type === 'video').length;
    const set = (id, v) => { const el = document.getElementById(id); if (el) animateNumber(el, v); };
    set('hero-stat-total', list.length);
    set('hero-stat-photos', photos);
    set('hero-stat-videos', videos);
    set('count-all', list.length);
    set('count-photos', photos);
    set('count-videos', videos);
  }

  function animateNumber(el, to) {
    if (prefersReducedMotion) { el.textContent = to; return; }
    const start = performance.now();
    const dur = 900;
    const step = now => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ── Spotlight reel ─────────────────────────────────────── */
  function initSpotlight(list) {
    const stage = document.getElementById('spot-stage');
    const slidesEl = document.getElementById('spot-slides');
    const copyEl = document.getElementById('spot-copy');
    const progEl = document.getElementById('spot-progress');
    const railEl = document.getElementById('spot-rail');
    if (!stage || !slidesEl) return;

    const feats = FEATURED_IDS.map(id => list.find(i => i.id === id)).filter(Boolean);
    if (feats.length === 0) { document.getElementById('vault-spotlight').style.display = 'none'; return; }

    slidesEl.innerHTML = feats.map((f, i) => `
      <div class="spot-slide${i === 0 ? ' is-active' : ''}">
        <img class="spot-fill" src="${esc(thumbOf(f))}" alt="" aria-hidden="true">
        <img class="spot-photo" src="${esc(thumbOf(f))}" alt="${esc(displayTitle(f))}" onload="this.parentNode.classList.toggle('is-wide', this.naturalWidth / this.naturalHeight > 1.55)" onerror="__vaultImgFallback(this)">
      </div>`).join('');
    progEl.innerHTML = feats.map(() => '<span><i></i></span>').join('');
    railEl.innerHTML = feats.map((f, i) => `
      <button type="button" class="spot-thumb${i === 0 ? ' is-active' : ''}" data-i="${i}">
        <img src="${esc(thumbOf(f))}" alt="" loading="lazy" onerror="__vaultImgFallback(this)">
        <span><small>${f.type === 'video' ? 'Video · ' : ''}${esc(labelOf(f.category))}</small><strong>${esc(displayTitle(f))}</strong></span>
      </button>`).join('');
    stage.style.setProperty('--dur', SPOT_MS + 'ms');

    let idx = 0;
    let timer = null;
    let paused = false;
    const slides = [...slidesEl.children];
    const bars = [...progEl.children];
    const thumbs = [...railEl.children];

    function paint() {
      const f = feats[idx];
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      thumbs.forEach((t, i) => t.classList.toggle('is-active', i === idx));
      bars.forEach((b, i) => {
        b.classList.toggle('is-done', i < idx);
        b.classList.remove('is-active');
      });
      void progEl.offsetWidth; // restart the fill animation
      bars[idx].classList.add('is-active');
      copyEl.innerHTML = `
        <span class="spot-kicker">Spotlight ${String(idx + 1).padStart(2, '0')} / ${String(feats.length).padStart(2, '0')}</span>
        <h2 class="spot-title">${esc(displayTitle(f))}</h2>
        ${f.caption ? `<p class="spot-caption">${esc(f.caption)}</p>` : ''}
        <button type="button" class="vault-btn" data-open>${f.type === 'video' ? 'Play video' : 'View full size'} <span aria-hidden="true">→</span></button>`;
      const chip = stage.querySelector('.spot-video-chip');
      if (chip) chip.remove();
      if (f.type === 'video') {
        stage.insertAdjacentHTML('beforeend', `<span class="spot-video-chip">▶ VIDEO${f.duration ? ' · ' + esc(f.duration) : ''}</span>`);
      }
      const activeThumb = thumbs[idx];
      if (activeThumb && railEl.scrollWidth > railEl.clientWidth) {
        railEl.scrollTo({ left: activeThumb.offsetLeft - 12, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }

    function go(n) {
      idx = (n + feats.length) % feats.length;
      paint();
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (!paused && !prefersReducedMotion) timer = setTimeout(() => go(idx + 1), SPOT_MS);
    }
    function setPaused(p) {
      paused = p;
      stage.classList.toggle('is-paused', p);
      if (p) clearTimeout(timer); else schedule();
    }

    document.getElementById('spot-prev').addEventListener('click', e => { e.stopPropagation(); go(idx - 1); });
    document.getElementById('spot-next').addEventListener('click', e => { e.stopPropagation(); go(idx + 1); });
    thumbs.forEach(t => t.addEventListener('click', () => go(+t.dataset.i)));
    stage.addEventListener('click', e => {
      if (e.target.closest('.spot-arrow')) return;
      openViewerById(feats[idx].id, true);
    });
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') go(idx + 1);
      else if (e.key === 'ArrowLeft') go(idx - 1);
      else if (e.key === 'Enter') openViewerById(feats[idx].id, true);
    });
    stage.addEventListener('mouseenter', () => setPaused(true));
    stage.addEventListener('mouseleave', () => setPaused(false));
    document.addEventListener('visibilitychange', () => setPaused(document.hidden));

    // Swipe on touch screens
    let sx = null;
    stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 45) { e.preventDefault(); go(dx < 0 ? idx + 1 : idx - 1); }
    });

    paint();
    schedule();
  }

  /* ── Dock: type / category / search / layout ────────────── */
  function initDock() {
    const seg = document.getElementById('vault-seg');
    const ind = seg && seg.querySelector('.vault-seg-ind');
    const chipsEl = document.getElementById('vault-chips');
    const search = document.getElementById('gallery-search-input');
    const searchWrap = document.getElementById('vault-search');
    const clearBtn = document.getElementById('vault-clear');
    const layoutEl = document.getElementById('vault-layout');
    const dock = document.getElementById('vault-dock');

    function moveIndicator() {
      const active = seg.querySelector('button.is-active');
      if (!active || !ind) return;
      ind.style.width = active.offsetWidth + 'px';
      ind.style.transform = `translateX(${active.offsetLeft - 4}px)`;
    }
    seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      seg.querySelectorAll('button').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      state.type = b.dataset.type;
      moveIndicator();
      buildChips();
      render();
    }));
    window.addEventListener('resize', moveIndicator);
    requestAnimationFrame(moveIndicator);
    setTimeout(moveIndicator, 400); // after web fonts settle

    function buildChips() {
      const pool = items.filter(i => state.type === 'all' || (i.type || 'photo') === state.type);
      const cats = [...new Set(items.map(i => i.category).filter(Boolean))];
      const order = ['Matchday Action', 'Training & Youth', 'Trophy Celebrations', 'Behind the Scenes'];
      cats.sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));
      const chips = [{ key: 'all', label: 'Everything', n: pool.length, c: '#FFFFFF' }]
        .concat(cats.map(c => ({ key: c, label: labelOf(c), n: pool.filter(i => i.category === c).length, c: colorOf(c) })));
      if (state.category !== 'all' && !chips.find(c => c.key === state.category && c.n > 0)) state.category = 'all';
      chipsEl.innerHTML = chips.map(c => `
        <button type="button" class="vault-chip${state.category === c.key ? ' is-active' : ''}" data-cat="${esc(c.key)}" style="--c:${c.c}${c.n === 0 ? ';opacity:.4;cursor:not-allowed' : ''}" ${c.n === 0 ? 'disabled' : ''}>
          <i></i>${esc(c.label)} <b>${c.n}</b>
        </button>`).join('');
      chipsEl.querySelectorAll('.vault-chip').forEach(btn => btn.addEventListener('click', () => {
        state.category = btn.dataset.cat;
        chipsEl.querySelectorAll('.vault-chip').forEach(x => x.classList.toggle('is-active', x === btn));
        render();
      }));
    }
    buildChips();

    let t = null;
    search.addEventListener('input', () => {
      searchWrap.classList.toggle('has-value', !!search.value);
      clearTimeout(t);
      t = setTimeout(() => { state.q = search.value; render(); }, 120);
    });
    clearBtn.addEventListener('click', e => {
      e.preventDefault();
      search.value = '';
      searchWrap.classList.remove('has-value');
      state.q = '';
      render();
      search.focus();
    });
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== search && !isViewerOpen()) {
        e.preventDefault();
        search.focus();
      }
    });

    if (layoutEl) {
      layoutEl.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        layoutEl.querySelectorAll('button').forEach(x => x.classList.toggle('is-active', x === b));
        state.layout = b.dataset.layout;
        grid.classList.toggle('is-uniform', state.layout === 'uniform');
      }));
    }

    // Highlight the dock once it sticks under the header
    if ('IntersectionObserver' in window && dock) {
      const sentinel = document.createElement('div');
      sentinel.style.height = '1px';
      dock.parentNode.insertBefore(sentinel, dock);
      new IntersectionObserver(([e]) => dock.classList.toggle('is-stuck', !e.isIntersecting), { rootMargin: '-90px 0px 0px 0px' }).observe(sentinel);
    }

    const showAll = document.getElementById('btn-show-all-albums');
    if (showAll) showAll.addEventListener('click', () => {
      search.value = ''; searchWrap.classList.remove('has-value');
      state.q = ''; state.category = 'all';
      seg.querySelector('[data-type="all"]').click();
    });
  }

  /* ── Masonry wall ───────────────────────────────────────── */
  function render() {
    const q = state.q.trim().toLowerCase();
    filtered = items.filter(i => {
      if (state.type !== 'all' && (i.type || 'photo') !== state.type) return false;
      if (state.category !== 'all' && i.category !== state.category) return false;
      if (q) {
        const hay = `${i.title} ${i.caption || ''} ${i.category || ''} ${labelOf(i.category)}`.toLowerCase();
        if (!q.split(/\s+/).every(w => hay.includes(w))) return false;
      }
      return true;
    });

    const summary = document.getElementById('gallery-results-summary');
    const empty = document.getElementById('gallery-empty');
    if (summary) {
      const what = state.type === 'video' ? 'videos' : state.type === 'photo' ? 'photos' : 'items';
      const where = state.category === 'all' ? '' : ` in <strong>${esc(labelOf(state.category))}</strong>`;
      const forQ = state.q.trim() ? ` matching “<strong>${esc(state.q.trim())}</strong>”` : '';
      summary.innerHTML = `<span><strong>${filtered.length}</strong> ${filtered.length === 1 ? what.replace(/s$/, '') : what}${where}${forQ}</span><span>Tap any card to open</span>`;
    }
    if (empty) empty.classList.toggle('is-visible', filtered.length === 0);
    grid.style.display = filtered.length ? '' : 'none';

    grid.innerHTML = filtered.map((it, i) => {
      const isVideo = it.type === 'video';
      const c = colorOf(it.category);
      return `
        <article class="vault-card" tabindex="0" role="button" data-i="${i}" style="--c:${c};--d:${Math.min(i, 12) * 0.04}s" aria-label="Open ${esc(displayTitle(it))}">
          <div class="vault-media">
            <img src="${esc(thumbOf(it))}" alt="${esc(displayTitle(it))}" loading="lazy" decoding="async" onerror="__vaultImgFallback(this)">
            ${isVideo ? `
              <span class="vault-vid-badge">▶ VIDEO${it.duration ? ' · ' + esc(it.duration) : ''}</span>
              <span class="vault-play" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="7 4 20 12 7 20 7 4"/></svg></span>` : ''}
          </div>
          <div class="vault-overlay">
            <span class="vault-tag">${esc(labelOf(it.category))}</span>
            <h3 class="vault-card-title">${esc(displayTitle(it))}</h3>
            ${it.caption ? `<p class="vault-card-cap">${esc(it.caption)}</p>` : ''}
          </div>
        </article>`;
    }).join('');

    const cards = [...grid.querySelectorAll('.vault-card')];
    cards.forEach(card => {
      const i = +card.dataset.i;
      card.addEventListener('click', () => openViewer(i));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openViewer(i); }
      });
      if (canHover && !prefersReducedMotion) attachHoverFx(card, filtered[i]);
    });
    revealCards(cards);
  }

  function attachHoverFx(card, item) {
    let video = null;
    let hoverTimer = null;
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
      card.style.setProperty('--ry', `${(px - 0.5) * 7}deg`);
      card.style.setProperty('--rx', `${(0.5 - py) * 7}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      clearTimeout(hoverTimer);
      if (video) { video.pause(); card.classList.remove('is-previewing'); }
    });
    if (item.type === 'video') {
      card.addEventListener('pointerenter', () => {
        hoverTimer = setTimeout(() => {
          if (!video) {
            video = document.createElement('video');
            video.src = item.src;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = 'auto';
            card.querySelector('.vault-media').appendChild(video);
          }
          video.currentTime = 0;
          video.play().then(() => card.classList.add('is-previewing')).catch(() => {});
        }, 250);
      });
    }
  }

  function revealCards(cards) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      cards.forEach(c => c.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -30px 0px' });
    cards.forEach(c => io.observe(c));
  }

  /* ── Full-screen viewer ─────────────────────────────────── */
  let vIndex = 0;
  let vList = [];
  let slideTimer = null;

  function isViewerOpen() {
    const v = document.getElementById('vlb');
    return v && v.classList.contains('is-open');
  }

  function openViewerById(id, fromSpotlight) {
    let list = filtered;
    let i = list.findIndex(x => x.id === id);
    if (i < 0 || fromSpotlight) { list = items; i = items.findIndex(x => x.id === id); }
    if (i < 0) return;
    openViewer(i, list);
  }

  function openViewer(i, list) {
    vList = list || filtered;
    if (!vList[i]) return;
    const v = document.getElementById('vlb');
    vIndex = i;
    buildStrip();
    show();
    v.classList.add('is-open');
    v.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('vlb-close').focus({ preventScroll: true });
  }

  function closeViewer() {
    const v = document.getElementById('vlb');
    stopSlideshow();
    const vid = v.querySelector('#vlb-media video');
    if (vid) vid.pause();
    v.classList.remove('is-open');
    v.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (location.hash.startsWith('#m=')) history.replaceState(null, '', location.pathname + location.search);
  }

  function buildStrip() {
    const strip = document.getElementById('vlb-strip');
    strip.innerHTML = vList.map((it, i) => `
      <button type="button" data-i="${i}" class="${it.type === 'video' ? 'is-vid' : ''}" aria-label="${esc(displayTitle(it))}">
        <img src="${esc(thumbOf(it))}" alt="" loading="lazy" onerror="__vaultImgFallback(this)">
      </button>`).join('');
    strip.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { vIndex = +b.dataset.i; show(); }));
  }

  function show() {
    const it = vList[vIndex];
    if (!it) return;
    const media = document.getElementById('vlb-media');
    const isVideo = it.type === 'video';
    const old = media.querySelector('video');
    if (old) old.pause();
    media.innerHTML = isVideo
      ? `<video src="${esc(it.src)}" ${it.poster ? `poster="${esc(it.poster)}"` : ''} controls playsinline autoplay></video>`
      : `<img src="${esc(it.src)}" alt="${esc(displayTitle(it))}" onerror="__vaultImgFallback(this)">`;
    sizeMedia();

    document.getElementById('vlb-bg').style.backgroundImage = `url("${thumbOf(it).replace(/"/g, '%22')}")`;
    document.getElementById('vlb-count').textContent = `${vIndex + 1} / ${vList.length}`;
    const tag = document.getElementById('vlb-tag');
    tag.textContent = labelOf(it.category);
    tag.style.setProperty('--c', colorOf(it.category));
    document.getElementById('vlb-title').textContent = displayTitle(it);
    document.getElementById('vlb-desc').textContent = [it.caption, it.date || it.year].filter(Boolean).join(' · ');
    const dl = document.getElementById('vlb-download');
    dl.href = it.src;
    dl.setAttribute('download', (displayTitle(it) || 'csk-media').replace(/[^\w-]+/g, '-'));

    const strip = document.getElementById('vlb-strip');
    strip.querySelectorAll('button').forEach((b, i) => b.classList.toggle('is-active', i === vIndex));
    const active = strip.children[vIndex];
    if (active) strip.scrollTo({ left: active.offsetLeft - strip.clientWidth / 2 + active.offsetWidth / 2, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

    history.replaceState(null, '', `#m=${encodeURIComponent(it.id)}`);

    // Preload neighbours for instant next/prev
    [vIndex + 1, vIndex - 1].forEach(n => {
      const nb = vList[(n + vList.length) % vList.length];
      if (nb && nb.type !== 'video') { const im = new Image(); im.src = nb.src; }
    });

    if (slideTimer && isVideo) stopSlideshow();
  }

  function sizeMedia() {
    // Constrain media to the stage area so tall photos never overflow
    const stage = document.getElementById('vlb-stage');
    const el = document.querySelector('#vlb-media img, #vlb-media video');
    if (!stage || !el) return;
    el.style.maxHeight = (stage.clientHeight - 8) + 'px';
  }

  function step(d) {
    if (!vList.length) return;
    vIndex = (vIndex + d + vList.length) % vList.length;
    show();
  }

  function startSlideshow() {
    const btn = document.getElementById('vlb-play');
    btn.classList.add('is-on');
    btn.setAttribute('aria-label', 'Pause slideshow');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    slideTimer = setInterval(() => {
      // skip videos during slideshows
      let n = 0;
      do { vIndex = (vIndex + 1) % vList.length; n++; } while (vList[vIndex].type === 'video' && n < vList.length);
      show();
    }, 3500);
  }
  function stopSlideshow() {
    clearInterval(slideTimer);
    slideTimer = null;
    const btn = document.getElementById('vlb-play');
    if (!btn) return;
    btn.classList.remove('is-on');
    btn.setAttribute('aria-label', 'Play slideshow');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
  }

  function initViewer() {
    const v = document.getElementById('vlb');
    if (!v) return;
    document.getElementById('vlb-close').addEventListener('click', closeViewer);
    document.getElementById('vlb-prev').addEventListener('click', () => step(-1));
    document.getElementById('vlb-next').addEventListener('click', () => step(1));
    document.getElementById('vlb-play').addEventListener('click', () => (slideTimer ? stopSlideshow() : startSlideshow()));
    document.getElementById('vlb-share').addEventListener('click', async () => {
      const it = vList[vIndex];
      const url = `${location.origin}${location.pathname}#m=${encodeURIComponent(it.id)}`;
      try {
        if (navigator.share && !canHover) {
          await navigator.share({ title: displayTitle(it), text: it.caption || 'Cayman Super Kings', url });
          return;
        }
        await navigator.clipboard.writeText(url);
        toast('Link copied');
      } catch (_) { /* share sheet dismissed */ }
    });
    document.getElementById('vlb-stage').addEventListener('click', e => {
      if (e.target.id === 'vlb-stage' || e.target.id === 'vlb-media') closeViewer();
    });
    window.addEventListener('resize', () => { if (isViewerOpen()) sizeMedia(); });

    document.addEventListener('keydown', e => {
      if (!isViewerOpen()) return;
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === ' ' && e.target.tagName !== 'VIDEO' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        slideTimer ? stopSlideshow() : startSlideshow();
      }
    });

    // Swipe left/right, swipe down to close
    let sx = null, sy = null;
    const stage = document.getElementById('vlb-stage');
    stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      sx = sy = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeViewer();
    }, { passive: true });

    // Deep link: gallery.html#m=photo-02 opens that item
    const m = location.hash.match(/^#m=(.+)$/);
    if (m) openViewerById(decodeURIComponent(m[1]), true);
  }

  function toast(msg) {
    const t = document.getElementById('vlb-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    setTimeout(() => t.classList.remove('is-on'), 1600);
  }
}

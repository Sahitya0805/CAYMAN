/**
 * Homepage hero lineup: point at (or tap) a face to see the player's
 * number, name and role, with a link to his profile.
 * Face positions (in % of the lineup image) live in content/team-lineup.json.
 * The hero shows the image with background-size: cover, so positions are
 * mapped through the same cover crop to stay on the faces at every width.
 */
(function () {
  const wrap = document.getElementById('hero-slides-wrapper');
  const layer = document.getElementById('lineup-spots');
  const tip = document.getElementById('lineup-tip');
  if (!wrap || !layer || !tip) return;

  const IMG_W = 2400, IMG_H = 1080;
  const tipRole = tip.querySelector('.lineup-tip-role');
  const tipName = tip.querySelector('.lineup-tip-name');
  const tipLink = tip.querySelector('.lineup-tip-link');

  let lastPointer = window.matchMedia('(hover: none)').matches ? 'touch' : 'mouse';
  document.addEventListener('pointerdown', e => { lastPointer = e.pointerType || 'mouse'; }, true);
  const touchLike = () => lastPointer === 'touch' || lastPointer === 'pen';

  let players = [];
  let active = null;
  const spots = {};

  Promise.all([
    fetch('content/team-lineup.json').then(r => r.json()),
    fetch('content/squad.json').then(r => r.json()).catch(() => [])
  ]).then(([lineup, squad]) => {
    const meta = {};
    squad.forEach(p => { meta[p.id] = p; });
    players = lineup.map(p => ({
      ...p,
      num: (meta[p.id] && meta[p.id].jersey_display) || p.id.replace('csk-', ''),
      badge: meta[p.id] && meta[p.id].badge
    }));
    players.forEach(p => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lineup-spot';
      b.setAttribute('role', 'listitem');
      b.setAttribute('aria-label', `#${p.num} ${p.name}, ${p.role}`);
      b.addEventListener('mouseenter', () => { if (!touchLike()) show(p); });
      b.addEventListener('focus', () => { if (!touchLike()) show(p); });
      b.addEventListener('click', e => {
        e.stopPropagation();
        if (touchLike() && active !== p.id) { show(p); return; } // first tap: show name
        window.location.href = profileUrl(p.id);
      });
      layer.appendChild(b);
      spots[p.id] = b;
    });
    place();
  }).catch(err => console.warn('Lineup hotspots unavailable:', err));

  function profileUrl(id) { return `player-detail.html?id=${encodeURIComponent(id)}`; }

  // Map image % coordinates through background-size: cover / position: center top
  function geometry() {
    const W = wrap.clientWidth, H = wrap.clientHeight;
    const s = Math.max(W / IMG_W, H / IMG_H);
    return { s, ox: (W - IMG_W * s) / 2, oy: 0, W, H };
  }

  function place() {
    const g = geometry();
    players.forEach(p => {
      const b = spots[p.id];
      const x = g.ox + (p.x / 100) * IMG_W * g.s;
      const y = g.oy + (p.y / 100) * IMG_H * g.s;
      const d = Math.max(28, (p.r / 100) * IMG_W * g.s * 2);
      b.style.left = x + 'px';
      b.style.top = y + 'px';
      b.style.width = d + 'px';
      b.style.height = d + 'px';
      b.hidden = x < 0 || x > g.W || y < 0 || y > g.H; // cropped off-screen
    });
    if (active) {
      const p = players.find(q => q.id === active);
      if (p) positionTip(spots[p.id]);
    }
  }

  function show(p) {
    if (active && spots[active]) spots[active].classList.remove('is-active');
    active = p.id;
    spots[p.id].classList.add('is-active');
    tipRole.textContent = p.badge && p.badge !== 'ALL ROUNDER' ? `#${p.num} · ${p.badge}` : `#${p.num} · ${p.role}`;
    tipName.textContent = p.name;
    tipLink.href = profileUrl(p.id);
    tip.hidden = false;
    positionTip(spots[p.id]);
  }

  function positionTip(spot) {
    const W = wrap.clientWidth;
    const x = parseFloat(spot.style.left);
    const y = parseFloat(spot.style.top);
    const half = spot.offsetHeight / 2;
    const tw = tip.offsetWidth || 200;
    const cx = Math.min(Math.max(x, tw / 2 + 8), W - tw / 2 - 8);
    tip.style.left = cx + 'px';
    tip.style.setProperty('--arrow', `${50 + ((x - cx) / tw) * 100}%`);
    const below = y - half - (tip.offsetHeight || 100) < 8;
    tip.classList.toggle('is-below', below);
    tip.style.top = (below ? y + half : y - half) + 'px';
  }

  function hide() {
    if (active && spots[active]) spots[active].classList.remove('is-active');
    active = null;
    tip.hidden = true;
  }

  wrap.addEventListener('mouseleave', () => { if (!touchLike()) hide(); });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) hide(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  window.addEventListener('resize', place);
  if ('ResizeObserver' in window) new ResizeObserver(place).observe(wrap);
})();

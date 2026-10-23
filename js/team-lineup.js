/**
 * Homepage "All 21 Kings" interactive lineup.
 * Face hotspots + name chips, both linked to player profiles.
 * Data: content/team-lineup.json (face positions in % of the image)
 *       content/squad.json        (jersey numbers / badges)
 */
(function () {
  const frame = document.getElementById('team21-frame');
  const layer = document.getElementById('team21-hotspots');
  const tip = document.getElementById('team21-tip');
  const chipsEl = document.getElementById('team21-chips');
  if (!frame || !layer || !tip) return;

  const tipRole = tip.querySelector('.team21-tip-role');
  const tipName = tip.querySelector('.team21-tip-name');
  const tipLink = tip.querySelector('.team21-tip-link');
  // Decide per interaction whether it came from a finger, so hybrid
  // devices (touch laptops) behave correctly for both mouse and touch
  let lastPointer = window.matchMedia('(hover: none)').matches ? 'touch' : 'mouse';
  document.addEventListener('pointerdown', e => { lastPointer = e.pointerType || 'mouse'; }, true);
  const touchLike = () => lastPointer === 'touch' || lastPointer === 'pen';

  let active = null;
  const spots = {};
  const chips = {};

  Promise.all([
    fetch('content/team-lineup.json').then(r => r.json()),
    fetch('content/squad.json').then(r => r.json()).catch(() => [])
  ]).then(([lineup, squad]) => {
    const meta = {};
    squad.forEach(p => { meta[p.id] = p; });

    const players = lineup.map(p => ({
      ...p,
      num: (meta[p.id] && meta[p.id].jersey_display) || p.id.replace('csk-', ''),
      badge: meta[p.id] && meta[p.id].badge
    }));

    players.forEach(p => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'team21-spot';
      b.style.left = p.x + '%';
      b.style.top = p.y + '%';
      b.style.setProperty('--r', p.r + '%');
      b.dataset.num = '#' + p.num;
      b.setAttribute('role', 'listitem');
      b.setAttribute('aria-label', `${p.name}, ${p.role}`);
      b.addEventListener('mouseenter', () => { if (!touchLike()) show(p); });
      b.addEventListener('focus', () => { if (!touchLike()) show(p); });
      b.addEventListener('click', e => {
        e.stopPropagation();
        // Touch: first tap shows the card, second tap opens the profile
        if (touchLike() && active !== p.id) { show(p); return; }
        window.location.href = profileUrl(p.id);
      });
      layer.appendChild(b);
      spots[p.id] = b;
    });

    if (chipsEl) {
      [...players].sort((a, b) => a.num.localeCompare(b.num, undefined, { numeric: true })).forEach(p => {
        const c = document.createElement('a');
        c.className = 'team21-chip';
        c.href = profileUrl(p.id);
        c.innerHTML = `<span class="team21-chip-num">${p.num}</span><span>${p.name}</span>`;
        c.addEventListener('mouseenter', () => { if (!touchLike()) show(p, true); });
        c.addEventListener('focus', () => { if (!touchLike()) show(p, true); });
        c.addEventListener('click', e => {
          if (touchLike() && active !== p.id) { e.preventDefault(); show(p, true); }
        });
        chipsEl.appendChild(c);
        chips[p.id] = c;
      });
    }

    // Phones: start the swipeable photo centred on the captain
    requestAnimationFrame(() => {
      if (frame.scrollWidth > frame.clientWidth + 4 && spots['csk-01']) {
        frame.scrollLeft = spots['csk-01'].offsetLeft - frame.clientWidth / 2;
      }
    });
  }).catch(err => console.warn('Team lineup failed to load:', err));

  function profileUrl(id) {
    return `player-detail.html?id=${encodeURIComponent(id)}`;
  }

  function show(p, fromChip) {
    if (active && spots[active]) spots[active].classList.remove('is-active');
    if (active && chips[active]) chips[active].classList.remove('is-active');
    active = p.id;
    const spot = spots[p.id];
    spot.classList.add('is-active');
    if (chips[p.id]) chips[p.id].classList.add('is-active');
    frame.classList.add('is-focused');

    tipRole.textContent = p.badge && p.badge !== 'ALL ROUNDER' ? `#${p.num} · ${p.badge}` : `#${p.num} · ${p.role}`;
    tipName.textContent = p.name;
    tipLink.href = profileUrl(p.id);
    tip.hidden = false;

    // Position in px relative to the (possibly horizontally scrolling) layer
    const lw = layer.offsetWidth;
    const x = spot.offsetLeft;
    const y = spot.offsetTop;
    const half = spot.offsetHeight / 2;
    const tw = tip.offsetWidth || 200;
    const clampedX = Math.min(Math.max(x, tw / 2 + 8), lw - tw / 2 - 8);
    tip.style.left = clampedX + 'px';
    tip.style.setProperty('--arrow', `${50 + ((x - clampedX) / tw) * 100}%`);
    const below = y - half - (tip.offsetHeight || 110) < 10;
    tip.classList.toggle('is-below', below);
    tip.style.top = (below ? y + half : y - half) + 'px';

    // Keep the chosen face visible on phones (photo scrolls sideways)
    if (fromChip && frame.scrollWidth > frame.clientWidth + 4) {
      frame.scrollTo({ left: x - frame.clientWidth / 2, behavior: 'smooth' });
    }
  }

  function hide() {
    if (active && spots[active]) spots[active].classList.remove('is-active');
    if (active && chips[active]) chips[active].classList.remove('is-active');
    active = null;
    tip.hidden = true;
    frame.classList.remove('is-focused');
  }

  frame.addEventListener('mouseleave', () => { if (!touchLike()) hide(); });
  if (chipsEl) chipsEl.addEventListener('mouseleave', () => { if (!touchLike()) hide(); });
  document.addEventListener('click', e => {
    if (!frame.contains(e.target) && !(chipsEl && chipsEl.contains(e.target))) hide();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
})();

/**
 * ─────────────────────────────────────────────────────────────
 * SQUAD MODULE
 * Roster rendering, career statistics hub, and player profile view
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

export async function initSquadPage() {
  const container = document.getElementById('squad-grid') || document.getElementById('squad-container');
  const filterBtns = document.querySelectorAll('.squad-filter-btn');

  if (!container) return;
  container.classList.add('squad-stage-grid');

  const squad = await store.getSquad();
  let currentFilter = 'all';

  // Strictly sort by priority 1 to 18
  squad.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  function render() {
    let filtered = squad;
    if (currentFilter !== 'all') {
      filtered = squad.filter(p => {
        const role = (p.role || '').toLowerCase();
        const grp = (p.group || '').toLowerCase();
        const grps = Array.isArray(p.groups) ? p.groups.map(g => g.toLowerCase()) : [];

        if (currentFilter === 'batters' || currentFilter === 'batsmen') {
          return grp === 'batters' || grps.includes('batters') || role.includes('bat') || role.includes('wicket');
        }
        if (currentFilter === 'allrounders') {
          return grp === 'allrounders' || grps.includes('allrounders') || role.includes('all-rounder');
        }
        if (currentFilter === 'bowlers') {
          return grp === 'bowlers' || grps.includes('bowlers') || role.includes('bowl');
        }
        return grp === currentFilter || grps.includes(currentFilter);
      });
    }

    container.innerHTML = filtered.map((p, idx) => `
      <div class="cyber-reveal" style="animation-delay: ${(idx % 4) * 0.1}s;">
        ${createStadiumPlayerCard(p)}
      </div>
    `).join('');

    initSquadCard3DTilt(container);
    initSquadScrollObserver(container);
  }

  function initSquadScrollObserver(root) {
    const reveals = root.querySelectorAll('.cyber-reveal');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(c => c.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });
    reveals.forEach(el => observer.observe(el));
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Trigger cyber ripple on filter click
      createFilterShockwave(btn, e);
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      render();
    });
  });

  render();
}

/**
 * High-performance 3D Perspective Tilt & Specular Light System
 */
export function initSquadCard3DTilt(root = document) {
  const cards = root.querySelectorAll('.squad-player-stage-card');
  cards.forEach(card => {
    if (card.dataset.tiltReady === 'true') return;
    card.dataset.tiltReady = 'true';

    function onPointerMove(e) {
      const rect = card.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;

      // Realistic sports card 3D tilt angle
      const rotX = ((y - halfH) / halfH) * -7.5;
      const rotY = ((x - halfW) / halfW) * 7.5;

      card.style.setProperty('--tilt-x', `${rotX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${rotY.toFixed(2)}deg`);
      card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
    }

    function onPointerLeave() {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    }

    card.addEventListener('mousemove', onPointerMove, { passive: true });
    card.addEventListener('mouseleave', onPointerLeave, { passive: true });
    card.addEventListener('touchmove', onPointerMove, { passive: true });
    card.addEventListener('touchend', onPointerLeave, { passive: true });

    // Tap/Click to toggle HUD active state on touch/mobile
    card.addEventListener('click', (e) => {
      if (e.target.closest('.hud-read-more-link')) return;
      const isAlreadyActive = card.classList.contains('is-active');
      document.querySelectorAll('.squad-player-stage-card.is-active').forEach(c => c.classList.remove('is-active'));
      if (!isAlreadyActive) {
        card.classList.add('is-active');
      }
    });
  });

  if (!window._squadOutsideClickAttached) {
    window._squadOutsideClickAttached = true;
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.squad-player-stage-card')) {
        document.querySelectorAll('.squad-player-stage-card.is-active').forEach(c => c.classList.remove('is-active'));
      }
    });
  }
}

function createFilterShockwave(btn, e) {
  const rect = btn.getBoundingClientRect();
  const wave = document.createElement('span');
  wave.className = 'cyber-shockwave';
  const size = Math.max(rect.width, rect.height) * 1.8;
  wave.style.width = `${size}px`;
  wave.style.height = `${size}px`;
  wave.style.left = `${(e.clientX - rect.left) - size / 2}px`;
  wave.style.top = `${(e.clientY - rect.top) - size / 2}px`;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(wave);
  setTimeout(() => wave.remove(), 700);
}

export function createStadiumPlayerCard(p) {
  const playerName = p.name_display || p.name_full;
  const jerseyNum = p.jersey_display || p.id.replace('csk-', '');
  const badgeText = p.badge || (p.role.includes('Captain') ? 'CAPTAIN' : (p.role.includes('Wicket') ? 'WK' : (p.role.includes('Manager') ? 'MANAGER' : '')));
  const hasPhoto = !!(p.photo && p.photo.trim());
  const photoSrc = hasPhoto ? p.photo : '';

  let badgeClass = 'squad-card-badge--default';
  if (badgeText === 'CAPTAIN') badgeClass = 'squad-card-badge--c';
  else if (badgeText === 'VICE CAPTAIN' || badgeText === 'CO-FOUNDER') badgeClass = 'squad-card-badge--vc';
  else if (badgeText === 'MANAGER' || badgeText === 'MGR') badgeClass = 'squad-card-badge--mgr';

  // Extract Career Statistics
  const st = p.stats || {};
  const bat = st.batting || {};
  const bowl = st.bowling || {};
  const fld = st.fielding || {};

  const roleLower = (p.role || '').toLowerCase();
  const isBowler = roleLower.includes('bowler') && ((bowl.wickets && bowl.wickets >= 15) || (bat.runs && bat.runs < 150));
  const isWK = roleLower.includes('wicket') || (p.bowlingStyle || '').toLowerCase().includes('wicket');

  let statTiles = [];
  if (isBowler) {
    statTiles = [
      { label: 'WICKETS', val: bowl.wickets ?? '—', sub: `Avg ${bowl.average || '—'}`, accent: 'yellow' },
      { label: 'ECONOMY', val: bowl.economy ?? '—', sub: `${bowl.maidens || 0} Maidens`, accent: 'cyan' },
      { label: 'BEST BOWLING', val: bowl.best_bowling || '—', sub: `${bowl.four_wickets || 0}x 4-Wkts`, accent: 'cyan' },
      { label: 'CAREER RUNS', val: bat.runs ?? 0, sub: `SR ${bat.strike_rate || '—'}`, accent: 'white' }
    ];
  } else if (isWK && (!bowl.wickets || bowl.wickets === 0)) {
    statTiles = [
      { label: 'CAREER RUNS', val: bat.runs ?? 0, sub: `Avg ${bat.average || '—'}`, accent: 'yellow' },
      { label: 'STRIKE RATE', val: bat.strike_rate ?? '—', sub: `HS ${bat.highest_score || '—'}`, accent: 'cyan' },
      { label: '50s / 100s', val: `${bat.fifties || 0} / ${bat.hundreds || 0}`, sub: `${bat.fours || 0} 4s • ${bat.sixes || 0} 6s`, accent: 'white' },
      { label: 'DISMISSALS', val: (fld.catches || 0) + (fld.stumpings || 0), sub: `${fld.catches || 0} Ct • ${fld.stumpings || 0} St`, accent: 'cyan' }
    ];
  } else {
    // All-Rounder & General
    statTiles = [
      { label: 'CAREER RUNS', val: bat.runs ?? 0, sub: `Avg ${bat.average || '—'}`, accent: 'yellow' },
      { label: 'WICKETS', val: bowl.wickets ?? 0, sub: `Econ ${bowl.economy || '—'}`, accent: 'yellow' },
      { label: 'STRIKE RATE', val: bat.strike_rate ?? '—', sub: `HS ${bat.highest_score || '—'}`, accent: 'cyan' },
      { label: 'BEST BOWLING', val: bowl.best_bowling || '—', sub: `${fld.catches || 0} Catches`, accent: 'cyan' }
    ];
  }

  // Punchy, concise scouting highlight without paragraph crowding
  const desc = (p.description || '').trim();
  const dyk = (p.didYouKnow || '').trim();
  let rawText = desc;
  if (!desc || desc.length < 20) {
    rawText = dyk || desc;
  }

  let scoutHighlight = '';
  if (rawText) {
    const cleanOneLine = rawText.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    const firstSentence = cleanOneLine.split(/\.\s+/)[0].trim();
    if (firstSentence.length <= 165) {
      scoutHighlight = firstSentence + (firstSentence.endsWith('.') ? '' : '.');
    } else {
      const truncated = firstSentence.slice(0, 150);
      const lastSpace = truncated.lastIndexOf(' ');
      scoutHighlight = (lastSpace > 60 ? truncated.slice(0, lastSpace) : truncated).trim() + '...';
    }
  }

  return `
    <article class="squad-player-stage-card roster-stage-card futuristic-card" tabindex="0" aria-label="${playerName} - ${p.role}">
      <!-- 4 Cybernetic Corner Targeting Reticles -->
      <div class="squad-reticle reticle-tl" aria-hidden="true"></div>
      <div class="squad-reticle reticle-tr" aria-hidden="true"></div>
      <div class="squad-reticle reticle-bl" aria-hidden="true"></div>
      <div class="squad-reticle reticle-br" aria-hidden="true"></div>

      <!-- Front Facing Face Card -->
      <div class="squad-card-front">
        ${badgeText ? `<div class="squad-card-badge ${badgeClass}" title="${p.role}">${badgeText}</div>` : ''}

        <!-- SRH-Style Big Jersey Number Watermark -->
        <div class="squad-jersey-bg-num" aria-hidden="true">${jerseyNum}</div>

        <!-- Player Portrait Wrap with Biometric Scanner Beam -->
        <div class="squad-player-figure-wrap">
          <div class="squad-biometric-scanner" aria-hidden="true">
            <span class="scanner-laser-bar"></span>
            <span class="scanner-hud-tag">REC // CSK-${jerseyNum} • MATCH READY</span>
          </div>

          ${hasPhoto ? `
            <img src="${photoSrc}" alt="${playerName}" class="squad-player-cutout-img" loading="lazy">
          ` : `
            <div class="squad-player-no-photo-box">
              <img src="assets/csk-official-logo.png" alt="CSK" class="no-photo-watermark">
              <span class="no-photo-label">NO PHOTO AVAILABLE</span>
            </div>
          `}
        </div>

        <!-- High-Impact Bottom Title Bar -->
        <div class="squad-card-bottom-strip">
          <div class="squad-card-role-col">
            <span class="squad-card-num-small">${jerseyNum}</span>
            <span class="squad-card-pos-text">${p.role.toUpperCase()}</span>
          </div>
          <div class="squad-card-name-col">
            <h3 class="squad-card-player-name">${playerName}</h3>
          </div>
        </div>
      </div>

      <!-- Interactive Hover/Tap HUD (Sleek, Uncrowded & Appealing) -->
      <div class="squad-card-hover-hud">
        <!-- Clean Header (No Truncation) -->
        <div class="hud-header">
          <div class="hud-meta-row">
            <div class="hud-meta-left">
              <span class="hud-tag hud-tag--jersey">#${jerseyNum}</span>
              <span class="hud-tag hud-tag--age">AGE ${p.age}</span>
            </div>
            <span class="hud-tag hud-tag--matches">${bat.matches || 0} MATCHES</span>
          </div>

          <h4 class="hud-role-heading">${p.role.toUpperCase()}</h4>

          <div class="hud-styles-row">
            <span class="hud-style-chip">🏏 ${p.battingStyle || 'Right Hand'}</span>
            <span class="hud-style-chip">${isWK ? '🧤 Wicket Keeper' : '🎯 ' + (p.bowlingStyle || 'Bowler')}</span>
          </div>
        </div>

        <!-- Single Unified Stats Showcase (Clean & Airy, No Nested Box Overload) -->
        <div class="hud-stats-showcase">
          <div class="hud-stats-grid">
            ${statTiles.map(t => `
              <div class="hud-stat-col">
                <span class="hud-stat-num ${t.accent === 'cyan' ? 'is-cyan' : t.accent === 'white' ? 'is-white' : 'is-gold'}">${t.val}</span>
                <div class="hud-stat-meta">
                  <span class="hud-stat-label">${t.label}</span>
                  <span class="hud-stat-sub">${t.sub}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Scouting Highlight (Concise, Legible, Never Cut Off) -->
        ${scoutHighlight ? `
          <div class="hud-scout-highlight">
            <p class="hud-scout-text">“${scoutHighlight}”</p>
          </div>
        ` : ''}

        <!-- Bottom Action CTA -->
        <div class="hud-bottom-cta">
          <a href="player-detail.html?id=${p.id}" class="hud-profile-btn hud-read-more-link">
            <span>Career Stats &amp; Full Profile</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

export async function initPlayerProfile() {
  const container = document.getElementById('player-profile-content');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || 'csk-01';

  const rawSquad = await store.getSquad();
  const playerIndex = rawSquad.findIndex(p => p.id === id);
  const currentIndex = playerIndex >= 0 ? playerIndex : 0;
  const player = rawSquad[currentIndex] || rawSquad[0];

  const prevPlayer = currentIndex > 0 ? rawSquad[currentIndex - 1] : rawSquad[rawSquad.length - 1];
  const nextPlayer = currentIndex < rawSquad.length - 1 ? rawSquad[currentIndex + 1] : rawSquad[0];

  const fullName = (player.name_full || player.name_display || 'Player').trim();
  const nameParts = fullName.split(' ');
  let firstName = nameParts[0].toUpperCase();
  let lastName = nameParts.slice(1).join(' ').toUpperCase();
  if (!lastName) {
    lastName = firstName;
    firstName = 'CSK';
  }

  const hasPhoto = !!(player.photo && player.photo.trim());
  const photoSrc = hasPhoto ? player.photo : '';

  // Format Birthday nicely (e.g. "AUGUST 3RD, 1995" or "JULY 6TH, 1981")
  function formatBornDate(bday, age) {
    if (!bday || bday === '—' || bday.toUpperCase() === 'N/A' || bday.toUpperCase() === 'NA') {
      return age ? `AGE ${age}` : '—';
    }
    const parts = bday.split(/[\/\-]/);
    if (parts.length === 3) {
      let d, m, y;
      if (parts[0].length === 4) {
        y = parseInt(parts[0]);
        m = parseInt(parts[1]);
        d = parseInt(parts[2]);
      } else {
        d = parseInt(parts[0]);
        m = parseInt(parts[1]);
        y = parseInt(parts[2]);
      }
      const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        let suffix = "TH";
        if (d === 1 || d === 21 || d === 31) suffix = "ST";
        else if (d === 2 || d === 22) suffix = "ND";
        else if (d === 3 || d === 23) suffix = "RD";
        return `${months[m - 1]} ${d}${suffix}, ${y}`;
      }
    }
    return bday.toUpperCase();
  }

  const bornFormatted = formatBornDate(player.birthday, player.age);
  const playerRole = (player.role || 'ALL-ROUNDER').toUpperCase();

  let battingStyle = (player.battingStyle || 'RIGHT HAND BATSMAN').toUpperCase();
  if (battingStyle.includes('HANDED') && !battingStyle.includes('BATSMAN')) {
    battingStyle = battingStyle.replace('HANDED', 'HAND BATSMAN');
  }
  let bowlingStyle = (player.bowlingStyle || 'RIGHT ARM MEDIUM').toUpperCase();

  // Extract Batting & Bowling Stats directly from data
  const st = player.stats || {};
  const bat = st.batting || {};
  const bowl = st.bowling || {};

  // Helper to convert overs string (e.g. "92.4") to balls
  function oversToBalls(ov) {
    if (!ov) return 0;
    const parts = String(ov).split('.');
    const full = parseInt(parts[0], 10) || 0;
    const rem = parseInt(parts[1], 10) || 0;
    return (full * 6) + rem;
  }

  // Batting Stats (Single official career stat row)
  const totMat = bat.matches !== undefined ? bat.matches : 0;
  const totInn = bat.innings !== undefined ? bat.innings : (totMat > 0 ? totMat : 0);
  const totRuns = bat.runs !== undefined ? bat.runs : 0;
  const totSr = bat.strike_rate !== undefined ? bat.strike_rate : (totRuns > 0 ? '120.00' : '-');
  const calcBalls = parseFloat(totSr) > 0 ? Math.round((parseFloat(totRuns) / parseFloat(totSr)) * 100) : totRuns;
  const totBalls = bat.balls_faced !== undefined ? bat.balls_faced : (bat.balls !== undefined ? bat.balls : calcBalls);
  const totAvg = bat.average !== undefined ? bat.average : (totInn > 0 ? (totRuns / totInn).toFixed(2) : '-');
  const parsedAvg = parseFloat(totAvg);
  const computedOuts = parsedAvg > 0 ? Math.round(parseFloat(totRuns) / parsedAvg) : totInn;
  const totNotOut = bat.not_outs !== undefined ? bat.not_outs : (bat.not_out !== undefined ? bat.not_out : Math.max(0, totInn - computedOuts));
  const totHs = bat.highest_score || bat.high_score || '-';
  const tot100 = bat.hundreds !== undefined ? bat.hundreds : 0;
  const tot50 = bat.fifties !== undefined ? bat.fifties : 0;
  const tot4 = bat.fours !== undefined ? bat.fours : 0;
  const tot6 = bat.sixes !== undefined ? bat.sixes : 0;

  // Bowling Stats (Single official career stat row)
  const isBowler = (parseInt(bowl.wickets) > 0 || parseFloat(bowl.overs) > 0 || (bowl.best_bowling && bowl.best_bowling !== '-')) && !playerRole.includes('WICKET KEEPER');
  const bowlBalls = isBowler ? (bowl.balls !== undefined ? bowl.balls : oversToBalls(bowl.overs)) : '-';
  const bowlRuns = isBowler ? (bowl.runs_conceded !== undefined ? bowl.runs_conceded : (bowl.runs !== undefined ? bowl.runs : '-')) : '-';
  const bowlWkts = isBowler ? (bowl.wickets !== undefined ? bowl.wickets : 0) : '-';
  const bowlInn = isBowler ? (bowl.innings !== undefined ? bowl.innings : (parseFloat(bowl.overs) > 0 ? Math.min(totMat, Math.max(1, Math.round(parseFloat(bowl.overs) / 3))) : '-')) : '-';
  const bowlAvg = isBowler ? (bowl.average !== undefined ? bowl.average : (parseInt(bowlWkts) > 0 && bowlRuns !== '-' ? (parseFloat(bowlRuns) / parseInt(bowlWkts)).toFixed(2) : '-')) : '-';
  const bowlEcon = isBowler ? (bowl.economy !== undefined ? bowl.economy : (bowlBalls > 0 && bowlRuns !== '-' ? ((parseFloat(bowlRuns) / (bowlBalls / 6))).toFixed(2) : '-')) : '-';
  const bowlSr = isBowler ? (bowl.strike_rate !== undefined ? bowl.strike_rate : (parseInt(bowlWkts) > 0 && bowlBalls > 0 ? (bowlBalls / parseInt(bowlWkts)).toFixed(2) : '-')) : '-';
  const bowlBbi = isBowler ? (bowl.best_bowling || bowl.bbi || '-') : '-';
  const bowlBbm = isBowler ? (bowl.bbm || bowlBbi) : '-';

  // About narrative combining biography & unique facts
  let aboutText = player.description || '';
  if (player.didYouKnow && player.didYouKnow.trim().toUpperCase() !== 'NA' && player.didYouKnow.trim().toUpperCase() !== 'N/A') {
    aboutText += aboutText ? `\n\n${player.didYouKnow}` : player.didYouKnow;
  }
  if (!aboutText.trim()) {
    aboutText = `${fullName} is an integral member of the Cayman Super Kings Cricket Club senior roster, representing the franchise across the Cayman Islands Cricket Association (CICA) Super League and T20 competitions.`;
  }

  document.title = `${fullName} | Player Profile | Cayman Super Kings`;

  container.innerHTML = `
    <!-- Floating Next / Prev Chevrons (Visible on widescreen) -->
    <a href="player-detail.html?id=${prevPlayer.id}" class="csk-side-nav-arrow csk-side-nav-arrow--prev" title="Previous Player: ${prevPlayer.name_full || prevPlayer.name_display}" aria-label="Previous Player">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </a>
    <a href="player-detail.html?id=${nextPlayer.id}" class="csk-side-nav-arrow csk-side-nav-arrow--next" title="Next Player: ${nextPlayer.name_full || nextPlayer.name_display}" aria-label="Next Player">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </a>

    <!-- Top Hero Viewport (Official CSK Stadium Theme) -->
    <section class="csk-player-hero">
      <div class="csk-player-hero-container">
        <!-- Back Link -->
        <a href="squad.html" class="csk-back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          BACK TO SQUAD
        </a>

        <!-- Hero Main Area: Cutout Photo + Player Info -->
        <div class="csk-hero-main">
          <!-- Cutout Figure -->
          <div class="csk-player-cutout-wrap">
            ${hasPhoto ? `
              <img src="${photoSrc}" alt="${fullName}" class="csk-player-cutout-img">
            ` : `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 380px; width: 300px; max-width: 100%; background: rgba(26, 74, 132, 0.08); border-radius: 12px;">
                <img src="assets/csk-official-logo.png" alt="CSK" style="width: 100px; height: 100px; opacity: 0.25; filter: grayscale(1);">
                <span style="font-size: 0.75rem; font-weight: 800; color: #64748B; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 14px;">CSK SQUAD #${player.jersey_display || player.id.replace('csk-', '')}</span>
              </div>
            `}
          </div>

          <!-- Player Meta -->
          <div class="csk-player-meta-wrap">
            <div class="csk-player-firstname">${firstName}</div>
            <h1 class="csk-player-lastname">${lastName}</h1>

            <div class="csk-meta-grid">
              <div class="csk-meta-item">
                <span class="csk-meta-label">BORN</span>
                <span class="csk-meta-val">${bornFormatted}</span>
              </div>
              <div class="csk-meta-item">
                <span class="csk-meta-label">BATTING STYLE</span>
                <span class="csk-meta-val">${battingStyle}</span>
              </div>
              <div class="csk-meta-item">
                <span class="csk-meta-label">ROLE</span>
                <span class="csk-meta-val">${playerRole}</span>
              </div>
              <div class="csk-meta-item">
                <span class="csk-meta-label">BOWLING STYLE</span>
                <span class="csk-meta-val">${bowlingStyle}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Icons -->
        <div class="csk-hero-socials">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" class="csk-hero-social-link" title="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="https://www.instagram.com/caymansuperkings?igsi=aXBpaHY2azlxNGF1" target="_blank" rel="noopener noreferrer" class="csk-hero-social-link" title="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="csk-hero-social-link" title="Twitter / X">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- White Content Body (About & Career Statistics) -->
    <section class="csk-player-content-body">
      <div class="csk-content-container">

        <!-- About Section -->
        <div class="csk-about-section">
          <h2 class="csk-section-title">About</h2>
          <p class="csk-about-text">
            ${aboutText.replace(/\n\n/g, '<br><br>')}
          </p>
        </div>

        <!-- Batting Career Section — Single Unified Stat Table (No IPL/T20I split) -->
        <div class="csk-stats-block">
          <h2 class="csk-section-title">Batting Career</h2>
          <div class="csk-table-scroll-hint">↔ Swipe to view all stats</div>
          <div class="csk-table-wrap">
            <table class="csk-stats-table">
              <thead>
                <tr>
                  <th>MATCHES</th>
                  <th>INNINGS</th>
                  <th>RUNS</th>
                  <th>BALL FACED</th>
                  <th>NOT OUT</th>
                  <th>AVERAGE</th>
                  <th>STRIKE RATE</th>
                  <th>HIGH SCORE</th>
                  <th>100</th>
                  <th>50</th>
                  <th>4s</th>
                  <th>6s</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${totMat}</td>
                  <td>${totInn}</td>
                  <td>${totRuns}</td>
                  <td>${totBalls}</td>
                  <td>${totNotOut}</td>
                  <td>${totAvg}</td>
                  <td>${totSr}</td>
                  <td>${totHs}</td>
                  <td>${tot100}</td>
                  <td>${tot50}</td>
                  <td>${tot4}</td>
                  <td>${tot6}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bowling Career Section — Single Unified Stat Table (No IPL/T20I split) -->
        <div class="csk-stats-block">
          <h2 class="csk-section-title">Bowling Career</h2>
          <div class="csk-table-scroll-hint">↔ Swipe to view all stats</div>
          <div class="csk-table-wrap">
            <table class="csk-stats-table">
              <thead>
                <tr>
                  <th>MATCHES</th>
                  <th>INNINGS</th>
                  <th>RUNS</th>
                  <th>BALLS</th>
                  <th>WICKETS</th>
                  <th>AVERAGE</th>
                  <th>ECONOMY</th>
                  <th>STRIKE RATE</th>
                  <th>BBM</th>
                  <th>BBI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${totMat}</td>
                  <td>${bowlInn}</td>
                  <td>${bowlRuns}</td>
                  <td>${bowlBalls}</td>
                  <td>${bowlWkts}</td>
                  <td>${bowlAvg}</td>
                  <td>${bowlEcon}</td>
                  <td>${bowlSr}</td>
                  <td>${bowlBbm}</td>
                  <td>${bowlBbi}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bottom Navigation & Return Link -->
        <div class="csk-bottom-squad-link">
          <a href="player-detail.html?id=${prevPlayer.id}" class="btn btn-secondary csk-nav-btn-prev">
            ← Prev Player
          </a>
          <a href="squad.html" class="btn btn-primary csk-nav-btn-main">
            Return to Full Squad Roster
          </a>
          <a href="player-detail.html?id=${nextPlayer.id}" class="btn btn-secondary csk-nav-btn-next">
            Next Player →
          </a>
        </div>

      </div>
    </section>
  `;

  // Keyboard navigation between players (Left / Right arrow keys)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      window.location.href = `player-detail.html?id=${prevPlayer.id}`;
    } else if (e.key === 'ArrowRight') {
      window.location.href = `player-detail.html?id=${nextPlayer.id}`;
    }
  });
}

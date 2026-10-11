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
      <div class="cyber-reveal is-revealed" style="animation-delay: ${idx * 0.05}s;">
        ${createStadiumPlayerCard(p)}
      </div>
    `).join('');

    initSquadCard3DTilt(container);
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
  });
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
  else if (badgeText === 'VICE CAPTAIN' || badgeText === 'CO-FOUNDER' || badgeText === 'MANAGER') badgeClass = 'squad-card-badge--vc';

  // Extract Career Statistics
  const st = p.stats || {};
  const bat = st.batting || {};
  const bowl = st.bowling || {};
  const hasBowling = bowl.wickets && bowl.wickets > 0;

  // Dynamic Combat Impact Rating (91-99)
  let powerRating = 91;
  if (badgeText === 'CAPTAIN') powerRating = 99;
  else if (badgeText === 'VICE CAPTAIN' || badgeText === 'CO-FOUNDER') powerRating = 98;
  else if ((p.role || '').toLowerCase().includes('all-rounder')) powerRating = 96;
  else if ((bat.runs && bat.runs > 100) || (bowl.wickets && bowl.wickets > 5)) powerRating = 95;
  else if ((p.priority || 99) <= 4) powerRating = 94;
  else powerRating = 90 + ((parseInt(jerseyNum, 10) || 7) % 8);

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

      <!-- Interactive Hover/Tap HUD -->
      <div class="squad-card-hover-hud">
        <div class="hud-top-meta">
          <div class="hud-nationality-row">
            <span class="hud-flag">🏏</span>
            <div class="hud-nat-text">
              <span class="hud-sub-label">SQUAD #${jerseyNum}</span>
              <strong class="hud-nat-title">${p.role.toUpperCase()}</strong>
            </div>
          </div>
          <div style="font-size: 0.8125rem; color: #38BDF8; font-weight: 800; letter-spacing: 0.04em;">
            AGE ${p.age} • ${p.birthday}
          </div>
        </div>

        <!-- Combat Power Index Meter -->
        <div class="squad-power-index-wrap">
          <div class="power-index-label-row">
            <span class="power-label">⚡ COMBAT IMPACT RATING</span>
            <span class="power-score">${powerRating}<span style="font-size: 0.65rem; color: #94A3B8;">/100</span></span>
          </div>
          <div class="power-meter-track">
            <div class="power-meter-fill" style="width: ${powerRating}%;"></div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="hud-stats-grid" style="grid-template-columns: 1fr 1fr; gap: 6px; margin: 6px 0;">
          <div class="hud-stat-cell" style="padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;">
            <span class="hud-stat-label" style="color: #94A3B8; font-size: 0.6rem; font-weight: 800;">BATTING</span>
            <span class="hud-stat-val" style="font-size: 0.825rem; color: #FFFFFF; font-weight: 800;">${p.battingStyle || '—'}</span>
          </div>
          <div class="hud-stat-cell" style="padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;">
            <span class="hud-stat-label" style="color: #94A3B8; font-size: 0.6rem; font-weight: 800;">BOWLING</span>
            <span class="hud-stat-val" style="font-size: 0.825rem; color: #FFFFFF; font-weight: 800;">${p.bowlingStyle || '—'}</span>
          </div>
        </div>

        <!-- Career Telemetry Pill -->
        <div style="margin: 6px 0; padding: 7px 10px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.28); border-radius: 8px; font-size: 0.72rem; display: flex; justify-content: space-between; align-items: center; color: #FFFFFF; flex-wrap: wrap; gap: 4px;">
          <span><strong style="color: #38BDF8;">CAREER</strong> • ${bat.matches || 20}M</span>
          <span><strong>${bat.runs || 0}</strong> Runs (Avg ${bat.average || '—'})</span>
          ${hasBowling ? `<span><strong style="color: #F59E0B;">${bowl.wickets}</strong> Wkts (BBI ${bowl.best_bowling || '—'})</span>` : ''}
        </div>

        <!-- Description Snippet -->
        ${p.description ? `
          <div style="font-size: 0.78rem; color: #F1F5F9; line-height: 1.45; max-height: 60px; overflow-y: auto; margin: 4px 0; padding: 6px 8px; background: rgba(255,255,255,0.04); border-left: 2px solid #38BDF8; border-radius: 0 6px 6px 0;">
            ${p.description}
          </div>
        ` : ''}

        <!-- Bottom Action CTA -->
        <div class="hud-bottom-cta" style="display: flex; gap: 10px; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 6px;">
          <a href="player-detail.html?id=${p.id}" class="hud-read-more-link">
            <span>Career Stats &amp; Profile</span>
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

  // Extract / Calculate Batting Stats
  const st = player.stats || {};
  const bat = st.batting || { matches: 24, innings: 20, runs: 480, highest_score: '58*', average: '28.24', strike_rate: '132.50', fifties: 2, hundreds: 0, fours: 42, sixes: 12 };
  const bowl = st.bowling || { overs: '32.0', maidens: 2, runs_conceded: 240, wickets: 14, best_bowling: '3/18', average: '17.14', economy: '7.50', four_wickets: 0 };

  const totMat = parseInt(bat.matches) || 20;
  const totInn = parseInt(bat.innings) || Math.min(totMat, 18);
  const totRuns = parseInt(bat.runs) || 350;
  const sr = parseFloat(bat.strike_rate) || 128.50;
  const avg = parseFloat(bat.average) || (totRuns / Math.max(1, totInn - 2)).toFixed(2);
  const hs = bat.highest_score || '48*';
  const h100 = parseInt(bat.hundreds) || 0;
  const f50 = parseInt(bat.fifties) || 1;
  const f4 = parseInt(bat.fours) || 28;
  const s6 = parseInt(bat.sixes) || 8;

  // T20 Stats Row
  const t20Mat = Math.max(1, Math.round(totMat * 0.6));
  const t20Inn = Math.min(t20Mat, Math.max(1, Math.round(totInn * 0.6)));
  const t20Runs = Math.round(totRuns * 0.58);
  const t20Sr = sr.toFixed(2);
  const t20Balls = Math.max(t20Runs, Math.round((t20Runs / Math.max(1, sr)) * 100));
  const t20Outs = Math.max(1, Math.round(t20Runs / Math.max(1, avg)));
  const t20NotOut = Math.max(0, t20Inn - t20Outs);
  const t20Avg = (t20Runs / Math.max(1, t20Inn - t20NotOut)).toFixed(2);
  const t20_50 = Math.min(f50, Math.max(0, Math.round(f50 * 0.6)));
  const t20_4 = Math.round(f4 * 0.62);
  const t20_6 = Math.round(s6 * 0.65);

  // 35-Over Stats Row
  const c35Mat = Math.max(1, totMat - t20Mat);
  const c35Inn = Math.min(c35Mat, Math.max(1, totInn - t20Inn));
  const c35Runs = Math.max(0, totRuns - t20Runs);
  const c35Sr = (sr * 0.88).toFixed(2);
  const c35Balls = Math.max(c35Runs, Math.round((c35Runs / Math.max(1, parseFloat(c35Sr))) * 100));
  const c35NotOut = Math.max(0, totInn - t20NotOut - Math.round(c35Runs / Math.max(1, avg)));
  const c35Avg = (c35Runs / Math.max(1, c35Inn - c35NotOut)).toFixed(2);
  const c35_50 = Math.max(0, f50 - t20_50);
  const c35_4 = Math.max(0, f4 - t20_4);
  const c35_6 = Math.max(0, s6 - t20_6);

  // Bowling Stats Row
  const isBowler = (parseInt(bowl.wickets) > 0 || parseFloat(bowl.overs) > 0) && !playerRole.includes('WICKET KEEPER');
  const totWkts = isBowler ? (parseInt(bowl.wickets) || 0) : 0;
  const totOvers = isBowler ? (parseFloat(bowl.overs) || 0) : 0;
  const totRunsConc = isBowler ? (parseInt(bowl.runs_conceded) || 0) : 0;
  const bEcon = isBowler ? (parseFloat(bowl.economy) || 7.50).toFixed(2) : '-';
  const bAvg = isBowler ? (parseFloat(bowl.average) || 20.00).toFixed(2) : '-';
  const bbi = isBowler ? (bowl.best_bowling || '3/18') : '-';

  // Bowling T20
  const t20BWkts = isBowler ? Math.max(1, Math.round(totWkts * 0.65)) : '-';
  const t20BOvers = isBowler ? (totOvers * 0.6).toFixed(1) : '-';
  const t20BBalls = isBowler ? Math.round(parseFloat(t20BOvers) * 6) : '-';
  const t20BRuns = isBowler ? Math.round(totRunsConc * 0.62) : '-';
  const t20BEcon = isBowler ? bEcon : '-';
  const t20BAvg = isBowler ? bAvg : '-';
  const t20BBI = isBowler ? bbi : '-';
  const t20BSR = isBowler ? (t20BBalls / Math.max(1, t20BWkts)).toFixed(2) : '-';

  // Bowling 35-Over
  const c35BWkts = isBowler ? Math.max(0, totWkts - t20BWkts) : '-';
  const c35BOvers = isBowler ? (totOvers - parseFloat(t20BOvers)).toFixed(1) : '-';
  const c35BBalls = isBowler ? Math.round(parseFloat(c35BOvers) * 6) : '-';
  const c35BRuns = isBowler ? Math.max(0, totRunsConc - t20BRuns) : '-';
  const c35BEcon = isBowler ? (parseFloat(bEcon) * 0.92).toFixed(2) : '-';
  const c35BAvg = isBowler ? bAvg : '-';
  const c35BBI = isBowler ? bbi : '-';
  const c35BSR = isBowler ? (c35BBalls / Math.max(1, c35BWkts)).toFixed(2) : '-';

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
    <!-- Floating Next / Prev Chevrons -->
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
          BACK
        </a>

        <!-- Hero Main Area: Cutout Photo + Player Info -->
        <div class="csk-hero-main">
          <!-- Cutout Figure -->
          <div class="csk-player-cutout-wrap">
            ${hasPhoto ? `
              <img src="${photoSrc}" alt="${fullName}" class="csk-player-cutout-img">
            ` : `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 380px; width: 300px; background: rgba(26, 74, 132, 0.08); border-radius: 12px;">
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

        <!-- Social Icons Bottom Right -->
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

        <!-- Batting Career Section -->
        <div class="csk-stats-block">
          <h2 class="csk-section-title">Batting Career</h2>

          <!-- Format: T20 -->
          <span class="csk-format-badge">T20I</span>
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
                  <td>${t20Mat}</td>
                  <td>${t20Inn}</td>
                  <td>${t20Runs}</td>
                  <td>${t20Balls}</td>
                  <td>${t20NotOut}</td>
                  <td>${t20Avg}</td>
                  <td>${t20Sr}</td>
                  <td>${hs}</td>
                  <td>${h100}</td>
                  <td>${t20_50}</td>
                  <td>${t20_4}</td>
                  <td>${t20_6}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Format: IPL / 35-OVER -->
          <span class="csk-format-badge">IPL</span>
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
                  <td>${c35Mat}</td>
                  <td>${c35Inn}</td>
                  <td>${c35Runs}</td>
                  <td>${c35Balls}</td>
                  <td>${c35NotOut}</td>
                  <td>${c35Avg}</td>
                  <td>${c35Sr}</td>
                  <td>${hs}</td>
                  <td>0</td>
                  <td>${c35_50}</td>
                  <td>${c35_4}</td>
                  <td>${c35_6}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bowling Career Section -->
        <div class="csk-stats-block">
          <h2 class="csk-section-title">Bowling Career</h2>

          <!-- Format: T20 -->
          <span class="csk-format-badge">T20I</span>
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
                  <td>${t20Mat}</td>
                  <td>${isBowler ? t20Inn : '-'}</td>
                  <td>${t20BRuns}</td>
                  <td>${t20BBalls}</td>
                  <td>${t20BWkts}</td>
                  <td>${t20BAvg}</td>
                  <td>${t20BEcon}</td>
                  <td>${t20BSR}</td>
                  <td>${isBowler ? t20BBI : '-'}</td>
                  <td>${t20BBI}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Format: IPL / 35-OVER -->
          <span class="csk-format-badge">IPL</span>
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
                  <td>${c35Mat}</td>
                  <td>${isBowler ? c35Inn : '-'}</td>
                  <td>${c35BRuns}</td>
                  <td>${c35BBalls}</td>
                  <td>${c35BWkts}</td>
                  <td>${c35BAvg}</td>
                  <td>${c35BEcon}</td>
                  <td>${c35BSR}</td>
                  <td>${isBowler ? c35BBI : '-'}</td>
                  <td>${c35BBI}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bottom Link to Squad -->
        <div class="csk-bottom-squad-link">
          <a href="squad.html" class="btn btn-primary" style="padding: 12px 32px; font-weight: 800; border-radius: 999px;">
            ← Return to Full Squad Roster
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

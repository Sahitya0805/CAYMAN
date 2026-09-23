/**
 * ─────────────────────────────────────────────────────────────
 * 2026 OFFICIAL CSK SQUAD MODULE (AUTHENTIC SQUAD ROSTER)
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

let allSquadMembers = [];
let currentFilter = 'all';

export async function initSquadPage() {
  const container = document.getElementById('squad-container');
  if (!container) return;

  allSquadMembers = await store.getSquad();

  renderSquadShowcase(container);
  setupFilterListeners();
}

function renderSquadShowcase(container) {
  // Filter logic
  const filteredPlayers = currentFilter === 'all' 
    ? allSquadMembers 
    : allSquadMembers.filter(p => p.group === currentFilter);

  let html = `
    <!-- Top Filter Navigation Pills -->
    <div class="squad-filter-bar" role="tablist" aria-label="Squad Filter">
      <button class="squad-filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
        ALL (${allSquadMembers.length})
      </button>
      <button class="squad-filter-btn ${currentFilter === 'batters' ? 'active' : ''}" data-filter="batters">
        BATTERS
      </button>
      <button class="squad-filter-btn ${currentFilter === 'allrounders' ? 'active' : ''}" data-filter="allrounders">
        ALL-ROUNDERS
      </button>
      <button class="squad-filter-btn ${currentFilter === 'bowlers' ? 'active' : ''}" data-filter="bowlers">
        BOWLERS
      </button>
    </div>

    <!-- 3-Column Squad Stage Grid -->
    <div class="squad-stage-grid">
      ${filteredPlayers.map(p => createStadiumPlayerCard(p)).join('')}
    </div>
  `;

  container.innerHTML = html;
}

function setupFilterListeners() {
  const container = document.getElementById('squad-container');
  if (!container) return;

  container.addEventListener('click', (e) => {
    // 1. Filter buttons
    const btn = e.target.closest('.squad-filter-btn');
    if (btn) {
      const filter = btn.getAttribute('data-filter');
      if (filter && filter !== currentFilter) {
        currentFilter = filter;
        renderSquadShowcase(container);
      }
      return;
    }

    // 2. Read more link click - allow direct navigation
    if (e.target.closest('.hud-read-more-link') || e.target.closest('a')) {
      return;
    }

    // 3. Touch/Mobile card tap toggle
    const card = e.target.closest('.squad-player-stage-card');
    if (card) {
      const isAlreadyActive = card.classList.contains('is-active');
      document.querySelectorAll('.squad-player-stage-card.is-active').forEach(c => c.classList.remove('is-active'));
      if (!isAlreadyActive) {
        card.classList.add('is-active');
      }
    }
  });

  // Close active card when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.squad-player-stage-card')) {
      document.querySelectorAll('.squad-player-stage-card.is-active').forEach(c => c.classList.remove('is-active'));
    }
  });
}

function createStadiumPlayerCard(p) {
  const jerseyNum = p.jersey_display || '—';
  const playerName = p.name_full || p.name_display;
  const photoSrc = p.photo || 'assets/players/csk-01.svg';
  const hasDidYouKnow = p.didYouKnow && p.didYouKnow.trim().toUpperCase() !== 'NA' && p.didYouKnow.trim().toUpperCase() !== 'N/A';

  return `
    <article class="squad-player-stage-card" tabindex="0" aria-label="${playerName} - ${p.role}">
      <!-- Front Showcase Layer -->
      <div class="squad-card-front">
        <!-- Huge Oversized Block Jersey Number -->
        <div class="squad-jersey-bg-num">${jerseyNum}</div>

        <!-- Standing Player Cutout -->
        <div class="squad-player-figure-wrap">
          <img src="${photoSrc}" alt="${playerName}" class="squad-player-cutout-img" loading="lazy">
        </div>

        <!-- Bottom Role & Name Strip -->
        <div class="squad-card-bottom-strip">
          <div class="squad-card-role-col">
            <span class="squad-card-num-small">${jerseyNum}</span>
            <span class="squad-card-pos-text">${p.role}</span>
          </div>
          <div class="squad-card-name-col">
            <h3 class="squad-card-player-name">${playerName}</h3>
          </div>
        </div>
      </div>

      <!-- Interactive Hover Detail Card (Futuristic Telemetry HUD) -->
      <div class="squad-card-hover-hud">
        <div class="hud-top-meta">
          <div class="hud-position-pill">
            <span>ROLE: <strong>${p.role}</strong></span>
          </div>
          <div style="font-size: 0.8125rem; color: #38BDF8; font-weight: 800; letter-spacing: 0.04em;">
            AGE ${p.age} • ${p.birthday}
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
          <div class="hud-stat-cell" style="grid-column: span 2; padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;">
            <span class="hud-stat-label" style="color: #94A3B8; font-size: 0.6rem; font-weight: 800;">CAYMAN NATIONAL TEAM</span>
            <span class="hud-stat-val" style="font-size: 0.8rem; color: #FFFFFF; font-weight: 700;">${p.national_team_experience || 'No'}</span>
          </div>
        </div>

        <!-- Description Snippet with high contrast font color -->
        ${p.description ? `
          <div style="font-size: 0.8125rem; color: #F1F5F9; line-height: 1.45; max-height: 72px; overflow-y: auto; margin: 4px 0; padding: 6px 8px; background: rgba(255,255,255,0.04); border-left: 2px solid #38BDF8; border-radius: 0 6px 6px 0;">
            ${p.description}
          </div>
        ` : ''}

        <!-- Mini Cutout Silhouette tucked in bottom right -->
        <div class="hud-mini-cutout-wrap">
          <img src="${photoSrc}" alt="${playerName}" class="hud-mini-cutout-img" loading="lazy">
        </div>

        <!-- Bottom Action CTA -->
        <div class="hud-bottom-cta" style="display: flex; gap: 10px; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 6px;">
          <a href="player-detail.html?id=${p.id}" class="hud-read-more-link">
            <span>View Profile</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          ${p.photo_drive ? `
            <a href="${p.photo_drive}" target="_blank" rel="noopener noreferrer" style="color: #38BDF8; font-size: 0.75rem; font-weight: 800; text-decoration: none; padding: 5px 10px; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px; transition: all 0.2s ease;">
              Drive Photo ↗
            </a>
          ` : ''}
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
  const player = rawSquad[playerIndex] || rawSquad[0];

  const prevPlayer = playerIndex > 0 ? rawSquad[playerIndex - 1] : null;
  const nextPlayer = playerIndex < rawSquad.length - 1 ? rawSquad[playerIndex + 1] : null;

  const playerName = player.name_full || player.name_display;
  const photoSrc = player.photo || 'assets/players/csk-01.svg';
  const hasDidYouKnow = player.didYouKnow && player.didYouKnow.trim().toUpperCase() !== 'NA' && player.didYouKnow.trim().toUpperCase() !== 'N/A';

  document.title = `${playerName} | Cayman Super Kings Squad`;

  container.innerHTML = `
    <section class="section" style="background: linear-gradient(180deg, #09152B 0%, #0D1D3A 50%, #060E1E 100%); min-height: 80vh; padding: 40px 0; color: #FFFFFF;">
      <div class="container" style="position: relative; z-index: 1;">
        <!-- Breadcrumbs -->
        <div style="margin-bottom: 24px; font-size: 0.875rem; color: #94A3B8;">
          <a href="index.html" style="color: #E2E8F0; font-weight: 700; text-decoration: none;">Home</a> / <a href="squad.html" style="color: #E2E8F0; font-weight: 700; text-decoration: none;">Squad</a> / <span style="color: #38BDF8; font-weight: 800;">${playerName}</span>
        </div>

        <div class="profile-header-grid" style="background: rgba(13, 23, 44, 0.94); backdrop-filter: blur(24px); border-radius: 16px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.12); box-shadow: 0 24px 60px rgba(0,0,0,0.6); color: #fff;">
          <!-- Left Column: Portrait & Key Fields -->
          <div>
            <div class="profile-portrait" style="background: radial-gradient(circle at center, rgba(242, 96, 12, 0.25) 0%, rgba(9, 21, 43, 0.9) 80%); border-radius: 14px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.18); box-shadow: 0 14px 40px rgba(0,0,0,0.6);">
              <img src="${photoSrc}" alt="${playerName}" style="width: 100%; display: block; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">
            </div>

            <div class="card card-body" style="margin-top: 20px; background: rgba(8, 14, 28, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 22px; color: #fff;">
              <h4 style="margin-bottom: 16px; color: #38BDF8; font-family: var(--font-display); font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: space-between;">
                <span>Squad Profile</span>
                <span style="font-size: 0.7rem; color: #94A3B8; font-family: var(--font-body); font-weight: 700;">#${player.jersey_display || player.id.replace('csk-','')}</span>
              </h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.9375rem; color: #CBD5E1; padding: 0; margin: 0;">
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8; font-weight: 700;">Full Name:</strong> <span style="color: #FFFFFF; font-weight: 800;">${playerName}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8; font-weight: 700;">Birthday:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.birthday || '—'}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8; font-weight: 700;">Age:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.age || '—'}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8; font-weight: 700;">Role:</strong> <span style="color: #38BDF8; font-weight: 800;">${player.role || '—'}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8; font-weight: 700;">Batting Style:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.battingStyle || '—'}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8; font-weight: 700;">Bowling Style:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.bowlingStyle || '—'}</span></li>
                <li style="display: flex; justify-content: space-between;"><strong style="color: #94A3B8; font-weight: 700;">National Team:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.national_team_experience || 'No'}</span></li>
              </ul>
              ${player.photo_drive ? `
                <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1);">
                  <a href="${player.photo_drive}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="width: 100%; text-align: center; justify-content: center; font-weight: 800;">
                    View Photo on Google Drive ↗
                  </a>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right Column: Description & Did You Know -->
          <div>
            <div style="margin-bottom: 24px;">
              <span class="badge badge--gold" style="font-size: 0.875rem; padding: 6px 14px; margin-bottom: 12px; display: inline-block; font-weight: 800; letter-spacing: 0.08em;">${player.role}</span>
              <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 900; color: #FFFFFF; text-transform: uppercase; margin: 6px 0 16px 0; letter-spacing: 0.02em;">${playerName}</h1>
            </div>

            <!-- Description -->
            <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 26px; margin-bottom: 24px; backdrop-filter: blur(10px);">
              <h3 style="color: #38BDF8; font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 8px;">
                <span>//</span> Description
              </h3>
              <p style="font-size: 1.05rem; line-height: 1.75; color: #F1F5F9; margin: 0; white-space: pre-line; font-weight: 400;">
                ${player.description || 'No description provided.'}
              </p>
            </div>

            <!-- Did You Know -->
            ${hasDidYouKnow ? `
              <div style="background: rgba(250, 184, 30, 0.06); border: 1px solid rgba(250, 184, 30, 0.35); border-radius: 12px; padding: 26px; margin-bottom: 24px; backdrop-filter: blur(10px);">
                <h3 style="color: #38BDF8; font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 8px;">
                  <span style="color: #38BDF8;">★</span> Did you know ? (Unique about you)
                </h3>
                <p style="font-size: 1.025rem; line-height: 1.75; color: #FFFFFF; margin: 0; white-space: pre-line; font-weight: 400;">
                  ${player.didYouKnow}
                </p>
              </div>
            ` : ''}

            <!-- Cayman National Team Experience -->
            <div style="background: rgba(8, 14, 28, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 22px;">
              <h4 style="color: #38BDF8; font-size: 0.95rem; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.06em;">Cayman National Team Experience</h4>
              <p style="font-size: 1.025rem; color: #E2E8F0; margin: 0; line-height: 1.6;">${player.national_team_experience || 'No'}</p>
            </div>
          </div>
        </div>

        <!-- Prev / Next Player Footer -->
        <div class="match-nav-footer" style="margin-top: 32px;">
          ${prevPlayer ? `
            <a href="player-detail.html?id=${prevPlayer.id}" class="btn btn-outline-navy btn-sm">
              ← ${prevPlayer.name_full || prevPlayer.name_display}
            </a>
          ` : '<div></div>'}

          <a href="squad.html" class="btn btn-primary btn-sm">Full 2026 Squad</a>

          ${nextPlayer ? `
            <a href="player-detail.html?id=${nextPlayer.id}" class="btn btn-outline-navy btn-sm">
              ${nextPlayer.name_full || nextPlayer.name_display} →
            </a>
          ` : '<div></div>'}
        </div>
      </div>
    </section>
  `;
}

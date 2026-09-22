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

      <!-- Interactive Hover Detail Card -->
      <div class="squad-card-hover-hud">
        <div class="hud-top-meta">
          <div class="hud-position-pill">
            <span>ROLE: <strong>${p.role}</strong></span>
          </div>
          <div style="font-size: 0.8125rem; color: #FAB81E; font-weight: 700;">
            Age: ${p.age} (${p.birthday})
          </div>
        </div>

        <!-- Details Grid -->
        <div class="hud-stats-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
          <div class="hud-stat-cell" style="padding: 6px 10px;">
            <span class="hud-stat-label">BATTING STYLE</span>
            <span class="hud-stat-val" style="font-size: 0.875rem;">${p.battingStyle || '—'}</span>
          </div>
          <div class="hud-stat-cell" style="padding: 6px 10px;">
            <span class="hud-stat-label">BOWLING STYLE</span>
            <span class="hud-stat-val" style="font-size: 0.875rem;">${p.bowlingStyle || '—'}</span>
          </div>
          <div class="hud-stat-cell" style="grid-column: span 2; padding: 6px 10px;">
            <span class="hud-stat-label">CAYMAN NATIONAL TEAM</span>
            <span class="hud-stat-val" style="font-size: 0.8125rem; font-weight: 600;">${p.national_team_experience || 'No'}</span>
          </div>
        </div>

        <!-- Description Snippet -->
        ${p.description ? `
          <div style="font-size: 0.8125rem; color: #E2E8F0; line-height: 1.45; max-height: 75px; overflow-y: auto; margin-top: 4px; padding-right: 4px;">
            ${p.description}
          </div>
        ` : ''}

        <!-- Mini Cutout Silhouette tucked in bottom right -->
        <div class="hud-mini-cutout-wrap">
          <img src="${photoSrc}" alt="${playerName}" class="hud-mini-cutout-img" loading="lazy">
        </div>

        <!-- Bottom Action CTA -->
        <div class="hud-bottom-cta" style="display: flex; gap: 10px; align-items: center; justify-content: space-between;">
          <a href="player-detail.html?id=${p.id}" class="hud-read-more-link">
            <span>View Profile</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          ${p.photo_drive ? `
            <a href="${p.photo_drive}" target="_blank" rel="noopener noreferrer" style="color: #FAB81E; font-size: 0.75rem; font-weight: 700; text-decoration: underline;">
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
    <section class="section" style="background: #F4F3F0 url('assets/cricket-white-bg.png') center top / cover fixed no-repeat; min-height: 80vh; padding: 40px 0;">
      <div class="container" style="position: relative; z-index: 1;">
        <!-- Breadcrumbs -->
        <div style="margin-bottom: 24px; font-size: 0.875rem; color: #5A6A7E;">
          <a href="index.html" style="color: #080E18; font-weight: 700;">Home</a> / <a href="squad.html" style="color: #080E18; font-weight: 700;">Squad</a> / <span style="color: #F2600C; font-weight: 800;">${playerName}</span>
        </div>

        <div class="profile-header-grid" style="background: #101C3F; border-radius: 16px; padding: 40px; border: 1.5px solid rgba(250, 184, 30, 0.4); box-shadow: 0 16px 40px rgba(0,0,0,0.4); color: #fff;">
          <!-- Left Column: Portrait & Key Fields -->
          <div>
            <div class="profile-portrait" style="background: radial-gradient(circle at center, #FAB81E 0%, #D97706 70%, #09152B 100%); border-radius: 14px; overflow: hidden; border: 3px solid #FAB81E; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              <img src="${photoSrc}" alt="${playerName}" style="width: 100%; display: block;">
            </div>

            <div class="card card-body" style="margin-top: 20px; background: #080E18; border: 1px solid rgba(250, 184, 30, 0.3); border-radius: 12px; padding: 20px; color: #fff;">
              <h4 style="margin-bottom: 14px; color: #FAB81E; font-family: var(--font-display); font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.05em;">Squad Profile</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.9375rem; color: #CBD5E1; padding: 0; margin: 0;">
                <li><strong style="color: #fff;">Full Name:</strong> ${playerName}</li>
                <li><strong style="color: #fff;">Birthday:</strong> ${player.birthday || '—'}</li>
                <li><strong style="color: #fff;">Age:</strong> ${player.age || '—'}</li>
                <li><strong style="color: #fff;">Role:</strong> ${player.role || '—'}</li>
                <li><strong style="color: #fff;">Batting Style:</strong> ${player.battingStyle || '—'}</li>
                <li><strong style="color: #fff;">Bowling Style:</strong> ${player.bowlingStyle || '—'}</li>
                <li><strong style="color: #fff;">Cayman National Team:</strong> ${player.national_team_experience || 'No'}</li>
              </ul>
              ${player.photo_drive ? `
                <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1);">
                  <a href="${player.photo_drive}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="width: 100%; text-align: center; justify-content: center;">
                    View Photo on Google Drive ↗
                  </a>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right Column: Description & Did You Know -->
          <div>
            <div style="margin-bottom: 24px;">
              <span class="badge badge--gold" style="font-size: 0.875rem; padding: 4px 12px; margin-bottom: 8px; display: inline-block;">${player.role}</span>
              <h1 style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 900; color: #FFFFFF; text-transform: uppercase; margin: 4px 0 16px 0;">${playerName}</h1>
            </div>

            <!-- Description -->
            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(250, 184, 30, 0.25); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #FAB81E; font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Description</h3>
              <p style="font-size: 1.05rem; line-height: 1.7; color: #E2E8F0; margin: 0; white-space: pre-line;">
                ${player.description || 'No description provided.'}
              </p>
            </div>

            <!-- Did You Know -->
            ${hasDidYouKnow ? `
              <div style="background: rgba(250, 184, 30, 0.1); border: 1.5px solid #FAB81E; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h3 style="color: #FAB81E; font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em; display: flex; align-items: center; gap: 8px;">
                  <span>★</span> Did you know ? (Unique about you)
                </h3>
                <p style="font-size: 1.025rem; line-height: 1.7; color: #FFFFFF; margin: 0; white-space: pre-line;">
                  ${player.didYouKnow}
                </p>
              </div>
            ` : ''}

            <!-- Cayman National Team Experience -->
            <div style="background: rgba(8, 14, 24, 0.6); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; padding: 20px;">
              <h4 style="color: #FAB81E; font-size: 0.95rem; text-transform: uppercase; margin-bottom: 6px;">Cayman National Team Experience</h4>
              <p style="font-size: 1rem; color: #CBD5E1; margin: 0;">${player.national_team_experience || 'No'}</p>
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

/**
 * ─────────────────────────────────────────────────────────────
 * 2026 OFFICIAL CSK SQUAD MODULE (19-PLAYER STADIUM SHOWCASE)
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';
import { ConsentGuard } from './consent-guard.js';

let allSquadMembers = [];
let currentFilter = 'all';

export async function initSquadPage() {
  const container = document.getElementById('squad-container');
  if (!container) return;

  const rawSquad = await store.getSquad();
  allSquadMembers = ConsentGuard.sanitizeList(rawSquad);

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
      <button class="squad-filter-btn ${currentFilter === 'leadership' ? 'active' : ''}" data-filter="leadership">
        LEADERSHIP
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
      <button class="squad-filter-btn ${currentFilter === 'development' ? 'active' : ''}" data-filter="development">
        ACADEMY (U19)
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
    if (e.target.closest('.hud-read-more-link')) {
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
  const isBowler = p.position_type === 'BOWLER' || p.role.toLowerCase().includes('bowler') || (p.stats && p.stats.wickets > 30);
  const stats = p.stats || {};
  const jerseyNum = p.jersey_display || (p.jersey_number < 10 ? `0${p.jersey_number}` : `${p.jersey_number}`);
  
  // Badge Rendering
  let badgeHtml = '';
  if (p.badge === 'C') {
    badgeHtml = `<div class="squad-card-badge squad-card-badge--c" title="Team Captain">C</div>`;
  } else if (p.badge === 'VC') {
    badgeHtml = `<div class="squad-card-badge squad-card-badge--vc" title="Vice-Captain">VC</div>`;
  } else if (p.badge === '✈️' || p.badge_type === 'overseas') {
    badgeHtml = `<div class="squad-card-badge squad-card-badge--overseas" title="Overseas International Player">✈️</div>`;
  } else if (p.badge === 'U19' || p.is_minor) {
    badgeHtml = `<div class="squad-card-badge squad-card-badge--u19" title="Under-19 Academy Star">U19</div>`;
  }

  // Stat Matrix Rows based on Role
  let statsMatrixHtml = '';
  if (isBowler) {
    statsMatrixHtml = `
      <div class="hud-stat-cell">
        <span class="hud-stat-label">ECONOMY</span>
        <span class="hud-stat-val">${stats.econ ? Number(stats.econ).toFixed(2) : '6.20'}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">MATCHES</span>
        <span class="hud-stat-val">${stats.matches || 28}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">WICKETS</span>
        <span class="hud-stat-val">${stats.wickets || 35}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">BEST FIGURES</span>
        <span class="hud-stat-val">${stats.best_bowling || '4/18'}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">4W HAULS</span>
        <span class="hud-stat-val">${stats.four_wickets !== undefined ? stats.four_wickets : 2}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">BOWLING AVG</span>
        <span class="hud-stat-val">${stats.avg ? Number(stats.avg).toFixed(1) : '16.5'}</span>
      </div>
    `;
  } else {
    statsMatrixHtml = `
      <div class="hud-stat-cell">
        <span class="hud-stat-label">STRIKE RATE</span>
        <span class="hud-stat-val">${stats.sr ? Number(stats.sr).toFixed(1) : '145.0'}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">MATCHES</span>
        <span class="hud-stat-val">${stats.matches || 30}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">RUNS</span>
        <span class="hud-stat-val">${stats.runs || 850}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">HIGH SCORE</span>
        <span class="hud-stat-val">${stats.high_score || '78*'}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">BATTING AVG</span>
        <span class="hud-stat-val">${stats.avg ? Number(stats.avg).toFixed(1) : '34.2'}</span>
      </div>
      <div class="hud-stat-cell">
        <span class="hud-stat-label">50s / 100s</span>
        <span class="hud-stat-val">${(stats.fifties !== undefined ? stats.fifties : 4)} / ${(stats.hundreds || 0)}</span>
      </div>
    `;
  }

  return `
    <article class="squad-player-stage-card" tabindex="0" aria-label="${p.renderedName} - ${p.role}">
      <!-- Front Showcase Layer -->
      <div class="squad-card-front">
        ${badgeHtml}

        <!-- Huge Oversized Block Jersey Number -->
        <div class="squad-jersey-bg-num">${jerseyNum}</div>

        <!-- Standing Player Cutout -->
        <div class="squad-player-figure-wrap">
          <img src="${p.renderedPhoto}" alt="${p.renderedName}" class="squad-player-cutout-img" loading="lazy">
        </div>

        <!-- Bottom Role & Name Strip -->
        <div class="squad-card-bottom-strip">
          <div class="squad-card-role-col">
            <span class="squad-card-num-small">${jerseyNum}</span>
            <span class="squad-card-pos-text">${p.position_type || p.role}</span>
          </div>
          <div class="squad-card-name-col">
            <h3 class="squad-card-player-name">${p.renderedName}</h3>
          </div>
        </div>
      </div>

      <!-- Unique Interactive Hover Detail Card (Floating Holographic HUD) -->
      <div class="squad-card-hover-hud">
        <div class="hud-top-meta">
          <div class="hud-nationality-row">
            <span class="hud-flag">${p.flag || '🇰🇾'}</span>
            <div class="hud-nat-text">
              <span class="hud-sub-label">NATIONALITY</span>
              <strong class="hud-nat-title">${(p.nationality || 'CAYMANIAN').toUpperCase()}</strong>
            </div>
          </div>
          <div class="hud-position-pill">
            <span>POSITION: <strong>${p.position_type || p.role}</strong></span>
          </div>
        </div>

        <!-- 2x3 Stat Grid -->
        <div class="hud-stats-grid">
          ${statsMatrixHtml}
        </div>

        <!-- Special Weapon / Trait Pill -->
        ${p.special_weapon ? `
          <div class="hud-trait-pill">
            <span class="hud-trait-icon">⚡</span>
            <span>${p.special_weapon}</span>
          </div>
        ` : ''}

        <!-- Mini Cutout Silhouette tucked in bottom right -->
        <div class="hud-mini-cutout-wrap">
          <img src="${p.renderedPhoto}" alt="${p.renderedName}" class="hud-mini-cutout-img" loading="lazy">
        </div>

        <!-- Bottom Action CTA -->
        <div class="hud-bottom-cta">
          <a href="player-detail.html?id=${p.id}" class="hud-read-more-link">
            <span>Read More</span>
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
  const rawPlayer = rawSquad[playerIndex] || rawSquad[0];

  const player = ConsentGuard.sanitizePlayer(rawPlayer);
  const prevPlayer = playerIndex > 0 ? ConsentGuard.sanitizePlayer(rawSquad[playerIndex - 1]) : null;
  const nextPlayer = playerIndex < rawSquad.length - 1 ? ConsentGuard.sanitizePlayer(rawSquad[playerIndex + 1]) : null;

  document.title = `${player.renderedName} | Cayman Super Kings Squad`;

  container.innerHTML = `
    <section class="section" style="background: #F4F3F0 url('assets/cricket-white-bg.png') center top / cover fixed no-repeat; min-height: 80vh;">
      <div class="container" style="position: relative; z-index: 1;">
        <!-- Breadcrumbs -->
        <div style="margin-bottom: 24px; font-size: 0.875rem; color: #5A6A7E;">
          <a href="index.html" style="color: #080E18; font-weight: 700;">Home</a> / <a href="squad.html" style="color: #080E18; font-weight: 700;">Squad</a> / <span style="color: #F2600C; font-weight: 800;">${player.renderedName}</span>
        </div>

        <div class="profile-header-grid" style="background: #101C3F; border-radius: 16px; padding: 40px; border: 1.5px solid rgba(250, 184, 30, 0.4); box-shadow: 0 16px 40px rgba(0,0,0,0.4); color: #fff;">
          <!-- Portrait & Bio box -->
          <div>
            <div class="profile-portrait" style="background: radial-gradient(circle at center, #FAB81E 0%, #D97706 70%, #09152B 100%); border-radius: 14px; overflow: hidden; border: 3px solid #FAB81E; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
              <img src="${player.renderedPhoto}" alt="${player.renderedName}" style="width: 100%; display: block;">
            </div>

            <div class="card card-body" style="margin-top: 20px; background: #080E18; border: 1px solid rgba(250, 184, 30, 0.3); border-radius: 12px; padding: 20px; color: #fff;">
              <h4 style="margin-bottom: 12px; color: #FAB81E; font-family: var(--font-display); font-size: 1.2rem;">Player Details</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: #CBD5E1;">
                <li><strong style="color: #fff;">Jersey:</strong> #${player.jersey_display || player.jersey_number || '—'}</li>
                <li><strong style="color: #fff;">Nationality:</strong> ${player.flag || ''} ${player.nationality || 'Caymanian'}</li>
                <li><strong style="color: #fff;">Role:</strong> ${player.position_type || player.role}</li>
                <li><strong style="color: #fff;">Batting Style:</strong> ${player.battingStyle || '—'}</li>
                <li><strong style="color: #fff;">Bowling Style:</strong> ${player.bowlingStyle || '—'}</li>
                <li><strong style="color: #fff;">Seasons at CSK:</strong> ${player.seasonsAtCSK || '1'}</li>
              </ul>
            </div>
          </div>

          <!-- Main Stats & Info -->
          <div>
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
              <p>${player.bio || 'Core squad member representing Cayman Super Kings in CICA league competition.'}</p>
            </div>

            <!-- Tabular Career Statistics -->
            <h3 style="margin-bottom: 16px;">Career Statistics (CICA League &amp; Cups)</h3>
            <div class="profile-stats-grid">
              <div class="stat-cell">
                <div class="stat-cell-num tabular-nums">${player.stats?.matches || '0'}</div>
                <div class="stat-cell-label">Matches</div>
              </div>
              <div class="stat-cell">
                <div class="stat-cell-num tabular-nums">${player.stats?.runs || '0'}</div>
                <div class="stat-cell-label">Runs</div>
              </div>
              <div class="stat-cell">
                <div class="stat-cell-num tabular-nums">${player.stats?.avg || '—'}</div>
                <div class="stat-cell-label">Bat Avg</div>
              </div>
              <div class="stat-cell">
                <div class="stat-cell-num tabular-nums">${player.stats?.wickets ?? '—'}</div>
                <div class="stat-cell-label">Wickets</div>
              </div>
            </div>

            <!-- Last 5 Matches -->
            ${player.last5 && player.last5.length > 0 ? `
              <h3 style="margin-top: 32px; margin-bottom: 16px;">Recent Form (Last 5 Matches)</h3>
              <div class="table-responsive" style="margin-bottom: 32px;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Match</th>
                      <th>Runs</th>
                      <th>Wickets / Catches</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${player.last5.map(m => `
                      <tr>
                        <td><strong>${m.match}</strong></td>
                        <td class="highlight-col tabular-nums">${m.runs}</td>
                        <td class="tabular-nums">${m.wickets || m.catches ? (m.wickets || (m.catches + ' ct')) : '—'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- Honours -->
            ${player.honours && player.honours.length > 0 ? `
              <h3 style="margin-bottom: 16px;">Honours &amp; Awards</h3>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${player.honours.map(h => `
                  <span class="badge badge--gold" style="padding: 6px 12px; font-size: 0.8125rem;">
                    🏆 ${h}
                  </span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Prev / Next Player Footer -->
        <div class="match-nav-footer">
          ${prevPlayer ? `
            <a href="player-detail.html?id=${prevPlayer.id}" class="btn btn-outline-navy btn-sm">
              ← ${prevPlayer.renderedName}
            </a>
          ` : '<div></div>'}

          <a href="squad.html" class="btn btn-primary btn-sm">Full 2026 Squad</a>

          ${nextPlayer ? `
            <a href="player-detail.html?id=${nextPlayer.id}" class="btn btn-outline-navy btn-sm">
              ${nextPlayer.renderedName} →
            </a>
          ` : '<div></div>'}
        </div>
      </div>
    </section>
  `;
}

/**
 * ─────────────────────────────────────────────────────────────
 * SQUAD & PLAYER PROFILE MODULE
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';
import { ConsentGuard } from './consent-guard.js';

export async function initSquadPage() {
  const container = document.getElementById('squad-container');
  if (!container) return;

  const rawSquad = await store.getSquad();
  const squad = ConsentGuard.sanitizeList(rawSquad);

  const groups = [
    { key: 'leadership', title: 'Leadership & Senior Captaincy', desc: 'Guiding the Super Kings on and off the field' },
    { key: 'batters', title: 'Batting Unit', desc: 'Top & middle order power hitters and anchors' },
    { key: 'allrounders', title: 'All-Rounders', desc: 'Dynamic multi-dimensional match winners' },
    { key: 'bowlers', title: 'Bowling Attack', desc: 'Pace spearheads and spin specialists' },
    { key: 'development', title: 'Development Squad (U19)', desc: 'Emerging youth academy talent. Parental consent safeguards active.' }
  ];

  let html = '';

  groups.forEach(g => {
    const members = squad.filter(p => p.group === g.key);
    if (members.length === 0) return;

    html += `
      <div class="squad-group-heading">
        <div>
          <span class="section-eyebrow">${g.title}</span>
          <h2 style="font-size: 1.75rem;">${g.title}</h2>
          <p style="font-size: 0.9375rem; color: var(--c-text-muted); margin-top: 4px;">${g.desc}</p>
        </div>
        <span class="badge badge--navy">${members.length} Players</span>
      </div>

      <div class="grid" style="margin-bottom: 48px;">
        ${members.map(p => createPlayerCard(p)).join('')}
      </div>
    `;
  });

  container.innerHTML = html;
}

function createPlayerCard(p) {
  return `
    <div class="col-3">
      <a href="player-detail.html?id=${p.id}" class="card card--lift player-card">
        <div class="player-card-image">
          <img src="${p.renderedPhoto}" alt="${p.renderedName}" loading="lazy">
          
          ${p.badge ? `
            <div class="player-badge-top">
              <span class="role-marker ${p.badge === 'C' ? 'role-marker--c' : 'role-marker--vc'}" title="${p.badge === 'C' ? 'Captain' : 'Vice-Captain'}">
                ${p.badge}
              </span>
            </div>
          ` : ''}

          ${p.isRedacted ? `
            <div class="player-badge-top">
              <span class="badge badge--teal" style="font-size: 0.6875rem;">Consent Guard</span>
            </div>
          ` : ''}
        </div>

        <div class="player-card-content">
          <span class="player-jersey">${p.jersey_number ? '#' + p.jersey_number : ''}</span>
          <h3 class="player-name">${p.renderedName}</h3>
          <p class="player-role-text">${p.role}</p>
          
          <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--c-border-subtle); padding-top: 10px; font-size: 0.8125rem;">
            <span style="color: var(--c-text-muted);">${p.battingStyle ? p.battingStyle.split(' ')[0] : 'RHB'}</span>
            <span style="color: var(--c-flame-text); font-weight: 700;">View Profile →</span>
          </div>
        </div>
      </a>
    </div>
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

  // Pass through Consent Guard
  const player = ConsentGuard.sanitizePlayer(rawPlayer);

  const prevPlayer = playerIndex > 0 ? ConsentGuard.sanitizePlayer(rawSquad[playerIndex - 1]) : null;
  const nextPlayer = playerIndex < rawSquad.length - 1 ? ConsentGuard.sanitizePlayer(rawSquad[playerIndex + 1]) : null;

  document.title = `${player.renderedName} | Cayman Super Kings Squad`;

  container.innerHTML = `
    <section class="section">
      <div class="container">
        <!-- Breadcrumbs -->
        <div style="margin-bottom: 24px; font-size: 0.875rem; color: var(--c-text-muted);">
          <a href="index.html">Home</a> / <a href="squad.html">Squad</a> / <span style="color: var(--c-navy); font-weight: 600;">${player.renderedName}</span>
        </div>

        <div class="profile-header-grid">
          <!-- Portrait & Bio box -->
          <div>
            <div class="profile-portrait">
              <img src="${player.renderedPhoto}" alt="${player.renderedName}" style="width: 100%; display: block;">
            </div>

            ${player.isRedacted ? `
              <div class="consent-notice" style="margin-top: 16px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                <div>
                  <strong>Safeguarding &amp; Consent Guard</strong>
                  <p style="margin: 4px 0 0; font-size: 0.8125rem;">
                    In compliance with CICA youth safeguarding standards, minor player full names and personal portrait photos are masked until guardian consent documentation is logged.
                  </p>
                </div>
              </div>
            ` : ''}

            <div class="card card-body" style="margin-top: 20px;">
              <h4 style="margin-bottom: 12px;">Player Details</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.875rem;">
                <li><strong>Jersey:</strong> #${player.jersey_number || '—'}</li>
                <li><strong>Batting Style:</strong> ${player.battingStyle || '—'}</li>
                <li><strong>Bowling Style:</strong> ${player.bowlingStyle || '—'}</li>
                <li><strong>Seasons at CSK:</strong> ${player.seasonsAtCSK || '1'}</li>
              </ul>
            </div>
          </div>

          <!-- Main Stats & Info -->
          <div>
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
              <span class="badge badge--navy">${player.group.toUpperCase()}</span>
              ${player.badge ? `<span class="badge ${player.badge === 'C' ? 'badge--gold' : 'badge--teal'}">${player.badge === 'C' ? 'Captain' : 'Vice-Captain'}</span>` : ''}
              ${player.is_minor ? `<span class="badge badge--teal">Under-19</span>` : ''}
            </div>

            <h1 style="font-size: 2.75rem; margin-bottom: 8px;">${player.renderedName}</h1>
            <p style="font-size: 1.25rem; color: var(--c-flame-text); font-weight: 700; margin-bottom: 24px;">${player.role}</p>

            <div style="font-size: 1.0625rem; line-height: 1.6; margin-bottom: 32px; color: #334155;">
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

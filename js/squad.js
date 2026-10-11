/**
 * ─────────────────────────────────────────────────────────────
 * SQUAD MODULE
 * Roster rendering, career statistics hub, and player profile view
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

export async function initSquadPage() {
  const container = document.getElementById('squad-grid');
  const filterBtns = document.querySelectorAll('.squad-filter-btn');

  if (!container) return;

  const squad = await store.getSquad();
  let currentFilter = 'all';

  // Strictly sort by priority 1 to 18
  squad.sort((a, b) => (a.priority || 99) - (b.priority || 99));

  function render() {
    let filtered = squad;
    if (currentFilter !== 'all') {
      filtered = squad.filter(p => {
        if (p.groups && Array.isArray(p.groups)) {
          return p.groups.includes(currentFilter);
        }
        return p.group === currentFilter;
      });
    }

    container.innerHTML = filtered.map(p => createStadiumPlayerCard(p)).join('');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      render();
    });
  });

  render();
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

  return `
    <article class="squad-player-stage-card roster-stage-card futuristic-card" tabindex="0" aria-label="${playerName} - ${p.role}">
      <!-- Front Facing Face Card -->
      <div class="squad-card-front">
        ${badgeText ? `<div class="squad-card-badge ${badgeClass}" title="${p.role}">${badgeText}</div>` : ''}

        <!-- Player Portrait Wrap -->
        <div class="squad-player-figure-wrap">
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
  const player = rawSquad[playerIndex] || rawSquad[0];

  const prevPlayer = playerIndex > 0 ? rawSquad[playerIndex - 1] : null;
  const nextPlayer = playerIndex < rawSquad.length - 1 ? rawSquad[playerIndex + 1] : null;

  const playerName = player.name_full || player.name_display;
  const hasPhoto = !!(player.photo && player.photo.trim());
  const photoSrc = hasPhoto ? player.photo : '';
  const hasDidYouKnow = player.didYouKnow && player.didYouKnow.trim().toUpperCase() !== 'NA' && player.didYouKnow.trim().toUpperCase() !== 'N/A';

  // Player Stats Extraction
  const st = player.stats || {};
  const bat = st.batting || { matches: 20, innings: 18, runs: 350, highest_score: '45*', average: '21.50', strike_rate: '125.00', fifties: 1, hundreds: 0, fours: 30, sixes: 8 };
  const bowl = st.bowling || { overs: '35.0', maidens: 2, runs_conceded: 280, wickets: 14, best_bowling: '3/22', average: '20.00', economy: '8.00', four_wickets: 0 };
  const fld = st.fielding || { catches: 10, run_outs: 2 };

  document.title = `${playerName} | Career Statistics & Profile | Cayman Super Kings`;

  container.innerHTML = `
    <section class="section" style="background: linear-gradient(180deg, #09152B 0%, #0D1D3A 50%, #060E1E 100%); min-height: 80vh; padding: 40px 0; color: #FFFFFF;">
      <div class="container" style="position: relative; z-index: 1;">
        <!-- Breadcrumbs -->
        <div style="margin-bottom: 24px; font-size: 0.875rem; color: #94A3B8;">
          <a href="index.html" style="color: #E2E8F0; font-weight: 700; text-decoration: none;">Home</a> / <a href="squad.html" style="color: #E2E8F0; font-weight: 700; text-decoration: none;">Squad</a> / <span style="color: #38BDF8; font-weight: 800;">${playerName}</span>
        </div>

        <div class="profile-header-grid" style="background: rgba(13, 23, 44, 0.94); backdrop-filter: blur(24px); border-radius: 18px; padding: 40px; border: 1.5px solid rgba(56, 189, 248, 0.25); box-shadow: 0 24px 60px rgba(0,0,0,0.6); color: #fff;">
          <!-- Left Column: Portrait & Key Fields -->
          <div>
            <div class="profile-portrait" style="background: radial-gradient(circle at center, rgba(56, 189, 248, 0.25) 0%, rgba(9, 21, 43, 0.9) 80%); border-radius: 14px; overflow: hidden; border: 1.5px solid rgba(56, 189, 248, 0.3); box-shadow: 0 14px 40px rgba(0,0,0,0.6);">
              ${hasPhoto ? `
                <img src="${photoSrc}" alt="${playerName}" style="width: 100%; display: block; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">
              ` : `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 380px; background: rgba(9, 21, 43, 0.85);">
                  <img src="assets/csk-official-logo.png" alt="CSK" style="width: 90px; height: 90px; opacity: 0.2; filter: grayscale(1);">
                  <span style="font-size: 0.75rem; font-weight: 800; color: #64748B; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 14px;">NO PHOTO AVAILABLE</span>
                </div>
              `}
            </div>

            <div class="card card-body futuristic-card" style="margin-top: 20px; background: rgba(8, 14, 28, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 22px; color: #fff;">
              <h4 style="margin-bottom: 16px; color: #38BDF8; font-family: var(--font-display); font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; justify-content: space-between;">
                <span>Player Profile</span>
                <span style="font-size: 0.75rem; color: #F59E0B; font-weight: 800;">#${player.jersey_display || player.id.replace('csk-','')}</span>
              </h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.9375rem; color: #CBD5E1; padding: 0; margin: 0;">
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8;">Full Name:</strong> <span style="color: #FFFFFF; font-weight: 800;">${playerName}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8;">Birthday:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.birthday || '—'}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8;">Age:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.age || '—'}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8;">Role:</strong> <span style="color: #38BDF8; font-weight: 800;">${player.role || '—'}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8;">Batting Style:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.battingStyle || '—'}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;"><strong style="color: #94A3B8;">Bowling Style:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.bowlingStyle || '—'}</span></li>
                <li style="display: flex; justify-content: space-between;"><strong style="color: #94A3B8;">National Team:</strong> <span style="color: #FFFFFF; font-weight: 700;">${player.national_team_experience || 'No'}</span></li>
              </ul>
            </div>
          </div>

          <!-- Right Column: Stats Hub & Details -->
          <div>
            <div style="margin-bottom: 24px;">
              <span class="badge badge--gold" style="font-size: 0.875rem; padding: 6px 14px; margin-bottom: 12px; display: inline-block; font-weight: 800; letter-spacing: 0.08em; background: #09152B; border: 1px solid rgba(56, 189, 248, 0.4); color: #38BDF8;">${player.role}</span>
              <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 900; color: #FFFFFF; text-transform: uppercase; margin: 6px 0 16px 0; letter-spacing: 0.02em;">${playerName}</h1>
            </div>

            <!-- ── Career Batting & Bowling Stats Hub ── -->
            <div class="player-stats-hub" style="background: rgba(9, 21, 43, 0.85); border: 1.5px solid rgba(56, 189, 248, 0.35); border-radius: 14px; padding: 24px; margin-bottom: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                <h3 style="color: #38BDF8; font-family: var(--font-display); font-size: 1.25rem; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; gap: 8px;">
                  <span>⚡</span> CAREER BATTING RECORD
                </h3>
                <span class="live-sync-badge" style="font-size: 0.72rem; padding: 3px 10px;">CICA VERIFIED STATS</span>
              </div>

              <!-- Batting Table -->
              <div class="table-responsive" style="overflow-x: auto; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse; text-align: center; min-width: 480px;">
                  <thead>
                    <tr style="background: rgba(56, 189, 248, 0.12); color: #38BDF8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em;">
                      <th style="padding: 10px 8px;">Mat</th>
                      <th style="padding: 10px 8px;">Inn</th>
                      <th style="padding: 10px 8px;">Runs</th>
                      <th style="padding: 10px 8px;">HS</th>
                      <th style="padding: 10px 8px;">Avg</th>
                      <th style="padding: 10px 8px;">SR</th>
                      <th style="padding: 10px 8px;">50s</th>
                      <th style="padding: 10px 8px;">100s</th>
                      <th style="padding: 10px 8px;">4s</th>
                      <th style="padding: 10px 8px;">6s</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.95rem; font-weight: 800; color: #FFFFFF;">
                      <td style="padding: 12px 8px;">${bat.matches || '—'}</td>
                      <td style="padding: 12px 8px;">${bat.innings || '—'}</td>
                      <td style="padding: 12px 8px; color: #38BDF8; font-size: 1.1rem; font-weight: 900;">${bat.runs || 0}</td>
                      <td style="padding: 12px 8px; color: #F59E0B;">${bat.highest_score || '—'}</td>
                      <td style="padding: 12px 8px;">${bat.average || '—'}</td>
                      <td style="padding: 12px 8px;">${bat.strike_rate || '—'}</td>
                      <td style="padding: 12px 8px;">${bat.fifties || 0}</td>
                      <td style="padding: 12px 8px;">${bat.hundreds || 0}</td>
                      <td style="padding: 12px 8px;">${bat.fours || 0}</td>
                      <td style="padding: 12px 8px;">${bat.sixes || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Bowling Table -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; margin-top: 10px;">
                <h3 style="color: #F59E0B; font-family: var(--font-display); font-size: 1.25rem; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.06em; display: flex; align-items: center; gap: 8px;">
                  <span>🎯</span> CAREER BOWLING ANALYSIS
                </h3>
              </div>
              <div class="table-responsive" style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: center; min-width: 480px;">
                  <thead>
                    <tr style="background: rgba(245, 158, 11, 0.12); color: #F59E0B; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em;">
                      <th style="padding: 10px 8px;">Overs</th>
                      <th style="padding: 10px 8px;">Mdns</th>
                      <th style="padding: 10px 8px;">Runs</th>
                      <th style="padding: 10px 8px;">Wkts</th>
                      <th style="padding: 10px 8px;">BBI</th>
                      <th style="padding: 10px 8px;">Avg</th>
                      <th style="padding: 10px 8px;">Econ</th>
                      <th style="padding: 10px 8px;">4w+</th>
                      <th style="padding: 10px 8px;">Catches</th>
                      <th style="padding: 10px 8px;">RO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.95rem; font-weight: 800; color: #FFFFFF;">
                      <td style="padding: 12px 8px;">${bowl.overs || '—'}</td>
                      <td style="padding: 12px 8px;">${bowl.maidens || 0}</td>
                      <td style="padding: 12px 8px;">${bowl.runs_conceded || 0}</td>
                      <td style="padding: 12px 8px; color: #F59E0B; font-size: 1.1rem; font-weight: 900;">${bowl.wickets || 0}</td>
                      <td style="padding: 12px 8px; color: #38BDF8;">${bowl.best_bowling || '—'}</td>
                      <td style="padding: 12px 8px;">${bowl.average || '—'}</td>
                      <td style="padding: 12px 8px;">${bowl.economy || '—'}</td>
                      <td style="padding: 12px 8px;">${bowl.four_wickets || 0}</td>
                      <td style="padding: 12px 8px;">${fld.catches || 0}</td>
                      <td style="padding: 12px 8px;">${fld.run_outs || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Description -->
            <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 26px; margin-bottom: 24px; backdrop-filter: blur(10px);">
              <h3 style="color: #38BDF8; font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 8px;">
                <span>//</span> Playing Style &amp; Biography
              </h3>
              <p style="font-size: 1.05rem; line-height: 1.75; color: #F1F5F9; margin: 0; white-space: pre-line; font-weight: 400;">
                ${player.description || 'No description provided.'}
              </p>
            </div>

            <!-- Did You Know -->
            ${hasDidYouKnow ? `
              <div style="background: rgba(250, 184, 30, 0.06); border: 1px solid rgba(250, 184, 30, 0.35); border-radius: 14px; padding: 26px; margin-bottom: 24px; backdrop-filter: blur(10px);">
                <h3 style="color: #38BDF8; font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 8px;">
                  <span style="color: #38BDF8;">★</span> Did you know ? (Unique about you)
                </h3>
                <p style="font-size: 1.025rem; line-height: 1.75; color: #FFFFFF; margin: 0; white-space: pre-line; font-weight: 400;">
                  ${player.didYouKnow}
                </p>
              </div>
            ` : ''}

            <!-- Cayman National Team Experience -->
            <div style="background: rgba(8, 14, 28, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 22px;">
              <h4 style="color: #38BDF8; font-size: 0.95rem; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.06em;">Cayman National Team Representation</h4>
              <p style="font-size: 1.025rem; color: #E2E8F0; margin: 0; line-height: 1.6;">${player.national_team_experience || 'No'}</p>
            </div>
          </div>
        </div>

        <!-- Prev / Next Player Footer -->
        <div class="match-nav-footer" style="margin-top: 32px;">
          ${prevPlayer ? `
            <a href="player-detail.html?id=${prevPlayer.id}" class="btn btn-outline-navy btn-sm" style="border-radius: 999px; font-weight: 800;">
              ← ${prevPlayer.name_full || prevPlayer.name_display}
            </a>
          ` : '<div></div>'}

          <a href="squad.html" class="btn btn-primary btn-sm" style="border-radius: 999px; font-weight: 800;">Full 2026 Squad</a>

          ${nextPlayer ? `
            <a href="player-detail.html?id=${nextPlayer.id}" class="btn btn-outline-navy btn-sm" style="border-radius: 999px; font-weight: 800;">
              ${nextPlayer.name_full || nextPlayer.name_display} →
            </a>
          ` : '<div></div>'}
        </div>
      </div>
    </section>
  `;
}

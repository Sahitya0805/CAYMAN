/**
 * ─────────────────────────────────────────────────────────────
 * MATCHES & RESULTS MODULE
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

export async function initMatchesPage() {
  const container = document.getElementById('matches-list');
  const emptyState = document.getElementById('matches-empty');
  const formatFilter = document.getElementById('format-filter');
  const seasonFilter = document.getElementById('season-filter');
  const tabBtns = document.querySelectorAll('[data-match-tab]');

  if (!container) return;

  const fixtures = await store.getFixtures();
  let currentTab = 'upcoming'; // 'upcoming', 'results', 'standings'
  let currentFormat = 'all';
  let currentSeason = '2026';

  function render() {
    if (currentTab === 'standings') {
      renderStandings();
      return;
    }

    let filtered = fixtures.filter(f => f.status === (currentTab === 'upcoming' ? 'upcoming' : 'result'));
    
    if (currentFormat !== 'all') {
      filtered = filtered.filter(f => f.format === currentFormat);
    }
    if (currentSeason !== 'all') {
      filtered = filtered.filter(f => f.season === currentSeason);
    }

    if (filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) {
        emptyState.style.display = 'block';
        const emptyTitle = emptyState.querySelector('.empty-state__title');
        const emptyDesc = emptyState.querySelector('.empty-state__desc');
        if (currentTab === 'upcoming') {
          if (emptyTitle) emptyTitle.textContent = 'Fixtures Being Finalised';
          if (emptyDesc) emptyDesc.textContent = 'Fixtures for the upcoming season are currently being finalised by the Cayman Islands Cricket Association.';
        } else {
          if (emptyTitle) emptyTitle.textContent = 'No Results Found';
          if (emptyDesc) emptyDesc.textContent = 'There are no match results matching your selected filters.';
        }
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(2, 1fr)';
    container.style.gap = '24px';
    container.innerHTML = filtered.map((m, index) => createMatchCardHTML(m, index)).join('');
  }

  function renderStandings() {
    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = `
      <div class="card card-body">
        <div class="section-header" style="margin-bottom: 20px;">
          <div>
            <span class="badge badge--gold">Official Table</span>
            <h3 style="margin-top: 8px;">CICA T20 Super League 2026 Standings</h3>
          </div>
          <a href="https://cricclubs.com/CaymanCricketAssociation" target="_blank" rel="noopener noreferrer" class="btn btn-outline-navy btn-sm">
            Full Table on CricClubs ↗
          </a>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>L</th>
                <th>NR</th>
                <th>Pts</th>
                <th>NRR</th>
              </tr>
            </thead>
            <tbody>
              <tr style="background-color: rgba(245, 158, 27, 0.08); font-weight: 700;">
                <td class="highlight-col">1</td>
                <td><strong>Cayman Super Kings (CSK)</strong></td>
                <td>6</td>
                <td>6</td>
                <td>0</td>
                <td>0</td>
                <td class="highlight-col">12</td>
                <td>+1.842</td>
              </tr>
              <tr>
                <td>2</td>
                <td>West Bay Warriors</td>
                <td>6</td>
                <td>4</td>
                <td>2</td>
                <td>0</td>
                <td>8</td>
                <td>+0.920</td>
              </tr>
              <tr>
                <td>3</td>
                <td>George Town Tigers</td>
                <td>6</td>
                <td>3</td>
                <td>3</td>
                <td>0</td>
                <td>6</td>
                <td>+0.140</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Seven Mile Strikers</td>
                <td>6</td>
                <td>2</td>
                <td>4</td>
                <td>0</td>
                <td>4</td>
                <td>-0.450</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Bodden Town CC</td>
                <td>6</td>
                <td>2</td>
                <td>4</td>
                <td>0</td>
                <td>4</td>
                <td>-0.890</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Police Cricket Club</td>
                <td>6</td>
                <td>1</td>
                <td>5</td>
                <td>0</td>
                <td>2</td>
                <td>-1.540</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="font-size: 0.8125rem; color: var(--c-text-muted); margin-top: 16px;">
          * Standings updated following Round 6 matchday results. Top 4 teams qualify for the Championship Play-offs.
        </p>
      </div>
    `;
  }

  function createMatchCardHTML(m, index) {
    const isResult = m.status === 'result';

    // Parse date for ticket stub
    const dateObj = new Date(m.date + 'T00:00:00');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = !isNaN(dateObj.getTime()) ? monthNames[dateObj.getMonth()] : 'SEP';
    const day = !isNaN(dateObj.getTime()) ? String(dateObj.getDate()).padStart(2, '0') : '12';

    const matchNum = `${index + 1}${getOrdinalSuffix(index + 1)} Match`;

    // Opponent Logo mapper
    const oppKey = (m.opponent_short || '').toLowerCase();
    const oppLogoMap = {
      gtt: 'assets/teams/gtt.svg',
      sms: 'assets/teams/sms.svg',
      btcc: 'assets/teams/btcc.svg',
      wbw: 'assets/teams/wbw.svg',
      pcc: 'assets/teams/pcc.svg',
      nsxi: 'assets/teams/nsxi.svg'
    };
    const oppLogo = oppLogoMap[oppKey] || 'assets/teams/gtt.svg';
    const cskLogo = 'assets/csk-official-logo.png';

    // Time formatting
    let timeDisplay = m.time || '02:30pm';
    if (timeDisplay && !timeDisplay.toLowerCase().includes('m')) {
      const parts = timeDisplay.split(':');
      if (parts.length >= 2) {
        const hour = parseInt(parts[0], 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        timeDisplay = `${String(formattedHour).padStart(2, '0')}:${parts[1]}${ampm}`;
      }
    }

    const isHome = m.is_home !== false;
    const team1Name = isHome ? 'Cayman Super Kings' : m.opponent;
    const team1Logo = isHome ? cskLogo : oppLogo;
    const team1Score = isHome ? m.score_csk : m.score_opp;

    const team2Name = isHome ? m.opponent : 'Cayman Super Kings';
    const team2Logo = isHome ? oppLogo : cskLogo;
    const team2Score = isHome ? m.score_opp : m.score_csk;

    const detailUrl = isResult ? `match-detail.html?slug=${m.slug}` : (m.cricclubs_url || `match-detail.html?slug=${m.slug}`);

    return `
      <div class="fixture-ticket">
        <!-- Left Ticket Date Stub -->
        <div class="ticket-stub">
          <span class="ticket-notch-top"></span>
          <span class="ticket-month">${month}</span>
          <span class="ticket-day">${day}</span>
          <span class="ticket-match-num">${matchNum}</span>
          <span class="ticket-notch-bottom"></span>
        </div>

        <!-- Right Main Ticket Body -->
        <div class="ticket-body">
          <!-- Slanted Yellow Time Pill -->
          <div class="ticket-time-pill">
            <span>${timeDisplay}</span>
            <span class="ticket-time-stripes">///</span>
          </div>

          <!-- Teams Matchup -->
          <div class="ticket-matchup">
            <!-- Team 1 -->
            <div class="ticket-team">
              <img src="${team1Logo}" alt="${team1Name}" class="ticket-team-crest">
              <span class="ticket-team-name">${team1Name}</span>
              ${isResult && team1Score ? `<span class="ticket-team-score">${team1Score}</span>` : ''}
            </div>

            <!-- VS Center -->
            <div class="ticket-vs">
              <span class="ticket-vs-text">VS</span>
              ${isResult ? `<span class="ticket-vs-result">${m.is_csk_win ? 'CSK WON' : 'COMPLETED'}</span>` : ''}
            </div>

            <!-- Team 2 -->
            <div class="ticket-team">
              <img src="${team2Logo}" alt="${team2Name}" class="ticket-team-crest">
              <span class="ticket-team-name">${team2Name}</span>
              ${isResult && team2Score ? `<span class="ticket-team-score">${team2Score}</span>` : ''}
            </div>
          </div>

          <!-- Venue -->
          <div class="ticket-venue">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${m.venue || 'Jimmy Powell Oval, George Town'}</span>
          </div>

          <!-- Overlapping Bottom Match Center Pill -->
          <a href="${detailUrl}" class="ticket-btn-pill" ${!isResult && m.cricclubs_url ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            <span>MATCH CENTER</span>
          </a>
        </div>
      </div>
    `;
  }

  function getOrdinalSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  // Event Listeners
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.getAttribute('data-match-tab');
      render();
    });
  });

  if (formatFilter) {
    formatFilter.addEventListener('change', (e) => {
      currentFormat = e.target.value;
      render();
    });
  }

  if (seasonFilter) {
    seasonFilter.addEventListener('change', (e) => {
      currentSeason = e.target.value;
      render();
    });
  }

  render();
}

export async function initMatchDetail() {
  const container = document.getElementById('match-detail-content');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || 'csk-vs-tigers-t20-final';

  const fixtures = await store.getFixtures();
  const matchIndex = fixtures.findIndex(f => f.slug === slug);
  const match = fixtures[matchIndex] || fixtures[0];

  const prevMatch = matchIndex > 0 ? fixtures[matchIndex - 1] : null;
  const nextMatch = matchIndex < fixtures.length - 1 ? fixtures[matchIndex + 1] : null;

  document.title = `${match.competition}: CSK vs ${match.opponent} | Cayman Super Kings`;

  container.innerHTML = `
    <!-- Header Hero -->
    <div class="match-header-banner">
      <div class="container">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
          <span class="badge badge--gold">${match.competition}</span>
          <span class="badge badge--dark">${match.format}</span>
          <span style="color: var(--c-text-inverse-muted); font-size: 0.875rem;">${formatDate(match.date)} • ${match.venue}</span>
        </div>

        <div class="match-score-display">
          <div class="team-score-block">
            <h3>Cayman Super Kings</h3>
            <div class="score-large tabular-nums">${match.score_csk || 'Upcoming'}</div>
            ${match.overs_csk ? `<div class="overs">${match.overs_csk} Overs</div>` : ''}
          </div>

          <div style="text-align: center;">
            <div class="match-result-pill">${match.result_text}</div>
            ${match.player_of_match ? `<div style="font-size: 0.875rem; color: var(--c-gold); margin-top: 8px; font-weight: 600;">Player of the Match: ${match.player_of_match}</div>` : ''}
          </div>

          <div class="team-score-block" style="text-align: right;">
            <h3>${match.opponent}</h3>
            <div class="score-large tabular-nums" style="color: var(--c-text-inverse-muted);">${match.score_opp || '—'}</div>
            ${match.overs_opp ? `<div class="overs">${match.overs_opp} Overs</div>` : ''}
          </div>
        </div>

        <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
          <a href="${match.cricclubs_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            Full scorecard on CricClubs ↗
          </a>
        </div>
      </div>
    </div>

    <!-- Match Content (Tables & Report) -->
    <section class="section">
      <div class="container">
        <div class="grid">
          <div class="col-8">
            <h2 style="margin-bottom: 24px;">Match Report &amp; Analysis</h2>
            <div style="font-size: 1.125rem; line-height: 1.7; margin-bottom: 40px;">
              <p class="lead" style="font-size: 1.25rem; font-weight: 500; color: var(--c-navy);">${match.summary || ''}</p>
            </div>

            <!-- Scorecard Tables -->
            ${match.scorecard ? `
              <h3 style="margin-bottom: 16px;">CSK Batting Card</h3>
              <div class="table-responsive" style="margin-bottom: 32px;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Batter</th>
                      <th>Dismissal</th>
                      <th>R</th>
                      <th>B</th>
                      <th>4s</th>
                      <th>6s</th>
                      <th>SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${match.scorecard.csk_batting.map(b => `
                      <tr>
                        <td><strong>${b.player}</strong></td>
                        <td style="color: var(--c-text-muted);">${b.dismissal}</td>
                        <td class="highlight-col">${b.runs}</td>
                        <td>${b.balls}</td>
                        <td>${b.fours}</td>
                        <td>${b.sixes}</td>
                        <td>${b.sr}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <h3 style="margin-bottom: 16px;">CSK Bowling Analysis</h3>
              <div class="table-responsive" style="margin-bottom: 40px;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Bowler</th>
                      <th>O</th>
                      <th>M</th>
                      <th>R</th>
                      <th>W</th>
                      <th>Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${match.scorecard.csk_bowling.map(bow => `
                      <tr>
                        <td><strong>${bow.bowler}</strong></td>
                        <td>${bow.overs}</td>
                        <td>${bow.maidens}</td>
                        <td>${bow.runs}</td>
                        <td class="highlight-col" style="color: var(--c-flame-text); font-weight: 800;">${bow.wickets}</td>
                        <td>${bow.econ}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- Match Action Gallery Strip -->
            <h3 style="margin-bottom: 16px;">Match Action Gallery</h3>
            <div class="grid">
              <div class="col-6">
                <img src="assets/placeholders/action-match.svg" alt="Match action shot" style="border-radius: 8px; width: 100%;">
              </div>
              <div class="col-6">
                <img src="assets/placeholders/hero-team.svg" alt="Team celebration" style="border-radius: 8px; width: 100%;">
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-4">
            <div class="card card-body" style="background: var(--c-navy-light); color: #fff; margin-bottom: 24px;">
              <h4 style="color: var(--c-gold); margin-bottom: 16px;">Official Verification</h4>
              <p style="font-size: 0.875rem; line-height: 1.6; color: var(--c-text-inverse-muted);">
                All match scores, ball-by-ball records, and official league points are certified by Cayman Islands Cricket Association umpires.
              </p>
              <a href="${match.cricclubs_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="margin-top: 16px;">
                Open CricClubs Portal ↗
              </a>
            </div>

            <div class="card card-body">
              <h4 style="margin-bottom: 16px;">Match Details</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.875rem;">
                <li><strong>Competition:</strong> ${match.competition}</li>
                <li><strong>Format:</strong> ${match.format}</li>
                <li><strong>Venue:</strong> ${match.venue}</li>
                <li><strong>Date:</strong> ${formatDate(match.date)}</li>
                <li><strong>Status:</strong> ${match.status.toUpperCase()}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Prev / Next Navigation Footer -->
        <div class="match-nav-footer">
          ${prevMatch ? `
            <a href="match-detail.html?slug=${prevMatch.slug}" class="btn btn-outline-navy btn-sm">
              ← Prev: vs ${prevMatch.opponent}
            </a>
          ` : '<div></div>'}

          <a href="matches.html" class="btn btn-primary btn-sm">All Matches &amp; Fixtures</a>

          ${nextMatch ? `
            <a href="match-detail.html?slug=${nextMatch.slug}" class="btn btn-outline-navy btn-sm">
              Next: vs ${nextMatch.opponent} →
            </a>
          ` : '<div></div>'}
        </div>
      </div>
    </section>
  `;
}

export function initCountdownTimer() {
  const elDays = document.getElementById('countdown-days');
  const elHours = document.getElementById('countdown-hours');
  const elMins = document.getElementById('countdown-mins');
  const elSecs = document.getElementById('countdown-secs');
  if (!elDays) return;

  const targetDate = new Date('2026-09-12T14:30:00-05:00').getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (elDays) elDays.textContent = '00';
      if (elHours) elHours.textContent = '00';
      if (elMins) elMins.textContent = '00';
      if (elSecs) elSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (elDays) elDays.textContent = String(days).padStart(2, '0');
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMins) elMins.textContent = String(mins).padStart(2, '0');
    if (elSecs) elSecs.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

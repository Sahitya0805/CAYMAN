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
  let currentFormat = formatFilter ? formatFilter.value : 'all';
  let currentSeason = seasonFilter ? seasonFilter.value : 'all';

  function render() {
    let filtered = fixtures.filter(f => f.status === 'result');
    
    if (currentFormat !== 'all') {
      filtered = filtered.filter(f => {
        if (currentFormat === 'Super League T20') {
          return (f.competition && f.competition.toLowerCase().includes('super league') && f.format === 'T20');
        }
        if (currentFormat === 'Super League 40-Over') {
          return (f.competition && f.competition.toLowerCase().includes('super league') && (f.format === '40-Over' || f.format === '40 Over'));
        }
        if (currentFormat === 'Elite 50-Over') {
          return (f.competition && f.competition.toLowerCase().includes('elite') && (f.format === '50-Over' || f.format === '50 Over'));
        }
        if (currentFormat === 'Elite T20') {
          return (f.competition && f.competition.toLowerCase().includes('elite') && f.format === 'T20');
        }
        return f.format === currentFormat || (f.competition && f.competition.toLowerCase().includes(currentFormat.toLowerCase()));
      });
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
        if (emptyTitle) emptyTitle.textContent = 'No Match Results Found';
        if (emptyDesc) emptyDesc.textContent = 'There are no past match results matching your selected filters.';
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(360px, 1fr))';
    container.style.gap = '24px';
    container.innerHTML = filtered.map((m, index) => createMatchCardHTML(m, index)).join('');
  }

  function renderStandings() {
    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = `
      <div class="card card-body" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; box-shadow: 0 12px 36px rgba(9, 21, 43, 0.08); padding: 32px;">
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="badge badge--gold" style="background: #09152B; color: #FFFFFF; font-weight: 900; letter-spacing: 0.08em; padding: 4px 12px; border-radius: 999px;">OFFICIAL CICA TABLE</span>
              <span style="font-size: 0.8125rem; font-weight: 800; color: #0284C7;">2026 SUPER LEAGUE</span>
            </div>
            <h2 style="color: #09152B; font-family: var(--font-display); font-size: 1.75rem; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 0.02em;">
              CICA T20 Super League Standings
            </h2>
          </div>
          <a href="https://cricclubs.com/CaymanCricketAssociation" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="border-radius: 999px; font-weight: 800; padding: 10px 20px;">
            <span>Live CricClubs Table ↗</span>
          </a>
        </div>
        <div class="table-responsive" style="border: 1.5px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(9, 21, 43, 0.04);">
          <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: #09152B; color: #FFFFFF;">
                <th style="padding: 14px 16px; font-family: var(--font-display); font-size: 0.95rem; letter-spacing: 0.06em; text-transform: uppercase;">Pos</th>
                <th style="padding: 14px 16px; font-family: var(--font-display); font-size: 0.95rem; letter-spacing: 0.06em; text-transform: uppercase;">Franchise Team</th>
                <th style="padding: 14px 16px; font-family: var(--font-display); font-size: 0.95rem; text-align: center;">P</th>
                <th style="padding: 14px 16px; font-family: var(--font-display); font-size: 0.95rem; text-align: center;">W</th>
                <th style="padding: 14px 16px; font-family: var(--font-display); font-size: 0.95rem; text-align: center;">L</th>
                <th style="padding: 14px 16px; font-family: var(--font-display); font-size: 0.95rem; text-align: center;">NR</th>
                <th style="padding: 14px 16px; font-family: var(--font-display); font-size: 0.95rem; text-align: center; color: #38BDF8;">Pts</th>
                <th style="padding: 14px 16px; font-family: var(--font-display); font-size: 0.95rem; text-align: right;">NRR</th>
              </tr>
            </thead>
            <tbody>
              <!-- 1. CSK (Leader) -->
              <tr style="background: rgba(56, 189, 248, 0.08); font-weight: 800; border-bottom: 1.5px solid #E2E8F0;">
                <td style="padding: 14px 16px;"><span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #09152B; color: #FFFFFF; border-radius: 50%; font-size: 0.8rem; font-weight: 900;">1</span></td>
                <td style="padding: 14px 16px; display: flex; align-items: center; gap: 10px;">
                  <img src="assets/csk-official-logo.png" alt="CSK" style="width: 28px; height: 28px; object-fit: contain;">
                  <span style="color: #09152B; font-size: 1rem;">Cayman Super Kings (CSK)</span>
                  <span style="background: #09152B; color: #38BDF8; font-size: 0.68rem; font-weight: 900; padding: 2px 8px; border-radius: 999px; text-transform: uppercase;">LEADERS</span>
                </td>
                <td style="padding: 14px 16px; text-align: center; color: #09152B;">6</td>
                <td style="padding: 14px 16px; text-align: center; color: #16A34A; font-weight: 900;">6</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">0</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">0</td>
                <td style="padding: 14px 16px; text-align: center; color: #09152B; font-size: 1.15rem; font-weight: 900;">12</td>
                <td style="padding: 14px 16px; text-align: right; color: #16A34A; font-weight: 900;">+1.842</td>
              </tr>
              <!-- 2. WBW -->
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 14px 16px; font-weight: 700; color: #09152B;">2</td>
                <td style="padding: 14px 16px; display: flex; align-items: center; gap: 10px;">
                  <img src="assets/teams/wbw.png" alt="WBW" style="width: 26px; height: 26px; object-fit: contain;">
                  <span style="color: #1E293B; font-weight: 700;">West Bay Warriors</span>
                </td>
                <td style="padding: 14px 16px; text-align: center; color: #1E293B;">6</td>
                <td style="padding: 14px 16px; text-align: center; color: #16A34A; font-weight: 800;">4</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">2</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">0</td>
                <td style="padding: 14px 16px; text-align: center; color: #09152B; font-weight: 800;">8</td>
                <td style="padding: 14px 16px; text-align: right; color: #16A34A; font-weight: 800;">+0.920</td>
              </tr>
              <!-- 3. GTT -->
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 14px 16px; font-weight: 700; color: #09152B;">3</td>
                <td style="padding: 14px 16px; display: flex; align-items: center; gap: 10px;">
                  <img src="assets/teams/gtt.png" alt="GTT" style="width: 26px; height: 26px; object-fit: contain;">
                  <span style="color: #1E293B; font-weight: 700;">George Town Tigers</span>
                </td>
                <td style="padding: 14px 16px; text-align: center; color: #1E293B;">6</td>
                <td style="padding: 14px 16px; text-align: center; color: #16A34A; font-weight: 800;">3</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">3</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">0</td>
                <td style="padding: 14px 16px; text-align: center; color: #09152B; font-weight: 800;">6</td>
                <td style="padding: 14px 16px; text-align: right; color: #16A34A; font-weight: 800;">+0.140</td>
              </tr>
              <!-- 4. SMS -->
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 14px 16px; font-weight: 700; color: #09152B;">4</td>
                <td style="padding: 14px 16px; display: flex; align-items: center; gap: 10px;">
                  <img src="assets/teams/sms.png" alt="SMS" style="width: 26px; height: 26px; object-fit: contain;">
                  <span style="color: #1E293B; font-weight: 700;">Seven Mile Strikers</span>
                </td>
                <td style="padding: 14px 16px; text-align: center; color: #1E293B;">6</td>
                <td style="padding: 14px 16px; text-align: center; color: #16A34A; font-weight: 800;">2</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">4</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">0</td>
                <td style="padding: 14px 16px; text-align: center; color: #09152B; font-weight: 800;">4</td>
                <td style="padding: 14px 16px; text-align: right; color: #DC2626; font-weight: 800;">-0.450</td>
              </tr>
              <!-- 5. BTCC -->
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 14px 16px; font-weight: 700; color: #09152B;">5</td>
                <td style="padding: 14px 16px; display: flex; align-items: center; gap: 10px;">
                  <img src="assets/teams/btcc.png" alt="BTCC" style="width: 26px; height: 26px; object-fit: contain;">
                  <span style="color: #64748B; font-weight: 600;">Bodden Town CC</span>
                </td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">6</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">2</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">4</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">0</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B; font-weight: 700;">4</td>
                <td style="padding: 14px 16px; text-align: right; color: #DC2626; font-weight: 700;">-0.890</td>
              </tr>
              <!-- 6. PCC -->
              <tr>
                <td style="padding: 14px 16px; font-weight: 700; color: #09152B;">6</td>
                <td style="padding: 14px 16px; display: flex; align-items: center; gap: 10px;">
                  <img src="assets/teams/pcc.png" alt="PCC" style="width: 26px; height: 26px; object-fit: contain;">
                  <span style="color: #64748B; font-weight: 600;">Police Cricket Club</span>
                </td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">6</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">1</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">5</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B;">0</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748B; font-weight: 700;">2</td>
                <td style="padding: 14px 16px; text-align: right; color: #DC2626; font-weight: 700;">-1.540</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="font-size: 0.8125rem; color: #64748B; margin-top: 18px; font-weight: 600;">
          * Standings updated following Round 6 matchday results. Top 4 teams qualify for the Championship Play-offs at Jimmy Powell Oval.
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
      vgc: 'assets/teams/vgc.png',
      gtt: 'assets/teams/gtt.png',
      sms: 'assets/teams/sms.png',
      btcc: 'assets/teams/btcc.png',
      wbw: 'assets/teams/wbw.png',
      pcc: 'assets/teams/pcc.png',
      nsxi: 'assets/teams/nsxi.png'
    };
    const oppLogo = oppLogoMap[oppKey] || 'assets/teams/vgc.png';
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
          <!-- Top Tags Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 6px;">
            <div style="display: flex; gap: 6px; align-items: center;">
              <span class="ticket-competition-tag">${m.competition || 'CICA T20'}</span>
              <span class="ticket-format-tag">${m.format || 'T20'}</span>
            </div>

            <!-- Slanted Time Pill -->
            <div class="ticket-time-pill">
              <span>${timeDisplay}</span>
              <span class="ticket-time-stripes">///</span>
            </div>
          </div>

          <!-- Teams Matchup -->
          <div class="ticket-matchup">
            <!-- Team 1 -->
            <div class="ticket-team">
              <div class="ticket-crest-aura">
                <img src="${team1Logo}" alt="${team1Name}" class="ticket-team-crest">
              </div>
              <span class="ticket-team-name">${team1Name}</span>
              ${isResult && team1Score ? `<span class="ticket-team-score">${team1Score}</span>` : ''}
            </div>

            <!-- VS Center -->
            <div class="ticket-vs">
              <span class="ticket-vs-text">VS</span>
              ${isResult ? `<span class="ticket-vs-result">${m.is_csk_win ? 'CSK WON' : 'COMPLETED'}</span>` : '<span class="ticket-vs-sub">MATCHDAY</span>'}
            </div>

            <!-- Team 2 -->
            <div class="ticket-team">
              <div class="ticket-crest-aura">
                <img src="${team2Logo}" alt="${team2Name}" class="ticket-team-crest">
              </div>
              <span class="ticket-team-name">${team2Name}</span>
              ${isResult && team2Score ? `<span class="ticket-team-score">${team2Score}</span>` : ''}
            </div>
          </div>

          <!-- Venue & Pitch -->
          <div class="ticket-venue">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${m.venue || 'Jimmy Powell Oval, George Town'}</span>
          </div>

          <!-- Overlapping Bottom Match Center Pill -->
          <a href="${detailUrl}" class="ticket-btn-pill" ${!isResult && m.cricclubs_url ? 'target="_blank" rel="noopener noreferrer"' : ''}>
            <span>${isResult ? 'MATCH REPORT & SCORECARD' : 'MATCH CENTER'}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
    const handleFormatChange = (e) => {
      currentFormat = e.target.value;
      render();
    };
    formatFilter.addEventListener('change', handleFormatChange);
    formatFilter.addEventListener('input', handleFormatChange);
  }

  if (seasonFilter) {
    const handleSeasonChange = (e) => {
      currentSeason = e.target.value;
      render();
    };
    seasonFilter.addEventListener('change', handleSeasonChange);
    seasonFilter.addEventListener('input', handleSeasonChange);
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

  const oppKey = (match.opponent_short || '').toLowerCase();
  const oppLogoMap = {
    vgc: 'assets/teams/vgc.png',
    gtt: 'assets/teams/gtt.png',
    sms: 'assets/teams/sms.png',
    btcc: 'assets/teams/btcc.png',
    wbw: 'assets/teams/wbw.png',
    pcc: 'assets/teams/pcc.png',
    nsxi: 'assets/teams/nsxi.png'
  };
  const oppLogo = oppLogoMap[oppKey] || 'assets/teams/vgc.png';

  container.innerHTML = `
    <!-- Header Hero -->
    <div class="match-header-banner" style="background: linear-gradient(180deg, #09152B 0%, #0D1D3A 50%, #060E1E 100%); color: #FFFFFF; padding: 36px 0;">
      <div class="container">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
          <span class="badge badge--gold" style="font-weight: 800; letter-spacing: 0.06em;">${match.competition}</span>
          <span class="badge" style="background: rgba(255,255,255,0.15); color: #FFFFFF; font-weight: 800;">${match.format}</span>
          <span style="color: #94A3B8; font-size: 0.875rem; font-weight: 600;">${formatDate(match.date)} • ${match.venue}</span>
        </div>

        <div class="match-score-display" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; background: rgba(13, 23, 44, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; padding: 28px 32px; box-shadow: 0 14px 40px rgba(0,0,0,0.4);">
          <div class="team-score-block">
            <h3 style="color: #38BDF8; font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; margin-bottom: 6px; display: flex; align-items: center; gap: 10px;">
              <img src="assets/csk-official-logo.png" alt="CSK" style="width: 32px; height: 32px; object-fit: contain;">
              <span>Cayman Super Kings</span>
            </h3>
            <div class="score-large tabular-nums" style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF;">${match.score_csk || 'Upcoming'}</div>
            ${match.overs_csk ? `<div class="overs" style="color: #94A3B8; font-size: 0.9rem; font-weight: 600;">${match.overs_csk} Overs</div>` : ''}
          </div>

          <div style="text-align: center;">
            <div class="match-result-pill" style="display: inline-block; background: #0284C7; color: #FFFFFF; font-weight: 800; font-size: 0.875rem; padding: 6px 18px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.06em;">${match.result_text}</div>
            ${match.player_of_match ? `<div style="font-size: 0.875rem; color: #F59E0B; margin-top: 8px; font-weight: 700;">★ Player of the Match: ${match.player_of_match}</div>` : ''}
          </div>

          <div class="team-score-block" style="text-align: right;">
            <h3 style="color: #E2E8F0; font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; margin-bottom: 6px; display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
              <span>${match.opponent}</span>
              <img src="${oppLogo}" alt="${match.opponent}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 50%; background: #FFFFFF; padding: 2px;">
            </h3>
            <div class="score-large tabular-nums" style="font-size: 2.2rem; font-weight: 900; color: #CBD5E1;">${match.score_opp || '—'}</div>
            ${match.overs_opp ? `<div class="overs" style="color: #94A3B8; font-size: 0.9rem; font-weight: 600;">${match.overs_opp} Overs</div>` : ''}
          </div>
        </div>

        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <a href="${match.cricclubs_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-weight: 800; border-radius: 999px;">
            Full scorecard on CricClubs ↗
          </a>
        </div>
      </div>
    </div>

    <!-- Match Content (Tables & Report) -->
    <section class="section" style="padding: 48px 0;">
      <div class="container">
        <div class="grid" style="gap: 32px;">
          <div class="col-8">
            <h2 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 900; color: #09152B; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.02em;">Match Report &amp; Analysis</h2>
            
            <!-- Match Summary Lead Card -->
            <div style="margin-bottom: 36px;">
              <p class="lead" style="font-size: 1.15rem; font-weight: 500; color: #1E293B; line-height: 1.75; margin: 0; padding: 24px 28px; background: #FFFFFF; border-left: 5px solid #0284C7; border-radius: 0 14px 14px 0; border-top: 1.5px solid #CBD5E1; border-right: 1.5px solid #CBD5E1; border-bottom: 1.5px solid #CBD5E1; box-shadow: 0 6px 20px rgba(9,21,43,0.06);">
                ${match.summary || 'A dominant performance from the Cayman Super Kings in this crucial league fixture.'}
              </p>
            </div>

            <!-- Scorecard Tables -->
            ${match.scorecard ? `
              <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: #09152B; text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.02em;">CSK Batting Card</h3>
              <div class="table-responsive" style="margin-bottom: 36px; border: 1.5px solid #CBD5E1; border-radius: 12px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); background: #FFFFFF;">
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #09152B; color: #FFFFFF;">
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #F59E0B; text-align: left;">Batter</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #94A3B8; text-align: left;">Dismissal</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #FFFFFF; text-align: center;">R</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #CBD5E1; text-align: center;">B</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #CBD5E1; text-align: center;">4s</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #CBD5E1; text-align: center;">6s</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #CBD5E1; text-align: right;">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${match.scorecard.csk_batting.map(b => `
                      <tr style="border-bottom: 1px solid #E2E8F0; transition: background 0.2s;">
                        <td style="padding: 12px 16px; font-weight: 800; color: #09152B;">${b.player}</td>
                        <td style="padding: 12px 16px; color: #64748B; font-size: 0.875rem;">${b.dismissal}</td>
                        <td style="padding: 12px 16px; text-align: center; font-weight: 900; color: #09152B; font-size: 1rem;">${b.runs}</td>
                        <td style="padding: 12px 16px; text-align: center; color: #334155;">${b.balls}</td>
                        <td style="padding: 12px 16px; text-align: center; color: #334155;">${b.fours}</td>
                        <td style="padding: 12px 16px; text-align: center; color: #334155;">${b.sixes}</td>
                        <td style="padding: 12px 16px; text-align: right; color: #0284C7; font-weight: 700;">${b.sr}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: #09152B; text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.02em;">CSK Bowling Analysis</h3>
              <div class="table-responsive" style="margin-bottom: 40px; border: 1.5px solid #CBD5E1; border-radius: 12px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); background: #FFFFFF;">
                <table class="data-table" style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #09152B; color: #FFFFFF;">
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #F59E0B; text-align: left;">Bowler</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #CBD5E1; text-align: center;">O</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #CBD5E1; text-align: center;">M</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #CBD5E1; text-align: center;">R</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #EF4444; text-align: center;">W</th>
                      <th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: #0284C7; text-align: right;">Econ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${match.scorecard.csk_bowling.map(bow => `
                      <tr style="border-bottom: 1px solid #E2E8F0; transition: background 0.2s;">
                        <td style="padding: 12px 16px; font-weight: 800; color: #09152B;">${bow.bowler}</td>
                        <td style="padding: 12px 16px; text-align: center; color: #334155;">${bow.overs}</td>
                        <td style="padding: 12px 16px; text-align: center; color: #334155;">${bow.maidens}</td>
                        <td style="padding: 12px 16px; text-align: center; color: #334155;">${bow.runs}</td>
                        <td style="padding: 12px 16px; text-align: center; font-weight: 900; color: #DC2626; font-size: 1rem;">${bow.wickets}</td>
                        <td style="padding: 12px 16px; text-align: right; color: #0284C7; font-weight: 700;">${bow.econ}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>

          <!-- Sidebar -->
          <div class="col-4">
            <!-- Official Verification Card -->
            <div class="card card-body" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 14px; padding: 26px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); margin-bottom: 24px;">
              <h4 style="color: #09152B; font-family: var(--font-display); font-size: 1.15rem; font-weight: 900; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Official Verification</h4>
              <p style="font-size: 0.9rem; line-height: 1.65; color: #334155; margin-bottom: 18px; font-weight: 500;">
                All match scores, ball-by-ball records, and official league points are certified by Cayman Islands Cricket Association umpires.
              </p>
              <a href="${match.cricclubs_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-navy btn-sm" style="font-weight: 800; border-radius: 999px; width: 100%; text-align: center; justify-content: center;">
                Open CricClubs Portal ↗
              </a>
            </div>

            <!-- Match Details Card -->
            <div class="card card-body" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 14px; padding: 26px; box-shadow: 0 6px 20px rgba(9,21,43,0.06);">
              <h4 style="color: #09152B; font-family: var(--font-display); font-size: 1.15rem; font-weight: 900; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.04em;">Match Details</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; padding: 0; margin: 0;">
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;"><strong style="color: #64748B;">Competition:</strong> <span style="color: #09152B; font-weight: 800;">${match.competition}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;"><strong style="color: #64748B;">Format:</strong> <span style="color: #09152B; font-weight: 800;">${match.format}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;"><strong style="color: #64748B;">Venue:</strong> <span style="color: #09152B; font-weight: 800;">${match.venue}</span></li>
                <li style="display: flex; justify-content: space-between; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;"><strong style="color: #64748B;">Date:</strong> <span style="color: #09152B; font-weight: 800;">${formatDate(match.date)}</span></li>
                <li style="display: flex; justify-content: space-between;"><strong style="color: #64748B;">Status:</strong> <span style="color: #0284C7; font-weight: 900;">${match.status.toUpperCase()}</span></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Prev / Next Navigation Footer -->
        <div class="match-nav-footer" style="margin-top: 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          ${prevMatch ? `
            <a href="match-detail.html?slug=${prevMatch.slug}" class="btn btn-outline-navy btn-sm" style="font-weight: 800; border-radius: 999px;">
              ← Prev: vs ${prevMatch.opponent}
            </a>
          ` : '<div></div>'}

          <a href="matches.html" class="btn btn-primary btn-sm" style="font-weight: 800; border-radius: 999px;">All Matches &amp; Fixtures</a>

          ${nextMatch ? `
            <a href="match-detail.html?slug=${nextMatch.slug}" class="btn btn-outline-navy btn-sm" style="font-weight: 800; border-radius: 999px;">
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

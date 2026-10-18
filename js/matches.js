/**
 * ─────────────────────────────────────────────────────────────
 * MATCHES & RESULTS MODULE
 * Dynamic CricClubs sync, verified CICA league scorecards & telemetry
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

export async function initMatchesPage() {
  const container = document.getElementById('matches-list');
  const emptyState = document.getElementById('matches-empty');
  const formatFilter = document.getElementById('format-filter');
  const seasonFilter = document.getElementById('season-filter');
  const resultFilter = document.getElementById('result-filter');
  const syncBtn = document.getElementById('btn-sync-matches');
  const syncTimestamp = document.getElementById('sync-timestamp');

  if (!container) return;

  let fixtures = await store.getFixtures();
  let currentFormat = formatFilter ? formatFilter.value : 'all';
  let currentSeason = seasonFilter ? seasonFilter.value : 'all';
  let currentResult = resultFilter ? resultFilter.value : 'all';

  function updateFilterCounts() {
    let pool = fixtures.filter(f => f.status === 'result');
    if (currentFormat !== 'all') {
      pool = pool.filter(f => {
        const comp = (f.competition || '').toLowerCase();
        if (currentFormat === 'Super League T20') {
          return comp.includes('super league') && f.format === 'T20';
        }
        if (currentFormat === 'Super League 40-Over') {
          return comp.includes('super league') && (f.format === '40-Over' || f.format === '40 Over');
        }
        if (currentFormat === 'Elite 50-Over') {
          return comp.includes('elite') && (f.format === '50-Over' || f.format === '50 Over');
        }
        if (currentFormat === 'Elite T20') {
          return comp.includes('elite') && f.format === 'T20';
        }
        if (currentFormat === 'Daniel Morris T20') {
          return comp.includes('daniel morris');
        }
        return f.format === currentFormat || comp.includes(currentFormat.toLowerCase());
      });
    }
    if (currentSeason !== 'all') {
      pool = pool.filter(f => f.season === currentSeason);
    }
    const wonCount = pool.filter(f => f.is_csk_win === true).length;
    const lostCount = pool.filter(f => f.is_csk_win === false).length;
    if (resultFilter) {
      const wonOpt = resultFilter.querySelector('option[value="won"]');
      const lostOpt = resultFilter.querySelector('option[value="lost"]');
      if (wonOpt) wonOpt.textContent = `CSK Won (${wonCount})`;
      if (lostOpt) lostOpt.textContent = `CSK Lost (${lostCount})`;
    }
  }
  updateFilterCounts();

  function updateSyncTimeDisplay() {
    if (syncTimestamp) {
      const now = new Date();
      const caymanTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Cayman',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      syncTimestamp.textContent = `Live Synced at ${caymanTimeStr} EST (Cayman Time) • Official CICA Portal`;
    }
  }
  updateSyncTimeDisplay();
  setInterval(updateSyncTimeDisplay, 30000);

  // Wire up dynamic Live Sync button
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      syncBtn.classList.add('is-syncing');
      syncBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        <span>Syncing...</span>
      `;
      
      try {
        fixtures = await store.getFixtures(true);
        updateSyncTimeDisplay();
        updateFilterCounts();
        render();
      } catch (err) {
        console.warn('Sync refresh error:', err);
      } finally {
        setTimeout(() => {
          syncBtn.classList.remove('is-syncing');
          syncBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>Sync Live</span>
          `;
        }, 600);
      }
    });
  }

  function render() {
    let filtered = fixtures.filter(f => f.status === 'result');
    
    if (currentFormat !== 'all') {
      filtered = filtered.filter(f => {
        const comp = (f.competition || '').toLowerCase();
        if (currentFormat === 'Super League T20') {
          return comp.includes('super league') && f.format === 'T20';
        }
        if (currentFormat === 'Super League 40-Over') {
          return comp.includes('super league') && (f.format === '40-Over' || f.format === '40 Over');
        }
        if (currentFormat === 'Elite 50-Over') {
          return comp.includes('elite') && (f.format === '50-Over' || f.format === '50 Over');
        }
        if (currentFormat === 'Elite T20') {
          return comp.includes('elite') && f.format === 'T20';
        }
        if (currentFormat === 'Daniel Morris T20') {
          return comp.includes('daniel morris');
        }
        return f.format === currentFormat || comp.includes(currentFormat.toLowerCase());
      });
    }
    if (currentSeason !== 'all') {
      filtered = filtered.filter(f => f.season === currentSeason);
    }
    if (currentResult !== 'all') {
      if (currentResult === 'won') {
        filtered = filtered.filter(f => f.is_csk_win === true);
      } else if (currentResult === 'lost') {
        filtered = filtered.filter(f => f.is_csk_win === false);
      }
    }

    if (filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) {
        emptyState.style.display = 'block';
        const emptyTitle = emptyState.querySelector('.empty-state__title');
        const emptyDesc = emptyState.querySelector('.empty-state__desc');
        if (emptyTitle) emptyTitle.textContent = 'No Match Results Found';
        if (emptyDesc) emptyDesc.textContent = 'There are no match records matching your selected tournament filters.';
      }
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';
    container.className = 'matches-dynamic-grid';
    container.innerHTML = filtered.map((m, index) => createMatchCardHTML(m, index)).join('');
  }

  function createMatchCardHTML(m, index) {
    const isResult = m.status === 'result';

    // Parse date for ticket stub
    const dateObj = new Date(m.date + 'T00:00:00');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = !isNaN(dateObj.getTime()) ? monthNames[dateObj.getMonth()] : 'APR';
    const day = !isNaN(dateObj.getTime()) ? String(dateObj.getDate()).padStart(2, '0') : '06';

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
      nsxi: 'assets/teams/nsxi.png',
      tncc: 'assets/teams/tncc.png'
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

    const detailUrl = `match-detail.html?slug=${m.slug}`;

    return `
      <div class="fixture-ticket futuristic-card">
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
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px;">
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
              <span class="ticket-competition-tag">${m.competition || 'CICA Tournament'}</span>
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
              ${isResult ? `<span class="ticket-vs-result ${m.is_csk_win ? 'is-win' : 'is-loss'}">${m.is_csk_win ? 'CSK WON' : 'CSK LOST'}</span>` : '<span class="ticket-vs-sub">MATCHDAY</span>'}
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
          <a href="${detailUrl}" class="ticket-btn-pill">
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

  if (formatFilter) {
    const handleFormatChange = (e) => {
      currentFormat = e.target.value;
      updateFilterCounts();
      render();
    };
    formatFilter.addEventListener('change', handleFormatChange);
    formatFilter.addEventListener('input', handleFormatChange);
  }

  if (seasonFilter) {
    const handleSeasonChange = (e) => {
      currentSeason = e.target.value;
      updateFilterCounts();
      render();
    };
    seasonFilter.addEventListener('change', handleSeasonChange);
    seasonFilter.addEventListener('input', handleSeasonChange);
  }

  if (resultFilter) {
    const handleResultChange = (e) => {
      currentResult = e.target.value;
      render();
    };
    resultFilter.addEventListener('change', handleResultChange);
    resultFilter.addEventListener('input', handleResultChange);
  }

  render();
}

export async function initMatchDetail() {
  const container = document.getElementById('match-detail-content');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || 'csk-vs-tamilnadu-daniel-morris-t20-final';

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
    nsxi: 'assets/teams/nsxi.png',
    tncc: 'assets/teams/tncc.png'
  };
  const oppLogo = oppLogoMap[oppKey] || 'assets/teams/vgc.png';

  container.innerHTML = `
    <!-- Header Hero -->
    <div class="match-header-banner" style="background: linear-gradient(180deg, #050E20 0%, #0A1E42 50%, #030814 100%); color: #FFFFFF; padding: 40px 0; border-bottom: 1.5px solid rgba(56, 189, 248, 0.2);">
      <div class="container">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 18px; flex-wrap: wrap;">
          <span class="badge badge--gold" style="font-weight: 800; letter-spacing: 0.06em; background: #09152B; border: 1px solid rgba(56, 189, 248, 0.35); color: #38BDF8;">${match.competition}</span>
          <span class="badge" style="background: rgba(255,255,255,0.12); color: #FFFFFF; font-weight: 800;">${match.format}</span>
          <span style="color: #94A3B8; font-size: 0.875rem; font-weight: 600;">${formatDate(match.date)} • ${match.venue}</span>
        </div>

        <div class="match-score-display" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; background: rgba(13, 23, 44, 0.9); border: 1.5px solid rgba(56, 189, 248, 0.25); border-radius: 18px; padding: 30px 34px; box-shadow: 0 16px 48px rgba(0,0,0,0.45);">
          <div class="team-score-block">
            <h3 style="color: #38BDF8; font-family: var(--font-display); font-size: 1.45rem; font-weight: 900; margin-bottom: 6px; display: flex; align-items: center; gap: 10px;">
              <img src="assets/csk-official-logo.png" alt="CSK" style="width: 36px; height: 36px; object-fit: contain;">
              <span>Cayman Super Kings</span>
            </h3>
            <div class="score-large tabular-nums" style="font-size: 2.3rem; font-weight: 900; color: #FFFFFF;">${match.score_csk || 'Upcoming'}</div>
            ${match.overs_csk ? `<div class="overs" style="color: #94A3B8; font-size: 0.9rem; font-weight: 600;">${match.overs_csk} Overs</div>` : ''}
          </div>

          <div style="text-align: center;">
            <div class="match-result-pill ${match.is_csk_win ? 'is-win' : 'is-loss'}" style="display: inline-block; background: ${match.is_csk_win ? '#0284C7' : '#DC2626'}; color: #FFFFFF; font-weight: 800; font-size: 0.875rem; padding: 7px 20px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.06em; box-shadow: 0 0 16px ${match.is_csk_win ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.4)'};">${match.result_text}</div>
            ${match.player_of_match ? `<div style="font-size: 0.875rem; color: #F59E0B; margin-top: 10px; font-weight: 800;">★ Player of the Match: ${match.player_of_match}</div>` : ''}
          </div>

          <div class="team-score-block" style="text-align: right;">
            <h3 style="color: #E2E8F0; font-family: var(--font-display); font-size: 1.45rem; font-weight: 900; margin-bottom: 6px; display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
              <span>${match.opponent}</span>
              <img src="${oppLogo}" alt="${match.opponent}" style="width: 36px; height: 36px; object-fit: contain; border-radius: 50%; background: #FFFFFF; padding: 2px;">
            </h3>
            <div class="score-large tabular-nums" style="font-size: 2.3rem; font-weight: 900; color: #CBD5E1;">${match.score_opp || '—'}</div>
            ${match.overs_opp ? `<div class="overs" style="color: #94A3B8; font-size: 0.9rem; font-weight: 600;">${match.overs_opp} Overs</div>` : ''}
          </div>
        </div>

        <div style="margin-top: 22px; display: flex; justify-content: flex-end;">
          <a href="${match.cricclubs_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-weight: 800; border-radius: 999px; padding: 10px 22px; box-shadow: 0 0 20px rgba(56, 189, 248, 0.35);">
            Official Scorecard on CricClubs ↗
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
              <p class="lead" style="font-size: 1.15rem; font-weight: 500; color: #1E293B; line-height: 1.75; margin: 0; padding: 24px 28px; background: #FFFFFF; border-left: 5px solid ${match.is_csk_win ? '#0284C7' : '#DC2626'}; border-radius: 0 14px 14px 0; border-top: 1.5px solid #CBD5E1; border-right: 1.5px solid #CBD5E1; border-bottom: 1.5px solid #CBD5E1; box-shadow: 0 6px 20px rgba(9,21,43,0.06);">
                ${match.summary || 'A competitive encounter from the Cayman Super Kings in this crucial league fixture.'}
              </p>
            </div>

            <!-- Scorecard Tables -->
            ${match.scorecard ? `
              <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: #09152B; text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.02em;">CSK Batting Card</h3>
              <div class="table-responsive" style="margin-bottom: 36px; border: 1.5px solid #CBD5E1; border-radius: 12px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); background: #FFFFFF; overflow-x: auto;">
                <table class="data-table" style="width: 100%; border-collapse: collapse; min-width: 520px;">
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
              <div class="table-responsive" style="margin-bottom: 40px; border: 1.5px solid #CBD5E1; border-radius: 12px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); background: #FFFFFF; overflow-x: auto;">
                <table class="data-table" style="width: 100%; border-collapse: collapse; min-width: 500px;">
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
            <div class="card card-body futuristic-card" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 26px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); margin-bottom: 24px;">
              <h4 style="color: #09152B; font-family: var(--font-display); font-size: 1.15rem; font-weight: 900; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Official Verification</h4>
              <p style="font-size: 0.9rem; line-height: 1.65; color: #334155; margin-bottom: 18px; font-weight: 500;">
                All match scores, ball-by-ball records, and official tournament points are certified by Cayman Islands Cricket Association umpires.
              </p>
              <a href="${match.cricclubs_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-navy btn-sm" style="font-weight: 800; border-radius: 999px; width: 100%; text-align: center; justify-content: center;">
                Open CricClubs Portal ↗
              </a>
            </div>

            <!-- Match Details Card -->
            <div class="card card-body futuristic-card" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 26px; box-shadow: 0 6px 20px rgba(9,21,43,0.06);">
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

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

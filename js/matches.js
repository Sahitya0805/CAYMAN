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

  function populateFilterOptions() {
    const played = fixtures.filter(isPlayed);
    if (formatFilter) {
      const series = [...new Set(played.map(f => f.competition).filter(Boolean))];
      formatFilter.innerHTML = '<option value="all">All Competitions</option>' +
        series.map(sr => `<option value="${escapeAttr(sr)}">${sr}</option>`).join('');
      formatFilter.value = 'all';
      currentFormat = 'all';
    }
    if (seasonFilter) {
      const seasons = [...new Set(played.map(f => f.season).filter(Boolean))].sort().reverse();
      seasonFilter.innerHTML = '<option value="all">All Seasons</option>' +
        seasons.map(y => `<option value="${y}">${y} Season</option>`).join('');
      seasonFilter.value = 'all';
      currentSeason = 'all';
    }
  }

  function applyBaseFilters(list) {
    let pool = list.filter(isPlayed);
    if (currentFormat !== 'all') pool = pool.filter(f => f.competition === currentFormat);
    if (currentSeason !== 'all') pool = pool.filter(f => f.season === currentSeason);
    return pool;
  }

  function updateFilterCounts() {
    const pool = applyBaseFilters(fixtures);
    const wonCount = pool.filter(f => f.is_csk_win === true).length;
    const lostCount = pool.filter(f => f.is_csk_win === false).length;
    if (resultFilter) {
      const allOpt = resultFilter.querySelector('option[value="all"]');
      const wonOpt = resultFilter.querySelector('option[value="won"]');
      const lostOpt = resultFilter.querySelector('option[value="lost"]');
      if (allOpt) allOpt.textContent = `All Results (${pool.length})`;
      if (wonOpt) wonOpt.textContent = `CSK Won (${wonCount})`;
      if (lostOpt) lostOpt.textContent = `CSK Lost (${lostCount})`;
    }
  }
  populateFilterOptions();
  updateFilterCounts();

  async function updateSyncTimeDisplay() {
    if (!syncTimestamp) return;
    const meta = await store.getMatchesMetadata();
    const played = fixtures.filter(isPlayed).length;
    const updated = meta && meta.updated_at
      ? new Date(meta.updated_at + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : null;
    syncTimestamp.textContent = `${played} official results from CICA CricClubs${updated ? ` • Updated ${updated}` : ''}`;
  }
  updateSyncTimeDisplay();

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
        populateFilterOptions();
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
            <span>Refresh</span>
          `;
        }, 600);
      }
    });
  }

  function render() {
    let filtered = applyBaseFilters(fixtures);
    if (currentResult === 'won') {
      filtered = filtered.filter(f => f.is_csk_win === true);
    } else if (currentResult === 'lost') {
      filtered = filtered.filter(f => f.is_csk_win === false);
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
    const noResult = m.is_csk_win !== true && m.is_csk_win !== false;

    // Parse date for ticket stub
    const dateObj = new Date(m.date + 'T00:00:00');
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const valid = !isNaN(dateObj.getTime());
    const month = valid ? monthNames[dateObj.getMonth()] : '';
    const day = valid ? String(dateObj.getDate()).padStart(2, '0') : '';
    const year = valid ? String(dateObj.getFullYear()) : '';

    const cskSide = { name: 'Cayman Super Kings', crest: teamCrestHTML('Cayman Super Kings', CSK_LOGO, 'ticket-team-crest'), score: m.score_csk, overs: m.overs_csk };
    const oppSide = { name: m.opponent, crest: teamCrestHTML(m.opponent, m.opponent_logo, 'ticket-team-crest'), score: m.score_opp, overs: m.overs_opp };
    const [first, second] = m.csk_batted_first === false ? [oppSide, cskSide] : [cskSide, oppSide];

    const scoreHTML = side => side.score
      ? `<span class="ticket-team-score">${side.score}${side.overs ? ` <small style="opacity:.7;font-weight:600;">(${side.overs})</small>` : ''}</span>`
      : '';

    const outcome = noResult
      ? '<span class="ticket-vs-result is-loss" style="background:#475569;">NO RESULT</span>'
      : `<span class="ticket-vs-result ${m.is_csk_win ? 'is-win' : 'is-loss'}">${m.is_csk_win ? 'CSK WON' : 'CSK LOST'}</span>`;

    const detailUrl = `match-detail.html?slug=${encodeURIComponent(m.slug)}`;

    return `
      <div class="fixture-ticket futuristic-card">
        <!-- Left Ticket Date Stub -->
        <div class="ticket-stub">
          <span class="ticket-notch-top"></span>
          <span class="ticket-month">${month}</span>
          <span class="ticket-day">${day}</span>
          <span class="ticket-match-num">${year}</span>
          <span class="ticket-notch-bottom"></span>
        </div>

        <!-- Right Main Ticket Body -->
        <div class="ticket-body">
          <!-- Top Tags Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 8px;">
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
              <span class="ticket-competition-tag">${m.competition || ''}</span>
              ${m.format ? `<span class="ticket-format-tag">${m.format}</span>` : ''}
            </div>

            ${m.time ? `
            <!-- Slanted Time Pill -->
            <div class="ticket-time-pill">
              <span>${formatTime(m.time)}</span>
              <span class="ticket-time-stripes">///</span>
            </div>` : ''}
          </div>

          <!-- Teams Matchup -->
          <div class="ticket-matchup">
            <div class="ticket-team">
              <div class="ticket-crest-aura">${first.crest}</div>
              <span class="ticket-team-name">${first.name}</span>
              ${scoreHTML(first)}
            </div>

            <div class="ticket-vs">
              <span class="ticket-vs-text">VS</span>
              ${outcome}
            </div>

            <div class="ticket-team">
              <div class="ticket-crest-aura">${second.crest}</div>
              <span class="ticket-team-name">${second.name}</span>
              ${scoreHTML(second)}
            </div>
          </div>

          <!-- Result line -->
          <div class="ticket-venue" style="font-weight: 700;">
            <span>${m.result_text || ''}</span>
          </div>

          ${m.venue ? `
          <!-- Venue -->
          <div class="ticket-venue">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${m.venue}</span>
          </div>` : ''}

          <!-- Overlapping Bottom Match Center Pill -->
          <a href="${detailUrl}" class="ticket-btn-pill">
            <span>${m.scorecard ? 'MATCH REPORT & SCORECARD' : 'MATCH DETAILS'}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    `;
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
  const slug = urlParams.get('slug');

  const fixtures = (await store.getFixtures()).filter(isPlayed);
  let matchIndex = fixtures.findIndex(f => f.slug === slug || f.id === slug);
  if (matchIndex < 0) matchIndex = 0;
  const match = fixtures[matchIndex];

  if (!match) {
    container.innerHTML = `<section class="section"><div class="container"><p>Match not found. <a href="matches.html">Back to all matches</a></p></div></section>`;
    return;
  }

  // List is newest-first: "previous" = older match, "next" = newer match
  const prevMatch = fixtures[matchIndex + 1] || null;
  const nextMatch = matchIndex > 0 ? fixtures[matchIndex - 1] : null;

  document.title = `${match.competition}: CSK vs ${match.opponent} | Cayman Super Kings`;

  const noResult = match.is_csk_win !== true && match.is_csk_win !== false;
  const pillColor = noResult ? '#475569' : (match.is_csk_win ? '#0284C7' : '#DC2626');
  const pillGlow = noResult ? 'rgba(71, 85, 105, 0.4)' : (match.is_csk_win ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.4)');
  const scorecardUrl = match.cricclubs_url;
  const innings = (match.scorecard && match.scorecard.innings) || [];

  const th = (label, align = 'center', color = '#CBD5E1') =>
    `<th style="padding: 14px 16px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: ${color}; text-align: ${align};">${label}</th>`;
  const td = (val, align = 'center', extra = 'color: #334155;') =>
    `<td style="padding: 12px 16px; text-align: ${align}; ${extra}">${val}</td>`;

  const inningsHTML = innings.map((inn, idx) => {
    const bowlingSide = innings[idx === 0 ? 1 : 0];
    return `
      <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: #09152B; text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.02em;">${inn.team || `Innings ${idx + 1}`} Batting</h3>
      <div class="table-responsive" style="margin-bottom: 28px; border: 1.5px solid #CBD5E1; border-radius: 12px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); background: #FFFFFF; overflow-x: auto;">
        <table class="data-table" style="width: 100%; border-collapse: collapse; min-width: 520px;">
          <thead>
            <tr style="background: #09152B; color: #FFFFFF;">
              ${th('Batter', 'left', '#F59E0B')}${th('Dismissal', 'left', '#94A3B8')}${th('R', 'center', '#FFFFFF')}${th('B')}${th('4s')}${th('6s')}${th('SR', 'right')}
            </tr>
          </thead>
          <tbody>
            ${inn.batting.map(b => `
              <tr style="border-bottom: 1px solid #E2E8F0;">
                ${td(b.player, 'left', 'font-weight: 800; color: #09152B;')}
                ${td(b.dismissal, 'left', 'color: #64748B; font-size: 0.875rem;')}
                ${td(b.runs, 'center', 'font-weight: 900; color: #09152B; font-size: 1rem;')}
                ${td(b.balls)}${td(b.fours)}${td(b.sixes)}
                ${td(b.sr, 'right', 'color: #0284C7; font-weight: 700;')}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>

      ${inn.bowling && inn.bowling.length ? `
      <h3 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; color: #09152B; text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.02em;">${bowlingSide && bowlingSide.team ? bowlingSide.team : 'Opposition'} Bowling</h3>
      <div class="table-responsive" style="margin-bottom: 40px; border: 1.5px solid #CBD5E1; border-radius: 12px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); background: #FFFFFF; overflow-x: auto;">
        <table class="data-table" style="width: 100%; border-collapse: collapse; min-width: 500px;">
          <thead>
            <tr style="background: #09152B; color: #FFFFFF;">
              ${th('Bowler', 'left', '#F59E0B')}${th('O')}${th('M')}${th('R')}${th('W', 'center', '#EF4444')}${th('Econ', 'right', '#0284C7')}
            </tr>
          </thead>
          <tbody>
            ${inn.bowling.map(bw => `
              <tr style="border-bottom: 1px solid #E2E8F0;">
                ${td(bw.bowler, 'left', 'font-weight: 800; color: #09152B;')}
                ${td(bw.overs)}${td(bw.maidens)}${td(bw.runs)}
                ${td(bw.wickets, 'center', 'font-weight: 900; color: #DC2626; font-size: 1rem;')}
                ${td(bw.econ, 'right', 'color: #0284C7; font-weight: 700;')}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : ''}
    `;
  }).join('');

  const scoreBlock = (name, crest, score, overs, align, nameColor, scoreColor) => `
    <div class="team-score-block" style="text-align: ${align};">
      <h3 style="color: ${nameColor}; font-family: var(--font-display); font-size: 1.45rem; font-weight: 900; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; ${align === 'right' ? 'justify-content: flex-end;' : ''}">
        ${align === 'right' ? `<span>${name}</span>${crest}` : `${crest}<span>${name}</span>`}
      </h3>
      <div class="score-large tabular-nums" style="font-size: 2.3rem; font-weight: 900; color: ${scoreColor};">${score || '—'}</div>
      ${overs ? `<div class="overs" style="color: #94A3B8; font-size: 0.9rem; font-weight: 600;">${overs}${match.max_overs ? ` / ${match.max_overs}` : ''} Overs</div>` : ''}
    </div>`;
  const crestStyle = 'width: 36px; height: 36px; object-fit: contain; border-radius: 50%; background: #FFFFFF; padding: 2px;';

  container.innerHTML = `
    <!-- Header Hero -->
    <div class="match-header-banner" style="background: linear-gradient(180deg, #050E20 0%, #0A1E42 50%, #030814 100%); color: #FFFFFF; padding: 40px 0; border-bottom: 1.5px solid rgba(56, 189, 248, 0.2);">
      <div class="container">
        <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 18px; flex-wrap: wrap;">
          <span class="badge badge--gold" style="font-weight: 800; letter-spacing: 0.06em; background: #09152B; border: 1px solid rgba(56, 189, 248, 0.35); color: #38BDF8;">${match.competition}</span>
          ${match.format ? `<span class="badge" style="background: rgba(255,255,255,0.12); color: #FFFFFF; font-weight: 800;">${match.format}</span>` : ''}
          <span style="color: #94A3B8; font-size: 0.875rem; font-weight: 600;">${formatDate(match.date)}${match.time ? ` • ${formatTime(match.time)}` : ''}${match.venue ? ` • ${match.venue}` : ''}</span>
        </div>

        <div class="match-score-display" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; background: rgba(13, 23, 44, 0.9); border: 1.5px solid rgba(56, 189, 248, 0.25); border-radius: 18px; padding: 30px 34px; box-shadow: 0 16px 48px rgba(0,0,0,0.45);">
          ${scoreBlock('Cayman Super Kings', teamCrestHTML('Cayman Super Kings', CSK_LOGO, '', crestStyle), match.score_csk, match.overs_csk, 'left', '#38BDF8', '#FFFFFF')}

          <div style="text-align: center;">
            <div class="match-result-pill" style="display: inline-block; background: ${pillColor}; color: #FFFFFF; font-weight: 800; font-size: 0.875rem; padding: 7px 20px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.06em; box-shadow: 0 0 16px ${pillGlow};">${match.result_text}</div>
            <div style="font-size: 0.8rem; color: #94A3B8; margin-top: 10px; font-weight: 700;">${match.csk_batted_first === false ? `${match.opponent} batted first` : 'Cayman Super Kings batted first'}</div>
          </div>

          ${scoreBlock(match.opponent, teamCrestHTML(match.opponent, match.opponent_logo, '', crestStyle), match.score_opp, match.overs_opp, 'right', '#E2E8F0', '#CBD5E1')}
        </div>

        <div style="margin-top: 22px; display: flex; justify-content: flex-end;">
          <a href="${scorecardUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-weight: 800; border-radius: 999px; padding: 10px 22px; box-shadow: 0 0 20px rgba(56, 189, 248, 0.35);">
            Official Scorecard on CricClubs ↗
          </a>
        </div>
      </div>
    </div>

    <!-- Match Content (Scorecards) -->
    <section class="section" style="padding: 48px 0;">
      <div class="container">
        <div class="grid" style="gap: 32px;">
          <div class="col-8">
            <h2 style="font-family: var(--font-display); font-size: 1.85rem; font-weight: 900; color: #09152B; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.02em;">Full Scorecard</h2>
            ${inningsHTML || `
              <p style="font-size: 1.05rem; color: #334155; padding: 24px 28px; background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 14px;">
                ${noResult ? 'This match was not completed, so no scorecard was recorded.' : 'No detailed scorecard was published for this match.'}
                <a href="${scorecardUrl}" target="_blank" rel="noopener noreferrer" style="font-weight: 800; color: #0284C7;">View it on CricClubs ↗</a>
              </p>`}
          </div>

          <!-- Sidebar -->
          <div class="col-4">
            <div class="card card-body futuristic-card" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 26px; box-shadow: 0 6px 20px rgba(9,21,43,0.06); margin-bottom: 24px;">
              <h4 style="color: #09152B; font-family: var(--font-display); font-size: 1.15rem; font-weight: 900; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.04em;">Official Record</h4>
              <p style="font-size: 0.9rem; line-height: 1.65; color: #334155; margin-bottom: 18px; font-weight: 500;">
                Scores and scorecards on this page come from the Cayman Islands Cricket Association's official CricClubs records for this match.
              </p>
              <a href="${scorecardUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-navy btn-sm" style="font-weight: 800; border-radius: 999px; width: 100%; text-align: center; justify-content: center;">
                Open This Match on CricClubs ↗
              </a>
            </div>

            <div class="card card-body futuristic-card" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 16px; padding: 26px; box-shadow: 0 6px 20px rgba(9,21,43,0.06);">
              <h4 style="color: #09152B; font-family: var(--font-display); font-size: 1.15rem; font-weight: 900; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.04em;">Match Details</h4>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem; padding: 0; margin: 0;">
                ${[
                  ['Competition', match.competition],
                  ['Format', match.format],
                  ['Venue', match.venue],
                  ['Date', formatDate(match.date)],
                  ['Start', match.time ? formatTime(match.time) : ''],
                  ['Result', match.result_text]
                ].filter(([, v]) => v).map(([k, v], i, arr) => `
                  <li style="display: flex; justify-content: space-between; gap: 12px; ${i < arr.length - 1 ? 'border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;' : ''}"><strong style="color: #64748B;">${k}:</strong> <span style="color: #09152B; font-weight: 800; text-align: right;">${v}</span></li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Prev / Next Navigation Footer -->
        <div class="match-nav-footer" style="margin-top: 40px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          ${prevMatch ? `
            <a href="match-detail.html?slug=${encodeURIComponent(prevMatch.slug)}" class="btn btn-outline-navy btn-sm" style="font-weight: 800; border-radius: 999px;">
              ← Prev: vs ${prevMatch.opponent}
            </a>
          ` : '<div></div>'}

          <a href="matches.html" class="btn btn-primary btn-sm" style="font-weight: 800; border-radius: 999px;">All Matches</a>

          ${nextMatch ? `
            <a href="match-detail.html?slug=${encodeURIComponent(nextMatch.slug)}" class="btn btn-outline-navy btn-sm" style="font-weight: 800; border-radius: 999px;">
              Next: vs ${nextMatch.opponent} →
            </a>
          ` : '<div></div>'}
        </div>
      </div>
    </section>
  `;
}

const CSK_LOGO = 'assets/csk-official-logo.png';

function isPlayed(f) {
  return f && (f.status === 'result' || f.status === 'no_result');
}

function initials(name) {
  const words = String(name || '').split(/[\s']+/).filter(w => /^[A-Za-z0-9]/.test(w));
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function teamCrestHTML(name, logo, className = '', style = '') {
  const badge = (hidden) => `<span class="${className}" style="${style} display: ${hidden ? 'none' : 'inline-flex'}; align-items: center; justify-content: center; border-radius: 50%; background: #1E3A8A; color: #FFFFFF; font-weight: 900; font-size: 0.95rem; letter-spacing: 0.02em;">${initials(name)}</span>`;
  if (!logo) return badge(false);
  return `<img src="${escapeAttr(logo)}" alt="${escapeAttr(name)}" class="${className}" style="${style}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='inline-flex';">${badge(true)}`;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function formatTime(t) {
  if (!t) return '';
  const [h, mm] = t.split(':').map(Number);
  if (isNaN(h)) return t;
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')}${h >= 12 ? 'pm' : 'am'}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

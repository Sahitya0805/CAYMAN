/**
 * ─────────────────────────────────────────────────────────────
 * NEWS & ARTICLES MODULE
 * ─────────────────────────────────────────────────────────────
 */

import { store } from './content-store.js';

export async function initNewsPage() {
  const container = document.getElementById('news-grid');
  const emptyState = document.getElementById('news-empty');
  const categoryFilter = document.getElementById('news-category-filter');

  if (!container) return;

  const newsList = await store.getNews();
  let currentCategory = 'all';

  function render() {
    let filtered = newsList;
    if (currentCategory !== 'all') {
      filtered = filtered.filter(n => n.category.toLowerCase().includes(currentCategory.toLowerCase()));
    }

    if (filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'grid';

    container.innerHTML = filtered.map(item => `
      <div class="col-4">
        <a href="article.html?slug=${item.slug}" class="news-card-circular" style="text-decoration: none; color: inherit;">
          <div class="news-circular-header">
            <div class="news-circular-photo-wrap">
              <img src="${item.cover_image}" alt="${item.title}" class="news-circular-photo-img" loading="lazy">
            </div>
          </div>
          <div class="card-body" style="padding: 20px; display: flex; flex-direction: column; flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="badge badge--flame">${item.category}</span>
              <span style="font-size: 0.8125rem; color: #64748B; font-weight: 600;">${item.date}</span>
            </div>
            <h3 style="font-size: 1.125rem; margin-bottom: 10px; line-height: 1.35; color: #09152B; font-weight: 800;">${item.title}</h3>
            <p style="font-size: 0.875rem; color: #475569; margin-bottom: 18px; line-height: 1.55;">${item.excerpt}</p>
            <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 14px; font-size: 0.8125rem;">
              <span style="color: #64748B; font-weight: 600;">${item.read_time || '3 min read'}</span>
              <span style="color: #F2600C; font-weight: 800;">Read Article →</span>
            </div>
          </div>
        </a>
      </div>
    `).join('');
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      render();
    });
  }

  render();
}

export async function initArticlePage() {
  const container = document.getElementById('article-content');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || 'super-kings-clinch-thrilling-t20-derby';

  const newsList = await store.getNews();
  const article = newsList.find(n => n.slug === slug) || newsList[0];

  const fixtures = await store.getFixtures();
  const relatedMatch = article.related_match_slug ? fixtures.find(f => f.slug === article.related_match_slug) : null;

  document.title = `${article.title} | Cayman Super Kings News`;

  container.innerHTML = `
    <div class="article-container">
      <div class="article-header">
        <div style="margin-bottom: 16px;">
          <a href="news.html" style="font-size: 0.875rem; color: var(--c-flame-text); font-weight: 700;">← Back to All News</a>
        </div>
        <span class="badge badge--flame">${article.category}</span>
        <h1 style="font-size: 2.5rem; margin-top: 12px; line-height: 1.15;">${article.title}</h1>
        <div class="article-meta">
          <span>By <strong>${article.author || 'CSK Editorial'}</strong></span>
          <span>•</span>
          <span>${article.date}</span>
          <span>•</span>
          <span>${article.read_time || '3 min read'}</span>
        </div>
      </div>

      <div style="aspect-ratio: 16/9; background: var(--c-navy); border-radius: var(--radius-card); overflow: hidden; margin-bottom: 32px;">
        <img src="${article.cover_image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      ${relatedMatch ? `
        <!-- Related Match Scoreline Card -->
        <div class="article-match-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span class="badge badge--gold">${relatedMatch.competition}</span>
            <span style="font-size: 0.8125rem; color: var(--c-text-inverse-muted);">${relatedMatch.date} • ${relatedMatch.venue}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <div style="font-size: 1.125rem; font-weight: 800;">CSK ${relatedMatch.score_csk}</div>
              <div style="font-size: 0.875rem; color: var(--c-text-inverse-muted);">${relatedMatch.opponent} ${relatedMatch.score_opp}</div>
            </div>
            <a href="match-detail.html?slug=${relatedMatch.slug}" class="btn btn-primary btn-sm">Full Scorecard ↗</a>
          </div>
          <div style="font-size: 0.875rem; color: var(--c-gold); font-weight: 600;">
            ${relatedMatch.result_text}
          </div>
        </div>
      ` : ''}

      <div class="article-body">
        ${article.content}
      </div>

      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--c-border); display: flex; justify-content: space-between; align-items: center;">
        <a href="news.html" class="btn btn-outline-navy btn-sm">← Back to News</a>
        <a href="squad.html" class="btn btn-primary btn-sm">Explore Squad →</a>
      </div>
    </div>
  `;
}

/**
 * ─────────────────────────────────────────────────────────────
 * NEWS & EDITORIAL MODULE (CLEAN TEXT-ONLY EDITORIAL FORMAT)
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
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(340px, 1fr))';
    container.style.gap = '24px';

    container.innerHTML = filtered.map(item => `
      <article class="card card--lift text-only-news-card" style="background: #FFFFFF; border: 1.5px solid #CBD5E1; border-left: 5px solid #0284C7; border-radius: 14px; box-shadow: 0 8px 24px rgba(9, 21, 43, 0.06); display: flex; flex-direction: column; justify-content: space-between; padding: 28px; transition: transform 0.25s ease, box-shadow 0.25s ease;">
        <div>
          <!-- Top Category & Date Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
            <span class="badge" style="background: rgba(2, 132, 199, 0.12); color: #0284C7; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 12px; border-radius: 999px;">
              ${item.category}
            </span>
            <span style="font-size: 0.8125rem; font-weight: 700; color: #64748B;">
              ${item.date}
            </span>
          </div>

          <!-- Headline -->
          <h3 style="font-family: var(--font-display); font-size: 1.35rem; font-weight: 900; color: #09152B; line-height: 1.35; margin-bottom: 12px; letter-spacing: 0.01em;">
            <a href="article.html?slug=${item.slug}" style="color: inherit; text-decoration: none;">
              ${item.title}
            </a>
          </h3>

          <!-- Excerpt -->
          <p style="font-size: 0.9375rem; color: #334155; line-height: 1.65; margin-bottom: 20px; font-weight: 500;">
            ${item.excerpt}
          </p>
        </div>

        <!-- Card Footer Action -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 14px; margin-top: auto;">
          <span style="font-size: 0.8125rem; color: #64748B; font-weight: 600;">
            ⏱️ ${item.read_time || '3 min read'}
          </span>
          <a href="article.html?slug=${item.slug}" style="color: #0284C7; font-weight: 800; font-size: 0.875rem; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
            <span>Read Story</span>
            <span style="font-size: 1rem;">→</span>
          </a>
        </div>
      </article>
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
  const slug = urlParams.get('slug') || 'developing-the-next-generation';

  const newsList = await store.getNews();
  const article = newsList.find(n => n.slug === slug) || newsList[0];

  document.title = `${article.title} | Cayman Super Kings News`;

  container.innerHTML = `
    <div class="article-container" style="max-width: 820px; margin: 0 auto; padding: 40px 20px 80px;">
      <!-- Article Header -->
      <div class="article-header" style="margin-bottom: 32px; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 24px;">
        <div style="margin-bottom: 18px;">
          <a href="news.html" style="font-size: 0.875rem; color: #0284C7; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
            ← Back to All Stories
          </a>
        </div>
        <span class="badge" style="background: rgba(2, 132, 199, 0.12); color: #0284C7; font-weight: 800; font-size: 0.8125rem; letter-spacing: 0.06em; text-transform: uppercase; padding: 5px 14px; border-radius: 999px;">
          ${article.category}
        </span>
        <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 900; color: #09152B; line-height: 1.2; margin-top: 16px; margin-bottom: 16px;">
          ${article.title}
        </h1>
        <div class="article-meta" style="display: flex; gap: 12px; align-items: center; color: #64748B; font-size: 0.875rem; font-weight: 600; flex-wrap: wrap;">
          <span>By <strong>${article.author || 'CSK Editorial'}</strong></span>
          <span>•</span>
          <span>${article.date}</span>
          <span>•</span>
          <span>${article.read_time || '3 min read'}</span>
        </div>
      </div>

      <!-- Article Body (Clean High-Contrast Typography) -->
      <div class="article-body" style="font-size: 1.1rem; line-height: 1.8; color: #1E293B;">
        ${article.content}
      </div>

      <!-- Navigation Footer -->
      <div style="margin-top: 48px; padding-top: 24px; border-top: 1.5px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <a href="news.html" class="btn btn-outline-navy btn-sm" style="border-radius: 999px; font-weight: 800;">
          ← Back to Stories
        </a>
        <a href="about.html" class="btn btn-primary btn-sm" style="border-radius: 999px; font-weight: 800;">
          Club History &amp; Timeline →
        </a>
      </div>
    </div>
  `;
}

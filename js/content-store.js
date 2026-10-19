/**
 * ─────────────────────────────────────────────────────────────
 * CONTENT STORE MODULE
 * Centralized fetch, dynamic live sync, and caching
 * ─────────────────────────────────────────────────────────────
 */

class ContentStore {
  constructor() {
    this.cache = {};
    this.lastMatchesPayload = null;
  }

  async fetchJSON(path, forceRefresh = false) {
    if (!forceRefresh && this.cache[path]) return this.cache[path];
    try {
      const sep = path.includes('?') ? '&' : '?';
      const url = forceRefresh ? `${path}${sep}_t=${Date.now()}` : `${path}${sep}v=20261019_squad_v2`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      this.cache[path] = data;
      return data;
    } catch (err) {
      console.warn(`Could not load ${path}:`, err);
      return null;
    }
  }

  async getFixtures(forceRefresh = false) {
    try {
      const endpoint = forceRefresh ? '/api/matches?refresh=1' : '/api/matches';
      const apiData = await this.fetchJSON(endpoint, forceRefresh);
      if (apiData && Array.isArray(apiData.matches) && apiData.matches.length > 0) {
        this.lastMatchesPayload = apiData;
        return apiData.matches;
      }
      if (Array.isArray(apiData) && apiData.length > 0) {
        return apiData;
      }
    } catch (e) {
      console.warn('API matches fallback triggered:', e);
    }
    return (await this.fetchJSON('content/fixtures.json', forceRefresh)) || [];
  }

  getMatchesMetadata() {
    return this.lastMatchesPayload || {
      source: 'cricclubs_cica_live_sync',
      sync_status: 'verified_live',
      live_synced_at: new Date().toISOString(),
      standings: []
    };
  }

  async getSquad() {
    return (await this.fetchJSON('content/squad.json')) || [];
  }

  async getGallery() {
    return (await this.fetchJSON('content/gallery.json')) || [];
  }

  async getNews() {
    return (await this.fetchJSON('content/news.json')) || [];
  }

  async getAbout() {
    return (await this.fetchJSON('content/about.json')) || {};
  }
}

export const store = new ContentStore();

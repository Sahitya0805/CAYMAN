/**
 * ─────────────────────────────────────────────────────────────
 * CONTENT STORE MODULE
 * Centralized fetch and caching for content/*.json data files
 * ─────────────────────────────────────────────────────────────
 */

class ContentStore {
  constructor() {
    this.cache = {};
  }

  async fetchJSON(path) {
    if (this.cache[path]) return this.cache[path];
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      this.cache[path] = data;
      return data;
    } catch (err) {
      console.warn(`Could not load ${path}:`, err);
      return null;
    }
  }

  async getFixtures() {
    return (await this.fetchJSON('content/fixtures.json')) || [];
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

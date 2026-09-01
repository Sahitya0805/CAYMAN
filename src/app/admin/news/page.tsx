'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { NewsArticle } from '@/types';
import { Newspaper, Plus, Edit, Trash2, X, Eye } from 'lucide-react';

export default function AdminNewsPage() {
  const { news, addNews, updateNews, deleteNews } = useStore();
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('Cayman Sports Desk');
  const [category, setCategory] = useState<NewsArticle['category']>('Match Report');
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const startEdit = (article: NewsArticle) => {
    setEditingNews(article);
    setTitle(article.title);
    setSubtitle(article.subtitle || '');
    setAuthor(article.author);
    setCategory(article.category);
    setFeaturedImage(article.featuredImage);
    setExcerpt(article.excerpt);
    setContent(article.content);
    setIsPublished(article.isPublished);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingNews(null);
    setTitle('CSK Announce Squad for Daniel Morris Super League Clash');
    setSubtitle('Key players return as Kings aim for 4th consecutive win.');
    setAuthor('Editorial Staff');
    setCategory('Match Report');
    setFeaturedImage('https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?q=80&w=1200&auto=format&fit=crop');
    setExcerpt('The Cayman Super Kings management has finalized the 15-man squad for the upcoming weekend fixture.');
    setContent(`### Squad Announcement\n\nCayman Super Kings have named an unchanged line-up following back-to-back dominant wins.\n\n> "Our momentum is strong and everyone is eager to perform." - Captain Rahul Garg`);
    setIsPublished(true);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isCreating) {
      addNews({
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        subtitle: subtitle || undefined,
        author,
        category,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        readTime: '3 min read',
        featuredImage,
        excerpt,
        content,
        isPublished,
        tags: ['CSK', category, 'Cricket']
      });
    } else if (editingNews) {
      updateNews(editingNews.id, {
        title,
        subtitle: subtitle || undefined,
        author,
        category,
        featuredImage,
        excerpt,
        content,
        isPublished
      });
    }

    setEditingNews(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            EDITORIAL PUBLISHING
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            NEWS & ARTICLES CMS
          </h1>
        </div>

        <button
          onClick={startCreate}
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>WRITE ARTICLE</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="rounded-3xl bg-navy-900 border border-navy-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-gray-400 uppercase font-black tracking-wider">
              <tr>
                <th className="p-4">ARTICLE TITLE</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">AUTHOR</th>
                <th className="p-4">DATE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {news.map(art => (
                <tr key={art.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-white block max-w-sm truncate">{art.title}</span>
                    <span className="text-[10px] text-gray-400">{art.slug}</span>
                  </td>
                  <td className="p-4 text-cskgold-400 font-bold">{art.category}</td>
                  <td className="p-4 text-gray-300">{art.author}</td>
                  <td className="p-4 text-gray-400">{art.date}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        art.isPublished ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-navy-950 text-gray-500'
                      }`}
                    >
                      {art.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(art)}
                        className="p-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 text-cskgold-400"
                        title="Edit Article"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteNews(art.id)}
                        className="p-1.5 rounded-lg bg-navy-950 hover:bg-red-900/60 text-red-400"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {(isCreating || editingNews) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => { setIsCreating(false); setEditingNews(null); }}
        >
          <div
            className="w-full max-w-3xl bg-navy-900 border border-cskgold-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-lg font-extrabold text-white uppercase font-display">
                {isCreating ? 'PUBLISH NEW ARTICLE' : `EDIT ARTICLE`}
              </h3>
              <button
                onClick={() => { setIsCreating(false); setEditingNews(null); }}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="Match Report">Match Report</option>
                    <option value="Team News">Team News</option>
                    <option value="Player Spotlight">Player Spotlight</option>
                    <option value="Club News">Club News</option>
                    <option value="Announcements">Announcements</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Publish Status</label>
                  <select
                    value={isPublished ? 'true' : 'false'}
                    onChange={e => setIsPublished(e.target.value === 'true')}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={e => setFeaturedImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Excerpt Summary</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Article Content (Markdown supported)</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingNews(null); }}
                  className="px-5 py-2.5 rounded-xl bg-navy-950 text-gray-400 text-xs font-bold uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-black uppercase shadow-lg"
                >
                  SAVE & PUBLISH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

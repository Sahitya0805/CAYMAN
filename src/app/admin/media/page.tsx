'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { MediaItem } from '@/types';
import { Image as ImageIcon, Plus, Trash2, X, Play } from 'lucide-react';

export default function AdminMediaPage() {
  const { media, addMedia, deleteMedia } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MediaItem['category']>('Photos');
  const [tag, setTag] = useState<MediaItem['tag']>('Match');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop');
  const [videoDuration, setVideoDuration] = useState('02:30');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMedia({
      title,
      category,
      tag,
      mediaUrl,
      thumbnailUrl,
      videoDuration: category !== 'Photos' ? videoDuration : undefined,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      matchTitle: 'CSK vs Greenies'
    });

    setIsCreating(false);
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            ASSET MANAGEMENT
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            MEDIA LIBRARY
          </h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>UPLOAD ASSET</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map(item => (
          <div key={item.id} className="group rounded-2xl bg-navy-900 border border-navy-800 overflow-hidden relative shadow-lg">
            <div className="relative w-full h-48 bg-navy-950">
              <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-navy-950/80 text-[10px] text-cskgold-400 font-bold uppercase">
                {item.category} • {item.tag}
              </div>
              <button
                onClick={() => deleteMedia(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-500 shadow-md"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4">
              <span className="text-[10px] text-gray-400 block">{item.date}</span>
              <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md"
          onClick={() => setIsCreating(false)}
        >
          <div
            className="w-full max-w-lg bg-navy-900 border border-cskgold-500/40 rounded-3xl p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-navy-800 pb-3">
              <h3 className="text-base font-extrabold text-white uppercase font-display">UPLOAD MEDIA ASSET</h3>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Captain Rahul Garg 53 Runs Boundary Reel"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Media Type</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="Photos">Photos</option>
                    <option value="Videos">Videos</option>
                    <option value="Highlights">Highlights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Tag</label>
                  <select
                    value={tag}
                    onChange={e => setTag(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="Match">Match</option>
                    <option value="Player">Player</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Training">Training</option>
                    <option value="Behind The Scenes">Behind The Scenes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Image / Video URL</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={e => { setMediaUrl(e.target.value); setThumbnailUrl(e.target.value); }}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-gray-400 text-xs font-bold uppercase"
                >
                  CANCEL
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl btn-gold text-xs font-black uppercase shadow-lg">
                  SAVE MEDIA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

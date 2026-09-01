'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Film, Play, Image as ImageIcon, Sparkles, X } from 'lucide-react';

export default function MediaPage() {
  const { media } = useStore();
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'Photos' | 'Videos' | 'Highlights'>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [activeModalItem, setActiveModalItem] = useState<{ title: string; image: string; isVideo?: boolean } | null>(null);

  const tags = ['ALL', 'Match', 'Player', 'Celebration', 'Training', 'Behind The Scenes'];

  const filtered = media.filter(item => {
    const matchCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchTag = selectedTag === 'ALL' || item.tag === selectedTag;
    return matchCat && matchTag;
  });

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 mb-10 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
            CSK VISUAL VAULT
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
            PHOTOS, VIDEOS & HIGHLIGHTS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">
            Relive thrilling match moments, player portraits, net training sessions, and trophy celebrations.
          </p>
        </div>

        {/* Main Category Tabs */}
        <div className="flex items-center gap-2 border-b border-navy-800 mb-6 overflow-x-auto">
          {(['ALL', 'Photos', 'Videos', 'Highlights'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                activeCategory === cat
                  ? 'border-cskgold-400 text-cskgold-400 bg-navy-900/50'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedTag === t
                  ? 'bg-cskgold-500 text-navy-950 shadow-md'
                  : 'bg-navy-900 border border-navy-800 text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Masonry Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem({ title: item.title, image: item.mediaUrl, isVideo: item.category !== 'Photos' })}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-cskgold-500/50 shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div className="relative w-full h-64 overflow-hidden bg-navy-950">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/40 transition-colors" />

                {/* Badge Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-navy-950/90 border border-cskgold-500/40 text-cskgold-400 text-[10px] font-black uppercase">
                  {item.tag}
                </div>

                {/* Duration or Play Icon */}
                {item.category !== 'Photos' ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-cskgold-500 text-navy-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-navy-950/80 text-white">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                  <span>{item.category}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-sm font-extrabold text-white group-hover:text-cskgold-400 font-display uppercase tracking-wide line-clamp-1 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="w-full max-w-4xl bg-navy-900 border border-cskgold-500/40 rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-navy-950 border-b border-navy-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase font-display">
                {activeModalItem.title}
              </h4>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <Image
                src={activeModalItem.image}
                alt={activeModalItem.title}
                fill
                className="object-contain"
              />
              {activeModalItem.isVideo && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-cskgold-500 text-navy-950 flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

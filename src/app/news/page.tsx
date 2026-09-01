'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export default function NewsPage() {
  const { news } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Match Report', 'Team News', 'Player Spotlight', 'Club News'];

  const filteredNews = news
    .filter(n => n.isPublished)
    .filter(n => (selectedCategory === 'ALL' ? true : n.category === selectedCategory));

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 mb-10 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
            EDITORIAL & PRESS RELEASES
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
            LATEST NEWS & MATCH REPORTS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">
            Official post-match reports, tactical reviews, player interviews, and community updates from Cayman Super Kings.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === c
                  ? 'bg-cskgold-500 text-navy-950 shadow-md'
                  : 'bg-navy-900 border border-navy-800 text-gray-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map(article => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-cskgold-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
            >
              <div>
                <div className="relative w-full h-56 overflow-hidden bg-navy-950">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-navy-950/90 border border-cskgold-500/40 text-cskgold-400 text-[10px] font-black uppercase">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-cskgold-400" />
                    <span>{article.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-cskgold-400 font-display uppercase tracking-wide line-clamp-2 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs text-cskgold-400 font-black uppercase tracking-wider">
                <span>READ ARTICLE</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

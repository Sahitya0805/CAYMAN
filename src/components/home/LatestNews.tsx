'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { ArrowRight, Clock } from 'lucide-react';

export const LatestNews: React.FC = () => {
  const { news } = useStore();
  const topArticles = news.slice(0, 3);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-cskgold-400 font-mono">
            EDITORIAL & CLUB DISPATCHES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-display mt-1">
            LATEST NEWS & REPORTS
          </h2>
        </div>

        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-cskgold-400 hover:text-cskgold-300 group"
        >
          <span>ALL ARTICLES & MATCH REPORTS</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </div>

      {/* 3-Column Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 sm:gap-8">
        {topArticles.map(art => (
          <Link
            key={art.id}
            href={`/news/${art.slug}`}
            className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-navy-900/60 border border-cskgold-500/15 hover:border-cskgold-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cskgold-500/10 transform hover:-translate-y-1.5"
          >
            <div>
              {/* Image banner */}
              <div className="relative w-full h-56 overflow-hidden bg-navy-950">
                <Image
                  src={art.featuredImage}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-navy-950/90 border border-cskgold-500/30 text-cskgold-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {art.category}
                </div>
              </div>

              {/* Text content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-mono">
                  <span>{art.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cskgold-400" />
                    {art.readTime}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cskgold-300 uppercase font-display leading-snug transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs font-bold text-cskgold-400 uppercase tracking-wider border-t border-navy-800/60">
              <span>READ FULL STORY</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

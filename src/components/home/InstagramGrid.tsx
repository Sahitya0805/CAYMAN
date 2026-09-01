'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export const InstagramGrid: React.FC = () => {
  const { settings } = useStore();

  const posts = [
    {
      title: 'CSK vs Greenies: 62-Run Victory Celebration',
      tag: '#OneTeamOneDream',
      caption: 'Back-to-back victories! 132/10 defended with pure pace and spin clinic.',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
      likes: '482',
      comments: '36'
    },
    {
      title: 'Bowling Unit on Fire: 70 All Out!',
      tag: '#SpeedMerchants',
      caption: 'Clinical, disciplined, relentless. Ravneet 3/16, Jason 2/7, Parthi 2/11.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      likes: '621',
      comments: '54'
    },
    {
      title: 'The Finisher: Parthipan K 43* (38)',
      tag: '#ClutchKing',
      caption: 'When we needed composure, Parthi delivered 4 boundaries and 2 colossal sixes!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      likes: '512',
      comments: '41'
    },
    {
      title: 'Spin Wizard Christopher Balraj 3/8',
      tag: '#SpinMagic',
      caption: 'Web spun on a slow track. 4 overs, 3 wickets, 8 runs conceded.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
      likes: '394',
      comments: '29'
    }
  ];

  return (
    <section className="py-16 bg-navy-950/90 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-cskgold-400 text-xs font-black uppercase tracking-widest font-display">
              <span>📷 INSTAGRAM FEED</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-display mt-1">
              FOLLOW THE KINGS
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Connect with {settings.instagramHandle} on Instagram for live matchday stories, reels, and graphic cards.
            </p>
          </div>

          <a
            href={settings.instagramHandle ? `https://instagram.com/${settings.instagramHandle.replace('@', '')}` : '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-cskgold-500 text-cskgold-400 text-xs font-black uppercase tracking-wider group transition-all"
          >
            <span>{settings.instagramHandle}</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* 4 Instagram Posts Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-cskgold-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative w-full h-64 overflow-hidden bg-navy-950">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />

                {/* Tag pill */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-navy-950/80 text-cskgold-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                  {post.tag}
                </div>

                {/* Hover overlay with likes and caption */}
                <div className="absolute inset-0 bg-navy-950/85 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-between">
                  <p className="text-xs text-gray-200 leading-relaxed font-medium">
                    {post.caption}
                  </p>

                  <div className="flex items-center justify-between text-xs text-cskgold-400 font-bold">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-navy-900 border-t border-navy-800">
                <h4 className="text-xs font-bold text-white group-hover:text-cskgold-400 font-display uppercase tracking-wide line-clamp-1 transition-colors">
                  {post.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

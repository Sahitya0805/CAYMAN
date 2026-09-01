'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Play, Pause, X, Film, ArrowRight, Video, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const MatchHighlights: React.FC = () => {
  const { media } = useStore();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [modalVideo, setModalVideo] = useState<{ title: string; videoUrl: string; duration?: string } | null>(null);

  const videoReels = [
    {
      id: 'v1',
      title: 'Bowling Highlights: All 10 Wickets vs Greenies Too',
      subtitle: 'Devastating pace & spin spell dismantling Greenies for 70 all out.',
      duration: '04:15',
      date: '30 AUG 2026',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
      badge: 'MATCH HIGHLIGHTS'
    },
    {
      id: 'v2',
      title: 'Rahul Garg 53 (42) Captain’s Knock vs Greenies Too',
      subtitle: 'Pure timing, 9 sublime boundaries, and inspirational tactical leadership.',
      duration: '03:40',
      date: '30 AUG 2026',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?q=80&w=1200&auto=format&fit=crop',
      badge: 'CAPTAIN’S REEL'
    },
    {
      id: 'v3',
      title: 'Praisewin Diving Stunner & Fielding Unit Appreciation',
      subtitle: 'Acrobatic catches behind the stumps and electric inner-ring stops.',
      duration: '02:10',
      date: '24 AUG 2026',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200&auto=format&fit=crop',
      badge: 'TOP CATCHES'
    }
  ];

  const currentReel = videoReels[activeVideoIndex];

  return (
    <section className="py-16 bg-navy-950/90 border-y border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cskgold-400 text-xs font-bold uppercase tracking-[0.2em] font-mono">
              <Film className="w-3.5 h-3.5" />
              <span>OFFICIAL BROADCAST & REELS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-display mt-1">
              MATCH HIGHLIGHTS THEATRE
            </h2>
          </div>

          <Link
            href="/media"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cskgold-400 hover:text-cskgold-300 group"
          >
            <span>VIEW COMPLETE VIDEO VAULT</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3-Video Sliding Theatre Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Big Theatre Screen */}
          <div className="lg:col-span-8 relative aspect-video rounded-3xl overflow-hidden bg-navy-900 border border-cskgold-500/30 shadow-2xl group">
            <video
              key={currentReel.videoUrl}
              src={currentReel.videoUrl}
              poster={currentReel.thumbnailUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter brightness-[0.6] group-hover:brightness-[0.7] transition-all duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40" />

            {/* Top Badge */}
            <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-navy-950/90 border border-cskgold-500/40 text-cskgold-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
              {currentReel.badge}
            </div>

            {/* Center Play Button (Opens Full Modal) */}
            <button
              onClick={() => setModalVideo(currentReel)}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-cskgold-500 text-navy-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
              title="Play Full Broadcast"
              aria-label="Play Full Broadcast"
            >
              <Play className="w-7 h-7 fill-current translate-x-0.5" />
            </button>

            {/* Bottom Caption */}
            <div className="absolute bottom-5 inset-x-5 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-gray-300 uppercase block">{currentReel.date} • {currentReel.duration}</span>
                <h3 className="text-base sm:text-xl font-extrabold text-white uppercase font-display mt-0.5 drop-shadow">
                  {currentReel.title}
                </h3>
              </div>
              <button
                onClick={() => setModalVideo(currentReel)}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl btn-gold-primary text-xs font-bold uppercase shadow-lg"
              >
                WATCH HD
              </button>
            </div>
          </div>

          {/* Right 3 Sliding Selector Windows */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
              SELECT HIGHLIGHT REEL:
            </span>
            {videoReels.map((reel, idx) => {
              const isActive = idx === activeVideoIndex;
              return (
                <div
                  key={reel.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-3.5 ${
                    isActive
                      ? 'bg-navy-900 border-cskgold-400 shadow-lg shadow-cskgold-500/10'
                      : 'bg-navy-950/70 border-navy-800 hover:border-navy-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-navy-950 shrink-0 border border-navy-800">
                    <Image src={reel.thumbnailUrl} alt={reel.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-cskgold-500 text-navy-950 flex items-center justify-center text-xs">
                        <Play className="w-3 h-3 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold text-cskgold-400 uppercase font-mono block">
                      REEL 0{idx + 1} • {reel.duration}
                    </span>
                    <h4 className="text-xs font-extrabold text-white uppercase font-display line-clamp-1 mt-0.5">
                      {reel.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                      {reel.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {modalVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/95 backdrop-blur-md animate-in fade-in"
          onClick={() => setModalVideo(null)}
        >
          <div
            className="w-full max-w-4xl bg-navy-900 border border-cskgold-500/40 rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 bg-navy-950 border-b border-navy-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-cskgold-400 uppercase font-mono block">OFFICIAL MATCH BROADCAST</span>
                <h4 className="text-sm font-bold text-white uppercase font-display">{modalVideo.title}</h4>
              </div>
              <button
                onClick={() => setModalVideo(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={modalVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Pause, ChevronRight, Ticket, Volume2, VolumeX } from 'lucide-react';

interface HeroWindow {
  id: number;
  badge: string;
  headlineTag: string;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  posterImage: string;
  thumbImage: string;
  cardTitle: string;
  cardSubtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const heroWindows: HeroWindow[] = [
  {
    id: 1,
    badge: 'OFFICIAL MATCH REPORT',
    headlineTag: 'DANIEL MORRIS SUPER LEAGUE T20',
    title: 'CSK WIN BY 62 RUNS',
    subtitle: 'THE LION ROARS AGAIN',
    description: 'Back-to-back dominant victories. Captain Rahul Garg strikes 53 runs (42b) while Ravneet leads the bowling assault to bundle out Greenies Too for 70 all out.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1800&auto=format&fit=crop',
    thumbImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop',
    cardTitle: 'CSK vs Greenies Too',
    cardSubtitle: '62-Run Victory & Bowling On Fire Highlights',
    primaryCta: { label: 'READ MATCH REPORT', href: '/news/csk-defeat-greenies-by-62-runs' },
    secondaryCta: { label: 'VIEW LIVE SCORECARD', href: '/matches/live' }
  },
  {
    id: 2,
    badge: 'NEXT HOME FIXTURE',
    headlineTag: 'ROUND 4 • JIMMY POWELL OVAL',
    title: 'THE GRAND CLASH',
    subtitle: 'CAYMAN SUPER KINGS VS GREENIES',
    description: 'Sunday, 20 September 2026 • 7:00 PM EST. Reserve your premium grandstand seats and boundary tickets as the Kings pursue a 4th consecutive league win.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterImage: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?q=80&w=1800&auto=format&fit=crop',
    thumbImage: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?q=80&w=600&auto=format&fit=crop',
    cardTitle: 'Next Match: 20 Sept',
    cardSubtitle: 'Tickets from $10 • Covered Grandstand & VIP',
    primaryCta: { label: 'BUY MATCH TICKETS', href: '/tickets' },
    secondaryCta: { label: 'MATCH SCHEDULE', href: '/matches' }
  },
  {
    id: 3,
    badge: 'VIP HOSPITALITY & DINING',
    headlineTag: 'PRIVATE PAVILION & SUITES',
    title: 'EXPERIENCE THE KINGS',
    subtitle: 'EXCLUSIVE MATCHDAY LUXURY',
    description: 'Elevated pitch-line sights, air-conditioned lounges, bespoke Caribbean gourmet cuisine, open bars, and post-match player meet-and-greets.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    posterImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1800&auto=format&fit=crop',
    thumbImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop',
    cardTitle: 'VIP Lounge & Dining',
    cardSubtitle: 'Private Corporate Suites & Matchday Feasts',
    primaryCta: { label: 'EXPLORE HOSPITALITY', href: '/hospitality' },
    secondaryCta: { label: 'CSK SQUAD ROSTER', href: '/team' }
  }
];

export const HeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-advance timer (7 seconds per slide)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % heroWindows.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying, activeIndex]);

  // Restart video when activeIndex changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  const activeWindow = heroWindows[activeIndex];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full h-[90vh] min-h-[680px] max-h-[950px] overflow-hidden bg-navy-950 flex items-center select-none">
      {/* Background Ambient Video Stream */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          key={activeWindow.videoUrl}
          src={activeWindow.videoUrl}
          poster={activeWindow.posterImage}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-105 scale-105 transition-all duration-1000"
        />

        {videoError && (
          <Image
            src={activeWindow.posterImage}
            alt={activeWindow.title}
            fill
            priority
            className="object-cover object-center filter brightness-[0.45]"
          />
        )}

        <div className="absolute inset-0 hero-video-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70" />
      </div>

      {/* Hero Content Left */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 pb-40">
        <div className="max-w-3xl space-y-5 sm:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/90 border border-cskgold-400/50 text-cskgold-300 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] backdrop-blur-md shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-cskgold-400 animate-pulse" />
            <span>{activeWindow.badge}</span>
          </div>

          {/* Large Heading Block */}
          <div className="space-y-2">
            <span className="text-sm sm:text-base font-bold tracking-[0.3em] text-gray-300 uppercase block font-mono">
              {activeWindow.headlineTag}
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-[0.92] drop-shadow-xl font-display">
              {activeWindow.title}
            </h1>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-metallic-gold uppercase tracking-wide mt-3 font-display">
              {activeWindow.subtitle}
            </h2>
          </div>

          <p className="text-base sm:text-lg text-gray-200/95 max-w-2xl leading-relaxed font-normal">
            {activeWindow.description}
          </p>

          {/* Large CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={activeWindow.primaryCta.href}
              className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl btn-gold-primary text-sm sm:text-base font-black flex items-center gap-2.5 shadow-2xl transition-all"
            >
              <Ticket className="w-5 h-5" />
              <span>{activeWindow.primaryCta.label}</span>
            </Link>
            <Link
              href={activeWindow.secondaryCta.href}
              className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl btn-classy-outline text-sm sm:text-base font-bold flex items-center gap-2.5 transition-all"
            >
              <span>{activeWindow.secondaryCta.label}</span>
              <ChevronRight className="w-5 h-5 text-cskgold-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Bar & 3-Window Video Switcher */}
      <div className="absolute bottom-7 inset-x-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
        {/* Play/Pause & Sound Controls */}
        <div className="flex items-center gap-2.5 bg-navy-950/90 border border-navy-800 p-2 rounded-2xl backdrop-blur-md">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-xl bg-navy-900 hover:bg-navy-800 text-cskgold-400 flex items-center justify-center transition-colors"
            title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
            aria-label="Toggle Video Playback"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-xl bg-navy-900 hover:bg-navy-800 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-cskgold-400" />}
          </button>
          <span className="text-xs text-gray-300 font-mono px-2.5 font-bold hidden sm:inline-block">
            0{activeIndex + 1} / 0{heroWindows.length}
          </span>
        </div>

        {/* 3-Window Sliding Cards Strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full md:w-auto max-w-2xl">
          {heroWindows.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPlaying(true);
                }}
                className={`group cursor-pointer relative p-3 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isActive
                    ? 'bg-navy-900/95 border-cskgold-400 shadow-2xl shadow-cskgold-500/20'
                    : 'bg-navy-950/80 border-navy-800 hover:border-navy-700 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Active Progress Bar */}
                {isActive && isPlaying && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-navy-800 overflow-hidden">
                    <div className="h-full bg-cskgold-400 animate-progress" />
                  </div>
                )}

                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="relative w-12 h-9 sm:w-14 sm:h-10 rounded-lg overflow-hidden shrink-0 bg-navy-950 border border-navy-800">
                    <Image
                      src={item.thumbImage}
                      alt={item.cardTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs sm:text-sm font-extrabold leading-tight truncate uppercase font-display ${
                      isActive ? 'text-cskgold-300' : 'text-white'
                    }`}>
                      {item.cardTitle}
                    </h4>
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-gray-300 line-clamp-1 leading-snug font-medium">
                  {item.cardSubtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

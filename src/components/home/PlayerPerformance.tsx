'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const PlayerPerformance: React.FC = () => {
  const highlights = [
    {
      badge: 'PLAYER OF THE MATCH',
      player: 'RAHUL GARG',
      role: 'Captain & All-Rounder',
      mainStat: '53 RUNS',
      subStat: '42 BALLS • 9 FOURS',
      bowlingStat: '2 OVERS • 0/6 (3.00 ECO)',
      tagline: 'Led from the front with a masterclass half-century against Greenies Too.',
      icon: '👑',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
      slug: 'rahul-garg'
    },
    {
      badge: 'BOWLING ON FIRE 🔥',
      player: 'RAVNEET SINGH',
      role: 'Strike Seamer',
      mainStat: '3/16',
      subStat: '3.0 OVERS • 2 WKTS IN 1 OVER',
      bowlingStat: '70 ALL OUT • TOTAL DESTRUCTION',
      tagline: 'Unleashed sheer pace & accuracy to decimate the Greenies top order.',
      icon: '🎯',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
      slug: 'ravneet-singh'
    },
    {
      badge: 'MATCH DEFINING SPELL',
      player: 'RAJASEKHARA (RAJ)',
      role: 'All-Rounder',
      mainStat: '3/6',
      subStat: '4.0 OVERS • 1.50 ECONOMY',
      bowlingStat: '10 (11) & STUNNING RUN-OUT CATCH',
      tagline: 'Player of the match honors vs Cayman Youth Academy.',
      icon: '⚡',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
      slug: 'rajasekhara-kalagotla'
    },
    {
      badge: 'THE FINISHER',
      player: 'PARTHIPAN K (PARTHI)',
      role: 'Death-Over Specialist',
      mainStat: '43* RUNS',
      subStat: '38 BALLS • 4 FOURS • 2 SIXES',
      bowlingStat: '2/11 WITH BALL VS GREENIES',
      tagline: 'Held the innings together with ice-cold poise under pressure.',
      icon: '💥',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      slug: 'parthipan-k'
    }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-cskgold-400 font-mono">
          PERFORMANCE SPOTLIGHT
        </span>
        <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-display mt-2">
          MEDAL WINNERS & HEROES
        </h2>
        <p className="text-sm sm:text-base text-gray-300 mt-3 font-medium">
          Celebrating extraordinary match-defining performances that lead the Cayman Super Kings to championship glory.
        </p>
      </div>

      {/* 4 Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 border border-cskgold-500/35 p-7 flex flex-col justify-between shadow-2xl hover:border-cskgold-400 transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Top Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-cskgold-500/20 border border-cskgold-500/40 text-cskgold-300 font-extrabold text-xs uppercase tracking-wider font-mono">
                  {item.badge}
                </span>
                <span className="text-3xl">{item.icon}</span>
              </div>

              {/* Player Image */}
              <div className="relative w-28 h-28 mx-auto my-4 rounded-full overflow-hidden border-2 border-cskgold-400 p-0.5 shadow-xl shadow-cskgold-500/20">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.player}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Names & Titles */}
              <div className="text-center mt-3">
                <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide group-hover:text-cskgold-300 transition-colors">
                  {item.player}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 font-semibold mt-0.5">{item.role}</p>
              </div>

              {/* Big Stat Numbers */}
              <div className="my-6 p-5 rounded-2xl bg-navy-950 border border-navy-800 text-center space-y-1.5">
                <span className="text-4xl sm:text-5xl font-black text-cskgold-400 font-display block leading-none">
                  {item.mainStat}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-gray-200 uppercase tracking-wide block font-mono">
                  {item.subStat}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-400 block pt-1.5 border-t border-navy-800 font-medium">
                  {item.bowlingStat}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 text-center italic leading-relaxed font-normal">
                &ldquo;{item.tagline}&rdquo;
              </p>
            </div>

            {/* Profile CTA */}
            <div className="mt-8 pt-4 border-t border-navy-800">
              <Link
                href={`/players/${item.slug}`}
                className="w-full py-3 rounded-xl bg-navy-900 group-hover:bg-cskgold-500 group-hover:text-navy-950 text-cskgold-400 border border-navy-700 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>VIEW PROFILE & STATS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

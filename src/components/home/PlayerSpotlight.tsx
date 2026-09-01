'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { ArrowRight, Trophy } from 'lucide-react';

export const PlayerSpotlight: React.FC = () => {
  const { players } = useStore();
  const featuredSquad = players.slice(0, 6);

  return (
    <section className="py-20 bg-navy-950/80 border-y border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-cskgold-400 text-xs sm:text-sm font-black uppercase tracking-widest font-mono">
              <Trophy className="w-4 h-4" />
              <span>THE SQUAD</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-display mt-1">
              MEET THE KINGS
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2 max-w-xl font-medium">
              The fearless warriors defending the yellow and navy colors in the 2026 Daniel Morris Super League.
            </p>
          </div>

          <Link
            href="/team"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-navy-900 border border-navy-700 hover:border-cskgold-500 text-cskgold-400 text-xs sm:text-sm font-black uppercase tracking-wider group transition-all"
          >
            <span>FULL SQUAD ROSTER</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSquad.map(player => (
            <Link
              key={player.id}
              href={`/players/${player.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-cskgold-500/70 shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Top Jersey Number Badge */}
              <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-xl bg-navy-950/90 border border-cskgold-500/50 text-cskgold-400 font-black text-sm tracking-wider backdrop-blur-md font-mono">
                #{player.jerseyNumber}
              </div>

              {/* Photo Banner */}
              <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-navy-950">
                <Image
                  src={player.photoUrl}
                  alt={player.name}
                  fill
                  className="object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/30 to-transparent" />

                {/* Hover Reveal Stats Overlay */}
                <div className="absolute inset-0 bg-navy-950/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-7 flex flex-col justify-between z-10">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-cskgold-400 block mb-1 font-mono">
                      CAREER STATISTICS
                    </span>
                    <h4 className="text-2xl font-black text-white font-display uppercase">{player.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-300 font-semibold mt-0.5">{player.role}</p>

                    <div className="grid grid-cols-2 gap-3 mt-6 text-xs sm:text-sm">
                      <div className="p-3 bg-navy-900 rounded-xl border border-navy-800">
                        <span className="text-gray-400 block text-[10px] sm:text-xs uppercase font-mono">MATCHES</span>
                        <span className="text-white font-black text-lg sm:text-xl font-display">{player.stats.matches}</span>
                      </div>
                      <div className="p-3 bg-navy-900 rounded-xl border border-navy-800">
                        <span className="text-gray-400 block text-[10px] sm:text-xs uppercase font-mono">RUNS</span>
                        <span className="text-cskgold-400 font-black text-lg sm:text-xl font-display">{player.stats.runs}</span>
                      </div>
                      <div className="p-3 bg-navy-900 rounded-xl border border-navy-800">
                        <span className="text-gray-400 block text-[10px] sm:text-xs uppercase font-mono">AVERAGE</span>
                        <span className="text-white font-black text-lg sm:text-xl font-display">{player.stats.average}</span>
                      </div>
                      <div className="p-3 bg-navy-900 rounded-xl border border-navy-800">
                        <span className="text-gray-400 block text-[10px] sm:text-xs uppercase font-mono">WICKETS</span>
                        <span className="text-cskgold-400 font-black text-lg sm:text-xl font-display">{player.stats.wickets}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-cskgold-400 font-black uppercase tracking-wider pt-3 border-t border-navy-800">
                    <span>VIEW FULL PROFILE</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Bottom Card Identity */}
              <div className="p-6 relative z-10 bg-navy-900">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cskgold-300 font-display uppercase tracking-wide transition-colors">
                      {player.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-semibold mt-0.5">{player.role}</p>
                  </div>
                  <span className="text-2xl">🦁</span>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-gray-300 pt-3 border-t border-navy-800/80 font-medium">
                  <span>{player.battingStyle}</span>
                  <span className="text-cskgold-400 font-bold font-mono">SR: {player.stats.strikeRate}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

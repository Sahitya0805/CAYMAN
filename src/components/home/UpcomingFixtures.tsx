'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Calendar, MapPin, Ticket, ArrowRight, Radio } from 'lucide-react';

export const UpcomingFixtures: React.FC = () => {
  const { matches } = useStore();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');

  const filteredMatches = matches.filter(m => {
    if (activeFilter === 'UPCOMING') return m.status === 'UPCOMING' || m.status === 'LIVE';
    if (activeFilter === 'COMPLETED') return m.status === 'COMPLETED';
    return true;
  });

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Title & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-cskgold-400 font-mono">
            SCHEDULE & MATCH HUB
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-display mt-1">
            2026 FIXTURES & RESULTS
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-navy-900/90 border border-navy-800 p-1.5 rounded-2xl">
          {(['ALL', 'UPCOMING', 'COMPLETED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all ${
                activeFilter === tab
                  ? 'bg-cskgold-500 text-navy-950 shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map(match => (
          <div
            key={match.id}
            className="group relative rounded-3xl bg-navy-900/90 border border-navy-800 hover:border-cskgold-500/50 p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl shadow-black/40"
          >
            {/* Top tournament badge */}
            <div className="flex items-center justify-between border-b border-navy-800 pb-4 mb-4">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                {match.tournament}
              </span>
              {match.status === 'LIVE' ? (
                <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE
                </span>
              ) : match.status === 'COMPLETED' ? (
                <span className="px-3 py-1 rounded-full bg-navy-950 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase">
                  RESULT
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-navy-950 text-cskgold-400 border border-cskgold-500/30 text-xs font-black uppercase">
                  UPCOMING
                </span>
              )}
            </div>

            {/* Teams Encounter Card */}
            <div className="space-y-4 my-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🦁</span>
                  <span className="font-black text-base sm:text-lg text-white font-display uppercase">
                    {match.homeTeam.name}
                  </span>
                </div>
                {match.homeTeam.score && (
                  <span className="font-black text-base sm:text-lg text-cskgold-400 font-display">
                    {match.homeTeam.score}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{match.awayTeam.logo || '🏏'}</span>
                  <span className="font-black text-base sm:text-lg text-gray-300 font-display uppercase">
                    {match.awayTeam.name}
                  </span>
                </div>
                {match.awayTeam.score && (
                  <span className="font-black text-base sm:text-lg text-gray-400 font-display">
                    {match.awayTeam.score}
                  </span>
                )}
              </div>
            </div>

            {/* Result text if finished */}
            {match.result && (
              <div className="mt-3 p-3 bg-navy-950 rounded-xl border border-navy-800 text-center">
                <span className="text-xs sm:text-sm font-black text-cskgold-400 uppercase tracking-wide font-display">
                  {match.result}
                </span>
              </div>
            )}

            {/* Date & Venue Footer */}
            <div className="mt-5 pt-4 border-t border-navy-800 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-cskgold-400" />
                  {match.date} • {match.time}
                </span>
                <span className="flex items-center gap-1.5 truncate max-w-[140px] text-gray-400">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {match.venue.split(',')[0]}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-2.5">
                {match.status === 'LIVE' ? (
                  <Link
                    href="/matches/live"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-black uppercase text-center flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4" />
                    <span>LIVE MATCH CENTRE</span>
                  </Link>
                ) : match.status === 'UPCOMING' ? (
                  <>
                    <Link
                      href="/tickets"
                      className="flex-1 py-3 rounded-xl btn-gold text-xs sm:text-sm font-black uppercase text-center flex items-center justify-center gap-1.5"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>TICKETS</span>
                    </Link>
                    <Link
                      href="/matches"
                      className="flex-1 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 text-xs sm:text-sm font-bold uppercase text-center border border-navy-700"
                    >
                      DETAILS
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/news/csk-defeat-greenies-by-62-runs`}
                    className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 hover:border-cskgold-500 text-white text-xs sm:text-sm font-bold uppercase text-center flex items-center justify-center gap-2"
                  >
                    <span>VIEW SCORECARD & REPORT</span>
                    <ArrowRight className="w-4 h-4 text-cskgold-400" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

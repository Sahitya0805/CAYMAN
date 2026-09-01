'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Radio, ArrowRight, TrendingUp } from 'lucide-react';

export const LiveMatchPreview: React.FC = () => {
  const { matches } = useStore();
  const liveMatch = matches.find(m => m.status === 'LIVE');

  if (!liveMatch || !liveMatch.liveInnings) return null;

  const inn = liveMatch.liveInnings;
  const winProb = liveMatch.cskWinProbability || 82;

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden border-2 border-red-500/40 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 blur-[130px] pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-800 pb-6">
          <div className="flex items-center gap-3.5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-xs sm:text-sm font-black tracking-widest uppercase animate-pulse">
              <Radio className="w-4 h-4" /> LIVE MATCH CENTRE
            </span>
            <span className="text-sm sm:text-base text-gray-300 font-bold">
              {liveMatch.tournament}
            </span>
          </div>

          <Link
            href="/matches/live"
            className="inline-flex items-center gap-2 text-sm font-black text-cskgold-400 hover:text-cskgold-300 uppercase tracking-wider group"
          >
            <span>OPEN FULL LIVE CENTRE</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Scoreboard Big Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
          {/* Main Teams & Score Display */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between p-5 sm:p-6 rounded-3xl bg-navy-950/80 border border-navy-800">
              <div className="flex items-center gap-4">
                <span className="text-4xl sm:text-5xl">🦁</span>
                <div>
                  <h4 className="text-lg sm:text-2xl font-black text-white font-display uppercase">
                    CAYMAN SUPER KINGS
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 font-semibold">{inn.overs}.{inn.ballsInOver} Overs</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl sm:text-6xl font-black text-cskgold-400 font-display">
                  {inn.runs}/{inn.wickets}
                </span>
                <span className="block text-xs sm:text-sm text-emerald-400 font-bold uppercase mt-1">
                  CRR: {(inn.runs / Math.max(1, inn.overs + inn.ballsInOver / 6)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 sm:p-6 rounded-3xl bg-navy-950/50 border border-navy-900">
              <div className="flex items-center gap-4">
                <span className="text-4xl sm:text-5xl">{liveMatch.awayTeam.logo || '🐢'}</span>
                <div>
                  <h4 className="text-lg sm:text-2xl font-black text-gray-300 font-display uppercase">
                    {liveMatch.awayTeam.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium">{liveMatch.awayTeam.overs || '20.0 Overs'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-5xl font-black text-gray-300 font-display">
                  {liveMatch.awayTeam.score || '128/8'}
                </span>
                <span className="block text-xs text-gray-400 font-bold uppercase mt-1">
                  INNINGS 1
                </span>
              </div>
            </div>

            {/* Win Probability Bar */}
            <div className="p-5 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-2.5">
              <div className="flex items-center justify-between text-sm sm:text-base font-bold">
                <span className="text-gray-200 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cskgold-400" /> CSK WIN PROBABILITY
                </span>
                <span className="text-cskgold-400 font-black text-lg">{winProb}%</span>
              </div>
              <div className="w-full bg-navy-900 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-gradient-to-r from-cskgold-500 to-cskgold-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${winProb}%` }}
                />
                <div
                  className="bg-gray-700 h-full transition-all duration-500"
                  style={{ width: `${100 - winProb}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Batters & Bowler Box */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-6 rounded-3xl bg-navy-950/90 border border-navy-800 space-y-4">
              <h5 className="text-xs sm:text-sm font-black tracking-wider uppercase text-gray-300 flex items-center justify-between font-mono">
                <span>ACTIVE BATTERS</span>
                <span>R (B) • 4s • 6s</span>
              </h5>

              {/* Striker */}
              <div className="flex items-center justify-between text-base sm:text-lg py-2 border-b border-navy-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-cskgold-400 font-extrabold">🏏 {inn.currentStriker.name} *</span>
                </div>
                <div className="text-right font-black text-white font-display">
                  <span>{inn.currentStriker.runs}</span>
                  <span className="text-gray-400 text-sm font-normal ml-1.5">({inn.currentStriker.balls})</span>
                  <span className="text-gray-300 text-sm font-semibold ml-4">{inn.currentStriker.fours} • {inn.currentStriker.sixes}</span>
                </div>
              </div>

              {/* Non-Striker */}
              <div className="flex items-center justify-between text-base sm:text-lg py-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-gray-300 font-bold">{inn.currentNonStriker.name}</span>
                </div>
                <div className="text-right font-black text-white font-display">
                  <span>{inn.currentNonStriker.runs}</span>
                  <span className="text-gray-400 text-sm font-normal ml-1.5">({inn.currentNonStriker.balls})</span>
                  <span className="text-gray-300 text-sm font-semibold ml-4">{inn.currentNonStriker.fours} • {inn.currentNonStriker.sixes}</span>
                </div>
              </div>
            </div>

            {/* Current Bowler & Recent Balls */}
            <div className="p-6 rounded-3xl bg-navy-950/90 border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h5 className="text-xs font-bold tracking-wider uppercase text-gray-400 font-mono">
                  CURRENT BOWLER
                </h5>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {inn.currentBowler.name}
                </p>
                <p className="text-sm text-gray-300 font-semibold">
                  {inn.currentBowler.overs} ov • {inn.currentBowler.wickets}/{inn.currentBowler.runsConceded}
                </p>
              </div>

              {/* Recent Balls Bubbles */}
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-gray-400 block mb-1.5 font-mono">
                  RECENT DELIVERIES
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {inn.recentOvers.slice(-6).map((ball, i) => (
                    <span
                      key={i}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black font-display ${
                        ball === 'W'
                          ? 'bg-red-600 text-white animate-bounce'
                          : ball === '4' || ball === '6'
                          ? 'bg-cskgold-500 text-navy-950'
                          : 'bg-navy-800 text-gray-200 border border-navy-700'
                      }`}
                    >
                      {ball}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

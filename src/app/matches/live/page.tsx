'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Radio, RefreshCw, TrendingUp, ShieldCheck, ArrowLeft, Trophy, Activity, MessageSquare } from 'lucide-react';

export default function LiveMatchCentrePage() {
  const { matches } = useStore();
  const liveMatch = matches.find(m => m.status === 'LIVE') || matches[0];
  const [commentaryFilter, setCommentaryFilter] = useState<'ALL' | 'BOUNDARIES' | 'WICKETS'>('ALL');

  if (!liveMatch || !liveMatch.liveInnings) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">No Live Match Currently In Progress</h2>
        <p className="text-gray-400 text-sm mb-6">Upcoming matches will stream live updates once play begins.</p>
        <Link href="/matches" className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold">
          VIEW FIXTURES
        </Link>
      </div>
    );
  }

  const inn = liveMatch.liveInnings;
  const winProb = liveMatch.cskWinProbability || 82;
  const deliveries = liveMatch.deliveries || [];

  const filteredDeliveries = deliveries.filter(d => {
    if (commentaryFilter === 'BOUNDARIES') return d.runs === 4 || d.runs === 6;
    if (commentaryFilter === 'WICKETS') return d.isWicket;
    return true;
  });

  return (
    <div className="min-h-screen bg-navy-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb & Live Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/matches"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-cskgold-400 uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO FIXTURES</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
              <Radio className="w-3.5 h-3.5" /> LIVE MATCH CENTRE
            </span>
            <Link
              href="/admin/live-scoring"
              className="px-3 py-1 rounded-full bg-navy-800 border border-cskgold-500/40 text-cskgold-400 text-xs font-bold hover:bg-navy-700 transition-colors"
              title="Scorer Console"
            >
              Scorer Console ⚙️
            </Link>
          </div>
        </div>

        {/* Big Live Match Header Board */}
        <div className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 border border-cskgold-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="text-center sm:text-left border-b border-navy-800 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
                {liveMatch.tournament}
              </span>
              <p className="text-xs text-gray-400">{liveMatch.venue} • {liveMatch.time}</p>
            </div>
            <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Target: 129 Runs to Win (CSK Needs {Math.max(0, 129 - inn.runs)} off {Math.max(0, 120 - (inn.overs * 6 + inn.ballsInOver))} balls)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Home Score */}
            <div className="lg:col-span-5 flex items-center justify-between p-6 rounded-2xl bg-navy-950/80 border border-navy-800">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🦁</span>
                <div>
                  <h3 className="text-xl font-extrabold text-white font-display uppercase">
                    CSK
                  </h3>
                  <span className="text-xs text-cskgold-400 font-bold uppercase">Cayman Super Kings</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl sm:text-5xl font-black text-cskgold-400 font-display block">
                  {inn.runs}/{inn.wickets}
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  {inn.overs}.{inn.ballsInOver} / 20 OVERS
                </span>
              </div>
            </div>

            {/* Middle Versus / Probability */}
            <div className="lg:col-span-2 text-center space-y-2">
              <span className="text-2xl font-black text-gray-500 font-display">VS</span>
              <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-[10px] uppercase font-bold text-gray-300">
                <span>CSK WIN CHANCE</span>
                <span className="block text-base font-black text-cskgold-400 font-display mt-0.5">{winProb}%</span>
              </div>
            </div>

            {/* Away Score */}
            <div className="lg:col-span-5 flex items-center justify-between p-6 rounded-2xl bg-navy-950/40 border border-navy-900">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{liveMatch.awayTeam.logo || '🐢'}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-300 font-display uppercase">
                    {liveMatch.awayTeam.shortName || 'GREENIES'}
                  </h3>
                  <span className="text-xs text-gray-500 font-bold uppercase">{liveMatch.awayTeam.name}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl sm:text-5xl font-black text-gray-300 font-display block">
                  {liveMatch.awayTeam.score || '128/8'}
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  20.0 OVERS (COMPLETED)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Grid: Active Players & Match Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Batters & Bowlers */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live Batter Card */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cskgold-400" />
                  <span>CURRENT BATTERS</span>
                </h4>
                <span className="text-xs text-gray-400">Runs (Balls) • 4s • 6s • SR</span>
              </div>

              <div className="space-y-3">
                {/* Striker */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950/80 border border-cskgold-500/30">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <h5 className="text-sm font-extrabold text-white flex items-center gap-1">
                        <span>{inn.currentStriker.name}</span>
                        <span className="text-cskgold-400">*</span>
                      </h5>
                      <span className="text-[10px] text-gray-400">On Strike</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-cskgold-400 font-display">
                      {inn.currentStriker.runs}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">({inn.currentStriker.balls})</span>
                    <span className="text-xs text-gray-300 ml-3">
                      {inn.currentStriker.fours} x 4s, {inn.currentStriker.sixes} x 6s
                    </span>
                    <span className="text-xs text-cskgold-400 font-mono ml-3">
                      SR: {((inn.currentStriker.runs / Math.max(1, inn.currentStriker.balls)) * 100).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Non-Striker */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950/40 border border-navy-800">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                    <div>
                      <h5 className="text-sm font-bold text-gray-200">
                        {inn.currentNonStriker.name}
                      </h5>
                      <span className="text-[10px] text-gray-500">Non-Striker</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-white font-display">
                      {inn.currentNonStriker.runs}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">({inn.currentNonStriker.balls})</span>
                    <span className="text-xs text-gray-400 ml-3">
                      {inn.currentNonStriker.fours} x 4s, {inn.currentNonStriker.sixes} x 6s
                    </span>
                    <span className="text-xs text-gray-400 font-mono ml-3">
                      SR: {((inn.currentNonStriker.runs / Math.max(1, inn.currentNonStriker.balls)) * 100).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Bowler Card */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">
                  CURRENT BOWLER
                </h4>
                <span className="text-xs text-gray-400">O - M - R - W • Economy</span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-950/80 border border-navy-800">
                <div>
                  <h5 className="text-sm font-bold text-white">{inn.currentBowler.name}</h5>
                  <span className="text-[10px] text-gray-400">Right-arm fast medium</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white font-display">
                    {inn.currentBowler.overs} - {inn.currentBowler.maidens} - {inn.currentBowler.runsConceded} - <span className="text-cskgold-400">{inn.currentBowler.wickets}</span>
                  </span>
                  <span className="text-xs text-cskgold-400 font-mono ml-3">
                    ECO: {(inn.currentBowler.runsConceded / Math.max(1, Math.floor(inn.currentBowler.overs) + 0.5)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ball-By-Ball Commentary Feed */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
                <h4 className="text-base font-extrabold text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cskgold-400" />
                  <span>BALL-BY-BALL COMMENTARY</span>
                </h4>
                <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-navy-800 text-[10px] font-black uppercase">
                  {(['ALL', 'BOUNDARIES', 'WICKETS'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setCommentaryFilter(f)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        commentaryFilter === f ? 'bg-cskgold-500 text-navy-950' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredDeliveries.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">No commentary balls match filter.</p>
                ) : (
                  filteredDeliveries.map((ball, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-navy-950/70 border border-navy-800/80 flex items-start gap-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl shrink-0 flex flex-col items-center justify-center font-display font-black text-xs ${
                          ball.isWicket
                            ? 'bg-red-600 text-white'
                            : ball.runs === 4 || ball.runs === 6
                            ? 'bg-cskgold-500 text-navy-950'
                            : 'bg-navy-800 text-gray-300'
                        }`}
                      >
                        <span>{ball.isWicket ? 'W' : ball.runs}</span>
                        <span className="text-[8px] font-normal leading-none opacity-80">{ball.over} ov</span>
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between text-gray-400 mb-1">
                          <span className="font-bold text-white">{ball.bowler} to {ball.striker}</span>
                          <span className="text-[10px]">{ball.timestamp}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{ball.commentary}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Fall of Wickets & Match Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Fall of Wickets */}
            <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider font-display border-b border-navy-800 pb-3">
                FALL OF WICKETS
              </h4>
              <div className="space-y-2 text-xs">
                {inn.fallOfWickets.map((fow, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <span className="font-extrabold text-cskgold-400 font-display">{fow.score}</span>
                    <span className="text-gray-300">{fow.batter}</span>
                    <span className="text-gray-500">{fow.over} ov</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stadium / Matchday Experience Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 to-navy-950 border border-cskgold-500/30 space-y-4">
              <h4 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display">
                ATTENDING AT JIMMY POWELL OVAL?
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Experience the live match atmosphere from the covered grandstand or VIP pavilion.
              </p>
              <Link
                href="/tickets"
                className="w-full py-3 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <span>BOOK MATCH TICKETS</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

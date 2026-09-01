'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Radio, Undo2, RotateCcw, Activity, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

export default function LiveScoringAdminPage() {
  const { matches, recordBall, undoBall, setLiveInningsBatter, setLiveInningsBowler } = useStore();
  const liveMatch = matches.find(m => m.status === 'LIVE') || matches[0];

  const [customCommentary, setCustomCommentary] = useState('');
  const [wicketModalOpen, setWicketModalOpen] = useState(false);
  const [selectedDismissal, setSelectedDismissal] = useState<'bowled' | 'caught' | 'lbw' | 'run out' | 'stumped'>('caught');

  if (!liveMatch || !liveMatch.liveInnings) {
    return (
      <div className="p-8 text-center bg-navy-900 rounded-3xl border border-navy-800">
        <h2 className="text-xl font-bold text-white mb-2">No Live Match In Progress</h2>
        <p className="text-xs text-gray-400 mb-4">Select or mark a match as LIVE in Match Management to start live scoring.</p>
        <Link href="/admin/matches" className="px-5 py-2 rounded-xl btn-gold text-xs font-bold">
          GO TO MATCH MANAGEMENT
        </Link>
      </div>
    );
  }

  const inn = liveMatch.liveInnings;

  const handleScoreBall = (runs: number, extraType?: 'wide' | 'no-ball' | 'bye' | 'leg-bye') => {
    recordBall(liveMatch.id, {
      runs,
      isWicket: false,
      extraType,
      commentary: customCommentary.trim() || undefined
    });
    setCustomCommentary('');
  };

  const handleConfirmWicket = () => {
    recordBall(liveMatch.id, {
      runs: 0,
      isWicket: true,
      wicketType: selectedDismissal,
      commentary: customCommentary.trim() || `WICKET! ${inn.currentStriker.name} ${selectedDismissal} by ${inn.currentBowler.name}`
    });
    setWicketModalOpen(false);
    setCustomCommentary('');
  };

  const handleUndo = () => {
    undoBall(liveMatch.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            REAL-TIME MATCH OPERATOR
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            LIVE SCORER CONSOLE
          </h1>
        </div>

        <Link
          href="/matches/live"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-navy-900 border border-navy-700 hover:border-cskgold-500 text-cskgold-400 text-xs font-bold uppercase flex items-center gap-1.5"
        >
          <Eye className="w-4 h-4" />
          <span>VIEW LIVE FAN SITE ↗</span>
        </Link>
      </div>

      {/* Match Overview Ribbon */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-navy-700 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦁</span>
            <div>
              <h3 className="text-base font-extrabold text-white uppercase font-display">
                {liveMatch.title}
              </h3>
              <p className="text-[11px] text-gray-300">{liveMatch.tournament} • {liveMatch.venue}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-red-600 text-white text-xs font-black uppercase rounded-full animate-pulse">
            🔴 LIVE BROADCAST
          </span>
        </div>

        {/* Current Score Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-navy-950 rounded-2xl border border-navy-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">CSK SCORE</span>
            <span className="text-3xl font-black text-cskgold-400 font-display">
              {inn.runs}/{inn.wickets}
            </span>
          </div>
          <div className="p-3 bg-navy-950 rounded-2xl border border-navy-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">OVERS COMPLETED</span>
            <span className="text-3xl font-black text-white font-display">
              {inn.overs}.{inn.ballsInOver}
            </span>
          </div>
          <div className="p-3 bg-navy-950 rounded-2xl border border-navy-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">CURRENT STRIKER</span>
            <span className="text-lg font-extrabold text-white font-display block mt-1">
              {inn.currentStriker.name} ({inn.currentStriker.runs}*)
            </span>
          </div>
          <div className="p-3 bg-navy-950 rounded-2xl border border-navy-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">CURRENT BOWLER</span>
            <span className="text-lg font-extrabold text-white font-display block mt-1">
              {inn.currentBowler.name} ({inn.currentBowler.wickets}/{inn.currentBowler.runsConceded})
            </span>
          </div>
        </div>
      </div>

      {/* Main Scorer Keypad Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Keypad */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">
              SCORER KEYPAD (BALL-BY-BALL)
            </h3>
            <span className="text-xs text-cskgold-400 font-mono">1-Click Instant Broadcast</span>
          </div>

          {/* Row 1: Standard Runs */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              RUNS OFF BAT
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {[0, 1, 2, 3, 4, 6].map(runs => (
                <button
                  key={runs}
                  onClick={() => handleScoreBall(runs)}
                  className={`h-16 rounded-2xl text-2xl font-black font-display uppercase transition-all shadow-lg transform active:scale-95 ${
                    runs === 4 || runs === 6
                      ? 'bg-gradient-to-br from-cskgold-400 to-cskgold-600 text-navy-950 border-2 border-cskgold-300'
                      : 'bg-navy-950 hover:bg-navy-800 text-white border border-navy-700'
                  }`}
                >
                  {runs}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Extras & Wickets */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
              EXTRAS & OUTS
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setWicketModalOpen(true)}
                className="h-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-base font-black font-display uppercase tracking-wider shadow-lg transform active:scale-95 flex items-center justify-center"
              >
                OUT / WICKET (W)
              </button>

              <button
                onClick={() => handleScoreBall(0, 'wide')}
                className="h-14 rounded-2xl bg-amber-600/80 hover:bg-amber-500 text-white text-base font-black font-display uppercase shadow-lg transform active:scale-95"
              >
                WIDE (WD)
              </button>

              <button
                onClick={() => handleScoreBall(0, 'no-ball')}
                className="h-14 rounded-2xl bg-purple-600/80 hover:bg-purple-500 text-white text-base font-black font-display uppercase shadow-lg transform active:scale-95"
              >
                NO BALL (NB)
              </button>

              <button
                onClick={() => handleScoreBall(1, 'bye')}
                className="h-14 rounded-2xl bg-navy-950 hover:bg-navy-800 border border-navy-700 text-gray-200 text-base font-black font-display uppercase transform active:scale-95"
              >
                1 BYE / LEG BYE
              </button>
            </div>
          </div>

          {/* Optional Ball Commentary */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              CUSTOM COMMENTARY NOTE (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. Smashed over deep mid-wicket into the pavilion roof!"
              value={customCommentary}
              onChange={e => setCustomCommentary(e.target.value)}
              className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
            />
          </div>

          {/* Undo Action */}
          <div className="pt-2 border-t border-navy-800 flex justify-between items-center">
            <button
              onClick={handleUndo}
              className="px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-red-950 text-red-400 border border-red-900/60 text-xs font-black uppercase tracking-wider flex items-center gap-2"
            >
              <Undo2 className="w-4 h-4" />
              <span>UNDO PREVIOUS BALL</span>
            </button>

            <span className="text-[11px] text-gray-400 font-mono">
              Live updates propagate across all user sessions instantly.
            </span>
          </div>
        </div>

        {/* Right Column: Active Over Tracker */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-cskgold-400">
              CURRENT OVER DELIVERIES
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {inn.recentOvers.slice(-6).map((token, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm ${
                    token === 'W'
                      ? 'bg-red-600 text-white'
                      : token === '4' || token === '6'
                      ? 'bg-cskgold-500 text-navy-950'
                      : 'bg-navy-950 border border-navy-700 text-gray-200'
                  }`}
                >
                  {token}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deliveries List */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-cskgold-400">
              RECENT BALL LOG
            </h4>
            <div className="divide-y divide-navy-800 text-xs max-h-60 overflow-y-auto">
              {(liveMatch.deliveries || []).slice(0, 6).map((d, idx) => (
                <div key={idx} className="py-2 flex justify-between items-start gap-2">
                  <span className="font-mono text-cskgold-400 font-bold">{d.over} ov</span>
                  <span className="text-gray-300 flex-1 truncate">{d.commentary}</span>
                  <span className="font-extrabold text-white">{d.isWicket ? 'W' : d.runs}R</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wicket Dismissal Modal */}
      {wicketModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md"
          onClick={() => setWicketModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-navy-900 border border-red-500/50 rounded-3xl p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-extrabold text-red-400 uppercase font-display">
              CONFIRM DISMISSAL FOR {inn.currentStriker.name}
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Dismissal Type</label>
              <select
                value={selectedDismissal}
                onChange={e => setSelectedDismissal(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
              >
                <option value="caught">Caught</option>
                <option value="bowled">Bowled</option>
                <option value="lbw">LBW</option>
                <option value="run out">Run Out</option>
                <option value="stumped">Stumped</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirmWicket}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase"
              >
                RECORD WICKET
              </button>
              <button
                onClick={() => setWicketModalOpen(false)}
                className="px-4 py-3 rounded-xl bg-navy-950 text-gray-400 text-xs font-bold uppercase"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

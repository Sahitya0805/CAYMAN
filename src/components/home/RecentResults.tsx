'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Trophy, CheckCircle, ArrowRight, Award } from 'lucide-react';

export const RecentResults: React.FC = () => {
  const { matches } = useStore();
  const completed = matches.filter(m => m.status === 'COMPLETED');

  if (completed.length === 0) return null;

  return (
    <section className="py-14 bg-navy-950/60 border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cskgold-400 font-display">
              RECENT TRIUMPHS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight font-display mt-1">
              MATCH RESULTS & SCORECARDS
            </h2>
          </div>
          <Link
            href="/matches#results"
            className="text-xs font-black uppercase tracking-wider text-cskgold-400 hover:text-cskgold-300 flex items-center gap-1 group"
          >
            <span>VIEW ALL RESULTS</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completed.map(match => (
            <div
              key={match.id}
              className="rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 border border-cskgold-500/30 p-6 sm:p-7 shadow-xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  {match.tournament} • {match.date}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  <CheckCircle className="w-3.5 h-3.5" /> {match.result}
                </span>
              </div>

              {/* Head-to-Head Scores */}
              <div className="grid grid-cols-2 gap-4 items-center">
                {/* Team 1 */}
                <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 text-center space-y-1">
                  <span className="text-3xl">🦁</span>
                  <h4 className="text-sm font-extrabold text-white font-display uppercase">
                    CSK
                  </h4>
                  <span className="text-2xl font-black text-cskgold-400 font-display block">
                    {match.homeTeam.score}
                  </span>
                  <span className="text-[10px] text-gray-400 block">{match.homeTeam.overs}</span>
                </div>

                {/* Team 2 */}
                <div className="p-4 rounded-2xl bg-navy-950/40 border border-navy-900 text-center space-y-1">
                  <span className="text-3xl">{match.awayTeam.logo || '🏏'}</span>
                  <h4 className="text-sm font-extrabold text-gray-300 font-display uppercase">
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </h4>
                  <span className="text-2xl font-black text-gray-300 font-display block">
                    {match.awayTeam.score}
                  </span>
                  <span className="text-[10px] text-gray-500 block">{match.awayTeam.overs}</span>
                </div>
              </div>

              {/* Summary text */}
              {match.summary && (
                <p className="text-xs text-gray-300 leading-relaxed bg-navy-950/50 p-3 rounded-xl border border-navy-800/80">
                  {match.summary}
                </p>
              )}

              {/* Top Performers in this match */}
              {match.topPerformers && (
                <div className="space-y-2 pt-2 border-t border-navy-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cskgold-400 block">
                    TOP PERFORMERS
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {match.topPerformers.slice(0, 2).map((perf, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-navy-950/90 border border-navy-800/80 flex items-center gap-2">
                        <span className="text-xl">{perf.badge}</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">{perf.player}</p>
                          <p className="text-[10px] text-cskgold-400 font-medium mt-0.5">{perf.stat}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scorecard CTA */}
              <Link
                href="/news/csk-defeat-greenies-by-62-runs"
                className="w-full py-3 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 text-center"
              >
                <span>READ FULL MATCH REPORT & SCORECARD</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

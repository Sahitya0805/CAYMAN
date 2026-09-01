'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Calendar, MapPin, Ticket, ArrowRight, Radio, Trophy, Table } from 'lucide-react';

export default function MatchesPage() {
  const { matches } = useStore();
  const [tab, setTab] = useState<'FIXTURES' | 'RESULTS' | 'TABLE'>('FIXTURES');

  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE');
  const pastMatches = matches.filter(m => m.status === 'COMPLETED');

  const pointsTable = [
    { pos: 1, team: 'Cayman Super Kings (CSK)', played: 3, won: 3, lost: 0, nrr: '+2.840', pts: 6 },
    { pos: 2, team: 'George Town Strikers', played: 3, won: 2, lost: 1, nrr: '+0.750', pts: 4 },
    { pos: 3, team: 'West Bay Warriors', played: 3, won: 1, lost: 2, nrr: '-0.320', pts: 2 },
    { pos: 4, team: 'Greenies Too', played: 3, won: 1, lost: 2, nrr: '-1.450', pts: 2 },
    { pos: 5, team: 'Cayman Youth Academy (CYA)', played: 2, won: 0, lost: 2, nrr: '-1.980', pts: 0 }
  ];

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 mb-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
              DANIEL MORRIS SUPER LEAGUE T20
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
              MATCH HUB & SCORES
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">
              Track fixtures, ball-by-ball live scoring, past match scorecards, and league standings.
            </p>
          </div>

          <Link
            href="/matches/live"
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl animate-pulse"
          >
            <Radio className="w-4 h-4" />
            <span>LIVE MATCH CENTRE</span>
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-navy-800 mb-8">
          <button
            onClick={() => setTab('FIXTURES')}
            className={`px-6 py-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 ${
              tab === 'FIXTURES' ? 'border-cskgold-400 text-cskgold-400 bg-navy-900/50' : 'border-transparent text-gray-400'
            }`}
          >
            UPCOMING FIXTURES ({upcomingMatches.length})
          </button>
          <button
            onClick={() => setTab('RESULTS')}
            className={`px-6 py-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 ${
              tab === 'RESULTS' ? 'border-cskgold-400 text-cskgold-400 bg-navy-900/50' : 'border-transparent text-gray-400'
            }`}
          >
            RESULTS & SCORECARDS ({pastMatches.length})
          </button>
          <button
            onClick={() => setTab('TABLE')}
            className={`px-6 py-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 ${
              tab === 'TABLE' ? 'border-cskgold-400 text-cskgold-400 bg-navy-900/50' : 'border-transparent text-gray-400'
            }`}
          >
            POINTS TABLE
          </button>
        </div>

        {/* Tab Views */}
        {tab === 'FIXTURES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingMatches.map(m => (
              <div key={m.id} className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">{m.tournament}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-navy-950 text-cskgold-400 text-[10px] font-black uppercase">
                    {m.status}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🦁</span>
                    <span className="font-extrabold text-white font-display text-base">{m.homeTeam.name}</span>
                  </div>
                  <span className="font-black text-gray-500 font-display">VS</span>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-gray-300 font-display text-base">{m.awayTeam.name}</span>
                    <span className="text-3xl">{m.awayTeam.logo || '🏏'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-navy-800">
                  <span>{m.date} • {m.time}</span>
                  <span>{m.venue.split(',')[0]}</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={m.status === 'LIVE' ? '/matches/live' : '/tickets'}
                    className="w-full py-2.5 rounded-xl btn-gold text-xs font-black uppercase text-center flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>{m.status === 'LIVE' ? 'ENTER LIVE CENTRE' : 'BUY TICKETS'}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'RESULTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastMatches.map(m => (
              <div key={m.id} className="p-6 rounded-3xl bg-navy-900 border border-cskgold-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">{m.tournament} • {m.date}</span>
                  <span className="text-xs font-black text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">
                    {m.result}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-white">🦁 {m.homeTeam.name}</span>
                    <span className="text-cskgold-400 font-extrabold">{m.homeTeam.score}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-300">{m.awayTeam.logo || '🏏'} {m.awayTeam.name}</span>
                    <span className="text-gray-400 font-extrabold">{m.awayTeam.score}</span>
                  </div>
                </div>

                {m.summary && (
                  <p className="text-xs text-gray-300 bg-navy-950 p-3 rounded-xl">{m.summary}</p>
                )}

                <Link
                  href="/news/csk-defeat-greenies-by-62-runs"
                  className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-cskgold-400 text-xs font-black uppercase text-center block"
                >
                  VIEW FULL SCORECARD & REPORT
                </Link>
              </div>
            ))}
          </div>
        )}

        {tab === 'TABLE' && (
          <div className="rounded-3xl bg-navy-900 border border-navy-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-navy-800 flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base uppercase tracking-wider font-display">
                DANIEL MORRIS SUPER LEAGUE T20 2026 STANDINGS
              </h3>
              <span className="text-xs text-cskgold-400 font-bold">TOP 2 ADVANCE TO FINAL</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-950 text-gray-400 uppercase font-black tracking-wider">
                  <tr>
                    <th className="p-4">POS</th>
                    <th className="p-4">TEAM</th>
                    <th className="p-4">PLAYED</th>
                    <th className="p-4">WON</th>
                    <th className="p-4">LOST</th>
                    <th className="p-4">NET RR</th>
                    <th className="p-4 text-right">POINTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {pointsTable.map(row => (
                    <tr key={row.pos} className={row.pos === 1 ? 'bg-cskgold-500/10' : ''}>
                      <td className="p-4 font-extrabold text-white">{row.pos}</td>
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        {row.pos === 1 && <span className="text-cskgold-400 font-black">🦁</span>}
                        <span>{row.team}</span>
                      </td>
                      <td className="p-4 text-gray-300">{row.played}</td>
                      <td className="p-4 text-emerald-400 font-bold">{row.won}</td>
                      <td className="p-4 text-red-400">{row.lost}</td>
                      <td className="p-4 font-mono text-gray-300">{row.nrr}</td>
                      <td className="p-4 text-right font-black text-cskgold-400 text-sm">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

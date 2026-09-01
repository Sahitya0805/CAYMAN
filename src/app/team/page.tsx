'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Trophy, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function TeamPage() {
  const { players } = useStore();
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const roles = ['ALL', 'Batter', 'Bowler', 'All-Rounder', 'Wicketkeeper'];

  const filteredPlayers = players.filter(p => {
    if (selectedRole === 'ALL') return true;
    if (selectedRole === 'Batter') return p.role.includes('Batter');
    if (selectedRole === 'Bowler') return p.role.includes('Bowler');
    if (selectedRole === 'All-Rounder') return p.role.includes('All-Rounder');
    if (selectedRole === 'Wicketkeeper') return p.role.includes('Wicketkeeper');
    return true;
  });

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 mb-12 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
              OFFICIAL SQUAD 2026
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight">
              THE SQUAD OF KINGS
            </h1>
            <p className="text-sm text-gray-300">
              Meet the players representing the Cayman Super Kings in the Daniel Morris Super League T20 championship.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-navy-950/80 border border-navy-700/80 p-4 rounded-2xl">
            <div className="text-center px-3">
              <span className="text-3xl font-black text-cskgold-400 font-display">{players.length}</span>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">SQUAD PLAYERS</span>
            </div>
            <div className="h-8 w-px bg-navy-700" />
            <div className="text-center px-3">
              <span className="text-3xl font-black text-white font-display">3</span>
              <span className="block text-[10px] text-gray-400 font-bold uppercase">TITLES WON</span>
            </div>
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex items-center justify-center md:justify-start gap-2 overflow-x-auto pb-4 mb-8">
          {roles.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedRole === r
                  ? 'bg-cskgold-500 text-navy-950 shadow-lg'
                  : 'bg-navy-900 border border-navy-800 text-gray-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlayers.map(player => (
            <Link
              key={player.id}
              href={`/players/${player.slug}`}
              className="group rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-cskgold-500/60 shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
            >
              {/* Photo Area */}
              <div className="relative w-full h-80 overflow-hidden bg-navy-950">
                <Image
                  src={player.photoUrl}
                  alt={player.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />

                {/* Jersey Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-navy-950/90 border border-cskgold-500/40 text-cskgold-400 font-black text-xs">
                  #{player.jerseyNumber}
                </div>

                {player.isFeatured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-cskgold-500 text-navy-950 font-black text-[10px] uppercase tracking-wider">
                    STAR PLAYER
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="p-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  {player.role}
                </span>
                <h3 className="text-xl font-extrabold text-white group-hover:text-cskgold-400 font-display uppercase tracking-wide transition-colors">
                  {player.name}
                </h3>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {player.bio}
                </p>

                {/* Mini Stats Bar */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-navy-800 text-center">
                  <div className="p-2 bg-navy-950 rounded-xl">
                    <span className="text-[10px] text-gray-400 block">RUNS</span>
                    <span className="text-xs font-black text-cskgold-400">{player.stats.runs}</span>
                  </div>
                  <div className="p-2 bg-navy-950 rounded-xl">
                    <span className="text-[10px] text-gray-400 block">AVG</span>
                    <span className="text-xs font-black text-white">{player.stats.average}</span>
                  </div>
                  <div className="p-2 bg-navy-950 rounded-xl">
                    <span className="text-[10px] text-gray-400 block">WKTS</span>
                    <span className="text-xs font-black text-cskgold-400">{player.stats.wickets}</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-cskgold-400 font-bold uppercase tracking-wider">
                  <span>FULL PROFILE</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

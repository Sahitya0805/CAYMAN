'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Trophy, Calendar, MapPin, Award, ArrowLeft, ArrowRight, Star, ShieldCheck } from 'lucide-react';

export default function PlayerDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { players, matches, media } = useStore();

  const player = players.find(p => p.slug === slug);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'STATISTICS' | 'MATCHES' | 'PHOTOS'>('PROFILE');

  if (!player) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Player Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">The requested player profile does not exist.</p>
        <Link href="/team" className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold">
          RETURN TO SQUAD
        </Link>
      </div>
    );
  }

  const playerMedia = media.filter(m => m.tag === 'Player' || m.tag === 'Match');

  return (
    <div className="min-h-screen bg-navy-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-cskgold-400 uppercase tracking-wider mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SQUAD</span>
        </Link>

        {/* Player Header Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-6 sm:p-10 shadow-2xl mb-10 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Player Photo */}
            <div className="lg:col-span-4 relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-navy-950 border border-navy-700/80 shadow-2xl">
              <Image
                src={player.photoUrl}
                alt={player.name}
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-navy-950/90 border border-cskgold-500/40 text-cskgold-400 font-black text-sm">
                #{player.jerseyNumber}
              </div>
            </div>

            {/* Player Info & Quick Key Stats */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-cskgold-500/20 text-cskgold-400 text-xs font-black uppercase tracking-widest mb-2">
                  {player.role}
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight">
                  {player.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed max-w-2xl">
                  {player.bio}
                </p>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-navy-700/80 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Batting Style</span>
                  <span className="text-white font-bold">{player.battingStyle}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Bowling Style</span>
                  <span className="text-white font-bold">{player.bowlingStyle}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Nationality</span>
                  <span className="text-white font-bold">{player.nationality}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Date of Birth</span>
                  <span className="text-white font-bold">{player.dateOfBirth}</span>
                </div>
              </div>

              {/* Stats Highlights Header Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3 bg-navy-950/80 rounded-2xl border border-navy-800 text-center">
                  <span className="text-gray-400 text-[10px] font-bold block uppercase">MATCHES</span>
                  <span className="text-2xl font-black text-white font-display">{player.stats.matches}</span>
                </div>
                <div className="p-3 bg-navy-950/80 rounded-2xl border border-navy-800 text-center">
                  <span className="text-gray-400 text-[10px] font-bold block uppercase">RUNS</span>
                  <span className="text-2xl font-black text-cskgold-400 font-display">{player.stats.runs}</span>
                </div>
                <div className="p-3 bg-navy-950/80 rounded-2xl border border-navy-800 text-center">
                  <span className="text-gray-400 text-[10px] font-bold block uppercase">AVERAGE</span>
                  <span className="text-2xl font-black text-white font-display">{player.stats.average}</span>
                </div>
                <div className="p-3 bg-navy-950/80 rounded-2xl border border-navy-800 text-center">
                  <span className="text-gray-400 text-[10px] font-bold block uppercase">WICKETS</span>
                  <span className="text-2xl font-black text-cskgold-400 font-display">{player.stats.wickets}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-navy-800 mb-8 overflow-x-auto">
          {(['PROFILE', 'STATISTICS', 'MATCHES', 'PHOTOS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-cskgold-400 text-cskgold-400 bg-navy-900/50'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'PROFILE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-3">
                <h3 className="text-base font-extrabold text-white uppercase tracking-wide font-display flex items-center gap-2">
                  <Award className="w-4 h-4 text-cskgold-400" />
                  <span>RECENT MATCH PERFORMANCES</span>
                </h3>
                <div className="space-y-2">
                  {player.recentPerformances.map((perf, idx) => (
                    <div key={idx} className="p-3 bg-navy-950/80 rounded-xl border border-navy-800 text-xs text-gray-200 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-cskgold-400" />
                      <span>{perf}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-3">
                <h3 className="text-base font-extrabold text-white uppercase tracking-wide font-display">
                  PLAYER BIOGRAPHY & STORY
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {player.bio} A pillar of strength in the Cayman Super Kings dressing room, {player.name} brings unwavering dedication, sportsmanship, and Caribbean pride to every Daniel Morris Super League encounter.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 to-navy-950 border border-cskgold-500/30 space-y-4">
                <h3 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display">
                  GET {player.name.toUpperCase()}’S JERSEY
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Support {player.name} (# {player.jerseyNumber}) with the official 2026 match kit.
                </p>
                <Link
                  href="/shop/prod-1"
                  className="w-full py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>ORDER JERSEY ($59.99)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'STATISTICS' && (
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
            <h3 className="text-lg font-extrabold text-white font-display uppercase tracking-wider">
              DETAILED CAREER NUMBERS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800">
                <span className="text-gray-400 uppercase block text-[10px]">Strike Rate</span>
                <span className="text-xl font-black text-cskgold-400">{player.stats.strikeRate}</span>
              </div>
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800">
                <span className="text-gray-400 uppercase block text-[10px]">Fifties (50s)</span>
                <span className="text-xl font-black text-white">{player.stats.fifties}</span>
              </div>
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800">
                <span className="text-gray-400 uppercase block text-[10px]">Hundreds (100s)</span>
                <span className="text-xl font-black text-white">{player.stats.hundreds}</span>
              </div>
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800">
                <span className="text-gray-400 uppercase block text-[10px]">Highest Score</span>
                <span className="text-xl font-black text-cskgold-400">{player.stats.highestScore}</span>
              </div>
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800">
                <span className="text-gray-400 uppercase block text-[10px]">Bowling Economy</span>
                <span className="text-xl font-black text-white">{player.stats.economy}</span>
              </div>
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800">
                <span className="text-gray-400 uppercase block text-[10px]">Best Bowling</span>
                <span className="text-xl font-black text-cskgold-400">{player.stats.bestBowling}</span>
              </div>
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800">
                <span className="text-gray-400 uppercase block text-[10px]">Catches Taken</span>
                <span className="text-xl font-black text-white">{player.stats.catches}</span>
              </div>
              <div className="p-4 bg-navy-950 rounded-2xl border border-navy-800">
                <span className="text-gray-400 uppercase block text-[10px]">Bowling Average</span>
                <span className="text-xl font-black text-white">{player.stats.bowlingAverage}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'MATCHES' && (
          <div className="space-y-4">
            {matches.map(m => (
              <div key={m.id} className="p-4 bg-navy-900 border border-navy-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">{m.tournament} • {m.date}</span>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-navy-950 text-cskgold-400 font-extrabold uppercase">
                  {m.result || m.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'PHOTOS' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {playerMedia.map(m => (
              <div key={m.id} className="relative h-60 rounded-2xl overflow-hidden bg-navy-900 border border-navy-800">
                <Image src={m.thumbnailUrl} alt={m.title} fill className="object-cover" />
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-navy-950 to-transparent">
                  <p className="text-xs font-bold text-white line-clamp-1">{m.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

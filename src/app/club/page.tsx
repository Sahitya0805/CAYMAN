'use client';

import React from 'react';
import Image from 'next/image';
import { Trophy, ShieldCheck, Users, Heart, Target, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ClubPage() {
  const { sponsors } = useStore();

  const values = [
    { title: 'EXCELLENCE & DISCIPLINE', desc: 'Relentless preparation, professional fitness standards, and clinical execution on matchday.', icon: '🏆' },
    { title: 'BROTHERHOOD & UNITY', desc: 'One Team. One Dream. We play for the badge, our teammates, and our supporters.', icon: '🦁' },
    { title: 'COMMUNITY & YOUTH', desc: 'Inspiring young Caymanian boys and girls to take up cricket and lead active, healthy lives.', icon: '🌴' }
  ];

  const milestones = [
    { year: '2022', title: 'Club Founded', desc: 'Cayman Super Kings formed by passionate cricket enthusiasts in George Town.' },
    { year: '2024', title: 'Super League Debut', desc: 'Entered the Daniel Morris Super League T20 with immediate playoff qualification.' },
    { year: '2026', title: '3 Consecutive Wins & Historic Dominance', desc: 'Back-to-back dominant wins over Greenies Too (by 62 runs) and CYA (by 8 wickets).' }
  ];

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
            OUR HERITAGE & VISION
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
            THE STORY OF THE KINGS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
            The Cayman Super Kings Cricket Club embodies the competitive spirit, island camaraderie, and athletic excellence of cricket in the Cayman Islands.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display">
              ONE TEAM. ONE DREAM.
            </h2>
            <p>
              Founded with a mission to elevate Caribbean club cricket, the Cayman Super Kings have rapidly emerged as a formidable powerhouse in the Daniel Morris Super League T20.
            </p>
            <p>
              Based at the iconic Jimmy Powell Oval in George Town, CSK unites world-class talent, seasoned captains, and promising local youth into a tight-knit brotherhood.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-navy-900 border border-navy-800 text-center flex-1">
                <span className="text-2xl font-black text-cskgold-400 font-display">132/10</span>
                <span className="text-[10px] text-gray-400 block uppercase">Record T20 Defense</span>
              </div>
              <div className="p-3 rounded-2xl bg-navy-900 border border-navy-800 text-center flex-1">
                <span className="text-2xl font-black text-white font-display">3 IN A ROW</span>
                <span className="text-[10px] text-gray-400 block uppercase">Winning Streak</span>
              </div>
            </div>
          </div>

          <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-navy-900 border border-cskgold-500/30 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop"
              alt="Cayman Super Kings Team"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display text-center">
            OUR CORE VALUES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-3 text-center">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="text-sm font-extrabold text-white uppercase font-display">{v.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History Timeline */}
        <div id="history" className="p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
          <h2 className="text-2xl font-extrabold text-white uppercase font-display tracking-wide">
            CLUB HISTORY & MILESTONES
          </h2>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-navy-950 border border-navy-800">
                <span className="px-3 py-1 rounded-xl bg-cskgold-500 text-navy-950 font-black text-xs font-display">
                  {m.year}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-display">{m.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

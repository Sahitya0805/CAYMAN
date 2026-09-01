'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';

export const NextMatchWidget: React.FC = () => {
  const { matches } = useStore();
  const upcomingMatch = matches.find(m => m.status === 'UPCOMING') || matches[0];

  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 4,
    minutes: 21,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!upcomingMatch) return null;

  return (
    <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-cskgold-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          {/* Match Encounter Left */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left flex-1">
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl">🦁</span>
              <div>
                <span className="text-[11px] font-bold text-cskgold-400 uppercase tracking-[0.25em] font-mono block">
                  HOME FIXTURE
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white uppercase font-display tracking-tight">
                  CAYMAN SUPER KINGS
                </h4>
              </div>
            </div>

            <span className="text-xl font-bold text-gray-500 font-display">VS</span>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.25em] font-mono block sm:text-right">
                  ROUND 04
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-gray-200 uppercase font-display tracking-tight">
                  {upcomingMatch.awayTeam.name}
                </h4>
              </div>
              <span className="text-4xl sm:text-5xl">{upcomingMatch.awayTeam.logo || '🏏'}</span>
            </div>
          </div>

          {/* Countdown Numbers */}
          <div className="flex items-center gap-3 sm:gap-4 bg-navy-950/80 border border-navy-800/80 px-5 py-3 rounded-2xl">
            <div className="text-center min-w-[50px]">
              <span className="text-2xl sm:text-3xl font-black text-white font-display">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                DAYS
              </span>
            </div>
            <span className="text-cskgold-400 font-bold text-lg">:</span>
            <div className="text-center min-w-[50px]">
              <span className="text-2xl sm:text-3xl font-black text-white font-display">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                HOURS
              </span>
            </div>
            <span className="text-cskgold-400 font-bold text-lg">:</span>
            <div className="text-center min-w-[50px]">
              <span className="text-2xl sm:text-3xl font-black text-white font-display">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                MINS
              </span>
            </div>
            <span className="text-cskgold-400 font-bold text-lg">:</span>
            <div className="text-center min-w-[50px]">
              <span className="text-2xl sm:text-3xl font-black text-cskgold-400 font-display">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="block text-[9px] font-bold text-cskgold-400 uppercase tracking-widest mt-0.5">
                SECS
              </span>
            </div>
          </div>

          {/* Direct Action */}
          <Link
            href="/tickets"
            className="px-8 py-4 rounded-2xl btn-gold-primary text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl whitespace-nowrap"
          >
            <Ticket className="w-4 h-4" />
            <span>GET TICKETS ($10)</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

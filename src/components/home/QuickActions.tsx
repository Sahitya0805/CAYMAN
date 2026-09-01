'use client';

import React from 'react';
import Link from 'next/link';
import { Ticket, Calendar, Utensils, Users, ArrowUpRight } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'MATCH TICKETS',
      subtitle: 'From $10 • Grandstand & VIP',
      icon: Ticket,
      href: '/tickets',
      tag: 'OFFICIAL PASSES'
    },
    {
      title: 'FIXTURES & SCORES',
      subtitle: '2026 Daniel Morris League',
      icon: Calendar,
      href: '/matches',
      tag: 'LIVE CENTRE'
    },
    {
      title: 'VIP HOSPITALITY',
      subtitle: 'Private Suites & Match Dining',
      icon: Utensils,
      href: '/hospitality',
      tag: 'PREMIUM EXPERIENCE'
    },
    {
      title: 'THE SQUAD',
      subtitle: 'Player Profiles & Statistics',
      icon: Users,
      href: '/team',
      tag: 'MEET THE KINGS'
    }
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              href={action.href}
              className="group relative p-7 rounded-3xl bg-gradient-to-b from-navy-900/60 via-navy-950/80 to-navy-950 border border-cskgold-500/20 hover:border-cskgold-400/60 transition-all duration-400 transform hover:-translate-y-2 shadow-2xl hover:shadow-cskgold-500/10 flex flex-col justify-between min-h-[200px]"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-cskgold-400 font-mono">
                  {action.tag}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-navy-950/80 border border-navy-800 flex items-center justify-center text-gray-400 group-hover:text-cskgold-300 group-hover:border-cskgold-500/40 transition-all">
                  <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="mt-8">
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cskgold-300 uppercase tracking-wide font-display transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-normal">
                  {action.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

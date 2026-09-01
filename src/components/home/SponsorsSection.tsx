'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export const SponsorsSection: React.FC = () => {
  const { sponsors } = useStore();
  const activeSponsors = sponsors.filter(s => s.active).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
        PROUD SUPPORTERS
      </span>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display mt-1 mb-8">
        OUR OFFICIAL CLUB PARTNERS
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {activeSponsors.map(sponsor => (
          <a
            key={sponsor.id}
            href={sponsor.website}
            target="_blank"
            rel="noreferrer"
            className="group p-5 rounded-2xl bg-navy-900/60 border border-navy-800/80 hover:border-cskgold-500/40 transition-all flex flex-col items-center justify-center min-h-[90px] hover:shadow-lg"
          >
            <span className="text-sm font-extrabold text-gray-300 group-hover:text-cskgold-400 font-display uppercase tracking-wider transition-colors">
              {sponsor.logo}
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">
              {sponsor.tier}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

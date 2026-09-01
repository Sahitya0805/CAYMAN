'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export const HospitalityPreview: React.FC = () => {
  const { hospitality } = useStore();

  return (
    <section className="py-24 bg-gradient-to-b from-navy-950 via-navy-900/40 to-navy-950 border-y border-cskgold-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 text-cskgold-400 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] font-mono">
              <Sparkles className="w-4 h-4" />
              <span>MATCHDAY LUXURY & VIP</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-display mt-1">
              EXPERIENCE THE KINGS
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2 font-medium max-w-xl">
              Pitch-line corporate suites, private dining, and bespoke Caribbean hospitality at Jimmy Powell Oval.
            </p>
          </div>

          <Link
            href="/hospitality"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-navy-900 border border-navy-700 hover:border-cskgold-400 text-cskgold-400 text-xs sm:text-sm font-black uppercase tracking-wider group transition-all"
          >
            <span>VIEW ALL PACKAGES</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* 3 VIP Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hospitality.map(pkg => (
            <div
              key={pkg.id}
              className="group rounded-3xl overflow-hidden bg-navy-900/70 border border-cskgold-500/20 hover:border-cskgold-400/60 shadow-2xl transition-all duration-400 flex flex-col justify-between transform hover:-translate-y-2"
            >
              <div>
                <div className="relative w-full h-64 overflow-hidden bg-navy-950">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 px-4 py-1.5 rounded-xl bg-navy-950/90 border border-cskgold-500/40 text-cskgold-300 text-xs font-black uppercase tracking-wider backdrop-blur-md font-mono">
                    FROM ${pkg.pricePerPerson} / PP
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-wide group-hover:text-cskgold-300 transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed font-normal">
                    {pkg.subtitle}
                  </p>

                  <div className="mt-6 space-y-2 pt-4 border-t border-navy-800">
                    {pkg.perks.slice(0, 3).map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
                        <Check className="w-4 h-4 text-cskgold-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-7 pt-0">
                <Link
                  href="/hospitality"
                  className="w-full py-3.5 rounded-xl btn-gold-primary text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 text-center shadow-xl"
                >
                  <span>BOOK VIP PACKAGE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

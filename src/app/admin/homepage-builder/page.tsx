'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Layers, Eye, EyeOff, ArrowUp, ArrowDown, Check, RotateCcw } from 'lucide-react';

export default function AdminHomepageBuilderPage() {
  const { settings, reorderHomepageSections, toggleHomepageSection, updateSettings } = useStore();

  const sectionLabels: Record<string, string> = {
    hero: '1. Fullscreen Hero Banner & Video Carousel',
    nextMatch: '2. Next Match Widget & Countdown Clock',
    quickActions: '3. Quick Action 6-Card Action Grid',
    fixtures: '4. Upcoming Fixtures & Schedule Tabs',
    liveMatch: '5. Live Match Centre Preview & Probabilities',
    results: '6. Recent Results & Match Scorecards',
    players: '7. Meet The Kings (Squad Spotlight)',
    performance: '8. Player Performance & Medal Winners',
    news: '9. Latest News & Match Reports (3-Column)',
    videos: '10. Match Highlights & Video Clips Vault',
    fanZone: '11. Fan Zone Polls & Digital Membership Pass',
    shop: '12. Official Merchandise & Gear Preview',
    hospitality: '13. VIP Hospitality & Corporate Box Packages',
    sponsors: '14. Official Club Partners Marquee',
    instagram: '15. Instagram Social Stream Grid'
  };

  const currentOrder = settings.homepageSectionsOrder || Object.keys(sectionLabels);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...currentOrder];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    reorderHomepageSections(updated);
  };

  const moveDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    const updated = [...currentOrder];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    reorderHomepageSections(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            LAYOUT & EXPERIENCE CUSTOMIZER
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            HOMEPAGE SECTION BUILDER
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Show, hide, and reorder all 15 homepage sections dynamically. Changes reflect live instantly on the fan home portal.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
        >
          <Eye className="w-4 h-4" />
          <span>PREVIEW LIVE HOMEPAGE ↗</span>
        </Link>
      </div>

      {/* Sections List */}
      <div className="rounded-3xl bg-navy-900 border border-navy-800 p-6 space-y-3 shadow-xl">
        {currentOrder.map((sectionKey, index) => {
          const isVisible = settings.homepageSectionsVisibility?.[sectionKey] !== false;
          const label = sectionLabels[sectionKey] || sectionKey;

          return (
            <div
              key={sectionKey}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                isVisible
                  ? 'bg-navy-950/80 border-navy-700 text-white'
                  : 'bg-navy-950/30 border-navy-900 text-gray-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-800 flex items-center justify-center font-mono font-bold text-xs text-cskgold-400">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase font-display">{label}</h4>
                  <span className="text-[10px] text-gray-400 font-mono">key: {sectionKey}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Visibility Toggle */}
                <button
                  onClick={() => toggleHomepageSection(sectionKey, !isVisible)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-1 transition-colors ${
                    isVisible
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900'
                      : 'bg-navy-900 text-gray-400 border border-navy-800 hover:text-white'
                  }`}
                >
                  {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isVisible ? 'VISIBLE' : 'HIDDEN'}</span>
                </button>

                {/* Move Up */}
                <button
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  className="p-2 rounded-xl bg-navy-900 border border-navy-800 text-gray-300 hover:text-cskgold-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  disabled={index === currentOrder.length - 1}
                  onClick={() => moveDown(index)}
                  className="p-2 rounded-xl bg-navy-900 border border-navy-800 text-gray-300 hover:text-cskgold-400 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

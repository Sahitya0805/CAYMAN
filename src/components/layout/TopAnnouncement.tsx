'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export const TopAnnouncement: React.FC = () => {
  const { settings } = useStore();

  if (!settings.announcementBar.enabled) return null;

  return (
    <div className="bg-gradient-to-r from-navy-950 via-navy-800 to-navy-950 border-b border-cskgold-500/30 text-white text-xs sm:text-sm py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 justify-center font-medium">
          <span className="inline-flex items-center justify-center p-1 rounded-full bg-cskgold-500/20 text-cskgold-400">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="text-gray-200 tracking-wide font-semibold">
            {settings.announcementBar.text}
          </span>
        </div>
        <Link
          href={settings.announcementBar.buttonLink}
          className="inline-flex items-center gap-1 text-cskgold-400 hover:text-cskgold-300 font-bold uppercase tracking-wider text-xs transition-colors group"
        >
          <span>{settings.announcementBar.buttonText}</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

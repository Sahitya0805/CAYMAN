'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  Users,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  Ticket,
  ShoppingBag,
  Sliders,
  Settings,
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Live Scorer Console', href: '/admin/live-scoring', icon: Radio, badge: 'LIVE' },
    { name: 'Player Squad CRUD', href: '/admin/players', icon: Users },
    { name: 'Match & Fixtures', href: '/admin/matches', icon: Calendar },
    { name: 'News & CMS', href: '/admin/news', icon: Newspaper },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'Ticket Orders & Gate', href: '/admin/tickets', icon: Ticket },
    { name: 'Store & Orders', href: '/admin/shop', icon: ShoppingBag },
    { name: 'Sponsors & Partners', href: '/admin/sponsors', icon: Sparkles },
    { name: 'Homepage Builder', href: '/admin/homepage-builder', icon: Layers },
    { name: 'Settings & Audit Log', href: '/admin/settings', icon: Settings }
  ];

  return (
    <aside className="w-full lg:w-64 bg-navy-950 border-r border-navy-800 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1 border-b border-navy-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cskgold-500 text-navy-950 flex items-center justify-center font-bold text-xl shadow-lg">
            🦁
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm uppercase font-display leading-tight">
              CSK CONTROL
            </h3>
            <span className="text-[10px] text-cskgold-400 font-bold uppercase tracking-wider">
              ADMIN CMS & SCORER
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map(l => {
            const Icon = l.icon;
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-cskgold-500 text-navy-950 shadow-md font-black'
                    : 'text-gray-300 hover:text-white hover:bg-navy-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{l.name}</span>
                </div>
                {l.badge && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black animate-pulse">
                    {l.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-navy-800 px-2 text-[10px] text-gray-500">
        <p>Cayman Super Kings Admin v1.0</p>
        <p>Logged in: Super Administrator</p>
      </div>
    </aside>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import {
  Users,
  Calendar,
  Newspaper,
  ShoppingBag,
  Ticket,
  DollarSign,
  Radio,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { players, matches, news, orders, ticketOrders, auditLogs } = useStore();

  const totalStoreSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalTicketSales = ticketOrders.reduce((sum, t) => sum + t.totalPrice, 0);
  const upcomingMatch = matches.find(m => m.status === 'UPCOMING' || m.status === 'LIVE');

  const stats = [
    { title: 'Squad Players', value: players.length, icon: Users, link: '/admin/players', color: 'text-blue-400' },
    { title: 'Matches / Fixtures', value: matches.length, icon: Calendar, link: '/admin/matches', color: 'text-amber-400' },
    { title: 'News & Reports', value: news.length, icon: Newspaper, link: '/admin/news', color: 'text-purple-400' },
    { title: 'Ticket Passes Issued', value: ticketOrders.length, icon: Ticket, link: '/admin/tickets', color: 'text-emerald-400' },
    { title: 'Store Orders', value: orders.length, icon: ShoppingBag, link: '/admin/shop', color: 'text-rose-400' },
    { title: 'Total Revenue', value: `$${(totalStoreSales + totalTicketSales).toFixed(2)}`, icon: DollarSign, link: '/admin/shop', color: 'text-cskgold-400' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            ADMINISTRATION & CMS
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            CSK COMMAND DASHBOARD
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time management portal for matches, live scoring, team squad, e-commerce, and ticketing.
          </p>
        </div>

        <Link
          href="/admin/live-scoring"
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg animate-pulse"
        >
          <Radio className="w-4 h-4" />
          <span>OPEN SCORER CONSOLE</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <Link
              key={i}
              href={st.link}
              className="p-4 rounded-2xl bg-navy-900 border border-navy-800 hover:border-cskgold-500/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${st.color}`} />
                <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-black text-white font-display block">
                  {st.value}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">
                  {st.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Active Match + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upcoming/Live Match Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-navy-900 border border-cskgold-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-cskgold-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> ACTIVE FIXTURE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-extrabold uppercase">
                {upcomingMatch?.status || 'UPCOMING'}
              </span>
            </div>

            {upcomingMatch && (
              <div className="space-y-3">
                <h4 className="text-base font-extrabold text-white uppercase font-display">
                  {upcomingMatch.title}
                </h4>
                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 text-xs flex justify-between">
                  <span>CSK vs {upcomingMatch.awayTeam.name}</span>
                  <span className="text-cskgold-400 font-bold">{upcomingMatch.date} • {upcomingMatch.time}</span>
                </div>

                <div className="pt-2 flex gap-3">
                  <Link
                    href="/admin/live-scoring"
                    className="flex-1 py-2.5 rounded-xl btn-gold text-xs font-black uppercase text-center"
                  >
                    SCORE THIS MATCH
                  </Link>
                  <Link
                    href="/admin/matches"
                    className="px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 text-gray-300 text-xs font-bold uppercase text-center hover:text-white"
                  >
                    EDIT MATCH
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recent Audit Logs */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-cskgold-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> RECENT ADMIN ACTIONS
            </h3>
            <div className="divide-y divide-navy-800 text-xs">
              {auditLogs.slice(0, 5).map(log => (
                <div key={log.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white block">{log.action}</span>
                    <span className="text-gray-400 text-[11px]">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Store Orders & Ticket Passes */}
        <div className="lg:col-span-6 space-y-6">
          {/* Store Orders */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-cskgold-400">
                RECENT STORE ORDERS
              </h3>
              <Link href="/admin/shop" className="text-xs text-gray-400 hover:text-cskgold-400">
                Manage All →
              </Link>
            </div>

            <div className="space-y-2">
              {orders.slice(0, 4).map(o => (
                <div key={o.id} className="p-3 bg-navy-950 rounded-xl border border-navy-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-white">{o.orderNumber}</span>
                    <span className="text-gray-400 block text-[11px]">{o.customerName} • {o.items.length} items</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-cskgold-400 font-display text-sm">${o.total.toFixed(2)}</span>
                    <span className="block text-[9px] font-bold text-emerald-400 uppercase">{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Orders */}
          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-cskgold-400">
                RECENT MATCH TICKETS ISSUED
              </h3>
              <Link href="/admin/tickets" className="text-xs text-gray-400 hover:text-cskgold-400">
                Gate Scanner →
              </Link>
            </div>

            <div className="space-y-2">
              {ticketOrders.slice(0, 4).map(t => (
                <div key={t.id} className="p-3 bg-navy-950 rounded-xl border border-navy-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-white">#{t.orderNumber}</span>
                    <span className="text-gray-400 block text-[11px]">{t.customerName} • {t.category} ({t.quantity} seats)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-cskgold-400 font-display text-sm">${t.totalPrice.toFixed(2)}</span>
                    <span className="block text-[9px] font-bold text-emerald-400 uppercase">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

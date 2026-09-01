'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Ticket, QrCode, CheckCircle2, ShieldAlert, Search } from 'lucide-react';

export default function AdminTicketsPage() {
  const { ticketOrders, verifyTicket } = useStore();
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; ticket?: unknown } | null>(null);

  const totalTicketsIssued = ticketOrders.reduce((acc, t) => acc + t.quantity, 0);
  const totalRevenue = ticketOrders.reduce((acc, t) => acc + t.totalPrice, 0);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const res = verifyTicket(scanInput.trim());
    setScanResult(res);
    setScanInput('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            BOX OFFICE & GATE OPERATIONS
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            TICKET ORDERS & GATE VERIFIER
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">TICKET ORDERS</span>
          <span className="text-2xl font-black text-white font-display mt-1 block">{ticketOrders.length} Orders</span>
        </div>
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">TOTAL ATTENDEES (SEATS)</span>
          <span className="text-2xl font-black text-cskgold-400 font-display mt-1 block">{totalTicketsIssued} Passes</span>
        </div>
        <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">TICKET REVENUE</span>
          <span className="text-2xl font-black text-emerald-400 font-display mt-1 block">${totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Fast Gate QR Scanner */}
      <div className="p-6 rounded-3xl bg-navy-900 border border-cskgold-500/30 space-y-4">
        <h3 className="text-sm font-extrabold text-white uppercase font-display flex items-center gap-2">
          <QrCode className="w-4 h-4 text-cskgold-400" />
          <span>FAST GATE SCANNER / VALIDATOR</span>
        </h3>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Scan QR hash or enter Order # (e.g. CSK10293)"
            value={scanInput}
            onChange={e => setScanInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white font-mono focus:border-cskgold-500 outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider"
          >
            VALIDATE & CHECK-IN
          </button>
        </form>

        {scanResult && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center gap-3 animate-in fade-in ${
              scanResult.success
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/70 border-red-500/50 text-red-300'
            }`}
          >
            {scanResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="font-bold">{scanResult.message}</span>
          </div>
        )}
      </div>

      {/* Ticket Orders Table */}
      <div className="rounded-3xl bg-navy-900 border border-navy-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-navy-800">
          <h3 className="text-xs font-black uppercase tracking-wider text-cskgold-400">
            ALL ISSUED DIGITAL PASSES
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-gray-400 uppercase font-black tracking-wider">
              <tr>
                <th className="p-4">ORDER #</th>
                <th className="p-4">ATTENDEE</th>
                <th className="p-4">FIXTURE</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">SEATS</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {ticketOrders.map(t => (
                <tr key={t.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">#{t.orderNumber}</td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{t.customerName}</span>
                    <span className="text-[10px] text-gray-400">{t.customerEmail}</span>
                  </td>
                  <td className="p-4 text-gray-300">{t.matchTitle}</td>
                  <td className="p-4 text-cskgold-400 font-semibold">{t.category}</td>
                  <td className="p-4 font-mono text-gray-300">{t.seatNumbers.join(', ')}</td>
                  <td className="p-4 font-bold text-white">${t.totalPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        t.status === 'VALID'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : t.status === 'CHECKED_IN'
                          ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                          : 'bg-red-950 text-red-400'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

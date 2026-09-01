'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { QrCode, CheckCircle2, XCircle, ShieldCheck, ArrowLeft, Ticket, Search, User } from 'lucide-react';

export default function TicketVerifyPage() {
  const { ticketOrders, verifyTicket } = useStore();
  const [inputCode, setInputCode] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string; ticket?: unknown } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = verifyTicket(inputCode.trim());
    setResult(res);
  };

  const handleQuickTest = (orderNumber: string) => {
    setInputCode(orderNumber);
    const res = verifyTicket(orderNumber);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-cskgold-400 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO TICKETING</span>
        </Link>

        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-cskgold-500/20 text-cskgold-400">
              <QrCode className="w-8 h-8" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
                GATE OPERATIONS & SECURITY
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
                TICKET SCANNER & VERIFIER
              </h1>
            </div>
          </div>
          <p className="text-xs text-gray-300 mt-3">
            Verify official digital match passes, check-in attendees, and prevent duplicate gate entries at Jimmy Powell Oval.
          </p>
        </div>

        {/* Verification Input Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Enter Order # or Scan QR Code Hash
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. CSK10293 or CSK-TICKET-CSK10293-..."
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                className="flex-1 px-4 py-3.5 bg-navy-950 border border-navy-700 rounded-2xl text-sm text-white focus:border-cskgold-500 outline-none font-mono"
              />
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl btn-gold text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>VALIDATE PASS</span>
              </button>
            </div>
          </form>

          {/* Quick test buttons */}
          <div className="pt-2 border-t border-navy-800">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              QUICK TEST WITH ACTIVE ISSUED TICKETS:
            </span>
            <div className="flex flex-wrap gap-2">
              {ticketOrders.slice(0, 4).map(t => (
                <button
                  key={t.id}
                  onClick={() => handleQuickTest(t.orderNumber)}
                  className="px-3 py-1.5 rounded-xl bg-navy-950 hover:bg-navy-800 border border-navy-800 text-xs text-gray-300 hover:text-cskgold-400 font-mono transition-colors"
                >
                  #{t.orderNumber} ({t.customerName})
                </button>
              ))}
            </div>
          </div>

          {/* Verification Result Banner */}
          {result && (
            <div
              className={`p-6 rounded-2xl border flex items-start gap-4 animate-in fade-in duration-200 ${
                result.success
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-red-950/60 border-red-500/50 text-red-300'
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-base font-extrabold font-display uppercase tracking-wide">
                  {result.success ? 'VALID PASS • ADMISSION GRANTED' : 'VERIFICATION FAILED'}
                </h4>
                <p className="text-xs leading-relaxed">{result.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

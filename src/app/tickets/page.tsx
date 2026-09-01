'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { initialTicketCategories } from '@/data/initialTickets';
import { TicketCategory, TicketOrder } from '@/types';
import { Ticket, Calendar, MapPin, Check, ShieldCheck, QrCode, ArrowRight, UserCheck, Sparkles, Download, CheckCircle2 } from 'lucide-react';

export default function TicketsPage() {
  const { matches, createTicketOrder } = useStore();
  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING' || m.status === 'LIVE');

  const [selectedMatchId, setSelectedMatchId] = useState<string>(upcomingMatches[0]?.id || 'm-upcoming-1');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>(initialTicketCategories[0]);
  const [quantity, setQuantity] = useState<number>(2);

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Generated Ticket Modal
  const [completedOrder, setCompletedOrder] = useState<TicketOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentMatch = matches.find(m => m.id === selectedMatchId) || matches[0];
  const totalPrice = selectedCategory.price * quantity;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) return;

    setIsProcessing(true);
    setTimeout(() => {
      const seatNumbers = Array.from({ length: quantity }, (_, i) => `${selectedCategory.name.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`);
      
      const newOrder = createTicketOrder({
        matchId: currentMatch.id,
        matchTitle: currentMatch.title,
        matchDate: `${currentMatch.date} ${currentMatch.time}`,
        matchVenue: currentMatch.venue,
        category: selectedCategory.name,
        quantity,
        totalPrice,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '+1 (345) 949-0000',
        seatNumbers
      });

      setIsProcessing(false);
      setCompletedOrder(newOrder);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
              OFFICIAL MATCHDAY TICKETING
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
              BUY MATCH TICKETS
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">
              Secure your seats at Jimmy Powell Oval for high-octane Daniel Morris Super League T20 clashes. Instant digital tickets with verifiable QR pass.
            </p>
          </div>

          <Link
            href="/tickets/verify"
            className="px-5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-cskgold-500 text-cskgold-400 text-xs font-black uppercase tracking-wider flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>STAFF QR VERIFIER</span>
          </Link>
        </div>

        {/* Step 1: Select Match */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-white uppercase font-display tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cskgold-500 text-navy-950 flex items-center justify-center text-xs font-black">1</span>
            <span>SELECT MATCH</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMatches.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMatchId(m.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedMatchId === m.id
                    ? 'border-cskgold-400 bg-navy-900 shadow-xl shadow-cskgold-500/10'
                    : 'border-navy-800 bg-navy-950 hover:border-navy-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">{m.tournament}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-navy-950 text-cskgold-400 font-bold uppercase">
                    From ${m.ticketPriceFrom || 10}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-white font-display uppercase">{m.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-navy-800">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cskgold-400" /> {m.date} • {m.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-500" /> {m.venue.split(',')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Select Category & Quantity */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-white uppercase font-display tracking-wide flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cskgold-500 text-navy-950 flex items-center justify-center text-xs font-black">2</span>
            <span>CHOOSE TICKET CATEGORY</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {initialTicketCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  selectedCategory.id === cat.id
                    ? 'border-cskgold-400 bg-navy-900 shadow-xl'
                    : 'border-navy-800 bg-navy-950/60 hover:border-navy-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-black text-cskgold-400 font-display">${cat.price}</span>
                    <span className="text-[10px] text-gray-400">{cat.availability} Left</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white font-display uppercase">{cat.name}</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{cat.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-800 space-y-1">
                  {cat.perks.slice(0, 2).map((perk, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-300">
                      <Check className="w-3 h-3 text-cskgold-400 shrink-0" />
                      <span className="truncate">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Customer Details & Checkout Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
            <h2 className="text-xl font-extrabold text-white uppercase font-display tracking-wide flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cskgold-500 text-navy-950 flex items-center justify-center text-xs font-black">3</span>
              <span>ATTENDEE DETAILS & INSTANT ISSUANCE</span>
            </h2>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Ebanks"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Email Address * (For Digital QR Pass)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. marcus@gmail.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (345) 949-XXXX"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Number of Tickets
                  </label>
                  <div className="flex items-center gap-3 bg-navy-950 border border-navy-700 rounded-xl p-2">
                    {[1, 2, 4, 6, 8].map(qty => (
                      <button
                        type="button"
                        key={qty}
                        onClick={() => setQuantity(qty)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-colors ${
                          quantity === qty ? 'bg-cskgold-500 text-navy-950' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl btn-gold text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
                >
                  {isProcessing ? (
                    <span>PROCESSING YOUR ORDER...</span>
                  ) : (
                    <>
                      <span>CONFIRM & GENERATE DIGITAL TICKETS (${totalPrice.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Order Summary Box */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-navy-900 border border-cskgold-500/30 space-y-4">
            <h3 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display">
              ORDER SUMMARY
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex justify-between border-b border-navy-800 pb-2">
                <span>Match:</span>
                <span className="text-white font-bold text-right truncate max-w-[180px]">{currentMatch.title}</span>
              </div>
              <div className="flex justify-between border-b border-navy-800 pb-2">
                <span>Category:</span>
                <span className="text-cskgold-400 font-bold">{selectedCategory.name}</span>
              </div>
              <div className="flex justify-between border-b border-navy-800 pb-2">
                <span>Price per Ticket:</span>
                <span className="text-white font-bold">${selectedCategory.price}</span>
              </div>
              <div className="flex justify-between border-b border-navy-800 pb-2">
                <span>Quantity:</span>
                <span className="text-white font-bold">{quantity} Tickets</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2">
                <span>Total Due:</span>
                <span className="text-cskgold-400 font-display text-xl">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 text-[11px] text-gray-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Official CSK Ticketing</span>
              </div>
              <p>Tickets are generated instantly with dynamic QR authentication.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Ticket Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in">
          <div
            className="w-full max-w-lg bg-navy-900 border-2 border-cskgold-400 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Ticket Header */}
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🦁</span>
                <div>
                  <h3 className="font-black text-white text-base uppercase font-display">
                    CAYMAN SUPER KINGS
                  </h3>
                  <span className="text-[10px] text-cskgold-400 font-bold uppercase tracking-widest">
                    OFFICIAL DIGITAL PASS
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black uppercase">
                CONFIRMED
              </span>
            </div>

            {/* Match & Seat Info */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                <span className="text-[10px] text-gray-400 uppercase block">FIXTURE</span>
                <h4 className="text-sm font-extrabold text-white font-display mt-0.5">{completedOrder.matchTitle}</h4>
                <p className="text-gray-300 text-[11px] mt-1">{completedOrder.matchDate} • {completedOrder.matchVenue}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-[10px] text-gray-400 uppercase block">CATEGORY</span>
                  <span className="text-xs font-black text-cskgold-400">{completedOrder.category}</span>
                </div>
                <div className="p-3 bg-navy-950 rounded-xl border border-navy-800">
                  <span className="text-[10px] text-gray-400 uppercase block">SEATS</span>
                  <span className="text-xs font-black text-white">{completedOrder.seatNumbers.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* QR Code Box */}
            <div className="p-6 bg-white rounded-2xl text-center flex flex-col items-center justify-center space-y-2 shadow-inner">
              {/* Authentic QR Visual */}
              <div className="w-44 h-44 bg-navy-950 p-2 rounded-xl flex items-center justify-center">
                <div className="w-full h-full border-4 border-cskgold-400 flex flex-col items-center justify-center p-3 text-center bg-navy-900 rounded-lg">
                  <QrCode className="w-16 h-16 text-cskgold-400" />
                  <span className="text-[9px] font-mono text-white font-bold mt-1 break-all">
                    #{completedOrder.orderNumber}
                  </span>
                </div>
              </div>
              <span className="text-navy-950 font-black text-xs font-mono uppercase tracking-widest">
                ORDER #{completedOrder.orderNumber}
              </span>
              <span className="text-[10px] text-gray-600">Scan at Jimmy Powell Oval Gates</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCompletedOrder(null)}
                className="flex-1 py-3 rounded-xl btn-gold text-xs font-black uppercase text-center"
              >
                DONE
              </button>
              <Link
                href="/tickets/verify"
                className="flex-1 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-cskgold-400 border border-cskgold-500/30 text-xs font-black uppercase text-center"
              >
                TEST SCANNER
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

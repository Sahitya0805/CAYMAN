'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { HospitalityPackage } from '@/types';
import { Check, GlassWater, ShieldCheck, Mail, Send, X, ArrowRight, Sparkles } from 'lucide-react';

export default function HospitalityPage() {
  const { hospitality } = useStore();
  const [selectedPackage, setSelectedPackage] = useState<HospitalityPackage | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState('4');
  const [notes, setNotes] = useState('');

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedPackage(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
            PREMIUM MATCHDAY HOSPITALITY
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
            EXPERIENCE THE KINGS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
            Elevate your cricket matchday at Jimmy Powell Oval with private air-conditioned VIP lounges, bespoke Caribbean gourmet cuisine, open bars, and player meet-and-greets.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {hospitality.map(pkg => (
            <div
              key={pkg.id}
              className="rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-cskgold-500/50 shadow-2xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="relative w-full h-64 overflow-hidden bg-navy-950">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-navy-950/90 border border-cskgold-500/40 text-cskgold-400 text-xs font-black uppercase">
                    FROM ${pkg.pricePerPerson} / GUEST
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl font-extrabold text-white font-display uppercase tracking-wide">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-navy-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-cskgold-400 block">
                      INCLUDED PRIVILEGES
                    </span>
                    {pkg.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-200">
                        <Check className="w-3.5 h-3.5 text-cskgold-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => setSelectedPackage(pkg)}
                  className="w-full py-3.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <GlassWater className="w-4 h-4" />
                  <span>ENQUIRE & BOOK PACKAGE</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enquiry Modal */}
      {selectedPackage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedPackage(null)}
        >
          <div
            className="w-full max-w-lg bg-navy-900 border border-cskgold-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <div>
                <span className="text-[10px] text-cskgold-400 font-bold uppercase block">HOSPITALITY BOOKING</span>
                <h4 className="text-base font-extrabold text-white uppercase font-display">{selectedPackage.title}</h4>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white uppercase">ENQUIRY RECEIVED!</h4>
                <p className="text-xs text-gray-300 max-w-xs mx-auto">
                  Our Hospitality Relations Director will contact you within 24 hours with package confirmation and invoice.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Estimated Guests
                  </label>
                  <select
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  >
                    <option value="2">2 Guests</option>
                    <option value="4">4-6 Guests</option>
                    <option value="10">10-15 Guests (Private Suite)</option>
                    <option value="20">20+ Guests (Full Box)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Dietary Requirements / Special Requests
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Vegetarian options, champagne selection, corporate branding..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl btn-gold text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>SUBMIT HOSPITALITY REQUEST</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

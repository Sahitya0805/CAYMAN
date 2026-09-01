'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Mail, Check, Shield, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, addNewsletterSubscriber } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    addNewsletterSubscriber(email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-navy-950 border-t border-navy-800 text-gray-300 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cskgold-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cskgold-400 via-cskgold-500 to-cskgold-600 p-[2px]">
                <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-2xl">🦁</span>
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-xl uppercase tracking-wider font-display leading-tight">
                  CAYMAN <span className="text-cskgold-400">SUPER KINGS</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                  ONE TEAM. ONE DREAM.
                </p>
              </div>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Official website of the Cayman Super Kings Cricket Club — proud contenders in the Daniel Morris Super League T20. Inspiring the next generation of Caribbean cricket stars.
            </p>

            <div className="space-y-1.5 text-xs text-gray-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cskgold-400 shrink-0" />
                <span>{settings.stadiumAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cskgold-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cskgold-400 shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Nav Column: Cricket & Team */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-widest text-cskgold-400 mb-4">
              TEAM & MATCHES
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/team" className="hover:text-cskgold-400 transition-colors">
                  Men&apos;s Squad Roster
                </Link>
              </li>
              <li>
                <Link href="/matches" className="hover:text-cskgold-400 transition-colors">
                  Upcoming Fixtures
                </Link>
              </li>
              <li>
                <Link href="/matches/live" className="hover:text-cskgold-400 transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Live Match Centre</span>
                </Link>
              </li>
              <li>
                <Link href="/matches#results" className="hover:text-cskgold-400 transition-colors">
                  Match Results & Scorecards
                </Link>
              </li>
              <li>
                <Link href="/news?category=Match%20Report" className="hover:text-cskgold-400 transition-colors">
                  Match Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column: Tickets & Experience */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-widest text-cskgold-400 mb-4">
              FAN & EXPERIENCE
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/tickets" className="hover:text-cskgold-400 transition-colors">
                  Buy Match Tickets
                </Link>
              </li>
              <li>
                <Link href="/tickets/verify" className="hover:text-cskgold-400 transition-colors">
                  Verify Digital Ticket QR
                </Link>
              </li>
              <li>
                <Link href="/hospitality" className="hover:text-cskgold-400 transition-colors">
                  VIP & Corporate Hospitality
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-cskgold-400 transition-colors">
                  Official Merchandise Store
                </Link>
              </li>
              <li>
                <Link href="/fan-zone" className="hover:text-cskgold-400 transition-colors">
                  Fan Polls & Contests
                </Link>
              </li>
              <li>
                <Link href="/media" className="hover:text-cskgold-400 transition-colors">
                  Photo & Video Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-extrabold text-white text-xs uppercase tracking-widest text-cskgold-400 mb-4">
              JOIN THE CSK FAMILY
            </h4>
            <p className="text-xs text-gray-400 mb-3">
              Get squad announcements, match tickets early access, and exclusive offers.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-600/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Welcome to the Kingdom! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-navy-900 border border-navy-700 rounded-lg text-xs text-white placeholder-gray-500 focus:border-cskgold-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg btn-gold text-xs font-black shadow-md uppercase"
                >
                  SUBSCRIBE NOW
                </button>
              </form>
            )}

            <div className="pt-4 flex items-center gap-3 text-sm">
              <a
                href={settings.instagramHandle ? `https://instagram.com/${settings.instagramHandle.replace('@', '')}` : '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-400 hover:text-cskgold-400 hover:border-cskgold-500 transition-colors"
                title="Instagram"
              >
                📷
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-400 hover:text-cskgold-400 hover:border-cskgold-500 transition-colors"
                title="YouTube"
              >
                ▶️
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-400 hover:text-cskgold-400 hover:border-cskgold-500 transition-colors"
                title="Facebook"
              >
                👥
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © 2026 Cayman Super Kings Cricket Club. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/club" className="hover:text-cskgold-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/club" className="hover:text-cskgold-400 transition-colors">
              Terms of Use
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-cskgold-400 transition-colors flex items-center gap-1">
              <Shield className="w-3 h-3 text-cskgold-400" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

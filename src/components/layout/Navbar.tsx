'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import {
  Menu,
  X,
  ShoppingBag,
  Ticket,
  ChevronDown,
  Search,
  Radio,
  User,
  ShieldAlert
} from 'lucide-react';
import { SearchModal } from '../ui/SearchModal';

export const Navbar: React.FC = () => {
  const { matches } = useStore();
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [matchesDropdown, setMatchesDropdown] = useState(false);
  const [clubDropdown, setClubDropdown] = useState(false);

  const hasLiveMatch = matches.some(m => m.status === 'LIVE');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-navy-950/95 backdrop-blur-xl border-b border-cskgold-500/20 shadow-2xl py-3'
            : 'bg-gradient-to-b from-navy-950 via-navy-950/80 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cskgold-400 via-cskgold-500 to-cskgold-600 p-0.5 shadow-lg shadow-cskgold-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-2xl">🦁</span>
                </div>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-black tracking-tight text-white uppercase font-display leading-tight">
                  CAYMAN SUPER KINGS
                </span>
                <span className="block text-[11px] font-extrabold uppercase tracking-[0.25em] text-cskgold-400 font-mono">
                  ONE TEAM • ONE DREAM
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {/* Home */}
              <Link
                href="/"
                className="text-sm font-black uppercase tracking-wider text-gray-200 hover:text-cskgold-400 transition-colors font-display"
              >
                HOME
              </Link>

              {/* Matches & Fixtures Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setMatchesDropdown(true)}
                onMouseLeave={() => setMatchesDropdown(false)}
              >
                <button className="flex items-center gap-1.5 text-sm font-black uppercase tracking-wider text-gray-200 hover:text-cskgold-400 transition-colors font-display py-2">
                  <span>MATCHES</span>
                  {hasLiveMatch && (
                    <span className="px-1.5 py-0.5 bg-red-600 text-[10px] text-white rounded font-bold uppercase animate-pulse">
                      LIVE
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>

                {matchesDropdown && (
                  <div className="absolute top-full left-0 w-60 py-2 bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/matches"
                      className="block px-4 py-2.5 text-sm font-bold text-gray-200 hover:bg-navy-800 hover:text-cskgold-400"
                    >
                      Fixtures & Schedule
                    </Link>
                    <Link
                      href="/matches/live"
                      className="block px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-navy-800 flex items-center justify-between"
                    >
                      <span>Live Match Centre</span>
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                    </Link>
                    <Link
                      href="/matches"
                      className="block px-4 py-2.5 text-sm font-bold text-gray-200 hover:bg-navy-800 hover:text-cskgold-400"
                    >
                      Recent Results & Scorecards
                    </Link>
                  </div>
                )}
              </div>

              {/* Team Squad */}
              <Link
                href="/team"
                className="text-sm font-black uppercase tracking-wider text-gray-200 hover:text-cskgold-400 transition-colors font-display"
              >
                THE SQUAD
              </Link>

              {/* Tickets */}
              <Link
                href="/tickets"
                className="text-sm font-black uppercase tracking-wider text-cskgold-400 hover:text-cskgold-300 transition-colors font-display flex items-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>TICKETS</span>
              </Link>

              {/* Hospitality */}
              <Link
                href="/hospitality"
                className="text-sm font-black uppercase tracking-wider text-gray-200 hover:text-cskgold-400 transition-colors font-display"
              >
                HOSPITALITY
              </Link>

              {/* News */}
              <Link
                href="/news"
                className="text-sm font-black uppercase tracking-wider text-gray-200 hover:text-cskgold-400 transition-colors font-display"
              >
                NEWS & RECAPS
              </Link>

              {/* Shop */}
              <Link
                href="/shop"
                className="text-sm font-black uppercase tracking-wider text-gray-200 hover:text-cskgold-400 transition-colors font-display"
              >
                STORE
              </Link>

              {/* Club Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setClubDropdown(true)}
                onMouseLeave={() => setClubDropdown(false)}
              >
                <button className="flex items-center gap-1 text-sm font-black uppercase tracking-wider text-gray-200 hover:text-cskgold-400 transition-colors font-display py-2">
                  <span>MORE</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {clubDropdown && (
                  <div className="absolute top-full right-0 w-52 py-2 bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/fan-zone"
                      className="block px-4 py-2.5 text-sm font-bold text-gray-200 hover:bg-navy-800 hover:text-cskgold-400"
                    >
                      Fan Zone & Polls
                    </Link>
                    <Link
                      href="/media"
                      className="block px-4 py-2.5 text-sm font-bold text-gray-200 hover:bg-navy-800 hover:text-cskgold-400"
                    >
                      Media & Video Vault
                    </Link>
                    <Link
                      href="/club"
                      className="block px-4 py-2.5 text-sm font-bold text-gray-200 hover:bg-navy-800 hover:text-cskgold-400"
                    >
                      About The Club
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2.5 text-sm font-bold text-gray-200 hover:bg-navy-800 hover:text-cskgold-400"
                    >
                      Contact & Enquiries
                    </Link>
                    <div className="my-1 border-t border-navy-800" />
                    <Link
                      href="/admin"
                      className="block px-4 py-2.5 text-sm font-black text-cskgold-400 hover:bg-navy-800 flex items-center justify-between"
                    >
                      <span>Admin Portal</span>
                      <ShieldAlert className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-3">
              {/* Global Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-800 text-gray-300 hover:text-cskgold-400 transition-all"
                title="Search Website"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-800 text-gray-300 hover:text-cskgold-400 transition-all"
                title="Shopping Bag"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cskgold-500 text-navy-950 font-black text-xs flex items-center justify-center shadow-lg animate-bounce font-mono">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Buy Tickets CTA Button */}
              <Link
                href="/tickets"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gold-primary text-xs sm:text-sm font-black shadow-lg"
              >
                <Ticket className="w-4 h-4" />
                <span>BUY TICKETS</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-gray-300 hover:text-white"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden px-4 pt-4 pb-6 bg-navy-950 border-b border-navy-800 space-y-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-white hover:bg-navy-900"
            >
              Home
            </Link>
            <Link
              href="/matches"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-white hover:bg-navy-900"
            >
              Fixtures & Results
            </Link>
            <Link
              href="/matches/live"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-red-400 hover:bg-navy-900"
            >
              🔴 Live Match Centre
            </Link>
            <Link
              href="/team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-white hover:bg-navy-900"
            >
              Squad & Players
            </Link>
            <Link
              href="/tickets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-cskgold-400 hover:bg-navy-900"
            >
              Buy Tickets ($10)
            </Link>
            <Link
              href="/hospitality"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-white hover:bg-navy-900"
            >
              VIP Hospitality
            </Link>
            <Link
              href="/news"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-white hover:bg-navy-900"
            >
              News & Match Reports
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-white hover:bg-navy-900"
            >
              Official Store
            </Link>
            <Link
              href="/fan-zone"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-bold text-white hover:bg-navy-900"
            >
              Fan Zone & Polls
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-black text-cskgold-400 bg-navy-900"
            >
              Admin Dashboard & Scorer
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

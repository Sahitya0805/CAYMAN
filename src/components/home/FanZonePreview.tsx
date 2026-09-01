'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Vote, CheckCircle2, Award, Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export const FanZonePreview: React.FC = () => {
  const { poll, votePoll } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!selectedOption || hasVoted) return;
    votePoll(selectedOption);
    setHasVoted(true);
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Interactive Poll Box */}
        <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 border border-cskgold-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-navy-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cskgold-500/20 text-cskgold-400">
                <Vote className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cskgold-400 block">
                  FAN ZONE POLL
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white font-display uppercase">
                  {poll.question}
                </h3>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {poll.totalVotes} Votes
            </span>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {poll.options.map(option => {
              const percentage = Math.round((option.votes / Math.max(1, poll.totalVotes)) * 100);
              const isSelected = selectedOption === option.id;

              return (
                <div
                  key={option.id}
                  onClick={() => !hasVoted && setSelectedOption(option.id)}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'border-cskgold-400 bg-cskgold-500/10'
                      : 'border-navy-800 bg-navy-950/60 hover:border-navy-700'
                  }`}
                >
                  {/* Result percentage fill */}
                  {hasVoted && (
                    <div
                      className="absolute inset-0 bg-cskgold-500/15 transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-cskgold-400 bg-cskgold-500'
                            : 'border-gray-500'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-navy-950" />}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {option.text}
                      </span>
                    </div>

                    {hasVoted && (
                      <span className="text-xs font-black text-cskgold-400 font-display">
                        {percentage}% ({option.votes})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vote Action */}
          <div className="flex items-center justify-between pt-2">
            {!hasVoted ? (
              <button
                onClick={handleVote}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                SUBMIT VOTE
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for voting! Results updated live.</span>
              </div>
            )}

            <Link
              href="/fan-zone"
              className="text-xs font-bold text-gray-400 hover:text-cskgold-400 flex items-center gap-1"
            >
              <span>Explore Fan Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Fan Club Membership Banner */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 border border-cskgold-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cskgold-500 text-navy-950 flex items-center justify-center text-2xl shadow-lg shadow-cskgold-500/30">
              🦁
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cskgold-400 block">
                MEMBERSHIP
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display leading-tight">
                JOIN THE CSK KINGDOM
              </h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                Unlock exclusive ticket presale access, digital fan pass badge, member discounts on merchandise, and VIP player meetups.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-gray-300 pt-2">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cskgold-400" />
                <span>Personalized Digital Membership Card</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cskgold-400" />
                <span>15% Store Discount on All 2026 Apparel</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cskgold-400" />
                <span>Priority Grandstand Match Tickets</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Link
              href="/fan-zone"
              className="w-full py-3 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 text-center shadow-xl"
            >
              <UserCheck className="w-4 h-4" />
              <span>CLAIM FREE FAN PASS</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

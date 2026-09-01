'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Vote, CheckCircle2, UserCheck, Sparkles, Trophy, Flame, Music, Share2 } from 'lucide-react';

export default function FanZonePage() {
  const { poll, votePoll, addNewsletterSubscriber } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Fan Pass Creator
  const [fanName, setFanName] = useState('');
  const [fanPassGenerated, setFanPassGenerated] = useState(false);
  const [passNumber, setPassNumber] = useState('CSK-FAN-8841');

  // Newsletter
  const [email, setEmail] = useState('');
  const [nlSuccess, setNlSuccess] = useState(false);

  const handleVote = () => {
    if (!selectedOption || hasVoted) return;
    votePoll(selectedOption);
    setHasVoted(true);
  };

  const handleGeneratePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fanName.trim()) return;
    setPassNumber('CSK-FAN-' + Math.floor(1000 + Math.random() * 9000));
    setFanPassGenerated(true);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addNewsletterSubscriber(email);
    setNlSuccess(true);
  };

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
            THE 12TH MAN
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
            CSK FAN ZONE & COMMUNITY
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">
            Vote in official match polls, generate your personalized CSK digital membership card, join fan chants, and enter exclusive matchday competitions.
          </p>
        </div>

        {/* Top Grid: Live Poll & Fan Pass */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Fan Poll */}
          <div id="polls" className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
            <div className="flex items-center justify-between border-b border-navy-800 pb-4">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-cskgold-400" />
                <h3 className="text-sm sm:text-base font-extrabold text-white uppercase font-display">
                  {poll.question}
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {poll.options.map(opt => {
                const percentage = Math.round((opt.votes / Math.max(1, poll.totalVotes)) * 100);
                const isSelected = selectedOption === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => !hasVoted && setSelectedOption(opt.id)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-cskgold-400 bg-cskgold-500/10'
                        : 'border-navy-800 bg-navy-950/60 hover:border-navy-700'
                    }`}
                  >
                    {hasVoted && (
                      <div
                        className="absolute inset-0 bg-cskgold-500/15 transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between text-xs sm:text-sm font-bold text-white">
                      <span>{opt.text}</span>
                      {hasVoted && (
                        <span className="text-cskgold-400 font-black font-display">
                          {percentage}% ({opt.votes})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between">
              {!hasVoted ? (
                <button
                  onClick={handleVote}
                  disabled={!selectedOption}
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider disabled:opacity-50"
                >
                  CAST VOTE
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Vote registered!</span>
                </div>
              )}
              <span className="text-xs text-gray-400">{poll.totalVotes} Total Votes</span>
            </div>
          </div>

          {/* Fan Pass Generator */}
          <div id="fan-pass" className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 border border-cskgold-500/40 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cskgold-400 block">
                MEMBERSHIP CARD
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase font-display mt-0.5">
                GENERATE YOUR DIGITAL FAN PASS
              </h3>
            </div>

            {fanPassGenerated ? (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-2 border-cskgold-400 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🦁</span>
                    <div>
                      <h4 className="text-sm font-black text-white font-display uppercase">CAYMAN SUPER KINGS</h4>
                      <span className="text-[9px] text-cskgold-400 font-bold uppercase tracking-widest">OFFICIAL FAN PASS</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-cskgold-500 text-navy-950 text-[10px] font-black uppercase">
                    GOLD MEMBER
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-gray-400 block uppercase">MEMBER NAME</span>
                    <span className="text-base font-extrabold text-white uppercase font-display">{fanName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 block uppercase">PASS NUMBER</span>
                    <span className="text-xs font-mono font-bold text-cskgold-400">{passNumber}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-navy-800 flex justify-between items-center text-[10px] text-gray-400">
                  <span>VALID THRU: 2026 SEASON</span>
                  <span>ONE TEAM. ONE DREAM.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGeneratePass} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Your Name (As will appear on Fan Card)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sahitya Singh"
                    value={fanName}
                    onChange={e => setFanName(e.target.value)}
                    className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>CLAIM MY CSK FAN PASS</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* CSK Chants & Matchday Songs */}
        <div className="p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-cskgold-400" />
            <h3 className="text-lg font-extrabold text-white uppercase font-display tracking-wide">
              CSK MATCHDAY CHANTS & ROARS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
              <span className="text-xs font-black text-cskgold-400 uppercase tracking-widest block">CHANT #1</span>
              <h4 className="text-sm font-extrabold text-white uppercase font-display">THE LION ROARS</h4>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                &ldquo;Yellow and Navy in the Grand Cayman sun,<br />
                The Super Kings have only just begun!<br />
                Sixes high and wickets flying down,<br />
                The Lions are roaring all over George Town!&rdquo;
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
              <span className="text-xs font-black text-cskgold-400 uppercase tracking-widest block">CHANT #2</span>
              <h4 className="text-sm font-extrabold text-white uppercase font-display">ONE TEAM. ONE DREAM.</h4>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                &ldquo;Who are the Kings? CSK!<br />
                Who brings the thunder every single day?<br />
                One team, one dream, together we stand,<br />
                Champions of the Cayman land!&rdquo;
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
              <span className="text-xs font-black text-cskgold-400 uppercase tracking-widest block">CHANT #3</span>
              <h4 className="text-sm font-extrabold text-white uppercase font-display">RAHUL’S ARMY</h4>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                &ldquo;Rahul at the crease, Ravneet with the pace,<br />
                No opposition can survive the chase!<br />
                C-S-K! C-S-K! ROAR!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

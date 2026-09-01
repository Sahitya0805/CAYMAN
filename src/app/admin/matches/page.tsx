'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Match, MatchStatus } from '@/types';
import { Calendar, Plus, Edit, Trash2, X, Radio, ArrowRight } from 'lucide-react';

export default function AdminMatchesPage() {
  const { matches, addMatch, updateMatch, deleteMatch } = useStore();
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [tournament, setTournament] = useState('Daniel Morris Super League T20 2026');
  const [awayTeamName, setAwayTeamName] = useState('Greenies Too');
  const [awayTeamLogo, setAwayTeamLogo] = useState('🐢');
  const [date, setDate] = useState('2026-09-20');
  const [time, setTime] = useState('7:00 PM EST');
  const [venue, setVenue] = useState('Jimmy Powell Oval, George Town');
  const [status, setStatus] = useState<MatchStatus>('UPCOMING');
  const [result, setResult] = useState('');
  const [ticketPriceFrom, setTicketPriceFrom] = useState(10);

  const startEdit = (m: Match) => {
    setEditingMatch(m);
    setTitle(m.title);
    setTournament(m.tournament);
    setAwayTeamName(m.awayTeam.name);
    setAwayTeamLogo(m.awayTeam.logo || '🏏');
    setDate(m.date);
    setTime(m.time);
    setVenue(m.venue);
    setStatus(m.status);
    setResult(m.result || '');
    setTicketPriceFrom(m.ticketPriceFrom || 10);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingMatch(null);
    setTitle('Cayman Super Kings vs George Town Strikers');
    setTournament('Daniel Morris Super League T20 2026');
    setAwayTeamName('George Town Strikers');
    setAwayTeamLogo('⚡');
    setDate('2026-10-04');
    setTime('7:00 PM EST');
    setVenue('Jimmy Powell Oval, George Town');
    setStatus('UPCOMING');
    setResult('');
    setTicketPriceFrom(10);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isCreating) {
      addMatch({
        title,
        tournament,
        homeTeam: {
          name: 'Cayman Super Kings',
          shortName: 'CSK',
          logo: '🦁'
        },
        awayTeam: {
          name: awayTeamName,
          shortName: awayTeamName.split(' ')[0].toUpperCase(),
          logo: awayTeamLogo
        },
        date,
        time,
        venue,
        status,
        result: result.trim() || undefined,
        ticketPriceFrom: Number(ticketPriceFrom)
      });
    } else if (editingMatch) {
      updateMatch(editingMatch.id, {
        title,
        tournament,
        awayTeam: {
          ...editingMatch.awayTeam,
          name: awayTeamName,
          logo: awayTeamLogo
        },
        date,
        time,
        venue,
        status,
        result: result.trim() || undefined,
        ticketPriceFrom: Number(ticketPriceFrom)
      });
    }

    setEditingMatch(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            TOURNAMENT FIXTURES
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            MATCH MANAGEMENT
          </h1>
        </div>

        <button
          onClick={startCreate}
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE FIXTURE</span>
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-navy-900 border border-navy-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-gray-400 uppercase font-black tracking-wider">
              <tr>
                <th className="p-4">MATCH</th>
                <th className="p-4">DATE / TIME</th>
                <th className="p-4">VENUE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">RESULT / SCORES</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {matches.map(m => (
                <tr key={m.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-white block">{m.title}</span>
                    <span className="text-[10px] text-gray-400">{m.tournament}</span>
                  </td>
                  <td className="p-4 text-gray-300">{m.date} • {m.time}</td>
                  <td className="p-4 text-gray-400">{m.venue.split(',')[0]}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase ${
                        m.status === 'LIVE'
                          ? 'bg-red-600 text-white animate-pulse'
                          : m.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-navy-950 text-cskgold-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300 font-bold">{m.result || (m.homeTeam.score ? `${m.homeTeam.score} vs ${m.awayTeam.score}` : '-')}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(m)}
                        className="p-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 text-cskgold-400"
                        title="Edit Match"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMatch(m.id)}
                        className="p-1.5 rounded-lg bg-navy-950 hover:bg-red-900/60 text-red-400"
                        title="Delete Match"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(isCreating || editingMatch) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => { setIsCreating(false); setEditingMatch(null); }}
        >
          <div
            className="w-full max-w-xl bg-navy-900 border border-cskgold-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-lg font-extrabold text-white uppercase font-display">
                {isCreating ? 'CREATE MATCH FIXTURE' : `EDIT MATCH`}
              </h3>
              <button
                onClick={() => { setIsCreating(false); setEditingMatch(null); }}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Match Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Away Team Name</label>
                  <input
                    type="text"
                    value={awayTeamName}
                    onChange={e => setAwayTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Away Team Icon / Logo</label>
                  <input
                    type="text"
                    value={awayTeamLogo}
                    onChange={e => setAwayTeamLogo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Match Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE (Live Scoring Active)</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Venue Location</label>
                <input
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              {status === 'COMPLETED' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Match Result Text</label>
                  <input
                    type="text"
                    placeholder="e.g. CSK WON BY 62 RUNS"
                    value={result}
                    onChange={e => setResult(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingMatch(null); }}
                  className="px-5 py-2.5 rounded-xl bg-navy-950 text-gray-400 text-xs font-bold uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-black uppercase shadow-lg"
                >
                  SAVE MATCH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Player } from '@/types';
import { Users, Plus, Edit, Trash2, X, Check, Search, Star } from 'lucide-react';

export default function AdminPlayersPage() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useStore();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState(18);
  const [role, setRole] = useState<Player['role']>('Batter');
  const [battingStyle, setBattingStyle] = useState<Player['battingStyle']>('Right-hand bat');
  const [bowlingStyle, setBowlingStyle] = useState<Player['bowlingStyle']>('Right-arm fast');
  const [nationality, setNationality] = useState('Cayman Islands');
  const [dateOfBirth, setDateOfBirth] = useState('1998-01-01');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop');
  const [matchesCount, setMatchesCount] = useState(20);
  const [runs, setRuns] = useState(500);
  const [wickets, setWickets] = useState(15);
  const [strikeRate, setStrikeRate] = useState(140.0);

  const startEdit = (player: Player) => {
    setEditingPlayer(player);
    setName(player.name);
    setJerseyNumber(player.jerseyNumber);
    setRole(player.role);
    setBattingStyle(player.battingStyle);
    setBowlingStyle(player.bowlingStyle);
    setNationality(player.nationality);
    setDateOfBirth(player.dateOfBirth);
    setBio(player.bio);
    setPhotoUrl(player.photoUrl);
    setMatchesCount(player.stats.matches);
    setRuns(player.stats.runs);
    setWickets(player.stats.wickets);
    setStrikeRate(player.stats.strikeRate);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingPlayer(null);
    setName('');
    setJerseyNumber(Math.floor(1 + Math.random() * 99));
    setRole('Batter');
    setBattingStyle('Right-hand bat');
    setBowlingStyle('Right-arm fast');
    setNationality('Cayman Islands');
    setDateOfBirth('1999-05-15');
    setBio('Dynamic player for Cayman Super Kings.');
    setPhotoUrl('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop');
    setMatchesCount(10);
    setRuns(250);
    setWickets(5);
    setStrikeRate(135.0);
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const statsData = {
      matches: Number(matchesCount),
      runs: Number(runs),
      average: Number((runs / Math.max(1, matchesCount * 0.8)).toFixed(1)),
      strikeRate: Number(strikeRate),
      fifties: Math.floor(runs / 150),
      hundreds: Math.floor(runs / 500),
      highestScore: Math.min(150, Math.floor(runs * 0.2 + 40)),
      wickets: Number(wickets),
      bowlingAverage: Number(wickets > 0 ? (runs / Math.max(1, wickets * 2)).toFixed(1) : 0),
      economy: 6.8,
      bestBowling: wickets > 0 ? `${Math.min(4, wickets)}/18` : 'N/A',
      catches: Math.floor(matchesCount * 0.6)
    };

    if (isCreating) {
      addPlayer({
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        jerseyNumber: Number(jerseyNumber),
        role,
        battingStyle,
        bowlingStyle,
        nationality,
        dateOfBirth,
        bio,
        photoUrl,
        stats: statsData,
        recentPerformances: [`45* vs Opponent`, `2 catches`]
      });
    } else if (editingPlayer) {
      updatePlayer(editingPlayer.id, {
        name,
        jerseyNumber: Number(jerseyNumber),
        role,
        battingStyle,
        bowlingStyle,
        nationality,
        dateOfBirth,
        bio,
        photoUrl,
        stats: statsData
      });
    }

    setEditingPlayer(null);
    setIsCreating(false);
  };

  const filtered = players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            SQUAD MANAGEMENT
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            PLAYER CRUD & STATS
          </h1>
        </div>

        <button
          onClick={startCreate}
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PLAYER</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-navy-900 border border-navy-800">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by player name, role, jersey number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-white focus:outline-none"
        />
      </div>

      {/* Players Table */}
      <div className="rounded-3xl bg-navy-900 border border-navy-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-gray-400 uppercase font-black tracking-wider">
              <tr>
                <th className="p-4">PLAYER</th>
                <th className="p-4">JERSEY #</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">MATCHES</th>
                <th className="p-4">RUNS</th>
                <th className="p-4">WICKETS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-navy-950 shrink-0 border border-cskgold-500/40">
                      <Image src={p.photoUrl} alt={p.name} fill className="object-cover object-top" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">{p.name}</span>
                      <span className="text-[10px] text-gray-400">{p.nationality}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-black text-cskgold-400">#{p.jerseyNumber}</td>
                  <td className="p-4 text-gray-300 font-semibold">{p.role}</td>
                  <td className="p-4 font-bold text-white">{p.stats.matches}</td>
                  <td className="p-4 font-bold text-cskgold-400">{p.stats.runs}</td>
                  <td className="p-4 font-bold text-white">{p.stats.wickets}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="p-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 text-cskgold-400"
                        title="Edit Player"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePlayer(p.id)}
                        className="p-1.5 rounded-lg bg-navy-950 hover:bg-red-900/60 text-red-400"
                        title="Delete Player"
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

      {/* Create / Edit Modal */}
      {(isCreating || editingPlayer) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => { setIsCreating(false); setEditingPlayer(null); }}
        >
          <div
            className="w-full max-w-2xl bg-navy-900 border border-cskgold-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-lg font-extrabold text-white uppercase font-display">
                {isCreating ? 'CREATE NEW PLAYER PROFILE' : `EDIT: ${editingPlayer?.name}`}
              </h3>
              <button
                onClick={() => { setIsCreating(false); setEditingPlayer(null); }}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Jersey Number</label>
                  <input
                    type="number"
                    value={jerseyNumber}
                    onChange={e => setJerseyNumber(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="Batter">Batter</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-Rounder">All-Rounder</option>
                    <option value="Wicketkeeper">Wicketkeeper</option>
                    <option value="Captain / All-Rounder">Captain / All-Rounder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Batting Style</label>
                  <select
                    value={battingStyle}
                    onChange={e => setBattingStyle(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="Right-hand bat">Right-hand bat</option>
                    <option value="Left-hand bat">Left-hand bat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Bowling Style</label>
                  <select
                    value={bowlingStyle}
                    onChange={e => setBowlingStyle(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="Right-arm medium">Right-arm medium</option>
                    <option value="Right-arm fast">Right-arm fast</option>
                    <option value="Leg break">Leg break</option>
                    <option value="Right-arm off break">Right-arm off break</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Photo Image URL</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Player Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-navy-800">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase">Matches</label>
                  <input
                    type="number"
                    value={matchesCount}
                    onChange={e => setMatchesCount(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase">Runs</label>
                  <input
                    type="number"
                    value={runs}
                    onChange={e => setRuns(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase">Wickets</label>
                  <input
                    type="number"
                    value={wickets}
                    onChange={e => setWickets(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase">Strike Rate</label>
                  <input
                    type="number"
                    value={strikeRate}
                    onChange={e => setStrikeRate(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingPlayer(null); }}
                  className="px-5 py-2.5 rounded-xl bg-navy-950 text-gray-400 text-xs font-bold uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-black uppercase shadow-lg"
                >
                  SAVE PLAYER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Sponsor } from '@/types';
import { Sparkles, Plus, Trash2, X, Globe } from 'lucide-react';

export default function AdminSponsorsPage() {
  const { sponsors, addSponsor, updateSponsor, deleteSponsor } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [tier, setTier] = useState<Sponsor['tier']>('Principal Partner');
  const [logo, setLogo] = useState('🏦 New Partner');
  const [website, setWebsite] = useState('https://caymanislands.ky');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSponsor({
      name,
      tier,
      logo,
      website,
      active: true,
      displayOrder: sponsors.length + 1
    });

    setIsCreating(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            COMMERCIAL PARTNERSHIPS
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            SPONSORS & PARTNERS CMS
          </h1>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-5 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>ADD SPONSOR</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map(sp => (
          <div key={sp.id} className="p-6 rounded-3xl bg-navy-900 border border-navy-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <span className="text-2xl font-bold">{sp.logo}</span>
                <button
                  onClick={() => deleteSponsor(sp.id)}
                  className="p-1 rounded bg-navy-950 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-extrabold text-white uppercase font-display">{sp.name}</h4>
                <span className="text-xs text-cskgold-400 font-bold block mt-1">{sp.tier}</span>
                <a
                  href={sp.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mt-2 truncate"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{sp.website}</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-navy-800">
              <span>Status: <strong className="text-emerald-400">ACTIVE</strong></span>
              <span>Order: #{sp.displayOrder}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md"
          onClick={() => setIsCreating(false)}
        >
          <div
            className="w-full max-w-md bg-navy-900 border border-cskgold-500/40 rounded-3xl p-6 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-navy-800 pb-3">
              <h3 className="text-base font-extrabold text-white uppercase font-display">ADD SPONSOR</h3>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cayman National Bank"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Partner Tier</label>
                <select
                  value={tier}
                  onChange={e => setTier(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                >
                  <option value="Principal Partner">Principal Partner</option>
                  <option value="Official Partner">Official Partner</option>
                  <option value="Associate Partner">Associate Partner</option>
                  <option value="Digital Partner">Digital Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Logo Icon / Text Badge</label>
                <input
                  type="text"
                  placeholder="🏦 Logo"
                  value={logo}
                  onChange={e => setLogo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://company.ky"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-gray-400 text-xs font-bold uppercase"
                >
                  CANCEL
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl btn-gold text-xs font-black uppercase shadow-lg">
                  SAVE SPONSOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

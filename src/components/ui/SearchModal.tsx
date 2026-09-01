'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { Search, X, User, Calendar, Newspaper, ShoppingBag, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { players, matches, news, products } = useStore();

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredPlayers = cleanQuery
    ? players.filter(p => p.name.toLowerCase().includes(cleanQuery) || p.role.toLowerCase().includes(cleanQuery))
    : [];

  const filteredMatches = cleanQuery
    ? matches.filter(m => m.title.toLowerCase().includes(cleanQuery) || m.tournament.toLowerCase().includes(cleanQuery))
    : [];

  const filteredNews = cleanQuery
    ? news.filter(n => n.title.toLowerCase().includes(cleanQuery) || n.content.toLowerCase().includes(cleanQuery))
    : [];

  const filteredProducts = cleanQuery
    ? products.filter(pr => pr.name.toLowerCase().includes(cleanQuery) || pr.category.toLowerCase().includes(cleanQuery))
    : [];

  const hasResults =
    filteredPlayers.length > 0 ||
    filteredMatches.length > 0 ||
    filteredNews.length > 0 ||
    filteredProducts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-navy-900 border border-cskgold-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-navy-800 flex items-center gap-3 bg-navy-950">
          <Search className="w-5 h-5 text-cskgold-400 shrink-0" />
          <input
            type="text"
            placeholder="Search players, matches, news, merchandise..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white placeholder-gray-400 text-sm sm:text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-white rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-gray-400 hover:text-white bg-navy-800 hover:bg-navy-700 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto space-y-6">
          {!query ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p>Type to search across the entire Cayman Super Kings official platform.</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setQuery('Rahul Garg')}
                  className="px-3 py-1 bg-navy-800 hover:bg-navy-700 rounded-full text-xs text-cskgold-400"
                >
                  Rahul Garg
                </button>
                <button
                  onClick={() => setQuery('Greenies')}
                  className="px-3 py-1 bg-navy-800 hover:bg-navy-700 rounded-full text-xs text-cskgold-400"
                >
                  Greenies Too
                </button>
                <button
                  onClick={() => setQuery('Jersey')}
                  className="px-3 py-1 bg-navy-800 hover:bg-navy-700 rounded-full text-xs text-cskgold-400"
                >
                  2026 Match Jersey
                </button>
                <button
                  onClick={() => setQuery('Tickets')}
                  className="px-3 py-1 bg-navy-800 hover:bg-navy-700 rounded-full text-xs text-cskgold-400"
                >
                  Tickets
                </button>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-sm">No matches found for &quot;{query}&quot;.</p>
            </div>
          ) : (
            <>
              {/* Players */}
              {filteredPlayers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cskgold-400 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Players ({filteredPlayers.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredPlayers.map(player => (
                      <Link
                        key={player.id}
                        href={`/players/${player.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 bg-navy-950/60 hover:bg-navy-800 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-cskgold-500/20 text-cskgold-400 flex items-center justify-center font-bold text-xs">
                            #{player.jerseyNumber}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-cskgold-400">
                              {player.name}
                            </p>
                            <p className="text-xs text-gray-400">{player.role}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cskgold-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matches */}
              {filteredMatches.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cskgold-400 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Matches ({filteredMatches.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredMatches.map(match => (
                      <Link
                        key={match.id}
                        href={match.status === 'LIVE' ? '/matches/live' : `/matches`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 bg-navy-950/60 hover:bg-navy-800 rounded-xl transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-cskgold-400">
                            {match.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {match.date} • {match.venue}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-navy-800 text-cskgold-400 font-semibold uppercase">
                          {match.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* News */}
              {filteredNews.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cskgold-400 mb-2 flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5" /> News & Reports ({filteredNews.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredNews.map(item => (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 bg-navy-950/60 hover:bg-navy-800 rounded-xl transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-cskgold-400">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-400">{item.category} • {item.date}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cskgold-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {filteredProducts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cskgold-400 mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Merchandise ({filteredProducts.length})
                  </h4>
                  <div className="space-y-1.5">
                    {filteredProducts.map(prod => (
                      <Link
                        key={prod.id}
                        href={`/shop/${prod.id}`}
                        onClick={onClose}
                        className="flex items-center justify-between p-2.5 bg-navy-950/60 hover:bg-navy-800 rounded-xl transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-cskgold-400">
                            {prod.name}
                          </p>
                          <p className="text-xs text-gray-400">{prod.category} • ${prod.price.toFixed(2)}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cskgold-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Plus, Star, ArrowRight, Check } from 'lucide-react';

export default function ShopPage() {
  const { products } = useStore();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Jerseys', 'Caps & Hats', 'Apparel', 'Accessories', 'Fan Kits'];

  const filtered = products.filter(p => (selectedCategory === 'ALL' ? true : p.category === selectedCategory));

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
              OFFICIAL TEAM STORE
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
              CSK MERCHANDISE 2026
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">
              Authentic match kits, training tops, gold embroidered caps, and supporter bundles. Free delivery across Cayman Islands on orders over $100.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-navy-950/80 border border-navy-700 p-4 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-cskgold-500/20 text-cskgold-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase block">100% AUTHENTIC</span>
              <span className="text-[10px] text-gray-400">Official Club Licensed Gear</span>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cskgold-500 text-navy-950 shadow-md'
                  : 'bg-navy-900 border border-navy-800 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(prod => (
            <div
              key={prod.id}
              className="group rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-cskgold-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
            >
              <div>
                <Link href={`/shop/${prod.id}`} className="block relative w-full h-72 overflow-hidden bg-navy-950">
                  <Image
                    src={prod.images[0]}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-navy-950/20" />
                  {prod.isBestSeller && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-cskgold-500 text-navy-950 text-[10px] font-black uppercase tracking-wider">
                      BEST SELLER
                    </div>
                  )}
                </Link>

                <div className="p-6">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    {prod.category}
                  </span>
                  <Link
                    href={`/shop/${prod.id}`}
                    className="text-base font-extrabold text-white group-hover:text-cskgold-400 font-display uppercase tracking-wide line-clamp-1 block transition-colors"
                  >
                    {prod.name}
                  </Link>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xl font-black text-cskgold-400 font-display">
                      ${prod.price.toFixed(2)}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ${prod.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-2">
                <button
                  onClick={() => addToCart(prod, prod.sizes[0] || 'Standard', 1)}
                  className="flex-1 py-3 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>
                <Link
                  href={`/shop/${prod.id}`}
                  className="px-4 py-3 rounded-xl bg-navy-950 border border-navy-700 hover:border-cskgold-500 text-gray-300 hover:text-white text-xs font-bold uppercase flex items-center justify-center"
                >
                  DETAILS
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

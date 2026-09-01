'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowRight, Star, Plus } from 'lucide-react';

export const ShopPreview: React.FC = () => {
  const { products } = useStore();
  const { addToCart } = useCart();
  const featured = products.slice(0, 4);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
            OFFICIAL MERCHANDISE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight font-display mt-1">
            WEAR THE PRIDE
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Official 2026 match jerseys, gold snapbacks, training wear, and accessories.
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 border border-navy-700 hover:border-cskgold-500 text-cskgold-400 text-xs font-black uppercase tracking-wider group transition-all"
        >
          <span>VISIT SHOP</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map(product => (
          <div
            key={product.id}
            className="group rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 hover:border-cskgold-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1.5"
          >
            <div>
              {/* Image Box */}
              <Link href={`/shop/${product.id}`} className="block relative w-full h-64 overflow-hidden bg-navy-950">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy-950/20" />

                {/* Badge */}
                {product.isBestSeller && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-cskgold-500 text-navy-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    BEST SELLER
                  </div>
                )}
              </Link>

              {/* Details */}
              <div className="p-5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  {product.category}
                </span>
                <Link
                  href={`/shop/${product.id}`}
                  className="text-sm font-extrabold text-white group-hover:text-cskgold-400 font-display uppercase tracking-wide line-clamp-1 mt-1 block transition-colors"
                >
                  {product.name}
                </Link>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-base font-black text-cskgold-400 font-display">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Add To Cart Button */}
            <div className="p-5 pt-0">
              <button
                onClick={() => addToCart(product, product.sizes[0] || 'Standard', 1)}
                className="w-full py-2.5 rounded-xl bg-navy-950 hover:bg-cskgold-500 hover:text-navy-950 border border-navy-700 hover:border-cskgold-500 text-cskgold-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

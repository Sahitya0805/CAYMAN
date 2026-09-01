'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check, ShieldCheck, Truck, ArrowLeft, Star, Plus, Minus, ArrowRight } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { products } = useStore();
  const { addToCart } = useCart();

  const product = products.find(p => p.id === id || p.slug === id);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">The requested merchandise item does not exist.</p>
        <Link href="/shop" className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-navy-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-cskgold-400 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO MERCHANDISE</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative w-full h-[450px] sm:h-[520px] rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 shadow-2xl">
              <Image
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {product.isBestSeller && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-cskgold-500 text-navy-950 text-[10px] font-black uppercase tracking-wider">
                  BEST SELLER
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIdx === i ? 'border-cskgold-400' : 'border-navy-800'
                    }`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display block mb-1">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <span className="text-3xl font-black text-cskgold-400 font-display">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-500 line-through font-semibold">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">
                  IN STOCK ({product.stockCount} Available)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-navy-800 pt-4">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase text-gray-300">Select Size</span>
                <span className="text-gray-400">Regular Caribbean Fit</span>
              </div>
              <div className="flex items-center gap-2">
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[48px] py-2.5 px-3 rounded-xl text-xs font-black uppercase transition-all ${
                      selectedSize === sz
                        ? 'bg-cskgold-500 text-navy-950 shadow-md font-bold'
                        : 'bg-navy-900 border border-navy-700 text-gray-300 hover:border-cskgold-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2 pt-2">
              <span className="block text-xs font-bold uppercase text-gray-300">Quantity</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-navy-700 bg-navy-900 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-2">
              <button
                onClick={handleAdd}
                className="w-full py-4 rounded-xl btn-gold text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? 'ADDED TO CART! ✓' : `ADD TO CART • $${(product.price * quantity).toFixed(2)}`}</span>
              </button>
            </div>

            {/* Features Checklist */}
            <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2.5 text-xs text-gray-300">
              <span className="text-[10px] font-black uppercase tracking-widest text-cskgold-400 block mb-1">
                PRODUCT SPECIFICATIONS
              </span>
              {product.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cskgold-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-400 pt-2">
              <div className="flex items-center gap-2 p-3 bg-navy-900 rounded-xl border border-navy-800">
                <Truck className="w-4 h-4 text-cskgold-400 shrink-0" />
                <span>Fast Grand Cayman Dispatch</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-navy-900 rounded-xl border border-navy-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Official Licensed Merch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

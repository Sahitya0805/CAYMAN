'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, subtotal } = useCart();

  if (!isOpen) return null;

  const shipping = subtotal > 100 ? 0 : 10;
  const grandTotal = subtotal + (cart.length > 0 ? shipping : 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-navy-900 border-l border-navy-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-navy-800 flex items-center justify-between bg-navy-950">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cskgold-400" />
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider">
              YOUR CART ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-navy-800/80 flex items-center justify-center mx-auto mb-4 text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-white font-bold text-base mb-1">Your cart is empty</h4>
              <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">
                Discover the official 2026 match jerseys, caps, hoodies, and fan accessories.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-gold text-xs"
              >
                <span>EXPLORE STORE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.size}-${idx}`}
                className="flex gap-3 p-3 bg-navy-950/60 border border-navy-800 rounded-xl"
              >
                <div className="relative w-20 h-20 bg-navy-900 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-gray-500 hover:text-red-400 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Size: <span className="text-cskgold-400 font-semibold">{item.size}</span></p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-navy-700 bg-navy-900 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-extrabold text-xs text-cskgold-400">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-navy-800 bg-navy-950 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping ({subtotal > 100 ? 'Free over $100' : 'Standard Cayman'})</span>
                <span className="text-white font-semibold">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-navy-800">
                <span>Total</span>
                <span className="text-cskgold-400 text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/shop/checkout"
              onClick={closeCart}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl btn-gold text-xs font-black shadow-lg"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official CSK Authenticity Guaranteed • Fast Island Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

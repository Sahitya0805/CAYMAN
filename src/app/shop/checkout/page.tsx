'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { ShopOrder } from '@/types';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';

export default function ShopCheckoutPage() {
  const { createShopOrder } = useStore();
  const { cart, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<ShopOrder | null>(null);

  const shippingFee = subtotal > 100 ? 0 : 10;
  const grandTotal = subtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !address || cart.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const orderItems = cart.map(i => ({
        productName: i.product.name,
        size: i.size,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.images[0]
      }));

      const newOrder = createShopOrder({
        items: orderItems,
        customerName,
        customerEmail,
        shippingAddress: address,
        subtotal,
        shippingFee,
        total: grandTotal,
        status: 'PAID'
      });

      clearCart();
      setIsSubmitting(false);
      setOrderConfirmed(newOrder);
    }, 1000);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-navy-950 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display block">
            PAYMENT SUCCESSFUL
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
            ORDER CONFIRMED #{orderConfirmed.orderNumber}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
            Thank you, {orderConfirmed.customerName}! We have dispatched order receipt to {orderConfirmed.customerEmail}. Your gear is being packed in George Town.
          </p>

          <div className="p-6 rounded-3xl bg-navy-900 border border-navy-800 text-left space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cskgold-400 border-b border-navy-800 pb-2">
              ITEMS ORDERED
            </h4>
            <div className="space-y-3">
              {orderConfirmed.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold">{item.productName} ({item.size}) x{item.quantity}</span>
                  <span className="text-cskgold-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-800 pt-3 flex justify-between font-extrabold text-sm text-white">
              <span>Total Paid:</span>
              <span className="text-cskgold-400 font-display text-base">${orderConfirmed.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Link href="/shop" className="px-6 py-3 rounded-xl btn-gold text-xs font-black uppercase">
              CONTINUE SHOPPING
            </Link>
            <Link href="/" className="px-6 py-3 rounded-xl bg-navy-800 text-gray-300 text-xs font-bold uppercase hover:text-white">
              RETURN HOME
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-500 mb-3" />
        <h2 className="text-xl font-bold text-white mb-1">Your Cart is Empty</h2>
        <p className="text-gray-400 text-xs mb-6">Add official CSK products before proceeding to checkout.</p>
        <Link href="/shop" className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold">
          GO TO STORE
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-cskgold-400 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SHOP</span>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
          SECURE STORE CHECKOUT
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Checkout Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <h3 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display">
                SHIPPING & CONTACT INFORMATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Ebanks"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="marcus@gmail.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Delivery Address (Cayman Islands / International) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Street address, District / City, Postal Code"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                />
              </div>

              {/* Payment simulation */}
              <div className="pt-4 border-t border-navy-800 space-y-3">
                <h3 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>PAYMENT METHOD</span>
                </h3>
                <div className="p-4 rounded-xl bg-navy-950 border border-cskgold-500/40 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span>💳 Credit / Debit Card (Butterfield & Island Processing)</span>
                  </div>
                  <span className="text-cskgold-400 font-bold">✓ Selected</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl btn-gold text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
                >
                  {isSubmitting ? (
                    <span>PROCESSING PAYMENT...</span>
                  ) : (
                    <>
                      <span>PAY & PLACE ORDER (${grandTotal.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Cart Items Summary */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-navy-900 border border-cskgold-500/30 space-y-4">
            <h3 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display">
              SUMMARY ({cart.reduce((a, b) => a + b.quantity, 0)} ITEMS)
            </h3>

            <div className="divide-y divide-navy-800 max-h-80 overflow-y-auto space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 pt-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-navy-950 shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <h5 className="font-bold text-white line-clamp-1">{item.product.name}</h5>
                    <p className="text-gray-400 text-[10px]">Size: {item.size} • Qty: {item.quantity}</p>
                    <span className="font-extrabold text-cskgold-400">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-navy-800 pt-3 space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cayman Shipping</span>
                <span className="text-white font-bold">${shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-navy-800">
                <span>Total</span>
                <span className="text-cskgold-400 font-display text-xl">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

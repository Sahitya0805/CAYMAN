'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Product, ShopOrder } from '@/types';
import { ShoppingBag, Plus, Edit, Trash2, X, PackageCheck } from 'lucide-react';

export default function AdminShopPage() {
  const { products, orders, updateOrderStatus, addProduct, deleteProduct } = useStore();
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'PRODUCTS'>('ORDERS');
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState(49.99);
  const [category, setCategory] = useState<Product['category']>('Jerseys');
  const [description, setDescription] = useState('');
  const [stockCount, setStockCount] = useState(50);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      price: Number(price),
      category,
      images: [image],
      description,
      features: ['Official Team Merchandise', 'High Quality Performance Fabric'],
      sizes: category === 'Caps & Hats' || category === 'Accessories' ? ['One Size'] : ['S', 'M', 'L', 'XL', 'XXL'],
      inStock: true,
      stockCount: Number(stockCount)
    });

    setIsCreatingProduct(false);
    setName('');
  };

  const totalOrderRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            E-COMMERCE & INVENTORY
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            MERCHANDISE & ORDERS
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'PRODUCTS' && (
            <button
              onClick={() => setIsCreatingProduct(true)}
              className="px-4 py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>NEW PRODUCT</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-navy-800">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`px-6 py-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'ORDERS' ? 'border-cskgold-400 text-cskgold-400 bg-navy-900/50' : 'border-transparent text-gray-400'
          }`}
        >
          CUSTOMER ORDERS ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`px-6 py-3 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'PRODUCTS' ? 'border-cskgold-400 text-cskgold-400 bg-navy-900/50' : 'border-transparent text-gray-400'
          }`}
        >
          PRODUCT CATALOG ({products.length})
        </button>
      </div>

      {/* Orders View */}
      {activeTab === 'ORDERS' && (
        <div className="rounded-3xl bg-navy-900 border border-navy-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-gray-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="p-4">ORDER #</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">ITEMS</th>
                  <th className="p-4">SHIPPING ADDRESS</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">UPDATE STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">#{o.orderNumber}</td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{o.customerName}</span>
                      <span className="text-[10px] text-gray-400">{o.customerEmail}</span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="text-[11px]">
                          {it.productName} ({it.size}) x{it.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-gray-400 max-w-xs truncate">{o.shippingAddress}</td>
                    <td className="p-4 font-bold text-cskgold-400 font-display text-sm">${o.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          o.status === 'PAID'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : o.status === 'SHIPPED'
                            ? 'bg-blue-950 text-blue-400'
                            : o.status === 'DELIVERED'
                            ? 'bg-purple-950 text-purple-400'
                            : 'bg-amber-950 text-amber-400'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                        className="px-2 py-1 bg-navy-950 border border-navy-700 rounded-lg text-xs text-white"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products View */}
      {activeTab === 'PRODUCTS' && (
        <div className="rounded-3xl bg-navy-900 border border-navy-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-gray-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="p-4">PRODUCT</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">PRICE</th>
                  <th className="p-4">STOCK</th>
                  <th className="p-4">SIZES</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-navy-950 shrink-0">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-gray-400">{p.slug}</span>
                      </div>
                    </td>
                    <td className="p-4 text-cskgold-400 font-bold">{p.category}</td>
                    <td className="p-4 font-bold text-white">${p.price.toFixed(2)}</td>
                    <td className="p-4 text-gray-300">{p.stockCount} Units</td>
                    <td className="p-4 text-gray-400">{p.sizes.join(', ')}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-navy-950 hover:bg-red-900/60 text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {isCreatingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md"
          onClick={() => setIsCreatingProduct(false)}
        >
          <div
            className="w-full max-w-lg bg-navy-900 border border-cskgold-500/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-navy-800 pb-3">
              <h3 className="text-base font-extrabold text-white uppercase font-display">CREATE STORE PRODUCT</h3>
              <button onClick={() => setIsCreatingProduct(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSK 2026 Limited Edition Gold Cap"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                  >
                    <option value="Jerseys">Jerseys</option>
                    <option value="Caps & Hats">Caps & Hats</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Fan Kits">Fan Kits</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingProduct(false)}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-gray-400 text-xs font-bold uppercase"
                >
                  CANCEL
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl btn-gold text-xs font-black uppercase shadow-lg">
                  ADD TO CATALOG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Settings, Shield, RotateCcw, Check, Bell, Clock } from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings, auditLogs, resetStoreData } = useStore();

  const [announcementText, setAnnouncementText] = useState(settings.announcementBar.text);
  const [announcementButtonText, setAnnouncementButtonText] = useState(settings.announcementBar.buttonText);
  const [announcementButtonLink, setAnnouncementButtonLink] = useState(settings.announcementBar.buttonLink);
  const [announcementEnabled, setAnnouncementEnabled] = useState(settings.announcementBar.enabled);

  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [instagramHandle, setInstagramHandle] = useState(settings.instagramHandle);
  const [stadiumAddress, setStadiumAddress] = useState(settings.stadiumAddress);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      announcementBar: {
        enabled: announcementEnabled,
        text: announcementText,
        buttonText: announcementButtonText,
        buttonLink: announcementButtonLink
      },
      contactEmail,
      contactPhone,
      instagramHandle,
      stadiumAddress
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cskgold-400 font-display">
            GLOBAL CONFIGURATION
          </span>
          <h1 className="text-3xl font-extrabold text-white uppercase font-display tracking-tight mt-0.5">
            SITE SETTINGS & AUDIT LOGS
          </h1>
        </div>

        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all mock data to the initial factory seed?')) {
              resetStoreData();
              alert('All player data, matches, products, and settings have been reset to factory seed.');
            }
          }}
          className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold uppercase flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET TO FACTORY DATA</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Top Announcement Bar */}
            <div className="space-y-4 border-b border-navy-800 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>TOP TICKER ANNOUNCEMENT BAR</span>
                </h3>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={announcementEnabled}
                    onChange={e => setAnnouncementEnabled(e.target.checked)}
                    className="w-4 h-4 accent-cskgold-500 rounded"
                  />
                  <span>Show Bar</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Banner Text</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={announcementButtonText}
                    onChange={e => setAnnouncementButtonText(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Target URL</label>
                  <input
                    type="text"
                    value={announcementButtonLink}
                    onChange={e => setAnnouncementButtonLink(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Club Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display">
                CLUB & SOCIAL METADATA
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Instagram Handle</label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={e => setInstagramHandle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Stadium Venue Address</label>
                <input
                  type="text"
                  value={stadiumAddress}
                  onChange={e => setStadiumAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl btn-gold text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>SAVE SITE CONFIGURATION</span>
              </button>

              {saved && (
                <span className="text-xs font-bold text-emerald-400">Settings Saved Successfully! ✓</span>
              )}
            </div>
          </form>
        </div>

        {/* Security Audit Log */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-cskgold-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>STAFF AUDIT LOG ({auditLogs.length})</span>
            </h3>
            <span className="text-[10px] text-gray-400">SOC2 Compliance</span>
          </div>

          <div className="divide-y divide-navy-800 text-xs max-h-[460px] overflow-y-auto space-y-2 pr-1">
            {auditLogs.map(log => (
              <div key={log.id} className="pt-2">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="font-bold text-white">{log.action}</span>
                  <span className="text-[10px] font-mono">{log.timestamp}</span>
                </div>
                <p className="text-gray-300 text-[11px] mt-0.5">{log.details}</p>
                <span className="text-[10px] text-cskgold-400 font-semibold block mt-0.5">By {log.adminUser}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

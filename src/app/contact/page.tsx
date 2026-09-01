'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { MapPin, Mail, Phone, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-navy-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-cskgold-500/30 p-8 sm:p-12 shadow-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cskgold-400 font-display">
            CONNECT WITH US
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight mt-1">
            CONTACT THE KINGS
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-xl">
            For sponsorship inquiries, matchday tickets, academy trials, or media credentials, reach out to our front office team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-navy-900 border border-navy-800 space-y-6">
            <h2 className="text-xl font-extrabold text-white uppercase font-display tracking-wide flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cskgold-400" />
              <span>SEND A MESSAGE</span>
            </h2>

            {sent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <span>Thank you! Your message has been routed to CSK Club Management. We will respond within 24 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
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
                      placeholder="your.email@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Subject / Department
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  >
                    <option value="General Enquiry">General Club Enquiry</option>
                    <option value="Match Tickets">Matchday Tickets & VIP</option>
                    <option value="Sponsorship">Corporate Sponsorship & Brand Partnerships</option>
                    <option value="Youth Academy">Player Recruitment & Trials</option>
                    <option value="Media & Press">Media Accreditation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white focus:border-cskgold-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MESSAGE</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Stadium Map Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-navy-900 border border-cskgold-500/30 space-y-4">
              <h3 className="text-sm font-extrabold text-cskgold-400 uppercase tracking-widest font-display">
                CLUB HEADQUARTERS
              </h3>
              <div className="space-y-3 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cskgold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Home Ground</span>
                    <span className="text-gray-400">{settings.stadiumAddress}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-cskgold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Email</span>
                    <span className="text-gray-400">{settings.contactEmail}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-cskgold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Telephone</span>
                    <span className="text-gray-400">{settings.contactPhone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-cskgold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Office Hours</span>
                    <span className="text-gray-400">Mon - Fri: 9:00 AM - 5:30 PM EST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

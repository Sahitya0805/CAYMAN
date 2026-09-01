'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Calendar, Clock, User, ArrowLeft, Trophy, ArrowRight, Share2, Tag } from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { news, players } = useStore();

  const article = news.find(n => n.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-gray-400 text-sm mb-6">The requested news report does not exist.</p>
        <Link href="/news" className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold">
          BACK TO NEWS
        </Link>
      </div>
    );
  }

  const related = news.filter(n => n.id !== article.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-navy-950 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-cskgold-400 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO LATEST NEWS</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cskgold-500/20 text-cskgold-400 text-xs font-black uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cskgold-400" />
              {article.date}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase font-display tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-400 pt-2">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <User className="w-3.5 h-3.5 text-cskgold-400" /> By {article.author}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden bg-navy-900 border border-navy-800 shadow-2xl">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Match Summary Box (If Match Report) */}
        {article.matchScoreSummary && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 border border-cskgold-500/40 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-cskgold-400">
                MATCH SUMMARY
              </span>
              <span className="text-xs font-extrabold text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {article.matchScoreSummary.result}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800">
                <span className="text-2xl block mb-1">🦁</span>
                <h4 className="text-xs sm:text-sm font-black text-white uppercase font-display">
                  {article.matchScoreSummary.team1}
                </h4>
                <span className="text-2xl font-black text-cskgold-400 font-display mt-1 block">
                  {article.matchScoreSummary.score1}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-navy-950/40 border border-navy-900">
                <span className="text-2xl block mb-1">🏏</span>
                <h4 className="text-xs sm:text-sm font-black text-gray-300 uppercase font-display">
                  {article.matchScoreSummary.team2}
                </h4>
                <span className="text-2xl font-black text-gray-300 font-display mt-1 block">
                  {article.matchScoreSummary.score2}
                </span>
              </div>
            </div>

            {/* Top Performers */}
            {article.topPerformers && (
              <div className="pt-2 border-t border-navy-800 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-cskgold-400 block">
                  TOP PERFORMERS OF THE MATCH
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {article.topPerformers.map((p, i) => (
                    <div key={i} className="p-3 bg-navy-950/90 rounded-2xl border border-navy-800 flex items-center gap-2.5">
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <h5 className="text-xs font-bold text-white">{p.name}</h5>
                        <p className="text-[11px] text-cskgold-400">{p.performance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content Body */}
        <div className="prose prose-invert max-w-none text-gray-200 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-extrabold text-cskgold-400 uppercase font-display pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={index} className="p-4 rounded-2xl bg-navy-900/90 border-l-4 border-cskgold-400 text-white italic my-4">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            return (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-navy-800">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-cskgold-400" /> Tags:
          </span>
          {article.tags.map((t, idx) => (
            <span key={idx} className="px-3 py-1 rounded-lg bg-navy-900 text-cskgold-400 text-xs font-bold">
              #{t}
            </span>
          ))}
        </div>

        {/* Related Articles */}
        <div className="pt-10 border-t border-navy-800 space-y-6">
          <h3 className="text-xl font-extrabold text-white uppercase font-display tracking-wide">
            MORE FROM CAYMAN SUPER KINGS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map(rel => (
              <Link
                key={rel.id}
                href={`/news/${rel.slug}`}
                className="p-5 rounded-2xl bg-navy-900 border border-navy-800 hover:border-cskgold-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-cskgold-400 font-bold uppercase">{rel.category}</span>
                  <h4 className="text-sm font-extrabold text-white font-display uppercase line-clamp-2 mt-1">
                    {rel.title}
                  </h4>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-cskgold-400 font-bold">
                  <span>READ STORY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

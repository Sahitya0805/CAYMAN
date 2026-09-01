'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { HeroSlider } from '@/components/home/HeroSlider';
import { NextMatchWidget } from '@/components/home/NextMatchWidget';
import { QuickActions } from '@/components/home/QuickActions';
import { UpcomingFixtures } from '@/components/home/UpcomingFixtures';
import { LiveMatchPreview } from '@/components/home/LiveMatchPreview';
import { RecentResults } from '@/components/home/RecentResults';
import { PlayerSpotlight } from '@/components/home/PlayerSpotlight';
import { PlayerPerformance } from '@/components/home/PlayerPerformance';
import { LatestNews } from '@/components/home/LatestNews';
import { MatchHighlights } from '@/components/home/MatchHighlights';
import { FanZonePreview } from '@/components/home/FanZonePreview';
import { ShopPreview } from '@/components/home/ShopPreview';
import { HospitalityPreview } from '@/components/home/HospitalityPreview';
import { SponsorsSection } from '@/components/home/SponsorsSection';
import { InstagramGrid } from '@/components/home/InstagramGrid';

export default function HomePage() {
  const { settings } = useStore();

  const sectionComponents: Record<string, React.ReactNode> = {
    hero: <HeroSlider key="hero" />,
    nextMatch: <NextMatchWidget key="nextMatch" />,
    quickActions: <QuickActions key="quickActions" />,
    liveMatch: <LiveMatchPreview key="liveMatch" />,
    fixtures: <UpcomingFixtures key="fixtures" />,
    results: <RecentResults key="results" />,
    players: <PlayerSpotlight key="players" />,
    performance: <PlayerPerformance key="performance" />,
    news: <LatestNews key="news" />,
    videos: <MatchHighlights key="videos" />,
    fanZone: <FanZonePreview key="fanZone" />,
    shop: <ShopPreview key="shop" />,
    hospitality: <HospitalityPreview key="hospitality" />,
    sponsors: <SponsorsSection key="sponsors" />,
    instagram: <InstagramGrid key="instagram" />
  };

  const visibleOrder = (settings.homepageSectionsOrder || Object.keys(sectionComponents)).filter(
    key => settings.homepageSectionsVisibility?.[key] !== false
  );

  return (
    <div className="flex flex-col w-full min-h-screen">
      {visibleOrder.map(key => sectionComponents[key] || null)}
    </div>
  );
}

import React from 'react';
import { Play } from 'lucide-react';
import { MeadowBackground } from './MeadowBackground';
import { LiveDashboardMockup } from './LiveDashboardMockup';
import { AnalyticsSummary } from '../types';

interface HeroLandingProps {
  analytics: AnalyticsSummary;
  onNavigateToPortal: () => void;
  onWatchDemo: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  analytics,
  onNavigateToPortal,
  onWatchDemo
}) => {
  return (
    <div className="relative pt-10 pb-20 overflow-hidden">
      {/* Meadow Hills Backdrop */}
      <MeadowBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Rating Pill Badge (exact replica) */}
        <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200/80 shadow-xs mb-8 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-1 bg-gray-950 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            <span className="text-amber-400">★</span>
            <span>4.8</span>
          </div>

          {/* 3 avatar circles */}
          <div className="flex -space-x-1.5 overflow-hidden">
            <img
              className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80"
              alt="Avatar 1"
            />
            <img
              className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80"
              alt="Avatar 2"
            />
            <img
              className="inline-block h-5 w-5 rounded-full ring-1.5 ring-white object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80"
              alt="Avatar 3"
            />
          </div>

          <span className="text-xs font-medium text-gray-700">
            Trusted by <strong className="text-gray-900 font-semibold">5,000+</strong> businesses worldwide
          </span>
        </div>

        {/* Hero Headline (Exact typography & layout from landing.jpg) */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-950 tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
          Your AI Sales{' '}
          <span className="font-serif italic font-normal tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-lime-600 via-emerald-600 to-green-700 px-1 inline-block">
            Agent
          </span>
          <br />
          That Never Sleeps
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          Automate lead generation, engagement, and follow-ups with AI-driven conversations.
          Manage customer lifecycles, plans, renewals, and payments in one unified engine.
        </p>

        {/* Watch Demo CTA Button */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <button
            onClick={onWatchDemo}
            className="inline-flex items-center gap-2.5 bg-[#4d7c0f] hover:bg-[#3f670c] active:scale-95 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-150"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-3 h-3 fill-white text-white ml-0.5" />
            </div>
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Embedded Live Dashboard Mockup Card */}
        <div className="mt-4">
          <LiveDashboardMockup
            analytics={analytics}
            onNavigateToPortal={onNavigateToPortal}
          />
        </div>
      </div>
    </div>
  );
};

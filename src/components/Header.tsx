import React from 'react';
import { ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: 'landing' | 'portal';
  onViewChange: (view: 'landing' | 'portal') => void;
  onOpenSubscribe?: (planId?: string) => void;
  onOpenSignIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenSubscribe,
  onOpenSignIn
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => onViewChange('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Exact LeadPilot icon: Dark hexagon with diamond accent */}
          <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" opacity="0.3" />
              <polygon points="12 7 17 12 12 17 7 12" fill="currentColor" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-950 font-sans">
            LeadPilot <span className="font-extrabold text-lime-700">AI</span>
          </span>
        </div>

        {/* Center Nav items + Mode Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100/70 p-1 rounded-full border border-gray-200/60 shadow-xs">
          <button
            onClick={() => onViewChange('landing')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentView === 'landing'
                ? 'bg-white text-gray-900 shadow-xs font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Features
          </button>

          <a
            href="#pricing"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onViewChange('landing');
                setTimeout(() => {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Pricing
          </a>

          <a
            href="#faq"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onViewChange('landing');
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Docs
          </a>

          <div className="h-4 w-[1px] bg-gray-300 mx-1" />

          {/* Full-Stack Hub View Switcher */}
          <button
            onClick={() => onViewChange('portal')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
              currentView === 'portal'
                ? 'bg-[#558b2f] text-white shadow-xs'
                : 'text-lime-800 hover:bg-lime-50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            SaaS Hub
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {currentView === 'landing' ? (
            <button
              onClick={() => onViewChange('portal')}
              className="text-sm font-semibold text-gray-700 hover:text-gray-950 px-3 py-1.5 transition-colors hidden sm:block"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => onViewChange('landing')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition-colors hidden sm:flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-600" />
              Landing View
            </button>
          )}

          <button
            onClick={() => {
              if (onOpenSubscribe) {
                onOpenSubscribe('pro');
              } else {
                onViewChange('portal');
              }
            }}
            className="inline-flex items-center justify-center gap-2 bg-[#558b2f] hover:bg-[#4a7a28] active:scale-[0.98] text-white text-sm font-semibold px-4.5 py-2 rounded-full shadow-sm hover:shadow transition-all duration-150"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

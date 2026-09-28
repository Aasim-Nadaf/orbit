import React, { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  LayoutGrid,
  Clock,
  Tag,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface LiveDashboardMockupProps {
  analytics: AnalyticsSummary;
  onNavigateToPortal: () => void;
}

export const LiveDashboardMockup: React.FC<LiveDashboardMockupProps> = ({
  analytics,
  onNavigateToPortal
}) => {
  const [activeTimeline, setActiveTimeline] = useState<'W' | 'M' | 'Q' | 'Y'>('M');
  const [hoveredBar, setHoveredBar] = useState<number | null>(5); // default June peak

  // Chart data based on selected timeline
  const chartData = {
    W: [
      { label: 'Mon', amount: 1120 },
      { label: 'Tue', amount: 1450 },
      { label: 'Wed', amount: 2100 },
      { label: 'Thu', amount: 1890 },
      { label: 'Fri', amount: 2840, isPeak: true },
      { label: 'Sat', amount: 980 },
      { label: 'Sun', amount: 1250 }
    ],
    M: [
      { label: 'Jan', amount: 3800 },
      { label: 'Feb', amount: 4600 },
      { label: 'Mar', amount: 5900 },
      { label: 'Apr', amount: 6200 },
      { label: 'May', amount: 7100 },
      { label: 'Jun', amount: 8524, isPeak: true },
      { label: 'Jul', amount: 7800 },
      { label: 'Aug', amount: 8100 },
      { label: 'Sep', amount: 8350 },
      { label: 'Oct', amount: 8200 },
      { label: 'Nov', amount: 8400 },
      { label: 'Dec', amount: 8500 }
    ],
    Q: [
      { label: 'Q1', amount: 24300 },
      { label: 'Q2', amount: 31824, isPeak: true },
      { label: 'Q3', amount: 38900 },
      { label: 'Q4', amount: 47800 }
    ],
    Y: [
      { label: '2023', amount: 48000 },
      { label: '2024', amount: 98500 },
      { label: '2025', amount: 142850, isPeak: true },
      { label: '2026', amount: 64200 }
    ]
  };

  const currentBars = chartData[activeTimeline];
  const maxBarValue = Math.max(...currentBars.map(b => b.amount));

  return (
    <div className="relative mx-auto max-w-5xl rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/80 overflow-hidden transition-all duration-300 hover:shadow-[0_25px_60px_-15px_rgba(40,80,20,0.25)]">
      {/* Top Banner Notice to enter full SaaS hub */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-lime-950 px-4 py-2 text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span className="font-semibold text-lime-300">LIVE PREVIEW</span>
          <span className="text-gray-300 hidden sm:inline">— Interactive Full-Stack Subscription Hub</span>
        </div>
        <button
          onClick={onNavigateToPortal}
          className="flex items-center gap-1 bg-lime-500 hover:bg-lime-400 text-gray-950 font-bold px-3 py-1 rounded-full transition-transform active:scale-95 shadow-sm"
        >
          <span>Open Full Console</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="flex">
        {/* Left Mini Sidebar Icons (exact match to landing.jpg) */}
        <div className="w-13 border-r border-gray-100 bg-gray-50/50 flex flex-col items-center py-4 gap-4 hidden sm:flex">
          {/* Logo icon */}
          <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center text-white mb-2 shadow-xs">
            <Bot className="w-4 h-4 text-lime-400" />
          </div>

          <button
            onClick={onNavigateToPortal}
            className="w-8 h-8 rounded-lg bg-gray-950 text-white flex items-center justify-center shadow-xs"
            title="Dashboard"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToPortal}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Renewals Queue"
          >
            <Clock className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToPortal}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Plans & Pricing"
          >
            <Tag className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToPortal}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Customers"
          >
            <Users className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToPortal}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Calendar & Renewals"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToPortal}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            title="Analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <div className="mt-auto">
            <button
              onClick={onNavigateToPortal}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Main Workspace */}
        <div className="flex-1 p-5 md:p-6 overflow-hidden">
          {/* Internal Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 tracking-tight text-lg">LeadPilot AI</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-lime-100 text-lime-800">
                Active v2.4
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                readOnly
                placeholder="Search anything..."
                onClick={onNavigateToPortal}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-100/80 rounded-full text-xs text-gray-700 placeholder-gray-400 border border-transparent focus:border-lime-500 focus:outline-none cursor-pointer"
              />
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div
                onClick={onNavigateToPortal}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="Mike Reynolds"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-lime-500/20"
                />
                <div className="text-left leading-tight hidden sm:block">
                  <div className="text-xs font-semibold text-gray-900">Mike Reynolds</div>
                  <div className="text-[10px] text-gray-400">Ops Manager</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onNavigateToPortal}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-1.5 h-1.5 bg-lime-600 rounded-full absolute top-1 right-1" />
                </button>
                <button
                  onClick={onNavigateToPortal}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Metric Cards Row (Exact replica of landing.jpg) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 my-5">
            {/* Total Leads */}
            <div
              onClick={onNavigateToPortal}
              className="bg-white p-3.5 rounded-xl border border-gray-100/90 shadow-xs hover:border-lime-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <Users className="w-3.5 h-3.5 text-gray-400 group-hover:text-lime-600" />
                  Total Leads
                </span>
                <span className="text-gray-300 group-hover:text-lime-600">•••</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-950 tracking-tight font-sans">
                  2,847
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +12.5%
                </span>
              </div>
              {/* Mini sparkline bars */}
              <div className="flex items-end gap-1 mt-2.5 h-4">
                {[4, 6, 8, 12, 9, 14, 11, 16].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-lime-400 rounded-xs transition-all"
                    style={{ height: `${h * 2}px` }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-gray-400 mt-1.5">vs last month</div>
            </div>

            {/* Emails Sent */}
            <div
              onClick={onNavigateToPortal}
              className="bg-white p-3.5 rounded-xl border border-gray-100/90 shadow-xs hover:border-lime-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-lime-600" />
                  Emails Sent
                </span>
                <span className="text-gray-300 group-hover:text-lime-600">•••</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-950 tracking-tight font-sans">
                  1,689
                </span>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +24%
                </span>
              </div>
              {/* Mini sparkline bars */}
              <div className="flex items-end gap-1 mt-2.5 h-4">
                {[6, 8, 5, 11, 7, 13, 10, 15].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-rose-300 rounded-xs transition-all"
                    style={{ height: `${h * 2}px` }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-gray-400 mt-1.5">vs last month</div>
            </div>

            {/* $ Revenue */}
            <div
              onClick={onNavigateToPortal}
              className="bg-white p-3.5 rounded-xl border border-gray-100/90 shadow-xs hover:border-lime-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
                <span className="flex items-center gap-1 font-medium text-gray-600">
                  <span className="font-semibold">$</span>
                  Revenue
                </span>
                <span className="text-gray-300 group-hover:text-lime-600">•••</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-950 tracking-tight font-sans">
                  $8,524
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +17.1%
                </span>
              </div>
              {/* Mini sparkline bars */}
              <div className="flex items-end gap-1 mt-2.5 h-4">
                {[5, 9, 7, 12, 11, 14, 13, 18].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-emerald-500 rounded-xs transition-all"
                    style={{ height: `${h * 2}px` }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-gray-400 mt-1.5">vs last month</div>
            </div>

            {/* Lead Sources Donut Chart Card */}
            <div
              onClick={onNavigateToPortal}
              className="bg-white p-3.5 rounded-xl border border-gray-100/90 shadow-xs hover:border-lime-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span className="font-medium text-gray-700">Lead Sources</span>
                <span className="text-gray-300">•••</span>
              </div>

              {/* Donut representation */}
              <div className="flex items-center justify-center my-1 relative">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  {/* Inbound 38% (lime-500) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="4"
                    strokeDasharray="38 62"
                    strokeDashoffset="0"
                  />
                  {/* Outbound 27% (amber-500) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    strokeDasharray="27 73"
                    strokeDashoffset="-38"
                  />
                  {/* Referral 19% (yellow-400) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="4"
                    strokeDasharray="19 81"
                    strokeDashoffset="-65"
                  />
                  {/* Social 16% (rose-500) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="4"
                    strokeDasharray="16 84"
                    strokeDashoffset="-84"
                  />
                </svg>
                {/* Donut center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-gray-900 leading-tight">18%</span>
                  <span className="text-[9px] text-gray-400">Overall</span>
                </div>
              </div>

              {/* Legend matching landing.jpg */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                  <span>Inbound</span>
                  <span className="font-semibold text-gray-700 ml-auto">38%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Outbound</span>
                  <span className="font-semibold text-gray-700 ml-auto">27%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span>Referral</span>
                  <span className="font-semibold text-gray-700 ml-auto">19%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Social</span>
                  <span className="font-semibold text-gray-700 ml-auto">16%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Overview & AI-Powered Sales Platform Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart Area (2 columns) */}
            <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Revenue Overview</h4>
                  <p className="text-[11px] text-gray-400">Monthly pipeline performance</p>
                </div>

                {/* W / M / Q / Y selector tabs */}
                <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                  {(['W', 'M', 'Q', 'Y'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTimeline(tab)}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                        activeTimeline === tab
                          ? 'bg-[#558b2f] text-white shadow-xs font-bold'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Chart with Floating Peak Tooltip */}
              <div className="relative h-44 flex items-end justify-between gap-1.5 sm:gap-3 pt-8 pb-1 px-2 border-b border-gray-100">
                {currentBars.map((bar, idx) => {
                  const barHeightPercent = Math.round((bar.amount / maxBarValue) * 85);
                  const isHovered = hoveredBar === idx;
                  const isPeak = bar.isPeak;

                  return (
                    <div
                      key={bar.label}
                      onMouseEnter={() => setHoveredBar(idx)}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    >
                      {/* Floating tooltip on peak / hover */}
                      {(isPeak || isHovered) && (
                        <div className="absolute -top-7 z-10 animate-fade-in bg-gray-950 text-white text-[11px] font-bold py-0.5 px-2 rounded shadow-md whitespace-nowrap">
                          ${bar.amount.toLocaleString()}
                          <div className="w-1.5 h-1.5 bg-gray-950 rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
                        </div>
                      )}

                      {/* Bar stick */}
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isPeak
                            ? 'bg-gradient-to-t from-emerald-600 to-lime-500 shadow-xs'
                            : isHovered
                            ? 'bg-lime-400'
                            : 'bg-gray-200 group-hover:bg-gray-300'
                        }`}
                        style={{ height: `${barHeightPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Month / Period Labels */}
              <div className="flex justify-between px-2 pt-2 text-[10px] text-gray-400 font-medium">
                {currentBars.map((bar) => (
                  <span key={bar.label} className="flex-1 text-center truncate">
                    {bar.label}
                  </span>
                ))}
              </div>
            </div>

            {/* AI-Powered Sales Platform Box (1 column) */}
            <div className="bg-gradient-to-b from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-lime-600" />
                  <span>AI-Powered Sales Platform</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Agent Active</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Leads Monitored</span>
                    <span className="font-bold text-gray-900">2,847</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Emails Generated</span>
                    <span className="font-bold text-gray-900">1,689</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Deals Tracked</span>
                    <span className="font-bold text-gray-900">89</span>
                  </div>
                </div>
              </div>

              {/* Action shortcut button */}
              <button
                onClick={onNavigateToPortal}
                className="mt-4 w-full bg-gray-950 hover:bg-gray-800 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Manage Subscriptions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

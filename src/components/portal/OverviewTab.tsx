import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { AnalyticsSummary, PaymentInvoice, Customer, Subscription } from '../../types';

interface OverviewTabProps {
  analytics: AnalyticsSummary;
  invoices: PaymentInvoice[];
  customers: Customer[];
  subscriptions: Subscription[];
  onNavigateTab: (tab: 'customers' | 'subscriptions' | 'renewals' | 'payments') => void;
  onSelectInvoice: (invoice: PaymentInvoice) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  analytics,
  invoices,
  customers,
  subscriptions,
  onNavigateTab,
  onSelectInvoice
}) => {
  const [activeTimeline, setActiveTimeline] = useState<'W' | 'M' | 'Q' | 'Y'>('M');
  const [hoveredBar, setHoveredBar] = useState<number | null>(5);

  const timelineData = {
    W: analytics.revenueTimeline.week,
    M: analytics.revenueTimeline.month,
    Q: analytics.revenueTimeline.quarter,
    Y: analytics.revenueTimeline.year,
  };

  const currentBars = timelineData[activeTimeline];
  const maxBarValue = Math.max(...currentBars.map(b => b.amount));

  // Compute status counts
  const activeSubsCount = subscriptions.filter(s => s.status === 'active').length;
  const trialingSubsCount = subscriptions.filter(s => s.status === 'trialing').length;
  const pastDueSubsCount = subscriptions.filter(s => s.status === 'past_due').length;

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics matching landing.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold text-gray-600">
              <Users className="w-3.5 h-3.5 text-lime-600" />
              Total Leads & Customers
            </span>
            <span className="text-gray-300">•••</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-gray-950 tracking-tight font-sans">
              {analytics.totalLeads.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{analytics.totalLeadsGrowth}%
            </span>
          </div>
          <div className="flex items-end gap-1 mt-3 h-5">
            {[4, 6, 8, 12, 9, 14, 11, 16, 13, 18, 15, 20].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-lime-500/80 rounded-xs"
                style={{ height: `${h * 2}px` }}
              />
            ))}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">vs last month</div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold text-gray-600">
              <CreditCard className="w-3.5 h-3.5 text-blue-600" />
              Active Subscriptions
            </span>
            <span className="text-gray-300">•••</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-gray-950 tracking-tight font-sans">
              {analytics.activeSubscriptionsCount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +{analytics.emailsSentGrowth}%
            </span>
          </div>
          <div className="flex items-end gap-1 mt-3 h-5">
            {[5, 7, 6, 10, 8, 12, 14, 11, 16, 15, 17, 19].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-rose-400/80 rounded-xs"
                style={{ height: `${h * 2}px` }}
              />
            ))}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            {activeSubsCount} active • {trialingSubsCount} trial • {pastDueSubsCount} past due
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold text-gray-600">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              MRR (Monthly Run Rate)
            </span>
            <span className="text-gray-300">•••</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-gray-950 tracking-tight font-sans">
              ${analytics.mrr.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +{analytics.totalRevenueGrowth}%
            </span>
          </div>
          <div className="flex items-end gap-1 mt-3 h-5">
            {[6, 9, 8, 13, 11, 15, 14, 17, 16, 18, 19, 22].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-emerald-500 rounded-xs"
                style={{ height: `${h * 2}px` }}
              />
            ))}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">ARR: ${(analytics.mrr * 12).toLocaleString()}</div>
        </div>

        {/* Churn Rate & Health */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="flex items-center gap-1 font-semibold text-gray-600">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-600" />
              SaaS Health & Churn
            </span>
            <span className="text-gray-300">•••</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-gray-950 tracking-tight font-sans">
              {analytics.churnRate}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Healthy
            </span>
          </div>
          <div className="mt-3 text-xs space-y-1">
            <div className="flex justify-between text-gray-500">
              <span>Avg Revenue/User (ARPU)</span>
              <span className="font-semibold text-gray-800">${analytics.arpu}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Past Due Dunning Risk</span>
              <span className="font-semibold text-amber-600">{pastDueSubsCount} customer</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 mt-2">Industry benchmark: 3.5%</div>
        </div>
      </div>

      {/* Main Charts & Donut row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview (2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-950">Revenue Overview</h3>
              <p className="text-xs text-gray-500">Monthly pipeline & subscription billing performance</p>
            </div>

            {/* W / M / Q / Y selector */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
              {(['W', 'M', 'Q', 'Y'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTimeline(tab)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    activeTimeline === tab
                      ? 'bg-[#558b2f] text-white shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="relative h-60 flex items-end justify-between gap-2 sm:gap-4 pt-12 pb-2 px-2 border-b border-gray-100">
            {currentBars.map((bar, idx) => {
              const barHeightPercent = Math.round((bar.amount / maxBarValue) * 85);
              const isHovered = hoveredBar === idx;
              const isPeak = 'isPeak' in bar ? Boolean((bar as { isPeak?: boolean }).isPeak) : false;

              return (
                <div
                  key={bar.label}
                  onMouseEnter={() => setHoveredBar(idx)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on hover / peak */}
                  {(isPeak || isHovered) && (
                    <div className="absolute -top-8 z-10 bg-gray-950 text-white text-xs font-bold py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                      ${bar.amount.toLocaleString()}
                      <div className="w-1.5 h-1.5 bg-gray-950 rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2" />
                    </div>
                  )}

                  {/* Bar */}
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

          <div className="flex justify-between px-2 pt-3 text-xs text-gray-500 font-medium">
            {currentBars.map((bar) => (
              <span key={bar.label} className="flex-1 text-center truncate">
                {bar.label}
              </span>
            ))}
          </div>
        </div>

        {/* Lead & Subscription Sources Donut Card (1 column) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-950">Lead & Sub Acquisition</h3>
              <span className="text-xs bg-lime-100 text-lime-800 font-semibold px-2 py-0.5 rounded-full">
                18% Overall
              </span>
            </div>

            {/* Circular Donut Diagram */}
            <div className="flex items-center justify-center my-4 relative">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#84cc16"
                  strokeWidth="3.8"
                  strokeDasharray="38 62"
                  strokeDashoffset="0"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.8"
                  strokeDasharray="27 73"
                  strokeDashoffset="-38"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="3.8"
                  strokeDasharray="19 81"
                  strokeDashoffset="-65"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3.8"
                  strokeDasharray="16 84"
                  strokeDashoffset="-84"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-950 font-sans">18%</span>
                <span className="text-xs text-gray-400 font-medium">Conversion</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime-500" />
                  Inbound (Direct & Organic)
                </span>
                <span className="font-bold text-gray-900">38%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Outbound Sales Sequences
                </span>
                <span className="font-bold text-gray-900">27%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  Referral & Affiliates
                </span>
                <span className="font-bold text-gray-900">19%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Social & Paid Ads
                </span>
                <span className="font-bold text-gray-900">16%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('customers')}
            className="mt-6 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            <span>View All Customers by Channel</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Invoices & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table (2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-950">Recent Billing Transactions</h3>
              <p className="text-xs text-gray-500">Live feed of subscription payments and charges</p>
            </div>
            <button
              onClick={() => onNavigateTab('payments')}
              className="text-xs font-bold text-lime-700 hover:text-lime-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 font-semibold text-gray-900">{inv.invoiceNumber}</td>
                    <td className="py-3">
                      <div className="font-medium text-gray-800">{inv.customerName}</div>
                      <div className="text-[10px] text-gray-400">{inv.customerEmail}</div>
                    </td>
                    <td className="py-3 text-gray-600 font-medium">{inv.planName}</td>
                    <td className="py-3 font-bold text-gray-900">${inv.amount.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : inv.status === 'failed'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500'
                              : inv.status === 'failed'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <span className="capitalize">{inv.status}</span>
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="text-gray-500 hover:text-gray-900 font-medium text-xs underline"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations panel (1 column) */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-gray-950 to-gray-900 text-white p-6 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-lime-400" />
              Automated Retention Engine
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              AI-driven renewals, automatic card retry logic, and retention offers prevent churn before it happens.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('subscriptions')}
                className="w-full bg-lime-500 hover:bg-lime-400 text-gray-950 text-xs font-bold py-2 rounded-xl transition-all shadow-xs"
              >
                Manage Subscriptions & Upgrades
              </button>
              <button
                onClick={() => onNavigateTab('renewals')}
                className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-xl transition-all"
              >
                Review Upcoming Renewals
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">
              Quick Shortcuts
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigateTab('customers')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-lime-600" />
                  View All Customers ({customers.length})
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
              <button
                onClick={() => onNavigateTab('renewals')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-lime-600" />
                  Renewals Queue (7/30/90 Days)
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

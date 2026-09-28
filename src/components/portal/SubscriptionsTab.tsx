import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  ArrowUpRight,
  Pause,
  Play,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { Subscription, Plan } from '../../types';

interface SubscriptionsTabProps {
  subscriptions: Subscription[];
  plans: Plan[];
  onOpenUpgradeModal: (sub: Subscription) => void;
  onOpenCancelModal: (sub: Subscription) => void;
  onPauseSubscription: (id: string, months: number) => void;
  onResumeSubscription: (id: string) => void;
  onProcessRenewal: (id: string) => void;
}

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
  subscriptions,
  plans,
  onOpenUpgradeModal,
  onOpenCancelModal,
  onPauseSubscription,
  onResumeSubscription,
  onProcessRenewal
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const filteredSubs = subscriptions.filter(sub => {
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesSearch =
      (sub.customerName && sub.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (sub.customerCompany && sub.customerCompany.toLowerCase().includes(search.toLowerCase())) ||
      (sub.planName && sub.planName.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleRenewNow = async (id: string) => {
    setRenewingId(id);
    await onProcessRenewal(id);
    setRenewingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Subscriptions Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions by customer or plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-lime-600 focus:bg-white"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          {['all', 'active', 'trialing', 'past_due', 'paused', 'canceled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-white text-gray-900 shadow-xs font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Tier & Plan</th>
                <th className="py-3.5 px-4">Billing Cycle</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Current Period End</th>
                <th className="py-3.5 px-4">Next Renewal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubs.map((sub) => {
                const isRenewing = renewingId === sub.id;
                return (
                  <tr key={sub.id} className="hover:bg-lime-50/40 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {sub.customerAvatar && (
                          <img
                            src={sub.customerAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                          />
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{sub.customerName}</div>
                          <div className="text-[11px] text-gray-400">{sub.customerCompany}</div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-gray-900">
                        <span>{sub.planName}</span>
                        {sub.discountPercent && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded">
                            -{sub.discountPercent}% Off
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Cycle */}
                    <td className="py-3.5 px-4 capitalize text-gray-600 font-medium">
                      {sub.billingCycle}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ${sub.amount.toFixed(2)}
                    </td>

                    {/* Period End */}
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                    </td>

                    {/* Next Renewal */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">
                        {new Date(sub.nextRenewalDate).toLocaleDateString()}
                      </div>
                      {sub.cancelAtPeriodEnd && (
                        <div className="text-[10px] text-rose-600 font-semibold">
                          Cancels at period end
                        </div>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          sub.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : sub.status === 'trialing'
                            ? 'bg-blue-50 text-blue-700'
                            : sub.status === 'past_due'
                            ? 'bg-amber-50 text-amber-700'
                            : sub.status === 'paused'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            sub.status === 'active'
                              ? 'bg-emerald-500'
                              : sub.status === 'trialing'
                              ? 'bg-blue-500'
                              : sub.status === 'past_due'
                              ? 'bg-amber-500'
                              : sub.status === 'paused'
                              ? 'bg-purple-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span className="capitalize">{sub.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Process Renewal button */}
                        {sub.status !== 'canceled' && (
                          <button
                            onClick={() => handleRenewNow(sub.id)}
                            disabled={isRenewing}
                            className="px-2.5 py-1 bg-lime-50 hover:bg-lime-100 text-lime-800 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            title="Process renewal immediately"
                          >
                            <RefreshCw className={`w-3 h-3 ${isRenewing ? 'animate-spin' : ''}`} />
                            <span>Renew</span>
                          </button>
                        )}

                        {/* Upgrade / Change Plan */}
                        {sub.status !== 'canceled' && (
                          <button
                            onClick={() => onOpenUpgradeModal(sub)}
                            className="px-2.5 py-1 bg-gray-950 hover:bg-gray-800 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <ArrowUpRight className="w-3 h-3" />
                            <span>Upgrade</span>
                          </button>
                        )}

                        {/* Pause or Resume */}
                        {sub.status === 'paused' ? (
                          <button
                            onClick={() => onResumeSubscription(sub.id)}
                            className="p-1.5 text-purple-700 hover:bg-purple-50 rounded-lg font-semibold"
                            title="Resume subscription"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        ) : sub.status === 'active' ? (
                          <button
                            onClick={() => onPauseSubscription(sub.id, 1)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                            title="Pause for 1 month"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        {/* Cancel button */}
                        {sub.status !== 'canceled' && (
                          <button
                            onClick={() => onOpenCancelModal(sub)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel subscription"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

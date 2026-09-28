import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  Clock,
  DollarSign,
  CreditCard,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { RenewalItem } from '../../types';

interface RenewalsTabProps {
  renewals: RenewalItem[];
  onProcessRenewal: (subscriptionId: string) => void;
  onSimulateBatch: () => void;
  isSimulating?: boolean;
}

export const RenewalsTab: React.FC<RenewalsTabProps> = ({
  renewals,
  onProcessRenewal,
  onSimulateBatch,
  isSimulating
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7d' | '30d'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredRenewals = renewals.filter(r => {
    if (filterPeriod === '7d') return r.daysRemaining <= 7;
    if (filterPeriod === '30d') return r.daysRemaining <= 30;
    return true;
  });

  const totalUpcomingMRR = filteredRenewals.reduce((sum, r) => sum + (r.billingCycle === 'annually' ? r.amount / 12 : r.amount), 0);
  const atRiskCount = filteredRenewals.filter(r => r.status === 'at_risk').length;

  const handleProcess = async (subId: string) => {
    setProcessingId(subId);
    await onProcessRenewal(subId);
    setProcessingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Renewal Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-700">Scheduled Renewals</span>
            <Calendar className="w-4 h-4 text-lime-600" />
          </div>
          <div className="text-3xl font-extrabold text-gray-950 mt-1">{filteredRenewals.length}</div>
          <div className="text-xs text-gray-400 mt-1">Pending billing queue</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-700">Renewal Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-gray-950 mt-1">${Math.round(totalUpcomingMRR).toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Expected recurring cash flow</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-gray-700">At-Risk Renewals (Dunning)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-1">{atRiskCount}</div>
          <div className="text-xs text-gray-400 mt-1">Card retry & notifications required</div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Time filters */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterPeriod('all')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterPeriod === 'all'
                ? 'bg-white text-gray-950 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All Upcoming
          </button>
          <button
            onClick={() => setFilterPeriod('7d')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterPeriod === '7d'
                ? 'bg-white text-gray-950 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Next 7 Days
          </button>
          <button
            onClick={() => setFilterPeriod('30d')}
            className={`px-3 py-1 rounded-lg transition-all ${
              filterPeriod === '30d'
                ? 'bg-white text-gray-950 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Next 30 Days
          </button>
        </div>

        {/* Batch Cron Simulator Button */}
        <button
          onClick={onSimulateBatch}
          disabled={isSimulating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#558b2f] hover:bg-[#467525] text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 disabled:opacity-50"
        >
          <PlayCircle className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>Simulate Daily Renewal Cron</span>
        </button>
      </div>

      {/* Renewals Queue Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Plan & Billing</th>
                <th className="py-3.5 px-4">Scheduled Date</th>
                <th className="py-3.5 px-4">Countdown</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRenewals.map((item) => {
                const isProcessing = processingId === item.subscriptionId;
                return (
                  <tr key={item.id} className="hover:bg-lime-50/40 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.customerAvatar && (
                          <img
                            src={item.customerAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                          />
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{item.customerName}</div>
                          <div className="text-[11px] text-gray-400">{item.company}</div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{item.planName}</div>
                      <div className="text-[11px] text-gray-400 capitalize">{item.billingCycle}</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      {new Date(item.renewalDate).toLocaleDateString()}
                    </td>

                    {/* Countdown */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.daysRemaining <= 3
                            ? 'bg-rose-50 text-rose-700'
                            : item.daysRemaining <= 7
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{item.daysRemaining === 0 ? 'Today' : `${item.daysRemaining} days`}</span>
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      ${item.amount.toFixed(2)}
                    </td>

                    {/* Card */}
                    <td className="py-3.5 px-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.paymentMethod}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'scheduled'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'scheduled' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span className="capitalize">{item.status.replace('_', ' ')}</span>
                      </span>
                    </td>

                    {/* Process Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleProcess(item.subscriptionId)}
                        disabled={isProcessing}
                        className="px-3 py-1.5 bg-[#558b2f] hover:bg-[#467525] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 ml-auto shadow-xs transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                        <span>Process Renewal</span>
                      </button>
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

import React, { useState } from 'react';
import { X, ArrowUpRight, Check, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import { Subscription, Plan, BillingCycle } from '../../types';

interface UpgradeModalProps {
  subscription: Subscription | null;
  plans: Plan[];
  onClose: () => void;
  onConfirmUpgrade: (subId: string, newPlanId: string, cycle: BillingCycle) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  subscription,
  plans,
  onClose,
  onConfirmUpgrade
}) => {
  if (!subscription) return null;

  const currentPlan = plans.find(p => p.id === subscription.planId) || plans[0];
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    subscription.planId === 'starter' ? 'pro' : subscription.planId === 'pro' ? 'enterprise' : 'pro'
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(subscription.billingCycle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetPlan = plans.find(p => p.id === selectedPlanId) || plans[1];

  // Proration calculation logic
  const now = Date.now();
  const start = new Date(subscription.currentPeriodStart).getTime();
  const end = new Date(subscription.currentPeriodEnd).getTime();
  const totalDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(1, Math.round((end - now) / (1000 * 60 * 60 * 24)));
  const ratio = Math.min(1, Math.max(0, daysRemaining / totalDays));

  const targetAmount = billingCycle === 'annually' ? targetPlan.annualPrice : targetPlan.monthlyPrice;

  // Proration amounts
  const currentCredit = Number((subscription.amount * ratio).toFixed(2));
  const newProratedCharge = Number((targetAmount * ratio).toFixed(2));
  const netDueToday = Math.max(0, Number((newProratedCharge - currentCredit).toFixed(2)));

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirmUpgrade(subscription.id, selectedPlanId, billingCycle);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-lime-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-lime-600" />
              <span>Subscription Tier Management</span>
            </div>
            <h3 className="text-xl font-extrabold text-gray-950">
              Upgrade or Change Plan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Plan Overview */}
        <div className="my-5 p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Current Plan for {subscription.customerName}</div>
            <div className="text-base font-bold text-gray-900 mt-0.5">
              {currentPlan.name} (${subscription.amount} / {subscription.billingCycle})
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-500">Renews on</div>
            <div className="text-xs font-bold text-gray-800">
              {new Date(subscription.nextRenewalDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Select Target Plan */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
            Select New Plan
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {plans.map((p) => {
              const isSelected = p.id === selectedPlanId;
              const isCurrent = p.id === subscription.planId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#558b2f] bg-lime-50/40 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">{p.name}</span>
                    {isCurrent && (
                      <span className="text-[9px] bg-gray-200 text-gray-700 font-bold px-1.5 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-extrabold text-gray-950 font-sans">
                    ${billingCycle === 'annually' ? p.annualMonthlyEquivalent : p.monthlyPrice}
                    <span className="text-xs font-normal text-gray-400">/mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing Cycle Switch */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 mb-6">
          <span className="text-xs font-semibold text-gray-700">Billing Frequency</span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 text-xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded font-semibold ${
                billingCycle === 'monthly' ? 'bg-gray-950 text-white' : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annually')}
              className={`px-3 py-1 rounded font-semibold ${
                billingCycle === 'annually' ? 'bg-gray-950 text-white' : 'text-gray-600'
              }`}
            >
              Annually (-20%)
            </button>
          </div>
        </div>

        {/* Proration Breakdown Card */}
        <div className="p-4 rounded-2xl border border-lime-200 bg-lime-50/50 space-y-2.5 mb-6 text-xs">
          <div className="font-bold text-gray-900 flex items-center justify-between pb-1 border-b border-lime-200">
            <span>Proration & Adjustment Summary</span>
            <span className="text-lime-800 font-semibold">{daysRemaining} days remaining in cycle</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Credit for unused time on {currentPlan.name}:</span>
            <span className="font-semibold text-emerald-700">-${currentCredit.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Prorated charge for {targetPlan.name}:</span>
            <span className="font-semibold text-gray-900">+${newProratedCharge.toFixed(2)}</span>
          </div>

          <div className="flex justify-between pt-2 border-t border-lime-200 text-sm font-extrabold text-gray-950">
            <span>Net Amount Due Today:</span>
            <span className="text-base text-gray-950 font-sans">${netDueToday.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold bg-[#558b2f] hover:bg-[#477727] text-white shadow-md hover:shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Processing...' : `Confirm & Charge $${netDueToday.toFixed(2)}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

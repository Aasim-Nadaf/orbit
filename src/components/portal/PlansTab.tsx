import React, { useState } from 'react';
import { Plus, Check, Sparkles, Tag, Layers, Edit2, Shield } from 'lucide-react';
import { Plan, BillingCycle } from '../../types';

interface PlansTabProps {
  plans: Plan[];
  onCreatePlan: (plan: Partial<Plan>) => void;
}

export const PlansTab: React.FC<PlansTabProps> = ({ plans, onCreatePlan }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanMonthlyPrice, setNewPlanMonthlyPrice] = useState(199);
  const [newPlanTagline, setNewPlanTagline] = useState('');
  const [newPlanFeatures, setNewPlanFeatures] = useState('Unlimited seats\nDedicated IP\nCustom AI workflows\n24/7 Phone SLA');

  const handleCreateNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName) return;

    onCreatePlan({
      name: newPlanName,
      tagline: newPlanTagline || 'Custom tier tailored for high scale teams',
      monthlyPrice: Number(newPlanMonthlyPrice),
      annualPrice: Number(newPlanMonthlyPrice) * 10,
      annualMonthlyEquivalent: Math.round((Number(newPlanMonthlyPrice) * 10) / 12),
      leadsPerMonth: 50000,
      features: newPlanFeatures.split('\n').filter(Boolean),
      ctaText: 'Get Started'
    });

    setShowNewPlanModal(false);
    setNewPlanName('');
    setNewPlanTagline('');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-950">Plans & Tier Architecture</h2>
          <p className="text-xs text-gray-500">Configure pricing models, feature matrices, and packaging</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Billing Cycle Switch */}
          <div className="inline-flex items-center gap-2 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-950 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-3 py-1 rounded-lg transition-all ${
                billingCycle === 'annually'
                  ? 'bg-white text-gray-950 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Annually (-20%)
            </button>
          </div>

          <button
            onClick={() => setShowNewPlanModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#558b2f] hover:bg-[#467525] text-white rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Plan Tier</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isPro = plan.id === 'pro';
          const isEnterprise = plan.id === 'enterprise';

          const price = isEnterprise
            ? 'Custom'
            : billingCycle === 'annually'
            ? `$${plan.annualMonthlyEquivalent}`
            : `$${plan.monthlyPrice}`;

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border ${
                isPro ? 'border-amber-300 shadow-md ring-1 ring-amber-300/40' : 'border-gray-200 shadow-xs'
              } p-6 flex flex-col justify-between relative overflow-hidden`}
            >
              {isPro && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-orange-400 text-gray-950 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-950">{plan.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-extrabold text-gray-950 tracking-tight font-sans">
                    {price}
                  </span>
                  {!isEnterprise && <span className="text-xs text-gray-400 font-medium">/month</span>}
                </div>

                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  {plan.tagline}
                </p>

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Features Included
                  </div>
                  <ul className="space-y-2.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Active Subscribers:</span>
                <span className="font-bold text-gray-900">{plan.activeSubscribersCount || 0}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Plan Tier Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-950 mb-1">Create New Plan Tier</h3>
            <p className="text-xs text-gray-500 mb-4">Add a new pricing tier to the subscription management engine</p>

            <form onSubmit={handleCreateNewPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Growth, Scale, Agency"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Monthly Price ($ USD)</label>
                <input
                  type="number"
                  required
                  min="5"
                  value={newPlanMonthlyPrice}
                  onChange={(e) => setNewPlanMonthlyPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="Short description for target audience"
                  value={newPlanTagline}
                  onChange={(e) => setNewPlanTagline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Features (One per line)</label>
                <textarea
                  rows={4}
                  value={newPlanFeatures}
                  onChange={(e) => setNewPlanFeatures(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#558b2f] hover:bg-[#467525] text-white rounded-xl shadow-xs"
                >
                  Create Plan Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

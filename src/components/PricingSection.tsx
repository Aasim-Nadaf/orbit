import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Plan, BillingCycle } from '../types';

interface PricingSectionProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan, cycle: BillingCycle) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  plans,
  onSelectPlan
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <section id="pricing" className="py-24 bg-gray-50/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* Monthly / Annually Switch */}
          <div className="inline-flex items-center gap-3 bg-white p-1 rounded-full border border-gray-200 shadow-xs mb-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>

            {/* Toggle switch visual */}
            <div
              onClick={() => setBillingCycle(b => b === 'monthly' ? 'annually' : 'monthly')}
              className="w-10 h-5 bg-gray-200 rounded-full p-0.5 cursor-pointer flex items-center transition-colors"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  billingCycle === 'annually' ? 'translate-x-5 bg-lime-600' : 'translate-x-0'
                }`}
              />
            </div>

            <button
              onClick={() => setBillingCycle('annually')}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
                billingCycle === 'annually'
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Annually</span>
              <span className="text-[10px] bg-lime-100 text-lime-800 font-bold px-1.5 py-0.2 rounded-full">
                Save 20%
              </span>
            </button>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight mb-4">
            Simple transparent pricing
          </h2>
          <p className="text-gray-500 text-base">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Pricing Cards Grid (Exact replica of landing.jpg) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => {
            const isPro = plan.id === 'pro';
            const isEnterprise = plan.id === 'enterprise';

            // Prices
            const displayPrice = isEnterprise
              ? 'Custom'
              : billingCycle === 'annually'
              ? `$${plan.annualMonthlyEquivalent}`
              : `$${plan.monthlyPrice}`;

            const periodLabel = isEnterprise ? '' : '/month';

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl bg-white transition-all duration-300 ${
                  isPro
                    ? 'border-2 border-amber-300 shadow-xl scale-[1.03] z-10'
                    : 'border border-gray-200 shadow-sm hover:shadow-md'
                } overflow-hidden`}
              >
                {/* Pro+ Glowing Warm Sunset Peach Gradient Top Header */}
                {isPro && (
                  <div className="h-32 bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300 relative overflow-hidden flex items-center justify-between px-6">
                    {/* Glowing blur effects */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/40 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/30 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10">
                      <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-amber-900 font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Most Popular
                      </span>
                    </div>

                    <div className="text-right relative z-10">
                      <span className="text-xs font-semibold text-gray-800 bg-white/50 backdrop-blur-xs px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Content Body */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-950 tracking-tight mb-2">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight font-sans">
                        {displayPrice}
                      </span>
                      {periodLabel && (
                        <span className="text-sm text-gray-500 font-medium">
                          {periodLabel}
                        </span>
                      )}
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-gray-500 leading-relaxed min-h-[36px] mb-6">
                      {plan.tagline}
                    </p>

                    {/* CTA Button (Black rounded pill) */}
                    <button
                      onClick={() => onSelectPlan(plan, billingCycle)}
                      className={`w-full py-3 px-4 rounded-full text-xs font-bold transition-all shadow-xs ${
                        isPro
                          ? 'bg-gray-950 hover:bg-gray-800 text-white shadow-md'
                          : 'bg-gray-950 hover:bg-gray-800 text-white'
                      }`}
                    >
                      {plan.ctaText}
                    </button>

                    {/* Feature separator */}
                    <div className="my-8">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                        Stand-out features
                      </div>

                      {/* Feature checkmark list */}
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                            <div className="w-4 h-4 rounded-full bg-gray-950 text-white flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sub-note */}
                  {billingCycle === 'annually' && !isEnterprise && (
                    <div className="text-[11px] text-lime-700 font-semibold pt-4 border-t border-gray-100 text-center">
                      Billed annually ($
                      {plan.annualPrice}/yr)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

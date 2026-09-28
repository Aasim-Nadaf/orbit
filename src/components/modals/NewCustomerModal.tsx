import React, { useState } from 'react';
import { X, UserPlus, CreditCard, Sparkles, Building, Mail, Phone, Globe } from 'lucide-react';
import { Plan, BillingCycle } from '../../types';

interface NewCustomerModalProps {
  plans: Plan[];
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    company: string;
    planId: string;
    billingCycle: BillingCycle;
    leadSource: 'Inbound' | 'Outbound' | 'Referral' | 'Social';
    phone: string;
    country: string;
  }) => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  plans,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [planId, setPlanId] = useState(plans[1]?.id || plans[0]?.id || 'pro');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [leadSource, setLeadSource] = useState<'Inbound' | 'Outbound' | 'Referral' | 'Social'>('Inbound');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [country, setCountry] = useState('United States');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPlan = plans.find(p => p.id === planId) || plans[0];
  const amount = billingCycle === 'annually' ? selectedPlan.annualPrice : selectedPlan.monthlyPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    onSubmit({
      name,
      email,
      company: company || 'Acme Inc.',
      planId,
      billingCycle,
      leadSource,
      phone,
      country
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-lime-700 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-lime-600" />
              <span>Customer Onboarding</span>
            </div>
            <h3 className="text-xl font-extrabold text-gray-950">
              Add New Customer & Provision Subscription
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jessica Taylor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                placeholder="jessica@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600"
              />
            </div>
          </div>

          {/* Company & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Company</label>
              <input
                type="text"
                placeholder="e.g. CloudScale Systems"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600"
              />
            </div>
          </div>

          {/* Plan Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subscription Plan</label>
            <div className="grid grid-cols-3 gap-2">
              {plans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setPlanId(p.id)}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    planId === p.id
                      ? 'border-[#558b2f] bg-lime-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-xs text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-500 font-sans mt-0.5">
                    ${billingCycle === 'annually' ? p.annualMonthlyEquivalent : p.monthlyPrice}/mo
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cycle & Lead Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Billing Frequency</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600 bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="annually">Annually (20% Off)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Acquisition Channel</label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-lime-600 bg-white"
              >
                <option value="Inbound">Inbound (38%)</option>
                <option value="Outbound">Outbound (27%)</option>
                <option value="Referral">Referral (19%)</option>
                <option value="Social">Social / Ads (16%)</option>
              </select>
            </div>
          </div>

          {/* Initial Billing Summary */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-gray-500">Initial Invoice Total:</span>
              <div className="font-bold text-gray-900 text-sm">${amount.toFixed(2)}</div>
            </div>
            <div className="text-right text-[11px] text-gray-400">
              Auto-renews every {billingCycle === 'annually' ? 'year' : 'month'}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-bold bg-[#558b2f] hover:bg-[#467525] text-white rounded-full transition-transform active:scale-95 shadow-md"
            >
              {isSubmitting ? 'Provisioning...' : 'Provision Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ChevronDown, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does LeadPilot AI qualify leads?',
      a: 'LeadPilot AI analyzes prospective leads using dynamic intent signals, multi-channel response tracking, and qualification scoring formulas. It categorizes inquiries instantly, answers technical questions, and schedules calendar meetings automatically.'
    },
    {
      q: 'Which CRMs does LeadPilot integrate with?',
      a: 'We offer native 1-click integrations with HubSpot, Salesforce, Pipedrive, Close, Zoho, and customizable webhook support for internal databases and proprietary sales workflows.'
    },
    {
      q: 'Can LeadPilot handle multiple languages?',
      a: 'Yes, LeadPilot AI supports over 32 languages out of the box with localized idiom matching, tone preservation, and automatic time-zone synchronization.'
    },
    {
      q: 'How do subscription renewals and prorated upgrades work?',
      a: 'When upgrading between Starter, Pro+, or Enterprise tiers, unused days on your previous billing cycle are credited automatically to your invoice. Renewals process automatically on your cycle date with full receipts and email notifications.'
    },
    {
      q: 'Can I cancel or pause my subscription at any time?',
      a: 'Yes. You can cancel immediately or at the end of your billing cycle from the subscription management hub. You can also pause your subscription for 1 to 3 months without losing any lead sequences or customer records.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-gray-950 text-white relative overflow-hidden">
      {/* Soft dark ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-[10px] font-semibold tracking-wider text-lime-400 uppercase mb-3">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Common Question
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Visual Cards (exact match to landing.jpg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 hover:border-lime-500/40 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-lime-500 to-emerald-700 flex items-center justify-center text-white shrink-0 shadow-sm font-extrabold text-xs text-center px-1">
                GET LEADS
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Autonomous Lead Generation</h4>
                <p className="text-xs text-gray-400">Prospect qualification across verified databases</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 hover:border-lime-500/40 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">3 Essential CRM Pipelines</h4>
                <p className="text-xs text-gray-400">Real-time sync with HubSpot, Salesforce & custom APIs</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-4 hover:border-lime-500/40 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Enterprise Security & Dunning</h4>
                <p className="text-xs text-gray-400">Automated retry logic, proration and SLA safeguards</p>
              </div>
            </div>
          </div>

          {/* Right Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-lime-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

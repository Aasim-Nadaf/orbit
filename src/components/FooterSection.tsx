import React from 'react';

interface FooterSectionProps {
  onStartTrial: () => void;
  onScheduleDemo: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onStartTrial,
  onScheduleDemo
}) => {
  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">
      {/* CTA Box with lower green ambient glow (exact match to landing.jpg) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="relative rounded-3xl bg-[#090d07] border border-white/10 p-10 md:p-16 text-center overflow-hidden">
          {/* Lower green horizon glow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-lime-500/25 via-emerald-600/15 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-lime-500/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to put your sales on autopilot
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Join 5,000+ teams already closing more deals with LeadPilot AI.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onStartTrial}
                className="bg-gray-950 hover:bg-gray-900 border border-white/20 text-white font-semibold text-xs px-6 py-3 rounded-full transition-transform active:scale-95 shadow-sm"
              >
                Start Free Trial
              </button>
              <button
                onClick={onScheduleDemo}
                className="bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs px-6 py-3 rounded-full transition-transform active:scale-95 shadow-sm"
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Logo & Description */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-gray-950">
                <span className="font-bold text-xs">▲</span>
              </div>
              <span className="text-base font-bold text-white tracking-tight">LeadPilot AI</span>
            </div>
            <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
              The AI sales agent that never sleeps. Automate your pipeline and close more deals effortlessly.
            </p>
            <div className="flex items-center gap-3 pt-2 text-gray-400">
              <span className="hover:text-white cursor-pointer">𝕏</span>
              <span className="hover:text-white cursor-pointer">LinkedIn</span>
              <span className="hover:text-white cursor-pointer">GitHub</span>
              <span className="hover:text-white cursor-pointer">Discord</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-2.5">
            <div className="font-semibold text-white">Product</div>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer">Features</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Changelog</li>
              <li className="hover:text-white cursor-pointer">Roadmap</li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-2.5">
            <div className="font-semibold text-white">Resources</div>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer">Documentation</li>
              <li className="hover:text-white cursor-pointer">API Reference</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Status</li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-2.5">
            <div className="font-semibold text-white">Company</div>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Press</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <div>© {new Date().getFullYear()} LeadPilot AI. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms</span>
            <span className="hover:text-gray-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

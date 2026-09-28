import React, { useState } from 'react';
import { X, Play, CheckCircle2, Sparkles, Bot, Layers, ArrowRight } from 'lucide-react';

interface DemoVideoModalProps {
  onClose: () => void;
  onExplorePortal: () => void;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ onClose, onExplorePortal }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-950 text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-white/10 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Product Tour</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            How LeadPilot AI Powers Autonomous Sales & Subscription Billing
          </h3>
        </div>

        {/* Video / Visual Simulation Canvas */}
        <div className="relative rounded-2xl bg-[#0e160a] border border-lime-500/30 overflow-hidden p-6 aspect-video flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent pointer-events-none" />

          {/* Simulated live agent stream */}
          <div className="relative z-10 space-y-3 max-w-lg">
            <div className="flex items-center gap-2 text-xs font-semibold text-lime-400">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
              <span>Lead Qualification Sequence #9284 • Active</span>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-gray-200">
              <div className="text-[10px] text-gray-400 mb-1">LeadPilot Agent (Voice & Text):</div>
              "Hi Sarah, I noticed InnovateHub recently expanded your SDR team. Would you like me to reserve a calendar demo slot with Mike Reynolds for Tuesday at 2 PM?"
            </div>

            <div className="p-3 rounded-xl bg-lime-500/20 backdrop-blur-md border border-lime-500/30 text-xs text-lime-200">
              <div className="text-[10px] text-lime-400 mb-1">Prospect Response (Sarah Chen):</div>
              "Yes! That works perfectly. Also, please send the Enterprise annual pricing agreement."
            </div>
          </div>

          {/* Action trigger preview */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Deal closed: $4,788.00 Enterprise Annual Plan provisioned</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onExplorePortal();
              }}
              className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-gray-950 text-xs font-bold rounded-full transition-transform active:scale-95 flex items-center gap-1.5 shadow-md"
            >
              <span>Explore In Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

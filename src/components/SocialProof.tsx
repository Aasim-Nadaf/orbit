import React from 'react';
import { Star } from 'lucide-react';

export const SocialProof: React.FC = () => {
  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Social Proof Card */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left bg-gray-50/70 p-6 rounded-2xl border border-gray-100 min-w-[280px]">
            {/* 5 Avatars */}
            <div className="flex -space-x-2.5 overflow-hidden mb-3">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80'
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`User ${i + 1}`}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>

            {/* 5 Stars */}
            <div className="flex items-center gap-1 text-amber-500 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <div className="text-xs font-bold text-gray-900">
              Trusted by 5,000+
            </div>
            <div className="text-[11px] text-gray-500 font-medium">
              Businesses Helping teams
            </div>
          </div>

          {/* Right Milestone Statement (exact copy from landing.jpg) */}
          <div className="flex-1 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900 tracking-tight leading-snug font-sans">
              Every milestone tells a story of progress. Our achievement are driven by strong performance, customer trust, and continuous innovation—creating measurable results that define our journey and fuel our future growth.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

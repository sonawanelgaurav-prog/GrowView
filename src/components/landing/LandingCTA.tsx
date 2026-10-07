import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { LandingPageContent } from '../../types';

interface LandingCTAProps {
  content: LandingPageContent;
  onGetStarted: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ content, onGetStarted }) => {
  return (
    <section id="section-cta" className="py-16 md:py-24 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 border border-amber-500/30 p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>START ELEVATING YOUR BRAND TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-['Outfit'] max-w-2xl mx-auto leading-tight">
            {content.ctaTitle || 'Ready to Boost Your Business Brand Presence?'}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            {content.ctaSubtitle || 'Join thousands of smart business owners creating daily festive & promotional posters in under 1 minute.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-base md:text-lg shadow-xl shadow-amber-500/25 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>{content.ctaButtonText || 'Create Your First Poster (Free)'}</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Design Skills Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Watermark Free
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Download
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

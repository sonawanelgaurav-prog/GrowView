import React, { useState } from 'react';
import { FOOTER_FRAMES } from '../../data/footerFrames';
import { FrameDefinition, FrameId } from '../../types';
import { Sparkles, Check, Phone, Building2, User, Award, Shield } from 'lucide-react';

interface LandingBrandingShowcaseProps {
  title: string;
  subtitle: string;
  onTryFrames: () => void;
}

export const LandingBrandingShowcase: React.FC<LandingBrandingShowcaseProps> = ({
  title,
  subtitle,
  onTryFrames,
}) => {
  const [selectedFrameId, setSelectedFrameId] = useState<FrameId>('footer-01');
  const selectedFrame = FOOTER_FRAMES.find((f) => f.id === selectedFrameId) || FOOTER_FRAMES[0];

  const previewFrames = FOOTER_FRAMES.slice(0, 9);

  return (
    <section id="section-businessBranding" className="py-16 md:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>27 High-Contrast Color Themes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
            {title || '27 Professional Branding Frames'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Frame Selectors */}
          <div className="lg:col-span-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select a Frame Theme to Preview:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {previewFrames.map((frame) => {
                const isSelected = selectedFrameId === frame.id;
                return (
                  <button
                    key={frame.id}
                    onClick={() => setSelectedFrameId(frame.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/20 bg-slate-900'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: frame.backgroundColor }}
                      />
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="text-xs font-bold text-slate-200 mt-2 line-clamp-1">{frame.name}</span>
                    <span className="text-[10px] text-slate-400">{frame.badge}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3">
              <button
                onClick={onTryFrames}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 font-semibold text-sm transition-all text-center"
              >
                Explore All 27 Footer & Header Frames →
              </button>
            </div>
          </div>

          {/* Interactive Live Frame Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-amber-400">{selectedFrame.name} Preview</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px]">{selectedFrame.category}</span>
              </div>

              {/* Sample Poster with Frame applied */}
              <div className="aspect-square w-full rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-inner">
                {/* Artwork Area */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=800&q=80')",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                </div>

                <div className="relative z-10 p-4">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
                    FESTIVAL GREETING
                  </span>
                </div>

                {/* Live Dynamic Footer Frame */}
                <div
                  className="relative z-10 p-3"
                  style={{
                    backgroundColor: selectedFrame.backgroundColor,
                    borderTop: `3px solid ${selectedFrame.borderColor || selectedFrame.accent}`,
                    color: selectedFrame.textColor,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold leading-tight" style={{ color: selectedFrame.textColor }}>
                        सुरेश माने <span className="text-[10px] opacity-80">(संचालक)</span>
                      </p>
                      <p className="text-[11px] font-bold" style={{ color: selectedFrame.accent }}>
                        🏢 माने ग्रूप ऑफ इंडस्ट्रीज
                      </p>
                      <p className="text-[10px] opacity-75" style={{ color: selectedFrame.mutedTextColor }}>
                        सर्व प्रकारच्या औद्योगिक सेवा व पुरवठा
                      </p>
                    </div>

                    <div
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 border"
                      style={{
                        backgroundColor: selectedFrame.isLightBg ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)',
                        borderColor: selectedFrame.borderColor || selectedFrame.accent,
                        color: selectedFrame.textColor,
                      }}
                    >
                      📞 7774914906
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">
                {selectedFrame.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Download, 
  Palette, 
  CheckCircle2, 
  Layers, 
  Type, 
  Briefcase, 
  Smile, 
  Sliders, 
  Crown,
  MousePointer,
  Maximize2
} from 'lucide-react';
import { LandingPageContent, LandingPageAsset } from '../../types';

interface LandingHeroProps {
  content: LandingPageContent;
  heroAsset?: LandingPageAsset;
  onCtaClick: () => void;
  onExploreTemplates: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  content,
  heroAsset,
  onCtaClick,
  onExploreTemplates,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#F8F8FC] pt-12 pb-20 md:pt-18 md:pb-28 text-[#18181B] border-b border-[#E7E7EE]">
      {/* Subtle SaaS Aura Gradients in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-[#635BFF]/8 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Section 6 Hero Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{content.heroBadge || '✨ ५०,०००+ भारतीय व्यवसाय व क्रिएटर्सचा विश्वास'}</span>
            </div>

            {/* Main Heading with Marathi & English Support */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-['Outfit'] text-slate-900 leading-tight">
              {content.heroHeadlineMarathi ? (
                <>
                  <span className="text-amber-600">
                    {content.heroHeadlineMarathi.split(' ')[0]}
                  </span>{' '}
                  {content.heroHeadlineMarathi.substring(content.heroHeadlineMarathi.indexOf(' ') + 1)}
                </>
              ) : (
                content.heroHeadline || 'Create Professional Festival & Business Posters'
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {content.heroSubtitleMarathi || content.heroSubtitle || 'आपल्या व्यवसायाचा लोगो, नाव, पत्ता व मोबाईल नंबरसह दर्जेदार मराठी, हिंदी व इंग्रजी पोस्टर्स तयार करा.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={onCtaClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-base md:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/35 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>✨ {content.heroCtaPrimary || 'पोस्टर डिझाईन सुरू करा'}</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <button
                type="button"
                onClick={onExploreTemplates}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-base transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Palette className="w-5 h-5 text-amber-600" />
                <span>टेम्पलेट्स पहा (Templates)</span>
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-[#71717A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>27+ Branding Frames</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Marathi, Hindi & English</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>HD Direct Downloads</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Realistic Design-Editor Mockup with Floating Cards */}
          <div className="lg:col-span-6 relative flex justify-center">
            {/* Main Design Editor Mockup: Section 6 */}
            <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E7E7EE] shadow-2xl overflow-hidden p-2 sm:p-3">
              {/* Mockup Editor Top Bar */}
              <div className="h-10 bg-[#F8F8FC] rounded-xl border border-[#E7E7EE] px-3 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-bold text-[#18181B] ml-2">Diwali_Special_Offer.png</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-[#635BFF] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </div>
                </div>
              </div>

              {/* Mockup Editor Body: 3-Zone Representation */}
              <div className="grid grid-cols-12 gap-2 h-72 sm:h-84">
                {/* Left Mini-Toolbar in Mockup */}
                <div className="col-span-2 bg-[#F8F8FC] rounded-xl border border-[#E7E7EE] p-1.5 flex flex-col items-center justify-around">
                  <div className="p-1.5 rounded-lg bg-indigo-50 text-[#635BFF]">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1.5 rounded-lg text-slate-400">
                    <Type className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1.5 rounded-lg text-slate-400">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1.5 rounded-lg text-slate-400">
                    <Smile className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1.5 rounded-lg text-slate-400">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Center Canvas with Poster & Selection Bounding Box */}
                <div className="col-span-7 bg-[#F1F1F5] rounded-xl border border-[#E7E7EE] p-2 flex items-center justify-center relative overflow-hidden">
                  {/* Poster Canvas */}
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 relative shadow-md p-3 flex flex-col justify-between overflow-hidden">
                    {/* Top Festival Tag */}
                    <div className="text-center">
                      <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30 backdrop-blur-xs">
                        🌸 शुभ दीपावली महोत्सव
                      </span>
                    </div>

                    {/* Headline with Bounding Box Highlight */}
                    <div className="relative border-2 border-dashed border-white/80 p-1.5 rounded bg-black/20 text-center">
                      <span className="text-xs sm:text-sm font-black text-amber-200 block drop-shadow">
                        ।। भव्य दिवाळी बंपर ऑफर ।।
                      </span>
                      {/* Live Coordinates HUD Marker */}
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#18181B] text-white text-[8px] font-mono px-1.5 py-0.2 rounded border border-[#635BFF]">
                        X:50% Y:48%
                      </span>
                    </div>

                    {/* Bottom Branding Footer Frame */}
                    <div className="h-9 bg-slate-950/90 rounded-md border border-amber-400/40 p-1 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                          GV
                        </div>
                        <div>
                          <p className="text-[9px] font-bold leading-tight">Coreline Graphics</p>
                          <p className="text-[8px] text-amber-300">📞 7774914906</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Mini-Properties Panel in Mockup */}
                <div className="col-span-3 bg-[#F8F8FC] rounded-xl border border-[#E7E7EE] p-2 flex flex-col justify-between text-[9px] space-y-1">
                  <div>
                    <span className="font-bold text-[#18181B] block mb-1">Properties</span>
                    <div className="space-y-1">
                      <div className="bg-white p-1 rounded border border-[#E7E7EE] flex justify-between font-mono text-[8px]">
                        <span>X: 50%</span>
                        <span>Y: 48%</span>
                      </div>
                      <div className="bg-white p-1 rounded border border-[#E7E7EE] font-bold text-slate-600 truncate">
                        Yatra One
                      </div>
                      <div className="bg-white p-1 rounded border border-[#E7E7EE] flex items-center justify-center text-[#635BFF] font-bold">
                        Center
                      </div>
                    </div>
                  </div>
                  <div className="bg-indigo-50 p-1 rounded text-[#635BFF] font-bold text-center">
                    ✓ HD Ready
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 1: Top-Right */}
            <div className="hidden sm:flex absolute -top-4 -right-4 bg-white/95 rounded-2xl border border-[#E7E7EE] shadow-xl p-3 items-center gap-3 backdrop-blur-md animate-bounce duration-1000">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#18181B]">Auto Frame Applied</p>
                <p className="text-[10px] text-[#71717A]">Business Logo & Contact</p>
              </div>
            </div>

            {/* Floating Card 2: Bottom-Left */}
            <div className="hidden sm:flex absolute -bottom-5 -left-4 bg-white/95 rounded-2xl border border-[#E7E7EE] shadow-xl p-3 items-center gap-3 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#18181B]">AI Text Generated</p>
                <p className="text-[10px] text-[#71717A]">मराठी व इंग्रजी शुभेच्छा</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

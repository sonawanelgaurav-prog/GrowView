import React from 'react';
import { MousePointerClick, Sliders, Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface LandingHowItWorksProps {
  title: string;
  subtitle: string;
  onGetStarted: () => void;
}

export const LandingHowItWorks: React.FC<LandingHowItWorksProps> = ({
  title,
  subtitle,
  onGetStarted,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Select a Poster Template',
      titleMarathi: '१. पोस्टर निवडा',
      desc: 'Pick from 500+ curated designs for upcoming festivals, daily greetings, quotes, or business promotions.',
      icon: MousePointerClick,
      color: 'from-amber-500 to-orange-500',
    },
    {
      step: '02',
      title: 'Auto-Apply Business Branding',
      titleMarathi: '२. ब्रँडिंग ऑटोमॅटिक जोडा',
      desc: 'Your business name, logo, phone number, and designation are automatically inserted onto any of the 27 vibrant frames.',
      icon: Sliders,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      step: '03',
      title: 'Download & Share in Seconds',
      titleMarathi: '३. डाऊनलोड करा व शेअर करा',
      desc: 'Export crystal clear HD images without watermarks. Share directly to WhatsApp Status, Instagram, and Facebook.',
      icon: Download,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="section-howItWorks" className="py-16 md:py-24 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
            {title || 'How GrowView Works'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 flex flex-col justify-between hover:border-slate-700 transition-all hover:-translate-y-1 shadow-xl"
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} p-0.5 shadow-lg flex items-center justify-center`}>
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <span className="text-3xl font-black text-slate-700 font-mono">{item.step}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-['Outfit']">{item.title}</h3>
                  <p className="text-xs text-amber-300 font-semibold font-['Baloo_2']">{item.titleMarathi}</p>
                  <p className="text-sm text-slate-400 leading-relaxed pt-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            Try It Now – Create Free Poster
          </button>
        </div>
      </div>
    </section>
  );
};

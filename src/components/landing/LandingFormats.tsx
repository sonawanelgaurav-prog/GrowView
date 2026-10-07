import React from 'react';
import { Smartphone, Square, Layout, Instagram, Share2, MessageCircle } from 'lucide-react';

interface LandingFormatsProps {
  title: string;
  subtitle: string;
}

export const LandingFormats: React.FC<LandingFormatsProps> = ({ title, subtitle }) => {
  const formats = [
    {
      ratio: '1:1 Square',
      dimensions: '1080 × 1080 px',
      bestFor: 'Instagram Feed, Facebook Posts, Twitter, LinkedIn',
      icon: Square,
      desc: 'The universal square format perfect for regular timeline posts and product showcases.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      ratio: '9:16 Full Screen',
      dimensions: '1080 × 1920 px',
      bestFor: 'WhatsApp Status, Instagram Stories, Reels, TikTok',
      icon: Smartphone,
      desc: 'Immersive full-screen vertical layout designed for mobile story and status viewers.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      ratio: '4:5 Portrait',
      dimensions: '1080 × 1350 px',
      bestFor: 'Instagram Portrait Feed, Sponsored Ads',
      icon: Layout,
      desc: 'Maximizes vertical feed real estate for higher engagement and visibility on Instagram.',
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  return (
    <section id="section-supportedFormats" className="py-16 md:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Layout className="w-3.5 h-3.5" />
            <span>Social Media Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
            {title || 'Supported Aspect Ratios & Formats'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {formats.map((fmt, idx) => {
            const Icon = fmt.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 flex flex-col justify-between hover:border-slate-600 transition-all hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${fmt.color} p-0.5 flex items-center justify-center`}>
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
                      {fmt.dimensions}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-['Outfit'] mb-1">{fmt.ratio}</h3>
                  <p className="text-xs text-amber-300/90 font-medium mb-3">{fmt.bestFor}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{fmt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

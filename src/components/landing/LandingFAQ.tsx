import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface LandingFAQProps {
  title: string;
  subtitle: string;
}

export const LandingFAQ: React.FC<LandingFAQProps> = ({ title, subtitle }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the automated business branding work?',
      a: 'You enter your business details (Owner name, Company name, Phone, Designation, and Logo) once in your profile. When you pick any template, GrowView instantly places your branding onto any of the 27 customizable footer & header frames with zero manual editing required.',
    },
    {
      q: 'Can I create posters in Marathi and Hindi?',
      a: 'Yes! GrowView is fully localized with Devanagari typography, festival greetings, quotes, and slogans in Marathi, Hindi, English, and Gujarati.',
    },
    {
      q: 'Can I add or remove the date on my festival posters?',
      a: 'Yes. GrowView provides a dedicated Date setting where you can toggle Date ON or OFF, customize the date text, and choose from multiple clean date badge formats.',
    },
    {
      q: 'Are the exported posters watermark free?',
      a: 'Yes, downloaded posters are 100% clean and watermark-free, giving your business a premium, trustworthy look on social media.',
    },
    {
      q: 'Which aspect ratios can I download?',
      a: 'You can export in 1:1 Square (1080x1080) for Instagram & Facebook feeds, 9:16 Full Screen (1080x1920) for WhatsApp Status & Stories, and 4:5 Portrait (1080x1350) for mobile feeds.',
    },
    {
      q: 'Is there any daily limit on poster creation?',
      a: 'Free accounts get access to hundreds of daily templates. Premium business subscriptions unlock unlimited downloads, AI slogans, and priority festival designs.',
    },
  ];

  return (
    <section id="section-faq" className="py-16 md:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
            {title || 'Frequently Asked Questions'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-white text-base font-['Outfit']">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-700/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Flame, Sparkles, ArrowRight, Calendar, Star } from 'lucide-react';
import { PosterTemplate, LandingPageAsset } from '../../types';
import { MotifGraphics } from '../MotifGraphics';

interface LandingFestivalSpecialProps {
  title: string;
  subtitle: string;
  asset?: LandingPageAsset;
  templates: PosterTemplate[];
  onSelectTemplate: (template: PosterTemplate) => void;
  onExploreFestivals: () => void;
  onOpenAIFestivalModal?: () => void;
}

export const LandingFestivalSpecial: React.FC<LandingFestivalSpecialProps> = ({
  title,
  subtitle,
  asset,
  templates,
  onSelectTemplate,
  onExploreFestivals,
  onOpenAIFestivalModal,
}) => {
  // Find festival templates
  const festivalTemplates = templates
    .filter((t) => t.category === 'festivals' || t.category === 'shivjayanti' || t.category === 'ganeshotsav' || t.category === 'diwali')
    .slice(0, 4);

  return (
    <section id="section-festivalSpecial" className="py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-orange-950/30 border border-amber-500/30 p-6 sm:p-8 md:p-12 overflow-hidden relative">
          {/* Decorative glowing backdrops */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Col Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>GRAND FESTIVAL SPECIAL</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
                {title || 'Chhatrapati Shivaji Maharaj Jayanti & Grand Indian Festivals'}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {subtitle || 'Get ready with grand festival banners, greeting stories, and status posts in Marathi, Hindi, and English. Automatically customized with your business profile.'}
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-amber-200">
                  <Star className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>High-Resolution Shivaji Maharaj Jayanti Templates</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-amber-200">
                  <Star className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Authentic Devanagari Slogans & Quotes</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-amber-200">
                  <Star className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>27 Dedicated Festive Color Frames</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={onExploreFestivals}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore All Festival Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onOpenAIFestivalModal && (
                  <button
                    onClick={onOpenAIFestivalModal}
                    className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-extrabold text-sm shadow-md inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>✨ AI Festival Auto Creator उघडा</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Col Festival Grid */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              {festivalTemplates.map((template) => {
                const previewImg =
                  (template as any).thumbnailUrl ||
                  template.imageUrl ||
                  template.customBgUrl ||
                  (template as any).background?.url;

                return (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-500/50 shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="aspect-square relative">
                      {previewImg ? (
                        <img
                          src={previewImg}
                          alt={template.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${
                            template.theme?.bgGradient || 'from-amber-950 via-slate-900 to-orange-950'
                          } p-3 flex flex-col justify-between items-center text-center`}
                        >
                          <div className="w-full flex justify-end">
                            {template.dateBadge && (
                              <span className="px-2 py-0.5 rounded-full bg-black/60 text-amber-300 text-[8px] font-bold">
                                {template.dateBadge}
                              </span>
                            )}
                          </div>
                          <MotifGraphics
                            type={template.motifType || 'diwali-diya'}
                            className="w-16 h-16 drop-shadow-md group-hover:scale-105 transition-transform"
                            primaryColor={template.theme?.primaryColor || '#f59e0b'}
                            accentColor={template.theme?.accentColor || '#ef4444'}
                          />
                          <h4 className="text-[11px] font-bold text-white line-clamp-1">
                            {template.headline || template.title}
                          </h4>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20" />

                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300">
                          {template.title}
                        </p>
                        <span className="text-[10px] text-amber-400 font-medium">Click to Customize →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

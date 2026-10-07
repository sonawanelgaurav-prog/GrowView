import React, { useState, useEffect } from 'react';
import { BusinessProfile, PosterTemplate } from '../../types';
import { 
  Sparkles, 
  Crown, 
  ArrowRight, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Clock, 
  SlidersHorizontal,
  Building,
  CheckCircle2,
  Share2,
  Download,
  Settings,
  Image as ImageIcon,
  Edit2
} from 'lucide-react';
import {
  loadUserDashboardConfig,
  UserDashboardConfig,
  DashboardHeroSlide,
  DEFAULT_HERO_SLIDES,
  resolveActiveHeroSlide,
} from '../../data/userDashboardConfig';

interface BrandsLiveHeroBannerProps {
  activeProfile: BusinessProfile;
  onSelectCategory: (category: string) => void;
  onOpenProfileModal: () => void;
  onOpenAIModal: () => void;
  onOpenVIPModal: () => void;
  templates?: PosterTemplate[];
  onSelectTemplate?: (template: PosterTemplate) => void;
  onOpenAdminModal?: (initialTab?: string) => void;
  isAdmin?: boolean;
}

export const BrandsLiveHeroBanner: React.FC<BrandsLiveHeroBannerProps> = ({
  activeProfile,
  onSelectCategory,
  onOpenProfileModal,
  onOpenAIModal,
  onOpenVIPModal,
  templates = [],
  onSelectTemplate,
  onOpenAdminModal,
  isAdmin = false,
}) => {
  const [dashboardConfig, setDashboardConfig] = useState<UserDashboardConfig>(() => loadUserDashboardConfig());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const handleConfigChange = (e: any) => {
      if (e?.detail) {
        setDashboardConfig(e.detail);
      } else {
        setDashboardConfig(loadUserDashboardConfig());
      }
    };
    window.addEventListener('growview:dashboard_config_updated', handleConfigChange);
    return () => window.removeEventListener('growview:dashboard_config_updated', handleConfigChange);
  }, []);

  const activeSlides = (dashboardConfig?.heroSlides || DEFAULT_HERO_SLIDES).filter((s) => s.enabled);

  // Auto rotation if carousel mode is active
  useEffect(() => {
    if (!dashboardConfig?.showHeroBanner || activeSlides.length <= 1) return;
    if (dashboardConfig?.flashBannerMode === 'pinned') return;

    const intervalSec = dashboardConfig?.heroBannerRotationSeconds || 6;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, intervalSec * 1000);
    return () => clearInterval(timer);
  }, [dashboardConfig, activeSlides.length]);

  if (!dashboardConfig?.showHeroBanner || activeSlides.length === 0) {
    return null;
  }

  // Resolve active slide & real poster using intelligent 3-day resolution engine
  const resolution = resolveActiveHeroSlide(dashboardConfig, templates, currentSlideIndex);
  const slide = resolution.slide;
  const matchedTemplate = resolution.matchedTemplate;
  const isFrom3DaysCalendar = resolution.isFrom3DaysCalendar;

  const handlePosterClick = () => {
    if (matchedTemplate && onSelectTemplate) {
      onSelectTemplate(matchedTemplate);
    } else {
      onSelectCategory(slide.category);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-800 text-white select-none">
      {/* Background Graphic & Gradient */}
      <div className={`w-full bg-gradient-to-r ${slide.gradient} p-5 sm:p-7 md:p-8 transition-all duration-700 relative`}>
        {/* Ambient Glows */}
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-8 space-y-3.5">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-current text-orange-400 animate-pulse" />
                {slide.tag}
              </span>

              <span className="inline-flex items-center gap-1 bg-black/40 text-slate-200 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold">
                <Clock className="w-3 h-3 text-orange-400" />
                {slide.countdownText}
              </span>

              {isFrom3DaysCalendar && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  ✨ येत्या ३ दिवसांतील सण
                </span>
              )}

              {/* Admin Quick Settings Button (Strictly only for Admin!) */}
              {isAdmin && onOpenAdminModal && (
                <button
                  type="button"
                  onClick={() => onOpenAdminModal('user_dashboard')}
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  title="ॲडमिन पॅनलमध्ये जाऊन हा सण, तारीख व पोस्टर बदला"
                >
                  <Settings className="w-3 h-3 animate-spin" />
                  <span>⚙️ ॲडमिन: सण व पोस्टर बदला</span>
                </button>
              )}
            </div>

            {/* Main Headline */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                {slide.title}
              </h2>
              <p className="text-sm sm:text-base font-bold text-amber-200 mt-0.5">
                {slide.titleMarathi}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-2xl">
              {slide.subtext}
            </p>

            {/* Active Auto-Branding Live Pill */}
            <div className="inline-flex items-center gap-2 bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="text-slate-400">Auto-Branded with: </span>
                <strong className="text-white font-bold">{activeProfile.name}</strong>
                <span className="text-slate-400 hidden sm:inline"> ({activeProfile.phone})</span>
              </div>
              <button
                type="button"
                onClick={onOpenProfileModal}
                className="text-[10px] text-orange-400 hover:text-orange-300 font-bold underline ml-1 cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handlePosterClick}
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <span>{slide.buttonText || 'Create Brand Poster'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenProfileModal}
                className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-100 font-bold text-xs flex items-center gap-1.5 transition-all backdrop-blur-sm cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                <span>Custom Frame</span>
              </button>

              <button
                type="button"
                onClick={onOpenAIModal}
                className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>AI Slogan</span>
              </button>
            </div>
          </div>

          {/* Right: High-Fidelity Poster Mockup Card with Live Frame */}
          <div className="lg:col-span-4 hidden lg:flex justify-center">
            <div 
              onClick={handlePosterClick}
              className="w-64 aspect-square rounded-2xl bg-black/60 border border-white/20 p-2.5 shadow-2xl backdrop-blur-md flex flex-col justify-between relative group transform hover:rotate-1 hover:scale-102 transition-all cursor-pointer overflow-hidden"
              title="क्लिक करून या सणाचे पोस्टर तयार करा"
            >
              {/* Poster Image / Background */}
              {slide.posterImageUrl ? (
                <img
                  src={slide.posterImageUrl}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              ) : (matchedTemplate?.thumbnailUrl || matchedTemplate?.imageUrl || matchedTemplate?.bgImage) ? (
                <img
                  src={matchedTemplate?.thumbnailUrl || matchedTemplate?.imageUrl || matchedTemplate?.bgImage}
                  alt={matchedTemplate?.title || slide.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${matchedTemplate?.theme?.bgGradient || slide.gradient} rounded-2xl flex flex-col items-center justify-center p-4 text-center`}>
                  <div className="text-3xl mb-1 filter drop-shadow">🔱</div>
                  <h4 className="font-black text-sm text-white drop-shadow-md line-clamp-2">
                    {slide.headline}
                  </h4>
                  <p className="text-[10px] text-amber-200 font-bold mt-1 line-clamp-1">
                    {slide.titleMarathi}
                  </p>
                </div>
              )}

              {/* Top floating badges over poster */}
              <div className="relative z-10 flex items-center justify-between text-[10px]">
                <span className="bg-red-600/90 text-white backdrop-blur-md px-2 py-0.5 rounded-full font-bold shadow-md border border-white/20">
                  {slide.dateText}
                </span>
                <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-md">
                  ★ LIVE POSTER
                </span>
              </div>

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-1.5 p-3 text-center backdrop-blur-[2px]">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-black text-sm">
                  ⚡
                </div>
                <span className="text-xs font-black text-white shadow-md">
                  पोस्टर तयार करा (1-Click)
                </span>
                {isAdmin && (
                  <span className="text-[10px] bg-slate-900/90 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 mt-1">
                    ॲडमिन: पोस्टर बदला
                  </span>
                )}
              </div>

              {/* Bottom Live Frame on Poster */}
              <div className="relative z-10 bg-slate-950/95 backdrop-blur-md rounded-xl p-2 border border-white/20 flex items-center gap-2 shadow-xl">
                {activeProfile.logoUrl ? (
                  <img
                    src={activeProfile.logoUrl}
                    alt="Logo"
                    className="w-7 h-7 rounded object-cover border border-white/30 shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black flex items-center justify-center text-[10px] shrink-0 shadow-sm">
                    {activeProfile.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-white truncate">{activeProfile.name}</p>
                  <p className="text-[9px] text-amber-300 font-mono truncate">{activeProfile.phone}</p>
                </div>
                <div className="shrink-0">
                  <span className="text-[8px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                    HD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slider Controls */}
        {dashboardConfig?.flashBannerMode === 'carousel' && activeSlides.length > 1 && (
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlideIndex === idx ? 'w-6 bg-orange-400' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setCurrentSlideIndex((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1))
                }
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-white transition-colors cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % activeSlides.length)}
                className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-white transition-colors cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

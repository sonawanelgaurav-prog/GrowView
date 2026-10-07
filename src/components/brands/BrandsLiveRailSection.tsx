import React, { useRef } from 'react';
import { BusinessProfile, FrameId, PosterTemplate, FooterFrameConfig } from '../../types';
import { BrandsLivePosterCard } from './BrandsLivePosterCard';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Sun, 
  Building2, 
  Video, 
  Crown,
  Tag
} from 'lucide-react';

interface BrandsLiveRailSectionProps {
  id: string;
  title: string;
  titleMarathi?: string;
  badge?: string;
  icon?: React.ElementType;
  templates: PosterTemplate[];
  activeProfile: BusinessProfile;
  selectedFrameId?: FrameId;
  frameConfig?: Partial<FooterFrameConfig>;
  viewAllCategory?: string;
  onViewAll?: (categoryId: string) => void;
  onSelectTemplate: (template: PosterTemplate) => void;
  onQuickDownload: (template: PosterTemplate) => void;
  onShareWhatsApp: (template: PosterTemplate) => void;
  onOpenVideo?: (template: PosterTemplate) => void;
  onOpenVIPModal?: () => void;
  filterChips?: { id: string; label: string; count?: number }[];
  activeFilterChip?: string;
  onSelectFilterChip?: (chipId: string) => void;
}

export const BrandsLiveRailSection: React.FC<BrandsLiveRailSectionProps> = ({
  id,
  title,
  titleMarathi,
  badge,
  icon: Icon = Flame,
  templates,
  activeProfile,
  selectedFrameId,
  frameConfig,
  viewAllCategory,
  onViewAll,
  onSelectTemplate,
  onQuickDownload,
  onShareWhatsApp,
  onOpenVideo,
  onOpenVIPModal,
  filterChips,
  activeFilterChip,
  onSelectFilterChip,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (templates.length === 0) return null;

  const displayTemplates = templates.filter((tpl) => {
    if (activeFilterChip && activeFilterChip !== 'all') {
      return tpl.subCategory === activeFilterChip || tpl.category === activeFilterChip;
    }
    return true;
  });

  return (
    <section className="space-y-3 cv-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                {title}
              </h3>
              {badge && (
                <span className="bg-red-500/10 text-red-700 border border-red-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            {titleMarathi && (
              <p className="text-xs text-slate-500 font-medium">{titleMarathi}</p>
            )}
          </div>
        </div>

        {/* View All Button & Rail Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {viewAllCategory && onViewAll && (
            <button
              type="button"
              onClick={() => onViewAll(viewAllCategory)}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline px-2 py-1"
            >
              <span>View All ({templates.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Category Filter Chips (if any) */}
      {filterChips && filterChips.length > 0 && onSelectFilterChip && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar mobile-smooth-scroll">
          {filterChips.map((chip) => {
            const isChipSelected = activeFilterChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onSelectFilterChip(chip.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
                  isChipSelected
                    ? 'bg-slate-900 border-slate-900 text-white font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{chip.label}</span>
                {chip.count !== undefined && (
                  <span className="ml-1.5 text-[10px] opacity-70">({chip.count})</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Horizontal Scroll Rail */}
      <div
        ref={scrollRef}
        className="grid grid-flow-col auto-cols-[68%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[23%] gap-3.5 sm:gap-4 overflow-x-auto pb-3 pt-1 px-0.5 no-scrollbar scroll-smooth mobile-smooth-scroll snap-x snap-mandatory"
      >
        {displayTemplates.map((tpl) => (
          <div key={tpl.id} className="h-full snap-start">
            <BrandsLivePosterCard
              template={tpl}
              activeProfile={activeProfile}
              overrideFrameId={selectedFrameId}
              frameConfig={frameConfig}
              onSelectTemplate={onSelectTemplate}
              onQuickDownload={onQuickDownload}
              onShareWhatsApp={onShareWhatsApp}
              onOpenVideo={onOpenVideo}
              onOpenVIPModal={onOpenVIPModal}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

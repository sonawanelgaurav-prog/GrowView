import React, { useState } from 'react';
import { PosterTemplate } from '../../types';
import { Sparkles, Edit3, ArrowRight } from 'lucide-react';

interface LandingPopularTemplatesProps {
  title?: string;
  subtitle?: string;
  templates: PosterTemplate[];
  hiddenTemplateIds?: string[];
  onSelectTemplate: (template: PosterTemplate) => void;
  onExploreMore: () => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'business', label: 'Business' },
  { id: 'festival', label: 'Festival' },
  { id: 'social', label: 'Social Media' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'offers', label: 'Offers' },
  { id: 'reels', label: 'Reels' },
] as const;

export const LandingPopularTemplates: React.FC<LandingPopularTemplatesProps> = ({
  title,
  subtitle,
  templates,
  hiddenTemplateIds = [],
  onSelectTemplate,
  onExploreMore,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  // Filter templates based on selected category tab
  const visibleTemplates = templates
    .filter((t) => !hiddenTemplateIds.includes(t.id))
    .filter((t) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'business') return t.subCategory === 'business' || t.category === 'business' || t.category === 'realestate' || t.category === 'jewellery';
      if (activeTab === 'festival') return t.subCategory === 'festivals' || t.category === 'festivals' || t.category === 'shivjayanti' || t.category === 'ganeshotsav' || t.category === 'diwali';
      if (activeTab === 'social') return t.aspectRatio === '1:1' || t.aspectRatio === '4:5' || t.category === 'good-morning-quotes' || t.category === 'suvichar-morning';
      if (activeTab === 'wedding') return t.category === 'wedding-invitation' || t.category === 'engagement-ceremony' || t.category === 'biodata-resume';
      if (activeTab === 'birthday') return t.category === 'birthday' || t.title.toLowerCase().includes('birthday') || t.titleNative?.includes('वाढदिवस');
      if (activeTab === 'offers') return t.category === 'offer' || t.category === 'sale' || t.title.toLowerCase().includes('offer') || t.title.toLowerCase().includes('sale');
      if (activeTab === 'reels') return t.aspectRatio === '9:16' || t.category === 'reels';
      return true;
    })
    .slice(0, 8);

  return (
    <section id="section-popularTemplates" className="py-16 md:py-24 bg-white text-[#18181B] border-b border-[#E7E7EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading: Section 7 */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#635BFF] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Templates Library</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18181B] font-['Outfit'] tracking-tight">
            Design Anything You Need
          </h2>
          <p className="text-[#71717A] text-base sm:text-lg">
            Start with a professionally designed template and make it yours.
          </p>
        </div>

        {/* Horizontal Category Tabs: Section 7 */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-10">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25'
                    : 'bg-[#F8F8FC] hover:bg-slate-100 text-[#71717A] hover:text-[#18181B] border border-[#E7E7EE]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Template Cards Grid: Section 7 */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleTemplates.map((template) => {
            const previewImg =
              (template as any).thumbnailUrl ||
              template.imageUrl ||
              template.customBgUrl ||
              (template as any).background?.url;

            const categoryName = template.subCategoryNative || template.category;

            return (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="group relative rounded-2xl bg-white border border-[#E7E7EE] hover:border-[#635BFF]/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Image Preview with Hover Zoom */}
                <div className="relative aspect-square w-full bg-[#F8F8FC] overflow-hidden">
                  {previewImg ? (
                    <img
                      src={previewImg}
                      alt={template.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        template.theme?.bgGradient || 'from-amber-600 via-orange-600 to-rose-700'
                      } p-4 flex flex-col justify-between items-center text-center text-white`}
                    >
                      <span className="text-[10px] font-bold bg-black/30 px-2 py-0.5 rounded-full">
                        {template.dateBadge || 'Special Poster'}
                      </span>
                      <p className="text-xs sm:text-sm font-black drop-shadow line-clamp-2">
                        {template.titleNative || template.title}
                      </p>
                      <span className="text-[9px] text-white/80 font-semibold">HD Poster</span>
                    </div>
                  )}

                  {/* Small Category Label: Section 7 */}
                  <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-[#18181B] px-2 py-0.5 rounded-md shadow-xs border border-[#E7E7EE]">
                      {categoryName}
                    </span>
                  </div>

                  {/* "Edit Design" Action Appearing on Hover: Section 7 */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4 z-20">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#635BFF] font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Design</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Card Title */}
                <div className="p-3">
                  <h3 className="text-xs font-bold text-[#18181B] truncate">
                    {template.titleNative || template.title}
                  </h3>
                  <p className="text-[11px] text-[#71717A] mt-0.5 truncate">
                    {template.headline || 'Customizable SaaS Template'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Action */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onExploreMore}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F8F8FC] hover:bg-indigo-50 border border-[#E7E7EE] hover:border-[#635BFF] text-[#635BFF] font-bold text-sm transition-all cursor-pointer"
          >
            <span>View All Templates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

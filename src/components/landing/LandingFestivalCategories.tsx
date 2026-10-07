import React from 'react';
import { CategoryInfo } from '../../types';
import { Sparkles, Calendar, ArrowRight, Flame, Heart, Award, Sun, Moon } from 'lucide-react';

interface LandingFestivalCategoriesProps {
  title: string;
  subtitle: string;
  categories: CategoryInfo[];
  hiddenCategoryIds?: string[];
  onSelectCategory: (categoryId: string) => void;
}

export const LandingFestivalCategories: React.FC<LandingFestivalCategoriesProps> = ({
  title,
  subtitle,
  categories,
  hiddenCategoryIds = [],
  onSelectCategory,
}) => {
  const visibleCategories = categories
    .filter((cat) => !hiddenCategoryIds.includes(cat.id))
    .slice(0, 12);

  return (
    <section id="section-festivalCategories" className="py-16 md:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Festival Categories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
            {title || 'Popular Festival & Daily Categories'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">{subtitle}</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visibleCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 p-4 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10"
            >
              {/* Category Icon */}
              <div className="w-14 h-14 rounded-2xl bg-slate-900 group-hover:bg-amber-500/20 border border-slate-700 group-hover:border-amber-500/40 flex items-center justify-center text-2xl mb-3 transition-colors">
                {category.icon || '🎉'}
              </div>

              {/* Category Title */}
              <h3 className="text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                {category.name}
              </h3>

              {/* Marathi Subtitle if available */}
              {category.nameMarathi && (
                <p className="text-xs text-slate-400 font-['Noto_Sans_Devanagari'] mt-0.5 line-clamp-1">
                  {category.nameMarathi}
                </p>
              )}

              {/* Count Badge */}
              <div className="mt-2 text-[11px] font-semibold text-amber-400/90 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700">
                {category.count || 20}+ Designs
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Link */}
        <div className="mt-10 text-center">
          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-medium text-sm transition-all"
          >
            <span>Explore All 50+ Festival & Business Categories</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </section>
  );
};

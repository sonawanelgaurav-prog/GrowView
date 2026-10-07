import React from 'react';
import { Building2, ArrowRight, Briefcase, Stethoscope, GraduationCap, Home, ShoppingBag, Car } from 'lucide-react';
import { PosterTemplate } from '../../types';
import { MotifGraphics } from '../MotifGraphics';

interface LandingBusinessTemplatesProps {
  title: string;
  subtitle: string;
  templates: PosterTemplate[];
  onSelectTemplate: (template: PosterTemplate) => void;
  onExploreBusiness: () => void;
}

export const LandingBusinessTemplates: React.FC<LandingBusinessTemplatesProps> = ({
  title,
  subtitle,
  templates,
  onSelectTemplate,
  onExploreBusiness,
}) => {
  const businessCategories = [
    { name: 'Real Estate', icon: Home, count: '45+ Templates' },
    { name: 'Doctors & Clinics', icon: Stethoscope, count: '30+ Templates' },
    { name: 'Coaching & Education', icon: GraduationCap, count: '40+ Templates' },
    { name: 'Retail & Grocery', icon: ShoppingBag, count: '50+ Templates' },
    { name: 'Automobile & Garage', icon: Car, count: '25+ Templates' },
    { name: 'Services & Consultants', icon: Briefcase, count: '35+ Templates' },
  ];

  const sampleBusinessPosters = templates
    .filter((t) => t.category === 'business' || t.category === 'realestate' || t.category === 'medical')
    .slice(0, 4);

  return (
    <section id="section-businessTemplates" className="py-16 md:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Business Branding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-['Outfit']">
            {title || 'Business Poster Templates for Every Industry'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">{subtitle}</p>
        </div>

        {/* Industry Category Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {businessCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={onExploreBusiness}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-2xl p-4 text-center cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-200">{item.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.count}</p>
              </div>
            );
          })}
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {sampleBusinessPosters.map((template) => {
            const previewImg =
              (template as any).thumbnailUrl ||
              template.imageUrl ||
              template.customBgUrl ||
              (template as any).background?.url;

            return (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="group rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 overflow-hidden shadow-lg cursor-pointer transition-all duration-300"
              >
                <div className="aspect-square relative">
                  {previewImg ? (
                    <img
                      src={previewImg}
                      alt={template.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        template.theme?.bgGradient || 'from-slate-900 via-blue-950 to-indigo-950'
                      } p-3 flex flex-col justify-between items-center text-center`}
                    >
                      <div className="w-full flex justify-end">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[8px] font-bold uppercase">
                          {template.category}
                        </span>
                      </div>
                      <MotifGraphics
                        type={template.motifType || 'business-growth'}
                        className="w-16 h-16 drop-shadow-md group-hover:scale-105 transition-transform"
                        primaryColor={template.theme?.primaryColor || '#3b82f6'}
                        accentColor={template.theme?.accentColor || '#60a5fa'}
                      />
                      <h4 className="text-[11px] font-bold text-white line-clamp-1">
                        {template.headline || template.title}
                      </h4>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/20 px-1.5 py-0.5 rounded">
                      {template.category}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1 line-clamp-1 group-hover:text-blue-300">
                      {template.title}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onExploreBusiness}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-medium text-sm transition-all inline-flex items-center gap-2"
          >
            <span>View All Business Ad Templates</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { MasterTemplate } from '../../types';
import { Crown, Sparkles, CheckCircle2, Eye, Edit3, Camera, Layers } from 'lucide-react';
import { MasterTemplateRenderer } from './MasterTemplateRenderer';
import { 
  DEFAULT_WEDDING_FORM_DATA, 
  DEFAULT_ENGAGEMENT_FORM_DATA, 
  DEFAULT_RESUME_FORM_DATA 
} from '../../data/masterTemplates';

interface MasterTemplateCardProps {
  template: MasterTemplate;
  onSelect: (template: MasterTemplate) => void;
  onPreview: (template: MasterTemplate) => void;
  isAdmin?: boolean;
  isLargeView?: boolean;
}

export const MasterTemplateCard: React.FC<MasterTemplateCardProps> = ({
  template,
  onSelect,
  onPreview,
  isAdmin = false,
  isLargeView = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Category labels and badges
  const categoryBadgeMap: Record<string, { label: string; marathi: string; bg: string; text: string }> = {
    wedding: { label: 'Wedding', marathi: 'लग्नपत्रिका', bg: 'bg-rose-100', text: 'text-rose-800' },
    engagement: { label: 'Engagement', marathi: 'साखरपुडा', bg: 'bg-amber-100', text: 'text-amber-800' },
    resume: { label: 'Resume', marathi: 'बायोडाटा / CV', bg: 'bg-blue-100', text: 'text-blue-800' },
  };

  const catMeta = categoryBadgeMap[template.category] || categoryBadgeMap.wedding;

  // Scale adjustment based on view mode and template height
  const isResume = template.category === 'resume';
  const previewScale = isLargeView ? (isResume ? 0.52 : 0.58) : (isResume ? 0.38 : 0.44);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges Bar */}
      <div className="p-3 pb-2 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-bold bg-slate-800 text-white px-2 py-0.5 rounded-md shadow-xs">
            {template.id}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${catMeta.bg} ${catMeta.text}`}>
            {catMeta.marathi}
          </span>
          {template.is_ats_friendly && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              ATS
            </span>
          )}
          {template.has_photo && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
              <Camera className="w-2.5 h-2.5" />
              Photo
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {template.is_free ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
              FREE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-xs">
              <Crown className="w-3 h-3 fill-current" />
              VIP
            </span>
          )}
        </div>
      </div>

      {/* Visual Preview Container */}
      <div 
        className={`relative w-full overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer select-none transition-all duration-300 ${
          isLargeView ? 'h-[440px]' : 'h-80 sm:h-96'
        }`}
        onClick={() => onPreview(template)}
      >
        {/* Scaled Mini Renderer Preview */}
        <div className="pointer-events-none transform transition-transform duration-300 group-hover:scale-[1.02] flex items-center justify-center">
          <MasterTemplateRenderer
            template={template}
            weddingData={DEFAULT_WEDDING_FORM_DATA}
            engagementData={DEFAULT_ENGAGEMENT_FORM_DATA}
            resumeData={DEFAULT_RESUME_FORM_DATA}
            scale={previewScale}
          />
        </div>

        {/* Quick View Tag at Top-Right of Canvas */}
        <div className="absolute top-2 right-2 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs">
            <Eye className="w-3 h-3 text-amber-400" />
            संपूर्ण प्रिव्ह्यू
          </span>
        </div>

        {/* Hover Overlay Action Controls */}
        <div className={`absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2.5 p-4 transition-opacity duration-200 ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="w-full max-w-[210px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span>संपूर्ण प्रिव्ह्यू पहा (Full View)</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(template);
            }}
            className="w-full max-w-[210px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>माहिती भरा व कस्टमाईज करा</span>
          </button>
        </div>
      </div>

      {/* Card Info Footer */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-slate-900 truncate">
              {template.name}
            </h3>
            {/* Color Swatches */}
            <div className="flex items-center -space-x-1 shrink-0">
              <span 
                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs" 
                style={{ backgroundColor: template.primary_color }} 
                title={`Primary: ${template.primary_color}`}
              />
              <span 
                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs" 
                style={{ backgroundColor: template.secondary_color }} 
                title={`Secondary: ${template.secondary_color}`}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {template.nameMarathi}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-medium truncate max-w-[160px]">
            {template.style}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(template)}
              className="font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              title="मोठा प्रिव्ह्यू"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>प्रिव्ह्यू</span>
            </button>
            <button
              type="button"
              onClick={() => onSelect(template)}
              className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 cursor-pointer"
            >
              <span>एडिट</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

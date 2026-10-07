import React, { useState } from 'react';
import { MasterTemplate } from '../../types';
import { MasterTemplateRenderer } from './MasterTemplateRenderer';
import { 
  DEFAULT_WEDDING_FORM_DATA, 
  DEFAULT_ENGAGEMENT_FORM_DATA, 
  DEFAULT_RESUME_FORM_DATA 
} from '../../data/masterTemplates';
import { 
  X, 
  Edit3, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Crown, 
  CheckCircle2, 
  Share2, 
  Download,
  Sparkles
} from 'lucide-react';

interface MasterTemplateFullPreviewModalProps {
  template: MasterTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectToEdit: (template: MasterTemplate) => void;
  isAdmin?: boolean;
}

export const MasterTemplateFullPreviewModal: React.FC<MasterTemplateFullPreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onSelectToEdit,
  isAdmin = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  if (!isOpen || !template) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoomLevel(1.0);

  const categoryNameMap: Record<string, string> = {
    wedding: 'लग्नपत्रिका (Wedding Invitation)',
    engagement: 'साखरपुडा (Engagement Ceremony)',
    resume: 'बायोडाटा / रेझ्युमे (Biodata & CV)',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="relative w-full max-w-5xl h-[94vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Top Control Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
              {template.id}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {template.nameMarathi || template.name}
                </h2>
                {template.is_free ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    FREE
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5 fill-current" /> VIP
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {categoryNameMap[template.category] || template.category} • संपूर्ण प्रिव्ह्यू (Full Preview)
              </p>
            </div>
          </div>

          {/* Zoom & Action Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                title="झूम कमी करा"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2 py-1 font-mono text-[11px] hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                title="रिसेट झूम"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                title="झूम वाढवा"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onSelectToEdit(template)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              माहिती भरा व एडिट करा
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Full-View Canvas Area */}
        <div className="flex-1 overflow-auto bg-slate-950/90 p-4 sm:p-8 flex items-center justify-center">
          <div className="transition-transform duration-200 origin-center my-auto flex items-center justify-center">
            <MasterTemplateRenderer
              template={template}
              weddingData={DEFAULT_WEDDING_FORM_DATA}
              engagementData={DEFAULT_ENGAGEMENT_FORM_DATA}
              resumeData={DEFAULT_RESUME_FORM_DATA}
              scale={zoomLevel}
              className="shadow-2xl rounded-sm"
              isFullView={true}
            />
          </div>
        </div>

        {/* Bottom Bar Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 px-5 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-4">
            <span>✨ उच्च रिझोल्यूशन प्रिंट-रेडी (High Quality)</span>
            <span className="hidden sm:inline">📐 सपोर्टेड साईज: {template.supported_sizes.join(', ')}</span>
            {template.is_ats_friendly && (
              <span className="text-emerald-400 font-semibold">✓ 100% ATS फ्रेंडली स्कॅनर</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onSelectToEdit(template)}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            यात माझे नाव व माहिती जोडा →
          </button>
        </div>
      </div>
    </div>
  );
};

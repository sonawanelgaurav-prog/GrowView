import React, { useRef } from 'react';
import {
  PosterTemplate,
  BusinessProfile,
  FrameId,
  FooterFrameConfig,
} from '../types';
import { RenderablePoster } from './RenderablePoster';
import { FOOTER_FRAMES } from '../data/footerFrames';
import {
  X,
  Edit3,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sliders,
  Store,
  Film,
} from 'lucide-react';

interface PosterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: PosterTemplate | null;
  activeProfile: BusinessProfile;
  selectedFrameId: FrameId;
  onSelectFrameId: (frameId: FrameId) => void;
  frameConfig?: Partial<FooterFrameConfig>;
  onOpenStudio: (template: PosterTemplate) => void;
  onQuickDownload: (template: PosterTemplate) => void;
  onShareWhatsApp?: (template: PosterTemplate) => void;
  onOpenProfileModal?: () => void;
  hasVideoEditorAccess?: boolean;
  onOpenVideoStudio?: (template: PosterTemplate) => void;
  onDownloadVideo?: (template: PosterTemplate) => void;
}

export const PosterPreviewModal: React.FC<PosterPreviewModalProps> = ({
  isOpen,
  onClose,
  template,
  activeProfile,
  selectedFrameId,
  onSelectFrameId,
  frameConfig,
  onOpenStudio,
  onQuickDownload,
  onShareWhatsApp,
  onOpenProfileModal,
  hasVideoEditorAccess = false,
  onOpenVideoStudio,
  onDownloadVideo,
}) => {
  const frameScrollRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !template) return null;

  const currentFrame =
    FOOTER_FRAMES.find((f) => f.id === selectedFrameId) || FOOTER_FRAMES[0];

  const handleScrollFrames = (direction: 'left' | 'right') => {
    if (frameScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      frameScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleShare = () => {
    if (onShareWhatsApp) {
      onShareWhatsApp(template);
    } else {
      const shareUrl = window.location.href;
      const text = encodeURIComponent(
        `*${template.headline || template.titleNative || template.title}*\n\n${template.subtext || ''}\n\n✨ *${activeProfile.name}*\n📞 ${activeProfile.phone}\n📍 ${activeProfile.address}\n\nCreated with GrowView - Poster Maker app\n${shareUrl}`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[96vh] bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="truncate">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">
                {template.titleNative || template.title}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                पोस्टर प्रिव्ह्यू • {template.category} • HD रिझोल्यूशन
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Profile Badge */}
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
              title="ब्रँड प्रोफाइल बदला"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-[120px]">{activeProfile.name}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
              title="बंद करा"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Center Area with Poster Display */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col items-center justify-center bg-radial from-slate-900 to-slate-950">
          {/* Poster Container with Corner Edit Button */}
          <div className="relative group max-w-[440px] w-full mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950">
            {/* Small Corner Edit Button as explicitly requested by user */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStudio(template);
                }}
                className="px-3 py-1.5 bg-slate-950/90 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold text-xs rounded-full shadow-xl border border-amber-500/40 backdrop-blur-md flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 group-hover:ring-2 group-hover:ring-amber-400"
                title="कस्टमाईज इन स्टुडिओ उघडा"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
                <span className="hidden sm:inline font-normal text-[10px] text-amber-200/80">| स्टुडिओ</span>
              </button>
            </div>

            {/* Poster Canvas */}
            <div className="w-full aspect-square relative select-none">
              <RenderablePoster
                template={template}
                profile={activeProfile}
                frameId={selectedFrameId}
                aspectRatio="1:1"
                showFooter={true}
                footerConfig={frameConfig}
              />
            </div>
          </div>
        </div>

        {/* Sliding Frames Option Strip ("प्रिव्हीव्ह मध्ये फ्रेम्स ऑप्शन नुसार स्लाईड व्हायला पाहीजे") */}
        <div className="border-t border-slate-800 bg-slate-950/95 px-3 py-3 sm:px-6 shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">
                फ्रेम्स निवडा (स्लाईड करा - {FOOTER_FRAMES.length} डिझाईन्स):
              </span>
              <span className="text-[11px] text-amber-400 font-medium hidden sm:inline">
                {currentFrame.nameMarathi || currentFrame.name}
              </span>
            </div>

            {/* Slide Left / Right Navigation Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleScrollFrames('left')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="मागील फ्रेम्स पहा (Slide Left)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollFrames('right')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="पुढील फ्रेम्स पहा (Slide Right)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable / Sliding Frames Strip */}
          <div
            ref={frameScrollRef}
            className="flex items-center gap-2.5 overflow-x-auto py-1 scroll-smooth no-scrollbar"
          >
            {FOOTER_FRAMES.map((frame, index) => {
              const isSelected = selectedFrameId === frame.id;
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => onSelectFrameId(frame.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-400/50 scale-[1.03]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/30 shadow-xs"
                    style={{ backgroundColor: frame.backgroundColor || frame.accent }}
                  />
                  <span className="whitespace-nowrap">
                    {index + 1}. {frame.nameMarathi || frame.name}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStudio(template);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>कस्टमाईज (Studio)</span>
            </button>

            {/* Video Editor Studio Access (Available for All Users to create video from poster) */}
            {onOpenVideoStudio && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVideoStudio(template);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black border border-rose-500/40 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="व्हिडिओ स्टुडिओमध्ये ॲनिमेटेड रील तयार करा"
              >
                <Film className="w-3.5 h-3.5" />
                <span>🎬 ॲनिमेटेड व्हिडिओ बनवा</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* WhatsApp Share */}
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>व्हॉट्सॲप शेअर</span>
            </button>

            {/* Quick Download Video MP4 (End User Feature) */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onDownloadVideo) {
                  onDownloadVideo(template);
                } else if (onOpenVideoStudio) {
                  onOpenVideoStudio(template);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white text-xs font-black border border-amber-500/30 flex items-center gap-1.5 transition-all active:scale-95"
              title="ॲनिमेटेड व्हिडिओ MP4 फॉरमॅटमध्ये डाऊनलोड करा"
            >
              <Film className="w-3.5 h-3.5" />
              <span>व्हिडिओ MP4</span>
            </button>

            {/* Quick Download HD Image */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onQuickDownload(template);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>HD फोटो डाऊनलोड</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

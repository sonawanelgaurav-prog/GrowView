import React, { useState, memo } from 'react';
import { BusinessProfile, FrameId, PosterTemplate, FooterFrameConfig } from '../../types';
import { RenderablePoster } from '../RenderablePoster';
import { 
  Download, 
  Crown, 
  Video, 
  Play, 
  MessageCircle, 
  Smartphone,
  Eye,
  Sparkles
} from 'lucide-react';

interface BrandsLivePosterCardProps {
  template: PosterTemplate;
  activeProfile: BusinessProfile;
  overrideFrameId?: FrameId;
  frameConfig?: Partial<FooterFrameConfig>;
  onSelectTemplate: (template: PosterTemplate) => void;
  onQuickDownload: (template: PosterTemplate) => void;
  onShareWhatsApp: (template: PosterTemplate) => void;
  onOpenVideo?: (template: PosterTemplate) => void;
  onOpenVIPModal?: () => void;
}

const BrandsLivePosterCardComponent: React.FC<BrandsLivePosterCardProps> = ({
  template,
  activeProfile,
  overrideFrameId,
  frameConfig,
  onSelectTemplate,
  onQuickDownload,
  onShareWhatsApp,
  onOpenVideo,
  onOpenVIPModal,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const effectiveFrameId = overrideFrameId || template.defaultFrameId || 'footer-01';
  const is916 = template.aspectRatio === '9:16';

  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Live Canvas / Video Preview Area - Renders the FULL complete poster design */}
      <div
        onClick={() => onSelectTemplate(template)}
        className={`w-full cursor-pointer ${
          is916 ? 'aspect-[9/16]' : 'aspect-square'
        } relative overflow-hidden select-none bg-slate-950`}
        title="क्लिक करा - पूर्ण पोस्टर प्रिव्ह्यू व कस्टमाईज करा"
      >
        {/* Full Complete Real-Time Renderable Poster */}
        <RenderablePoster
          id={`card-poster-${template.id}`}
          template={template}
          profile={activeProfile}
          frameId={effectiveFrameId}
          aspectRatio={is916 ? '9:16' : '1:1'}
          showFooter={true}
          footerConfig={frameConfig}
          customBgImage={template.customBgImage || template.customBgUrl}
          customBgGradient={template.theme?.bgGradient}
          customElements={template.customElements || template.elements || []}
          customHeadline={template.headline}
          customSubtext={template.subtext}
          customQuote={template.quote}
          isCardPreview={true}
          className="w-full h-full transform group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Top Indicators: Date, Format, VIP, New */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[10px] z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(template.isCustomUpload || template.isNew || template.isJustUploaded || (template.createdAt && (Date.now() - new Date(template.createdAt).getTime()) < 86400000 * 7)) && (
              <span className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md animate-pulse text-[9px] uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" /> नवीन
              </span>
            )}
            {template.dateBadge && (
              <span className="bg-black/75 text-amber-300 border border-amber-400/40 px-2 sm:px-2.5 py-0.5 rounded-full font-bold uppercase backdrop-blur-md shadow-md">
                {template.dateBadge}
              </span>
            )}
            {template.isVideo && (
              <span className="bg-emerald-600/90 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Video className="w-3 h-3 fill-current" /> {template.videoDuration || '0:15'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            {template.isVIP ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenVIPModal?.();
                }}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Crown className="w-3 h-3 fill-current" /> VIP
              </button>
            ) : (
              <span className="bg-black/50 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                FREE
              </span>
            )}

            {is916 && (
              <span className="bg-black/60 text-white border border-white/20 px-1.5 py-0.5 rounded-md font-bold text-[9px] flex items-center gap-0.5">
                <Smartphone className="w-2.5 h-2.5" /> 9:16
              </span>
            )}
          </div>
        </div>

        {/* Animated Video Play Button Overlay if Video */}
        {template.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl ring-4 ring-white/40 animate-pulse">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
            </div>
          </div>
        )}

        {/* Subtle Hover Action Indicator (DOES NOT hide the poster design!) */}
        <div
          className={`absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-200 z-30 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 shadow-xl">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>पूर्ण पोस्टर प्रिव्ह्यू पहा</span>
          </div>
        </div>
      </div>

      {/* Card Bottom Meta & Actions Bar */}
      <div className="p-2.5 sm:p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
        {/* Title & Badge */}
        <div className="flex items-center justify-between gap-1.5 min-w-0">
          <div className="min-w-0 flex-1">
            <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
              {template.titleNative || template.title}
            </h5>
            <p className="text-[10px] text-slate-500 truncate font-medium">
              {template.titleNative ? template.title : (template.category || 'HD पोस्टर')}
            </p>
          </div>
          {template.dateBadge && (
            <span className="shrink-0 text-[9px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80 px-1.5 py-0.5 rounded-md">
              {template.dateBadge}
            </span>
          )}
        </div>

        {/* 3 High-Contrast, Touch-Friendly Action Buttons */}
        <div className="grid grid-cols-3 gap-1 pt-0.5">
          {/* WhatsApp Direct Share */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShareWhatsApp(template);
            }}
            className="py-1.5 px-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
            title="थेट WhatsApp वर पाठवा"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span className="truncate font-semibold">Share</span>
          </button>

          {/* Auto Video Generator */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenVideo) {
                onOpenVideo(template);
              } else {
                onSelectTemplate(template);
              }
            }}
            className="py-1.5 px-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 text-rose-800 text-[11px] font-black flex items-center justify-center gap-1 transition-all"
            title="🎬 या पोस्टरचा ऑटो व्हिडिओ बनवा"
          >
            <Video className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
            <span className="truncate font-bold">व्हिडिओ</span>
          </button>

          {/* Instant 1-Tap Download */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickDownload(template);
            }}
            className="py-1.5 px-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs transition-all"
            title="लगेच पोस्टर डाऊनलोड करा"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="truncate">डाऊनलोड</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const BrandsLivePosterCard = memo(BrandsLivePosterCardComponent);

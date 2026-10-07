import React from 'react';
import {
  AspectRatio,
  BusinessProfile,
  CanvasCustomElement,
  FrameId,
  PosterTemplate,
  FooterFrameConfig,
} from '../types';
import { BrandFrameRenderer } from './BrandFrameRenderer';
import { MotifGraphics } from './MotifGraphics';
import { ElementRenderer } from './elements/ElementRenderer';
import { TextStyleProps, MotifStyleProps } from './canvas/CanvasFloatingToolbar';
import { FOOTER_FRAMES } from '../data/footerFrames';

export interface RenderablePosterProps {
  template: PosterTemplate;
  profile: BusinessProfile;
  frameId?: FrameId;
  aspectRatio?: AspectRatio;
  showFooter?: boolean;
  customHeadline?: string;
  customSubtext?: string;
  customQuote?: string;
  customBgImage?: string | null;
  customBgGradient?: string;
  companyLogoUrl?: string | null;
  companyLogoPosition?: { x: number; y: number; size: number };
  customElements?: CanvasCustomElement[];
  headlineStyle?: Partial<TextStyleProps>;
  subtextStyle?: Partial<TextStyleProps>;
  quoteStyle?: Partial<TextStyleProps>;
  dateBadgeStyle?: Partial<TextStyleProps>;
  motifStyle?: Partial<MotifStyleProps>;
  footerConfig?: Partial<FooterFrameConfig>;
  isHighResExport?: boolean;
  isCardPreview?: boolean;
  id?: string;
  className?: string;
}

export const RenderablePoster = React.forwardRef<HTMLDivElement, RenderablePosterProps>(
  (
    {
      template,
      profile,
      frameId,
      aspectRatio = template.aspectRatio || '1:1',
      showFooter = true,
      customHeadline,
      customSubtext,
      customQuote,
      customBgImage,
      customBgGradient,
      companyLogoUrl,
      companyLogoPosition,
      customElements = [],
      headlineStyle,
      subtextStyle,
      quoteStyle,
      dateBadgeStyle,
      motifStyle,
      footerConfig,
      isHighResExport = false,
      isCardPreview = false,
      id,
      className = '',
    },
    ref
  ) => {
    const effectiveFrameId = frameId || template.defaultFrameId || 'footer-01';
    const frameDef = FOOTER_FRAMES.find((f) => f.id === effectiveFrameId);
    const isPopOutFrame = frameDef?.hasLeaderPhoto || frameDef?.category === 'banner-portrait';
    const shouldRenderTopLogo =
      (frameDef?.hasTopLogo === true) ||
      (frameDef?.category === 'top-right-logo') ||
      (footerConfig?.showTopLogo === true);

    const bgGradient =
      customBgGradient || template.theme?.bgGradient || 'from-amber-800 via-stone-900 to-amber-950';
    const effectiveBgImage =
      customBgImage !== undefined
        ? customBgImage
        : template.customBgImage ||
          template.customBgUrl ||
          (template.motifType === 'custom-image' ? template.imageUrl : undefined);

    const effectiveCustomElements =
      customElements && customElements.length > 0
        ? customElements
        : template.customElements || template.elements || [];

    // Dynamic Frame Height Sizing (Admin Adjustable: Compact 14%, Regular 18%, Large 24%, Extra Large 28%, or 10-35% Slider)
    const effectiveFooterHeightPercent = (() => {
      if (footerConfig?.frameHeightPercent) {
        return Math.min(Math.max(footerConfig.frameHeightPercent, 10), 35);
      }
      if (footerConfig?.frameSizePreset === 'compact') return 14;
      if (footerConfig?.frameSizePreset === 'regular') return 18;
      if (footerConfig?.frameSizePreset === 'large') return 24;
      if (footerConfig?.frameSizePreset === 'extralarge') return 28;
      return 20;
    })();

    const effectiveHeadline =
      customHeadline !== undefined ? customHeadline : template.headline;
    const effectiveSubtext =
      customSubtext !== undefined ? customSubtext : template.subtext;
    const effectiveQuote =
      customQuote !== undefined ? customQuote : template.quote || '';
    const effectiveDateBadge =
      dateBadgeStyle?.text !== undefined ? dateBadgeStyle.text : template.dateBadge;

    const is916 = aspectRatio === '9:16';
    const is45 = aspectRatio === '4:5';

    // Canonical aspect ratio classes
    const aspectClass = is916
      ? 'aspect-[9/16]'
      : is45
      ? 'aspect-[4/5]'
      : 'aspect-[1/1]';

    const containerClasses = isHighResExport
      ? is916
        ? 'w-[1080px] h-[1920px]'
        : is45
        ? 'w-[1080px] h-[1350px]'
        : 'w-[1080px] h-[1080px]'
      : `${aspectClass} w-full`;

    return (
      <div
        ref={ref}
        id={id || "renderable-poster-stage"}
        className={`relative overflow-hidden flex flex-col justify-between select-none bg-gradient-to-br ${bgGradient} ${containerClasses} ${className}`}
        style={{
          boxSizing: 'border-box',
        }}
      >
        {/* 1. Optional Custom Background Image */}
        {effectiveBgImage && (
          <img
            src={effectiveBgImage}
            alt="Poster background"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-90"
            crossOrigin="anonymous"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}

        {/* 2. Main Design Safe Area: Dynamically scaled based on footer height percent */}
        <div
          className="relative z-10 w-full flex flex-col justify-between overflow-hidden"
          style={{
            height: showFooter ? `${100 - effectiveFooterHeightPercent}%` : '100%',
          }}
        >
          {/* Top Header Bar: Date Badge & Top-Right Logo */}
          <div
            className={`relative z-20 flex items-center justify-between ${
              isHighResExport
                ? 'p-8'
                : isCardPreview
                ? 'p-2 sm:p-2.5'
                : 'p-3 sm:p-4'
            }`}
          >
            {/* Top Date / Festive Badge */}
            {!dateBadgeStyle?.isHidden && effectiveDateBadge ? (
              <div
                className={`bg-black/60 text-amber-300 border border-amber-400/40 rounded-full font-extrabold uppercase backdrop-blur-md shadow-lg flex items-center justify-center ${
                  isHighResExport
                    ? 'px-6 py-2 text-xl tracking-wider'
                    : isCardPreview
                    ? 'px-2 py-0.5 text-[9px]'
                    : 'px-2.5 sm:px-3 py-0.5 text-[10px] sm:text-xs'
                }`}
                style={{
                  color: dateBadgeStyle?.color || '#fde047',
                }}
              >
                <span>★ {effectiveDateBadge} ★</span>
              </div>
            ) : (
              <div />
            )}

            {/* Dedicated Top-Right Company Logo: Spacing above & NO background box */}
            {shouldRenderTopLogo && companyLogoUrl && companyLogoUrl.trim() !== '' && (
              <div
                className={`mt-1.5 sm:mt-2.5 flex items-center justify-center bg-transparent border-0 shadow-none ${
                  isHighResExport ? 'w-28 h-28' : isCardPreview ? 'w-9 h-9 sm:w-11 sm:h-11' : 'w-11 h-11 sm:w-14 sm:h-14'
                }`}
                title="ब्रँड लोगो"
              >
                <img
                  src={companyLogoUrl}
                  alt="Company Logo"
                  className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)]"
                  crossOrigin="anonymous"
                />
              </div>
            )}
          </div>

          {/* Center Section: Motif Graphic, Headline, Subtext & Quote */}
          <div
            className={`flex-1 relative z-10 flex flex-col items-center justify-center text-center ${
              isHighResExport
                ? 'px-14 py-4'
                : isCardPreview
                ? 'px-2 py-1 sm:px-3.5'
                : 'px-4 py-2 sm:px-6'
            }`}
          >
            {/* Motif Graphic / Artwork */}
            {!motifStyle?.isHidden && (
              <div
                className={`flex items-center justify-center transition-transform duration-300 drop-shadow-2xl ${
                  isHighResExport
                    ? is916
                      ? 'w-96 h-96 mb-6'
                      : is45
                      ? 'w-88 h-88 mb-5'
                      : 'w-80 h-80 mb-6'
                    : isCardPreview
                    ? is916
                      ? 'w-20 h-20 sm:w-26 sm:h-26 mb-1'
                      : is45
                      ? 'w-18 h-18 sm:w-22 sm:h-22 mb-1'
                      : 'w-16 h-16 sm:w-20 sm:h-20 mb-1'
                    : is916
                    ? 'w-24 h-24 sm:w-32 sm:h-32 mb-2'
                    : is45
                    ? 'w-24 h-24 sm:w-30 sm:h-30 mb-2'
                    : 'w-20 h-20 sm:w-28 sm:h-28 mb-2'
                }`}
                style={{
                  transform: motifStyle?.scale ? `scale(${motifStyle.scale})` : undefined,
                }}
              >
                <MotifGraphics
                  type={motifStyle?.type || template.motifType}
                  imageUrl={template.imageUrl}
                  className="w-full h-full"
                  primaryColor={motifStyle?.primaryColor || template.theme?.primaryColor || '#f59e0b'}
                  accentColor={motifStyle?.accentColor || template.theme?.accentColor || '#fbbf24'}
                />
              </div>
            )}

            {/* Main Headline */}
            {!headlineStyle?.isHidden && effectiveHeadline && (
              <h2
                className={`font-black tracking-wide leading-tight px-2 drop-shadow-lg ${
                  isHighResExport
                    ? is916
                      ? 'text-5xl mb-4 max-w-[90%]'
                      : is45
                      ? 'text-5xl mb-4 max-w-[88%]'
                      : 'text-5xl mb-4 max-w-[90%]'
                    : isCardPreview
                    ? is916
                      ? 'text-xs sm:text-sm mb-1 max-w-[95%] line-clamp-2'
                      : is45
                      ? 'text-xs sm:text-sm mb-1 max-w-[92%] line-clamp-2'
                      : 'text-xs sm:text-[13px] mb-1 max-w-[95%] line-clamp-2'
                    : is916
                    ? 'text-base sm:text-xl mb-1 max-w-[95%]'
                    : is45
                    ? 'text-base sm:text-lg mb-1 max-w-[92%]'
                    : 'text-sm sm:text-base lg:text-lg mb-1 max-w-[95%]'
                }`}
                style={{
                  color: headlineStyle?.color || '#ffffff',
                  fontFamily:
                    headlineStyle?.fontFamily ||
                    "'Yatra One', 'Rozha One', 'Noto Sans Devanagari', cursive, sans-serif",
                  textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)',
                }}
              >
                {effectiveHeadline}
              </h2>
            )}

            {/* Subtext / Shloka / Wish */}
            {!subtextStyle?.isHidden && effectiveSubtext && (
              <p
                className={`font-semibold leading-snug px-3 drop-shadow-md ${
                  isHighResExport
                    ? is916
                      ? 'text-3xl mb-4 max-w-[85%]'
                      : is45
                      ? 'text-3xl mb-3 max-w-[85%]'
                      : 'text-3xl mb-4 max-w-[85%]'
                    : isCardPreview
                    ? is916
                      ? 'text-[10px] sm:text-[11px] mb-0.5 max-w-[95%] line-clamp-2'
                      : is45
                      ? 'text-[10px] sm:text-[11px] mb-0.5 max-w-[90%] line-clamp-2'
                      : 'text-[10px] sm:text-[11px] mb-0.5 max-w-[95%] line-clamp-2'
                    : is916
                    ? 'text-xs sm:text-sm mb-1 max-w-[95%]'
                    : is45
                    ? 'text-xs sm:text-sm mb-1 max-w-[90%]'
                    : 'text-[11px] sm:text-xs mb-1 max-w-[95%]'
                }`}
                style={{
                  color: subtextStyle?.color || '#fef3c7',
                  fontFamily:
                    subtextStyle?.fontFamily ||
                    "'Baloo 2', 'Noto Sans Devanagari', sans-serif",
                  textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                }}
              >
                {effectiveSubtext}
              </p>
            )}

            {/* Inspirational Quote / Mantra */}
            {!quoteStyle?.isHidden && effectiveQuote && (
              <p
                className={`font-medium italic leading-relaxed px-4 ${
                  isHighResExport
                    ? is916
                      ? 'text-2xl max-w-[80%]'
                      : is45
                      ? 'text-2xl max-w-[80%]'
                      : 'text-2xl max-w-[80%]'
                    : isCardPreview
                    ? 'text-[9px] sm:text-[10px] max-w-[92%] line-clamp-1'
                    : is916
                    ? 'text-[10px] sm:text-xs max-w-[90%]'
                    : is45
                    ? 'text-[10px] sm:text-xs max-w-[85%]'
                    : 'text-[9px] sm:text-[11px] max-w-[90%]'
                }`}
                style={{
                  color: quoteStyle?.color || '#fef08a',
                  fontFamily:
                    quoteStyle?.fontFamily ||
                    "'Playfair Display', 'Gotu', 'Noto Sans Devanagari', serif",
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                }}
              >
                “{effectiveQuote}”
              </p>
            )}
          </div>

          {/* Custom Canvas Elements Layer */}
          {effectiveCustomElements.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {effectiveCustomElements.map((el) => {
                if (el.isHidden) return null;
                return (
                  <div
                    key={el.id}
                    className="absolute"
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg)`,
                    }}
                  >
                    <ElementRenderer
                      element={el}
                      scale={isHighResExport ? 2.5 : isCardPreview ? 0.75 : 1}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Business Footer Safe Area: Dynamically scaled height (Admin Adjustable) */}
        {showFooter && (
          <div
            className={`relative z-30 w-full flex flex-col justify-end ${
              isPopOutFrame ? 'overflow-visible' : 'overflow-hidden'
            }`}
            style={{
              height: `${effectiveFooterHeightPercent}%`,
              borderRadius: footerConfig?.borderRadius ? `${footerConfig.borderRadius}px` : undefined,
              borderWidth: footerConfig?.borderWidth ? `${footerConfig.borderWidth}px` : undefined,
              borderColor: footerConfig?.borderColor,
            }}
          >
            <BrandFrameRenderer
              frameId={effectiveFrameId}
              profile={profile}
              config={footerConfig}
              accentColor={template.theme?.primaryColor || '#f59e0b'}
              isPosterBackgroundDark={true}
              isHighResExport={isHighResExport}
              isCompact={isCardPreview || footerConfig?.paddingLevel === 'compact'}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    );
  }
);

RenderablePoster.displayName = 'RenderablePoster';

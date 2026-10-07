import React from 'react';
import { BusinessProfile, FrameId, FooterColorMode, LogoShape, FooterFrameConfig } from '../../types';
import { Phone, Building2, User, Briefcase, Sparkles, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { FOOTER_FRAMES } from '../../data/footerFrames';

interface FooterFrameRendererProps {
  frameId: FrameId;
  profile: BusinessProfile;
  config?: Partial<FooterFrameConfig>;
  accentColor?: string;
  className?: string;
  isPosterBackgroundDark?: boolean;
  isHighResExport?: boolean;
}

export const FooterFrameRenderer: React.FC<FooterFrameRendererProps> = ({
  frameId,
  profile,
  config,
  accentColor = '#f59e0b',
  className = '',
  isPosterBackgroundDark = true,
  isHighResExport = false,
}) => {
  const safeConfig: Partial<FooterFrameConfig> = config || {};
  const normalizedId = frameId.startsWith('footer-') ? frameId : 'footer-01';
  const frameDef = FOOTER_FRAMES.find((f) => f.id === normalizedId);

  // Extract the ONLY 5 supported fields independently
  const showPersonal = safeConfig.showPersonalName !== false;
  const showCompany = safeConfig.showCompanyName !== false;
  const showDesignation = safeConfig.showDesignation !== false;
  const showMobile = safeConfig.showMobileNumber !== false;
  const showWork = safeConfig.showCompanyWork !== false;

  const personalName = showPersonal && profile.ownerName ? profile.ownerName.trim() : '';
  const companyName = showCompany && profile.name ? profile.name.trim() : '';
  const designation = showDesignation && profile.designation ? profile.designation.trim() : '';
  const mobileNumber = showMobile && (profile.phone || profile.whatsapp) ? (profile.phone || profile.whatsapp).trim() : '';
  const companyWork = showWork && (profile.tagline || (profile as any).companyWork) ? (profile.tagline || (profile as any).companyWork).trim() : '';
  const logoUrl = profile.logoUrl && profile.logoUrl.trim() !== '' ? profile.logoUrl : null;

  // Determine active count of fields for smart fitting
  const activeFieldsCount = [personalName, companyName, designation, mobileNumber, companyWork].filter(Boolean).length;

  // Determine Color Mode (Auto / Light / Dark / Custom)
  const isLightFrame = frameDef?.isLightBg || false;
  const isDarkTheme = !isLightFrame;
  const effectiveAccent = safeConfig.accentColor || frameDef?.accent || accentColor || '#f59e0b';
  const customBg = safeConfig.bgColor;
  const customText = safeConfig.textColor;
  const customBorder = safeConfig.borderColor;
  const customFont = safeConfig.fontFamily || "'Baloo 2', 'Noto Sans Devanagari', sans-serif";

  // Base Theme Colors from Central Frame Style Definition
  const themeBg = customBg
    ? customBg
    : frameDef?.backgroundColor || (isDarkTheme ? '#0c192e' : '#ffffff');

  const themeTextPrimary = customText
    ? customText
    : frameDef?.textColor || (isDarkTheme ? '#ffffff' : '#0f172a');

  const themeTextSecondary = customText
    ? customText
    : frameDef?.mutedTextColor || (isDarkTheme ? '#cbd5e1' : '#475569');

  const themeBorder = customBorder
    ? customBorder
    : frameDef?.borderColor || (isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)');

  // Helper for Right-Side Logo Container Rendering
  const renderRightLogo = (shape: LogoShape = 'rounded') => {
    if (!logoUrl) return null;

    let shapeClasses = 'rounded-xl';
    let clipPathStyle: string | undefined = undefined;

    switch (shape) {
      case 'circle':
        shapeClasses = 'rounded-full';
        break;
      case 'square':
        shapeClasses = 'rounded-none';
        break;
      case 'rounded':
        shapeClasses = 'rounded-2xl';
        break;
      case 'hexagon':
        shapeClasses = 'rounded-lg';
        clipPathStyle = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        break;
      case 'badge':
        shapeClasses = 'rounded-b-2xl rounded-t-lg';
        break;
      case 'cut-corner':
        clipPathStyle = 'polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)';
        break;
      case 'freeform':
        shapeClasses = 'rounded-[35%_65%_60%_40%/50%_45%_55%_50%]';
        break;
    }

    const logoSize = safeConfig.logoSize || 46;

    return (
      <div className="shrink-0 pl-2 self-center flex items-center justify-center">
        <div
          className={`relative p-1 flex items-center justify-center bg-white/95 border shadow-md transition-all ${shapeClasses}`}
          style={{
            width: `${logoSize}px`,
            height: `${logoSize}px`,
            borderColor: effectiveAccent,
            clipPath: clipPathStyle,
          }}
        >
          <img
            src={logoUrl}
            alt="Business Logo"
            className="w-full h-full object-contain pointer-events-none"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  };

  // Reusable Mobile Badge
  const renderMobileBadge = (variant: 'solid' | 'outline' | 'pill' | 'minimal' = 'pill') => {
    if (!mobileNumber) return null;

    if (variant === 'solid') {
      return (
        <div
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-slate-950 shadow-xs shrink-0"
          style={{ backgroundColor: effectiveAccent }}
        >
          <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
          <span className="font-mono tracking-tight">{mobileNumber}</span>
        </div>
      );
    }

    if (variant === 'outline') {
      return (
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold shrink-0 border"
          style={{
            borderColor: `${effectiveAccent}80`,
            color: isDarkTheme ? '#34d399' : '#059669',
            backgroundColor: isDarkTheme ? 'rgba(6, 78, 59, 0.4)' : 'rgba(209, 250, 229, 0.7)',
          }}
        >
          <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
          <span className="font-mono">{mobileNumber}</span>
        </div>
      );
    }

    // Default Pill
    return (
      <div
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shadow-xs shrink-0 border"
        style={{
          borderColor: `${effectiveAccent}70`,
          backgroundColor: isDarkTheme ? 'rgba(15, 23, 42, 0.85)' : 'rgba(241, 245, 249, 0.95)',
          color: isDarkTheme ? '#4ade80' : '#16a34a',
        }}
      >
        <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
        <span className="font-mono">{mobileNumber}</span>
      </div>
    );
  };

  // Reusable Work / Business Tagline
  const renderCompanyWork = (alignment: 'left' | 'center' | 'right' = 'left') => {
    if (!companyWork) return null;
    return (
      <p
        className={`text-[9.5px] sm:text-[10.5px] line-clamp-1 italic tracking-wide ${
          alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'
        }`}
        style={{ color: themeTextSecondary }}
      >
        {companyWork}
      </p>
    );
  };

  // ----------------------------------------------------
  // RENDER SWITCH FOR ALL 27 UNIQUE FRAME DESIGNS
  // ----------------------------------------------------
  const renderFrameContent = () => {
    switch (normalizedId) {
      // ==========================================
      // CATEGORY 1: 10 STANDARD FOOTER FRAMES
      // ==========================================

      // 1. FRAME 01 — CLEAN CORPORATE
      case 'footer-01':
        return (
          <div className="w-full h-full flex flex-col justify-between py-1.5 px-3 sm:px-4 border-t" style={{ borderColor: effectiveAccent }}>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0 flex items-baseline gap-2">
                {personalName && (
                  <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>
                    {personalName}
                  </h4>
                )}
                {designation && (
                  <span className="text-[10px] sm:text-[11px] font-medium opacity-80 truncate" style={{ color: themeTextSecondary }}>
                    ({designation})
                  </span>
                )}
              </div>
              {renderMobileBadge('pill')}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-1 mt-0.5 min-w-0">
              {companyName && (
                <span className="text-[11px] sm:text-xs font-bold truncate" style={{ color: effectiveAccent }}>
                  🏢 {companyName}
                </span>
              )}
              {companyWork && <span className="text-[9.5px] sm:text-[10px] opacity-75 truncate max-w-[50%]">{companyWork}</span>}
            </div>
          </div>
        );

      // 2. FRAME 02 — MODERN SPLIT
      case 'footer-02':
        return (
          <div className="w-full h-full flex flex-col justify-between py-1.5 px-3 sm:px-4 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="grid grid-cols-2 gap-2 items-center min-w-0">
              {/* Left: Personal Name + Designation */}
              <div className="min-w-0 text-left">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <p className="text-[9.5px] sm:text-[10.5px] opacity-80 truncate" style={{ color: themeTextSecondary }}>{designation}</p>}
              </div>
              {/* Right: Company Name + Phone */}
              <div className="min-w-0 text-right flex flex-col items-end">
                {companyName && <span className="font-bold text-[11px] sm:text-xs truncate max-w-full" style={{ color: effectiveAccent }}>{companyName}</span>}
                {mobileNumber && <span className="font-mono text-[10px] font-semibold text-emerald-400">{mobileNumber}</span>}
              </div>
            </div>
            {companyWork && (
              <div className="pt-0.5 border-t border-white/10 text-center">
                {renderCompanyWork('center')}
              </div>
            )}
          </div>
        );

      // 3. FRAME 03 — BOLD BUSINESS
      case 'footer-03':
        return (
          <div className="w-full h-full flex flex-col justify-between p-2 sm:px-4 border-t-4" style={{ borderColor: effectiveAccent }}>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: effectiveAccent }} />
                {personalName && (
                  <h4 className="font-black text-xs sm:text-sm tracking-wide truncate" style={{ color: themeTextPrimary }}>
                    {personalName}
                  </h4>
                )}
                {designation && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/10 font-bold truncate" style={{ color: themeTextSecondary }}>
                    {designation}
                  </span>
                )}
              </div>
              {renderMobileBadge('solid')}
            </div>
            <div className="flex items-center justify-between gap-2 min-w-0 pt-0.5">
              {companyName && <span className="text-xs font-black truncate" style={{ color: effectiveAccent }}>{companyName}</span>}
              {companyWork && <span className="text-[9.5px] opacity-80 truncate max-w-[45%]">{companyWork}</span>}
            </div>
          </div>
        );

      // 4. FRAME 04 — ELEGANT LINE
      case 'footer-04':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center py-1.5 px-3 text-center">
            <div className="w-full flex items-center justify-center gap-2 mb-0.5">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-amber-500/60" />
              {personalName && <h4 className="font-black text-xs sm:text-sm tracking-wider px-2" style={{ color: effectiveAccent }}>{personalName}</h4>}
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-amber-500/60" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[10px] sm:text-[11px] font-medium" style={{ color: themeTextPrimary }}>
              {companyName && <span className="font-bold">{companyName}</span>}
              {designation && <span className="opacity-80">• {designation}</span>}
              {mobileNumber && <span className="font-mono text-emerald-400 font-bold">• 📞 {mobileNumber}</span>}
            </div>
            {renderCompanyWork('center')}
          </div>
        );

      // 5. FRAME 05 — LEFT ACCENT
      case 'footer-05':
        return (
          <div className="w-full h-full flex items-center py-1 px-3 gap-2.5">
            <div className="w-1.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: effectiveAccent }} />
            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0 flex items-baseline gap-1.5">
                  {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                  {designation && <span className="text-[10px] opacity-75 truncate" style={{ color: themeTextSecondary }}>| {designation}</span>}
                </div>
                {renderMobileBadge('pill')}
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0 text-[10px]">
                {companyName && <span className="font-bold truncate" style={{ color: effectiveAccent }}>🏢 {companyName}</span>}
                {companyWork && <span className="opacity-80 italic truncate max-w-[50%]">{companyWork}</span>}
              </div>
            </div>
          </div>
        );

      // 6. FRAME 06 — CENTERED PROFESSIONAL
      case 'footer-06':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center py-1.5 px-4 text-center border-t" style={{ borderColor: themeBorder }}>
            {personalName && (
              <h4 className="font-black text-xs sm:text-sm tracking-wide" style={{ color: themeTextPrimary }}>
                {personalName}
              </h4>
            )}
            <div className="flex flex-wrap items-center justify-center gap-x-2 text-[10px] sm:text-[11px] font-semibold my-0.5" style={{ color: themeTextSecondary }}>
              {companyName && <span style={{ color: effectiveAccent }}>{companyName}</span>}
              {designation && <span>({designation})</span>}
              {mobileNumber && <span className="font-mono text-emerald-400 font-bold">• 📞 {mobileNumber}</span>}
            </div>
            {renderCompanyWork('center')}
          </div>
        );

      // 7. FRAME 07 — BUSINESS CARD
      case 'footer-07':
        return (
          <div className="w-full h-full flex items-center justify-between py-1.5 px-3 sm:px-4 rounded-t-xl border-t border-x" style={{ borderColor: themeBorder }}>
            <div className="min-w-0 max-w-[55%]">
              {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
              {designation && <span className="text-[9.5px] opacity-80 block truncate" style={{ color: themeTextSecondary }}>{designation}</span>}
              {companyWork && <p className="text-[9px] opacity-70 italic truncate mt-0.5">{companyWork}</p>}
            </div>
            <div className="text-right min-w-0 flex flex-col items-end gap-0.5">
              {companyName && <span className="font-bold text-xs truncate max-w-full" style={{ color: effectiveAccent }}>{companyName}</span>}
              {renderMobileBadge('outline')}
            </div>
          </div>
        );

      // 8. FRAME 08 — PREMIUM BORDER
      case 'footer-08':
        return (
          <div className="w-full h-full p-1 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="w-full h-full border border-dashed rounded-lg px-3 py-1 flex flex-col justify-between" style={{ borderColor: `${effectiveAccent}60` }}>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                  {designation && <span className="text-[10px] font-medium opacity-80 truncate" style={{ color: themeTextSecondary }}>({designation})</span>}
                </div>
                {renderMobileBadge('solid')}
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0 text-[10.5px]">
                {companyName && <span className="font-bold truncate" style={{ color: effectiveAccent }}>★ {companyName}</span>}
                {companyWork && <span className="opacity-80 italic truncate max-w-[50%]">{companyWork}</span>}
              </div>
            </div>
          </div>
        );

      // 9. FRAME 09 — DOUBLE DIVIDER
      case 'footer-09':
        return (
          <div className="w-full h-full flex flex-col justify-between py-1.5 px-3 sm:px-4">
            <div className="flex items-center justify-between gap-2 border-b pb-1 min-w-0" style={{ borderColor: themeBorder }}>
              {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
              {designation && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 truncate" style={{ color: effectiveAccent }}>{designation}</span>}
            </div>
            <div className="flex items-center justify-between gap-2 pt-0.5 min-w-0">
              {companyName && <span className="font-bold text-xs truncate" style={{ color: themeTextPrimary }}>🏢 {companyName}</span>}
              {mobileNumber && <span className="font-mono text-xs font-bold text-emerald-400">📞 {mobileNumber}</span>}
            </div>
            {companyWork && <div className="text-[9.5px] opacity-75 truncate">{companyWork}</div>}
          </div>
        );

      // 10. FRAME 10 — MINIMAL MODERN
      case 'footer-10':
        return (
          <div className="w-full h-full flex items-center justify-between py-1.5 px-4">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] opacity-75 truncate" style={{ color: themeTextSecondary }}>{designation}</span>}
              </div>
              {companyName && <span className="font-bold text-[11px] sm:text-xs block truncate" style={{ color: effectiveAccent }}>{companyName}</span>}
              {companyWork && <p className="text-[9px] opacity-70 italic truncate">{companyWork}</p>}
            </div>
            {renderMobileBadge('pill')}
          </div>
        );

      // ==========================================
      // CATEGORY 2: 10 RIGHT-SIDE LOGO FOOTER FRAMES
      // ==========================================

      // 11. FRAME 11 — RIGHT SQUARE LOGO
      case 'footer-11':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 px-3 sm:px-4 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
              <div className="flex items-baseline gap-1.5 min-w-0">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] opacity-80 truncate" style={{ color: themeTextSecondary }}>({designation})</span>}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {companyName && <span className="font-bold text-xs truncate" style={{ color: effectiveAccent }}>{companyName}</span>}
                {renderMobileBadge('outline')}
              </div>
              {renderCompanyWork('left')}
            </div>
            {renderRightLogo('square')}
          </div>
        );

      // 12. FRAME 12 — RIGHT CIRCLE LOGO
      case 'footer-12':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 px-3 sm:px-4 border-t" style={{ borderColor: themeBorder }}>
            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-1">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {renderMobileBadge('pill')}
              </div>
              {companyName && <span className="font-bold text-xs truncate" style={{ color: effectiveAccent }}>{companyName}</span>}
              <div className="flex items-center gap-2 text-[10px] opacity-80 truncate">
                {designation && <span>{designation}</span>}
                {companyWork && <span>• {companyWork}</span>}
              </div>
            </div>
            {renderRightLogo('circle')}
          </div>
        );

      // 13. FRAME 13 — RIGHT ROUNDED LOGO
      case 'footer-13':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 px-3 sm:px-4 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-between h-full py-0.5">
              <div className="flex items-center justify-between gap-1">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/10 truncate" style={{ color: effectiveAccent }}>{designation}</span>}
              </div>
              <div className="flex items-center justify-between gap-1 text-[11px]">
                {companyName && <span className="font-bold truncate" style={{ color: themeTextPrimary }}>🏢 {companyName}</span>}
                {mobileNumber && <span className="font-mono text-emerald-400 font-bold">📞 {mobileNumber}</span>}
              </div>
              {renderCompanyWork('left')}
            </div>
            {renderRightLogo('rounded')}
          </div>
        );

      // 14. FRAME 14 — RIGHT HEXAGON LOGO
      case 'footer-14':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 px-3 sm:px-4">
            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
              <div className="flex items-baseline gap-2 min-w-0">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] opacity-75 truncate" style={{ color: themeTextSecondary }}>| {designation}</span>}
              </div>
              {companyName && <span className="font-black text-xs truncate" style={{ color: effectiveAccent }}>{companyName}</span>}
              <div className="flex items-center justify-between gap-2 mt-0.5">
                {companyWork && <span className="text-[9.5px] opacity-80 italic truncate">{companyWork}</span>}
                {renderMobileBadge('solid')}
              </div>
            </div>
            {renderRightLogo('hexagon')}
          </div>
        );

      // 15. FRAME 15 — RIGHT DIAGONAL LOGO
      case 'footer-15':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 pl-3 sm:pl-4 pr-1 relative overflow-hidden border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="flex-1 min-w-0 pr-3 z-10 flex flex-col justify-center">
              {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
              <div className="flex items-center gap-2 text-[10.5px]">
                {companyName && <span className="font-bold truncate" style={{ color: effectiveAccent }}>{companyName}</span>}
                {designation && <span className="opacity-80 truncate">({designation})</span>}
              </div>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                {companyWork && <span className="text-[9px] opacity-70 italic truncate">{companyWork}</span>}
                {renderMobileBadge('pill')}
              </div>
            </div>
            <div className="relative z-10">
              {renderRightLogo('rounded')}
            </div>
          </div>
        );

      // 16. FRAME 16 — RIGHT FLOATING LOGO
      case 'footer-16':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 px-3 sm:px-4 rounded-t-2xl border-t border-x" style={{ borderColor: themeBorder }}>
            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: effectiveAccent }} />
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] opacity-80 truncate" style={{ color: themeTextSecondary }}>• {designation}</span>}
              </div>
              {companyName && <span className="font-bold text-xs truncate mt-0.5" style={{ color: effectiveAccent }}>{companyName}</span>}
              <div className="flex items-center justify-between gap-1 mt-0.5">
                {companyWork && <span className="text-[9px] opacity-70 italic truncate">{companyWork}</span>}
                {renderMobileBadge('outline')}
              </div>
            </div>
            {renderRightLogo('circle')}
          </div>
        );

      // 17. FRAME 17 — RIGHT BADGE LOGO
      case 'footer-17':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 px-3 sm:px-4 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-2">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {renderMobileBadge('solid')}
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                {companyName && <span className="font-black text-xs truncate" style={{ color: effectiveAccent }}>{companyName}</span>}
                {designation && <span className="text-[10px] opacity-75 truncate" style={{ color: themeTextSecondary }}>({designation})</span>}
              </div>
              {renderCompanyWork('left')}
            </div>
            {renderRightLogo('badge')}
          </div>
        );

      // 18. FRAME 18 — RIGHT CUT-CORNER LOGO
      case 'footer-18':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 px-3 sm:px-4">
            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
              {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
              <div className="flex items-center justify-between gap-1 text-[11px]">
                {companyName && <span className="font-bold truncate" style={{ color: effectiveAccent }}>🏢 {companyName}</span>}
                {mobileNumber && <span className="font-mono text-emerald-400 font-bold">📞 {mobileNumber}</span>}
              </div>
              <div className="flex items-center justify-between gap-1 text-[9.5px] opacity-75 truncate">
                {designation && <span>{designation}</span>}
                {companyWork && <span>• {companyWork}</span>}
              </div>
            </div>
            {renderRightLogo('cut-corner')}
          </div>
        );

      // 19. FRAME 19 — RIGHT CREATIVE LOGO
      case 'footer-19':
        return (
          <div className="w-full h-full flex items-center justify-between py-1 px-3 sm:px-4 border-t" style={{ borderColor: themeBorder }}>
            <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] opacity-80 truncate" style={{ color: themeTextSecondary }}>({designation})</span>}
              </div>
              {companyName && <span className="font-bold text-xs truncate mt-0.5" style={{ color: effectiveAccent }}>{companyName}</span>}
              <div className="flex items-center justify-between gap-1 mt-0.5">
                {companyWork && <span className="text-[9px] opacity-75 italic truncate">{companyWork}</span>}
                {renderMobileBadge('pill')}
              </div>
            </div>
            {renderRightLogo('freeform')}
          </div>
        );

      // 20. FRAME 20 — RIGHT PREMIUM LOGO
      case 'footer-20':
        return (
          <div className="w-full h-full p-1 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="w-full h-full border border-dashed rounded-lg px-3 py-0.5 flex items-center justify-between" style={{ borderColor: `${effectiveAccent}60` }}>
              <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
                <div className="flex items-center justify-between gap-1">
                  {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                  {renderMobileBadge('solid')}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  {companyName && <span className="font-bold text-xs truncate" style={{ color: effectiveAccent }}>★ {companyName}</span>}
                  {designation && <span className="text-[10px] opacity-75 truncate" style={{ color: themeTextSecondary }}>({designation})</span>}
                </div>
                {renderCompanyWork('left')}
              </div>
              {renderRightLogo('circle')}
            </div>
          </div>
        );

      // ==========================================
      // CATEGORY 3: 7 TOP-RIGHT FLOATING LOGO FRAMES
      // ==========================================

      // 21. FRAME 21 — FLOATING CIRCLE LOGO
      case 'footer-21':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center py-1.5 px-3 text-center border-t" style={{ borderColor: themeBorder }}>
            <div className="flex items-center justify-center gap-2">
              {personalName && <h4 className="font-black text-xs sm:text-sm" style={{ color: themeTextPrimary }}>{personalName}</h4>}
              {designation && <span className="text-[10px] opacity-80" style={{ color: themeTextSecondary }}>({designation})</span>}
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px] font-bold my-0.5">
              {companyName && <span style={{ color: effectiveAccent }}>🏢 {companyName}</span>}
              {mobileNumber && <span className="font-mono text-emerald-400">📞 {mobileNumber}</span>}
            </div>
            {renderCompanyWork('center')}
          </div>
        );

      // 22. FRAME 22 — FLOATING SQUARE LOGO
      case 'footer-22':
        return (
          <div className="w-full h-full flex items-center justify-between py-1.5 px-4 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] opacity-80 truncate" style={{ color: themeTextSecondary }}>• {designation}</span>}
              </div>
              {companyName && <span className="font-bold text-xs truncate block" style={{ color: effectiveAccent }}>{companyName}</span>}
              {renderCompanyWork('left')}
            </div>
            {renderMobileBadge('pill')}
          </div>
        );

      // 23. FRAME 23 — FLOATING ROUNDED LOGO
      case 'footer-23':
        return (
          <div className="w-full h-full flex flex-col justify-between py-1 px-3 sm:px-4 rounded-t-2xl border-t border-x" style={{ borderColor: themeBorder }}>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: effectiveAccent }} />
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] opacity-80 truncate" style={{ color: themeTextSecondary }}>({designation})</span>}
              </div>
              {renderMobileBadge('solid')}
            </div>
            <div className="flex items-center justify-between gap-2 min-w-0 text-[10.5px]">
              {companyName && <span className="font-bold truncate" style={{ color: effectiveAccent }}>{companyName}</span>}
              {companyWork && <span className="opacity-80 italic truncate max-w-[50%]">{companyWork}</span>}
            </div>
          </div>
        );

      // 24. FRAME 24 — FLOATING BADGE
      case 'footer-24':
        return (
          <div className="w-full h-full flex flex-col justify-between py-1 px-3 sm:px-4 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex items-center gap-1 min-w-0">
                <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-white/10 truncate" style={{ color: effectiveAccent }}>{designation}</span>}
              </div>
              {renderMobileBadge('outline')}
            </div>
            <div className="flex items-center justify-between gap-2 min-w-0 text-[10.5px]">
              {companyName && <span className="font-bold truncate" style={{ color: themeTextPrimary }}>★ {companyName}</span>}
              {companyWork && <span className="opacity-75 italic truncate max-w-[50%]">{companyWork}</span>}
            </div>
          </div>
        );

      // 25. FRAME 25 — FLOATING FREEFORM
      case 'footer-25':
        return (
          <div className="w-full h-full flex items-center justify-between py-1.5 px-4">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <span className="text-[10px] opacity-75 truncate" style={{ color: themeTextSecondary }}>| {designation}</span>}
              </div>
              {companyName && <span className="font-black text-xs truncate block" style={{ color: effectiveAccent }}>{companyName}</span>}
              {renderCompanyWork('left')}
            </div>
            {renderMobileBadge('pill')}
          </div>
        );

      // 26. FRAME 26 — FLOATING GEOMETRIC
      case 'footer-26':
        return (
          <div className="w-full h-full flex flex-col justify-between py-1 px-3 sm:px-4 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="grid grid-cols-2 gap-2 items-center min-w-0">
              <div className="min-w-0">
                {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                {designation && <p className="text-[9.5px] opacity-75 truncate" style={{ color: themeTextSecondary }}>{designation}</p>}
              </div>
              <div className="min-w-0 text-right flex flex-col items-end">
                {companyName && <span className="font-bold text-xs truncate max-w-full" style={{ color: effectiveAccent }}>{companyName}</span>}
                {mobileNumber && <span className="font-mono text-[10px] font-bold text-emerald-400">{mobileNumber}</span>}
              </div>
            </div>
            {companyWork && <div className="pt-0.5 border-t border-white/10 text-center">{renderCompanyWork('center')}</div>}
          </div>
        );

      // 27. FRAME 27 — PREMIUM BUSINESS
      case 'footer-27':
        return (
          <div className="w-full h-full p-1 border-t-2" style={{ borderColor: effectiveAccent }}>
            <div className="w-full h-full border border-dashed rounded-lg px-3 py-0.5 flex flex-col justify-between" style={{ borderColor: `${effectiveAccent}60` }}>
              <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="min-w-0 flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-amber-400 shrink-0" />
                  {personalName && <h4 className="font-black text-xs sm:text-sm truncate" style={{ color: themeTextPrimary }}>{personalName}</h4>}
                  {designation && <span className="text-[10px] opacity-80 truncate" style={{ color: themeTextSecondary }}>({designation})</span>}
                </div>
                {renderMobileBadge('solid')}
              </div>
              <div className="flex items-center justify-between gap-2 min-w-0 text-[10.5px]">
                {companyName && <span className="font-bold truncate" style={{ color: effectiveAccent }}>★ {companyName}</span>}
                {companyWork && <span className="opacity-80 italic truncate max-w-[50%]">{companyWork}</span>}
              </div>
            </div>
          </div>
        );

      // ========================================================
      // 8 NEW BANNER POP-OUT PHOTO FRAMES (footer-28 to footer-35)
      // Contains ONLY: Marathi Name, Business, Designation, Mobile
      // Pop-out Photo rises 55% above frame height
      // ========================================================

      // 28. FRAME 28 — SAFFRON MARATHA ROYAL POP-OUT (WITH TOP LOGO)
      case 'footer-28':
        return (
          <div className="relative w-full h-full flex items-center px-4 overflow-visible" style={{ background: `linear-gradient(105deg, ${themeBg || '#7c2d12'} 0%, #991b1b 50%, #ea580c 100%)` }}>
            <div className="absolute bottom-0 left-2 sm:left-4 h-[155%] w-24 sm:w-28 flex items-end justify-center pointer-events-none z-20">
              {profile.leaderPhotoUrl ? (
                <img
                  src={profile.leaderPhotoUrl}
                  alt={personalName || 'कटआऊट फोटो'}
                  className="max-h-full w-auto object-contain drop-shadow-[0_-6px_14px_rgba(0,0,0,0.7)]"
                />
              ) : (
                <div className="w-16 h-20 bg-amber-950/70 border border-amber-400/50 rounded-t-2xl flex flex-col items-center justify-center text-amber-200 text-[10px] p-1 shadow-lg">
                  <User className="w-6 h-6 text-amber-300" />
                  <span className="text-[8px] font-bold mt-1">+ फोटो जोडा</span>
                </div>
              )}
            </div>

            <div className="w-full h-full pl-24 sm:pl-28 py-1 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-xs sm:text-base tracking-wide text-white drop-shadow truncate font-['Noto_Sans_Devanagari']">
                    {personalName || 'नाव'}
                  </span>
                  {designation && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-400 text-amber-950 truncate shadow-sm">
                      {designation}
                    </span>
                  )}
                </div>
                {renderMobileBadge('pill')}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-amber-400/30 pt-0.5 text-[11px] sm:text-xs">
                {companyName && (
                  <span className="font-bold text-amber-200 truncate flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                    {companyName}
                  </span>
                )}
                <span className="text-[10px] font-mono text-amber-300/80 shrink-0 uppercase tracking-wider">
                  भगवा बॅनर
                </span>
              </div>
            </div>
          </div>
        );

      // 29. FRAME 29 — ROYAL BLUE EXECUTIVE POP-OUT (NO LOGO)
      case 'footer-29':
        return (
          <div className="relative w-full h-full flex items-center px-4 overflow-visible" style={{ background: `linear-gradient(135deg, ${themeBg || '#0f2b5c'} 0%, #1e3a8a 60%, #0284c7 100%)` }}>
            <div className="absolute bottom-0 left-2 sm:left-4 h-[155%] w-24 sm:w-28 flex items-end justify-center pointer-events-none z-20">
              {profile.leaderPhotoUrl ? (
                <img
                  src={profile.leaderPhotoUrl}
                  alt={personalName || 'कटआऊट फोटो'}
                  className="max-h-full w-auto object-contain drop-shadow-[0_-6px_14px_rgba(0,0,0,0.7)]"
                />
              ) : (
                <div className="w-16 h-20 bg-blue-950/70 border border-cyan-400/50 rounded-t-2xl flex flex-col items-center justify-center text-cyan-200 text-[10px] p-1 shadow-lg">
                  <User className="w-6 h-6 text-cyan-300" />
                  <span className="text-[8px] font-bold mt-1">+ फोटो जोडा</span>
                </div>
              )}
            </div>

            <div className="w-full h-full pl-24 sm:pl-28 py-1 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-xs sm:text-base text-white tracking-wide truncate">
                    {personalName || 'नाव'}
                  </span>
                  {designation && (
                    <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-cyan-400 text-slate-950 truncate">
                      {designation}
                    </span>
                  )}
                </div>
                {renderMobileBadge('solid')}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-cyan-500/30 pt-0.5 text-[11px] sm:text-xs">
                {companyName && (
                  <span className="font-bold text-cyan-200 truncate flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
                    {companyName}
                  </span>
                )}
                <span className="text-[10px] font-mono text-cyan-300/80 shrink-0">
                  {mobileNumber ? `📞 ${mobileNumber}` : ''}
                </span>
              </div>
            </div>
          </div>
        );

      // 30. FRAME 30 — GOLD RAJMUDRA ONYX POP-OUT (WITH TOP LOGO)
      case 'footer-30':
        return (
          <div className="relative w-full h-full flex items-center px-4 overflow-visible border-t-2" style={{ background: themeBg || '#141416', borderColor: effectiveAccent || '#ca8a04' }}>
            <div className="absolute bottom-0 right-2 sm:right-4 h-[155%] w-24 sm:w-28 flex items-end justify-center pointer-events-none z-20">
              {profile.leaderPhotoUrl ? (
                <img
                  src={profile.leaderPhotoUrl}
                  alt={personalName || 'कटआऊट फोटो'}
                  className="max-h-full w-auto object-contain drop-shadow-[0_-6px_14px_rgba(0,0,0,0.8)]"
                />
              ) : (
                <div className="w-16 h-20 bg-neutral-900 border border-amber-500/50 rounded-t-2xl flex flex-col items-center justify-center text-amber-200 text-[10px] p-1 shadow-lg">
                  <User className="w-6 h-6 text-amber-400" />
                  <span className="text-[8px] font-bold mt-1">+ फोटो जोडा</span>
                </div>
              )}
            </div>

            <div className="w-full h-full pr-24 sm:pr-28 py-1 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-serif font-black text-xs sm:text-base tracking-wide text-amber-200 truncate drop-shadow">
                    {personalName || 'नाव'}
                  </span>
                  {designation && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold border border-amber-400/80 text-amber-300 bg-amber-950/40 truncate">
                      {designation}
                    </span>
                  )}
                </div>
                {renderMobileBadge('pill')}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-amber-500/30 pt-0.5 text-[11px] sm:text-xs">
                {companyName && (
                  <span className="font-bold text-white truncate flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400 shrink-0" />
                    {companyName}
                  </span>
                )}
                <span className="text-[10px] font-mono text-amber-400/90 shrink-0">
                  सुवर्ण राजमुद्रा
                </span>
              </div>
            </div>
          </div>
        );

      // 31. FRAME 31 — EMERALD PRESTIGE POP-OUT (NO LOGO)
      case 'footer-31':
        return (
          <div className="relative w-full h-full flex items-center px-4 overflow-visible" style={{ background: `linear-gradient(135deg, ${themeBg || '#064e3b'} 0%, #047857 70%, #059669 100%)` }}>
            <div className="absolute bottom-0 left-2 sm:left-4 h-[155%] w-24 sm:w-28 flex items-end justify-center pointer-events-none z-20">
              {profile.leaderPhotoUrl ? (
                <img
                  src={profile.leaderPhotoUrl}
                  alt={personalName || 'कटआऊट फोटो'}
                  className="max-h-full w-auto object-contain drop-shadow-[0_-6px_14px_rgba(0,0,0,0.7)]"
                />
              ) : (
                <div className="w-16 h-20 bg-emerald-950/80 border border-emerald-400/50 rounded-t-2xl flex flex-col items-center justify-center text-emerald-200 text-[10px] p-1 shadow-lg">
                  <User className="w-6 h-6 text-emerald-300" />
                  <span className="text-[8px] font-bold mt-1">+ फोटो जोडा</span>
                </div>
              )}
            </div>

            <div className="w-full h-full pl-24 sm:pl-28 py-1 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-xs sm:text-base text-white tracking-wide truncate">
                    {personalName || 'नाव'}
                  </span>
                  {designation && (
                    <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-300 text-emerald-950 truncate">
                      {designation}
                    </span>
                  )}
                </div>
                {renderMobileBadge('solid')}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-emerald-400/30 pt-0.5 text-[11px] sm:text-xs">
                {companyName && (
                  <span className="font-bold text-emerald-100 truncate flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />
                    {companyName}
                  </span>
                )}
                <span className="text-[10px] font-mono text-emerald-200/80 shrink-0">
                  {mobileNumber ? `📞 ${mobileNumber}` : ''}
                </span>
              </div>
            </div>
          </div>
        );

      // 32. FRAME 32 — DEEP NAVY MODERN LEADER (WITH TOP LOGO)
      case 'footer-32':
        return (
          <div className="relative w-full h-full flex items-center px-4 overflow-visible border-t-2" style={{ background: themeBg || '#0a1628', borderColor: effectiveAccent || '#f59e0b' }}>
            <div className="absolute bottom-0 right-2 sm:right-4 h-[155%] w-24 sm:w-28 flex items-end justify-center pointer-events-none z-20">
              {profile.leaderPhotoUrl ? (
                <img
                  src={profile.leaderPhotoUrl}
                  alt={personalName || 'कटआऊट फोटो'}
                  className="max-h-full w-auto object-contain drop-shadow-[0_-6px_14px_rgba(0,0,0,0.8)]"
                />
              ) : (
                <div className="w-16 h-20 bg-slate-900 border border-amber-500/50 rounded-t-2xl flex flex-col items-center justify-center text-amber-200 text-[10px] p-1 shadow-lg">
                  <User className="w-6 h-6 text-amber-400" />
                  <span className="text-[8px] font-bold mt-1">+ फोटो जोडा</span>
                </div>
              )}
            </div>

            <div className="w-full h-full pr-24 sm:pr-28 py-1 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-xs sm:text-base tracking-wide text-white truncate">
                    {personalName || 'नाव'}
                  </span>
                  {designation && (
                    <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-amber-500 text-slate-950 truncate">
                      {designation}
                    </span>
                  )}
                </div>
                {renderMobileBadge('pill')}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-700/60 pt-0.5 text-[11px] sm:text-xs">
                {companyName && (
                  <span className="font-bold text-amber-300 truncate flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-amber-400 shrink-0" />
                    {companyName}
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {mobileNumber ? `📞 ${mobileNumber}` : ''}
                </span>
              </div>
            </div>
          </div>
        );

      // 33. FRAME 33 — MAROON FESTIVAL CLASSIC (NO LOGO)
      case 'footer-33':
        return (
          <div className="relative w-full h-full flex items-center px-4 overflow-visible border-t-2" style={{ background: themeBg || '#3b0a0a', borderColor: effectiveAccent || '#f87171' }}>
            <div className="absolute bottom-0 left-2 sm:left-4 h-[155%] w-24 sm:w-28 flex items-end justify-center pointer-events-none z-20">
              {profile.leaderPhotoUrl ? (
                <img
                  src={profile.leaderPhotoUrl}
                  alt={personalName || 'कटआऊट फोटो'}
                  className="max-h-full w-auto object-contain drop-shadow-[0_-6px_14px_rgba(0,0,0,0.7)]"
                />
              ) : (
                <div className="w-16 h-20 bg-red-950/80 border border-red-400/50 rounded-t-2xl flex flex-col items-center justify-center text-red-200 text-[10px] p-1 shadow-lg">
                  <User className="w-6 h-6 text-red-300" />
                  <span className="text-[8px] font-bold mt-1">+ फोटो जोडा</span>
                </div>
              )}
            </div>

            <div className="w-full h-full pl-24 sm:pl-28 py-1 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-serif font-black text-xs sm:text-base text-amber-100 tracking-wide truncate">
                    {personalName || 'नाव'}
                  </span>
                  {designation && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-amber-400 text-red-950 truncate">
                      {designation}
                    </span>
                  )}
                </div>
                {renderMobileBadge('solid')}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-red-500/30 pt-0.5 text-[11px] sm:text-xs">
                {companyName && (
                  <span className="font-bold text-amber-200 truncate flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                    {companyName}
                  </span>
                )}
                <span className="text-[10px] font-mono text-red-300/80 shrink-0">
                  {mobileNumber ? `📞 ${mobileNumber}` : ''}
                </span>
              </div>
            </div>
          </div>
        );

      // 34. FRAME 34 — VIOLET DYNAMIC VIP (WITH TOP LOGO)
      case 'footer-34':
        return (
          <div className="relative w-full h-full flex items-center px-4 overflow-visible border-t-2" style={{ background: themeBg || '#2e0854', borderColor: effectiveAccent || '#c084fc' }}>
            <div className="absolute bottom-0 right-2 sm:right-4 h-[155%] w-24 sm:w-28 flex items-end justify-center pointer-events-none z-20">
              {profile.leaderPhotoUrl ? (
                <img
                  src={profile.leaderPhotoUrl}
                  alt={personalName || 'कटआऊट फोटो'}
                  className="max-h-full w-auto object-contain drop-shadow-[0_-6px_14px_rgba(0,0,0,0.8)]"
                />
              ) : (
                <div className="w-16 h-20 bg-purple-950 border border-fuchsia-400/50 rounded-t-2xl flex flex-col items-center justify-center text-fuchsia-200 text-[10px] p-1 shadow-lg">
                  <User className="w-6 h-6 text-fuchsia-400" />
                  <span className="text-[8px] font-bold mt-1">+ फोटो जोडा</span>
                </div>
              )}
            </div>

            <div className="w-full h-full pr-24 sm:pr-28 py-1 flex flex-col justify-between z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-xs sm:text-base text-white tracking-wide truncate">
                    {personalName || 'नाव'}
                  </span>
                  {designation && (
                    <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-fuchsia-400 text-slate-950 truncate">
                      {designation}
                    </span>
                  )}
                </div>
                {renderMobileBadge('pill')}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-purple-500/30 pt-0.5 text-[11px] sm:text-xs">
                {companyName && (
                  <span className="font-bold text-purple-200 truncate flex items-center gap-1">
                    <Award className="w-3 h-3 text-fuchsia-400 shrink-0" />
                    {companyName}
                  </span>
                )}
                <span className="text-[10px] font-mono text-fuchsia-300/80 shrink-0">
                  {mobileNumber ? `📞 ${mobileNumber}` : ''}
                </span>
              </div>
            </div>
          </div>
        );

      // 35. FRAME 35 — SILVER WHITE CLEAN (NO LOGO)
      case 'footer-35':
        return (
          <div className="relative w-full h-full flex items-center px-4 overflow-visible border-t-2 bg-white" style={{ borderColor: effectiveAccent || '#2563eb' }}>
            <div className="absolute bottom-0 left-2 sm:left-4 h-[155%] w-24 sm:w-28 flex items-end justify-center pointer-events-none z-20">
              {profile.leaderPhotoUrl ? (
                <img
                  src={profile.leaderPhotoUrl}
                  alt={personalName || 'कटआऊट फोटो'}
                  className="max-h-full w-auto object-contain drop-shadow-[0_-4px_10px_rgba(0,0,0,0.35)]"
                />
              ) : (
                <div className="w-16 h-20 bg-slate-100 border border-slate-300 rounded-t-2xl flex flex-col items-center justify-center text-slate-600 text-[10px] p-1 shadow-md">
                  <User className="w-6 h-6 text-blue-600" />
                  <span className="text-[8px] font-bold mt-1">+ फोटो जोडा</span>
                </div>
              )}
            </div>

            <div className="w-full h-full pl-24 sm:pl-28 py-1 flex flex-col justify-between z-10 text-slate-900">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-xs sm:text-base text-slate-900 tracking-wide truncate">
                    {personalName || 'नाव'}
                  </span>
                  {designation && (
                    <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-blue-600 text-white truncate">
                      {designation}
                    </span>
                  )}
                </div>
                {renderMobileBadge('solid')}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-0.5 text-[11px] sm:text-xs">
                {companyName && (
                  <span className="font-bold text-blue-700 truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
                    {companyName}
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-600 shrink-0 font-bold">
                  {mobileNumber ? `📞 ${mobileNumber}` : ''}
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // If no fields are enabled or all 5 fields are empty, render minimal clean container
  if (activeFieldsCount === 0 && !logoUrl) {
    return null;
  }

  const isPopOutFrame = frameDef?.hasLeaderPhoto || frameDef?.category === 'banner-portrait';

  return (
    <div
      className={`w-full flex flex-col justify-center select-none transition-all ${isPopOutFrame ? 'overflow-visible relative' : 'overflow-hidden'} ${className}`}
      style={{
        backgroundColor: themeBg,
        color: themeTextPrimary,
        fontFamily: customFont,
        fontSize: safeConfig.customFontSize ? `${safeConfig.customFontSize}px` : undefined,
        fontWeight: safeConfig.isBold ? 800 : undefined,
        borderRadius: safeConfig.borderRadius ? `${safeConfig.borderRadius}px` : undefined,
        borderWidth: safeConfig.borderWidth ? `${safeConfig.borderWidth}px` : undefined,
        borderColor: safeConfig.borderColor || themeBorder,
      }}
    >
      {renderFrameContent()}
    </div>
  );
};

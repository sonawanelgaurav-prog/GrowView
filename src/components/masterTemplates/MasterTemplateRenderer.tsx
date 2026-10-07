import React from 'react';
import { MasterTemplate, MasterTemplateConfig, WeddingFormData, EngagementFormData, ResumeFormData } from '../../types';
import { ElementRenderer } from '../elements/ElementRenderer';
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Star,
  Sparkles,
  User,
  ShieldCheck,
  Building,
  Check,
  FolderGit2,
  Gem,
  Compass
} from 'lucide-react';
import { resolveElementDynamicContent } from '../../utils/masterTemplateElements';

interface MasterTemplateRendererProps {
  template: MasterTemplate;
  weddingData?: WeddingFormData;
  engagementData?: EngagementFormData;
  resumeData?: ResumeFormData;
  scale?: number;
  className?: string;
  isFullView?: boolean;
  backgroundOnly?: boolean;
}

export const MasterTemplateCardFrame: React.FC<{
  template: MasterTemplate;
  scale?: number;
  className?: string;
  children?: React.ReactNode;
}> = ({ template, scale = 1, className = '', children }) => {
  const cfg = template.template_config || {};
  const layout = (cfg.layoutVariant || template.layout_type || 'peshwai-royal').toLowerCase();
  const primaryColor = template.primary_color || '#800000';
  const secondaryColor = template.secondary_color || '#d4af37';
  const bgStyle = resolveBackgroundStyle(template);

  const isFloral = layout.includes('floral') || layout.includes('botanical') || layout.includes('pastel');
  const isRoseGold = layout.includes('rose-gold') || layout.includes('luxury') || layout.includes('ring');
  const isResume = template.category === 'resume';

  return (
    <div
      style={{
        ...bgStyle,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        borderRadius: cfg.cardRadius ? `${cfg.cardRadius}px` : isFloral ? '16px' : '8px',
      }}
      className={`relative w-[520px] min-h-[740px] shadow-2xl overflow-hidden select-none transition-all ${className}`}
    >
      {/* 1. Ornate Traditional / Peshwai Royal Border */}
      {!isResume && !isFloral && !isRoseGold && (
        <div 
          className="absolute inset-3 border-4 border-double pointer-events-none rounded-md z-10"
          style={{ borderColor: secondaryColor }}
        >
          <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: primaryColor }} />
          <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: primaryColor }} />
        </div>
      )}

      {/* 2. Floral Botanical Border */}
      {!isResume && isFloral && (
        <div 
          className="absolute inset-3 border-2 pointer-events-none rounded-2xl z-10"
          style={{ borderColor: `${secondaryColor}60` }}
        >
          <div className="absolute top-2 left-2 text-xs" style={{ color: secondaryColor }}>🌸</div>
          <div className="absolute top-2 right-2 text-xs" style={{ color: secondaryColor }}>🌸</div>
          <div className="absolute bottom-2 left-2 text-xs" style={{ color: secondaryColor }}>🌸</div>
          <div className="absolute bottom-2 right-2 text-xs" style={{ color: secondaryColor }}>🌸</div>
        </div>
      )}

      {/* 3. Rose Gold / Luxury Sleek Border */}
      {!isResume && isRoseGold && (
        <div 
          className="absolute inset-4 border pointer-events-none rounded-xl z-10"
          style={{ borderColor: `${secondaryColor}80` }}
        >
          <div className="absolute inset-1 border border-dashed rounded-lg opacity-40" style={{ borderColor: primaryColor }} />
        </div>
      )}

      {/* 4. Resume Clean Border */}
      {isResume && (
        <div 
          className="absolute inset-0 pointer-events-none border-t-8 z-10"
          style={{ borderColor: primaryColor }}
        />
      )}

      {children}
    </div>
  );
};

export const MasterTemplateRenderer: React.FC<MasterTemplateRendererProps> = ({
  template,
  weddingData,
  engagementData,
  resumeData,
  scale = 1,
  className = '',
  isFullView = false,
  backgroundOnly = false,
}) => {
  if (backgroundOnly) {
    return (
      <MasterTemplateCardFrame
        template={template}
        scale={scale}
        className={className}
      />
    );
  }

  const customElements = template.template_config?.customElements || [];
  if (customElements.length > 0) {
    return (
      <MasterTemplateCardFrame
        template={template}
        scale={scale}
        className={className}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {customElements.map((el) => {
            if (el.isHidden) return null;
            const resolvedContent = resolveElementDynamicContent(el, {
              weddingData,
              engagementData,
              resumeData,
            });
            const renderedEl = el.type === 'text' ? { ...el, content: resolvedContent } : el;
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg)`,
                  width: el.type === 'text' ? `${el.boxWidth || el.width || 75}%` : `${el.width || 25}%`,
                  height: el.type === 'text' ? 'auto' : `${el.height || 25}%`,
                  opacity: el.opacity ?? 1,
                  zIndex: el.zIndex || 10,
                  textAlign: el.align || 'center',
                }}
              >
                <ElementRenderer element={renderedEl} />
              </div>
            );
          })}
        </div>
      </MasterTemplateCardFrame>
    );
  }

  let content: React.ReactNode = null;

  if (template.category === 'wedding' && weddingData) {
    content = (
      <WeddingTemplateRenderer
        template={template}
        data={weddingData}
        scale={scale}
        className={className}
        isFullView={isFullView}
      />
    );
  } else if (template.category === 'engagement' && engagementData) {
    content = (
      <EngagementTemplateRenderer
        template={template}
        data={engagementData}
        scale={scale}
        className={className}
        isFullView={isFullView}
      />
    );
  } else if (template.category === 'resume' && resumeData) {
    content = (
      <ResumeTemplateRenderer
        template={template}
        data={resumeData}
        scale={scale}
        className={className}
        isFullView={isFullView}
      />
    );
  }

  if (!content) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-slate-100 text-slate-500 text-sm">
        Invalid template configuration or missing data
      </div>
    );
  }

  return <>{content}</>;
};

// =========================================================================
// HELPER: BACKGROUND STYLES
// =========================================================================
function resolveBackgroundStyle(template: MasterTemplate): React.CSSProperties {
  const cfg: Partial<MasterTemplateConfig> = (template.template_config || {}) as Partial<MasterTemplateConfig>;
  const style: React.CSSProperties = {
    backgroundColor: template.bg_color || '#ffffff',
    color: template.text_color || '#0f172a',
    fontFamily: template.font_family || 'Poppins, sans-serif',
  };

  if (cfg.bgGradient) {
    style.backgroundImage = cfg.bgGradient;
  } else if (cfg.bgImageUrl) {
    style.backgroundImage = `url("${cfg.bgImageUrl}")`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  } else if (cfg.bgPatternType === 'mandala') {
    style.backgroundImage = `radial-gradient(${template.secondary_color || '#f59e0b'}15 1.5px, transparent 1.5px), radial-gradient(${template.primary_color || '#831843'}15 1.5px, ${template.bg_color || '#ffffff'} 1.5px)`;
    style.backgroundSize = '30px 30px';
    style.backgroundPosition = '0 0, 15px 15px';
  } else if (cfg.bgPatternType === 'damask') {
    style.backgroundImage = `radial-gradient(${template.secondary_color || '#d97706'}20 2px, transparent 2px)`;
    style.backgroundSize = '24px 24px';
  } else if (cfg.bgPatternType === 'dots') {
    style.backgroundImage = `radial-gradient(#94a3b830 1px, transparent 1px)`;
    style.backgroundSize = '16px 16px';
  } else if (cfg.bgPatternType === 'geometric') {
    style.backgroundImage = `linear-gradient(135deg, ${template.secondary_color || '#d97706'}10 25%, transparent 25%), linear-gradient(225deg, ${template.secondary_color || '#d97706'}10 25%, transparent 25%), linear-gradient(45deg, ${template.secondary_color || '#d97706'}10 25%, transparent 25%), linear-gradient(315deg, ${template.secondary_color || '#d97706'}10 25%, ${template.bg_color || '#ffffff'} 25%)`;
    style.backgroundPosition = '12px 0, 12px 0, 0 0, 0 0';
    style.backgroundSize = '24px 24px';
  }

  return style;
}

// =========================================================================
// 1. WEDDING TEMPLATE RENDERER (50 UNIQUE DESIGNS - DISTINCT ARCHETYPES)
// =========================================================================
const WeddingTemplateRenderer: React.FC<{
  template: MasterTemplate;
  data: WeddingFormData;
  scale: number;
  className?: string;
  isFullView?: boolean;
}> = ({ template, data, scale, className = '', isFullView = false }) => {
  const cfg = template.template_config || {};
  const layout = cfg.layoutVariant || template.layout_type || 'peshwai-royal';
  const borderStyle = cfg.borderStyle || 'gold-double';
  const primaryColor = template.primary_color;
  const secondaryColor = template.secondary_color;
  const textColor = template.text_color || '#1e293b';

  const headingSize = cfg.headingFontSize ? `${cfg.headingFontSize}px` : undefined;
  const bodySize = cfg.bodyFontSize ? `${cfg.bodyFontSize}px` : undefined;

  const bgStyle = resolveBackgroundStyle(template);

  // Archetype A: Peshwai Royal / Traditional Heritage
  if (layout.includes('peshwai') || layout.includes('traditional') || layout.includes('wada') || layout.includes('royal')) {
    return (
      <div
        style={{
          ...bgStyle,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          fontSize: bodySize,
        }}
        className={`relative w-[520px] min-h-[740px] p-8 shadow-2xl flex flex-col justify-between select-none overflow-hidden transition-all ${className}`}
      >
        {/* Royal Ornate Border */}
        <div 
          className="absolute inset-3 border-4 border-double pointer-events-none rounded-md"
          style={{ borderColor: secondaryColor }}
        >
          <div className="absolute top-1 left-1 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: primaryColor }} />
          <div className="absolute top-1 right-1 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-1 left-1 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: primaryColor }} />
          <div className="absolute bottom-1 right-1 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: primaryColor }} />
        </div>

        {/* Peshwai Header */}
        <div className="text-center z-10 pt-3">
          <div className="flex flex-col items-center mb-2">
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-xl mb-1 shadow-md border"
              style={{ backgroundColor: `${secondaryColor}25`, color: primaryColor, borderColor: secondaryColor }}
            >
              卐
            </div>
            <p className="text-xs font-bold tracking-widest uppercase opacity-95" style={{ color: primaryColor }}>
              ॥ श्री गणेशाय नमः ॥
            </p>
            <p className="text-[10px] tracking-wider italic mt-0.5 opacity-80" style={{ color: secondaryColor }}>
              ॥ मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः ॥
            </p>
          </div>

          <h3 
            className="text-2xl font-extrabold tracking-wide mt-1"
            style={{ color: primaryColor, fontFamily: template.heading_font, fontSize: headingSize }}
          >
            ॥ शुभ विवाह ॥
          </h3>
          <p className="text-[11px] opacity-80 mt-1 max-w-sm mx-auto leading-relaxed px-2">
            {data.invitationMessage}
          </p>
        </div>

        {/* Peshwai Couple Centerpiece */}
        <div className="my-4 text-center z-10 py-3 px-4 rounded-xl border border-amber-300/40 bg-white/65 backdrop-blur-xs shadow-xs">
          <div className="py-1">
            <p className="text-xs font-semibold opacity-70 mb-0.5" style={{ color: primaryColor }}>वधू</p>
            <h1 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: primaryColor, fontFamily: template.heading_font }}
            >
              {data.brideName}
            </h1>
            <p className="text-[11px] opacity-85 mt-0.5 font-medium">
              (सुपुत्री: {data.brideParents})
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-[2px] w-20" style={{ backgroundColor: secondaryColor }} />
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs"
              style={{ backgroundColor: secondaryColor, color: '#ffffff' }}
            >
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div className="h-[2px] w-20" style={{ backgroundColor: secondaryColor }} />
          </div>

          <div className="py-1">
            <p className="text-xs font-semibold opacity-70 mb-0.5" style={{ color: primaryColor }}>वर</p>
            <h1 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: primaryColor, fontFamily: template.heading_font }}
            >
              {data.groomName}
            </h1>
            <p className="text-[11px] opacity-85 mt-0.5 font-medium">
              (सुपुत्र: {data.groomParents})
            </p>
          </div>
        </div>

        {/* Date, Muhurat & Venue */}
        <div className="z-10 bg-amber-50/80 backdrop-blur-xs rounded-xl p-3.5 border border-amber-300/60 shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
              <div>
                <p className="font-bold text-slate-900">{data.weddingDate}</p>
                <p className="text-[10px] text-slate-600">{data.weddingDay} • {data.weddingTime}</p>
              </div>
            </div>
            <span 
              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              {data.muhurat}
            </span>
          </div>

          <div className="flex items-start gap-2 pt-0.5">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
            <div>
              <p className="font-bold text-slate-900">{data.venue}</p>
              <p className="text-[10px] text-slate-700 leading-snug">{data.address}</p>
            </div>
          </div>
        </div>

        {/* Footer Host & Contact */}
        <div className="z-10 pt-3 text-center border-t border-amber-200/80">
          <p className="text-[11px] font-bold" style={{ color: primaryColor }}>
            निमंत्रक: {data.hosts}
          </p>
          {data.rsvp && (
            <p className="text-[10px] text-slate-700 mt-0.5 font-medium">
              स्नेही: {data.rsvp}
            </p>
          )}
          <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] opacity-85">
            <Phone className="w-3 h-3" />
            <span>संपर्क: {data.contactDetails}</span>
          </div>
        </div>
      </div>
    );
  }

  // Archetype B: Floral Botanical Pastel / Garden Romance
  if (layout.includes('floral') || layout.includes('botanical') || layout.includes('pastel') || layout.includes('garden')) {
    return (
      <div
        style={{
          ...bgStyle,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          fontSize: bodySize,
        }}
        className={`relative w-[520px] min-h-[740px] p-8 shadow-2xl flex flex-col justify-between select-none overflow-hidden transition-all ${className}`}
      >
        {/* Soft Floral Outline Border */}
        <div 
          className="absolute inset-4 border border-rose-300/80 rounded-2xl pointer-events-none"
        >
          <div className="absolute top-2 left-2 text-rose-400 text-lg">🌸</div>
          <div className="absolute top-2 right-2 text-rose-400 text-lg">🌸</div>
          <div className="absolute bottom-2 left-2 text-rose-400 text-lg">🌸</div>
          <div className="absolute bottom-2 right-2 text-rose-400 text-lg">🌸</div>
        </div>

        {/* Header Section */}
        <div className="text-center z-10 pt-4">
          <p className="text-xs tracking-widest uppercase font-semibold text-rose-800">
            WEDDING INVITATION
          </p>
          <p className="text-[11px] font-bold tracking-wider text-rose-700 mt-0.5">
            ॥ सस्नेह निमंत्रण ॥
          </p>
          <h3 
            className="text-2xl font-bold tracking-wide mt-2 text-rose-950"
            style={{ fontFamily: template.heading_font, fontSize: headingSize }}
          >
            शुभमंगल सावधान
          </h3>
          <p className="text-[11px] opacity-80 mt-1 max-w-sm mx-auto leading-relaxed">
            {data.invitationMessage}
          </p>
        </div>

        {/* Side-by-Side Modern Couple Layout */}
        <div className="my-5 z-10 grid grid-cols-2 gap-3">
          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-rose-200 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">वधू</span>
            <h2 className="text-xl font-bold text-rose-950" style={{ fontFamily: template.heading_font }}>
              {data.brideName}
            </h2>
            <p className="text-[10px] text-slate-600 mt-1">
              सुपुत्री: {data.brideParents}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-rose-200 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block mb-1">वर</span>
            <h2 className="text-xl font-bold text-rose-950" style={{ fontFamily: template.heading_font }}>
              {data.groomName}
            </h2>
            <p className="text-[10px] text-slate-600 mt-1">
              सुपुत्र: {data.groomParents}
            </p>
          </div>
        </div>

        {/* Date & Location Card */}
        <div className="z-10 bg-white/90 rounded-xl p-4 border border-rose-200/80 shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <div className="flex items-center gap-2 text-rose-900">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span className="font-bold">{data.weddingDate}</span>
            </div>
            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {data.muhurat}
            </span>
          </div>
          <div className="flex items-start gap-2 pt-1 text-slate-700">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">{data.venue}</p>
              <p className="text-[10px] leading-snug">{data.address}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 pt-3 text-center border-t border-rose-200/60">
          <p className="text-[11px] font-bold text-rose-900">निमंत्रक: {data.hosts}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">संपर्क: {data.contactDetails}</p>
        </div>
      </div>
    );
  }

  // Archetype C: Modern Minimal Geometric & Chic Gold
  return (
    <div
      style={{
        ...bgStyle,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        fontSize: bodySize,
      }}
      className={`relative w-[520px] min-h-[740px] p-8 shadow-2xl flex flex-col justify-between select-none overflow-hidden transition-all ${className}`}
    >
      {/* Sleek Dual Border */}
      <div 
        className="absolute inset-3 border-2 pointer-events-none rounded-sm"
        style={{ borderColor: secondaryColor }}
      >
        <div 
          className="absolute inset-1.5 border pointer-events-none"
          style={{ borderColor: `${primaryColor}40` }}
        />
      </div>

      {/* Modern Minimal Header */}
      <div className="text-center z-10 pt-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-[1px] w-10" style={{ backgroundColor: secondaryColor }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: primaryColor }}>
            ॥ श्री गणेशाय नमः ॥
          </span>
          <div className="h-[1px] w-10" style={{ backgroundColor: secondaryColor }} />
        </div>

        <h3 
          className="text-2xl font-bold tracking-wide mt-1"
          style={{ color: primaryColor, fontFamily: template.heading_font, fontSize: headingSize }}
        >
          ॥ शुभ विवाह ॥
        </h3>
        <p className="text-[11px] opacity-75 mt-1 max-w-sm mx-auto leading-relaxed">
          {data.invitationMessage}
        </p>
      </div>

      {/* Couple Names */}
      <div className="my-5 text-center z-10">
        <div className="py-2">
          <p className="text-xs font-medium opacity-70 mb-0.5">वधू</p>
          <h1 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: primaryColor, fontFamily: template.heading_font }}
          >
            {data.brideName}
          </h1>
          <p className="text-[11px] opacity-80 mt-0.5 font-medium">
            (सुपुत्री: {data.brideParents})
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 my-2">
          <div className="h-[1px] w-16" style={{ backgroundColor: `${secondaryColor}80` }} />
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs"
            style={{ backgroundColor: secondaryColor, color: '#ffffff' }}
          >
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div className="h-[1px] w-16" style={{ backgroundColor: `${secondaryColor}80` }} />
        </div>

        <div className="py-2">
          <p className="text-xs font-medium opacity-70 mb-0.5">वर</p>
          <h1 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: primaryColor, fontFamily: template.heading_font }}
          >
            {data.groomName}
          </h1>
          <p className="text-[11px] opacity-80 mt-0.5 font-medium">
            (सुपुत्र: {data.groomParents})
          </p>
        </div>
      </div>

      {/* Date & Venue */}
      <div className="z-10 bg-white/70 backdrop-blur-xs rounded-xl p-4 border border-black/5 shadow-xs space-y-2.5 text-xs">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" style={{ color: primaryColor }} />
            <div>
              <p className="font-bold text-slate-800">{data.weddingDate}</p>
              <p className="text-[10px] text-slate-500">{data.weddingDay} • {data.weddingTime}</p>
            </div>
          </div>
          <span 
            className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xs"
            style={{ backgroundColor: primaryColor }}
          >
            {data.muhurat}
          </span>
        </div>

        <div className="flex items-start gap-2 pt-0.5">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
          <div>
            <p className="font-bold text-slate-900">{data.venue}</p>
            <p className="text-[10px] text-slate-600 leading-snug">{data.address}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="z-10 pt-3 border-t border-black/5 text-center">
        <p className="text-[11px] font-bold" style={{ color: primaryColor }}>
          निमंत्रक: {data.hosts}
        </p>
        <p className="text-[10px] opacity-80 mt-0.5">संपर्क: {data.contactDetails}</p>
      </div>
    </div>
  );
};

// =========================================================================
// 2. ENGAGEMENT TEMPLATE RENDERER (50 UNIQUE DESIGNS - DISTINCT ARCHETYPES)
// =========================================================================
const EngagementTemplateRenderer: React.FC<{
  template: MasterTemplate;
  data: EngagementFormData;
  scale: number;
  className?: string;
  isFullView?: boolean;
}> = ({ template, data, scale, className = '', isFullView = false }) => {
  const cfg = template.template_config || {};
  const layout = cfg.layoutVariant || template.layout_type || 'rose-gold-luxury';
  const primaryColor = template.primary_color;
  const secondaryColor = template.secondary_color;

  const headingSize = cfg.headingFontSize ? `${cfg.headingFontSize}px` : undefined;
  const bodySize = cfg.bodyFontSize ? `${cfg.bodyFontSize}px` : undefined;

  const bgStyle = resolveBackgroundStyle(template);

  // Engagement Archetype A: Rose Gold Luxury Rings
  if (layout.includes('rose-gold') || layout.includes('luxury') || layout.includes('ring')) {
    return (
      <div
        style={{
          ...bgStyle,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          fontSize: bodySize,
        }}
        className={`relative w-[520px] min-h-[740px] p-8 shadow-2xl flex flex-col justify-between select-none overflow-hidden transition-all ${className}`}
      >
        {/* Rose Gold Filigree Border */}
        <div 
          className="absolute inset-3 border-2 border-rose-300 rounded-2xl pointer-events-none"
        >
          <div className="absolute inset-1.5 border border-dashed border-rose-400/60 rounded-xl" />
        </div>

        {/* Ring Emblem Header */}
        <div className="text-center z-10 pt-3">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-xl shadow-xs">
              💍
            </div>
          </div>
          <p className="text-[11px] font-bold tracking-widest uppercase opacity-90 text-rose-900">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <h3 
            className="text-2xl font-bold tracking-wide mt-1 text-rose-950"
            style={{ fontFamily: template.heading_font, fontSize: headingSize }}
          >
            ॥ साखरपुडा व वाङ्निश्चय ॥
          </h3>
          <p className="text-[11px] opacity-80 mt-1 max-w-sm mx-auto leading-relaxed">
            {data.invitationMessage}
          </p>
        </div>

        {/* Couple Names Centerpiece */}
        <div className="my-5 text-center z-10 bg-white/75 backdrop-blur-xs p-5 rounded-2xl border border-rose-200/80 shadow-xs">
          <div>
            <p className="text-xs font-semibold text-rose-800 mb-0.5">कन्या</p>
            <h1 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-950"
              style={{ fontFamily: template.heading_font }}
            >
              {data.brideName}
            </h1>
            <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
              (सुपुत्री: {data.brideParents})
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 my-2 text-rose-500 font-serif italic text-sm">
            <span>संग</span>
            <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center text-xs font-bold">
              💍
            </div>
            <span>संगे</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-rose-800 mb-0.5">वर</p>
            <h1 
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-950"
              style={{ fontFamily: template.heading_font }}
            >
              {data.groomName}
            </h1>
            <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
              (सुपुत्र: {data.groomParents})
            </p>
          </div>
        </div>

        {/* Event Schedule & Venue */}
        <div className="z-10 bg-white/80 rounded-xl p-4 border border-rose-200/80 shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-700" />
              <div>
                <p className="font-bold text-slate-900">{data.engagementDate}</p>
                <p className="text-[10px] text-slate-500">{data.day} • {data.time}</p>
              </div>
            </div>
            {data.ringCeremonyDetails && (
              <span className="bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {data.ringCeremonyDetails}
              </span>
            )}
          </div>

          <div className="flex items-start gap-2 pt-0.5">
            <MapPin className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">{data.venue}</p>
              <p className="text-[10px] text-slate-600 leading-snug">{data.address}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 pt-3 text-center border-t border-rose-200/60">
          <p className="text-[11px] font-bold text-rose-900">
            आपले नम्र निमंत्रक: समस्त आप्तेष्ट व परिवार
          </p>
          <p className="text-[10px] text-slate-600 mt-0.5">संपर्क: {data.contactNumber}</p>
        </div>
      </div>
    );
  }

  // Engagement Archetype B: Royal Emerald Peacock / Traditional
  return (
    <div
      style={{
        ...bgStyle,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        fontSize: bodySize,
      }}
      className={`relative w-[520px] min-h-[740px] p-8 shadow-2xl flex flex-col justify-between select-none overflow-hidden transition-all ${className}`}
    >
      <div 
        className="absolute inset-3 border-2 pointer-events-none rounded-xl"
        style={{ borderColor: `${secondaryColor}80` }}
      >
        <div 
          className="absolute inset-1.5 border pointer-events-none rounded-lg"
          style={{ borderColor: `${primaryColor}40` }}
        />
      </div>

      <div className="text-center z-10 pt-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">🦚</span>
        </div>
        <p className="text-[11px] font-bold tracking-widest uppercase opacity-90" style={{ color: primaryColor }}>
          ॥ श्री कुलदैवत प्रसन्न ॥
        </p>
        <h3 
          className="text-2xl font-bold tracking-wide mt-1"
          style={{ color: primaryColor, fontFamily: template.heading_font, fontSize: headingSize }}
        >
          ॥ साखरपुडा सोहळा ॥
        </h3>
        <p className="text-[11px] opacity-80 mt-1 max-w-sm mx-auto leading-relaxed">
          {data.invitationMessage}
        </p>
      </div>

      <div className="my-5 text-center z-10">
        <div className="py-2">
          <p className="text-xs font-medium opacity-70 mb-0.5">कन्या</p>
          <h1 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: primaryColor, fontFamily: template.heading_font }}
          >
            {data.brideName}
          </h1>
          <p className="text-[11px] opacity-80 mt-0.5 font-medium">
            (सुपुत्री: {data.brideParents})
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 my-2">
          <div className="h-[1px] w-12" style={{ backgroundColor: secondaryColor }} />
          <span className="text-xs font-bold" style={{ color: secondaryColor }}>शुभ वाङ्निश्चय</span>
          <div className="h-[1px] w-12" style={{ backgroundColor: secondaryColor }} />
        </div>

        <div className="py-2">
          <p className="text-xs font-medium opacity-70 mb-0.5">वर</p>
          <h1 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: primaryColor, fontFamily: template.heading_font }}
          >
            {data.groomName}
          </h1>
          <p className="text-[11px] opacity-80 mt-0.5 font-medium">
            (सुपुत्र: {data.groomParents})
          </p>
        </div>
      </div>

      <div className="z-10 bg-white/70 backdrop-blur-xs rounded-xl p-4 border border-black/5 shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-black/5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
            <div>
              <p className="font-bold text-slate-800">{data.engagementDate}</p>
              <p className="text-[10px] text-slate-500">{data.day} • {data.time}</p>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 pt-0.5">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: primaryColor }} />
          <div>
            <p className="font-bold text-slate-900">{data.venue}</p>
            <p className="text-[10px] text-slate-600 leading-snug">{data.address}</p>
          </div>
        </div>
      </div>

      <div className="z-10 pt-3 text-center border-t border-black/5">
        <p className="text-[11px] font-bold" style={{ color: primaryColor }}>
          आपले नम्र निमंत्रक: समस्त पाटील व जोशी परिवार
        </p>
        <p className="text-[10px] opacity-80 mt-0.5">संपर्क: {data.contactNumber}</p>
      </div>
    </div>
  );
};

// =========================================================================
// 3. RESUME / CV TEMPLATE RENDERER (50 UNIQUE DESIGNS - DISTINCT ARCHETYPES)
// =========================================================================
const ResumeTemplateRenderer: React.FC<{
  template: MasterTemplate;
  data: ResumeFormData;
  scale: number;
  className?: string;
  isFullView?: boolean;
}> = ({ template, data, scale, className = '', isFullView = false }) => {
  const cfg = template.template_config || {};
  const layout = cfg.layoutVariant || template.layout_type || 'ats-single-column';
  const primaryColor = template.primary_color || '#0f172a';
  const secondaryColor = template.secondary_color || '#2563eb';
  const textColor = template.text_color || '#0f172a';
  const bgColor = template.bg_color || '#ffffff';

  const headingSize = cfg.headingFontSize ? `${cfg.headingFontSize}px` : undefined;
  const bodySize = cfg.bodyFontSize ? `${cfg.bodyFontSize}px` : undefined;

  // -----------------------------------------------------------------------
  // RESUME ARCHETYPE 1: VIVAH BIODATA (मराठी विवाह बायोडाटा)
  // -----------------------------------------------------------------------
  if (
    layout.includes('biodata') || 
    layout.includes('vivah') || 
    template.id.includes('RES-031') || 
    template.id.includes('RES-032') || 
    template.id.includes('RES-033') || 
    template.id.includes('RES-034') || 
    template.id.includes('RES-035') || 
    template.id.includes('RES-036') || 
    template.id.includes('RES-037') || 
    template.id.includes('RES-038') || 
    template.id.includes('RES-039') || 
    template.id.includes('RES-040') ||
    template.name.toLowerCase().includes('biodata')
  ) {
    return (
      <div
        style={{
          backgroundColor: bgColor || '#fffbeb',
          color: textColor,
          fontFamily: template.font_family || 'Rozha One, Tiro Devanagari Marathi, serif',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          fontSize: bodySize,
        }}
        className={`w-[600px] min-h-[850px] p-7 shadow-2xl relative select-text border-8 border-double border-amber-500 bg-amber-50/50 flex flex-col justify-between ${className}`}
      >
        {/* Header with Ganesha */}
        <div className="text-center border-b-2 border-amber-400/80 pb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl text-amber-600 font-bold">卐</span>
            <span className="text-xs font-bold text-amber-800 tracking-widest uppercase">
              ॥ श्री गणेशाय नमः ॥
            </span>
            <span className="text-2xl text-amber-600 font-bold">卐</span>
          </div>
          <h1 
            className="text-2xl font-bold tracking-tight text-amber-950 uppercase mt-1"
            style={{ fontSize: headingSize }}
          >
            बायोडाटा (विवाह माहिती पत्रक)
          </h1>
          <p className="text-xs font-semibold text-amber-800 mt-0.5">
            ॥ कुलदैवत प्रसन्न ॥
          </p>
        </div>

        {/* Candidate Highlight Card */}
        <div className="my-3 p-3 bg-white/80 rounded-xl border border-amber-300 flex items-center gap-4">
          {data.profilePhotoUrl ? (
            <img 
              src={data.profilePhotoUrl} 
              alt={data.fullName}
              className="w-20 h-24 object-cover rounded-lg border-2 border-amber-400 shadow-sm"
            />
          ) : (
            <div className="w-20 h-24 rounded-lg bg-amber-100 border-2 border-amber-300 flex flex-col items-center justify-center text-amber-700 text-xs">
              <User className="w-8 h-8 opacity-60 mb-1" />
              <span>फोटो</span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-950">{data.fullName}</h2>
            <p className="text-xs font-semibold text-amber-800">{data.professionalTitle}</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-slate-700 mt-1.5">
              <div><strong>शिक्षण:</strong> {data.education?.[0]?.degree || 'B.E. Computer Science'}</div>
              <div><strong>नोकरी:</strong> {data.workExperience?.[0]?.company || 'TCS, Pune'}</div>
              <div><strong>पत्ता:</strong> {data.address || 'पुणे, महाराष्ट्र'}</div>
              <div><strong>संपर्क:</strong> {data.phone || '+91 98221 00000'}</div>
            </div>
          </div>
        </div>

        {/* Detailed Sections: Personal & Family Information */}
        <div className="space-y-3 text-xs">
          {/* Section: वैयक्तिक माहिती */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-1.5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              १. वैयक्तिक व जन्म पत्रिका माहिती
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-white/60 p-2.5 rounded-lg border border-amber-200">
              <div><strong>पूर्ण नाव:</strong> {data.fullName}</div>
              <div><strong>जन्म तारीख:</strong> १५ मे १९९८</div>
              <div><strong>जन्म वेळ:</strong> सकाळी ०६:३० वाजता</div>
              <div><strong>जन्म ठिकाण:</strong> सातारा, महाराष्ट्र</div>
              <div><strong>उंची:</strong> ५ फूट ८ इंच</div>
              <div><strong>रक्तगट:</strong> O +ve (पॉझिटिव्ह)</div>
              <div><strong>वर्ण:</strong> गोरा</div>
              <div><strong>रास / नक्षत्र:</strong> धनु / पूर्वाषाढा</div>
            </div>
          </div>

          {/* Section: शैक्षणिक व नोकरी माहिती */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
              २. शैक्षणिक व व्यावसायिक माहिती
            </h3>
            <div className="bg-white/60 p-2.5 rounded-lg border border-amber-200 space-y-1">
              <div><strong>उच्च शिक्षण:</strong> {data.education?.map(e => `${e.degree} (${e.institution})`).join(', ') || 'B.Tech IT - Pune University'}</div>
              <div><strong>सध्याची नोकरी:</strong> {data.workExperience?.[0]?.role} - {data.workExperience?.[0]?.company} ({data.workExperience?.[0]?.location})</div>
              <div><strong>मासिक / वार्षिक पॅकेज:</strong> ₹ १२,००,००० /- वार्षिक (वार्षिक उत्पन्न)</div>
            </div>
          </div>

          {/* Section: कौटुंबिक माहिती */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 border-b border-amber-300 pb-1 mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-300" />
              ३. कौटुंबिक माहिती
            </h3>
            <div className="bg-white/60 p-2.5 rounded-lg border border-amber-200 grid grid-cols-2 gap-x-4 gap-y-1">
              <div><strong>वडिलांचे नाव:</strong> श्री. रमेश बाबुराव पाटील (सेवानिवृत्त)</div>
              <div><strong>आईचे नाव:</strong> सौ. सुमित्रा रमेश पाटील (गृहिणी)</div>
              <div><strong>भाऊ:</strong> १ लहान भाऊ (M.S. USA)</div>
              <div><strong>बहीण:</strong> १ मोठी बहीण (विवाहित)</div>
              <div><strong>मामांचे कुल:</strong> श्री. विलास कदम, कोल्हापूर</div>
              <div><strong>नातेसंबंध:</strong> कदम, भोसले, मोहिते, जगताप</div>
            </div>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="mt-3 pt-2 border-t-2 border-amber-400 text-center text-xs">
          <p className="font-bold text-amber-950">
            संपर्क पत्ता: {data.address || 'फ्लॅट क्र. ४०२, सह्याद्री हाईट्स, कोथरूड, पुणे - ४११०३८'}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-amber-900 mt-1">
            <span>📞 फोन: {data.phone}</span>
            <span>✉️ ईमेल: {data.email}</span>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RESUME ARCHETYPE 2: MODERN SIDEBAR (एक्झिक्युटिव्ह डार्क साइडबार)
  // -----------------------------------------------------------------------
  if (layout.includes('sidebar') || layout.includes('executive') || layout.includes('modern-sidebar')) {
    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: template.font_family,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          fontSize: bodySize,
        }}
        className={`w-[600px] min-h-[850px] shadow-2xl text-left select-text flex overflow-hidden border border-slate-200 ${className}`}
      >
        {/* Left Sidebar (36%) */}
        <div 
          className="w-[36%] p-5 text-white flex flex-col justify-between"
          style={{ backgroundColor: primaryColor }}
        >
          <div>
            {/* Profile Avatar */}
            <div className="text-center mb-4">
              {data.profilePhotoUrl ? (
                <img 
                  src={data.profilePhotoUrl} 
                  alt={data.fullName}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-white/80 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full mx-auto bg-white/20 border border-white/40 flex items-center justify-center text-white font-bold text-xl">
                  {data.fullName.charAt(0)}
                </div>
              )}
              <h2 className="text-base font-bold mt-2 text-white leading-tight">
                {data.fullName}
              </h2>
              <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider mt-0.5">
                {data.professionalTitle}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-1.5 text-[10px] text-slate-200 border-t border-white/20 pt-3 mb-4">
              <p className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">CONTACT</p>
              {data.email && <div className="truncate">✉️ {data.email}</div>}
              {data.phone && <div>📞 {data.phone}</div>}
              {data.address && <div>📍 {data.address}</div>}
              {data.linkedin && <div className="truncate">🔗 {data.linkedin}</div>}
            </div>

            {/* Skills Badges */}
            {data.skills && data.skills.length > 0 && (
              <div className="border-t border-white/20 pt-3 mb-4">
                <p className="font-bold text-white uppercase tracking-wider text-[9px] mb-2">CORE SKILLS</p>
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((s, idx) => (
                    <span 
                      key={idx}
                      className="text-[9px] bg-white/15 px-2 py-0.5 rounded text-white font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {data.technicalSkills && data.technicalSkills.length > 0 && (
              <div className="border-t border-white/20 pt-2 mb-3">
                <p className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">TECHNOLOGY</p>
                <p className="text-[9px] text-slate-200 leading-relaxed">
                  {data.technicalSkills.join(', ')}
                </p>
              </div>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <div className="border-t border-white/20 pt-2">
                <p className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">LANGUAGES</p>
                <p className="text-[9px] text-slate-300">{data.languages.join(' • ')}</p>
              </div>
            )}
          </div>

          {/* Education Mini In Sidebar */}
          {data.education && data.education.length > 0 && (
            <div className="border-t border-white/20 pt-3 text-[10px]">
              <p className="font-bold text-white uppercase tracking-wider text-[9px] mb-1">EDUCATION</p>
              <p className="font-bold text-white leading-tight">{data.education[0].degree}</p>
              <p className="text-slate-300 text-[9px]">{data.education[0].institution}</p>
            </div>
          )}
        </div>

        {/* Right Content Area (64%) */}
        <div className="w-[64%] p-6 bg-slate-50 flex flex-col justify-between text-slate-800">
          <div>
            {/* Professional Summary */}
            {data.professionalSummary && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b border-slate-300 text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  EXECUTIVE SUMMARY
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {data.professionalSummary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {data.workExperience && data.workExperience.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b border-slate-300 text-slate-900 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  EXPERIENCE
                </h3>
                <div className="space-y-3">
                  {data.workExperience.map((exp) => (
                    <div key={exp.id} className="text-[11px]">
                      <div className="flex justify-between items-baseline font-bold text-slate-900">
                        <span>{exp.role}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{exp.duration}</span>
                      </div>
                      <div className="text-[10px] font-semibold" style={{ color: secondaryColor }}>
                        {exp.company} • {exp.location}
                      </div>
                      <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5 text-[10px]">
                        {exp.points.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Projects */}
            {data.projects && data.projects.length > 0 && (
              <div className="mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider pb-1 border-b border-slate-300 text-slate-900 mb-2 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  FEATURED PROJECTS
                </h3>
                <div className="space-y-2">
                  {data.projects.map((p) => (
                    <div key={p.id} className="text-[11px]">
                      <div className="font-bold text-slate-900 flex justify-between">
                        <span>{p.title}</span>
                        <span className="text-[9px] text-slate-500 font-normal">{p.techStack}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-snug">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 pt-2 text-[9px] text-slate-400 italic">
            {data.declaration || 'I hereby declare that the details provided above are true to my knowledge.'}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RESUME ARCHETYPE 3: HEADER BANNER CREATIVE (टॉप बॅनर)
  // -----------------------------------------------------------------------
  if (layout.includes('banner') || layout.includes('creative') || layout.includes('portfolio')) {
    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: template.font_family,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          fontSize: bodySize,
        }}
        className={`w-[600px] min-h-[850px] shadow-2xl text-left select-text flex flex-col justify-between overflow-hidden bg-white border border-slate-200 ${className}`}
      >
        <div>
          {/* Top Colored Banner Header */}
          <div 
            className="p-6 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontSize: headingSize }}
                >
                  {data.fullName}
                </h1>
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-widest mt-0.5">
                  {data.professionalTitle}
                </p>
              </div>
              <div className="text-right text-[10px] space-y-0.5 text-slate-200">
                <div>✉️ {data.email}</div>
                <div>📞 {data.phone}</div>
                <div>📍 {data.address}</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Summary */}
            {data.professionalSummary && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-1.5" style={{ borderColor: primaryColor }}>
                  ABOUT ME
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {data.professionalSummary}
                </p>
              </div>
            )}

            {/* Experience */}
            {data.workExperience && data.workExperience.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2" style={{ borderColor: primaryColor }}>
                  EXPERIENCE
                </h3>
                <div className="space-y-3">
                  {data.workExperience.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.role}</span>
                        <span className="text-slate-500 font-normal text-[11px]">{exp.duration}</span>
                      </div>
                      <div className="text-[11px] font-semibold" style={{ color: secondaryColor }}>
                        {exp.company} • {exp.location}
                      </div>
                      <ul className="list-disc list-inside text-slate-600 text-[11px] mt-1 space-y-0.5">
                        {exp.points.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills in Pill Badges */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2" style={{ borderColor: primaryColor }}>
                  COMPETENCIES
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2" style={{ borderColor: primaryColor }}>
                  EDUCATION
                </h3>
                <div className="space-y-1.5">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="text-xs flex justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree}</span>
                        <span className="text-slate-500 block text-[10px]">{edu.institution}</span>
                      </div>
                      <span className="text-slate-600 font-semibold">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pt-0 text-[10px] text-slate-400 italic">
          {data.declaration}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RESUME ARCHETYPE 4: TECH MINIMALIST / CODE ATS
  // -----------------------------------------------------------------------
  if (layout.includes('tech') || layout.includes('developer') || layout.includes('minimalist')) {
    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: 'Courier, monospace, monospace',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          fontSize: bodySize,
        }}
        className={`w-[600px] min-h-[850px] p-8 shadow-xl text-left select-text bg-white border border-slate-300 font-mono ${className}`}
      >
        <div className="border-b-2 border-slate-900 pb-3 mb-4">
          <div className="text-xs text-emerald-600 font-bold">$ whoami</div>
          <h1 className="text-2xl font-black text-slate-900 uppercase">
            {data.fullName}
          </h1>
          <p className="text-xs font-bold text-slate-700">
            {data.professionalTitle} | {data.address}
          </p>
          <div className="flex gap-4 text-xs text-slate-600 mt-1 font-sans">
            <span>📞 {data.phone}</span>
            <span>✉️ {data.email}</span>
            <span>🔗 {data.linkedin}</span>
          </div>
        </div>

        {/* Tech Skills */}
        <div className="mb-4">
          <div className="text-xs font-bold uppercase bg-slate-900 text-white px-2 py-0.5 inline-block mb-2">
            // TECH STACK
          </div>
          <div className="text-xs text-slate-800 leading-relaxed">
            <strong>Languages & Frameworks:</strong> {data.skills.join(', ')}
            {data.technicalSkills && (
              <div className="mt-1">
                <strong>Tools & Infra:</strong> {data.technicalSkills.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Experience */}
        {data.workExperience && data.workExperience.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold uppercase bg-slate-900 text-white px-2 py-0.5 inline-block mb-2">
              // EXPERIENCE
            </div>
            <div className="space-y-3 font-sans">
              {data.workExperience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.role} @ {exp.company}</span>
                    <span className="font-mono text-slate-500">{exp.duration}</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 mt-1 space-y-0.5 text-xs">
                    {exp.points.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-4 font-sans">
            <div className="text-xs font-bold uppercase bg-slate-900 text-white px-2 py-0.5 inline-block mb-2 font-mono">
              // PROJECTS
            </div>
            <div className="space-y-2">
              {data.projects.map((p) => (
                <div key={p.id} className="text-xs border-l-2 border-slate-300 pl-2">
                  <span className="font-bold text-slate-900">{p.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-2">[{p.techStack}]</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && (
          <div className="font-sans text-xs">
            <div className="text-xs font-bold uppercase bg-slate-900 text-white px-2 py-0.5 inline-block mb-2 font-mono">
              // EDUCATION
            </div>
            <div className="flex justify-between text-slate-800">
              <span>{data.education[0]?.degree} - {data.education[0]?.institution}</span>
              <span className="font-mono">{data.education[0]?.year}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RESUME ARCHETYPE 5: ATS SINGLE COLUMN STANDARD (क्लीन एटीएस)
  // -----------------------------------------------------------------------
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: template.font_family,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        fontSize: bodySize,
      }}
      className={`w-[600px] min-h-[850px] p-8 shadow-xl text-left select-text bg-white leading-relaxed border border-slate-200 ${className}`}
    >
      {/* ATS Header (Single Column Standard) */}
      <div className="border-b-2 pb-3 mb-4" style={{ borderColor: primaryColor }}>
        <h1 
          className="text-2xl font-bold tracking-tight uppercase" 
          style={{ color: primaryColor, fontSize: headingSize }}
        >
          {data.fullName}
        </h1>
        <p className="text-sm font-semibold mt-0.5" style={{ color: secondaryColor }}>
          {data.professionalTitle}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600">
          {data.phone && <span>📞 {data.phone}</span>}
          {data.email && <span>✉️ {data.email}</span>}
          {data.address && <span>📍 {data.address}</span>}
          {data.linkedin && <span>🔗 {data.linkedin}</span>}
          {data.portfolio && <span>🌐 {data.portfolio}</span>}
        </div>
      </div>

      {/* ATS Section: Professional Summary */}
      {data.professionalSummary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-1.5" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-xs text-slate-700 leading-normal">
            {data.professionalSummary}
          </p>
        </div>
      )}

      {/* ATS Section: Work Experience */}
      {data.workExperience && data.workExperience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            WORK EXPERIENCE
          </h2>
          <div className="space-y-3">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">{exp.role}</span>
                  <span className="text-slate-500 font-medium">{exp.duration}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 italic">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 mt-1 space-y-0.5">
                  {exp.points.map((pt, idx) => (
                    <li key={idx} className="leading-snug">{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS Section: Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            EDUCATION
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.degree}</span>
                  <span className="font-normal text-slate-500">{edu.year}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{edu.institution}</span>
                  {edu.score && <span className="font-semibold">{edu.score}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS Section: Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-1.5" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            SKILLS & EXPERTISE
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>Core Skills:</strong> {data.skills.join(', ')}
          </p>
          {data.technicalSkills && data.technicalSkills.length > 0 && (
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              <strong>Technical Proficiencies:</strong> {data.technicalSkills.join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            KEY PROJECTS
          </h2>
          <div className="space-y-2">
            {data.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.techStack && <span className="font-normal text-slate-500 italic">[{proj.techStack}]</span>}
                </div>
                <p className="text-slate-700 leading-snug mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ATS Declaration */}
      {data.declaration && (
        <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] text-slate-500 italic">
          {data.declaration}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Type,
  Sliders,
  Move,
  RotateCw,
  Layers,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Plus,
  Minus,
  Trash2,
  Copy,
  Wand2,
  Upload,
  Check,
  Palette,
  Eye,
  EyeOff,
  ChevronDown,
  X,
  Maximize2
} from 'lucide-react';
import { CanvasSelectedTarget, TextStyleProps, MotifStyleProps } from './CanvasFloatingToolbar';
import { CanvasCustomElement, AspectRatio, FooterFrameConfig } from '../../types';
import { GOOGLE_FONTS } from '../../data/fonts';

interface CanvasPropertiesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTarget: CanvasSelectedTarget;
  selectedCustomElement?: CanvasCustomElement | null;
  // Text Props
  headline: string;
  subtext: string;
  quote: string;
  headlineStyle: TextStyleProps;
  subtextStyle: TextStyleProps;
  quoteStyle: TextStyleProps;
  dateBadgeStyle: { text: string; color: string; isHidden: boolean; x?: number; y?: number };
  motifStyle: MotifStyleProps;
  companyLogoUrl?: string | null;
  companyLogoPosition?: { x: number; y: number; size: number };
  footerConfig: FooterFrameConfig;
  aspectRatio: AspectRatio;
  onUpdateHeadlineText: (text: string) => void;
  onUpdateSubtextText: (text: string) => void;
  onUpdateQuoteText: (text: string) => void;
  onUpdateHeadlineStyle: (updates: Partial<TextStyleProps>) => void;
  onUpdateSubtextStyle: (updates: Partial<TextStyleProps>) => void;
  onUpdateQuoteStyle: (updates: Partial<TextStyleProps>) => void;
  onUpdateDateBadgeStyle: (updates: Partial<{ text: string; color: string; isHidden: boolean; x?: number; y?: number }>) => void;
  onUpdateMotifStyle: (updates: Partial<MotifStyleProps>) => void;
  onUpdateCompanyLogoPosition: (updates: Partial<{ x: number; y: number; size: number }>) => void;
  onUpdateCustomElement: (updates: Partial<CanvasCustomElement>) => void;
  onUpdateFooterConfig: (updates: Partial<FooterFrameConfig>) => void;
  onDeleteTarget: () => void;
  onCopyTarget: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onRemoveBackground: () => void;
  isProcessingBg?: boolean;
}

const COLOR_SWATCHES = [
  '#ffffff',
  '#f59e0b',
  '#fbbf24',
  '#f97316',
  '#ea580c',
  '#e11d48',
  '#10b981',
  '#3b82f6',
  '#635BFF',
  '#a855f7',
  '#18181b',
  '#fef08a',
];

export const CanvasPropertiesPanel: React.FC<CanvasPropertiesPanelProps> = ({
  isOpen,
  onClose,
  selectedTarget,
  selectedCustomElement,
  headline,
  subtext,
  quote,
  headlineStyle,
  subtextStyle,
  quoteStyle,
  dateBadgeStyle,
  motifStyle,
  companyLogoUrl,
  companyLogoPosition,
  footerConfig,
  aspectRatio,
  onUpdateHeadlineText,
  onUpdateSubtextText,
  onUpdateQuoteText,
  onUpdateHeadlineStyle,
  onUpdateSubtextStyle,
  onUpdateQuoteStyle,
  onUpdateDateBadgeStyle,
  onUpdateMotifStyle,
  onUpdateCompanyLogoPosition,
  onUpdateCustomElement,
  onUpdateFooterConfig,
  onDeleteTarget,
  onCopyTarget,
  onBringForward,
  onSendBackward,
  onRemoveBackground,
  isProcessingBg,
}) => {
  if (!isOpen) return null;

  // Determine active element type
  const isHeadline = selectedTarget?.type === 'headline';
  const isSubtext = selectedTarget?.type === 'subtext';
  const isQuote = selectedTarget?.type === 'quote';
  const isDateBadge = selectedTarget?.type === 'dateBadge';
  const isMotif = selectedTarget?.type === 'motif';
  const isCompanyLogo = (selectedTarget?.type as any) === 'companyLogo';
  const isFrame = selectedTarget?.type === 'frame';
  const isCustomText = selectedTarget?.type === 'custom' && selectedCustomElement?.type === 'text';
  const isCustomImage = selectedTarget?.type === 'custom' && (selectedCustomElement?.type === 'image' || selectedCustomElement?.type === 'shape' || selectedCustomElement?.type === 'sticker');

  const isAnyText = isHeadline || isSubtext || isQuote || isDateBadge || isCustomText;
  const isAnyImage = isMotif || isCompanyLogo || isCustomImage;

  // Current Coordinates & Size extraction
  let currentX = 50;
  let currentY = 50;
  let currentWidth = 80;
  let currentHeight = 20;
  let currentRotation = 0;
  let currentOpacity = 100;
  let currentFontSize = 18;

  if (isHeadline) {
    currentX = headlineStyle.x ?? 50;
    currentY = headlineStyle.y ?? 55;
    currentWidth = headlineStyle.boxWidth || 88;
    currentFontSize = headlineStyle.fontSize;
  } else if (isSubtext) {
    currentX = subtextStyle.x ?? 50;
    currentY = subtextStyle.y ?? 70;
    currentWidth = subtextStyle.boxWidth || 86;
    currentFontSize = subtextStyle.fontSize;
  } else if (isQuote) {
    currentX = quoteStyle.x ?? 50;
    currentY = quoteStyle.y ?? 84;
    currentWidth = quoteStyle.boxWidth || 82;
    currentFontSize = quoteStyle.fontSize;
  } else if (isDateBadge) {
    currentX = dateBadgeStyle.x ?? 50;
    currentY = dateBadgeStyle.y ?? 8;
    currentWidth = 40;
  } else if (isMotif) {
    currentX = motifStyle.x ?? 50;
    currentY = motifStyle.y ?? 30;
    currentWidth = Math.round((motifStyle.scale || 1.0) * 28);
    currentHeight = currentWidth;
  } else if (isCompanyLogo && companyLogoPosition) {
    currentX = companyLogoPosition.x;
    currentY = companyLogoPosition.y;
    currentWidth = companyLogoPosition.size;
    currentHeight = companyLogoPosition.size;
  } else if (selectedCustomElement) {
    currentX = selectedCustomElement.x;
    currentY = selectedCustomElement.y;
    currentWidth = selectedCustomElement.boxWidth || selectedCustomElement.width || 25;
    currentHeight = selectedCustomElement.height || 25;
    currentRotation = selectedCustomElement.rotation || 0;
    currentOpacity = Math.round((selectedCustomElement.opacity ?? 1) * 100);
    currentFontSize = selectedCustomElement.fontSize || 16;
  }

  // Update Coordinates Handler
  const handleUpdateCoordinates = (updates: { x?: number; y?: number; width?: number; height?: number; rotation?: number }) => {
    if (isHeadline) {
      onUpdateHeadlineStyle({
        ...(updates.x !== undefined && { x: Math.max(0, Math.min(100, updates.x)) }),
        ...(updates.y !== undefined && { y: Math.max(0, Math.min(100, updates.y)) }),
        ...(updates.width !== undefined && { boxWidth: Math.max(10, Math.min(100, updates.width)) }),
      });
    } else if (isSubtext) {
      onUpdateSubtextStyle({
        ...(updates.x !== undefined && { x: Math.max(0, Math.min(100, updates.x)) }),
        ...(updates.y !== undefined && { y: Math.max(0, Math.min(100, updates.y)) }),
        ...(updates.width !== undefined && { boxWidth: Math.max(10, Math.min(100, updates.width)) }),
      });
    } else if (isQuote) {
      onUpdateQuoteStyle({
        ...(updates.x !== undefined && { x: Math.max(0, Math.min(100, updates.x)) }),
        ...(updates.y !== undefined && { y: Math.max(0, Math.min(100, updates.y)) }),
        ...(updates.width !== undefined && { boxWidth: Math.max(10, Math.min(100, updates.width)) }),
      });
    } else if (isDateBadge) {
      onUpdateDateBadgeStyle({
        ...(updates.x !== undefined && { x: Math.max(0, Math.min(100, updates.x)) }),
        ...(updates.y !== undefined && { y: Math.max(0, Math.min(100, updates.y)) }),
      });
    } else if (isMotif) {
      onUpdateMotifStyle({
        ...(updates.x !== undefined && { x: Math.max(0, Math.min(100, updates.x)) }),
        ...(updates.y !== undefined && { y: Math.max(0, Math.min(100, updates.y)) }),
        ...(updates.width !== undefined && { scale: +(updates.width / 28).toFixed(2) }),
      });
    } else if (isCompanyLogo) {
      onUpdateCompanyLogoPosition({
        ...(updates.x !== undefined && { x: Math.max(0, Math.min(100, updates.x)) }),
        ...(updates.y !== undefined && { y: Math.max(0, Math.min(100, updates.y)) }),
        ...(updates.width !== undefined && { size: Math.max(5, Math.min(50, updates.width)) }),
      });
    } else if (selectedCustomElement) {
      onUpdateCustomElement({
        ...(updates.x !== undefined && { x: Math.max(0, Math.min(100, updates.x)) }),
        ...(updates.y !== undefined && { y: Math.max(0, Math.min(100, updates.y)) }),
        ...(updates.width !== undefined && { width: updates.width, boxWidth: updates.width }),
        ...(updates.height !== undefined && { height: updates.height }),
        ...(updates.rotation !== undefined && { rotation: updates.rotation }),
      });
    }
  };

  return (
    <div className="w-80 md:w-84 bg-white border-l border-[#E7E7EE] text-[#18181B] flex flex-col shrink-0 z-30 shadow-xl overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[#E7E7EE] flex items-center justify-between bg-[#F8F8FC]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
              <span>घटक गुणधर्म (Properties)</span>
            </h3>
            <span className="text-[10px] font-medium text-[#71717A]">
              {isHeadline && 'मुख्य शीर्षक (Headline Text)'}
              {isSubtext && 'सदिच्छा मजकूर (Subtext)'}
              {isQuote && 'सुविचार / कोट (Quote)'}
              {isDateBadge && 'सण तारीख बॅज (Date Badge)'}
              {isMotif && 'सणाचा मुख्य लोगो (Festival Motif)'}
              {isCompanyLogo && 'कंपनी ब्रँड लोगो (Brand Logo)'}
              {isCustomText && 'कस्टम टेक्स्ट बॉक्स'}
              {isCustomImage && 'कस्टम ग्राफिक / स्टिकर'}
              {isFrame && 'बिझनेस फ्रेम माहिती'}
              {!selectedTarget && 'कॅनव्हास ओव्हरव्ह्यू'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          title="पॅनेल बंद करा"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Panel Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {selectedTarget ? (
          <>
            {/* 1. SELECTION & COORDINATES (X, Y, W, H, Rotation) */}
            <div className="p-3.5 bg-[#F8F8FC] rounded-xl border border-[#E7E7EE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-[#635BFF]" />
                  <span>अक्षांश व आकार (Coordinates & Size)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#635BFF] border border-[#E7E7EE] font-bold">
                  X:{Math.round(currentX)}% Y:{Math.round(currentY)}%
                </span>
              </div>

              {/* X & Y Numerical Steppers */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg border border-[#E7E7EE] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">X:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateCoordinates({ x: currentX - 2 })}
                      className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold w-7 text-center">{Math.round(currentX)}%</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCoordinates({ x: currentX + 2 })}
                      className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-lg border border-[#E7E7EE] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Y:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateCoordinates({ y: currentY - 2 })}
                      className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold w-7 text-center">{Math.round(currentY)}%</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCoordinates({ y: currentY + 2 })}
                      className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Width / Size Stepper */}
              <div className="bg-white p-2 rounded-lg border border-[#E7E7EE] flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">रुंदी / आकार (Width):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateCoordinates({ width: Math.max(10, currentWidth - 4) })}
                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold w-9 text-center">{Math.round(currentWidth)}%</span>
                  <button
                    type="button"
                    onClick={() => handleUpdateCoordinates({ width: Math.min(100, currentWidth + 4) })}
                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick Center Alignment Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleUpdateCoordinates({ x: 50 })}
                  className="flex-1 py-1 px-2 rounded-lg bg-white hover:bg-indigo-50 border border-[#E7E7EE] hover:border-[#635BFF] text-[10px] font-bold text-[#635BFF] transition-all text-center"
                >
                  मध्यभागी (Center X)
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateCoordinates({ y: 50 })}
                  className="flex-1 py-1 px-2 rounded-lg bg-white hover:bg-indigo-50 border border-[#E7E7EE] hover:border-[#635BFF] text-[10px] font-bold text-[#635BFF] transition-all text-center"
                >
                  मध्यभागी (Center Y)
                </button>
              </div>
            </div>

            {/* 2. TEXT PROPERTIES (If Text Selected) */}
            {isAnyText && (
              <div className="p-3.5 bg-[#F8F8FC] rounded-xl border border-[#E7E7EE] space-y-3.5">
                <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#635BFF]" />
                  <span>मजकूर संपादन (Typography & Text)</span>
                </span>

                {/* Text Content Editor */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                    मजकूर (Text content):
                  </label>
                  <textarea
                    rows={2}
                    value={
                      isHeadline
                        ? headline
                        : isSubtext
                        ? subtext
                        : isQuote
                        ? quote
                        : isDateBadge
                        ? dateBadgeStyle.text
                        : selectedCustomElement?.content || ''
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isHeadline) onUpdateHeadlineText(val);
                      else if (isSubtext) onUpdateSubtextText(val);
                      else if (isQuote) onUpdateQuoteText(val);
                      else if (isDateBadge) onUpdateDateBadgeStyle({ text: val });
                      else if (selectedCustomElement) onUpdateCustomElement({ content: val });
                    }}
                    className="w-full bg-white text-[#18181B] font-medium p-2 rounded-lg border border-[#E7E7EE] text-xs focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition-all"
                  />
                </div>

                {/* Font Family Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                    फॉन्ट प्रकार (Font Family):
                  </label>
                  <select
                    value={
                      isHeadline
                        ? headlineStyle.fontFamily
                        : isSubtext
                        ? subtextStyle.fontFamily
                        : isQuote
                        ? quoteStyle.fontFamily
                        : selectedCustomElement?.fontFamily || "'Baloo 2', sans-serif"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isHeadline) onUpdateHeadlineStyle({ fontFamily: val });
                      else if (isSubtext) onUpdateSubtextStyle({ fontFamily: val });
                      else if (isQuote) onUpdateQuoteStyle({ fontFamily: val });
                      else if (selectedCustomElement) onUpdateCustomElement({ fontFamily: val });
                    }}
                    className="w-full bg-white text-[#18181B] font-semibold p-2 rounded-lg border border-[#E7E7EE] text-xs focus:border-[#635BFF] outline-none"
                  >
                    {GOOGLE_FONTS.map((font) => (
                      <option key={font.name} value={font.family}>
                        {font.name} ({font.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Size & Weight */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1 block">फॉन्ट साईझ:</label>
                    <div className="flex items-center gap-1 bg-white p-1.5 rounded-lg border border-[#E7E7EE]">
                      <button
                        type="button"
                        onClick={() => {
                          const newSize = Math.max(10, currentFontSize - 2);
                          if (isHeadline) onUpdateHeadlineStyle({ fontSize: newSize });
                          else if (isSubtext) onUpdateSubtextStyle({ fontSize: newSize });
                          else if (isQuote) onUpdateQuoteStyle({ fontSize: newSize });
                          else if (selectedCustomElement) onUpdateCustomElement({ fontSize: newSize });
                        }}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-mono flex-1 text-center">{currentFontSize}px</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newSize = Math.min(72, currentFontSize + 2);
                          if (isHeadline) onUpdateHeadlineStyle({ fontSize: newSize });
                          else if (isSubtext) onUpdateSubtextStyle({ fontSize: newSize });
                          else if (isQuote) onUpdateQuoteStyle({ fontSize: newSize });
                          else if (selectedCustomElement) onUpdateCustomElement({ fontSize: newSize });
                        }}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 mb-1 block">अलाइनमेंट:</label>
                    <div className="flex items-center justify-around bg-white p-1 rounded-lg border border-[#E7E7EE]">
                      <button
                        type="button"
                        onClick={() => {
                          if (isHeadline) onUpdateHeadlineStyle({ align: 'left' });
                          else if (isSubtext) onUpdateSubtextStyle({ align: 'left' });
                          else if (isQuote) onUpdateQuoteStyle({ align: 'left' });
                          else if (selectedCustomElement) onUpdateCustomElement({ align: 'left' });
                        }}
                        className="p-1 rounded hover:bg-slate-100 text-slate-600"
                        title="डावीकडे (Left)"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isHeadline) onUpdateHeadlineStyle({ align: 'center' });
                          else if (isSubtext) onUpdateSubtextStyle({ align: 'center' });
                          else if (isQuote) onUpdateQuoteStyle({ align: 'center' });
                          else if (selectedCustomElement) onUpdateCustomElement({ align: 'center' });
                        }}
                        className="p-1 rounded bg-indigo-50 text-[#635BFF]"
                        title="मध्यभागी (Center)"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isHeadline) onUpdateHeadlineStyle({ align: 'right' });
                          else if (isSubtext) onUpdateSubtextStyle({ align: 'right' });
                          else if (isQuote) onUpdateQuoteStyle({ align: 'right' });
                          else if (selectedCustomElement) onUpdateCustomElement({ align: 'right' });
                        }}
                        className="p-1 rounded hover:bg-slate-100 text-slate-600"
                        title="उजवीकडे (Right)"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text Color Swatches */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">मजकूर रंग (Text Color):</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_SWATCHES.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          if (isHeadline) onUpdateHeadlineStyle({ color });
                          else if (isSubtext) onUpdateSubtextStyle({ color });
                          else if (isQuote) onUpdateQuoteStyle({ color });
                          else if (isDateBadge) onUpdateDateBadgeStyle({ color });
                          else if (selectedCustomElement) onUpdateCustomElement({ color });
                        }}
                        className="w-6 h-6 rounded-full border border-slate-300 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. IMAGE / LOGO / MOTIF PROPERTIES */}
            {isAnyImage && (
              <div className="p-3.5 bg-[#F8F8FC] rounded-xl border border-[#E7E7EE] space-y-3">
                <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#635BFF]" />
                  <span>इमेज व ग्राफिक साधने (Image & Graphics)</span>
                </span>

                {/* AI Background Remover */}
                <button
                  type="button"
                  onClick={onRemoveBackground}
                  disabled={isProcessingBg}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#5148E5] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isProcessingBg ? 'बॅकग्राउंड काढत आहे...' : '✨ AI बॅकग्राउंड काढा (Remove BG)'}</span>
                </button>
              </div>
            )}

            {/* 4. LAYER & QUICK ACTIONS (Bring forward, Duplicate, Delete) */}
            <div className="p-3 bg-[#F8F8FC] rounded-xl border border-[#E7E7EE] space-y-2.5">
              <span className="text-[11px] font-bold text-slate-600 block">घटक कृती (Actions):</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onBringForward}
                  className="py-1.5 px-2 bg-white hover:bg-slate-100 rounded-lg border border-[#E7E7EE] text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-[#635BFF]" />
                  <span>पुढे आणा</span>
                </button>
                <button
                  type="button"
                  onClick={onSendBackward}
                  className="py-1.5 px-2 bg-white hover:bg-slate-100 rounded-lg border border-[#E7E7EE] text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400 rotate-180" />
                  <span>मागे पाठवा</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={onCopyTarget}
                  className="py-1.5 px-2 bg-white hover:bg-indigo-50 rounded-lg border border-[#E7E7EE] hover:border-[#635BFF] text-[11px] font-bold text-[#635BFF] flex items-center justify-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>कॉपी करा</span>
                </button>
                <button
                  type="button"
                  onClick={onDeleteTarget}
                  className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 text-[11px] font-bold text-rose-600 flex items-center justify-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>हटवा (Delete)</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* NO SELECTION / CANVAS SUMMARY */
          <div className="space-y-4">
            <div className="p-4 bg-[#F8F8FC] rounded-2xl border border-[#E7E7EE] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center mx-auto">
                <Move className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-[#18181B]">घटक सिलेक्ट करा (Selection Tool Active)</h4>
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                कॅनव्हासवरील कोणत्याही टेक्स्टवर किंवा इमेजवर क्लिक करा. ते निवडल्यानंतर त्याचा बाऊंडिंग बॉक्स आणि अक्षांश (Coordinates) इथे दिसतील.
              </p>
            </div>

            <div className="p-3.5 bg-[#F8F8FC] rounded-xl border border-[#E7E7EE] space-y-2">
              <span className="text-xs font-bold text-[#18181B] block">कॅनव्हास माहिती (Canvas Specs):</span>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-500">आस्पेक्ट रेशिओ:</span>
                  <span className="font-bold text-[#18181B]">{aspectRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">रिझोल्यूशन:</span>
                  <span className="font-bold text-[#18181B]">1080 × 1080 (HD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">एक्सपोर्ट क्वालिटी:</span>
                  <span className="font-bold text-emerald-600">१००% अल्ट्रा शार्प</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

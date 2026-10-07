import React, { useState } from 'react';
import {
  Type,
  Trash2,
  Edit3,
  Copy,
  Lock,
  Unlock,
  Palette,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Minus,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Smile,
  X,
  Move,
  Wand2,
  FlipHorizontal,
  FlipVertical,
  Upload,
  Image as ImageIcon,
  Sliders
} from 'lucide-react';
import { CanvasCustomElement } from '../../types';
import { GOOGLE_FONTS, GoogleFontOption } from '../../data/fonts';

export type CanvasSelectedTarget =
  | { type: 'headline' }
  | { type: 'subtext' }
  | { type: 'quote' }
  | { type: 'dateBadge' }
  | { type: 'motif' }
  | { type: 'frame' }
  | { type: 'custom'; id: string }
  | null;

export interface TextStyleProps {
  color: string;
  fontSize: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  fontFamily?: string;
  isHidden?: boolean;
  x?: number; // 0-100 percentage
  y?: number; // 0-100 percentage
  boxWidth?: number; // percentage width 20-100
  boxHeight?: number;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
  shadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
}

export interface MotifStyleProps {
  type: string;
  scale: number;
  primaryColor: string;
  accentColor: string;
  isHidden?: boolean;
  x?: number;
  y?: number;
}

interface CanvasFloatingToolbarProps {
  selectedTarget: CanvasSelectedTarget;
  selectedCustomElement?: CanvasCustomElement | null;
  headline?: string;
  subtext?: string;
  quote?: string;
  headlineStyle: TextStyleProps;
  subtextStyle: TextStyleProps;
  quoteStyle: TextStyleProps;
  dateBadgeStyle: { text: string; color: string; isHidden: boolean; x?: number; y?: number };
  motifStyle: MotifStyleProps;
  companyLogoUrl?: string | null;
  companyLogoPosition?: { x: number; y: number; size: number };
  onUpdateCompanyLogoPosition?: (updates: Partial<{ x: number; y: number; size: number }>) => void;
  onUpdateHeadlineText?: (text: string) => void;
  onUpdateSubtextText?: (text: string) => void;
  onUpdateQuoteText?: (text: string) => void;
  onUpdateHeadlineStyle: (updates: Partial<TextStyleProps>) => void;
  onUpdateSubtextStyle: (updates: Partial<TextStyleProps>) => void;
  onUpdateQuoteStyle: (updates: Partial<TextStyleProps>) => void;
  onUpdateDateBadgeStyle: (updates: Partial<{ text: string; color: string; isHidden: boolean; x?: number; y?: number }>) => void;
  onUpdateMotifStyle: (updates: Partial<MotifStyleProps>) => void;
  onUpdateCustomElement: (updates: Partial<CanvasCustomElement>) => void;
  onRemoveBackground?: () => void;
  onRestoreOriginalImage?: () => void;
  isProcessingBg?: boolean;
  onNudgeTarget?: (dx: number, dy: number) => void;
  onDeleteTarget: () => void;
  onDuplicateCustomElement?: () => void;
  onCopyTarget?: () => void;
  onPasteTarget?: () => void;
  canPaste?: boolean;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onStartInlineEdit: (target: 'headline' | 'subtext' | 'quote' | 'dateBadge' | 'custom') => void;
  onOpenDrawerTab: (tab: 'frames' | 'text' | 'stickers' | 'background' | 'profile') => void;
  onDeselect: () => void;
}

const QUICK_COLORS = [
  { label: 'पांढरा (White)', value: '#ffffff' },
  { label: 'सोनेरी (Gold)', value: '#fbbf24' },
  { label: 'भगवा (Saffron)', value: '#f97316' },
  { label: 'पिवळा (Yellow)', value: '#fef08a' },
  { label: 'लाल (Crimson)', value: '#ef4444' },
  { label: 'गुलाबी (Pink)', value: '#f43f5e' },
  { label: 'सियान (Cyan)', value: '#38bdf8' },
  { label: 'हिरवा (Emerald)', value: '#34d399' },
  { label: 'काळा (Dark)', value: '#1e293b' },
];

const MOTIF_OPTIONS = [
  { id: 'diwali-diya', name: '🪔 शुभ दीप / दिवा' },
  { id: 'shiva-trishul', name: '🔱 महाकाल त्रिशूळ' },
  { id: 'ganesh-murti', name: '🐘 श्री गणेश मूर्ती' },
  { id: 'independence-flag', name: '🚩 भगवा / तिरंगा ध्वज' },
  { id: 'festive-kalash', name: '🏺 मंगल कलश' },
  { id: 'jewelry-gold', name: '✨ सुवर्ण दागिने' },
  { id: 'sale-discount', name: '🏷️ बंपर डिस्काउंट' },
  { id: 'real-estate-house', name: '🏡 ड्रीम होम / घर' },
  { id: 'business-growth', name: '📈 बिझनेस ग्रोथ' },
  { id: 'salon-beauty', name: '💇 ब्युटी & हेअर' },
];

export const CanvasFloatingToolbar: React.FC<CanvasFloatingToolbarProps> = ({
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
  onUpdateCompanyLogoPosition,
  onUpdateHeadlineText,
  onUpdateSubtextText,
  onUpdateQuoteText,
  onUpdateHeadlineStyle,
  onUpdateSubtextStyle,
  onUpdateQuoteStyle,
  onUpdateDateBadgeStyle,
  onUpdateMotifStyle,
  onUpdateCustomElement,
  onRemoveBackground,
  onRestoreOriginalImage,
  isProcessingBg,
  onNudgeTarget,
  onDeleteTarget,
  onDuplicateCustomElement,
  onCopyTarget,
  onPasteTarget,
  canPaste,
  onBringForward,
  onSendBackward,
  onStartInlineEdit,
  onOpenDrawerTab,
  onDeselect,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showMotifPicker, setShowMotifPicker] = useState(false);
  const [showQuickTextInput, setShowQuickTextInput] = useState(false);

  if (!selectedTarget) return null;

  // Determine current active style
  let currentActiveColor = '#ffffff';
  let currentFontSize = 16;
  let currentBold = false;
  let currentItalic = false;
  let currentUnderline = false;
  let currentAlign: 'left' | 'center' | 'right' = 'center';
  let currentBoxWidth = 88;
  let currentShadow = true;
  let currentFontFamily = '';
  let titleLabel = '';
  let activeTextValue = '';

  const isCustomText = selectedTarget.type === 'custom' && selectedCustomElement?.type === 'text';
  const isCustomImage =
    selectedTarget.type === 'custom' &&
    (selectedCustomElement?.type === 'custom-photo' ||
      selectedCustomElement?.type === 'sticker' ||
      Boolean(selectedCustomElement?.photoUrl || selectedCustomElement?.imageUrl));

  const isTextType =
    selectedTarget.type === 'headline' ||
    selectedTarget.type === 'subtext' ||
    selectedTarget.type === 'quote' ||
    selectedTarget.type === 'dateBadge' ||
    isCustomText;

  if (selectedTarget.type === 'headline') {
    titleLabel = 'मुख्य हेडलाईन';
    currentActiveColor = headlineStyle.color;
    currentFontSize = headlineStyle.fontSize;
    currentBold = !!headlineStyle.isBold;
    currentItalic = !!headlineStyle.isItalic;
    currentUnderline = !!headlineStyle.isUnderline;
    currentAlign = headlineStyle.align || 'center';
    currentBoxWidth = headlineStyle.boxWidth || 88;
    currentShadow = headlineStyle.shadow !== false;
    currentFontFamily = headlineStyle.fontFamily || "'Yatra One', cursive, sans-serif";
    activeTextValue = headline;
  } else if (selectedTarget.type === 'subtext') {
    titleLabel = 'सदिच्छा मजकूर';
    currentActiveColor = subtextStyle.color;
    currentFontSize = subtextStyle.fontSize;
    currentBold = !!subtextStyle.isBold;
    currentItalic = !!subtextStyle.isItalic;
    currentUnderline = !!subtextStyle.isUnderline;
    currentAlign = subtextStyle.align || 'center';
    currentBoxWidth = subtextStyle.boxWidth || 86;
    currentShadow = subtextStyle.shadow !== false;
    currentFontFamily = subtextStyle.fontFamily || "'Baloo 2', sans-serif";
    activeTextValue = subtext;
  } else if (selectedTarget.type === 'quote') {
    titleLabel = 'स्लोगन / कोट';
    currentActiveColor = quoteStyle.color;
    currentFontSize = quoteStyle.fontSize;
    currentBold = !!quoteStyle.isBold;
    currentItalic = quoteStyle.isItalic !== false;
    currentUnderline = !!quoteStyle.isUnderline;
    currentAlign = quoteStyle.align || 'center';
    currentBoxWidth = quoteStyle.boxWidth || 82;
    currentShadow = quoteStyle.shadow !== false;
    currentFontFamily = quoteStyle.fontFamily || "'Kalam', cursive";
    activeTextValue = quote;
  } else if (selectedTarget.type === 'dateBadge') {
    titleLabel = 'सण व तारीख बॅज';
    currentActiveColor = dateBadgeStyle.color;
    activeTextValue = dateBadgeStyle.text;
  } else if (selectedTarget.type === 'motif') {
    titleLabel = 'सणाचा मुख्य लोगो / चिन्ह';
  } else if ((selectedTarget.type as any) === 'companyLogo') {
    titleLabel = 'कंपनी / ब्रँड लोगो';
  } else if (selectedTarget.type === 'custom' && selectedCustomElement) {
    titleLabel = isCustomText ? 'मजकूर (Text)' : `चिन्ह / फोटो (${selectedCustomElement.name || selectedCustomElement.type})`;
    currentActiveColor = selectedCustomElement.color || selectedCustomElement.fillColor || '#ffffff';
    currentFontSize = selectedCustomElement.fontSize || 16;
    currentBold = !!selectedCustomElement.isBold;
    currentItalic = !!selectedCustomElement.isItalic;
    currentUnderline = !!selectedCustomElement.isUnderline;
    currentAlign = selectedCustomElement.align || 'center';
    currentBoxWidth = selectedCustomElement.boxWidth || selectedCustomElement.width || 60;
    currentShadow = selectedCustomElement.shadow !== false;
    currentFontFamily = selectedCustomElement.fontFamily || "'Baloo 2', sans-serif";
    activeTextValue = selectedCustomElement.content || '';
  } else if (selectedTarget.type === 'frame') {
    titleLabel = 'ब्रँड फ्रेम (Footer Frame)';
  }

  const activeFontObj = GOOGLE_FONTS.find(
    (f) => f.family === currentFontFamily || currentFontFamily?.includes(f.id) || currentFontFamily?.includes(f.name)
  );

  return (
    <div
      className="absolute top-10 md:top-3 z-40 bg-slate-900/95 border border-cyan-400/50 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl flex flex-wrap items-center gap-1 sm:gap-2 shadow-2xl animate-in fade-in slide-in-from-top-2 max-w-[98%] sm:max-w-none text-white text-xs max-h-[130px] overflow-y-auto no-scrollbar"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Element Identifier Tag */}
      <div className="flex items-center gap-1.5 pl-1 pr-2 border-r border-slate-700">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[11px] font-black text-cyan-300 whitespace-nowrap">
          {titleLabel}
        </span>
      </div>

      {/* 1. TEXT CONTROLS (Headline, Subtext, Quote, Date Badge, Custom Text) */}
      {isTextType && (
        <>
          {/* Direct Text Input Box (Type text right here!) */}
          <div className="flex items-center bg-slate-950/95 border border-cyan-400/60 focus-within:border-cyan-300 rounded-xl px-2 py-0.5 max-w-[180px] sm:max-w-[240px] transition-all shadow-inner">
            <input
              type="text"
              value={activeTextValue || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (selectedTarget.type === 'headline') {
                  onUpdateHeadlineText?.(val);
                } else if (selectedTarget.type === 'subtext') {
                  onUpdateSubtextText?.(val);
                } else if (selectedTarget.type === 'quote') {
                  onUpdateQuoteText?.(val);
                } else if (selectedTarget.type === 'dateBadge') {
                  onUpdateDateBadgeStyle({ text: val });
                } else if (selectedTarget.type === 'custom') {
                  onUpdateCustomElement({ content: val });
                }
              }}
              placeholder="मजकूर टाईप करा..."
              className="bg-transparent text-amber-300 font-bold text-xs w-full outline-none py-0.5 placeholder:text-slate-500"
              title="येथे थेट मजकूर टाईप करा"
            />
          </div>

          {/* Quick Direct In-Place Canvas Edit Button */}
          <button
            type="button"
            onClick={() => {
              if (selectedTarget.type === 'custom') {
                onStartInlineEdit('custom');
              } else {
                onStartInlineEdit(selectedTarget.type as any);
              }
            }}
            className="px-2 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95 text-[11px]"
            title="कॅनव्हासवर मजकूर बदला"
          >
            <Edit3 className="w-3 h-3" />
            <span className="hidden sm:inline">कॅनव्हासवर एडिट</span>
          </button>

          {/* GOOGLE FONTS SELECTOR DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowFontPicker(!showFontPicker);
                setShowColorPicker(false);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 flex items-center gap-1.5 border border-slate-700 max-w-[130px] sm:max-w-[160px] truncate"
              title="गुगल फॉन्ट बदला (Google Font)"
            >
              <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold truncate">
                {activeFontObj ? activeFontObj.name.split(' ')[0] : 'Font निवडा'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {showFontPicker && (
              <div className="absolute top-full left-0 mt-1.5 w-64 sm:w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800">
                  🚩 मराठी व देवनागरी गुगल फॉन्ट
                </div>
                {GOOGLE_FONTS.filter((f) => f.category === 'marathi').map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      const newFam = f.family;
                      if (selectedTarget.type === 'headline') onUpdateHeadlineStyle({ fontFamily: newFam });
                      if (selectedTarget.type === 'subtext') onUpdateSubtextStyle({ fontFamily: newFam });
                      if (selectedTarget.type === 'quote') onUpdateQuoteStyle({ fontFamily: newFam });
                      if (selectedTarget.type === 'custom') onUpdateCustomElement({ fontFamily: newFam });
                      setShowFontPicker(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors flex items-center justify-between border-b border-slate-800/40"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{f.name}</p>
                      <p className="text-[11px] text-amber-300/90 mt-0.5" style={{ fontFamily: f.family }}>
                        {f.nativeSample}
                      </p>
                    </div>
                    {currentFontFamily === f.family && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                ))}

                <div className="px-3 py-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 bg-slate-950/40 mt-1">
                  🔤 इंग्लिश & स्टाईलिश गुगल फॉन्ट
                </div>
                {GOOGLE_FONTS.filter((f) => f.category !== 'marathi').map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      const newFam = f.family;
                      if (selectedTarget.type === 'headline') onUpdateHeadlineStyle({ fontFamily: newFam });
                      if (selectedTarget.type === 'subtext') onUpdateSubtextStyle({ fontFamily: newFam });
                      if (selectedTarget.type === 'quote') onUpdateQuoteStyle({ fontFamily: newFam });
                      if (selectedTarget.type === 'custom') onUpdateCustomElement({ fontFamily: newFam });
                      setShowFontPicker(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 transition-colors flex items-center justify-between border-b border-slate-800/40"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{f.name}</p>
                      <p className="text-[11px] text-cyan-300/90 mt-0.5" style={{ fontFamily: f.family }}>
                        {f.nativeSample}
                      </p>
                    </div>
                    {currentFontFamily === f.family && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Minus */}
          <button
            type="button"
            onClick={() => {
              if (selectedTarget.type === 'headline') {
                onUpdateHeadlineStyle({ fontSize: Math.max(12, headlineStyle.fontSize - 2) });
              } else if (selectedTarget.type === 'subtext') {
                onUpdateSubtextStyle({ fontSize: Math.max(9, subtextStyle.fontSize - 2) });
              } else if (selectedTarget.type === 'quote') {
                onUpdateQuoteStyle({ fontSize: Math.max(8, quoteStyle.fontSize - 1) });
              } else if (selectedTarget.type === 'custom' && selectedCustomElement) {
                onUpdateCustomElement({ fontSize: Math.max(10, (selectedCustomElement.fontSize || 16) - 2) });
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
            title="आकार कमी करा (A-)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-mono text-slate-400 px-1 font-bold">
            {currentFontSize}px
          </span>

          {/* Font Size Plus */}
          <button
            type="button"
            onClick={() => {
              if (selectedTarget.type === 'headline') {
                onUpdateHeadlineStyle({ fontSize: Math.min(64, headlineStyle.fontSize + 2) });
              } else if (selectedTarget.type === 'subtext') {
                onUpdateSubtextStyle({ fontSize: Math.min(36, subtextStyle.fontSize + 2) });
              } else if (selectedTarget.type === 'quote') {
                onUpdateQuoteStyle({ fontSize: Math.min(28, quoteStyle.fontSize + 1) });
              } else if (selectedTarget.type === 'custom' && selectedCustomElement) {
                onUpdateCustomElement({ fontSize: Math.min(48, (selectedCustomElement.fontSize || 16) + 2) });
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
            title="आकार वाढवा (A+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Bold Toggle */}
          <button
            type="button"
            onClick={() => {
              if (selectedTarget.type === 'headline') {
                onUpdateHeadlineStyle({ isBold: !headlineStyle.isBold });
              } else if (selectedTarget.type === 'subtext') {
                onUpdateSubtextStyle({ isBold: !subtextStyle.isBold });
              } else if (selectedTarget.type === 'quote') {
                onUpdateQuoteStyle({ isBold: !quoteStyle.isBold });
              } else if (selectedTarget.type === 'custom') {
                onUpdateCustomElement({ isBold: !selectedCustomElement?.isBold });
              }
            }}
            className={`p-1.5 rounded-lg transition-all ${
              currentBold ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="बोल्ड मजकूर (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          {/* Italic Toggle */}
          <button
            type="button"
            onClick={() => {
              if (selectedTarget.type === 'headline') {
                onUpdateHeadlineStyle({ isItalic: !headlineStyle.isItalic });
              } else if (selectedTarget.type === 'subtext') {
                onUpdateSubtextStyle({ isItalic: !subtextStyle.isItalic });
              } else if (selectedTarget.type === 'quote') {
                onUpdateQuoteStyle({ isItalic: !quoteStyle.isItalic });
              } else if (selectedTarget.type === 'custom') {
                onUpdateCustomElement({ isItalic: !selectedCustomElement?.isItalic });
              }
            }}
            className={`p-1.5 rounded-lg transition-all ${
              currentItalic ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="तिरपा मजकूर (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          {/* Underline Toggle */}
          <button
            type="button"
            onClick={() => {
              if (selectedTarget.type === 'headline') {
                onUpdateHeadlineStyle({ isUnderline: !headlineStyle.isUnderline });
              } else if (selectedTarget.type === 'subtext') {
                onUpdateSubtextStyle({ isUnderline: !subtextStyle.isUnderline });
              } else if (selectedTarget.type === 'quote') {
                onUpdateQuoteStyle({ isUnderline: !quoteStyle.isUnderline });
              } else if (selectedTarget.type === 'custom') {
                onUpdateCustomElement({ isUnderline: !selectedCustomElement?.isUnderline });
              }
            }}
            className={`p-1.5 rounded-lg transition-all ${
              currentUnderline ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="अधोरेखित मजकूर (Underline)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          {/* Alignment Segmented Group */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => {
                if (selectedTarget.type === 'headline') onUpdateHeadlineStyle({ align: 'left' });
                if (selectedTarget.type === 'subtext') onUpdateSubtextStyle({ align: 'left' });
                if (selectedTarget.type === 'quote') onUpdateQuoteStyle({ align: 'left' });
                if (selectedTarget.type === 'custom') onUpdateCustomElement({ align: 'left' });
              }}
              className={`p-1 rounded ${currentAlign === 'left' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="डावीकडे अलाईन (Align Left)"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedTarget.type === 'headline') onUpdateHeadlineStyle({ align: 'center' });
                if (selectedTarget.type === 'subtext') onUpdateSubtextStyle({ align: 'center' });
                if (selectedTarget.type === 'quote') onUpdateQuoteStyle({ align: 'center' });
                if (selectedTarget.type === 'custom') onUpdateCustomElement({ align: 'center' });
              }}
              className={`p-1 rounded ${currentAlign === 'center' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="मध्यभागी अलाईन (Align Center)"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedTarget.type === 'headline') onUpdateHeadlineStyle({ align: 'right' });
                if (selectedTarget.type === 'subtext') onUpdateSubtextStyle({ align: 'right' });
                if (selectedTarget.type === 'quote') onUpdateQuoteStyle({ align: 'right' });
                if (selectedTarget.type === 'custom') onUpdateCustomElement({ align: 'right' });
              }}
              className={`p-1 rounded ${currentAlign === 'right' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="उजवीकडे अलाईन (Align Right)"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Paragraph Box Width Selector */}
          <button
            type="button"
            onClick={() => {
              const widths = [60, 75, 88, 96];
              const curIdx = widths.findIndex((w) => Math.abs(w - currentBoxWidth) < 8);
              const nextWidth = widths[(curIdx + 1) % widths.length];
              if (selectedTarget.type === 'headline') onUpdateHeadlineStyle({ boxWidth: nextWidth });
              if (selectedTarget.type === 'subtext') onUpdateSubtextStyle({ boxWidth: nextWidth });
              if (selectedTarget.type === 'quote') onUpdateQuoteStyle({ boxWidth: nextWidth });
              if (selectedTarget.type === 'custom') onUpdateCustomElement({ boxWidth: nextWidth, width: nextWidth });
            }}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1 border border-slate-700 text-slate-200"
            title="परिच्छेद रुंदी / Wrapping Width बदला"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-mono">{currentBoxWidth}% रुंदी</span>
          </button>

          {/* Text Shadow Toggle */}
          <button
            type="button"
            onClick={() => {
              if (selectedTarget.type === 'headline') onUpdateHeadlineStyle({ shadow: !headlineStyle.shadow });
              if (selectedTarget.type === 'subtext') onUpdateSubtextStyle({ shadow: !subtextStyle.shadow });
              if (selectedTarget.type === 'quote') onUpdateQuoteStyle({ shadow: !quoteStyle.shadow });
              if (selectedTarget.type === 'custom') onUpdateCustomElement({ shadow: !selectedCustomElement?.shadow });
            }}
            className={`p-1.5 rounded-lg ${
              currentShadow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
            }`}
            title="शॅडो इफेक्ट (Text Shadow)"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Color Swatch Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowFontPicker(false);
              }}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 border border-slate-700"
              title="रंग बदला (Color)"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-xs"
                style={{ backgroundColor: currentActiveColor }}
              />
              <span className="text-[10px] font-bold">रंग</span>
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1.5 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-wrap gap-1.5 w-44 z-50 animate-in fade-in">
                {QUICK_COLORS.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (selectedTarget.type === 'headline') onUpdateHeadlineStyle({ color: c.value });
                      if (selectedTarget.type === 'subtext') onUpdateSubtextStyle({ color: c.value });
                      if (selectedTarget.type === 'quote') onUpdateQuoteStyle({ color: c.value });
                      if (selectedTarget.type === 'dateBadge') onUpdateDateBadgeStyle({ color: c.value });
                      if (selectedTarget.type === 'custom') onUpdateCustomElement({ color: c.value });
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded-md border border-white/20 hover:scale-110 transition-transform flex items-center justify-center"
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  >
                    {currentActiveColor === c.value && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 1.1 CUSTOM PHOTO / IMAGE / STICKER CONTROLS WITH BG REMOVAL & FLIP */}
      {isCustomImage && selectedCustomElement && (
        <>
          {/* Smart Background Remover Button */}
          {onRemoveBackground && (
            <button
              type="button"
              onClick={onRemoveBackground}
              disabled={isProcessingBg}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold flex items-center gap-1 shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="बॅकग्राउंड काढा / पारदर्शक करा (Remove Background / Make Transparent)"
            >
              {isProcessingBg ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5 text-yellow-300" />
              )}
              <span>{isProcessingBg ? 'प्रोसेसिंग...' : 'बॅकग्राउंड काढा (BG Remove)'}</span>
            </button>
          )}

          {/* Restore Original Image Button if BG was removed */}
          {selectedCustomElement.originalImageUrl && onRestoreOriginalImage && (
            <button
              type="button"
              onClick={onRestoreOriginalImage}
              className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold flex items-center gap-1 border border-amber-500/40 shadow-md transition-all active:scale-95 text-xs"
              title="मूळ फोटो पुन्हा आणा (Restore Original Image)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>मूळ फोटो आणा</span>
            </button>
          )}

          {/* Flip Horizontal */}
          <button
            type="button"
            onClick={() => onUpdateCustomElement({ isFlippedX: !selectedCustomElement.isFlippedX })}
            className={`p-1.5 rounded-lg ${
              selectedCustomElement.isFlippedX ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200'
            }`}
            title="आडवे उलटा करा (Flip Horizontal)"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Flip Vertical */}
          <button
            type="button"
            onClick={() => onUpdateCustomElement({ isFlippedY: !selectedCustomElement.isFlippedY })}
            className={`p-1.5 rounded-lg ${
              selectedCustomElement.isFlippedY ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200'
            }`}
            title="उभे उलटा करा (Flip Vertical)"
          >
            <FlipVertical className="w-3.5 h-3.5" />
          </button>

          {/* Zoom / Scale */}
          <button
            type="button"
            onClick={() => {
              const currentZoom = selectedCustomElement.photoZoom || 1;
              onUpdateCustomElement({ photoZoom: Math.max(0.4, currentZoom - 0.15) });
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="लहान करा (-)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              const currentZoom = selectedCustomElement.photoZoom || 1;
              onUpdateCustomElement({ photoZoom: Math.min(2.5, currentZoom + 0.15) });
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="मोठा करा (+)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </>
      )}

      {/* 2. MOTIF / GRAPHICS CONTROLS */}
      {selectedTarget.type === 'motif' && (
        <>
          {/* Scale Buttons */}
          <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-1 rounded-xl border border-slate-700">
            <span className="text-[10px] text-amber-300 font-bold">आकार:</span>
            <button
              type="button"
              onClick={() => onUpdateMotifStyle({ scale: Math.max(0.4, +(motifStyle.scale - 0.1).toFixed(2)) })}
              className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold"
              title="चिन्ह लहान करा"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-mono font-bold text-cyan-300 px-1">
              {motifStyle.scale}x
            </span>
            <button
              type="button"
              onClick={() => onUpdateMotifStyle({ scale: Math.min(2.5, +(motifStyle.scale + 0.1).toFixed(2)) })}
              className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold"
              title="चिन्ह मोठा करा"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Swap Motif Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMotifPicker(!showMotifPicker)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1"
            >
              <span>चिन्ह बदला</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showMotifPicker && (
              <div className="absolute top-full left-0 mt-1.5 p-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-48 z-50 max-h-56 overflow-y-auto">
                {MOTIF_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onUpdateMotifStyle({ type: m.id });
                      setShowMotifPicker(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 flex items-center justify-between ${
                      motifStyle.type === m.id ? 'font-bold text-amber-400 bg-slate-800/80' : 'text-slate-300'
                    }`}
                  >
                    <span>{m.name}</span>
                    {motifStyle.type === m.id && <Check className="w-3 h-3 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* COMPANY LOGO CONTROLS (छोटा / मोठा / पोझिशन / पारदर्शक) */}
      {(selectedTarget.type as any) === 'companyLogo' && (
        <>
          <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-1 rounded-xl border border-slate-700">
            <span className="text-[10px] text-amber-300 font-bold">लोगो आकार:</span>
            <button
              type="button"
              onClick={() => {
                if (onUpdateCompanyLogoPosition && companyLogoPosition) {
                  onUpdateCompanyLogoPosition({ size: Math.max(8, companyLogoPosition.size - 2) });
                }
              }}
              className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold"
              title="लोगो लहान करा"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-mono font-bold text-cyan-300 px-1">
              {companyLogoPosition?.size || 16}%
            </span>
            <button
              type="button"
              onClick={() => {
                if (onUpdateCompanyLogoPosition && companyLogoPosition) {
                  onUpdateCompanyLogoPosition({ size: Math.min(45, companyLogoPosition.size + 2) });
                }
              }}
              className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold"
              title="लोगो मोठा करा"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Position Presets */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onUpdateCompanyLogoPosition?.({ x: 88, y: 10 })}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200"
              title="वर उजवीकडे सेट करा"
            >
              उजवीकडे
            </button>
            <button
              type="button"
              onClick={() => onUpdateCompanyLogoPosition?.({ x: 50, y: 14 })}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200"
              title="मध्यभागी सेट करा"
            >
              मध्यभागी
            </button>
            <button
              type="button"
              onClick={() => onUpdateCompanyLogoPosition?.({ x: 12, y: 10 })}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-200"
              title="वर डावीकडे सेट करा"
            >
              डावीकडे
            </button>
          </div>

          {/* Remove BG */}
          {onRemoveBackground && companyLogoUrl && (
            <button
              type="button"
              onClick={onRemoveBackground}
              disabled={isProcessingBg}
              className="px-2 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1 text-[11px] shadow-sm transition-all"
              title="AI ने लोगोचा बॅकग्राउंड काढा"
            >
              <Wand2 className="w-3 h-3" />
              <span>{isProcessingBg ? '...' : 'पारदर्शक (BG)'}</span>
            </button>
          )}
        </>
      )}

      {/* COPY / PASTE CONTROLS (Available for any element) */}
      <div className="flex items-center gap-1">
        {onCopyTarget && (
          <button
            type="button"
            onClick={onCopyTarget}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white"
            title="कॉपी करा (Ctrl+C)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
        {onPasteTarget && canPaste && (
          <button
            type="button"
            onClick={onPasteTarget}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white"
            title="पेस्ट करा (Ctrl+V)"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. NUDGE POSITION CONTROLS (खाली, वरती, डावीकडे, उजवीकडे सरकवा) */}
      {onNudgeTarget && selectedTarget.type !== 'frame' && (
        <div className="flex items-center gap-0.5 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 px-1 font-bold hidden sm:inline">सरकवा:</span>
          <button
            type="button"
            onClick={() => onNudgeTarget(0, -3)}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            title="वर सरकवा (Move Up)"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onNudgeTarget(0, 3)}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white"
            title="खाली सरकवा (Move Down)"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onNudgeTarget(-3, 0)}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white hidden sm:block"
            title="डावीकडे सरकवा (Move Left)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onNudgeTarget(3, 0)}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white hidden sm:block"
            title="उजवीकडे सरकवा (Move Right)"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. CUSTOM ELEMENT (STICKER) CONTROLS */}
      {selectedTarget.type === 'custom' && selectedCustomElement && (
        <>
          {/* Duplicate */}
          {onDuplicateCustomElement && (
            <button
              type="button"
              onClick={onDuplicateCustomElement}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
              title="डुप्लिकेट प्रत बनवा"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bring Forward / Send Back */}
          {onBringForward && (
            <button
              type="button"
              onClick={onBringForward}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
              title="वर आणा"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
          {onSendBackward && (
            <button
              type="button"
              onClick={onSendBackward}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white"
              title="मागे पाठवा"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Lock */}
          <button
            type="button"
            onClick={() => onUpdateCustomElement({ isLocked: !selectedCustomElement.isLocked })}
            className={`p-1.5 rounded-lg ${
              selectedCustomElement.isLocked ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200'
            }`}
            title={selectedCustomElement.isLocked ? 'Unlock Element' : 'Lock Element'}
          >
            {selectedCustomElement.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        </>
      )}

      {/* 5. FRAME CONTROLS */}
      {selectedTarget.type === 'frame' && (
        <button
          type="button"
          onClick={() => onOpenDrawerTab('frames')}
          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>फ्रेम बदला</span>
        </button>
      )}

      <div className="h-4 w-px bg-slate-700" />

      {/* DELETE / REMOVE BUTTON (Instant 1-Click Delete) */}
      <button
        type="button"
        onClick={onDeleteTarget}
        className="px-2.5 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold flex items-center gap-1 transition-all active:scale-95 border border-rose-500/30"
        title="हा घटक पोस्टरवरून डिलीट करा (Delete Element)"
      >
        <Trash2 className="w-3.5 h-3.5 text-rose-300" />
        <span className="font-bold">डिलीट</span>
      </button>

      {/* Close / Deselect */}
      <button
        type="button"
        onClick={onDeselect}
        className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 ml-0.5"
        title="निवड रद्द करा"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

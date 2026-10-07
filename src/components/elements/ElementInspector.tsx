import React, { useRef } from 'react';
import { CanvasCustomElement } from '../../types';
import {
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RotateCw,
  Sliders,
  Move,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Palette,
  Image as ImageIcon,
  ZoomIn,
  Type,
  Sparkles,
  Sun,
  Shield,
} from 'lucide-react';

interface ElementInspectorProps {
  element: CanvasCustomElement;
  onUpdate: (updated: Partial<CanvasCustomElement>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
}

const COLOR_SWATCHES = [
  { name: 'Royal Gold', hex: '#ffd700' },
  { name: 'Amber Glow', hex: '#f59e0b' },
  { name: 'Saffron Orange', hex: '#f97316' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Ruby Rose', hex: '#f43f5e' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Sky Cyan', hex: '#0ea5e9' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Deep Purple', hex: '#7c3aed' },
  { name: 'Charcoal Dark', hex: '#1e293b' },
  { name: 'Pure White', hex: '#ffffff' },
];

export const ElementInspector: React.FC<ElementInspectorProps> = ({
  element,
  onUpdate,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdate({ photoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-3.5 space-y-4 text-xs text-slate-700">
      {/* Top Header & Fast Action Toolbar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase text-[10px]">
            {element.type.slice(0, 2)}
          </div>
          <div>
            <span className="font-bold text-slate-900 capitalize block">
              {element.type} Element
            </span>
            <span className="text-[10px] text-slate-400">
              {element.subType || element.content || 'Vector Object'}
            </span>
          </div>
        </div>

        {/* Action icons (Lock, Duplicate, Delete) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onUpdate({ isLocked: !element.isLocked })}
            className={`p-1.5 rounded-md border transition-all ${
              element.isLocked
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title={element.isLocked ? 'Unlock Element' : 'Lock Element'}
          >
            {element.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="p-1.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all"
            title="Duplicate Layer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-md bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all"
            title="Delete Layer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. COLOR & RECOLOR PALETTE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-600" />
            Recolor / Color Theme:
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {element.color || element.fillColor || '#fde047'}
          </span>
        </div>

        {/* Quick Swatches */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => {
                onUpdate({
                  color: swatch.hex,
                  fillColor: swatch.hex,
                  strokeColor: swatch.hex === '#ffffff' ? '#cbd5e1' : swatch.hex,
                });
              }}
              style={{ backgroundColor: swatch.hex }}
              className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs shrink-0 hover:scale-125 transition-transform"
              title={swatch.name}
            />
          ))}
        </div>

        {/* Fill & Stroke Custom Pickers */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-[10px] text-slate-500 block mb-1">Fill / Icon Color:</span>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
              <input
                type="color"
                value={element.fillColor || element.color || '#6366f1'}
                onChange={(e) => onUpdate({ fillColor: e.target.value, color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={element.fillColor || element.color || '#6366f1'}
                onChange={(e) => onUpdate({ fillColor: e.target.value, color: e.target.value })}
                className="w-full text-[11px] font-mono bg-transparent border-0 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block mb-1">Stroke / Border Color:</span>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
              <input
                type="color"
                value={element.strokeColor || '#4338ca'}
                onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={element.strokeColor || '#4338ca'}
                onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                className="w-full text-[11px] font-mono bg-transparent border-0 focus:outline-none text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. PHOTO FRAME CUSTOMIZER (Only for photo frames) */}
      {element.type === 'photo-frame' && (
        <div className="space-y-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/80">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              Photo Inside Frame:
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              {element.frameShape || 'square'}
            </span>
          </div>

          {/* Upload / Replace Photo */}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Upload Photo
            </button>
            {element.photoUrl && (
              <button
                type="button"
                onClick={() => onUpdate({ photoUrl: '' })}
                className="px-2 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold rounded-lg text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Photo Zoom Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 flex items-center gap-1">
                <ZoomIn className="w-3 h-3 text-slate-500" /> Photo Zoom:
              </span>
              <span className="font-semibold text-slate-800">
                {Math.round((element.photoZoom || 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              value={element.photoZoom || 1}
              onChange={(e) => onUpdate({ photoZoom: parseFloat(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Photo Pan Offset X & Y */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 block mb-0.5">Pan X ({element.photoOffsetX || 0}%):</span>
              <input
                type="range"
                min="-50"
                max="50"
                value={element.photoOffsetX || 0}
                onChange={(e) => onUpdate({ photoOffsetX: parseInt(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block mb-0.5">Pan Y ({element.photoOffsetY || 0}%):</span>
              <input
                type="range"
                min="-50"
                max="50"
                value={element.photoOffsetY || 0}
                onChange={(e) => onUpdate({ photoOffsetY: parseInt(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>
          </div>

          {/* Photo Filters */}
          <div>
            <span className="text-[10px] text-slate-600 font-semibold block mb-1">
              Photo Color Filter:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {['none', 'festive', 'warm', 'cool', 'vintage', 'bw'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onUpdate({ photoFilter: f as any })}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold capitalize transition-all ${
                    (element.photoFilter || 'none') === f
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Polaroid label if polaroid frame */}
          {element.frameShape === 'polaroid' && (
            <div>
              <span className="text-[10px] text-slate-600 font-semibold block mb-1">
                Polaroid Handwritten Caption:
              </span>
              <input
                type="text"
                value={element.polaroidLabel || ''}
                onChange={(e) => onUpdate({ polaroidLabel: e.target.value })}
                placeholder="e.g. Memorable Day ✨"
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>
      )}

      {/* 3. BADGE & RIBBON TEXT CONTROLS (Only for badges/ribbons) */}
      {(element.type === 'badge' || element.type === 'ribbon') && (
        <div className="space-y-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-200/70">
          <span className="font-bold text-indigo-950 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-indigo-600" />
            Badge Text Content:
          </span>
          <input
            type="text"
            value={element.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
          />

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Font Size:</span>
              <span className="font-semibold text-slate-800">{element.fontSize || 16}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={element.fontSize || 16}
              onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      )}

      {/* 4. SIZE, ROTATION & OPACITY CONTROLS */}
      <div className="space-y-3 pt-1">
        {/* Width & Height Sliders */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Width:</span>
              <span className="font-semibold text-slate-800">{element.width || 25}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={element.width || 25}
              onChange={(e) => onUpdate({ width: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Height:</span>
              <span className="font-semibold text-slate-800">{element.height || 25}%</span>
            </div>
            <input
              type="range"
              min="4"
              max="95"
              value={element.height || 25}
              onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Rotation & Quick 90 deg */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-600 flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-slate-500" /> Rotation:
            </span>
            <span className="font-semibold text-slate-800">{element.rotation || 0}°</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="360"
              value={element.rotation || 0}
              onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => onUpdate({ rotation: ((element.rotation || 0) + 90) % 360 })}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold shrink-0"
              title="Rotate 90 degrees"
            >
              +90°
            </button>
          </div>
        </div>

        {/* Opacity Slider */}
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-slate-600">Opacity (पारदर्शकता):</span>
            <span className="font-semibold text-slate-800">
              {Math.round((element.opacity !== undefined ? element.opacity : 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={element.opacity !== undefined ? element.opacity : 1}
            onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Stroke Width / Border Style */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">
              Stroke Width ({element.strokeWidth || 0}px):
            </span>
            <input
              type="range"
              min="0"
              max="12"
              value={element.strokeWidth || 0}
              onChange={(e) => onUpdate({ strokeWidth: parseInt(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block mb-0.5">Stroke Style:</span>
            <select
              value={element.strokeStyle || 'solid'}
              onChange={(e) => onUpdate({ strokeStyle: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
        </div>

        {/* Drop Shadow Toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Drop Shadow (छाया)
          </span>
          <input
            type="checkbox"
            checked={Boolean(element.shadow)}
            onChange={(e) => onUpdate({ shadow: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 5. LAYER STACKING & ORDER */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <label className="font-bold text-slate-800 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          Layer Ordering (स्तर क्रम):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={onBringForward}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" /> Forward
          </button>
          <button
            type="button"
            onClick={onSendBackward}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" /> Backward
          </button>
          <button
            type="button"
            onClick={onBringToFront}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" /> Front
          </button>
          <button
            type="button"
            onClick={onSendToBack}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

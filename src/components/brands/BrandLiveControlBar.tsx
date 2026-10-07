import React from 'react';
import { BusinessProfile, FrameId } from '../../types';
import { FRAMES } from '../../data/frames';
import { 
  Layers, 
  Sparkles, 
  Smartphone, 
  Square, 
  Video, 
  Building, 
  Sun, 
  SlidersHorizontal, 
  Check, 
  Flame,
  Crown
} from 'lucide-react';

interface BrandLiveControlBarProps {
  activeProfile: BusinessProfile;
  selectedFrameId: FrameId;
  onSelectFrameId: (frameId: FrameId) => void;
  selectedFormat: 'all' | '1:1' | '9:16' | 'video' | 'business' | 'daily';
  onSelectFormat: (format: 'all' | '1:1' | '9:16' | 'video' | 'business' | 'daily') => void;
  onOpenProfileModal: () => void;
  totalTemplatesCount: number;
  onSelectCategory?: (category: string) => void;
}

export const BrandLiveControlBar: React.FC<BrandLiveControlBarProps> = ({
  activeProfile,
  selectedFrameId,
  onSelectFrameId,
  selectedFormat,
  onSelectFormat,
  onOpenProfileModal,
  totalTemplatesCount,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-2.5 sm:p-3.5 space-y-2.5 cv-auto">
      {/* Top Bar: Format Tabs & Business Profile Quick Link */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        {/* Format Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar mobile-smooth-scroll">
          <button
            type="button"
            onClick={() => onSelectFormat('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFormat === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>सर्व (All)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFormat('1:1')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFormat === '1:1'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>१:१ स्क्वेअर</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFormat('9:16')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFormat === '9:16'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>९:१६ स्टेटस</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFormat('video')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFormat === 'video'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400/40'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            <Video className={`w-3.5 h-3.5 ${selectedFormat === 'video' ? 'text-slate-950' : 'text-amber-600 animate-pulse'}`} />
            <span>व्हिडिओ डॅशबोर्ड</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${selectedFormat === 'video' ? 'bg-slate-950 text-amber-400' : 'bg-amber-200 text-amber-800'}`}>
              HD MP4
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFormat('business')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFormat === 'business'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>व्यवसाय</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFormat('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedFormat === 'daily'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>सुविचार</span>
          </button>
        </div>

        {/* Business Profile Shortcut */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Edit Business Details & Frame"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline font-bold">{activeProfile.name} •</span>
            <span>फ्रेम बदला</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar: Frame Carousel Selector (Live Feed Re-Frame) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            फ्रेम स्टाईल निवडा ({FRAMES.length} डिझाईन्स):
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            टॅप करून लगेच बदला
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar mobile-smooth-scroll">
          {FRAMES.map((frame) => {
            const isSelected = selectedFrameId === frame.id;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => onSelectFrameId(frame.id)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 text-orange-900 ring-2 ring-orange-500/20 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: frame.accent }}
                />
                <span>{frame.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

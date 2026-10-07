import React, { useState } from 'react';
import { FOOTER_FRAMES } from '../../data/footerFrames';
import { FrameDefinition, FrameId, BusinessProfile } from '../../types';
import { Palette, Check, Sparkles, Sliders, Eye, Search, Layers } from 'lucide-react';
import { FooterFrameRenderer } from '../frames/FooterFrameRenderer';

interface AdminFramesTabProps {
  activeProfile: BusinessProfile;
}

export const AdminFramesTab: React.FC<AdminFramesTabProps> = ({ activeProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'standard' | 'right-logo' | 'top-right-logo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFrameId, setPreviewFrameId] = useState<FrameId>('footer-01');

  const filteredFrames = FOOTER_FRAMES.filter((frame) => {
    const matchesCat = selectedCategory === 'all' || frame.category === selectedCategory;
    const matchesSearch =
      frame.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (frame.nameMarathi && frame.nameMarathi.includes(searchQuery)) ||
      frame.colorFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
      frame.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeFrame = FOOTER_FRAMES.find((f) => f.id === previewFrameId) || FOOTER_FRAMES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-white font-['Outfit']">27 Canonical Footer Frames & Color Palettes</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review all 27 pre-designed frames with distinct rich colors (Royal Blue, Deep Navy, Maroon, Burgundy, Emerald, Warm Cream, Golden Dark, Violet, Teal, etc.).
        </p>
      </div>

      {/* Category Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {(
            [
              { id: 'all', label: 'All 27 Frames' },
              { id: 'standard', label: '10 Standard Footers' },
              { id: 'right-logo', label: '10 Right-Side Logo' },
              { id: 'top-right-logo', label: '7 Top-Right Logo' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by color or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Live Frame Preview Spotlight */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              Live Preview: <span className="text-amber-400">{activeFrame.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeFrame.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: activeFrame.backgroundColor }}
            />
            <span className="text-xs font-bold text-slate-300 font-mono">{activeFrame.colorFamily}</span>
          </div>
        </div>

        {/* Scaled Poster Frame Container */}
        <div className="aspect-[16/9] w-full max-w-2xl mx-auto rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-end shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950 p-6 flex items-start justify-between">
            <span className="text-xs font-bold text-slate-400">Sample Poster Canvas</span>
            <span className="text-xs font-mono text-amber-400/80">Height: 20% bottom anchor</span>
          </div>

          <FooterFrameRenderer
            frameId={activeFrame.id}
            profile={activeProfile}
            isPosterBackgroundDark={!activeFrame.isLightBg}
          />
        </div>
      </div>

      {/* Frame Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFrames.map((frame) => {
          const isSelected = previewFrameId === frame.id;
          return (
            <div
              key={frame.id}
              onClick={() => setPreviewFrameId(frame.id)}
              className={`rounded-2xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                  : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: frame.backgroundColor }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {frame.badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">#{frame.frameNumber}</span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-1">{frame.name}</h4>
                {frame.nameMarathi && (
                  <p className="text-xs text-amber-300 font-['Noto_Sans_Devanagari'] mt-0.5">
                    {frame.nameMarathi}
                  </p>
                )}

                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {frame.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[10px]">{frame.category}</span>
                <span className="text-amber-400 font-semibold hover:underline">Preview →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

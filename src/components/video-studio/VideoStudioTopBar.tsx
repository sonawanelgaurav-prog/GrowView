import React, { useState } from 'react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Sparkles,
  Save,
  Download,
  X,
  Smartphone,
  Square,
  Monitor,
  Check,
  ChevronDown,
  Clock,
  Eye,
  LayoutGrid,
} from 'lucide-react';
import { VideoStudioAspectRatio, VideoStudioProject } from '../../types';

interface VideoStudioTopBarProps {
  project: VideoStudioProject;
  isPlaying: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isCleanView?: boolean;
  onToggleCleanView?: () => void;
  onTogglePlay: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAutoAnimate: () => void;
  onSaveDraft: () => void;
  onOpenExportModal: (resolution: '1080p' | '720p' | '480p') => void;
  onChangeAspectRatio: (ratio: VideoStudioAspectRatio) => void;
  onUpdateTitle: (newTitle: string) => void;
  onUpdateTotalDuration?: (duration: number) => void;
  onClose: () => void;
}

export const VideoStudioTopBar: React.FC<VideoStudioTopBarProps> = ({
  project,
  isPlaying,
  canUndo,
  canRedo,
  isCleanView = false,
  onToggleCleanView,
  onTogglePlay,
  onUndo,
  onRedo,
  onAutoAnimate,
  onSaveDraft,
  onOpenExportModal,
  onChangeAspectRatio,
  onUpdateTitle,
  onUpdateTotalDuration,
  onClose,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleQuickSave = () => {
    onSaveDraft();
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  return (
    <header className="h-13 sm:h-14 bg-slate-950 border-b border-slate-800 px-2 sm:px-4 flex items-center justify-between gap-2 text-white select-none z-30 shrink-0 overflow-x-auto scrollbar-none">
      {/* Left: Brand & Project Name */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-600 to-amber-600 px-2.5 sm:px-3 py-1 rounded-xl shadow-md shrink-0">
          <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
          <span className="font-extrabold text-xs tracking-wide hidden lg:inline whitespace-nowrap">
            Gunashree Video Studio
          </span>
          <span className="font-extrabold text-xs lg:hidden whitespace-nowrap">Studio</span>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block shrink-0" />

        {/* Project Title with inline editing */}
        <div className="min-w-0 shrink">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-slate-800 border border-amber-500/60 rounded-lg px-2 py-0.5 text-xs font-semibold text-white focus:outline-hidden"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setTitleInput(project.title);
                setIsEditingTitle(true);
              }}
              className="hover:text-amber-400 font-semibold text-xs text-slate-200 truncate max-w-[90px] sm:max-w-[150px] md:max-w-[200px] text-left transition-colors whitespace-nowrap"
              title="प्रकल्प नाव बदलण्यासाठी क्लिक करा"
            >
              {project.title}
            </button>
          )}
        </div>
      </div>

      {/* Center: Aspect Ratio & Undo/Redo Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Aspect Ratio Buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => onChangeAspectRatio('1:1')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
              project.aspectRatio === '1:1'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="1:1 Square Post (1080x1080)"
          >
            <Square className="w-3 h-3" />
            <span className="hidden md:inline">1:1 Square</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeAspectRatio('4:5')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
              project.aspectRatio === '4:5'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="4:5 Portrait Feed (1080x1350)"
          >
            <Smartphone className="w-3 h-3 rotate-90" />
            <span className="hidden md:inline">4:5 Portrait</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeAspectRatio('9:16')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
              project.aspectRatio === '9:16'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="9:16 Vertical Reel / Status (1080x1920)"
          >
            <Smartphone className="w-3 h-3" />
            <span className="hidden md:inline">9:16 Vertical</span>
          </button>
        </div>

        {/* Video Duration Dropdown */}
        {onUpdateTotalDuration && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-bold text-amber-300 transition-colors shadow-xs"
              title="व्हिडिओ लेन्थ / कालावधी बदला"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{project.duration}s</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isDurationDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  व्हिडिओ लेन्थ (कालावधी)
                </div>
                {[
                  { dur: 3, label: '3 sec (झटपट)', badge: 'Fast' },
                  { dur: 5, label: '5 sec (रिव्हिल)', badge: 'Short' },
                  { dur: 6, label: '6 sec (स्टँडर्ड रील)', badge: 'Reel' },
                  { dur: 8, label: '8 sec (स्मूथ)', badge: 'Standard' },
                  { dur: 10, label: '10 sec (सविस्तर)', badge: 'Story' },
                  { dur: 15, label: '15 sec (फुल स्टोरी)', badge: 'Story' },
                  { dur: 30, label: '30 sec (स्टेटस)', badge: 'Status' },
                ].map((item) => (
                  <button
                    key={item.dur}
                    type="button"
                    onClick={() => {
                      onUpdateTotalDuration(item.dur);
                      setIsDurationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      project.duration === item.dur
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded-md font-mono">
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-xl p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg text-slate-300 transition-colors ${
              canUndo ? 'hover:bg-slate-800 hover:text-white' : 'opacity-30 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg text-slate-300 transition-colors ${
              canRedo ? 'hover:bg-slate-800 hover:text-white' : 'opacity-30 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Clean View, Auto Animate, Save, Export & Close */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* 👁️ CLEAN VIEW (क्लीन व्ह्यू) TOGGLE */}
        {onToggleCleanView && (
          <button
            type="button"
            onClick={onToggleCleanView}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              isCleanView
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold ring-2 ring-amber-400/50'
                : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
            title={isCleanView ? 'सर्व साइडबार उघडा' : 'क्लीन व्ह्यू: साइडबार लपवून कॅनव्हास स्पष्ट बघा'}
          >
            {isCleanView ? (
              <>
                <LayoutGrid className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden xs:inline">सर्व टूल्स</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">क्लीन व्ह्यू</span>
              </>
            )}
          </button>
        )}

        {/* ✨ Auto Animate Poster Button */}
        <button
          type="button"
          onClick={onAutoAnimate}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 text-purple-200 hover:text-white hover:border-purple-400 text-xs font-bold transition-all shadow-xs shrink-0 whitespace-nowrap"
          title="पोस्टर घटकांवर ऑटोमॅटिक ॲनिमेशन लागू करा"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span>Auto Animate</span>
        </button>

        {/* Save Draft */}
        <button
          type="button"
          onClick={handleQuickSave}
          className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 whitespace-nowrap ${
            savedBadge
              ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
          }`}
          title="प्रकल्प सेव्ह करा (Ctrl+S)"
        >
          {savedBadge ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5 text-slate-400" />}
          <span className="hidden sm:inline">{savedBadge ? 'Saved' : 'Save'}</span>
        </button>

        {/* Export Video MP4 with Resolution Dropdown */}
        <div className="relative shrink-0">
          <div className="flex items-center rounded-xl overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 shadow-md">
            <button
              type="button"
              onClick={() => onOpenExportModal('1080p')}
              className="px-2.5 sm:px-3 py-1.5 text-slate-950 font-black text-xs flex items-center gap-1 hover:from-amber-400 hover:to-orange-400 active:scale-95 transition-all whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="px-1 py-1.5 bg-orange-600/40 hover:bg-orange-600/70 text-slate-950 transition-colors border-l border-amber-600/40"
              title="रिझोल्युशन निवडा"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Export Resolution Dropdown */}
          {isExportDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Export Resolution
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onOpenExportModal('1080p');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200"
              >
                <span>Full HD 1080p</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-bold">
                  High
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onOpenExportModal('720p');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200"
              >
                <span>HD 720p</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md">Fast</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onOpenExportModal('480p');
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200"
              >
                <span>SD 480p (Light)</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md">Status</span>
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          title="स्टुडिओ बंद करा"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

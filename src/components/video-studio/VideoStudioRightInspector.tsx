import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Type,
  Sparkles,
  Key,
  Maximize2,
  RotateCw,
  Eye,
  Lock,
  Plus,
  Trash2,
  Move,
  Clock,
  Smartphone,
  Square,
  Monitor,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Play,
  RotateCcw,
  Check,
  Music,
  FolderKanban,
  Volume2,
  ChevronRight,
} from 'lucide-react';
import {
  VideoStudioLayer,
  VideoStudioProject,
  VideoStudioAspectRatio,
  VideoEntrancePresetId,
  VideoMovementPresetId,
  VideoExitPresetId,
  VideoEasing,
  VideoTextAnimation,
} from '../../types';
import {
  ENTRANCE_PRESETS,
  MOVEMENT_PRESETS,
  EXIT_PRESETS,
} from '../../data/videoStudioPresets';
import { DEFAULT_ANIMATION_TEMPLATES } from '../../utils/autoAnimatePoster';
import { AUDIO_TRACKS_LIBRARY } from '../../data/videoStudioAudio';

interface VideoStudioRightInspectorProps {
  layer: VideoStudioLayer | null;
  currentTime: number;
  totalDuration: number;
  project?: VideoStudioProject;
  allLayers?: VideoStudioLayer[];
  onUpdateLayer: (layerId: string, updates: Partial<VideoStudioLayer>) => void;
  onAddKeyframe: (layerId: string, time: number) => void;
  onDeleteKeyframe: (layerId: string, keyframeId: string) => void;
  onUpdateTotalDuration?: (duration: number) => void;
  onChangeAspectRatio?: (aspectRatio: VideoStudioAspectRatio) => void;
  onSelectLayer?: (layerId: string) => void;
  onApplyAnimationTemplate?: (templateId: string) => void;
  onSeek?: (time: number) => void;
  onClosePanel?: () => void;
}

type InspectorTab = 'text' | 'animation' | 'transform' | 'appearance' | 'keyframes';

// Quick Marathi festival phrases for 1-tap text substitution
const QUICK_MARATHI_SLOGANS = [
  '।। मंगलमूर्ती मोरया ।।',
  '।। गणपती बाप्पा मोरया ।।',
  'गणेशोत्सवाच्या हार्दिक शुभेच्छा!',
  'सुखकर्ता दुखहर्ता वार्ता विघ्नाची...',
  'सर्व गणेशभक्तांचे मनःपूर्वक स्वागत!',
  '।। बाप्पा मोरया, पुढच्या वर्षी लवकर या ।।',
  'आपला नम्र / सस्नेह निमंत्रण',
];

// Festive color presets
const COLOR_PRESETS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Gold', hex: '#fbbf24' },
  { name: 'Saffron', hex: '#f97316' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'Crimson', hex: '#ef4444' },
  { name: 'Royal Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
];

export const VideoStudioRightInspector: React.FC<VideoStudioRightInspectorProps> = ({
  layer,
  currentTime,
  totalDuration,
  project,
  allLayers = [],
  onUpdateLayer,
  onAddKeyframe,
  onDeleteKeyframe,
  onUpdateTotalDuration,
  onChangeAspectRatio,
  onSelectLayer,
  onApplyAnimationTemplate,
  onSeek,
  onClosePanel,
}) => {
  const isTextLayer = Boolean(
    layer &&
      (layer.text !== undefined ||
        layer.type === 'heading' ||
        layer.type === 'subheading' ||
        layer.type === 'text' ||
        layer.type === 'logo')
  );

  const [activeTab, setActiveTab] = useState<InspectorTab>(isTextLayer ? 'text' : 'animation');

  // When selected layer changes, adapt default tab
  useEffect(() => {
    if (isTextLayer) {
      setActiveTab('text');
    } else if (layer) {
      setActiveTab('animation');
    }
  }, [layer?.id, isTextLayer]);

  // If no layer selected, show Project Video Settings (Duration, All Texts, Aspect Ratio, Theme)
  if (!layer) {
    const textLayers = allLayers.filter(
      (l) =>
        l.text !== undefined ||
        l.type === 'heading' ||
        l.type === 'subheading' ||
        l.type === 'text' ||
        l.type === 'logo'
    );

    return (
      <aside className="w-68 sm:w-74 xl:w-80 bg-slate-950 border-l border-slate-800 flex flex-col h-full select-none shrink-0 z-20 text-slate-300 overflow-hidden">
        {/* Header */}
        <div className="p-2.5 sm:p-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              व्हिडिओ सेटिंग्ज (Settings)
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
              प्रकल्प
            </span>
            {onClosePanel && (
              <button
                type="button"
                onClick={onClosePanel}
                className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                title="पॅनल बंद करा"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* 1. VIDEO DURATION (व्हिडिओ लेन्थ) */}
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>व्हिडिओ लेन्थ (कालावधी)</span>
              </div>
              <span className="text-sm font-black font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                {totalDuration}s
              </span>
            </div>

            {/* Duration Slider */}
            {onUpdateTotalDuration && (
              <>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={totalDuration}
                  onChange={(e) => onUpdateTotalDuration(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />

                {/* Duration Chips */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { dur: 3, label: '3s (Fast)' },
                    { dur: 5, label: '5s (Short)' },
                    { dur: 6, label: '6s (Reel ⭐)' },
                    { dur: 8, label: '8s (Smooth)' },
                    { dur: 10, label: '10s (Story)' },
                    { dur: 15, label: '15s (Full)' },
                  ].map((item) => (
                    <button
                      key={item.dur}
                      type="button"
                      onClick={() => onUpdateTotalDuration(item.dur)}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all border ${
                        totalDuration === item.dur
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 2. ASPECT RATIO (स्क्रीन आकार) */}
          {onChangeAspectRatio && project && (
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">स्क्रीन आकार (Aspect Ratio)</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeAspectRatio('1:1')}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all ${
                    project.aspectRatio === '1:1'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>1:1 चौरस</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeAspectRatio('4:5')}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all ${
                    project.aspectRatio === '4:5'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 rotate-90" />
                  <span>4:5 पोर्ट्रेट</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeAspectRatio('9:16')}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 border transition-all ${
                    project.aspectRatio === '9:16'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 व्हर्टिकल</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. EDIT ALL TEXTS IN PROJECT (सर्व मजकूर बदला) */}
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Type className="w-4 h-4 text-amber-400" />
                <span>व्हिडिओतील सर्व मजकूर बदला ({textLayers.length})</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              खालील कोणत्याही मजकुरावर थेट टाईप करून व्हिडिओमध्ये बदल करा:
            </p>

            {textLayers.length === 0 ? (
              <p className="text-xs text-slate-500 italic">कोणताही मजकूर आढळला नाही.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {textLayers.map((tl) => (
                  <div
                    key={tl.id}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold text-amber-300">
                      <span className="truncate">{tl.nameMarathi || tl.name}</span>
                      {onSelectLayer && (
                        <button
                          type="button"
                          onClick={() => onSelectLayer(tl.id)}
                          className="text-slate-400 hover:text-white text-[9px] underline"
                        >
                          सिलेक्ट करा
                        </button>
                      )}
                    </div>
                    <textarea
                      value={tl.text || ''}
                      onChange={(e) => onUpdateLayer(tl.id, { text: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-lg p-1.5 text-xs text-white focus:outline-hidden resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. OVERALL ANIMATION THEMES (थीम ॲनिमेशन) */}
          {onApplyAnimationTemplate && (
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>ॲनिमेशन थीम बदला</span>
              </div>
              <div className="space-y-1.5">
                {DEFAULT_ANIMATION_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onApplyAnimationTemplate(tpl.id)}
                    className="w-full text-left p-2 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">
                        {tpl.nameMarathi || tpl.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{tpl.description}</div>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-md shrink-0">
                      लागू करा
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // LAYER IS SELECTED: SHOW DETAILED PROPERTIES INSPECTOR
  return (
    <aside className="w-68 sm:w-74 xl:w-80 bg-slate-950 border-l border-slate-800 flex flex-col h-full select-none shrink-0 z-20 text-slate-300 overflow-hidden">
      {/* Header: Layer Title & Visibility / Lock */}
      <div className="p-2.5 sm:p-3 border-b border-slate-800 bg-slate-900/70 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={layer.nameMarathi || layer.name}
            onChange={(e) => onUpdateLayer(layer.id, { name: e.target.value })}
            className="text-xs font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-400 focus:outline-hidden truncate w-full"
            title="घटकाचे नाव बदला"
          />
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span className="capitalize text-amber-300 font-semibold">{layer.type}</span>
            <span>•</span>
            <span className="text-slate-400">z: {layer.zIndex}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onClosePanel && (
            <button
              type="button"
              onClick={onClosePanel}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors mr-1"
              title="पॅनल बंद करा"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onUpdateLayer(layer.id, { visible: !layer.visible })}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              layer.visible ? 'border-slate-800 text-slate-300' : 'border-rose-500/50 text-rose-400'
            }`}
            title={layer.visible ? 'Hide' : 'Show'}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdateLayer(layer.id, { locked: !layer.locked })}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              layer.locked ? 'border-amber-500/50 text-amber-400' : 'border-slate-800 text-slate-300'
            }`}
            title={layer.locked ? 'Unlock' : 'Lock'}
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/40 text-[11px] font-bold overflow-x-auto scrollbar-none">
        {isTextLayer && (
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-2 text-center transition-colors whitespace-nowrap ${
              activeTab === 'text'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/80 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            मजकूर (Text)
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveTab('animation')}
          className={`flex-1 py-2 px-2 text-center transition-colors whitespace-nowrap ${
            activeTab === 'animation'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/80 font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ॲनिमेशन
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('transform')}
          className={`flex-1 py-2 px-2 text-center transition-colors whitespace-nowrap ${
            activeTab === 'transform'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/80 font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          स्थान (Position)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`flex-1 py-2 px-2 text-center transition-colors whitespace-nowrap ${
            activeTab === 'appearance'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/80 font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          रंग/शैली
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('keyframes')}
          className={`flex-1 py-2 px-2 text-center transition-colors whitespace-nowrap ${
            activeTab === 'keyframes'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-900/80 font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          कीफ्रेम
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 text-xs space-y-3.5">
        {/* TAB 1: TEXT SETTINGS */}
        {activeTab === 'text' && isTextLayer && (
          <div className="space-y-3">
            {/* Live Text Area */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                देवनागरी / मराठी मजकूर (Edit Text)
              </span>
              <textarea
                value={layer.text || ''}
                onChange={(e) => onUpdateLayer(layer.id, { text: e.target.value })}
                rows={3}
                placeholder="येथे मजकूर टाईप करा..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-hidden resize-none leading-relaxed"
              />
            </div>

            {/* Quick Festive Slogans Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                १-क्लिक मराठी सुविचार / घोषणा
              </span>
              <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                {QUICK_MARATHI_SLOGANS.map((slogan) => (
                  <button
                    key={slogan}
                    type="button"
                    onClick={() => onUpdateLayer(layer.id, { text: slogan })}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[10px] transition-colors border border-slate-800 text-left truncate max-w-full"
                    title={slogan}
                  >
                    {slogan}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Selector */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                मराठी फॉन्ट (Font Family)
              </span>
              <select
                value={layer.fontFamily || 'Poppins, sans-serif'}
                onChange={(e) => onUpdateLayer(layer.id, { fontFamily: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
              >
                <option value="Yatra One, serif">Yatra One (शाही मराठी राजमुद्रा)</option>
                <option value="Rozha One, serif">Rozha One (ठळक व रुबाबदार)</option>
                <option value="Mukta, sans-serif">Mukta (स्वच्छ व आधुनिक देवनागरी)</option>
                <option value="Poppins, sans-serif">Poppins (बोल्ड कॉर्पोरेट)</option>
              </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>साइज:</span>
                  <span className="font-mono text-amber-400 font-bold">{layer.fontSize || 42}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="130"
                  step="2"
                  value={layer.fontSize || 42}
                  onChange={(e) => onUpdateLayer(layer.id, { fontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400">फॉन्ट जाडी (Weight):</span>
                <select
                  value={layer.fontWeight || 'bold'}
                  onChange={(e) => onUpdateLayer(layer.id, { fontWeight: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg p-1 text-xs text-white"
                >
                  <option value="400">Normal</option>
                  <option value="600">Semi-Bold</option>
                  <option value="bold">Bold (ठळक)</option>
                  <option value="900">Black (अति-ठळक)</option>
                </select>
              </div>
            </div>

            {/* Text Color & Quick Color Swatches */}
            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  मजकूर रंग (Text Color)
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={layer.color || '#ffffff'}
                    onChange={(e) => onUpdateLayer(layer.id, { color: e.target.value })}
                    className="w-6 h-6 rounded-md bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-slate-300">{layer.color || '#fff'}</span>
                </div>
              </div>

              {/* Swatches */}
              <div className="flex items-center gap-1.5 pt-1">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onUpdateLayer(layer.id, { color: c.hex })}
                    className="w-6 h-6 rounded-full border border-slate-700 transition-transform hover:scale-110 shadow-xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400">संरेखन (Alignment):</span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => onUpdateLayer(layer.id, { textAlign: 'left' })}
                  className={`p-1.5 rounded-md ${
                    layer.textAlign === 'left' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLayer(layer.id, { textAlign: 'center' })}
                  className={`p-1.5 rounded-md ${
                    layer.textAlign === 'center' || !layer.textAlign
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLayer(layer.id, { textAlign: 'right' })}
                  className={`p-1.5 rounded-md ${
                    layer.textAlign === 'right' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANIMATION PRESETS & TIMING */}
        {activeTab === 'animation' && (
          <div className="space-y-3.5">
            {/* Quick Test Preview Button */}
            {onSeek && (
              <button
                type="button"
                onClick={() => {
                  onSeek(Math.max(0, (layer.entranceDelay || 0) - 0.2));
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>हे ॲनिमेशन तपासा (Play This Layer)</span>
              </button>
            )}

            {/* 1. Entrance Preset */}
            <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  १. प्रवेश ॲनिमेशन (Entrance)
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {layer.entrancePreset}
                </span>
              </div>

              <select
                value={layer.entrancePreset}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    entrancePreset: e.target.value as VideoEntrancePresetId,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {ENTRANCE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.nameMarathi})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400">वेळ: {layer.entranceDuration}s</span>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={layer.entranceDuration}
                    onChange={(e) =>
                      onUpdateLayer(layer.id, { entranceDuration: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">उशीर (Delay): {layer.entranceDelay}s</span>
                  <input
                    type="range"
                    min="0.0"
                    max="3.0"
                    step="0.1"
                    value={layer.entranceDelay}
                    onChange={(e) =>
                      onUpdateLayer(layer.id, { entranceDelay: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Easing */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400">ॲनिमेशन वक्र (Easing Curve):</span>
                <select
                  value={layer.entranceEasing}
                  onChange={(e) =>
                    onUpdateLayer(layer.id, {
                      entranceEasing: e.target.value as VideoEasing,
                    })
                  }
                  className="w-full mt-0.5 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                >
                  <option value="easeOut">Ease Out (गुळगुळीत थांबा)</option>
                  <option value="bounce">Bounce (स्प्रिंग सारखा उडी मारणारा)</option>
                  <option value="elastic">Elastic (रबर सारखा ताणणारा)</option>
                  <option value="easeInOut">Ease In-Out (संतुलित)</option>
                  <option value="linear">Linear (सरळ गती)</option>
                </select>
              </div>
            </div>

            {/* 2. Movement Preset */}
            <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  २. सतत हालचाल (Continuous Movement)
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {layer.movementPreset}
                </span>
              </div>

              <select
                value={layer.movementPreset}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    movementPreset: e.target.value as VideoMovementPresetId,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {MOVEMENT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.nameMarathi})
                  </option>
                ))}
              </select>

              {layer.movementPreset !== 'none' && (
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>हालचाल गती (Speed Multiplier)</span>
                    <span className="font-mono text-amber-400 font-bold">{layer.movementSpeed || 1}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.1"
                    value={layer.movementSpeed || 1}
                    onChange={(e) =>
                      onUpdateLayer(layer.id, { movementSpeed: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
              )}
            </div>

            {/* 3. Exit Preset */}
            <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  ३. शेवट ॲनिमेशन (Exit Animation)
                </span>
                <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {layer.exitPreset}
                </span>
              </div>

              <select
                value={layer.exitPreset}
                onChange={(e) =>
                  onUpdateLayer(layer.id, {
                    exitPreset: e.target.value as VideoExitPresetId,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {EXIT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.nameMarathi})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSFORM (Position, Scale, Rotation) */}
        {activeTab === 'transform' && (
          <div className="space-y-3">
            {/* Quick Center Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const baseW = project?.aspectRatio === '9:16' ? 1080 : 1080;
                  onUpdateLayer(layer.id, { x: baseW / 2 });
                }}
                className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300"
              >
                मध्यभागी ठेवा (Center X)
              </button>
              <button
                type="button"
                onClick={() => {
                  const baseH = project?.aspectRatio === '9:16' ? 1920 : 1080;
                  onUpdateLayer(layer.id, { y: baseH / 2 });
                }}
                className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300"
              >
                मध्यभागी ठेवा (Center Y)
              </button>
            </div>

            {/* Position (X, Y) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                स्थान (Position X, Y)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                  <span className="text-slate-500 text-[10px] font-mono mr-1.5">X:</span>
                  <input
                    type="number"
                    value={Math.round(layer.x)}
                    onChange={(e) => onUpdateLayer(layer.id, { x: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                  <span className="text-slate-500 text-[10px] font-mono mr-1.5">Y:</span>
                  <input
                    type="number"
                    value={Math.round(layer.y)}
                    onChange={(e) => onUpdateLayer(layer.id, { y: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Size (W, H) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                आकार (Width, Height)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                  <span className="text-slate-500 text-[10px] font-mono mr-1.5">W:</span>
                  <input
                    type="number"
                    value={Math.round(layer.width)}
                    onChange={(e) => onUpdateLayer(layer.id, { width: parseFloat(e.target.value) || 50 })}
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                  <span className="text-slate-500 text-[10px] font-mono mr-1.5">H:</span>
                  <input
                    type="number"
                    value={Math.round(layer.height)}
                    onChange={(e) => onUpdateLayer(layer.id, { height: parseFloat(e.target.value) || 50 })}
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Scale Slider */}
            <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>स्केल (Scale)</span>
                <span className="font-mono text-amber-400">{Math.round((layer.scale || 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.05"
                value={layer.scale || 1}
                onChange={(e) => onUpdateLayer(layer.id, { scale: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Rotation Slider */}
            <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-slate-300 text-xs">
                <span>फिरवा (Rotation)</span>
                <span className="font-mono text-amber-400">{Math.round(layer.rotation || 0)}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={layer.rotation || 0}
                onChange={(e) => onUpdateLayer(layer.id, { rotation: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500"
              />
              <div className="flex items-center gap-1 pt-1 justify-between">
                {[0, 45, 90, 180, -90].map((deg) => (
                  <button
                    key={deg}
                    type="button"
                    onClick={() => onUpdateLayer(layer.id, { rotation: deg })}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 hover:text-white"
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: APPEARANCE (Opacity, Blur, Brightness) */}
        {activeTab === 'appearance' && (
          <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-300">
                <span>पारदर्शकता (Opacity)</span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round((layer.opacity !== undefined ? layer.opacity : 1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={layer.opacity !== undefined ? layer.opacity : 1}
                onChange={(e) => onUpdateLayer(layer.id, { opacity: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-300">
                <span>तेज (Brightness)</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round((layer.brightness || 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={layer.brightness || 1}
                onChange={(e) => onUpdateLayer(layer.id, { brightness: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-300">
                <span>धुसरपणा (Blur FX)</span>
                <span className="font-mono text-amber-400 font-bold">{layer.blur || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={layer.blur || 0}
                onChange={(e) => onUpdateLayer(layer.id, { blur: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        )}

        {/* TAB 5: KEYFRAMES */}
        {activeTab === 'keyframes' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  कीफ्रेम्स ({layer.keyframes?.length || 0})
                </span>
                <p className="text-[10px] text-slate-500">
                  सध्याची वेळ: <span className="text-amber-400 font-mono">{currentTime.toFixed(2)}s</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => onAddKeyframe(layer.id, currentTime)}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Key</span>
              </button>
            </div>

            {(!layer.keyframes || layer.keyframes.length === 0) ? (
              <div className="bg-slate-900/60 p-3 rounded-xl border border-dashed border-slate-800 text-center text-[11px] text-slate-500">
                या घटकावर अद्याप कोणतेही कीफ्रेम नाहीत. 'Add Key' बटण दाबून सध्याच्या वेळेवर कीफ्रेम जोडा.
              </div>
            ) : (
              <div className="space-y-1.5">
                {layer.keyframes.map((kf) => (
                  <div
                    key={kf.id}
                    className="bg-slate-900 border border-slate-800 p-2 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <span className="font-mono font-bold text-xs text-white">{kf.time.toFixed(2)}s</span>
                        <span className="text-[10px] text-slate-500 ml-2">Scale: {Math.round((kf.scale || 1) * 100)}%</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteKeyframe(layer.id, kf.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                      title="Delete Keyframe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

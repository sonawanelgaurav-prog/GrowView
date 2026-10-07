import React, { useState } from 'react';
import {
  Layers,
  Image as ImageIcon,
  Type,
  Sparkles,
  Music,
  FolderKanban,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Plus,
  ArrowUp,
  ArrowDown,
  Volume2,
  VolumeX,
  Play,
  Square,
  Check,
  BookmarkPlus,
  Move,
} from 'lucide-react';
import {
  VideoStudioLayer,
  VideoStudioLayerType,
  VideoEntrancePresetId,
  VideoMovementPresetId,
  VideoExitPresetId,
  PosterTemplate,
  BusinessProfile,
} from '../../types';
import {
  ENTRANCE_PRESETS,
  MOVEMENT_PRESETS,
  EXIT_PRESETS,
} from '../../data/videoStudioPresets';
import { AUDIO_TRACKS_LIBRARY, videoStudioAudioEngine } from '../../data/videoStudioAudio';
import { DEFAULT_ANIMATION_TEMPLATES } from '../../utils/autoAnimatePoster';

type ToolTab = 'layers' | 'presets' | 'media' | 'text' | 'effects' | 'audio' | 'templates';

interface VideoStudioLeftPanelProps {
  layers: VideoStudioLayer[];
  selectedLayerId: string | null;
  audioTrack: string;
  audioVolume: number;
  availablePosters: PosterTemplate[];
  activeProfile: BusinessProfile;
  onSelectLayer: (layerId: string) => void;
  onUpdateLayer: (layerId: string, updates: Partial<VideoStudioLayer>) => void;
  onAddLayer: (type: VideoStudioLayerType, name?: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onDuplicateLayer: (layerId: string) => void;
  onReorderLayer: (layerId: string, direction: 'up' | 'down') => void;
  onSelectAudioTrack: (trackId: string) => void;
  onUpdateAudioVolume: (volume: number) => void;
  onApplyAnimationTemplate: (templateId: string) => void;
  onSelectPosterAsBase: (poster: PosterTemplate) => void;
}

export const VideoStudioLeftPanel: React.FC<VideoStudioLeftPanelProps> = ({
  layers,
  selectedLayerId,
  audioTrack,
  audioVolume,
  availablePosters,
  activeProfile,
  onSelectLayer,
  onUpdateLayer,
  onAddLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onReorderLayer,
  onSelectAudioTrack,
  onUpdateAudioVolume,
  onApplyAnimationTemplate,
  onSelectPosterAsBase,
}) => {
  const [activeTab, setActiveTab] = useState<ToolTab>('layers');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [presetCategory, setPresetCategory] = useState<'entrance' | 'movement' | 'exit'>('entrance');
  const [templateSavedToast, setTemplateSavedToast] = useState(false);

  // Audio preview toggle
  const handleToggleAudioPreview = (trackId: string) => {
    if (playingAudioId === trackId) {
      videoStudioAudioEngine.stop();
      setPlayingAudioId(null);
    } else {
      videoStudioAudioEngine.playTrack(trackId, audioVolume);
      setPlayingAudioId(trackId);
    }
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  return (
    <aside className="w-68 sm:w-74 xl:w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full select-none shrink-0 z-20">
      {/* Icon Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 p-1.5 bg-slate-900/60 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'layers'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Layers (लेयर्स)"
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Layers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'presets'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title="25 Animation Presets"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px]">Presets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'media'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Media & Posters"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-[10px]">Media</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'text'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Marathi Text & Slogans"
        >
          <Type className="w-4 h-4" />
          <span className="text-[10px]">Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audio')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'audio'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Festive Music Library"
        >
          <Music className="w-4 h-4" />
          <span className="text-[10px]">Audio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'templates'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Animation Templates"
        >
          <FolderKanban className="w-4 h-4" />
          <span className="text-[10px]">Templates</span>
        </button>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-3 text-slate-300">
        {/* TAB 1: LAYERS */}
        {activeTab === 'layers' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Layers ({layers.length})
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onAddLayer('text', 'New Headline')}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-800"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddLayer('particles', 'Golden Sparkles')}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-800"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>FX</span>
                </button>
              </div>
            </div>

            {/* Layer Item Stack (sorted descending by zIndex) */}
            <div className="space-y-1.5">
              {[...layers]
                .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
                .map((layer, index) => {
                  const isSelected = layer.id === selectedLayerId;
                  return (
                    <div
                      key={layer.id}
                      onClick={() => onSelectLayer(layer.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-xs'
                          : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">
                            {layer.nameMarathi || layer.name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                            <span className="capitalize">{layer.type}</span>
                            <span>•</span>
                            <span className="text-amber-300">{layer.entrancePreset.replace(/_/g, ' ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls: Visible, Lock, Up/Down, Duplicate, Delete */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onUpdateLayer(layer.id, { visible: !layer.visible })}
                          className={`p-1 rounded-md text-slate-400 hover:text-white transition-colors ${
                            !layer.visible ? 'text-rose-400' : ''
                          }`}
                          title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                        >
                          {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => onUpdateLayer(layer.id, { locked: !layer.locked })}
                          className={`p-1 rounded-md text-slate-400 hover:text-white transition-colors ${
                            layer.locked ? 'text-amber-400' : ''
                          }`}
                          title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                        >
                          {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => onReorderLayer(layer.id, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onReorderLayer(layer.id, 'down')}
                          disabled={index === layers.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDuplicateLayer(layer.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-white"
                          title="Duplicate Layer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteLayer(layer.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-400"
                          title="Delete Layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 2: 25 ANIMATION PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">25 Animation Presets</h4>
                <p className="text-[10px] text-slate-400">
                  {selectedLayer
                    ? `Applying to: ${selectedLayer.name}`
                    : 'Select a layer on canvas or layers tab'}
                </p>
              </div>
            </div>

            {/* Category Selector: Entrance (10), Movement (10), Exit (5) */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setPresetCategory('entrance')}
                className={`py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                  presetCategory === 'entrance'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Entrance (10)
              </button>
              <button
                type="button"
                onClick={() => setPresetCategory('movement')}
                className={`py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                  presetCategory === 'movement'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Movement (10)
              </button>
              <button
                type="button"
                onClick={() => setPresetCategory('exit')}
                className={`py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                  presetCategory === 'exit'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Exit (5)
              </button>
            </div>

            {/* Presets List */}
            <div className="space-y-1.5">
              {presetCategory === 'entrance' &&
                ENTRANCE_PRESETS.map((p) => {
                  const isActive = selectedLayer?.entrancePreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (selectedLayerId) {
                          onUpdateLayer(selectedLayerId, { entrancePreset: p.id });
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-500 text-white'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-amber-400 font-normal">({p.nameMarathi})</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.description}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}

              {presetCategory === 'movement' &&
                MOVEMENT_PRESETS.map((p) => {
                  const isActive = selectedLayer?.movementPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (selectedLayerId) {
                          onUpdateLayer(selectedLayerId, { movementPreset: p.id });
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-500 text-white'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-amber-400 font-normal">({p.nameMarathi})</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.description}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}

              {presetCategory === 'exit' &&
                EXIT_PRESETS.map((p) => {
                  const isActive = selectedLayer?.exitPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (selectedLayerId) {
                          onUpdateLayer(selectedLayerId, { exitPreset: p.id });
                        }
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-500 text-white'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-amber-400 font-normal">({p.nameMarathi})</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.description}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA (Poster Library) */}
        {activeTab === 'media' && (
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white">Poster Library</h4>
              <p className="text-[10px] text-slate-400">
                Choose any static poster from your SaaS to load elements:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-1">
              {availablePosters.slice(0, 16).map((poster) => (
                <button
                  key={poster.id}
                  type="button"
                  onClick={() => onSelectPosterAsBase(poster)}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/60 rounded-xl p-2 text-left flex flex-col gap-1.5 transition-all group"
                >
                  <div
                    className={`w-full aspect-square rounded-lg bg-gradient-to-br ${poster.theme.bgGradient} flex items-center justify-center relative overflow-hidden`}
                  >
                    <span className="text-2xl drop-shadow-md">🔱</span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] font-bold text-white">
                      Load Into Video
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 truncate">
                    {poster.titleNative || poster.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEXT & MARATHI SLOGANS */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white">Add Devanagari Text</h4>
              <p className="text-[10px] text-slate-400">Click to add festive Marathi headings or slogans:</p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onAddLayer('heading', '।। मंगलमूर्ती मोरया ।।')}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-base hover:border-amber-500/60 transition-all flex items-center justify-between"
              >
                <span>।। मंगलमूर्ती मोरया ।।</span>
                <Plus className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onAddLayer('heading', 'गणेशोत्सवाच्या हार्दिक शुभेच्छा!')}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-sm hover:border-amber-500/60 transition-all flex items-center justify-between"
              >
                <span>गणेशोत्सवाच्या हार्दिक शुभेच्छा!</span>
                <Plus className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onAddLayer('subheading', 'सुखकर्ता दुखहर्ता वार्ता विघ्नाची...')}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white text-xs hover:border-amber-500/60 transition-all flex items-center justify-between"
              >
                <span>सुखकर्ता दुखहर्ता वार्ता विघ्नाची...</span>
                <Plus className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onAddLayer('subheading', '।। गणपती बाप्पा मोरया, पुढच्या वर्षी लवकर या ।।')}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white text-xs hover:border-amber-500/60 transition-all flex items-center justify-between"
              >
                <span>।। गणपती बाप्पा मोरया, पुढच्या वर्षी लवकर या ।।</span>
                <Plus className="w-4 h-4 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => onAddLayer('logo', `${activeProfile.name} • 📞 ${activeProfile.phone}`)}
                className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-amber-300 font-bold text-xs hover:border-amber-500/60 transition-all flex items-center justify-between"
              >
                <span>+ ब्रँड नाव व संपर्क पट्टी</span>
                <Plus className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIO & MUSIC LIBRARY */}
        {activeTab === 'audio' && (
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white">Festive Music Library</h4>
              <p className="text-[10px] text-slate-400">Synthesized festive audio tracks for your video:</p>
            </div>

            {/* Volume Slider */}
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Master Volume</span>
                </span>
                <span className="font-mono text-amber-300">{Math.round(audioVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioVolume}
                onChange={(e) => onUpdateAudioVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Tracks List */}
            <div className="space-y-1.5">
              {AUDIO_TRACKS_LIBRARY.map((track) => {
                const isSelected = audioTrack === track.id;
                const isPlaying = playingAudioId === track.id;
                return (
                  <div
                    key={track.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate flex items-center gap-1.5">
                        <span>{track.name}</span>
                        {isSelected && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-sm">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-amber-300/80 truncate">{track.nameMarathi}</div>
                      <div className="text-[9px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{track.category}</span>
                        <span>•</span>
                        <span>{track.bpm} BPM</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Preview Play/Stop */}
                      <button
                        type="button"
                        onClick={() => handleToggleAudioPreview(track.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isPlaying
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                        title={isPlaying ? 'Stop Preview' : 'Play Preview'}
                      >
                        {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>

                      {/* Select Track Button */}
                      {!isSelected && (
                        <button
                          type="button"
                          onClick={() => onSelectAudioTrack(track.id)}
                          className="px-2 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Use
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Animation Templates</h4>
                <p className="text-[10px] text-slate-400">1-Click predefined animation configurations:</p>
              </div>
            </div>

            {/* Template Cards */}
            <div className="space-y-2">
              {DEFAULT_ANIMATION_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3 flex flex-col gap-2 transition-all"
                >
                  <div>
                    <h5 className="font-bold text-xs text-white flex items-center justify-between">
                      <span>{tmpl.name}</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-md font-bold uppercase">
                        {tmpl.category}
                      </span>
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1">{tmpl.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                    <span>Duration: {tmpl.duration}s</span>
                    <button
                      type="button"
                      onClick={() => onApplyAnimationTemplate(tmpl.id)}
                      className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95 shadow-xs"
                    >
                      Apply Template
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Current as Template */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setTemplateSavedToast(true);
                  setTimeout(() => setTemplateSavedToast(false), 2000);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-dashed border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>{templateSavedToast ? 'Template Saved ✓' : 'Save as Animation Template'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

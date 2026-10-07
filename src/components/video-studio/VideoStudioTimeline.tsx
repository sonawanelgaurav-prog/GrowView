import React, { useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Repeat,
  Plus,
  Clock,
  Layers,
  Key,
  Film,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { VideoStudioLayer, VideoStudioScene } from '../../types';

interface VideoStudioTimelineProps {
  layers: VideoStudioLayer[];
  selectedLayerId: string | null;
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  audioTrack: string;
  scenes: VideoStudioScene[];
  activeSceneId: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSelectLayer: (layerId: string) => void;
  onUpdateTotalDuration: (duration: number) => void;
  onSelectScene: (sceneId: string) => void;
  onAddScene: () => void;
}

export const VideoStudioTimeline: React.FC<VideoStudioTimelineProps> = ({
  layers,
  selectedLayerId,
  currentTime,
  totalDuration,
  isPlaying,
  audioTrack,
  scenes,
  activeSceneId,
  isCollapsed = false,
  onToggleCollapse,
  onTogglePlay,
  onSeek,
  onSelectLayer,
  onUpdateTotalDuration,
  onSelectScene,
  onAddScene,
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const miniRulerRef = useRef<HTMLDivElement>(null);
  const [isLooping, setIsLooping] = useState(true);

  // Handle scrubber drag
  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newTime = (clickX / rect.width) * totalDuration;
    onSeek(newTime);
  };

  const handleMiniRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!miniRulerRef.current) return;
    const rect = miniRulerRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newTime = (clickX / rect.width) * totalDuration;
    onSeek(newTime);
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // If collapsed: return ultra-clean minimal transport bar
  if (isCollapsed) {
    return (
      <div className="h-11 bg-slate-950 border-t border-slate-800 px-3 sm:px-5 flex items-center justify-between gap-2.5 sm:gap-4 shrink-0 z-20 select-none text-slate-300 shadow-lg">
        {/* Play/Pause & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition-all active:scale-95 shrink-0"
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => onSeek(0)}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            title="Return to Start"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
            <span className="text-white font-bold">{currentTime.toFixed(1)}s</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalDuration.toFixed(0)}s</span>
          </div>
        </div>

        {/* Mini Inline Scrubber Bar */}
        <div
          ref={miniRulerRef}
          onClick={handleMiniRulerClick}
          className="flex-1 mx-2 sm:mx-4 h-3 sm:h-4 bg-slate-900 rounded-full border border-slate-800 relative cursor-pointer group flex items-center"
          title="स्क्रब करण्यासाठी क्लिक करा"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full shadow-md group-hover:scale-125 transition-transform"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>

        {/* Right: Expand Timeline Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors whitespace-nowrap"
            title="टाईमलाईन उघडा"
          >
            <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">टाइमलाईन</span>
          </button>
        </div>
      </div>
    );
  }

  // Ticks generation (every 1 second)
  const ticks = [];
  const tickCount = Math.ceil(totalDuration);
  for (let i = 0; i <= tickCount; i++) {
    ticks.push(i);
  }

  return (
    <div className="h-44 sm:h-48 md:h-52 bg-slate-950 border-t border-slate-800 flex flex-col select-none shrink-0 z-20 text-slate-300 transition-all">
      {/* Top Transport & Scene Bar */}
      <div className="h-10 border-b border-slate-800 bg-slate-900/90 px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0">
        {/* Left: Transport Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition-all active:scale-95 shrink-0"
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          {/* Reset to Start */}
          <button
            type="button"
            onClick={() => onSeek(0)}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            title="Return to Start"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Timecode readout */}
          <div className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="text-white font-bold">{currentTime.toFixed(1)}s</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalDuration.toFixed(1)}s</span>
          </div>
        </div>

        {/* Center: Scene Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink">
          {scenes.map((scene, idx) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => onSelectScene(scene.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                scene.id === activeSceneId
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-xs'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Scene {idx + 1}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onAddScene}
            className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 shrink-0"
            title="Add Scene"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Duration Selector & Stepper + Collapse Button */}
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          {/* Quick presets */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
            {[3, 5, 6, 10, 15].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onUpdateTotalDuration(d)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                  totalDuration === d
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`${d} सेकंद व्हिडिओ लेन्थ`}
              >
                {d}s
              </button>
            ))}
          </div>

          {/* Stepper (- / +) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => onUpdateTotalDuration(Math.max(2, totalDuration - 1))}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded text-xs font-bold"
              title="१ सेकंद कमी करा"
            >
              -
            </button>
            <div className="px-1.5 text-amber-300 font-mono font-bold text-xs min-w-[28px] text-center">
              {totalDuration}s
            </div>
            <button
              type="button"
              onClick={() => onUpdateTotalDuration(Math.min(30, totalDuration + 1))}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded text-xs font-bold"
              title="१ सेकंद वाढवा"
            >
              +
            </button>
          </div>

          {/* Collapse timeline button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="w-6 h-6 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              title="टाईमलाईन मिनिमाइझ करा (क्लीन व्ह्यू)"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrubber Ruler & Tracks View */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
        {/* Scrubber Ruler Bar */}
        <div
          ref={rulerRef}
          onClick={handleRulerClick}
          className="h-7 bg-slate-900 border-b border-slate-800 relative cursor-pointer select-none shrink-0"
        >
          {/* Ticks */}
          {ticks.map((t) => {
            const leftPct = (t / totalDuration) * 100;
            return (
              <div
                key={t}
                className="absolute top-0 bottom-0 border-l border-slate-700/60 flex flex-col justify-between pl-1 pointer-events-none"
                style={{ left: `${leftPct}%` }}
              >
                <span className="text-[9px] font-mono text-slate-500 font-bold">{t}s</span>
                <span className="h-1.5 w-0.5 bg-slate-600" />
              </div>
            );
          })}

          {/* Yellow Playhead Marker Handle on ruler */}
          <div
            className="absolute top-0 bottom-0 w-3 -ml-1.5 flex flex-col items-center pointer-events-none z-30"
            style={{ left: `${progressPercent}%` }}
          >
            <div className="w-3 h-3 bg-amber-400 rounded-b-xs shadow-md" />
            <div className="w-0.5 flex-1 bg-amber-400 shadow-sm" />
          </div>
        </div>

        {/* Layer Tracks Container */}
        <div className="flex-1 relative overflow-y-auto p-1.5 space-y-1">
          {/* Audio Wave Track */}
          <div className="h-7 bg-emerald-950/30 border border-emerald-800/40 rounded-lg flex items-center px-3 relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold z-10">
              <Volume2 className="w-3 h-3" />
              <span>Audio: {audioTrack.replace(/_/g, ' ')}</span>
            </div>
            {/* Animated Waveform Bars */}
            <div className="absolute inset-0 flex items-center justify-around opacity-25 px-24">
              {Array.from({ length: 48 }).map((_, i) => (
                <span
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full"
                  style={{
                    height: `${20 + 70 * Math.abs(Math.sin(i * 0.4 + currentTime * 3))}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Individual Layer Tracks */}
          {[...layers]
            .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
            .map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              const entranceStart = layer.entranceDelay || 0;
              const entranceEnd = entranceStart + (layer.entranceDuration || 1.0);

              const leftPct = (entranceStart / totalDuration) * 100;
              const widthPct = Math.min(100 - leftPct, ((totalDuration - entranceStart) / totalDuration) * 100);

              return (
                <div
                  key={layer.id}
                  onClick={() => onSelectLayer(layer.id)}
                  className={`h-8 rounded-lg border transition-all cursor-pointer flex items-center px-2 relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 shadow-xs'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  {/* Layer Label on Left */}
                  <div className="w-36 sm:w-44 truncate text-[11px] font-bold text-slate-200 z-10 flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="truncate">{layer.nameMarathi || layer.name}</span>
                  </div>

                  {/* Layer Block Bar on Timeline */}
                  <div
                    className="absolute top-1 bottom-1 rounded-md bg-gradient-to-r from-amber-600/40 via-orange-600/30 to-amber-600/40 border border-amber-500/50 flex items-center justify-between px-2"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                    }}
                  >
                    <span className="text-[9px] font-semibold text-amber-200 truncate">
                      {layer.entrancePreset.replace(/_/g, ' ')}
                    </span>

                    {/* Keyframe diamonds if any */}
                    {layer.keyframes?.map((kf) => {
                      const kfLeft = ((kf.time - entranceStart) / (totalDuration - entranceStart)) * 100;
                      return (
                        <div
                          key={kf.id}
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-300 rotate-45 border border-slate-950 shadow-xs"
                          style={{ left: `${Math.max(0, Math.min(100, kfLeft))}%` }}
                          title={`Keyframe at ${kf.time}s`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {/* Vertical Playhead Cursor across all tracks */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 pointer-events-none z-20 shadow-md"
            style={{ left: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

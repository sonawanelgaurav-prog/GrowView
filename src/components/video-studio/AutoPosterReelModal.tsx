import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Film,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { PosterTemplate, BusinessProfile, VideoStudioProject } from '../../types';
import {
  generateVideoProjectFromPoster,
  saveStoredVideoProject,
  getContextualAnimId,
} from '../../utils/autoAnimatePoster';
import {
  renderVideoStudioFrame,
  getCanvasDimensionsForAspectRatio,
} from './VideoStudioCanvasRenderer';
import { videoStudioAudioEngine } from '../../data/videoStudioAudio';
import { exportVideoStudioProjectToMP4 } from '../../utils/videoStudioExporter';
import { preloadImage } from '../../utils/canvasRenderer';

interface AutoPosterReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  poster: PosterTemplate | null;
  activeProfile: BusinessProfile;
  allPosters?: PosterTemplate[];
  onOpenFullStudio?: (poster: PosterTemplate, project: VideoStudioProject) => void;
  onSelectPoster?: (poster: PosterTemplate) => void;
}

export const AutoPosterReelModal: React.FC<AutoPosterReelModalProps> = ({
  isOpen,
  onClose,
  poster,
  activeProfile,
  allPosters = [],
  onOpenFullStudio,
  onSelectPoster,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const [exportDownloadUrl, setExportDownloadUrl] = useState<string | null>(null);
  const [exportFileName, setExportFileName] = useState<string | null>(null);

  // Active Project generated from poster
  const [project, setProject] = useState<VideoStudioProject | null>(null);

  // Generate / update project when poster changes
  useEffect(() => {
    if (!poster) return;
    if (activeProfile?.logoUrl) {
      preloadImage(activeProfile.logoUrl).catch(() => {});
    }
    if (poster.imageUrl) {
      preloadImage(poster.imageUrl).catch(() => {});
    }
    const animId = getContextualAnimId(poster);
    const proj = generateVideoProjectFromPoster(
      poster,
      activeProfile,
      animId,
      'user_auto'
    );
    setProject(proj);
    setDuration(proj.duration || 6);
    setCurrentTime(0);
    setIsPlaying(true);
    setExportDownloadUrl(null);
  }, [poster, activeProfile]);

  const handleSetDuration = (newDur: number) => {
    setDuration(newDur);
    if (project) {
      setProject({
        ...project,
        duration: newDur,
        scenes: project.scenes.map((s) => ({ ...s, duration: newDur })),
      });
    }
    setCurrentTime(0);
  };

  // Audio Playback
  useEffect(() => {
    if (!isOpen || !project || isMuted || !isPlaying) {
      videoStudioAudioEngine.stop();
      return;
    }

    videoStudioAudioEngine.playTrack(project.audioTrack || 'dhol_tasha_utsav', 0.85);

    return () => {
      videoStudioAudioEngine.stop();
    };
  }, [isOpen, project, isPlaying, isMuted]);

  // Canvas Render Loop
  useEffect(() => {
    if (!isOpen || !project || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= duration) {
            // Loop back to start
            return 0;
          }
          return next;
        });
      }

      // Render frame
      const activeScene = project.scenes[0];
      if (activeScene) {
        renderVideoStudioFrame(
          ctx,
          activeScene.layers,
          currentTime,
          duration,
          project.aspectRatio || '9:16',
          {
            showSafeGuides: false,
            showCenterGuides: false,
            showGrid: false,
            activeProfile: activeProfile,
            projectFrameId: poster.defaultFrameId || 'footer-01',
            footerConfig: (poster as any).footerConfig || {},
          }
        );
      }

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isOpen, project, isPlaying, currentTime, duration]);

  // Export to MP4
  const handleExportMP4 = async () => {
    if (!project) return;
    setIsExporting(true);
    setExportProgress(10);
    setExportStatusText('व्हिडिओ रेंडरिंग सुरू होत आहे...');

    try {
      const res = await exportVideoStudioProjectToMP4(project, {
        resolution: '1080p',
        fps: 30,
        duration: duration,
        includeAudio: !isMuted,
        onProgress: (p, text) => {
          setExportProgress(p);
          setExportStatusText(text);
        },
      });

      setExportDownloadUrl(res.downloadUrl);
      setExportFileName(res.fileName);
      setIsExporting(false);

      // Auto-trigger browser download
      const a = document.createElement('a');
      a.href = res.downloadUrl;
      a.download = res.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Export error:', err);
      setIsExporting(false);
      setExportStatusText('त्रुटी: ' + (err?.message || 'Error'));
    }
  };

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    if (!poster) return;
    const text = encodeURIComponent(
      `🎬 *${poster.headline || poster.titleNative || poster.title}*\n\n✨ *${activeProfile.name}* कडून खास ॲनिमेटेड व्हिडिओ!\n📞 ${activeProfile.phone}\n📍 ${activeProfile.address}\n\nGrowView Poster & Video Studio द्वारे तयार केलेला व्हिडिओ!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Navigate Previous / Next Poster
  const currentIndex = allPosters.findIndex((p) => p.id === poster?.id);
  const handlePrev = () => {
    if (allPosters.length === 0 || currentIndex <= 0) return;
    onSelectPoster?.(allPosters[currentIndex - 1]);
  };
  const handleNext = () => {
    if (allPosters.length === 0 || currentIndex >= allPosters.length - 1) return;
    onSelectPoster?.(allPosters[currentIndex + 1]);
  };

  if (!isOpen || !poster) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[95vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-all shadow-lg"
          title="बंद करा (Close)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: 9:16 Reel Player Canvas */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 relative min-h-[420px] sm:min-h-[520px]">
          {/* Reel Container */}
          <div className="relative aspect-[9/16] h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-slate-800 bg-slate-900 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={1080}
              height={1920}
              className="w-full h-full object-contain"
            />

            {/* Stage Badge indicating Auto Animated Poster */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              <span>
                {currentTime < 2.5
                  ? '⚡ मूव्हिंग ॲनिमेशन (Moving In...)'
                  : '✨ पूर्ण पोस्टर स्वरूप (Locked Poster)'}
              </span>
            </div>

            {/* Audio Toggle Top-Right */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md"
              title={isMuted ? 'संगीत चालू करा (Unmute)' : 'म्युट करा (Mute)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Bottom Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="flex items-center gap-3 mt-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all"
              title="मागील पोस्टर (Previous)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              title={isPlaying ? 'थांबवा (Pause)' : 'सुरू करा (Play)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
            </button>

            <button
              type="button"
              onClick={() => setCurrentTime(0)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all"
              title="पुन्हा सुरू करा (Replay Motion)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= allPosters.length - 1}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all"
              title="पुढील पोस्टर (Next)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Info & Actions */}
        <div className="w-full md:w-80 lg:w-96 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 bg-slate-900/90 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {poster.category}
                </span>
                <span className="text-xs text-slate-400">
                  {currentIndex + 1} of {allPosters.length || 1} पोस्टर्स
                </span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight">
                {poster.titleNative || poster.title}
              </h3>
              <p className="text-xs text-amber-400 font-bold mt-1">
                {poster.headline || '।। मंगलमूर्ती मोरया ।।'}
              </p>
            </div>

            {/* Motion & Transition Overview */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ऑटो-मुव्हींग व्हिडिओ वैशिष्ट्ये</span>
              </h4>
              <ul className="text-[11px] text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>पार्श्वभूमी सावकाश झूम व पॅन होते</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>मुख्य मूर्ती/प्रतिमा तरंगत मध्यभागी स्थिरावते</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>मथळा, विचार व ब्रँड फुटर आकर्षक मुव्हमेंटने येतात</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-emerald-300 font-semibold">शेवटी परिपूर्ण पोस्टर स्वरूपात लॉक होते!</span>
                </li>
              </ul>
            </div>

            {/* Business Footer Details */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3 text-xs">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                ब्रँड व संपर्क माहिती:
              </span>
              <span className="font-bold text-white block mt-0.5">{activeProfile.name}</span>
              <span className="text-slate-400 text-[11px] block">📞 {activeProfile.phone}</span>
            </div>

            {/* Video Duration Selector */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">व्हिडिओ लांबी (Video Duration):</span>
                <span className="text-xs font-black text-amber-400">{duration} सेकंद</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[3, 5, 6, 10, 15].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleSetDuration(d)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      duration === d
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md scale-105'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                * जितके सेकंद निवडाल तितक्याच अचूक लांबीचा व्हिडिओ डाऊनलोड होईल.
              </p>
            </div>

            {/* Export Progress Status */}
            {isExporting && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{exportStatusText}</span>
                  </span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}

            {exportDownloadUrl && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">व्हिडिओ तयार झाला!</span>
                </div>
                <a
                  href={exportDownloadUrl}
                  download={exportFileName || 'reel.mp4'}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-lg shrink-0"
                >
                  पुन्हा डाऊनलोड
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            {/* Download MP4 Button */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExportMP4}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>व्हिडिओ तयार होत आहे ({exportProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>⬇️ थेट MP4 व्हिडिओ डाऊनलोड करा</span>
                </>
              )}
            </button>

            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>📲 व्हॉट्सॲपवर शेअर करा</span>
            </button>

            {/* Open in Full Pro Studio Button */}
            {onOpenFullStudio && project && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullStudio(poster, project);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white font-bold text-xs border border-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>🛠️ संपूर्ण व्हिडिओ स्टुडिओमध्ये उघडा</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

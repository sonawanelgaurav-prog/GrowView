import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Download,
  Video,
  Sparkles,
  Music,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Share2,
  Flame,
  Film,
  Zap,
  Wind,
  Compass,
  Sun,
  Heart,
  Layers,
  Eye,
  Waves,
  Radio,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  PosterTemplate,
  BusinessProfile,
  FrameId,
  AspectRatio,
  CanvasCustomElement,
  FooterFrameConfig,
  VideoAnimationPresetId,
  VideoRenderOptions,
} from '../types';
import {
  VIDEO_ANIMATION_PRESETS,
  getStoredAdminVideoSettings,
} from '../data/videoAnimationPresets';
import {
  renderPosterVideo,
  renderAnimatedVideoFrame,
  drawVideoAnimationPreset,
  VideoProgressEvent,
} from '../utils/videoRenderer';
import {
  PosterRenderDocument,
  renderPosterDocumentToCanvas,
} from '../utils/canvasRenderer';

interface VideoExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: PosterTemplate;
  profile: BusinessProfile;
  frameId: FrameId;
  aspectRatio: AspectRatio;
  showFooter?: boolean;
  customHeadline?: string;
  customSubtext?: string;
  customQuote?: string;
  customBgImage?: string | null;
  customBgGradient?: string;
  companyLogoUrl?: string | null;
  companyLogoPosition?: { x: number; y: number; size: number };
  customElements?: CanvasCustomElement[];
  footerConfig?: Partial<FooterFrameConfig>;
}

function renderPresetIcon(iconName: string) {
  const iconProps = { className: 'w-4 h-4' };
  switch (iconName) {
    case 'Flame': return <Flame {...iconProps} />;
    case 'Film': return <Film {...iconProps} />;
    case 'Sparkles': return <Sparkles {...iconProps} />;
    case 'Zap': return <Zap {...iconProps} />;
    case 'Wind': return <Wind {...iconProps} />;
    case 'Sliders': return <Sliders {...iconProps} />;
    case 'Compass': return <Compass {...iconProps} />;
    case 'Sun': return <Sun {...iconProps} />;
    case 'Heart': return <Heart {...iconProps} />;
    case 'Layers': return <Layers {...iconProps} />;
    case 'Eye': return <Eye {...iconProps} />;
    case 'Music': return <Music {...iconProps} />;
    case 'Waves': return <Waves {...iconProps} />;
    case 'Radio': return <Radio {...iconProps} />;
    default: return <Activity {...iconProps} />;
  }
}

export const VideoExportModal: React.FC<VideoExportModalProps> = ({
  isOpen,
  onClose,
  template,
  profile,
  frameId,
  aspectRatio,
  showFooter = true,
  customHeadline,
  customSubtext,
  customQuote,
  customBgImage,
  customBgGradient,
  companyLogoUrl,
  companyLogoPosition,
  customElements = [],
  footerConfig,
}) => {
  const adminSettings = getStoredAdminVideoSettings();

  const [selectedPresetId, setSelectedPresetId] = useState<VideoAnimationPresetId>(
    template.videoAnimationPreset || adminSettings.defaultPreset || 'golden-sparkles'
  );
  const [presetCategory, setPresetCategory] = useState<'all' | 'festive' | 'royal' | 'modern' | 'divine'>('all');
  const [duration, setDuration] = useState<number>(adminSettings.defaultDuration || 15);
  const [resolution, setResolution] = useState<'1080p' | '720p' | '480p'>(adminSettings.defaultResolution || '1080p');
  const [fps] = useState<30 | 60>(30);
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
  const [audioTrack, setAudioTrack] = useState<'dhol-tasha' | 'shehnai' | 'temple-bells' | 'none'>(
    adminSettings.defaultAudio || 'dhol-tasha'
  );
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  const [isPlayingPreview, setIsPlayingPreview] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<VideoProgressEvent | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedFilename, setGeneratedFilename] = useState<string>('');

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const animStartTimeRef = useRef<number>(performance.now());

  const posterDoc: PosterRenderDocument = {
    template,
    profile,
    frameId,
    aspectRatio,
    showFooter,
    customHeadline,
    customSubtext,
    customQuote,
    customBgImage,
    customBgGradient,
    companyLogoUrl,
    companyLogoPosition,
    customElements,
    footerConfig,
  };

  useEffect(() => {
    if (!isOpen) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      setGeneratedVideoUrl(null);
      setIsExporting(false);
      return;
    }

    let isMounted = true;
    renderPosterDocumentToCanvas(posterDoc).then((canvas) => {
      if (isMounted) {
        baseCanvasRef.current = canvas;
        animStartTimeRef.current = performance.now();
      }
    });

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, template, profile, frameId, aspectRatio, customHeadline, customSubtext]);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    const loop = () => {
      if (!active) return;
      const canvas = previewCanvasRef.current;
      const base = baseCanvasRef.current;

      if (canvas && base) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          if (isPlayingPreview) {
            const speedFactor = speed === 'slow' ? 0.6 : speed === 'fast' ? 1.5 : 1.0;
            const elapsed = ((performance.now() - animStartTimeRef.current) / 1000) * speedFactor;
            renderAnimatedVideoFrame(
              ctx,
              base,
              selectedPresetId,
              elapsed,
              duration,
              w,
              h,
              template.theme?.primaryColor || '#f59e0b',
              template.theme?.accentColor || '#ec4899'
            );
          } else {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(base, 0, 0, w, h);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isOpen, isPlayingPreview, selectedPresetId, duration, speed, template]);

  if (!isOpen) return null;

  const filteredPresets = VIDEO_ANIMATION_PRESETS.filter((p) => {
    if (presetCategory === 'all') return true;
    return p.category === presetCategory;
  });

  const selectedPreset = VIDEO_ANIMATION_PRESETS.find((p) => p.id === selectedPresetId) || VIDEO_ANIMATION_PRESETS[0];

  const handleStartExport = async () => {
    try {
      setIsExporting(true);
      setGeneratedVideoUrl(null);
      setExportProgress({
        percent: 0,
        currentSecond: 0,
        totalSeconds: duration,
        statusText: 'व्हिडिओ रेंडरिंग सुरू होत आहे...',
      });

      const options: VideoRenderOptions = {
        durationSeconds: duration,
        resolution,
        fps,
        format,
        animationPresetId: selectedPresetId,
        animationSpeed: speed,
        audioTrack,
        includeBranding: false,
        aspectRatio,
      };

      const result = await renderPosterVideo(posterDoc, options, (progress) => {
        setExportProgress(progress);
      });

      setGeneratedVideoUrl(result.url);
      setGeneratedFilename(result.filename);
      setIsExporting(false);

      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fde047'],
      });

      triggerFileDownload(result.url, result.filename);
    } catch (err) {
      console.error('Video rendering failed:', err);
      setIsExporting(false);
      alert('व्हिडिओ तयार करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  const triggerFileDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚩 *${template.headline}* 🚩\n\n${template.subtext || ''}\n\n✨ *${profile.name}* ✨\n${
        profile.phone ? `📞 संपर्क: ${profile.phone}\n` : ''
      }\nCreated with GrowView - Poster Maker app\n#GrowView #WhatsAppVideoStatus #Reels`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const is916 = aspectRatio === '9:16';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">व्हिडिओ स्टेटस व रील्स क्रिएटर (HD MP4)</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  २० ॲनिमेशन प्रिसेट्स
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {template.titleNative || template.title} • व्हॉट्सॲप व इन्स्टाग्रामसाठी रेडी व्हिडिओ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          <div className="w-full lg:w-[400px] p-5 flex flex-col items-center justify-between bg-slate-950/50 shrink-0 space-y-4">
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedPreset.nameMarathi}</span>
              </div>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                {resolution} • {duration}s
              </span>
            </div>

            <div className={`relative ${is916 ? 'w-[220px] aspect-[9/16]' : 'w-[280px] aspect-square'} rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 group`}>
              <canvas
                ref={previewCanvasRef}
                width={is916 ? 540 : 600}
                height={is916 ? 960 : 600}
                className="w-full h-full object-contain"
              />

              <button
                type="button"
                onClick={() => setIsPlayingPreview((prev) => !prev)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl">
                  {isPlayingPreview ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </div>
              </button>

              {audioTrack !== 'none' && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-amber-300 flex items-center gap-1 border border-amber-400/30">
                  <Music className="w-2.5 h-2.5 animate-pulse" />
                  <span>{audioTrack === 'dhol-tasha' ? 'ढोल ताशा' : audioTrack === 'shehnai' ? 'सनई' : 'घंटानाद'}</span>
                </div>
              )}
            </div>

            <div className="w-full bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setIsPlayingPreview((prev) => !prev)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 transition-colors"
              >
                {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingPreview ? 'पॉज' : 'प्ले'}</span>
              </button>

              <div className="flex items-center gap-1">
                {(['slow', 'normal', 'fast'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      speed === s ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s === 'slow' ? 'मंद' : s === 'normal' ? '१x' : '१.५x'}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full bg-amber-950/30 border border-amber-500/20 p-3 rounded-2xl text-[11px] text-amber-200/90 leading-relaxed">
              <span className="font-bold text-amber-400 block mb-0.5">ℹ️ या ॲनिमेशनचा प्रभाव:</span>
              {selectedPreset.descriptionMarathi}
            </div>
          </div>

          <div className="flex-1 p-5 space-y-5 overflow-y-auto">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-black text-white">२० ॲनिमेशन प्रिसेट्स (Select Animation)</h4>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
                  {(['all', 'festive', 'royal', 'divine', 'modern'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPresetCategory(cat)}
                      className={`px-2 py-1 rounded-lg font-bold transition-colors ${
                        presetCategory === cat
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat === 'all' ? 'सर्व (20)' : cat === 'festive' ? 'उत्सव' : cat === 'royal' ? 'राजेशाही' : cat === 'divine' ? 'दैवी' : 'आधुनिक'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-1">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        animStartTimeRef.current = performance.now();
                      }}
                      className={`p-2 rounded-xl text-left transition-all border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-400 scale-[1.02]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${preset.previewColor || '#f59e0b'}25`, color: preset.previewColor || '#f59e0b' }}
                        >
                          {renderPresetIcon(preset.iconName)}
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      </div>
                      <span className="text-[11px] font-bold line-clamp-1 leading-snug text-white">
                        {preset.nameMarathi}
                      </span>
                      <span className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 block">🎬 फॉरमॅट व रिझोल्यूशन</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('mp4')}
                    className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      format === 'mp4'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>MP4 (व्हॉट्सॲप / रील्स)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat('webm')}
                    className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                      format === 'webm'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>WebM HD</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(['1080p', '720p', '480p'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setResolution(r)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors ${
                        resolution === r
                          ? 'bg-slate-800 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r === '1080p' ? 'Full HD 1080p' : r === '720p' ? 'HD 720p' : 'Lite 480p'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">⏱️ वेळ (Duration)</label>
                  <span className="text-[10px] text-amber-400 font-bold font-mono">{duration} सेकंद</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {[5, 10, 15, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        duration === d
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {d}s {d === 15 && <span className="text-[8px] block opacity-80">स्टेटस</span>}
                    </button>
                  ))}
                </div>

                <div className="pt-1.5">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">🎵 पार्श्वसंगीत (Festive Audio)</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'dhol-tasha', label: '🥁 ढोल ताशा' },
                      { id: 'shehnai', label: '🎺 सनई' },
                      { id: 'temple-bells', label: '🔔 घंटानाद' },
                      { id: 'none', label: '🔇 मूक' },
                    ].map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAudioTrack(a.id as any)}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                          audioTrack === a.id
                            ? 'bg-slate-800 border-amber-400 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isExporting && exportProgress && (
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-xs text-amber-200">
                  <span className="font-bold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>{exportProgress.statusText}</span>
                  </span>
                  <span className="font-mono font-black text-amber-300">{exportProgress.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-amber-500/20">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-200 rounded-full"
                    style={{ width: `${exportProgress.percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  कृपया विंडो बंद करू नका. हाय-डेफिनिशन व्हिडिओ कॅन्व्हासवरून एन्कोड केला जात आहे.
                </p>
              </div>
            )}

            {generatedVideoUrl && !isExporting && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-white">व्हिडिओ डाऊनलोडसाठी तयार आहे!</h5>
                    <p className="text-[10px] text-slate-300 font-mono truncate max-w-xs">{generatedFilename}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerFileDownload(generatedVideoUrl, generatedFilename)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>पुन्हा सेव्ह करा</span>
                </button>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleStartExport}
                disabled={isExporting}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50 text-sm"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>व्हिडिओ तयार होत आहे ({exportProgress?.percent || 0}%)...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>व्हिडिओ डाऊनलोड करा (HD {format.toUpperCase()})</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
                >
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>व्हॉट्सॲप स्टेटस शेअर</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  बंद करा
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

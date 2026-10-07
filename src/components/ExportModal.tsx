import React, { useEffect, useState } from 'react';
import {
  Download,
  MessageCircle,
  Copy,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Smartphone,
  Square,
  CheckCircle2,
  ShieldCheck,
  Video,
  Music,
  Clock,
  Sliders,
  Play,
  Pause,
  Crown,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  AspectRatio,
  BusinessProfile,
  CanvasCustomElement,
  FrameId,
  PosterTemplate,
  FooterFrameConfig,
  getPosterFormatByRatio,
  VideoAnimationPresetId,
  VideoRenderOptions,
  UserAccount,
  UserSubscriptionResolution,
} from '../types';
import { exportPosterImage, renderPosterDocumentToCanvas, PosterRenderDocument } from '../utils/canvasRenderer';
import { renderAnimatedVideoFrame } from '../utils/videoAnimationEngine';
import { TextStyleProps, MotifStyleProps } from './canvas/CanvasFloatingToolbar';
import {
  VIDEO_ANIMATION_PRESETS,
  getStoredAdminVideoSettings,
} from '../data/videoAnimationPresets';
import { renderPosterVideo, VideoProgressEvent } from '../utils/videoRenderer';
import { fetchSubscriptionStatus, authorizeExportServerSide } from '../services/subscriptionService';

interface ExportModalProps {
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
  headlineStyle?: Partial<TextStyleProps>;
  subtextStyle?: Partial<TextStyleProps>;
  quoteStyle?: Partial<TextStyleProps>;
  dateBadgeStyle?: Partial<TextStyleProps>;
  motifStyle?: Partial<MotifStyleProps>;
  footerConfig?: Partial<FooterFrameConfig>;
  currentUser?: UserAccount | null;
  onOpenPricingModal?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
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
  headlineStyle,
  subtextStyle,
  quoteStyle,
  dateBadgeStyle,
  motifStyle,
  footerConfig,
  currentUser,
  onOpenPricingModal,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState(true);
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'mp4'>(template.isVideo ? 'mp4' : 'png');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [subResolution, setSubResolution] = useState<UserSubscriptionResolution | null>(null);

  // Fetch live server-side subscription & quota status
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetchSubscriptionStatus(currentUser?.id || 'usr-guest', currentUser?.email)
      .then((res) => {
        if (isMounted) {
          setSubResolution(res);
        }
      })
      .catch((err) => {
        console.warn('Subscription fetch warning:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentUser]);

  // Video Export Specific States
  const adminSettings = getStoredAdminVideoSettings();
  const [selectedPresetId, setSelectedPresetId] = useState<VideoAnimationPresetId>(
    template.videoAnimationPreset || adminSettings.defaultPreset || 'golden-sparkles'
  );
  const [videoDuration, setVideoDuration] = useState<number>(adminSettings.defaultDuration || 15);
  const [videoResolution, setVideoResolution] = useState<'1080p' | '720p'>('1080p');
  const [videoAudio, setVideoAudio] = useState<'dhol-tasha' | 'shehnai' | 'temple-bells' | 'none'>(
    (template.videoAudioTrack as any) || adminSettings.defaultAudio || 'dhol-tasha'
  );
  const [isVideoExporting, setIsVideoExporting] = useState(false);
  const [videoProgress, setVideoProgress] = useState<VideoProgressEvent | null>(null);

  // Video Live Preview Animation Engine
  const previewCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const baseCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = React.useRef<number | null>(null);
  const animStartTimeRef = React.useRef<number>(performance.now());
  const [isPlayingVideoPreview, setIsPlayingVideoPreview] = useState(true);

  const formatConfig = getPosterFormatByRatio(aspectRatio);

  const needsWatermark = subResolution?.needsWatermark ?? false;

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
    headlineStyle,
    subtextStyle,
    quoteStyle,
    dateBadgeStyle,
    motifStyle,
    footerConfig,
    watermark: needsWatermark
      ? {
          enabled: true,
          text: 'GROW VIEW',
          subText: 'FESTIVAL & BUSINESS POSTER MAKER',
        }
      : undefined,
  };

  // Switch to MP4 if template is video
  useEffect(() => {
    if (template.isVideo) {
      setFormat('mp4');
      if (template.videoAnimationPreset) {
        setSelectedPresetId(template.videoAnimationPreset);
      }
    }
  }, [template]);

  useEffect(() => {
    if (!isOpen) {
      setDataUrl('');
      setIsRendering(true);
      setIsVideoExporting(false);
      setVideoProgress(null);
      return;
    }

    let isMounted = true;
    setIsRendering(true);
    setRenderError(null);

    // Fast deterministic canvas render for preview
    exportPosterImage(posterDoc, format === 'mp4' ? 'png' : format, 0.95)
      .then((res) => {
        if (isMounted) {
          setDataUrl(res.dataUrl);
          setIsRendering(false);
        }
      })
      .catch((err) => {
        console.error('Fast canvas export failed:', err);
        if (isMounted) {
          setRenderError('पोस्टर तयार करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
          setIsRendering(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    isOpen,
    format,
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
  ]);

  // Generate Base Canvas for MP4 Live Motion Preview
  useEffect(() => {
    if (!isOpen || format !== 'mp4') {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
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
  }, [
    isOpen,
    format,
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
  ]);

  // Real-time Animation Loop for MP4 Live Preview Canvas
  useEffect(() => {
    if (!isOpen || format !== 'mp4') return;

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

          if (isPlayingVideoPreview) {
            const elapsed = (performance.now() - animStartTimeRef.current) / 1000;
            renderAnimatedVideoFrame(
              ctx,
              base,
              selectedPresetId,
              elapsed,
              videoDuration,
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
  }, [isOpen, format, selectedPresetId, videoDuration, isPlayingVideoPreview, template]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    // Record server-side export authorization
    try {
      const auth = await authorizeExportServerSide(currentUser?.id || 'usr-guest', currentUser?.email);
      if (auth.needsWatermark && !subResolution?.needsWatermark) {
        setSubResolution((prev) => (prev ? { ...prev, needsWatermark: true, freePostersLeft: 0 } : null));
      }
    } catch (err) {
      console.warn('Export authorization tracking:', err);
    }

    if (format === 'mp4') {
      try {
        setIsVideoExporting(true);
        setVideoProgress({
          percent: 0,
          currentSecond: 0,
          totalSeconds: videoDuration,
          statusText: 'व्हिडिओ रेंडरिंग सुरू होत आहे...',
        });

        const options: VideoRenderOptions = {
          durationSeconds: videoDuration,
          resolution: videoResolution,
          fps: 30,
          format: 'mp4',
          animationPresetId: selectedPresetId,
          animationSpeed: 'normal',
          audioTrack: videoAudio,
          includeBranding: false,
          aspectRatio,
        };

        const result = await renderPosterVideo(posterDoc, options, (p) => {
          setVideoProgress(p);
        });

        setIsVideoExporting(false);

        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fde047'],
        });

        const link = document.createElement('a');
        link.download = result.filename;
        link.href = result.url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('MP4 export failed:', err);
        setIsVideoExporting(false);
        alert('व्हिडिओ डाऊनलोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
      }
      return;
    }

    if (!dataUrl) return;

    // Celebration Confetti
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fde047'],
    });

    const safeTitle = (template.titleNative || template.title || 'poster')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-');
    const safeBrand = (profile.name || 'brand')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-');
    const filename = `${safeTitle}-${safeBrand}.${format}`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFullCaption = () => {
    const hl = customHeadline !== undefined ? customHeadline : template.headline;
    const st = customSubtext !== undefined ? customSubtext : template.subtext;
    const qt = customQuote !== undefined ? customQuote : template.quote || '';
    const phone = profile.phone || profile.whatsapp || '';
    const website = profile.website || '';

    return `🚩 *${hl}* 🚩\n\n${st}\n\n_${qt}_\n\n✨ *${profile.name}* ✨\n${
      profile.tagline ? `_${profile.tagline}_\n` : ''
    }${profile.ownerName ? `👤 ${profile.ownerName} (${profile.designation || 'Director'})\n` : ''}${
      phone ? `📞 संपर्क: ${phone}\n` : ''
    }${website ? `🌐 वेबसाईट: ${website}\n` : ''}\nCreated with GrowView - Poster Maker app\n#GrowView #FestivalPoster #MarathiBanners #BusinessBranding`;
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(getFullCaption());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getFullCaption());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: Live Generated Image Preview */}
        <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800">
          <div className="relative w-full max-w-[340px] flex items-center justify-center min-h-[340px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
            {isRendering ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-sm font-bold text-slate-300">हाय-डेफिनिशन पोस्टर तयार होत आहे...</p>
                <span className="text-xs text-slate-500 font-mono">{formatConfig.dimensionsLabel}</span>
              </div>
            ) : renderError ? (
              <div className="p-6 text-center text-red-400 text-sm">{renderError}</div>
            ) : format === 'mp4' ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <canvas
                  ref={previewCanvasRef}
                  width={aspectRatio === '9:16' ? 270 : 340}
                  height={aspectRatio === '9:16' ? 480 : 340}
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>लाइव्ह व्हिडिओ प्रिव्ह्यू</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingVideoPreview(!isPlayingVideoPreview)}
                  className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all shadow-lg border border-white/20"
                >
                  {isPlayingVideoPreview ? (
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{isPlayingVideoPreview ? 'पॉज' : 'प्ले'}</span>
                </button>
              </div>
            ) : (
              <img
                src={dataUrl}
                alt="Generated High-Res Poster"
                className="w-full h-auto object-contain rounded-2xl shadow-2xl transition-all"
              />
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">{formatConfig.dimensionsLabel}</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">२०% ब्रँडिंग फुटर</span>
          </div>
        </div>

        {/* RIGHT: Format Selector, Options & Actions */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-black text-white">पोस्टर डाउनलोड करा</h3>
            </div>
            <p className="text-xs text-slate-400">
              {formatConfig.nameMarathi} ({formatConfig.dimensionsLabel}) हाय-क्वालिटी फॉरमॅटमध्ये तयार आहे.
            </p>
          </div>

          {/* Subscription & Watermark Status Banner */}
          {subResolution && (
            <div>
              {subResolution.planId === 'free' ? (
                subResolution.freePostersLeft > 0 ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        मोफत कोटा: ५ पैकी <strong>{subResolution.freePostersLeft}</strong> स्वच्छ HD पोस्टर्स बाकी
                      </span>
                    </div>
                    {onOpenPricingModal && (
                      <button
                        type="button"
                        onClick={onOpenPricingModal}
                        className="text-[11px] font-black text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0 ml-2"
                      >
                        <Crown className="w-3 h-3" />
                        VIP अपग्रेड
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-amber-300 font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        You have completed your 5 free posts. Please upgrade to a paid plan to continue creating and downloading business posters. (GROW VIEW वॉटरमार्क लागू)
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
                      <span className="text-[11px] text-slate-300">वॉटरमार्क कायमचा काढण्यासाठी:</span>
                      {onOpenPricingModal && (
                        <button
                          type="button"
                          onClick={onOpenPricingModal}
                          className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          अपग्रेड प्लॅन (₹९९ पासून)
                        </button>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-2.5 rounded-2xl flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center gap-2 font-bold">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{subResolution.planName} सक्रिय • अमर्यादित स्वच्छ HD डाऊनलोड्स</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                    VIP ॲक्टिव्ह
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Format Selector: PNG vs JPEG vs MP4 */}
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 block">डाऊनलोड फॉरमॅट निवडा</label>
              {format === 'mp4' && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  २० ॲनिमेशन प्रिसेट्स उपलब्ध
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  format === 'png'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>PNG (इमेज)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('jpeg')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  format === 'jpeg'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>JPG (इमेज)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('mp4')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  format === 'mp4'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 text-amber-400 hover:text-amber-300 border border-amber-500/30'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>MP4 (व्हिडिओ)</span>
              </button>
            </div>

            {/* Video Customizer Panel if MP4 is active */}
            {format === 'mp4' && (
              <div className="pt-2 space-y-3 border-t border-slate-800 animate-in fade-in">
                {/* 20 Presets Dropdown / Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>व्हिडिओ ॲनिमेशन (२० पैकी १ निवडा)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {VIDEO_ANIMATION_PRESETS.find((p) => p.id === selectedPresetId)?.nameMarathi}
                    </span>
                  </div>
                  <select
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value as VideoAnimationPresetId)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-400"
                  >
                    {VIDEO_ANIMATION_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameMarathi} ({p.name}) • {p.category.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration & Audio Track */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">⏱️ व्हिडिओ कालावधी</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[5, 10, 15].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setVideoDuration(d)}
                          className={`py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                            videoDuration === d
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {d}s {d === 15 && 'स्टेटस'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">🎵 पार्श्वसंगीत</label>
                    <select
                      value={videoAudio}
                      onChange={(e) => setVideoAudio(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-2 py-1 text-[11px] font-medium focus:outline-none focus:border-amber-400"
                    >
                      <option value="dhol-tasha">🥁 ढोल ताशा बीट</option>
                      <option value="shehnai">🎺 सनई मंगल सूर</option>
                      <option value="temple-bells">🔔 मंदिरातील घंटानाद</option>
                      <option value="none">🔇 मूक (No Audio)</option>
                    </select>
                  </div>
                </div>

                {/* Video Export Progress Bar */}
                {isVideoExporting && videoProgress && (
                  <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-1.5 animate-pulse">
                    <div className="flex items-center justify-between text-[11px] text-amber-200 font-bold">
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                        <span>{videoProgress.statusText}</span>
                      </span>
                      <span>{videoProgress.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-150"
                        style={{ width: `${videoProgress.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Caption Box */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-300">सोशल मीडिया कॅप्शन (WhatsApp/FB)</span>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'कॉपी केले!' : 'कॅप्शन कॉपी'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-3 font-mono bg-slate-900/90 p-2 rounded-lg border border-slate-800/80">
              {getFullCaption()}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={(format !== 'mp4' && (isRendering || !dataUrl)) || isVideoExporting}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              {isVideoExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>व्हिडिओ तयार होत आहे ({videoProgress?.percent || 0}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-slate-950" />
                  <span>
                    {format === 'mp4'
                      ? '🎬 HD MP4 व्हिडिओ डाउनलोड करा'
                      : `डाउनलोड करा (${format.toUpperCase()})`}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp वर शेअर करा</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  VideoStudioProject,
  VideoStudioLayer,
  VideoStudioAspectRatio,
  VideoStudioLayerType,
  PosterTemplate,
  BusinessProfile,
  VideoStudioScene,
  UserAccount,
  AdminVideoSettings,
  VideoEntrancePresetId,
} from '../../types';
import { VideoStudioTopBar } from './VideoStudioTopBar';
import { VideoStudioLeftPanel } from './VideoStudioLeftPanel';
import { VideoStudioRightInspector } from './VideoStudioRightInspector';
import { VideoStudioTimeline } from './VideoStudioTimeline';
import { VideoStudioExportModal } from './VideoStudioExportModal';
import {
  renderVideoStudioFrame,
  getCanvasDimensionsForAspectRatio,
} from './VideoStudioCanvasRenderer';
import {
  generateVideoProjectFromPoster,
  saveStoredVideoProject,
  DEFAULT_ANIMATION_TEMPLATES,
} from '../../utils/autoAnimatePoster';
import { ENTRANCE_PRESETS } from '../../data/videoStudioPresets';
import { videoStudioAudioEngine } from '../../data/videoStudioAudio';
import { exportVideoStudioProjectToMP4 } from '../../utils/videoStudioExporter';
import { preloadImage } from '../../utils/canvasRenderer';
import { Eye, Grid, Shield, Maximize2, Type, Sparkles, ChevronRight, ChevronLeft, Sliders, Layers } from 'lucide-react';

interface VideoStudioModalProps {
  isOpen: boolean;
  initialProject?: VideoStudioProject | null;
  basePoster?: PosterTemplate | null;
  sourcePoster?: PosterTemplate | null;
  activeProfile: BusinessProfile;
  availablePosters?: PosterTemplate[];
  userId?: string;
  currentUser?: UserAccount | null;
  adminSettings?: AdminVideoSettings;
  onClose: () => void;
  onSaveProject?: (project: VideoStudioProject) => void;
}

const DEFAULT_FALLBACK_POSTER: PosterTemplate = {
  id: 'default-fallback',
  title: 'GrowView Festival Reel',
  titleNative: '।। श्री गणेशाय नमः ।।',
  headline: '।। मंगलमूर्ती मोरया ।।',
  subtext: 'गणेशोत्सवाच्या हार्दिक शुभेच्छा!',
  category: 'गणेशोत्सव',
  theme: {
    bgGradient: 'from-amber-600 via-orange-600 to-red-700',
    primaryColor: '#f59e0b',
    accentColor: '#fde047',
    textColor: '#ffffff',
    ornamentColor: '#f59e0b',
    cardBg: 'rgba(0,0,0,0.4)',
  },
  motifType: 'ganesh-murti',
  defaultFrameId: 'footer-01',
  aspectRatio: '1:1',
};

export const VideoStudioModal: React.FC<VideoStudioModalProps> = ({
  isOpen,
  initialProject,
  basePoster,
  sourcePoster,
  activeProfile,
  availablePosters = [],
  userId = 'admin_user',
  onClose,
  onSaveProject,
}) => {
  const effectiveBasePoster =
    basePoster ||
    sourcePoster ||
    (availablePosters && availablePosters.length > 0 ? availablePosters[0] : DEFAULT_FALLBACK_POSTER);

  // Helper to pick contextual default animation template
  const getContextualAnimId = (poster: PosterTemplate): string => {
    const textToCheck = `${poster.id} ${poster.title} ${poster.titleNative || ''} ${poster.category || ''} ${poster.subCategory || ''} ${poster.motifType || ''} ${poster.headline || ''}`.toLowerCase();
    if (
      textToCheck.includes('रात्री') ||
      textToCheck.includes('night') ||
      textToCheck.includes('sweet') ||
      textToCheck.includes('dream') ||
      textToCheck.includes('crescent') ||
      textToCheck.includes('moon') ||
      textToCheck.includes('सकाळ') ||
      textToCheck.includes('morning') ||
      textToCheck.includes('विचार') ||
      textToCheck.includes('suvichar')
    ) {
      return 'daily_suvichar_peace';
    }
    if (textToCheck.includes('व्यवसाय') || textToCheck.includes('business') || textToCheck.includes('brand')) {
      return 'business_brand_boost';
    }
    if (textToCheck.includes('ganesh') || textToCheck.includes('bappa') || textToCheck.includes('गणेश')) {
      return 'ganesh_royal_intro';
    }
    return 'festive_diwali_gold';
  };

  // 1. Current Project State
  const [project, setProject] = useState<VideoStudioProject>(() => {
    if (initialProject) return initialProject;
    const animId = getContextualAnimId(effectiveBasePoster);
    return generateVideoProjectFromPoster(
      effectiveBasePoster,
      activeProfile,
      animId,
      userId
    );
  });

  // Keep synced if initialProject or poster changes
  useEffect(() => {
    if (activeProfile?.logoUrl) {
      preloadImage(activeProfile.logoUrl).catch(() => {});
    }
    const targetP = basePoster || sourcePoster;
    if (targetP?.imageUrl) {
      preloadImage(targetP.imageUrl).catch(() => {});
    }

    if (initialProject) {
      setProject(initialProject);
    } else if (basePoster || sourcePoster) {
      const p = basePoster || sourcePoster || DEFAULT_FALLBACK_POSTER;
      const animId = getContextualAnimId(p);
      setProject(generateVideoProjectFromPoster(p, activeProfile, animId, userId));
    }
  }, [initialProject, basePoster, sourcePoster, activeProfile, userId]);

  // Active scene
  const activeSceneIndex = 0;
  const activeScene = project.scenes[activeSceneIndex] || project.scenes[0];

  // 2. Playback & Timeline State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    activeScene.layers[0]?.id || null
  );

  // Overlay Guides State
  const [showSafeGuides, setShowSafeGuides] = useState(true);
  const [showCenterGuides, setShowCenterGuides] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  // Clean View (क्लीन व्ह्यू) & Collapsible Panels State
  const [isCleanView, setIsCleanView] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);

  const handleToggleCleanView = () => {
    if (isCleanView) {
      setIsCleanView(false);
      setIsLeftPanelOpen(true);
      setIsRightPanelOpen(true);
      setIsTimelineCollapsed(false);
    } else {
      setIsCleanView(true);
      setIsLeftPanelOpen(false);
      setIsRightPanelOpen(false);
      setIsTimelineCollapsed(true);
    }
  };

  // 3. Undo / Redo History
  const [history, setHistory] = useState<VideoStudioProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback((newProj: VideoStudioProject) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newProj].slice(-40); // cap at 40
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevProj = history[historyIndex - 1];
      setProject(prevProj);
      setHistoryIndex((i) => i - 1);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextProj = history[historyIndex + 1];
      setProject(nextProj);
      setHistoryIndex((i) => i + 1);
    }
  }, [history, historyIndex]);

  // 4. Canvas Ref & Animation Loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Interactive Canvas Dragging
  const [isDraggingLayer, setIsDraggingLayer] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; layerX: number; layerY: number } | null>(null);

  // Draw current frame
  const drawFrame = useCallback(
    (timeToDraw: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const layers = activeScene?.layers || [];
      renderVideoStudioFrame(ctx, layers, timeToDraw, project.duration, project.aspectRatio, {
        selectedLayerId,
        showSafeGuides,
        showCenterGuides,
        showGrid,
        activeProfile,
        projectFrameId: (effectiveBasePoster as any)?.defaultFrameId || 'footer-01',
        footerConfig: (effectiveBasePoster as any)?.footerConfig || {},
      });
    },
    [
      activeScene?.layers,
      project.duration,
      project.aspectRatio,
      selectedLayerId,
      showSafeGuides,
      showCenterGuides,
      showGrid,
      activeProfile,
      effectiveBasePoster,
    ]
  );

  // 60FPS Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      videoStudioAudioEngine.stop();
      lastTimeRef.current = null;
      drawFrame(currentTime);
      return;
    }

    // Start Web Audio Synthesizer track
    videoStudioAudioEngine.playTrack(project.audioTrack, project.audioVolume);

    const step = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setCurrentTime((prev) => {
        let next = prev + delta;
        if (next >= project.duration) {
          next = 0; // loop back to start
        }
        drawFrame(next);
        return next;
      });

      animFrameIdRef.current = requestAnimationFrame(step);
    };

    animFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      videoStudioAudioEngine.stop();
    };
  }, [isPlaying, project.duration, project.audioTrack, project.audioVolume, drawFrame]);

  // Re-draw when currentTime changes while paused
  useEffect(() => {
    if (!isPlaying) {
      drawFrame(currentTime);
    }
  }, [currentTime, isPlaying, drawFrame]);

  // 5. Canvas Mouse Interaction (Select & Reposition Layer)
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const baseDim = getCanvasDimensionsForAspectRatio(project.aspectRatio);

    const scaleX = baseDim.width / rect.width;
    const scaleY = baseDim.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check hit on layers (top-most first)
    const sortedLayers = [...activeScene.layers].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    let hitLayer: VideoStudioLayer | null = null;

    for (const l of sortedLayers) {
      if (!l.visible || l.locked) continue;
      const hw = (l.width || 200) / 2;
      const hh = (l.height || 200) / 2;
      if (clickX >= l.x - hw && clickX <= l.x + hw && clickY >= l.y - hh && clickY <= l.y + hh) {
        hitLayer = l;
        break;
      }
    }

    if (hitLayer) {
      setSelectedLayerId(hitLayer.id);
      setIsDraggingLayer(true);
      dragStartRef.current = {
        mouseX: clickX,
        mouseY: clickY,
        layerX: hitLayer.x,
        layerY: hitLayer.y,
      };
    } else {
      setSelectedLayerId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingLayer || !dragStartRef.current || !selectedLayerId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const baseDim = getCanvasDimensionsForAspectRatio(project.aspectRatio);

    const scaleX = baseDim.width / rect.width;
    const scaleY = baseDim.height / rect.height;

    const currentMouseX = (e.clientX - rect.left) * scaleX;
    const currentMouseY = (e.clientY - rect.top) * scaleY;

    const dx = currentMouseX - dragStartRef.current.mouseX;
    const dy = currentMouseY - dragStartRef.current.mouseY;

    const newX = Math.round(dragStartRef.current.layerX + dx);
    const newY = Math.round(dragStartRef.current.layerY + dy);

    handleUpdateLayer(selectedLayerId, { x: newX, y: newY }, false);
  };

  const handleCanvasMouseUp = () => {
    if (isDraggingLayer) {
      setIsDraggingLayer(false);
      dragStartRef.current = null;
      pushHistory(project);
    }
  };

  // 6. Layer Mutation Handlers
  const handleUpdateLayer = (
    layerId: string,
    updates: Partial<VideoStudioLayer>,
    recordHistory: boolean = true
  ) => {
    const updatedLayers = activeScene.layers.map((l) =>
      l.id === layerId ? { ...l, ...updates } : l
    );

    const updatedProject: VideoStudioProject = {
      ...project,
      scenes: [
        {
          ...activeScene,
          layers: updatedLayers,
        },
      ],
    };

    setProject(updatedProject);
    if (recordHistory) {
      pushHistory(updatedProject);
    }
  };

  const handleAddLayer = (type: VideoStudioLayerType, name?: string) => {
    const baseDim = getCanvasDimensionsForAspectRatio(project.aspectRatio);
    const maxZ = Math.max(0, ...activeScene.layers.map((l) => l.zIndex || 0));

    const newLayer: VideoStudioLayer = {
      id: `layer-${type}-${Date.now()}`,
      name: name || `New ${type}`,
      type,
      visible: true,
      locked: false,
      zIndex: maxZ + 1,
      x: baseDim.width / 2,
      y: baseDim.height / 2,
      width: type === 'text' || type === 'heading' ? 800 : 400,
      height: type === 'text' || type === 'heading' ? 140 : 400,
      maintainAspectRatio: false,
      scale: 1,
      rotation: 0,
      opacity: 1,
      blur: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      text: type === 'heading' || type === 'text' ? (name || 'मराठी संदेश') : undefined,
      fontFamily: 'Yatra One, serif',
      fontSize: 48,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      entrancePreset: 'pop_in',
      entranceDuration: 1.2,
      entranceDelay: 0.2,
      entranceEasing: 'bounce',
      movementPreset: 'none',
      movementSpeed: 1,
      exitPreset: 'none',
      exitDuration: 0.8,
      exitDelay: 0,
      keyframes: [],
    };

    const updatedProject: VideoStudioProject = {
      ...project,
      scenes: [
        {
          ...activeScene,
          layers: [...activeScene.layers, newLayer],
        },
      ],
    };

    setProject(updatedProject);
    setSelectedLayerId(newLayer.id);
    pushHistory(updatedProject);
  };

  const handleDeleteLayer = (layerId: string) => {
    const updatedLayers = activeScene.layers.filter((l) => l.id !== layerId);
    const updatedProject: VideoStudioProject = {
      ...project,
      scenes: [
        {
          ...activeScene,
          layers: updatedLayers,
        },
      ],
    };
    setProject(updatedProject);
    setSelectedLayerId(updatedLayers[0]?.id || null);
    pushHistory(updatedProject);
  };

  const handleDuplicateLayer = (layerId: string) => {
    const target = activeScene.layers.find((l) => l.id === layerId);
    if (!target) return;
    const duplicated: VideoStudioLayer = {
      ...target,
      id: `layer-${target.type}-${Date.now()}`,
      name: `${target.name} (Copy)`,
      x: target.x + 30,
      y: target.y + 30,
      zIndex: (target.zIndex || 0) + 1,
    };
    const updatedProject: VideoStudioProject = {
      ...project,
      scenes: [
        {
          ...activeScene,
          layers: [...activeScene.layers, duplicated],
        },
      ],
    };
    setProject(updatedProject);
    setSelectedLayerId(duplicated.id);
    pushHistory(updatedProject);
  };

  const handleReorderLayer = (layerId: string, direction: 'up' | 'down') => {
    const sorted = [...activeScene.layers].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    const idx = sorted.findIndex((l) => l.id === layerId);
    if (idx < 0) return;

    if (direction === 'up' && idx > 0) {
      // Swap zIndex with item above
      const tempZ = sorted[idx].zIndex;
      sorted[idx].zIndex = sorted[idx - 1].zIndex;
      sorted[idx - 1].zIndex = tempZ;
    } else if (direction === 'down' && idx < sorted.length - 1) {
      // Swap zIndex with item below
      const tempZ = sorted[idx].zIndex;
      sorted[idx].zIndex = sorted[idx + 1].zIndex;
      sorted[idx + 1].zIndex = tempZ;
    }

    const updatedProject: VideoStudioProject = {
      ...project,
      scenes: [{ ...activeScene, layers: sorted }],
    };
    setProject(updatedProject);
  };

  // Keyframes
  const handleAddKeyframe = (layerId: string, time: number) => {
    const target = activeScene.layers.find((l) => l.id === layerId);
    if (!target) return;

    const newKeyframe = {
      id: `kf-${Date.now()}`,
      time: Math.round(time * 10) / 10,
      x: target.x,
      y: target.y,
      scale: target.scale,
      rotation: target.rotation,
      opacity: target.opacity,
      blur: target.blur,
      brightness: target.brightness,
      easing: 'easeInOut' as const,
    };

    const existingKeys = target.keyframes || [];
    handleUpdateLayer(layerId, {
      keyframes: [...existingKeys, newKeyframe],
    });
  };

  const handleDeleteKeyframe = (layerId: string, kfId: string) => {
    const target = activeScene.layers.find((l) => l.id === layerId);
    if (!target) return;
    handleUpdateLayer(layerId, {
      keyframes: (target.keyframes || []).filter((k) => k.id !== kfId),
    });
  };

  // Update Total Duration
  const handleUpdateTotalDuration = (dur: number) => {
    const updated = {
      ...project,
      duration: dur,
      scenes: [{ ...activeScene, duration: dur }],
    };
    setProject(updated);
    pushHistory(updated);
  };

  // Auto Animate Poster Button
  const handleAutoAnimate = () => {
    const currentPoster = availablePosters.find((p) => p.id === project.posterId) || availablePosters[0];
    const animId = getContextualAnimId(currentPoster);
    const newProject = generateVideoProjectFromPoster(
      currentPoster,
      activeProfile,
      animId,
      userId
    );
    setProject(newProject);
    setCurrentTime(0);
    setIsPlaying(true);
    pushHistory(newProject);
  };

  // Apply Animation Template
  const handleApplyAnimationTemplate = (templateId: string) => {
    const currentPoster = availablePosters.find((p) => p.id === project.posterId) || availablePosters[0];
    const newProject = generateVideoProjectFromPoster(
      currentPoster,
      activeProfile,
      templateId,
      userId
    );
    setProject(newProject);
    setCurrentTime(0);
    setIsPlaying(true);
    pushHistory(newProject);
  };

  // Base Poster Selection
  const handleSelectPosterAsBase = (poster: PosterTemplate) => {
    const animId = getContextualAnimId(poster);
    const newProject = generateVideoProjectFromPoster(
      poster,
      activeProfile,
      animId,
      userId
    );
    setProject(newProject);
    setCurrentTime(0);
    pushHistory(newProject);
  };

  // Save Project
  const handleSaveDraft = () => {
    saveStoredVideoProject(project);
    onSaveProject?.(project);
  };

  // 7. Export Video MP4 Handling
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportResolution, setExportResolution] = useState<'1080p' | '720p' | '480p'>('1080p');
  const [exportStatus, setExportStatus] = useState<
    'preparing' | 'rendering' | 'encoding' | 'complete' | 'failed'
  >('preparing');
  const [exportStatusText, setExportStatusText] = useState('व्हिडिओ तयार केला जात आहे...');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedDownloadUrl, setExportedDownloadUrl] = useState<string | undefined>();
  const [exportedFileName, setExportedFileName] = useState<string | undefined>();

  const handleOpenExportModal = (resolution: '1080p' | '720p' | '480p') => {
    setExportResolution(resolution);
    setIsExportModalOpen(true);
    setExportStatus('preparing');
    setExportProgress(5);
    setExportStatusText('व्हिडिओ रेंडरिंग तयारी...');

    // Trigger export
    exportVideoStudioProjectToMP4(project, {
      resolution,
      fps: 30,
      includeAudio: true,
      onProgress: (pct, text) => {
        setExportProgress(pct);
        setExportStatusText(text);
        if (pct < 85) {
          setExportStatus('rendering');
        } else if (pct < 100) {
          setExportStatus('encoding');
        } else {
          setExportStatus('complete');
        }
      },
    })
      .then((res) => {
        setExportedDownloadUrl(res.downloadUrl);
        setExportedFileName(res.fileName);
        setExportStatus('complete');
      })
      .catch((err) => {
        console.error('Export error:', err);
        setExportStatus('failed');
        setExportStatusText(`Export Failed: ${err.message || 'Unknown error'}`);
      });
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveDraft();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerId) {
          e.preventDefault();
          handleDeleteLayer(selectedLayerId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedLayerId, project]);

  if (!isOpen) return null;

  const canvasDim = getCanvasDimensionsForAspectRatio(project.aspectRatio);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col overflow-hidden text-white font-sans select-none animate-in fade-in duration-200">
      {/* 1. TOP BAR */}
      <VideoStudioTopBar
        project={project}
        isPlaying={isPlaying}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        isCleanView={isCleanView}
        onToggleCleanView={handleToggleCleanView}
        isLeftPanelOpen={isLeftPanelOpen}
        onToggleLeftPanel={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
        isRightPanelOpen={isRightPanelOpen}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        isTimelineCollapsed={isTimelineCollapsed}
        onToggleTimeline={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAutoAnimate={handleAutoAnimate}
        onSaveDraft={handleSaveDraft}
        onOpenExportModal={handleOpenExportModal}
        onChangeAspectRatio={(ratio) => {
          const updated = { ...project, aspectRatio: ratio };
          setProject(updated);
          pushHistory(updated);
        }}
        onUpdateTitle={(title) => {
          const updated = { ...project, title };
          setProject(updated);
          pushHistory(updated);
        }}
        onUpdateTotalDuration={handleUpdateTotalDuration}
        onClose={onClose}
      />

      {/* 2. MAIN CENTER ROW (Left Tools + Center Canvas + Right Inspector) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* LEFT TOOL PANEL */}
        {isLeftPanelOpen && (
          <VideoStudioLeftPanel
            layers={activeScene.layers}
            selectedLayerId={selectedLayerId}
            audioTrack={project.audioTrack}
            audioVolume={project.audioVolume}
            availablePosters={availablePosters}
            activeProfile={activeProfile}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            onAddLayer={handleAddLayer}
            onDeleteLayer={handleDeleteLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onReorderLayer={handleReorderLayer}
            onSelectAudioTrack={(t) => {
              const updated = { ...project, audioTrack: t };
              setProject(updated);
              pushHistory(updated);
            }}
            onUpdateAudioVolume={(v) => {
              const updated = { ...project, audioVolume: v };
              setProject(updated);
            }}
            onApplyAnimationTemplate={handleApplyAnimationTemplate}
            onSelectPosterAsBase={handleSelectPosterAsBase}
          />
        )}

        {/* Collapsed Left Panel Re-open Tab */}
        {!isLeftPanelOpen && (
          <button
            type="button"
            onClick={() => setIsLeftPanelOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 py-3 px-1.5 rounded-r-xl bg-slate-900/95 hover:bg-slate-800 border border-l-0 border-slate-700 text-slate-300 hover:text-amber-400 flex flex-col items-center gap-1 shadow-2xl backdrop-blur-md transition-all group"
            title="टूल्स पॅनल उघडा (Layers / Presets)"
          >
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[9px] font-bold [writing-mode:vertical-lr] tracking-wider uppercase text-amber-400">
              टूल्स
            </span>
          </button>
        )}

        {/* CENTER VIEWPORT / INTERACTIVE CANVAS */}
        <main className="flex-1 bg-slate-900/50 flex flex-col items-center justify-center p-3 sm:p-5 overflow-hidden relative">
          {/* Quick Floating Canvas Controls (Guides, Grid, Safe Area) */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 backdrop-blur-md p-1 rounded-xl shadow-lg">
            <button
              type="button"
              onClick={() => setShowSafeGuides(!showSafeGuides)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showSafeGuides ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Safe Area Guides"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Safe Zone</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCenterGuides(!showCenterGuides)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showCenterGuides ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Center Alignment Guides"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Center</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showGrid ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Alignment Grid"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Active Canvas Stage Container */}
          <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-700/80 bg-black flex items-center justify-center max-h-[95%] max-w-[98%] transition-all duration-300">
            <canvas
              ref={canvasRef}
              width={canvasDim.width}
              height={canvasDim.height}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className={`object-contain ${
                isCleanView
                  ? (isTimelineCollapsed ? 'max-h-[82vh]' : 'max-h-[70vh]')
                  : (isTimelineCollapsed ? 'max-h-[72vh]' : 'max-h-[52vh] sm:max-h-[58vh]')
              } cursor-pointer select-none transition-all duration-300 ${
                project.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square'
              }`}
            />
          </div>

          {/* Quick On-Canvas Text Edit Bar */}
          {(() => {
            const activeSelectedLayer = activeScene.layers.find((l) => l.id === selectedLayerId);
            const isSelectedText = Boolean(
              activeSelectedLayer &&
                (activeSelectedLayer.text !== undefined ||
                  activeSelectedLayer.type === 'heading' ||
                  activeSelectedLayer.type === 'subheading' ||
                  activeSelectedLayer.type === 'text' ||
                  activeSelectedLayer.type === 'logo')
            );

            if (!isSelectedText || !activeSelectedLayer) return null;

            return (
              <div className="mt-2.5 w-full max-w-xl z-20 flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-950/95 border border-amber-500/60 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 shrink-0">
                  <Type className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">मजकूर:</span>
                </div>
                <input
                  type="text"
                  value={activeSelectedLayer.text || ''}
                  onChange={(e) => handleUpdateLayer(activeSelectedLayer.id, { text: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-hidden min-w-[140px]"
                  placeholder="मराठी मजकूर येथे टाईप करा..."
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={activeSelectedLayer.entrancePreset}
                    onChange={(e) =>
                      handleUpdateLayer(activeSelectedLayer.id, {
                        entrancePreset: e.target.value as VideoEntrancePresetId,
                      })
                    }
                    className="bg-slate-900 border border-slate-700 text-amber-300 text-[11px] rounded-lg px-2 py-1 font-semibold focus:outline-hidden max-w-[120px] truncate"
                    title="प्रवेश ॲनिमेशन बदला"
                  >
                    {ENTRANCE_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateLayer(activeSelectedLayer.id, {
                          fontSize: Math.max(16, (activeSelectedLayer.fontSize || 42) - 4),
                        })
                      }
                      className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white text-xs font-bold rounded"
                      title="फॉन्ट लहान करा"
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateLayer(activeSelectedLayer.id, {
                          fontSize: Math.min(130, (activeSelectedLayer.fontSize || 42) + 4),
                        })
                      }
                      className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white text-xs font-bold rounded"
                      title="फॉन्ट मोठा करा"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </main>

        {/* RIGHT PROPERTIES INSPECTOR */}
        {isRightPanelOpen && (
          <VideoStudioRightInspector
            layer={activeScene.layers.find((l) => l.id === selectedLayerId) || null}
            currentTime={currentTime}
            totalDuration={project.duration}
            project={project}
            allLayers={activeScene.layers}
            onClosePanel={() => setIsRightPanelOpen(false)}
            onUpdateLayer={handleUpdateLayer}
            onAddKeyframe={handleAddKeyframe}
            onDeleteKeyframe={handleDeleteKeyframe}
            onUpdateTotalDuration={handleUpdateTotalDuration}
            onChangeAspectRatio={(ratio) => {
              const updated = { ...project, aspectRatio: ratio };
              setProject(updated);
              pushHistory(updated);
            }}
            onSelectLayer={setSelectedLayerId}
            onApplyAnimationTemplate={handleApplyAnimationTemplate}
            onSeek={(t) => {
              setCurrentTime(t);
              setIsPlaying(false);
            }}
          />
        )}

        {/* Collapsed Right Panel Re-open Tab */}
        {!isRightPanelOpen && (
          <button
            type="button"
            onClick={() => setIsRightPanelOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 py-3 px-1.5 rounded-l-xl bg-slate-900/95 hover:bg-slate-800 border border-r-0 border-slate-700 text-slate-300 hover:text-amber-400 flex flex-col items-center gap-1 shadow-2xl backdrop-blur-md transition-all group"
            title="इन्स्पेक्टर / सेटिंग्ज पॅनल उघडा"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[9px] font-bold [writing-mode:vertical-lr] tracking-wider uppercase text-amber-400">
              सेटिंग्ज
            </span>
          </button>
        )}
      </div>

      {/* 3. BOTTOM TIMELINE SCRUBBER */}
      <VideoStudioTimeline
        layers={activeScene.layers}
        selectedLayerId={selectedLayerId}
        currentTime={currentTime}
        totalDuration={project.duration}
        isPlaying={isPlaying}
        audioTrack={project.audioTrack}
        scenes={project.scenes}
        activeSceneId={activeScene.id}
        isCollapsed={isTimelineCollapsed}
        onToggleCollapse={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onSeek={(time) => {
          setCurrentTime(time);
          drawFrame(time);
        }}
        onSelectLayer={setSelectedLayerId}
        onUpdateTotalDuration={handleUpdateTotalDuration}
        onSelectScene={() => {}}
        onAddScene={() => {
          const newScene: VideoStudioScene = {
            id: `scene-${Date.now()}`,
            name: `Scene ${project.scenes.length + 1}`,
            duration: 6,
            layers: [...activeScene.layers],
            transition: 'fade',
            transitionDuration: 0.6,
          };
          const updated = {
            ...project,
            duration: project.duration + 6,
            scenes: [...project.scenes, newScene],
          };
          setProject(updated);
          pushHistory(updated);
        }}
      />

      {/* 4. VIDEO EXPORT MODAL */}
      <VideoStudioExportModal
        isOpen={isExportModalOpen}
        project={project}
        resolution={exportResolution}
        status={exportStatus}
        statusText={exportStatusText}
        progress={exportProgress}
        downloadUrl={exportedDownloadUrl}
        fileName={exportedFileName}
        onClose={() => setIsExportModalOpen(false)}
        onStartExport={() => handleOpenExportModal(exportResolution)}
      />
    </div>
  );
};

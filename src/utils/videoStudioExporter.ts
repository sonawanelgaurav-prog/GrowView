import { VideoStudioProject, VideoStudioAspectRatio } from '../types';
import {
  renderVideoStudioFrame,
  getCanvasDimensionsForAspectRatio,
  preloadVideoStudioAssets,
} from '../components/video-studio/VideoStudioCanvasRenderer';
import { videoStudioAudioEngine } from '../data/videoStudioAudio';
import { saveStoredExportedVideo } from './autoAnimatePoster';

export interface ExportProgressCallback {
  (progress: number, statusText: string): void;
}

export interface VideoStudioExportOptions {
  resolution: '1080p' | '720p' | '480p';
  fps: 30 | 60;
  duration?: number;
  includeAudio: boolean;
  watermarkText?: string;
  onProgress: ExportProgressCallback;
}

export async function exportVideoStudioProjectToMP4(
  project: VideoStudioProject,
  options: VideoStudioExportOptions
): Promise<{ downloadUrl: string; fileName: string; blob: Blob }> {
  const { onProgress, fps = 30, includeAudio = true } = options;
  const totalDuration = Math.max(1, options.duration || project.duration || 6);

  onProgress(5, 'व्हिडिओ तयार केला जात आहे (Preparing Canvas & Assets)...');

  // 1. Determine Output Canvas Resolution
  const baseDim = getCanvasDimensionsForAspectRatio(project.aspectRatio);
  let targetW = baseDim.width;
  let targetH = baseDim.height;

  if (options.resolution === '720p') {
    const scale = 720 / Math.min(baseDim.width, baseDim.height);
    targetW = Math.round(baseDim.width * scale);
    targetH = Math.round(baseDim.height * scale);
  } else if (options.resolution === '480p') {
    const scale = 480 / Math.min(baseDim.width, baseDim.height);
    targetW = Math.round(baseDim.width * scale);
    targetH = Math.round(baseDim.height * scale);
  }

  // Ensure dimensions are even numbers for H.264 codecs
  targetW = targetW % 2 === 0 ? targetW : targetW + 1;
  targetH = targetH % 2 === 0 ? targetH : targetH + 1;

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = targetW;
  offscreenCanvas.height = targetH;
  const ctx = offscreenCanvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context creation failed');
  }

  const layers = project.scenes[0]?.layers || [];

  onProgress(10, 'घटक व प्रतिमा लोड करत आहे (Preloading Layer Assets)...');
  await preloadVideoStudioAssets(layers);

  // Render initial frame
  ctx.save();
  const initScaleX = targetW / baseDim.width;
  const initScaleY = targetH / baseDim.height;
  ctx.scale(initScaleX, initScaleY);
  renderVideoStudioFrame(ctx, layers, 0, totalDuration, project.aspectRatio, {
    showSafeGuides: false,
    showCenterGuides: false,
    showGrid: false,
    activeProfile: project.profile,
    projectFrameId: project.frameId || 'footer-01',
    footerConfig: project.footerConfig,
  });
  ctx.restore();

  // 2. Setup Video Stream
  const videoStream = offscreenCanvas.captureStream(fps);
  const combinedStream = new MediaStream();

  videoStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));

  // 3. Setup Audio Stream if requested
  if (includeAudio && project.audioTrack) {
    try {
      const audioStream = videoStudioAudioEngine.createAudioDestinationStream(
        project.audioTrack,
        totalDuration
      );
      audioStream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
    } catch (e) {
      console.warn('Could not attach audio synthesizer track:', e);
    }
  }

  // 4. Determine MediaRecorder MimeType
  let mimeType = 'video/mp4';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/mp4;codecs=avc1.42E01E,mp4a.40.2';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=h264';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp9';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const recordedChunks: Blob[] = [];
  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: options.resolution === '1080p' ? 8_000_000 : 4_000_000,
  });

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  recorder.start(100);
  onProgress(15, `व्हिडिओ रेंडरिंग सुरू (${totalDuration} सेकंद)...`);

  // 5. Render frames precisely timed to totalDuration
  await new Promise<void>((resolve) => {
    const startTime = performance.now();
    const targetDurationMs = totalDuration * 1000;

    const renderLoop = () => {
      const now = performance.now();
      const elapsedMs = now - startTime;

      if (elapsedMs >= targetDurationMs) {
        // Render final frame at totalDuration
        ctx.save();
        const scaleX = targetW / baseDim.width;
        const scaleY = targetH / baseDim.height;
        ctx.scale(scaleX, scaleY);
        renderVideoStudioFrame(ctx, layers, totalDuration, totalDuration, project.aspectRatio, {
          showSafeGuides: false,
          showCenterGuides: false,
          showGrid: false,
          activeProfile: project.profile,
          projectFrameId: project.frameId || 'footer-01',
          footerConfig: project.footerConfig,
        });
        ctx.restore();

        onProgress(88, `रेंडरिंग पूर्ण (${totalDuration} सेकंद)`);
        resolve();
        return;
      }

      const currentTime = Math.min(totalDuration, (elapsedMs / targetDurationMs) * totalDuration);

      ctx.save();
      const scaleX = targetW / baseDim.width;
      const scaleY = targetH / baseDim.height;
      ctx.scale(scaleX, scaleY);

      renderVideoStudioFrame(ctx, layers, currentTime, totalDuration, project.aspectRatio, {
        showSafeGuides: false,
        showCenterGuides: false,
        showGrid: false,
        activeProfile: project.profile,
        projectFrameId: project.frameId || 'footer-01',
        footerConfig: project.footerConfig,
      });

      if (options.watermarkText) {
        ctx.font = 'bold 24px Poppins, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'right';
        ctx.fillText(options.watermarkText, baseDim.width - 24, baseDim.height - 24);
      }

      ctx.restore();

      const pct = Math.min(85, Math.round(15 + (elapsedMs / targetDurationMs) * 70));
      const secPassed = Math.min(totalDuration, elapsedMs / 1000).toFixed(1);
      onProgress(pct, `व्हिडिओ रेंडरिंग: ${secPassed} / ${totalDuration} सेकंद (${pct}%)`);

      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  });

  onProgress(90, 'व्हिडिओ एन्कोडिंग व अंतिम प्रक्रिया (Encoding MP4)...');

  // 6. Finalize Recording
  const exportResult = await new Promise<{ downloadUrl: string; fileName: string; blob: Blob }>(
    (resolve, reject) => {
      recorder.onstop = () => {
        try {
          const finalMime = mimeType.includes('mp4') ? 'video/mp4' : 'video/mp4'; // Provide mp4 signature
          const blob = new Blob(recordedChunks, { type: finalMime });
          const downloadUrl = URL.createObjectURL(blob);
          const cleanTitle = (project.title || 'Video')
            .replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')
            .slice(0, 30);
          const fileName = `Gunashree_${cleanTitle}_${totalDuration}s_${Date.now()}.mp4`;

          // Save record for persistent gallery
          saveStoredExportedVideo({
            id: `exp-${Date.now()}`,
            projectId: project.id,
            posterId: project.posterId,
            title: project.title,
            downloadUrl,
            aspectRatio: project.aspectRatio,
            duration: totalDuration,
            fileSizeBytes: blob.size,
            exportedAt: new Date().toISOString(),
          });

          onProgress(100, 'व्हिडिओ तयार झाला! (Video Export Complete ✓)');
          resolve({ downloadUrl, fileName, blob });
        } catch (err) {
          reject(err);
        }
      };

      recorder.stop();
      combinedStream.getTracks().forEach((track) => track.stop());
    }
  );

  return exportResult;
}

import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Share2,
  Film,
  Sparkles,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { VideoStudioProject } from '../../types';

interface VideoStudioExportModalProps {
  isOpen: boolean;
  project: VideoStudioProject;
  resolution: '1080p' | '720p' | '480p';
  status: 'preparing' | 'rendering' | 'encoding' | 'complete' | 'failed';
  statusText: string;
  progress: number;
  downloadUrl?: string;
  fileName?: string;
  onClose: () => void;
  onStartExport: () => void;
}

export const VideoStudioExportModal: React.FC<VideoStudioExportModalProps> = ({
  isOpen,
  project,
  resolution,
  status,
  statusText,
  progress,
  downloadUrl,
  fileName,
  onClose,
  onStartExport,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleDownloadClick = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName || `${project.title || 'Video'}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    if (downloadUrl) {
      navigator.clipboard.writeText(downloadUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <Film className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Export Video Studio MP4</h3>
              <p className="text-xs text-slate-400">
                {resolution} • {project.aspectRatio} • {project.duration}s
              </p>
            </div>
          </div>

          {status === 'complete' && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center Content */}
        <div className="p-5 space-y-5 flex flex-col items-center justify-center text-center">
          {status !== 'complete' ? (
            /* Progress & Rendering State */
            <div className="w-full space-y-4 py-4">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-14 h-14 text-amber-400 animate-spin" />
                <span className="absolute font-mono font-bold text-xs text-amber-300">{progress}%</span>
              </div>

              <div>
                <h4 className="font-bold text-base text-white">{statusText}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  कृपया विंडो बंद करू नका. व्हिडिओ H.264 MP4 फॉरमॅटमध्ये एन्कोड होत आहे.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            /* Complete State */
            <div className="w-full space-y-4">
              <div className="w-full max-h-64 rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-xl flex items-center justify-center">
                {downloadUrl ? (
                  <video
                    src={downloadUrl}
                    controls
                    autoPlay
                    loop
                    className="max-h-64 object-contain mx-auto"
                  />
                ) : (
                  <div className="py-12 text-slate-500">व्हिडिओ तयार झाला आहे.</div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>व्हिडिओ यशस्वीरित्या तयार झाला! (Ready to Download)</span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 active:scale-95 transition-all"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {status === 'complete' && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Done / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  HardDrive,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Database,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminStorageExportTab: React.FC = () => {
  const [cacheSize, setCacheSize] = useState(8.4);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanSuccess, setCleanSuccess] = useState(false);

  const handleCleanCache = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setCacheSize(0.2);
      setIsCleaning(false);
      setCleanSuccess(true);
      setTimeout(() => setCleanSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top 4 Storage Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Total Storage Used</span>
          <div className="text-2xl font-black text-white mt-1">19.4 GB</div>
          <span className="text-[11px] text-slate-500 block mt-1">Google Cloud Bucket</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Brand Logo Uploads</span>
          <div className="text-2xl font-black text-blue-400 mt-1">4.2 GB</div>
          <span className="text-[11px] text-slate-500 block mt-1">12,400 user logos</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Cutout / Photo Uploads</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">6.8 GB</div>
          <span className="text-[11px] text-slate-500 block mt-1">Leader & Owner Cutouts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Temporary Export Cache</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{cacheSize.toFixed(1)} GB</div>
          <span className="text-[11px] text-amber-400 font-bold block mt-1">Cleanup Available</span>
        </div>
      </div>

      {/* Grid: Export Formats + Auto Cleanup Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Formats Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Formats & Resolution Share</span>
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">PNG (Lossless)</span>
              <span className="text-lg font-black text-emerald-400 mt-1 block">64%</span>
              <span className="text-[11px] text-slate-500">Transparent & High Res</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">JPEG (Standard)</span>
              <span className="text-lg font-black text-blue-400 mt-1 block">36%</span>
              <span className="text-[11px] text-slate-500">Lightweight Share</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Standard HD (1080p)</span>
              <span className="text-lg font-black text-indigo-400 mt-1 block">68%</span>
              <span className="text-[11px] text-slate-500">Free & Standard Tier</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">4K Ultra HD (2160p)</span>
              <span className="text-lg font-black text-amber-400 mt-1 block">32%</span>
              <span className="text-[11px] text-slate-500">Exclusive VIP Exports</span>
            </div>
          </div>
        </div>

        {/* Cloud Cleanup Action Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Storage Optimization & 1-Click Cache Cleanup</span>
            </h4>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              वापरकर्त्यांनी तयार केलेल्या तात्पुरत्या ड्राफ्ट कॅशे फाइल्स (Temporary Export Cache) सुरक्षितपणे नष्ट करा, ज्यामुळे क्लाउड स्टोरेज बिल कमी राहते.
            </p>

            {cleanSuccess && (
              <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>८.२ GB तात्पुरती कॅशे यशस्वीरित्या साफ करण्यात आली!</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              कॅशे साईझ: <strong className="text-amber-400">{cacheSize.toFixed(1)} GB</strong>
            </span>

            <button
              type="button"
              disabled={isCleaning || cacheSize <= 0.3}
              onClick={handleCleanCache}
              className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCleaning ? 'animate-spin' : ''}`} />
              <span>{isCleaning ? 'साफ करत आहे...' : '1-Click Cache Clean करा'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

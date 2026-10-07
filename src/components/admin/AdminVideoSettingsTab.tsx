import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Music,
  Sliders,
  CheckCircle2,
  Save,
  RotateCcw,
  Shield,
  Film,
  Flame,
  Zap,
  Layers,
  Settings,
  AlertCircle,
  Eye,
  Check,
} from 'lucide-react';
import {
  AdminVideoSettings,
  VideoAnimationPresetId,
  PosterTemplate,
} from '../../types';
import {
  VIDEO_ANIMATION_PRESETS,
  DEFAULT_ADMIN_VIDEO_SETTINGS,
  getStoredAdminVideoSettings,
  saveAdminVideoSettings,
} from '../../data/videoAnimationPresets';

interface AdminVideoSettingsTabProps {
  templates?: PosterTemplate[];
  onSettingsUpdated?: (settings: AdminVideoSettings) => void;
  onOpenVideoStudio?: () => void;
}

export const AdminVideoSettingsTab: React.FC<AdminVideoSettingsTabProps> = ({
  templates = [],
  onSettingsUpdated,
  onOpenVideoStudio,
}) => {
  const [settings, setSettings] = useState<AdminVideoSettings>(() => getStoredAdminVideoSettings());
  const [previewPresetId, setPreviewPresetId] = useState<VideoAnimationPresetId>(settings.defaultPreset);
  const [saveToast, setSaveToast] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'presets' | 'analytics'>('general');

  const videoTemplatesCount = templates.filter((t) => t.isVideo || t.category === 'video-posts').length;

  const handleSave = () => {
    saveAdminVideoSettings(settings);
    if (onSettingsUpdated) {
      onSettingsUpdated(settings);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('सर्व व्हिडिओ ॲडमिन सेटिंग्ज मूळ (Default) स्थितीत आणायच्या आहेत का?')) {
      setSettings(DEFAULT_ADMIN_VIDEO_SETTINGS);
      saveAdminVideoSettings(DEFAULT_ADMIN_VIDEO_SETTINGS);
      if (onSettingsUpdated) {
        onSettingsUpdated(DEFAULT_ADMIN_VIDEO_SETTINGS);
      }
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    }
  };

  const selectedPresetInfo =
    VIDEO_ANIMATION_PRESETS.find((p) => p.id === previewPresetId) || VIDEO_ANIMATION_PRESETS[0];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">व्हिडिओ व ॲनिमेशन ॲडमिन पॅनल</h2>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-500/30">
                २० ॲनिमेशन्स Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              वापरकर्त्यांसाठी व्हिडिओ डाऊनलोड, ॲनिमेशन प्रिसेट्स, ऑडिओ आणि क्वालिटीचे केंद्रीय नियंत्रण
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenVideoStudio && (
            <button
              type="button"
              onClick={onOpenVideoStudio}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5" />
              <span>🎬 स्टुडिओ उघडा</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>रीसेट (Defaults)</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>बदल सेव्ह करा</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>व्हिडिओ ॲडमिन सेटिंग्ज यशस्वीरीत्या सेव्ह झाल्या! सर्व युजर्ससाठी आता लागू आहेत.</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSection('general')}
          className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSection === 'general'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>ग्लोबल व्हिडिओ नियंत्रण (Global Settings)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('presets')}
          className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSection === 'presets'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>सर्व २० प्रिसेट्स व्यवस्थापन ({VIDEO_ANIMATION_PRESETS.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('analytics')}
          className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            activeSection === 'analytics'
              ? 'bg-amber-500 text-slate-950 font-black'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>व्हिडिओ लायब्ररी आकडेवारी</span>
        </button>
      </div>

      {/* 1. GENERAL SETTINGS */}
      {activeSection === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Main Controls */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>एक्सपोर्ट व फॉरमॅट पर्याय</span>
            </h3>

            {/* Enable Video Exports Toggle */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">व्हिडिओ डाऊनलोड सक्षम करा (Enable Video Export)</span>
                <span className="text-[10px] text-slate-400">सर्व ग्राहकांसाठी MP4 व्हिडिओ स्टेटस डाऊनलोड सुरू ठेवा</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableVideoExports}
                onChange={(e) => setSettings({ ...settings, enableVideoExports: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Default Quality / Resolution */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">डीफॉल्ट व्हिडिओ रिझोल्यूशन</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1080p', '720p', '480p'] as const).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setSettings({ ...settings, defaultResolution: res })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      settings.defaultResolution === res
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {res === '1080p' ? 'Full HD 1080p' : res === '720p' ? 'HD 720p' : 'Lite 480p'}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Duration */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">डीफॉल्ट कालावधी (Default Duration)</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 30].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSettings({ ...settings, defaultDuration: sec })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      settings.defaultDuration === sec
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec} सेकंद {sec === 15 && '🔥'}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Audio Track */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">डीफॉल्ट पार्श्वसंगीत (Default Music Track)</label>
              <select
                value={settings.defaultAudio}
                onChange={(e) => setSettings({ ...settings, defaultAudio: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-amber-400"
              >
                <option value="dhol-tasha">🥁 ढोल-ताशा महाउत्सव बीट</option>
                <option value="shehnai">🎺 सनई मंगल सूर</option>
                <option value="temple-bells">🔔 मंदिरातील घंटानाद व आरती</option>
                <option value="none">🔇 मूक (Silent Video)</option>
              </select>
            </div>
          </div>

          {/* Advanced Limits & Watermark */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>कमाल मर्यादा व वॉटरमार्क नियम</span>
            </h3>

            {/* Max Duration */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">कमाल व्हिडिओ लांबी मर्यादा (Max Duration)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={settings.maxVideoDurationSeconds}
                  onChange={(e) =>
                    setSettings({ ...settings, maxVideoDurationSeconds: parseInt(e.target.value, 10) })
                  }
                  className="flex-1 accent-amber-500 cursor-pointer"
                />
                <span className="font-mono font-bold text-amber-400 text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {settings.maxVideoDurationSeconds} सेकंद
                </span>
              </div>
            </div>

            {/* 60 FPS Ultra Smooth */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">६० FPS अल्ट्रा-स्मूथ एक्सपोर्ट</span>
                <span className="text-[10px] text-slate-400">हाय-एंड डिव्हाइसेससाठी हाय फ्रेमरेट सपोर्ट</span>
              </div>
              <input
                type="checkbox"
                checked={settings.fps60Enabled}
                onChange={(e) => setSettings({ ...settings, fps60Enabled: e.target.checked })}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Watermark Settings */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">ॲप वॉटरमार्क (App Branding Watermark)</span>
                <input
                  type="checkbox"
                  checked={settings.watermarkEnabled}
                  onChange={(e) => setSettings({ ...settings, watermarkEnabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={settings.watermarkText}
                onChange={(e) => setSettings({ ...settings, watermarkText: e.target.value })}
                disabled={!settings.watermarkEnabled}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400 disabled:opacity-40"
                placeholder="GrowView App • Poster Maker"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. 20 PRESETS MANAGEMENT */}
      {activeSection === 'presets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>सर्व २० ॲनिमेशन प्रिसेट्स कॅटलॉग</span>
              </h3>
              <p className="text-xs text-slate-400">
                प्रत्येक प्रिसेटचे नाव, प्रिव्ह्यू आणि डीफॉल्ट प्रिसेट निवड व्यवस्थापित करा
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
              डीफॉल्ट: {selectedPresetInfo.nameMarathi}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {VIDEO_ANIMATION_PRESETS.map((preset, idx) => {
              const isDefault = settings.defaultPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                    isDefault
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-400'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        #{String(idx + 1).padStart(2, '0')} • {preset.category.toUpperCase()}
                      </span>
                      {isDefault ? (
                        <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> डीफॉल्ट
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, defaultPreset: preset.id })}
                          className="text-[10px] font-bold text-slate-400 hover:text-amber-300 transition-colors"
                        >
                          डीफॉल्ट करा
                        </button>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{preset.nameMarathi}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{preset.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {preset.descriptionMarathi}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">प्रकार: {preset.category}</span>
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: preset.previewColor || '#f59e0b' }}
                      title="Accent Color"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. VIDEO LIBRARY ANALYTICS */}
      {activeSection === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">एकूण व्हिडिओ टेम्पलेट्स</span>
            <span className="text-2xl font-black text-amber-400">{videoTemplatesCount} टेम्पलेट्स</span>
            <p className="text-[10px] text-slate-400 mt-1">गणेशोत्सव, हरतालिका, सुविचार आणि बिझनेस</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">ॲक्टिव्ह ॲनिमेशन इंजिन</span>
            <span className="text-2xl font-black text-emerald-400">२० प्रिसेट्स</span>
            <p className="text-[10px] text-slate-400 mt-1">Canvas 2D + Web Audio सिंथेसायझर</p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">डाऊनलोड फॉरमॅट्स</span>
            <span className="text-2xl font-black text-sky-400">MP4 HD + WebM</span>
            <p className="text-[10px] text-slate-400 mt-1">व्हॉट्सॲप स्टेटस व इन्स्टाग्राम रील्स सुसंगत</p>
          </div>
        </div>
      )}
    </div>
  );
};

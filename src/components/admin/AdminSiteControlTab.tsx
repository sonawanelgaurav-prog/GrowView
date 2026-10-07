import React, { useState } from 'react';
import {
  Globe,
  Sliders,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon,
  Phone,
  MessageSquare,
  Mail,
  Palette,
  Sparkles,
  Download,
  FileCode,
  Layout,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { WebsiteManualConfig, WebsiteRailConfig, DEFAULT_WEBSITE_CONFIG } from '../../data/websiteConfig';
import { FrameArrangement, FrameId } from '../../types';

interface AdminSiteControlTabProps {
  config: WebsiteManualConfig;
  onSaveConfig: (updatedConfig: WebsiteManualConfig) => void;
  onResetDefault?: () => void;
}

export const AdminSiteControlTab: React.FC<AdminSiteControlTabProps> = ({
  config,
  onSaveConfig,
  onResetDefault,
}) => {
  const [localConfig, setLocalConfig] = useState<WebsiteManualConfig>(config);
  const [activeSection, setActiveSection] = useState<'branding' | 'announcement' | 'rails' | 'frames' | 'backup'>('branding');
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const handleSave = () => {
    const updated = {
      ...localConfig,
      updatedAt: new Date().toISOString(),
    };
    onSaveConfig(updated);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('तुम्हाला सर्व वेबसाईट सेटिंग्ज पुन्हा मूळ (Default) स्थितीत करायच्या आहेत का?')) {
      setLocalConfig(DEFAULT_WEBSITE_CONFIG);
      onSaveConfig(DEFAULT_WEBSITE_CONFIG);
      if (onResetDefault) onResetDefault();
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 3000);
    }
  };

  // Move Rail Up/Down
  const moveRail = (index: number, direction: 'up' | 'down') => {
    const sorted = [...localConfig.rails].sort((a, b) => a.order - b.order);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const tempOrder = sorted[index].order;
    sorted[index].order = sorted[targetIdx].order;
    sorted[targetIdx].order = tempOrder;

    setLocalConfig((prev) => ({
      ...prev,
      rails: [...sorted].sort((a, b) => a.order - b.order),
    }));
  };

  // Toggle Rail Enabled
  const toggleRail = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      rails: prev.rails.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    }));
  };

  // Update Rail Field
  const updateRail = (id: string, updates: Partial<WebsiteRailConfig>) => {
    setLocalConfig((prev) => ({
      ...prev,
      rails: prev.rails.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(localConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GrowView_Website_Config_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.siteName) {
          setLocalConfig(imported);
          onSaveConfig(imported);
          alert('वेबसाईट कॉन्फिगरेशन यशस्वीरित्या इम्पोर्ट केले!');
        }
      } catch {
        alert('अवैध JSON फाईल. कृपया बरोबर फाईल निवडा.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Header & Save Actions */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>वेबसाईट मॅन्युअल कंट्रोल पॅनल</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                Full Manual Override
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ॲडमीनला वेबसाईटचे नाव, घोषणा पट्टी, सणांचे सेक्शन्स, फ्रेम्स व ब्रँडिंग थेट बदलण्याचा पूर्ण अधिकार.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            title="मूळ स्थितीत रीसेट करा"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>रीसेट (Default)</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>सर्व बदल जतन करा (Save)</span>
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessToast && (
        <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between shrink-0 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>वेबसाईटचे सर्व मॅन्युअल बदल यशस्वीरित्या जतन झाले असून संपूर्ण वेबसाईटवर लागू झाले आहेत!</span>
          </div>
          <span className="text-[10px] opacity-80">Saved at {new Date().toLocaleTimeString()}</span>
        </div>
      )}

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-900/30 shrink-0 overflow-x-auto">
        {[
          { id: 'branding', label: '१. ब्रँडिंग व संपर्क (Branding)', icon: Globe },
          { id: 'announcement', label: '२. घोषणा टिकर पट्टी (Notice Bar)', icon: Bell },
          { id: 'rails', label: '३. सण व गॅलरी सेक्शन्स (Rails)', icon: Layers },
          { id: 'frames', label: '४. डिफॉल्ट फ्रेम्स व रंग (Default Frame)', icon: Palette },
          { id: 'backup', label: '५. बॅकअप व JSON (Export/Import)', icon: Download },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* =========================================================================
            SECTION 1: BRANDING & CONTACT
           ========================================================================= */}
        {activeSection === 'branding' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>वेबसाईट शीर्षक व घोषवाक्य (Titles & Tagline)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    वेबसाईटचे नाव (English)
                  </label>
                  <input
                    type="text"
                    value={localConfig.siteName}
                    onChange={(e) => setLocalConfig({ ...localConfig, siteName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    वेबसाईटचे नाव (मराठी शीर्षक)
                  </label>
                  <input
                    type="text"
                    value={localConfig.siteNameMarathi}
                    onChange={(e) => setLocalConfig({ ...localConfig, siteNameMarathi: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    टॅगलाईन / घोषवाक्य (English)
                  </label>
                  <input
                    type="text"
                    value={localConfig.tagline}
                    onChange={(e) => setLocalConfig({ ...localConfig, tagline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    टॅगलाईन / घोषवाक्य (मराठी)
                  </label>
                  <input
                    type="text"
                    value={localConfig.taglineMarathi}
                    onChange={(e) => setLocalConfig({ ...localConfig, taglineMarathi: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Support & Contact Details */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>हेल्प व सपोर्ट माहिती (Customer Support Details)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> सपोर्ट फोन नंबर
                  </label>
                  <input
                    type="text"
                    value={localConfig.supportPhone}
                    onChange={(e) => setLocalConfig({ ...localConfig, supportPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-green-400" /> व्हॉट्सॲप हेल्पलाईन
                  </label>
                  <input
                    type="text"
                    value={localConfig.supportWhatsapp}
                    onChange={(e) => setLocalConfig({ ...localConfig, supportWhatsapp: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> सपोर्ट ईमेल
                  </label>
                  <input
                    type="email"
                    value={localConfig.supportEmail}
                    onChange={(e) => setLocalConfig({ ...localConfig, supportEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Logo Image URL / Upload */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>वेबसाईट लोगो (Custom Brand Logo)</span>
              </h4>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {localConfig.logoUrl ? (
                    <img src={localConfig.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <Sparkles className="w-8 h-8 text-amber-400" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="लोगो इमेज URL किंवा खालील बटणाने फाईल निवडा"
                      value={localConfig.logoUrl}
                      onChange={(e) => setLocalConfig({ ...localConfig, logoUrl: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    {localConfig.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLocalConfig({ ...localConfig, logoUrl: '' })}
                        className="px-2.5 py-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>काढा</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>कम्प्युटरमधून लोगो फाईल निवडा</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setLocalConfig({ ...localConfig, logoUrl: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">PNG, SVG किंवा WebP (पारदर्शक पार्श्वभूमी योग्य)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: ANNOUNCEMENT NOTICE BAR & MARQUEE TICKER
           ========================================================================= */}
        {activeSection === 'announcement' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>वेबसाईटच्या सर्वात वर दिसणारी घोषणा पट्टी (Top Announcement Bar)</span>
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.announcementBar.enabled}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        announcementBar: { ...localConfig.announcementBar, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs font-bold text-amber-400">पट्टी सुरु ठेवा (Enable)</span>
                </label>
              </div>

              {/* Live Preview */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  लाईव्ह प्रिव्ह्यू (Live Preview):
                </span>
                <div
                  className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-between shadow-md transition-all"
                  style={{
                    backgroundColor: localConfig.announcementBar.bgColor,
                    color: localConfig.announcementBar.textColor,
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider shrink-0">
                      {localConfig.announcementBar.badgeText || 'सूचना'}
                    </span>
                    <span className="truncate">{localConfig.announcementBar.text}</span>
                  </div>
                  <span className="text-[10px] underline shrink-0 ml-2">पहा →</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    घोषणेचा मुख्य मजकूर (मराठी/इंग्रजी संदेश)
                  </label>
                  <textarea
                    rows={2}
                    value={localConfig.announcementBar.text}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        announcementBar: { ...localConfig.announcementBar, text: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    बॅज मजकूर (उदा: नवीन, ५०% सूट, गणेशोत्सव विशेष)
                  </label>
                  <input
                    type="text"
                    value={localConfig.announcementBar.badgeText}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        announcementBar: { ...localConfig.announcementBar, badgeText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      पार्श्वभूमी रंग (Background Color)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localConfig.announcementBar.bgColor}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            announcementBar: { ...localConfig.announcementBar, bgColor: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={localConfig.announcementBar.bgColor}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            announcementBar: { ...localConfig.announcementBar, bgColor: e.target.value },
                          })
                        }
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      मजकूर रंग (Text Color)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localConfig.announcementBar.textColor}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            announcementBar: { ...localConfig.announcementBar, textColor: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={localConfig.announcementBar.textColor}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            announcementBar: { ...localConfig.announcementBar, textColor: e.target.value },
                          })
                        }
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 3: FESTIVAL & GALLERY RAILS (SECTIONS) CONTROL
           ========================================================================= */}
        {activeSection === 'rails' && (
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>गॅलरी रेल्स व सण विभाग मॅन्युअल व्यवस्थापन (Rail Sections)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  येथून तुम्ही गणेश चतुर्थी Special, व्हिडिओ स्टेटस व इतर सेक्शन्सचा क्रम, नाव, बॅज आणि चालू/बंद करू शकता.
                </p>
              </div>

              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                एकूण रेल्स: {localConfig.rails.length}
              </span>
            </div>

            <div className="space-y-3">
              {[...localConfig.rails]
                .sort((a, b) => a.order - b.order)
                .map((rail, idx) => (
                  <div
                    key={rail.id}
                    className={`bg-slate-900/90 border p-4 rounded-2xl transition-all space-y-3 ${
                      rail.enabled ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={rail.titleMarathi}
                            onChange={(e) => updateRail(rail.id, { titleMarathi: e.target.value })}
                            className="bg-slate-950 border border-slate-700 font-bold text-sm text-white px-2.5 py-1 rounded-lg focus:border-amber-400"
                          />
                          <input
                            type="text"
                            value={rail.badge}
                            onChange={(e) => updateRail(rail.id, { badge: e.target.value })}
                            placeholder="बॅज मजकूर"
                            className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-2 py-1 rounded-lg w-36"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveRail(idx, 'up')}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-lg transition-all"
                          title="वर हलवा"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={idx === localConfig.rails.length - 1}
                          onClick={() => moveRail(idx, 'down')}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-lg transition-all"
                          title="खाली हलवा"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Enable/Disable Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleRail(rail.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                            rail.enabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {rail.enabled ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>सुरु आहे</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>बंद आहे</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Subtitle / Description */}
                    <div>
                      <input
                        type="text"
                        value={rail.subtitle}
                        onChange={(e) => updateRail(rail.id, { subtitle: e.target.value })}
                        placeholder="सेक्शनचे संक्षिप्त वर्णन"
                        className="w-full bg-slate-950/70 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-lg focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: DEFAULT FOOTER FRAME & GLOBAL STYLES
           ========================================================================= */}
        {activeSection === 'frames' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>वेबसाईटवरील पोस्टर्ससाठी डिफॉल्ट फुटर फ्रेम व स्टाईल (Default Branding Frame)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Arrangement */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    फ्रेम पोझिशन / ॲरेंजमेंट
                  </label>
                  <select
                    value={localConfig.defaultFrameArrangement}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        defaultFrameArrangement: e.target.value as FrameArrangement,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="bottom">तळाशी (Bottom - पारंपारिक)</option>
                    <option value="top">वर (Top Header Frame)</option>
                    <option value="floating">फ्लोटिंग (Floating Rounded Card)</option>
                    <option value="compact">कॉम्पॅक्ट (Slim Compact)</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    मजकूर फॉन्ट साईझ ({localConfig.defaultFrameFontSize}px)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={18}
                    step={1}
                    value={localConfig.defaultFrameFontSize}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        defaultFrameFontSize: Number(e.target.value),
                      })
                    }
                    className="w-full accent-amber-500 mt-2"
                  />
                </div>

                {/* Bold Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    फॉन्ट वजन (Font Weight)
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localConfig.defaultFrameIsBold}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          defaultFrameIsBold: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-xs font-bold text-white">ठळक मजकूर (Bold)</span>
                  </label>
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    फ्रेम पार्श्वभूमी रंग
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={localConfig.defaultFrameBgColor}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          defaultFrameBgColor: e.target.value,
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={localConfig.defaultFrameBgColor}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          defaultFrameBgColor: e.target.value,
                        })
                      }
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: BACKUP & JSON RESTORE
           ========================================================================= */}
        {activeSection === 'backup' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Download className="w-4 h-4 text-amber-400" />
                <span>वेबसाईट कॉन्फिगरेशन बॅकअप व रिस्टोअर (JSON Backup & Restore)</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                तुम्ही संपूर्ण वेबसाईटच्या सेटिंग्ज (शीर्षके, घोषणा, सेक्शन्सचा क्रम, रंग) एका क्लिकवर JSON फाईलमध्ये सेव्ह करू शकता किंवा आधीचा बॅकअप पुन्हा अपलोड करू शकता.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>कॉन्फिगरेशन JSON फाईल डाऊनलोड करा (Export)</span>
                </button>

                <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md">
                  <Upload className="w-4 h-4" />
                  <span>JSON फाईल अपलोड करा (Import)</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleImportJson}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

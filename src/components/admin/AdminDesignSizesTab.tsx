import React, { useState, useEffect, useMemo } from 'react';
import {
  Maximize2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Layers,
  Square,
  Smartphone,
  Info,
  Save,
  RotateCcw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter,
  Check,
  Search
} from 'lucide-react';
import { AspectRatio, PosterTemplate, SYSTEM_SIZES, SystemSizeId } from '../../types';
import {
  getGlobalSizeSettings,
  saveGlobalSizeSettings,
  getCategorySizeSettingsMap,
  saveCategorySizeSettingsMap,
  DEFAULT_CATEGORY_SIZE_RULES,
  GlobalSizeSettings,
} from '../../data/sizeSystem';

interface AdminDesignSizesTabProps {
  templates?: PosterTemplate[];
  onSizesUpdated?: () => void;
}

export const AdminDesignSizesTab: React.FC<AdminDesignSizesTabProps> = ({
  templates = [],
  onSizesUpdated,
}) => {
  const [globalSettings, setGlobalSettings] = useState<GlobalSizeSettings>(() => getGlobalSizeSettings());
  const [categorySizes, setCategorySizes] = useState<Record<string, AspectRatio[]>>(() => getCategorySizeSettingsMap());
  const [activeGroupFilter, setActiveGroupFilter] = useState<'all' | 'business' | 'festival' | 'quotes' | 'social' | 'special'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate live usage of the 3 sizes across all templates
  const sizeUsage = useMemo(() => {
    const squareCount = templates.filter((t) => (t.allowedSizes ? t.allowedSizes.includes('1:1') : t.aspectRatio === '1:1')).length;
    const portraitCount = templates.filter((t) => (t.allowedSizes ? t.allowedSizes.includes('4:5') : t.aspectRatio === '4:5')).length;
    const verticalCount = templates.filter((t) => (t.allowedSizes ? t.allowedSizes.includes('9:16') : t.aspectRatio === '9:16')).length;
    return {
      square: squareCount,
      portrait: portraitCount,
      vertical: verticalCount,
      total: templates.length,
    };
  }, [templates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle a global system size
  const handleToggleGlobalSize = (key: keyof GlobalSizeSettings) => {
    const activeCount = Object.values(globalSettings).filter(Boolean).length;
    if (globalSettings[key] && activeCount <= 1) {
      alert('किमान एक आकार (Square, Portrait, किंवा Vertical) सिस्टीममध्ये ऑन असणे अनिवार्य आहे.');
      return;
    }
    const updated = {
      ...globalSettings,
      [key]: !globalSettings[key],
    };
    setGlobalSettings(updated);
    saveGlobalSizeSettings(updated);
    if (onSizesUpdated) onSizesUpdated();
    showToast(`✓ ग्लोबल आकार "${key.toUpperCase()}" ${updated[key] ? 'सुरू (ON)' : 'बंद (OFF)'} करण्यात आला!`);
  };

  // Toggle Category size in Size Matrix
  const handleToggleCategorySize = (catId: string, ratio: AspectRatio) => {
    const current = categorySizes[catId] || ['1:1', '4:5', '9:16'];
    let updated: AspectRatio[];
    if (current.includes(ratio)) {
      if (current.length === 1) {
        alert('प्रत्येक कॅटेगरीसाठी किमान एक आकार निवडलेला असणे आवश्यक आहे!');
        return;
      }
      updated = current.filter((r) => r !== ratio);
    } else {
      updated = [...current, ratio];
    }

    const newMap = {
      ...categorySizes,
      [catId]: updated,
    };
    setCategorySizes(newMap);
    saveCategorySizeSettingsMap(newMap);
    if (onSizesUpdated) onSizesUpdated();
    showToast(`✓ कॅटेगरी "${catId}" साठी आकार सेटिंग्ज अपडेट केल्या!`);
  };

  // Filtered Matrix Rows
  const filteredRules = useMemo(() => {
    return DEFAULT_CATEGORY_SIZE_RULES.filter((rule) => {
      if (activeGroupFilter !== 'all' && rule.group !== activeGroupFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          rule.name.toLowerCase().includes(q) ||
          (rule.nameMarathi && rule.nameMarathi.toLowerCase().includes(q)) ||
          rule.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeGroupFilter, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl shadow-2xl font-black text-xs flex items-center gap-2 border border-white/20 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Security Policy Notice */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">GROWVIEW डिझाईन आकार (System Design Sizes)</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Strict 3-Size System
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                संपूर्ण ॲपसाठी केवळ ३ निश्चित आकार: Square (1080×1080), Portrait (1080×1350), आणि Vertical (1080×1920)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-2 text-rose-300 text-xs flex items-center gap-2 shrink-0">
          <Lock className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="font-bold">कस्टम आकार पूर्णतः बंद (No Custom Size)</div>
            <div className="text-[10px] text-rose-400">
              Landscape, 16:9, A4 व इतर सर्व बाह्य आकार सिस्टीम स्तरावर हटवण्यात आले आहेत.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: GROWVIEW SUPPORTED SIZES (Global Fixed System Sizes) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>१. सिस्टीम समर्थित निश्चित आकार (Fixed System Sizes)</span>
            </h3>
            <p className="text-xs text-slate-400">
              ॲडमिन हे आकार पाहू शकतात, वापर संख्या तपासू शकतात व आवश्यकतेनुसार चालू/बंद (Enable/Disable) करू शकतात.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. SQUARE */}
          <div
            className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
              globalSettings.square
                ? 'bg-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-950/20'
                : 'bg-slate-900/50 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                  <Square className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">Square (चौकोनी)</h4>
                  <span className="text-[11px] font-bold text-amber-400">1:1 रेशिओ</span>
                </div>
              </div>

              {/* Status Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggleGlobalSize('square')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  globalSettings.square
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="ग्लोबल उपलब्धता बदला"
              >
                {globalSettings.square ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span>ON</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span>OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Fixed Dimensions Card */}
            <div className="mt-4 bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">पिक्सेल आकार:</span>
                <span className="font-mono font-bold text-amber-300">1080 × 1080 px</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">वापर (Usage):</span>
                <span className="font-bold text-white">{sizeUsage.square} पोस्ट्स</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">मुख्य वापर:</span>
                <span className="text-[11px] text-slate-300 font-medium">Instagram, Facebook Feed</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>सिस्टीम फिक्स साईझ • आकार बदलता येत नाही</span>
            </div>
          </div>

          {/* 2. PORTRAIT */}
          <div
            className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
              globalSettings.portrait
                ? 'bg-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-950/20'
                : 'bg-slate-900/50 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">Portrait (उभा फीड)</h4>
                  <span className="text-[11px] font-bold text-blue-400">4:5 रेशिओ</span>
                </div>
              </div>

              {/* Status Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggleGlobalSize('portrait')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  globalSettings.portrait
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="ग्लोबल उपलब्धता बदला"
              >
                {globalSettings.portrait ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span>ON</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span>OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Fixed Dimensions Card */}
            <div className="mt-4 bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">पिक्सेल आकार:</span>
                <span className="font-mono font-bold text-blue-300">1080 × 1350 px</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">वापर (Usage):</span>
                <span className="font-bold text-white">{sizeUsage.portrait} पोस्ट्स</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">मुख्य वापर:</span>
                <span className="text-[11px] text-slate-300 font-medium">Instagram Feed, Facebook Feed</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>सिस्टीम फिक्स साईझ • आकार बदलता येत नाही</span>
            </div>
          </div>

          {/* 3. VERTICAL */}
          <div
            className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
              globalSettings.vertical
                ? 'bg-slate-900 border-indigo-500/30 shadow-lg shadow-indigo-950/20'
                : 'bg-slate-900/50 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">Vertical (व्हर्टिकल)</h4>
                  <span className="text-[11px] font-bold text-purple-400">9:16 रेशिओ</span>
                </div>
              </div>

              {/* Status Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggleGlobalSize('vertical')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  globalSettings.vertical
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="ग्लोबल उपलब्धता बदला"
              >
                {globalSettings.vertical ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    <span>ON</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    <span>OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Fixed Dimensions Card */}
            <div className="mt-4 bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">पिक्सेल आकार:</span>
                <span className="font-mono font-bold text-purple-300">1080 × 1920 px</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">वापर (Usage):</span>
                <span className="font-bold text-white">{sizeUsage.vertical} पोस्ट्स</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">मुख्य वापर:</span>
                <span className="text-[11px] text-slate-300 font-medium">WhatsApp Status, Story & Reels</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>सिस्टीम फिक्स साईझ • आकार बदलता येत नाही</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ADMIN PANEL – SIZE MATRIX (Visual Management Table) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>२. कॅटेगरी साईझ मॅट्रिक्स (Category Size Matrix)</span>
            </h3>
            <p className="text-xs text-slate-400">
              प्रत्येक कॅटेगरीसाठी Square, Portrait, आणि Vertical आकारांचे थेट टॉगल स्विच नियंत्रण.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="कॅटेगरी शोधा..."
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 w-44"
              />
            </div>

            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveGroupFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeGroupFilter === 'all' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                सर्व
              </button>
              <button
                type="button"
                onClick={() => setActiveGroupFilter('business')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  activeGroupFilter === 'business' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                व्यवसाय
              </button>
              <button
                type="button"
                onClick={() => setActiveGroupFilter('social')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  activeGroupFilter === 'social' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                सोशल मीडिया
              </button>
              <button
                type="button"
                onClick={() => setActiveGroupFilter('festival')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  activeGroupFilter === 'festival' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                सण
              </button>
              <button
                type="button"
                onClick={() => setActiveGroupFilter('quotes')}
                className={`px-2 py-1 rounded-lg font-bold transition-all ${
                  activeGroupFilter === 'quotes' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                सुविचार
              </button>
            </div>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-black border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">कॅटेगरी / प्रकार (Category)</th>
                  <th className="py-3.5 px-4 text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Square className="w-3.5 h-3.5 text-amber-400" />
                      <span>Square (1:1)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono normal-case">1080×1080</span>
                  </th>
                  <th className="py-3.5 px-4 text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>Portrait (4:5)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono normal-case">1080×1350</span>
                  </th>
                  <th className="py-3.5 px-4 text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                      <span>Vertical (9:16)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono normal-case">1080×1920</span>
                  </th>
                  <th className="py-3.5 px-4 text-right font-bold">स्थिती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-white">
                {filteredRules.map((rule) => {
                  const allowed = categorySizes[rule.id] || rule.allowedSizes;
                  const isSquareOn = allowed.includes('1:1');
                  const isPortraitOn = allowed.includes('4:5');
                  const isVerticalOn = allowed.includes('9:16');

                  return (
                    <tr key={rule.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{rule.name}</span>
                          {rule.nameMarathi && (
                            <span className="text-slate-400 font-normal">({rule.nameMarathi})</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          ID: {rule.id} • Group: {rule.group}
                        </div>
                      </td>

                      {/* Square Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCategorySize(rule.id, '1:1')}
                          className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            isSquareOn
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {isSquareOn ? '[ ON ]' : '[ OFF ]'}
                        </button>
                      </td>

                      {/* Portrait Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCategorySize(rule.id, '4:5')}
                          className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            isPortraitOn
                              ? 'bg-blue-500 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {isPortraitOn ? '[ ON ]' : '[ OFF ]'}
                        </button>
                      </td>

                      {/* Vertical Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCategorySize(rule.id, '9:16')}
                          className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            isVerticalOn
                              ? 'bg-purple-500 text-white shadow-xs'
                              : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {isVerticalOn ? '[ ON ]' : '[ OFF ]'}
                        </button>
                      </td>

                      {/* Summary Tag */}
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300">
                          {allowed.length} आकार Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 3: BUSINESS SUBCATEGORIES CONTROL */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>३. व्यावसायिक उप-कॅटेगरी आकार नियंत्रण (Business Subcategories Size Control)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Product Promotion, Offer, Discount, Real Estate, Restaurant, Salon इत्यादी प्रत्येकाचे वैयक्तिक आकार नियंत्रण.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'sub-product-promo', name: 'Product Promotion', label: 'उत्पादन जाहिरात' },
            { id: 'sub-service-promo', name: 'Service Promotion', label: 'सेवा जाहिरात' },
            { id: 'sub-offer', name: 'Offer', label: 'ऑफर पोस्ट' },
            { id: 'sub-discount', name: 'Discount', label: 'सूट व डिस्काउंट' },
            { id: 'sub-new-opening', name: 'New Opening', label: 'नवीन उद्घाटन' },
            { id: 'sub-shop-ad', name: 'Shop Advertisement', label: 'दुकान जाहिरात' },
            { id: 'sub-restaurant', name: 'Restaurant', label: 'हॉटेल व कॅफे' },
            { id: 'sub-real-estate', name: 'Real Estate', label: 'बांधकाम व जागा' },
            { id: 'sub-education', name: 'Education', label: 'शाळा व क्लासेस' },
            { id: 'sub-medical', name: 'Medical', label: 'दवाखाना व फार्मसी' },
            { id: 'sub-salon', name: 'Salon', label: 'सलून व ब्युटी पार्लर' },
            { id: 'sub-digital-marketing', name: 'Digital Marketing', label: 'डिजिटल मार्केटिंग' },
            { id: 'sub-event-promo', name: 'Event Promotion', label: 'कार्यक्रम व इव्हेंट' },
          ].map((sub) => {
            const allowed = categorySizes[sub.id] || ['1:1', '4:5', '9:16'];

            return (
              <div key={sub.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-white">{sub.name}</div>
                  <span className="text-[10px] text-slate-400">{sub.label}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((r) => {
                    const isChecked = allowed.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleToggleCategorySize(sub.id, r)}
                        className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold border transition-all ${
                          isChecked
                            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-2xs'
                            : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        {r === '1:1' ? '1:1' : r === '4:5' ? '4:5' : '9:16'}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  BusinessProfile,
  FrameId,
  FooterCategory,
  FooterColorMode,
  LogoShape,
  FooterFrameConfig,
  FrameArrangement,
} from '../../types';
import {
  FOOTER_FRAMES,
  FOOTER_CATEGORIES,
  getDisabledFrameIds,
  toggleFrameActive,
  saveFrameOverride,
} from '../../data/footerFrames';
import { fileToDataUrl, removeImageBackground } from '../../utils/imageProcessing';
import {
  Layers,
  Sparkles,
  Phone,
  Building2,
  User,
  Briefcase,
  Type,
  Palette,
  Upload,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Sliders,
  Sun,
  Moon,
  Wand2,
  Paintbrush,
  Image as ImageIcon,
  Bold,
  Layout,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Lock,
  ShieldCheck,
} from 'lucide-react';

interface FooterFrameDrawerProps {
  selectedFrameId: FrameId;
  onSelectFrame: (id: FrameId) => void;
  profile: BusinessProfile;
  onUpdateProfile: (updates: Partial<BusinessProfile>) => void;
  config: FooterFrameConfig;
  onUpdateConfig: (updates: Partial<FooterFrameConfig>) => void;
  onUploadLogo?: (logoUrl: string) => void;
  onRemoveLogo?: () => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onSaveAsGlobalDefault?: () => void;
}

export const FooterFrameDrawer: React.FC<FooterFrameDrawerProps> = ({
  selectedFrameId,
  onSelectFrame,
  profile,
  onUpdateProfile,
  config,
  onUpdateConfig,
  onUploadLogo,
  onRemoveLogo,
  isAdmin = false,
  onOpenAdminLogin,
  onSaveAsGlobalDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'fields' | 'size' | 'style' | 'logo'>('catalog');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FooterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [disabledFrameIds, setDisabledFrameIds] = useState<string[]>(() => getDisabledFrameIds());
  const [isRemovingLeaderBg, setIsRemovingLeaderBg] = useState(false);
  const [isRemovingLogoBg, setIsRemovingLogoBg] = useState(false);
  const [paletteSavedMsg, setPaletteSavedMsg] = useState(false);

  // 35 frames filtered by category and search query (and active status for regular users)
  const filteredFrames = FOOTER_FRAMES.filter((f) => {
    if (!isAdmin && disabledFrameIds.includes(f.id)) return false;
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        f.name.toLowerCase().includes(q) ||
        f.nameMarathi?.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.badge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleFrame = (frameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFrameActive(frameId);
    setDisabledFrameIds([...updated]);
  };

  const selectedFrame = FOOTER_FRAMES.find((f) => f.id === selectedFrameId) || FOOTER_FRAMES[0];

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        if (onUploadLogo) {
          onUploadLogo(dataUrl);
        } else {
          onUpdateProfile({ logoUrl: dataUrl });
        }
      } catch (err) {
        console.error('Logo upload failed:', err);
      }
    }
    e.target.value = '';
  };

  const FONTS_LIST = [
    { id: "'Baloo 2', sans-serif", name: 'Baloo 2 (मराठी/इंग्रजी)', preview: 'मराठी' },
    { id: "'Yatra One', cursive", name: 'Yatra One (शाही)', preview: 'शाही' },
    { id: "'Mukta', sans-serif", name: 'Mukta (स्पष्ट)', preview: 'मराठी' },
    { id: "'Rozha One', serif", name: 'Rozha One (ठळक)', preview: 'मराठी' },
    { id: "'Noto Sans Devanagari', sans-serif", name: 'Noto Sans (क्लीन)', preview: 'मराठी' },
    { id: "'Outfit', sans-serif", name: 'Outfit (Corporate)', preview: 'Brand' },
    { id: "'Cinzel', serif", name: 'Cinzel (Royal Gold)', preview: 'Royal' },
    { id: "'Poppins', sans-serif", name: 'Poppins (Modern)', preview: 'Modern' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* 1. TOP HEADER & NAVIGATION TABS */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/80 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>FOOTER / BUSINESS FRAMES</span>
            </h4>
            <p className="text-[10px] text-slate-400">
              ३५ डिझायनर फ्रेम्स • ५ बिझनेस माहिती पर्याय
            </p>
          </div>
          <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
            {FOOTER_FRAMES.length} फ्रेम्स (Frames)
          </span>
        </div>

        {/* Sub-Tabs: Catalog / 5 Fields / Size (Admin) / Style / Logo */}
        <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] sm:text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            फ्रेम्स ({FOOTER_FRAMES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fields')}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === 'fields'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            माहिती (५)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('size')}
            className={`py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'size'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>साईझ</span>
            {isAdmin ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Admin Unlocked" />
            ) : (
              <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0" title="Admin Only" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === 'style'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            रंग/फॉन्ट
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === 'logo'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            लोगो
          </button>
        </div>
      </div>

      {/* 2. TAB 1: FRAME CATALOG (EXACTLY 27 FRAMES ACROSS 3 CATEGORIES) */}
      {activeTab === 'catalog' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Category Filter Pills */}
          <div className="p-2 border-b border-slate-800 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar mobile-smooth-scroll shrink-0">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                categoryFilter === 'all'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              सर्व (All {FOOTER_FRAMES.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('standard')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                categoryFilter === 'standard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              1. Standard (10)
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('right-logo')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                categoryFilter === 'right-logo'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              2. Right Logo (10)
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('top-right-logo')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                categoryFilter === 'top-right-logo'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              3. Top-Right (7)
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('banner-portrait')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                categoryFilter === 'banner-portrait'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              4. 👤 बॅनर पॉप-आउट (8)
            </button>
          </div>

          {/* List of Frames with Rich Visual Thumbnails */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredFrames.map((f) => {
              const isSelected = f.id === selectedFrameId;
              return (
                <div
                  key={f.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectFrame(f.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectFrame(f.id);
                    }
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left transition-all relative flex flex-col gap-1.5 group cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 text-white ring-2 ring-amber-400/40 shadow-lg'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {/* Top Bar with Number, Name & Category Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: f.accent }}
                      />
                      <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                        #{f.frameNumber < 10 ? `0${f.frameNumber}` : f.frameNumber} — {f.name}
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        backgroundColor: `${f.accent}20`,
                        color: f.accent,
                        borderColor: `${f.accent}40`,
                      }}
                    >
                      {f.badge}
                    </span>
                  </div>

                  {/* Thumbnail Mini Visualization Preview */}
                  <div className="w-full h-9 bg-slate-950 rounded-lg border border-slate-800/80 p-1 flex items-center justify-between px-2 overflow-hidden relative">
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="w-20 h-1.5 bg-slate-300 rounded-full" />
                      <div className="w-28 h-1 bg-amber-400/80 rounded-full mt-1" />
                    </div>

                    {/* Show logo mockup for Category 2 or 3 */}
                    {f.category === 'right-logo' && (
                      <div
                        className="w-6 h-6 rounded-md border flex items-center justify-center text-[7px] font-bold text-amber-300 shrink-0"
                        style={{ borderColor: f.accent, backgroundColor: `${f.accent}20` }}
                      >
                        LOGO
                      </div>
                    )}
                    {f.category === 'top-right-logo' && (
                      <div className="flex items-center gap-1 text-[8px] text-cyan-300 font-bold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>Top-Right</span>
                      </div>
                    )}
                    {f.category === 'banner-portrait' && (
                      <div className="flex items-center gap-1 text-[8px] text-rose-300 font-bold shrink-0 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/40">
                        <span>👤 कटआउट फोटो</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10.5px] text-slate-400 line-clamp-1 flex-1">
                      {f.description}
                    </p>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => handleToggleFrame(f.id, e)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 cursor-pointer shrink-0 transition-colors ${
                          disabledFrameIds.includes(f.id)
                            ? 'bg-rose-950/80 text-rose-300 border-rose-600/50 hover:bg-rose-900'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900'
                        }`}
                        title={
                          disabledFrameIds.includes(f.id)
                            ? 'फ्रेम बंद आहे (क्लिक करून चालू करा)'
                            : 'फ्रेम चालू आहे (क्लिक करून बंद करा)'
                        }
                      >
                        {disabledFrameIds.includes(f.id) ? (
                          <>
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>Disabled</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-2.5 h-2.5" />
                            <span>Active</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_gold]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TAB 2: ONLY 5 SUPPORTED INFORMATION FIELDS */}
      {activeTab === 'fields' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>फक्त ५ व्यावसायिक माहिती फील्ड्स (5 Supported Fields)</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              प्रत्येक फील्ड स्वतंत्रपणे चालू/बंद करू शकता. रिक्त फील्ड्स आपोआप लपवले जातात.
            </p>
          </div>

          {/* 1. Personal Name */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>१. वैयक्तिक नाव (Personal Name)</span>
              </label>
              <button
                type="button"
                onClick={() => onUpdateConfig({ showPersonalName: config.showPersonalName === false })}
                className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                  config.showPersonalName !== false ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-500'
                }`}
              >
                {config.showPersonalName !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <input
              type="text"
              value={profile.ownerName || ''}
              onChange={(e) => onUpdateProfile({ ownerName: e.target.value })}
              placeholder="उदा. गौरव सोनवणे / Rajesh Kalyan"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 2. Company Name */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>२. कंपनीचे नाव (Company Name)</span>
              </label>
              <button
                type="button"
                onClick={() => onUpdateConfig({ showCompanyName: config.showCompanyName === false })}
                className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                  config.showCompanyName !== false ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-500'
                }`}
              >
                {config.showCompanyName !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <input
              type="text"
              value={profile.name || ''}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              placeholder="उदा. Coreline Digital Solutions"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 3. Designation */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>३. पद / हुद्दा (Designation)</span>
              </label>
              <button
                type="button"
                onClick={() => onUpdateConfig({ showDesignation: config.showDesignation === false })}
                className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                  config.showDesignation !== false ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-500'
                }`}
              >
                {config.showDesignation !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <input
              type="text"
              value={profile.designation || ''}
              onChange={(e) => onUpdateProfile({ designation: e.target.value })}
              placeholder="उदा. Founder & CEO / संचालक"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 4. Mobile Number */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>४. मोबाईल नंबर (Mobile Number)</span>
              </label>
              <button
                type="button"
                onClick={() => onUpdateConfig({ showMobileNumber: config.showMobileNumber === false })}
                className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                  config.showMobileNumber !== false ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-500'
                }`}
              >
                {config.showMobileNumber !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => onUpdateProfile({ phone: e.target.value, whatsapp: e.target.value })}
              placeholder="उदा. +91 98765 43210"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* 5. Company Work / Description */}
          <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>५. व्यवसायाचे स्वरूप / माहिती (Company Work)</span>
              </label>
              <button
                type="button"
                onClick={() => onUpdateConfig({ showCompanyWork: config.showCompanyWork === false })}
                className={`p-1 rounded-md text-[10px] font-bold flex items-center gap-1 ${
                  config.showCompanyWork !== false ? 'text-emerald-400 bg-emerald-950/50' : 'text-slate-500'
                }`}
              >
                {config.showCompanyWork !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <textarea
              rows={2}
              value={profile.tagline || ''}
              onChange={(e) => onUpdateProfile({ tagline: e.target.value })}
              placeholder="उदा. सर्व प्रकारचे फ्लेक्स, डिजिटल बॅनर व व्हिजिटिंग कार्ड्सचे विश्वासू ठिकाण"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 6. Leader / Personal Cutout Photo (Pop-out above footer) */}
          <div className="space-y-2 bg-rose-950/20 p-3 rounded-2xl border border-rose-500/30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>६. व्यक्तीचा कटआउट फोटो (Leader Photo)</span>
              </label>
              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">
                फ्रेम 28-35
              </span>
            </div>

            <p className="text-[10.5px] text-slate-400">
              हा फोटो बॅनर डिझाईन फ्रेम्समध्ये (28 ते 35) फ्रेमच्या वरती 55% कटआउट स्वरूपात दिसतो.
            </p>

            {profile.leaderPhotoUrl ? (
              <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <div className="w-12 h-12 rounded-lg bg-slate-900 border border-rose-500/40 overflow-hidden flex items-center justify-center relative shrink-0">
                  <img
                    src={profile.leaderPhotoUrl}
                    alt="Leader Cutout"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <button
                    type="button"
                    disabled={isRemovingLeaderBg}
                    onClick={async () => {
                      if (!profile.leaderPhotoUrl) return;
                      try {
                        setIsRemovingLeaderBg(true);
                        const result = await removeImageBackground(profile.leaderPhotoUrl);
                        onUpdateProfile({ leaderPhotoUrl: result });
                      } catch (e) {
                        console.error('BG removal failed', e);
                      } finally {
                        setIsRemovingLeaderBg(false);
                      }
                    }}
                    className="w-full py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Wand2 className={`w-3 h-3 ${isRemovingLeaderBg ? 'animate-spin' : ''}`} />
                    <span>{isRemovingLeaderBg ? 'बॅकग्राउंड काढत आहे...' : '✨ बॅकग्राउंड काढा (Remove BG)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateProfile({ leaderPhotoUrl: '' })}
                    className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>फोटो हटवा</span>
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-dashed border-rose-500/40 bg-slate-950/60 hover:bg-slate-900 cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-rose-400" />
                <span className="text-[11px] font-bold text-slate-300">
                  फोटो अपलोड करा (PNG / JPG)
                </span>
                <span className="text-[9.5px] text-slate-500">
                  अपलोड केल्यानंतर 'बॅकग्राउंड काढा' ऑप्शन उपलब्ध होईल
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const dataUrl = await fileToDataUrl(file);
                        onUpdateProfile({ leaderPhotoUrl: dataUrl });
                      } catch (err) {
                        console.error('Leader photo upload failed', err);
                      }
                    }
                    e.target.value = '';
                  }}
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* 3. TAB: FRAME SIZE ADJUSTMENTS (ADMIN ONLY RESTRICTION) */}
      {activeTab === 'size' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {!isAdmin ? (
            /* User Locked View */
            <div className="space-y-4">
              <div className="bg-slate-900/95 p-5 rounded-2xl border border-amber-500/30 text-center space-y-3.5 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                    <span>🔒 फक्त ॲडमीन ऍक्सेस</span>
                    <span className="text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                      Admin Only
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    फ्रेम्सचा आकार <span className="text-amber-300 font-semibold">(छोट / मोठ)</span>, उंची, मांडणी, बॉर्डर व सर्व डीप बदल करण्याचे अधिकार फक्त{' '}
                    <span className="text-amber-400 font-bold">मास्टर ॲडमीन (मालक: गौरव सोनावणे)</span> व त्यांच्या अधिकृत टीमकडे आहेत.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    युजर्ससाठी प्रमाणित आणि संतुलित आकार आपोआप सेट केलेला आहे. युजर्स फक्त नाव, संपर्क व लोगो जोडू शकतात.
                  </p>
                </div>

                {onOpenAdminLogin && (
                  <button
                    type="button"
                    onClick={onOpenAdminLogin}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>👑 मास्टर ॲडमीन लॉगिन करा</span>
                  </button>
                )}
              </div>

              {/* Read-Only Status for Regular Users */}
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">सध्याचा सक्रिय आकार (Current Set Size):</span>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-xs text-slate-300 font-medium">फ्रेम उंची:</span>
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    {config.frameHeightPercent || (config.frameSizePreset === 'compact' ? 14 : config.frameSizePreset === 'large' ? 24 : config.frameSizePreset === 'extralarge' ? 28 : 18)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-xs text-slate-300 font-medium">आकार प्रकार:</span>
                  <span className="text-xs font-bold text-slate-200 uppercase">
                    {config.frameSizePreset || 'Regular (सामान्य १८%)'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Admin Full Control View */
            <div className="space-y-4">
              {/* Admin Authority Header */}
              <div className="p-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    👑
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-300 block">
                      मास्टर ॲडमिन फ्रेम कस्टमायझर
                    </span>
                    <span className="text-[10px] text-emerald-400/80">
                      अधिकृत ऍक्सेस: गौरव सोनावणे (Gaurav Sonawane)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  पूर्ण नियंत्रण
                </span>
              </div>

              {/* 1. PRESET SIZES (छोट, मध्यम, मोठ, जंबो) */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>१. फ्रेमचा आकार निवडा (Frame Size Presets):</span>
                  </label>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    {config.frameHeightPercent || (config.frameSizePreset === 'compact' ? 14 : config.frameSizePreset === 'large' ? 24 : config.frameSizePreset === 'extralarge' ? 28 : 18)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: 'compact',
                      percent: 14,
                      label: '📱 छोट / बारीक',
                      desc: '14% उंची • फोटोसाठी 86% जागा मोकळी',
                    },
                    {
                      id: 'regular',
                      percent: 18,
                      label: '📐 सामान्य / मध्यम',
                      desc: '18% उंची • 5 फील्ड्ससाठी स्टँडर्ड बॅलन्स',
                    },
                    {
                      id: 'large',
                      percent: 24,
                      label: '📏 मोठ (Large)',
                      desc: '24% उंची • ठळक मजकूर व मोठा लोगो',
                    },
                    {
                      id: 'extralarge',
                      percent: 28,
                      label: '🌟 अतिमोठ / जंबो',
                      desc: '28% उंची • भव्य कॉर्पोरेट बॅनर स्टाईल',
                    },
                  ].map((preset) => {
                    const isCur =
                      config.frameSizePreset === preset.id ||
                      (config.frameHeightPercent === preset.percent && !config.frameSizePreset);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          onUpdateConfig({
                            frameSizePreset: preset.id as any,
                            frameHeightPercent: preset.percent,
                          });
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
                          isCur
                            ? 'bg-amber-500/15 border-amber-400 text-white ring-1 ring-amber-400/40 shadow-sm'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{preset.label}</span>
                          {isCur && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">{preset.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Height Percentage Fine Slider (10% to 35%) */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="text-[11px] font-medium">अचूक उंची स्लायडर (Fine Height Slider):</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {config.frameHeightPercent || (config.frameSizePreset === 'compact' ? 14 : config.frameSizePreset === 'large' ? 24 : config.frameSizePreset === 'extralarge' ? 28 : 18)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">10%</span>
                    <input
                      type="range"
                      min={10}
                      max={35}
                      step={1}
                      value={
                        config.frameHeightPercent ||
                        (config.frameSizePreset === 'compact'
                          ? 14
                          : config.frameSizePreset === 'large'
                          ? 24
                          : config.frameSizePreset === 'extralarge'
                          ? 28
                          : 18)
                      }
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        let matchedPreset: any = undefined;
                        if (val <= 15) matchedPreset = 'compact';
                        else if (val <= 20) matchedPreset = 'regular';
                        else if (val <= 26) matchedPreset = 'large';
                        else matchedPreset = 'extralarge';

                        onUpdateConfig({
                          frameHeightPercent: val,
                          frameSizePreset: matchedPreset,
                        });
                      }}
                      className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">35%</span>
                  </div>
                </div>
              </div>

              {/* 2. FRAME ARRANGEMENT / POSITION (मांडणी) */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-amber-400" />
                  <span>२. फ्रेम पोझिशन / मांडणी (Frame Arrangement):</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bottom', label: '⬇️ तळाशी (Bottom)' },
                    { id: 'floating', label: '🔲 फ्लोटिंग (Card)' },
                    { id: 'top', label: '⬆️ वरती (Top)' },
                  ].map((pos) => {
                    const isCur = (config.arrangement || 'bottom') === pos.id;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => onUpdateConfig({ arrangement: pos.id as any })}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          isCur
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {pos.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. BORDER & CORNERS (कोपरे व बॉर्डर) */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>३. कोपरे व बॉर्डर (Corners & Border Width):</span>
                </label>

                {/* Corner Radius */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-300">कोपऱ्यांची गोलाई (Corner Radius):</span>
                    <span className="font-bold text-amber-400 font-mono">{config.borderRadius || 0}px</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[0, 8, 14, 20, 28].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => onUpdateConfig({ borderRadius: r })}
                        className={`py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          (config.borderRadius || 0) === r
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {r}px
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={36}
                    value={config.borderRadius || 0}
                    onChange={(e) => onUpdateConfig({ borderRadius: Number(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Border Width */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-300">बॉर्डर जाडी (Border Width):</span>
                    <span className="font-bold text-amber-400 font-mono">{config.borderWidth || 0}px</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[0, 1, 2, 3, 4].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => onUpdateConfig({ borderWidth: w })}
                        className={`py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          (config.borderWidth || 0) === w
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {w}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Color */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-300">बॉर्डर रंग (Border Color):</span>
                    <span className="text-[10px] text-slate-400 font-mono">{config.borderColor || 'Default'}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['#f59e0b', '#fbbf24', '#ffffff', '#e11d48', '#10b981', '#3b82f6', '#000000'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onUpdateConfig({ borderColor: c, borderWidth: config.borderWidth || 2 })}
                        className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110 shadow-xs cursor-pointer"
                        style={{
                          backgroundColor: c,
                          borderColor: config.borderColor === c ? '#ffffff' : '#475569',
                        }}
                      />
                    ))}
                    <label className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold cursor-pointer border border-slate-700 flex items-center gap-1">
                      <span>कस्टम रंग</span>
                      <input
                        type="color"
                        value={config.borderColor || '#f59e0b'}
                        onChange={(e) => onUpdateConfig({ borderColor: e.target.value, borderWidth: config.borderWidth || 2 })}
                        className="w-4 h-4 rounded border-0 cursor-pointer bg-transparent"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 4. LOGO & FONT SCALE INSIDE FRAME */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>४. लोगो व फॉन्ट साईझ स्केलिंग (Inside Scaling):</span>
                </label>

                {/* Logo Size */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-300">लोगो साईझ (Logo Box Size):</span>
                    <span className="font-bold text-amber-400">{config.logoSize || 42}px</span>
                  </div>
                  <input
                    type="range"
                    min={24}
                    max={76}
                    step={2}
                    value={config.logoSize || 42}
                    onChange={(e) => onUpdateConfig({ logoSize: Number(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-300">फॉन्ट साईझ (Font Size):</span>
                    <span className="font-bold text-amber-400">{config.customFontSize || 13}px</span>
                  </div>
                  <input
                    type="range"
                    min={9}
                    max={22}
                    step={1}
                    value={config.customFontSize || 13}
                    onChange={(e) => onUpdateConfig({ customFontSize: Number(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Save Global Default Confirmation */}
              {onSaveAsGlobalDefault && (
                <button
                  type="button"
                  onClick={onSaveAsGlobalDefault}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>हे सेटिंग्ज सर्व युजर्ससाठी सेव्ह करा (Save as Global Default)</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 3: COLOR SYSTEM, FONT SIZE & ARRANGEMENT */}
      {activeTab === 'style' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* A. Frame Arrangement (फ्रेम्स चे ॲरेंजमेंट फ्लेक्सीबल) */}
          <div className="space-y-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-amber-400" />
                <span>फ्रेम ॲरेंजमेंट / पोझिशन (Frame Placement):</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase">
                {config.arrangement || 'bottom'}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'bottom', label: '⬇️ तळाशी (Bottom)', desc: 'प्रमाणित' },
                { id: 'top', label: '⬆️ वरती (Top)', desc: 'हेडर फ्रेम' },
                { id: 'floating', label: '🔲 फ्लोटिंग (Card)', desc: 'फ्लोटिंग कार्ड' },
                { id: 'compact', label: '📱 कॉम्पॅक्ट (Slim)', desc: 'स्लिम बार' },
                { id: 'split', label: '↔️ स्प्लिट (Split)', desc: 'दोन बाजू' },
              ].map((arr) => {
                const isCur = (config.arrangement || 'bottom') === arr.id;
                return (
                  <button
                    key={arr.id}
                    type="button"
                    onClick={() => onUpdateConfig({ arrangement: arr.id as FrameArrangement })}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isCur
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[11px] block truncate">{arr.label}</span>
                    <span className={`text-[9px] block ${isCur ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                      {arr.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. Font Size Option (फाॅन्ट साईझ बदलन्याचा ऑप्शन) */}
          <div className="space-y-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>फाॅन्ट साईझ (Font Size):</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                  {config.customFontSize || 13}px
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ isBold: !config.isBold })}
                  className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 border transition-all ${
                    config.isBold
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="ठळक (Bold)"
                >
                  <Bold className="w-3 h-3" />
                  <span>ठळक</span>
                </button>
              </div>
            </div>

            {/* Quick Size Presets */}
            <div className="grid grid-cols-5 gap-1">
              {[
                { label: 'बारीक', size: 10 },
                { label: 'लहान', size: 12 },
                { label: 'मध्यम', size: 13 },
                { label: 'मोठा', size: 15 },
                { label: 'जम्बो', size: 18 },
              ].map((p) => {
                const active = (config.customFontSize || 13) === p.size;
                return (
                  <button
                    key={p.size}
                    type="button"
                    onClick={() => onUpdateConfig({ customFontSize: p.size })}
                    className={`py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      active
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {p.label} ({p.size})
                  </button>
                );
              })}
            </div>

            {/* Slider */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-semibold">9px</span>
              <input
                type="range"
                min={9}
                max={22}
                step={1}
                value={config.customFontSize || 13}
                onChange={(e) => onUpdateConfig({ customFontSize: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-semibold">22px</span>
            </div>
          </div>

          {/* C. Colors for Each Element (प्रत्येकाचा रंग बदलन्याचा ऑप्शन) */}
          <div className="space-y-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>प्रत्येकाचा रंग बदला (Individual Colors):</span>
            </label>

            {/* 1. Background Color */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-300">१. फ्रेम बॅकग्राउंड रंग (Background Color):</span>
                <span className="text-[10px] text-slate-400 font-mono">{config.bgColor || 'Default'}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: 'डार्क नेव्ही', color: '#090d16' },
                  { label: 'रॉयल ब्लॅक', color: '#000000' },
                  { label: 'भगवा', color: '#ea580c' },
                  { label: 'लाल', color: '#991b1b' },
                  { label: 'सोनेरी', color: '#78350f' },
                  { label: 'पांढरा', color: '#ffffff' },
                  { label: 'जांभळा', color: '#3b0764' },
                ].map((bg) => (
                  <button
                    key={bg.color}
                    type="button"
                    onClick={() => onUpdateConfig({ colorMode: 'custom', bgColor: bg.color })}
                    className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110 shadow-xs"
                    style={{
                      backgroundColor: bg.color,
                      borderColor: config.bgColor === bg.color ? '#f59e0b' : '#334155',
                    }}
                    title={bg.label}
                  />
                ))}
                <label className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold cursor-pointer border border-slate-700 flex items-center gap-1">
                  <span>कस्टम रंग</span>
                  <input
                    type="color"
                    value={config.bgColor || '#090d16'}
                    onChange={(e) => onUpdateConfig({ colorMode: 'custom', bgColor: e.target.value })}
                    className="w-4 h-4 rounded border-0 cursor-pointer bg-transparent"
                  />
                </label>
              </div>
            </div>

            {/* 2. Text Color */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-300">२. मजकूर/अक्षरांचा रंग (Text Color):</span>
                <span className="text-[10px] text-slate-400 font-mono">{config.textColor || 'Default'}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: 'पांढरा', color: '#ffffff' },
                  { label: 'पिवळा', color: '#fef08a' },
                  { label: 'सोनेरी', color: '#f59e0b' },
                  { label: 'केशरी', color: '#fb923c' },
                  { label: 'हिरवा', color: '#4ade80' },
                  { label: 'काळा', color: '#0f172a' },
                ].map((tc) => (
                  <button
                    key={tc.color}
                    type="button"
                    onClick={() => onUpdateConfig({ colorMode: 'custom', textColor: tc.color })}
                    className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110 shadow-xs"
                    style={{
                      backgroundColor: tc.color,
                      borderColor: config.textColor === tc.color ? '#f59e0b' : '#334155',
                    }}
                    title={tc.label}
                  />
                ))}
                <label className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold cursor-pointer border border-slate-700 flex items-center gap-1">
                  <span>कस्टम रंग</span>
                  <input
                    type="color"
                    value={config.textColor || '#ffffff'}
                    onChange={(e) => onUpdateConfig({ colorMode: 'custom', textColor: e.target.value })}
                    className="w-4 h-4 rounded border-0 cursor-pointer bg-transparent"
                  />
                </label>
              </div>
            </div>

            {/* 3. Accent & Border Color */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-300">३. ॲक्सेंट व बॉर्डर रंग (Accent Color):</span>
                <span className="text-[10px] text-slate-400 font-mono">{config.accentColor || '#f59e0b'}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  '#f59e0b', // Gold
                  '#3b82f6', // Blue
                  '#10b981', // Green
                  '#ef4444', // Red
                  '#8b5cf6', // Purple
                  '#06b6d4', // Cyan
                  '#ec4899', // Pink
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onUpdateConfig({ accentColor: c, borderColor: c })}
                    className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110 shadow-xs"
                    style={{
                      backgroundColor: c,
                      borderColor: config.accentColor === c ? '#ffffff' : '#334155',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* D. Font Selector with Marathi & English Support */}
          <div className="space-y-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>मराठी व इंग्रजी फॉन्ट (Marathi Font):</span>
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {FONTS_LIST.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => onUpdateConfig({ fontFamily: font.id })}
                  className={`w-full p-2 rounded-xl text-left border flex items-center justify-between transition-all ${
                    config.fontFamily === font.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold" style={{ fontFamily: font.id }}>
                    {font.name}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 text-amber-400" style={{ fontFamily: font.id }}>
                    {font.preview}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* E. Direct Frame Palette Persistence Override */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>या फ्रेमसाठी थेट कलर पॅलेट सेव्ह करा:</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                #{selectedFrame.frameNumber} {selectedFrame.name}
              </span>
            </div>

            <p className="text-[10.5px] text-slate-300 leading-relaxed">
              तुम्ही निवडलेले बॅकग्राउंड ({config.bgColor || selectedFrame.backgroundColor}), मजकूर ({config.textColor || selectedFrame.textColor}) आणि ॲक्सेंट रंग या फ्रेमसाठी कायमस्वरूपी सेव्ह करा.
            </p>

            <button
              type="button"
              onClick={() => {
                saveFrameOverride(selectedFrameId, {
                  backgroundColor: config.bgColor || selectedFrame.backgroundColor,
                  textColor: config.textColor || selectedFrame.textColor,
                  accent: config.accentColor || selectedFrame.accent,
                });
                setPaletteSavedMsg(true);
                setTimeout(() => setPaletteSavedMsg(false), 3000);
              }}
              className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>या फ्रेमचे रंग पॅलेट सेव्ह करा</span>
            </button>

            {paletteSavedMsg && (
              <div className="p-2 bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-[11px] rounded-lg text-center font-bold animate-fade-in">
                ✓ फ्रेम #{selectedFrame.frameNumber} चे कलर पॅलेट यशस्वीरीत्या सेव्ह झाले!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 4: LOGO UPLOAD, SIZING & DELETION */}
      {activeTab === 'logo' && (
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white block">ब्रँड लोगो व्यवस्थापन (Logo Management):</span>
              {profile.logoUrl && profile.logoUrl.trim() !== '' && (
                <button
                  type="button"
                  onClick={() => {
                    if (onRemoveLogo) onRemoveLogo();
                    onUpdateProfile({ logoUrl: '' });
                    onUpdateConfig({ showCompanyLogo: false });
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>लोगो काढून टाका (Delete)</span>
                </button>
              )}
            </div>

            {profile.logoUrl && profile.logoUrl.trim() !== '' ? (
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-emerald-500/40">
                <img
                  src={profile.logoUrl}
                  alt="Logo"
                  className="w-14 h-14 rounded-xl object-contain bg-white p-1 border border-slate-700 shrink-0 shadow-sm"
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 block truncate">✓ लोगो फ्रेमवर लोड आहे</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-lg cursor-pointer flex items-center gap-1 shadow-xs transition-all">
                      <Upload className="w-3 h-3" />
                      <span>नवीन बदला</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    <button
                      type="button"
                      disabled={isRemovingLogoBg}
                      onClick={async () => {
                        if (!profile.logoUrl) return;
                        try {
                          setIsRemovingLogoBg(true);
                          const result = await removeImageBackground(profile.logoUrl);
                          if (onUploadLogo) {
                            onUploadLogo(result);
                          } else {
                            onUpdateProfile({ logoUrl: result });
                          }
                        } catch (e) {
                          console.error('Logo BG removal failed', e);
                        } finally {
                          setIsRemovingLogoBg(false);
                        }
                      }}
                      className="text-[11px] bg-rose-600 hover:bg-rose-500 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer transition-all disabled:opacity-50"
                    >
                      <Wand2 className={`w-3 h-3 ${isRemovingLogoBg ? 'animate-spin' : ''}`} />
                      <span>{isRemovingLogoBg ? 'काढत आहे...' : '✨ बॅकग्राउंड काढा'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onRemoveLogo) onRemoveLogo();
                        onUpdateProfile({ logoUrl: '' });
                        onUpdateConfig({ showCompanyLogo: false });
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>हटवा</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="w-full py-5 border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/60 transition-all hover:bg-slate-900/60">
                <Upload className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-bold text-slate-100">+ फोन/कॉम्प्युटरवरून लोगो निवडा</span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WebP किंवा पारदर्शक लोगो सपोर्टेड</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            )}

            {/* Logo Size Modifier */}
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>लोगो साईझ (Logo Size):</span>
                <span className="font-bold text-amber-400">{config.logoSize || 42}px</span>
              </div>
              <input
                type="range"
                min={24}
                max={64}
                step={2}
                value={config.logoSize || 42}
                onChange={(e) => onUpdateConfig({ logoSize: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Logo Shapes: Square, Circle, Rounded, Hexagon, Badge, Cut-Corner */}
          <div className="space-y-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <label className="text-xs font-bold text-white">लोगोचा आकार निवडा (Logo Shape):</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'circle', label: 'सर्कल (Circle)' },
                { id: 'rounded', label: 'राऊंडेड (Rounded)' },
                { id: 'square', label: 'स्क्वेअर (Square)' },
                { id: 'hexagon', label: 'हेक्सागॉन (Hexagon)' },
                { id: 'badge', label: 'बॅज (Badge)' },
                { id: 'cut-corner', label: 'कट-कॉर्नर (Cut)' },
              ].map((s) => {
                const isCur = (config.logoShape || 'rounded') === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onUpdateConfig({ logoShape: s.id as LogoShape })}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      isCur
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

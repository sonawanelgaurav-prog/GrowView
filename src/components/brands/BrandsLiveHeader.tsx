import React, { useState, useRef, useEffect } from 'react';
import { BusinessProfile, UserAccount, LanguageCode } from '../../types';
import { 
  Sparkles, 
  ChevronDown, 
  Search, 
  Shield, 
  User, 
  Crown, 
  Globe, 
  Check, 
  Flame, 
  Phone,
  SlidersHorizontal,
  Building,
  ArrowRight,
  TrendingUp,
  Activity,
  LogOut,
  Plus,
  Smartphone,
  Video,
  Users,
  CreditCard,
} from 'lucide-react';

interface BrandsLiveHeaderProps {
  activeProfile: BusinessProfile;
  currentUser: UserAccount | null;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onNavigateToLanding?: () => void;
  onOpenProfileModal: () => void;
  onOpenAIModal: () => void;
  onOpenVideoStudio?: () => void;
  onOpenInstallModal?: () => void;
  onOpenAdminModal: () => void;
  onOpenAdminLoginModal?: () => void;
  onOpenQuickDesignStudio?: () => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenCustomerModal: () => void;
  onOpenVIPModal: () => void;
  onOpenTeamModal?: () => void;
  onOpenAIFestivalModal?: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickSearchTag: (tag: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const LANGUAGES: { code: LanguageCode; label: string; native: string; flag: string }[] = [
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🚩' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🦁' },
  { code: 'en', label: 'English', native: 'English', flag: '🌐' },
];

const TRENDING_TAGS = [
  { label: '🚩 शिवजयंती (Shivjayanti)', query: 'shivaji' },
  { label: '🌅 शुभ सकाळ (Good Morning 50+)', query: 'good-morning-quotes' },
  { label: '🌙 शुभ रात्र (Good Night 50+)', query: 'good-night-quotes' },
  { label: '🔱 महाशिवरात्री', query: 'shivratri' },
  { label: '🎨 होळी (Holi)', query: 'holi' },
  { label: '🚩 गुढीपाडवा', query: 'gudi-padwa' },
  { label: '💎 ज्वेलरी (Jewellery)', query: 'jewelry' },
  { label: '🏢 रिअल इस्टेट', query: 'real-estate' },
  { label: '🏷️ बंपर ऑफर', query: 'offer' },
];

export const BrandsLiveHeader: React.FC<BrandsLiveHeaderProps> = ({
  activeProfile,
  currentUser,
  selectedLanguage,
  onSelectLanguage,
  onNavigateToLanding,
  onOpenProfileModal,
  onOpenAIModal,
  onOpenVideoStudio,
  onOpenInstallModal,
  onOpenAdminModal,
  onOpenAdminLoginModal,
  onOpenQuickDesignStudio,
  onOpenAuthModal,
  onOpenCustomerModal,
  onOpenVIPModal,
  onOpenTeamModal,
  onOpenAIFestivalModal,
  onLogout,
  searchQuery,
  onSearchChange,
  onQuickSearchTag,
  onSelectCategory,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAdminOrStaff = currentUser?.role === 'admin' || !!currentUser?.adminRole;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLangObj = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* Top Notification / VIP Banner */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white text-[11px] font-medium py-1 px-4 text-center flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <span className="flex items-center gap-1 font-bold">
          <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-amber-200" />
          GrowView Mega Festival Dhamaka:
        </span>
        <span className="hidden sm:inline">
          Special Shivjayanti, Gudi Padwa & Business Posters Ready for Auto-Branding!
        </span>
        <a
          href="tel:7774914906"
          className="bg-black/30 hover:bg-black/50 text-amber-100 hover:text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-xs transition-colors flex items-center gap-1 border border-white/20"
          title="कंपनीशी संपर्क साधा (Call Company Support)"
        >
          <Phone className="w-3 h-3 text-emerald-300" />
          <span>कंपनी संपर्क: 7774914906</span>
        </a>
        <button
          type="button"
          onClick={onOpenVIPModal}
          className="bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full backdrop-blur-xs transition-colors flex items-center gap-1"
        >
          <Crown className="w-3 h-3 text-amber-200" /> Get VIP @ ₹199/yr
        </button>
      </div>

      {/* Main GrowView Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateToLanding) onNavigateToLanding();
            }}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-emerald-500/20 ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tight flex items-center">
                  Grow<span className="text-emerald-600">View</span>
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200 tracking-wide uppercase">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block font-medium leading-none">
                #1 Indian Festival & Business Branding App
              </p>
            </div>
          </button>
        </div>

        {/* Center: Search Bar with Autocomplete & Trending - Enhanced Size & Visibility */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative group">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-orange-600 absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 100,000+ Posters: Shivjayanti, Shivratri, Real Estate, Suvichar..."
              className="w-full bg-white hover:bg-slate-50 focus:bg-white border-2 border-slate-300 hover:border-slate-400 focus:border-orange-500 rounded-full pl-12 pr-24 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-slate-950 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all shadow-xs"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer shadow-2xs"
                title="शोध मजकूर पुसा (Clear search)"
              >
                ✕ Clear
              </button>
            ) : (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 pointer-events-none">
                ⚡ 1-Click Search
              </span>
            )}
          </div>
        </div>

        {/* Right Actions: Language, Active Brand Profile, VIP, Auth, Admin */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 text-xs font-semibold transition-colors"
              title="Change Language / भाषा बदला"
            >
              <span className="text-sm">{activeLangObj.flag}</span>
              <span className="hidden sm:inline font-bold text-slate-800">{activeLangObj.native}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Language / भाषा
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50 transition-colors ${
                      selectedLanguage === lang.code ? 'font-bold text-orange-600 bg-orange-50/50' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-slate-400">({lang.label})</span>
                    </div>
                    {selectedLanguage === lang.code && <Check className="w-3.5 h-3.5 text-orange-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Business Profile Switcher Pill */}
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-orange-200 px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-800 transition-all shadow-xs group"
            title="My Business Profile & Logo / ब्रँड माहिती"
          >
            {activeProfile.logoUrl ? (
              <img
                src={activeProfile.logoUrl}
                alt="Logo"
                className="w-6 h-6 rounded-md object-cover border border-orange-300 shrink-0 bg-white"
              />
            ) : (
              <div className="w-6 h-6 rounded-md bg-orange-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 shadow-xs">
                {activeProfile.name.charAt(0)}
              </div>
            )}
            <div className="text-left hidden lg:block max-w-[130px]">
              <span className="text-[9px] text-orange-700 font-bold uppercase tracking-tight block leading-none">
                My Brand
              </span>
              <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                {activeProfile.name}
              </span>
            </div>
            <SlidersHorizontal className="w-3 h-3 text-orange-600 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* VIP Upgrade Button */}
          <button
            type="button"
            onClick={onOpenVIPModal}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow-sm shadow-amber-500/20 border border-amber-300 transition-all active:scale-95"
            title="GrowView VIP Membership"
          >
            <Crown className="w-3.5 h-3.5 fill-current text-slate-950" />
            <span>VIP Pass</span>
          </button>

          {/* Video Studio Button */}
          {onOpenVideoStudio && (
            <button
              type="button"
              onClick={onOpenVideoStudio}
              className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs px-2.5 sm:px-3 py-1.5 rounded-lg shadow-sm shadow-rose-600/30 transition-all active:scale-95"
              title="🎬 व्हिडिओ स्टुडिओ - सर्व पोस्टर्सचे व्हिडिओ बनवा (Video Studio)"
            >
              <Video className="w-3.5 h-3.5 fill-current text-white" />
              <span>व्हिडिओ स्टुडिओ</span>
            </button>
          )}

          {/* AI Festival Auto Creator Button (Sections 1-35) */}
          {onOpenAIFestivalModal && (
            <button
              type="button"
              onClick={onOpenAIFestivalModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs px-2.5 sm:px-3 py-1.5 rounded-lg shadow-sm shadow-orange-500/30 border border-amber-300 transition-all active:scale-95 cursor-pointer whitespace-nowrap group"
              title="✨ AI Festival Auto Creator - आगामी सण शोधा आणि १-क्लिकमध्ये १० पोस्टर्स बनवा"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950 animate-bounce" />
              <span className="hidden sm:inline">✨ AI सण क्रिएटर (10 Posters)</span>
              <span className="sm:hidden">✨ AI सण</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-300 font-extrabold">
                Auto
              </span>
            </button>
          )}

          {/* AI Generator Button */}
          <button
            type="button"
            onClick={onOpenAIModal}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            title="AI Festive Slogans & Quotes"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="hidden sm:inline">AI Post</span>
          </button>

          {/* Install App on Mobile Button */}
          {onOpenInstallModal && (
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-lg shadow-xs transition-all active:scale-95"
              title="मोबाईलमध्ये ॲप डाऊनलोड करा (Install App on Mobile)"
            >
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">मोबाईल ॲप</span>
            </button>
          )}

          {/* Post Upload & Edit Quick Button (ONLY VISIBLE TO ADMIN / STAFF) */}
          {isAdminOrStaff && onOpenQuickDesignStudio && (
            <button
              type="button"
              onClick={onOpenQuickDesignStudio}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition-all active:scale-95 border border-emerald-500/30"
              title="नवीन पोस्टर अपलोड करा किंवा एडिट करा (Post Upload & Edit - Admin Only)"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span className="font-bold text-[11px] hidden sm:inline">पोस्ट अपलोड / एडिट</span>
              <span className="font-bold text-[11px] sm:hidden">अपलोड</span>
            </button>
          )}

          {/* Customer / User Account Dropdown */}
          <div className="relative" ref={userMenuRef}>
            {currentUser ? (
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs ${
                  isAdminOrStaff
                    ? 'bg-purple-950/90 text-purple-200 border border-purple-700/60 hover:bg-purple-900'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isAdminOrStaff ? (
                  <Shield className="w-3.5 h-3.5 text-purple-300" />
                ) : (
                  <User className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="hidden xl:inline max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-xs"
              >
                Login
              </button>
            )}

            {isUserMenuOpen && currentUser && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  {isAdminOrStaff ? (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">
                      <Shield className="w-3 h-3" />
                      {currentUser.adminRole === 'editor'
                        ? '🎨 Design Editor'
                        : currentUser.adminRole === 'content_manager'
                        ? '📝 Content Manager'
                        : '👑 Super Admin'}
                    </span>
                  ) : (
                    <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Active Customer
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenCustomerModal();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    सबस्क्रिप्शन व पेमेंट इतिहास (Plan & Payments)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenCustomerModal();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-slate-400" />
                    My Activity & Downloads ({currentUser.totalDownloads || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Building className="w-4 h-4 text-slate-400" />
                    Business Frames & Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenVIPModal();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-bold"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    Upgrade to VIP Member
                  </button>

                  {onOpenTeamModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenTeamModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-indigo-700 hover:bg-indigo-50 flex items-center gap-2 font-bold"
                    >
                      <Users className="w-4 h-4 text-indigo-500" />
                      👥 बिझनेस टीम व्यवस्थापन (Team Access)
                    </button>
                  )}

                  {/* ADMIN / STAFF ONLY OPTIONS */}
                  {isAdminOrStaff && (
                    <>
                      {onOpenQuickDesignStudio && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenQuickDesignStudio();
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 flex items-center gap-2 font-bold border-t border-slate-100"
                        >
                          <Plus className="w-4 h-4 text-emerald-600" />
                          🎨 पोस्ट अपलोड आणि एडिट (Studio)
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdminModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-purple-900 bg-purple-50/70 hover:bg-purple-100 flex items-center gap-2 font-bold border-t border-slate-100"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        Admin & Team Console (ॲडमीन पॅनेल)
                      </button>
                    </>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (< md) - Enhanced Size & Visibility */}
      <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200 md:hidden">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 100,000+ Posters (उदा. शिवजयंती, गणेशोत्सव)..."
            className="w-full bg-white focus:bg-white border-2 border-slate-300 focus:border-orange-500 rounded-xl pl-11 pr-20 py-2.5 text-sm sm:text-base font-semibold text-slate-950 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-lg shadow-2xs"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Trending Search Suggestions Ribbon */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-4 sm:px-6 py-1.5 overflow-x-auto no-scrollbar mobile-smooth-scroll flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-red-500" /> Trending:
        </span>
        {TRENDING_TAGS.map((tag, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onQuickSearchTag(tag.query)}
            className="text-[11px] font-medium text-slate-600 hover:text-red-600 hover:bg-white bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80 whitespace-nowrap transition-colors"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </header>
  );
};

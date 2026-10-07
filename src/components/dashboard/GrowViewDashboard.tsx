import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  LayoutTemplate,
  FolderHeart,
  Heart,
  Briefcase,
  Upload,
  Wand2,
  Crown,
  Settings,
  HelpCircle,
  User,
  Search,
  Bell,
  ChevronRight,
  ArrowRight,
  MoreVertical,
  Download,
  Share2,
  Copy,
  Edit3,
  Trash2,
  Palette,
  Film,
  Mail,
  Smartphone,
  CheckCircle2,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Layers,
  Check,
  RefreshCw
} from 'lucide-react';
import {
  UserAccount,
  PosterTemplate,
  CategoryInfo,
  BusinessProfile,
  PlanConfig,
  LanguageCode
} from '../../types';
import { deduplicateCategories } from '../../utils/categoryUtils';

export type DashboardTab = 
  | 'dashboard'
  | 'create'
  | 'templates'
  | 'my-designs'
  | 'favorites'
  | 'brand-kit'
  | 'uploads'
  | 'ai-design'
  | 'subscription'
  | 'settings'
  | 'help';

interface GrowViewDashboardProps {
  currentUser: UserAccount | null;
  activeProfile: BusinessProfile;
  templates: PosterTemplate[];
  categories: CategoryInfo[];
  plans?: PlanConfig[];
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onOpenStudio: (template?: PosterTemplate) => void;
  onOpenVideoStudio?: () => void;
  onOpenProfileModal: () => void;
  onOpenAIModal: () => void;
  onOpenPricingModal: () => void;
  onSaveProfile: (profile: BusinessProfile) => void;
  onLogout: () => void;
  onNavigateToLanding: () => void;
  onOpenAdminModal?: () => void;
}

export const GrowViewDashboard: React.FC<GrowViewDashboardProps> = ({
  currentUser,
  activeProfile,
  templates,
  categories,
  plans,
  selectedLanguage,
  onSelectLanguage,
  onOpenStudio,
  onOpenVideoStudio,
  onOpenProfileModal,
  onOpenAIModal,
  onOpenPricingModal,
  onSaveProfile,
  onLogout,
  onNavigateToLanding,
  onOpenAdminModal,
}) => {
  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [popularTab, setPopularTab] = useState<'trending' | 'recent' | 'recommended'>('trending');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResults, setAiResults] = useState<PosterTemplate[]>([]);

  // Brand Kit local state
  const [brandKit, setBrandKit] = useState<BusinessProfile>({ ...activeProfile });
  const [brandKitSavedNotice, setBrandKitSavedNotice] = useState(false);

  // My Designs state (mocked from templates with local edits/recents)
  const [myDesigns, setMyDesigns] = useState<Array<PosterTemplate & { lastEdited?: string }>>(
    templates.slice(0, 6).map((t, i) => ({
      ...t,
      lastEdited: i === 0 ? 'Just now' : i === 1 ? '2 hours ago' : `${i + 1} days ago`,
    }))
  );
  const [activeMenuDesignId, setActiveMenuDesignId] = useState<string | null>(null);

  // Dynamic Greeting based on current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning ☀️';
    if (hour < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 👋';
  };

  // Filter templates
  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.titleNative && tpl.titleNative.includes(searchQuery)) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || tpl.category === selectedCategory || tpl.subCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleQuickCreate = (type: 'poster' | 'social' | 'reel' | 'invitation') => {
    if (type === 'reel') {
      if (onOpenVideoStudio) onOpenVideoStudio();
      else onOpenStudio();
      return;
    }

    if (type === 'social') {
      const square = templates.find((t) => t.aspectRatio === '1:1') || templates[0];
      onOpenStudio(square);
      return;
    }

    if (type === 'invitation') {
      const invite =
        templates.find((t) => t.category === 'wedding-invitation' || t.category === 'engagement-ceremony') ||
        templates[0];
      onOpenStudio(invite);
      return;
    }

    // Default poster
    onOpenStudio(templates[0]);
  };

  const handleGenerateAI = (overridePrompt?: string) => {
    const promptText = overridePrompt || aiPrompt;
    if (!promptText.trim()) return;

    setAiGenerating(true);
    setTimeout(() => {
      // Pick matching templates or shuffle
      const lower = promptText.toLowerCase();
      let matched = templates.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          t.category.toLowerCase().includes(lower) ||
          (t.titleNative && t.titleNative.toLowerCase().includes(lower))
      );

      if (matched.length === 0) {
        matched = [...templates].sort(() => 0.5 - Math.random()).slice(0, 4);
      } else {
        matched = matched.slice(0, 4);
      }

      setAiResults(matched);
      setAiGenerating(false);
      setActiveTab('ai-design');
    }, 900);
  };

  const handleSaveBrandKit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(brandKit);
    setBrandKitSavedNotice(true);
    setTimeout(() => setBrandKitSavedNotice(false), 3000);
  };

  const handleApplyBrandToDesign = () => {
    onSaveProfile(brandKit);
    onOpenStudio(templates[0]);
  };

  // Nav items configuration
  const primaryNavItems: Array<{ id: DashboardTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create', icon: PlusCircle },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'my-designs', label: 'My Designs', icon: FolderHeart },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'brand-kit', label: 'Brand Kit', icon: Briefcase },
    { id: 'uploads', label: 'Uploads', icon: Upload },
    { id: 'ai-design', label: 'AI Design', icon: Wand2 },
  ];

  const secondaryNavItems: Array<{ id: DashboardTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8FC] text-[#18181B] flex flex-col font-sans selection:bg-[#635BFF] selection:text-white">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-[#E7E7EE] px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2" onClick={onNavigateToLanding}>
          <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-black font-['Outfit'] tracking-tight text-[#18181B]">
            Grow<span className="text-[#635BFF]">View</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenStudio()}
            className="px-3 py-1.5 rounded-lg bg-[#635BFF] text-white text-xs font-bold shadow-xs flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main SaaS App Shell: Left Sidebar + Right Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* SECTION 9: LEFT SIDEBAR (Collapsible Desktop + Mobile Slideout) */}
        <aside
          className={`fixed md:sticky top-0 h-screen z-50 md:z-30 bg-white border-r border-[#E7E7EE] flex flex-col transition-all duration-300 shadow-xs ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          {/* Logo Area */}
          <div className="h-18 px-5 border-b border-[#E7E7EE] flex items-center justify-between">
            <div
              className={`flex items-center gap-3 cursor-pointer select-none overflow-hidden transition-all ${
                isSidebarCollapsed ? 'justify-center w-full' : ''
              }`}
              onClick={onNavigateToLanding}
              title="GrowView Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#635BFF] to-indigo-500 p-0.5 shadow-md shadow-[#635BFF]/20 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#635BFF]" />
                </div>
              </div>
              {!isSidebarCollapsed && (
                <div className="leading-tight">
                  <span className="text-xl font-black font-['Outfit'] tracking-tight text-[#18181B] block">
                    Grow<span className="text-[#635BFF]">View</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider block">
                    Design Platform
                  </span>
                </div>
              )}
            </div>

            {/* Collapse/Expand Toggle on Desktop */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 no-scrollbar">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'create') {
                      onOpenStudio();
                    } else {
                      setActiveTab(item.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25 font-bold'
                      : 'text-[#71717A] hover:text-[#18181B] hover:bg-slate-100/80'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}

            <div className="my-3 border-t border-[#E7E7EE]" />

            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'subscription') {
                      onOpenPricingModal();
                    } else {
                      setActiveTab(item.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-[#635BFF] font-bold'
                      : 'text-[#71717A] hover:text-[#18181B] hover:bg-slate-100/80'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#635BFF]' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* User Profile Card at bottom of sidebar */}
          <div className="p-3 border-t border-[#E7E7EE]">
            <div
              onClick={onOpenProfileModal}
              className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors ${
                isSidebarCollapsed ? 'justify-center' : ''
              }`}
              title="View Profile"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#635BFF] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#18181B] truncate">
                    {currentUser?.name || activeProfile.name || 'Creative User'}
                  </div>
                  <div className="text-[10px] text-[#71717A] truncate">
                    {currentUser?.email || activeProfile.phone || 'Free Plan'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile slideout */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* SECTION 10: DASHBOARD TOP AREA */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E7E7EE] px-6 py-4 flex items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'templates' && activeTab !== 'dashboard') {
                    setActiveTab('templates');
                  }
                }}
                placeholder="Search templates, festivals, business designs..."
                className="w-full bg-[#F8F8FC] border border-[#E7E7EE] focus:border-[#635BFF] rounded-xl pl-10 pr-4 py-2 text-sm text-[#18181B] placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15"
              />
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-3">
              {/* Quick AI Design trigger */}
              <button
                type="button"
                onClick={() => setActiveTab('ai-design')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#635BFF] border border-indigo-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#635BFF]" />
                <span>AI Design</span>
              </button>

              {/* Notifications */}
              <button
                type="button"
                className="p-2 rounded-xl text-slate-600 hover:text-[#18181B] hover:bg-slate-100 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#635BFF] absolute top-1.5 right-1.5" />
              </button>

              {/* Help */}
              <button
                type="button"
                onClick={() => setActiveTab('help')}
                className="p-2 rounded-xl text-slate-600 hover:text-[#18181B] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Help & Guides"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* VIP / Upgrade */}
              <button
                type="button"
                onClick={onOpenPricingModal}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Upgrade Pro</span>
              </button>

              {/* Profile Avatar */}
              <div
                onClick={onOpenProfileModal}
                className="w-9 h-9 rounded-xl bg-[#635BFF]/10 border border-[#635BFF]/20 flex items-center justify-center text-[#635BFF] font-bold text-sm cursor-pointer hover:ring-2 hover:ring-[#635BFF]/30 transition-all"
                title="Business & Profile Settings"
              >
                {activeProfile.logoUrl ? (
                  <img
                    src={activeProfile.logoUrl}
                    alt={activeProfile.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
            </div>
          </header>

          {/* MAIN TAB SWITCHER */}
          <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* VIEW 1: MAIN DASHBOARD */}
            {activeTab === 'dashboard' && (
              <>
                {/* Greeting & AI Search/Create Bar: Section 10 */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] font-['Outfit'] tracking-tight">
                      {getGreeting()}
                    </h1>
                    <p className="text-[#71717A] text-sm sm:text-base font-normal">
                      What are you creating today?
                    </p>
                  </div>

                  {/* AI Search / Create Bar */}
                  <div className="bg-white rounded-2xl border border-[#E7E7EE] shadow-sm p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex items-center gap-3 px-3 flex-1 w-full">
                      <Sparkles className="w-5 h-5 text-[#635BFF] shrink-0" />
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleGenerateAI();
                        }}
                        placeholder="Create a Diwali offer poster for my clothing store..."
                        className="w-full bg-transparent border-none text-sm text-[#18181B] placeholder-slate-400 outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGenerateAI()}
                      disabled={aiGenerating}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5148E5] text-white font-bold text-sm shadow-md shadow-[#635BFF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {aiGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* SECTION 11: QUICK CREATE (Four Large Cards) */}
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-[#18181B] font-['Outfit']">Quick Create</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Poster */}
                    <div
                      onClick={() => handleQuickCreate('poster')}
                      className="bg-white rounded-2xl border border-[#E7E7EE] hover:border-[#635BFF]/40 p-5 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#635BFF] flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                          🎨
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#18181B] font-['Outfit'] group-hover:text-[#635BFF] transition-colors">
                            Poster
                          </h3>
                          <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                            Create promotional & festival posters
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs font-bold text-[#635BFF] gap-1 group-hover:gap-2 transition-all">
                        <span>Design Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card 2: Social Post */}
                    <div
                      onClick={() => handleQuickCreate('social')}
                      className="bg-white rounded-2xl border border-[#E7E7EE] hover:border-[#635BFF]/40 p-5 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                          📱
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#18181B] font-['Outfit'] group-hover:text-[#635BFF] transition-colors">
                            Social Post
                          </h3>
                          <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                            Square & portrait social media posts
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs font-bold text-[#635BFF] gap-1 group-hover:gap-2 transition-all">
                        <span>Create Post</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card 3: Reel */}
                    <div
                      onClick={() => handleQuickCreate('reel')}
                      className="bg-white rounded-2xl border border-[#E7E7EE] hover:border-[#635BFF]/40 p-5 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                          🎬
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#18181B] font-['Outfit'] group-hover:text-[#635BFF] transition-colors">
                            Reel
                          </h3>
                          <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                            Vertical video & Instagram story templates
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs font-bold text-[#635BFF] gap-1 group-hover:gap-2 transition-all">
                        <span>Make Reel</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Card 4: Invitation */}
                    <div
                      onClick={() => handleQuickCreate('invitation')}
                      className="bg-white rounded-2xl border border-[#E7E7EE] hover:border-[#635BFF]/40 p-5 shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl transition-transform group-hover:scale-110">
                          💌
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#18181B] font-['Outfit'] group-hover:text-[#635BFF] transition-colors">
                            Invitation
                          </h3>
                          <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                            Wedding, birthday & ceremonial invitations
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs font-bold text-[#635BFF] gap-1 group-hover:gap-2 transition-all">
                        <span>Craft Invite</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 12: POPULAR TEMPLATES (With Recently Used, Recommended For You, Trending Designs) */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-[#18181B] font-['Outfit']">Popular Templates</h2>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPopularTab('trending')}
                          className={`text-xs font-bold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            popularTab === 'trending'
                              ? 'bg-indigo-50 text-[#635BFF] border border-indigo-200'
                              : 'text-[#71717A] hover:text-[#18181B]'
                          }`}
                        >
                          Trending Designs
                        </button>
                        <button
                          type="button"
                          onClick={() => setPopularTab('recommended')}
                          className={`text-xs font-bold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            popularTab === 'recommended'
                              ? 'bg-indigo-50 text-[#635BFF] border border-indigo-200'
                              : 'text-[#71717A] hover:text-[#18181B]'
                          }`}
                        >
                          Recommended For You
                        </button>
                        <button
                          type="button"
                          onClick={() => setPopularTab('recent')}
                          className={`text-xs font-bold px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            popularTab === 'recent'
                              ? 'bg-indigo-50 text-[#635BFF] border border-indigo-200'
                              : 'text-[#71717A] hover:text-[#18181B]'
                          }`}
                        >
                          Recently Used
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('templates')}
                      className="text-xs font-bold text-[#635BFF] hover:text-[#5148E5] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Template Cards Grid: 6–8 cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {templates.slice(0, 8).map((tpl) => {
                      const previewImg =
                        tpl.thumbnailUrl ||
                        tpl.imageUrl ||
                        tpl.customBgUrl ||
                        (tpl as any).background?.url;

                      return (
                        <div
                          key={tpl.id}
                          onClick={() => onOpenStudio(tpl)}
                          className="bg-white rounded-2xl border border-[#E7E7EE] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col"
                        >
                          <div className="relative aspect-square bg-slate-100 overflow-hidden">
                            {previewImg ? (
                              <img
                                src={previewImg}
                                alt={tpl.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-[#635BFF] to-indigo-600 flex items-center justify-center text-white font-bold p-4 text-center">
                                {tpl.title}
                              </div>
                            )}

                            {/* Category badge */}
                            <div className="absolute top-2.5 left-2.5">
                              <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#18181B] shadow-xs">
                                {tpl.category}
                              </span>
                            </div>

                            {/* Hover Edit Action */}
                            <div className="absolute inset-0 bg-[#18181B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <span className="px-4 py-2 rounded-xl bg-white text-[#18181B] text-xs font-bold shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <Edit3 className="w-3.5 h-3.5 text-[#635BFF]" />
                                <span>Edit Design</span>
                              </span>
                            </div>
                          </div>

                          <div className="p-3">
                            <h4 className="text-xs font-bold text-[#18181B] truncate">{tpl.title}</h4>
                            <p className="text-[10px] text-[#71717A] truncate mt-0.5">
                              {tpl.titleNative || 'Ready to customize'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 13: MY DESIGNS (Your Recent Designs) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#18181B] font-['Outfit']">Your Recent Designs</h2>
                      <p className="text-xs text-[#71717A]">Pick up right where you left off</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('my-designs')}
                      className="text-xs font-bold text-[#635BFF] hover:text-[#5148E5] flex items-center gap-1 cursor-pointer"
                    >
                      <span>All Designs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myDesigns.map((design) => (
                      <div
                        key={design.id}
                        className="bg-white rounded-2xl border border-[#E7E7EE] p-3.5 flex items-center gap-4 hover:shadow-md transition-shadow relative"
                      >
                        <div
                          onClick={() => onOpenStudio(design)}
                          className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 cursor-pointer"
                        >
                          <img
                            src={design.thumbnailUrl || design.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}
                            alt={design.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => onOpenStudio(design)}
                            className="text-sm font-bold text-[#18181B] truncate cursor-pointer hover:text-[#635BFF]"
                          >
                            {design.title}
                          </h4>
                          <p className="text-xs text-[#71717A] mt-0.5">Edited {design.lastEdited}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => onOpenStudio(design)}
                              className="text-[11px] font-bold text-[#635BFF] hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={() => onOpenStudio(design)}
                              className="text-[11px] font-medium text-[#71717A] hover:text-[#18181B] cursor-pointer"
                            >
                              Download
                            </button>
                          </div>
                        </div>

                        {/* Three-Dot Menu */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuDesignId(activeMenuDesignId === design.id ? null : design.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuDesignId === design.id && (
                            <div className="absolute right-0 top-8 w-36 bg-white rounded-xl border border-[#E7E7EE] shadow-xl py-1 z-30">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuDesignId(null);
                                  onOpenStudio(design);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#18181B] hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#635BFF]" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuDesignId(null);
                                  const copy = { ...design, id: `copy-${Date.now()}`, title: `${design.title} (Copy)` };
                                  setMyDesigns([copy, ...myDesigns]);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#18181B] hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuDesignId(null);
                                  onOpenStudio(design);
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#18181B] hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Download</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuDesignId(null);
                                  setMyDesigns(myDesigns.filter((d) => d.id !== design.id));
                                }}
                                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* VIEW 2: AI DESIGN EXPERIENCE (Section 14) */}
            {activeTab === 'ai-design' && (
              <div className="space-y-8 max-w-4xl mx-auto py-4">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#635BFF] text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Next-Gen Creation</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-[#18181B] font-['Outfit']">
                    Create with AI ✨
                  </h1>
                  <p className="text-[#71717A] text-sm sm:text-base">
                    Describe any occasion, offer, or announcement and let GrowView create complete designs.
                  </p>
                </div>

                {/* Large Centered Prompt Box */}
                <div className="bg-white rounded-2xl border border-[#E7E7EE] shadow-lg p-4 sm:p-6 space-y-4">
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the design you want... (e.g. Festival poster for Diwali 50% discount on clothing with elegant gold frames)"
                    className="w-full bg-[#F8F8FC] border border-[#E7E7EE] focus:border-[#635BFF] rounded-xl p-3.5 text-sm text-[#18181B] placeholder-slate-400 outline-none resize-none focus:bg-white focus:ring-2 focus:ring-[#635BFF]/15"
                  />

                  {/* Quick Suggestions */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#71717A] block">Quick suggestions:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Festival Poster',
                        'Business Offer',
                        'Wedding Invitation',
                        'Restaurant Promotion',
                        'Instagram Post',
                        'Birthday Invitation',
                      ].map((sugg) => (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => {
                            setAiPrompt(sugg);
                            handleGenerateAI(sugg);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#F8F8FC] hover:bg-indigo-50 hover:text-[#635BFF] border border-[#E7E7EE] text-xs font-semibold text-[#18181B] transition-colors cursor-pointer"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleGenerateAI()}
                      disabled={aiGenerating}
                      className="px-8 py-3 rounded-xl bg-[#635BFF] hover:bg-[#5148E5] text-white font-bold text-sm shadow-lg shadow-[#635BFF]/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {aiGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Variations...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          <span>Generate Design</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Generated Result Cards */}
                {aiResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#18181B] font-['Outfit']">
                      Design Variations for "{aiPrompt || 'Prompt'}"
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {aiResults.map((result, idx) => (
                        <div
                          key={result.id || idx}
                          className="bg-white rounded-2xl border border-[#E7E7EE] overflow-hidden shadow-sm hover:shadow-xl transition-all p-3 flex flex-col justify-between"
                        >
                          <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3">
                            <img
                              src={result.thumbnailUrl || result.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80'}
                              alt={result.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-[#18181B] truncate">{result.title}</h4>
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => onOpenStudio(result)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#635BFF] text-white text-[11px] font-bold hover:bg-[#5148E5] transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleGenerateAI()}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-[#18181B] text-[11px] font-semibold hover:bg-slate-200 transition-colors"
                              >
                                Regenerate
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: BRAND KIT (Section 20) */}
            {activeTab === 'brand-kit' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] font-['Outfit']">
                      Your Brand Kit
                    </h1>
                    <p className="text-sm text-[#71717A]">
                      Configure your official business credentials to auto-brand all templates in 1 click.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyBrandToDesign}
                    className="px-5 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5148E5] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#635BFF]/25 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Brand to Design</span>
                  </button>
                </div>

                {brandKitSavedNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Brand Kit saved successfully! Auto-branding updated for all designs.</span>
                  </div>
                )}

                <form onSubmit={handleSaveBrandKit} className="space-y-6">
                  {/* Brand Logo & Colors Card */}
                  <div className="bg-white rounded-2xl border border-[#E7E7EE] p-6 shadow-xs space-y-6">
                    <h3 className="text-base font-bold text-[#18181B] font-['Outfit'] border-b border-[#E7E7EE] pb-3">
                      Brand Logo & Colors
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Logo Section */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#71717A] uppercase tracking-wider block">
                          Brand Logo
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#E7E7EE] bg-[#F8F8FC] flex items-center justify-center overflow-hidden">
                            {brandKit.logoUrl ? (
                              <img
                                src={brandKit.logoUrl}
                                alt="Logo"
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <Upload className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <input
                              type="text"
                              value={brandKit.logoUrl || ''}
                              onChange={(e) => setBrandKit({ ...brandKit, logoUrl: e.target.value })}
                              placeholder="Image URL or upload"
                              className="w-full bg-[#F8F8FC] border border-[#E7E7EE] rounded-xl px-3 py-1.5 text-xs text-[#18181B] outline-none"
                            />
                            <p className="text-[11px] text-[#71717A]">PNG or SVG with transparent background recommended</p>
                          </div>
                        </div>
                      </div>

                      {/* Brand Colors */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#71717A] uppercase tracking-wider block">
                          Brand Colors
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <span className="text-[11px] font-semibold text-[#71717A] block mb-1">Primary Color</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={brandKit.brandColor || '#635BFF'}
                                onChange={(e) => setBrandKit({ ...brandKit, brandColor: e.target.value })}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-[#E7E7EE]"
                              />
                              <span className="text-xs font-mono text-[#18181B]">{brandKit.brandColor || '#635BFF'}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-[#71717A] block mb-1">Secondary</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                defaultValue="#18181B"
                                className="w-8 h-8 rounded-lg cursor-pointer border border-[#E7E7EE]"
                              />
                              <span className="text-xs font-mono text-[#18181B]">#18181B</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-[#71717A] block mb-1">Accent</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                defaultValue="#F59E0B"
                                className="w-8 h-8 rounded-lg cursor-pointer border border-[#E7E7EE]"
                              />
                              <span className="text-xs font-mono text-[#18181B]">#F59E0B</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Information Card */}
                  <div className="bg-white rounded-2xl border border-[#E7E7EE] p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-[#18181B] font-['Outfit'] border-b border-[#E7E7EE] pb-3">
                      Business Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-[#71717A] block mb-1.5">Business Name</label>
                        <input
                          type="text"
                          value={brandKit.name || ''}
                          onChange={(e) => setBrandKit({ ...brandKit, name: e.target.value })}
                          placeholder="e.g. Omkar Jewellers"
                          className="w-full bg-[#F8F8FC] border border-[#E7E7EE] rounded-xl px-3.5 py-2 text-sm text-[#18181B] outline-none focus:border-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#71717A] block mb-1.5">Owner / Contact Person</label>
                        <input
                          type="text"
                          value={brandKit.ownerName || ''}
                          onChange={(e) => setBrandKit({ ...brandKit, ownerName: e.target.value })}
                          placeholder="e.g. Ramesh Patil"
                          className="w-full bg-[#F8F8FC] border border-[#E7E7EE] rounded-xl px-3.5 py-2 text-sm text-[#18181B] outline-none focus:border-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#71717A] block mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          value={brandKit.phone || ''}
                          onChange={(e) => setBrandKit({ ...brandKit, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-[#F8F8FC] border border-[#E7E7EE] rounded-xl px-3.5 py-2 text-sm text-[#18181B] outline-none focus:border-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#71717A] block mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={brandKit.email || ''}
                          onChange={(e) => setBrandKit({ ...brandKit, email: e.target.value })}
                          placeholder="contact@business.com"
                          className="w-full bg-[#F8F8FC] border border-[#E7E7EE] rounded-xl px-3.5 py-2 text-sm text-[#18181B] outline-none focus:border-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#71717A] block mb-1.5">Website</label>
                        <input
                          type="text"
                          value={brandKit.website || ''}
                          onChange={(e) => setBrandKit({ ...brandKit, website: e.target.value })}
                          placeholder="www.mybusiness.com"
                          className="w-full bg-[#F8F8FC] border border-[#E7E7EE] rounded-xl px-3.5 py-2 text-sm text-[#18181B] outline-none focus:border-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#71717A] block mb-1.5">Social Media Handle</label>
                        <input
                          type="text"
                          value={brandKit.socialHandle || ''}
                          onChange={(e) => setBrandKit({ ...brandKit, socialHandle: e.target.value })}
                          placeholder="@business_official"
                          className="w-full bg-[#F8F8FC] border border-[#E7E7EE] rounded-xl px-3.5 py-2 text-sm text-[#18181B] outline-none focus:border-[#635BFF]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-[#71717A] block mb-1.5">Address / Shop Location</label>
                        <input
                          type="text"
                          value={brandKit.address || ''}
                          onChange={(e) => setBrandKit({ ...brandKit, address: e.target.value })}
                          placeholder="Shop No. 12, Main Market, Pune, Maharashtra"
                          className="w-full bg-[#F8F8FC] border border-[#E7E7EE] rounded-xl px-3.5 py-2 text-sm text-[#18181B] outline-none focus:border-[#635BFF]"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5148E5] text-white font-bold text-sm shadow-md shadow-[#635BFF]/25 cursor-pointer"
                      >
                        Save Brand Kit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 4: TEMPLATES EXPLORER */}
            {(activeTab === 'templates' || activeTab === 'create') && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-[#18181B] font-['Outfit']">
                      All Templates ({filteredTemplates.length})
                    </h1>
                    <p className="text-xs text-[#71717A]">
                      Select any template to customize text, photos, background, and branding frames.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenStudio()}
                    className="px-4 py-2 rounded-xl bg-[#635BFF] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Blank Canvas</span>
                  </button>
                </div>

                {/* Categories Bar */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#635BFF] text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-[#71717A] border border-[#E7E7EE]'
                    }`}
                  >
                    All Categories
                  </button>
                  {deduplicateCategories(categories).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#635BFF] text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-[#71717A] border border-[#E7E7EE]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredTemplates.map((tpl) => {
                    const previewImg =
                      tpl.thumbnailUrl ||
                      tpl.imageUrl ||
                      tpl.customBgUrl ||
                      (tpl as any).background?.url;

                    return (
                      <div
                        key={tpl.id}
                        onClick={() => onOpenStudio(tpl)}
                        className="bg-white rounded-2xl border border-[#E7E7EE] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-200 hover:-translate-y-1 group cursor-pointer flex flex-col"
                      >
                        <div className="relative aspect-square bg-slate-100 overflow-hidden">
                          {previewImg ? (
                            <img
                              src={previewImg}
                              alt={tpl.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-[#635BFF] to-indigo-600 flex items-center justify-center text-white font-bold p-2 text-center text-xs">
                              {tpl.title}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-lg bg-white text-[#18181B] text-[11px] font-bold shadow-md">
                              Edit Design
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5">
                          <h4 className="text-xs font-bold text-[#18181B] truncate">{tpl.title}</h4>
                          <span className="text-[10px] text-[#71717A]">{tpl.category}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 5: MY DESIGNS TAB */}
            {activeTab === 'my-designs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#18181B] font-['Outfit']">My Designs</h1>
                    <p className="text-xs text-[#71717A]">All designs created and customized by you</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenStudio()}
                    className="px-4 py-2 rounded-xl bg-[#635BFF] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    + Create New
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myDesigns.map((design) => (
                    <div
                      key={design.id}
                      className="bg-white rounded-2xl border border-[#E7E7EE] p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          <img
                            src={design.thumbnailUrl || design.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}
                            alt={design.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#18181B] truncate">{design.title}</h3>
                          <span className="text-xs text-[#71717A]">Last edited {design.lastEdited}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#E7E7EE] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onOpenStudio(design)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-[#635BFF] text-xs font-bold hover:bg-indigo-100 transition-colors"
                        >
                          Open in Editor
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenStudio(design)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setMyDesigns(myDesigns.filter((d) => d.id !== design.id))}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 6: HELP & GUIDES */}
            {activeTab === 'help' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <h1 className="text-2xl font-black text-[#18181B] font-['Outfit']">Help & Resources</h1>
                  <p className="text-xs text-[#71717A]">Guides on creating posters, branding, and HD exports</p>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      q: 'How does 1-click branding work?',
                      a: 'Simply go to Brand Kit in the left sidebar, add your business name, logo, phone, and address. GrowView automatically applies them to all 27+ frames without manual positioning.',
                    },
                    {
                      q: 'How do I edit and select text or image elements on canvas?',
                      a: 'Click any element in the poster canvas to trigger the bounding box highlight and coordinates display. Use the drag handles to resize, and the right properties inspector to change fonts, colors, and alignments.',
                    },
                    {
                      q: 'Can I export in High Resolution (HD / 4K)?',
                      a: 'Yes! The top bar in the editor features a prominent Download button supporting lossless PNG, JPG, and PDF formats.',
                    },
                  ].map((faq, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#E7E7EE] p-5 shadow-xs">
                      <h3 className="text-sm font-bold text-[#18181B]">{faq.q}</h3>
                      <p className="text-xs text-[#71717A] mt-2 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

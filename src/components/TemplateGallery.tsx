import React, { useState, useEffect, useMemo } from 'react';
import { BusinessProfile, CategoryInfo, FrameId, PosterTemplate, FooterFrameConfig, UserAccount } from '../types';
import { BrandsLiveCalendarStrip } from './brands/BrandsLiveCalendarStrip';
import { getNext8DaysEvents, DayCalendarEvent, isFestivalInSeason, isTemplateForSelectedCalendarDate } from '../data/calendarFestivals';
import { BrandsLiveHeroBanner } from './brands/BrandsLiveHeroBanner';
import { BrandLiveControlBar } from './brands/BrandLiveControlBar';
import { BrandsLiveRailSection } from './brands/BrandsLiveRailSection';
import { BrandsLivePosterCard } from './brands/BrandsLivePosterCard';
import {
  loadUserDashboardConfig,
  UserDashboardConfig,
  DashboardSectionConfig,
} from '../data/userDashboardConfig';
import { getDashboardIcon } from './admin/AdminUserDashboardTab';
import { 
  Sparkles, 
  Flame, 
  Building2, 
  Sun, 
  Calendar, 
  TrendingUp, 
  Tag, 
  Crown, 
  Video, 
  Gem, 
  Users, 
  Layers, 
  RotateCcw,
  MessageCircle,
  HelpCircle,
  Sunrise,
  Moon,
  LayoutGrid,
  ArrowLeft,
  ArrowUpDown,
  Heart,
  FileText,
  Check,
  SlidersHorizontal
} from 'lucide-react';

interface TemplateGalleryProps {
  templates: PosterTemplate[];
  categories: CategoryInfo[];
  activeProfile: BusinessProfile;
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  activeGroup: string;
  selectedFrameId?: FrameId;
  onSelectFrameId?: (id: FrameId) => void;
  frameConfig?: Partial<FooterFrameConfig>;
  onSelectTemplate: (template: PosterTemplate) => void;
  onQuickDownload: (template: PosterTemplate) => void;
  onOpenAIModal: () => void;
  onOpenGaneshAIModal?: () => void;
  onOpenProfileModal: () => void;
  onOpenVideoStudio?: (poster?: PosterTemplate | null) => void;
  onOpenAutoVideo?: (poster: PosterTemplate) => void;
  onOpenAdminModal?: () => void;
  onOpenVIPModal?: () => void;
  onOpenAIFestivalModal?: () => void;
  currentUser?: UserAccount | null;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  categories,
  activeProfile,
  selectedCategory,
  onSelectCategory,
  activeGroup,
  selectedFrameId: selectedFrameIdProp,
  onSelectFrameId,
  frameConfig,
  onSelectTemplate,
  onQuickDownload,
  onOpenAIModal,
  onOpenGaneshAIModal,
  onOpenProfileModal,
  onOpenVideoStudio,
  onOpenAutoVideo,
  onOpenAdminModal,
  onOpenVIPModal,
  onOpenAIFestivalModal,
  currentUser,
}) => {
  // Live Frame Style Override (Omnipresent Feed Live-Reframe)
  const [localSelectedFrameId, setLocalSelectedFrameId] = useState<FrameId>('footer-01');
  const selectedFrameId = selectedFrameIdProp || localSelectedFrameId;
  const setSelectedFrameId = (id: FrameId) => {
    setLocalSelectedFrameId(id);
    if (onSelectFrameId) onSelectFrameId(id);
  };
  
  // Format filter
  const [selectedFormat, setSelectedFormat] = useState<'all' | '1:1' | '9:16' | 'video' | 'business' | 'daily'>('all');

  // Category and Feed Sorting Order: 'upcoming' (default), 'newest', 'popular', 'alpha'
  const [sortOrder, setSortOrder] = useState<'upcoming' | 'newest' | 'popular' | 'alpha'>('upcoming');

  // Curated Marathi Category Chips - Upcoming Festivals ALWAYS Top & First
  const TOP_CATEGORY_CHIPS = [
    { id: 'upcoming', label: '🚩 येणारे सण व उत्सव (Upcoming)', isUpcoming: true },
    { id: 'all', label: '🌟 सर्व पोस्टर्स (All)' },
    { id: 'wedding-invitation', label: '💍 लग्नपत्रिका (Marriage Card)' },
    { id: 'engagement-ceremony', label: '💍 साखरपुडा (Sakharpuda)' },
    { id: 'biodata-resume', label: '📄 बायोडाटा / Resume (CV)' },
    { id: 'ganesh-chaturthi', label: '🪔 गणेश चतुर्थी' },
    { id: 'shivaji-jayanti', label: '🚩 शिवजयंती' },
    { id: 'business-promo', label: '🏢 बिझनेस व ऑफर्स' },
    { id: 'good-morning-quotes', label: '🌅 शुभ सकाळ' },
    { id: 'good-night-quotes', label: '🌙 शुभ रात्र' },
    { id: 'birthday-wishes', label: '🎂 वाढदिवस सदिच्छा' },
  ];

  // 8-Day Live Upcoming Festival Calendar State (Auto-updates dynamically)
  const [calendarReferenceDate, setCalendarReferenceDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('growview_calendar_ref_date');
      if (saved) return saved;
    } catch (e) {}
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const handleUpdateCalendarRefDate = (newDateStr: string) => {
    setCalendarReferenceDate(newDateStr);
    try {
      localStorage.setItem('growview_calendar_ref_date', newDateStr);
    } catch (e) {}
  };

  const calendarDays = useMemo(() => {
    const parts = calendarReferenceDate.split('-');
    const refDate = parts.length === 3 
      ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)) 
      : new Date();
    return getNext8DaysEvents(refDate);
  }, [calendarReferenceDate]);

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [calendarFestivalFilter, setCalendarFestivalFilter] = useState<string | null>(null);

  // Feed View Mode: 'rails' (horizontal carousels) or 'grid' (2-column responsive mobile grid)
  const [feedViewMode, setFeedViewMode] = useState<'rails' | 'grid'>('rails');

  // Business Category Sub-Filter Chip
  const [businessSubCategory, setBusinessSubCategory] = useState<string>('all');
  
  // Video Category Sub-Filter Chip for Video Dashboard
  const [videoCategoryFilter, setVideoCategoryFilter] = useState<'all' | 'ganesh' | 'daily' | 'business'>('all');

  // Ganesh Chaturthi Sub-Filter Chip (5 Style Groups)
  const [ganeshSubCategory, setGaneshSubCategory] = useState<string>('all');

  // Ganesh Sub-Category Filter Chips matching the 5 distinct style groups
  const GANESH_FILTER_CHIPS = [
    { id: 'all', label: 'सर्व ५० डिझाईन्स' },
    { id: 'royal-premium', label: '👑 Royal & Premium (१०)' },
    { id: 'modern-trending', label: '⚡ Modern & Trending (१०)' },
    { id: 'traditional-devotional', label: '🪔 Traditional & Devotional (१०)' },
    { id: 'ganesh-mandal-event', label: '🚩 Ganesh Mandal & Event (१०)' },
    { id: 'business-personal-greeting', label: '💼 Business & Greetings (१०)' },
  ];

  // Dynamic Master Admin Dashboard Configuration
  const [dashboardConfig, setDashboardConfig] = useState<UserDashboardConfig>(() => loadUserDashboardConfig());

  useEffect(() => {
    const handleConfigChange = (e: any) => {
      if (e?.detail) {
        setDashboardConfig(e.detail);
      } else {
        setDashboardConfig(loadUserDashboardConfig());
      }
    };
    window.addEventListener('growview:dashboard_config_updated', handleConfigChange);
    return () => window.removeEventListener('growview:dashboard_config_updated', handleConfigChange);
  }, []);

  // 1-Click WhatsApp Share Handler
  const handleShareWhatsApp = (tpl: PosterTemplate) => {
    const text = encodeURIComponent(
      `*${tpl.headline || tpl.titleNative || tpl.title}*\n\n${tpl.subtext || ''}\n\n✨ *${activeProfile.name}*\n📞 ${activeProfile.phone}\n📍 ${activeProfile.address}\n\nCreated with GrowView - Poster Maker app`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const activeCategoryInfo = useMemo(() => {
    if (selectedCategory === 'all') return { nameMarathi: 'सर्व पोस्टर्स (All Feeds)' };
    if (selectedCategory === 'upcoming') return { nameMarathi: '🚩 येणारे सण व उत्सव विशेष (Upcoming Festivals)' };
    if (selectedCategory === 'wedding-invitation') return { nameMarathi: '💍 लग्नपत्रिका व विवाह निमंत्रण (Wedding Cards)' };
    if (selectedCategory === 'engagement-ceremony') return { nameMarathi: '💍 साखरपुडा व वाङ्निश्चय सोहळा (Sakharpuda)' };
    if (selectedCategory === 'biodata-resume') return { nameMarathi: '📄 विवाह परिचय बायोडाटा व जॉब सीव्ही (Resume)' };
    return categories.find((c) => c.id === selectedCategory) || { nameMarathi: selectedCategory };
  }, [categories, selectedCategory]);

  const sortComparator = useMemo(() => {
    return (a: PosterTemplate, b: PosterTemplate) => {
      if (sortOrder === 'upcoming') {
        const aScore = a.isToday ? 3 : (a.isTrending ? 2 : (a.dateBadge?.includes('Feb') || a.dateBadge?.includes('Mar') ? 1.5 : 0));
        const bScore = b.isToday ? 3 : (b.isTrending ? 2 : (b.dateBadge?.includes('Feb') || b.dateBadge?.includes('Mar') ? 1.5 : 0));
        if (aScore !== bScore) return bScore - aScore;

        const aCustom = Boolean(a.isCustomUpload || a.isNew || a.isJustUploaded);
        const bCustom = Boolean(b.isCustomUpload || b.isNew || b.isJustUploaded);
        if (aCustom !== bCustom) return aCustom ? -1 : 1;

        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
        return bTime - aTime;
      }

      if (sortOrder === 'newest') {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
        if (aTime !== bTime) return bTime - aTime;
        const aCustom = Boolean(a.isCustomUpload || a.isNew || a.isJustUploaded);
        const bCustom = Boolean(b.isCustomUpload || b.isNew || b.isJustUploaded);
        if (aCustom !== bCustom) return aCustom ? -1 : 1;
        return 0;
      }

      if (sortOrder === 'popular') {
        const aScore = (a.isTrending ? 2 : 0) + (a.isVIP ? 1 : 0);
        const bScore = (b.isTrending ? 2 : 0) + (b.isVIP ? 1 : 0);
        if (aScore !== bScore) return bScore - aScore;
        return 0;
      }

      if (sortOrder === 'alpha') {
        const titleA = a.titleNative || a.title;
        const titleB = b.titleNative || b.title;
        return titleA.localeCompare(titleB);
      }

      return 0;
    };
  }, [sortOrder]);

  // Filter templates based on Format Tab and active Sub-Categories
  const formatFilteredTemplates = React.useMemo(() => {
    return templates.filter((tpl) => {
      if (selectedFormat === '1:1') return tpl.aspectRatio === '1:1' && !tpl.isVideo;
      if (selectedFormat === '9:16') return tpl.aspectRatio === '9:16';
      if (selectedFormat === 'video') return tpl.isVideo || tpl.category === 'video-posts';
      if (selectedFormat === 'business') return tpl.subCategory === 'business';
      if (selectedFormat === 'daily') return tpl.subCategory === 'daily';
      return true;
    }).sort(sortComparator);
  }, [templates, selectedFormat, sortComparator]);

  const activeDisplayTemplates = React.useMemo(() => {
    return formatFilteredTemplates.filter((tpl) => {
      if (selectedFormat === 'video' && videoCategoryFilter !== 'all') {
        if (videoCategoryFilter === 'ganesh') {
          return tpl.category === 'ganesh-chaturthi' || tpl.category === 'hartalika' || (tpl.tags && tpl.tags.includes('ganesh'));
        }
        if (videoCategoryFilter === 'daily') {
          return tpl.category === 'good-morning-quotes' || tpl.category === 'suvichar-morning' || tpl.subCategory === 'daily';
        }
        if (videoCategoryFilter === 'business') {
          return tpl.category === 'business' || tpl.subCategory === 'business' || tpl.category === 'business-promo';
        }
      }
      if (selectedCategory === 'ganesh-chaturthi' && ganeshSubCategory !== 'all') {
        return tpl.subCategory === ganeshSubCategory;
      }
      return true;
    }).sort(sortComparator);
  }, [formatFilteredTemplates, selectedFormat, videoCategoryFilter, selectedCategory, ganeshSubCategory, sortComparator]);

  // Selected Day Calendar Event and Filtered Posters
  const selectedDayEvent = selectedCalendarDate
    ? calendarDays.find((d) => d.dateStr === selectedCalendarDate)
    : null;

  const calendarDateTemplates = React.useMemo(() => {
    if (!selectedCalendarDate) return [];

    const filtered = formatFilteredTemplates.filter((t) => {
      // Sub-festival chip filter (e.g. user clicked a specific sub festival name)
      if (calendarFestivalFilter) {
        if (calendarFestivalFilter === 'hartalika') {
          return (
            t.category === 'hartalika' ||
            (Array.isArray(t.festivalNames) && t.festivalNames.some((n) => n.includes('हरतालिका'))) ||
            (t.tags && t.tags.includes('hartalika'))
          );
        }
        if (calendarFestivalFilter === 'ganesh-chaturthi') {
          return (
            t.category === 'ganesh-chaturthi' ||
            (Array.isArray(t.festivalNames) && t.festivalNames.some((n) => n.includes('गणेश'))) ||
            (t.tags && t.tags.includes('ganesh'))
          );
        }
        if (
          t.category === calendarFestivalFilter ||
          (Array.isArray(t.festivalNames) && t.festivalNames.includes(calendarFestivalFilter))
        ) {
          return true;
        }
      }

      // STRICT calendar date matching using verified isTemplateForSelectedCalendarDate!
      // This strictly prevents 14 April Ambedkar Jayanti, Holi, Ganesh Chaturthi, Hartalika from showing on October 4
      return isTemplateForSelectedCalendarDate(t, selectedCalendarDate, selectedDayEvent || undefined);
    });

    return filtered;
  }, [selectedCalendarDate, calendarFestivalFilter, selectedDayEvent, formatFilteredTemplates]);

  // Categorized Section Slices for Rails - STRICTLY IN-SEASON ONLY (Visible 30 days before start, up to 2 days after end)
  const upcomingFestivalsTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (!isFestivalInSeason(t)) {
        return false;
      }
      return (
        t.subCategory === 'festivals' ||
        t.category === 'navratri' ||
        t.category === 'dussehra' ||
        t.category === 'diwali' ||
        t.category === 'shivaji-jayanti' ||
        t.category === 'shivratri' ||
        t.category === 'holi' ||
        t.category === 'gudi-padwa' ||
        t.category === 'ganesh-chaturthi' ||
        t.category === 'hartalika'
      );
    });
  }, [templates]);

  const videoStatusTemplates = templates.filter(
    (t) => t.isVideo || t.category === 'video-posts' || t.aspectRatio === '9:16'
  );

  const goodMorningTemplates = templates.filter(
    (t) => t.category === 'good-morning-quotes' || t.category === 'suvichar-morning'
  );

  const ganeshChaturthiTemplates = templates.filter(
    (t) => t.category === 'ganesh-chaturthi'
  );

  const goodNightTemplates = templates.filter(
    (t) => t.category === 'good-night-quotes'
  );

  const dailySuvicharTemplates = templates.filter(
    (t) => t.category === 'quotes-motivation' || t.subCategory === 'daily'
  );

  const businessTemplates = templates.filter((t) => {
    if (t.subCategory !== 'business') return false;
    if (businessSubCategory === 'all') return true;
    return t.category === businessSubCategory;
  });

  const politicalAndGreetingsTemplates = templates.filter(
    (t) => t.category === 'political-greetings' || t.category === 'birthday-wishes'
  );

  const weddingInvitationTemplates = templates.filter(
    (t) => t.category === 'wedding-invitation' || t.tags?.includes('wedding')
  );

  const engagementTemplates = templates.filter(
    (t) => t.category === 'engagement-ceremony' || t.tags?.includes('engagement') || t.tags?.includes('sakharpuda')
  );

  const biodataResumeTemplates = templates.filter(
    (t) => t.category === 'biodata-resume' || t.tags?.includes('resume') || t.tags?.includes('biodata')
  );

  const offersTemplates = templates.filter(
    (t) => t.category === 'business-promo' || t.dateBadge?.toLowerCase().includes('offer') || t.dateBadge?.toLowerCase().includes('sale')
  );

  // Industry Filter Chips for Business Rail
  const BUSINESS_FILTER_CHIPS = [
    { id: 'all', label: 'All Industries' },
    { id: 'jewelry', label: '💎 Jewellery Mart' },
    { id: 'real-estate', label: '🏢 Real Estate' },
    { id: 'business-promo', label: '🏷️ Mega Offers' },
    { id: 'healthcare', label: '🩺 Doctors & Clinic' },
    { id: 'restaurant', label: '🍽️ Restaurant & Cafe' },
    { id: 'education', label: '🎓 Classes & School' },
    { id: 'salon-beauty', label: '💇 Salon & Beauty' },
    { id: 'kisan-agro', label: '🌾 Krushi Seva' },
  ];

  const isBrowsingAllRails = selectedCategory === 'all' && activeGroup === 'all' && selectedFormat === 'all' && !selectedCalendarDate;

  // Helper to dynamically resolve template collections for each configurable section rail
  const getSectionTemplates = (sec: DashboardSectionConfig): PosterTemplate[] => {
    switch (sec.id) {
      case 'upcoming-festivals':
        return upcomingFestivalsTemplates;
      case 'navratri-festival-library':
        return templates.filter((t) => t.category === 'navratri' || t.tags?.includes('navratri'));
      case 'ganesh-chaturthi-library':
        // Only return if Ganesh Chaturthi is in season!
        return isFestivalInSeason({ category: 'ganesh-chaturthi', id: 'ganesh-1' } as any)
          ? ganeshChaturthiTemplates
          : templates.filter((t) => isFestivalInSeason(t) && (t.category === 'navratri' || t.category === 'diwali'));
      case 'video-status':
        return videoStatusTemplates;
      case 'good-morning-library':
        return goodMorningTemplates;
      case 'good-night-library':
        return goodNightTemplates;
      case 'business-marketing':
        return businessTemplates;
      case 'grand-offers':
        return offersTemplates;
      case 'wedding-invitations-rail':
        return weddingInvitationTemplates;
      case 'sakharpuda-rail':
        return engagementTemplates;
      case 'biodata-resume-rail':
        return biodataResumeTemplates;
      case 'political-greetings':
        return politicalAndGreetingsTemplates;
      default: {
        const cat = sec.categoryFilter;
        if (cat === 'all') return formatFilteredTemplates;
        if (cat === 'festivals') return upcomingFestivalsTemplates;
        if (cat === 'ganesh-chaturthi') return ganeshChaturthiTemplates;
        if (cat === 'video-posts') return videoStatusTemplates;
        if (cat === 'good-morning-quotes') return goodMorningTemplates;
        if (cat === 'good-night-quotes') return goodNightTemplates;
        if (cat === 'business') return businessTemplates;
        if (cat === 'business-promo') return offersTemplates;
        if (cat === 'birthday-wishes') return politicalAndGreetingsTemplates;

        const matched = templates.filter(
          (t) => t.category === cat || (Array.isArray(t.tags) && t.tags.includes(cat))
        );
        return matched.length > 0 ? matched : templates.slice(0, 10);
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* 0. 🌟 8-Day Live Dynamic Festival Calendar Strip */}
      {(dashboardConfig.showCalendarStrip ?? true) && (
        <BrandsLiveCalendarStrip
          days={calendarDays}
          selectedDate={selectedCalendarDate}
          onSelectDate={(d, evt) => {
            setSelectedCalendarDate(d);
            setCalendarFestivalFilter(null);
          }}
          templates={templates}
          activeFestivalFilter={calendarFestivalFilter}
          onSelectFestivalFilter={(fest) => setCalendarFestivalFilter(fest)}
          currentRefDate={calendarReferenceDate}
          onChangeRefDate={handleUpdateCalendarRefDate}
          onOpenAIFestivalModal={onOpenAIFestivalModal}
        />
      )}

      {/* 2. GrowView Hero Banner Carousel with Countdown */}
      {isBrowsingAllRails && dashboardConfig.showHeroBanner && (
        <BrandsLiveHeroBanner
          activeProfile={activeProfile}
          onSelectCategory={onSelectCategory}
          onOpenProfileModal={onOpenProfileModal}
          onOpenAIModal={onOpenAIModal}
          onOpenVIPModal={onOpenVIPModal || (() => {})}
          templates={templates}
          onSelectTemplate={onSelectTemplate}
          onOpenAdminModal={onOpenAdminModal}
          isAdmin={currentUser?.role === 'admin' || !!currentUser?.adminRole}
        />
      )}

      {/* 3. Omnipresent Brand Live Frame & Format Switcher Ribbon */}
      {dashboardConfig.showControlBar && (
        <BrandLiveControlBar
          activeProfile={activeProfile}
          selectedFrameId={selectedFrameId}
          onSelectFrameId={setSelectedFrameId}
          selectedFormat={selectedFormat}
          onSelectFormat={setSelectedFormat}
          onOpenProfileModal={onOpenProfileModal}
          totalTemplatesCount={formatFilteredTemplates.length}
          onSelectCategory={onSelectCategory}
        />
      )}

      {/* 3.4 Interactive Category Navigation & Sort Ribbon (Upcoming Festivals Pinned Top/First) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
              <span>कॅटेगरीज:</span>
            </span>

            {/* If a category is selected, show immediate back button */}
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  setSelectedFormat('all');
                }}
                className="px-2.5 py-1 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                title="सर्व पोस्टर्सवर परत जा (Back to All)"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← सर्व पोस्टर्सवर जा</span>
              </button>
            )}

            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {isBrowsingAllRails ? formatFilteredTemplates.length : activeDisplayTemplates.length} पोस्टर्स
            </span>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-[11px] font-bold text-slate-600 hidden sm:inline">सॉर्ट:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-transparent text-xs font-black text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="upcoming">🚩 येणारे सण आधी (Upcoming First)</option>
                <option value="newest">⚡ नवीनतम (Newest First)</option>
                <option value="popular">🔥 सर्वाधिक लोकप्रिय (Popular)</option>
                <option value="alpha">🔤 नाव / A to Z</option>
              </select>
            </div>

            {/* Layout switch buttons for All Feeds */}
            {isBrowsingAllRails && (
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setFeedViewMode('rails')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    feedViewMode === 'rails'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="कॅरोसेल व्ह्यू"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">कॅरोसेल</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedViewMode('grid')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    feedViewMode === 'grid'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="२-कॉलम ग्रिड व्ह्यू"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>२-कॉलम</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Category Chips - Upcoming Festivals ALWAYS FIRST & HIGHLIGHTED */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar mobile-smooth-scroll">
          {TOP_CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip.id || (chip.id === 'all' && isBrowsingAllRails);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  onSelectCategory(chip.id);
                  if (chip.id === 'all') {
                    setSelectedFormat('all');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? chip.isUpcoming
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md shadow-orange-600/30 ring-2 ring-amber-300 font-black'
                      : 'bg-slate-900 text-white shadow-xs font-black'
                    : chip.isUpcoming
                    ? 'bg-gradient-to-r from-amber-50 to-orange-100 text-orange-950 border border-orange-300 hover:border-orange-400 font-extrabold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                }`}
              >
                <span>{chip.label}</span>
                {chip.isUpcoming && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                    TOP
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Categorized Multi-Rail Feeds or Filtered View */}
      {isBrowsingAllRails ? (
        feedViewMode === 'rails' ? (
          /* GrowView Iconic Multi-Rail Layout - Dynamically managed by Master Admin */
          <div className="space-y-8 sm:space-y-10">
            {(dashboardConfig.sections || [])
              .filter((sec) => sec.enabled)
              .map((sec) => {
                const secTemplates = getSectionTemplates(sec);
                if (!secTemplates || secTemplates.length === 0) return null;

                const IconComponent = getDashboardIcon(sec.iconName);
                const isGanesh = sec.id === 'ganesh-chaturthi-library';
                const isBusiness = sec.id === 'business-marketing';

                return (
                  <BrandsLiveRailSection
                    key={sec.id}
                    id={sec.id}
                    title={sec.title}
                    titleMarathi={sec.titleMarathi}
                    badge={sec.badge}
                    icon={IconComponent}
                    templates={secTemplates}
                    activeProfile={activeProfile}
                    selectedFrameId={selectedFrameId}
                    frameConfig={frameConfig}
                    viewAllCategory={sec.viewAllCategory || sec.categoryFilter}
                    onViewAll={() => onSelectCategory(sec.viewAllCategory || sec.categoryFilter)}
                    onSelectTemplate={onSelectTemplate}
                    onQuickDownload={onQuickDownload}
                    onShareWhatsApp={handleShareWhatsApp}
                    onOpenVideo={onOpenAutoVideo}
                    onOpenVIPModal={onOpenVIPModal}
                    filterChips={isGanesh ? GANESH_FILTER_CHIPS : isBusiness ? BUSINESS_FILTER_CHIPS : undefined}
                    activeFilterChip={isGanesh ? ganeshSubCategory : isBusiness ? businessSubCategory : undefined}
                    onSelectFilterChip={isGanesh ? setGaneshSubCategory : isBusiness ? setBusinessSubCategory : undefined}
                  />
                );
              })}
          </div>
        ) : (
          /* Fast 2-Column Responsive Grid View for all templates */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {formatFilteredTemplates.map((tpl) => (
              <BrandsLivePosterCard
                key={tpl.id}
                template={tpl}
                activeProfile={activeProfile}
                overrideFrameId={selectedFrameId}
                frameConfig={frameConfig}
                onSelectTemplate={onSelectTemplate}
                onQuickDownload={onQuickDownload}
                onShareWhatsApp={handleShareWhatsApp}
                onOpenVideo={onOpenAutoVideo}
                onOpenVIPModal={onOpenVIPModal}
              />
            ))}
          </div>
        )
      ) : (
        /* Filtered Grid View (or Calendar Date View) */
        <div className="space-y-4">
          {/* 🌟 1. 8-Day Live Calendar Selected Date Banner & Controls */}
          {selectedCalendarDate ? (
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg space-y-4 border border-amber-400/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-amber-200 text-xs font-black uppercase tracking-wider backdrop-blur-xs border border-white/10">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedDayEvent?.dayNumber} {selectedDayEvent?.monthNameMarathi} २०२६</span>
                    <span>•</span>
                    <span>{selectedDayEvent?.dayNameMarathi}</span>
                    {selectedDayEvent?.isToday && (
                      <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded font-black">
                        आज
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                    {selectedDayEvent?.festivals.map((f) => f.nameMarathi).join(' व ')} — विशेष डिझाईन्स
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-100/95 leading-relaxed font-medium">
                    {selectedDayEvent?.monthNumber === 9 && selectedDayEvent?.dayNumber === 14
                      ? '१४ सप्टेंबर रोजी श्री गणेश चतुर्थी व हरतालिका या सणांसाठी खास शुभेच्छा व ब्रँडिंग पोस्टर्स'
                      : selectedDayEvent?.festivals && selectedDayEvent.festivals.length > 0
                        ? `${selectedDayEvent.festivals.map((f) => f.nameMarathi).join(', ')} निमित्त खास शुभेच्छा व ब्रँडिंग पोस्टर्स`
                        : `${selectedDayEvent?.dayNumber} ${selectedDayEvent?.monthNameMarathi} रोजचे विशेष पोस्टर्स`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCalendarDate(null);
                      setCalendarFestivalFilter(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all border border-white/30 shadow-xs cursor-pointer active:scale-95"
                    title="सर्व पोस्टर्सवर परत जा"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3]" />
                    <span>← मागे जा (सर्व पोस्टर्स)</span>
                  </button>
                </div>
              </div>

              {/* Sub-festival filter chips for this specific day */}
              {selectedDayEvent && selectedDayEvent.festivals.length > 0 && (
                <div className="pt-2 border-t border-white/20 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setCalendarFestivalFilter(null)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                      calendarFestivalFilter === null
                        ? 'bg-white text-slate-900 shadow-md ring-2 ring-amber-300 font-black'
                        : 'bg-black/20 text-white/90 hover:bg-black/40 border border-white/20'
                    }`}
                  >
                    सर्व एकत्र ({calendarDateTemplates.length})
                  </button>
                  {selectedDayEvent.festivals.map((fest) => {
                    const count = templates.filter((t) =>
                      (fest.category === 'ganesh-chaturthi' && (t.category === 'ganesh-chaturthi' || t.tags?.includes('ganesh'))) ||
                      (fest.category === 'hartalika' && (t.category === 'hartalika' || t.tags?.includes('hartalika'))) ||
                      t.category === fest.category ||
                      (Array.isArray(t.festivalNames) && t.festivalNames.some((fn) => fn.includes(fest.nameMarathi)))
                    ).length;

                    const isFestActive = calendarFestivalFilter === fest.category;

                    return (
                      <button
                        key={fest.id}
                        type="button"
                        onClick={() => setCalendarFestivalFilter(fest.category)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                          isFestActive
                            ? 'bg-white text-orange-800 shadow-md ring-2 ring-amber-300 font-black'
                            : 'bg-black/20 text-white/90 hover:bg-black/40 border border-white/20'
                        }`}
                      >
                        <span>{fest.nameMarathi}</span>
                        <span className="text-[11px] opacity-80 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : selectedFormat === 'video' ? (
            <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-950 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-amber-500/30 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>व्हिडिओ रील्स व स्टेटस डॅशबोर्ड</span>
                    <span>•</span>
                    <span className="text-white">२० ॲनिमेशन प्रिसेट्स Active</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                    🎬 व्हिडिओ स्टेटस व इन्स्टाग्राम रील्स डॅशबोर्ड
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    आपल्या व्यवसायासाठी व सणांसाठी थेट <strong className="text-amber-400">Full HD MP4</strong> व्हिडिओ स्टेटस डाऊनलोड करा. ढोल-ताशा संगीत, सनई मंगल सूर आणि २० आकर्षक ॲनिमेशन्स उपलब्ध.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
                  {onOpenVideoStudio && (
                    <button
                      type="button"
                      onClick={() => onOpenVideoStudio(null)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all active:scale-95"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>🎬 व्हिडिओ स्टुडिओ उघडा</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFormat('all');
                      setVideoCategoryFilter('all');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all border border-slate-600 shadow-xs cursor-pointer active:scale-95"
                    title="सर्व पोस्टर्सवर परत जा"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3]" />
                    <span>← मागे जा (सर्व पोस्टर्स)</span>
                  </button>
                </div>
              </div>

              {/* Video sub-categories pills */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'सर्व व्हिडिओ स्टेटस', count: formatFilteredTemplates.length },
                  { id: 'ganesh', label: 'गणेशोत्सव व हरतालिका व्हिडिओ', count: formatFilteredTemplates.filter((t) => t.category === 'ganesh-chaturthi' || t.category === 'hartalika' || (t.tags && t.tags.includes('ganesh'))).length },
                  { id: 'daily', label: 'दैनिक सुविचार व सकाळ', count: formatFilteredTemplates.filter((t) => t.category === 'good-morning-quotes' || t.category === 'suvichar-morning' || t.subCategory === 'daily').length },
                  { id: 'business', label: 'बिझनेस प्रोमो व्हिडिओ', count: formatFilteredTemplates.filter((t) => t.category === 'business' || t.subCategory === 'business' || t.category === 'business-promo').length },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setVideoCategoryFilter(pill.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                      videoCategoryFilter === pill.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({pill.count})</span>
                  </button>
                ))}
              </div>
            </div>
          ) : selectedCategory === 'ganesh-chaturthi' ? (
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-amber-400/30 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-200 text-xs font-bold border border-amber-300/30">
                    <span>🪔 गणेश चतुर्थी Special</span>
                    <span>•</span>
                    <span className="text-white">५० प्रीमियम डिझाईन्स</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
                    गणेश चतुर्थी Special – Premium Templates
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                    गणेशोत्सव, गणेश चतुर्थी, गणपती आगमन, स्थापना, आरती आणि शुभेच्छांसाठी आकर्षक Professional Poster Designs
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
                  {onOpenGaneshAIModal && (
                    <button
                      type="button"
                      onClick={onOpenGaneshAIModal}
                      className="px-4 py-2.5 rounded-xl bg-white text-orange-700 hover:bg-amber-50 font-black text-xs flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>✨ AI ने नवीन गणेश पोस्टर बनवा</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory('all');
                      setSelectedFormat('all');
                      setGaneshSubCategory('all');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all border border-white/30 shadow-xs cursor-pointer active:scale-95"
                    title="सर्व पोस्टर्सवर परत जा"
                  >
                    <ArrowLeft className="w-4 h-4 stroke-[3]" />
                    <span>← मागे जा (सर्व पोस्टर्स)</span>
                  </button>
                </div>
              </div>

              {/* Sub-Category Filter Bar for 5 Ganesh Style Groups */}
              <div className="pt-2 border-t border-white/20 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {GANESH_FILTER_CHIPS.map((chip) => {
                  const isChipActive = ganeshSubCategory === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => setGaneshSubCategory(chip.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                        isChipActive
                          ? 'bg-white text-orange-800 shadow-md ring-2 ring-amber-300'
                          : 'bg-black/20 text-white/90 hover:bg-black/40 border border-white/20'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 🌟 Prominent Marathi Back Banner with Active Category Info */
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('all');
                    setSelectedFormat('all');
                    setGaneshSubCategory('all');
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all border border-amber-300 shrink-0"
                  title="सर्व पोस्टर्सवर परत जा (Back to All Posters)"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[3]" />
                  <span>← मागे जा (सर्व पोस्टर्स)</span>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h2 className="text-base sm:text-lg font-black text-white">
                      {activeCategoryInfo.nameMarathi || (activeCategoryInfo as any).name || selectedCategory}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 font-medium">
                    एकूण {activeDisplayTemplates.length} पोस्टर्स उपलब्ध • १-क्लिक डाउनलोड व एडिट
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('all');
                    setSelectedFormat('all');
                    setGaneshSubCategory('all');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-amber-200 hover:text-white font-bold flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>सर्व पोस्टर्स पहा (Reset)</span>
                </button>
              </div>
            </div>
          )}

          {/* Templates Grid */}
          {(() => {
            const displayList = selectedCalendarDate ? calendarDateTemplates : activeDisplayTemplates;
            if (displayList.length === 0) {
              const evergreenFallbacks = formatFilteredTemplates.filter(
                (t) =>
                  t.subCategory === 'daily' ||
                  t.category === 'quotes-motivation' ||
                  t.category === 'good-morning-quotes' ||
                  t.category === 'business-promo'
              ).slice(0, 8);

              return (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {selectedCalendarDate ? 'या तारखेसाठी अद्याप विशिष्ट सण पोस्टर्स उपलब्ध नाहीत' : 'कोणतेही पोस्टर्स सापडले नाहीत'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {selectedCalendarDate 
                        ? 'या तारखेचे सण पोस्टर्स लवकरच ॲड केले जातील. खाली दिलेले दैनंदिन व व्यावसायिक पोस्टर्स आपण वापरू शकता.' 
                        : 'कृपया वेगळी कॅटेगरी निवडा किंवा फिल्टर रिसेट करा.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCalendarDate(null);
                        setCalendarFestivalFilter(null);
                        onSelectCategory('all');
                        setSelectedFormat('all');
                        setGaneshSubCategory('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>सर्व पोस्टर्स पहा (Show All)</span>
                    </button>
                  </div>

                  {evergreenFallbacks.length > 0 && selectedCalendarDate && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>✨ या दिवसासाठी उपयुक्त दैनंदिन व व्यावसायिक पोस्टर्स (कोणतेही चुकीचे सण नाहीत):</span>
                        </h5>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                        {evergreenFallbacks.map((tpl) => (
                          <BrandsLivePosterCard
                            key={tpl.id}
                            template={tpl}
                            activeProfile={activeProfile}
                            overrideFrameId={selectedFrameId}
                            frameConfig={frameConfig}
                            onSelectTemplate={onSelectTemplate}
                            onQuickDownload={onQuickDownload}
                            onShareWhatsApp={handleShareWhatsApp}
                            onOpenVideo={onOpenAutoVideo}
                            onOpenVIPModal={onOpenVIPModal}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {displayList.map((tpl) => (
                  <BrandsLivePosterCard
                    key={tpl.id}
                    template={tpl}
                    activeProfile={activeProfile}
                    overrideFrameId={selectedFrameId}
                    frameConfig={frameConfig}
                    onSelectTemplate={onSelectTemplate}
                    onQuickDownload={onQuickDownload}
                    onShareWhatsApp={handleShareWhatsApp}
                    onOpenVideo={onOpenAutoVideo}
                    onOpenVIPModal={onOpenVIPModal}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

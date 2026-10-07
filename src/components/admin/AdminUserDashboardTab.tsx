import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Flame,
  Sun,
  Crown,
  Palette,
  Video,
  Tag,
  Briefcase,
  Moon,
  Sunrise,
  Zap,
  TrendingUp,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  Check,
  Building2,
  Users,
  Clock,
  Heart,
  Gem,
  FileText,
  ArrowRight,
  ShieldCheck,
  Radio,
  Sliders,
  Maximize2,
  Image as ImageIcon,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Calendar,
  X,
  Upload
} from 'lucide-react';
import {
  DashboardHeroSlide,
  DashboardStoryItem,
  DashboardSectionConfig,
  UserDashboardConfig,
  loadUserDashboardConfig,
  saveUserDashboardConfig,
  resetUserDashboardConfig,
  DEFAULT_HERO_SLIDES,
  DEFAULT_DASHBOARD_STORIES,
  DEFAULT_DASHBOARD_SECTIONS,
  resolveActiveHeroSlide,
} from '../../data/userDashboardConfig';
import { 
  getUpcoming3DaysEvents, 
  DayCalendarEvent, 
  CalendarFestivalItem 
} from '../../data/calendarFestivals';
import { PosterTemplate, CategoryInfo } from '../../types';

// Map icon strings to components
export const getDashboardIcon = (name: string): React.ElementType => {
  switch (name) {
    case 'Flame': return Flame;
    case 'Crown': return Crown;
    case 'Moon': return Moon;
    case 'Sun': return Sun;
    case 'Palette': return Palette;
    case 'Video': return Video;
    case 'Sunrise': return Sunrise;
    case 'Briefcase': return Briefcase;
    case 'Tag': return Tag;
    case 'Building2': return Building2;
    case 'Users': return Users;
    case 'Zap': return Zap;
    case 'TrendingUp': return TrendingUp;
    case 'Heart': return Heart;
    case 'Gem': return Gem;
    case 'FileText': return FileText;
    default: return Sparkles;
  }
};

const AVAILABLE_ICONS = [
  'Flame',
  'Crown',
  'Moon',
  'Sun',
  'Palette',
  'Video',
  'Sunrise',
  'Briefcase',
  'Tag',
  'Building2',
  'Users',
  'Zap',
  'TrendingUp',
  'Sparkles',
];

const GRADIENT_PRESETS = [
  { id: 'mystic-blue', label: 'Mystic Shiva Blue', value: 'from-slate-950 via-cyan-950 to-indigo-950', accent: '#38bdf8' },
  { id: 'royal-amber', label: 'Royal Shivaji Amber', value: 'from-amber-950 via-orange-900 to-red-950', accent: '#f97316' },
  { id: 'auspicious-red', label: 'Ganesh Red & Gold', value: 'from-amber-950 via-red-900 to-orange-950', accent: '#f59e0b' },
  { id: 'ruby-rose', label: 'Business Ruby & Gold', value: 'from-red-950 via-rose-900 to-amber-950', accent: '#fbbf24' },
  { id: 'festive-pink', label: 'Holi Festive Pink', value: 'from-pink-950 via-purple-950 to-amber-950', accent: '#f43f5e' },
  { id: 'emerald-dark', label: 'Emerald Deep Green', value: 'from-emerald-950 via-teal-950 to-slate-950', accent: '#10b981' },
  { id: 'purple-royal', label: 'Royal Violet Night', value: 'from-purple-950 via-indigo-950 to-slate-950', accent: '#a855f7' },
];

const STORY_GRADIENT_PRESETS = [
  { label: 'Red / Amber', value: 'from-red-500 via-orange-500 to-amber-500' },
  { label: 'Gold / Orange', value: 'from-amber-600 via-orange-600 to-red-600' },
  { label: 'Blue / Cyan', value: 'from-blue-600 via-indigo-600 to-cyan-500' },
  { label: 'Pink / Rose', value: 'from-pink-500 via-rose-500 to-purple-600' },
  { label: 'Sunrise Yellow', value: 'from-amber-400 via-orange-500 to-yellow-500' },
  { label: 'Night Indigo', value: 'from-indigo-600 via-purple-700 to-slate-900' },
  { label: 'Emerald Teal', value: 'from-emerald-600 via-teal-600 to-cyan-700' },
  { label: 'Purple / Pink', value: 'from-purple-600 via-pink-600 to-red-600' },
];

interface AdminUserDashboardTabProps {
  templates?: PosterTemplate[];
  categories?: CategoryInfo[];
  onConfigChanged?: (newConfig: UserDashboardConfig) => void;
}

export const AdminUserDashboardTab: React.FC<AdminUserDashboardTabProps> = ({
  templates = [],
  categories = [],
  onConfigChanged,
}) => {
  const [config, setConfig] = useState<UserDashboardConfig>(() => loadUserDashboardConfig());
  const [activeSubTab, setActiveSubTab] = useState<'flash' | 'stories' | 'sections' | 'controls'>('flash');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editing modals / drawers state
  const [editingSlide, setEditingSlide] = useState<DashboardHeroSlide | null>(null);
  const [editingStory, setEditingStory] = useState<DashboardStoryItem | null>(null);
  const [editingSection, setEditingSection] = useState<DashboardSectionConfig | null>(null);

  // New item flags
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);

  // Upcoming 3 Days Calendar Events
  const upcoming3Days = useMemo(() => getUpcoming3DaysEvents(), []);

  // Poster Picker Modal state
  const [posterPickerSlide, setPosterPickerSlide] = useState<DashboardHeroSlide | null>(null);
  const [posterSearchQuery, setPosterSearchQuery] = useState('');
  const [posterCategoryFilter, setPosterCategoryFilter] = useState('all');
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');

  // Filtered Templates for Poster Picker
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const q = posterSearchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        tpl.title.toLowerCase().includes(q) ||
        (tpl.titleMarathi && tpl.titleMarathi.toLowerCase().includes(q)) ||
        tpl.category.toLowerCase().includes(q) ||
        (tpl.tags && tpl.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCat =
        posterCategoryFilter === 'all' ||
        tpl.category === posterCategoryFilter ||
        (tpl.tags && tpl.tags.includes(posterCategoryFilter));

      return matchesSearch && matchesCat;
    });
  }, [templates, posterSearchQuery, posterCategoryFilter]);

  // Auto-hide success message
  useEffect(() => {
    if (savedSuccess) {
      const timer = setTimeout(() => setSavedSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedSuccess]);

  const handleSave = () => {
    saveUserDashboardConfig(config);
    if (onConfigChanged) onConfigChanged(config);
    setSavedSuccess(true);
  };

  const handleReset = () => {
    if (window.confirm('तुम्हाला युजर डॅशबोर्डचे सर्व सेक्शन्स व फ्लॅश डिझाईन्स मूळ सिस्टीम डीफॉल्टनुसार रिसेट करायचे आहेत का?')) {
      const reset = resetUserDashboardConfig();
      setConfig(reset);
      if (onConfigChanged) onConfigChanged(reset);
      setSavedSuccess(true);
    }
  };

  // ----------------------------------------------------
  // HERO & FLASH BANNER ACTIONS
  // ----------------------------------------------------
  const handleToggleHeroBanner = () => {
    const updated = { ...config, showHeroBanner: !config.showHeroBanner };
    setConfig(updated);
    saveUserDashboardConfig(updated);
    if (onConfigChanged) onConfigChanged(updated);
  };

  const handleToggleAuto3Days = () => {
    const updated = {
      ...config,
      autoUpcoming3DaysOnly: !config.autoUpcoming3DaysOnly,
    };
    setConfig(updated);
    saveUserDashboardConfig(updated);
    if (onConfigChanged) onConfigChanged(updated);
    setSavedSuccess(true);
  };

  const handleSetPinnedFlash = (slideId: string) => {
    const updated: UserDashboardConfig = {
      ...config,
      flashBannerMode: 'pinned',
      pinnedFlashSlideId: slideId,
      heroSlides: config.heroSlides.map((s) => ({
        ...s,
        isFlashPinned: s.id === slideId,
      })),
    };
    setConfig(updated);
    saveUserDashboardConfig(updated);
    if (onConfigChanged) onConfigChanged(updated);
    setSavedSuccess(true);
  };

  const handleToggleSlideStatus = (slideId: string) => {
    const updated: UserDashboardConfig = {
      ...config,
      heroSlides: config.heroSlides.map((s) =>
        s.id === slideId ? { ...s, enabled: !s.enabled } : s
      ),
    };
    setConfig(updated);
    saveUserDashboardConfig(updated);
    if (onConfigChanged) onConfigChanged(updated);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (config.heroSlides.length <= 1) {
      alert('किमान १ फ्लॅश स्लाईड असणे आवश्यक आहे.');
      return;
    }
    if (window.confirm('ही सण स्लाईड नक्की हटवायची आहे का?')) {
      const updated: UserDashboardConfig = {
        ...config,
        heroSlides: config.heroSlides.filter((s) => s.id !== slideId),
        pinnedFlashSlideId:
          config.pinnedFlashSlideId === slideId
            ? config.heroSlides.find((s) => s.id !== slideId)?.id
            : config.pinnedFlashSlideId,
      };
      setConfig(updated);
      saveUserDashboardConfig(updated);
      if (onConfigChanged) onConfigChanged(updated);
      setSavedSuccess(true);
    }
  };

  const handleSaveSlideModal = (slide: DashboardHeroSlide) => {
    const exists = config.heroSlides.some((s) => s.id === slide.id);
    const updatedSlides = exists
      ? config.heroSlides.map((s) => (s.id === slide.id ? slide : s))
      : [...config.heroSlides, { ...slide, order: config.heroSlides.length + 1 }];

    const updated: UserDashboardConfig = {
      ...config,
      heroSlides: updatedSlides,
      pinnedFlashSlideId: slide.isFlashPinned ? slide.id : config.pinnedFlashSlideId,
    };
    setConfig(updated);
    saveUserDashboardConfig(updated);
    if (onConfigChanged) onConfigChanged(updated);
    setEditingSlide(null);
    setIsAddingSlide(false);
    setSavedSuccess(true);
  };

  // Quick Pin Festival from Next 3 Days Calendar Strip
  const handlePinUpcomingFestival = (fest: CalendarFestivalItem, day: DayCalendarEvent) => {
    const existing = config.heroSlides.find(
      (s) =>
        s.category === fest.category ||
        s.title.toLowerCase().includes(fest.name.toLowerCase()) ||
        s.titleMarathi.includes(fest.nameMarathi)
    );

    let targetId = existing?.id;
    let newSlides = [...config.heroSlides];

    if (existing) {
      newSlides = newSlides.map((s) => ({
        ...s,
        enabled: s.id === existing.id ? true : s.enabled,
        isFlashPinned: s.id === existing.id,
      }));
    } else {
      const matched = templates.find((t) => t.category === fest.category || t.tags?.includes(fest.category));
      const newSlide: DashboardHeroSlide = {
        id: `slide-fest-${fest.id}-${Date.now()}`,
        tag: fest.badge || 'UPCOMING FESTIVAL',
        tagMarathi: `${day.dayNumber} ${day.monthNameMarathi} • ${fest.nameMarathi}`,
        title: fest.name,
        titleMarathi: fest.nameMarathi,
        dateText: `${day.dayNumber} ${day.monthNameMarathi} ${day.year}`,
        countdownText: `⏳ ${day.relativeLabel || 'आगामी सण'} • ${fest.badge || 'विशेष मुहूर्त'}`,
        gradient: fest.color || 'from-amber-950 via-rose-950 to-purple-950',
        accentColor: '#f59e0b',
        headline: `।। ${fest.nameMarathi} हार्दिक शुभेच्छा ।।`,
        subtext: fest.descriptionMarathi || `${fest.nameMarathi}च्या मंगल पर्वावर आपल्या व्यवसायाचे ब्रँडेड पोस्टर १-क्लिकमध्ये तयार करा.`,
        category: fest.category,
        targetTemplateId: matched?.id,
        buttonText: `${fest.nameMarathi} पोस्टर बनवा`,
        enabled: true,
        isFlashPinned: true,
        order: 1,
        festivalDate: day.dateStr,
        isAuto3Day: true,
      };
      targetId = newSlide.id;
      newSlides = [newSlide, ...newSlides.map((s) => ({ ...s, isFlashPinned: false }))];
    }

    const updatedConfig: UserDashboardConfig = {
      ...config,
      showHeroBanner: true,
      flashBannerMode: 'pinned',
      pinnedFlashSlideId: targetId,
      heroSlides: newSlides,
    };

    setConfig(updatedConfig);
    saveUserDashboardConfig(updatedConfig);
    if (onConfigChanged) onConfigChanged(updatedConfig);
    setSavedSuccess(true);
  };

  // Poster File Upload
  const handlePosterFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCustomImageUrlInput(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply Poster to Slide
  const handleApplyPosterToSlide = (templateId?: string, customUrl?: string) => {
    if (!posterPickerSlide) return;
    const updatedSlides = config.heroSlides.map((s) => {
      if (s.id === posterPickerSlide.id) {
        return {
          ...s,
          targetTemplateId: templateId || undefined,
          posterImageUrl: customUrl || undefined,
        };
      }
      return s;
    });

    const updatedConfig = {
      ...config,
      heroSlides: updatedSlides,
    };

    setConfig(updatedConfig);
    saveUserDashboardConfig(updatedConfig);
    if (onConfigChanged) onConfigChanged(updatedConfig);

    if (editingSlide && editingSlide.id === posterPickerSlide.id) {
      setEditingSlide({
        ...editingSlide,
        targetTemplateId: templateId || undefined,
        posterImageUrl: customUrl || undefined,
      });
    }

    setPosterPickerSlide(null);
    setCustomImageUrlInput('');
    setSavedSuccess(true);
  };

  // ----------------------------------------------------
  // STORIES TRAY ACTIONS
  // ----------------------------------------------------
  const handleToggleStoryTray = () => {
    setConfig((prev) => ({ ...prev, showStoryTray: !prev.showStoryTray }));
  };

  const handleToggleStoryStatus = (storyId: string) => {
    setConfig((prev) => ({
      ...prev,
      stories: prev.stories.map((s) =>
        s.id === storyId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const handleMoveStory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.stories.length) return;

    const newStories = [...config.stories];
    const temp = newStories[index];
    newStories[index] = newStories[targetIndex];
    newStories[targetIndex] = temp;

    // update order numbers
    newStories.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setConfig((prev) => ({ ...prev, stories: newStories }));
  };

  const handleDeleteStory = (storyId: string) => {
    if (window.confirm('ही स्टोरी नक्की हटवायची आहे का?')) {
      setConfig((prev) => ({
        ...prev,
        stories: prev.stories.filter((s) => s.id !== storyId),
      }));
    }
  };

  const handleSaveStoryModal = (story: DashboardStoryItem) => {
    setConfig((prev) => {
      const exists = prev.stories.some((s) => s.id === story.id);
      const updated = exists
        ? prev.stories.map((s) => (s.id === story.id ? story : s))
        : [...prev.stories, { ...story, order: prev.stories.length + 1 }];
      return { ...prev, stories: updated };
    });
    setEditingStory(null);
    setIsAddingStory(false);
  };

  // ----------------------------------------------------
  // SECTIONS / RAILS ACTIONS
  // ----------------------------------------------------
  const handleToggleSectionStatus = (sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.sections.length) return;

    const newSections = [...config.sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setConfig((prev) => ({ ...prev, sections: newSections }));
  };

  const handleDeleteSection = (sectionId: string) => {
    if (window.confirm('हा सेक्शन नक्की हटवायचा आहे का?')) {
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
      }));
    }
  };

  const handleSaveSectionModal = (sec: DashboardSectionConfig) => {
    setConfig((prev) => {
      const exists = prev.sections.some((s) => s.id === sec.id);
      const updated = exists
        ? prev.sections.map((s) => (s.id === sec.id ? sec : s))
        : [...prev.sections, { ...sec, order: prev.sections.length + 1 }];
      return { ...prev, sections: updated };
    });
    setEditingSection(null);
    setIsAddingSection(false);
  };

  // Current active pinned slide for preview
  const currentPinnedSlide =
    config.heroSlides.find((s) => s.id === config.pinnedFlashSlideId) ||
    config.heroSlides.find((s) => s.isFlashPinned) ||
    config.heroSlides[0];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-500/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Admin • Live Poster Dashboard CMS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            युजर पोस्टर डॅशबोर्ड व फ्लॅश डिझाईन्स मॅनेजर
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            युजरच्या स्क्रीनवर कोणती डिझाईन सर्वात वर फ्लॅश करायची, कोणते सेक्शन्स सुरु ठेवायचे, डेली स्टोरीज व इव्हेंट्स कसे दिसतील हे सर्व येथून नियंत्रित करा.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>बदल यशस्वी सेव्ह झाले!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>डिफॉल्ट रिसेट</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/30 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>बदल सेव्ह करा (Publish Live)</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab('flash')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === 'flash'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>⚡ फ्लॅश डिझाईन व हिरो बॅनर ({config.heroSlides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('stories')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === 'stories'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>⭕ डेली स्टोरीज व इव्हेंट्स ट्रे ({config.stories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sections')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === 'sections'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>📑 सर्व डॅशबोर्ड सेक्शन्स व क्रम ({config.sections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('controls')}
          className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === 'controls'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>🛠️ फॉरमॅट व फ्रेम स्विचर सेटिंग्स</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FLASH DESIGN & HERO BANNER MANAGER (TOP FESTIVAL & POSTER CONTROL) */}
      {/* ========================================================================= */}
      {activeSubTab === 'flash' && (
        <div className="space-y-6">
          {/* Top Master Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl">
            {/* 1. Toggle Banner On/Off */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>हिरो फ्लॅश बॅनर सुरु ठेवा</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">युजरच्या डॅशबोर्डवर सर्वात वर दिसेल</div>
              </div>
              <button
                type="button"
                onClick={handleToggleHeroBanner}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  config.showHeroBanner ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    config.showHeroBanner ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 2. Strict Next 3-Days Upcoming Festival Rule Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>येत्या ३ दिवसांतील सणच दाखवा</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  फक्त आज, उद्या व ३ दिवसांतील सण वरती दिसतील
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleAuto3Days}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  config.autoUpcoming3DaysOnly ? 'bg-amber-500 shadow-md shadow-amber-500/30' : 'bg-slate-700'
                }`}
                title="हे चालू असल्यास केवळ चालू तारखेपासून पुढील ३ दिवसांमधील सण व त्याचे पोस्टर वरती दिसतील"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 transition-transform absolute top-1 ${
                    config.autoUpcoming3DaysOnly ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* 3. Mode: Pinned vs Auto 3-Days vs Carousel */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-black text-white flex items-center justify-between">
                <span>फ्लॅश मोड (Display Mode)</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  {config.flashBannerMode === 'pinned'
                    ? '📌 Pinned Festival'
                    : config.flashBannerMode === 'auto_3days'
                    ? '⚡ Auto 3-Day Fest'
                    : '🔄 Carousel'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...config, flashBannerMode: 'pinned' as const };
                    setConfig(updated);
                    saveUserDashboardConfig(updated);
                    if (onConfigChanged) onConfigChanged(updated);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center cursor-pointer ${
                    config.flashBannerMode === 'pinned'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="ॲडमिनने वरती ठेवलेला विशिष्ट सण दिसेल"
                >
                  📌 मॅन्युअल
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...config, flashBannerMode: 'auto_3days' as const, autoUpcoming3DaysOnly: true };
                    setConfig(updated);
                    saveUserDashboardConfig(updated);
                    if (onConfigChanged) onConfigChanged(updated);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center cursor-pointer ${
                    config.flashBannerMode === 'auto_3days'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="कॅलेंडरमधील पुढील ३ दिवसांतील सण आपोआप निवडला जाईल"
                >
                  ⚡ ३-दिवसीय
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...config, flashBannerMode: 'carousel' as const };
                    setConfig(updated);
                    saveUserDashboardConfig(updated);
                    if (onConfigChanged) onConfigChanged(updated);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center cursor-pointer ${
                    config.flashBannerMode === 'carousel'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                  title="सर्व सक्रिय सण आलटून पालटून फिरतील"
                >
                  🔄 फिरणारे
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION: ⚡ UPCOMING FESTIVALS IN NEXT 3 DAYS (QUICK 1-CLICK PIN)         */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-900 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  ⚡
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>येत्या ३ दिवसांत येणारे आगामी सण (Next 3 Days Calendar Festivals)</span>
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                      Live Calendar
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    युजरच्या मागणीनुसार: वरती येणारा सणच दिसायला हवा. कोणत्याही सणावर क्लिक करून तो त्वरित मुख्य पोस्टर म्हणून वरती लावा.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {upcoming3Days.map((day) => {
                const primaryFest = day.festivals[0];
                if (!primaryFest) return null;
                const isToday = day.isToday;
                const isTomorrow = day.isTomorrow;

                // Check if this festival is already currently pinned
                const isCurrentlyPinned =
                  config.heroSlides.some((s) => s.id === config.pinnedFlashSlideId && (
                    s.category === primaryFest.category ||
                    s.title.toLowerCase().includes(primaryFest.name.toLowerCase()) ||
                    s.titleMarathi.includes(primaryFest.nameMarathi)
                  ));

                // Find matching template
                const matchedTpl = templates.find((t) => t.category === primaryFest.category || t.tags?.includes(primaryFest.category));

                return (
                  <div
                    key={day.dateStr}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isCurrentlyPinned
                        ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                        : isToday
                        ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500/70'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isToday
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : isTomorrow
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {day.relativeLabel || `${day.dayNumber} ${day.monthNameMarathi}`}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400">
                          {day.dayNumber} {day.monthShortMarathi} ({day.weekdayShortMarathi})
                        </span>
                      </div>

                      {/* Poster Mini Thumbnail & Festival Name */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-lg bg-slate-950 border border-white/10 shrink-0 overflow-hidden relative shadow-sm">
                          {matchedTpl?.thumbnailUrl ? (
                            <img src={matchedTpl.thumbnailUrl} alt={primaryFest.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-600 to-red-600 flex items-center justify-center text-xs">
                              🚩
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-white truncate" title={primaryFest.nameMarathi}>
                            {primaryFest.nameMarathi}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate">{primaryFest.name}</p>
                          <span className="text-[9px] text-amber-300 font-semibold truncate block mt-0.5">
                            {primaryFest.badge || 'शुभ सण'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 mt-2 border-t border-slate-800/80">
                      {isCurrentlyPinned ? (
                        <div className="w-full py-1.5 text-center text-[10px] font-black text-amber-300 bg-amber-500/20 rounded-lg border border-amber-500/40 flex items-center justify-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>सध्या वरती सक्रिय (Active On Top)</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePinUpcomingFestival(primaryFest, day)}
                          className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-[11px] shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                        >
                          <Crown className="w-3 h-3" />
                          <span>हा सण वरती ठेवा</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION: ALL HERO SLIDES & POSTERS LIST (FULL CRUD)                       */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>सर्व सण व पोस्टर्स यादी (All Festival Slides & Posters)</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                    {config.heroSlides.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  येथून कोणताही सण संपादित करा, पोस्टर बदला, चालू/बंद करा किंवा डिलीट करा.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingSlide({
                    id: `slide-${Date.now()}`,
                    tag: 'SPECIAL FESTIVAL',
                    tagMarathi: 'विशेष उत्सव मोहीम',
                    title: 'नवीन सण विशेष पोस्टर',
                    titleMarathi: 'हार्दिक शुभेच्छा व सदिच्छा',
                    dateText: 'आगामी सण २०२६',
                    countdownText: '🔥 Trending Festival Campaign',
                    gradient: 'from-amber-950 via-rose-950 to-purple-950',
                    accentColor: '#f59e0b',
                    headline: '।। सण व उत्सवाच्या हार्दिक शुभेच्छा ।।',
                    subtext: 'आपल्या व्यवसायाच्या नावासह आणि लोगोसह १-क्लिकमध्ये आकर्षक सण पोस्टर तयार करा.',
                    category: 'festivals',
                    buttonText: 'Create Brand Poster',
                    enabled: true,
                    order: config.heroSlides.length + 1,
                  });
                  setIsAddingSlide(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ नवीन सण स्लाईड जोडा</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {config.heroSlides.map((slide, idx) => {
                const isPinned = config.pinnedFlashSlideId === slide.id || slide.isFlashPinned;
                const matchedTpl = templates.find((t) => t.id === slide.targetTemplateId) ||
                  templates.find((t) => t.category === slide.category || t.tags?.includes(slide.category));

                return (
                  <div
                    key={slide.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isPinned
                        ? 'bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border-amber-500/80 shadow-lg ring-1 ring-amber-500/40'
                        : slide.enabled
                        ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/70 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Poster thumbnail + Slide Details */}
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Poster Thumbnail */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-950 border border-white/15 overflow-hidden shrink-0 shadow-md relative group">
                          {slide.posterImageUrl ? (
                            <img src={slide.posterImageUrl} alt={slide.title} className="w-full h-full object-cover" />
                          ) : matchedTpl?.thumbnailUrl ? (
                            <img src={matchedTpl.thumbnailUrl} alt={matchedTpl.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center text-xl`}>
                              🚩
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => setPosterPickerSlide(slide)}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[9px] font-bold text-amber-300 p-1 text-center cursor-pointer"
                            title="पोस्टर बदला"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>पोस्टर बदला</span>
                          </button>
                        </div>

                        {/* Slide Details */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                              {slide.tag}
                            </span>

                            {isPinned && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1 shadow-sm">
                                👑 मुख्य फ्लॅश (On Top)
                              </span>
                            )}

                            {!slide.enabled && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                                बंद (Disabled)
                              </span>
                            )}

                            {slide.isAuto3Day && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                ✨ ३-दिवसीय सण
                              </span>
                            )}

                            <span className="text-[11px] text-slate-400">
                              तारीख: <strong className="text-slate-200">{slide.dateText}</strong>
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                              {slide.title}
                            </h4>
                            <p className="text-xs sm:text-sm font-bold text-amber-200/90 truncate">
                              {slide.titleMarathi}
                            </p>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-1">
                            {slide.headline} • {slide.subtext}
                          </p>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                            <span>कॅटेगरी: <strong className="text-slate-300">{slide.category}</strong></span>
                            <span>•</span>
                            <span>
                              पोस्टर टेम्पलेट:{' '}
                              <strong className="text-amber-300 font-mono">
                                {slide.targetTemplateId || matchedTpl?.id || 'Auto Matching'}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                        {/* 1. Pin to top button */}
                        {!isPinned && (
                          <button
                            type="button"
                            onClick={() => handleSetPinnedFlash(slide.id)}
                            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            title="या सणाला युजरच्या होम स्क्रीनवर सर्वात वर ठेवा"
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>वरती ठेवा (Pin)</span>
                          </button>
                        )}

                        {/* 2. Change poster button */}
                        <button
                          type="button"
                          onClick={() => setPosterPickerSlide(slide)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          title="या सणासाठी पोस्टर टेम्पलेट बदला"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                          <span>पोस्टर बदला</span>
                        </button>

                        {/* 3. Edit festival button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSlide(slide);
                            setIsAddingSlide(false);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          title="सण, तारीख व माहिती संपादित करा"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>संपादित करा</span>
                        </button>

                        {/* 4. Toggle On/Off */}
                        <button
                          type="button"
                          onClick={() => handleToggleSlideStatus(slide.id)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            slide.enabled
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25'
                              : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-white'
                          }`}
                          title={slide.enabled ? 'सण बंद करा (Turn Off)' : 'सण चालू करा (Turn On)'}
                        >
                          {slide.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* 5. Delete button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                          title="सण काढून टाका (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAILY STORIES & TRENDING EVENTS TRAY                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'stories' && (
        <div className="space-y-6">
          {/* Controls Bar: Enable tray & change title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">डेली स्टोरीज ट्रे सुरु ठेवा</div>
                <div className="text-[11px] text-slate-400">गोल सर्कल्स मधील दैनंदिन ट्रेंड्स</div>
              </div>
              <button
                type="button"
                onClick={handleToggleStoryTray}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  config.showStoryTray ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    config.showStoryTray ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300">ट्रे टायटल (मराठी)</label>
              <input
                type="text"
                value={config.storyTrayTitleMarathi}
                onChange={(e) => setConfig((p) => ({ ...p, storyTrayTitleMarathi: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                placeholder="उदा. दैनिक ट्रेंड"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">नवीन स्टोरी सर्कल जोडा</div>
                <div className="text-[11px] text-slate-400">नवीन सण, विचार किंवा व्हिडिओ</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingStory({
                    id: `story-${Date.now()}`,
                    label: 'New Festival',
                    labelMarathi: 'नवीन सण',
                    iconName: 'Sun',
                    gradient: 'from-amber-500 via-orange-600 to-red-600',
                    badge: 'NEW',
                    isLive: false,
                    categoryFilter: 'festivals',
                    groupFilter: 'festivals',
                    enabled: true,
                    order: config.stories.length + 1,
                  });
                  setIsAddingStory(true);
                }}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ नवीन स्टोरी</span>
              </button>
            </div>
          </div>

          {/* Interactive Live Tray Preview */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>स्टोरीज ट्रे थेट प्रिव्ह्यू (Live Stories Strip Preview)</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto pb-4 scrollbar-thin">
              <div className="flex items-center gap-4 min-w-max">
                {config.stories
                  .filter((s) => s.enabled)
                  .map((story) => {
                    const IconComp = getDashboardIcon(story.iconName);
                    return (
                      <div key={story.id} className="flex flex-col items-center gap-1.5 w-16 group cursor-pointer">
                        <div className="relative">
                          <div className={`w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr ${story.gradient} transition-transform group-hover:scale-105 shadow-md`}>
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border border-white/20">
                              <IconComp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                            </div>
                          </div>
                          {story.badge && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[8px] font-black uppercase tracking-wider whitespace-nowrap shadow-xs">
                              {story.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-200 text-center line-clamp-1 w-full">
                          {story.labelMarathi || story.label}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Stories List Management */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>सर्व स्टोरीज क्रम व संपादन (Manage Stories Order & Content)</span>
              <span className="text-xs text-slate-400">वर/खाली बाण वापरून क्रम बदला</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {config.stories.map((story, idx) => {
                const IconComp = getDashboardIcon(story.iconName);
                return (
                  <div
                    key={story.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      story.enabled
                        ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/60 border-slate-900 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveStory(idx, 'up')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === config.stories.length - 1}
                          onClick={() => handleMoveStory(idx, 'down')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className={`w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr ${story.gradient} shrink-0`}>
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                          <IconComp className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-white truncate">{story.labelMarathi}</h4>
                          {story.badge && (
                            <span className="px-1.5 py-0.5 rounded-full bg-red-600/80 text-white text-[9px] font-black uppercase">
                              {story.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {story.label} • <span className="text-amber-400 font-mono">{story.categoryFilter}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleStoryStatus(story.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          story.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {story.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingStory(story);
                          setIsAddingStory(false);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteStory(story.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SECTIONS & RAILS MANAGEMENT (START/STOP & CONTENT)                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-black uppercase text-amber-400 tracking-wider">
                डॅशबोर्ड सेक्शन्स कंट्रोल (Section Visibility & Sequence)
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                कोणता सेक्शन सुरु ठेवायचा किंवा बंद करायचा हे निवडा, तसेच सेक्शन्सचा क्रम व नवीन सण सेक्शन जोडा.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingSection({
                  id: `custom-rail-${Date.now()}`,
                  type: 'custom_rail',
                  title: 'नवीन सण विशेष संग्रह',
                  titleMarathi: 'नवीन सण व उत्सव विशेष डिझाईन्स',
                  subtitle: 'आपल्या ब्रँडच्या प्रचारासाठी खास सण पोस्टर्स',
                  badge: 'NEW FESTIVAL',
                  iconName: 'Sun',
                  categoryFilter: 'festivals',
                  viewAllCategory: 'festivals',
                  enabled: true,
                  order: config.sections.length + 1,
                  isSystem: false,
                });
                setIsAddingSection(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md self-start sm:self-center transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ नवीन सेक्शन जोडा (Add Custom Section)</span>
            </button>
          </div>

          {/* Sections List */}
          <div className="space-y-3">
            {config.sections.map((section, idx) => {
              const IconComp = getDashboardIcon(section.iconName);
              return (
                <div
                  key={section.id}
                  className={`p-4 rounded-xl border transition-all ${
                    section.enabled
                      ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/70 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Order arrows */}
                      <div className="flex flex-col gap-1 shrink-0 mt-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, 'up')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === config.sections.length - 1}
                          onClick={() => handleMoveSection(idx, 'down')}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400">#{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                            {section.badge}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            कॅटेगरी: <strong className="text-white font-mono">{section.categoryFilter}</strong>
                          </span>
                          {section.isSystem ? (
                            <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">सिस्टीम रेल</span>
                          ) : (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">कस्टम रेल</span>
                          )}
                        </div>

                        <h4 className="text-base font-black text-white">{section.titleMarathi || section.title}</h4>
                        <div className="text-xs text-slate-400">{section.title}</div>
                        {section.subtitle && (
                          <div className="text-xs text-slate-400 line-clamp-1">{section.subtitle}</div>
                        )}
                      </div>
                    </div>

                    {/* Right toggles & actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {/* Big switch */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">
                          {section.enabled ? 'सुरु (Active)' : 'बंद (Hidden)'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleSectionStatus(section.id)}
                          className={`w-11 h-6 rounded-full transition-colors relative ${
                            section.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                              section.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingSection(section);
                          setIsAddingSection(false);
                        }}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        title="Edit Section"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {!section.isSystem && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                          title="Delete Custom Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FORMAT AND FRAME SWITCHER SETTINGS                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'controls' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>फॉरमॅट बार व फूटर फ्रेम स्विचर कंट्रोल्स (Format & Frame Control Bar)</span>
            </h3>
            <p className="text-xs text-slate-300">
              युजरला स्क्रीनवर 1:1 स्क्वेअर, 9:16 व्हॉट्सॲप स्टेटस व २७ कलर फ्रेम्सचा क्विक स्विचर दाखवायचा की नाही हे ठरवा.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">संपूर्ण कंट्रोल बार सुरु ठेवा</div>
                  <div className="text-[11px] text-slate-400">फॉरमॅट टॅब्स व फ्रेम सिलेक्ट पट्टी</div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig((p) => ({ ...p, showControlBar: !p.showControlBar }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    config.showControlBar ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      config.showControlBar ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">क्विक फॉरमॅट फिल्टर (1:1, 9:16)</div>
                  <div className="text-[11px] text-slate-400">सगळे फॉरमॅट्स, व्हिडिओ, बिझनेस टॅब्स</div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig((p) => ({ ...p, showQuickFormatFilter: !p.showQuickFormatFilter }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    config.showQuickFormatFilter ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      config.showQuickFormatFilter ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">२७ फूटर फ्रेम्स स्क्रोलर पट्टी</div>
                  <div className="text-[11px] text-slate-400">रॉयल ब्लू, गोल्ड, मरून इत्यादी फ्रेम्स</div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig((p) => ({ ...p, showQuickFrameSwitcher: !p.showQuickFrameSwitcher }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    config.showQuickFrameSwitcher ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      config.showQuickFrameSwitcher ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">कॅरोसेल रोटेशन स्पीड (Auto Rotation)</div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={config.heroBannerRotationSeconds || 6}
                    onChange={(e) =>
                      setConfig((p) => ({ ...p, heroBannerRotationSeconds: parseInt(e.target.value) || 6 }))
                    }
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {config.heroBannerRotationSeconds || 6} सेकंद
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / ADD HERO SLIDE (FLASH DESIGN)                               */}
      {/* ========================================================================= */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span>{isAddingSlide ? 'नवीन फ्लॅश डिझाईन जोडा' : 'फ्लॅश डिझाईन संपादित करा'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">शीर्षक (इंग्रजी)</label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. Maha Shivratri Mahotsav"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">शीर्षक (मराठी)</label>
                <input
                  type="text"
                  value={editingSlide.titleMarathi}
                  onChange={(e) => setEditingSlide({ ...editingSlide, titleMarathi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. महाशिवरात्री उत्सव विशेष"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">टॅग / बॅज (Tag)</label>
                <input
                  type="text"
                  value={editingSlide.tag}
                  onChange={(e) => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. AUSPICIOUS CELEBRATION"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">तारीख किंवा काउंटडाऊन मजकूर</label>
                <input
                  type="text"
                  value={editingSlide.countdownText}
                  onChange={(e) => setEditingSlide({ ...editingSlide, countdownText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. 🔱 Upcoming Auspicious Festival"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">मुख्य घोषवाक्य / स्लोगन (Headline)</label>
                <input
                  type="text"
                  value={editingSlide.headline}
                  onChange={(e) => setEditingSlide({ ...editingSlide, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. ।। ॐ नमः शिवाय • हर हर महादेव ।। "
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">तपशीलवार संदेश (Subtext)</label>
                <textarea
                  rows={2}
                  value={editingSlide.subtext}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtext: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. महादेवाच्या कृपेने आपल्या व्यापारात वृद्धी होवो..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">कॅटेगरी (Category Filter)</label>
                <select
                  value={editingSlide.category}
                  onChange={(e) => setEditingSlide({ ...editingSlide, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="navratri">Shardiya Navratri (नवरात्रोत्सव)</option>
                  <option value="dussehra">Dussehra & Vijayadashami (दसरा)</option>
                  <option value="diwali">Diwali & Laxmi Pujan (दिवाळी)</option>
                  <option value="festivals">All Festivals (सर्व सण)</option>
                  <option value="shivratri">Maha Shivratri (महाशिवरात्री)</option>
                  <option value="shivaji-jayanti">Shivaji Jayanti (शिवजयंती)</option>
                  <option value="ganesh-chaturthi">Ganesh Chaturthi (गणेशोत्सव)</option>
                  <option value="holi">Holi & Dhulivandan (होळी)</option>
                  <option value="good-morning-quotes">Good Morning (शुभ सकाळ)</option>
                  <option value="good-night-quotes">Good Night (शुभ रात्र)</option>
                  <option value="business-promo">Business Marketing (व्यवसाय)</option>
                  <option value="birthday-wishes">Birthday & Greetings (वाढदिवस)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">बटण मजकूर (CTA Button)</label>
                <input
                  type="text"
                  value={editingSlide.buttonText || 'Create Brand Poster'}
                  onChange={(e) => setEditingSlide({ ...editingSlide, buttonText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">सण तारीख मजकूर (उदा. ०४ ऑक्टोबर २०२६)</label>
                <input
                  type="text"
                  value={editingSlide.dateText || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, dateText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. ४ ऑक्टोबर २०२६"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">कॅलेंडर तारीख की (उदा. 10-04 किंवा MM-DD)</label>
                <input
                  type="text"
                  value={editingSlide.festivalDate || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, festivalDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. 10-04 (येत्या ३ दिवसांत मॅच होण्यासाठी)"
                />
              </div>

              {/* Poster Image / Template Selector Section inside Edit Modal */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                      <span>या सणाचे पोस्टर बदला (Poster Image & Template)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      येथून थेट पोस्टर बदला, गॅलरीतून निवडा किंवा कस्टम इमेज लिंक टाका.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPosterPickerSlide(editingSlide)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>🖼️ गॅलरीतून पोस्टर निवडा</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-3">
                    <div className="w-full aspect-square max-w-[120px] rounded-xl bg-slate-900 border border-white/20 overflow-hidden relative shadow-md">
                      {editingSlide.posterImageUrl ? (
                        <img
                          src={editingSlide.posterImageUrl}
                          alt="Poster Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : editingSlide.targetTemplateId ? (
                        <img
                          src={templates.find((t) => t.id === editingSlide.targetTemplateId)?.thumbnailUrl || ''}
                          alt="Template Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${editingSlide.gradient} flex items-center justify-center text-2xl`}>
                          🚩
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-9 space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">कस्टम पोस्टर इमेज URL (Direct Image URL)</label>
                      <input
                        type="text"
                        value={editingSlide.posterImageUrl || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, posterImageUrl: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        placeholder="https://... किंवा Data URL"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400">लिंक्ड पोस्टर टेम्पलेट ID (Linked Template ID)</label>
                      <input
                        type="text"
                        value={editingSlide.targetTemplateId || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, targetTemplateId: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                        placeholder="उदा. navratri-1, shivratri-1, etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gradient Presets */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">बॅकग्राउंड ग्रॅडियंट थीम (Color Theme)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setEditingSlide({
                          ...editingSlide,
                          gradient: preset.value,
                          accentColor: preset.accent,
                        })
                      }
                      className={`p-2 rounded-lg text-left border flex items-center gap-2 transition-all ${
                        editingSlide.gradient === preset.value
                          ? 'border-amber-400 bg-slate-800'
                          : 'border-slate-800 bg-slate-950 hover:bg-slate-900'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${preset.value} border border-white/20`} />
                      <span className="text-[11px] font-bold text-slate-300 truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin as flash checkbox */}
              <div className="sm:col-span-2 p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-300">या स्लाईडला मुख्य फ्लॅश म्हणून सेट करा</div>
                  <div className="text-[11px] text-amber-200/70">युजरला सर्वात आधी हीच डिझाईन फ्लॅश दिसेल</div>
                </div>
                <input
                  type="checkbox"
                  checked={editingSlide.isFlashPinned}
                  onChange={(e) => setEditingSlide({ ...editingSlide, isFlashPinned: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={() => handleSaveSlideModal(editingSlide)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>स्लाईड जतन करा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / ADD STORY PILL                                              */}
      {/* ========================================================================= */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isAddingStory ? 'नवीन स्टोरी जोडा' : 'स्टोरी संपादित करा'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingStory(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">नाव (मराठी)</label>
                  <input
                    type="text"
                    value={editingStory.labelMarathi}
                    onChange={(e) => setEditingStory({ ...editingStory, labelMarathi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    placeholder="उदा. शिवजयंती"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">नाव (इंग्रजी)</label>
                  <input
                    type="text"
                    value={editingStory.label}
                    onChange={(e) => setEditingStory({ ...editingStory, label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    placeholder="उदा. Shivaji Jayanti"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">आयकॉन (Icon)</label>
                  <select
                    value={editingStory.iconName}
                    onChange={(e) => setEditingStory({ ...editingStory, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">बॅज (उदा. LIVE, 26 Feb)</label>
                  <input
                    type="text"
                    value={editingStory.badge || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    placeholder="उदा. LIVE"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">कॅटेगरी फिल्टर (Target Category)</label>
                <select
                  value={editingStory.categoryFilter}
                  onChange={(e) => setEditingStory({ ...editingStory, categoryFilter: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="all">All Designs (सर्व)</option>
                  <option value="shivaji-jayanti">Shivaji Jayanti</option>
                  <option value="shivratri">Maha Shivratri</option>
                  <option value="ganesh-chaturthi">Ganesh Chaturthi</option>
                  <option value="holi">Holi Special</option>
                  <option value="good-morning-quotes">Good Morning Quotes</option>
                  <option value="good-night-quotes">Good Night Quotes</option>
                  <option value="video-posts">Video Status</option>
                  <option value="business-promo">Business Promo</option>
                  <option value="political-greetings">Political Greetings</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">रंग ग्रॅडियंट (Circle Gradient)</label>
                <div className="grid grid-cols-4 gap-2">
                  {STORY_GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setEditingStory({ ...editingStory, gradient: preset.value })}
                      className={`h-8 rounded-lg bg-gradient-to-r ${preset.value} border-2 transition-all ${
                        editingStory.gradient === preset.value ? 'border-white scale-105 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      title={preset.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingStory(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={() => handleSaveStoryModal(editingStory)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>स्टोरी जतन करा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT / ADD SECTION RAIL                                            */}
      {/* ========================================================================= */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{isAddingSection ? 'नवीन सेक्शन जोडा' : 'सेक्शन संपादित करा'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">सेक्शन नाव (मराठी)</label>
                <input
                  type="text"
                  value={editingSection.titleMarathi}
                  onChange={(e) => setEditingSection({ ...editingSection, titleMarathi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. आगामी सण, उत्सव व दिनविशेष"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">सेक्शन नाव (इंग्रजी)</label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. Upcoming Indian Festivals & Events"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">उपशीर्षक (Subtitle)</label>
                <input
                  type="text"
                  value={editingSection.subtitle || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="उदा. सण, उत्सव आणि विशेष प्रसंगांसाठी उत्कृष्ट पोस्टर्स"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">बॅज मजकूर (Badge)</label>
                  <input
                    type="text"
                    value={editingSection.badge}
                    onChange={(e) => setEditingSection({ ...editingSection, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    placeholder="उदा. HOT TRENDING"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">आयकॉन</label>
                  <select
                    value={editingSection.iconName}
                    onChange={(e) => setEditingSection({ ...editingSection, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    {AVAILABLE_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">कॅटेगरी फिल्टर (या सेक्शनमध्ये कोणते पोस्टर्स दिसतील)</label>
                <select
                  value={editingSection.categoryFilter}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      categoryFilter: e.target.value,
                      viewAllCategory: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="festivals">Festivals (सर्व सण व उत्सव)</option>
                  <option value="ganesh-chaturthi">Ganesh Chaturthi (गणेश चतुर्थी)</option>
                  <option value="video-posts">Video Posts & Reels (व्हिडिओ स्टेटस)</option>
                  <option value="good-morning-quotes">Good Morning (शुभ सकाळ)</option>
                  <option value="good-night-quotes">Good Night (शुभ रात्र)</option>
                  <option value="business">Business Marketing (व्यवसाय जाहिराती)</option>
                  <option value="business-promo">Offers & Dhamaka (ऑफर्स)</option>
                  <option value="birthday-wishes">Birthday & Political (वाढदिवस व राजकीय)</option>
                  <option value="all">All Posters (सर्व डिझाईन्स)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={() => handleSaveSectionModal(editingSection)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>सेक्शन जतन करा</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POSTER PICKER / CHANGER (ADMIN ONLY)                                */}
      {/* ========================================================================= */}
      {posterPickerSlide && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>पोस्टर बदला: {posterPickerSlide.titleMarathi || posterPickerSlide.title}</span>
                    <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                      Admin Only
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    खालील गॅलरीतून पोस्टर निवडा किंवा स्वतःची इमेज अपलोड / URL टाका.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPosterPickerSlide(null);
                  setCustomImageUrlInput('');
                }}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Option A: Custom Image Upload / URL Bar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>पर्याय १: स्वतःचे पोस्टर अपलोड करा किंवा इमेज लिंक टाका</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* File Upload */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      📁 कम्प्युटर / मोबाईलवरून फोटो निवडा:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterFileUpload}
                      className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 file:cursor-pointer cursor-pointer"
                    />
                  </div>

                  {/* Or URL input */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      🔗 किंवा थेट इमेज लिंक (URL) पेस्ट करा:
                    </label>
                    <input
                      type="text"
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      placeholder="https://... किंवा data:image..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  {/* Apply Custom Button */}
                  <div className="sm:col-span-2 flex items-end">
                    <button
                      type="button"
                      disabled={!customImageUrlInput}
                      onClick={() => handleApplyPosterToSlide(undefined, customImageUrlInput)}
                      className={`w-full py-2 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all ${
                        customImageUrlInput
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>लागू करा</span>
                    </button>
                  </div>
                </div>

                {customImageUrlInput && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                    <div className="w-14 h-14 rounded-lg bg-slate-900 border border-amber-500/50 overflow-hidden shrink-0">
                      <img src={customImageUrlInput} alt="Custom Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs text-emerald-400 font-bold">
                      ✓ कस्टम इमेज लोड झाली आहे! 'लागू करा' बटणावर क्लिक करा.
                    </div>
                  </div>
                )}
              </div>

              {/* Option B: Library Search & Categories */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>पर्याय २: सिस्टीम पोस्टर गॅलरीतून निवडा ({filteredTemplates.length} पोस्टर्स उपलब्ध)</span>
                    </h4>
                  </div>

                  {/* Search box */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={posterSearchQuery}
                      onChange={(e) => setPosterSearchQuery(e.target.value)}
                      placeholder="नाव किंवा सण शोधा..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {[
                    { id: 'all', label: 'सर्व (All)' },
                    { id: 'navratri', label: '🚩 नवरात्रोत्सव' },
                    { id: 'dussehra', label: '🏹 दसरा विजयादशमी' },
                    { id: 'diwali', label: '🪔 दिवाळी' },
                    { id: 'festivals', label: '🎉 सर्व सण' },
                    { id: 'shivratri', label: '🔱 महाशिवरात्री' },
                    { id: 'shivaji-jayanti', label: '⚔️ शिवजयंती' },
                    { id: 'ganesh-chaturthi', label: '🐘 गणेशोत्सव' },
                    { id: 'holi', label: '🎨 होळी' },
                    { id: 'business', label: '💼 व्यवसाय' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setPosterCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        posterCategoryFilter === cat.id
                          ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {filteredTemplates.slice(0, 40).map((tpl) => {
                    const isSelected =
                      posterPickerSlide.targetTemplateId === tpl.id ||
                      posterPickerSlide.posterImageUrl === tpl.thumbnailUrl;

                    return (
                      <div
                        key={tpl.id}
                        className={`rounded-xl border p-2 flex flex-col justify-between transition-all group ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500 shadow-lg'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="aspect-square rounded-lg overflow-hidden relative bg-slate-900 mb-2">
                          <img
                            src={tpl.thumbnailUrl}
                            alt={tpl.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-[9px] font-bold text-amber-300 px-1.5 py-0.5 rounded">
                            {tpl.category}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1 mb-2">
                          <h5 className="text-xs font-black text-white truncate" title={tpl.titleMarathi || tpl.title}>
                            {tpl.titleMarathi || tpl.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">{tpl.title}</p>
                        </div>

                        {/* Action Button */}
                        <button
                          type="button"
                          onClick={() => handleApplyPosterToSlide(tpl.id, tpl.thumbnailUrl)}
                          className={`w-full py-1.5 rounded-lg font-black text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>निवडलेले आहे</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>हे पोस्टर निवडा</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                पोस्टर निवडल्यानंतर ते लगेच युजरच्या मुख्य बॅनरवर दिसेल.
              </span>
              <button
                type="button"
                onClick={() => {
                  setPosterPickerSlide(null);
                  setCustomImageUrlInput('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
              >
                बंद करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

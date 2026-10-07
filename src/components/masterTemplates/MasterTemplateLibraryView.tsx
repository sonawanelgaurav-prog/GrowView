import React, { useState, useEffect, useMemo } from 'react';
import { MasterTemplate, UserAccount } from '../../types';
import { 
  ALL_MASTER_TEMPLATES, 
  MASTER_TEMPLATE_STATS,
  loadMasterTemplates,
  MASTER_TEMPLATES_UPDATED_EVENT 
} from '../../data/masterTemplates';
import { MasterTemplateCard } from './MasterTemplateCard';
import { MasterTemplateEditorModal } from './MasterTemplateEditorModal';
import { MasterTemplateFullPreviewModal } from './MasterTemplateFullPreviewModal';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Crown, 
  Heart, 
  Briefcase, 
  CheckCircle2, 
  ArrowLeft,
  Layers,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Eye,
  Grid,
  Sliders
} from 'lucide-react';

interface MasterTemplateLibraryViewProps {
  currentUser: UserAccount | null;
  onOpenPricingModal: () => void;
  onBackToPosters?: () => void;
  initialCategory?: 'all' | 'wedding' | 'engagement' | 'resume';
}

const ITEMS_PER_PAGE = 18;

export const MasterTemplateLibraryView: React.FC<MasterTemplateLibraryViewProps> = ({
  currentUser,
  onOpenPricingModal,
  onBackToPosters,
  initialCategory = 'all',
}) => {
  // Master Templates loaded from localStorage if customized by Admin
  const [templates, setTemplates] = useState<MasterTemplate[]>(() => loadMasterTemplates());

  // Listen for admin changes
  useEffect(() => {
    const handleUpdate = () => {
      setTemplates(loadMasterTemplates());
    };
    window.addEventListener(MASTER_TEMPLATES_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(MASTER_TEMPLATES_UPDATED_EVENT, handleUpdate);
  }, []);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wedding' | 'engagement' | 'resume'>(initialCategory);
  const [selectedSubStyle, setSelectedSubStyle] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [atsOnlyFilter, setAtsOnlyFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // View Mode: 'large' (Full Card Preview) vs 'grid' (Compact Grid)
  const [viewMode, setViewMode] = useState<'large' | 'grid'>('large');

  // Modals state
  const [editingTemplate, setEditingTemplate] = useState<MasterTemplate | null>(null);
  const [fullPreviewTemplate, setFullPreviewTemplate] = useState<MasterTemplate | null>(null);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedSubStyle('all');
    setCurrentPage(1);
  }, [initialCategory]);

  const isAdmin = currentUser?.role === 'admin';
  const isUserVip = currentUser?.plan && currentUser.plan !== 'free';

  // Substyle filter presets
  const subStyleOptions = useMemo(() => {
    if (selectedCategory === 'wedding') {
      return [
        { id: 'all', label: 'सर्व लग्नपत्रिका' },
        { id: 'peshwai', label: 'पेशवाई व रॉयल (Peshwai)' },
        { id: 'floral', label: 'फ्लोरल पेस्टल (Floral)' },
        { id: 'geometric', label: 'मॉडर्न जिओमेट्रिक (Geometric)' },
        { id: 'traditional', label: 'मांडव पारंपारिक (Mandap)' },
      ];
    }
    if (selectedCategory === 'engagement') {
      return [
        { id: 'all', label: 'सर्व साखरपुडा' },
        { id: 'rose-gold', label: 'रोझ गोल्ड रिंग (Rose Gold)' },
        { id: 'peacock', label: 'रॉयल मोरपीस (Peacock)' },
        { id: 'traditional', label: 'पारंपारिक वाङ्निश्चय' },
      ];
    }
    if (selectedCategory === 'resume') {
      return [
        { id: 'all', label: 'सर्व रेझ्युमे व बायोडाटा' },
        { id: 'biodata', label: 'मराठी विवाह बायोडाटा (Vivah Biodata)' },
        { id: 'sidebar', label: 'एक्झिक्युटिव्ह डार्क (Sidebar)' },
        { id: 'banner', label: 'टॉप बॅनर क्रिएटिव्ह (Creative)' },
        { id: 'tech', label: 'कोडिंग / टेक (Tech Developer)' },
        { id: 'ats', label: 'क्लीन एटीएस (ATS Compliant)' },
      ];
    }
    return [];
  }, [selectedCategory]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      // Category filter
      if (selectedCategory !== 'all' && tpl.category !== selectedCategory) {
        return false;
      }

      // Substyle filter
      if (selectedSubStyle !== 'all') {
        const layoutVar = (tpl.template_config?.layoutVariant || tpl.layout_type || '').toLowerCase();
        const styleName = (tpl.style || '').toLowerCase();
        const tplName = (tpl.name || '').toLowerCase();

        if (selectedSubStyle === 'biodata') {
          if (!layoutVar.includes('biodata') && !tplName.includes('biodata') && !tpl.id.includes('RES-03')) return false;
        } else if (selectedSubStyle === 'sidebar') {
          if (!layoutVar.includes('sidebar') && !styleName.includes('executive') && !styleName.includes('sidebar')) return false;
        } else if (selectedSubStyle === 'banner') {
          if (!layoutVar.includes('banner') && !styleName.includes('banner') && !styleName.includes('creative')) return false;
        } else if (selectedSubStyle === 'tech') {
          if (!layoutVar.includes('tech') && !styleName.includes('tech') && !styleName.includes('developer') && !styleName.includes('minimalist')) return false;
        } else if (selectedSubStyle === 'ats') {
          if (!tpl.is_ats_friendly) return false;
        } else if (selectedSubStyle === 'peshwai') {
          if (!layoutVar.includes('peshwai') && !styleName.includes('royal') && !styleName.includes('traditional')) return false;
        } else if (selectedSubStyle === 'floral') {
          if (!layoutVar.includes('floral') && !styleName.includes('floral') && !styleName.includes('pastel')) return false;
        } else if (selectedSubStyle === 'geometric') {
          if (!layoutVar.includes('geometric') && !styleName.includes('geometric') && !styleName.includes('modern')) return false;
        } else if (selectedSubStyle === 'rose-gold') {
          if (!layoutVar.includes('rose-gold') && !styleName.includes('rose') && !styleName.includes('luxury')) return false;
        } else if (selectedSubStyle === 'peacock') {
          if (!layoutVar.includes('peacock') && !styleName.includes('peacock') && !styleName.includes('emerald')) return false;
        }
      }

      // Plan filter
      if (planFilter === 'free' && !tpl.is_free) return false;
      if (planFilter === 'premium' && !tpl.is_premium) return false;

      // ATS Only filter
      if (atsOnlyFilter && !tpl.is_ats_friendly) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = tpl.id.toLowerCase().includes(q);
        const matchName = tpl.name.toLowerCase().includes(q);
        const matchMarathi = tpl.nameMarathi ? tpl.nameMarathi.toLowerCase().includes(q) : false;
        const matchStyle = tpl.style.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchMarathi && !matchStyle) {
          return false;
        }
      }

      return true;
    });
  }, [templates, selectedCategory, selectedSubStyle, planFilter, atsOnlyFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE) || 1;
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTemplates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTemplates, currentPage]);

  const handleCategoryChange = (cat: 'all' | 'wedding' | 'engagement' | 'resume') => {
    setSelectedCategory(cat);
    setSelectedSubStyle('all');
    if (cat !== 'resume') {
      setAtsOnlyFilter(false);
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Breadcrumb / Back button */}
          <div className="flex items-center justify-between">
            {onBackToPosters ? (
              <button
                type="button"
                onClick={onBackToPosters}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-all cursor-pointer backdrop-blur-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>फेस्टिव्हल व बिझनेस पोस्टर्सकडे परत जा</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                150 मास्टर डिझाईन्स
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              मास्टर डिझाईन्स लायब्ररी (150 Designs)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              लग्नपत्रिका (50), साखरपुडा आमंत्रण (50) आणि प्रोफेशनल रेझ्युमे / विवाह बायोडाटा (50). सर्व डिझाईन्सचे लेआउट, फॉन्ट व डिझाईन पूर्णपणे वेगळे आणि कस्टमाईझेबल आहेत.
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-lg sm:text-2xl font-black text-rose-400">50</div>
              <div className="text-xs text-slate-300 font-semibold">लग्नपत्रिका डिझाईन्स</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-lg sm:text-2xl font-black text-amber-400">50</div>
              <div className="text-xs text-slate-300 font-semibold">साखरपुडा आमंत्रण</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-lg sm:text-2xl font-black text-blue-400">50</div>
              <div className="text-xs text-slate-300 font-semibold">रेझ्युमे व विवाह बायोडाटा</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-lg sm:text-2xl font-black text-emerald-400">
                {templates.filter(t => t.is_free).length} मोफत
              </div>
              <div className="text-xs text-slate-300 font-semibold">Free + VIP डिझाईन्स</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-5">
        {/* Controls & Category Filter Bar */}
        <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200/80 space-y-3.5">
          {/* Primary Category Switcher + View Mode Toggle */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>सर्व डिझाईन्स (150)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('wedding')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'wedding'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>लग्नपत्रिका (50)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('engagement')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'engagement'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <span>💍</span>
                <span>साखरपुडा (50)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('resume')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'resume'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>रेझ्युमे / विवाह बायोडाटा (50)</span>
              </button>
            </div>

            {/* View Mode Switcher (Customer Full Preview vs Grid) */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">व्ह्यू:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('large')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'large' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="संपूर्ण कार्ड प्रिव्ह्यू पहा"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  <span>संपूर्ण प्रिव्ह्यू</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="स्टँडर्ड ग्रिड व्ह्यू"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>ग्रिड</span>
                </button>
              </div>
            </div>
          </div>

          {/* Substyle Filters Strip (When a specific category is chosen) */}
          {subStyleOptions.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold shrink-0">लेआउट स्टाईल:</span>
              {subStyleOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubStyle(opt.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSubStyle === opt.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Search & Plan Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Plan Tier Pill Filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => { setPlanFilter('all'); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    planFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => { setPlanFilter('free'); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    planFilter === 'free' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => { setPlanFilter('premium'); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    planFilter === 'premium' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Crown className="w-3 h-3 fill-current" />
                  VIP
                </button>
              </div>

              {/* ATS Friendly Filter for Resumes */}
              {(selectedCategory === 'resume' || selectedCategory === 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setAtsOnlyFilter(!atsOnlyFilter);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    atsOnlyFilter
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ATS FRIENDLY</span>
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="नाव, आयडी किंवा स्टाईल शोधा..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Results Counter & VIP Badge */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            एकूण <strong>{filteredTemplates.length}</strong> डिझाईन्स उपलब्ध (पान {currentPage} पैकी {totalPages})
          </span>
          <div className="flex items-center gap-3">
            {isUserVip && (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-current" />
                VIP ॲक्सेस सक्रिय!
              </span>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        {paginatedTemplates.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'large' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {paginatedTemplates.map((template) => (
              <MasterTemplateCard
                key={template.id}
                template={template}
                isAdmin={isAdmin}
                isLargeView={viewMode === 'large'}
                onSelect={(tpl) => setEditingTemplate(tpl)}
                onPreview={(tpl) => setFullPreviewTemplate(tpl)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-800">कोणतेही डिझाईन सापडले नाही</h3>
            <p className="text-xs text-slate-500">
              आपण शोधलेला कीवर्ड किंवा फिल्टर तपासा आणि पुन्हा प्रयत्न करा.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubStyle('all');
                setPlanFilter('all');
                setAtsOnlyFilter(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              सर्व फिल्टर्स रीसेट करा
            </button>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 pb-12">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => {
                setCurrentPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>मागील</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => {
                setCurrentPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>पुढील</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Customer Full High-Resolution Preview Modal */}
      <MasterTemplateFullPreviewModal
        template={fullPreviewTemplate}
        isOpen={!!fullPreviewTemplate}
        onClose={() => setFullPreviewTemplate(null)}
        onSelectToEdit={(tpl) => {
          setFullPreviewTemplate(null);
          setEditingTemplate(tpl);
        }}
        isAdmin={isAdmin}
      />

      {/* Customer Interactive Form Customizer & Download Modal */}
      <MasterTemplateEditorModal
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        template={editingTemplate}
        currentUser={currentUser}
        onOpenPricingModal={onOpenPricingModal}
      />
    </div>
  );
};

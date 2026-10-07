import React, { useState, useRef, useMemo } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Flame,
  Crown,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  X,
  Upload,
  Split,
  BarChart2,
  FolderPlus,
  ExternalLink,
  Copy,
  Folder,
  Tag,
  Save,
  Check,
  Calendar,
  Image as ImageIcon,
  CheckSquare,
  Square as SquareIcon,
} from 'lucide-react';
import { CategoryInfo, PosterTemplate, AspectRatio, FrameId, BusinessProfile, SYSTEM_SIZES, AdminRole } from '../../types';
import { FRAMES } from '../../data/frames';
import {
  getCategoryAllowedSizes,
  getCategorySizeSettingsMap,
  saveCategorySizeSettingsMap,
} from '../../data/sizeSystem';
import { deduplicateCategories } from '../../utils/categoryUtils';

interface AdminTemplatesTabProps {
  templates: PosterTemplate[];
  categories: CategoryInfo[];
  activeProfile?: BusinessProfile;
  adminRole?: AdminRole;
  onSaveTemplate: (template: PosterTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate?: (template: PosterTemplate) => void;
  onOpenInStudio?: (template: PosterTemplate) => void;
  onSaveCategory?: (category: CategoryInfo) => void;
  onDeleteCategory?: (categoryId: string) => void;
}

const PRESET_GRADIENTS = [
  { name: 'Saffron & Gold (भगवा)', bgGradient: 'from-amber-600 via-orange-600 to-red-800', primaryColor: '#f59e0b', accentColor: '#ea580c' },
  { name: 'Royal Crimson (शाही लाल)', bgGradient: 'from-red-900 via-rose-800 to-amber-900', primaryColor: '#e11d48', accentColor: '#fbbf24' },
  { name: 'Deep Emerald (हिरवा)', bgGradient: 'from-emerald-900 via-teal-800 to-slate-950', primaryColor: '#10b981', accentColor: '#34d399' },
  { name: 'Midnight Navy (नेव्ही ब्लू)', bgGradient: 'from-slate-950 via-blue-950 to-indigo-900', primaryColor: '#3b82f6', accentColor: '#60a5fa' },
  { name: 'Royal Purple (जांभळा)', bgGradient: 'from-purple-950 via-indigo-950 to-slate-900', primaryColor: '#a855f7', accentColor: '#c084fc' },
  { name: 'Festive Sunset (सोनेरी सूर्यास्त)', bgGradient: 'from-orange-600 via-amber-500 to-rose-700', primaryColor: '#f59e0b', accentColor: '#fbbf24' },
];

export const AdminTemplatesTab: React.FC<AdminTemplatesTabProps> = ({
  templates,
  categories,
  activeProfile,
  adminRole = 'super_admin',
  onSaveTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onOpenInStudio,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const isSuperAdmin = adminRole === 'super_admin';
  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'categories' | 'analytics' | 'ab_testing'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Category Add/Edit Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catIdInput, setCatIdInput] = useState('');
  const [catNameInput, setCatNameInput] = useState('');
  const [catMarathiInput, setCatMarathiInput] = useState('');
  const [catGroupInput, setCatGroupInput] = useState<'festivals' | 'business' | 'daily' | 'special'>('festivals');
  const [catDescInput, setCatDescInput] = useState('');
  const [catAllowedSizesInput, setCatAllowedSizesInput] = useState<AspectRatio[]>(['1:1', '4:5', '9:16']);
  const [categoryToast, setCategoryToast] = useState<string | null>(null);

  // Bulk Template Size Assignment
  const [selectedTemplateIdsForBulk, setSelectedTemplateIdsForBulk] = useState<string[]>([]);
  const [isBulkSizeModalOpen, setIsBulkSizeModalOpen] = useState(false);
  const [bulkSizesInput, setBulkSizesInput] = useState<AspectRatio[]>(['1:1', '4:5', '9:16']);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formTitleNative, setFormTitleNative] = useState('');
  const [formHeadline, setFormHeadline] = useState('');
  const [formSubtext, setFormSubtext] = useState('');
  const [formIsBackgroundOnly, setFormIsBackgroundOnly] = useState(false);
  const [formCategory, setFormCategory] = useState('ganesh-chaturthi');
  const [formSubCategory, setFormSubCategory] = useState('festivals');
  const [formFestivalDate, setFormFestivalDate] = useState('2026-09-14');
  const [formFestivalNames, setFormFestivalNames] = useState('गणेश चतुर्थी, हरतालिका');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [formDateBadge, setFormDateBadge] = useState('');
  const [formAspectRatio, setFormAspectRatio] = useState<AspectRatio>('1:1');
  const [formAllowedSizes, setFormAllowedSizes] = useState<AspectRatio[]>(['1:1', '4:5', '9:16']);
  const [formDefaultFrameId, setFormDefaultFrameId] = useState<FrameId>('frame-golden-royal');
  const [formIsTrending, setFormIsTrending] = useState(true);
  const [formIsToday, setFormIsToday] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBgGradient, setFormBgGradient] = useState('from-amber-600 via-orange-600 to-red-800');
  const [formPrimaryColor, setFormPrimaryColor] = useState('#f59e0b');
  const [formAccentColor, setFormAccentColor] = useState('#ea580c');
  const [formTextColor, setFormTextColor] = useState('#ffffff');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('इमेज साईझ खूप मोठी आहे. कृपया 8MB पेक्षा कमी आकाराचा फोटो निवडा.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingTemplateId(null);
    setFormTitle('');
    setFormTitleNative('');
    setFormHeadline('');
    setFormSubtext('');
    setFormIsBackgroundOnly(false);
    setFormCategory('ganesh-chaturthi');
    setFormSubCategory('festivals');
    setFormFestivalDate('2026-09-14');
    setFormFestivalNames('गणेश चतुर्थी, हरतालिका');
    setFormDateBadge('14 सप्टें • गणेश चतुर्थी व हरतालिका');
    setFormAspectRatio('1:1');
    setFormAllowedSizes(['1:1', '4:5', '9:16']);
    setFormDefaultFrameId('frame-golden-royal');
    setFormIsTrending(true);
    setFormIsToday(false);
    setFormImageUrl('');
    setFormBgGradient('from-amber-600 via-orange-600 to-red-800');
    setFormPrimaryColor('#f59e0b');
    setFormAccentColor('#ea580c');
    setFormTextColor('#ffffff');
  };

  // Open modal in create mode
  const handleOpenCreate = (preselectedCat?: string) => {
    resetForm();
    if (preselectedCat && preselectedCat !== 'all') {
      setFormCategory(preselectedCat);
      const catSizes = getCategoryAllowedSizes(preselectedCat);
      setFormAllowedSizes(catSizes.length > 0 ? catSizes : ['1:1', '4:5', '9:16']);
      if (preselectedCat === 'ganesh-chaturthi') {
        setFormFestivalDate('2026-09-14');
        setFormFestivalNames('गणेश चतुर्थी, हरतालिका');
        setFormDateBadge('14 सप्टें • गणेश चतुर्थी');
      } else if (preselectedCat === 'hartalika') {
        setFormFestivalDate('2026-09-14');
        setFormFestivalNames('हरतालिका');
        setFormDateBadge('14 सप्टें • हरतालिका तृतीया');
      } else if (preselectedCat === 'rishi-panchami') {
        setFormFestivalDate('2026-09-15');
        setFormFestivalNames('ऋषी पंचमी');
        setFormDateBadge('15 सप्टें • ऋषी पंचमी');
      } else if (preselectedCat === 'gauri-utsav') {
        setFormFestivalDate('2026-09-16');
        setFormFestivalNames('गौरी आगमन');
        setFormDateBadge('16 सप्टें • गौरी आगमन');
      }
    }
    setIsCreateModalOpen(true);
  };

  // Open modal in edit mode
  const handleOpenEdit = (tpl: PosterTemplate) => {
    setEditingTemplateId(tpl.id);
    setFormTitle(tpl.title);
    setFormTitleNative(tpl.titleNative || tpl.title);
    setFormHeadline(tpl.headline || '');
    setFormSubtext(tpl.subtext || '');
    setFormIsBackgroundOnly(!tpl.headline && !tpl.subtext);
    setFormCategory(tpl.category);
    setFormSubCategory(tpl.subCategory || 'festivals');
    setFormFestivalDate(tpl.festivalDate || (tpl.category === 'ganesh-chaturthi' || tpl.category === 'hartalika' ? '2026-09-14' : ''));
    setFormFestivalNames(Array.isArray(tpl.festivalNames) ? tpl.festivalNames.join(', ') : (tpl.category === 'ganesh-chaturthi' ? 'गणेश चतुर्थी' : tpl.category === 'hartalika' ? 'हरतालिका' : ''));
    setFormDateBadge(tpl.dateBadge || '');
    setFormAspectRatio(tpl.aspectRatio || '1:1');
    setFormAllowedSizes(tpl.allowedSizes && tpl.allowedSizes.length > 0 ? tpl.allowedSizes : [tpl.aspectRatio || '1:1']);
    setFormDefaultFrameId((tpl.defaultFrameId as FrameId) || 'frame-golden-royal');
    setFormIsTrending(tpl.isTrending || false);
    setFormIsToday(tpl.isToday || false);
    setFormImageUrl(tpl.imageUrl || tpl.customBgUrl || '');
    setFormBgGradient(tpl.theme?.bgGradient || 'from-amber-600 via-orange-600 to-red-800');
    setFormPrimaryColor(tpl.theme?.primaryColor || '#f59e0b');
    setFormAccentColor(tpl.theme?.accentColor || '#ea580c');
    setFormTextColor(tpl.theme?.textColor || '#ffffff');
    setIsCreateModalOpen(true);
  };

  // Category Modal Handlers
  const handleOpenNewCategory = () => {
    setEditingCategoryId(null);
    setCatIdInput('');
    setCatNameInput('');
    setCatMarathiInput('');
    setCatGroupInput('festivals');
    setCatDescInput('');
    setCatAllowedSizesInput(['1:1', '4:5', '9:16']);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryInfo) => {
    setEditingCategoryId(cat.id);
    setCatIdInput(cat.id);
    setCatNameInput(cat.name);
    setCatMarathiInput(cat.nameMarathi || cat.name);
    setCatGroupInput(cat.group as any || 'festivals');
    setCatDescInput(cat.description || '');
    setCatAllowedSizesInput(getCategoryAllowedSizes(cat.id));
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim()) {
      alert('कृपया कॅटेगरीचे नाव प्रविष्ट करा.');
      return;
    }
    if (catAllowedSizesInput.length === 0) {
      alert('कृपया किमान एक साईझ निवडा (Select at least one allowed size: Square, Portrait, or Vertical).');
      return;
    }

    const cleanId = (catIdInput.trim() || catNameInput.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `cat-${Date.now()}`;

    // Prevent duplicate categories
    const existingCat = categories.find(
      (c) =>
        !editingCategoryId &&
        (c.id.toLowerCase() === cleanId.toLowerCase() ||
         c.name.trim().toLowerCase() === catNameInput.trim().toLowerCase() ||
         (c.nameMarathi && c.nameMarathi.trim().toLowerCase() === (catMarathiInput.trim() || catNameInput.trim()).toLowerCase()))
    );

    if (existingCat) {
      alert(`⚠️ कॅटेगरी "${existingCat.nameMarathi || existingCat.name}" आधीच उपलब्ध आहे! कृपया डुप्लिकेट कॅटेगरी तयार करू नका.`);
      return;
    }

    const newCat: CategoryInfo = {
      id: cleanId,
      name: catNameInput.trim(),
      nameMarathi: catMarathiInput.trim() || catNameInput.trim(),
      group: catGroupInput,
      icon: 'Folder',
      description: catDescInput.trim() || undefined,
      count: templates.filter(t => t.category === cleanId || t.subCategory === cleanId).length || 1,
    };

    if (onSaveCategory) {
      onSaveCategory(newCat);
    }

    // Persist category allowed sizes in the global size system
    const currentSizesMap = getCategorySizeSettingsMap();
    currentSizesMap[cleanId] = catAllowedSizesInput;
    saveCategorySizeSettingsMap(currentSizesMap);

    setCategoryToast(`✓ कॅटेगरी "${newCat.nameMarathi}" साईझ नियमांसह यशस्वीरीत्या सेव्ह केली!`);
    setTimeout(() => setCategoryToast(null), 4000);
    setIsCategoryModalOpen(false);

    // If we were creating/editing a template, auto-select this category
    setFormCategory(cleanId);
  };

  // Bulk Template Size Assignment Handlers
  const handleToggleSelectTemplateForBulk = (id: string) => {
    setSelectedTemplateIdsForBulk((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllTemplatesForBulk = () => {
    if (selectedTemplateIdsForBulk.length === filteredTemplates.length) {
      setSelectedTemplateIdsForBulk([]);
    } else {
      setSelectedTemplateIdsForBulk(filteredTemplates.map((t) => t.id));
    }
  };

  const handleApplyBulkSizes = () => {
    if (bulkSizesInput.length === 0) {
      alert('कृपया किमान एक साईझ निवडा (Select at least one size).');
      return;
    }
    if (selectedTemplateIdsForBulk.length === 0) {
      alert('कृपया किमान एक पोस्टर निवडा (Select at least one template).');
      return;
    }
    selectedTemplateIdsForBulk.forEach((id) => {
      const targetTpl = templates.find((t) => t.id === id);
      if (targetTpl) {
        onSaveTemplate({
          ...targetTpl,
          allowedSizes: bulkSizesInput,
          aspectRatio: bulkSizesInput.includes(targetTpl.aspectRatio) ? targetTpl.aspectRatio : bulkSizesInput[0],
        });
      }
    });
    setSaveSuccessNotice(`✓ ${selectedTemplateIdsForBulk.length} पोस्टर्सना नवीन साईझ नियम यशस्वीपणे लागू केले!`);
    setTimeout(() => setSaveSuccessNotice(null), 4000);
    setIsBulkSizeModalOpen(false);
    setSelectedTemplateIdsForBulk([]);
  };

  const filteredTemplates = templates.filter((t) => {
    const isGaneshFilter = selectedCategory === 'ganesh-chaturthi';
    const matchesCategory =
      selectedCategory === 'all' ||
      t.category === selectedCategory ||
      t.subCategory === selectedCategory ||
      (isGaneshFilter && (
        t.id.toLowerCase().includes('ganesh') ||
        t.title.toLowerCase().includes('ganesh') ||
        (t.titleNative && t.titleNative.includes('गणेश'))
      ));

    const matchesDate =
      selectedDateFilter === 'all' ||
      t.festivalDate === selectedDateFilter ||
      (selectedDateFilter === '2026-09-14' && (
        t.category === 'ganesh-chaturthi' ||
        t.category === 'hartalika' ||
        (Array.isArray(t.festivalNames) && t.festivalNames.some(fn => fn.includes('गणेश') || fn.includes('हरतालिका')))
      )) ||
      (t.dateBadge && t.dateBadge.includes(selectedDateFilter));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.titleNative && t.titleNative.toLowerCase().includes(q)) ||
      t.headline.toLowerCase().includes(q) ||
      (t.subtext && t.subtext.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q);

    return matchesCategory && matchesDate && matchesSearch;
  }).sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
    if (aTime && bTime && aTime !== bTime) {
      return bTime - aTime;
    }
    const aCustom = Boolean(a.isCustomUpload || a.isNew || a.isJustUploaded || a.id.startsWith('tpl-admin-') || a.id.startsWith('tpl-custom-'));
    const bCustom = Boolean(b.isCustomUpload || b.isNew || b.isJustUploaded || b.id.startsWith('tpl-admin-') || b.id.startsWith('tpl-custom-'));
    if (aCustom && !bCustom) return -1;
    if (!aCustom && bCustom) return 1;
    return 0;
  });

  const deduplicatedCategories = useMemo(() => deduplicateCategories(categories), [categories]);

  const filteredCategories = deduplicatedCategories.filter((c) => {
    const q = categorySearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.nameMarathi && c.nameMarathi.toLowerCase().includes(q)) ||
      c.id.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('कृपया शीर्षक प्रविष्ट करा.');
      return;
    }
    if (!formAllowedSizes || formAllowedSizes.length === 0) {
      alert('कृपया किमान एक साईझ निवडा (Square, Portrait, किंवा Vertical). Admin cannot save a template without selecting a valid size.');
      return;
    }

    const effectiveRatio: AspectRatio = formAllowedSizes.includes(formAspectRatio)
      ? formAspectRatio
      : formAllowedSizes[0];

    const originalTpl = editingTemplateId ? templates.find(t => t.id === editingTemplateId) : null;

    const tpl: PosterTemplate = {
      ...(originalTpl || {}),
      id: editingTemplateId || `tpl-admin-${Date.now()}`,
      title: formTitle.trim(),
      titleNative: formTitleNative.trim() || formTitle.trim(),
      category: formCategory,
      subCategory: formSubCategory || 'custom',
      dateBadge: formDateBadge.trim() || undefined,
      festivalDate: formFestivalDate.trim() || undefined,
      festivalNames: formFestivalNames ? formFestivalNames.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      aspectRatio: effectiveRatio,
      allowedSizes: formAllowedSizes,
      headline: formIsBackgroundOnly ? '' : formHeadline.trim(),
      subtext: formIsBackgroundOnly ? '' : formSubtext.trim(),
      motifType: formIsBackgroundOnly || formImageUrl ? 'none' : (originalTpl?.motifType || 'none'),
      defaultFrameId: formDefaultFrameId,
      isTrending: formIsTrending,
      isToday: formIsToday,
      imageUrl: formImageUrl || undefined,
      customBgUrl: formImageUrl || undefined,
      isCustomUpload: true,
      isNew: true,
      isJustUploaded: true,
      createdAt: originalTpl?.createdAt || new Date().toISOString(),
      created_at: originalTpl?.createdAt || new Date().toISOString(),
      theme: {
        bgGradient: formBgGradient,
        primaryColor: formPrimaryColor,
        accentColor: formAccentColor,
        textColor: formTextColor,
        ornamentColor: '#fbbf24',
        cardBg: 'rgba(255, 255, 255, 0.1)',
      },
    };

    onSaveTemplate(tpl);
    setSelectedCategory('all');
    setSelectedDateFilter('all');
    setSearchQuery('');
    setActiveSubTab('templates');
    setSaveSuccessNotice(`✓ पोस्ट "${tpl.titleNative || tpl.title}" यशस्वीरीत्या सेव्ह झाली! ही पोस्ट गॅलरीच्या सुरुवातीला "नुकतेच अपलोड केलेले" विभागात दिसेल.`);
    setTimeout(() => setSaveSuccessNotice(null), 5000);
    setIsCreateModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {(categoryToast || saveSuccessNotice) && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{categoryToast || saveSuccessNotice}</span>
        </div>
      )}

      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('templates')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'templates'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>सर्व डिझाईन्स व पोस्टर्स ({templates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('categories')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'categories'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>🗂️ सर्व कॅटेगरीज मॅनेज करा ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'analytics'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>सण मागणी ॲनालिटिक्स</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ab_testing')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'ab_testing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Split className="w-4 h-4" />
            <span>A/B थंबनेल टेस्टिंग</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenCreate(selectedCategory)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>➕ नवीन पोस्ट अपलोड करा</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: TEMPLATES GRID & MANAGEMENT */}
      {activeSubTab === 'templates' && (
        <div className="space-y-4">
          {/* Quick Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-bold whitespace-nowrap text-[11px] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>कॅटेगरी निवडा:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              सर्व पोस्टर्स ({templates.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('ganesh-chaturthi')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === 'ganesh-chaturthi'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <span>🪔 गणेश चतुर्थी Special</span>
              <span className="text-[10px] opacity-80">
                ({templates.filter(t => t.category === 'ganesh-chaturthi' || t.id.includes('ganesh') || (t.titleNative && t.titleNative.includes('गणेश'))).length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('shivaji-jayanti')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === 'shivaji-jayanti'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>🚩 शिवजयंती</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('diwali')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === 'diwali'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>🪔 दिवाळी</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('business-promo')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === 'business-promo'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>🏢 बिझनेस ऑफर्स</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('good-morning-quotes')}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === 'good-morning-quotes'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>☀️ शुभ सकाळ सुविचार</span>
            </button>
          </div>

          {/* Search & Full Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="पोस्टर नाव, सण, गणेश किंवा मजकूर शोधा..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="bg-slate-950 border border-amber-500/40 text-xs font-bold text-amber-300 px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                title="कॅलेंडर तारखेनुसार पोस्टर्स फिल्टर करा"
              >
                <option value="all">📅 सर्व तारखा (All Dates)</option>
                <option value="2026-09-14">🔥 14 सप्टें: गणेश चतुर्थी व हरतालिका</option>
                <option value="2026-09-15">15 सप्टें: ऋषी पंचमी</option>
                <option value="2026-09-16">16 सप्टें: गौरी आवाहन</option>
                <option value="2026-09-17">17 सप्टें: गौरी पूजन</option>
                <option value="2026-09-18">18 सप्टें: गौरी विसर्जन</option>
                <option value="2026-09-10">10 सप्टें: आजचे विशेष</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-300 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 max-w-[240px]"
              >
                <option value="all">सर्व कॅटेगरीज (All Categories)</option>
                {deduplicateCategories(categories).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameMarathi || c.name} ({templates.filter(t => t.category === c.id || t.subCategory === c.id).length || c.count || 0})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleOpenCreate(selectedCategory)}
                className="px-3 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1"
                title="या कॅटेगरीमध्ये नवीन पोस्ट जोडा"
              >
                <Plus className="w-4 h-4" />
                <span>येथे पोस्ट ॲड करा</span>
              </button>
            </div>
          </div>

          {/* Bulk Size Assignment Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 p-3 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleSelectAllTemplatesForBulk}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {selectedTemplateIdsForBulk.length === filteredTemplates.length && filteredTemplates.length > 0
                    ? 'निवड रद्द करा (Deselect All)'
                    : 'सर्व निवडा (Select All)'}
                </span>
              </button>

              <span className="text-xs text-slate-300 font-medium">
                {selectedTemplateIdsForBulk.length > 0 ? (
                  <strong className="text-amber-400 font-black">{selectedTemplateIdsForBulk.length} पोस्ट्स निवडल्या</strong>
                ) : (
                  <span>Bulk Size Assignment साठी पोस्ट्स निवडा (Select templates to bulk assign sizes)</span>
                )}
              </span>
            </div>

            <button
              type="button"
              disabled={selectedTemplateIdsForBulk.length === 0}
              onClick={() => setIsBulkSizeModalOpen(true)}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                selectedTemplateIdsForBulk.length > 0
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 cursor-pointer active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Bulk Size Assignment ({selectedTemplateIdsForBulk.length} आकार लागू करा)</span>
            </button>
          </div>

          {/* Templates Grid Count info */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              दिसत असलेल्या पोस्ट्स: <strong className="text-white">{filteredTemplates.length}</strong> / {templates.length}
            </span>
            {selectedCategory !== 'all' && (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <span>सध्या निवडलेली कॅटेगरी:</span>
                <strong className="underline">
                  {categories.find(c => c.id === selectedCategory)?.nameMarathi || selectedCategory}
                </strong>
              </span>
            )}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all flex flex-col justify-between group shadow-lg ${
                  selectedTemplateIdsForBulk.includes(tmpl.id)
                    ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20'
                    : 'border-slate-800 hover:border-amber-500/50 hover:shadow-amber-500/10'
                }`}
              >
                {/* Poster Preview Frame */}
                <div
                  className={`relative p-4 aspect-square flex flex-col justify-between overflow-hidden bg-gradient-to-br ${
                    tmpl.theme?.bgGradient || 'from-amber-600 to-red-800'
                  }`}
                >
                  {tmpl.imageUrl && (
                    <img
                      src={tmpl.imageUrl}
                      alt={tmpl.title}
                      className="absolute inset-0 w-full h-full object-cover z-0 opacity-85 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5">
                      {/* Bulk Selection Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelectTemplateForBulk(tmpl.id);
                        }}
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors shadow-sm ${
                          selectedTemplateIdsForBulk.includes(tmpl.id)
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-black/70 text-white/70 hover:text-white border border-white/30'
                        }`}
                        title="Bulk Size बदलासाठी निवडा"
                      >
                        {selectedTemplateIdsForBulk.includes(tmpl.id) ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <SquareIcon className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Display Allowed Sizes Badges */}
                      <div className="flex items-center gap-1">
                        {(tmpl.allowedSizes && tmpl.allowedSizes.length > 0
                          ? tmpl.allowedSizes
                          : [tmpl.aspectRatio || '1:1']
                        ).map((size) => (
                          <span
                            key={size}
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono shadow-xs ${
                              size === '1:1'
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : size === '4:5'
                                ? 'bg-blue-600 text-white font-black'
                                : 'bg-purple-600 text-white font-black'
                            }`}
                            title={`अनुमत साईझ: ${size}`}
                          >
                            {size}
                          </span>
                        ))}
                      </div>

                      {tmpl.festivalDate && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-amber-500/90 text-slate-950 rounded flex items-center gap-0.5 shadow-sm">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>{tmpl.festivalDate.slice(5)}</span>
                        </span>
                      )}
                    </div>
                    {tmpl.isTrending && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full flex items-center gap-1 shadow-sm font-black">
                        <Flame className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>

                  <div className="text-center z-10 my-auto">
                    <h5 className="font-black text-sm text-white drop-shadow-md">{tmpl.headline}</h5>
                    <p className="text-[11px] text-slate-200 line-clamp-2 mt-1 drop-shadow">
                      {tmpl.subtext}
                    </p>
                  </div>

                  <div className="z-10 flex items-center justify-between text-[10px] text-white/90 bg-black/60 backdrop-blur-sm p-1.5 rounded-lg border border-white/10">
                    <span className="truncate max-w-[110px]">फ्रेम: {tmpl.defaultFrameId}</span>
                    <span className="font-bold text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30 truncate max-w-[130px]">
                      {categories.find(c => c.id === tmpl.category)?.nameMarathi || tmpl.category}
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
                  <div>
                    <h6 className="font-bold text-xs text-white truncate">
                      {tmpl.titleNative || tmpl.title}
                    </h6>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                      <span className="font-mono">ID: {tmpl.id}</span>
                      <span className="text-amber-400 font-semibold">{tmpl.dateBadge || 'Special'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(tmpl)}
                      className="px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      title="एडिट करा व कॅटेगरी बदला (Edit poster & category)"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>एडिट</span>
                    </button>

                    {onOpenInStudio && (
                      <button
                        type="button"
                        onClick={() => onOpenInStudio(tmpl)}
                        className="px-2 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Open in graphic studio editor"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>स्टुडिओ</span>
                      </button>
                    )}

                    {onDuplicateTemplate && (
                      <button
                        type="button"
                        onClick={() => onDuplicateTemplate(tmpl)}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="प्रत बनवा (Duplicate)"
                      >
                        <Copy className="w-3 h-3" />
                        <span>प्रत</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`"${tmpl.titleNative || tmpl.title}" पोस्टर कायमचे हटवायचे आहे का?`)) {
                          onDeleteTemplate(tmpl.id);
                        }
                      }}
                      className="px-2 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Delete poster"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>हटवा</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="p-12 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl space-y-3">
              <Layers className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm font-semibold">
                या कॅटेगरीमध्ये किंवा सर्च क्वेरीमध्ये कोणतेही पोस्टर्स सापडले नाहीत.
              </p>
              <button
                type="button"
                onClick={() => handleOpenCreate(selectedCategory)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>येथे नवीन पोस्ट अपलोड करा</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: CATEGORIES MANAGEMENT TAB */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                placeholder="कॅटेगरी नाव किंवा सण शोधा (उदा. गणेश, दिवाळी, business)..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Categories Grid Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => {
              const postCount = templates.filter(
                (t) =>
                  t.category === cat.id ||
                  t.subCategory === cat.id ||
                  (cat.id === 'ganesh-chaturthi' && (
                    t.id.includes('ganesh') ||
                    t.title.toLowerCase().includes('ganesh') ||
                    (t.titleNative && t.titleNative.includes('गणेश'))
                  ))
              ).length;

              return (
                <div
                  key={cat.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                          {cat.nameMarathi?.charAt(0) || '📂'}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                            {cat.nameMarathi || cat.name}
                          </h5>
                          <span className="text-[11px] text-slate-400 block font-mono">
                            ID: {cat.id}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-black">
                        {postCount} पोस्ट्स
                      </span>
                    </div>

                    {cat.description && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {cat.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-3 text-[11px]">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold capitalize">
                        Group: {cat.group}
                      </span>
                      {cat.name !== cat.nameMarathi && (
                        <span className="text-slate-500 truncate">
                          EN: {cat.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-4 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveSubTab('templates');
                      }}
                      className="px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      title="या कॅटेगरीमधील सर्व पोस्ट्स पहा व एडिट करा"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>पोस्ट्स पहा</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(cat)}
                      className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      title="कॅटेगरीचे नाव किंवा माहिती बदला"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>एडिट</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`कॅटेगरी "${cat.nameMarathi || cat.name}" हटवायची आहे का?`)) {
                          if (onDeleteCategory) onDeleteCategory(cat.id);
                        }
                      }}
                      className="px-2 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      title="कॅटेगरी हटवा"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>हटवा</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TEMPLATE ANALYTICS & HEATMAP */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>सण मागणी व ट्रेंड्स ॲनालिटिक्स (Spike Heatmap)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30">
                <span className="text-xs font-bold text-amber-400">#1 Top Festival</span>
                <div className="text-base font-black text-white mt-1">🪔 गणेश चतुर्थी & शिवजयंती</div>
                <div className="text-xs text-emerald-400 font-bold mt-1">+520% demand spike</div>
                <span className="text-[11px] text-slate-400 block mt-1">54,400 exports</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30">
                <span className="text-xs font-bold text-indigo-400">#1 Business Category</span>
                <div className="text-base font-black text-white mt-1">Jewelry & Real Estate</div>
                <div className="text-xs text-indigo-400 font-bold mt-1">32% export volume</div>
                <span className="text-[11px] text-slate-400 block mt-1">21,900 exports</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-blue-500/30">
                <span className="text-xs font-bold text-blue-400">#1 Story Ratio</span>
                <div className="text-base font-black text-white mt-1">9:16 Status / Reel</div>
                <div className="text-xs text-blue-400 font-bold mt-1">32,100 exports</div>
                <span className="text-[11px] text-slate-400 block mt-1">44% total share</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400">Total Post Shares</span>
                <div className="text-base font-black text-white mt-1">1,24,900+</div>
                <div className="text-xs text-emerald-400 font-bold mt-1">+18.4% this week</div>
                <span className="text-[11px] text-slate-400 block mt-1">Across WhatsApp & FB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: A/B TESTING */}
      {activeSubTab === 'ab_testing' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h4 className="font-bold text-white text-sm">A/B थंबनेल व मजकूर टेस्टिंग इंजिन</h4>
          <p className="text-xs text-slate-400">
            वेगवेगळ्या रंगांची व मजकुराची पोस्ट्स आपोआप टेस्ट करून कोणता पोस्टर जास्त शेअर होतो याचे विश्लेषण.
          </p>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-emerald-300 font-semibold">
            ✓ ऑटोमॅटिक A/B ऑप्टिमायझेशन सुरू आहे: गोल्डन व भगव्या रंगाच्या पोस्ट्सना ७३% जास्त शेअर्स मिळत आहेत.
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <span>{editingCategoryId ? 'कॅटेगरी एडिट करा (Edit Category)' : 'नवीन कॅटेगरी ॲड करा (Add New Category)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  मराठी कॅटेगरी नाव (Marathi Category Name) *
                </label>
                <input
                  type="text"
                  required
                  value={catMarathiInput}
                  onChange={(e) => {
                    setCatMarathiInput(e.target.value);
                    if (!catNameInput) setCatNameInput(e.target.value);
                    if (!catIdInput) {
                      setCatIdInput(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="उदा. 🪔 गणेश चतुर्थी Special, शिवजयंती, इ."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  इंग्रजी नाव (English / Display Name) *
                </label>
                <input
                  type="text"
                  required
                  value={catNameInput}
                  onChange={(e) => setCatNameInput(e.target.value)}
                  placeholder="उदा. Ganesh Chaturthi Special"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    कॅटेगरी Slug / ID (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    value={catIdInput}
                    onChange={(e) => setCatIdInput(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    placeholder="उदा. ganesh-chaturthi"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-amber-300 font-mono outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    विभाग (Group)
                  </label>
                  <select
                    value={catGroupInput}
                    onChange={(e) => setCatGroupInput(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400"
                  >
                    <option value="festivals">🚩 सण व उत्सव (Festivals)</option>
                    <option value="business">🏢 व्यवसाय (Business)</option>
                    <option value="daily">☀️ दैनिक सुविचार (Daily)</option>
                    <option value="special">👑 विशेष / नेते (Special)</option>
                  </select>
                </div>
              </div>

              {/* SIZE AVAILABILITY */}
              <div className="p-3 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-amber-400">
                    साईझ उपलब्धता (SIZE AVAILABILITY) *
                  </label>
                  <span className="text-[10px] text-slate-400">किमान १ आकार आवश्यक</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  या कॅटेगीरीसाठी वापरकर्त्यांना कोणते आकार अनुमत असावेत ते निवडा (Square, Portrait किंवा Vertical):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      catAllowedSizesInput.includes('1:1')
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={catAllowedSizesInput.includes('1:1')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCatAllowedSizesInput((prev) => [...prev, '1:1']);
                        } else {
                          if (catAllowedSizesInput.length <= 1) {
                            alert('किमान एक साईझ निवडलेली असणे आवश्यक आहे!');
                            return;
                          }
                          setCatAllowedSizesInput((prev) => prev.filter((s) => s !== '1:1'));
                        }
                      }}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Square</div>
                      <div className="text-[10px] text-slate-400">1:1 • 1080×1080</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      catAllowedSizesInput.includes('4:5')
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={catAllowedSizesInput.includes('4:5')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCatAllowedSizesInput((prev) => [...prev, '4:5']);
                        } else {
                          if (catAllowedSizesInput.length <= 1) {
                            alert('किमान एक साईझ निवडलेली असणे आवश्यक आहे!');
                            return;
                          }
                          setCatAllowedSizesInput((prev) => prev.filter((s) => s !== '4:5'));
                        }
                      }}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Portrait</div>
                      <div className="text-[10px] text-slate-400">4:5 • 1080×1350</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      catAllowedSizesInput.includes('9:16')
                        ? 'bg-amber-500/10 border-amber-500/60 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={catAllowedSizesInput.includes('9:16')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCatAllowedSizesInput((prev) => [...prev, '9:16']);
                        } else {
                          if (catAllowedSizesInput.length <= 1) {
                            alert('किमान एक साईझ निवडलेली असणे आवश्यक आहे!');
                            return;
                          }
                          setCatAllowedSizesInput((prev) => prev.filter((s) => s !== '9:16'));
                        }
                      }}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Vertical</div>
                      <div className="text-[10px] text-slate-400">9:16 • 1080×1920</div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  वर्णन (Description)
                </label>
                <textarea
                  rows={2}
                  value={catDescInput}
                  onChange={(e) => setCatDescInput(e.target.value)}
                  placeholder="उदा. गणेशोत्सव, गणेश आगमन व आरती शुभेच्छांसाठी सर्वोत्कृष्ट पोस्टर्स"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>कॅटेगरी सेव्ह करा (Save Category)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE / EDIT TEMPLATE FORM */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{editingTemplateId ? 'पोस्टर एडिट करा (Edit Template)' : 'नवीन पोस्ट तयार / अपलोड करा (Upload Post)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Assignment Section */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <label className="block text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Folder className="w-4 h-4" />
                    <span>काेणत्या कॅटेगीरीत सेव करायची (Select Category To Save In) *</span>
                  </label>
                  {editingTemplateId && (
                    isSuperAdmin ? (
                      <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1 shadow-xs">
                        👑 सुपर ॲडमीन: कॅटेगरी बदलण्याची परवानगी सक्रिय
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40 flex items-center gap-1 shadow-xs">
                        🔒 कॅटेगरी फक्त सुपर ॲडमीन बदलू शकतात
                      </span>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <select
                      value={formCategory}
                      disabled={Boolean(editingTemplateId && !isSuperAdmin)}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-xs text-white font-bold outline-none focus:ring-2 focus:ring-amber-400 ${
                        editingTemplateId && !isSuperAdmin
                          ? 'opacity-60 cursor-not-allowed border-slate-700'
                          : 'border-amber-400/50'
                      }`}
                    >
                      {deduplicateCategories(categories).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameMarathi || c.name} ({c.id})
                        </option>
                      ))}
                    </select>
                    {editingTemplateId && !isSuperAdmin && (
                      <p className="text-[10px] text-rose-400 mt-1 font-semibold">
                        🔒 पोस्ट अपलोड झाल्यानंतर कॅटेगरी बदलण्याची परवानगी केवळ सुपर ॲडमीनला आहे.
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      value={formSubCategory}
                      disabled={Boolean(editingTemplateId && !isSuperAdmin)}
                      onChange={(e) => setFormSubCategory(e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-950 border rounded-xl text-xs text-slate-300 font-semibold outline-none ${
                        editingTemplateId && !isSuperAdmin ? 'opacity-60 cursor-not-allowed border-slate-800' : 'border-slate-700'
                      }`}
                    >
                      <option value="festivals">🚩 सण व उत्सव (Festivals)</option>
                      <option value="business">🏢 व्यवसाय (Business)</option>
                      <option value="daily">☀️ दैनिक सुविचार (Daily)</option>
                      <option value="special">👑 नेते व विशेष (Special)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-amber-400">
                  फोटो / इमेज अपलोड (Upload Poster Art)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-3 text-center cursor-pointer bg-slate-900/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {formImageUrl ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={formImageUrl} alt="Upload preview" className="w-14 h-14 object-cover rounded-lg" />
                      <span className="text-xs text-emerald-400 font-bold">✓ फोटो लोड झाला (बदलण्यासाठी क्लिक करा)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-5 h-5 text-amber-400 mx-auto" />
                      <span className="text-xs text-slate-300 block font-semibold">
                        येथे क्लिक करून कॉम्प्युटर/मोबाईलमधून फोटो निवडा
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Native Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">मराठी शीर्षक (Marathi Title) *</label>
                  <input
                    type="text"
                    required
                    value={formTitleNative}
                    onChange={(e) => {
                      setFormTitleNative(e.target.value);
                      if (!formTitle) setFormTitle(e.target.value);
                    }}
                    placeholder="उदा. श्री गणेश चतुर्थी महोत्सव शुभेच्छा"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">सर्च नाव (Search Title) *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="उदा. Ganesh Chaturthi Special Poster"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Background-only / Blank poster toggle */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-300 block">🖼️ फक्त बॅकग्राउंड इमेज / कोरे पोस्टर (Blank Background Poster)</span>
                  <span className="text-[10px] text-slate-400 block">सक्रिय केल्यास पोस्टरवर कोणताही टेक्स्ट, शुभेच्छा किंवा लोगो ऑटोमॅटिक येणार नाही.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsBackgroundOnly}
                    onChange={(e) => {
                      setFormIsBackgroundOnly(e.target.checked);
                      if (e.target.checked) {
                        setFormHeadline('');
                        setFormSubtext('');
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Headline & Subtext (Disabled if Blank Background) */}
              {!formIsBackgroundOnly && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-300">
                        मुख्य हेडलाईन (Headline on Poster - ऐच्छिक/Optional)
                      </label>
                      {formHeadline && (
                        <button
                          type="button"
                          onClick={() => setFormHeadline('')}
                          className="text-[10px] text-rose-400 hover:underline"
                        >
                          मजकूर पुसा (Clear)
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formHeadline}
                      onChange={(e) => setFormHeadline(e.target.value)}
                      placeholder="रिकामे ठेवल्यास पोस्टरवर कोणताही टेक्स्ट येणार नाही"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-300">
                        उपशीर्षक / सदिच्छा मजकूर (Subtext - ऐच्छिक/Optional)
                      </label>
                      {formSubtext && (
                        <button
                          type="button"
                          onClick={() => setFormSubtext('')}
                          className="text-[10px] text-rose-400 hover:underline"
                        >
                          मजकूर पुसा (Clear)
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={formSubtext}
                      onChange={(e) => setFormSubtext(e.target.value)}
                      placeholder="रिकामे ठेवल्यास पोस्टरवर कोणताही टेक्स्ट येणार नाही"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500"
                    />
                  </div>
                </>
              )}

              {/* 🌟 8-Day Festival Calendar Scheduling & Assignment */}
              <div className="p-3.5 bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                        <span>सणाची तारीख व कॅलेंडर शेड्युलिंग (Festival Date Assignment)</span>
                        <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                          कॅलेंडर सिंक
                        </span>
                      </label>
                      <p className="text-[10px] text-slate-400">
                        येथे तारीख सेट केल्यावर वरच्या ८-दिवसीय कॅलेंडरमध्ये ही पोस्ट त्या तारखेखाली आपोआप दिसेल
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      📅 सणाची तारीख (Festival Date)
                    </label>
                    <input
                      type="date"
                      value={formFestivalDate}
                      onChange={(e) => {
                        const d = e.target.value;
                        setFormFestivalDate(d);
                        if (d === '2026-09-14') {
                          setFormFestivalNames('गणेश चतुर्थी, हरतालिका');
                          setFormDateBadge('14 सप्टें • गणेश चतुर्थी व हरतालिका');
                        } else if (d === '2026-09-15') {
                          setFormFestivalNames('ऋषी पंचमी');
                          setFormDateBadge('15 सप्टें • ऋषी पंचमी');
                        } else if (d === '2026-09-16') {
                          setFormFestivalNames('गौरी आवाहन');
                          setFormDateBadge('16 सप्टें • गौरी आगमन');
                        } else if (d === '2026-09-17') {
                          setFormFestivalNames('गौरी पूजन');
                          setFormDateBadge('17 सप्टें • गौरी पूजन');
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-amber-500/30 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      🏷️ सणाचे नाव / टॅग (उदा. गणेश चतुर्थी, हरतालिका)
                    </label>
                    <input
                      type="text"
                      value={formFestivalNames}
                      onChange={(e) => setFormFestivalNames(e.target.value)}
                      placeholder="उदा. गणेश चतुर्थी, हरतालिका"
                      className="w-full px-3 py-2 bg-slate-950 border border-amber-500/30 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Date Presets */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1.5">
                    ⚡ आगामी ८ दिवसांचे जलद पर्याय (Click to Auto-fill Date & Festival):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setFormFestivalDate('2026-09-14');
                        setFormFestivalNames('गणेश चतुर्थी, हरतालिका');
                        setFormDateBadge('14 सप्टें • गणेश चतुर्थी व हरतालिका');
                        setFormCategory('ganesh-chaturthi');
                      }}
                      className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-lg text-[10px] shadow-sm hover:brightness-110 flex items-center gap-1"
                    >
                      <span>🔥 १४ सप्टें (गणेश चतुर्थी + हरतालिका)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormFestivalDate('2026-09-14');
                        setFormFestivalNames('हरतालिका');
                        setFormDateBadge('14 सप्टें • हरतालिका तृतीया');
                        setFormCategory('hartalika');
                      }}
                      className="px-2.5 py-1 bg-pink-600/30 hover:bg-pink-600/40 text-pink-300 border border-pink-500/40 font-bold rounded-lg text-[10px]"
                    >
                      🌸 १४ सप्टें (हरतालिका स्पेशल)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormFestivalDate('2026-09-15');
                        setFormFestivalNames('ऋषी पंचमी');
                        setFormDateBadge('15 सप्टें • ऋषी पंचमी');
                        setFormCategory('rishi-panchami');
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium"
                    >
                      १५ सप्टें (ऋषी पंचमी)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormFestivalDate('2026-09-16');
                        setFormFestivalNames('गौरी आवाहन');
                        setFormDateBadge('16 सप्टें • गौरी आगमन');
                        setFormCategory('gauri-utsav');
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium"
                    >
                      १६ सप्टें (गौरी आगमन)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormFestivalDate('2026-09-17');
                        setFormFestivalNames('गौरी पूजन');
                        setFormDateBadge('17 सप्टें • गौरी पूजन');
                        setFormCategory('gauri-utsav');
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium"
                    >
                      १७ सप्टें (गौरी पूजन)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormFestivalDate('2026-09-10');
                        setFormFestivalNames('आजचे विशेष');
                        setFormDateBadge('10 सप्टें • आजचे विशेष');
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-medium"
                    >
                      १० सप्टें (आज)
                    </button>
                  </div>
                </div>
              </div>

              {/* AVAILABLE SIZES - STRICT THREE-SIZE SYSTEM */}
              <div className="p-3.5 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-amber-400">
                    उपलब्ध साईझ (AVAILABLE SIZES) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    किमान १ आकार आवश्यक (At least 1 required)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  या टेम्पलेटसाठी अनुमत असलेले आकार निवडा (Square 1:1, Portrait 4:5, किंवा Vertical 9:16):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      formAllowedSizes.includes('1:1')
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formAllowedSizes.includes('1:1')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormAllowedSizes((prev) => [...prev, '1:1']);
                        } else {
                          if (formAllowedSizes.length <= 1) {
                            alert('किमान एक साईझ निवडलेली असणे आवश्यक आहे!');
                            return;
                          }
                          setFormAllowedSizes((prev) => prev.filter((s) => s !== '1:1'));
                        }
                      }}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-black">Square</div>
                      <div className="text-[11px] text-slate-400">1:1 • 1080×1080</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      formAllowedSizes.includes('4:5')
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formAllowedSizes.includes('4:5')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormAllowedSizes((prev) => [...prev, '4:5']);
                        } else {
                          if (formAllowedSizes.length <= 1) {
                            alert('किमान एक साईझ निवडलेली असणे आवश्यक आहे!');
                            return;
                          }
                          setFormAllowedSizes((prev) => prev.filter((s) => s !== '4:5'));
                        }
                      }}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-black">Portrait</div>
                      <div className="text-[11px] text-slate-400">4:5 • 1080×1350</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      formAllowedSizes.includes('9:16')
                        ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formAllowedSizes.includes('9:16')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormAllowedSizes((prev) => [...prev, '9:16']);
                        } else {
                          if (formAllowedSizes.length <= 1) {
                            alert('किमान एक साईझ निवडलेली असणे आवश्यक आहे!');
                            return;
                          }
                          setFormAllowedSizes((prev) => prev.filter((s) => s !== '9:16'));
                        }
                      }}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-black">Vertical</div>
                      <div className="text-[11px] text-slate-400">9:16 • 1080×1920</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Ratio & Frame & DateBadge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">तारीख / बॅज (Date Badge)</label>
                  <input
                    type="text"
                    value={formDateBadge}
                    onChange={(e) => setFormDateBadge(e.target.value)}
                    placeholder="उदा. 7 सप्टेंबर • विशेष"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">प्रायमरी आस्पेक्ट रेशिओ (Default Ratio)</label>
                  <select
                    value={formAspectRatio}
                    onChange={(e) => setFormAspectRatio(e.target.value as AspectRatio)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {formAllowedSizes.includes('1:1') && <option value="1:1">Square (1:1 • 1080×1080)</option>}
                    {formAllowedSizes.includes('4:5') && <option value="4:5">Portrait (4:5 • 1080×1350)</option>}
                    {formAllowedSizes.includes('9:16') && <option value="9:16">Vertical (9:16 • 1080×1920)</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">डिफॉल्ट फ्रेम (Frame)</label>
                  <select
                    value={formDefaultFrameId}
                    onChange={(e) => setFormDefaultFrameId(e.target.value as FrameId)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {FRAMES.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Themes */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">रंग थीम निवडा (Color Theme):</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_GRADIENTS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormBgGradient(p.bgGradient);
                        setFormPrimaryColor(p.primaryColor);
                        setFormAccentColor(p.accentColor);
                      }}
                      className={`h-7 rounded-lg bg-gradient-to-r ${p.bgGradient} border ${
                        formBgGradient === p.bgGradient ? 'ring-2 ring-amber-400 border-white' : 'border-slate-700'
                      }`}
                      title={p.name}
                    />
                  ))}
                </div>
              </div>

              {/* Submit / Save Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>बदल सेव्ह करा (Save Post Changes)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BULK SIZE ASSIGNMENT MODAL (Section 16) */}
      {isBulkSizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>घाऊक साईझ बदल (Bulk Size Assignment)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBulkSizeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              निवडलेल्या <strong className="text-amber-400 font-bold">{selectedTemplateIdsForBulk.length}</strong> पोस्टर्ससाठी खालीलपैकी कोणते आकार उपलब्ध करायचे ते निवडा:
            </p>

            <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-3">
              <label className="block text-xs font-black text-amber-400">
                लागू करावयाचे आकार (Apply Sizes) *
              </label>

              <div className="space-y-2">
                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  bulkSizesInput.includes('1:1') ? 'bg-amber-500/15 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={bulkSizesInput.includes('1:1')}
                      onChange={(e) => {
                        if (e.target.checked) setBulkSizesInput(p => [...p, '1:1']);
                        else {
                          if (bulkSizesInput.length <= 1) return alert('किमान एक साईझ आवश्यक आहे!');
                          setBulkSizesInput(p => p.filter(s => s !== '1:1'));
                        }
                      }}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-black text-white">Square</div>
                      <div className="text-[11px] text-slate-400">1:1 • 1080 × 1080 px</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">1:1</span>
                </label>

                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  bulkSizesInput.includes('4:5') ? 'bg-blue-500/15 border-blue-500 text-blue-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={bulkSizesInput.includes('4:5')}
                      onChange={(e) => {
                        if (e.target.checked) setBulkSizesInput(p => [...p, '4:5']);
                        else {
                          if (bulkSizesInput.length <= 1) return alert('किमान एक साईझ आवश्यक आहे!');
                          setBulkSizesInput(p => p.filter(s => s !== '4:5'));
                        }
                      }}
                      className="rounded border-slate-700 text-blue-500 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-black text-white">Portrait</div>
                      <div className="text-[11px] text-slate-400">4:5 • 1080 × 1350 px</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/30">4:5</span>
                </label>

                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  bulkSizesInput.includes('9:16') ? 'bg-purple-500/15 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={bulkSizesInput.includes('9:16')}
                      onChange={(e) => {
                        if (e.target.checked) setBulkSizesInput(p => [...p, '9:16']);
                        else {
                          if (bulkSizesInput.length <= 1) return alert('किमान एक साईझ आवश्यक आहे!');
                          setBulkSizesInput(p => p.filter(s => s !== '9:16'));
                        }
                      }}
                      className="rounded border-slate-700 text-purple-500 focus:ring-purple-500 w-4 h-4"
                    />
                    <div>
                      <div className="text-xs font-black text-white">Vertical</div>
                      <div className="text-[11px] text-slate-400">9:16 • 1080 × 1920 px</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-500/30">9:16</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsBulkSizeModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
              >
                रद्द करा (Cancel)
              </button>
              <button
                type="button"
                onClick={handleApplyBulkSizes}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply Sizes ({selectedTemplateIdsForBulk.length} पोस्ट्सना लागू करा)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

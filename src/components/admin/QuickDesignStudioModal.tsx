import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  Layers,
  Flame,
  Crown,
  Calendar,
  Settings,
  Tag,
  Palette,
  Eye
} from 'lucide-react';
import {
  PosterTemplate,
  CategoryInfo,
  BusinessProfile,
  AspectRatio,
  FrameId,
  AdminRole
} from '../../types';
import { FRAMES } from '../../data/frames';
import { BrandFrameRenderer } from '../BrandFrameRenderer';
import { deduplicateCategories } from '../../utils/categoryUtils';

interface QuickDesignStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PosterTemplate[];
  categories: CategoryInfo[];
  activeProfile: BusinessProfile;
  adminRole?: AdminRole;
  onSaveTemplate: (template: PosterTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate?: (template: PosterTemplate) => void;
  onOpenInStudio?: (template: PosterTemplate) => void;
  onOpenFullAdminModal?: () => void;
}

const PRESET_GRADIENTS = [
  { name: 'Saffron & Gold (भगवा)', bgGradient: 'from-amber-600 via-orange-600 to-red-800', primaryColor: '#f59e0b', accentColor: '#ea580c' },
  { name: 'Royal Crimson (शाही लाल)', bgGradient: 'from-red-900 via-rose-800 to-amber-900', primaryColor: '#e11d48', accentColor: '#fbbf24' },
  { name: 'Deep Emerald (हिरवा)', bgGradient: 'from-emerald-900 via-teal-800 to-slate-950', primaryColor: '#10b981', accentColor: '#34d399' },
  { name: 'Midnight Navy (नेव्ही ब्लू)', bgGradient: 'from-slate-950 via-blue-950 to-indigo-900', primaryColor: '#3b82f6', accentColor: '#60a5fa' },
  { name: 'Royal Purple (जांभळा)', bgGradient: 'from-purple-950 via-indigo-950 to-slate-900', primaryColor: '#a855f7', accentColor: '#c084fc' },
  { name: 'Festive Sunset (सोनेरी सूर्यास्त)', bgGradient: 'from-orange-600 via-amber-500 to-rose-700', primaryColor: '#f59e0b', accentColor: '#fbbf24' },
];

const SAMPLE_SLOGANS = [
  { headline: 'छत्रपती शिवाजी महाराज जयंतीच्या हार्दिक शुभेच्छा!', subtext: 'शौर्य, पराक्रम आणि नीतीमत्तेचे अद्वितीय प्रतीक असलेल्या शिवरायांना मानाचा मुजरा!' },
  { headline: 'महाशिवरात्रीच्या मंगलमय शुभेच्छा!', subtext: 'भगवान शिवाच्या आशीर्वादाने आपल्या जीवनात सुख, समृद्धी आणि शांती लाभो.' },
  { headline: 'होळी आणि धुलीवंदनाच्या रंगीबेरंगी शुभेच्छा!', subtext: 'सप्तरंगांची उधळण, स्नेहाचे बंधन... आपले आयुष्य आनंदाच्या रंगांनी भरून जावो!' },
  { headline: 'गुढीपाडवा व हिंदू नववर्षारंभाच्या हार्दिक शुभेच्छा!', subtext: 'नवे वर्ष, नवा संकल्प, नवी उमेद... सुख-समृद्धीची गुढी उभारा!' },
  { headline: 'शुभ प्रभात • आजचा सुंदर सुविचार', subtext: 'सकारात्मक विचार आणि कठोर परिश्रम हेच यशाची खरी गुरुकिल्ली आहेत.' },
  { headline: 'आमच्या सर्व ग्राहकांना मनःपूर्वक धन्यवाद!', subtext: 'उत्तम दर्जा, विश्वासार्ह सेवा आणि वाजवी दर हीच आमची ओळख.' },
];

export const QuickDesignStudioModal: React.FC<QuickDesignStudioModalProps> = ({
  isOpen,
  onClose,
  templates,
  categories,
  activeProfile,
  adminRole = 'super_admin',
  onSaveTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onOpenInStudio,
  onOpenFullAdminModal,
}) => {
  const isSuperAdmin = adminRole === 'super_admin';
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [savedSuccessAlert, setSavedSuccessAlert] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formTitleNative, setFormTitleNative] = useState('');
  const [formHeadline, setFormHeadline] = useState('');
  const [formSubtext, setFormSubtext] = useState('');
  const [formIsBackgroundOnly, setFormIsBackgroundOnly] = useState(false);
  const [formCategory, setFormCategory] = useState('festivals');
  const [formSubCategory, setFormSubCategory] = useState('shivjayanti');
  const [formDateBadge, setFormDateBadge] = useState('');
  const [formAspectRatio, setFormAspectRatio] = useState<AspectRatio>('1:1');
  const [formDefaultFrameId, setFormDefaultFrameId] = useState<FrameId>('frame-golden-royal');
  const [formIsTrending, setFormIsTrending] = useState(true);
  const [formIsToday, setFormIsToday] = useState(false);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBgGradient, setFormBgGradient] = useState('from-amber-600 via-orange-600 to-red-800');
  const [formPrimaryColor, setFormPrimaryColor] = useState('#f59e0b');
  const [formAccentColor, setFormAccentColor] = useState('#ea580c');
  const [formTextColor, setFormTextColor] = useState('#ffffff');

  if (!isOpen) return null;

  // Handle image upload from local file
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

  // Reset form to blank template
  const handleResetForm = () => {
    setEditingTemplateId(null);
    setFormTitle('');
    setFormTitleNative('');
    setFormHeadline('');
    setFormSubtext('');
    setFormIsBackgroundOnly(false);
    setFormCategory('festivals');
    setFormSubCategory('festivals');
    setFormDateBadge('');
    setFormAspectRatio('1:1');
    setFormDefaultFrameId('frame-golden-royal');
    setFormIsTrending(true);
    setFormIsToday(false);
    setFormImageUrl('');
    setFormBgGradient('from-amber-600 via-orange-600 to-red-800');
    setFormPrimaryColor('#f59e0b');
    setFormAccentColor('#ea580c');
  };

  // Load existing template into form for editing
  const handleStartEdit = (tpl: PosterTemplate) => {
    setEditingTemplateId(tpl.id);
    setFormTitle(tpl.title);
    setFormTitleNative(tpl.titleNative || tpl.title);
    setFormHeadline(tpl.headline || '');
    setFormSubtext(tpl.subtext || '');
    setFormIsBackgroundOnly(!tpl.headline && !tpl.subtext);
    setFormCategory(tpl.category);
    setFormSubCategory(tpl.subCategory || 'custom');
    setFormDateBadge(tpl.dateBadge || '');
    setFormAspectRatio(tpl.aspectRatio || '1:1');
    setFormDefaultFrameId((tpl.defaultFrameId as FrameId) || 'frame-golden-royal');
    setFormIsTrending(tpl.isTrending || false);
    setFormIsToday(tpl.isToday || false);
    setFormImageUrl(tpl.imageUrl || tpl.customBgUrl || '');
    setFormBgGradient(tpl.theme?.bgGradient || 'from-amber-600 via-orange-600 to-red-800');
    setFormPrimaryColor(tpl.theme?.primaryColor || '#f59e0b');
    setFormAccentColor(tpl.theme?.accentColor || '#ea580c');
    setFormTextColor(tpl.theme?.textColor || '#ffffff');
    setActiveTab('upload');
  };

  // Save template handler
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formTitle.trim()) {
      alert('कृपया पोस्टचे शीर्षक (Title) प्रविष्ट करा.');
      return;
    }

    const originalTpl = editingTemplateId ? templates.find(t => t.id === editingTemplateId) : null;

    const tpl: PosterTemplate = {
      ...(originalTpl || {}),
      id: editingTemplateId || `tpl-admin-${Date.now()}`,
      title: formTitle.trim(),
      titleNative: formTitleNative.trim() || formTitle.trim(),
      category: formCategory,
      subCategory: formSubCategory || 'custom',
      dateBadge: formDateBadge.trim() || undefined,
      aspectRatio: formAspectRatio,
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
    setFilterCategory('all');
    setSearchQuery('');
    setSavedSuccessAlert(
      editingTemplateId
        ? `✅ "${tpl.titleNative || tpl.title}" पोस्ट यशस्वीरित्या अपडेट झाली! (गॅलरीमध्ये सुरुवातीला दिसेल)`
        : `🎉 नवीन पोस्ट "${tpl.titleNative || tpl.title}" यशस्वीरित्या अपलोड झाली! ही पोस्ट ॲपच्या सुरुवातीला "नुकतेच अपलोड केलेले" विभागात सर्वात प्रथम दिसेल.`
    );
    setTimeout(() => setSavedSuccessAlert(null), 5000);

    handleResetForm();
    setActiveTab('manage');
  };

  // Filter templates in manage tab (Sorted newest first)
  const filteredTemplates = templates.filter((tpl) => {
    const matchesCat = filterCategory === 'all' || tpl.category === filterCategory;
    const matchesQuery =
      searchQuery === '' ||
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tpl.titleNative && tpl.titleNative.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tpl.headline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-6xl max-h-[94vh] bg-slate-900 border border-slate-700 text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  🎨 ॲडमीन डिझाईन व पोस्टर स्टुडिओ (Post Upload & Edit)
                </h2>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full border border-emerald-500/30">
                  Easy Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                नवीन सण व व्यवसायाचे पोस्टर्स अपलोड करा, मजकूर बदला किंवा तयार डिझाईन्स एका क्लिकमध्ये एडिट करा.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFullAdminModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullAdminModal();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
                title="Open Advanced Settings & Analytics"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>प्रगत ॲडमीन (Advanced)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {savedSuccessAlert && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-200 px-4 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {savedSuccessAlert}
            </span>
            <button
              type="button"
              onClick={() => setSavedSuccessAlert(null)}
              className="text-emerald-400 hover:text-emerald-200 font-black"
            >
              ✕
            </button>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                if (!editingTemplateId) handleResetForm();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {editingTemplateId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingTemplateId ? '✏️ पोस्टर एडिट करा (Edit Mode)' : '➕ नवीन पोस्ट अपलोड करा (Upload Post)'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'manage'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>📁 तयार सर्व पोस्ट्स मॅनेज करा ({templates.length})</span>
            </button>
          </div>

          {activeTab === 'upload' && editingTemplateId && (
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold underline px-2 py-1"
            >
              रद्द करा (नवीन पोस्ट करा)
            </button>
          )}
        </div>

        {/* TAB 1: UPLOAD & EDIT DESIGN FORM */}
        {activeTab === 'upload' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT FORM PANE */}
            <form onSubmit={handleSave} className="lg:col-span-7 space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>१. फोटो किंवा पोस्टर आर्टवर्क अपलोड करा (Image / Artwork)</span>
                  </h3>
                  {formImageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="text-[11px] text-rose-400 hover:underline font-bold"
                    >
                      फोटो काढा (Remove)
                    </button>
                  )}
                </div>

                {/* Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    formImageUrl
                      ? 'border-amber-500/50 bg-amber-500/5'
                      : 'border-slate-700 hover:border-amber-400 hover:bg-slate-900/50'
                  }`}
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
                      <img
                        src={formImageUrl}
                        alt="Uploaded preview"
                        className="w-16 h-16 object-cover rounded-xl border border-amber-400/40 shadow-sm"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-emerald-400 block">
                          ✓ फोटो यशस्वीरित्या लोड झाला!
                        </span>
                        <span className="text-[11px] text-slate-400">
                          दुसरा फोटो निवडण्यासाठी येथे पुन्हा क्लिक करा.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-amber-400 mx-auto" />
                      <p className="text-xs font-bold text-white">
                        तुमच्या कॉम्प्युटर / मोबाईलमधून फोटो अपलोड करा
                      </p>
                      <p className="text-[11px] text-slate-400">
                        PNG, JPG, WebP (शिवाजी महाराज, सण, शुभेच्छा, बॅनर, लोगो)
                      </p>
                    </div>
                  )}
                </div>

                {/* Preset Theme Colors */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                    किंवा आकर्षक सण/रंग थीम निवडा (Color Theme):
                  </label>
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
                        className={`h-8 rounded-xl bg-gradient-to-r ${p.bgGradient} border text-[10px] font-bold truncate px-1 transition-transform hover:scale-105 ${
                          formBgGradient === p.bgGradient ? 'ring-2 ring-amber-400 border-white' : 'border-slate-700'
                        }`}
                        title={p.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* TEXT CONTENT & SLOGAN */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    २. शीर्षक व शुभेच्छा संदेश (Title & Marathi Content)
                  </h3>
                  <span className="text-[10px] text-slate-400">मराठी / हिंदी / इंग्रजी</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      मराठी नाव (Marathi Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitleNative}
                      onChange={(e) => {
                        setFormTitleNative(e.target.value);
                        if (!formTitle) setFormTitle(e.target.value);
                      }}
                      placeholder="उदा. छत्रपती शिवाजी महाराज जयंती"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      सर्च नाव (English/Search Title) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="उदा. Shivjayanti Poster"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Blank Background Toggle */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
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

                {!formIsBackgroundOnly && (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-300">
                          मुख्य हेडलाईन (Main Headline on Poster - ऐच्छिक)
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
                        placeholder="रिकामे ठेवल्यास पोस्टरवर कोणताही मजकूर येणार नाही"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-300">
                          उपशीर्षक / शुभेच्छा संदेश (Subtext / Quotes - ऐच्छिक)
                        </label>
                        <span className="text-[10px] text-amber-400 font-semibold">
                          किंवा खालील सॅम्पल संदेश निवडा:
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={formSubtext}
                        onChange={(e) => setFormSubtext(e.target.value)}
                        placeholder="उदा. आपणास व आपल्या परिवारास सुख-समृद्धी लाभो..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />

                      {/* Ready Sample Slogans */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {SAMPLE_SLOGANS.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormHeadline(s.headline);
                              setFormSubtext(s.subtext);
                            }}
                            className="text-[10px] px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-amber-300 truncate max-w-[220px]"
                          >
                            ⚡ {s.headline}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* CATEGORY, FRAME & RATIO */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  ३. कॅटेगरी, फ्रेम व आस्पेक्ट रेशिओ (Category & Frame)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-300">
                        कॅटेगरी (Category) *
                      </label>
                      {editingTemplateId && (
                        isSuperAdmin ? (
                          <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">
                            👑 सुपर ॲडमीन
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/40">
                            🔒 लॉक
                          </span>
                        )
                      )}
                    </div>
                    <select
                      value={formCategory}
                      disabled={Boolean(editingTemplateId && !isSuperAdmin)}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-medium ${
                        editingTemplateId && !isSuperAdmin ? 'opacity-60 cursor-not-allowed border-slate-800' : 'border-slate-700'
                      }`}
                    >
                      {deduplicateCategories(categories)
                        .filter((c) => c.id !== 'all')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameMarathi || c.name} ({c.id})
                          </option>
                        ))}
                    </select>
                    {editingTemplateId && !isSuperAdmin && (
                      <p className="text-[10px] text-rose-400 mt-1">
                        🔒 पोस्ट अपलोड झाल्यानंतर कॅटेगरी फक्त सुपर ॲडमीन बदलू शकतात.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      आस्पेक्ट रेशिओ (Ratio)
                    </label>
                    <select
                      value={formAspectRatio}
                      onChange={(e) => setFormAspectRatio(e.target.value as AspectRatio)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="1:1">1:1 Square (1080 × 1080 px)</option>
                      <option value="4:5">4:5 Portrait (1080 × 1350 px)</option>
                      <option value="9:16">9:16 Vertical (1080 × 1920 px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      तारीख बॅज (Date / Tag)
                    </label>
                    <input
                      type="text"
                      value={formDateBadge}
                      onChange={(e) => setFormDateBadge(e.target.value)}
                      placeholder="उदा. १९ फेब्रु, दररोज"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      डिफॉल्ट ब्रँड फ्रेम (Brand Frame)
                    </label>
                    <select
                      value={formDefaultFrameId}
                      onChange={(e) => setFormDefaultFrameId(e.target.value as FrameId)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {FRAMES.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.badge})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={formIsTrending}
                        onChange={(e) => setFormIsTrending(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                      />
                      <span>🔥 Trending Poster</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={formIsToday}
                        onChange={(e) => setFormIsToday(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                      />
                      <span>⭐ Today's Special</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SAVE ACTION BUTTON */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  रीसेट करा (Reset)
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingTemplateId ? 'बदल सेव्ह करा (Update Post)' : 'पोस्ट सेव्ह करा व प्रकाशित करा (Publish Post)'}</span>
                </button>
              </div>
            </form>

            {/* RIGHT LIVE PREVIEW PANE */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3 sticky top-0">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>थेट लाइव्ह प्रिव्ह्यू (Live Preview)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded">
                    {formAspectRatio}
                  </span>
                </div>

                {/* Card Canvas Mockup */}
                <div
                  className={`w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800 flex flex-col justify-between p-4 bg-gradient-to-br ${formBgGradient}`}
                  style={{
                    aspectRatio: formAspectRatio === '9:16' ? '9/16' : formAspectRatio === '4:5' ? '4/5' : '1/1',
                  }}
                >
                  {/* Uploaded Background Image if any */}
                  {formImageUrl && (
                    <img
                      src={formImageUrl}
                      alt="Uploaded art"
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  )}

                  {/* Header badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-white font-mono">
                      {formDateBadge || 'शुभ दिन'}
                    </span>
                    {formIsTrending && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>

                  {/* Center Text */}
                  <div className="relative z-10 text-center my-auto px-2">
                    <h4 className="font-black text-base sm:text-lg text-white drop-shadow-md leading-snug">
                      {formHeadline || 'हार्दिक शुभेच्छा'}
                    </h4>
                    <p className="text-xs text-amber-100/90 line-clamp-3 mt-1.5 drop-shadow font-medium">
                      {formSubtext}
                    </p>
                  </div>

                  {/* Simulated Brand Frame Footer */}
                  <div className="relative z-10">
                    <BrandFrameRenderer
                      frameId={formDefaultFrameId}
                      profile={activeProfile}
                      aspectRatio={formAspectRatio}
                      themeColor={formPrimaryColor}
                    />
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-400">
                    ही पोस्ट सर्व युजर्ससाठी होमपेज आणि "{formCategory}" विभागात लगेच दिसेल.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE & EDIT ALL DESIGNS LIST */}
        {activeTab === 'manage' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="पोस्टरचे नाव, सण किंवा हेडलाईन शोधा..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                >
                  <option value="all">सर्व कॅटेगरीज (All Categories)</option>
                  <option value="festivals">सण व उत्सव (Festivals)</option>
                  <option value="business">व्यवसाय (Business)</option>
                  <option value="daily">दैनिक सुविचार (Daily)</option>
                  <option value="special">नेते व विशेष (Special)</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('upload');
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>नवीन जोडा</span>
                </button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-lg"
                >
                  {/* Poster Thumbnail */}
                  <div
                    className={`relative p-4 aspect-square flex flex-col justify-between overflow-hidden bg-gradient-to-br ${
                      tmpl.theme?.bgGradient || 'from-amber-600 to-red-800'
                    }`}
                  >
                    {tmpl.imageUrl && (
                      <img
                        src={tmpl.imageUrl}
                        alt={tmpl.title}
                        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                      />
                    )}

                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-white font-mono">
                        {tmpl.aspectRatio || '1:1'}
                      </span>
                      {tmpl.isTrending && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full flex items-center gap-1 shadow-sm">
                          <Flame className="w-3 h-3" />
                          Trending
                        </span>
                      )}
                    </div>

                    <div className="text-center z-10 my-auto">
                      <h5 className="font-black text-sm text-white drop-shadow-md">
                        {tmpl.headline}
                      </h5>
                      <p className="text-[11px] text-slate-200 line-clamp-2 mt-1 drop-shadow">
                        {tmpl.subtext}
                      </p>
                    </div>

                    <div className="z-10 flex items-center justify-between text-[10px] text-white/80 bg-black/40 backdrop-blur-sm p-1.5 rounded-lg">
                      <span className="truncate max-w-[120px]">फ्रेम: {tmpl.defaultFrameId}</span>
                      <span className="capitalize font-bold text-amber-300">{tmpl.category}</span>
                    </div>
                  </div>

                  {/* Card Bottom Controls */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <h6 className="font-bold text-xs text-white truncate">
                          {tmpl.titleNative || tmpl.title}
                        </h6>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {tmpl.id}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(tmpl)}
                        className="px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Edit poster text, image, category"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>एडिट</span>
                      </button>

                      {onOpenInStudio && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenInStudio(tmpl);
                          }}
                          className="px-2 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                          title="Open in Full Graphic Studio Editor"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>स्टुडिओ</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`खात्री करा: "${tmpl.titleNative || tmpl.title}" पोस्टर हटवायची आहे का?`)) {
                            onDeleteTemplate(tmpl.id);
                          }
                        }}
                        className="px-2 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
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
              <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-300">कोणतेही पोस्टर सापडले नाही</h4>
                <p className="text-xs text-slate-500 mt-1">
                  कृपया सर्च क्वेरी बदला किंवा "नवीन जोडा" वर क्लिक करून नवीन पोस्टर तयार करा.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

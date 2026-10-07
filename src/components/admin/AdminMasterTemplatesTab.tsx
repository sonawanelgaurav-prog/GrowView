import React, { useState, useMemo, useEffect } from 'react';
import { MasterTemplate } from '../../types';
import { 
  ALL_MASTER_TEMPLATES, 
  MASTER_TEMPLATE_STATS,
  DEFAULT_WEDDING_FORM_DATA, 
  DEFAULT_ENGAGEMENT_FORM_DATA, 
  DEFAULT_RESUME_FORM_DATA 
} from '../../data/masterTemplates';
import { MasterTemplateAdminEditorModal } from '../masterTemplates/MasterTemplateAdminEditorModal';
import { MasterTemplateRenderer } from '../masterTemplates/MasterTemplateRenderer';
import { 
  Sparkles, 
  Search, 
  Crown, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Copy, 
  Edit3, 
  Check, 
  X, 
  Filter,
  Layers,
  Heart,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
  RotateCcw,
  Palette,
  Grid,
  List
} from 'lucide-react';

export const AdminMasterTemplatesTab: React.FC = () => {
  // Master Templates state initialized from localStorage if edited
  const [templates, setTemplates] = useState<MasterTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('growview_master_templates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ALL_MASTER_TEMPLATES;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('growview_master_templates', JSON.stringify(templates));
    } catch (e) {}
  }, [templates]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'wedding' | 'engagement' | 'resume'>('all');
  const [selectedPlan, setSelectedPlan] = useState<'all' | 'free' | 'premium'>('all');
  const [atsFilter, setAtsFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<'table' | 'cards'>('table');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Editing Template State (Inline or Modal)
  const [editingTemplate, setEditingTemplate] = useState<MasterTemplate | null>(null);
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);

  // New Template Form State
  const [newTemplate, setNewTemplate] = useState<Partial<MasterTemplate>>({
    id: `WED-${String(templates.length + 1).padStart(3, '0')}`,
    name: 'New Royal Invitation',
    nameMarathi: 'नवीन रॉयल आमंत्रण पत्रिका',
    category: 'wedding',
    subcategory: 'traditional',
    style: 'Traditional Royal',
    layout_type: 'traditional-ganesha',
    font_family: 'Rozha One, sans-serif',
    heading_font: 'Rozha One, serif',
    body_font: 'Poppins, sans-serif',
    primary_color: '#831843',
    secondary_color: '#d97706',
    text_color: '#0f172a',
    bg_color: '#fffbeb',
    supported_sizes: ['A4'],
    is_free: false,
    is_premium: true,
    is_active: true,
    is_ats_friendly: false,
    sort_order: templates.length + 1,
  });

  // Filtered List
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      if (selectedCategory !== 'all' && tpl.category !== selectedCategory) return false;
      if (selectedPlan === 'free' && !tpl.is_free) return false;
      if (selectedPlan === 'premium' && !tpl.is_premium) return false;
      if (atsFilter && !tpl.is_ats_friendly) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const m1 = tpl.id.toLowerCase().includes(q);
        const m2 = tpl.name.toLowerCase().includes(q);
        const m3 = tpl.nameMarathi.toLowerCase().includes(q);
        const m4 = tpl.style.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3 && !m4) return false;
      }
      return true;
    });
  }, [templates, selectedCategory, selectedPlan, atsFilter, searchQuery]);

  // Actions
  const handleToggleFree = (id: string) => {
    setTemplates(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextFree = !t.is_free;
          return {
            ...t,
            is_free: nextFree,
            is_premium: !nextFree,
            updated_at: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const handleToggleActive = (id: string) => {
    setTemplates(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            is_active: !t.is_active,
            updated_at: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const handleDuplicate = (tpl: MasterTemplate) => {
    const newId = `${tpl.category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const duplicate: MasterTemplate = {
      ...tpl,
      id: newId,
      name: `${tpl.name} (Copy)`,
      nameMarathi: `${tpl.nameMarathi} (प्रत)`,
      sort_order: templates.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTemplates(prev => [duplicate, ...prev]);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(`खरोखर "${id}" टेम्पलेट डिलीट करायचे आहे का?`)) return;
    setTemplates(prev => prev.filter(t => t.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  // Bulk Operations
  const handleSelectAll = () => {
    if (selectedIds.length === filteredTemplates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTemplates.map(t => t.id));
    }
  };

  const handleBulkMakeFree = () => {
    if (selectedIds.length === 0) return;
    setTemplates(prev =>
      prev.map(t => (selectedIds.includes(t.id) ? { ...t, is_free: true, is_premium: false } : t))
    );
    setSelectedIds([]);
  };

  const handleBulkMakePremium = () => {
    if (selectedIds.length === 0) return;
    setTemplates(prev =>
      prev.map(t => (selectedIds.includes(t.id) ? { ...t, is_free: false, is_premium: true } : t))
    );
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`निवडलेले ${selectedIds.length} टेम्पलेट्स डिलीट करायचे आहेत का?`)) return;
    setTemplates(prev => prev.filter(t => !selectedIds.includes(t.id)));
    setSelectedIds([]);
  };

  const handleResetToFactoryDefaults = () => {
    if (!window.confirm('सर्व बदल रीसेट करून मुळचे १५० डिझाईन्स लोड करायचे आहेत का?')) return;
    setTemplates(ALL_MASTER_TEMPLATES);
    localStorage.removeItem('growview_master_templates');
  };

  // Save inline edit
  const handleSaveEdit = (updated: MasterTemplate) => {
    setTemplates(prev => prev.map(t => (t.id === updated.id ? { ...updated, updated_at: new Date().toISOString() } : t)));
    setEditingTemplate(null);
  };

  // Create new template
  const handleCreateNew = () => {
    if (!newTemplate.name || !newTemplate.id) return;
    const item = newTemplate as MasterTemplate;
    item.created_at = new Date().toISOString();
    item.updated_at = new Date().toISOString();
    setTemplates(prev => [item, ...prev]);
    setIsNewTemplateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">एकूण टेम्पलेट्स</span>
          <span className="text-2xl font-black text-amber-400">{templates.length}</span>
          <span className="text-[10px] text-slate-400 block mt-1">150 Unique Designs</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">विवाह व साखरपुडा</span>
          <span className="text-2xl font-black text-rose-400">
            {templates.filter(t => t.category === 'wedding').length + templates.filter(t => t.category === 'engagement').length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            {templates.filter(t => t.category === 'wedding').length} लग्न • {templates.filter(t => t.category === 'engagement').length} साखरपुडा
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">रेझ्युमे / CV</span>
          <span className="text-2xl font-black text-blue-400">
            {templates.filter(t => t.category === 'resume').length}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-1">
            {templates.filter(t => t.is_ats_friendly).length} ATS FRIENDLY
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">प्लॅन विभागणी</span>
          <span className="text-2xl font-black text-emerald-400">
            {templates.filter(t => t.is_free).length} <span className="text-sm font-normal text-slate-400">Free</span> / {templates.filter(t => t.is_premium).length} <span className="text-sm font-normal text-amber-400">VIP</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">35 Free / 115 VIP Standard</span>
        </div>
      </div>

      {/* Control & Filter Strip */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            सर्व ({templates.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('wedding')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'wedding' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            लग्नपत्रिका ({templates.filter(t => t.category === 'wedding').length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('engagement')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'engagement' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            साखरपुडा ({templates.filter(t => t.category === 'engagement').length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('resume')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'resume' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            रेझ्युमे ({templates.filter(t => t.category === 'resume').length})
          </button>
        </div>

        {/* Right Tools: Plan Pill, Search, Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Plan filter */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setSelectedPlan('all')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${selectedPlan === 'all' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('free')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${selectedPlan === 'free' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
            >
              Free
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('premium')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${selectedPlan === 'premium' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              VIP
            </button>
          </div>

          {/* ATS Toggle */}
          <button
            type="button"
            onClick={() => setAtsFilter(!atsFilter)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
              atsFilter ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ATS Only</span>
          </button>

          {/* Search Box */}
          <div className="relative w-44">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, name..."
              className="w-full pl-7 pr-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setDisplayMode('table')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer ${
                displayMode === 'table' ? 'bg-slate-900 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="टेबल लिस्ट व्ह्यू"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">टेबल</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('cards')}
              className={`px-2 py-1 rounded-lg flex items-center gap-1 font-bold transition-all cursor-pointer ${
                displayMode === 'cards' ? 'bg-slate-900 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="कार्ड्स प्रिव्ह्यू व्ह्यू"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">कार्ड्स</span>
            </button>
          </div>

          {/* Add New Master Template */}
          <button
            type="button"
            onClick={() => setIsNewTemplateModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>नवीन डिझाईन जोडा</span>
          </button>

          {/* Factory Reset */}
          <button
            type="button"
            onClick={handleResetToFactoryDefaults}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
            title="रीसेट करा (Reset to original 150 designs)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Action Strip (Visible when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <span className="font-bold">{selectedIds.length} टेम्पलेट्स निवडले आहेत</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkMakeFree}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500"
            >
              मोफत (Free) करा
            </button>
            <button
              type="button"
              onClick={handleBulkMakePremium}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
            >
              VIP करा
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500"
            >
              डिलीट करा
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2 py-1 text-slate-400 hover:text-white"
            >
              रद्द
            </button>
          </div>
        </div>
      )}

      {/* Content: Table View vs Visual Cards View */}
      {displayMode === 'table' ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredTemplates.length && filteredTemplates.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                    />
                  </th>
                  <th className="p-3 font-bold">ID</th>
                  <th className="p-3 font-bold">नाव व मराठी नाव</th>
                  <th className="p-3 font-bold">कॅटेगरी</th>
                  <th className="p-3 font-bold">स्टाईल / लेआउट</th>
                  <th className="p-3 font-bold">रंगसंगती</th>
                  <th className="p-3 font-bold">प्लॅन</th>
                  <th className="p-3 font-bold">स्टेटस</th>
                  <th className="p-3 font-bold text-right">कृती (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTemplates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(tpl.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(prev => [...prev, tpl.id]);
                          } else {
                            setSelectedIds(prev => prev.filter(i => i !== tpl.id));
                          }
                        }}
                        className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-white">
                      {tpl.id}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-white leading-tight">{tpl.name}</div>
                      <div className="text-[11px] text-slate-400">{tpl.nameMarathi}</div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold">
                        {tpl.category}
                      </span>
                      {tpl.is_ats_friendly && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                          ATS
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="text-slate-300">{tpl.style}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{tpl.layout_type}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: tpl.primary_color }} title={tpl.primary_color} />
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: tpl.secondary_color }} title={tpl.secondary_color} />
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleFree(tpl.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          tpl.is_free
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                        }`}
                      >
                        {tpl.is_free ? 'FREE' : 'VIP PASS'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(tpl.id)}
                        className="cursor-pointer text-slate-300 hover:text-white"
                        title={tpl.is_active ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'}
                      >
                        {tpl.is_active ? (
                          <span className="text-emerald-400 font-bold text-[11px]">● Active</span>
                        ) : (
                          <span className="text-slate-500 font-bold text-[11px]">○ Inactive</span>
                        )}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingTemplate(tpl)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
                          title="डिझाईन बदला (Drag & Drop Studio)"
                        >
                          <Palette className="w-3.5 h-3.5" />
                          <span>डिझाईन बदला</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(tpl)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 cursor-pointer"
                          title="प्रत बनवा (Duplicate)"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(tpl.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-400 cursor-pointer"
                          title="डिलीट करा (Delete)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Cards View in Admin Panel */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTemplates.map((tpl) => {
            const isResume = tpl.category === 'resume';
            const previewScale = isResume ? 0.36 : 0.42;

            return (
              <div
                key={tpl.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all duration-200"
              >
                {/* Top Info Bar */}
                <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[11px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded-md">
                      {tpl.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 capitalize">
                      {tpl.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFree(tpl.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      tpl.is_free
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950'
                    }`}
                  >
                    {tpl.is_free ? 'FREE' : 'VIP'}
                  </button>
                </div>

                {/* Card Thumbnail / Renderer Preview */}
                <div className="relative h-72 bg-slate-950 overflow-hidden flex items-center justify-center p-2">
                  <div className="pointer-events-none transform origin-center">
                    <MasterTemplateRenderer
                      template={tpl}
                      weddingData={DEFAULT_WEDDING_FORM_DATA}
                      engagementData={DEFAULT_ENGAGEMENT_FORM_DATA}
                      resumeData={DEFAULT_RESUME_FORM_DATA}
                      scale={previewScale}
                    />
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="p-3.5 bg-slate-900 border-t border-slate-800/80 flex flex-col gap-2.5">
                  <div>
                    <div className="font-bold text-white text-xs truncate">{tpl.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{tpl.nameMarathi}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingTemplate(tpl)}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>डिझाईन बदला</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(tpl)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 cursor-pointer"
                      title="प्रत बनवा"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(tpl.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 cursor-pointer"
                      title="डिलीट करा"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Admin Master Template Customizer (Backgrounds, Fonts, Sizes, Layouts, Colors, Live Preview) */}
      {editingTemplate && (
        <MasterTemplateAdminEditorModal
          template={editingTemplate}
          isOpen={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onSaved={(updated) => {
            handleSaveEdit(updated);
          }}
        />
      )}

      {/* Add New Template Modal */}
      {isNewTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-amber-400">नवीन टेम्पलेट तयार करा</h3>
              <button
                type="button"
                onClick={() => setIsNewTemplateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">ID</label>
                  <input
                    type="text"
                    value={newTemplate.id}
                    onChange={(e) => setNewTemplate({ ...newTemplate, id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">कॅटेगरी</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="wedding">Wedding (लग्नपत्रिका)</option>
                    <option value="engagement">Engagement (साखरपुडा)</option>
                    <option value="resume">Resume (बायोडाटा / CV)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">नाव</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">मराठी नाव</label>
                <input
                  type="text"
                  value={newTemplate.nameMarathi}
                  onChange={(e) => setNewTemplate({ ...newTemplate, nameMarathi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={newTemplate.primary_color || '#831843'}
                    onChange={(e) => setNewTemplate({ ...newTemplate, primary_color: e.target.value })}
                    className="w-full h-8 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Secondary Color</label>
                  <input
                    type="color"
                    value={newTemplate.secondary_color || '#d97706'}
                    onChange={(e) => setNewTemplate({ ...newTemplate, secondary_color: e.target.value })}
                    className="w-full h-8 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsNewTemplateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={handleCreateNew}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow-md"
              >
                टेम्पलेट सेव्ह करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

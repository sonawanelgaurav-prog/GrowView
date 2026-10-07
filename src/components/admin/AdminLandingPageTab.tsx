import React, { useState } from 'react';
import {
  LandingPageConfig,
  LandingPageSectionConfig,
  LandingPageAsset,
  LandingPageContent,
  PosterTemplate,
  CategoryInfo,
} from '../../types';
import {
  LayoutTemplate,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Upload,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Edit3,
  Sliders,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { DEFAULT_LANDING_CONFIG } from '../../data/landingPageConfig';

interface AdminLandingPageTabProps {
  config: LandingPageConfig;
  templates: PosterTemplate[];
  categories: CategoryInfo[];
  onSaveConfig: (config: LandingPageConfig) => void;
  onPreviewLandingPage?: () => void;
}

export const AdminLandingPageTab: React.FC<AdminLandingPageTabProps> = ({
  config,
  templates,
  categories,
  onSaveConfig,
  onPreviewLandingPage,
}) => {
  const [localConfig, setLocalConfig] = useState<LandingPageConfig>(config);
  const [activeSubTab, setActiveSubTab] = useState<'sections' | 'content' | 'assets' | 'templates'>('sections');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Section Re-order & Toggle
  const toggleSection = (key: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.key === key ? { ...sec, isEnabled: !sec.isEnabled } : sec
      ),
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...localConfig.sections].sort((a, b) => a.order - b.order);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;

    // Swap order values
    const tempOrder = newSections[index].order;
    newSections[index].order = newSections[targetIdx].order;
    newSections[targetIdx].order = tempOrder;

    setLocalConfig((prev) => ({
      ...prev,
      sections: newSections,
    }));
  };

  // Content Input Handlers
  const handleContentChange = (field: keyof LandingPageContent, value: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value,
      },
    }));
  };

  // Asset Management
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetSection, setNewAssetSection] = useState<string>('hero');

  const handleAddAsset = () => {
    if (!newAssetUrl.trim()) return;
    const newAsset: LandingPageAsset = {
      id: `asset-${Date.now()}`,
      name: newAssetName.trim() || 'Custom Landing Banner',
      url: newAssetUrl.trim(),
      section: newAssetSection as any,
      isVisible: true,
      order: localConfig.assets.length + 1,
      createdAt: new Date().toISOString(),
    };

    setLocalConfig((prev) => ({
      ...prev,
      assets: [...prev.assets, newAsset],
    }));

    setNewAssetName('');
    setNewAssetUrl('');
  };

  const handleDeleteAsset = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      assets: prev.assets.filter((a) => a.id !== id),
    }));
  };

  const handleToggleAssetVisibility = (id: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      assets: prev.assets.map((a) =>
        a.id === id ? { ...a, isVisible: !a.isVisible } : a
      ),
    }));
  };

  // Template Visibility Toggle
  const toggleTemplateVisibility = (templateId: string) => {
    setLocalConfig((prev) => {
      const isHidden = prev.hiddenTemplateIds.includes(templateId);
      return {
        ...prev,
        hiddenTemplateIds: isHidden
          ? prev.hiddenTemplateIds.filter((id) => id !== templateId)
          : [...prev.hiddenTemplateIds, templateId],
      };
    });
  };

  const handleSave = () => {
    onSaveConfig(localConfig);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset landing page configuration to system defaults?')) {
      setLocalConfig(DEFAULT_LANDING_CONFIG);
      onSaveConfig(DEFAULT_LANDING_CONFIG);
    }
  };

  const sortedSections = [...localConfig.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white font-['Outfit']">Landing Page CMS & Builder</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Toggle sections, reorder page hierarchy, update promotional copy, manage media assets, and control template visibility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onPreviewLandingPage && (
            <button
              onClick={onPreviewLandingPage}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" /> Live Preview
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="Reset to Defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {isSavedAlert && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          Landing page changes successfully saved & published!
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('sections')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === 'sections'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Sections Hierarchy ({localConfig.sections.filter((s) => s.isEnabled).length} / {localConfig.sections.length} Active)
        </button>

        <button
          onClick={() => setActiveSubTab('content')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === 'content'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Page Copy & Text
        </button>

        <button
          onClick={() => setActiveSubTab('assets')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === 'assets'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Media & Banners ({localConfig.assets.length})
        </button>

        <button
          onClick={() => setActiveSubTab('templates')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeSubTab === 'templates'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Template Visibility ({templates.length - localConfig.hiddenTemplateIds.length} Visible)
        </button>
      </div>

      {/* SUB-TAB 1: SECTIONS HIERARCHY & REORDER */}
      {activeSubTab === 'sections' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-3">
          <p className="text-xs text-slate-400 mb-4">
            Toggle sections ON/OFF to control their visibility on the live landing page. Use the UP/DOWN arrows to change the vertical section order.
          </p>

          <div className="space-y-2">
            {sortedSections.map((section, idx) => (
              <div
                key={section.key}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  section.isEnabled
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-800">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{section.name}</h4>
                    {section.nameMarathi && (
                      <p className="text-xs text-slate-400 font-['Noto_Sans_Devanagari']">
                        {section.nameMarathi}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Move Up/Down */}
                  <button
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-300 border border-slate-700"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === sortedSections.length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 disabled:opacity-30 text-slate-300 border border-slate-700"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Toggle ON/OFF */}
                  <button
                    onClick={() => toggleSection(section.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      section.isEnabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {section.isEnabled ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Visible (ON)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Hidden (OFF)
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CONTENT & COPY */}
      {activeSubTab === 'content' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6">
          {/* Hero Content */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Hero Section Headlines</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Primary Headline (English)</label>
                <input
                  type="text"
                  value={localConfig.content.heroHeadline}
                  onChange={(e) => handleContentChange('heroHeadline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Marathi Sub-Headline</label>
                <input
                  type="text"
                  value={localConfig.content.heroHeadlineMarathi || ''}
                  onChange={(e) => handleContentChange('heroHeadlineMarathi', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-400 focus:outline-none font-['Noto_Sans_Devanagari']"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Hero Subtitle (English)</label>
                <textarea
                  rows={2}
                  value={localConfig.content.heroSubtitle}
                  onChange={(e) => handleContentChange('heroSubtitle', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Hero Subtitle (Marathi)</label>
                <textarea
                  rows={2}
                  value={localConfig.content.heroSubtitleMarathi || ''}
                  onChange={(e) => handleContentChange('heroSubtitleMarathi', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-400 focus:outline-none font-['Noto_Sans_Devanagari']"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Primary CTA Button</label>
                <input
                  type="text"
                  value={localConfig.content.heroCtaPrimary}
                  onChange={(e) => handleContentChange('heroCtaPrimary', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Trust Badge Text</label>
                <input
                  type="text"
                  value={localConfig.content.heroBadge}
                  onChange={(e) => handleContentChange('heroBadge', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Support WhatsApp</label>
                <input
                  type="text"
                  value={localConfig.content.supportWhatsApp}
                  onChange={(e) => handleContentChange('supportWhatsApp', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: MEDIA ASSETS */}
      {activeSubTab === 'assets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Add New Landing Page Banner / Graphic</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Asset Title (e.g., Shivjayanti Banner)"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Image URL (https://...)"
                value={newAssetUrl}
                onChange={(e) => setNewAssetUrl(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
              <div className="flex gap-2">
                <select
                  value={newAssetSection}
                  onChange={(e) => setNewAssetSection(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white flex-1"
                >
                  <option value="hero">Hero Mockup</option>
                  <option value="festivalSpecial">Festival Special Banner</option>
                  <option value="businessTemplates">Business Banner</option>
                  <option value="general">General Asset</option>
                </select>
                <button
                  onClick={handleAddAsset}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localConfig.assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-video relative bg-slate-900">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-amber-400 font-mono">
                    {asset.section}
                  </div>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{asset.name}</h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{asset.url}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleAssetVisibility(asset.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Toggle Visibility"
                    >
                      {asset.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TEMPLATE VISIBILITY */}
      {activeSubTab === 'templates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <p className="text-xs text-slate-400">
            Select which templates should appear on the public landing page. Hidden templates will remain available inside the logged-in Poster Editor.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {templates.map((tpl) => {
              const isHidden = localConfig.hiddenTemplateIds.includes(tpl.id);
              const previewImg =
                (tpl as any).thumbnailUrl ||
                tpl.imageUrl ||
                tpl.customBgUrl ||
                (tpl as any).background?.url;

              return (
                <div
                  key={tpl.id}
                  onClick={() => toggleTemplateVisibility(tpl.id)}
                  className={`relative rounded-xl border p-2 cursor-pointer transition-all ${
                    isHidden
                      ? 'bg-slate-950/40 border-slate-800 opacity-40 grayscale'
                      : 'bg-slate-950 border-amber-500/40 ring-1 ring-amber-500/20'
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 relative bg-slate-900">
                    {previewImg ? (
                      <img
                        src={previewImg}
                        alt={tpl.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${
                          tpl.theme?.bgGradient || 'from-amber-950 to-slate-900'
                        } flex items-center justify-center p-2 text-center`}
                      >
                        <span className="text-[10px] font-bold text-white line-clamp-2">
                          {tpl.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80">
                      {isHidden ? (
                        <EyeOff className="w-3 h-3 text-red-400" />
                      ) : (
                        <Check className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-white line-clamp-1">{tpl.title}</p>
                  <span className="text-[9px] text-slate-400">{tpl.category}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

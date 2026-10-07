import React, { useState, useMemo } from 'react';
import { ElementLibraryItem, CanvasCustomElement, ElementAnalyticsStat } from '../../types';
import { INITIAL_ELEMENTS, ELEMENT_CATEGORIES, MOCK_ELEMENT_ANALYTICS } from '../../data/elementsLibrary';
import { ElementRenderer } from '../elements/ElementRenderer';
import {
  Sparkles,
  Plus,
  Search,
  Crown,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Eye,
  EyeOff,
  BarChart2,
  TrendingUp,
  Download,
  Filter,
  Palette,
  Layers,
  Tag,
  Star,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface AdminElementsTabProps {
  customElements?: ElementLibraryItem[];
  onSaveElement?: (element: ElementLibraryItem) => void;
  onDeleteElement?: (elementId: string) => void;
}

export const AdminElementsTab: React.FC<AdminElementsTabProps> = ({
  customElements = [],
  onSaveElement,
  onDeleteElement,
}) => {
  const [elementsList, setElementsList] = useState<ElementLibraryItem[]>([
    ...INITIAL_ELEMENTS,
    ...customElements,
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterPremium, setFilterPremium] = useState<'all' | 'free' | 'premium'>('all');
  const [activeSubView, setActiveSubView] = useState<'library' | 'creator' | 'analytics'>('library');

  // Creator state for creating custom reusable badges/shapes
  const [creatorTitle, setCreatorTitle] = useState('SPECIAL DHAMAKA');
  const [creatorTitleMarathi, setCreatorTitleMarathi] = useState('विशेष धमाका ऑफर');
  const [creatorType, setCreatorType] = useState<'badge' | 'shape' | 'ribbon' | 'photo-frame'>('badge');
  const [creatorCategory, setCreatorCategory] = useState('badges');
  const [creatorText, setCreatorText] = useState('💥 SPECIAL DHAMAKA 💥');
  const [creatorSubtext, setCreatorSubtext] = useState('Limited Period Offer');
  const [creatorFillColor, setCreatorFillColor] = useState('#b91c1c');
  const [creatorStrokeColor, setCreatorStrokeColor] = useState('#fde047');
  const [creatorTextColor, setCreatorTextColor] = useState('#ffffff');
  const [creatorStrokeWidth, setCreatorStrokeWidth] = useState(2);
  const [creatorCornerRadius, setCreatorCornerRadius] = useState(8);
  const [creatorIsPremium, setCreatorIsPremium] = useState(false);
  const [creatorTags, setCreatorTags] = useState('dhamaka, offer, discount, festival');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Edit element modal state
  const [editingElement, setEditingElement] = useState<ElementLibraryItem | null>(null);

  // Filtered elements
  const filteredElements = useMemo(() => {
    return elementsList.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (filterPremium === 'free' && item.isPremium) return false;
      if (filterPremium === 'premium' && !item.isPremium) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchMarathi = item.titleMarathi?.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchCat = item.category.toLowerCase().includes(q);
        return matchTitle || matchMarathi || matchTags || matchCat;
      }
      return true;
    });
  }, [elementsList, selectedCategory, filterPremium, searchQuery]);

  // Handle saving newly created element
  const handleSaveCreatedElement = () => {
    const newElement: ElementLibraryItem = {
      id: `elem-custom-${Date.now()}`,
      title: creatorTitle,
      titleMarathi: creatorTitleMarathi,
      type: creatorType,
      category: creatorCategory,
      isPremium: creatorIsPremium,
      isPublished: true,
      tags: creatorTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      defaultConfig: {
        type: creatorType,
        content: creatorText,
        badgeSubtext: creatorSubtext,
        fillColor: creatorFillColor,
        strokeColor: creatorStrokeColor,
        color: creatorTextColor,
        strokeWidth: creatorStrokeWidth,
        cornerRadius: creatorCornerRadius,
        shadow: true,
        width: 42,
        height: 12,
        fontSize: 16,
        isBold: true,
      },
      usageCount: 0,
      downloadsCount: 0,
    };

    setElementsList((prev) => [newElement, ...prev]);
    if (onSaveElement) onSaveElement(newElement);

    setSaveSuccessMsg('Custom Element created & added to Library successfully!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      setActiveSubView('library');
    }, 1500);
  };

  // Toggle publish
  const handleTogglePublish = (id: string) => {
    setElementsList((prev) =>
      prev.map((el) => (el.id === id ? { ...el, isPublished: !el.isPublished } : el))
    );
  };

  // Toggle premium
  const handleTogglePremium = (id: string) => {
    setElementsList((prev) =>
      prev.map((el) => (el.id === id ? { ...el, isPremium: !el.isPremium } : el))
    );
  };

  // Delete element
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this element from the library?')) {
      setElementsList((prev) => prev.filter((el) => el.id !== id));
      if (onDeleteElement) onDeleteElement(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Elements Library & Creator Studio
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-100">
              {elementsList.length} Total Assets
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage icons, photo frames, shapes, decorative ornaments, badges, ribbons and vector assets
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          <button
            type="button"
            onClick={() => setActiveSubView('library')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubView === 'library'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> All Assets ({elementsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('creator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubView === 'creator'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Custom Creator
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubView === 'analytics'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" /> Element Analytics
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: ALL ASSETS LIBRARY */}
      {activeSubView === 'library' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by asset title, category, tags (e.g. Diya, Sale, WhatsApp)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Category & Premium Filters */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                {ELEMENT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFilterPremium('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    filterPremium === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterPremium('free')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    filterPremium === 'free' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setFilterPremium('premium')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                    filterPremium === 'premium' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  VIP
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveSubView('creator')}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> New Asset
              </button>
            </div>
          </div>

          {/* Elements Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredElements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between hover:shadow-md transition-all relative group"
              >
                {/* VIP / Free Badge */}
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => handleTogglePremium(item.id)}
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                      item.isPremium
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                    title="Click to toggle Free / Premium"
                  >
                    {item.isPremium ? <Crown className="w-2.5 h-2.5 text-amber-600" /> : null}
                    {item.isPremium ? 'VIP' : 'FREE'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(item.id)}
                      className={`p-1 rounded-md text-xs transition-colors ${
                        item.isPublished !== false
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={item.isPublished !== false ? 'Published (Live)' : 'Draft / Unpublished'}
                    >
                      {item.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Vector Thumbnail Preview */}
                <div className="w-full aspect-square bg-slate-50 rounded-lg p-2 flex items-center justify-center border border-slate-100 pointer-events-none mb-2">
                  <div className="w-14 h-14 flex items-center justify-center">
                    <ElementRenderer
                      element={{
                        id: `admin-prev-${item.id}`,
                        x: 50,
                        y: 50,
                        ...item.defaultConfig,
                        type: item.type,
                        content: item.defaultConfig.content || item.title,
                      } as CanvasCustomElement}
                    />
                  </div>
                </div>

                {/* Title & Tags */}
                <div>
                  <h4 className="font-bold text-xs text-slate-900 truncate" title={item.title}>
                    {item.title}
                  </h4>
                  {item.titleMarathi && (
                    <p className="text-[10px] text-slate-500 truncate">{item.titleMarathi}</p>
                  )}
                  <span className="text-[9px] text-indigo-600 font-semibold uppercase tracking-wider block mt-1">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: ADMIN CUSTOM ELEMENT CREATOR */}
      {activeSubView === 'creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Configuration Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                Create New Reusable Asset / Badge
              </h4>
              <span className="text-xs text-slate-500">Live preview on right panel</span>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {saveSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Asset Title (English):
                </label>
                <input
                  type="text"
                  value={creatorTitle}
                  onChange={(e) => setCreatorTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Asset Title (Marathi / Regional):
                </label>
                <input
                  type="text"
                  value={creatorTitleMarathi}
                  onChange={(e) => setCreatorTitleMarathi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Asset Type:</label>
                <select
                  value={creatorType}
                  onChange={(e) => setCreatorType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold"
                >
                  <option value="badge">Badge & Offer Stamp</option>
                  <option value="shape">Geometric Shape</option>
                  <option value="ribbon">Ribbon & Banner</option>
                  <option value="photo-frame">Photo Frame Mask</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category:</label>
                <select
                  value={creatorCategory}
                  onChange={(e) => setCreatorCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold"
                >
                  <option value="badges">Badges & Offers</option>
                  <option value="shapes">Shapes</option>
                  <option value="ribbons">Ribbons & Banners</option>
                  <option value="photo-frames">Photo Frames</option>
                  <option value="festival-icons">Festival & Indian</option>
                  <option value="business-icons">Business</option>
                </select>
              </div>
            </div>

            {/* Badge Content Text */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Main Badge / Element Text:
              </label>
              <input
                type="text"
                value={creatorText}
                onChange={(e) => setCreatorText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Subtext / Tagline (Optional):
              </label>
              <input
                type="text"
                value={creatorSubtext}
                onChange={(e) => setCreatorSubtext(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Fill Color:</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={creatorFillColor}
                    onChange={(e) => setCreatorFillColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={creatorFillColor}
                    onChange={(e) => setCreatorFillColor(e.target.value)}
                    className="w-full text-xs font-mono bg-transparent border-0 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Stroke Color:</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={creatorStrokeColor}
                    onChange={(e) => setCreatorStrokeColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={creatorStrokeColor}
                    onChange={(e) => setCreatorStrokeColor(e.target.value)}
                    className="w-full text-xs font-mono bg-transparent border-0 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Text Color:</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
                  <input
                    type="color"
                    value={creatorTextColor}
                    onChange={(e) => setCreatorTextColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={creatorTextColor}
                    onChange={(e) => setCreatorTextColor(e.target.value)}
                    className="w-full text-xs font-mono bg-transparent border-0 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Stroke Width, Corner Radius & Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Border Width ({creatorStrokeWidth}px):
                </label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={creatorStrokeWidth}
                  onChange={(e) => setCreatorStrokeWidth(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Corner Radius ({creatorCornerRadius}px):
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={creatorCornerRadius}
                  onChange={(e) => setCreatorCornerRadius(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Access Tier:</label>
                <button
                  type="button"
                  onClick={() => setCreatorIsPremium(!creatorIsPremium)}
                  className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    creatorIsPremium
                      ? 'bg-amber-100 border border-amber-300 text-amber-800 shadow-xs'
                      : 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                  }`}
                >
                  {creatorIsPremium ? <Crown className="w-3.5 h-3.5 text-amber-600" /> : null}
                  {creatorIsPremium ? 'VIP Premium Only' : '100% Free Asset'}
                </button>
              </div>
            </div>

            {/* Search Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Search Tags (comma separated):
              </label>
              <input
                type="text"
                value={creatorTags}
                onChange={(e) => setCreatorTags(e.target.value)}
                placeholder="sale, offer, discount, shop, new"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={handleSaveCreatedElement}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Check className="w-4 h-4" /> Save to Elements Library
              </button>
              <button
                type="button"
                onClick={() => setActiveSubView('library')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Right: Live Interactive Vector Preview */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-between text-white relative">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest self-start">
              ★ Live Canvas Preview
            </span>

            <div className="w-full flex-1 flex flex-col items-center justify-center p-6 my-6">
              <div className="w-64 h-24 flex items-center justify-center">
                <ElementRenderer
                  element={{
                    id: 'creator-preview',
                    x: 50,
                    y: 50,
                    type: creatorType,
                    content: creatorText,
                    badgeSubtext: creatorSubtext,
                    fillColor: creatorFillColor,
                    strokeColor: creatorStrokeColor,
                    color: creatorTextColor,
                    strokeWidth: creatorStrokeWidth,
                    cornerRadius: creatorCornerRadius,
                    shadow: true,
                    shadowBlur: 12,
                    fontSize: 18,
                    isBold: true,
                  }}
                />
              </div>
            </div>

            <div className="w-full bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-slate-200">{creatorCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Access:</span>
                <span className="font-semibold text-amber-300">
                  {creatorIsPremium ? 'VIP Premium' : 'Free Tier'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tags:</span>
                <span className="font-semibold text-slate-300 truncate max-w-[180px]">{creatorTags}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: ADMIN ANALYTICS FOR ELEMENTS */}
      {activeSubView === 'analytics' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Total Element Inserts</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">28,430</span>
                <span className="text-xs text-emerald-600 font-bold">+34% this week</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Top Category</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-indigo-600">Badges & Festivals</span>
                <span className="text-xs text-slate-400 font-medium">42% share</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">VIP Element Downloads</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-amber-600">8,920</span>
                <span className="text-xs text-emerald-600 font-bold">+28% conversions</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold block">Average Rating</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">4.9 ★</span>
                <span className="text-xs text-slate-400 font-medium">from 1,420 votes</span>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Most Popular & Used Canvas Elements
              </h4>
              <span className="text-xs text-slate-500">Live Telemetry Data</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Element Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Tier</th>
                    <th className="p-3.5 text-right">Canvas Adds</th>
                    <th className="p-3.5 text-right">Exports / Downloads</th>
                    <th className="p-3.5 text-right">Growth Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {MOCK_ELEMENT_ANALYTICS.map((stat) => (
                    <tr key={stat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{stat.title}</td>
                      <td className="p-3.5 capitalize">{stat.category.replace('-', ' ')}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            stat.isPremium
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {stat.isPremium ? 'VIP Premium' : 'Free'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-semibold">{stat.usageCount.toLocaleString()}</td>
                      <td className="p-3.5 text-right font-semibold text-slate-900">
                        {stat.downloadsCount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-bold text-emerald-600">{stat.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

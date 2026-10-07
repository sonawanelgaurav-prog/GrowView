import React, { useState, useMemo, useRef } from 'react';
import { ElementLibraryItem, CanvasCustomElement } from '../../types';
import { ELEMENT_CATEGORIES, INITIAL_ELEMENTS } from '../../data/elementsLibrary';
import { ElementRenderer } from './ElementRenderer';
import { fileToDataUrl } from '../../utils/imageProcessing';
import {
  Search,
  Star,
  Clock,
  Sparkles,
  Crown,
  Grid,
  Square,
  Image,
  Minus,
  ArrowRight,
  Tag,
  Bookmark,
  Maximize,
  Briefcase,
  Share2,
  Phone,
  Sun,
  Utensils,
  GraduationCap,
  HeartPulse,
  Home,
  Cpu,
  Heart,
  Plus,
  Filter,
  Upload,
  Type,
  Smile,
  Shield,
  Layers,
} from 'lucide-react';

interface ElementsDrawerProps {
  onAddElement: (item: ElementLibraryItem) => void;
  onAddNewText?: () => void;
  onUploadCustomImage?: (dataUrl: string, name?: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  recentElementIds: string[];
  customElementsList?: ElementLibraryItem[];
}

export const ElementsDrawer: React.FC<ElementsDrawerProps> = ({
  onAddElement,
  onAddNewText,
  onUploadCustomImage,
  favorites,
  onToggleFavorite,
  recentElementIds,
  customElementsList = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [onlyPremium, setOnlyPremium] = useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine initial elements with any user/admin created custom elements
  const allElements = useMemo(() => {
    const combined = [...INITIAL_ELEMENTS, ...customElementsList];
    const uniqueMap = new Map<string, ElementLibraryItem>();
    combined.forEach((item) => uniqueMap.set(item.id, item));
    return Array.from(uniqueMap.values());
  }, [customElementsList]);

  // Recently used elements list
  const recentElements = useMemo(() => {
    return recentElementIds
      .map((id) => allElements.find((el) => el.id === id))
      .filter((el): el is ElementLibraryItem => Boolean(el));
  }, [recentElementIds, allElements]);

  // Filtered elements based on search, category, premium, and favorites
  const filteredElements = useMemo(() => {
    return allElements.filter((item) => {
      // Favorites filter
      if (onlyFavorites && !favorites.includes(item.id)) return false;

      // Premium filter
      if (onlyPremium && !item.isPremium) return false;

      // Category filter
      if (activeCategory !== 'all') {
        if (item.category !== activeCategory) return false;
      }

      // Search query filter (search across title, marathi title, category, and tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesMarathi = item.titleMarathi?.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesType = item.type.toLowerCase().includes(query);

        return matchesTitle || matchesMarathi || matchesCategory || matchesTags || matchesType;
      }

      return true;
    });
  }, [allElements, activeCategory, searchQuery, onlyPremium, onlyFavorites, favorites]);

  // Handle direct file upload from drawer
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      if (onUploadCustomImage) {
        onUploadCustomImage(dataUrl, file.name);
      } else {
        // Fallback to onAddElement
        const newItem: ElementLibraryItem = {
          id: `upload-${Date.now()}`,
          title: file.name || 'Uploaded Image',
          titleMarathi: 'अपलोड केलेला फोटो',
          type: 'custom-photo',
          category: 'photos',
          tags: ['upload', 'photo', 'png', 'custom'],
          defaultConfig: {
            type: 'custom-photo',
            imageUrl: dataUrl,
            width: 30,
            height: 30,
            isTransparentBg: file.type.includes('png'),
          },
        };
        onAddElement(newItem);
      }
    } catch (err) {
      console.error('Failed to read image file:', err);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper for category icon
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Square':
        return <Square className="w-3.5 h-3.5" />;
      case 'Image':
        return <Image className="w-3.5 h-3.5" />;
      case 'Minus':
        return <Minus className="w-3.5 h-3.5" />;
      case 'ArrowRight':
        return <ArrowRight className="w-3.5 h-3.5" />;
      case 'Tag':
        return <Tag className="w-3.5 h-3.5" />;
      case 'Bookmark':
        return <Bookmark className="w-3.5 h-3.5" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'Maximize':
        return <Maximize className="w-3.5 h-3.5" />;
      case 'Briefcase':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'Share2':
        return <Share2 className="w-3.5 h-3.5" />;
      case 'Phone':
        return <Phone className="w-3.5 h-3.5" />;
      case 'Sun':
        return <Sun className="w-3.5 h-3.5" />;
      case 'Utensils':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'HeartPulse':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'Home':
        return <Home className="w-3.5 h-3.5" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5" />;
      default:
        return <Grid className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      {/* 1. Quick Creation Hub: New Text + Upload Image + Add Icon */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/90 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          {/* + New Text Button */}
          {onAddNewText && (
            <button
              type="button"
              onClick={onAddNewText}
              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <Type className="w-4 h-4 stroke-[2.5]" />
              <span>+ नवीन मजकूर</span>
            </button>
          )}

          {/* Upload Image / PNG / Photo Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>📸 फोटो / PNG</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="चिन्ह, WhatsApp, दिवा, लोगो शोधा..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Badges (Favorites / Premium / Clear) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 whitespace-nowrap transition-all ${
              onlyFavorites
                ? 'bg-rose-500/20 border border-rose-500 text-rose-300 shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3 h-3 ${onlyFavorites ? 'fill-rose-400 text-rose-400' : ''}`} />
            आवडते ({favorites.length})
          </button>

          <button
            type="button"
            onClick={() => setOnlyPremium(!onlyPremium)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 whitespace-nowrap transition-all ${
              onlyPremium
                ? 'bg-amber-500/20 border border-amber-500 text-amber-300 shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3 h-3 text-amber-400" />
            VIP स्पेशल
          </button>
        </div>
      </div>

      {/* Categories Horizontal Scroller */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-800 bg-slate-950 overflow-x-auto no-scrollbar">
        {ELEMENT_CATEGORIES.map((cat) => {
          const isCurrent = activeCategory === cat.id && !onlyFavorites;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setOnlyFavorites(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Elements Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* 1. Recently Used Section */}
        {!searchQuery && !onlyFavorites && recentElements.length > 0 && activeCategory === 'all' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                नुकतेच वापरलेले (Recently Used)
              </span>
              <span className="text-[10px] text-slate-500">{recentElements.length} आयटम्स</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {recentElements.slice(0, 3).map((item) => (
                <button
                  key={`recent-${item.id}`}
                  type="button"
                  onClick={() => onAddElement(item)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 hover:bg-slate-800/80 transition-all flex flex-col items-center justify-center relative group aspect-square"
                >
                  <div className="w-8 h-8 flex items-center justify-center pointer-events-none mb-1">
                    <ElementRenderer
                      element={{
                        id: `preview-recent-${item.id}`,
                        x: 50,
                        y: 50,
                        ...item.defaultConfig,
                        type: item.type,
                        content: item.defaultConfig.content || item.title,
                      } as CanvasCustomElement}
                    />
                  </div>
                  <span className="text-[9px] font-medium text-slate-300 truncate w-full text-center">
                    {item.titleMarathi || item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Filtered Elements Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              {onlyFavorites
                ? '★ आवडते सेव्ह केलेले स्टिकर्स'
                : activeCategory === 'all'
                ? 'सर्व उपलब्ध स्टिकर्स व आयकॉन्स'
                : ELEMENT_CATEGORIES.find((c) => c.id === activeCategory)?.label}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {filteredElements.length} उपलब्ध
            </span>
          </div>

          {filteredElements.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
              <Sparkles className="w-6 h-6 text-slate-600 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-300">कोणतेही घटक सापडले नाहीत</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setOnlyFavorites(false);
                  setOnlyPremium(false);
                }}
                className="mt-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold rounded-lg hover:bg-amber-500/30 transition-colors"
              >
                फिल्टर रिसेट करा
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredElements.map((item) => {
                const isFav = favorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="group relative bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col items-center justify-between p-2 aspect-square cursor-pointer overflow-hidden"
                    onClick={() => onAddElement(item)}
                  >
                    {/* VIP Premium Badge */}
                    {item.isPremium && (
                      <div className="absolute top-1 left-1 z-10 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded shadow-xs flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" /> VIP
                      </div>
                    )}

                    {/* Favorite Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className="absolute top-1 right-1 z-10 w-5 h-5 rounded-full bg-slate-950/80 text-slate-400 hover:text-rose-400 border border-slate-700 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xs"
                      title={isFav ? 'आवडत्यामधून काढा' : 'आवडत्यामध्ये जोडा'}
                    >
                      <Heart className={`w-2.5 h-2.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Element Vector Preview */}
                    <div className="w-full flex-1 flex items-center justify-center p-1.5 pointer-events-none">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <ElementRenderer
                          element={{
                            id: `preview-${item.id}`,
                            x: 50,
                            y: 50,
                            ...item.defaultConfig,
                            type: item.type,
                            content: item.defaultConfig.content || item.title,
                          } as CanvasCustomElement}
                        />
                      </div>
                    </div>

                    {/* Element Title & Subtext */}
                    <div className="w-full text-center mt-0.5">
                      <span className="font-bold text-[10px] text-slate-200 block truncate">
                        {item.titleMarathi || item.title}
                      </span>
                    </div>

                    {/* Quick Add Overlay on Hover */}
                    <div className="absolute inset-0 bg-amber-500/90 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-slate-950 transition-opacity p-1">
                      <Plus className="w-5 h-5 stroke-[3] mb-0.5" />
                      <span className="text-[10px] font-black">पोस्टरमध्ये जोडा</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  AspectRatio,
  BusinessProfile,
  CanvasCustomElement,
  FrameId,
  PosterTemplate,
  ElementLibraryItem,
  FooterFrameConfig,
  UserAccount,
  getPosterFormatByRatio,
  POSTER_FORMATS,
  UserSubscriptionResolution,
  CategoryInfo,
} from '../types';
import { CATEGORIES } from '../data/categories';
import { deduplicateCategories } from '../utils/categoryUtils';
import {
  exportPosterImage,
  renderPosterDocumentToCanvas,
  PosterRenderDocument,
} from '../utils/canvasRenderer';
import { getAllowedSizesForTemplate } from '../data/sizeSystem';
import { fetchSubscriptionStatus, authorizeExportServerSide } from '../services/subscriptionService';
import confetti from 'canvas-confetti';
import { FRAMES, FOOTER_FRAMES } from '../data/frames';
import { BrandFrameRenderer } from './BrandFrameRenderer';
import { FooterFrameRenderer } from './frames/FooterFrameRenderer';
import { TopRightLogoRenderer } from './frames/TopRightLogoRenderer';
import { FooterFrameDrawer } from './frames/FooterFrameDrawer';
import { MotifGraphics } from './MotifGraphics';
import { ElementRenderer } from './elements/ElementRenderer';
import { ElementsDrawer } from './elements/ElementsDrawer';
import { removeImageBackground, fileToDataUrl } from '../utils/imageProcessing';
import {
  CanvasFloatingToolbar,
  CanvasSelectedTarget,
  TextStyleProps,
  MotifStyleProps,
} from './canvas/CanvasFloatingToolbar';
import { CanvasElementHandles } from './canvas/CanvasElementHandles';
import { CanvasBoundingBox } from './canvas/CanvasBoundingBox';
import { CanvasPropertiesPanel } from './canvas/CanvasPropertiesPanel';
import {
  ArrowLeft,
  Download,
  Sparkles,
  Crown,
  Type,
  Smile,
  Layers,
  Square,
  Smartphone,
  Monitor,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Move,
  Plus,
  Minus,
  Palette,
  Briefcase,
  Upload,
  Check,
  RotateCcw,
  RotateCw,
  ClipboardPaste,
  Edit3,
  CheckCircle2,
  X,
  Wand2,
  Image as ImageIcon,
  Maximize2,
  Shield,
  MousePointer,
  Hand,
  Sliders,
  ChevronDown,
  Share2,
  Folder,
} from 'lucide-react';

export interface PosterEditorExportPayload {
  template: PosterTemplate;
  profile: BusinessProfile;
  frameId: FrameId;
  aspectRatio: AspectRatio;
  showFooter?: boolean;
  headline: string;
  subtext: string;
  quote: string;
  elements: CanvasCustomElement[];
  customBgImage?: string | null;
  customBgGradient?: string;
  companyLogoUrl?: string | null;
  companyLogoPosition?: { x: number; y: number; size: number };
  headlineStyle?: Partial<TextStyleProps>;
  subtextStyle?: Partial<TextStyleProps>;
  quoteStyle?: Partial<TextStyleProps>;
  dateBadgeStyle?: Partial<TextStyleProps>;
  motifStyle?: Partial<MotifStyleProps>;
  footerConfig?: Partial<FooterFrameConfig>;
}

interface PosterEditorProps {
  template: PosterTemplate;
  profile: BusinessProfile;
  initialFrameId?: FrameId;
  initialFrameConfig?: Partial<FooterFrameConfig>;
  onSaveFrameSettings?: (frameId: FrameId, config: Partial<FooterFrameConfig>) => void;
  onBack: () => void;
  onOpenExportModal: (payload: PosterEditorExportPayload) => void;
  onOpenAIModal: () => void;
  currentUser?: UserAccount | null;
  onOpenAdminLogin?: () => void;
  onOpenPricingModal?: () => void;
  onSaveTemplateGlobally?: (updatedTemplate: PosterTemplate) => void;
}

const PRESET_GRADIENTS = [
  { name: 'भगवा व सोनेरी (Saffron & Gold)', bgGradient: 'from-amber-600 via-orange-600 to-red-800', primaryColor: '#f59e0b', accentColor: '#ea580c' },
  { name: 'शाही लाल (Royal Crimson)', bgGradient: 'from-red-900 via-rose-800 to-amber-900', primaryColor: '#e11d48', accentColor: '#fbbf24' },
  { name: 'गडद हिरवा (Deep Emerald)', bgGradient: 'from-emerald-950 via-teal-900 to-slate-950', primaryColor: '#10b981', accentColor: '#34d399' },
  { name: 'नेव्ही ब्लू (Royal Navy)', bgGradient: 'from-slate-950 via-blue-950 to-indigo-900', primaryColor: '#3b82f6', accentColor: '#60a5fa' },
  { name: 'शाही जांभळा (Imperial Purple)', bgGradient: 'from-purple-950 via-indigo-950 to-slate-900', primaryColor: '#a855f7', accentColor: '#c084fc' },
  { name: 'सोनेरी सूर्यास्त (Golden Sunset)', bgGradient: 'from-orange-600 via-amber-500 to-rose-700', primaryColor: '#f59e0b', accentColor: '#fbbf24' },
  { name: 'गडद काळा व सोनेरी (Black & Gold)', bgGradient: 'from-stone-950 via-neutral-900 to-amber-950', primaryColor: '#fbbf24', accentColor: '#d97706' },
  { name: 'तिरंगा पॅट्रियॉटिक (Tricolor Vibe)', bgGradient: 'from-orange-700 via-slate-900 to-emerald-800', primaryColor: '#f97316', accentColor: '#22c55e' },
];

const SAMPLE_MARATHI_WISHES = [
  { label: '🚩 शिवजयंती व उत्सव', headline: '।। जय भवानी जय शिवाजी ।।', subtext: 'शिवरायांच्या पराक्रमाचा व विचारांचा वारसा जपूया! शिवजयंतीच्या हार्दिक शुभेच्छा.' },
  { label: '🌸 सण व सदिच्छा', headline: 'हार्दिक शुभेच्छा!', subtext: 'आपणास व आपल्या परिवारास सुख, समाधान, आरोग्य व ऐश्वर्य लाभो हीच ईश्वरचरणी प्रार्थना!' },
  { label: '☀️ शुभ सकाळ / सुविचार', headline: '।। शुभ प्रभात • सुंदर दिवस ।।', subtext: 'सकारात्मक विचारांची सुरुवात करा, यशाची नवी शिखरे सर करा! आपला दिवस आनंदी जावो.' },
  { label: '🛍️ बिझनेस विशेष ऑफर', headline: 'भव्य डिस्काउंट ऑफर • Grand Sale!', subtext: 'सर्वोत्कृष्ट दर्जा आणि वाजवी दर! आजच आमच्या शाखेला भेट द्या.' },
  { label: '🎂 वाढदिवस सदिच्छा', headline: 'वाढदिवसाच्या हार्दिक शुभेच्छा!', subtext: 'आपणास दीर्घायुष्य, उत्तम आरोग्य व उत्तुंग यश लाभो हीच मनःपूर्वक सदिच्छा.' },
];

export const PosterEditor: React.FC<PosterEditorProps> = ({
  template,
  profile,
  initialFrameId,
  initialFrameConfig,
  onSaveFrameSettings,
  onBack,
  onOpenExportModal,
  onOpenAIModal,
  currentUser,
  onOpenAdminLogin,
  onOpenPricingModal,
  onSaveTemplateGlobally,
}) => {
  const isAdmin =
    currentUser?.role === 'admin' ||
    Boolean(currentUser?.adminRole) ||
    currentUser?.email === 'sonawanel.gaurav@gmail.com';

  const [subResolution, setSubResolution] = useState<UserSubscriptionResolution | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchSubscriptionStatus(currentUser?.id || 'usr-guest', currentUser?.email)
      .then((res) => {
        if (isMounted) {
          setSubResolution(res);
        }
      })
      .catch((err) => {
        console.warn('Failed to load subscription status in editor:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const allowedSizes = React.useMemo(() => {
    return getAllowedSizesForTemplate(template.category, template);
  }, [template]);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(() => {
    if (template.aspectRatio && allowedSizes.includes(template.aspectRatio)) {
      return template.aspectRatio;
    }
    return allowedSizes[0] || '1:1';
  });

  useEffect(() => {
    if (!allowedSizes.includes(aspectRatio)) {
      setAspectRatio(allowedSizes[0] || '1:1');
    }
  }, [allowedSizes, aspectRatio]);
  const [selectedFrameId, setSelectedFrameId] = useState<FrameId>(
    initialFrameId ||
      (template.defaultFrameId && template.defaultFrameId.startsWith('footer-')
        ? template.defaultFrameId
        : 'footer-01')
  );

  // Editable Business Profile (5 Fields live synchronization)
  const [editableProfile, setEditableProfile] = useState<BusinessProfile>({
    ...profile,
    ownerName: profile.ownerName || 'गौरव सोनवणे (Gaurav Sonawane)',
    name: profile.name || 'Coreline Digital Graphics',
    designation: profile.designation || 'Founder & Director',
    phone: profile.phone || '+91 98765 43210',
    tagline: profile.tagline || 'सर्व प्रकारचे डिजिटल बॅनर, फ्लेक्स व सोशल मीडिया पोस्टर्स',
  });

  // Footer Frame Configuration & Visibility
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [isQuickDownloading, setIsQuickDownloading] = useState<boolean>(false);
  const [showSafeAreaGuides, setShowSafeAreaGuides] = useState<boolean>(false);
  const [footerConfig, setFooterConfig] = useState<FooterFrameConfig>({
    colorMode: 'auto',
    accentColor: template.theme?.primaryColor || '#f59e0b',
    logoShape: 'rounded',
    logoSize: 46,
    showPersonalName: true,
    showCompanyName: true,
    showDesignation: true,
    showMobileNumber: true,
    showCompanyWork: true,
    arrangement: 'bottom',
    customFontSize: 14,
    isBold: true,
    ...initialFrameConfig,
  });

  // Keep parent in sync when frame or styling is updated
  useEffect(() => {
    if (onSaveFrameSettings) {
      onSaveFrameSettings(selectedFrameId, footerConfig);
    }
  }, [selectedFrameId, footerConfig, onSaveFrameSettings]);
  
  // Base Text Content
  const isSuperAdmin = currentUser?.adminRole === 'super_admin' || currentUser?.role === 'admin';
  const [categoriesList] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem('growview_categories');
      if (saved) return deduplicateCategories(JSON.parse(saved));
    } catch {}
    return CATEGORIES;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(template.category || 'festivals');
  const [isSuperAdminCategoryModalOpen, setIsSuperAdminCategoryModalOpen] = useState(false);

  const [headline, setHeadline] = useState(template.headline);
  const [subtext, setSubtext] = useState(template.subtext);
  const [quote, setQuote] = useState(template.quote || '');
  const [customElements, setCustomElements] = useState<CanvasCustomElement[]>([]);

  // Canva-style Direct Canvas Selection & Inline Editing State
  const [selectedTarget, setSelectedTarget] = useState<CanvasSelectedTarget>(null);
  const [activeInlineEdit, setActiveInlineEdit] = useState<'headline' | 'subtext' | 'quote' | 'dateBadge' | 'custom' | null>(null);
  const dragRafIdRef = useRef<number | null>(null);

  // Undo / Delete history toast
  const [undoToast, setUndoToast] = useState<{ message: string; onUndo: () => void } | null>(null);

  const isCustomBgPoster = Boolean(
    template.isCustomUpload ||
    template.customBgUrl ||
    (template.imageUrl && (template.imageUrl === template.customBgUrl || template.id.startsWith('tpl-admin-') || template.id.startsWith('tpl-custom-')))
  );

  // Base Element Custom Styling with Canva Coordinates
  const [headlineStyle, setHeadlineStyle] = useState<TextStyleProps>({
    color: '#ffffff',
    fontSize: 22,
    isBold: true,
    isItalic: false,
    isUnderline: false,
    fontFamily: "'Yatra One', cursive, sans-serif",
    isHidden: !template.headline || template.headline.trim() === '',
    x: 50,
    y: 52,
    boxWidth: 88,
    align: 'center',
    lineHeight: 1.25,
    shadow: true,
  });

  const [subtextStyle, setSubtextStyle] = useState<TextStyleProps>({
    color: '#fef3c7',
    fontSize: 13,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    fontFamily: "'Baloo 2', sans-serif",
    isHidden: !template.subtext || template.subtext.trim() === '',
    x: 50,
    y: 68,
    boxWidth: 86,
    align: 'center',
    lineHeight: 1.35,
    shadow: true,
  });

  const [quoteStyle, setQuoteStyle] = useState<TextStyleProps>({
    color: '#fde047',
    fontSize: 11,
    isBold: false,
    isItalic: true,
    isUnderline: false,
    fontFamily: "'Kalam', cursive",
    isHidden: !template.quote || template.quote.trim() === '',
    x: 50,
    y: 80,
    boxWidth: 82,
    align: 'center',
    lineHeight: 1.35,
    shadow: true,
  });

  const [dateBadgeStyle, setDateBadgeStyle] = useState({
    text: template.dateBadge || '',
    color: '#fde047',
    isHidden: !template.dateBadge || template.dateBadge.trim() === '',
    x: 50,
    y: 8,
  });

  const [motifStyle, setMotifStyle] = useState<MotifStyleProps>({
    type: template.motifType,
    scale: 1.0,
    primaryColor: template.theme?.primaryColor || '#fbbf24',
    accentColor: template.theme?.accentColor || '#f97316',
    isHidden: isCustomBgPoster || !template.motifType || template.motifType === 'none',
    x: 50,
    y: aspectRatio === '9:16' ? 24 : 30,
  });

  // Active Tool Category Drawer
  const [activeToolTab, setActiveToolTab] = useState<'frames' | 'text' | 'stickers' | 'background' | 'profile'>('frames');
  // Mobile Full-Preview Expand Toggle
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // GrowView SaaS Editor Modes & Panels
  const [editorToolMode, setEditorToolMode] = useState<'select' | 'hand' | 'text'>('select');
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [fileName, setFileName] = useState(template.titleNative || template.title);

  // Top-Right Dedicated Company Logo State (Strictly NULL unless explicitly uploaded/selected)
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [companyLogoPosition, setCompanyLogoPosition] = useState<{ x: number; y: number; size: number }>({
    x: 88,
    y: 10,
    size: 16,
  });

  // Background Removal in progress indicator
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  // Custom Background Gradient & Custom Image
  const [currentBgGradient, setCurrentBgGradient] = useState(template.theme?.bgGradient || 'from-amber-600 via-orange-600 to-red-800');
  const [customBgImage, setCustomBgImage] = useState<string | null>(template.imageUrl || template.customBgUrl || null);

  // Favorites & Recently Used Element IDs
  const [favoriteElementIds, setFavoriteElementIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('growview_favorite_elements') || localStorage.getItem('gopost_favorite_elements');
      return saved ? JSON.parse(saved) : ['shape-circle-gold', 'badge-sale-ribbon', 'icon-diya-om', 'frame-polaroid'];
    } catch {
      return ['shape-circle-gold', 'badge-sale-ribbon', 'icon-diya-om'];
    }
  });

  const [recentElementIds, setRecentElementIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('growview_recent_elements') || localStorage.getItem('gopost_recent_elements');
      return saved ? JSON.parse(saved) : ['icon-whatsapp-brand', 'shape-circle-gold', 'badge-special-offer'];
    } catch {
      return ['icon-whatsapp-brand', 'shape-circle-gold'];
    }
  });

  // Snapping guides state
  const [snapGuideX, setSnapGuideX] = useState<number | null>(null);
  const [snapGuideY, setSnapGuideY] = useState<number | null>(null);

  // Dragging state ref
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragTargetRef = useRef<{
    target: CanvasSelectedTarget;
    startX: number;
    startY: number;
    elX: number;
    elY: number;
  } | null>(null);

  // Undo / Redo History Stack
  const [historyPast, setHistoryPast] = useState<any[]>([]);
  const [historyFuture, setHistoryFuture] = useState<any[]>([]);

  // Resizing state ref
  const isResizingRef = useRef(false);
  const resizeDataRef = useRef<{
    target: CanvasSelectedTarget;
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'e' | 'w';
    startX: number;
    startY: number;
    initialWidth: number;
    initialHeight: number;
    initialFontSize: number;
    initialScale: number;
    initialSize: number;
    initialBoxWidth: number;
  } | null>(null);

  // Clipboard ref for Copy & Paste
  const clipboardRef = useRef<{
    type: 'custom' | 'text' | 'logo';
    element?: CanvasCustomElement;
    textData?: { text: string; style: TextStyleProps };
  } | null>(null);

  // Custom text draft in Text Drawer
  const [customTextDraft, setCustomTextDraft] = useState('');

  const currentFormat = getPosterFormatByRatio(aspectRatio);

  // Synchronize Canonical Live Canvas with Editor Document state
  useEffect(() => {
    if (!previewCanvasRef.current) return;
    const posterDoc: PosterRenderDocument = {
      template,
      profile: editableProfile,
      frameId: selectedFrameId,
      aspectRatio,
      showFooter,
      formatConfig: currentFormat,
      customBgImage,
      customBgGradient: currentBgGradient,
      customElements,
      companyLogoUrl,
      companyLogoPosition,
      headlineStyle: {
        ...headlineStyle,
        text: headlineStyle.isHidden ? '' : headline,
      },
      subtextStyle: {
        ...subtextStyle,
        text: subtextStyle.isHidden ? '' : subtext,
      },
      quoteStyle: {
        ...quoteStyle,
        text: quoteStyle.isHidden ? '' : quote,
      },
      dateBadgeStyle,
      motifStyle,
      footerConfig,
    };

    renderPosterDocumentToCanvas(posterDoc, previewCanvasRef.current).catch((err) => {
      console.error('Live preview canvas render error:', err);
    });
  }, [
    template,
    editableProfile,
    selectedFrameId,
    aspectRatio,
    showFooter,
    currentBgGradient,
    customBgImage,
    customElements,
    companyLogoUrl,
    companyLogoPosition,
    headline,
    headlineStyle,
    subtext,
    subtextStyle,
    quote,
    quoteStyle,
    dateBadgeStyle,
    motifStyle,
    footerConfig,
    currentFormat,
  ]);

  // Save favorites to localStorage
  const handleToggleFavorite = (id: string) => {
    setFavoriteElementIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('growview_favorite_elements', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Add Element from Elements Library
  const handleAddElementFromLibrary = (item: ElementLibraryItem) => {
    pushSnapshot();
    const newId = `elem-${Date.now()}`;
    const newElement: CanvasCustomElement = {
      id: newId,
      x: 50,
      y: 50,
      width: item.defaultConfig.width || 25,
      height: item.defaultConfig.height || 25,
      rotation: 0,
      opacity: 1,
      ...item.defaultConfig,
      type: item.type,
      content: item.defaultConfig.content || item.title,
    };

    setCustomElements((prev) => [...prev, newElement]);
    setSelectedTarget({ type: 'custom', id: newId });

    // Track recently used
    setRecentElementIds((prev) => {
      const updated = [item.id, ...prev.filter((id) => id !== item.id)].slice(0, 12);
      try {
        localStorage.setItem('growview_recent_elements', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Push Snapshot for Undo / Redo History
  const pushSnapshot = () => {
    const snap = {
      customElements: JSON.parse(JSON.stringify(customElements)),
      headline,
      subtext,
      quote,
      headlineStyle: { ...headlineStyle },
      subtextStyle: { ...subtextStyle },
      quoteStyle: { ...quoteStyle },
      dateBadgeStyle: { ...dateBadgeStyle },
      motifStyle: { ...motifStyle },
      companyLogoUrl,
      companyLogoPosition: { ...companyLogoPosition },
      currentBgGradient,
      customBgImage,
    };
    setHistoryPast((prev) => [...prev.slice(-25), snap]);
    setHistoryFuture([]);
  };

  const handleUndo = () => {
    if (historyPast.length === 0) {
      setUndoToast({ message: 'मागे जाण्यासाठी काही बदल शिल्लक नाहीत' });
      return;
    }
    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, -1);

    const currentSnap = {
      customElements: JSON.parse(JSON.stringify(customElements)),
      headline,
      subtext,
      quote,
      headlineStyle: { ...headlineStyle },
      subtextStyle: { ...subtextStyle },
      quoteStyle: { ...quoteStyle },
      dateBadgeStyle: { ...dateBadgeStyle },
      motifStyle: { ...motifStyle },
      companyLogoUrl,
      companyLogoPosition: { ...companyLogoPosition },
      currentBgGradient,
      customBgImage,
    };

    setHistoryFuture((prev) => [currentSnap, ...prev]);
    setHistoryPast(newPast);

    setCustomElements(previous.customElements);
    setHeadline(previous.headline);
    setSubtext(previous.subtext);
    setQuote(previous.quote);
    setHeadlineStyle(previous.headlineStyle);
    setSubtextStyle(previous.subtextStyle);
    setQuoteStyle(previous.quoteStyle);
    setDateBadgeStyle(previous.dateBadgeStyle);
    setMotifStyle(previous.motifStyle);
    setCompanyLogoUrl(previous.companyLogoUrl);
    setCompanyLogoPosition(previous.companyLogoPosition);
    setCurrentBgGradient(previous.currentBgGradient);
    setCustomBgImage(previous.customBgImage);
    setUndoToast({ message: '↩️ पूर्ववत केले (Undo)' });
  };

  const handleRedo = () => {
    if (historyFuture.length === 0) {
      setUndoToast({ message: 'पुढे जाण्यासाठी काही बदल शिल्लक नाहीत' });
      return;
    }
    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);

    const currentSnap = {
      customElements: JSON.parse(JSON.stringify(customElements)),
      headline,
      subtext,
      quote,
      headlineStyle: { ...headlineStyle },
      subtextStyle: { ...subtextStyle },
      quoteStyle: { ...quoteStyle },
      dateBadgeStyle: { ...dateBadgeStyle },
      motifStyle: { ...motifStyle },
      companyLogoUrl,
      companyLogoPosition: { ...companyLogoPosition },
      currentBgGradient,
      customBgImage,
    };

    setHistoryPast((prev) => [...prev, currentSnap]);
    setHistoryFuture(newFuture);

    setCustomElements(next.customElements);
    setHeadline(next.headline);
    setSubtext(next.subtext);
    setQuote(next.quote);
    setHeadlineStyle(next.headlineStyle);
    setSubtextStyle(next.subtextStyle);
    setQuoteStyle(next.quoteStyle);
    setDateBadgeStyle(next.dateBadgeStyle);
    setMotifStyle(next.motifStyle);
    setCompanyLogoUrl(next.companyLogoUrl);
    setCompanyLogoPosition(next.companyLogoPosition);
    setCurrentBgGradient(next.currentBgGradient);
    setCustomBgImage(next.customBgImage);
    setUndoToast({ message: '↪️ पुन्हा केले (Redo)' });
  };

  // Copy Active Element or Text
  const handleCopy = () => {
    if (!selectedTarget) return;
    if (selectedTarget.type === 'custom') {
      const el = customElements.find((item) => item.id === selectedTarget.id);
      if (el) {
        clipboardRef.current = { type: 'custom', element: JSON.parse(JSON.stringify(el)) };
        setUndoToast({ message: `📋 कॉपी केले: "${el.content || el.name || 'घटक'}"` });
      }
    } else if (selectedTarget.type === 'headline') {
      clipboardRef.current = {
        type: 'text',
        textData: { text: headline, style: headlineStyle },
      };
      setUndoToast({ message: `📋 कॉपी केले: "${headline}"` });
    } else if (selectedTarget.type === 'subtext') {
      clipboardRef.current = {
        type: 'text',
        textData: { text: subtext, style: subtextStyle },
      };
      setUndoToast({ message: `📋 कॉपी केले: "${subtext}"` });
    } else if (selectedTarget.type === 'quote') {
      clipboardRef.current = {
        type: 'text',
        textData: { text: quote, style: quoteStyle },
      };
      setUndoToast({ message: `📋 कॉपी केले: "${quote}"` });
    }
  };

  // Paste Active Element or Text
  const handlePaste = () => {
    if (!clipboardRef.current) {
      setUndoToast({ message: '⚠️ आधी काहीतरी कॉपी करा (Ctrl+C)' });
      return;
    }
    pushSnapshot();
    if (clipboardRef.current.type === 'custom' && clipboardRef.current.element) {
      const orig = clipboardRef.current.element;
      const newId = `el-${Date.now()}`;
      const pasted: CanvasCustomElement = {
        ...orig,
        id: newId,
        x: Math.min(90, (orig.x || 50) + 4),
        y: Math.min(90, (orig.y || 50) + 4),
      };
      setCustomElements((prev) => [...prev, pasted]);
      setSelectedTarget({ type: 'custom', id: newId });
      setUndoToast({ message: '📄 घटक पेस्ट झाला!' });
    } else if (clipboardRef.current.type === 'text' && clipboardRef.current.textData) {
      const { text, style } = clipboardRef.current.textData;
      const newId = `txt-${Date.now()}`;
      const pasted: CanvasCustomElement = {
        id: newId,
        type: 'text',
        content: text,
        x: 52,
        y: 48,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        color: style.color,
        isBold: style.isBold,
        isItalic: style.isItalic,
        isUnderline: style.isUnderline,
        align: style.align,
        boxWidth: style.boxWidth,
        shadow: style.shadow,
      };
      setCustomElements((prev) => [...prev, pasted]);
      setSelectedTarget({ type: 'custom', id: newId });
      setActiveInlineEdit('custom');
      setUndoToast({ message: '📄 मजकूर नवीन बॉक्स म्हणून पेस्ट झाला!' });
    }
  };

  // Add Custom Text Box on Canvas with instant typing & selection
  const handleAddNewTextBox = (initialContent?: string) => {
    pushSnapshot();
    const newId = `txt-${Date.now()}`;
    const newEl: CanvasCustomElement = {
      id: newId,
      type: 'text',
      content: initialContent && initialContent.trim() ? initialContent.trim() : 'येथे नवीन मजकूर टाईप करा',
      x: 50,
      y: 42,
      width: 60,
      height: 12,
      boxWidth: 65,
      fontSize: 22,
      color: '#ffffff',
      isBold: true,
      isItalic: false,
      isUnderline: false,
      align: 'center',
      lineHeight: 1.25,
      shadow: true,
      fontFamily: "'Baloo 2', sans-serif",
    };
    setCustomElements((prev) => [...prev, newEl]);
    setSelectedTarget({ type: 'custom', id: newId });
    setActiveInlineEdit('custom');
    setUndoToast({
      message: '✅ नवीन मजकूर जोडला! टाईप करा किंवा ड्रॅग करा.',
    });
  };

  // Start Interactive Resizing from Handles (NW, NE, SE, SW, E, W)
  const handleStartResize = (
    e: React.MouseEvent | React.TouchEvent,
    target: CanvasSelectedTarget,
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'e' | 'w',
    currentProps: {
      width?: number;
      height?: number;
      fontSize?: number;
      scale?: number;
      size?: number;
      boxWidth?: number;
    }
  ) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    resizeDataRef.current = {
      target,
      handle,
      startX: clientX,
      startY: clientY,
      initialWidth: currentProps.width || 25,
      initialHeight: currentProps.height || 25,
      initialFontSize: currentProps.fontSize || 18,
      initialScale: currentProps.scale || 1.0,
      initialSize: currentProps.size || 16,
      initialBoxWidth: currentProps.boxWidth || 60,
    };
  };

  // Upload Custom Image / Logo / Photo to Canvas
  const handleUploadCustomImage = (dataUrl: string, name?: string) => {
    const newId = `img-${Date.now()}`;
    const newEl: CanvasCustomElement = {
      id: newId,
      type: 'custom-photo',
      name: name || 'Uploaded Image',
      imageUrl: dataUrl,
      photoUrl: dataUrl,
      x: 50,
      y: 50,
      width: 32,
      height: 32,
      rotation: 0,
      opacity: 1,
      isTransparentBg: dataUrl.startsWith('data:image/png'),
    };
    setCustomElements((prev) => [...prev, newEl]);
    setSelectedTarget({ type: 'custom', id: newId });
  };

  // AI / Canvas Background Removal Tool
  const handleRemoveBackgroundForSelected = async () => {
    if (!selectedTarget) return;
    if (selectedTarget.type === 'custom') {
      const targetEl = customElements.find((el) => el.id === selectedTarget.id);
      const targetImg = targetEl?.imageUrl || targetEl?.photoUrl;
      if (!targetImg) return;
      setIsProcessingBg(true);
      try {
        const transparentUrl = await removeImageBackground(targetImg, { tolerance: 35, feather: 4 });
        handleUpdateCustomElement({
          originalImageUrl: targetEl?.originalImageUrl || targetImg,
          imageUrl: transparentUrl,
          photoUrl: transparentUrl,
          isTransparentBg: true,
        });
        setUndoToast({
          message: 'बॅकग्राउंड यशस्वीरीत्या काढले!',
          onUndo: () => {
            handleUpdateCustomElement({
              imageUrl: targetEl.originalImageUrl || targetImg,
              photoUrl: targetEl.originalImageUrl || targetImg,
            });
          },
        });
      } catch (err) {
        console.error('BG removal failed:', err);
      } finally {
        setIsProcessingBg(false);
      }
    } else if ((selectedTarget.type as any) === 'companyLogo' && companyLogoUrl) {
      setIsProcessingBg(true);
      try {
        const transparentUrl = await removeImageBackground(companyLogoUrl, { tolerance: 35, feather: 4 });
        setCompanyLogoUrl(transparentUrl);
        setUndoToast({
          message: 'कंपनी लोगोचे बॅकग्राउंड काढले!',
          onUndo: () => {},
        });
      } catch (err) {
        console.error('Logo BG removal failed:', err);
      } finally {
        setIsProcessingBg(false);
      }
    }
  };

  // Restore Original Image before background removal
  const handleRestoreOriginalImage = () => {
    if (selectedTarget?.type === 'custom') {
      const targetEl = customElements.find((el) => el.id === selectedTarget.id);
      if (targetEl?.originalImageUrl) {
        handleUpdateCustomElement({
          imageUrl: targetEl.originalImageUrl,
          photoUrl: targetEl.originalImageUrl,
          originalImageUrl: undefined,
        });
      }
    }
  };

  // Update selected custom element property
  const handleUpdateCustomElement = (updatedFields: Partial<CanvasCustomElement>) => {
    if (!selectedTarget || selectedTarget.type !== 'custom') return;
    const targetId = selectedTarget.id;
    setCustomElements((prev) =>
      prev.map((el) => (el.id === targetId ? { ...el, ...updatedFields } : el))
    );
  };

  // Canva-style Direct Delete Handler (Works for Headline, Subtext, Quote, DateBadge, Motif, Custom Sticker, Company Logo)
  const handleDeleteSelectedTarget = () => {
    if (!selectedTarget) return;

    if (selectedTarget.type === 'headline') {
      const prevVal = headline;
      setHeadlineStyle((prev) => ({ ...prev, isHidden: true }));
      setSelectedTarget(null);
      setActiveInlineEdit(null);
      setUndoToast({
        message: 'मुख्य हेडलाईन डिलीट केली',
        onUndo: () => {
          setHeadline(prevVal);
          setHeadlineStyle((prev) => ({ ...prev, isHidden: false }));
        },
      });
    } else if (selectedTarget.type === 'subtext') {
      const prevVal = subtext;
      setSubtextStyle((prev) => ({ ...prev, isHidden: true }));
      setSelectedTarget(null);
      setActiveInlineEdit(null);
      setUndoToast({
        message: 'सदिच्छा मजकूर डिलीट केला',
        onUndo: () => {
          setSubtext(prevVal);
          setSubtextStyle((prev) => ({ ...prev, isHidden: false }));
        },
      });
    } else if (selectedTarget.type === 'quote') {
      const prevVal = quote;
      setQuoteStyle((prev) => ({ ...prev, isHidden: true }));
      setSelectedTarget(null);
      setActiveInlineEdit(null);
      setUndoToast({
        message: 'स्लोगन डिलीट केले',
        onUndo: () => {
          setQuote(prevVal);
          setQuoteStyle((prev) => ({ ...prev, isHidden: false }));
        },
      });
    } else if (selectedTarget.type === 'dateBadge') {
      setDateBadgeStyle((prev) => ({ ...prev, isHidden: true }));
      setSelectedTarget(null);
      setUndoToast({
        message: 'सण व तारीख बॅज डिलीट केला',
        onUndo: () => setDateBadgeStyle((prev) => ({ ...prev, isHidden: false })),
      });
    } else if (selectedTarget.type === 'motif') {
      setMotifStyle((prev) => ({ ...prev, isHidden: true }));
      setSelectedTarget(null);
      setUndoToast({
        message: 'सणाचा मुख्य लोगो / चिन्ह डिलीट केले (Festival Logo Hidden)',
        onUndo: () => setMotifStyle((prev) => ({ ...prev, isHidden: false })),
      });
    } else if ((selectedTarget.type as any) === 'companyLogo') {
      const prevLogo = companyLogoUrl || editableProfile.logoUrl;
      const prevShow = footerConfig.showCompanyLogo !== false;
      setCompanyLogoUrl('');
      setEditableProfile((prev) => ({ ...prev, logoUrl: '' }));
      setFooterConfig((prev) => ({ ...prev, showCompanyLogo: false }));
      setSelectedTarget(null);
      if (prevLogo) {
        setUndoToast({
          message: 'कंपनी लोगो डिलीट केला (Company Logo Deleted)',
          onUndo: () => {
            setCompanyLogoUrl(prevLogo);
            setEditableProfile((prev) => ({ ...prev, logoUrl: prevLogo }));
            setFooterConfig((prev) => ({ ...prev, showCompanyLogo: prevShow }));
          },
        });
      }
    } else if (selectedTarget.type === 'custom') {
      const targetId = selectedTarget.id;
      const targetEl = customElements.find((el) => el.id === targetId);
      setCustomElements((prev) => prev.filter((el) => el.id !== targetId));
      setSelectedTarget(null);
      if (targetEl) {
        setUndoToast({
          message: 'स्टिकर/घटक डिलीट केला',
          onUndo: () => setCustomElements((prev) => [...prev, targetEl]),
        });
      }
    }
  };

  // Duplicate selected custom element
  const handleDuplicateCustomElement = () => {
    if (!selectedTarget || selectedTarget.type !== 'custom') return;
    const targetId = selectedTarget.id;
    const targetEl = customElements.find((el) => el.id === targetId);
    if (!targetEl) return;

    const cloned: CanvasCustomElement = {
      ...targetEl,
      id: `elem-clone-${Date.now()}`,
      x: Math.min(90, targetEl.x + 4),
      y: Math.min(90, targetEl.y + 4),
    };
    setCustomElements((prev) => [...prev, cloned]);
    setSelectedTarget({ type: 'custom', id: cloned.id });
  };

  // Layer Stacking Ordering
  const handleBringForward = () => {
    if (!selectedTarget || selectedTarget.type !== 'custom') return;
    const targetId = selectedTarget.id;
    setCustomElements((prev) => {
      const idx = prev.findIndex((el) => el.id === targetId);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      return copy;
    });
  };

  const handleSendBackward = () => {
    if (!selectedTarget || selectedTarget.type !== 'custom') return;
    const targetId = selectedTarget.id;
    setCustomElements((prev) => {
      const idx = prev.findIndex((el) => el.id === targetId);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      return copy;
    });
  };

  // Canvas Mouse / Touch Dragging with Snap Guides (Canva Direct Drag)
  const handleStartDragTarget = (
    e: React.MouseEvent | React.TouchEvent,
    target: CanvasSelectedTarget,
    currentX: number,
    currentY: number
  ) => {
    if (!target) return;
    if (target.type === 'custom') {
      const el = customElements.find((item) => item.id === target.id);
      if (el?.isLocked) {
        setSelectedTarget(target);
        return;
      }
    }
    e.stopPropagation();
    setSelectedTarget(target);
    isDraggingRef.current = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragTargetRef.current = {
      target,
      startX: clientX,
      startY: clientY,
      elX: currentX,
      elY: currentY,
    };
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ((!isDraggingRef.current && !isResizingRef.current) || !canvasRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    if (dragRafIdRef.current) cancelAnimationFrame(dragRafIdRef.current);

    dragRafIdRef.current = requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // 1. Resizing logic from handles
      if (isResizingRef.current && resizeDataRef.current) {
        const { target, handle, startX, startY, initialWidth, initialHeight, initialFontSize, initialScale, initialSize, initialBoxWidth } = resizeDataRef.current;
        const deltaX = ((clientX - startX) / rect.width) * 100;
        const deltaY = ((clientY - startY) / rect.height) * 100;

        let factorX = 1;
        let factorY = 1;
        if (handle === 'nw') { factorX = -1; factorY = -1; }
        else if (handle === 'ne') { factorX = 1; factorY = -1; }
        else if (handle === 'sw') { factorX = -1; factorY = 1; }
        else if (handle === 'se') { factorX = 1; factorY = 1; }
        else if (handle === 'w') { factorX = -1; factorY = 0; }
        else if (handle === 'e') { factorX = 1; factorY = 0; }

        const effectiveDelta = (deltaX * factorX + deltaY * factorY) / (handle === 'e' || handle === 'w' ? 1 : 1.4);

        if (target.type === 'custom') {
          const el = customElements.find((item) => item.id === target.id);
          if (el) {
            if (el.type === 'text') {
              const newBoxWidth = Math.max(20, Math.min(96, Math.round(initialBoxWidth + deltaX * factorX)));
              const newFontSize = Math.max(10, Math.min(72, Math.round(initialFontSize + effectiveDelta * 0.4)));
              setCustomElements((prev) =>
                prev.map((item) =>
                  item.id === target.id
                    ? { ...item, boxWidth: newBoxWidth, fontSize: newFontSize }
                    : item
                )
              );
            } else {
              const newW = Math.max(8, Math.min(95, Math.round(initialWidth + effectiveDelta)));
              const aspect = (initialHeight || 1) / (initialWidth || 1);
              const newH = Math.max(8, Math.min(95, Math.round(newW * aspect)));
              setCustomElements((prev) =>
                prev.map((item) =>
                  item.id === target.id
                    ? { ...item, width: newW, height: newH }
                    : item
                )
              );
            }
          }
        } else if ((target.type as any) === 'companyLogo') {
          const newSize = Math.max(8, Math.min(45, Math.round(initialSize + effectiveDelta * 0.5)));
          setCompanyLogoPosition((prev) => ({ ...prev, size: newSize }));
        } else if (target.type === 'motif') {
          const newScale = Math.max(0.4, Math.min(2.5, +(initialScale + effectiveDelta * 0.015).toFixed(2)));
          setMotifStyle((prev) => ({ ...prev, scale: newScale }));
        } else if (target.type === 'headline') {
          const newFontSize = Math.max(12, Math.min(64, Math.round(initialFontSize + effectiveDelta * 0.4)));
          const newBoxWidth = Math.max(30, Math.min(96, Math.round(initialBoxWidth + deltaX * factorX)));
          setHeadlineStyle((prev) => ({ ...prev, fontSize: newFontSize, boxWidth: newBoxWidth }));
        } else if (target.type === 'subtext') {
          const newFontSize = Math.max(9, Math.min(36, Math.round(initialFontSize + effectiveDelta * 0.3)));
          const newBoxWidth = Math.max(30, Math.min(96, Math.round(initialBoxWidth + deltaX * factorX)));
          setSubtextStyle((prev) => ({ ...prev, fontSize: newFontSize, boxWidth: newBoxWidth }));
        } else if (target.type === 'quote') {
          const newFontSize = Math.max(8, Math.min(28, Math.round(initialFontSize + effectiveDelta * 0.3)));
          const newBoxWidth = Math.max(30, Math.min(96, Math.round(initialBoxWidth + deltaX * factorX)));
          setQuoteStyle((prev) => ({ ...prev, fontSize: newFontSize, boxWidth: newBoxWidth }));
        }
        return;
      }

      // 2. Dragging Position logic
      if (!isDraggingRef.current || !dragTargetRef.current) return;

      const deltaX = ((clientX - dragTargetRef.current.startX) / rect.width) * 100;
      const deltaY = ((clientY - dragTargetRef.current.startY) / rect.height) * 100;

      let newX = Math.round(Math.max(5, Math.min(95, dragTargetRef.current.elX + deltaX)));
      let newY = Math.round(Math.max(5, Math.min(95, dragTargetRef.current.elY + deltaY)));

      if (Math.abs(newX - 50) <= 2.5) {
        newX = 50;
        setSnapGuideX(50);
      } else {
        setSnapGuideX(null);
      }

      if (Math.abs(newY - 50) <= 2.5) {
        newY = 50;
        setSnapGuideY(50);
      } else {
        setSnapGuideY(null);
      }

      const { target } = dragTargetRef.current;
      if (target.type === 'custom') {
        setCustomElements((prev) =>
          prev.map((el) => (el.id === target.id ? { ...el, x: newX, y: newY } : el))
        );
      } else if ((target.type as any) === 'companyLogo') {
        setCompanyLogoPosition((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (target.type === 'headline') {
        setHeadlineStyle((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (target.type === 'subtext') {
        setSubtextStyle((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (target.type === 'quote') {
        setQuoteStyle((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (target.type === 'dateBadge') {
        setDateBadgeStyle((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (target.type === 'motif') {
        setMotifStyle((prev) => ({ ...prev, x: newX, y: newY }));
      }
    });
  };

  const handlePointerUp = () => {
    if (dragRafIdRef.current) {
      cancelAnimationFrame(dragRafIdRef.current);
      dragRafIdRef.current = null;
    }
    if (isResizingRef.current) {
      isResizingRef.current = false;
      resizeDataRef.current = null;
      pushSnapshot();
    }
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      dragTargetRef.current = null;
      pushSnapshot();
    }
    setSnapGuideX(null);
    setSnapGuideY(null);
  };

  // Keyboard Shortcuts for Canva Experience (Ctrl+Z, Ctrl+Y, Ctrl+C, Ctrl+V, Delete, Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInputFocused =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if (e.key === 'Escape') {
        setActiveInlineEdit(null);
        setSelectedTarget(null);
        return;
      }

      if (isInputFocused) return;

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      if (
        isCtrlOrCmd &&
        (e.key === 'y' || e.key === 'Y' || ((e.key === 'z' || e.key === 'Z') && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      if (isCtrlOrCmd && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        handleCopy();
        return;
      }

      if (isCtrlOrCmd && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        handlePaste();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedTarget) {
          e.preventDefault();
          pushSnapshot();
          handleDeleteSelectedTarget();
        }
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (selectedTarget) {
          e.preventDefault();
          const step = e.shiftKey ? 3 : 1;
          if (e.key === 'ArrowUp') handleNudgeTarget(0, -step);
          if (e.key === 'ArrowDown') handleNudgeTarget(0, step);
          if (e.key === 'ArrowLeft') handleNudgeTarget(-step, 0);
          if (e.key === 'ArrowRight') handleNudgeTarget(step, 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTarget, customElements, headline, subtext, quote, historyPast, historyFuture]);

  // Precise Nudge Target by dx/dy percentages
  const handleNudgeTarget = (dx: number, dy: number) => {
    if (!selectedTarget) return;
    if (selectedTarget.type === 'custom') {
      setCustomElements((prev) =>
        prev.map((el) =>
          el.id === selectedTarget.id
            ? {
                ...el,
                x: Math.max(5, Math.min(95, (el.x || 50) + dx)),
                y: Math.max(5, Math.min(95, (el.y || 50) + dy)),
              }
            : el
        )
      );
    } else if ((selectedTarget.type as any) === 'companyLogo') {
      setCompanyLogoPosition((prev) => ({
        ...prev,
        x: Math.max(5, Math.min(95, prev.x + dx)),
        y: Math.max(5, Math.min(95, prev.y + dy)),
      }));
    } else if (selectedTarget.type === 'headline') {
      setHeadlineStyle((prev) => ({
        ...prev,
        x: Math.max(5, Math.min(95, (prev.x ?? 50) + dx)),
        y: Math.max(5, Math.min(95, (prev.y ?? 52) + dy)),
      }));
    } else if (selectedTarget.type === 'subtext') {
      setSubtextStyle((prev) => ({
        ...prev,
        x: Math.max(5, Math.min(95, (prev.x ?? 50) + dx)),
        y: Math.max(5, Math.min(95, (prev.y ?? 68) + dy)),
      }));
    } else if (selectedTarget.type === 'quote') {
      setQuoteStyle((prev) => ({
        ...prev,
        x: Math.max(5, Math.min(95, (prev.x ?? 50) + dx)),
        y: Math.max(5, Math.min(95, (prev.y ?? 80) + dy)),
      }));
    } else if (selectedTarget.type === 'dateBadge') {
      setDateBadgeStyle((prev) => ({
        ...prev,
        x: Math.max(5, Math.min(95, (prev.x ?? 50) + dx)),
        y: Math.max(5, Math.min(95, (prev.y ?? 8) + dy)),
      }));
    } else if (selectedTarget.type === 'motif') {
      setMotifStyle((prev) => ({
        ...prev,
        x: Math.max(5, Math.min(95, (prev.x ?? 50) + dx)),
        y: Math.max(5, Math.min(95, (prev.y ?? 30) + dy)),
      }));
    }
  };

  // Window-level mouseup and mousemove for smooth dragging outside bounding box
  useEffect(() => {
    const onWindowMove = (e: MouseEvent | TouchEvent) => {
      if (isDraggingRef.current) {
        handlePointerMove(e);
      }
    };
    const onWindowUp = () => {
      if (isDraggingRef.current) {
        handlePointerUp();
      }
    };

    window.addEventListener('mousemove', onWindowMove);
    window.addEventListener('mouseup', onWindowUp);
    window.addEventListener('touchmove', onWindowMove, { passive: false });
    window.addEventListener('touchend', onWindowUp);

    return () => {
      window.removeEventListener('mousemove', onWindowMove);
      window.removeEventListener('mouseup', onWindowUp);
      window.removeEventListener('touchmove', onWindowMove);
      window.removeEventListener('touchend', onWindowUp);
    };
  }, []);

  // Keyboard shortcut listener (Delete, Backspace, Arrow Keys Nudge)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTarget) return;
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteSelectedTarget();
      } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        if (selectedTarget.type === 'custom') {
          e.preventDefault();
          handleDuplicateCustomElement();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleNudgeTarget(0, e.shiftKey ? -5 : -1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNudgeTarget(0, e.shiftKey ? 5 : 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNudgeTarget(e.shiftKey ? -5 : -1, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNudgeTarget(e.shiftKey ? 5 : 1, 0);
      } else if (e.key === 'Escape') {
        setSelectedTarget(null);
        setActiveInlineEdit(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTarget, customElements]);

  // Clear undo toast after 6 seconds
  useEffect(() => {
    if (!undoToast) return;
    const timer = setTimeout(() => setUndoToast(null), 6000);
    return () => clearTimeout(timer);
  }, [undoToast]);

  const selectedCustomElement =
    selectedTarget && selectedTarget.type === 'custom'
      ? customElements.find((el) => el.id === selectedTarget.id)
      : null;

  // Precise Canvas Dimensions to maintain exact 1:1, 4:5 or 9:16 ratio across Mobile & Desktop
  const getCanvasDimensions = () => {
    if (isMobileExpanded) {
      switch (aspectRatio) {
        case '9:16':
          return 'w-[230px] sm:w-[320px] lg:w-[340px] h-[408px] sm:h-[568px] lg:h-[604px]';
        case '4:5':
          return 'w-[260px] sm:w-[380px] lg:w-[410px] h-[325px] sm:h-[475px] lg:h-[512px]';
        case '1:1':
        default:
          return 'w-[300px] sm:w-[420px] lg:w-[460px] h-[300px] sm:h-[420px] lg:h-[460px]';
      }
    }
    // Default split view: compact on mobile so options panel is spacious, full size on desktop
    switch (aspectRatio) {
      case '9:16':
        return 'w-[155px] sm:w-[240px] md:w-[300px] lg:w-[340px] h-[275px] sm:h-[426px] md:h-[533px] lg:h-[604px]';
      case '4:5':
        return 'w-[185px] sm:w-[280px] md:w-[340px] lg:w-[410px] h-[231px] sm:h-[350px] md:h-[425px] lg:h-[512px]';
      case '1:1':
      default:
        return 'w-[215px] sm:w-[320px] md:w-[380px] lg:w-[460px] h-[215px] sm:h-[320px] md:h-[380px] lg:h-[460px]';
    }
  };

  // Instant 1-Click Fast PNG Export (< 50ms canvas renderer)
  const handleQuickInstantDownload = async (exportFmt: 'png' | 'jpeg' = 'png') => {
    if (isQuickDownloading) return;
    setIsQuickDownloading(true);

    try {
      // Authorize server-side and determine watermark status
      let applyWatermark = subResolution?.needsWatermark ?? false;
      try {
        const auth = await authorizeExportServerSide(currentUser?.id || 'usr-guest', currentUser?.email);
        applyWatermark = auth.needsWatermark;
        if (auth.needsWatermark && !subResolution?.needsWatermark) {
          setSubResolution((prev) => (prev ? { ...prev, needsWatermark: true, freePostersLeft: 0 } : null));
        }
      } catch (authErr) {
        console.warn('Quick export authorization warning:', authErr);
      }

      const posterDoc: PosterRenderDocument = {
        template,
        profile: editableProfile,
        frameId: selectedFrameId,
        aspectRatio,
        showFooter,
        customHeadline: headlineStyle.isHidden ? '' : headline,
        customSubtext: subtextStyle.isHidden ? '' : subtext,
        customQuote: quoteStyle.isHidden ? '' : quote,
        customElements,
        customBgImage,
        customBgGradient: currentBgGradient,
        companyLogoUrl,
        companyLogoPosition,
        headlineStyle,
        subtextStyle,
        quoteStyle,
        dateBadgeStyle,
        motifStyle,
        footerConfig,
        watermark: applyWatermark
          ? {
              enabled: true,
              text: 'GROW VIEW',
              subText: 'FESTIVAL & BUSINESS POSTER MAKER',
            }
          : undefined,
      };

      const result = await exportPosterImage(posterDoc, exportFmt, 0.95);

      // Celebration Confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fde047'],
      });

      const link = document.createElement('a');
      link.download = result.filename;
      link.href = result.dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setUndoToast({
        message: `⚡ ${result.filename} लगेच डाउनलोड झाले!`,
        onUndo: () => {},
      });
    } catch (err) {
      console.error('Instant download failed:', err);
      alert('डाउनलोड करताना त्रुटी आली. कृपया डाऊनलोड / शेअर विंडो वापरून प्रयत्न करा.');
    } finally {
      setIsQuickDownloading(false);
    }
  };

  // 👑 Admin Direct Save for Everyone (Global Template Save)
  const handleAdminGlobalSave = () => {
    const updatedTpl: PosterTemplate = {
      ...template,
      category: selectedCategory || template.category,
      title: fileName || template.title,
      headline: headlineStyle.isHidden ? '' : headline,
      subtext: subtextStyle.isHidden ? '' : subtext,
      quote: quoteStyle.isHidden ? '' : quote,
      aspectRatio,
      defaultFrameId: selectedFrameId,
      imageUrl: customBgImage || template.imageUrl,
      bgImage: customBgImage || template.bgImage,
      bgGradient: currentBgGradient || template.bgGradient,
      theme: {
        bgGradient: currentBgGradient || template.theme?.bgGradient || 'from-slate-900 via-amber-950 to-stone-900',
        primaryColor: footerConfig.accentColor || template.theme?.primaryColor || '#f59e0b',
        accentColor: template.theme?.accentColor || '#fbbf24',
        textColor: headlineStyle.color || template.theme?.textColor || '#ffffff',
        ornamentColor: template.theme?.ornamentColor || '#fde047',
        cardBg: template.theme?.cardBg || 'rgba(20, 20, 30, 0.9)',
      },
      isCustomUpload: true,
      isNew: true,
      isTrending: true,
      createdAt: template.createdAt || (template as any).created_at || new Date().toISOString(),
      created_at: template.createdAt || (template as any).created_at || new Date().toISOString(),
    };

    if (onSaveTemplateGlobally) {
      onSaveTemplateGlobally(updatedTpl);
    }

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {}

    setUndoToast({
      message: `✓ हे पोस्टर "${categoriesList.find(c => c.id === (selectedCategory || template.category))?.nameMarathi || selectedCategory || template.category}" कॅटेगरीमध्ये सर्वांसाठी यशस्वीरित्या सेव्ह झाले!`,
      onUndo: () => {},
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-[#F8F8FC] text-[#18181B] flex flex-col select-none overflow-hidden font-sans"
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
    >
      {/* 1. TOP HEADER BAR: GROWVIEW LOGO, FILE NAME, RATIO, TOOLBAR & PROMINENT EXPORT */}
      <header className="h-14 bg-white border-b border-[#E7E7EE] px-3 sm:px-5 flex items-center justify-between gap-2 shrink-0 z-50 shadow-xs">
        {/* Left: Back button, Logo & File Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#18181B] transition-all flex items-center gap-1 text-xs font-bold border border-slate-200 cursor-pointer shrink-0"
            title="गॅलरीकडे परत जा"
          >
            <ArrowLeft className="w-4 h-4 text-[#635BFF]" />
            <span className="hidden md:inline">मागे</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#635BFF] to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-[#18181B] hidden sm:inline tracking-tight">
              Grow<span className="text-[#635BFF]">View</span>
            </span>
            <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1" />
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="text-xs sm:text-sm font-bold text-[#18181B] bg-transparent hover:bg-slate-50 focus:bg-white px-2 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-[#635BFF] outline-none max-w-[130px] sm:max-w-xs truncate"
              title="फाईलचे नाव बदला"
            />
          </div>
        </div>

        {/* Center: Selection Tool Mode, Undo/Redo & Aspect Ratio */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Active Tool Selector: Pointer (Select) vs Hand (Pan) */}
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setEditorToolMode('select')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                editorToolMode === 'select'
                  ? 'bg-white text-[#635BFF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="सिलेक्ट टूल (Selection Tool - V): मजकूर व इमेज निवडा"
            >
              <MousePointer className="w-3.5 h-3.5" />
              <span>सिलेक्ट</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditorToolMode('hand');
                setSelectedTarget(null);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                editorToolMode === 'hand'
                  ? 'bg-white text-[#635BFF] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हँड टूल (Hand Tool - H): कॅनव्हास हलवा"
            >
              <Hand className="w-3.5 h-3.5" />
              <span>पॅन</span>
            </button>
          </div>

          {/* Aspect Ratio Selector (Strict System Sizes: 1:1, 4:5, 9:16) */}
          {allowedSizes.length > 1 ? (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
              {allowedSizes.includes('1:1') && (
                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    aspectRatio === '1:1'
                      ? 'bg-white text-[#635BFF] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="1080 × 1080 px (Square Post)"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">1:1 Square</span>
                  <span className="sm:hidden">1:1</span>
                </button>
              )}
              {allowedSizes.includes('4:5') && (
                <button
                  type="button"
                  onClick={() => setAspectRatio('4:5')}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    aspectRatio === '4:5'
                      ? 'bg-white text-[#635BFF] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="1080 × 1350 px (Portrait Feed)"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">4:5 Portrait</span>
                  <span className="sm:hidden">4:5</span>
                </button>
              )}
              {allowedSizes.includes('9:16') && (
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    aspectRatio === '9:16'
                      ? 'bg-white text-[#635BFF] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="1080 × 1920 px (Vertical Status / Reels)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">9:16 Vertical</span>
                  <span className="sm:hidden">9:16</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200/60 rounded-xl text-xs font-bold text-indigo-700 shrink-0">
              {aspectRatio === '9:16' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Vertical (1080×1920)</span>
                </>
              ) : aspectRatio === '4:5' ? (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Portrait (1080×1350)</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Square (1080×1080)</span>
                </>
              )}
            </div>
          )}

          {/* Quick Undo / Redo in Header */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyPast.length === 0}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600 hover:text-slate-900 cursor-pointer"
              title="पूर्ववत करा (Undo - Ctrl+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyFuture.length === 0}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-600 hover:text-slate-900 cursor-pointer"
              title="पुन्हा करा (Redo - Ctrl+Y)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: AI, Guides, Prominent Download with Dropdown & Properties */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenAIModal}
            className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-[#635BFF] text-xs font-bold items-center gap-1.5 transition-all cursor-pointer"
            title="AI मजकूर व सदिच्छा तयार करा"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#635BFF] animate-pulse" />
            <span className="hidden lg:inline">AI मजकूर</span>
          </button>

          {/* 👑 Super Admin Category Changer Button */}
          {isSuperAdmin && onSaveTemplateGlobally && (
            <button
              type="button"
              onClick={() => setIsSuperAdminCategoryModalOpen(true)}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="सुपर ॲडमीन: या पोस्टरची कॅटेगरी बदला"
            >
              <Folder className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">कॅटेगरी:</span>
              <span className="max-w-[100px] truncate text-amber-900 font-bold">
                {categoriesList.find(c => c.id === selectedCategory)?.nameMarathi || selectedCategory}
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono">बदला</span>
            </button>
          )}

          {/* 👑 Admin Direct Save for Everyone Option (Only visible to Admin, NEVER to customers) */}
          {isSuperAdmin && onSaveTemplateGlobally && (
            <button
              type="button"
              onClick={handleAdminGlobalSave}
              className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 rounded-xl shadow-md shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer border border-emerald-400/40"
              title="ॲडमिन: हे पोस्टर सर्वांसाठी ॲपमध्ये थेट सेव्ह करा (Save for Everyone)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span className="hidden sm:inline">सर्वांसाठी सेव्ह करा</span>
              <span className="sm:hidden">सेव्ह करा</span>
            </button>
          )}

          {/* ⚡ Prominent Primary Download Button with Dropdown (PNG, JPG, PDF) */}
          <div className="relative">
            <div className="inline-flex rounded-xl shadow-md shadow-[#635BFF]/25 overflow-hidden">
              <button
                type="button"
                onClick={() => handleQuickInstantDownload('png')}
                disabled={isQuickDownloading}
                className="px-3 sm:px-4 py-1.5 bg-[#635BFF] hover:bg-[#5148E5] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                title="लगेच HD PNG डाउनलोड करा"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">डाऊनलोड (Download)</span>
                <span className="sm:hidden">डाऊनलोड</span>
              </button>
              <button
                type="button"
                onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                className="px-2 py-1.5 bg-[#5148E5] hover:bg-[#4338CA] text-white border-l border-white/20 transition-colors cursor-pointer"
                title="फॉर्मेट निवडा (PNG, JPG, PDF)"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Format Dropdown Menu */}
            {downloadDropdownOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-2xl border border-[#E7E7EE] p-1.5 z-50 animate-in fade-in zoom-in-95 text-[#18181B]"
                onClick={() => setDownloadDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => handleQuickInstantDownload('png')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-xs font-bold text-slate-800 hover:text-[#635BFF] flex items-center justify-between"
                >
                  <span>PNG इमेज (उच्च गुणवत्ता)</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">HD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickInstantDownload('jpeg')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-xs font-bold text-slate-800 hover:text-[#635BFF] flex items-center justify-between"
                >
                  <span>JPG फोटो (कमी साईझ)</span>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">JPG</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenExportModal({
                      template,
                      profile: editableProfile,
                      frameId: selectedFrameId,
                      aspectRatio,
                      showFooter,
                      headline: headlineStyle.isHidden ? '' : headline,
                      subtext: subtextStyle.isHidden ? '' : subtext,
                      quote: quoteStyle.isHidden ? '' : quote,
                      elements: customElements,
                      customBgImage,
                      customBgGradient: currentBgGradient,
                      companyLogoUrl,
                      companyLogoPosition,
                      headlineStyle,
                      subtextStyle,
                      quoteStyle,
                      dateBadgeStyle,
                      motifStyle,
                      footerConfig,
                    })
                  }
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-xs font-bold text-slate-800 hover:text-[#635BFF] flex items-center justify-between"
                >
                  <span>PDF डॉक्युमेंट (Print Ready)</span>
                  <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded text-amber-700">PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Share & More Modal Trigger */}
          <button
            type="button"
            onClick={() =>
              onOpenExportModal({
                template,
                profile: editableProfile,
                frameId: selectedFrameId,
                aspectRatio,
                showFooter,
                headline: headlineStyle.isHidden ? '' : headline,
                subtext: subtextStyle.isHidden ? '' : subtext,
                quote: quoteStyle.isHidden ? '' : quote,
                elements: customElements,
                customBgImage,
                customBgGradient: currentBgGradient,
                companyLogoUrl,
                companyLogoPosition,
                headlineStyle,
                subtextStyle,
                quoteStyle,
                dateBadgeStyle,
                motifStyle,
                footerConfig,
              })
            }
            className="p-2 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            title="शेअर करा / प्रिंट पर्याय"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">शेअर</span>
          </button>

          {/* Right Properties Panel Toggle Button */}
          <button
            type="button"
            onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              isPropertiesPanelOpen
                ? 'bg-indigo-50 text-[#635BFF] border-indigo-200 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            title={isPropertiesPanelOpen ? 'प्रॉपर्टीज पॅनेल लपवा' : 'प्रॉपर्टीज पॅनेल उघडा'}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* QUICK ACTIONS SUB-HEADER (Desktop Only) */}
      <div className="hidden md:flex bg-slate-900/95 border-b border-slate-800 px-3 sm:px-5 py-2 items-center justify-between gap-2 overflow-x-auto shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Undo Button */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyPast.length === 0}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
            title="पूर्ववत करा (Undo - Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">पूर्ववत</span>
          </button>

          {/* Redo Button */}
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyFuture.length === 0}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
            title="पुन्हा करा (Redo - Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">पुन्हा</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!selectedTarget}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
            title="निवडलेला घटक कॉपी करा (Copy - Ctrl+C)"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">कॉपी</span>
          </button>

          {/* Paste Button */}
          <button
            type="button"
            onClick={handlePaste}
            disabled={!clipboardRef.current}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-slate-200 text-xs font-bold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
            title="कॉपी केलेला घटक पेस्ट करा (Paste - Ctrl+V)"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">पेस्ट</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 mx-0.5" />

          {/* + New Text */}
          <button
            type="button"
            onClick={() => handleAddNewTextBox()}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            title="कॅनव्हासवर नवीन मजकूर जोडा"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ नवीन मजकूर (+ Text)</span>
          </button>

          {/* Upload Image / Photo / PNG */}
          <label className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap">
            <Upload className="w-3.5 h-3.5" />
            <span>📸 फोटो / लोगो अपलोड</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const dataUrl = await fileToDataUrl(file);
                    handleUploadCustomImage(dataUrl, file.name);
                  } catch (err) {
                    console.error('Image upload failed:', err);
                  }
                }
                e.target.value = '';
              }}
            />
          </label>

          {/* Add Icon / Stickers Quick Button */}
          <button
            type="button"
            onClick={() => setActiveToolTab('stickers')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            title="चिन्हे व स्टिकर्स जोडा"
          >
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">⭐ चिन्ह जोडा (Add Icon)</span>
            <span className="sm:hidden">⭐ चिन्ह</span>
          </button>
        </div>

        {/* Brand Footer & Safe Guide Quick Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle Brand Footer */}
          <button
            type="button"
            onClick={() => setShowFooter((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all ${
              showFooter
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="ब्रँडिंग फुटर चालू किंवा बंद करा"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{showFooter ? '✓ फुटर चालू' : '✕ फुटर बंद'}</span>
          </button>

          {/* Toggle Safe Area Guides */}
          <button
            type="button"
            onClick={() => setShowSafeAreaGuides((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all ${
              showSafeAreaGuides
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="८०% कंटेंट आणि २०% फुटर सेफ झोन गाईड रेषा दाखवा"
          >
            <Move className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">सेफ झोन</span>
          </button>

          {/* Festival Logo / Motif Quick Controller */}
          {motifStyle.isHidden ? (
            <button
              type="button"
              onClick={() => {
                setMotifStyle((prev) => ({ ...prev, isHidden: false }));
                setSelectedTarget({ type: 'motif' });
                setUndoToast({
                  message: 'सणाचा मुख्य लोगो पुन्हा जोडला (Festival Logo Restored)',
                  onUndo: () => setMotifStyle((prev) => ({ ...prev, isHidden: true })),
                });
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all"
              title="सणाचा मुख्य लोगो पुन्हा दाखवा"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>🕉️ + सणाचा लोगो</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-amber-500/40">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <button
                type="button"
                onClick={() => setSelectedTarget({ type: 'motif' })}
                className="text-xs font-bold text-amber-300 hover:underline cursor-pointer"
                title="सणाचा लोगो सिलेक्ट करा"
              >
                🕉️ मुख्य लोगो
              </button>
              <button
                type="button"
                onClick={() => {
                  setMotifStyle((prev) => ({ ...prev, isHidden: true }));
                  setSelectedTarget(null);
                  setUndoToast({
                    message: 'सणाचा मुख्य लोगो डिलीट केला (Festival Logo Deleted)',
                    onUndo: () => setMotifStyle((prev) => ({ ...prev, isHidden: false })),
                  });
                }}
                className="text-rose-400 hover:text-rose-300 text-[11px] font-bold ml-1 hover:underline cursor-pointer"
                title="सणाचा लोगो डिलीट करा"
              >
                ✕ डिलीट
              </button>
            </div>
          )}

          {/* Company Logo Quick Controller */}
          {(companyLogoUrl || (editableProfile.logoUrl && footerConfig.showCompanyLogo !== false)) ? (
            <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-cyan-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <button
                type="button"
                onClick={() => setSelectedTarget({ type: 'companyLogo' as any })}
                className="text-xs font-bold text-cyan-300 hover:underline cursor-pointer"
                title="कंपनी लोगो निवडा"
              >
                🏢 कंपनी लोगो
              </button>
              <button
                type="button"
                onClick={() => {
                  const prevLogo = companyLogoUrl || editableProfile.logoUrl;
                  const prevShow = footerConfig.showCompanyLogo !== false;
                  setCompanyLogoUrl('');
                  setEditableProfile((prev) => ({ ...prev, logoUrl: '' }));
                  setFooterConfig((prev) => ({ ...prev, showCompanyLogo: false }));
                  setSelectedTarget(null);
                  if (prevLogo) {
                    setUndoToast({
                      message: 'कंपनी लोगो डिलीट केला (Company Logo Deleted)',
                      onUndo: () => {
                        setCompanyLogoUrl(prevLogo);
                        setEditableProfile((prev) => ({ ...prev, logoUrl: prevLogo }));
                        setFooterConfig((prev) => ({ ...prev, showCompanyLogo: prevShow }));
                      },
                    });
                  }
                }}
                className="text-rose-400 hover:text-rose-300 text-[11px] font-bold ml-1 hover:underline cursor-pointer"
                title="लोगो काढून टाका (Delete Logo)"
              >
                ✕ डिलीट
              </button>
            </div>
          ) : (
            <label className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-all">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>🏢 + कंपनी लोगो</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const dataUrl = await fileToDataUrl(file);
                      setCompanyLogoUrl(dataUrl);
                      setEditableProfile((prev) => ({ ...prev, logoUrl: dataUrl }));
                      setFooterConfig((prev) => ({ ...prev, showCompanyLogo: true }));
                      setSelectedTarget({ type: 'companyLogo' as any });
                    } catch (err) {
                      console.error('Logo upload failed:', err);
                    }
                  }
                  e.target.value = '';
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER: RESPONSIVE SPLIT (VERTICAL ON MOBILE, HORIZONTAL ON DESKTOP) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* A. TOOL CATEGORY RAIL (Horizontal tabs on mobile, vertical left rail on desktop) */}
        <div
          className={`${
            isMobileExpanded ? 'hidden md:flex' : 'flex'
          } w-full md:w-16 sm:md:w-20 bg-slate-900 border-t md:border-t-0 md:border-r border-slate-800 flex-row md:flex-col items-center justify-around md:justify-start px-2 py-1.5 md:py-3 gap-1 md:gap-2 shrink-0 z-30 order-2 md:order-1 no-scrollbar overflow-x-auto`}
        >
          {[
            { id: 'frames', label: 'फ्रेम्स', icon: Layers, badge: 'Frames' },
            { id: 'text', label: 'मजकूर', icon: Type, badge: 'Text' },
            { id: 'profile', label: 'माहिती', icon: Briefcase, badge: 'Profile' },
            { id: 'background', label: 'रंग थीम', icon: Palette, badge: 'Theme' },
            { id: 'stickers', label: 'स्टिकर्स', icon: Smile, badge: 'Icons' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeToolTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveToolTab(tab.id as any)}
                className={`flex-1 md:flex-initial py-1.5 md:py-2.5 px-2 md:px-0 md:w-14 sm:md:w-16 rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md md:shadow-lg md:shadow-amber-500/30 scale-102 md:scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
                title={tab.badge}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* B. DEDICATED TOOL DRAWER PANEL (Bottom sheet on mobile, left panel on desktop) */}
        <div
          className={`${
            isMobileExpanded ? 'hidden md:flex' : 'flex-1 min-h-0'
          } w-full md:w-[320px] lg:md:w-[380px] bg-slate-950 border-t md:border-t-0 md:border-r border-slate-800 flex flex-col shrink-0 overflow-hidden z-20 shadow-2xl order-3 md:order-2 mobile-smooth-scroll`}
        >
          {/* 1. 27 FOOTER FRAMES & BUSINESS INFO DRAWER */}
          {activeToolTab === 'frames' && (
            <FooterFrameDrawer
              selectedFrameId={selectedFrameId}
              onSelectFrame={(id) => {
                setSelectedFrameId(id);
                setSelectedTarget({ type: 'frame' });
              }}
              profile={editableProfile}
              onUpdateProfile={(updates) => setEditableProfile((prev) => ({ ...prev, ...updates }))}
              config={footerConfig}
              onUpdateConfig={(updates) => setFooterConfig((prev) => ({ ...prev, ...updates }))}
              onUploadLogo={(logoUrl) => {
                setCompanyLogoUrl(logoUrl);
                setEditableProfile((prev) => ({ ...prev, logoUrl }));
              }}
              onRemoveLogo={() => {
                setCompanyLogoUrl('');
                setEditableProfile((prev) => ({ ...prev, logoUrl: '' }));
                setFooterConfig((prev) => ({ ...prev, showCompanyLogo: false }));
              }}
              isAdmin={isAdmin}
              onOpenAdminLogin={onOpenAdminLogin}
              onSaveAsGlobalDefault={() => {
                if (onSaveFrameSettings) {
                  onSaveFrameSettings(selectedFrameId, footerConfig);
                }
                setUndoToast({
                  message: 'फ्रेम साईझ व सेटिंग्ज डीफॉल्ट म्हणून सेव्ह केली!',
                });
              }}
            />
          )}

          {/* 2. TEXT & MARATHI WISHES DRAWER */}
          {activeToolTab === 'text' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3.5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-amber-400" />
                    <span>मजकूर व सदिच्छा संदेश (Text & Wishes)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    पोस्टरवरील मजकूर बदला किंवा थेट कॅनव्हासवर क्लिक करा
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
                {/* Direct Custom Text Input & Add Area */}
                <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3 space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5" />
                      नवीन मजकूर टाईप करा (Type New Text)
                    </span>
                    <span className="text-[10px] text-slate-400">कॅनव्हासवर जोडा</span>
                  </div>

                  <textarea
                    rows={2}
                    value={customTextDraft}
                    onChange={(e) => setCustomTextDraft(e.target.value)}
                    placeholder="येथे तुम्हाला हवा तो मजकूर, पत्ता, संपर्क क्रमांक किंवा संदेश टाईप करा..."
                    className="w-full bg-slate-950 text-white font-medium p-2.5 rounded-xl text-xs border border-slate-700 outline-none focus:border-emerald-400 placeholder:text-slate-500 shadow-inner"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      handleAddNewTextBox(customTextDraft);
                      setCustomTextDraft('');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 border border-emerald-400/30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{customTextDraft.trim() ? 'हा मजकूर कॅनव्हासवर जोडा' : '➕ नवीन मजकूर बॉक्स जोडा'}</span>
                  </button>
                </div>

                {/* 1-Click Sample Wishes */}
                <div>
                  <span className="text-[11px] font-bold text-amber-400 block mb-1.5">
                    ⚡ १-क्लिक तयार मराठी संदेश (Quick Presets):
                  </span>
                  <div className="space-y-1.5">
                    {SAMPLE_MARATHI_WISHES.map((sw, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setHeadline(sw.headline);
                          setSubtext(sw.subtext);
                          setHeadlineStyle((prev) => ({ ...prev, isHidden: false }));
                          setSubtextStyle((prev) => ({ ...prev, isHidden: false }));
                        }}
                        className="w-full text-left p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all group"
                      >
                        <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 block">
                          {sw.label}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                          "{sw.headline}"
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Headline Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      मुख्य हेडलाईन (Main Headline):
                    </label>
                    {headlineStyle.isHidden && (
                      <button
                        type="button"
                        onClick={() => setHeadlineStyle((prev) => ({ ...prev, isHidden: false }))}
                        className="text-[10px] text-amber-400 hover:underline font-bold"
                      >
                        पुन्हा दाखवा (Unhide)
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => {
                      setHeadline(e.target.value);
                      setHeadlineStyle((prev) => ({ ...prev, isHidden: false }));
                    }}
                    placeholder="उदा. हार्दिक शुभेच्छा!"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>

                {/* Subtext Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      सदिच्छा / शुभेच्छा मजकूर (Festive Subtext):
                    </label>
                    {subtextStyle.isHidden && (
                      <button
                        type="button"
                        onClick={() => setSubtextStyle((prev) => ({ ...prev, isHidden: false }))}
                        className="text-[10px] text-amber-400 hover:underline font-bold"
                      >
                        पुन्हा दाखवा (Unhide)
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={subtext}
                    onChange={(e) => {
                      setSubtext(e.target.value);
                      setSubtextStyle((prev) => ({ ...prev, isHidden: false }));
                    }}
                    placeholder="उदा. आपणास व आपल्या परिवारास सुख-समृद्धी लाभो..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>

                {/* Quote Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      स्लोगन / कोटेशन (Quote / Slogan):
                    </label>
                    {quoteStyle.isHidden && (
                      <button
                        type="button"
                        onClick={() => setQuoteStyle((prev) => ({ ...prev, isHidden: false }))}
                        className="text-[10px] text-amber-400 hover:underline font-bold"
                      >
                        पुन्हा दाखवा (Unhide)
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => {
                      setQuote(e.target.value);
                      setQuoteStyle((prev) => ({ ...prev, isHidden: false }));
                    }}
                    placeholder="उदा. 'सेवा हाच आमचा धर्म'"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>

                {/* AI Trigger */}
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-300 block">AI सदिच्छा रायटर</span>
                    <span className="text-[10px] text-slate-400">वेगवेगळ्या शैलीत मराठी मजकूर मिळवा</span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAIModal}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>जनरेट करा</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. STICKERS & VECTOR ELEMENTS DRAWER */}
          {activeToolTab === 'stickers' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Festival Logo / Motif Quick Management Box */}
              <div className="p-3 bg-slate-900/95 border-b border-slate-800 space-y-2 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-white">सणाचा मुख्य लोगो / चिन्ह:</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      !motifStyle.isHidden
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {!motifStyle.isHidden ? '✓ पोस्टरवर सक्रिय' : '✕ लपवले / डिलीट केले'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!motifStyle.isHidden ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setMotifStyle((prev) => ({ ...prev, isHidden: true }));
                          setSelectedTarget(null);
                          setUndoToast({
                            message: 'सणाचा मुख्य लोगो डिलीट केला (Festival Logo Deleted)',
                            onUndo: () => setMotifStyle((prev) => ({ ...prev, isHidden: false })),
                          });
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>सणाचा लोगो डिलीट करा (Delete)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedTarget({ type: 'motif' })}
                        className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                        title="लोगो हलवण्यासाठी निवडा"
                      >
                        निवडा
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMotifStyle((prev) => ({ ...prev, isHidden: false }));
                        setSelectedTarget({ type: 'motif' });
                        setUndoToast({
                          message: 'सणाचा मुख्य लोगो पुन्हा जोडला (Logo Restored)',
                          onUndo: () => setMotifStyle((prev) => ({ ...prev, isHidden: true })),
                        });
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>सणाचा मुख्य लोगो पुन्हा पोस्टरवर आणा (Restore Logo)</span>
                    </button>
                  )}
                </div>
              </div>

              <ElementsDrawer
                onAddElement={handleAddElementFromLibrary}
                favorites={favoriteElementIds}
                onToggleFavorite={handleToggleFavorite}
                recentElementIds={recentElementIds}
                onAddNewText={handleAddNewTextBox}
                onUploadCustomImage={handleUploadCustomImage}
              />
            </div>
          )}

          {/* 4. BACKGROUND & COLOR THEME DRAWER */}
          {activeToolTab === 'background' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3.5 border-b border-slate-800 bg-slate-900/60">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>बॅकग्राउंड व रंग थीम (Background & Colors)</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  रॉयल मराठी रंगछटा व सणांच्या थीम निवडा
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
                {/* Custom Photo Upload for Background */}
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">
                    📸 तुमचा स्वतःचा फोटो / बॅकग्राउंड लावा:
                  </span>
                  <label className="border border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-300">फोटो निवडा (JPG / PNG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setCustomBgImage(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {customBgImage && (
                    <button
                      type="button"
                      onClick={() => setCustomBgImage(null)}
                      className="text-[11px] text-rose-400 hover:underline font-semibold block"
                    >
                      ✕ अपलोड केलेला फोटो काढून टाका
                    </button>
                  )}
                </div>

                {/* Preset Marathi Color Gradients */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    🎨 रॉयल मराठी ग्रेडियंट्स (Royal Gradients):
                  </span>
                  <div className="space-y-2">
                    {PRESET_GRADIENTS.map((p, idx) => {
                      const isSelected = currentBgGradient === p.bgGradient;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCurrentBgGradient(p.bgGradient);
                            setCustomBgImage(null);
                          }}
                          className={`w-full p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-slate-900 ring-2 ring-amber-400/40 text-white'
                              : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${p.bgGradient} border border-white/20 shadow-sm shrink-0`} />
                          <div className="text-left">
                            <span className="text-xs font-bold block text-white">{p.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PROFILE & CONTACT DETAILS DRAWER */}
          {activeToolTab === 'profile' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3.5 border-b border-slate-800 bg-slate-900/60">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>बिझनेस प्रोफाईल व लोगो माहिती (Business Info & Logo)</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  फ्रेमवर येणारी बिझनेस माहिती व लोगो व्यवस्थापन
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                {/* Logo Management Box in Profile */}
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">कंपनी / ब्रँड लोगो (Company Logo):</span>
                    {(editableProfile.logoUrl && footerConfig.showCompanyLogo !== false) ? (
                      <button
                        type="button"
                        onClick={() => {
                          const prevLogo = editableProfile.logoUrl;
                          setCompanyLogoUrl('');
                          setEditableProfile((prev) => ({ ...prev, logoUrl: '' }));
                          setFooterConfig((prev) => ({ ...prev, showCompanyLogo: false }));
                          setSelectedTarget(null);
                          setUndoToast({
                            message: 'कंपनी लोगो डिलीट केला (Logo Deleted)',
                            onUndo: () => {
                              setCompanyLogoUrl(prevLogo);
                              setEditableProfile((prev) => ({ ...prev, logoUrl: prevLogo }));
                              setFooterConfig((prev) => ({ ...prev, showCompanyLogo: true }));
                            },
                          });
                        }}
                        className="text-[11px] font-bold px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>लोगो डिलीट करा</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold">लोगो जोडलेला नाही</span>
                    )}
                  </div>

                  {(editableProfile.logoUrl && footerConfig.showCompanyLogo !== false) ? (
                    <div className="flex items-center gap-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <img
                        src={editableProfile.logoUrl}
                        alt={editableProfile.name}
                        className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{editableProfile.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <label className="text-[10px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md cursor-pointer flex items-center gap-1 transition-all">
                            <Upload className="w-2.5 h-2.5" />
                            <span>लोगो बदला</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const dataUrl = await fileToDataUrl(file);
                                    setCompanyLogoUrl(dataUrl);
                                    setEditableProfile((prev) => ({ ...prev, logoUrl: dataUrl }));
                                    setFooterConfig((prev) => ({ ...prev, showCompanyLogo: true }));
                                  } catch (err) {
                                    console.error('Logo upload failed:', err);
                                  }
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const prevLogo = editableProfile.logoUrl;
                              setCompanyLogoUrl('');
                              setEditableProfile((prev) => ({ ...prev, logoUrl: '' }));
                              setFooterConfig((prev) => ({ ...prev, showCompanyLogo: false }));
                              setSelectedTarget(null);
                              setUndoToast({
                                message: 'कंपनी लोगो डिलीट केला',
                                onUndo: () => {
                                  setCompanyLogoUrl(prevLogo);
                                  setEditableProfile((prev) => ({ ...prev, logoUrl: prevLogo }));
                                  setFooterConfig((prev) => ({ ...prev, showCompanyLogo: true }));
                                },
                              });
                            }}
                            className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline font-bold"
                          >
                            हटवा
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="border border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition-colors">
                      <Upload className="w-4 h-4 text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-300">लोगो अपलोड करा (PNG / JPG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const dataUrl = await fileToDataUrl(file);
                              setCompanyLogoUrl(dataUrl);
                              setEditableProfile((prev) => ({ ...prev, logoUrl: dataUrl }));
                              setFooterConfig((prev) => ({ ...prev, showCompanyLogo: true }));
                            } catch (err) {
                              console.error('Logo upload failed:', err);
                            }
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <h5 className="text-xs font-black text-white">{editableProfile.name}</h5>
                      <span className="text-[10px] text-amber-400 font-bold">{editableProfile.tagline}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <span className="text-amber-400">📞 फोन:</span> {editableProfile.phone}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-amber-400">📍 पत्ता:</span> {editableProfile.address}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-amber-400">🌐 वेबसाईट:</span> {editableProfile.website || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300">
                  ✓ ही माहिती तुमच्या निवडलेल्या फ्रेमवर आपोआप सेट होते.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* C. ROCK-SOLID FIXED CENTER CANVAS STAGE (Always prominent & live) */}
        <div
          className={`w-full bg-[#F1F1F5] flex flex-col items-center justify-center relative p-2 sm:p-4 md:p-6 overflow-hidden shrink-0 transition-all duration-300 order-1 md:order-3 ${
            isMobileExpanded ? 'flex-1 h-full' : 'h-[43vh] sm:h-[46vh]'
          } md:flex-1 md:h-full`}
          onClick={() => {
            setSelectedTarget(null);
            setActiveInlineEdit(null);
          }}
        >
          {/* Mobile Floating Overlay Header on Canvas */}
          <div className="md:hidden absolute top-2 left-2 right-2 flex items-center justify-between z-30 pointer-events-auto">
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-200">🔴 लाईव्ह पोस्टर</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-md">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyPast.length === 0}
                className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                title="पूर्ववत करा"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyFuture.length === 0}
                className="p-1 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                title="पुढे करा"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3 bg-slate-700 mx-0.5" />
              <button
                type="button"
                onClick={() => setShowSafeAreaGuides(!showSafeAreaGuides)}
                className={`p-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  showSafeAreaGuides ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                }`}
                title="८०% मुख्य सेफ झोन व २०% फुटर गाईड"
              >
                <Shield className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3 bg-slate-700 mx-0.5" />
              <button
                type="button"
                onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  isMobileExpanded ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-200 hover:text-white'
                }`}
                title={isMobileExpanded ? 'ऑप्शन्स दाखवा' : 'मोठा प्रिव्ह्यू करा'}
              >
                <Maximize2 className="w-3 h-3" />
                <span>{isMobileExpanded ? 'ऑप्शन्स' : 'मोठा'}</span>
              </button>
            </div>
          </div>

          {isMobileExpanded && (
            <div className="md:hidden absolute bottom-3 z-30 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsMobileExpanded(false)}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-amber-300"
              >
                <Edit3 className="w-4 h-4" />
                <span>✏️ ऑप्शन्स उघडा (Edit Poster)</span>
              </button>
            </div>
          )}
          {/* Top Floating Canva Context Toolbar for Selected Target */}
          <CanvasFloatingToolbar
            selectedTarget={selectedTarget}
            selectedCustomElement={selectedCustomElement}
            headlineStyle={headlineStyle}
            subtextStyle={subtextStyle}
            quoteStyle={quoteStyle}
            dateBadgeStyle={dateBadgeStyle}
            motifStyle={motifStyle}
            headline={headline}
            subtext={subtext}
            quote={quote}
            onUpdateHeadlineText={(txt) => {
              setHeadline(txt);
              setHeadlineStyle((prev) => ({ ...prev, isHidden: false }));
            }}
            onUpdateSubtextText={(txt) => {
              setSubtext(txt);
              setSubtextStyle((prev) => ({ ...prev, isHidden: false }));
            }}
            onUpdateQuoteText={(txt) => {
              setQuote(txt);
              setQuoteStyle((prev) => ({ ...prev, isHidden: false }));
            }}
            companyLogoUrl={companyLogoUrl}
            companyLogoPosition={companyLogoPosition}
            onUpdateCompanyLogoPosition={(u) => setCompanyLogoPosition((prev) => ({ ...prev, ...u }))}
            onCopyTarget={handleCopy}
            onPasteTarget={handlePaste}
            canPaste={Boolean(clipboardRef.current)}
            onUpdateHeadlineStyle={(u) => setHeadlineStyle((prev) => ({ ...prev, ...u }))}
            onUpdateSubtextStyle={(u) => setSubtextStyle((prev) => ({ ...prev, ...u }))}
            onUpdateQuoteStyle={(u) => setQuoteStyle((prev) => ({ ...prev, ...u }))}
            onUpdateDateBadgeStyle={(u) => setDateBadgeStyle((prev) => ({ ...prev, ...u }))}
            onUpdateMotifStyle={(u) => setMotifStyle((prev) => ({ ...prev, ...u }))}
            onUpdateCustomElement={handleUpdateCustomElement}
            onDeleteTarget={handleDeleteSelectedTarget}
            onDuplicateCustomElement={handleDuplicateCustomElement}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onNudgeTarget={handleNudgeTarget}
            onStartInlineEdit={(target) => setActiveInlineEdit(target)}
            onOpenDrawerTab={(tab) => setActiveToolTab(tab)}
            onRemoveBackground={handleRemoveBackgroundForSelected}
            onRestoreOriginalImage={handleRestoreOriginalImage}
            isProcessingBg={isProcessingBg}
            onDeselect={() => {
              setSelectedTarget(null);
              setActiveInlineEdit(null);
            }}
          />

          {/* Undo Deleted Element Toast Banner */}
          {undoToast && (
            <div className="absolute top-16 z-40 bg-slate-900 border border-amber-400/50 shadow-2xl px-4 py-2 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-3">
              <span className="text-xs text-slate-200 font-bold">{undoToast.message}</span>
              <button
                type="button"
                onClick={() => {
                  undoToast.onUndo();
                  setUndoToast(null);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-black flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>पूर्ववत करा (Undo)</span>
              </button>
            </div>
          )}

          {/* Canvas Wrapper with Rigid Dimensions & Zoom */}
          <div 
            className="relative flex items-center justify-center shrink-0 transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <div
              ref={canvasRef}
              className={`${getCanvasDimensions()} bg-gradient-to-br ${currentBgGradient} rounded-2xl shadow-2xl overflow-hidden relative border border-slate-300/80 transition-all duration-200 select-none`}
              style={{
                boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* CANONICAL LIVE CANVAS - Single Source of Truth (100% Exact to Download) */}
              <canvas
                ref={previewCanvasRef}
                width={currentFormat.width}
                height={currentFormat.height}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-2xl z-0"
              />

              {/* Live Snap Guides */}
              {snapGuideX !== null && (
                <div
                  className="absolute top-0 bottom-0 w-[1.5px] bg-cyan-400 z-30 pointer-events-none shadow-[0_0_8px_cyan]"
                  style={{ left: `${snapGuideX}%` }}
                />
              )}
              {snapGuideY !== null && (
                <div
                  className="absolute left-0 right-0 h-[1.5px] bg-cyan-400 z-30 pointer-events-none shadow-[0_0_8px_cyan]"
                  style={{ top: `${snapGuideY}%` }}
                />
              )}

              {/* Interactive Hitbox Overlay for Direct Element Selection & Dragging */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {/* 1. Top Occasion Badge */}
                {!dateBadgeStyle.isHidden && dateBadgeStyle.text && (
                  <div
                    onMouseDown={(e) =>
                      handleStartDragTarget(e, { type: 'dateBadge' }, dateBadgeStyle.x ?? 50, dateBadgeStyle.y ?? 7)
                    }
                    onTouchStart={(e) =>
                      handleStartDragTarget(e, { type: 'dateBadge' }, dateBadgeStyle.x ?? 50, dateBadgeStyle.y ?? 7)
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'dateBadge' });
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'dateBadge' });
                      setActiveInlineEdit('dateBadge');
                    }}
                    className={`absolute pointer-events-auto cursor-move transition-all group ${
                      selectedTarget?.type === 'dateBadge'
                        ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 rounded-full scale-105 shadow-xl'
                        : 'hover:ring-1 hover:ring-dashed hover:ring-amber-300/80 rounded-full'
                    }`}
                    style={{
                      left: `${dateBadgeStyle.x ?? 50}%`,
                      top: `${(dateBadgeStyle.y ?? 7) * (showFooter ? 0.8 : 1)}%`,
                      transform: 'translate(-50%, -50%)',
                      padding: '4px 14px',
                    }}
                    title="क्लिक करा किंवा ड्रॅग करा (Drag badge)"
                  >
                    {activeInlineEdit === 'dateBadge' ? (
                      <div
                        className="bg-black/95 p-1 rounded-full border border-cyan-400 flex items-center gap-1 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          autoFocus
                          value={dateBadgeStyle.text}
                          onChange={(e) => setDateBadgeStyle((prev) => ({ ...prev, text: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setActiveInlineEdit(null);
                          }}
                          className="bg-transparent text-amber-300 text-[11px] font-bold text-center px-2 py-0.5 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setActiveInlineEdit(null)}
                          className="p-1 bg-cyan-500 text-black rounded-full text-[10px] font-bold"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="opacity-0 text-[10px] select-none">★ {dateBadgeStyle.text} ★</span>
                    )}

                    {selectedTarget?.type === 'dateBadge' && (
                      <CanvasBoundingBox
                        target={{ type: 'dateBadge' }}
                        coordinates={{
                          x: dateBadgeStyle.x ?? 50,
                          y: dateBadgeStyle.y ?? 7,
                          boxWidth: 40,
                          height: 12,
                        }}
                        isText={true}
                        canEditInline={true}
                        onStartInlineEdit={() => setActiveInlineEdit('dateBadge')}
                        onStartResize={handleStartResize}
                        onDelete={handleDeleteSelectedTarget}
                        onCopy={handleCopy}
                        onOpenProperties={() => setIsPropertiesPanelOpen(true)}
                      />
                    )}
                  </div>
                )}

                {/* 2. Top-Right Dedicated Company Logo */}
                {companyLogoUrl && companyLogoUrl.trim() !== '' && (
                  <div
                    onMouseDown={(e) =>
                      handleStartDragTarget(
                        e,
                        { type: 'companyLogo' as any },
                        companyLogoPosition.x,
                        companyLogoPosition.y
                      )
                    }
                    onTouchStart={(e) =>
                      handleStartDragTarget(
                        e,
                        { type: 'companyLogo' as any },
                        companyLogoPosition.x,
                        companyLogoPosition.y
                      )
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'companyLogo' as any });
                    }}
                    className={`absolute pointer-events-auto cursor-move transition-all group p-1 ${
                      (selectedTarget?.type as any) === 'companyLogo'
                        ? 'ring-2 ring-[#635BFF] ring-offset-2 ring-offset-white rounded-xl shadow-2xl'
                        : 'hover:ring-1 hover:ring-dashed hover:ring-amber-300 rounded-xl'
                    }`}
                    style={{
                      left: `${companyLogoPosition.x}%`,
                      top: `${companyLogoPosition.y * (showFooter ? 0.8 : 1)}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${companyLogoPosition.size}%`,
                      height: `${companyLogoPosition.size}%`,
                    }}
                    title="कंपनी लोगो (Top-Right Logo)"
                  >
                    {(selectedTarget?.type as any) === 'companyLogo' && (
                      <CanvasBoundingBox
                        target={{ type: 'companyLogo' as any }}
                        coordinates={{
                          x: companyLogoPosition.x,
                          y: companyLogoPosition.y,
                          size: companyLogoPosition.size,
                          width: companyLogoPosition.size,
                          height: companyLogoPosition.size,
                        }}
                        isImage={true}
                        onStartResize={handleStartResize}
                        onNudgeSize={(inc) => {
                          setCompanyLogoPosition((prev) => ({
                            ...prev,
                            size: inc ? Math.min(45, prev.size + 2) : Math.max(8, prev.size - 2),
                          }));
                        }}
                        onDelete={handleDeleteSelectedTarget}
                        onCopy={handleCopy}
                        onOpenProperties={() => setIsPropertiesPanelOpen(true)}
                      />
                    )}
                  </div>
                )}

                {/* 3. Vector Motif / Illustration (Draggable Hitbox) */}
                {!motifStyle.isHidden && (
                  <div
                    onMouseDown={(e) =>
                      handleStartDragTarget(
                        e,
                        { type: 'motif' },
                        motifStyle.x ?? 50,
                        motifStyle.y ?? 32
                      )
                    }
                    onTouchStart={(e) =>
                      handleStartDragTarget(
                        e,
                        { type: 'motif' },
                        motifStyle.x ?? 50,
                        motifStyle.y ?? 32
                      )
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'motif' });
                    }}
                    className={`absolute pointer-events-auto cursor-move transition-all p-1 group ${
                      selectedTarget?.type === 'motif'
                        ? 'ring-2 ring-[#635BFF] ring-offset-2 ring-offset-white rounded-2xl shadow-xl'
                        : 'hover:ring-1 hover:ring-dashed hover:ring-amber-300/80 rounded-2xl'
                    }`}
                    style={{
                      left: `${motifStyle.x ?? 50}%`,
                      top: `${(motifStyle.y ?? 32) * (showFooter ? 0.8 : 1)}%`,
                      transform: `translate(-50%, -50%) scale(${motifStyle.scale || 1})`,
                      width: '28%',
                      height: '28%',
                    }}
                    title="क्लिक करा किंवा ड्रॅग करा (Drag to move logo/motif)"
                  >
                    {selectedTarget?.type === 'motif' && (
                      <CanvasBoundingBox
                        target={{ type: 'motif' }}
                        coordinates={{
                          x: motifStyle.x ?? 50,
                          y: motifStyle.y ?? 32,
                          scale: motifStyle.scale || 1.0,
                          width: Math.round((motifStyle.scale || 1.0) * 28),
                          height: Math.round((motifStyle.scale || 1.0) * 28),
                        }}
                        isImage={true}
                        onStartResize={handleStartResize}
                        onNudgeSize={(inc) => {
                          setMotifStyle((prev) => ({
                            ...prev,
                            scale: inc ? Math.min(2.5, +(prev.scale + 0.1).toFixed(2)) : Math.max(0.4, +(prev.scale - 0.1).toFixed(2)),
                          }));
                        }}
                        onDelete={handleDeleteSelectedTarget}
                        onCopy={handleCopy}
                        onOpenProperties={() => setIsPropertiesPanelOpen(true)}
                      />
                    )}
                  </div>
                )}

                {/* 4. Main Headline Hitbox & Inline Editor */}
                {!headlineStyle.isHidden && (
                  <div
                    onMouseDown={(e) =>
                      handleStartDragTarget(e, { type: 'headline' }, headlineStyle.x ?? 50, headlineStyle.y ?? 55)
                    }
                    onTouchStart={(e) =>
                      handleStartDragTarget(e, { type: 'headline' }, headlineStyle.x ?? 50, headlineStyle.y ?? 55)
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'headline' });
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'headline' });
                      setActiveInlineEdit('headline');
                    }}
                    className={`absolute pointer-events-auto cursor-move transition-all px-2 py-1 rounded-xl group min-h-[36px] ${
                      selectedTarget?.type === 'headline'
                        ? 'ring-2 ring-cyan-400 bg-cyan-950/20 shadow-2xl backdrop-blur-xs'
                        : 'hover:ring-1 hover:ring-dashed hover:ring-amber-300/80'
                    }`}
                    style={{
                      width: `${headlineStyle.boxWidth || 88}%`,
                      left: `${headlineStyle.x ?? 50}%`,
                      top: `${(headlineStyle.y ?? 55) * (showFooter ? 0.8 : 1)}%`,
                      transform: 'translate(-50%, -50%)',
                      textAlign: headlineStyle.align || 'center',
                    }}
                    title="क्लिक करा किंवा ड्रॅग करा (Double-click to edit text)"
                  >
                    {activeInlineEdit === 'headline' ? (
                      <div
                        className="bg-black/95 p-2 rounded-xl border-2 border-cyan-400 shadow-2xl flex flex-col gap-1.5 min-w-[260px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <textarea
                          rows={2}
                          autoFocus
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          className="w-full bg-slate-900 text-white font-black text-center p-1.5 rounded-lg text-sm border border-slate-700 outline-none focus:border-cyan-400"
                          style={{ fontFamily: headlineStyle.fontFamily || "'Yatra One', cursive, sans-serif" }}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-cyan-300 font-bold">मजकूर बदला</span>
                          <button
                            type="button"
                            onClick={() => setActiveInlineEdit(null)}
                            className="px-2.5 py-0.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>झाले (Done)</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="opacity-0 text-sm select-none font-bold block">{headline}</span>
                    )}

                    {selectedTarget?.type === 'headline' && activeInlineEdit !== 'headline' && (
                      <CanvasBoundingBox
                        target={{ type: 'headline' }}
                        coordinates={{
                          x: headlineStyle.x ?? 50,
                          y: headlineStyle.y ?? 55,
                          boxWidth: headlineStyle.boxWidth || 88,
                          fontSize: headlineStyle.fontSize,
                        }}
                        isText={true}
                        canEditInline={true}
                        onStartInlineEdit={() => setActiveInlineEdit('headline')}
                        onStartResize={handleStartResize}
                        onNudgeSize={(inc) => {
                          setHeadlineStyle((prev) => ({
                            ...prev,
                            fontSize: inc ? Math.min(64, prev.fontSize + 2) : Math.max(12, prev.fontSize - 2),
                          }));
                        }}
                        onCopy={handleCopy}
                        onDelete={handleDeleteSelectedTarget}
                        onOpenProperties={() => setIsPropertiesPanelOpen(true)}
                      />
                    )}
                  </div>
                )}

                {/* 5. Subtext Greeting Hitbox & Inline Editor */}
                {!subtextStyle.isHidden && (
                  <div
                    onMouseDown={(e) =>
                      handleStartDragTarget(e, { type: 'subtext' }, subtextStyle.x ?? 50, subtextStyle.y ?? 70)
                    }
                    onTouchStart={(e) =>
                      handleStartDragTarget(e, { type: 'subtext' }, subtextStyle.x ?? 50, subtextStyle.y ?? 70)
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'subtext' });
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'subtext' });
                      setActiveInlineEdit('subtext');
                    }}
                    className={`absolute pointer-events-auto cursor-move transition-all px-2 py-1 rounded-xl group min-h-[30px] ${
                      selectedTarget?.type === 'subtext'
                        ? 'ring-2 ring-[#635BFF] bg-indigo-950/20 shadow-2xl backdrop-blur-xs'
                        : 'hover:ring-1 hover:ring-dashed hover:ring-amber-300/80'
                    }`}
                    style={{
                      width: `${subtextStyle.boxWidth || 86}%`,
                      left: `${subtextStyle.x ?? 50}%`,
                      top: `${(subtextStyle.y ?? 70) * (showFooter ? 0.8 : 1)}%`,
                      transform: 'translate(-50%, -50%)',
                      textAlign: subtextStyle.align || 'center',
                    }}
                    title="क्लिक करा किंवा ड्रॅग करा (Double-click to edit)"
                  >
                    {activeInlineEdit === 'subtext' ? (
                      <div
                        className="bg-black/95 p-2 rounded-xl border-2 border-cyan-400 shadow-2xl flex flex-col gap-1.5 min-w-[260px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <textarea
                          rows={3}
                          autoFocus
                          value={subtext}
                          onChange={(e) => setSubtext(e.target.value)}
                          className="w-full bg-slate-900 text-amber-100 font-medium text-center p-1.5 rounded-lg text-xs border border-slate-700 outline-none focus:border-cyan-400"
                          style={{ fontFamily: subtextStyle.fontFamily || "'Baloo 2', sans-serif" }}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-cyan-300 font-bold">सदिच्छा मजकूर</span>
                          <button
                            type="button"
                            onClick={() => setActiveInlineEdit(null)}
                            className="px-2.5 py-0.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>झाले (Done)</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="opacity-0 text-xs select-none block">{subtext}</span>
                    )}

                    {selectedTarget?.type === 'subtext' && activeInlineEdit !== 'subtext' && (
                      <CanvasBoundingBox
                        target={{ type: 'subtext' }}
                        coordinates={{
                          x: subtextStyle.x ?? 50,
                          y: subtextStyle.y ?? 70,
                          boxWidth: subtextStyle.boxWidth || 86,
                          fontSize: subtextStyle.fontSize,
                        }}
                        isText={true}
                        canEditInline={true}
                        onStartInlineEdit={() => setActiveInlineEdit('subtext')}
                        onStartResize={handleStartResize}
                        onNudgeSize={(inc) => {
                          setSubtextStyle((prev) => ({
                            ...prev,
                            fontSize: inc ? Math.min(48, prev.fontSize + 2) : Math.max(10, prev.fontSize - 2),
                          }));
                        }}
                        onCopy={handleCopy}
                        onDelete={handleDeleteSelectedTarget}
                        onOpenProperties={() => setIsPropertiesPanelOpen(true)}
                      />
                    )}
                  </div>
                )}

                {/* 6. Quote Hitbox & Inline Editor */}
                {!quoteStyle.isHidden && quote && (
                  <div
                    onMouseDown={(e) =>
                      handleStartDragTarget(e, { type: 'quote' }, quoteStyle.x ?? 50, quoteStyle.y ?? 84)
                    }
                    onTouchStart={(e) =>
                      handleStartDragTarget(e, { type: 'quote' }, quoteStyle.x ?? 50, quoteStyle.y ?? 84)
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'quote' });
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'quote' });
                      setActiveInlineEdit('quote');
                    }}
                    className={`absolute pointer-events-auto cursor-move transition-all px-2 py-0.5 rounded-lg group ${
                      selectedTarget?.type === 'quote'
                        ? 'ring-2 ring-[#635BFF] bg-indigo-950/20 shadow-xl'
                        : 'hover:ring-1 hover:ring-dashed hover:ring-amber-300/80'
                    }`}
                    style={{
                      width: `${quoteStyle.boxWidth || 82}%`,
                      left: `${quoteStyle.x ?? 50}%`,
                      top: `${(quoteStyle.y ?? 84) * (showFooter ? 0.8 : 1)}%`,
                      transform: 'translate(-50%, -50%)',
                      textAlign: quoteStyle.align || 'center',
                    }}
                    title="क्लिक करा किंवा ड्रॅग करा (Double-click to edit)"
                  >
                    {activeInlineEdit === 'quote' ? (
                      <div
                        className="bg-black/95 p-1.5 rounded-xl border-2 border-cyan-400 shadow-2xl flex flex-col gap-1 min-w-[220px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          autoFocus
                          value={quote}
                          onChange={(e) => setQuote(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setActiveInlineEdit(null);
                          }}
                          className="w-full bg-slate-900 text-yellow-300 italic text-center p-1 rounded-lg text-xs border border-slate-700 outline-none focus:border-cyan-400"
                          style={{ fontFamily: quoteStyle.fontFamily || "'Kalam', cursive" }}
                        />
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveInlineEdit(null)}
                            className="px-2 py-0.5 bg-cyan-500 text-black font-bold rounded text-[10px]"
                          >
                            ✓ Done
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="opacity-0 text-[11px] select-none block">“{quote}”</span>
                    )}

                    {selectedTarget?.type === 'quote' && activeInlineEdit !== 'quote' && (
                      <CanvasBoundingBox
                        target={{ type: 'quote' }}
                        coordinates={{
                          x: quoteStyle.x ?? 50,
                          y: quoteStyle.y ?? 84,
                          boxWidth: quoteStyle.boxWidth || 82,
                          fontSize: quoteStyle.fontSize,
                        }}
                        isText={true}
                        canEditInline={true}
                        onStartInlineEdit={() => setActiveInlineEdit('quote')}
                        onStartResize={handleStartResize}
                        onNudgeSize={(inc) => {
                          setQuoteStyle((prev) => ({
                            ...prev,
                            fontSize: inc ? Math.min(36, prev.fontSize + 2) : Math.max(9, prev.fontSize - 2),
                          }));
                        }}
                        onCopy={handleCopy}
                        onDelete={handleDeleteSelectedTarget}
                        onOpenProperties={() => setIsPropertiesPanelOpen(true)}
                      />
                    )}
                  </div>
                )}

                {/* 7. Custom Placed Elements Hitboxes */}
                {customElements.map((el) => {
                  const isSelected = selectedTarget?.type === 'custom' && selectedTarget.id === el.id;
                  if (el.isHidden) return null;

                  return (
                    <div
                      key={el.id}
                      onMouseDown={(e) => handleStartDragTarget(e, { type: 'custom', id: el.id }, el.x, el.y)}
                      onTouchStart={(e) => handleStartDragTarget(e, { type: 'custom', id: el.id }, el.x, el.y)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTarget({ type: 'custom', id: el.id });
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setSelectedTarget({ type: 'custom', id: el.id });
                        if (el.type === 'text') {
                          setActiveInlineEdit('custom');
                        }
                      }}
                      className={`absolute pointer-events-auto z-20 cursor-move transition-shadow ${
                        isSelected ? 'ring-2 ring-[#635BFF] ring-offset-1 shadow-lg' : 'hover:ring-1 hover:ring-amber-300'
                      }`}
                      style={{
                        top: `${el.y * (showFooter ? 0.8 : 1)}%`,
                        left: `${el.x}%`,
                        transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg)`,
                        width: el.type === 'text' ? `${el.boxWidth || el.width || 60}%` : `${el.width || 25}%`,
                        height: el.type === 'text' ? 'auto' : `${el.height || 25}%`,
                        textAlign: (el.align as any) || 'center',
                      }}
                    >
                      {isSelected && activeInlineEdit === 'custom' && el.type === 'text' ? (
                        <div
                          className="bg-black/95 p-2 rounded-xl border-2 border-cyan-400 shadow-2xl flex flex-col gap-1.5 min-w-[240px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <textarea
                            rows={2}
                            autoFocus
                            value={el.content || ''}
                            onChange={(e) => handleUpdateCustomElement({ content: e.target.value })}
                            className="w-full bg-slate-900 text-white font-bold text-center p-1.5 rounded-lg text-xs border border-slate-700 outline-none focus:border-cyan-400"
                            style={{ fontFamily: el.fontFamily || "'Baloo 2', sans-serif" }}
                          />
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => setActiveInlineEdit(null)}
                              className="px-2 py-0.5 bg-cyan-500 text-black font-bold rounded text-[10px]"
                            >
                              ✓ Done
                            </button>
                          </div>
                        </div>
                      ) : (
                        isSelected && (
                          <CanvasBoundingBox
                            target={{ type: 'custom', id: el.id }}
                            coordinates={{
                              x: el.x,
                              y: el.y,
                              width: el.width,
                              height: el.height,
                              boxWidth: el.boxWidth,
                              rotation: el.rotation,
                              fontSize: el.fontSize,
                            }}
                            isText={el.type === 'text'}
                            isImage={el.type === 'image' || el.type === 'sticker' || el.type === 'shape'}
                            canEditInline={el.type === 'text'}
                            onStartInlineEdit={() => setActiveInlineEdit('custom')}
                            onStartResize={handleStartResize}
                            onNudgeSize={(inc) => {
                              if (el.type === 'text') {
                                handleUpdateCustomElement({
                                  fontSize: inc
                                    ? Math.min(60, (el.fontSize || 16) + 2)
                                    : Math.max(10, (el.fontSize || 16) - 2),
                                });
                              } else {
                                handleUpdateCustomElement({
                                  width: inc
                                    ? Math.min(85, (el.width || 25) + 3)
                                    : Math.max(10, (el.width || 25) - 3),
                                  height: inc
                                    ? Math.min(85, (el.height || 25) + 3)
                                    : Math.max(10, (el.height || 25) - 3),
                                });
                              }
                            }}
                            onCopy={handleCopy}
                            onDelete={handleDeleteSelectedTarget}
                            onOpenProperties={() => setIsPropertiesPanelOpen(true)}
                          />
                        )
                      )}
                    </div>
                  );
                })}

                {/* 80% Content Safe Area & 20% Footer Guide Lines (When active) */}
                {showSafeAreaGuides && (
                  <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between">
                    <div className="h-[80%] border-b-2 border-dashed border-cyan-400/60 bg-cyan-500/5 relative">
                      <span className="absolute top-2 left-2 bg-black/70 text-cyan-300 text-[9px] font-mono px-2 py-0.5 rounded border border-cyan-400/40">
                        ८०% मुख्य डिझाईन सेफ झोन (Content Safe Area)
                      </span>
                    </div>
                    <div className="h-[20%] border-t-2 border-dashed border-amber-400/80 bg-amber-500/10 relative">
                      <span className="absolute bottom-2 left-2 bg-black/70 text-amber-300 text-[9px] font-mono px-2 py-0.5 rounded border border-amber-400/40">
                        २०% ब्रँडिंग फुटर (Bottom 20% Footer)
                      </span>
                    </div>
                  </div>
                )}

                {/* 8. Bottom: Dynamic Brand Frame Hitbox (Fixed to exact bottom 20% height, Clickable to switch frame) */}
                {showFooter && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTarget({ type: 'frame' });
                      setActiveToolTab('frames');
                    }}
                    className={`absolute bottom-0 left-0 right-0 h-[20%] pointer-events-auto z-20 cursor-pointer transition-all ${
                      selectedTarget?.type === 'frame'
                        ? 'ring-2 ring-cyan-400 shadow-xl'
                        : 'hover:ring-1 hover:ring-dashed hover:ring-amber-300/80'
                    }`}
                    title="क्लिक करा: बिझनेस फ्रेम बदला (Change Frame)"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Floating Canvas Controls Bar (Zoom, Fit, Guides, Properties Toggle) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 bg-white/95 px-3 py-1.5 rounded-full border border-[#E7E7EE] shadow-lg z-30 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#18181B] cursor-pointer"
              title="झूम कमी करा (Zoom Out)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-700 min-w-[40px] text-center select-none">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(200, prev + 10))}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#18181B] cursor-pointer"
              title="झूम वाढवा (Zoom In)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="text-[11px] font-bold text-slate-600 hover:text-[#635BFF] px-1.5 cursor-pointer"
              title="स्क्रीनवर बसवा (Fit)"
            >
              Fit
            </button>
            <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={() => setShowSafeAreaGuides(!showSafeAreaGuides)}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                showSafeAreaGuides
                  ? 'bg-indigo-50 text-[#635BFF] border border-[#635BFF]/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="८०% मुख्य सेफ झोन व २०% फुटर गाईड"
            >
              गाईड्स
            </button>
            <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isPropertiesPanelOpen
                  ? 'bg-indigo-50 text-[#635BFF]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title={isPropertiesPanelOpen ? 'प्रॉपर्टीज पॅनेल लपवा' : 'प्रॉपर्टीज पॅनेल उघडा'}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ZONE 3: RIGHT PROPERTIES PANEL (Context-Sensitive SaaS Inspector) */}
        {isPropertiesPanelOpen && (
          <CanvasPropertiesPanel
            isOpen={isPropertiesPanelOpen}
            onClose={() => setIsPropertiesPanelOpen(false)}
            selectedTarget={selectedTarget}
            selectedCustomElement={selectedCustomElement}
            headline={headline}
            subtext={subtext}
            quote={quote}
            headlineStyle={headlineStyle}
            subtextStyle={subtextStyle}
            quoteStyle={quoteStyle}
            dateBadgeStyle={dateBadgeStyle}
            motifStyle={motifStyle}
            companyLogoUrl={companyLogoUrl}
            companyLogoPosition={companyLogoPosition}
            footerConfig={footerConfig}
            aspectRatio={aspectRatio}
            onUpdateHeadlineText={(txt) => {
              setHeadline(txt);
              setHeadlineStyle((prev) => ({ ...prev, isHidden: false }));
            }}
            onUpdateSubtextText={(txt) => {
              setSubtext(txt);
              setSubtextStyle((prev) => ({ ...prev, isHidden: false }));
            }}
            onUpdateQuoteText={(txt) => {
              setQuote(txt);
              setQuoteStyle((prev) => ({ ...prev, isHidden: false }));
            }}
            onUpdateHeadlineStyle={(u) => setHeadlineStyle((prev) => ({ ...prev, ...u }))}
            onUpdateSubtextStyle={(u) => setSubtextStyle((prev) => ({ ...prev, ...u }))}
            onUpdateQuoteStyle={(u) => setQuoteStyle((prev) => ({ ...prev, ...u }))}
            onUpdateDateBadgeStyle={(u) => setDateBadgeStyle((prev) => ({ ...prev, ...u }))}
            onUpdateMotifStyle={(u) => setMotifStyle((prev) => ({ ...prev, ...u }))}
            onUpdateCompanyLogoPosition={(u) => setCompanyLogoPosition((prev) => ({ ...prev, ...u }))}
            onUpdateCustomElement={handleUpdateCustomElement}
            onUpdateFooterConfig={(u) => setFooterConfig((prev) => ({ ...prev, ...u }))}
            onDeleteTarget={handleDeleteSelectedTarget}
            onCopyTarget={handleCopy}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onRemoveBackground={handleRemoveBackgroundForSelected}
            isProcessingBg={isProcessingBg}
          />
        )}
      </div>

      {/* 👑 Super Admin Category Modal */}
      {isSuperAdminCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-5 space-y-4 text-white shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <Shield className="w-4 h-4" />
                <span>👑 सुपर ॲडमीन: पोस्टरची कॅटेगरी बदला</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSuperAdminCategoryModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              सुपर ॲडमीन म्हणून तुम्ही हे पोस्टर दुसऱ्या कोणत्याही सण किंवा बिझनेस कॅटेगरीमध्ये ट्रान्सफर करू शकता:
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">नवीन कॅटेगरी निवडा:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-amber-400/50 rounded-xl text-xs text-white font-bold outline-none focus:ring-2 focus:ring-amber-400"
              >
                {categoriesList.filter(c => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameMarathi || c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSuperAdminCategoryModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSuperAdminCategoryModalOpen(false);
                  setUndoToast({
                    message: `✓ कॅटेगरी "${categoriesList.find(c => c.id === selectedCategory)?.nameMarathi || selectedCategory}" निवडली. 'सर्वांसाठी सेव्ह करा' वर क्लिक करून सेव्ह करा.`,
                    onUndo: () => {},
                  });
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-md cursor-pointer"
              >
                लागू करा (Apply)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

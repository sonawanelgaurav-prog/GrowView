import React, { useState, useRef, useEffect } from 'react';
import { 
  MasterTemplate, 
  MasterTemplateConfig, 
  CanvasCustomElement, 
  ElementLibraryItem 
} from '../../types';
import { MasterTemplateRenderer } from './MasterTemplateRenderer';
import { 
  DEFAULT_WEDDING_FORM_DATA, 
  DEFAULT_ENGAGEMENT_FORM_DATA, 
  DEFAULT_RESUME_FORM_DATA,
  saveMasterTemplates,
  loadMasterTemplates,
  resetMasterTemplateToDefault
} from '../../data/masterTemplates';
import { 
  generateDefaultElementsForTemplate,
  AVAILABLE_TEMPLATE_FONTS,
  CURATED_COLOR_SWATCHES
} from '../../utils/masterTemplateElements';
import { ElementRenderer } from '../elements/ElementRenderer';
import { ElementsDrawer } from '../elements/ElementsDrawer';
import { CanvasElementHandles } from '../canvas/CanvasElementHandles';
import { fileToDataUrl } from '../../utils/imageProcessing';
import { 
  X, 
  Check, 
  Sparkles, 
  Palette, 
  Type, 
  Layers, 
  Sliders, 
  RotateCcw, 
  RotateCw,
  Image as ImageIcon,
  ShieldAlert,
  Eye,
  Crown,
  Plus,
  Minus,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Move,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  Upload,
  Maximize2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Smile,
  Shield
} from 'lucide-react';

interface MasterTemplateAdminEditorModalProps {
  template: MasterTemplate;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updatedTemplate: MasterTemplate) => void;
}

const GRADIENT_PRESETS = [
  { label: 'None (Solid Color)', value: '' },
  { label: 'Peshwai Gold & Crimson', value: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fed7aa 100%)' },
  { label: 'Royal Maroon Brocade', value: 'linear-gradient(135deg, #7f1d1d 0%, #831843 50%, #581c87 100%)' },
  { label: 'Emerald Velvet', value: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)' },
  { label: 'Midnight Blue & Silver', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' },
  { label: 'Blush Rose & Gold', value: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fdf2f8 100%)' },
  { label: 'Classic Ivory Parchment', value: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 50%, #fef08a 100%)' },
  { label: 'Clean Tech White/Slate', value: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)' },
  { label: 'Sunset Amber & Ruby', value: 'linear-gradient(135deg, #ffedd5 0%, #fecdd3 50%, #fbcfe8 100%)' },
  { label: 'Deep Royal Purple', value: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #7e22ce 100%)' },
];

const HEADING_FONTS = [
  { label: 'Rozha One (पारंपारिक मराठी)', value: 'Rozha One, serif' },
  { label: 'Tiro Devanagari Marathi (मराठी सुंदर)', value: 'Tiro Devanagari Marathi, serif' },
  { label: 'Playfair Display (रॉयल क्लासिक)', value: 'Playfair Display, serif' },
  { label: 'Cinzel (लक्झरी रोमन)', value: 'Cinzel, serif' },
  { label: 'Poppins (मॉडर्न बोल्ड)', value: 'Poppins, sans-serif' },
  { label: 'Outfit (क्लीन टेक)', value: 'Outfit, sans-serif' },
  { label: 'Great Vibes (एलिगंट कर्सिव्ह)', value: 'Great Vibes, cursive' },
  { label: 'Georgia (क्लासिक सेरिफ)', value: 'Georgia, serif' },
  { label: 'Baloo 2 (मराठी बोल्ड)', value: "'Baloo 2', sans-serif" },
  { label: 'Kalam (हस्तलिखित)', value: "'Kalam', cursive" },
];

const BODY_FONTS = [
  { label: 'Poppins (Clean Sans)', value: 'Poppins, sans-serif' },
  { label: 'Tiro Devanagari Marathi (Marathi Standard)', value: 'Tiro Devanagari Marathi, serif' },
  { label: 'Inter (High Readability)', value: 'Inter, sans-serif' },
  { label: 'Calibri / Arial (Professional)', value: 'Calibri, Arial, sans-serif' },
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Courier / Mono (Tech Developer)', value: 'Courier, monospace' },
];

// Predefined Marathi Wedding & Religious Verses / Shlokas for one-click insertion
const MARATHI_TEXT_PRESETS = [
  { label: '।। श्री गणेशाय नमः ।।', text: '।। श्री गणेशाय नमः ।।', size: 22, color: '#f59e0b', font: 'Rozha One, serif' },
  { label: '।। वक्रतुण्ड महाकाय ।।', text: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥', size: 14, color: '#fef3c7', font: 'Tiro Devanagari Marathi, serif' },
  { label: 'शुभ विवाह', text: '॥ शुभ विवाह ॥', size: 28, color: '#fbbf24', font: 'Rozha One, serif' },
  { label: 'सस्नेह निमंत्रण', text: 'सस्नेह निमंत्रण', size: 20, color: '#fef08a', font: 'Tiro Devanagari Marathi, serif' },
  { label: 'साखरपुडा सोहळा', text: '॥ साखरपुडा सोहळा ॥', size: 26, color: '#fb7185', font: 'Rozha One, serif' },
  { label: 'दोन जीवांचे रेशीमबंध', text: 'दोन जीवांचे पवित्र रेशीमबंध जुळताना...', size: 15, color: '#fdf2f8', font: "'Kalam', cursive" },
  { label: '॥ शुभमंगल सावधान ॥', text: '॥ शुभमंगल सावधान ॥', size: 22, color: '#ea580c', font: 'Rozha One, serif' },
  { label: 'स्नेहपूर्वक आग्रहाचे निमंत्रण', text: 'स्नेहपूर्वक आग्रहाचे निमंत्रण', size: 16, color: '#cbd5e1', font: 'Tiro Devanagari Marathi, serif' },
];

// Quick Traditional Motifs to insert
const TRADITIONAL_MOTIF_PRESETS: { label: string; subType: string; content: string; category: string }[] = [
  { label: '🚩 श्री गणेश', subType: 'ganpati', content: 'Ganesh', category: 'festival' },
  { label: '🪔 कलश व नारळ', subType: 'kalash', content: 'Kalash', category: 'festival' },
  { label: '💍 लग्नाच्या अंगठ्या', subType: 'rings', content: 'Wedding Rings', category: 'decorations' },
  { label: '🦚 मोरपीस', subType: 'peacock', content: 'Peacock Feather', category: 'decorations' },
  { label: '🌸 कमळ / लोटस', subType: 'lotus', content: 'Lotus Flower', category: 'decorations' },
  { label: '🎺 सनई व चौघडा', subType: 'shehnai', content: 'Shehnai', category: 'festival' },
  { label: '✨ हळदी-कुंकू', subType: 'haldi-kumkum', content: 'Haldi Kumkum', category: 'festival' },
  { label: '⚜️ सोनेरी कमान / बॉर्डर', subType: 'gold-divider', content: 'Golden Ornate Divider', category: 'borders' },
];

export const MasterTemplateAdminEditorModal: React.FC<MasterTemplateAdminEditorModalProps> = ({
  template,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [editedTemplate, setEditedTemplate] = useState<MasterTemplate>(() => {
    const existing = template.template_config?.customElements;
    const initialElements = (existing && existing.length > 0)
      ? existing
      : generateDefaultElementsForTemplate(template);

    return {
      ...template,
      template_config: {
        ...template.template_config,
        headingFontSize: template.template_config?.headingFontSize || 28,
        bodyFontSize: template.template_config?.bodyFontSize || 12,
        customElements: initialElements,
      },
    };
  });

  // Undo / Redo History Stack
  const [historyPast, setHistoryPast] = useState<MasterTemplate[]>([]);
  const [historyFuture, setHistoryFuture] = useState<MasterTemplate[]>([]);

  // Navigation Sidebar Active Tab (PosterEditor-Style)
  const [activeTab, setActiveTab] = useState<'text' | 'stickers' | 'background' | 'layout' | 'layers'>('text');

  // Interactive Drag & Selection State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeInlineEdit, setActiveInlineEdit] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(0.65);
  const [showSafeGuides, setShowSafeGuides] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // References for Dragging & Resizing
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const isResizingRef = useRef<boolean>(false);
  const dragRafIdRef = useRef<number | null>(null);
  const dragTargetRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    elX: number;
    elY: number;
  } | null>(null);
  const resizeDataRef = useRef<{
    id: string;
    handle: string;
    startX: number;
    startY: number;
    initialWidth: number;
    initialHeight: number;
    initialFontSize: number;
    initialBoxWidth: number;
  } | null>(null);

  // Background image file upload
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);
  const stickerFileInputRef = useRef<HTMLInputElement | null>(null);

  // Push history snapshot before mutation
  const pushSnapshot = () => {
    setHistoryPast((prev) => [...prev.slice(-15), JSON.parse(JSON.stringify(editedTemplate))]);
    setHistoryFuture([]);
  };

  const handleUndo = () => {
    if (historyPast.length === 0) return;
    const previous = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, -1);
    setHistoryFuture((prev) => [JSON.parse(JSON.stringify(editedTemplate)), ...prev]);
    setHistoryPast(newPast);
    setEditedTemplate(previous);
    showToast('↩️ पूर्ववत केले (Undo)');
  };

  const handleRedo = () => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    const newFuture = historyFuture.slice(1);
    setHistoryPast((prev) => [...prev, JSON.parse(JSON.stringify(editedTemplate))]);
    setHistoryFuture(newFuture);
    setEditedTemplate(next);
    showToast('↪️ पुन्हा केले (Redo)');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Keep customElements array synchronized
  const customElements: CanvasCustomElement[] = editedTemplate.template_config?.customElements || [];
  const selectedElement = customElements.find((el) => el.id === selectedElementId) || null;

  const updateCustomElements = (newElements: CanvasCustomElement[]) => {
    setEditedTemplate((prev) => ({
      ...prev,
      template_config: {
        ...(prev.template_config || ({} as MasterTemplateConfig)),
        customElements: newElements,
      },
    }));
  };

  const updateSingleCustomElement = (id: string, updates: Partial<CanvasCustomElement>) => {
    updateCustomElements(
      customElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // 1. Add Draggable Text Box
  const handleAddText = (initialText = 'येथे मजकूर टाईप करा', opts: Partial<CanvasCustomElement> = {}) => {
    pushSnapshot();
    const newId = `txt-${Date.now()}`;
    const newEl: CanvasCustomElement = {
      id: newId,
      type: 'text',
      content: initialText,
      x: 50,
      y: 45,
      width: 65,
      boxWidth: 65,
      fontSize: opts.fontSize || 22,
      color: opts.color || '#ffffff',
      fontFamily: opts.fontFamily || 'Rozha One, serif',
      isBold: opts.isBold ?? true,
      align: 'center',
      lineHeight: 1.3,
      shadow: true,
      zIndex: customElements.length + 10,
      ...opts,
    };
    updateCustomElements([...customElements, newEl]);
    setSelectedElementId(newId);
    setActiveInlineEdit(newId);
    showToast('✍️ नवीन मजकूर जोडला! ड्रॅग करा किंवा टाईप करा.');
  };

  // 2. Add Draggable Sticker / Motif
  const handleAddSticker = (subType: string, label: string) => {
    pushSnapshot();
    const newId = `stk-${Date.now()}`;
    const newEl: CanvasCustomElement = {
      id: newId,
      type: 'sticker',
      subType,
      content: label,
      name: label,
      x: 50,
      y: 40,
      width: 28,
      height: 28,
      rotation: 0,
      opacity: 1,
      zIndex: customElements.length + 10,
    };
    updateCustomElements([...customElements, newEl]);
    setSelectedElementId(newId);
    showToast(`✨ ${label} जोडला!`);
  };

  // 3. Add Element from full ElementsDrawer
  const handleAddFromLibrary = (item: ElementLibraryItem) => {
    pushSnapshot();
    const newId = `lib-${Date.now()}`;
    const newEl: CanvasCustomElement = {
      id: newId,
      type: item.type,
      subType: item.subType || item.id,
      name: item.titleMarathi || item.title,
      content: item.title,
      x: 50,
      y: 45,
      width: item.defaultConfig?.width || 25,
      height: item.defaultConfig?.height || 25,
      color: item.defaultConfig?.color || '#f59e0b',
      fillColor: item.defaultConfig?.fillColor || '#f59e0b',
      opacity: 1,
      rotation: 0,
      zIndex: customElements.length + 10,
      ...item.defaultConfig,
    };
    updateCustomElements([...customElements, newEl]);
    setSelectedElementId(newId);
    showToast(`✨ ${item.titleMarathi || item.title} जोडला!`);
  };

  // 4. Upload Custom PNG / Sticker
  const handleUploadCustomSticker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      pushSnapshot();
      const newId = `img-${Date.now()}`;
      const newEl: CanvasCustomElement = {
        id: newId,
        type: 'custom-photo',
        imageUrl: dataUrl,
        photoUrl: dataUrl,
        name: file.name,
        x: 50,
        y: 45,
        width: 30,
        height: 30,
        opacity: 1,
        rotation: 0,
        isTransparentBg: file.type === 'image/png',
        zIndex: customElements.length + 10,
      };
      updateCustomElements([...customElements, newEl]);
      setSelectedElementId(newId);
      showToast('📸 कस्टम इमेज पोस्टरवर जोडली!');
    } catch (err) {
      alert('इमेज अपलोड करताना त्रुटी आली.');
    }
  };

  // 5. Upload Custom Background Image
  const handleUploadBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      pushSnapshot();
      setEditedTemplate((prev) => ({
        ...prev,
        template_config: {
          ...(prev.template_config || ({} as MasterTemplateConfig)),
          bgImageUrl: dataUrl,
          bgGradient: '',
        },
      }));
      showToast('🖼️ नवीन बॅकग्राउंड वॉलपेपर सेट झाला!');
    } catch (err) {
      alert('बॅकग्राउंड इमेज लोड करता आली नाही.');
    }
  };

  // Duplicate Element
  const handleDuplicateElement = (id: string) => {
    const target = customElements.find((el) => el.id === id);
    if (!target) return;
    pushSnapshot();
    const cloned: CanvasCustomElement = {
      ...target,
      id: `clone-${Date.now()}`,
      x: Math.min(88, target.x + 4),
      y: Math.min(88, target.y + 4),
      zIndex: customElements.length + 10,
    };
    updateCustomElements([...customElements, cloned]);
    setSelectedElementId(cloned.id);
    showToast('📄 घटक डुप्लिकेट झाला!');
  };

  // Delete Element
  const handleDeleteElement = (id: string) => {
    pushSnapshot();
    updateCustomElements(customElements.filter((el) => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
      setActiveInlineEdit(null);
    }
    showToast('🗑️ घटक डिलीट केला!');
  };

  // Reorder Layer
  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    pushSnapshot();
    const idx = customElements.findIndex((el) => el.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx < customElements.length - 1) {
      const copy = [...customElements];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      updateCustomElements(copy);
    } else if (direction === 'down' && idx > 0) {
      const copy = [...customElements];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      updateCustomElements(copy);
    }
  };

  // Drag Handlers
  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    const el = customElements.find((item) => item.id === id);
    if (!el || el.isLocked) return;
    e.stopPropagation();
    setSelectedElementId(id);
    isDraggingRef.current = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragTargetRef.current = {
      id,
      startX: clientX,
      startY: clientY,
      elX: el.x,
      elY: el.y,
    };
  };

  // Resize Handlers
  const handleStartResize = (
    e: React.MouseEvent | React.TouchEvent,
    target: any,
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'e' | 'w',
    currentProps: any
  ) => {
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
    isResizingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (!selectedElement) return;

    resizeDataRef.current = {
      id: selectedElement.id,
      handle,
      startX: clientX,
      startY: clientY,
      initialWidth: selectedElement.width || 25,
      initialHeight: selectedElement.height || 25,
      initialFontSize: selectedElement.fontSize || 20,
      initialBoxWidth: selectedElement.boxWidth || 60,
    };
  };

  // Window pointermove & pointerup listener for butter-smooth dragging
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ((!isDraggingRef.current && !isResizingRef.current) || !canvasRef.current) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

      if (dragRafIdRef.current) cancelAnimationFrame(dragRafIdRef.current);

      dragRafIdRef.current = requestAnimationFrame(() => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        // 1. Resizing from handles
        if (isResizingRef.current && resizeDataRef.current) {
          const { id, handle, startX, startY, initialWidth, initialHeight, initialFontSize, initialBoxWidth } = resizeDataRef.current;
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

          const effectiveDelta = (deltaX * factorX + deltaY * factorY) / 1.3;
          const el = customElements.find((item) => item.id === id);

          if (el) {
            if (el.type === 'text') {
              const newBoxWidth = Math.max(20, Math.min(96, Math.round(initialBoxWidth + deltaX * factorX)));
              const newFontSize = Math.max(10, Math.min(60, Math.round(initialFontSize + effectiveDelta * 0.4)));
              updateSingleCustomElement(id, { boxWidth: newBoxWidth, fontSize: newFontSize });
            } else {
              const newW = Math.max(8, Math.min(95, Math.round(initialWidth + effectiveDelta)));
              const aspect = (initialHeight || 1) / (initialWidth || 1);
              const newH = Math.max(8, Math.min(95, Math.round(newW * aspect)));
              updateSingleCustomElement(id, { width: newW, height: newH });
            }
          }
        }

        // 2. Dragging element across canvas
        if (isDraggingRef.current && dragTargetRef.current) {
          const { id, startX, startY, elX, elY } = dragTargetRef.current;
          const deltaX = ((clientX - startX) / rect.width) * 100;
          const deltaY = ((clientY - startY) / rect.height) * 100;

          const newX = Math.max(5, Math.min(95, Math.round(elX + deltaX)));
          const newY = Math.max(5, Math.min(95, Math.round(elY + deltaY)));

          updateSingleCustomElement(id, { x: newX, y: newY });
        }
      });
    };

    const handlePointerUp = () => {
      if (isDraggingRef.current || isResizingRef.current) {
        pushSnapshot();
      }
      isDraggingRef.current = false;
      isResizingRef.current = false;
      dragTargetRef.current = null;
      resizeDataRef.current = null;
      if (dragRafIdRef.current) cancelAnimationFrame(dragRafIdRef.current);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [customElements]);

  if (!isOpen) return null;

  // Save to localStorage & notify
  const handleSave = () => {
    const all = loadMasterTemplates();
    const updated = all.map((t) => (t.id === editedTemplate.id ? editedTemplate : t));
    saveMasterTemplates(updated);
    setSaveSuccess(true);
    if (onSaved) onSaved(editedTemplate);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Reset to default factory template
  const handleReset = () => {
    if (window.confirm(`खरोखरच ${editedTemplate.id} चे सर्व डिझाईन व घटक मूळ स्थितीत रिस्टोअर करायचे आहे का?`)) {
      const resetList = resetMasterTemplateToDefault(editedTemplate.id);
      const original = resetList.find((t) => t.id === editedTemplate.id);
      if (original) {
        const freshElements = generateDefaultElementsForTemplate(original);
        const restored: MasterTemplate = {
          ...original,
          template_config: {
            ...original.template_config,
            customElements: freshElements,
          },
        };
        setEditedTemplate(restored);
        if (onSaved) onSaved(restored);
        showToast('🔄 मूळ डिझाईन रिस्टोअर केले!');
      }
    }
  };

  const cfg = editedTemplate.template_config || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col h-screen w-screen overflow-hidden select-none animate-in fade-in duration-200">
      {/* 1. TOP STUDIO NAVIGATION BAR */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0 z-40">
        {/* Left: Back & Template Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="मागे जा"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">बंद करा</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/40">
              {editedTemplate.id}
            </span>
            <div className="hidden md:block">
              <h1 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{editedTemplate.name}</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-amber-400">
                  {editedTemplate.category === 'wedding'
                    ? 'लग्नपत्रिका (Wedding)'
                    : editedTemplate.category === 'engagement'
                    ? 'साखरपुडा (Engagement)'
                    : 'बायोडाटा / रेझ्युमे (Resume)'}
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Center: History, Zoom, Guidelines */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyPast.length === 0}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
            title="पूर्ववत करा (Undo)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyFuture.length === 0}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
            title="पुढे करा (Redo)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Zoom controls */}
          <button
            type="button"
            onClick={() => setZoomScale((prev) => Math.max(0.4, +(prev - 0.08).toFixed(2)))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="झूम कमी करा"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-bold text-amber-300 px-1 min-w-[42px] text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomScale((prev) => Math.min(1.2, +(prev + 0.08).toFixed(2)))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="झूम वाढवा"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Safe guidelines toggle */}
          <button
            type="button"
            onClick={() => setShowSafeGuides(!showSafeGuides)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              showSafeGuides ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-white'
            }`}
            title="सेफ झोन गाईड्स दाखवा"
          >
            <Shield className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Reset & Save Changes */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="मूळ डिझाईन रिस्टोअर करा"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">मूळ डिझाईन (Reset)</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>बदल सेव्ह करा (Save for All)</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN STUDIO WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* A. TOOLBAR TABS COLUMN (Canva-Style Left Dock) */}
        <div className="w-16 sm:w-20 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 gap-2 shrink-0 z-30">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`w-14 sm:w-16 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Type className="w-5 h-5" />
            <span>मजकूर</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stickers')}
            className={`w-14 sm:w-16 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'stickers'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>स्टिकर्स</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('background')}
            className={`w-14 sm:w-16 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'background'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Palette className="w-5 h-5" />
            <span>बॅकग्राउंड</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('layout')}
            className={`w-14 sm:w-16 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'layout'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span>लेआउट</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('layers')}
            className={`w-14 sm:w-16 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all cursor-pointer ${
              activeTab === 'layers'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span>घटक ({customElements.length})</span>
          </button>
        </div>

        {/* B. EXPANDED TOOL OPTIONS DRAWER */}
        <div className="w-72 sm:w-80 md:w-96 bg-slate-900/95 border-r border-slate-800 flex flex-col overflow-hidden shrink-0 z-20 shadow-2xl">
          {/* TAB 1: TEXT & TYPOGRAPHY */}
          {activeTab === 'text' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4 overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  + नवीन मजकूर जोडा (Add Draggable Text)
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddText('मुख्य मथळा', { fontSize: 26, isBold: true })}
                    className="w-full py-2 px-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ मोठा मथळा जोडा (Heading)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddText('उपशीर्षक / सदिच्छा', { fontSize: 18, isBold: true })}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ उपशीर्षक जोडा (Subheading)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddText('विस्तृत माहिती किंवा पत्ता येथे टाईप करा', { fontSize: 13, isBold: false })}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-normal flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ सामान्य माहिती मजकूर (Body Text)</span>
                  </button>
                </div>
              </div>

              {/* Ready-to-use Marathi Religious / Wedding Shlokas */}
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-2">
                  🚩 मराठी श्लोक व मंगलमय वचने (One-Click Insert):
                </h4>
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {MARATHI_TEXT_PRESETS.map((pst, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddText(pst.text, { fontSize: pst.size, color: pst.color, fontFamily: pst.font })}
                      className="w-full p-2 bg-slate-800/80 hover:bg-slate-700 text-left rounded-xl border border-slate-700/60 text-xs transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="font-semibold text-slate-200 group-hover:text-amber-300">
                        {pst.label}
                      </span>
                      <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Global Template Typography */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300">
                  📐 ग्लोबल टायपोग्राफी (Global Template Fonts):
                </h4>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Heading Font (शीर्षक फॉन्ट):
                  </label>
                  <select
                    value={editedTemplate.heading_font || 'Rozha One, serif'}
                    onChange={(e) =>
                      setEditedTemplate({ ...editedTemplate, heading_font: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {HEADING_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Heading Font Size (साईज):</span>
                    <span className="text-amber-400 font-bold">{cfg.headingFontSize || 28}px</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="48"
                    value={cfg.headingFontSize || 28}
                    onChange={(e) =>
                      setEditedTemplate({
                        ...editedTemplate,
                        template_config: { ...cfg, headingFontSize: Number(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Body Font (माहिती फॉन्ट):
                  </label>
                  <select
                    value={editedTemplate.body_font || 'Poppins, sans-serif'}
                    onChange={(e) =>
                      setEditedTemplate({ ...editedTemplate, body_font: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {BODY_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Body Font Size (साईज):</span>
                    <span className="text-amber-400 font-bold">{cfg.bodyFontSize || 12}px</span>
                  </div>
                  <input
                    type="range"
                    min="9"
                    max="18"
                    value={cfg.bodyFontSize || 12}
                    onChange={(e) =>
                      setEditedTemplate({
                        ...editedTemplate,
                        template_config: { ...cfg, bodyFontSize: Number(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STICKERS & MOTIFS DRAWER */}
          {activeTab === 'stickers' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Quick Traditional Motifs Bar */}
              <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2 shrink-0">
                <span className="text-xs font-bold text-amber-400 block">
                  ✨ लग्न व सण पारंपारिक चिन्हे (Quick Motifs):
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {TRADITIONAL_MOTIF_PRESETS.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSticker(m.subType, m.label)}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-amber-600/30 hover:border-amber-400/50 border border-slate-700 rounded-xl text-left text-[11px] font-semibold text-slate-200 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>{m.label}</span>
                      <Plus className="w-3 h-3 text-amber-400" />
                    </button>
                  ))}
                </div>

                {/* Upload Custom Sticker PNG */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">स्वतःचे स्टिकर / PNG:</span>
                  <label className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all">
                    <Upload className="w-3 h-3" />
                    <span>अपलोड करा</span>
                    <input
                      ref={stickerFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleUploadCustomSticker}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Complete ElementsDrawer */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <ElementsDrawer
                  onAddElement={handleAddFromLibrary}
                  favorites={[]}
                  onToggleFavorite={() => {}}
                  recentElementIds={[]}
                  onAddNewText={() => handleAddText()}
                />
              </div>
            </div>
          )}

          {/* TAB 3: BACKGROUND & COLORS */}
          {activeTab === 'background' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4 overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  🎨 बॅकग्राउंड व रंगछटा (Background & Colors)
                </h3>

                {/* Solid Background Color */}
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-white">
                    सॉलिड बॅकग्राउंड रंग (Solid Color):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editedTemplate.bg_color || '#ffffff'}
                      onChange={(e) =>
                        setEditedTemplate({ ...editedTemplate, bg_color: e.target.value })
                      }
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={editedTemplate.bg_color || '#ffffff'}
                      onChange={(e) =>
                        setEditedTemplate({ ...editedTemplate, bg_color: e.target.value })
                      }
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Gradient Presets */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  शाही ग्रेडियंट्स (Royal Gradients):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setEditedTemplate({
                          ...editedTemplate,
                          template_config: { ...cfg, bgGradient: preset.value, bgImageUrl: '' },
                        })
                      }
                      className={`p-2.5 rounded-xl border text-left text-[11px] font-semibold transition-all cursor-pointer ${
                        cfg.bgGradient === preset.value
                          ? 'border-amber-400 bg-amber-500/20 text-white'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div
                        className="w-full h-5 rounded-lg mb-1.5 border border-white/20"
                        style={{
                          background: preset.value || editedTemplate.bg_color || '#ffffff',
                        }}
                      />
                      <span className="line-clamp-1">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern Overlays */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  पॅटर्न ओव्हरले (Pattern Texture):
                </label>
                <select
                  value={cfg.bgPatternType || 'none'}
                  onChange={(e) =>
                    setEditedTemplate({
                      ...editedTemplate,
                      template_config: { ...cfg, bgPatternType: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="none">काहीही नाही (Plain Background)</option>
                  <option value="mandala">पारंपारिक मंडला (Mandala Pattern)</option>
                  <option value="damask">शाही डमास्क (Royal Damask Pattern)</option>
                  <option value="geometric">जिओमेट्रिक जाळी (Geometric Mesh)</option>
                  <option value="dots">मिनिमल डॉट्स (Subtle Dots)</option>
                </select>
              </div>

              {/* Custom Image Background */}
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-white">
                  📸 स्वतःचा वॉलपेपर / बॅकग्राउंड फोटो:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/art.jpg"
                    value={cfg.bgImageUrl || ''}
                    onChange={(e) =>
                      setEditedTemplate({
                        ...editedTemplate,
                        template_config: { ...cfg, bgImageUrl: e.target.value, bgGradient: '' },
                      })
                    }
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  {cfg.bgImageUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditedTemplate({
                          ...editedTemplate,
                          template_config: { ...cfg, bgImageUrl: '' },
                        })
                      }
                      className="p-2 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white"
                      title="फोटो काढा"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">किंवा कम्प्युटरवरून निवडा:</span>
                  <label className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all">
                    <Upload className="w-3 h-3" />
                    <span>फाईल निवडा</span>
                    <input
                      ref={bgFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUploadBackground}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Theme Primary & Secondary Colors */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Primary Color:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editedTemplate.primary_color || '#831843'}
                      onChange={(e) =>
                        setEditedTemplate({ ...editedTemplate, primary_color: e.target.value })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {editedTemplate.primary_color}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Secondary (Gold):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editedTemplate.secondary_color || '#d97706'}
                      onChange={(e) =>
                        setEditedTemplate({ ...editedTemplate, secondary_color: e.target.value })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {editedTemplate.secondary_color}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT & BORDERS */}
          {activeTab === 'layout' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-4 overflow-y-auto">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                🖼️ लेआउट व बॉर्डर्स (Layout Archetype)
              </h3>

              {/* Layout Variant Switcher */}
              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1.5">
                  लेआउट प्रकार (Layout Archetype):
                </label>
                <select
                  value={cfg.layoutVariant || editedTemplate.layout_type}
                  onChange={(e) =>
                    setEditedTemplate({
                      ...editedTemplate,
                      layout_type: e.target.value,
                      template_config: { ...cfg, layoutVariant: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                >
                  {editedTemplate.category === 'wedding' && (
                    <>
                      <option value="peshwai-royal">पेशवाई रॉयल लग्नपत्रिका (Peshwai Arch & Gold)</option>
                      <option value="floral-botanical">फ्लोरल पेस्टल लग्नपत्रिका (Floral Botanical Side-by-Side)</option>
                      <option value="modern-minimal-geometric">मॉडर्न मिनिमल जिओमेट्रिक (Modern Minimal Geometric)</option>
                      <option value="traditional-mandap">मांडव व हळदी पारंपारिक (Traditional Mandap Yellow)</option>
                    </>
                  )}

                  {editedTemplate.category === 'engagement' && (
                    <>
                      <option value="rose-gold-luxury">रोझ गोल्ड रिंग सेरेमनी (Rose Gold Luxury Rings)</option>
                      <option value="emerald-peacock">रॉयल एमराल्ड मोरपीस (Royal Emerald Peacock)</option>
                      <option value="contemporary-duo">कंटेम्पररी साखरपुडा (Contemporary Duo Card)</option>
                    </>
                  )}

                  {editedTemplate.category === 'resume' && (
                    <>
                      <option value="vivah-biodata">मराठी विवाह बायोडाटा (Marathi Vivah Biodata 2-Column)</option>
                      <option value="modern-sidebar">एक्झिक्युटिव्ह डार्क साइडबार (Executive Dark Sidebar)</option>
                      <option value="header-banner">टॉप बॅनर क्रिएटिव्ह (Top Header Banner Creative)</option>
                      <option value="tech-minimalist">टेक / कोडिंग मिनिमलिस्ट (Tech Minimalist Developer)</option>
                      <option value="ats-single-column">क्लीन एटीएस स्टँडर्ड (Clean ATS Single Column)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Border Style */}
              <div>
                <label className="block text-slate-300 text-xs font-bold mb-1.5">
                  बॉर्डर स्टाईल (Border Style):
                </label>
                <select
                  value={cfg.borderStyle || 'gold-double'}
                  onChange={(e) =>
                    setEditedTemplate({
                      ...editedTemplate,
                      template_config: { ...cfg, borderStyle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                >
                  <option value="gold-double">सोनेरी दुहेरी बॉर्डर (Gold Double Frame)</option>
                  <option value="traditional-royal">पारंपारिक रॉयल कॉर्नर बॉर्डर (Royal Ornate Frame)</option>
                  <option value="floral-filigree">फ्लोरल फिलीग्री बॉर्डर (Floral Delicate)</option>
                  <option value="none">बॉर्डर नाही (Clean / Borderless)</option>
                </select>
              </div>

              {/* Corner Radius Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Card Corner Radius:</span>
                  <span className="text-amber-400 font-bold">{cfg.cardRadius || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="28"
                  value={cfg.cardRadius || 0}
                  onChange={(e) =>
                    setEditedTemplate({
                      ...editedTemplate,
                      template_config: { ...cfg, cardRadius: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Free vs VIP Tier Switcher */}
              <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl border border-slate-700 mt-3">
                <div>
                  <span className="font-bold text-white text-xs block">प्लॅन ॲक्सेस (Tier):</span>
                  <span className="text-[10px] text-slate-400">ग्राहकांसाठी विनामूल्य किंवा VIP</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditedTemplate({
                      ...editedTemplate,
                      is_free: !editedTemplate.is_free,
                      is_premium: editedTemplate.is_free,
                    })
                  }
                  className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    editedTemplate.is_free
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black'
                  }`}
                >
                  {editedTemplate.is_free ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> मोफत (FREE)
                    </>
                  ) : (
                    <>
                      <Crown className="w-3.5 h-3.5 fill-current" /> व्हीआयपी (VIP)
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: LAYERS & CANVAS ELEMENTS */}
          {activeTab === 'layers' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  📑 घटक व स्तर ({customElements.length})
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddText()}
                  className="px-2 py-1 bg-amber-500 text-slate-950 rounded-lg text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> जोडा
                </button>
              </div>

              {customElements.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                  <Layers className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs font-semibold text-slate-400">अद्याप कोणताही कस्टम घटक जोडलेला नाही.</p>
                  <p className="text-[11px] mt-1 text-slate-500">
                    'मजकूर' किंवा 'स्टिकर्स' टॅबमधून घटक जोडा आणि येथे त्यांचे स्तर नियंत्रित करा.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                  {customElements.map((el, idx) => {
                    const isSelected = el.id === selectedElementId;
                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 text-white shadow'
                            : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                          <span className="text-xs font-bold truncate">
                            {el.type === 'text'
                              ? el.content || 'मजकूर'
                              : el.name || el.subType || 'स्टिकर'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Visibility */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSingleCustomElement(el.id, { isHidden: !el.isHidden });
                            }}
                            className={`p-1 rounded ${el.isHidden ? 'text-slate-600' : 'text-slate-300 hover:text-white'}`}
                            title={el.isHidden ? 'दाखवा' : 'लपवा'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Lock */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSingleCustomElement(el.id, { isLocked: !el.isLocked });
                            }}
                            className={`p-1 rounded ${el.isLocked ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                            title={el.isLocked ? 'अनलॉक करा' : 'लॉक करा'}
                          >
                            {el.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          {/* Move Layer Up */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveLayer(el.id, 'up');
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white"
                            title="वर आणा"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Move Layer Down */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveLayer(el.id, 'down');
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white"
                            title="खाली पाठवा"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteElement(el.id);
                            }}
                            className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                            title="डिलीट करा"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* C. CENTER CANVASCRAFT STAGE (Interactive Live Canvas & Drag-and-Drop) */}
        <div
          className="flex-1 bg-slate-950 flex flex-col items-center justify-center relative p-3 sm:p-6 overflow-auto"
          onClick={() => {
            setSelectedElementId(null);
            setActiveInlineEdit(null);
          }}
        >
          {/* Quick Floating Action Bar for Selected Canvas Element */}
          {selectedElement && (
            <div
              className="absolute top-4 z-40 bg-slate-900/95 border border-cyan-400/80 shadow-2xl px-3 py-2 rounded-2xl flex flex-wrap items-center gap-2 backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-auto max-w-[95vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1 text-xs font-bold text-cyan-300 pr-2 border-r border-slate-700 shrink-0">
                <Move className="w-3.5 h-3.5" />
                <span>{selectedElement.name || 'घटक'}</span>
              </div>

              {selectedElement.type === 'text' && (
                <>
                  {/* Direct Text Editor Input */}
                  <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 min-w-[170px] max-w-[260px]">
                    <Type className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <input
                      type="text"
                      value={selectedElement.content || ''}
                      onChange={(e) =>
                        updateSingleCustomElement(selectedElement.id, { content: e.target.value })
                      }
                      className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-slate-400"
                      placeholder="मजकूर बदला..."
                    />
                  </div>

                  {/* Font Family selector */}
                  <select
                    value={selectedElement.fontFamily || 'Rozha One, serif'}
                    onChange={(e) =>
                      updateSingleCustomElement(selectedElement.id, { fontFamily: e.target.value })
                    }
                    className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-cyan-400 focus:outline-none max-w-[150px]"
                  >
                    {AVAILABLE_TEMPLATE_FONTS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.name}
                      </option>
                    ))}
                  </select>

                  {/* Font Size decrease / input / increase */}
                  <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                    <button
                      type="button"
                      onClick={() =>
                        updateSingleCustomElement(selectedElement.id, {
                          fontSize: Math.max(8, (selectedElement.fontSize || 20) - 2),
                        })
                      }
                      className="p-1 text-slate-300 hover:text-white"
                      title="फॉन्ट साईज लहान करा"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min="8"
                      max="90"
                      value={selectedElement.fontSize || 20}
                      onChange={(e) =>
                        updateSingleCustomElement(selectedElement.id, {
                          fontSize: Number(e.target.value) || 16,
                        })
                      }
                      className="w-10 text-center bg-transparent text-xs font-mono font-bold text-amber-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateSingleCustomElement(selectedElement.id, {
                          fontSize: Math.min(90, (selectedElement.fontSize || 20) + 2),
                        })
                      }
                      className="p-1 text-slate-300 hover:text-white"
                      title="फॉन्ट साईज मोठी करा"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Bold / Italic / Underline */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateSingleCustomElement(selectedElement.id, {
                          isBold: !selectedElement.isBold,
                        })
                      }
                      className={`p-1.5 rounded-lg border text-xs ${
                        selectedElement.isBold
                          ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title="ठळक (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSingleCustomElement(selectedElement.id, {
                          isItalic: !selectedElement.isItalic,
                        })
                      }
                      className={`p-1.5 rounded-lg border text-xs ${
                        selectedElement.isItalic
                          ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title="तिरपे (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSingleCustomElement(selectedElement.id, {
                          isUnderline: !selectedElement.isUnderline,
                        })
                      }
                      className={`p-1.5 rounded-lg border text-xs ${
                        selectedElement.isUnderline
                          ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title="अधोरेखित (Underline)"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Color Swatches & Picker */}
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    {CURATED_COLOR_SWATCHES.slice(0, 5).map((sw) => (
                      <button
                        key={sw.color}
                        type="button"
                        onClick={() =>
                          updateSingleCustomElement(selectedElement.id, { color: sw.color })
                        }
                        className={`w-4 h-4 rounded-full border ${
                          selectedElement.color === sw.color
                            ? 'ring-2 ring-cyan-400 scale-110'
                            : 'border-slate-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: sw.color }}
                        title={sw.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedElement.color || '#ffffff'}
                      onChange={(e) =>
                        updateSingleCustomElement(selectedElement.id, { color: e.target.value })
                      }
                      className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 ml-0.5"
                      title="इतर रंग निवडा"
                    />
                  </div>

                  {/* Alignment */}
                  <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                    <button
                      type="button"
                      onClick={() =>
                        updateSingleCustomElement(selectedElement.id, { align: 'left' })
                      }
                      className={`p-1 rounded ${selectedElement.align === 'left' ? 'bg-cyan-500 text-black' : 'text-slate-300'}`}
                      title="डावीकडे"
                    >
                      <AlignLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSingleCustomElement(selectedElement.id, { align: 'center' })
                      }
                      className={`p-1 rounded ${!selectedElement.align || selectedElement.align === 'center' ? 'bg-cyan-500 text-black' : 'text-slate-300'}`}
                      title="मध्यभागी"
                    >
                      <AlignCenter className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateSingleCustomElement(selectedElement.id, { align: 'right' })
                      }
                      className={`p-1 rounded ${selectedElement.align === 'right' ? 'bg-cyan-500 text-black' : 'text-slate-300'}`}
                      title="उजवीकडे"
                    >
                      <AlignRight className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}

              {/* Duplicate */}
              <button
                type="button"
                onClick={() => handleDuplicateElement(selectedElement.id)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                title="डुप्लिकेट करा"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDeleteElement(selectedElement.id)}
                className="p-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg border border-rose-500/40"
                title="घटक डिलीट करा"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  setSelectedElementId(null);
                  setActiveInlineEdit(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                title="निवड रद्द करा"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Toast Banner */}
          {toastMessage && (
            <div className="absolute top-16 z-50 bg-slate-900 border border-amber-400/80 shadow-2xl px-4 py-2 rounded-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
              <span className="text-xs font-bold text-slate-200">{toastMessage}</span>
            </div>
          )}

          {/* Scaled Interactive Canvas Container */}
          <div
            ref={canvasRef}
            className="relative transition-transform duration-100 ease-out shadow-2xl rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'center center',
              width: editedTemplate.category === 'resume' ? '700px' : '580px',
              minHeight: editedTemplate.category === 'resume' ? '920px' : '820px',
            }}
            onClick={(e) => {
              if (e.target === canvasRef.current) {
                setSelectedElementId(null);
                setActiveInlineEdit(null);
              }
            }}
          >
            {/* Safe zone guidelines */}
            {showSafeGuides && (
              <div className="absolute inset-8 border border-cyan-400/40 border-dashed rounded-xl pointer-events-none z-30 flex items-start justify-end p-2">
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
                  Safe Area Guide
                </span>
              </div>
            )}

            {/* 1. Underlying Real Master Template Background & Border Frame */}
            <MasterTemplateRenderer
              template={editedTemplate}
              weddingData={DEFAULT_WEDDING_FORM_DATA}
              engagementData={DEFAULT_ENGAGEMENT_FORM_DATA}
              resumeData={DEFAULT_RESUME_FORM_DATA}
              scale={1}
              isFullView={true}
              backgroundOnly={true}
              className="w-full h-full pointer-events-none"
            />

            {/* 2. Interactive Overlaid Draggable Custom Elements */}
            <div className="absolute inset-0 z-20 pointer-events-auto">
              {customElements.map((el) => {
                const isSelected = el.id === selectedElementId;
                if (el.isHidden) return null;

                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleStartDrag(e, el.id)}
                    onTouchStart={(e) => handleStartDrag(e, el.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(el.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(el.id);
                      if (el.type === 'text') {
                        setActiveInlineEdit(el.id);
                      }
                    }}
                    className={`absolute pointer-events-auto cursor-move select-none transition-shadow ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 shadow-2xl z-30'
                        : 'hover:ring-1 hover:ring-amber-400 hover:ring-dashed'
                    }`}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      transform: `translate(-50%, -50%) rotate(${el.rotation || 0}deg)`,
                      width: el.type === 'text' ? `${el.boxWidth || el.width || 65}%` : `${el.width || 25}%`,
                      height: el.type === 'text' ? 'auto' : `${el.height || 25}%`,
                      opacity: el.opacity ?? 1,
                      textAlign: el.align || 'center',
                    }}
                  >
                    {/* Inline Text Editor on Double Click */}
                    {isSelected && activeInlineEdit === el.id && el.type === 'text' ? (
                      <div
                        className="bg-black/95 p-2 rounded-xl border-2 border-cyan-400 shadow-2xl flex flex-col gap-1.5 min-w-[240px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <textarea
                          rows={2}
                          autoFocus
                          value={el.content || ''}
                          onChange={(e) =>
                            updateSingleCustomElement(el.id, { content: e.target.value })
                          }
                          className="w-full bg-slate-900 text-white font-bold text-center p-1.5 rounded-lg text-xs border border-slate-700 outline-none focus:border-cyan-400"
                          style={{ fontFamily: el.fontFamily || 'Rozha One, serif' }}
                        />
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveInlineEdit(null)}
                            className="px-2 py-0.5 bg-cyan-500 text-black font-bold rounded text-[10px]"
                          >
                            ✓ पूर्ण झाले
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ElementRenderer element={el} />
                    )}

                    {/* Resize Handles for Active Selection */}
                    {isSelected && activeInlineEdit !== el.id && (
                      <CanvasElementHandles
                        target={{ type: 'custom', id: el.id }}
                        isText={el.type === 'text'}
                        canEditInline={el.type === 'text'}
                        onStartInlineEdit={() => setActiveInlineEdit(el.id)}
                        currentDimensions={{
                          width: el.width,
                          height: el.height,
                          fontSize: el.fontSize,
                          boxWidth: el.boxWidth,
                        }}
                        onStartResize={handleStartResize}
                        onNudgeSize={(inc) => {
                          if (el.type === 'text') {
                            updateSingleCustomElement(el.id, {
                              fontSize: inc
                                ? Math.min(60, (el.fontSize || 20) + 2)
                                : Math.max(10, (el.fontSize || 20) - 2),
                            });
                          } else {
                            const newW = inc
                              ? Math.min(95, (el.width || 25) + 4)
                              : Math.max(8, (el.width || 25) - 4);
                            updateSingleCustomElement(el.id, { width: newW, height: newW });
                          }
                        }}
                        onCopy={() => handleDuplicateElement(el.id)}
                        onDelete={() => handleDeleteElement(el.id)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOOTER STATUS BAR */}
      <footer className="h-10 border-t border-slate-800 bg-slate-950 px-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {saveSuccess ? (
              <span className="text-emerald-400 font-bold">
                ✓ डिझाईन सेव्ह झाले! हे बदल सर्व ग्राहकांना तात्काळ लागू होतील.
              </span>
            ) : (
              'ॲडमीन मोड: घटक ड्रॅग करा, फॉन्ट व रंग बदला आणि वरून सेव्ह करा.'
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">
            घटक संख्या: <strong>{customElements.length}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-semibold">
            {editedTemplate.is_free ? 'FREE TIER' : 'VIP PASS'}
          </span>
        </div>
      </footer>
    </div>
  );
};

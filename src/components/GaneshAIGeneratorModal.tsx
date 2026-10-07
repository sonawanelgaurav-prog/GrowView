import React, { useState } from 'react';
import { Sparkles, X, Wand2, Palette, Crown, Layout, Check, Flame, Layers } from 'lucide-react';
import { PosterTemplate, BusinessProfile } from '../types';
import { MotifGraphics } from './MotifGraphics';

interface GaneshAIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: BusinessProfile;
  onCreatePoster: (newTemplate: PosterTemplate) => void;
}

export const GaneshAIGeneratorModal: React.FC<GaneshAIGeneratorModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  onCreatePoster,
}) => {
  const [styleGroup, setStyleGroup] = useState<'royal' | 'modern' | 'traditional' | 'mandal' | 'business'>('royal');
  const [colorTheme, setColorTheme] = useState<'gold-maroon' | 'saffron-bhagwa' | 'cyber-neon' | 'sindoor-red' | 'dark-obsidian' | 'emerald-temple'>('gold-maroon');
  const [posterType, setPosterType] = useState<'aagman' | 'sthapana' | 'aarti' | 'invitation' | 'business' | 'personal'>('aagman');
  const [mandalOrBusinessName, setMandalOrBusinessName] = useState(activeProfile.name || '');
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<PosterTemplate | null>(null);

  if (!isOpen) return null;

  const STYLES = [
    { id: 'royal', label: '👑 Royal & Premium', desc: 'सुवर्ण नक्षीकाम, शाही सिंहासन' },
    { id: 'modern', label: '⚡ Modern & Trending', desc: 'मिनिमल, ३डी, सायबर निऑन' },
    { id: 'traditional', label: '🪔 Traditional & Bhakti', desc: 'मंदिर, रांगोळी, श्लोक व दीप' },
    { id: 'mandal', label: '🚩 Mandal & Event', desc: 'आगमन, विसर्जन, महाआरती' },
    { id: 'business', label: '💼 Business & Wishes', desc: 'दुकानदार, ब्रँड व वैयक्तिक' },
  ];

  const COLOR_PALETTES = [
    { id: 'gold-maroon', label: 'Gold & Maroon', color1: '#f59e0b', color2: '#881337', badge: 'शाही सुवर्ण' },
    { id: 'saffron-bhagwa', label: 'Saffron Bhagwa', color1: '#f97316', color2: '#ea580c', badge: 'शुद्ध भगवा' },
    { id: 'cyber-neon', label: 'Cyber Neon', color1: '#ec4899', color2: '#38bdf8', badge: 'निऑन सायबर' },
    { id: 'sindoor-red', label: 'Sindoor Red', color1: '#dc2626', color2: '#fde047', badge: 'सिंदूर लाल' },
    { id: 'dark-obsidian', label: 'Dark Obsidian', color1: '#1c1917', color2: '#fbbf24', badge: 'लक्झरी ब्लॅक' },
    { id: 'emerald-temple', label: 'Emerald Temple', color1: '#047857', color2: '#fbbf24', badge: 'पाचू हिरवा' },
  ];

  const POSTER_TYPES = [
    { id: 'aagman', label: '🎉 आगमन सोहळा (Arrival)' },
    { id: 'sthapana', label: '🕉️ प्राणप्रतिष्ठापना (Sthapana)' },
    { id: 'aarti', label: '🪔 महाआरती व प्रसाद (Aarti)' },
    { id: 'invitation', label: '💌 सस्नेह निमंत्रण (Invitation)' },
    { id: 'business', label: '🏢 व्यावसायिक शुभेच्छा (Business)' },
    { id: 'personal', label: '📸 वैयक्तिक विशेस (Personal)' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-ganesh-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleGroup,
          colorTheme,
          posterType,
          mandalOrBusinessName,
          language: 'Marathi',
          customNotes,
        }),
      });

      const data = await res.json();
      if (data && data.headline) {
        const subCategoryMap: Record<string, string> = {
          royal: 'royal-premium',
          modern: 'modern-trending',
          traditional: 'traditional-devotional',
          mandal: 'ganesh-mandal-event',
          business: 'business-personal-greeting',
        };

        const newTemplate: PosterTemplate = {
          id: `ganesh-ai-${Date.now()}`,
          template_id: `ganesh-ai-${Date.now()}`,
          title: data.title || 'AI Generated Ganesh Poster',
          titleNative: data.titleNative || 'एआय निर्मित गणेश चतुर्थी पोस्टर',
          category: 'ganesh-chaturthi',
          subCategory: subCategoryMap[styleGroup] || 'royal-premium',
          style_group: styleGroup,
          dateBadge: data.dateBadge || 'AI Exclusive',
          isTrending: true,
          is_premium: false,
          is_free: true,
          is_published: true,
          theme: data.theme,
          headline: data.headline,
          subtext: data.subtext,
          quote: data.quote,
          motifType: data.motifType || 'ganesh-dagdusheth-royal',
          defaultFrameId: 'footer-01',
          aspectRatio: '1:1',
          decorative_elements: data.decorative_elements || ['Golden Mandala', 'Diya Lights'],
          composition_style: `${styleGroup.toUpperCase()} AI composition tailored for ${posterType}`,
          idol_placement: 'Center aligned majestic focus',
          lighting_style: 'Warm divine festival illumination',
        };

        setGeneratedTemplate(newTemplate);
      }
    } catch (err) {
      console.error('Error generating Ganesh poster:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyAndOpen = () => {
    if (!generatedTemplate) return;
    onCreatePoster(generatedTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                AI ने नवीन गणेश पोस्टर बनवा
              </h3>
              <p className="text-amber-100 text-xs">
                Create New Ganesh Poster with AI • Style, Color & Type Selection
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-black/15 hover:bg-black/30 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Step 1: Select Style */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>१. डिझाईन स्टाईल निवडा (Select Style)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">५ स्टाईल उपलब्ध</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {STYLES.map((s) => {
                const isSelected = styleGroup === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyleGroup(s.id as any)}
                    className={`text-left p-3 rounded-2xl border transition-all text-xs ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-200'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{s.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Color Palette */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-orange-600" />
                <span>२. रंगसंगती निवडा (Select Color Palette)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">६ कलर थीम्स</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {COLOR_PALETTES.map((c) => {
                const isSelected = colorTheme === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorTheme(c.id as any)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/80 shadow-xs ring-2 ring-orange-200'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex -space-x-1.5 shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: c.color1 }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: c.color2 }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{c.badge}</div>
                      <div className="text-[10px] text-slate-400 truncate">{c.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Select Poster Type */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-rose-600" />
                <span>३. पोस्टरचा प्रकार (Poster Occasion / Type)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">६ प्रकार</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {POSTER_TYPES.map((t) => {
                const isSelected = posterType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPosterType(t.id as any)}
                    className={`p-2.5 rounded-2xl border text-center transition-all text-xs font-semibold ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 text-rose-900 shadow-xs ring-2 ring-rose-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Organization / Business Name & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                मंडळ / व्यवसाय / कुटुंबाचे नाव
              </label>
              <input
                type="text"
                value={mandalOrBusinessName}
                onChange={(e) => setMandalOrBusinessName(e.target.value)}
                placeholder="उदा. लालबागचा राजा भक्त मंडळ / श्री कृपा एंटरप्रायझेस"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                काही विशेष शब्द किंवा सूचना (Optional)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="उदा. वेळ संध्याकाळी ७ वा., महाप्रसाद वाटप"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Generate Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 transition-all disabled:opacity-50"
            >
              <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'एआय पोस्टर तयार होत आहे... (Generating)' : '✨ नवीन गणेश पोस्टर तयार करा (Generate Poster)'}</span>
            </button>
          </div>

          {/* Generated Result Preview */}
          {generatedTemplate && (
            <div className="border-t border-slate-200 pt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>तयार झालेले पोस्टर (Ready to Edit):</span>
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {generatedTemplate.titleNative}
                </span>
              </div>

              {/* Card Preview */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center gap-5 shadow-xl border border-slate-800">
                <div
                  className={`w-36 h-36 shrink-0 rounded-xl bg-gradient-to-br ${generatedTemplate.theme.bgGradient} flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-inner border border-white/20`}
                >
                  <MotifGraphics motifType={generatedTemplate.motifType} className="w-16 h-16 text-amber-300 drop-shadow-md" />
                  <span className="text-[10px] font-bold text-amber-200 text-center mt-1 truncate max-w-full">
                    {generatedTemplate.headline}
                  </span>
                </div>

                <div className="space-y-1.5 min-w-0 flex-1 text-center sm:text-left">
                  <h4 className="font-extrabold text-base text-amber-400">
                    {generatedTemplate.headline}
                  </h4>
                  <p className="text-xs text-slate-200 line-clamp-2">
                    {generatedTemplate.subtext}
                  </p>
                  <p className="text-[11px] text-amber-200/80 italic line-clamp-1">
                    {generatedTemplate.quote}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    {generatedTemplate.decorative_elements?.map((el, i) => (
                      <span key={i} className="text-[10px] bg-white/10 text-white/90 px-2 py-0.5 rounded-md">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  रद्द करा (Close)
                </button>
                <button
                  type="button"
                  onClick={handleApplyAndOpen}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  <span>एडिटरमध्ये उघडा (Open in Poster Editor)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

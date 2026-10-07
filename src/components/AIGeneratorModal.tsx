import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  X, 
  Wand2, 
  Check, 
  RefreshCw, 
  Copy, 
  Share2, 
  Download, 
  Palette, 
  ChevronRight,
  Flame,
  Layout,
  Square,
  Smartphone,
  Layers
} from 'lucide-react';
import { GeneratedAICopy, BusinessProfile, PosterTemplate, AspectRatio } from '../types';
import { getAllowedSizesForTemplate } from '../data/sizeSystem';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOccasion?: string;
  businessName: string;
  activeProfile?: BusinessProfile;
  hasEditingTemplate?: boolean;
  onApplyText: (headline: string, subtext: string, quote?: string, occasion?: string) => void;
  onCreateNewPoster?: (newTemplate: PosterTemplate) => void;
  onQuickDownload?: (template: PosterTemplate) => void;
}

const QUICK_OCCASIONS: { label: string; occasion: string; motif: PosterTemplate['motifType']; theme: string }[] = [
  { label: '🚩 श्री गणेशोत्सव', occasion: 'Ganesh Chaturthi', motif: 'ganesh-dagdusheth-royal', theme: 'from-amber-600 via-orange-600 to-red-700' },
  { label: '🏹 शिवजयंती सोहळा', occasion: 'Shivjayanti', motif: 'shiva-trishul', theme: 'from-orange-600 via-amber-700 to-red-900' },
  { label: '🪔 शुभ दीपावली', occasion: 'Diwali', motif: 'diwali-diya', theme: 'from-purple-900 via-indigo-900 to-slate-950' },
  { label: '🌸 गुढीपाडवा नववर्ष', occasion: 'Gudi Padwa', motif: 'diwali-diya', theme: 'from-amber-500 via-orange-600 to-yellow-600' },
  { label: '🌺 नवरात्रोत्सव व दसरा', occasion: 'Navratri', motif: 'navratri-garba', theme: 'from-rose-600 via-red-700 to-amber-600' },
  { label: '💼 महा डिस्काउंट ऑफर', occasion: 'Mega Festival Sale Offer', motif: 'sale-discount', theme: 'from-blue-600 via-indigo-700 to-slate-900' },
  { label: '🌅 शुभ सकाळ / सुविचार', occasion: 'Suvichar Good Morning', motif: 'morning-sun', theme: 'from-teal-700 via-emerald-800 to-slate-900' },
  { label: '🎂 वाढदिवस शुभेच्छा', occasion: 'Birthday Wishes', motif: 'birthday-cake', theme: 'from-pink-600 via-rose-700 to-purple-900' },
];

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentOccasion = 'Ganesh Chaturthi',
  businessName,
  activeProfile,
  hasEditingTemplate = false,
  onApplyText,
  onCreateNewPoster,
  onQuickDownload,
}) => {
  const [occasion, setOccasion] = useState(currentOccasion);
  const [businessType, setBusinessType] = useState('General Retail & Services');
  const [language, setLanguage] = useState('Marathi');
  const [tone, setTone] = useState('Festive & Devotional');
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedAICopy | null>(null);
  const [selectedHeadline, setSelectedHeadline] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeMotif, setActiveMotif] = useState('ganesh-dagdusheth-royal');
  const [activeTheme, setActiveTheme] = useState('from-amber-600 via-orange-600 to-red-700');

  const allowedSizes = useMemo(() => {
    return getAllowedSizesForTemplate(occasion, null);
  }, [occasion]);

  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('1:1');

  useEffect(() => {
    if (!allowedSizes.includes(selectedRatio)) {
      setSelectedRatio(allowedSizes[0] || '1:1');
    }
  }, [allowedSizes, selectedRatio]);

  // Trigger initial generation when opened or change occasion
  useEffect(() => {
    if (isOpen && !generatedResult) {
      handleGenerate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectQuickOccasion = (item: typeof QUICK_OCCASIONS[0]) => {
    setOccasion(item.occasion);
    setActiveMotif(item.motif);
    setActiveTheme(item.theme);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: occasion || 'Ganesh Chaturthi',
          businessName: businessName || activeProfile?.name || 'आमच्या परिवारातर्फे',
          businessType,
          language,
          tone,
          customKeywords: keywords,
        }),
      });

      const data = await res.json();
      if (data && Array.isArray(data.headlines) && data.headlines.length > 0) {
        setGeneratedResult(data);
        setSelectedHeadline(data.headlines[0] || '');
      } else {
        // Safe fallback
        setGeneratedResult({
          headlines: [
            `।। ${occasion || 'सणासुदीच्या'} मंगलमयी हार्दिक शुभेच्छा ।।`,
            'आनंद, ऐश्वर्य आणि भरभराटीचे मंगल दिवस!',
            'आपणास व परिवारास मनःपूर्वक शुभेच्छा!',
          ],
          subtext: `श्रींच्या आशीर्वादाने आपल्या कुटुंबात व व्यवसायात सुख, समृद्धी आणि उत्तरोत्तर प्रगती नांदो. - ${businessName || 'आमच्या परिवारातर्फे'}`,
          hashtags: ['#हार्दिकशुभेच्छा', '#सणउत्सव', '#महाराष्ट्र', '#शुभकामना'],
          callToAction: 'सस्नेह शुभेच्छा • आजच संपर्क साधा',
        });
        setSelectedHeadline(`।। ${occasion || 'सणासुदीच्या'} मंगलमयी हार्दिक शुभेच्छा ।।`);
      }
    } catch (err) {
      console.warn('AI Generation network error, using instant fallback:', err);
      setGeneratedResult({
        headlines: [
          `।। ${occasion || 'सणासुदीच्या'} मंगलमयी हार्दिक शुभेच्छा ।।`,
          'आनंद, ऐश्वर्य आणि भरभराटीचे मंगल दिवस!',
          'आपणास व परिवारास मनःपूर्वक शुभेच्छा!',
        ],
        subtext: `श्रींच्या आशीर्वादाने आपल्या कुटुंबात व व्यवसायात सुख, समृद्धी आणि उत्तरोत्तर प्रगती नांदो. - ${businessName || 'आमच्या परिवारातर्फे'}`,
        hashtags: ['#हार्दिकशुभेच्छा', '#सणउत्सव', '#महाराष्ट्र', '#शुभकामना'],
        callToAction: 'सस्नेह शुभेच्छा • आजच संपर्क साधा',
      });
      setSelectedHeadline(`।। ${occasion || 'सणासुदीच्या'} मंगलमयी हार्दिक शुभेच्छा ।।`);
    } finally {
      setIsLoading(false);
    }
  };

  const constructTemplateFromAI = (): PosterTemplate => {
    const hl = selectedHeadline || (generatedResult?.headlines[0] ?? occasion);
    const sub = generatedResult?.subtext || '';
    const quote = generatedResult?.callToAction || '';

    return {
      id: `ai-poster-${Date.now()}`,
      template_id: `ai-poster-${Date.now()}`,
      title: `AI ${occasion} Poster`,
      titleNative: hl,
      category: occasion.toLowerCase().includes('ganesh') ? 'ganesh-chaturthi' : 'festivals',
      subCategory: 'royal-premium',
      style_group: 'royal',
      dateBadge: 'AI Special 2026',
      isTrending: true,
      is_premium: false,
      is_free: true,
      is_published: true,
      headline: hl,
      subtext: sub,
      quote,
      motifType: activeMotif,
      defaultFrameId: 'footer-01',
      aspectRatio: selectedRatio,
      allowedSizes: [selectedRatio],
      theme: {
        bgGradient: activeTheme,
        primaryColor: '#ffffff',
        accentColor: '#fef08a',
        textColor: '#ffffff',
        ornamentColor: '#fbbf24',
        cardBg: 'rgba(20, 15, 10, 0.85)',
      },
    };
  };

  const handleApplyToActive = () => {
    if (!generatedResult) return;
    onApplyText(
      selectedHeadline || generatedResult.headlines[0] || occasion,
      generatedResult.subtext || '',
      generatedResult.callToAction || '',
      occasion
    );
    onClose();
  };

  const handleCreateNewPosterAction = () => {
    const newTpl = constructTemplateFromAI();
    if (onCreateNewPoster) {
      onCreateNewPoster(newTpl);
    } else {
      onApplyText(newTpl.headline, newTpl.subtext, newTpl.quote, occasion);
    }
    onClose();
  };

  const handleQuickDownloadAction = () => {
    const newTpl = constructTemplateFromAI();
    if (onQuickDownload) {
      onQuickDownload(newTpl);
      onClose();
    } else if (onCreateNewPoster) {
      onCreateNewPoster(newTpl);
      onClose();
    }
  };

  const handleCopyCaption = () => {
    if (!generatedResult) return;
    const caption = `🌟 ${selectedHeadline || generatedResult.headlines[0]}\n\n${generatedResult.subtext}\n\n👉 ${generatedResult.callToAction || ''}\n\n${generatedResult.hashtags?.join(' ') || ''}\n\n*${activeProfile?.name || businessName}*\n📞 ${activeProfile?.phone || ''}`;
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!generatedResult) return;
    const text = encodeURIComponent(
      `*${selectedHeadline || generatedResult.headlines[0]}*\n\n${generatedResult.subtext}\n\n✨ *${activeProfile?.name || businessName}*\n📞 ${activeProfile?.phone || ''}\n\n${generatedResult.hashtags?.join(' ') || ''}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                AI पोस्ट व सण शुभेच्छा स्टुडिओ
                <span className="text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  Gemini AI 3.8
                </span>
              </h3>
              <p className="text-xs text-slate-600">
                मराठी व भारतीय सणांसाठी आकर्षक घोषवाक्य, शुभेच्छा आणि ब्रँडेड पोस्टर्स
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center border border-slate-200 transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-slate-700">
          {/* Quick Festival Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-600" />
              <span>पॉप्युलर सण व उत्सव (Quick Select):</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_OCCASIONS.map((item) => (
                <button
                  key={item.occasion}
                  type="button"
                  onClick={() => handleSelectQuickOccasion(item)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-bold border transition-all flex items-center gap-1 ${
                    occasion === item.occasion
                      ? 'bg-orange-600 border-orange-600 text-white shadow-xs scale-102'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            {/* Occasion / Festival */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                सण किंवा इव्हेंटचे नाव (Occasion)
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="उदा. गणेश चतुर्थी, शिवजयंती, स्पेशल ऑफर"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-semibold"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                भाषा (Language)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'मराठी', val: 'Marathi' },
                  { label: 'हिंदी', val: 'Hindi' },
                  { label: 'English', val: 'English' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setLanguage(item.val)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center ${
                      language === item.val
                        ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Business Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                व्यवसाय प्रकार (Business Type)
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="General Retail & Services">दुकान व जनरल व्यवसाय</option>
                <option value="Jewelry & Gold">सोनार व सराफ (Jewelry)</option>
                <option value="Real Estate & Housing">बांधकाम व रिअल इस्टेट</option>
                <option value="Hospital & Doctor Clinic">दवाखाना व मेडिकल</option>
                <option value="Education & Coaching Institute">क्लासेस व शाळा</option>
                <option value="Restaurant & Food">हॉटेल, कॅफे व मिठाई</option>
                <option value="Clothing & Fashion">कापड दुकान व फॅशन</option>
                <option value="Salon & Beauty Parlour">सलून व ब्युटी पार्लर</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                मजकुराची पद्धत (Tone)
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-medium"
              >
                <option value="Festive & Devotional">भक्तिमय व पारंपारिक (Devotional)</option>
                <option value="Mega Discount & Promotional">धमाका ऑफर व सूट (Special Offer)</option>
                <option value="Heartfelt & Warm">आपुलकीच्या सदिच्छा (Heartfelt Wishes)</option>
                <option value="Inspiring & Motivational">प्रेरणादायी व सुविचार (Inspirational)</option>
              </select>
            </div>

            {/* Design Size Selector (Only Allowed Sizes for this category) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>डिझाईन आकार (Design Size)</span>
                <span className="text-[10px] text-orange-600 font-semibold">कॅटेगरीनुसार फिक्स आकार</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {allowedSizes.includes('1:1') && (
                  <button
                    type="button"
                    onClick={() => setSelectedRatio('1:1')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedRatio === '1:1'
                        ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <Square className="w-3.5 h-3.5 text-orange-600" />
                      <span>Square (1:1)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">1080 × 1080 px</p>
                  </button>
                )}
                {allowedSizes.includes('4:5') && (
                  <button
                    type="button"
                    onClick={() => setSelectedRatio('4:5')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedRatio === '4:5'
                        ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <Layers className="w-3.5 h-3.5 text-orange-600" />
                      <span>Portrait (4:5)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">1080 × 1350 px</p>
                  </button>
                )}
                {allowedSizes.includes('9:16') && (
                  <button
                    type="button"
                    onClick={() => setSelectedRatio('9:16')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedRatio === '9:16'
                        ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-slate-900">
                      <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                      <span>Vertical (9:16)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">1080 × 1920 px</p>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action: Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black text-sm py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI द्वारे घोषवाक्य तयार होत आहे...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>AI शुभेच्छा व घोषवाक्य जनरेट करा (Generate AI Copy)</span>
              </>
            )}
          </button>

          {/* Generated Result Output */}
          {generatedResult && (
            <div className="p-4 rounded-xl bg-gradient-to-b from-orange-50/50 to-amber-50/30 border border-orange-200/90 space-y-3.5 shadow-2xs">
              {/* Headlines Selector */}
              <div>
                <span className="text-xs font-black text-slate-900 block mb-1.5 flex items-center justify-between">
                  <span>पसंतीचे घोषवाक्य निवडा (Choose Headline):</span>
                  <span className="text-[10px] text-orange-700 font-bold bg-orange-100 px-2 py-0.5 rounded-md">
                    क्लिक करून निवडा
                  </span>
                </span>
                <div className="space-y-1.5">
                  {generatedResult.headlines.map((hl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedHeadline(hl)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs sm:text-sm font-bold border transition-all flex items-center justify-between ${
                        selectedHeadline === hl
                          ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-orange-300'
                      }`}
                    >
                      <span className="leading-snug">{hl}</span>
                      {selectedHeadline === hl && (
                        <Check className="w-4 h-4 text-white shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtext / Blessing */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1">
                  शुभेच्छा संदेश (Festive Message):
                </span>
                <p className="text-xs sm:text-sm bg-white p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed font-medium">
                  {generatedResult.subtext}
                </p>
              </div>

              {/* Offer / CTA */}
              {generatedResult.callToAction && (
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    ऑफर किंवा संपर्क टॅगलाईन:
                  </span>
                  <p className="text-xs bg-white p-2.5 rounded-lg border border-orange-200 text-orange-800 font-bold">
                    {generatedResult.callToAction}
                  </p>
                </div>
              )}

              {/* Hashtags */}
              {generatedResult.hashtags && generatedResult.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {generatedResult.hashtags.map((tag, i) => (
                    <span key={i} className="text-[11px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Actions for Generated Content */}
              <div className="pt-2 border-t border-orange-200/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="text-xs font-bold bg-white text-slate-700 hover:text-slate-900 border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-orange-600" />
                    <span>{copied ? 'कॉपी झाले!' : 'कॅपशन कॉपी करा'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp वर पाठवा</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 p-1 hover:underline"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>दुसरे घोषवाक्य हवे?</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Main Application Buttons */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50/90 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <span className="text-[11px] text-slate-500 font-medium">
              ब्रँड: <b>{activeProfile?.name || businessName || 'आपला ब्रँड'}</b>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              रद्द करा (Close)
            </button>

            {/* If currently editing a poster, offer to apply directly */}
            {hasEditingTemplate && (
              <button
                type="button"
                onClick={handleApplyToActive}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>सध्याच्या पोस्टरवर लावा</span>
              </button>
            )}

            {/* Direct 1-Click Poster Creation & Open in Studio */}
            <button
              type="button"
              onClick={handleCreateNewPosterAction}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Palette className="w-4 h-4" />
              <span>नवीन AI पोस्टर तयार करा</span>
            </button>

            {/* Direct Quick Download */}
            {onQuickDownload && (
              <button
                type="button"
                onClick={handleQuickDownloadAction}
                className="px-3 py-2 rounded-xl text-xs sm:text-sm font-black bg-slate-900 hover:bg-slate-800 text-white shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                title="थेट डाऊनलोड करा"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">डाऊनलोड</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

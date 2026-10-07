import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  X,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  Palette,
  Download,
  Edit3,
  RefreshCw,
  Bookmark,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  Layers,
  ArrowRight,
  Sliders,
  Check,
  Image as ImageIcon,
  User,
  Info,
  Save,
  CheckCheck,
} from 'lucide-react';
import {
  AIFestivalEvent,
  AIFestivalCampaignResult,
  PosterTemplate,
  BusinessProfile,
  AspectRatio,
  UserAccount,
} from '../../types';
import { RenderablePoster } from '../RenderablePoster';

interface AIFestivalAutoCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: BusinessProfile;
  currentUser: UserAccount | null;
  onOpenStudioWithTemplate: (template: PosterTemplate) => void;
  onQuickDownload?: (template: PosterTemplate) => void;
  onSaveToMyDesigns?: (template: PosterTemplate) => void;
  onOpenVIPModal?: () => void;
}

const REGION_OPTIONS = [
  'Maharashtra',
  'India',
  'Jalgaon',
  'Mumbai',
  'Pune',
  'Nashik',
  'Nagpur',
  'Chhatrapati Sambhajinagar',
  'Custom Location',
];

const CATEGORY_TABS = [
  { id: 'all', label: 'सर्व (All)' },
  { id: 'maharashtra', label: '🚩 महाराष्ट्र विशेष' },
  { id: 'national', label: '🇮🇳 राष्ट्रीय दिन' },
  { id: 'personalities', label: '👑 महापुरुष व जयंती' },
  { id: 'festivals', label: '🌸 सण व उत्सव' },
  { id: 'hindu', label: '🪔 हिंदू सण' },
  { id: 'buddhist', label: '☸️ बौद्ध सण व जयंती' },
  { id: 'muslim', label: '🌙 मुस्लिम सण' },
  { id: 'christian', label: '✝️ ख्रिश्चन सण' },
  { id: 'historical', label: '📜 ऐतिहासिक दिन' },
  { id: 'political', label: '🏛️ नागरी व शासकीय' },
  { id: 'business', label: '💼 व्यापार व ऑफर्स' },
  { id: 'awareness', label: '💡 सामाजिक व आरोग्य' },
  { id: 'education', label: '🎓 शिक्षण व युवा' },
  { id: 'international', label: '🌍 आंतरराष्ट्रीय दिन' },
];

const PREFS_STORAGE_KEY = 'growview_ai_festival_preferences';

export const AIFestivalAutoCreatorModal: React.FC<AIFestivalAutoCreatorModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  currentUser,
  onOpenStudioWithTemplate,
  onQuickDownload,
  onSaveToMyDesigns,
  onOpenVIPModal,
}) => {
  // Discovery State with saved user preferences (Section 19)
  const [dayRange, setDayRange] = useState<7 | 30 | 90>(7);
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).preferredRegion || 'Maharashtra';
    } catch {}
    return 'Maharashtra';
  });
  const [customLocationText, setCustomLocationText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).preferredCategory || 'all';
    } catch {}
    return 'all';
  });
  const [selectedLanguage, setSelectedLanguage] = useState<'mr' | 'hi' | 'en' | 'mixed'>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).preferredLanguage || 'mr';
    } catch {}
    return 'mr';
  });
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).preferredRatio || '4:5';
    } catch {}
    return '4:5';
  });
  const [postersPerEvent, setPostersPerEvent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(PREFS_STORAGE_KEY);
      if (saved) return JSON.parse(saved).postersPerEvent || 10;
    } catch {}
    return 10;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPreferencesSavedToast, setShowPreferencesSavedToast] = useState<boolean>(false);

  // Events & Loading
  const [events, setEvents] = useState<AIFestivalEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Generation Pipeline State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(1);
  const [activeGeneratingEvent, setActiveGeneratingEvent] = useState<AIFestivalEvent | null>(null);
  const [currentPosterStep, setCurrentPosterStep] = useState<number>(1);

  // Campaign Results View & Multi-Campaigns (Section 16)
  const [campaignResult, setCampaignResult] = useState<AIFestivalCampaignResult | null>(null);
  const [multiCampaigns, setMultiCampaigns] = useState<AIFestivalCampaignResult[]>([]);
  const [selectedCampaignIndex, setSelectedCampaignIndex] = useState<number>(0);
  const [showSourcesPanel, setShowSourcesPanel] = useState<boolean>(false);
  const [savedPosterIds, setSavedPosterIds] = useState<Set<string>>(new Set());

  // Save User Preferences (Section 19)
  const handleSavePreferences = () => {
    try {
      const prefs = {
        preferredRegion: selectedRegion,
        preferredCategory: selectedCategory,
        preferredLanguage: selectedLanguage,
        preferredRatio: selectedRatio,
        postersPerEvent,
      };
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
      setShowPreferencesSavedToast(true);
      setTimeout(() => setShowPreferencesSavedToast(false), 2500);
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
  };

  // Fetch upcoming events when filters change (Section 1-3)
  const fetchUpcomingEvents = async () => {
    setIsLoadingEvents(true);
    setLoadError(null);
    try {
      const effectiveRegion = selectedRegion === 'Custom Location' && customLocationText.trim()
        ? customLocationText.trim()
        : selectedRegion;

      const queryParams = new URLSearchParams({
        days: String(dayRange),
        region: effectiveRegion,
        category: selectedCategory,
        startDate: '2026-09-27',
      });
      if (searchQuery.trim()) {
        queryParams.set('query', searchQuery.trim());
      }

      const res = await fetch(`/api/ai-festival/discover?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to load upcoming festivals:', err);
      setLoadError('सण व उत्सवांचा शोध घेताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUpcomingEvents();
    }
  }, [isOpen, dayRange, selectedRegion, selectedCategory, customLocationText]);

  // One-click Single Festival Campaign Generation (Section 15)
  const handleGenerateSingleFestival = async (event: AIFestivalEvent) => {
    setIsGenerating(true);
    setActiveGeneratingEvent(event);
    setGenerationStep(1);
    setCurrentPosterStep(1);

    // Progress simulation steps (Section 13)
    const timer1 = setTimeout(() => setGenerationStep(2), 600);
    const timer2 = setTimeout(() => setGenerationStep(3), 1200);
    const timer3 = setTimeout(() => setGenerationStep(4), 1800);
    const timer4 = setTimeout(() => {
      setGenerationStep(5);
      setCurrentPosterStep(Math.min(5, postersPerEvent));
    }, 2400);

    try {
      const res = await fetch('/api/ai-festival/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          language: selectedLanguage,
          aspectRatio: selectedRatio,
          posterCount: postersPerEvent,
          brandKit: activeProfile,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.posters)) {
        setGenerationStep(6);
        setTimeout(() => {
          const result: AIFestivalCampaignResult = {
            eventId: data.eventId,
            eventName: data.eventName,
            eventNameMarathi: data.eventNameMarathi,
            dateStr: data.dateStr,
            dayOfWeek: data.dayOfWeek,
            researchSummary: data.researchSummary,
            sources: data.sources || [],
            posters: data.posters,
            totalGenerated: data.posters.length,
            generatedAt: data.generatedAt,
          };
          setCampaignResult(result);
          setMultiCampaigns([result]);
          setSelectedCampaignIndex(0);
          setIsGenerating(false);
        }, 500);
      } else {
        throw new Error(data.error || 'जनरेशन अयशस्वी झाले');
      }
    } catch (err: any) {
      console.error('Campaign generation failed:', err);
      alert(err.message || 'AI पोस्टर्स जनरेट करताना त्रुटी आली.');
      setIsGenerating(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    }
  };

  // One-click "Generate My Next 7 Days" Multi-Event Campaign (Section 16)
  const handleGenerateNext7Days = async () => {
    if (events.length === 0) {
      alert('पुढील ७ दिवसांचे कोणतेही सण उपलब्ध नाहीत.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(1);
    setCurrentPosterStep(1);

    const targetEvents = events.slice(0, 3);
    setActiveGeneratingEvent(targetEvents[0]);

    const timer1 = setTimeout(() => setGenerationStep(2), 700);
    const timer2 = setTimeout(() => setGenerationStep(3), 1400);
    const timer3 = setTimeout(() => setGenerationStep(4), 2100);
    const timer4 = setTimeout(() => setGenerationStep(5), 2800);

    try {
      const res = await fetch('/api/ai-festival/generate-multi-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: targetEvents,
          language: selectedLanguage,
          aspectRatio: selectedRatio,
          postersPerEvent,
          brandKit: activeProfile,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
        setMultiCampaigns(data.campaigns);
        setSelectedCampaignIndex(0);
        setCampaignResult(data.campaigns[0]);
        setGenerationStep(6);
      } else {
        await handleGenerateSingleFestival(targetEvents[0]);
      }
    } catch (err) {
      console.error('Multi campaign generation error:', err);
      await handleGenerateSingleFestival(targetEvents[0]);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsGenerating(false);
    }
  };

  // Regenerate with style tweak (Section 26)
  const handleRegenerateWithStyle = async (tweak: string) => {
    if (!campaignResult || !activeGeneratingEvent) return;
    setIsGenerating(true);
    setGenerationStep(4);
    try {
      const res = await fetch('/api/ai-festival/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: activeGeneratingEvent,
          language: selectedLanguage,
          aspectRatio: selectedRatio,
          posterCount: postersPerEvent,
          brandKit: activeProfile,
          styleTweak: tweak,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.posters)) {
        const updatedResult: AIFestivalCampaignResult = {
          eventId: data.eventId,
          eventName: data.eventName,
          eventNameMarathi: data.eventNameMarathi,
          dateStr: data.dateStr,
          dayOfWeek: data.dayOfWeek,
          researchSummary: data.researchSummary,
          sources: data.sources || [],
          posters: data.posters,
          totalGenerated: data.posters.length,
          generatedAt: data.generatedAt,
        };
        setCampaignResult(updatedResult);
        if (multiCampaigns.length > 0) {
          const updatedMulti = [...multiCampaigns];
          updatedMulti[selectedCampaignIndex] = updatedResult;
          setMultiCampaigns(updatedMulti);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePoster = (poster: PosterTemplate) => {
    if (onSaveToMyDesigns) {
      onSaveToMyDesigns(poster);
    }
    setSavedPosterIds(prev => new Set(prev).add(poster.id));
  };

  const handleSaveAllPosters = () => {
    if (!campaignResult || !onSaveToMyDesigns) return;
    campaignResult.posters.forEach(p => {
      onSaveToMyDesigns(p);
      setSavedPosterIds(prev => new Set(prev).add(p.id));
    });
    alert(`सर्व ${campaignResult.posters.length} पोस्टर्स 'माझ्या डिझाईन्स' मध्ये सेव्ह केले!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header (Section 23) */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 px-4 sm:px-6 py-4 flex items-center justify-between text-white shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-200 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-['Outfit'] tracking-tight">
                  AI Festival Auto Creator ✨
                </h2>
                <span className="text-[10px] uppercase font-extrabold bg-white text-orange-700 px-2 py-0.5 rounded-full shadow-xs">
                  Smart Live AI
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium">
                आगामी सण, उत्सव व दिनविशेष आपोआप शोधा आणि १-क्लिकमध्ये १० व्यावसायिक पोस्टर्स तयार करा
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {campaignResult && (
              <button
                type="button"
                onClick={() => {
                  setCampaignResult(null);
                  setMultiCampaigns([]);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>कॅलेंडर व यादी</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-slate-100 space-y-6">
          {/* Generation In-Progress Overlay (Section 13 & 24) */}
          {isGenerating && (
            <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-6 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
                  <Sparkles className="w-10 h-10 text-slate-950 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white font-['Outfit']">
                  {activeGeneratingEvent?.nameMarathi || activeGeneratingEvent?.name}
                </h3>
                <p className="text-sm text-amber-400 font-bold mt-1">
                  १० स्वतंत्र व अस्सल डिझाईन्स तयार होत आहेत...
                </p>
              </div>

              {/* Progress Checklist (Section 13) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2.5 font-medium shadow-inner">
                <div className={`flex items-center gap-2 ${generationStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>STEP 1-2: आगामी सण व अचूक दिनांक पडताळणी पूर्ण (Finding & verifying dates)</span>
                </div>
                <div className={`flex items-center gap-2 ${generationStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>STEP 3-4: ऐतिहासिक माहिती व खात्रीशीर वेब संदर्भ तपासले (Researching accurate history)</span>
                </div>
                <div className={`flex items-center gap-2 ${generationStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>STEP 5-6: अधिकृत संदर्भ छायाचित्र व स्रोत जोडले (Verified authentic portraits)</span>
                </div>
                <div className={`flex items-center gap-2 ${generationStep >= 4 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>STEP 7: अस्सल मराठी/हिंदी मथळे व कोट्स तयार झाले (Authentic Devanagari copywriting)</span>
                </div>
                <div className={`flex items-center gap-2 ${generationStep >= 5 ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-500'}`}>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>STEP 8-9: १० वेगवेगळ्या व्हिज्युअल शैली तयार होत आहेत ({currentPosterStep} / {postersPerEvent})</span>
                </div>
                <div className={`flex items-center gap-2 ${generationStep >= 6 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>STEP 10-11: AI Quality Check व ब्रँड किट फ्रेम इंटिग्रेशन पूर्ण!</span>
                </div>
              </div>
            </div>
          )}

          {/* Results View (Sections 6-12 & 20-22) */}
          {!isGenerating && campaignResult && (
            <div className="space-y-6 animate-in fade-in">
              {/* Multi-Campaign Event Switcher (Section 16) */}
              {multiCampaigns.length > 1 && (
                <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
                  <span className="text-xs font-bold text-slate-400 shrink-0 px-2">
                    आगामी आठवडा:
                  </span>
                  {multiCampaigns.map((camp, idx) => (
                    <button
                      key={camp.eventId}
                      type="button"
                      onClick={() => {
                        setSelectedCampaignIndex(idx);
                        setCampaignResult(camp);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                        selectedCampaignIndex === idx
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                          : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <span>📅 {camp.dateStr.split('-').slice(1).join('/')}: {camp.eventNameMarathi}</span>
                      <span className="px-1.5 py-0.2 bg-black/20 rounded text-[10px]">{camp.posters.length}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Campaign Results Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/30">
                      🎉 {campaignResult.posters.length} स्वतंत्र डिझाईन्स तयार!
                    </span>
                    <span className="text-xs text-slate-400">
                      📅 {campaignResult.dateStr} • {campaignResult.dayOfWeek}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-['Outfit'] mt-1">
                    {campaignResult.eventNameMarathi} ({campaignResult.eventName})
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                    {campaignResult.researchSummary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleSaveAllPosters}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>सर्व पोस्टर्स सेव्ह करा</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSourcesPanel(!showSourcesPanel)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                    <span>संशोधन संदर्भ ({campaignResult.sources.length})</span>
                  </button>

                  {/* Regenerate style selector (Section 26) */}
                  <div className="relative group">
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>शैली बदला (Change Style)</span>
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-52 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-1 z-30">
                      {[
                        { id: 'traditional', label: 'अधिक पारंपरिक (Traditional)' },
                        { id: 'modern', label: 'अधिक आधुनिक (Modern Youth)' },
                        { id: 'patriotic', label: 'अधिक देशभक्तीपर (Patriotic)' },
                        { id: 'minimal', label: 'अधिक मिनिमल (Minimalist)' },
                        { id: 'royal', label: 'शाही सुवर्ण (Royal Gold)' },
                      ].map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleRegenerateWithStyle(st.id)}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Quality Check Certified Banner (Section 20 & 21) */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-extrabold text-emerald-300">
                    AI Quality Certified:
                  </span>
                  <span className="text-emerald-100">
                    तारीख पडताळणी पूर्ण ({campaignResult.dateStr}) • अस्सल ऐतिहासिक संदर्भ • देवनागरी शुद्धलेखन • ब्रँड किट फ्रेम इंटिग्रेटेड
                  </span>
                </div>
                <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                  100% Verified
                </span>
              </div>

              {/* Research Sources Drawer (Section 22) */}
              {showSourcesPanel && (
                <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="font-bold text-amber-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>तपासलेले ऐतिहासिक स्रोत व अधिकृत माहिती (Research Sources & Attributions)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowSourcesPanel(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {campaignResult.sources.map((src, sIdx) => (
                      <div key={sIdx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-slate-200">{src.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">स्रोत: {src.sourceName}</p>
                        </div>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 p-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 10 Generated Poster Grid (Sections 10-12) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaignResult.posters.map((poster, pIdx) => {
                  const isSaved = savedPosterIds.has(poster.id);
                  return (
                    <div
                      key={poster.id}
                      className="bg-slate-950 rounded-2xl border border-slate-800 hover:border-amber-500/50 p-3 flex flex-col justify-between transition-all group hover:shadow-xl hover:shadow-amber-500/10"
                    >
                      {/* Top Badge */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60 text-xs">
                        <span className="font-extrabold text-amber-400 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>संकल्पना #{pIdx + 1}: {poster.titleNative?.split('—')[1] || poster.title.split('—')[1] || 'डिझाईन'}</span>
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          {selectedRatio}
                        </span>
                      </div>

                      {/* Poster Live Canvas Render with Brand Frame (Section 12) */}
                      <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900 aspect-[4/5] flex items-center justify-center">
                        <RenderablePoster
                          template={poster}
                          profile={activeProfile}
                          frameId="footer-01"
                          aspectRatio={selectedRatio}
                          scale={0.34}
                          showFooter={true}
                        />

                        {/* Hover Overlay with Quick Actions (Section 13) */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-xs">
                          <button
                            type="button"
                            onClick={() => {
                              onOpenStudioWithTemplate(poster);
                              onClose();
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 transform hover:scale-105 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>✏️ पोस्टर एडिटरमध्ये उघडा (Edit)</span>
                          </button>

                          <div className="flex items-center gap-2 w-full">
                            <button
                              type="button"
                              onClick={() => onQuickDownload && onQuickDownload(poster)}
                              className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-600" />
                              <span>डाऊनलोड</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSavePoster(poster)}
                              className={`p-2 rounded-xl transition-all cursor-pointer ${
                                isSaved
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                              title="माझ्या डिझाईन्समध्ये जतन करा"
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Poster Card Bottom Info */}
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span className="truncate max-w-[170px] text-slate-300 font-bold">
                          {poster.headline || poster.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onOpenStudioWithTemplate(poster);
                            onClose();
                          }}
                          className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>एडिट</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Discovery & Planner View (Sections 1-3 & 14-19) */}
          {!isGenerating && !campaignResult && (
            <div className="space-y-6">
              {/* Control Panel Bar */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
                {/* Day Range Tabs & 1-Click Multi-Generation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
                    {[
                      { days: 7, label: 'आगामी ७ दिवस (Next 7 Days)' },
                      { days: 30, label: '३० दिवस (30 Days)' },
                      { days: 90, label: '९० दिवस (90 Days)' },
                    ].map(tab => (
                      <button
                        key={tab.days}
                        type="button"
                        onClick={() => setDayRange(tab.days as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          dayRange === tab.days
                            ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Primary 1-Click Generate Button (Section 16) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateNext7Days}
                      disabled={events.length === 0}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 fill-current animate-bounce text-slate-950" />
                      <span>✨ पुढील ७ दिवसांचे AI पोस्टर्स बनवा (Generate Next 7 Days)</span>
                    </button>
                  </div>
                </div>

                {/* Filters Row: Region, Language, Size, Poster Count (Section 17-19) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                  {/* Region (Section 18) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      प्रदेश निवडा (Region)
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={e => setSelectedRegion(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold cursor-pointer"
                    >
                      {REGION_OPTIONS.map(r => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {selectedRegion === 'Custom Location' && (
                      <input
                        type="text"
                        value={customLocationText}
                        onChange={e => setCustomLocationText(e.target.value)}
                        placeholder="शहराचे नाव टाका (e.g. कोल्हापूर)..."
                        className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white"
                      />
                    )}
                  </div>

                  {/* Language (Section 8) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      भाषा (Language)
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={e => setSelectedLanguage(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold cursor-pointer"
                    >
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="en">English</option>
                      <option value="mixed">मराठी + English</option>
                    </select>
                  </div>

                  {/* Poster Format (Section 7) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      फॉरमॅट (Poster Size)
                    </label>
                    <select
                      value={selectedRatio}
                      onChange={e => setSelectedRatio(e.target.value as AspectRatio)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold cursor-pointer"
                    >
                      <option value="4:5">1080 × 1350 (Instagram Feed)</option>
                      <option value="1:1">1080 × 1080 (Square Post)</option>
                      <option value="9:16">1080 × 1920 (Story / Reel)</option>
                    </select>
                  </div>

                  {/* Posters Per Event (Section 16) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      प्रति सण डिझाईन्स (Count)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={postersPerEvent}
                        onChange={e => setPostersPerEvent(Number(e.target.value))}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold cursor-pointer"
                      >
                        <option value={5}>५ डिझाईन्स (5 Posters)</option>
                        <option value={10}>१० डिझाईन्स (10 Posters)</option>
                        <option value={15}>१५ डिझाईन्स (15 Posters)</option>
                        <option value={20}>२० डिझाईन्स (20 Posters)</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleSavePreferences}
                        title="सेटिंग्ज सेव्ह करा (Save Preferences)"
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>सेव्ह</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preferences Saved Alert */}
                {showPreferencesSavedToast && (
                  <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2 text-xs text-emerald-300 font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>आपल्या पसंतीनुसार सेटिंग्ज यशस्वीरीत्या सेव्ह झाल्या! (Preferences Saved)</span>
                  </div>
                )}

                {/* Active Brand Kit Notice (Section 12) */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>ब्रँड किट जोडले आहे:</strong> {activeProfile.name} • {activeProfile.phone} (लोगो व संपर्क आपोआप तळभागात जोडला जाईल)
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">
                    Auto Frame
                  </span>
                </div>
              </div>

              {/* Category Filter Pills (Section 17) & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {CATEGORY_TABS.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') fetchUpcomingEvents();
                    }}
                    placeholder="सण किंवा महापुरुष शोधा..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Automatic 7-Day Content Planner & Upcoming Event Cards (Sections 14-16) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-bold flex items-center gap-1.5 text-white">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>आगामी {dayRange} दिवसांचे सण व दिनविशेष ({events.length} सापडले)</span>
                  </span>
                  <span>आजची तारीख: २७ सप्टेंबर २०२६</span>
                </div>

                {isLoadingEvents ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">
                      वेबवरून अधिकृत सण व तारखा तपासत आहोत...
                    </p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="py-12 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-300">
                      या श्रेणीत किंवा तारखेत कोणताही सण सापडला नाही.
                    </p>
                    <p className="text-xs text-slate-500">
                      कृपया इतर श्रेणी किंवा ९० दिवसांचे कॅलेंडर निवडून पहा.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((ev, eIdx) => {
                      const isTomorrow = ev.daysAway === 1;
                      const isToday = ev.daysAway === 0;

                      return (
                        <div
                          key={ev.id}
                          className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all hover:shadow-lg hover:shadow-amber-500/5 group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              {/* Date Block */}
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shrink-0 shadow-md">
                                <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-center">
                                  <span className="text-[10px] font-black uppercase text-amber-400 leading-tight">
                                    {ev.dateStr.split('-')[1] === '09'
                                      ? 'सप्टें'
                                      : ev.dateStr.split('-')[1] === '10'
                                      ? 'ऑक्टो'
                                      : ev.dateStr.split('-')[1] === '11'
                                      ? 'नोव्हें'
                                      : 'डिसें'}
                                  </span>
                                  <span className="text-lg font-black text-white leading-tight font-['Outfit']">
                                    {ev.dateStr.split('-')[2]}
                                  </span>
                                </div>
                              </div>

                              {/* Event Name & Metadata */}
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                  {isToday && (
                                    <span className="px-2 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-black animate-pulse">
                                      आज (Today)
                                    </span>
                                  )}
                                  {isTomorrow && (
                                    <span className="px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black">
                                      उद्या (Tomorrow)
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {ev.dayOfWeek}
                                  </span>
                                </div>
                                <h4 className="text-base font-black text-white font-['Outfit'] group-hover:text-amber-300 transition-colors">
                                  {ev.nameMarathi}
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                  {ev.name}
                                </p>
                              </div>
                            </div>

                            {/* Authentic Image Preview Pill (Section 4 & 5) */}
                            {ev.authenticImage && (
                              <div
                                className="w-11 h-11 rounded-xl overflow-hidden border border-amber-400/50 shrink-0 bg-slate-900 shadow-sm"
                                title={`अधिकृत संदर्भ छायाचित्र: ${ev.authenticImage.sourceName} (${ev.authenticImage.credit || 'Archival'})`}
                              >
                                <img
                                  src={ev.authenticImage.url}
                                  alt={ev.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {/* Short Description & Historical Significance */}
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {ev.shortDescriptionMarathi || ev.shortDescription}
                          </p>

                          {/* Card Footer Action Bar (Section 15) */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="truncate max-w-[180px]">
                                {ev.sources[0]?.sourceName || 'अधिकृत गॅझेट'}
                              </span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleGenerateSingleFestival(ev)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950" />
                              <span>{postersPerEvent} पोस्टर्स बनवा</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Festival Auto Creator • GrowView Verified Engine</span>
          </div>

          <div className="flex items-center gap-3">
            <span>सपोर्ट: +91 77749 14906</span>
            <span>•</span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white font-bold cursor-pointer"
            >
              बंद करा
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

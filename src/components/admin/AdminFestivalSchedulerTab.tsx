import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Flame,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sparkles,
  Zap,
  Trash2,
  X,
  Layers,
  Check,
  Eye,
  RefreshCw,
  Edit2,
  Video,
} from 'lucide-react';
import { ScheduledFestivalCampaign, PosterTemplate, AspectRatio } from '../../types';
import { MOCK_SCHEDULED_FESTIVALS } from '../../data/adminMockData';
import { 
  getNext8DaysEvents, 
  generate10AutoFestivalPosters, 
  CalendarFestivalItem 
} from '../../data/calendarFestivals';

export const AdminFestivalSchedulerTab: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ScheduledFestivalCampaign[]>(MOCK_SCHEDULED_FESTIVALS);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [generatedSuccessMsg, setGeneratedSuccessMsg] = useState<string | null>(null);
  const [previewPosters, setPreviewPosters] = useState<PosterTemplate[] | null>(null);

  // Dynamic rolling calendar events (Yesterday, Today, Tomorrow, next 8 days)
  const rollingDays = useMemo(() => getNext8DaysEvents(), []);

  // Edit Festival Modal State
  const [editingCampaign, setEditingCampaign] = useState<ScheduledFestivalCampaign | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPosterSizes, setEditPosterSizes] = useState<AspectRatio[]>(['1:1', '4:5', '9:16']);
  const [editVideoSizes, setEditVideoSizes] = useState<AspectRatio[]>(['1:1', '4:5', '9:16']);

  // Form State for manual campaign
  const [newFest, setNewFest] = useState({
    name: '',
    nameMarathi: '',
    date: '',
    templates: 10,
    languages: ['mr', 'hi'] as ('mr' | 'hi' | 'en' | 'gu')[],
    spike: 300,
    posterSizes: ['1:1', '4:5', '9:16'] as AspectRatio[],
    videoSizes: ['1:1', '4:5', '9:16'] as AspectRatio[],
  });

  const handleOpenEditFestival = (camp: ScheduledFestivalCampaign) => {
    setEditingCampaign(camp);
    setEditPosterSizes(camp.posterSizes && camp.posterSizes.length > 0 ? camp.posterSizes : ['1:1', '4:5', '9:16']);
    setEditVideoSizes(camp.videoSizes && camp.videoSizes.length > 0 ? camp.videoSizes : ['1:1', '4:5', '9:16']);
    setIsEditModalOpen(true);
  };

  const handleSaveEditFestival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    if (editPosterSizes.length === 0) {
      alert('पोस्टरसाठी किमान एक आकार निवडा (Select at least one poster size).');
      return;
    }
    if (editVideoSizes.length === 0) {
      alert('व्हिडिओसाठी किमान एक आकार निवडा (Select at least one video size).');
      return;
    }

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === editingCampaign.id
          ? { ...c, posterSizes: editPosterSizes, videoSizes: editVideoSizes }
          : c
      )
    );
    setIsEditModalOpen(false);
    setGeneratedSuccessMsg(`'${editingCampaign.festivalNameMarathi}' साठी साईझ नियम यशस्वीरित्या अपडेट झाले!`);
    setTimeout(() => setGeneratedSuccessMsg(null), 4000);
  };

  const handleToggleAutoPublish = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isAutoPublish: !c.isAutoPublish } : c))
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ScheduledFestivalCampaign = {
      id: `fest-${Date.now()}`,
      festivalName: newFest.name,
      festivalNameMarathi: newFest.nameMarathi || newFest.name,
      festivalDate: newFest.date,
      category: 'festivals',
      templatePackCount: newFest.templates,
      isAutoPublish: true,
      status: 'upcoming',
      targetLanguages: newFest.languages,
      expectedSpikePercent: newFest.spike,
    };
    setCampaigns((prev) => [...prev, created]);
    setIsNewModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  // Generate 10 Posts automatically for a selected festival
  const handleAutoGenerate10Posts = (festival: CalendarFestivalItem, dateStr: string) => {
    const generated = generate10AutoFestivalPosters(festival, dateStr);
    
    // Save to localStorage so they persist in the poster catalog
    try {
      const existing = localStorage.getItem('growview_custom_templates');
      const parsed: PosterTemplate[] = existing ? JSON.parse(existing) : [];
      // Filter out existing duplicates with same IDs
      const filteredExisting = parsed.filter(p => !generated.some(g => g.id === p.id));
      const combined = [...generated, ...filteredExisting];
      localStorage.setItem('growview_custom_templates', JSON.stringify(combined));
    } catch (e) {
      console.error('Failed to persist generated festival templates', e);
    }

    setPreviewPosters(generated);
    setGeneratedSuccessMsg(`'${festival.nameMarathi}' साठी १० युनिक पोस्ट्स यशस्वीरित्या तयार करण्यात आले!`);
    setTimeout(() => setGeneratedSuccessMsg(null), 6000);
  };

  // Auto-generate for ALL festivals in upcoming 8 days
  const handleAutoGenerateAllUpcoming = () => {
    let totalGeneratedCount = 0;
    const allGenerated: PosterTemplate[] = [];

    rollingDays.forEach(day => {
      day.festivals.forEach(fest => {
        const posts = generate10AutoFestivalPosters(fest, day.dateStr);
        allGenerated.push(...posts);
        totalGeneratedCount += posts.length;
      });
    });

    try {
      const existing = localStorage.getItem('growview_custom_templates');
      const parsed: PosterTemplate[] = existing ? JSON.parse(existing) : [];
      const filteredExisting = parsed.filter(p => !allGenerated.some(g => g.id === p.id));
      const combined = [...allGenerated, ...filteredExisting];
      localStorage.setItem('growview_custom_templates', JSON.stringify(combined));
    } catch (e) {}

    setPreviewPosters(allGenerated.slice(0, 10));
    setGeneratedSuccessMsg(`आगामी सर्व सणांसाठी एकूण ${totalGeneratedCount} पोस्ट्स ऑटो-जनरेट करून कॅलेंडरमध्ये सिंक करण्यात आले!`);
    setTimeout(() => setGeneratedSuccessMsg(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Auto-Sync Engine */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Real-time Festival AI Engine
            </span>
          </div>
          <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2 font-['Outfit']">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>सण व मोहिमा शेड्युलर • १० पोस्ट्स ऑटो-अपडेट सिस्टीम</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            कॅलेंडरनुसार प्रत्येक आगामी सणासाठी १० युनिक हाय-डेफिनिशन पोस्टर्स एका क्लिकमध्ये ऑटो-जनरेट करा. 
            यात विविध लेआउट्स, सुवर्ण बॉर्डर, पारंपरिक मराठी फॉन्ट्स व सुविचार समाविष्ट आहेत.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAutoGenerateAllUpcoming}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>पुढील सर्व सणांचे १० पोस्ट्स ऑटो-जनरेट करा</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>मॅन्युअल मोहीम जोडा</span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {generatedSuccessMsg && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{generatedSuccessMsg}</span>
          </div>
          {previewPosters && (
            <button
              type="button"
              onClick={() => setPreviewPosters(null)}
              className="text-slate-400 hover:text-white text-[11px] underline"
            >
              प्रिव्ह्यू बंद करा
            </button>
          )}
        </div>
      )}

      {/* Live Preview Strip of Generated Posters (if available) */}
      {previewPosters && previewPosters.length > 0 && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              ऑटो-जनरेट केलेल्या पोस्टर्सचा प्रिव्ह्यू (१० युनिक लेआउट्स)
            </span>
            <span className="text-[10px] text-slate-400">
              प्रत्येक डिझाइनमध्ये स्वतंत्र रंग, श्लोक व डिझाइन पॅटर्न
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {previewPosters.slice(0, 5).map((p) => (
              <div key={p.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <span className="font-mono text-[9px] text-amber-400 block truncate">{p.id}</span>
                <span className="font-bold text-white block truncate">{p.titleNative}</span>
                <div className="h-10 rounded-lg flex items-center justify-center p-1 text-[10px] font-bold text-white text-center shadow-xs" style={{ background: `linear-gradient(to bottom right, ${p.theme.primaryColor}, ${p.theme.cardBg})` }}>
                  {p.motifType}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROLLING CALENDAR SECTION: 8-DAY UPCOMING FESTIVALS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>कॅलेंडर आगामी सण यादी (Rolling 8-Day Calendar)</span>
            </h4>
            <p className="text-xs text-slate-400">
              काल, आज, उद्या व पुढील ८ दिवसांमधील सण. प्रत्येक सणासाठी १० पोस्ट्स लगेच तयार करा.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300">
            {rollingDays.length} दिवस सक्रिय
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rollingDays.map((day) => (
            <div
              key={day.dateStr}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                day.isToday
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-md'
                  : day.isTomorrow
                  ? 'bg-indigo-500/10 border-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white font-mono">
                      {day.dayNumber} {day.monthNameMarathi}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({day.weekdayNameMarathi})
                    </span>
                  </div>

                  {day.relativeLabel && (
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      day.isToday
                        ? 'bg-amber-500 text-slate-950'
                        : day.isTomorrow
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {day.relativeLabel}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 space-y-1.5">
                  {day.festivals.map((fest) => (
                    <div key={fest.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-white truncate">
                          {fest.nameMarathi}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAutoGenerate10Posts(fest, day.dateStr)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                        title="या सणासाठी १० युनिक डिझाईन पोस्ट्स ऑटो-जनरेट करा"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        <span>१० पोस्ट्स ऑटो-जनरेट</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SCHEDULED CAMPAIGNS LIST */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>सध्याच्या सक्रिय मोहिमा (Active Scheduled Campaigns)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className={`p-5 rounded-2xl border transition-all shadow-lg flex flex-col justify-between ${
                camp.status === 'live'
                  ? 'bg-slate-900/95 border-amber-500/40 shadow-amber-500/5'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      camp.status === 'live'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {camp.status === 'live' ? 'Currently Live (सुरू आहे)' : 'Upcoming (आगामी)'}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{camp.festivalDate}</span>
                  </div>
                </div>

                <h4 className="text-base font-black text-white mt-3">{camp.festivalNameMarathi}</h4>
                <span className="text-xs text-slate-400 font-semibold block">{camp.festivalName}</span>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">Template Pack</span>
                    <span className="font-bold text-amber-400">{camp.templatePackCount} HD डिझाइन्स</span>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 text-[10px] block">Expected Spike</span>
                    <span className="font-bold text-emerald-400">+{camp.expectedSpikePercent}% Demand</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <div className="flex gap-1">
                    {camp.targetLanguages.map((l) => (
                      <span key={l} className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 uppercase font-mono font-semibold">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* POSTER & VIDEO SIZES CONTROLS (Section 9) */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      <Layers className="w-3 h-3 text-amber-400" />
                      <span>POSTER SIZES:</span>
                    </span>
                    <div className="flex gap-1 font-mono font-bold">
                      {(camp.posterSizes || ['1:1', '4:5', '9:16']).map((s) => (
                        <span key={s} className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      <Video className="w-3 h-3 text-cyan-400" />
                      <span>VIDEO SIZES:</span>
                    </span>
                    <div className="flex gap-1 font-mono font-bold">
                      {(camp.videoSizes || ['1:1', '4:5', '9:16']).map((s) => (
                        <span key={s} className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[9px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={camp.isAutoPublish}
                    onChange={() => handleToggleAutoPublish(camp.id)}
                    className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Auto-Publish ON</span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditFestival(camp)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="सणाचे आकार व सेटींग्ज बदला (Edit Festival Sizes)"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Sizes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(camp.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT FESTIVAL MODAL (Section 9) */}
      {isEditModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>EDIT FESTIVAL: {editingCampaign.festivalNameMarathi}</span>
                </h4>
                <p className="text-xs text-slate-400">{editingCampaign.festivalName} • {editingCampaign.festivalDate}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFestival} className="space-y-4 text-xs">
              {/* POSTER SIZES */}
              <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    <span>POSTER SIZES (पोस्टर आकार) *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Square, Portrait, Vertical</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    editPosterSizes.includes('1:1') ? 'bg-amber-500/15 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={editPosterSizes.includes('1:1')}
                      onChange={(e) => {
                        if (e.target.checked) setEditPosterSizes(p => [...p, '1:1']);
                        else {
                          if (editPosterSizes.length <= 1) return alert('किमान एक पोस्टर साईझ आवश्यक आहे!');
                          setEditPosterSizes(p => p.filter(s => s !== '1:1'));
                        }
                      }}
                      className="rounded text-amber-500"
                    />
                    <div>
                      <div className="font-bold text-xs">Square</div>
                      <div className="text-[10px] text-slate-400">1:1 (1080×1080)</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    editPosterSizes.includes('4:5') ? 'bg-amber-500/15 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={editPosterSizes.includes('4:5')}
                      onChange={(e) => {
                        if (e.target.checked) setEditPosterSizes(p => [...p, '4:5']);
                        else {
                          if (editPosterSizes.length <= 1) return alert('किमान एक पोस्टर साईझ आवश्यक आहे!');
                          setEditPosterSizes(p => p.filter(s => s !== '4:5'));
                        }
                      }}
                      className="rounded text-amber-500"
                    />
                    <div>
                      <div className="font-bold text-xs">Portrait</div>
                      <div className="text-[10px] text-slate-400">4:5 (1080×1350)</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    editPosterSizes.includes('9:16') ? 'bg-amber-500/15 border-amber-500 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={editPosterSizes.includes('9:16')}
                      onChange={(e) => {
                        if (e.target.checked) setEditPosterSizes(p => [...p, '9:16']);
                        else {
                          if (editPosterSizes.length <= 1) return alert('किमान एक पोस्टर साईझ आवश्यक आहे!');
                          setEditPosterSizes(p => p.filter(s => s !== '9:16'));
                        }
                      }}
                      className="rounded text-amber-500"
                    />
                    <div>
                      <div className="font-bold text-xs">Vertical</div>
                      <div className="text-[10px] text-slate-400">9:16 (1080×1920)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* VIDEO SIZES */}
              <div className="p-3.5 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-cyan-400 flex items-center gap-1.5">
                    <Video className="w-4 h-4" />
                    <span>VIDEO SIZES (व्हिडिओ आकार) *</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Square, Portrait, Vertical</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    editVideoSizes.includes('1:1') ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={editVideoSizes.includes('1:1')}
                      onChange={(e) => {
                        if (e.target.checked) setEditVideoSizes(p => [...p, '1:1']);
                        else {
                          if (editVideoSizes.length <= 1) return alert('किमान एक व्हिडिओ साईझ आवश्यक आहे!');
                          setEditVideoSizes(p => p.filter(s => s !== '1:1'));
                        }
                      }}
                      className="rounded text-cyan-500"
                    />
                    <div>
                      <div className="font-bold text-xs">Square</div>
                      <div className="text-[10px] text-slate-400">1:1 (1080×1080)</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    editVideoSizes.includes('4:5') ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={editVideoSizes.includes('4:5')}
                      onChange={(e) => {
                        if (e.target.checked) setEditVideoSizes(p => [...p, '4:5']);
                        else {
                          if (editVideoSizes.length <= 1) return alert('किमान एक व्हिडिओ साईझ आवश्यक आहे!');
                          setEditVideoSizes(p => p.filter(s => s !== '4:5'));
                        }
                      }}
                      className="rounded text-cyan-500"
                    />
                    <div>
                      <div className="font-bold text-xs">Portrait</div>
                      <div className="text-[10px] text-slate-400">4:5 (1080×1350)</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    editVideoSizes.includes('9:16') ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <input
                      type="checkbox"
                      checked={editVideoSizes.includes('9:16')}
                      onChange={(e) => {
                        if (e.target.checked) setEditVideoSizes(p => [...p, '9:16']);
                        else {
                          if (editVideoSizes.length <= 1) return alert('किमान एक व्हिडिओ साईझ आवश्यक आहे!');
                          setEditVideoSizes(p => p.filter(s => s !== '9:16'));
                        }
                      }}
                      className="rounded text-cyan-500"
                    />
                    <div>
                      <div className="font-bold text-xs">Vertical</div>
                      <div className="text-[10px] text-slate-400">9:16 (1080×1920)</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  रद्द करा (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-lg cursor-pointer"
                >
                  बदल सेव्ह करा (Save Festival Sizes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE FESTIVAL MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-md rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>नवीन सण मोहीम जोडा</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">सणाचे नाव (मराठी)</label>
                <input
                  type="text"
                  required
                  value={newFest.nameMarathi}
                  onChange={(e) => setNewFest({ ...newFest, nameMarathi: e.target.value })}
                  placeholder="उदा. दीपावली व लक्ष्मीपूजन विशेष"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">इंग्रजी नाव (English Title)</label>
                <input
                  type="text"
                  required
                  value={newFest.name}
                  onChange={(e) => setNewFest({ ...newFest, name: e.target.value })}
                  placeholder="उदा. Diwali & New Year Campaign"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">तारीख (Target Date)</label>
                  <input
                    type="date"
                    required
                    value={newFest.date}
                    onChange={(e) => setNewFest({ ...newFest, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">टेम्प्लेट संख्या</label>
                  <input
                    type="number"
                    min={1}
                    value={newFest.templates}
                    onChange={(e) => setNewFest({ ...newFest, templates: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  मोहीम जोडा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

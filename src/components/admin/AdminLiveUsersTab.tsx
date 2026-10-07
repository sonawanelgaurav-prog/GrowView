import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  Sparkles,
  Download,
  Edit3,
  Layers,
  Smartphone,
  MapPin,
  RefreshCw,
  Clock,
  Play,
  Pause,
  Filter,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { LiveUserActivityItem } from '../../types';
import { MOCK_LIVE_ACTIVITIES } from '../../data/adminMockData';

export const AdminLiveUsersTab: React.FC = () => {
  const [activities, setActivities] = useState<LiveUserActivityItem[]>(MOCK_LIVE_ACTIVITIES);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'edit' | 'export' | 'ai' | 'upgrade'>('all');

  // Simulated live incoming activities
  useEffect(() => {
    if (!isLiveStreamActive) return;

    const sampleActions: { text: string; cat: 'edit' | 'export' | 'ai' | 'upgrade' | 'login'; title: string }[] = [
      { text: 'Ganpati Aagman Banner 4K Export केली', cat: 'export', title: 'Ganesh Chaturthi (1:1)' },
      { text: 'Real Estate Luxury Villa Frame कस्टमाइझ केली', cat: 'edit', title: 'Patil Real Estate' },
      { text: 'Gemini AI कडून ५ बिझनेस स्लोगन जनरेट केले', cat: 'ai', title: 'AI Slogan Studio' },
      { text: 'Yearly VIP ₹999 प्लॅन खरेदी केला', cat: 'upgrade', title: 'VIP Subscription' },
      { text: 'Navratri Garba Poster वर स्वतःचा लोगो जोडला', cat: 'edit', title: 'Navratri Dandiya 2026' },
      { text: 'Jewellery Shop Gold Offer Poster तयार केले', cat: 'export', title: 'Shinde Jewellers' },
    ];

    const sampleUsers = [
      { name: 'Kiran Mane', email: 'kiran.m@gmail.com', city: 'Pune', dev: 'Samsung S23' },
      { name: 'Sanjay Pawar', email: 'sanjay.p@gmail.com', city: 'Mumbai', dev: 'iPhone 15' },
      { name: 'Ganesh Deshmukh', email: 'ganesh.d@gmail.com', city: 'Solapur', dev: 'OnePlus 11' },
      { name: 'Archana Kadam', email: 'archana.k@gmail.com', city: 'Kolhapur', dev: 'Vivo V29' },
      { name: 'Manoj Shirodkar', email: 'manoj.s@gmail.com', city: 'Goa / Sindhudurg', dev: 'Xiaomi 13 Pro' },
    ];

    const interval = setInterval(() => {
      const randAct = sampleActions[Math.floor(Math.random() * sampleActions.length)];
      const randUsr = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];

      const newItem: LiveUserActivityItem = {
        id: `live-${Date.now()}`,
        userName: randUsr.name,
        userEmail: randUsr.email,
        actionText: randAct.text,
        category: randAct.cat,
        templateTitle: randAct.title,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        device: randUsr.dev,
        city: randUsr.city,
      };

      setActivities((prev) => [newItem, ...prev.slice(0, 19)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveStreamActive]);

  const filteredActivities = activities.filter(
    (a) => selectedFilter === 'all' || a.category === selectedFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Live Status Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ONLINE NOW</span>
            </div>
            <div className="text-3xl font-black text-white">384</div>
            <span className="text-[11px] text-slate-400">Peak today: 492</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-indigo-400 font-bold mb-1">EDITING CANVAS</div>
            <div className="text-3xl font-black text-white">142</div>
            <span className="text-[11px] text-slate-400">37% active editors</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-400 font-bold mb-1">EXPORTING HD</div>
            <div className="text-3xl font-black text-white">58</div>
            <span className="text-[11px] text-slate-400">18 exports / min</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-amber-400 font-bold mb-1">AI GENERATING</div>
            <div className="text-3xl font-black text-white">35</div>
            <span className="text-[11px] text-slate-400">Gemini 2.5 Flash</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Real-time Stream & Location Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2-Col Stream */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">
                  Real-time User Activity Stream
                </h4>
                <p className="text-xs text-slate-400">थेट सुरू असणाऱ्या क्रिया व डिझाईन हालचाली</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                type="button"
                onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  isLiveStreamActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isLiveStreamActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Live Stream सुरू आहे</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Paused (सुरू करा)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 pt-3 pb-2 overflow-x-auto">
            {(['all', 'edit', 'export', 'ai', 'upgrade'] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setSelectedFilter(filterKey)}
                className={`text-xs px-3 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedFilter === filterKey
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {filterKey === 'all'
                  ? 'सर्व (All Activity)'
                  : filterKey === 'edit'
                  ? '🎨 Edits'
                  : filterKey === 'export'
                  ? '📥 Exports'
                  : filterKey === 'ai'
                  ? '✨ AI Generation'
                  : '👑 VIP Upgrades'}
              </button>
            ))}
          </div>

          {/* Activity Feed List */}
          <div className="space-y-2.5 mt-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 rounded-xl transition-all flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      act.category === 'export'
                        ? 'bg-blue-500/15 text-blue-400'
                        : act.category === 'ai'
                        ? 'bg-amber-500/15 text-amber-400'
                        : act.category === 'upgrade'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-indigo-500/15 text-indigo-400'
                    }`}
                  >
                    {act.category === 'export' ? (
                      <Download className="w-4 h-4" />
                    ) : act.category === 'ai' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : act.category === 'upgrade' ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <Edit3 className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-100">{act.userName}</span>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                        {act.city}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 font-medium">{act.actionText}</p>
                    {act.templateTitle && (
                      <span className="text-[10px] text-indigo-400 font-semibold block mt-0.5">
                        Template: {act.templateTitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-400 font-medium">{act.timeAgo}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{act.device}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 1-Col Live Distribution & Geo Map */}
        <div className="space-y-4">
          {/* Active Cities */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Active City Distribution (Live)</span>
            </h4>

            <div className="space-y-3 mt-4">
              {[
                { city: 'Pune (पुणे)', count: 128, percent: 33 },
                { city: 'Mumbai & Thane', count: 86, percent: 22 },
                { city: 'Kolhapur & Sangli', count: 54, percent: 14 },
                { city: 'Nashik & Ahmednagar', count: 48, percent: 13 },
                { city: 'Nagpur & Vidarbha', count: 38, percent: 10 },
                { city: 'Chh. Sambhajinagar', count: 30, percent: 8 },
              ].map((c) => (
                <div key={c.city} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{c.city}</span>
                    <span className="text-slate-400 font-bold font-mono">{c.count} users ({c.percent}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full"
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Device & Platform Share</span>
            </h4>

            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-bold block">Android</span>
                <span className="text-base font-black text-emerald-400">74%</span>
                <span className="text-[10px] text-slate-500 block">v12-v14</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-bold block">iOS</span>
                <span className="text-base font-black text-blue-400">22%</span>
                <span className="text-[10px] text-slate-500 block">iOS 17/18</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-bold block">Web</span>
                <span className="text-base font-black text-amber-400">4%</span>
                <span className="text-[10px] text-slate-500 block">Chrome/Safari</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

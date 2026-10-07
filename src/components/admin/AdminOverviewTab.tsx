import React, { useState } from 'react';
import {
  Users,
  Crown,
  IndianRupee,
  Download,
  Activity,
  TrendingUp,
  Sparkles,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  Zap,
  Globe,
  Smartphone,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  MOCK_CHART_TIMELINE,
  MOCK_DAILY_ACTIVE_DATA,
  MOCK_LANGUAGE_ANALYTICS,
  MOCK_PAYMENT_SOURCES,
} from '../../data/adminMockData';

interface AdminOverviewTabProps {
  onNavigateTab: (tabId: string) => void;
  onOpenQuickTemplateModal?: () => void;
  onSendQuickNotification?: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
  onOpenQuickTemplateModal,
  onSendQuickNotification,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '6m' | '1y'>('30d');
  const [activeChart, setActiveChart] = useState<'dau' | 'revenue' | 'exports'>('revenue');

  return (
    <div className="space-y-6">
      {/* Top Banner: Real-time Growth Insight & AI Recommendation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-600/15 to-purple-600/15 border border-amber-500/30 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  AI Growth Intelligence
                </span>
                <span className="text-xs text-slate-400">Live Forecast</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                या आठवड्यात <span className="text-amber-400">Ganesh Chaturthi templates 380% जास्त वापरले गेले</span>.
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                शिफारस: Ganesh Festival VIP Pack बॅनरवर हायलाइट करा आणि <strong>GANPATI25</strong> कूपन पुश नोटिफिकेशनद्वारे पाठवा.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => onNavigateTab('festival_scheduler')}
              className="flex-1 md:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <Flame className="w-4 h-4" />
              <span>सण मोहीम उघडा</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('notifications')}
              className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>पुश नोटिफिकेशन पाठवा</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Registered Users</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-white tracking-tight">12,480</div>
            <div className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +320 today
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>DAU: <strong className="text-slate-200 font-semibold">4,120</strong></span>
            <span>MAU: <strong className="text-slate-200 font-semibold">52.4K</strong></span>
          </div>
        </div>

        {/* Card 2: Premium Subscribers */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-amber-500/30 transition-all shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">VIP Premium Users</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-amber-400 tracking-tight">1,240</div>
            <div className="flex items-center text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              <span>9.9% Conv.</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Yearly VIP: <strong className="text-slate-200">780</strong></span>
            <span>Monthly: <strong className="text-slate-200">460</strong></span>
          </div>
        </div>

        {/* Card 3: Monthly Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-emerald-500/30 transition-all shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">August Revenue (MRR)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-emerald-400 tracking-tight">₹4.82L</div>
            <div className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +18.4% MoM
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Today: <strong className="text-slate-200">₹14,250</strong></span>
            <span>Avg Order: <strong className="text-slate-200">₹680</strong></span>
          </div>
        </div>

        {/* Card 4: Posters Created & Exported */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 hover:border-indigo-500/30 transition-all shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Posters Exported</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-black text-white tracking-tight">82,900</div>
            <div className="flex items-center text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
              <Sparkles className="w-3.5 h-3.5 mr-0.5" />
              2.4K today
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>4K Ultra HD: <strong className="text-slate-200">32%</strong></span>
            <span>1:1 Square: <strong className="text-slate-200">64%</strong></span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2-Column Wide Chart: Revenue & DAU Trends */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Performance & Growth Analytics</span>
              </h4>
              <p className="text-xs text-slate-400">मासिक महसूल, ॲक्टिव्ह युजर्स व डाऊनलोड ट्रेंड</p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveChart('revenue')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeChart === 'revenue' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Revenue (₹)
              </button>
              <button
                type="button"
                onClick={() => setActiveChart('dau')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeChart === 'dau' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Active Users
              </button>
              <button
                type="button"
                onClick={() => setActiveChart('exports')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeChart === 'exports' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Exports
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {activeChart === 'revenue' ? (
                <AreaChart data={MOCK_CHART_TIMELINE}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Monthly Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              ) : activeChart === 'dau' ? (
                <AreaChart data={MOCK_CHART_TIMELINE}>
                  <defs>
                    <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="dau"
                    name="Daily Active Users"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#colorDau)"
                  />
                  <Area
                    type="monotone"
                    dataKey="mau"
                    name="Monthly Active"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fill="none"
                  />
                </AreaChart>
              ) : (
                <BarChart data={MOCK_CHART_TIMELINE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  />
                  <Bar dataKey="exports" name="Exports" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="premiumNew" name="New VIPs" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* 1-Column: Language Analytics Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Language Analytics</span>
              </h4>
              <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                Marathi #1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              वापरकर्त्यांनी तयार केलेल्या पोस्टर्सचे भाषा वितरण:
            </p>

            <div className="space-y-3.5 mt-4">
              {MOCK_LANGUAGE_ANALYTICS.map((lang) => (
                <div key={lang.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{lang.name}</span>
                    <span className="font-bold text-slate-300 font-mono">
                      {lang.percentage}% ({lang.users.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>मराठी सण व व्यवसाय पॅक्सची मागणी सर्वाधिक आहे.</span>
            <button
              type="button"
              onClick={() => onNavigateTab('templates')}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0 ml-2"
            >
              <span>पहा</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Trending Festivals Widget + Payment Gateways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Today Festivals Widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>आज काय ट्रेंडिंग आहे? (Trending Festivals Widget)</span>
            </h4>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Demand
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">१. गणेशोत्सव (Ganesh Chaturthi)</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                  +420% Spike
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                ४२,४००+ युजर्सनी आज गणेशोत्सव बॅनर बनवले.
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>२४ नवीन टेम्प्लेट्स ॲक्टिव्ह</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('templates')}
                  className="text-amber-400 hover:underline font-bold"
                >
                  व्यवस्थापित करा &rarr;
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-indigo-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">२. शिक्षक दिन (Teachers Day)</span>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/15 px-1.5 py-0.5 rounded">
                  +210% Spike
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                ५ सप्टेंबरसाठी १२ विशेष कृतज्ञता पोस्टर्स तयार.
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span>ऑटो-पब्लिश: ३ सप्टेंबर</span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('festival_scheduler')}
                  className="text-indigo-400 hover:underline font-bold"
                >
                  शेड्युल पहा &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateways Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <span>Payment Sources & Gateways</span>
            </h4>
            <button
              type="button"
              onClick={() => onNavigateTab('subscriptions')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
            >
              पूर्ण लेजर &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {MOCK_PAYMENT_SOURCES.map((source) => (
              <div key={source.source} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[11px] font-semibold text-slate-400 block truncate" title={source.source}>
                  {source.source}
                </span>
                <div className="text-base font-black text-white mt-1">{source.revenue}</div>
                <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                  {source.percentage}% ({source.count} txn)
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>UPI & Google Play In-App मधून ७८% महसूल येत आहे.</span>
            <span className="text-emerald-400 font-bold">Payout Success 99.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

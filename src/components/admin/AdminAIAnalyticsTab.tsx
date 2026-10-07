import React from 'react';
import {
  Sparkles,
  Zap,
  Globe,
  Cpu,
  TrendingUp,
  DollarSign,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const AdminAIAnalyticsTab: React.FC = () => {
  const promptData = [
    { name: 'Festival Wishes', value: 44, color: '#f59e0b' },
    { name: 'Business Slogans', value: 32, color: '#6366f1' },
    { name: 'Political Greetings', value: 14, color: '#10b981' },
    { name: 'Daily Thoughts', value: 10, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 AI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Total AI Prompts</span>
          <div className="text-2xl font-black text-amber-400 mt-1">42,600</div>
          <span className="text-[11px] text-emerald-400 font-bold mt-1 block">+3.2K generated today</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Token Consumption</span>
          <div className="text-2xl font-black text-indigo-400 mt-1">12.4M</div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">Avg 290 tok/prompt</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">AI Engine Model</span>
          <div className="text-2xl font-black text-white mt-1">Gemini 2.5</div>
          <span className="text-[11px] text-amber-400 font-bold mt-1 block">Ultra Fast Flash</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">API Cost Estimated</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">~$4.20</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Highly cost-efficient</span>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Prompt Category Distribution</span>
          </h4>

          <div className="h-64 w-full pt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={promptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {promptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {promptData.map((p) => (
              <div key={p.name} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-slate-300 font-medium">{p.name}</span>
                <span className="text-slate-500 font-bold font-mono ml-auto">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marathi AI Slogan Prompt Showcase */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Trending Marathi AI Slogans (Generated Live)</span>
            </h4>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold text-[10px]">गणेशोत्सव आगमन:</span>
                <p className="text-slate-200">
                  "विघ्नहर्त्याचे आगमन, घराघरात आनंदाचे नंदनवन! पाटील सराफ कडून गणेशोत्सवाच्या हार्दिक सदिच्छा."
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-indigo-400 font-bold text-[10px]">रियल इस्टेट ऑफर:</span>
                <p className="text-slate-200">
                  "सणांच्या शुभमुहूर्तावर स्वतःच्या हक्काच्या घराचे स्वप्न करा साकार! 2 BHK लक्झरी फ्लॅट्स आता खास दरात."
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-bold text-[10px]">शिक्षक दिन कृतज्ञता:</span>
                <p className="text-slate-200">
                  "ज्यांनी घडवले जीवन, ज्यांनी दाखवली वाट... अशा गुरुवर्यांना शिक्षक दिनी विनम्र प्रणाम!"
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            मराठी भाषेसाठी देवनागरी व्याकरण व सांस्कृतिक टोन मॉडेलमध्ये इनबिल्ट आहे.
          </div>
        </div>
      </div>

      {/* AI Festival Auto Creator Admin Controls (Section 32) */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">
                AI Festival Auto Creator — Admin Controls
              </h4>
              <p className="text-xs text-slate-400">
                आगामी सणांचे ऑटो-डिटेक्शन, Google Search Grounding आणि प्रति कॅम्पेन पोस्टर्स मर्यादा
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30">
            इंजिन सक्रिय (Active)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">सण ऑटो-डिस्कव्हरी</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-black text-white">चालू (Enabled)</span>
            </div>
            <p className="text-[10px] text-slate-500">७, ३० व ९० दिवसांचे कॅलेंडर</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">प्रति सण पोस्टर्स</span>
            <span className="text-sm font-black text-amber-400 block mt-1">१० स्वतंत्र डिझाईन्स</span>
            <p className="text-[10px] text-slate-500">कमाल मर्यादा: २० पोस्टर्स</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">Google Search Grounding</span>
            <span className="text-sm font-black text-emerald-400 block mt-1">सत्यापित स्रोत (Verified)</span>
            <p className="text-[10px] text-slate-500">चुकीचे कोट्स व तारखा प्रतिबंध</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold block">ऐतिहासिक व्यक्तिमत्त्वे</span>
            <span className="text-sm font-black text-indigo-400 block mt-1">अधिकृत अर्काइव्ह्ज</span>
            <p className="text-[10px] text-slate-500">Wikimedia / NAI पब्लिक डोमेन</p>
          </div>
        </div>
      </div>
    </div>
  );
};

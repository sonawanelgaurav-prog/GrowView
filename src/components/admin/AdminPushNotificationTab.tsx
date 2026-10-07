import React, { useState } from 'react';
import {
  Bell,
  Send,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  Filter,
  Smartphone,
  Flame,
  Zap,
  Tag,
} from 'lucide-react';
import { PushNotificationCampaign } from '../../types';
import { MOCK_PUSH_NOTIFICATIONS } from '../../data/adminMockData';

export const AdminPushNotificationTab: React.FC = () => {
  const [campaigns, setCampaigns] = useState<PushNotificationCampaign[]>(MOCK_PUSH_NOTIFICATIONS);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('🚩 बाप्पाच्या आगमनाचे HD पोस्टर्स तयार आहेत!');
  const [body, setBody] = useState('तुमच्या बिझनेसचे नाव व फोटो जोडून ५ सेकंदात गणेशोत्सव बॅनर डाऊनलोड करा.');
  const [targetAudience, setTargetAudience] = useState<PushNotificationCampaign['targetAudience']>('marathi_users');
  const [type, setType] = useState<PushNotificationCampaign['type']>('festival_reminder');
  const [deepLink, setDeepLink] = useState('category/ganesh-chaturthi');

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: PushNotificationCampaign = {
      id: `notif-${Date.now()}`,
      title,
      body,
      type,
      targetAudience,
      targetCount: targetAudience === 'all' ? 12480 : targetAudience === 'marathi_users' ? 7200 : 3800,
      sentAt: new Date().toISOString(),
      status: 'sent',
      openRate: 41.2,
      clicks: 1480,
      deepLink,
    };

    setCampaigns([newCamp, ...campaigns]);
    setSuccessToast(`पुश नोटिफिकेशन ${newCamp.targetCount.toLocaleString('en-IN')} युजर्सना यशस्वीरित्या पाठवले!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Composer & Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2-Col Composer Form */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              पुश नोटिफिकेशन सेंटर (Push Broadcast Composer)
            </h3>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                नोटिफिकेशन शीर्षक (Title with Emoji)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. 🚩 गणेशोत्सवाचे नवीन बॅनर लाइव्ह!"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                नोटिफिकेशन संदेश (Message Body)
              </label>
              <textarea
                rows={3}
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="उदा. तुमच्या दुकानाचे नाव जोडून ५ सेकंदात डिझाईन डाऊनलोड करा..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  मोहीम प्रकार (Campaign Type)
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs font-semibold"
                >
                  <option value="festival_reminder">सण आठवण (Festival Reminder)</option>
                  <option value="abandoned_draft">अपूर्ण पोस्ट आठवण (Abandoned Draft)</option>
                  <option value="flash_sale">VIP फ्लॅश सेल (Flash Sale)</option>
                  <option value="premium_offer">प्रीमियम ऑफर (Premium Offer)</option>
                  <option value="new_templates">नवीन डिझाईन्स (New Templates)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  लक्षित प्रेक्षक (Target Audience Filter)
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs font-semibold"
                >
                  <option value="all">सर्व युजर्स (All 12.4K Users)</option>
                  <option value="marathi_users">मराठी युजर्स (7.2K Users)</option>
                  <option value="free_users">फ्री युजर्स (11.2K Users)</option>
                  <option value="premium_users">VIP युजर्स (1.2K VIPs)</option>
                  <option value="hindi_users">हिंदी युजर्स (3.0K Users)</option>
                  <option value="inactive_users">अक्रिय युजर्स (7+ Days Inactive)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                डीप लिंक (Deep Link / Category Route)
              </label>
              <input
                type="text"
                value={deepLink}
                onChange={(e) => setDeepLink(e.target.value)}
                placeholder="category/ganesh-chaturthi"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-400 text-xs">
                अनुमानित प्रेक्षक: <strong className="text-amber-400 font-bold">~7,200 युजर्स</strong>
              </span>

              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                <span>आत्ताच ब्रॉडकास्ट करा (Send Push)</span>
              </button>
            </div>
          </form>
        </div>

        {/* 1-Col Live Phone Simulator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>Mobile Notification Preview</span>
            </h4>

            {/* Simulated Android Notification Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-700 shadow-2xl space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>GrowView Poster Maker</span>
                </div>
                <span>Just now</span>
              </div>

              <div className="font-bold text-xs text-white line-clamp-1">{title}</div>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{body}</p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">
                  Open Poster
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded">
                  Later
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            FCM (Firebase Cloud Messaging) + OneSignal पुश सर्व्हर जोडलेले आहेत.
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-sm sm:text-base text-white">
            मागील ब्रॉडकास्ट इतिहास (Notification History & Performance)
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Title & Message</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Open Rate & Clicks</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-[280px]">
                    <div className="font-bold text-slate-200 truncate">{camp.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{camp.body}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono capitalize text-slate-300">
                    {camp.targetAudience.replace('_', ' ')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {camp.type.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {camp.targetCount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    {camp.openRate ? (
                      <div>
                        <span className="text-emerald-400 font-bold">{camp.openRate}%</span>
                        <span className="text-slate-500 text-[10px] block">
                          {camp.clicks} clicks
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        camp.status === 'sent'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-indigo-500/15 text-indigo-400'
                      }`}
                    >
                      {camp.status === 'sent' ? 'Sent (पाठवले)' : 'Scheduled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

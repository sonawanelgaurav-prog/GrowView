import React, { useState, useEffect } from 'react';
import {
  CustomerActivityLog,
  UserAccount,
  BusinessProfile,
  PosterTemplate,
  UserSubscriptionResolution,
  PaymentVerificationRecord,
} from '../types';
import { validatePassword } from '../utils/authUtils';
import {
  fetchSubscriptionStatus,
  fetchMyPaymentHistory,
} from '../services/subscriptionService';
import {
  User,
  Shield,
  Activity,
  Download,
  Calendar,
  Clock,
  Laptop,
  CheckCircle,
  Key,
  Lock,
  Eye,
  EyeOff,
  Search,
  Filter,
  FileSpreadsheet,
  X,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Building,
  Check,
  LogOut,
  Crown,
  LayoutDashboard,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Video,
  Heart,
  Palette,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  CreditCard,
  IndianRupee,
  QrCode,
  RefreshCw,
  Copy,
  CheckCheck,
} from 'lucide-react';

interface CustomerActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  activeProfile?: BusinessProfile;
  activityLogs: CustomerActivityLog[];
  templates?: PosterTemplate[];
  onSelectTemplate?: (template: PosterTemplate) => void;
  onLogout: () => void;
  onUpdatePassword: (oldPass: string, newPass: string) => void;
  onOpenAdminPanel?: () => void;
  onOpenProfileModal?: () => void;
  onOpenPricingModal?: () => void;
  onOpenAIFestivalModal?: () => void;
}

export const CustomerActivityModal: React.FC<CustomerActivityModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeProfile,
  activityLogs,
  templates = [],
  onSelectTemplate,
  onLogout,
  onUpdatePassword,
  onOpenAdminPanel,
  onOpenProfileModal,
  onOpenPricingModal,
  onOpenAIFestivalModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'logs' | 'security' | 'subscription'>('overview');
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  // Live Subscription & Payment State
  const [subResolution, setSubResolution] = useState<UserSubscriptionResolution | null>(null);
  const [myPayments, setMyPayments] = useState<PaymentVerificationRecord[]>([]);
  const [isLoadingSub, setIsLoadingSub] = useState<boolean>(false);
  const [selectedProofPayment, setSelectedProofPayment] = useState<PaymentVerificationRecord | null>(null);

  const loadSubData = async () => {
    if (!currentUser) return;
    setIsLoadingSub(true);
    try {
      const [res, payments] = await Promise.all([
        fetchSubscriptionStatus(currentUser.id, currentUser.email).catch(() => null),
        fetchMyPaymentHistory().catch(() => []),
      ]);
      if (res) setSubResolution(res);
      if (payments) setMyPayments(payments);
    } catch (err) {
      console.warn('Failed to load subscription status:', err);
    } finally {
      setIsLoadingSub(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSubData();
    }
  }, [isOpen]);

  // Password Change State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // User's custom/uploaded templates (Sorted newest first)
  const uploadedTemplates = (templates || []).filter(
    (t) =>
      t.isCustomUpload ||
      t.isNew ||
      t.isJustUploaded ||
      t.id.startsWith('tpl-admin-') ||
      t.id.startsWith('tpl-custom-') ||
      Boolean(t.createdAt) ||
      Boolean(t.created_at)
  ).sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
    if (aTime && bTime && aTime !== bTime) return bTime - aTime;
    return 0;
  });

  // Filter logs for this customer
  const userLogs = activityLogs.filter(
    (log) => currentUser.role === 'admin' || log.userId === currentUser.id
  );

  const filteredLogs = userLogs.filter((log) => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (searchLogQuery.trim()) {
      const q = searchLogQuery.toLowerCase();
      const matchDesc = log.description.toLowerCase().includes(q);
      const matchMar = log.descriptionMarathi?.toLowerCase().includes(q);
      const matchUser = log.userName.toLowerCase().includes(q);
      if (!matchDesc && !matchMar && !matchUser) return false;
    }
    return true;
  });

  const passValidation = validatePassword(newPassInput);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!currentPassInput) {
      setPassError('कृपया चालू पासवर्ड प्रविष्ट करा.');
      return;
    }

    if (!passValidation.isValid) {
      setPassError('नवीन पासवर्ड नियमांचे पालन करत नाही! (८ अक्षरे, १ कॅपिटल, १ नंबर, १ चिन्ह)');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassError('नवीन पासवर्ड जुळत नाही (Password Mismatch).');
      return;
    }

    try {
      onUpdatePassword(currentPassInput, newPassInput);
      setPassSuccess('पासवर्ड यशस्वीरित्या बदलला आहे!');
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
    } catch (err: any) {
      setPassError(err.message || 'पासवर्ड बदलण्यात त्रुटी आली.');
    }
  };

  // Export logs to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'User', 'Action', 'Description', 'Marathi Description', 'Timestamp', 'Device'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.userName} (${l.userEmail})"`,
      l.action,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${l.descriptionMarathi?.replace(/"/g, '""') || ''}"`,
      `"${new Date(l.timestamp).toLocaleString('en-IN')}"`,
      `"${l.device || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `activity-logs-${currentUser.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isVip = currentUser.role === 'admin' || currentUser.subscriptionTier === 'vip';
  const totalDownloads = currentUser.totalDownloads || userLogs.filter(l => l.action === 'download_poster').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 text-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Card with User Avatar & VIP Status */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-orange-500/20">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-300 font-black text-xl font-['Outfit']">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center" title="सक्रिय खाते">
                  <Check className="w-3 h-3 text-white font-bold" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-black text-lg sm:text-xl text-white tracking-tight">
                    {currentUser.name}
                  </h2>
                  {isVip ? (
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs flex items-center gap-1">
                      <Crown className="w-3 h-3 text-slate-950 fill-amber-300" />
                      <span>VIP Pro सदस्य</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      मोफत सदस्य (Free Plan)
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ईमेल पडताळणीकृत ✓</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                  <span className="font-semibold text-slate-300">🏢 {currentUser.businessName || activeProfile?.name || 'माझा व्यवसाय'}</span>
                  <span>•</span>
                  <span>📞 {currentUser.phone || activeProfile?.phone || '+91 98220 12345'}</span>
                  <span>•</span>
                  <span>✉️ {currentUser.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              {onOpenPricingModal && !isVip && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPricingModal();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-slate-950 fill-amber-300" />
                  <span>VIP अपग्रेड</span>
                </button>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">लॉगआऊट</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">एकूण डाऊनलोड्स</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-400">{totalDownloads}</span>
              <span className="text-[10px] text-slate-500 font-semibold">पोस्टर्स</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold mt-0.5 block">HD क्वालिटी रेडी</span>
          </div>

          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">ब्रँड किट दर्जा</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">१००%</span>
              <span className="text-[10px] text-slate-500 font-semibold">सक्रिय</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
              {activeProfile?.name || currentUser.businessName}
            </span>
          </div>

          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">खाते सदस्यत्व</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-white">{isVip ? 'VIP Pro' : 'Free Trial'}</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold mt-0.5 block">सर्व ५००+ सण उपलब्ध</span>
          </div>

          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">खाते सुरक्षितता</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-emerald-400">संरक्षित ✓</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">ईमेल व पासवर्ड सुरक्षित</span>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center gap-1.5 px-4 sm:px-5 pt-3 pb-1 border-b border-slate-800 bg-slate-900 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>📊 डॅशबोर्ड व सारांश</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>🏢 व्यवसाय प्रोफाइल व ब्रँड किट</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>⚡ डाऊनलोड्स व ॲक्टिव्हिटी लॉग ({userLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>🔒 पासवर्ड व सुरक्षा</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'subscription'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>💳 सबस्क्रिप्शन व पेमेंट इतिहास</span>
            {myPayments.some((p) => p.status === 'pending') && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-400 text-slate-950 animate-pulse">
                Verification Pending
              </span>
            )}
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: OVERVIEW & QUICK ACTIONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 🌟 1. नुकतेच अपलोड केलेले पोस्टर्स (My Uploaded Posters) */}
              {uploadedTemplates.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10 border-2 border-amber-500/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shrink-0">
                        <Upload className="w-4 h-4 text-slate-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-black text-white">
                            ✨ नुकतेच अपलोड केलेले पोस्टर्स (My Uploaded Posters)
                          </h3>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white animate-pulse">
                            नवीन
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          तुम्ही किंवा ॲडमिनने अपलोड केलेले पोस्टर्स. पोस्टरवर क्लिक करून थेट एडिट किंवा डाऊनलोड करा.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 self-start sm:self-auto">
                      {uploadedTemplates.length} पोस्टर्स उपलब्ध
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                    {uploadedTemplates.slice(0, 8).map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          if (onSelectTemplate) {
                            onSelectTemplate(tpl);
                          }
                          onClose();
                        }}
                        className="group relative bg-slate-950/80 border border-slate-700/80 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400 transition-all hover:scale-[1.02] shadow-sm flex flex-col"
                      >
                        <div className="aspect-square bg-slate-950 overflow-hidden relative">
                          {tpl.imageUrl || tpl.customBgUrl ? (
                            <img
                              src={tpl.imageUrl || tpl.customBgUrl}
                              alt={tpl.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-amber-950/40 to-slate-900">
                              <Sparkles className="w-6 h-6 text-amber-400 mb-1" />
                              <span className="text-xs font-black text-amber-300 line-clamp-2">
                                {tpl.headline || tpl.titleNative || tpl.title}
                              </span>
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
                            New
                          </span>
                        </div>
                        <div className="p-2.5 space-y-1">
                          <p className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                            {tpl.titleNative || tpl.title}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="truncate">{tpl.category}</span>
                            <span className="text-amber-400 font-bold flex items-center gap-0.5">
                              उघडा &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions Grid */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>झटपट कृती (Quick Action Launcher)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {onOpenAIFestivalModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAIFestivalModal();
                      }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/60 border border-indigo-700/50 hover:border-indigo-400 transition-all text-left space-y-2 group cursor-pointer shadow-md hover:scale-[1.01]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        <Sparkles className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-indigo-200">
                          AI फेस्टिव्हल ऑटो क्रिएटर ✨
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          आगामी सणांचे १० युनिक पोस्टर्स १-क्लिक मध्ये आपोआप तयार करा.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                        सुरू करा &rarr;
                      </span>
                    </button>
                  )}

                  {onOpenProfileModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenProfileModal();
                      }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-amber-400 transition-all text-left space-y-2 group cursor-pointer shadow-md hover:scale-[1.01]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        <Palette className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-amber-200">
                          ब्रँड फ्रेम व लोगो कस्टमाईझ
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          व्यवसाय नाव, लोगो, फोन नंबर व २७ डिझायनर फ्रेम्स बदला.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        फ्रेम बदला &rarr;
                      </span>
                    </button>
                  )}

                  {onOpenPricingModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPricingModal();
                      }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-orange-950/40 border border-amber-500/40 hover:border-amber-300 transition-all text-left space-y-2 group cursor-pointer shadow-md hover:scale-[1.01]"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                        <Crown className="w-5 h-5 text-amber-300 fill-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white group-hover:text-amber-200">
                          VIP अमर्यादित प्लॅन
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          वॉटरमार्क काढून टाका आणि अमर्यादित HD पोस्टर्स डाऊनलोड करा.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        प्लॅन्स पहा &rarr;
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Brand Information Preview Card */}
              {activeProfile && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-amber-400" />
                      <span>आपली सक्रिय ब्रँड माहिती (Active Brand Frame Details)</span>
                    </span>
                    {onOpenProfileModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenProfileModal();
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                      >
                        माहिती संपादित करा
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block font-bold">व्यवसाय नाव</span>
                      <span className="font-bold text-white text-sm">{activeProfile.name}</span>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block font-bold">संपर्क / व्हॉट्सॲप</span>
                      <span className="font-bold text-white text-sm">{activeProfile.phone}</span>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block font-bold">पत्ता / लोकेशन</span>
                      <span className="font-bold text-white text-sm truncate">{activeProfile.address || 'महाराष्ट्र, भारत'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity Timeline Snapshot */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>नुकतीच झालेली कृती (Recent Activities)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('logs')}
                    className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
                  >
                    सर्व लॉग्स पहा ({userLogs.length}) &rarr;
                  </button>
                </div>

                <div className="space-y-2">
                  {userLogs.slice(0, 4).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                          {log.action.includes('download') ? <Download className="w-4 h-4 text-emerald-400" /> : <Activity className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-white">{log.descriptionMarathi || log.description}</p>
                          <p className="text-[11px] text-slate-400">{new Date(log.timestamp).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                        {log.device || 'Web Browser'}
                      </span>
                    </div>
                  ))}
                  {userLogs.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">अद्याप कोणतीही ॲक्टिव्हिटी नोंदवलेली नाही.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & BUSINESS */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>वैयक्तिक व व्यवसाय माहिती (Profile Details)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">पूर्ण नाव</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.name}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium opacity-90"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">ईमेल पत्ता (व्हेरीफाइड ✓)</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.email}
                      className="w-full px-3 py-2 bg-slate-900 border border-emerald-500/40 rounded-xl text-emerald-300 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">मोबाईल नंबर</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.phone || '+91 98220 12345'}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium opacity-90"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">व्यवसायाचे नाव</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.businessName || activeProfile?.name || 'माझा व्यवसाय'}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium opacity-90"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">व्यवसाय प्रकार</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.businessType || 'Retail & General Shop'}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium opacity-90"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">शहर / ठिकाण</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.city || activeProfile?.address || 'महाराष्ट्र, भारत'}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium opacity-90"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">व्यवसाय माहिती किंवा लोगो बदलायचा आहे का?</span>
                  {onOpenProfileModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenProfileModal();
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      ब्रँड किट एडिटर उघडा
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchLogQuery}
                    onChange={(e) => setSearchLogQuery(e.target.value)}
                    placeholder="कृती किंवा पोस्टर शोधा..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-300 font-bold focus:outline-none"
                  >
                    <option value="all">सर्व कृती (All Actions)</option>
                    <option value="download_poster">📥 डाऊनलोड (Downloads)</option>
                    <option value="login">🔐 लॉगिन (Logins)</option>
                    <option value="customize_poster">🎨 एडिट (Edits)</option>
                    <option value="profile_update">🏢 प्रोफाइल (Profile)</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Export CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>CSV निर्यात</span>
                  </button>
                </div>
              </div>

              {/* Logs Table */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 max-h-[400px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-bold text-[11px] uppercase border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">कृती (Action)</th>
                      <th className="py-2.5 px-3">वर्णन (Description)</th>
                      <th className="py-2.5 px-3">तारीख व वेळ</th>
                      <th className="py-2.5 px-3">डिव्हाइस</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                          {log.action === 'download_poster' ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Download className="w-3.5 h-3.5" /> डाऊनलोड
                            </span>
                          ) : log.action === 'login' ? (
                            <span className="text-blue-400 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" /> लॉगिन
                            </span>
                          ) : (
                            <span className="text-amber-400 flex items-center gap-1">
                              <Activity className="w-3.5 h-3.5" /> {log.action}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <p className="font-semibold text-slate-200">{log.descriptionMarathi || log.description}</p>
                          {log.metadata?.templateTitle && (
                            <p className="text-[10px] text-slate-500 font-mono">पोस्टर: {log.metadata.templateTitle}</p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-400 whitespace-nowrap">
                          {log.device || 'Mobile App / Browser'}
                        </td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-slate-500">
                          कोणताही लॉग आढळला नाही.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">पासवर्ड बदला (Change Password)</h3>
                    <p className="text-xs text-slate-400">आपले खाते सुरक्षित ठेवण्यासाठी वेळोवेळी पासवर्ड बदला.</p>
                  </div>
                </div>

                {passError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passError}</span>
                  </div>
                )}

                {passSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{passSuccess}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">चालू पासवर्ड (Current Password) *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="आपला चालू पासवर्ड टाका"
                        className="w-full pl-9 pr-9 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                      >
                        {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">नवीन पासवर्ड (New Password) *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="किमान ८ अक्षरे, कॅपिटल, अंक व चिन्ह"
                        className="w-full pl-9 pr-9 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">नवीन पासवर्ड पुन्हा टाका (Confirm Password) *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        placeholder="तोच पासवर्ड पुन्हा टाका"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl transition-all shadow-md mt-2 cursor-pointer"
                  >
                    पासवर्ड सेव्ह करा
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: SUBSCRIPTION, FREE POSTS & PAYMENT HISTORY */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    सबस्क्रिप्शन, कोटा व पेमेंट पडताळणी
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    तुमचा चालू प्लॅन, मोफत कोटा वापर, आणि UPI पेमेंट इतिहास तपासा.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadSubData}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
                    title="रिफ्रेश करा"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSub ? 'animate-spin' : ''}`} />
                    <span>रिफ्रेश</span>
                  </button>

                  {onOpenPricingModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPricingModal();
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>{subResolution?.isPaidActive ? 'प्लॅन अपग्रेड करा' : 'प्रीमियम प्लॅन निवडा'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1. Live Subscription Status Banner Card */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-slate-800 p-5 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold">सध्याचा प्लॅन:</span>
                      <h4 className="text-lg font-black text-white">
                        {subResolution?.planName || (currentUser.isPremium ? 'VIP Premium Plan' : 'Free Trial')}
                      </h4>

                      {/* Live Status Badge */}
                      {(() => {
                        const hasPending = myPayments.some((p) => p.status === 'pending');
                        const latestRejected = myPayments.find((p) => p.status === 'rejected');
                        const isPaid = subResolution?.isPaidActive || currentUser.isPremium;

                        if (hasPending) {
                          return (
                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
                              <Clock className="w-3.5 h-3.5" /> Pending Verification
                            </span>
                          );
                        }
                        if (isPaid) {
                          return (
                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
                              <Crown className="w-3.5 h-3.5 text-amber-400" /> Active Premium
                            </span>
                          );
                        }
                        if (subResolution?.subscription?.subscription_status === 'EXPIRED') {
                          return (
                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" /> Expired Plan
                            </span>
                          );
                        }
                        if (latestRejected) {
                          return (
                            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                              <X className="w-3.5 h-3.5" /> Verification Rejected
                            </span>
                          );
                        }
                        return (
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Free Plan
                          </span>
                        );
                      })()}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">अनुमती व्यवसाय</span>
                        <span className="text-white font-bold">
                          🏢 {subResolution?.subscription?.business_limit || (currentUser.isPremium ? 5 : 1)} व्यवसाय
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">सुरू दिनांक</span>
                        <span className="text-white font-bold">
                          {subResolution?.subscription?.start_date
                            ? new Date(subResolution.subscription.start_date).toLocaleDateString('mr-IN')
                            : 'मोफत खाते'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">मुदत संपण्याची तारीख</span>
                        <span className="text-amber-300 font-bold">
                          {subResolution?.isPaidActive && subResolution?.subscription?.expiry_date
                            ? new Date(subResolution.subscription.expiry_date).toLocaleDateString('mr-IN')
                            : 'अमर्यादित (Free)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">वॉटरमार्क स्थिती</span>
                        <span className="text-emerald-400 font-bold">
                          {subResolution?.isPaidActive
                            ? 'कोणताही वॉटरमार्क नाही ✓'
                            : '३ मोफत नंतर GROW VIEW'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Alert Banners: If Pending or Rejected */}
              {(() => {
                const pendingPayment = myPayments.find((p) => p.status === 'pending');
                const rejectedPayment = myPayments.find((p) => p.status === 'rejected');

                if (pendingPayment) {
                  return (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2">
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            पेमेंट पडताळणी प्रक्रियेत आहे (Pending Verification)
                          </h4>
                          <p className="text-slate-300 mt-0.5">
                            तुम्ही <strong>{pendingPayment.plan_name}</strong> प्लॅनसाठी ₹{pendingPayment.amount} भरले आहेत (UTR: <code className="text-amber-300 font-mono">{pendingPayment.transaction_id}</code>). आमची ॲडमिन टीम तुमचे पेमेंट तपासून प्लॅन ॲक्टिव्हेट करेल.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (rejectedPayment) {
                  return (
                    <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            पेमेंट पडताळणी नाकारली (Verification Rejected)
                          </h4>
                          <p className="text-rose-300 mt-0.5">
                            कारण: <strong>{rejectedPayment.admin_notes || 'Transaction ID / Screenshot could not be verified'}</strong>. कृपया पुन्हा योग्य UTR नंबर व स्क्रीनशॉट सबमिट करा.
                          </p>
                        </div>
                      </div>
                      {onOpenPricingModal && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenPricingModal();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shrink-0 shadow-sm"
                        >
                          पुन्हा सबमिट करा
                        </button>
                      )}
                    </div>
                  );
                }

                return null;
              })()}

              {/* 2. Free Posts Counter & Progress Bar */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      दरमहा मोफत स्वच्छ पोस्टर्स कोटा
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {subResolution?.isPaidActive
                        ? 'प्रीमियम सदस्यांसाठी अमर्यादित स्वच्छ HD पोस्टर्स उपलब्ध आहेत.'
                        : 'मोफत प्लॅनवर दरमहा ३ स्वच्छ HD पोस्टर्स मिळतात. ३ पूर्ण झाल्यावर वॉटरमार्क लागू होतो.'}
                    </p>
                  </div>

                  <span className="text-xs font-black text-amber-400">
                    {subResolution?.isPaidActive
                      ? 'अमर्यादित (Unlimited)'
                      : `${Math.max(0, 3 - (subResolution?.freePostersLeft ?? 3))} / ३ वापरले`}
                  </span>
                </div>

                {!subResolution?.isPaidActive && (
                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          (subResolution?.freePostersLeft ?? 3) === 0
                            ? 'bg-rose-500'
                            : (subResolution?.freePostersLeft ?? 3) === 1
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, ((3 - Math.min(3, subResolution?.freePostersLeft ?? 3)) / 3) * 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>
                        बाकी स्वच्छ पोस्टर्स: <strong>{subResolution?.freePostersLeft ?? 3}</strong>
                      </span>
                      <span className="text-slate-500">
                        दरमहा १ तारखेला आपोआप रीसेट होते.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Payment Verification History Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                    पेमेंट पडताळणी इतिहास (Payment History)
                  </h4>
                  <span className="text-xs text-slate-500">{myPayments.length} रेकॉर्ड्स</span>
                </div>

                {myPayments.length === 0 ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
                    <QrCode className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-300">अद्याप कोणतेही पेमेंट सबमिट केलेले नाही</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      UPI किंवा QR कोडद्वारे प्लॅन खरेदी केल्यावर, तुमचे पडताळणी रेकॉर्ड येथे दिसेल.
                    </p>
                    {onOpenPricingModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenPricingModal();
                        }}
                        className="px-4 py-2 mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl"
                      >
                        प्लॅन निवडा व पेमेंट करा
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase text-slate-400">
                          <tr>
                            <th className="py-3 px-4">तारीख</th>
                            <th className="py-3 px-4">प्लॅन</th>
                            <th className="py-3 px-4">रक्कम</th>
                            <th className="py-3 px-4">Transaction ID / UTR</th>
                            <th className="py-3 px-4">स्क्रीनशॉट</th>
                            <th className="py-3 px-4">स्थिती</th>
                            <th className="py-3 px-4 text-right">कृती</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {myPayments.map((p) => {
                            const isPending = p.status === 'pending';
                            const isApproved = p.status === 'approved';
                            const isRejected = p.status === 'rejected';

                            return (
                              <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                                <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                                  {new Date(p.submitted_at).toLocaleDateString('mr-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </td>
                                <td className="py-3 px-4 font-bold text-white">
                                  {p.plan_name}
                                  <span className="text-[10px] text-slate-500 block font-normal">
                                    {p.billing_cycle === 'yearly' ? 'वार्षिक' : 'मासिक'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-black text-amber-300">
                                  ₹{p.amount}
                                </td>
                                <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                                  {p.transaction_id}
                                </td>
                                <td className="py-3 px-4">
                                  {p.screenshot_url ? (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedProofPayment(p)}
                                      className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 hover:border-amber-400 transition-all cursor-pointer relative group"
                                      title="स्क्रीनशॉट पहा"
                                    >
                                      <img
                                        src={p.screenshot_url}
                                        alt="Proof"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                        <Eye className="w-3 h-3 text-white" />
                                      </div>
                                    </button>
                                  ) : (
                                    <span className="text-slate-500 text-[10px]">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  {isPending && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                                      पडताळणी बाकी
                                    </span>
                                  )}
                                  {isApproved && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      मंजूर ✓
                                    </span>
                                  )}
                                  {isRejected && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                      नाकारले
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {isRejected && onOpenPricingModal && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onClose();
                                        onOpenPricingModal();
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                                    >
                                      पुन्हा अर्ज करा
                                    </button>
                                  )}
                                  {p.screenshot_url && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedProofPayment(p)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs ml-1"
                                    >
                                      तपासा
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Screenshot Proof Preview Modal */}
        {selectedProofPayment && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  पेमेंट स्क्रीनशॉट पुरावा
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedProofPayment(null)}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-[60vh] flex items-center justify-center">
                <img
                  src={selectedProofPayment.screenshot_url}
                  alt="Payment Proof"
                  className="max-h-[58vh] w-auto object-contain"
                />
              </div>

              <div className="text-xs text-slate-300 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <p><strong>प्लॅन:</strong> {selectedProofPayment.plan_name} (₹{selectedProofPayment.amount})</p>
                <p><strong>Transaction ID:</strong> <code className="text-amber-300 font-mono">{selectedProofPayment.transaction_id}</code></p>
                <p><strong>स्थिती:</strong> <span className="uppercase font-bold">{selectedProofPayment.status}</span></p>
                {selectedProofPayment.admin_notes && (
                  <p className="text-rose-300"><strong>ॲडमिन शेरा:</strong> {selectedProofPayment.admin_notes}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedProofPayment(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  बंद करा
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

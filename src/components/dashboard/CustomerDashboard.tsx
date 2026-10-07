import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  PosterTemplate,
  CategoryInfo,
  BusinessProfile,
  UserSubscriptionResolution,
  PaymentVerificationRecord,
} from '../../types';
import {
  fetchSubscriptionStatus,
  fetchMyPaymentHistory,
} from '../../services/subscriptionService';
import {
  Sparkles,
  Plus,
  Flame,
  Calendar,
  Building2,
  Image as ImageIcon,
  Edit3,
  User,
  LogOut,
  ChevronRight,
  Download,
  Share2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Crown,
  Clock,
  AlertCircle,
  IndianRupee,
  QrCode,
  RefreshCw,
  Eye,
  Copy,
  CheckCheck,
  X,
} from 'lucide-react';

interface CustomerDashboardProps {
  currentUser: UserAccount;
  activeProfile: BusinessProfile;
  templates: PosterTemplate[];
  categories: CategoryInfo[];
  onOpenStudio: (template?: PosterTemplate) => void;
  onOpenProfileModal: () => void;
  onLogout: () => void;
  onOpenPricingModal?: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  activeProfile,
  templates,
  categories,
  onOpenStudio,
  onOpenProfileModal,
  onLogout,
  onOpenPricingModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
      console.warn('Failed to load subscription status in CustomerDashboard:', err);
    } finally {
      setIsLoadingSub(false);
    }
  };

  useEffect(() => {
    loadSubData();
  }, [currentUser]);

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategory === 'all') return true;
    return tpl.category === selectedCategory;
  });

  const festivalTemplates = templates.filter(
    (t) => t.category === 'festivals' || t.category === 'shivjayanti' || t.category === 'ganeshotsav' || t.category === 'diwali'
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black text-white font-['Outfit']">
                  Grow<span className="text-amber-400">Vies</span>
                </span>
                <span className="ml-2 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Customer Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenStudio()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Create Poster
              </button>

              <button
                onClick={onOpenProfileModal}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                title="Edit Business Profile"
              >
                <User className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Business Profile Card */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active Business Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Welcome back, {currentUser.name || activeProfile.name || 'Creator'}!
            </h1>
            <p className="text-sm text-slate-400">
              {activeProfile.name ? `🏢 ${activeProfile.name}` : 'Setup your business profile to enable 1-click branding on all posters.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenPricingModal && (
              <button
                onClick={onOpenPricingModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 text-slate-950" />
                <span>{subResolution?.isPaidActive ? 'अपग्रेड प्लॅन' : 'VIP प्रीमियम मिळवा'}</span>
              </button>
            )}
            <button
              onClick={onOpenProfileModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Business Profile</span>
            </button>
            <button
              onClick={() => onOpenStudio()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Poster Studio</span>
            </button>
          </div>
        </div>

        {/* Live Subscription, Free Posts Quota & Payment Verification Card */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  सबस्क्रिप्शन व मोफत कोटा स्थिती (Plan & Quota Status)
                </h2>

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
                        <X className="w-3.5 h-3.5" /> Rejected
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
              <p className="text-xs text-slate-400">
                तुमचे लाइव्ह खाते सदस्यत्व, मासिक मोफत पोस्टर्स कोटा आणि सर्व पडताळणी रेकॉर्ड्स.
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
                <span className="hidden sm:inline">रिफ्रेश</span>
              </button>
              {onOpenPricingModal && (
                <button
                  type="button"
                  onClick={onOpenPricingModal}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>प्रीमियम अपग्रेड करा</span>
                </button>
              )}
            </div>
          </div>

          {/* Pending or Rejected Alert Notice */}
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
                      <p className="text-slate-300 mt-0.5 leading-relaxed">
                        तुम्ही <strong>{pendingPayment.plan_name}</strong> प्लॅनसाठी ₹{pendingPayment.amount} भरले आहेत (UTR: <code className="text-amber-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">{pendingPayment.transaction_id}</code>). ॲडमिन मंजुरीनंतर तुमचा प्लॅन व वॉटरमार्क काढणे तात्काळ सुरू होईल.
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
                        पेमेंट पडताळणी नाकारली गेली (Verification Rejected)
                      </h4>
                      <p className="text-rose-300 mt-0.5">
                        कारण: <strong>{rejectedPayment.admin_notes || 'Transaction ID or screenshot could not be verified'}</strong>. कृपया पुन्हा योग्य माहिती सबमिट करा.
                      </p>
                    </div>
                  </div>
                  {onOpenPricingModal && (
                    <button
                      type="button"
                      onClick={onOpenPricingModal}
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

          {/* Grid: Plan Specs & Free Quota Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Current Plan Details */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                प्लॅन तपशील (Plan Details)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-black text-white">
                  {subResolution?.planName || (currentUser.isPremium ? 'VIP Premium Plan' : 'Free Trial')}
                </span>
                <span className="text-xs text-amber-400 font-bold">
                  {subResolution?.isPaidActive ? 'अमर्यादित ॲक्सेस' : '३ मोफत/महिना'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[10px]">अनुमती व्यवसाय</span>
                  <span className="text-white font-bold">
                    🏢 {subResolution?.subscription?.business_limit || (currentUser.isPremium ? 5 : 1)} बिझनेस
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">मुदत समाप्ती</span>
                  <span className="text-amber-300 font-bold">
                    {subResolution?.isPaidActive && subResolution?.subscription?.expiry_date
                      ? new Date(subResolution.subscription.expiry_date).toLocaleDateString('mr-IN')
                      : 'Free'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Free Posts Quota & Counter */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  दरमहा मोफत स्वच्छ HD पोस्टर्स कोटा
                </span>
                <span className="text-xs font-black text-amber-400">
                  {subResolution?.isPaidActive
                    ? 'अमर्यादित (Unlimited)'
                    : `${Math.max(0, 5 - (subResolution?.freePostersLeft ?? 5))} / 5 Free Posts Used`}
                </span>
              </div>

              {subResolution?.isPaidActive ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>कोणताही वॉटरमार्क नाही • अमर्यादित HD डाऊनलोड्स ॲक्टिव्ह</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        (subResolution?.freePostersLeft ?? 5) === 0
                          ? 'bg-rose-500'
                          : (subResolution?.freePostersLeft ?? 5) <= 2
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, ((5 - Math.min(5, subResolution?.freePostersLeft ?? 5)) / 5) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      बाकी स्वच्छ पोस्टर्स: <strong>{subResolution?.freePostersLeft ?? 5}</strong> / 5
                    </span>
                    <span className="text-slate-500">
                      रीसेट तारीख: दरमहा १ तारखेला (Monthly Reset)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment History Table (if payments exist) */}
          {myPayments.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  पेमेंट पडताळणी इतिहास (Payment History)
                </h3>
                <span className="text-xs text-slate-500">{myPayments.length} रेकॉर्ड्स</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 border-b border-slate-800 text-[10px] uppercase text-slate-400">
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
                                  onClick={onOpenPricingModal}
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
            </div>
          )}
        </div>

        {/* Screenshot Proof Preview Modal for CustomerDashboard */}
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

        {/* Grand Festival Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900 border border-amber-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full">
              <Flame className="w-3.5 h-3.5" />
              <span>UPCOMING GRAND FESTIVAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              Chhatrapati Shivaji Maharaj Jayanti Special
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Ready-made Marathi and English festival banners with automated business footer frames.
            </p>
          </div>

          <button
            onClick={() => {
              if (festivalTemplates.length > 0) {
                onOpenStudio(festivalTemplates[0]);
              } else {
                onOpenStudio();
              }
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md whitespace-nowrap flex items-center gap-2"
          >
            <span>Create Shivjayanti Poster</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Scroller */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-['Outfit']">Categories</h2>
            <span className="text-xs text-slate-400">{categories.length} Total</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              🌟 All Templates
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{cat.icon || '📁'}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-['Outfit']">Poster Templates</h2>
            <span className="text-xs text-slate-400">{filteredTemplates.length} Available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredTemplates.map((template) => {
              const previewImg =
                (template as any).thumbnailUrl ||
                template.imageUrl ||
                template.customBgUrl ||
                (template as any).background?.url;

              return (
                <div
                  key={template.id}
                  onClick={() => onOpenStudio(template)}
                  className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 overflow-hidden shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="aspect-square relative bg-slate-950">
                    {previewImg ? (
                      <img
                        src={previewImg}
                        alt={template.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${
                          template.theme?.bgGradient || 'from-amber-950 via-slate-900 to-orange-950'
                        } flex flex-col items-center justify-center p-3 text-center`}
                      >
                        <h4 className="text-xs font-bold text-white line-clamp-2">
                          {template.headline || template.title}
                        </h4>
                        <span className="text-[9px] text-amber-300 mt-1 uppercase">
                          {template.category}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                      <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1">
                        <Edit3 className="w-3.5 h-3.5" /> Customize
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                      {template.title}
                    </h3>
                    <span className="text-[10px] text-slate-500">{template.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

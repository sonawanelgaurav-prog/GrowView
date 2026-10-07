import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Crown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Building,
  Star,
  Check,
  CreditCard,
  QrCode,
  Smartphone,
  Users,
  AlertCircle,
  Clock,
  ArrowRight,
  Send,
  Loader2,
  ChevronRight,
  Flame,
  Copy,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  CheckCheck,
  Phone,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlanId, UserAccount, BusinessProfile, PlanConfig, AdminPaymentSettings, PaymentVerificationRecord } from '../../types';
import { STANDARD_PLANS } from '../../config/plansConfig';
import {
  fetchSubscriptionStatus,
  createPaymentOrder,
  verifyPaymentServerSide,
  submitTeamLead,
  fetchAvailablePlans,
  UserSubscriptionResolution,
  fetchPaymentSettings,
  submitPaymentVerification,
} from '../../services/subscriptionService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  profiles?: BusinessProfile[];
  onSubscriptionUpdated?: () => void;
  initialSelectedPlan?: PlanId;
  onOpenTeamModal?: () => void;
  onOpenAuthModal?: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  profiles = [],
  onSubscriptionUpdated,
  initialSelectedPlan = 'starter-yearly',
  onOpenTeamModal,
  onOpenAuthModal,
}) => {
  const [billingTab, setBillingTab] = useState<'all' | 'monthly' | 'yearly'>('all');
  const [subResolution, setSubResolution] = useState<UserSubscriptionResolution | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [activePlans, setActivePlans] = useState<PlanConfig[]>(STANDARD_PLANS);

  // Admin Configured UPI Payment Settings (Dynamically Loaded)
  const [paymentSettings, setPaymentSettings] = useState<AdminPaymentSettings | null>(null);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);

  // Checkout & Payment Verification State
  const [checkoutPlanId, setCheckoutPlanId] = useState<PlanId | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState<boolean>(false);
  const [submittedPayment, setSubmittedPayment] = useState<PaymentVerificationRecord | null>(null);

  // Payment Verification Form Fields
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<string | null>(null);

  // Legacy Approval data backward compatibility
  const [pendingApprovalData, setPendingApprovalData] = useState<{
    planName: string;
    price: string;
    orderId: string;
    paymentId: string;
    paymentMethod: string;
    requestedAt: string;
  } | null>(null);

  // Team Lead Contact Form State
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [leadForm, setLeadForm] = useState({
    name: currentUser?.name || '',
    companyName: currentUser?.businessName || '',
    mobileNumber: currentUser?.phone || '',
    email: currentUser?.email || '',
    teamMembersCount: '10-20',
    businessesCount: '5',
    requirements: '',
    message: '',
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);
  const [leadSuccessMessage, setLeadSuccessMessage] = useState<string | null>(null);

  // Load live subscription status and payment settings from server
  const loadStatus = async () => {
    if (!currentUser) return;
    setIsLoadingStatus(true);
    try {
      const res = await fetchSubscriptionStatus(currentUser.id, currentUser.email);
      setSubResolution(res);
    } catch (err) {
      console.warn('Failed to load subscription status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const loadPaymentSettings = async () => {
    try {
      const settings = await fetchPaymentSettings();
      setPaymentSettings(settings);
    } catch (err) {
      console.warn('Failed to load payment settings, using defaults:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
      loadPaymentSettings();
      fetchAvailablePlans().then((plans) => {
        if (plans && plans.length > 0) {
          setActivePlans(plans);
        }
      });
      setCheckoutError(null);
      setSubmittedPayment(null);
      setCopiedUpi(false);

      // Pre-fill user data
      if (currentUser) {
        setCustomerName(currentUser.name || '');
        setCustomerEmail(currentUser.email || '');
        setCustomerPhone(currentUser.phone || '');
        setBusinessName(profiles[0]?.name || currentUser.businessName || '');
      }

      if (initialSelectedPlan && initialSelectedPlan !== 'free') {
        setCheckoutPlanId(initialSelectedPlan);
      } else {
        setCheckoutPlanId(null);
      }
      setIsContactModalOpen(false);
      setLeadSuccessMessage(null);
    }
  }, [isOpen, currentUser, initialSelectedPlan, profiles]);

  if (!isOpen) return null;

  // Derive cards from active plans configuration (Centralized source of truth)
  const PRICING_CARDS = activePlans.map((p) => {
    const isFree = p.billing_cycle === 'free';
    return {
      id: p.plan_id as PlanId,
      name: p.plan_name,
      nameMarathi: p.nameMarathi || (isFree ? 'मोफत स्टार्टर प्लॅन' : p.plan_name),
      price: isFree ? '₹0' : `₹${p.price}`,
      numericPrice: p.price,
      origPrice: p.originalPrice ? `₹${p.originalPrice}` : undefined,
      period: p.periodLabel
        ? `${p.periodLabel}${p.periodLabelMarathi ? ` (${p.periodLabelMarathi})` : ''}`
        : isFree
        ? 'कायम मोफत (Forever Free)'
        : p.billing_cycle === 'monthly'
        ? '/ महिना'
        : '/ वर्ष',
      cycle: p.billing_cycle,
      businessLimit: p.business_limit,
      businessLimitText:
        p.business_limit === 1
          ? '१ बिझनेस प्रोफाईल (1 Brand)'
          : `${p.business_limit} बिझनेस प्रोफाईल्स (Up to ${p.business_limit} Brands)`,
      watermarkHighlight:
        p.watermark_status === 'NO_WATERMARK'
          ? 'कोणताही वॉटरमार्क नाही (NO GROW VIEW WATERMARK)'
          : '३ वॉटरमार्क-फ्री पोस्टर्स दरमहा',
      badge: p.badge || (p.is_popular ? 'सर्वात लोकप्रिय' : isFree ? 'मोफत कोटा' : undefined),
      isPopular: !!p.is_popular,
      features: p.features,
      ctaText: p.button_text || (isFree ? 'सध्याचा प्लॅन' : `आता खरेदी करा (₹${p.price})`),
      ctaDisabled: isFree,
    };
  });

  const filteredCards = PRICING_CARDS.filter((card) => {
    if (billingTab === 'all') return true;
    if (billingTab === 'monthly') return card.cycle === 'monthly' || card.cycle === 'free';
    if (billingTab === 'yearly') return card.cycle === 'yearly' || card.cycle === 'free';
    return true;
  });

  // Handle Checkout Start
  const handleStartCheckout = (planId: PlanId) => {
    if (planId === 'free') return;
    if (!currentUser && onOpenAuthModal) {
      onOpenAuthModal();
      return;
    }
    setCheckoutError(null);
    setUtrNumber('');
    setScreenshotUrl('');
    setScreenshotPreview(null);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setSubmittedPayment(null);
    setCheckoutPlanId(planId);
  };

  const handleCopyUpiId = (idToCopy: string) => {
    if (!idToCopy) return;
    navigator.clipboard.writeText(idToCopy);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setCheckoutError('कृपया केवळ JPG, JPEG, PNG किंवा WebP फॉरमॅटमधील स्क्रीनशॉट अपलोड करा.');
      return;
    }

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setCheckoutError('स्क्रीनशॉट फाईल ५ MB पेक्षा लहान असावी.');
      return;
    }

    setCheckoutError(null);
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      setScreenshotPreview(dataUrl);
      setScreenshotUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Submit Payment for Verification Form
  const handleSubmitPaymentVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !checkoutPlanId) return;

    const planToBuy = PRICING_CARDS.find((p) => p.id === checkoutPlanId);
    if (!planToBuy) return;

    if (!utrNumber || !utrNumber.trim()) {
      setCheckoutError('कृपया UPI Transaction ID / UTR नंबर टाका.');
      return;
    }

    if (!screenshotUrl || !screenshotUrl.trim()) {
      setCheckoutError('कृपया पेमेंटचा स्क्रीनशॉट अपलोड करा.');
      return;
    }

    setIsSubmittingVerification(true);
    setCheckoutError(null);

    try {
      const res = await submitPaymentVerification({
        planId: checkoutPlanId,
        amount: planToBuy.numericPrice,
        transactionId: utrNumber.trim().toUpperCase(),
        screenshotUrl: screenshotUrl.trim(),
        paymentDate,
        customerName: customerName.trim() || currentUser.name || 'ग्राहक',
        customerEmail: customerEmail.trim() || currentUser.email || '',
        customerPhone: customerPhone.trim() || currentUser.phone || '',
        businessName: businessName.trim() || profiles[0]?.name || currentUser.businessName || '',
      });

      // Celebration effect
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      setSubmittedPayment(res.payment);
      setCheckoutPlanId(null);
      await loadStatus();
      onSubscriptionUpdated?.();
    } catch (err: any) {
      console.error('Payment verification submission error:', err);
      setCheckoutError(err.message || 'पेमेंट पडताळणी सबमिट करताना अडचण आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmittingVerification(false);
    }
  };


  // Handle Team Lead Submission
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.mobileNumber || !leadForm.email) {
      alert('कृपया नाव, मोबाईल नंबर व ईमेल भरा.');
      return;
    }

    setIsSubmittingLead(true);
    try {
      await submitTeamLead(leadForm);
      setLeadSuccessMessage('आपली चौकशी नोंदवण्यात आली आहे! आमची ग्रो व्ह्यू बिझनेस टीम पुढील २ तासांत आपल्याशी संपर्क साधेल.');
      setTimeout(() => {
        setIsContactModalOpen(false);
        setLeadSuccessMessage(null);
      }, 3500);
    } catch (err: any) {
      alert(err.message || 'चौकशी पाठवताना त्रुटी आली.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const selectedCheckoutPlan = PRICING_CARDS.find((p) => p.id === checkoutPlanId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-6xl max-h-[96vh] flex flex-col shadow-2xl text-white relative my-auto overflow-hidden">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 p-5 sm:p-6 text-slate-950 relative shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-xl shrink-0">
              <Crown className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-black/20 text-slate-950 px-2.5 py-0.5 rounded-full">
                  ★ GROW VIEW OFFICIAL SUBSCRIPTIONS ★
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5 tracking-tight">
                पारदर्शक किंमती • व्यवसाय व सण ब्रँडिंग प्लॅन्स
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-slate-950 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {paymentSuccessToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/40 p-4 text-emerald-300 flex items-center gap-3 text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{paymentSuccessToast}</span>
          </div>
        )}

        {/* Pending Approval Notice Banner */}
        {(subResolution?.hasPendingApproval || subResolution?.subscription?.subscription_status === 'PENDING_APPROVAL') && (
          <div className="bg-amber-500/15 border-b border-amber-500/40 p-4 text-amber-300 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold animate-in fade-in">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 shrink-0 text-amber-400 animate-pulse" />
              <div>
                <span className="font-bold text-white block sm:inline">
                  ⏳ ॲडमिन मंजुरीची प्रतीक्षा (Pending Admin Approval):{' '}
                </span>
                <span>
                  आपली "{subResolution?.subscription?.plan_name}" सबस्क्रिप्शन विनंती ॲडमिन कडे मंजुरीसाठी प्रलंबित आहे. ॲडमिनने ॲप्रूव्ह केल्यावर वॉटरमार्क काढला जाईल आणि प्लॅन त्वरित सक्रिय होईल.
                </span>
              </div>
            </div>
            <span className="shrink-0 text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
              PENDING APPROVAL
            </span>
          </div>
        )}

        {/* Active Account Status Bar */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>वापरकर्ता:</span>
              <span className="font-bold text-white">{currentUser?.name || 'ग्राहक'}</span>
            </div>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-slate-400">सध्याचा प्लॅन:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[11px] ${
                  subResolution?.isPaidActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {subResolution?.isPaidActive
                  ? subResolution.subscription.plan_name
                  : 'मोफत प्लॅन (Free Plan)'}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">वॉटरमार्क स्थिती:</span>
              <span
                className={`font-semibold ${
                  subResolution?.needsWatermark ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {subResolution?.needsWatermark
                  ? '⚠️ मर्यादा संपली (GROW VIEW वॉटरमार्क लागू)'
                  : subResolution?.isPaidActive
                  ? '✅ वॉटरमार्क-फ्री (VIP ॲक्सेस)'
                  : `✨ ${subResolution?.freePostersLeft} मोफत स्वच्छ पोस्टर्स शिल्लक`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-slate-400">
              मर्यादा:{' '}
              <span className="text-amber-300 font-bold">
                {profiles.length} / {subResolution?.businessLimit || 1} ब्रँड्स
              </span>
            </div>
            {onOpenTeamModal && subResolution?.isPaidActive && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTeamModal();
                }}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                टीम व्यवस्थापन
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          {/* Billing Cycle Tabs Filter */}
          <div className="flex justify-center">
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 inline-flex shadow-inner">
              <button
                type="button"
                onClick={() => setBillingTab('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  billingTab === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                सर्व प्लॅन्स (All Plans)
              </button>
              <button
                type="button"
                onClick={() => setBillingTab('monthly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  billingTab === 'monthly'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                मासिक (Monthly)
              </button>
              <button
                type="button"
                onClick={() => setBillingTab('yearly')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  billingTab === 'yearly'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>वार्षिक (Yearly)</span>
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  ६५% बचत
                </span>
              </button>
            </div>
          </div>

          {/* Section 1-5: The 5 Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
            {filteredCards.map((plan) => {
              const isCurrent =
                (plan.id === 'free' && !subResolution?.isPaidActive) ||
                (subResolution?.isPaidActive && subResolution?.subscription.plan_id === plan.id);

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl flex flex-col justify-between transition-all relative overflow-hidden ${
                    plan.isPopular
                      ? 'bg-gradient-to-b from-slate-900 to-amber-950/40 border-2 border-amber-500 shadow-xl shadow-amber-500/10'
                      : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className={`text-[10px] font-black uppercase tracking-wider text-center py-1 px-3 ${
                        plan.isPopular
                          ? 'bg-amber-500 text-slate-950'
                          : plan.id === 'free'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-orange-600 text-white'
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    {/* Title & Subtitle */}
                    <h3 className="text-base font-extrabold text-white">{plan.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">{plan.nameMarathi}</p>

                    {/* Price Block */}
                    <div className="mt-4 mb-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black tracking-tight text-white">{plan.price}</span>
                        {plan.origPrice && (
                          <span className="text-xs text-slate-500 line-through">{plan.origPrice}</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{plan.period}</span>
                    </div>

                    {/* Primary Highlight Badges */}
                    <div className="space-y-1.5 my-3">
                      <div
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                          plan.watermarkHighlight.includes('NO WATERMARK')
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{plan.watermarkHighlight}</span>
                      </div>
                      <div className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span>{plan.businessLimitText}</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mt-2 space-y-2 flex-1 border-t border-slate-800/80 pt-3">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action CTA Button */}
                    <div className="mt-5 pt-3 border-t border-slate-800/80">
                      {isCurrent ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-default"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          सध्या सक्रिय आहे
                        </button>
                      ) : plan.id === 'free' ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-default"
                        >
                          कायमस्वरूपी मोफत
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartCheckout(plan.id)}
                          className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
                            plan.isPopular
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                              : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          {plan.ctaText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 6: BUSINESS / TEAM - CUSTOM PRICING CARD */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 border border-amber-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" />
                  विभाग ६ • बिझनेस / टीम ॲक्सेस (१०-२०+ सदस्य)
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  आपल्या संपूर्ण टीम किंवा संस्थेसाठी GROW VIEW हवे आहे का?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  १० ते २०+ कर्मचारी किंवा शाखा असणाऱ्या बँका, पतसंस्था, एजन्सी, राजकीय नेते व संस्थांसाठी कस्टम
                  पॅकेजेस उपलब्ध आहेत. मालक/ॲडमिन सर्व सदस्यांना नियंत्रित करू शकतात.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-amber-300 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> १०, १५, २०+ स्वतंत्र लॉगिन खाती
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ओनर/ॲडमिन रोल कंट्रोल
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> संपूर्ण सानुकूल ब्रँडिंग
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  संपर्क करा (CONTACT US)
                </button>
                <span className="text-[11px] text-slate-400">
                  २ तासांत कस्टम कोटेशन व मोफत डेमो उपलब्ध
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 text-center text-xs text-slate-400 shrink-0">
          🔒 १००% सुरक्षित पेमेंट • UPI, Google Pay, PhonePe, Paytm, क्रेडिट/डेबिट कार्ड स्वीकारले जातात.
        </div>
      </div>

      {/* ======================================================== */}
      {/* STEP 2 & 3: MANUAL UPI PAYMENT & VERIFICATION FORM MODAL  */}
      {/* ======================================================== */}
      {checkoutPlanId && selectedCheckoutPlan && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl text-white relative my-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 sm:p-6 text-slate-950 flex items-center justify-between sticky top-0 z-20 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                    पायरी २ • UPI व QR कोड पेमेंट
                  </span>
                  <h3 className="text-lg sm:text-xl font-black mt-0.5">
                    Complete Payment — {selectedCheckoutPlan.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutPlanId(null)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-slate-950 transition-colors"
                title="बंद करा"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">निवडलेला प्लॅन:</span>
                  <span className="font-bold text-white text-base flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    {selectedCheckoutPlan.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 block text-[11px]">कालावधी / व्हॅलिडिटी:</span>
                    <span className="font-semibold text-slate-200">
                      {selectedCheckoutPlan.cycle === 'yearly' ? '१ वर्ष (365 दिवस)' : '१ महिना (30 दिवस)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">बिझनेस मर्यादा:</span>
                    <span className="font-semibold text-amber-300">
                      {selectedCheckoutPlan.businessLimitText}
                    </span>
                  </div>
                </div>
                <div className="border-t border-slate-800/80 pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs text-slate-400 block">एकूण देय रक्कम (Payable Amount):</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-400">{selectedCheckoutPlan.price}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    ✓ NO WATERMARK • HD EXPORT
                  </span>
                </div>
              </div>

              {/* Prominent UPI ID & QR Code Section (Req 1 & 2) */}
              <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-950 rounded-2xl p-4 sm:p-5 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                    UPI किंवा QR कोड स्कॅन करून पैसे भरा
                  </h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Pay <strong>{selectedCheckoutPlan.price}</strong> using the UPI ID or scan the QR code below using any UPI app (Google Pay, PhonePe, Paytm, BHIM, CRED).
                </p>

                {/* QR Code & UPI Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* QR Code Box */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-44 h-44 bg-white rounded-xl p-2.5 flex items-center justify-center shadow-xl ring-2 ring-amber-500/40">
                      <img
                        src={
                          paymentSettings?.qrCodeUrl ||
                          `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                            `upi://pay?pa=${paymentSettings?.upiId || 'growview@upi'}&pn=${encodeURIComponent(
                              paymentSettings?.upiName || 'GrowView'
                            )}&am=${selectedCheckoutPlan.numericPrice}&cu=INR`
                          )}`
                        }
                        alt="GrowView UPI QR Code"
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mt-1">
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      स्कॅन करून ₹{selectedCheckoutPlan.numericPrice} भरा
                    </span>
                  </div>

                  {/* UPI ID & Instructions Box */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        GrowView अधिकृत UPI आयडी:
                      </label>
                      <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-amber-500/40">
                        <span className="font-mono text-sm sm:text-base font-black text-amber-300 flex-1 truncate">
                          {paymentSettings?.upiId || 'growview@upi'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyUpiId(paymentSettings?.upiId || 'growview@upi')}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm"
                        >
                          {copiedUpi ? (
                            <>
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy UPI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {paymentSettings?.upiName && (
                      <div className="text-xs text-slate-400">
                        व्यावसायिक नाव: <strong className="text-slate-200">{paymentSettings.upiName}</strong>
                      </div>
                    )}

                    {paymentSettings?.instructions && (
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                        <span className="text-amber-400 font-bold block mb-0.5">सूचना:</span>
                        {paymentSettings.instructions}
                      </div>
                    )}

                    {paymentSettings?.supportPhone && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>काही अडचण आल्यास संपर्क: <a href={`tel:${paymentSettings.supportPhone}`} className="text-amber-300 underline font-bold">{paymentSettings.supportPhone}</a></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 3: TRANSACTION DETAILS SUBMISSION FORM (Req 3) */}
              <form onSubmit={handleSubmitPaymentVerification} className="space-y-4 pt-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Payment Verification Form (पेमेंट पडताळणी फॉर्म)
                    </h4>
                  </div>
                  <span className="text-[11px] text-amber-300 font-medium">सर्व माहिती अचूक भरा *</span>
                </div>

                {/* Auto-populated Plan & Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">निवडलेला प्लॅन (Selected Plan)</label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={selectedCheckoutPlan.name}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-amber-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">रक्कम (Amount)</label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={selectedCheckoutPlan.price}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* UPI Transaction ID / UTR Number (REQUIRED) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                    <span>UPI Transaction ID / UTR Number * (Required)</span>
                    <span className="text-[10px] text-slate-400 font-normal">उदा. १२ अंकी UTR क्रमांक</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
                    placeholder="उदा. 428192039182 किंवा UPI/428192039182"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/50 text-white font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                  <p className="text-[10px] text-slate-400">
                    पेमेंट ॲपमधील १२ अंकी UTR नंबर किंवा ट्रान्झॅक्शन आयडी येथे टाका.
                  </p>
                </div>

                {/* Payment Screenshot Upload (REQUIRED) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                    <span>Payment Screenshot * (Required)</span>
                    <span className="text-[10px] text-slate-400 font-normal">JPG, JPEG, PNG, WebP (Max 5MB)</span>
                  </label>

                  <div className="bg-slate-950 rounded-2xl border border-dashed border-slate-700 hover:border-amber-500/50 p-4 transition-colors">
                    {screenshotPreview ? (
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                          <img
                            src={screenshotPreview}
                            alt="Payment Proof"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1 text-center sm:text-left flex-1">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> स्क्रीनशॉट जोडला गेला
                          </span>
                          <p className="text-[11px] text-slate-400">
                            पडताळणीसाठी स्क्रीनशॉट तयार आहे. बदलण्यासाठी खालील बटण वापरा.
                          </p>
                          <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
                            >
                              दुसरा स्क्रीनशॉट निवडा
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setScreenshotPreview(null);
                                setScreenshotUrl('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium"
                            >
                              काढून टाका
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-3 space-y-2">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-xs text-slate-300">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-amber-400 font-bold hover:underline"
                          >
                            स्क्रीनशॉट फाईल निवडा
                          </button>{' '}
                          किंवा येथे ड्रॅग करा
                        </div>
                        <p className="text-[10px] text-slate-500">
                          GPay, PhonePe किंवा Paytm मधील यशस्वी पेमेंटचा स्क्रीनशॉट अपलोड करा.
                        </p>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleScreenshotFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Additional Auto-populated & Editable Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">पेमेंट तारीख (Payment Date)</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">ग्राहकाचे नाव (Customer Name)</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="आपले नाव"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">ईमेल / मोबाईल (Contact)</label>
                    <input
                      type="text"
                      value={customerEmail || customerPhone}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="ईमेल किंवा फोन"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">व्यवसायाचे नाव (Business Name)</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="आपल्या ब्रँडचे नाव"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Error Banner */}
                {checkoutError && (
                  <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Submit Button (Req 3 & 4: Submits for verification, does NOT activate directly) */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutPlanId(null)}
                    disabled={isSubmittingVerification}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition-colors"
                  >
                    रद्द करा (Cancel)
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingVerification}
                    className="flex-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                  >
                    {isSubmittingVerification ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        पडताळणी सबमिट होत आहे...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Submit Payment for Verification
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 9: CONTACT US FOR BUSINESS / TEAM MODAL FORM     */}
      {/* ======================================================== */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl text-white relative">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-slate-950 flex items-center justify-between sticky top-0 z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                  ★ बिझनेस व टीम पॅकेज चौकशी ★
                </span>
                <h3 className="text-xl font-black mt-1">१०-२०+ सदस्यांसाठी संपर्क फॉर्म</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-slate-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {leadSuccessMessage ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">धन्यवाद!</h4>
                <p className="text-sm text-slate-300">{leadSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitLead} className="p-6 space-y-4">
                <p className="text-xs text-slate-300">
                  कृपया खालील माहिती भरा. आमची टीम आपल्या गरजेनुसार योग्य टीम प्लॅन तयार करून लगेच संपर्क करेल.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">आपले नाव *</label>
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="उदा. विजयराव देशमुख"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">कंपनी / संस्थेचे नाव</label>
                    <input
                      type="text"
                      value={leadForm.companyName}
                      onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                      placeholder="उदा. देशमुख मल्टिस्टेट को-ऑप बँक"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">मोबाईल नंबर *</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.mobileNumber}
                      onChange={(e) => setLeadForm({ ...leadForm, mobileNumber: e.target.value })}
                      placeholder="उदा. +91 98224 88771"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">ईमेल पत्ता *</label>
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="उदा. deshmukh.bank@gmail.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">टीम सदस्यांची संख्या</label>
                    <select
                      value={leadForm.teamMembersCount}
                      onChange={(e) => setLeadForm({ ...leadForm, teamMembersCount: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="5-10">५ ते १० सदस्य</option>
                      <option value="10-20">१० ते २० सदस्य</option>
                      <option value="20-50">२० ते ५० सदस्य</option>
                      <option value="50+">५०+ सदस्य</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">बिझनेस / ब्रँड्स संख्या</label>
                    <select
                      value={leadForm.businessesCount}
                      onChange={(e) => setLeadForm({ ...leadForm, businessesCount: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="1-5">१ ते ५ ब्रँड्स</option>
                      <option value="5-10">५ ते १० ब्रँड्स</option>
                      <option value="10-20">१० ते २० ब्रँड्स</option>
                      <option value="20+">२०+ ब्रँड्स</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">प्रमुख गरजा (Requirements)</label>
                  <input
                    type="text"
                    value={leadForm.requirements}
                    onChange={(e) => setLeadForm({ ...leadForm, requirements: e.target.value })}
                    placeholder="उदा. दररोजचे सण, वाढदिवस, बँकिंग ऑफर्स व शाखांसाठी पोस्टर्स"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">संदेश / अतिरिक्त माहिती</label>
                  <textarea
                    rows={3}
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                    placeholder="आम्हाला संपूर्ण टीमसाठी ॲक्सेस हवा आहे. कृपया लवकरात लवकर संपर्क करा."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    रद्द करा
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                  >
                    {isSubmittingLead ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        पाठवत आहे...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        चौकशी पाठवा (Submit Inquiry)
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: PAYMENT STATUS — PENDING VERIFICATION MODAL       */}
      {/* ======================================================== */}
      {(submittedPayment || pendingApprovalData) && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white relative">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                    पायरी ४ • पेमेंट स्थिती (Payment Status)
                  </span>
                  <h3 className="text-lg font-black mt-0.5">Pending Verification</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmittedPayment(null);
                  setPendingApprovalData(null);
                  onClose();
                }}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-slate-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Prominent Required Message */}
              <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-4 text-xs sm:text-sm text-amber-100 leading-relaxed shadow-sm">
                <div className="font-bold text-amber-300 text-sm mb-1.5 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  Your payment has been submitted successfully.
                </div>
                <p className="text-slate-200 text-xs sm:text-sm">
                  Our admin will verify your payment and activate your plan.
                </p>
              </div>

              {/* Transaction details card (Req 4: Plan, Amount, Transaction ID, Submission date, Status) */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Plan:</span>
                  <span className="font-black text-amber-400 text-sm">
                    {submittedPayment?.plan_name || pendingApprovalData?.planName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-bold text-white text-sm">
                    {submittedPayment ? `₹${submittedPayment.amount}` : pendingApprovalData?.price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Transaction ID / UTR:</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {submittedPayment?.transaction_id || pendingApprovalData?.paymentId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Submission Date:</span>
                  <span className="text-slate-300 font-medium">
                    {submittedPayment
                      ? new Date(submittedPayment.submitted_at).toLocaleString('mr-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : pendingApprovalData?.requestedAt}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Status:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1.5 animate-pulse">
                    <Clock className="w-3.5 h-3.5" /> Pending Verification
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                💡 <strong>महत्त्वाची नोंद:</strong> ॲडमिन कडून UPI पडताळणी पूर्ण झाल्यावर आपला प्लॅन सक्रिय (Active) होईल व आपोआप वॉटरमार्क काढला जाईल. आपल्याला डॅशबोर्डमध्ये नोटीफिकेशन देखील मिळेल.
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmittedPayment(null);
                  setPendingApprovalData(null);
                  onClose();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-transform active:scale-95 cursor-pointer"
              >
                समजले — डॅशबोर्डवर परत जा (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

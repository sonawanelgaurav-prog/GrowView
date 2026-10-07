import React, { useState, useEffect } from 'react';
import {
  Crown,
  IndianRupee,
  CreditCard,
  Smartphone,
  QrCode,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Download,
  Calendar,
  Zap,
  Users,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  Check,
  Clock,
  Plus,
  ArrowUpRight,
  Send,
  Loader2,
  Edit,
  ToggleLeft,
  ToggleRight,
  Bell,
  BellRing,
  Sparkles,
  X,
  Copy,
  CheckCheck,
  Eye,
  ExternalLink,
  Upload,
} from 'lucide-react';
import {
  fetchAdminSubscriptionOverview,
  adminActivateCustomPlan,
  adminUpdateLeadStatus,
  adminSavePlan,
  adminCreateCustomPlan,
  adminTogglePlanStatus,
  fetchExpiringSubscriptionsAdmin,
  adminSendExpiryNotification,
  adminApproveSubscription,
  adminRejectSubscription,
  fetchPaymentSettings,
  updatePaymentSettingsAdmin,
  fetchAdminPayments,
  fetchPaymentOverviewMetrics,
  adminApprovePayment,
  adminRejectPayment,
  AdminSubscriptionOverviewData,
  ExpiringSubscriptionsAdminData,
  PlanConfig,
  ExpiryReminderNotification,
} from '../../services/subscriptionService';
import {
  PlanId,
  UserSubscriptionRecord,
  TeamLeadRecord,
  PaymentOrderRecord,
  SubscriptionApprovalRequest,
  PaymentVerificationRecord,
  AdminPaymentSettings,
  PaymentOverviewMetrics,
} from '../../types';

interface AdminSubscriptionTabProps {
  initialSubTab?: 'payment_verification' | 'payment_settings' | 'subscriptions' | 'plans' | 'expiring' | 'leads';
}

export const AdminSubscriptionTab: React.FC<AdminSubscriptionTabProps> = ({
  initialSubTab = 'payment_verification',
}) => {
  const [data, setData] = useState<AdminSubscriptionOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'payment_verification' | 'payment_settings' | 'subscriptions' | 'leads' | 'plans' | 'expiring'>(
    initialSubTab === 'pending_approvals' as any ? 'payment_verification' : initialSubTab
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'EXPIRED'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual UPI Payments & Verification Records (Req 6 & 19)
  const [paymentRecords, setPaymentRecords] = useState<PaymentVerificationRecord[]>([]);
  const [paymentMetrics, setPaymentMetrics] = useState<PaymentOverviewMetrics | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedViewPayment, setSelectedViewPayment] = useState<PaymentVerificationRecord | null>(null);
  const [approveModalPayment, setApproveModalPayment] = useState<PaymentVerificationRecord | null>(null);
  const [rejectModalPayment, setRejectModalPayment] = useState<PaymentVerificationRecord | null>(null);
  const [rejectReasonOption, setRejectReasonOption] = useState<string>('Invalid transaction ID');
  const [rejectCustomNotes, setRejectCustomNotes] = useState<string>('');
  const [approveNotes, setApproveNotes] = useState<string>('');
  const [isProcessingPaymentAction, setIsProcessingPaymentAction] = useState<boolean>(false);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  // Legacy approval request state
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectModalRequest, setRejectModalRequest] = useState<SubscriptionApprovalRequest | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>('');
  const [isRejectingId, setIsRejectingId] = useState<string | null>(null);

  const handleReject = async () => {
    if (!rejectModalRequest) return;
    setIsRejectingId(rejectModalRequest.id);
    try {
      await adminRejectSubscription(rejectModalRequest.id, rejectReasonInput.trim() || undefined);
      setToastMessage('सबस्क्रिप्शन विनंती नाकारली गेली.');
      setRejectModalRequest(null);
      setRejectReasonInput('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'त्रुटी आली.');
    } finally {
      setIsRejectingId(null);
    }
  };

  // Payment Settings State (Req 1)
  const [paymentSettings, setPaymentSettings] = useState<AdminPaymentSettings>({
    upiId: 'growview@upi',
    upiName: 'GrowView Technologies Pvt Ltd',
    qrCodeUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=400&auto=format&fit=crop&q=80',
    instructions: 'Pay using Google Pay, PhonePe, Paytm, BHIM or any UPI app. Enter the 12-digit UTR / Transaction ID and upload the payment screenshot for instant activation.',
    supportPhone: '+91 7774914906',
    supportEmail: 'support@growview.in',
    isEnabled: true,
  });
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const qrFileInputRef = React.useRef<HTMLInputElement>(null);

  // Expiring Subscriptions & Notifications
  const [expiringData, setExpiringData] = useState<ExpiringSubscriptionsAdminData | null>(null);
  const [isLoadingExpiring, setIsLoadingExpiring] = useState<boolean>(false);
  const [notificationTargetUser, setNotificationTargetUser] = useState<(UserSubscriptionRecord & { daysRemaining: number }) | null>(null);
  const [notificationStage, setNotificationStage] = useState<'7_DAYS' | '3_DAYS' | '1_DAY' | 'ON_EXPIRY' | 'MANUAL'>('7_DAYS');
  const [notificationCustomMsg, setNotificationCustomMsg] = useState<string>('');
  const [isSendingNotification, setIsSendingNotification] = useState<boolean>(false);

  // Plan Management State
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [featuresInput, setFeaturesInput] = useState<string>('');
  const [isSavingPlan, setIsSavingPlan] = useState<boolean>(false);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState<boolean>(false);
  const [newPlanForm, setNewPlanForm] = useState<Partial<PlanConfig>>({
    plan_id: '',
    plan_name: '',
    nameMarathi: '',
    price: 499,
    originalPrice: 999,
    billing_cycle: 'monthly',
    periodLabel: '/ महिना',
    periodLabelMarathi: 'दरमहा',
    business_limit: 2,
    watermark_status: 'NO_WATERMARK',
    monthly_free_clean_posters: 999,
    features: ['कोणताही वॉटरमार्क नाही', '२ बिझनेस प्रोफाईल', 'अमर्यादित HD डाऊनलोड्स'],
    is_popular: false,
    is_active: true,
  });

  // Manual Custom Plan Grant Modal
  const [isGrantModalOpen, setIsGrantModalOpen] = useState<boolean>(false);
  const [grantTargetUserId, setGrantTargetUserId] = useState<string>('');
  const [grantTargetEmail, setGrantTargetEmail] = useState<string>('');
  const [grantPlanId, setGrantPlanId] = useState<PlanId>('business-yearly');
  const [grantDurationDays, setGrantDurationDays] = useState<number>(365);
  const [grantBusinessLimit, setGrantBusinessLimit] = useState<number>(5);
  const [grantTeamLimit, setGrantTeamLimit] = useState<number>(10);
  const [isGranting, setIsGranting] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [overview, paymentsData, settingsData] = await Promise.all([
        fetchAdminSubscriptionOverview().catch(() => null),
        fetchAdminPayments().catch(() => ({ payments: [], metrics: null })),
        fetchPaymentSettings().catch(() => null),
      ]);
      if (overview) setData(overview);
      if (paymentsData) {
        setPaymentRecords(paymentsData.payments || []);
        if (paymentsData.metrics) setPaymentMetrics(paymentsData.metrics);
      }
      if (settingsData) {
        setPaymentSettings(settingsData);
      }
    } catch (err) {
      console.warn('Failed to load admin subscription overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExpiringData = async () => {
    setIsLoadingExpiring(true);
    try {
      const exp = await fetchExpiringSubscriptionsAdmin();
      setExpiringData(exp);
    } catch (err) {
      console.warn('Failed to load expiring subscriptions:', err);
    } finally {
      setIsLoadingExpiring(false);
    }
  };

  useEffect(() => {
    loadData();
    loadExpiringData();
  }, []);

  // Sync initialSubTab if prop changes
  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(id);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  // =========================================================================
  // ADMIN APPROVE PAYMENT (Req 6)
  // =========================================================================
  const handleConfirmApprovePayment = async () => {
    if (!approveModalPayment) return;
    setIsProcessingPaymentAction(true);
    try {
      const result = await adminApprovePayment(approveModalPayment.id, approveNotes.trim() || undefined);
      setToastMessage(`✓ Payment approved and activated successfully for ${result.payment.user_name || result.payment.user_email}! Plan: ${result.subscription.plan_name}`);
      setApproveModalPayment(null);
      setApproveNotes('');
      if (selectedViewPayment?.id === approveModalPayment.id) {
        setSelectedViewPayment(result.payment);
      }
      await loadData();
    } catch (err: any) {
      alert(err.message || 'पेमेंट मंजूर करताना त्रुटी आली.');
    } finally {
      setIsProcessingPaymentAction(false);
    }
  };

  // =========================================================================
  // ADMIN REJECT PAYMENT (Req 7)
  // =========================================================================
  const handleConfirmRejectPayment = async () => {
    if (!rejectModalPayment) return;
    setIsProcessingPaymentAction(true);
    const finalReason = rejectReasonOption === 'Other'
      ? (rejectCustomNotes.trim() || 'Payment details could not be verified.')
      : (rejectCustomNotes.trim() ? `${rejectReasonOption} - ${rejectCustomNotes.trim()}` : rejectReasonOption);

    try {
      const result = await adminRejectPayment(rejectModalPayment.id, finalReason);
      setToastMessage(`✕ Payment rejected for ${result.payment.user_name || result.payment.user_email}. Reason: ${finalReason}`);
      setRejectModalPayment(null);
      setRejectCustomNotes('');
      if (selectedViewPayment?.id === rejectModalPayment.id) {
        setSelectedViewPayment(result.payment);
      }
      await loadData();
    } catch (err: any) {
      alert(err.message || 'पेमेंट नाकारताना त्रुटी आली.');
    } finally {
      setIsProcessingPaymentAction(false);
    }
  };

  // =========================================================================
  // ADMIN SAVE PAYMENT SETTINGS (Req 1)
  // =========================================================================
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updated = await updatePaymentSettingsAdmin(paymentSettings);
      setPaymentSettings(updated);
      setToastMessage('✓ UPI Payment Settings updated successfully!');
    } catch (err: any) {
      alert(err.message || 'पेमेंट सेटींग्ज सेव्ह करताना त्रुटी आली.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setPaymentSettings(prev => ({ ...prev, qrCodeUrl: dataUrl }));
      setToastMessage('नवीन QR कोड इमेज निवडली गेली. सेव्ह करण्यासाठी खालील बटण दाबा.');
    };
    reader.readAsDataURL(file);
  };


  const handleUpdateLead = async (leadId: string, status: TeamLeadRecord['status']) => {
    try {
      await adminUpdateLeadStatus(leadId, status);
      setToastMessage(`लीड स्थिती अपडेट झाली: "${status}"`);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'लीड अपडेट करताना त्रुटी आली.');
    }
  };

  const handleTogglePlan = async (planId: string) => {
    try {
      await adminTogglePlanStatus(planId);
      setToastMessage(`प्लॅन स्थिती बदलली (${planId})`);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'प्लॅन स्थिती बदलताना अडचण आली.');
    }
  };

  const handleOpenEditPlan = (plan: PlanConfig) => {
    setEditingPlan({ ...plan });
    setFeaturesInput((plan.features || []).join('\n'));
  };

  const handleSavePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    setIsSavingPlan(true);
    try {
      const parsedFeatures = featuresInput
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const updated = {
        ...editingPlan,
        features: parsedFeatures,
      };

      await adminSavePlan(updated);
      setToastMessage(`प्लॅन "${updated.plan_name}" यशस्वीरित्या सेव्ह झाला!`);
      setEditingPlan(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'प्लॅन सेव्ह करताना अडचण आली.');
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleCreatePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanForm.plan_name || !newPlanForm.plan_id) {
      alert('प्लॅन आयडी आणि नाव आवश्यक आहे.');
      return;
    }
    setIsSavingPlan(true);
    try {
      await adminCreateCustomPlan(newPlanForm);
      setToastMessage(`नवीन प्लॅन "${newPlanForm.plan_name}" यशस्वीरित्या तयार झाला!`);
      setIsCreatePlanOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'कस्टम प्लॅन तयार करताना अडचण आली.');
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleSendExpiryNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationTargetUser) return;
    setIsSendingNotification(true);
    try {
      await adminSendExpiryNotification({
        userId: notificationTargetUser.user_id,
        subscriptionId: notificationTargetUser.subscription_id,
        stage: notificationStage,
        customMessage: notificationCustomMsg.trim() || undefined,
      });
      setToastMessage(`वापरकर्त्याला सबस्क्रिप्शन मुदत संपण्याची सूचना पाठवली! (${notificationTargetUser.user_id})`);
      setNotificationTargetUser(null);
      setNotificationCustomMsg('');
      await loadExpiringData();
    } catch (err: any) {
      alert(err.message || 'सूचना पाठवण्यात अडचण आली.');
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleGrantCustomPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantTargetUserId.trim() && !grantTargetEmail.trim()) {
      alert('वापरकर्ता आयडी किंवा ईमेल आवश्यक आहे.');
      return;
    }

    setIsGranting(true);
    try {
      const targetId = grantTargetUserId.trim() || `usr_${Date.now()}`;
      await adminActivateCustomPlan({
        userId: targetId,
        userEmail: grantTargetEmail.trim(),
        planId: grantPlanId,
        durationDays: Number(grantDurationDays) || 365,
        businessLimit: Number(grantBusinessLimit) || 5,
        teamLimit: Number(grantTeamLimit) || 10,
      });

      setToastMessage(`सबस्क्रिप्शन यशस्वीरित्या लागू केले! (${grantPlanId})`);
      setIsGrantModalOpen(false);
      setGrantTargetUserId('');
      setGrantTargetEmail('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'सबस्क्रिप्शन लागू करताना त्रुटी आली.');
    } finally {
      setIsGranting(false);
    }
  };

  const filteredSubscriptions = (data?.subscriptions || []).filter((sub) => {
    const matchesSearch =
      sub.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plan_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.payment_id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.subscription_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allApprovalRequests = data?.approvalRequests || [];
  const pendingApprovalRequests = allApprovalRequests.filter((r) => r.status === 'pending');
  const filteredApprovalRequests = allApprovalRequests.filter((req) => {
    if (approvalFilter === 'all') return true;
    return req.status === approvalFilter;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Banner Alert */}
      {toastMessage && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 p-3.5 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="text-emerald-400 hover:underline">
            बंद करा
          </button>
        </div>
      )}

      {/* Header & Metrics Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            सबस्क्रिप्शन, महसूल व ॲक्सेस कंट्रोल डॅशबोर्ड
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            सर्व वापरकर्त्यांचे प्लॅन्स, पेमेंट पडताळणी, टीम लीड्स व वॉटरमार्क कोटा व्यवस्थापन
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1.5 transition-colors"
            title="रिफ्रेश करा"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">रिफ्रेश</span>
          </button>
          <button
            type="button"
            onClick={() => setIsGrantModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            मॅन्युअल प्लॅन ॲक्टिव्हेट करा
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Req 19: Payment Overview Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Pending Payments KPI Card */}
        <div
          onClick={() => setActiveSubTab('payment_verification')}
          className={`border rounded-2xl p-4 cursor-pointer transition-all ${
            (paymentMetrics?.pendingCount || paymentRecords.filter(p => p.status === 'pending').length) > 0
              ? 'bg-amber-950/40 border-amber-500/70 shadow-lg shadow-amber-500/15 hover:border-amber-400'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Pending Payments
            </span>
            {(paymentMetrics?.pendingCount || paymentRecords.filter(p => p.status === 'pending').length) > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950 animate-pulse">
                ACTION
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {paymentMetrics?.pendingCount ?? paymentRecords.filter(p => p.status === 'pending').length}
          </div>
          <span className="text-[10px] text-amber-300/80 font-medium">
            {(paymentMetrics?.pendingCount || paymentRecords.filter(p => p.status === 'pending').length) > 0
              ? 'Verification required'
              : 'All payments verified'}
          </span>
        </div>

        {/* Approved Payments / Revenue */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
            Approved Payments
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {paymentMetrics?.approvedCount ?? paymentRecords.filter(p => p.status === 'approved').length}
          </div>
          <span className="text-[10px] text-slate-400">
            Today: ₹{paymentMetrics?.todayRevenue?.toLocaleString() || 0}
          </span>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            This Month Revenue
          </div>
          <div className="text-2xl font-black text-white mt-1">
            ₹{(paymentMetrics?.thisMonthRevenue || data?.metrics.totalRevenue || 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">100% Verified UPI</span>
        </div>

        {/* Active Premium Users */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Active Premium
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {paymentMetrics?.activePremiumUsers ?? data?.metrics.activePaidCount ?? 0}
          </div>
          <span className="text-[10px] text-slate-400">Unlimited Clean Posts</span>
        </div>

        {/* Expired / Free Users */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            Free / Expired Users
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {(data?.metrics.freeUsersCount || 0) + (paymentMetrics?.expiredSubscriptions || 0)}
          </div>
          <span className="text-[10px] text-slate-400">5 free posts/month</span>
        </div>

        {/* Rejected Payments */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 col-span-2 lg:col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Rejected Payments
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {paymentMetrics?.rejectedCount ?? paymentRecords.filter(p => p.status === 'rejected').length}
          </div>
          <span className="text-[10px] text-rose-300/80 font-medium">Re-submission allowed</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto no-scrollbar">
        {[
          {
            key: 'payment_verification',
            label: `🔔 Payments / Verification (${paymentRecords.filter(p => p.status === 'pending').length})`,
            icon: ShieldCheck,
            badge: paymentRecords.filter(p => p.status === 'pending').length > 0
              ? `${paymentRecords.filter(p => p.status === 'pending').length} Pending`
              : undefined,
          },
          {
            key: 'payment_settings',
            label: '💳 Payment Settings (UPI & QR)',
            icon: QrCode,
          },
          { key: 'subscriptions', label: `Subscriptions (${data?.subscriptions.length || 0})`, icon: Crown },
          { key: 'plans', label: `Plans & Pricing (${data?.plans.length || 0})`, icon: Zap },
          { key: 'expiring', label: `Expiring Alerts (${expiringData?.counts.expiresIn7Days || 0})`, icon: AlertCircle },
          { key: 'leads', label: `Business Leads (${data?.teamLeads.length || 0})`, icon: Send },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap flex items-center gap-2 border-b-2 transition-all ${
                isSelected
                  ? 'border-amber-500 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* SUBTAB 1: PAYMENTS / PAYMENT VERIFICATION TABLE (Req 6 & 7)        */}
      {/* =================================================================== */}
      {activeSubTab === 'payment_verification' && (
        <div className="space-y-4">
          {/* Header Policy Banner & Filter Bar */}
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent p-4 sm:p-5 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                <ShieldCheck className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Payments / Payment Verification System
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase">
                    Admin Approval Required
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                  <strong>Critical Policy:</strong> Paid plans remain in <strong>Pending Verification</strong> status until explicitly approved by an authorized admin. Clicking "Accept & Activate Plan" activates the subscription and removes watermark.
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 font-semibold">Filter:</span>
              <div className="bg-slate-900 border border-slate-800 p-0.5 rounded-xl flex">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    type="button"
                    onClick={() => setPaymentFilter(filterKey)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                      paymentFilter === filterKey
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filterKey === 'all'
                      ? 'All'
                      : filterKey === 'pending'
                      ? `Pending (${paymentRecords.filter(p => p.status === 'pending').length})`
                      : filterKey === 'approved'
                      ? 'Approved'
                      : 'Rejected'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, business, plan, or transaction ID / UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Payment Verification Table (Req 6) */}
          {(() => {
            const filteredPayments = paymentRecords.filter((p) => {
              if (paymentFilter !== 'all' && p.status !== paymentFilter) return false;
              if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return (
                  p.user_name?.toLowerCase().includes(q) ||
                  p.user_email?.toLowerCase().includes(q) ||
                  p.user_phone?.toLowerCase().includes(q) ||
                  p.business_name?.toLowerCase().includes(q) ||
                  p.plan_name?.toLowerCase().includes(q) ||
                  p.transaction_id?.toLowerCase().includes(q)
                );
              }
              return true;
            });

            if (filteredPayments.length === 0) {
              return (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">No Payment Verification Records Found</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    When customers submit payment proof (screenshot & UPI UTR), verification requests will appear here for review and activation.
                  </p>
                </div>
              );
            }

            return (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Business</th>
                        <th className="py-3 px-4">Plan</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Transaction ID / UTR</th>
                        <th className="py-3 px-4">Payment Date</th>
                        <th className="py-3 px-4">Screenshot</th>
                        <th className="py-3 px-4">Submitted Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredPayments.map((payment) => {
                        const isPending = payment.status === 'pending';
                        const isApproved = payment.status === 'approved';
                        const isRejected = payment.status === 'rejected';

                        return (
                          <tr
                            key={payment.id}
                            className={`hover:bg-slate-900/60 transition-colors ${
                              isPending ? 'bg-amber-500/[0.02]' : ''
                            }`}
                          >
                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white text-xs">
                                {payment.user_name || 'Customer'}
                              </div>
                              <div className="text-[11px] text-slate-400">{payment.user_email}</div>
                              {payment.user_phone && (
                                <div className="text-[10px] text-slate-500">{payment.user_phone}</div>
                              )}
                            </td>

                            {/* Business */}
                            <td className="py-3.5 px-4 font-medium text-slate-300">
                              {payment.business_name || '—'}
                            </td>

                            {/* Plan */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-amber-300">{payment.plan_name}</span>
                              <span className="text-[10px] text-slate-400 block uppercase">
                                {payment.billing_cycle === 'yearly' ? 'Yearly' : 'Monthly'}
                              </span>
                            </td>

                            {/* Amount */}
                            <td className="py-3.5 px-4 font-black text-white text-sm">
                              ₹{payment.amount}
                            </td>

                            {/* Transaction ID */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-200 bg-slate-900 px-2 py-1 rounded border border-slate-800 w-fit">
                                <span>{payment.transaction_id}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(payment.transaction_id, payment.id)}
                                  className="text-slate-400 hover:text-white"
                                  title="Copy Transaction ID"
                                >
                                  {copiedTxId === payment.id ? (
                                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Payment Date */}
                            <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                              {payment.payment_date || '—'}
                            </td>

                            {/* Screenshot Thumbnail */}
                            <td className="py-3.5 px-4">
                              {payment.screenshot_url ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedViewPayment(payment)}
                                  className="group relative w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
                                  title="Click to view full screenshot"
                                >
                                  <img
                                    src={payment.screenshot_url}
                                    alt="Payment Screenshot"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-3.5 h-3.5 text-white" />
                                  </div>
                                </button>
                              ) : (
                                <span className="text-slate-500 text-[10px]">No image</span>
                              )}
                            </td>

                            {/* Submitted Date */}
                            <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                              {new Date(payment.submitted_at).toLocaleDateString('mr-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {isPending && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1 w-fit">
                                  <Clock className="w-3 h-3" /> Pending
                                </span>
                              )}
                              {isApproved && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 w-fit">
                                  <CheckCircle2 className="w-3 h-3" /> Approved
                                </span>
                              )}
                              {isRejected && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 w-fit">
                                  <AlertCircle className="w-3 h-3" /> Rejected
                                </span>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* VIEW */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedViewPayment(payment)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold transition-colors flex items-center gap-1"
                                  title="View complete payment and customer details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>VIEW</span>
                                </button>

                                {isPending && (
                                  <>
                                    {/* APPROVE */}
                                    <button
                                      type="button"
                                      onClick={() => setApproveModalPayment(payment)}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors flex items-center gap-1 shadow-sm"
                                      title="Accept payment and activate plan"
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      <span>Accept & Activate</span>
                                    </button>

                                    {/* REJECT */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRejectModalPayment(payment);
                                        setRejectReasonOption('Invalid transaction ID');
                                        setRejectCustomNotes('');
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 text-xs font-bold transition-colors flex items-center gap-1"
                                      title="Reject payment verification request"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =================================================================== */}
      {/* SUBTAB 2: PAYMENT SETTINGS (UPI & QR CODE) (Req 1)                 */}
      {/* =================================================================== */}
      {activeSubTab === 'payment_settings' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  Manual UPI Payment Settings
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure UPI ID, QR Code image, instructions, and customer support information. Never hard-coded.
                </p>
              </div>

              {/* Enable / Disable Toggle */}
              <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">
                  Manual UPI Payment:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPaymentSettings((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))
                  }
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-colors ${
                    paymentSettings.isEnabled
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {paymentSettings.isEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePaymentSettings} className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* UPI ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    UPI ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.upiId}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, upiId: e.target.value })
                    }
                    placeholder="उदा. growview@upi किंवा mobile@okhdfcbank"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Customers will transfer money to this official UPI ID.
                  </p>
                </div>

                {/* Business / UPI Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    UPI Name / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.upiName}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, upiName: e.target.value })
                    }
                    placeholder="उदा. GrowView Digital Services"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Official payee recipient name visible to the customer.
                  </p>
                </div>
              </div>

              {/* QR Code Upload & Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  UPI QR Code Image (Upload / Replace) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                  {/* Image Preview */}
                  <div className="w-40 h-40 bg-white rounded-2xl p-2.5 shadow-lg border border-slate-700 flex items-center justify-center mx-auto sm:mx-0">
                    {paymentSettings.qrCodeUrl ? (
                      <img
                        src={paymentSettings.qrCodeUrl}
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCode className="w-20 h-20 text-slate-400" />
                    )}
                  </div>

                  {/* Actions / URL */}
                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <button
                        type="button"
                        onClick={() => qrFileInputRef.current?.click()}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                      >
                        <Upload className="w-4 h-4" />
                        Upload / Replace QR Code Image
                      </button>
                      <input
                        ref={qrFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleQrImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">किंवा थेट इमेज URL टाका:</label>
                      <input
                        type="url"
                        value={paymentSettings.qrCodeUrl}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, qrCodeUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      QR कोड इमेज स्पष्ट व स्कॅन करण्यायोग्य असावी (BHIM, PhonePe, Google Pay QR).
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Payment Instructions (ग्राहकांना दिसणाऱ्या सूचना)
                </label>
                <textarea
                  rows={3}
                  value={paymentSettings.instructions}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, instructions: e.target.value })
                  }
                  placeholder="उदा. Pay using any UPI application. Enter the UTR number and upload the screenshot."
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Support Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Support Contact Number / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.supportPhone}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, supportPhone: e.target.value })
                    }
                    placeholder="+91 7774914906"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Support Contact Email
                  </label>
                  <input
                    type="email"
                    value={paymentSettings.supportEmail}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, supportEmail: e.target.value })
                    }
                    placeholder="support@growview.in"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Settings...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      Save Payment Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1: SUBSCRIPTIONS */}
      {activeSubTab === 'subscriptions' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="वापरकर्ता आयडी, प्लॅन किंवा पेमेंट आयडी शोधा..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">सर्व स्थिती (All Status)</option>
                <option value="ACTIVE">सक्रिय (ACTIVE)</option>
                <option value="EXPIRED">मुदत संपलेले (EXPIRED)</option>
              </select>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">वापरकर्ता</th>
                    <th className="px-4 py-3">प्लॅन नाव</th>
                    <th className="px-4 py-3">स्थिती</th>
                    <th className="px-4 py-3">ब्रँड्स मर्यादा</th>
                    <th className="px-4 py-3">वॉटरमार्क / मोफत वापर</th>
                    <th className="px-4 py-3">मुदत समाप्त</th>
                    <th className="px-4 py-3">पेमेंट आयडी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSubscriptions.map((sub) => {
                    const isPaid = sub.plan_id !== 'free';
                    const isActive = sub.subscription_status === 'ACTIVE';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-white block">{sub.user_id}</span>
                          <span className="text-[10px] text-slate-500">आयडी: {sub.id}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-white block">{sub.plan_name}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{sub.billing_cycle}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {sub.subscription_status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-amber-300">{sub.business_limit} ब्रँड्स</span>
                        </td>
                        <td className="px-4 py-3.5">
                          {isPaid ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              वॉटरमार्क नाही (Clean)
                            </span>
                          ) : (
                            <div>
                              <span className="text-slate-300 block">
                                ३ पैकी <strong>{sub.monthly_free_clean_used}</strong> वापरले
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {sub.monthly_free_clean_used >= 3
                                  ? 'वॉटरमार्क लागू'
                                  : `${3 - sub.monthly_free_clean_used} मोफत स्वच्छ बाकी`}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {new Date(sub.expiry_date).toLocaleDateString('mr-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                          {sub.payment_id}
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

      {/* TAB 2: CORPORATE TEAM LEADS */}
      {activeSubTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              "CONTACT US FOR BUSINESS" फॉर्मद्वारे १० ते २०+ सदस्यांसाठी आलेल्या कॉर्पोरेट चौकशी अर्ज.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data?.teamLeads || []).map((lead) => (
              <div key={lead.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{lead.name}</h4>
                    <p className="text-xs text-amber-400 font-semibold">{lead.company_name}</p>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e: any) => handleUpdateLead(lead.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase border focus:outline-none ${
                      lead.status === 'new'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : lead.status === 'contacted'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : lead.status === 'converted'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <option value="new">नवीन अर्ज (New)</option>
                    <option value="contacted">संपर्क केला (Contacted)</option>
                    <option value="converted">प्लॅन सुरू केला (Converted)</option>
                    <option value="closed">बंद केले (Closed)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">मोबाईल:</span>
                    <span className="font-semibold text-white">{lead.mobile_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ईमेल:</span>
                    <span className="font-semibold text-white truncate block">{lead.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">टीम सदस्य:</span>
                    <span className="font-bold text-amber-300">{lead.team_members_count} कर्मचारी</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ब्रँड्स संख्या:</span>
                    <span className="font-bold text-amber-300">{lead.businesses_count} बिझनेस</span>
                  </div>
                </div>

                {lead.requirements && (
                  <div className="text-xs text-slate-400">
                    <span className="text-slate-500 font-semibold block text-[10px]">गरजा:</span>
                    <p className="italic bg-slate-900/50 p-2 rounded-lg border border-slate-850">"{lead.requirements}"</p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500">
                    तारीख: {new Date(lead.created_at).toLocaleString('mr-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setGrantTargetEmail(lead.email);
                      setGrantPlanId('business-team');
                      setGrantTeamLimit(20);
                      setGrantBusinessLimit(10);
                      setIsGrantModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3" />
                    या लीडला टीम ॲक्सेस द्या
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS & TRANSACTIONS */}
      {activeSubTab === 'orders' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">ऑर्डर आयडी</th>
                <th className="px-4 py-3">ग्राहक ईमेल</th>
                <th className="px-4 py-3">प्लॅन</th>
                <th className="px-4 py-3">रक्कम</th>
                <th className="px-4 py-3">पेमेंट पद्धत</th>
                <th className="px-4 py-3">स्थिती</th>
                <th className="px-4 py-3">तारीख</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(data?.orders || []).map((order) => (
                <tr key={order.order_id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-white">{order.order_id}</td>
                  <td className="px-4 py-3 text-slate-300">{order.user_email}</td>
                  <td className="px-4 py-3 font-semibold text-white">{order.plan_name}</td>
                  <td className="px-4 py-3 font-bold text-amber-400">₹{order.amount}</td>
                  <td className="px-4 py-3 uppercase text-[10px] text-slate-400">{order.payment_method || 'UPI'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(order.created_at).toLocaleDateString('mr-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: PLAN MANAGEMENT (CENTRALIZED PLANS CONFIGURATION) */}
      {activeSubTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                सेंट्रलाइज्ड सबस्क्रिप्शन प्लॅन्स व्यवस्थापन
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                किंमत, ऑफर, वॉटरमार्क नियम व ब्रँड मर्यादा येथे अपडेट करा — हे संपूर्ण ॲप व लँडिंग पेजवर त्वरित लागू होईल.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatePlanOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              नवीन कस्टम प्लॅन जोडा
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data?.plans || []).map((plan: any) => {
              const pId = plan.plan_id || plan.id;
              const isFree = plan.billing_cycle === 'free' || plan.price === 0;
              const isActive = plan.is_active !== false;

              return (
                <div
                  key={pId}
                  className={`bg-slate-950 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                    isActive ? 'border-slate-800' : 'border-red-900/40 opacity-70 bg-slate-950/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-base">{plan.plan_name || plan.name}</h4>
                          {plan.is_popular && (
                            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/40">
                              लोकप्रिय
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{plan.nameMarathi}</p>
                        <span className="text-[10px] font-mono text-slate-500">ID: {pId}</span>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-amber-400">
                          {isFree ? '₹0' : `₹${plan.price}`}
                        </div>
                        {plan.originalPrice && (
                          <div className="text-[10px] text-slate-500 line-through">
                            ₹{plan.originalPrice}
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 block">{plan.periodLabel || (isFree ? 'कायम' : '/ महिना')}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                      {/* Price & Discount info */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <IndianRupee className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          किंमत (Price):
                        </span>
                        <div className="text-right">
                          <span className="text-white font-black text-sm">
                            {isFree ? 'मोफत' : `₹${plan.price}`}
                          </span>
                          {plan.originalPrice ? (
                            <span className="text-[10px] text-slate-500 line-through ml-1.5">
                              ₹{plan.originalPrice}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Duration info */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          डुरेशन (Duration):
                        </span>
                        <strong className="text-amber-300 font-bold">
                          {plan.duration_days
                            ? `${plan.duration_days} दिवस (${plan.periodLabel || ''})`
                            : plan.billing_cycle === 'yearly'
                            ? '३६५ दिवस (वार्षिक)'
                            : plan.billing_cycle === 'quarterly'
                            ? '९० दिवस (३ महिने)'
                            : plan.billing_cycle === 'free'
                            ? 'कायमस्वरूपी'
                            : '३० दिवस (मासिक)'}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ब्रँड्स मर्यादा:
                        </span>
                        <strong className="text-white">
                          {plan.business_limit || plan.businessLimit || 1} ब्रँड्स
                        </strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          वॉटरमार्क:
                        </span>
                        <strong className={plan.watermark_status === 'NO_WATERMARK' ? 'text-emerald-300' : 'text-amber-300'}>
                          {plan.watermark_status === 'NO_WATERMARK'
                            ? 'कोणताही वॉटरमार्क नाही'
                            : '५ स्वच्छ, नंतर वॉटरमार्क'}
                        </strong>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">स्थिती (Status):</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'}`}>
                          {isActive ? 'सक्रिय (Active)' : 'बंद (Inactive)'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">वैशिष्ट्ये (Features):</div>
                      {(plan.features || []).map((f: string, i: number) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        🔒 केवळ ॲडमिन किंमत व डुरेशन बदलू शकतो
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditPlan(plan)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      किंमत व डुरेशन एडिट करा
                    </button>
                    {!isFree && (
                      <button
                        type="button"
                        onClick={() => handleTogglePlan(pId)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors ${
                          isActive
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                        title={isActive ? 'प्लॅन बंद करा' : 'प्लॅन सुरू करा'}
                      >
                        {isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-red-400" />}
                        <span>{isActive ? 'सुरू' : 'बंद'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: EXPIRING SUBSCRIPTIONS & NOTIFICATIONS */}
      {activeSubTab === 'expiring' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                सबस्क्रिप्शन मुदत संपण्याच्या सूचना (Expiry Reminders & Alerts)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                मुदत संपण्याच्या ७ दिवस, ३ दिवस, १ दिवस आधी आणि मुदतीच्या दिवशी पाठवल्या जाणाऱ्या स्वयंचलित व मॅन्युअल सूचनांचे व्यवस्थापन
              </p>
            </div>
            <button
              type="button"
              onClick={loadExpiringData}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingExpiring ? 'animate-spin' : ''}`} />
              <span>रिफ्रेश</span>
            </button>
          </div>

          {/* 4 Expiry Stages Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block">७ दिवसांत संपणारे</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {expiringData?.counts.expiringIn7Days || 0}
              </div>
              <span className="text-[10px] text-slate-500">7-Day Alert टप्पा</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block">३ दिवसांत संपणारे</span>
              <div className="text-2xl font-black text-orange-400 mt-1">
                {expiringData?.counts.expiringIn3Days || 0}
              </div>
              <span className="text-[10px] text-slate-500">3-Day Urgent टप्पा</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block">उद्या संपणारे (१ दिवस)</span>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {expiringData?.counts.expiringIn1Day || 0}
              </div>
              <span className="text-[10px] text-slate-500">अंतिम २४ तास सूचना</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 block">कालबाह्य झालेले (Expired)</span>
              <div className="text-2xl font-black text-red-400 mt-1">
                {expiringData?.counts.alreadyExpired || 0}
              </div>
              <span className="text-[10px] text-slate-500">वॉटरमार्क मोड लागू</span>
            </div>
          </div>

          {/* Table of Expiring Subscriptions */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                मुदत संपण्याच्या उंबरठ्यावरील वापरकर्ते ({expiringData?.expiringIn7Days.length || 0})
              </h4>
            </div>

            {(!expiringData?.expiringIn7Days || expiringData.expiringIn7Days.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                सध्या पुढील ७ दिवसांत कोणाचेही सबस्क्रिप्शन संपत नाही. सर्व सक्रिय सबस्क्रिप्शन सुरक्षित आहेत.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">वापरकर्ता आयडी / ईमेल</th>
                    <th className="px-4 py-3">प्लॅन</th>
                    <th className="px-4 py-3">मुदत तारीख (Expiry)</th>
                    <th className="px-4 py-3">शिल्लक दिवस</th>
                    <th className="px-4 py-3 text-right">कृती (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {expiringData.expiringIn7Days.map((sub: any) => (
                    <tr key={sub.subscription_id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">
                        <div>{sub.user_id}</div>
                        <div className="text-[10px] text-slate-400">{sub.payment_id ? `Pay ID: ${sub.payment_id}` : ''}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-amber-400">{sub.plan_name}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString('mr-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            sub.daysRemaining <= 1
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : sub.daysRemaining <= 3
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {sub.daysRemaining <= 0
                            ? 'आज संपत आहे'
                            : sub.daysRemaining === 1
                            ? 'उद्या संपणार (१ दिवस)'
                            : `${sub.daysRemaining} दिवस बाकी`}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setNotificationTargetUser(sub);
                            const defaultStage =
                              sub.daysRemaining <= 0
                                ? 'ON_EXPIRY'
                                : sub.daysRemaining === 1
                                ? '1_DAY'
                                : sub.daysRemaining <= 3
                                ? '3_DAYS'
                                : '7_DAYS';
                            setNotificationStage(defaultStage);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          सूचना पाठवा
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Sent Notifications Log */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                पाठवलेल्या सूचनांचा इतिहास (Notification Dispatch Log)
              </h4>
            </div>

            {(!expiringData?.recentNotifications || expiringData.recentNotifications.length === 0) ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                अजून कोणत्याही मुदत सूचना पाठवल्या गेलेल्या नाहीत.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">वापरकर्ता</th>
                    <th className="px-4 py-3">टप्पा (Stage)</th>
                    <th className="px-4 py-3">संदेश मजकूर</th>
                    <th className="px-4 py-3">वेळ</th>
                    <th className="px-4 py-3">स्थिती</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {expiringData.recentNotifications.map((notif: ExpiryReminderNotification) => (
                    <tr key={notif.id} className="hover:bg-slate-900/60">
                      <td className="px-4 py-3 font-semibold text-white">
                        <div>{notif.user_email || notif.user_id}</div>
                        {notif.user_name && <div className="text-[10px] text-slate-400">{notif.user_name}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                          {notif.reminder_stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-md truncate">{notif.message}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {new Date(notif.sent_at).toLocaleString('mr-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${notif.notification_status === 'read' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {notif.notification_status === 'read' ? 'वाचले' : 'पाठवले'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* EDIT PLAN MODAL */}
      {editingPlan && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-slate-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                  प्लॅन एडिटर
                </span>
                <h3 className="text-lg font-black mt-0.5">
                  एडिट करा: {editingPlan.plan_name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="p-1.5 rounded-full bg-black/20 text-slate-950 hover:bg-black/30"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlanSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">प्लॅन नाव (English)</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.plan_name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, plan_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">मराठी नाव</label>
                  <input
                    type="text"
                    value={editingPlan.nameMarathi || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, nameMarathi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">किंमत (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">मूळ किंमत (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingPlan.originalPrice || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="उदा. 1499"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">कालावधी लेबल</label>
                  <input
                    type="text"
                    value={editingPlan.periodLabel || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, periodLabel: e.target.value })}
                    placeholder="उदा. / वर्ष"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">ब्रँड प्रोफाईल मर्यादा</label>
                  <input
                    type="number"
                    min={1}
                    value={editingPlan.business_limit}
                    onChange={(e) => setEditingPlan({ ...editingPlan, business_limit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">वॉटरमार्क नियम</label>
                  <select
                    value={editingPlan.watermark_status}
                    onChange={(e: any) => setEditingPlan({ ...editingPlan, watermark_status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="NO_WATERMARK">कोणताही वॉटरमार्क नाही (NO WATERMARK)</option>
                    <option value="WATERMARK_MANDATORY_AFTER_FREE">३ फ्री स्वच्छ, नंतर वॉटरमार्क (FREE)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">बटन टेक्स्ट (Button CTA)</label>
                <input
                  type="text"
                  value={editingPlan.button_text || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, button_text: e.target.value })}
                  placeholder="उदा. आता खरेदी करा (₹599)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  वैशिष्ट्ये (Features) — दर ओळीला एक वैशिष्ट्य लिहा
                </label>
                <textarea
                  rows={4}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={!!editingPlan.is_popular}
                    onChange={(e) => setEditingPlan({ ...editingPlan, is_popular: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>सर्वात लोकप्रिय (Highlight as Popular)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={editingPlan.is_active !== false}
                    onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>सक्रिय प्लॅन (Is Active)</span>
                </label>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isSavingPlan}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25"
                >
                  {isSavingPlan ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      सेव्ह करत आहे...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      बदल सेव्ह करा
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM PLAN MODAL */}
      {isCreatePlanOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-slate-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                  नवीन प्लॅन निर्मिती
                </span>
                <h3 className="text-lg font-black mt-0.5">कस्टम सबस्क्रिप्शन प्लॅन तयार करा</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatePlanOpen(false)}
                className="p-1.5 rounded-full bg-black/20 text-slate-950 hover:bg-black/30"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlanSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">प्लॅन आयडी (Unique ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. festive-special"
                    value={newPlanForm.plan_id || ''}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, plan_id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">प्लॅन नाव (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. FESTIVE SPECIAL"
                    value={newPlanForm.plan_name || ''}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, plan_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">मराठी नाव</label>
                  <input
                    type="text"
                    placeholder="उदा. फेस्टिव्ह स्पेशल प्लॅन"
                    value={newPlanForm.nameMarathi || ''}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, nameMarathi: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">किंमत (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newPlanForm.price}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">ब्रँड प्रोफाईल मर्यादा</label>
                  <input
                    type="number"
                    min={1}
                    value={newPlanForm.business_limit}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, business_limit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">कालावधी सायकल</label>
                  <select
                    value={newPlanForm.billing_cycle}
                    onChange={(e: any) => setNewPlanForm({ ...newPlanForm, billing_cycle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="monthly">मासिक (Monthly)</option>
                    <option value="yearly">वार्षिक (Yearly)</option>
                    <option value="custom">कस्टम (Custom)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatePlanOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isSavingPlan}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg"
                >
                  {isSavingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  प्लॅन तयार करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND EXPIRY NOTIFICATION MODAL */}
      {notificationTargetUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-slate-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                  मुदत सूचना
                </span>
                <h3 className="text-base font-black mt-0.5">सबस्क्रिप्शन मुदत सूचना पाठवा</h3>
              </div>
              <button
                type="button"
                onClick={() => setNotificationTargetUser(null)}
                className="p-1 rounded-full bg-black/20 text-slate-950 hover:bg-black/30"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendExpiryNotification} className="p-5 space-y-3.5">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400">वापरकर्ता: <strong className="text-white">{notificationTargetUser.user_id}</strong></div>
                <div className="text-slate-400">प्लॅन: <strong className="text-amber-400">{notificationTargetUser.plan_name}</strong></div>
                <div className="text-slate-400">शिल्लक: <strong className="text-rose-400">{notificationTargetUser.daysRemaining} दिवस</strong></div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">सूचनेचा टप्पा (Notification Stage)</label>
                <select
                  value={notificationStage}
                  onChange={(e: any) => setNotificationStage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="7_DAYS">७ दिवस बाकी (7 Days Remaining Alert)</option>
                  <option value="3_DAYS">३ दिवस बाकी (3 Days Urgent Reminder)</option>
                  <option value="1_DAY">उद्या मुदत संपणार (Final 1 Day Alert)</option>
                  <option value="ON_EXPIRY">मुदत संपली (Expired / Watermark Active Alert)</option>
                  <option value="MANUAL">कस्टम संदेश (Custom Message)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  कस्टम संदेश (पर्यायी — रिकामे ठेवल्यास स्वयंचलित प्रमाणित संदेश जाईल)
                </label>
                <textarea
                  rows={3}
                  value={notificationCustomMsg}
                  onChange={(e) => setNotificationCustomMsg(e.target.value)}
                  placeholder="उदा. आपल्या ग्रो व्ह्यू व्हीआयपी प्लॅनची मुदत लवकरच संपत आहे..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setNotificationTargetUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isSendingNotification}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25"
                >
                  {isSendingNotification ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      पाठवत आहे...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      सूचना पाठवा
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL PLAN ACTIVATION MODAL */}
      {isGrantModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-white">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-slate-950 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                  ॲडमिन थेट ॲक्सेस
                </span>
                <h3 className="text-xl font-black mt-1">मॅन्युअल सबस्क्रिप्शन सुरू करा</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGrantModalOpen(false)}
                className="p-1 rounded-full bg-black/20 text-slate-950 hover:bg-black/30"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGrantCustomPlan} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">ग्राहक ईमेल पत्ता *</label>
                <input
                  type="email"
                  required
                  value={grantTargetEmail}
                  onChange={(e) => setGrantTargetEmail(e.target.value)}
                  placeholder="उदा. customer@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">प्लॅन निवडा</label>
                <select
                  value={grantPlanId}
                  onChange={(e: any) => setGrantPlanId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="starter-monthly">Starter Monthly (₹99 - 1 Business)</option>
                  <option value="business-monthly">Business Monthly (₹299 - 5 Businesses)</option>
                  <option value="starter-yearly">Starter Yearly (₹599 - 1 Business)</option>
                  <option value="business-yearly">Business Yearly (₹1199 - 5 Businesses)</option>
                  <option value="business-team">Business / Team Access (Custom 10-20+ Members)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">कालावधी (दिवस)</label>
                  <input
                    type="number"
                    value={grantDurationDays}
                    onChange={(e) => setGrantDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">ब्रँड्स संख्या</label>
                  <input
                    type="number"
                    value={grantBusinessLimit}
                    onChange={(e) => setGrantBusinessLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">टीम सदस्य मर्यादा</label>
                  <input
                    type="number"
                    value={grantTeamLimit}
                    onChange={(e) => setGrantTeamLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsGrantModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={isGranting}
                  className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25"
                >
                  {isGranting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      प्रक्रिया सुरू आहे...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      सबस्क्रिप्शन ॲक्टिव्हेट करा
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Subscription Request Modal */}
      {rejectModalRequest && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl w-full max-w-md p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                सबस्क्रिप्शन विनंती नाकारा (Reject)
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalRequest(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              ग्राहक: <strong className="text-white">{rejectModalRequest.user_name || rejectModalRequest.user_email}</strong>
              <br />
              प्लॅन: <strong className="text-amber-400">{rejectModalRequest.plan_name} (₹{rejectModalRequest.amount})</strong>
              <br />
              <span className="text-slate-400 text-[11px]">
                ही विनंती नाकारल्यास वापरकर्त्याचा प्लॅन सक्रिय होणार नाही व त्यांना नाकारल्याची सूचना जाईल.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">नाकारण्याचे कारण (Rejection Reason):</label>
              <textarea
                rows={3}
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder="उदा. पेमेंट स्क्रीनशॉट/ट्रान्झॅक्शन आयडी बँक रेकॉर्डशी जुळत नाही."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalRequest(null)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700"
              >
                रद्द करा
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isRejectingId === rejectModalRequest.id}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                {isRejectingId === rejectModalRequest.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    नाकारत आहे...
                  </>
                ) : (
                  'खात्रीने नाकारा'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

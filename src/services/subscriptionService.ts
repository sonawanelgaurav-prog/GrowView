import {
  PlanId,
  PlanConfig,
  ExpiryReminderNotification,
  UserSubscriptionRecord,
  TeamMemberRecord,
  TeamLeadRecord,
  PaymentOrderRecord,
  SubscriptionApprovalRequest,
} from '../types';
import { STANDARD_PLANS } from '../config/plansConfig';
import { getStoredAuthToken } from './authService';

export type { PlanConfig, ExpiryReminderNotification, SubscriptionApprovalRequest };

function getAuthHeaders(): Record<string, string> {
  const token = getStoredAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface UserSubscriptionResolution {
  subscription: UserSubscriptionRecord;
  planConfig: PlanConfig;
  isPaidActive: boolean;
  businessLimit: number;
  canExportClean: boolean;
  freePostersLeft: number;
  monthlyFreeCleanUsed: number;
  needsWatermark: boolean;
  isTeamMember: boolean;
  teamRole?: 'business_admin' | 'team_member';
  teamOwnerEmail?: string;
  daysRemaining: number;
}

export interface ExportAuthResult {
  allowed: boolean;
  needsWatermark: boolean;
  planId: PlanId;
  cleanPostersRemaining: number;
  monthlyFreeCleanUsed: number;
  message: string;
}

export interface AdminSubscriptionOverviewData {
  metrics: {
    totalUsersCount: number;
    activePaidCount: number;
    freeUsersCount: number;
    expiredCount: number;
    pendingApprovalCount?: number;
    totalRevenue: number;
    teamLeadsCount: number;
    usageStats: {
      totalExports: number;
      cleanExports: number;
      watermarkedExports: number;
      premiumExports: number;
    };
  };
  plans: PlanConfig[];
  subscriptions: UserSubscriptionRecord[];
  orders: PaymentOrderRecord[];
  teamLeads: TeamLeadRecord[];
  notifications?: ExpiryReminderNotification[];
  approvalRequests?: SubscriptionApprovalRequest[];
}

export interface ExpiringSubscriptionsAdminData {
  counts: {
    expiresIn7Days: number;
    expiresIn3Days: number;
    expiresTomorrow: number;
    expired: number;
  };
  lists: {
    expiresIn7Days: Array<UserSubscriptionRecord & { daysRemaining: number }>;
    expiresIn3Days: Array<UserSubscriptionRecord & { daysRemaining: number }>;
    expiresTomorrow: Array<UserSubscriptionRecord & { daysRemaining: number }>;
    expired: Array<UserSubscriptionRecord & { daysRemaining: number }>;
  };
  recentNotifications: ExpiryReminderNotification[];
}

const LOCAL_SUB_KEY = 'growview_user_subscription_cache';

/**
 * Fetches all available active plans from the server, with fallback to standard plans config.
 */
export async function fetchAvailablePlans(): Promise<PlanConfig[]> {
  try {
    const res = await fetch('/api/subscription/plans');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
        return data.plans;
      }
    }
  } catch (err) {
    console.warn('[SUBSCRIPTION SERVICE] Failed to fetch plans from server, using standard config:', err);
  }
  return STANDARD_PLANS;
}

export async function fetchSubscriptionStatus(
  userId: string,
  userEmail?: string
): Promise<UserSubscriptionResolution> {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (userEmail) params.append('userEmail', userEmail);

    const res = await fetch(`/api/subscription/status?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(LOCAL_SUB_KEY, JSON.stringify(data));
        return data as UserSubscriptionResolution;
      }
    }
  } catch (err) {
    console.warn('[SUBSCRIPTION SERVICE] API offline or error, checking local cache:', err);
  }

  // Fallback from cache or default Free Plan with 3 monthly clean posters
  try {
    const cached = localStorage.getItem(LOCAL_SUB_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  const now = new Date();
  const defaultFreePlan = STANDARD_PLANS[0];
  return {
    subscription: {
      id: `sub_local_${userId}`,
      user_id: userId,
      plan_id: 'free',
      plan_name: defaultFreePlan.plan_name,
      billing_cycle: 'free',
      payment_id: 'free_tier',
      order_id: 'order_free_default',
      subscription_status: 'ACTIVE',
      start_date: now.toISOString(),
      expiry_date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      business_limit: 1,
      team_member_limit: 0,
      poster_limit: -1,
      watermark_status: 'WATERMARK_AFTER_3_FREE',
      monthly_free_clean_used: 0,
      current_month_key: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    planConfig: defaultFreePlan,
    isPaidActive: false,
    businessLimit: 1,
    canExportClean: true,
    freePostersLeft: 3,
    monthlyFreeCleanUsed: 0,
    needsWatermark: false,
    isTeamMember: false,
    daysRemaining: 365,
  };
}

export async function createPaymentOrder(
  userId: string,
  userEmail: string,
  planId: string
): Promise<PaymentOrderRecord> {
  const res = await fetch('/api/subscription/create-order', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, userEmail, planId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'ऑर्डर तयार करण्यात अडचण आली.');
  }
  return data.order;
}

export interface VerifyPaymentResponse {
  subscription: UserSubscriptionRecord;
  approvalRequest?: SubscriptionApprovalRequest;
  requiresApproval?: boolean;
  message?: string;
}

export async function verifyPaymentServerSide(
  orderId: string,
  paymentId: string,
  userId: string,
  planId: string,
  paymentMethod: string = 'upi',
  userName?: string,
  userPhone?: string
): Promise<VerifyPaymentResponse> {
  const res = await fetch('/api/subscription/verify-payment', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderId, paymentId, userId, planId, paymentMethod, userName, userPhone }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पेमेंट पडताळणी अयशस्वी झाली.');
  }
  return {
    subscription: data.subscription,
    approvalRequest: data.approvalRequest,
    requiresApproval: data.requiresApproval !== undefined ? data.requiresApproval : true,
    message: data.message,
  };
}

export async function authorizeExportServerSide(
  userId: string,
  userEmail?: string
): Promise<ExportAuthResult> {
  const res = await fetch('/api/subscription/record-export', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userId, userEmail }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'कृपया पोस्टर्स डाऊनलोड करण्यासाठी लॉगिन करा.');
  }
  return data as ExportAuthResult;
}

export async function submitTeamLead(leadData: {
  name: string;
  companyName: string;
  mobileNumber: string;
  email: string;
  teamMembersCount: string;
  businessesCount: string;
  requirements: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/subscription/team-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'माहिती पाठवताना त्रुटी आली.');
  }
  return data;
}

export async function fetchUserNotifications(): Promise<{
  notifications: ExpiryReminderNotification[];
  unreadCount: number;
}> {
  try {
    const res = await fetch('/api/notifications/my', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
      };
    }
  } catch (err) {
    console.warn('[SUBSCRIPTION SERVICE] Failed to fetch notifications:', err);
  }
  return { notifications: [], unreadCount: 0 };
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notificationId }),
    });
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

export async function fetchExpiringSubscriptionsAdmin(): Promise<ExpiringSubscriptionsAdminData> {
  const res = await fetch('/api/admin/expiring-subscriptions', {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'मुदत संपणाऱ्या सबस्क्रिप्शन डेटा मिळवण्यात अडचण आली.');
  }
  return data as ExpiringSubscriptionsAdminData;
}

export async function adminSendExpiryNotification(payload: {
  userId: string;
  subscriptionId: string;
  stage: '7_DAYS' | '3_DAYS' | '1_DAY' | 'ON_EXPIRY' | 'MANUAL';
  customMessage?: string;
}): Promise<ExpiryReminderNotification> {
  const res = await fetch('/api/admin/send-expiry-notification', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'सूचना पाठवण्यात अडचण आली.');
  }
  return data.notification;
}

export async function adminSavePlan(planData: PlanConfig): Promise<PlanConfig> {
  const res = await fetch('/api/admin/plans/save', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(planData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'प्लॅन सेव्ह करताना अडचण आली.');
  }
  return data.plan;
}

export async function adminCreateCustomPlan(planData: Partial<PlanConfig>): Promise<PlanConfig> {
  const res = await fetch('/api/admin/plans/create', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(planData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'कस्टम प्लॅन तयार करताना अडचण आली.');
  }
  return data.plan;
}

export async function adminTogglePlanStatus(planId: string): Promise<PlanConfig> {
  const res = await fetch('/api/admin/plans/toggle-status', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ planId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'स्टेटस बदलताना अडचण आली.');
  }
  return data.plan;
}

export async function fetchTeamMembers(ownerId: string): Promise<TeamMemberRecord[]> {
  try {
    const res = await fetch(`/api/team/members?ownerId=${encodeURIComponent(ownerId)}`, {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.members)) {
        try {
          localStorage.setItem(`growview_team_${ownerId}`, JSON.stringify(data.members));
        } catch {}
        return data.members;
      }
    }
  } catch (err) {
    console.warn('[TEAM SERVICE] Server fetch failed, falling back to local storage:', err);
  }

  // Resilient fallback from localStorage
  try {
    const cached = localStorage.getItem(`growview_team_${ownerId}`);
    if (cached) return JSON.parse(cached);
  } catch {}
  return [];
}

export async function inviteTeamMember(payload: {
  ownerId: string;
  ownerEmail: string;
  ownerBusinessName: string;
  memberEmail: string;
  memberName: string;
  role: 'business_admin' | 'team_member';
  assignedBusinessIds: string[];
  isVIP?: boolean;
}): Promise<TeamMemberRecord> {
  try {
    const res = await fetch('/api/team/invite', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.success && data.member) {
      // Update local storage cache
      try {
        const cached = localStorage.getItem(`growview_team_${payload.ownerId}`);
        const list: TeamMemberRecord[] = cached ? JSON.parse(cached) : [];
        list.push(data.member);
        localStorage.setItem(`growview_team_${payload.ownerId}`, JSON.stringify(list));
      } catch {}
      return data.member;
    }
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'टीम सदस्य जोडताना त्रुटी आली.');
    }
  } catch (err: any) {
    // If network error, create local member record
    if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError')) {
      throw err;
    }
    const localMember: TeamMemberRecord = {
      id: `tm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      owner_id: payload.ownerId,
      owner_email: payload.ownerEmail,
      owner_business_name: payload.ownerBusinessName,
      member_email: payload.memberEmail.toLowerCase().trim(),
      member_name: payload.memberName.trim(),
      role: payload.role,
      status: 'active',
      assigned_business_ids: payload.assignedBusinessIds,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    try {
      const cached = localStorage.getItem(`growview_team_${payload.ownerId}`);
      const list: TeamMemberRecord[] = cached ? JSON.parse(cached) : [];
      list.push(localMember);
      localStorage.setItem(`growview_team_${payload.ownerId}`, JSON.stringify(list));
    } catch {}
    return localMember;
  }
  throw new Error('टीम सदस्य जोडताना त्रुटी आली.');
}

export async function removeTeamMember(ownerId: string, memberId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/team/remove', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ownerId, memberId }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      try {
        const cached = localStorage.getItem(`growview_team_${ownerId}`);
        if (cached) {
          const list: TeamMemberRecord[] = JSON.parse(cached);
          localStorage.setItem(`growview_team_${ownerId}`, JSON.stringify(list.filter(m => m.id !== memberId)));
        }
      } catch {}
      return true;
    }
  } catch (err) {
    console.warn('[TEAM SERVICE] Remove failed on server, updating local cache:', err);
  }

  // Update local cache
  try {
    const cached = localStorage.getItem(`growview_team_${ownerId}`);
    if (cached) {
      const list: TeamMemberRecord[] = JSON.parse(cached);
      localStorage.setItem(`growview_team_${ownerId}`, JSON.stringify(list.filter(m => m.id !== memberId)));
    }
  } catch {}
  return true;
}

export async function toggleTeamMemberStatus(ownerId: string, memberId: string): Promise<TeamMemberRecord> {
  try {
    const res = await fetch('/api/team/toggle-status', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ownerId, memberId }),
    });
    const data = await res.json();
    if (res.ok && data.success && data.member) {
      try {
        const cached = localStorage.getItem(`growview_team_${ownerId}`);
        if (cached) {
          const list: TeamMemberRecord[] = JSON.parse(cached);
          const updated = list.map(m => m.id === memberId ? data.member : m);
          localStorage.setItem(`growview_team_${ownerId}`, JSON.stringify(updated));
        }
      } catch {}
      return data.member;
    }
  } catch (err) {
    console.warn('[TEAM SERVICE] Toggle status failed on server, updating locally:', err);
  }

  // Toggle locally
  try {
    const cached = localStorage.getItem(`growview_team_${ownerId}`);
    if (cached) {
      const list: TeamMemberRecord[] = JSON.parse(cached);
      const target = list.find(m => m.id === memberId);
      if (target) {
        target.status = target.status === 'active' ? 'deactivated' : 'active';
        target.updated_at = new Date().toISOString();
        localStorage.setItem(`growview_team_${ownerId}`, JSON.stringify(list));
        return target;
      }
    }
  } catch {}
  throw new Error('स्टेटस बदलताना त्रुटी आली.');
}

export async function fetchAdminSubscriptionOverview(): Promise<AdminSubscriptionOverviewData> {
  const res = await fetch('/api/admin/subscription-overview', {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'डॅशबोर्ड डेटा मिळवण्यात अडचण आली.');
  }
  return data;
}

export async function adminActivateCustomPlan(payload: {
  userId: string;
  userEmail: string;
  planId: string;
  durationDays: number;
  businessLimit: number;
  teamLimit: number;
}): Promise<UserSubscriptionRecord> {
  const res = await fetch('/api/admin/activate-custom-plan', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'कस्टम प्लॅन ॲक्टिव्हेट करताना त्रुटी आली.');
  }
  return data.subscription;
}

export async function adminUpdateLeadStatus(leadId: string, status: TeamLeadRecord['status']): Promise<TeamLeadRecord> {
  const res = await fetch('/api/admin/update-lead-status', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ leadId, status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'स्टेटस अपडेट अयशस्वी.');
  }
  return data.lead;
}

export async function fetchAdminApprovalRequests(): Promise<SubscriptionApprovalRequest[]> {
  try {
    const res = await fetch('/api/admin/subscription-approvals', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      return data.requests || [];
    }
  } catch (err) {
    console.warn('[SUBSCRIPTION SERVICE] Failed to fetch approval requests:', err);
  }
  return [];
}

export async function adminApproveSubscription(approvalId: string, notes?: string): Promise<{
  subscription: UserSubscriptionRecord;
  approvalRequest: SubscriptionApprovalRequest;
}> {
  const res = await fetch('/api/admin/approve-subscription', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ approvalId, notes }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'सबस्क्रिप्शन मंजूर करताना त्रुटी आली.');
  }
  return data;
}

export async function adminRejectSubscription(approvalId: string, reason?: string): Promise<{
  approvalRequest: SubscriptionApprovalRequest;
}> {
  const res = await fetch('/api/admin/reject-subscription', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ approvalId, reason }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'सबस्क्रिप्शन नाकारताना त्रुटी आली.');
  }
  return data;
}

// ============================================================================
// GROWVIEW MANUAL UPI PAYMENT & VERIFICATION FLOW CLIENT APIS (Req 1 - 22)
// ============================================================================

export async function fetchPaymentSettings(): Promise<import('../types').AdminPaymentSettings> {
  const res = await fetch('/api/payment-settings');
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पेमेंट सेटींग्ज लोड करताना त्रुटी आली.');
  }
  return data.settings;
}

export async function updatePaymentSettingsAdmin(
  settings: Partial<import('../types').AdminPaymentSettings>
): Promise<import('../types').AdminPaymentSettings> {
  const res = await fetch('/api/admin/payment-settings', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पेमेंट सेटींग्ज अपडेट करताना त्रुटी आली.');
  }
  return data.settings;
}

export async function submitPaymentVerification(payload: {
  planId: string;
  amount: number;
  transactionId: string;
  screenshotUrl: string;
  paymentDate?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  businessName?: string;
}): Promise<{ payment: import('../types').PaymentVerificationRecord; message: string }> {
  const res = await fetch('/api/payment/submit-verification', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पेमेंट पडताळणी सबमिट करताना त्रुटी आली.');
  }
  return data;
}

export async function fetchMyPaymentHistory(): Promise<import('../types').PaymentVerificationRecord[]> {
  try {
    const res = await fetch('/api/payment/my-history', {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.payments)) {
        return data.payments;
      }
    }
  } catch (err) {
    console.warn('[SUBSCRIPTION SERVICE] Failed to fetch payment history:', err);
  }
  return [];
}

export async function fetchAdminPayments(): Promise<{
  payments: import('../types').PaymentVerificationRecord[];
  metrics: import('../types').PaymentOverviewMetrics;
}> {
  const res = await fetch('/api/admin/payments', {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पेमेंट पडताळणी यादी लोड करताना त्रुटी आली.');
  }
  return {
    payments: data.payments || [],
    metrics: data.metrics || {
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      todayRevenue: 0,
      thisMonthRevenue: 0,
      activePremiumUsers: 0,
      expiredSubscriptions: 0,
    },
  };
}

export async function fetchPaymentOverviewMetrics(): Promise<import('../types').PaymentOverviewMetrics> {
  const res = await fetch('/api/admin/payment-overview', {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पेमेंट मेट्रिक्स लोड करताना त्रुटी आली.');
  }
  return data.metrics;
}

export async function adminApprovePayment(
  paymentId: string,
  notes?: string
): Promise<{
  payment: import('../types').PaymentVerificationRecord;
  subscription: UserSubscriptionRecord;
  message: string;
}> {
  const res = await fetch('/api/admin/payment/approve', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ paymentId, notes }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पेमेंट मंजूर करताना त्रुटी आली.');
  }
  return data;
}

export async function adminRejectPayment(
  paymentId: string,
  reason: string
): Promise<{
  payment: import('../types').PaymentVerificationRecord;
  message: string;
}> {
  const res = await fetch('/api/admin/payment/reject', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ paymentId, reason }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पेमेंट नाकारताना त्रुटी आली.');
  }
  return data;
}

export async function fetchFreeUsageStatus(): Promise<import('../types').FreeUsageRecord> {
  const res = await fetch('/api/subscription/free-usage', {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'मोफत कोटा लोड करताना त्रुटी आली.');
  }
  return data;
}

export async function checkUserPostCreationAccess(): Promise<{
  allowed: boolean;
  isPaid: boolean;
  freePostsUsed: number;
  freePostsRemaining: number;
  error?: string;
  notificationMsg?: string;
}> {
  const res = await fetch('/api/subscription/check-access', {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'ॲक्सेस तपासताना त्रुटी आली.');
  }
  return data;
}

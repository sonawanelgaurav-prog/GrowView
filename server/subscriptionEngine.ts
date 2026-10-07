import fs from 'fs';
import path from 'path';
import {
  PlanId,
  SubscriptionStatus,
  UserSubscriptionRecord,
  TeamMemberRecord,
  TeamLeadRecord,
  PaymentOrderRecord,
  PlanConfig,
  ExpiryReminderNotification,
  SubscriptionApprovalRequest,
  PaymentVerificationRecord,
  AdminPaymentSettings,
  FreeUsageRecord,
  PaymentOverviewMetrics,
} from '../src/types';

export const DEFAULT_PAYMENT_SETTINGS: AdminPaymentSettings = {
  upiId: 'growview@upi',
  upiName: 'GrowView Media & Tech Pvt Ltd',
  qrCodeUrl: '',
  instructions: 'Pay using Google Pay, PhonePe, Paytm, BHIM or any UPI application. Scan the QR code or copy the UPI ID below. After payment, enter your UPI Transaction ID / UTR number and upload the payment screenshot for verification.',
  supportPhone: '+91 7774914906',
  supportEmail: 'support@growview.com',
  isEnabled: true,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_PLANS: Record<string, PlanConfig> = {
  free: {
    plan_id: 'free',
    plan_name: 'FREE',
    nameMarathi: 'मोफत प्लॅन',
    price: 0,
    originalPrice: 0,
    billing_cycle: 'free',
    periodLabel: 'Forever Free',
    periodLabelMarathi: 'कायमस्वरूपी मोफत',
    business_limit: 1,
    team_member_limit: 0,
    poster_limit: -1,
    features: [
      '3 watermark-free posters every month',
      'After 3 free posters → unlimited poster creation with GROW VIEW watermark',
      'No premium features',
      'No premium templates',
      'No premium export',
    ],
    watermark_status: 'WATERMARK_AFTER_3_FREE',
    is_active: true,
    display_order: 1,
    description: 'Start creating festivals and business posters for free.',
    button_text: 'CURRENT PLAN',
    badge: 'FREE FOREVER',
    is_popular: false,
    highlight_text: '3 FREE WATERMARK-FREE POSTERS EVERY MONTH',
    premium_access: false,
    premium_templates: false,
    premium_export: false,
  },
  'starter-monthly': {
    plan_id: 'starter-monthly',
    plan_name: 'STARTER MONTHLY',
    nameMarathi: 'स्टार्टर मासिक',
    price: 99,
    originalPrice: 249,
    billing_cycle: 'monthly',
    periodLabel: '/ Month',
    periodLabelMarathi: '/ महिना',
    business_limit: 1,
    team_member_limit: 0,
    poster_limit: -1,
    features: [
      '1 Business',
      'Premium access',
      'No GROW VIEW watermark',
      'Premium templates',
      'Premium export',
    ],
    watermark_status: 'NO_WATERMARK',
    is_active: true,
    display_order: 2,
    description: 'Perfect for single business owners and freelancers.',
    button_text: 'BUY NOW',
    badge: 'STARTER',
    is_popular: false,
    highlight_text: 'NO GROW VIEW WATERMARK',
    premium_access: true,
    premium_templates: true,
    premium_export: true,
  },
  'business-monthly': {
    plan_id: 'business-monthly',
    plan_name: 'BUSINESS MONTHLY',
    nameMarathi: 'बिझनेस मासिक',
    price: 299,
    originalPrice: 599,
    billing_cycle: 'monthly',
    periodLabel: '/ Month',
    periodLabelMarathi: '/ महिना',
    business_limit: 5,
    team_member_limit: 0,
    poster_limit: -1,
    features: [
      'Up to 5 Businesses',
      'Premium access',
      'No GROW VIEW watermark',
      'Premium templates',
      'Premium export',
      'Multiple business profiles',
    ],
    watermark_status: 'NO_WATERMARK',
    is_active: true,
    display_order: 3,
    description: 'Ideal for entrepreneurs managing multiple business brands.',
    button_text: 'BUY NOW',
    badge: 'MULTI-BRAND',
    is_popular: false,
    highlight_text: 'NO GROW VIEW WATERMARK',
    premium_access: true,
    premium_templates: true,
    premium_export: true,
  },
  'starter-yearly': {
    plan_id: 'starter-yearly',
    plan_name: 'STARTER YEARLY',
    nameMarathi: 'स्टार्टर वार्षिक',
    price: 599,
    originalPrice: 1199,
    billing_cycle: 'yearly',
    periodLabel: '/ Year',
    periodLabelMarathi: '/ वर्ष (₹50/महिना)',
    business_limit: 1,
    team_member_limit: 0,
    poster_limit: -1,
    features: [
      '1 Business',
      'Premium access',
      'No GROW VIEW watermark',
      'Premium templates',
      'Premium export',
    ],
    watermark_status: 'NO_WATERMARK',
    is_active: true,
    display_order: 4,
    description: '365 days of uninterrupted watermark-free branding.',
    button_text: 'BUY NOW',
    badge: 'BEST SELLER',
    is_popular: true,
    highlight_text: 'NO GROW VIEW WATERMARK',
    premium_access: true,
    premium_templates: true,
    premium_export: true,
  },
  'business-yearly': {
    plan_id: 'business-yearly',
    plan_name: 'BUSINESS YEARLY',
    nameMarathi: 'बिझनेस वार्षिक',
    price: 1199,
    originalPrice: 2499,
    billing_cycle: 'yearly',
    periodLabel: '/ Year',
    periodLabelMarathi: '/ वर्ष (₹100/महिना)',
    business_limit: 5,
    team_member_limit: 0,
    poster_limit: -1,
    features: [
      'Up to 5 Businesses',
      'Premium access',
      'No GROW VIEW watermark',
      'Premium templates',
      'Premium export',
      'Multiple business profiles',
    ],
    watermark_status: 'NO_WATERMARK',
    is_active: true,
    display_order: 5,
    description: 'Maximum savings for established multi-brand businesses.',
    button_text: 'BUY NOW',
    badge: 'BEST VALUE',
    is_popular: false,
    highlight_text: 'NO GROW VIEW WATERMARK',
    premium_access: true,
    premium_templates: true,
    premium_export: true,
  },
  'business-team': {
    plan_id: 'business-team',
    plan_name: 'BUSINESS / TEAM',
    nameMarathi: 'बिझनेस / टीम',
    price: 0,
    originalPrice: 0,
    billing_cycle: 'custom',
    periodLabel: 'CUSTOM PRICING',
    periodLabelMarathi: 'कस्टम दर',
    business_limit: 15,
    team_member_limit: 20,
    poster_limit: -1,
    features: [
      'For 10–20+ team members',
      'Multiple business profiles & branding',
      'Admin dashboard & member role control',
      'No GROW VIEW watermark',
      'Premium templates & 4K exports',
      'Dedicated priority support',
    ],
    watermark_status: 'NO_WATERMARK',
    is_active: true,
    display_order: 6,
    description: 'Need GROW VIEW for your entire team? For businesses, agencies and organizations with 10–20+ team members.',
    button_text: 'CONTACT US',
    badge: 'ENTERPRISE & AGENCIES',
    is_popular: false,
    highlight_text: 'FOR 10–20+ TEAM MEMBERS',
    premium_access: true,
    premium_templates: true,
    premium_export: true,
  },
};

// Backwards compatibility alias
export const SUBSCRIPTION_PLANS = DEFAULT_PLANS;

interface StoreData {
  plans: Record<string, PlanConfig>;
  subscriptions: Record<string, UserSubscriptionRecord>;
  orders: PaymentOrderRecord[];
  payments: PaymentVerificationRecord[];
  paymentSettings: AdminPaymentSettings;
  teamMembers: TeamMemberRecord[];
  teamLeads: TeamLeadRecord[];
  notifications: ExpiryReminderNotification[];
  approvalRequests: SubscriptionApprovalRequest[];
  freeUsages: Record<string, FreeUsageRecord>;
  usageStats: {
    totalExports: number;
    cleanExports: number;
    watermarkedExports: number;
    premiumExports: number;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'subscriptionStore.json');

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      const store: StoreData = {
        plans: parsed.plans && Object.keys(parsed.plans).length > 0 ? parsed.plans : { ...DEFAULT_PLANS },
        subscriptions: parsed.subscriptions || {},
        orders: parsed.orders || [],
        payments: parsed.payments || [],
        paymentSettings: parsed.paymentSettings || { ...DEFAULT_PAYMENT_SETTINGS },
        teamMembers: parsed.teamMembers || [],
        teamLeads: parsed.teamLeads || [],
        notifications: parsed.notifications || [],
        approvalRequests: parsed.approvalRequests || [],
        freeUsages: parsed.freeUsages || {},
        usageStats: parsed.usageStats || {
          totalExports: 142,
          cleanExports: 98,
          watermarkedExports: 44,
          premiumExports: 86,
        },
      };

      // Ensure 5 standard plans exist in loaded store
      for (const [key, plan] of Object.entries(DEFAULT_PLANS)) {
        if (!store.plans[key]) {
          store.plans[key] = plan;
        }
      }

      // Seed demo sample subscriptions for expiring categories if missing
      seedExpiringSubscriptionsIfEmpty(store);

      return store;
    }
  } catch (err) {
    console.warn('[SUBSCRIPTION ENGINE] Notice loading store:', err);
  }

  const now = new Date();
  const currentMonthKey = getCurrentMonthKey();
  const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();

  const initialStore: StoreData = {
    plans: { ...DEFAULT_PLANS },
    subscriptions: {
      'usr-admin-01': {
        id: 'sub-admin-01',
        user_id: 'usr-admin-01',
        plan_id: 'business-yearly',
        plan_name: 'BUSINESS YEARLY',
        billing_cycle: 'yearly',
        payment_id: 'pay_gv_master_verified',
        order_id: 'order_gv_initial_master',
        subscription_status: 'ACTIVE',
        start_date: now.toISOString(),
        expiry_date: oneYearLater,
        business_limit: 5,
        team_member_limit: 5,
        poster_limit: -1,
        watermark_status: 'NO_WATERMARK',
        monthly_free_clean_used: 0,
        current_month_key: currentMonthKey,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      'usr-cust-01': {
        id: 'sub-cust-01',
        user_id: 'usr-cust-01',
        plan_id: 'free',
        plan_name: 'FREE',
        billing_cycle: 'free',
        payment_id: 'free_tier',
        order_id: 'order_free_cust01',
        subscription_status: 'ACTIVE',
        start_date: now.toISOString(),
        expiry_date: oneYearLater,
        business_limit: 1,
        team_member_limit: 0,
        poster_limit: -1,
        watermark_status: 'WATERMARK_AFTER_3_FREE',
        monthly_free_clean_used: 2,
        current_month_key: currentMonthKey,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      'usr-cust-02': {
        id: 'sub-cust-02',
        user_id: 'usr-cust-02',
        plan_id: 'starter-monthly',
        plan_name: 'STARTER MONTHLY',
        billing_cycle: 'monthly',
        payment_id: 'pay_UPI_rajmudra_99',
        order_id: 'order_gv_rajmudra_99',
        subscription_status: 'ACTIVE',
        start_date: now.toISOString(),
        expiry_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        business_limit: 1,
        team_member_limit: 0,
        poster_limit: -1,
        watermark_status: 'NO_WATERMARK',
        monthly_free_clean_used: 0,
        current_month_key: currentMonthKey,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    },
    orders: [
      {
        order_id: 'order_gv_rajmudra_99',
        user_id: 'usr-cust-02',
        user_email: 'rajmudra.realty@gmail.com',
        plan_id: 'starter-monthly',
        plan_name: 'STARTER MONTHLY',
        amount: 99,
        currency: 'INR',
        status: 'paid',
        payment_id: 'pay_UPI_rajmudra_99',
        payment_method: 'upi',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        verified_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    teamMembers: [],
    teamLeads: [
      {
        id: 'lead-01',
        name: 'विजयराव देशमुख',
        company_name: 'देशमुख मल्टिस्टेट को-ऑप बँक',
        mobile_number: '+91 98224 88771',
        email: 'deshmukh.bank@gmail.com',
        team_members_count: '15-20',
        businesses_count: '8',
        requirements: '१५ शाखा व्यवस्थापकांसाठी दररोजचे बँकिंग व सण पोस्टर्स तयार करणे.',
        message: 'आम्हाला संपूर्ण टीमसाठी ॲक्सेस हवा आहे. कृपया लवकरात लवकर संपर्क करा.',
        status: 'new',
        created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
    notifications: [],
    approvalRequests: [],
    payments: [],
    paymentSettings: { ...DEFAULT_PAYMENT_SETTINGS },
    freeUsages: {},
    usageStats: {
      totalExports: 142,
      cleanExports: 98,
      watermarkedExports: 44,
      premiumExports: 86,
    },
  };

  seedExpiringSubscriptionsIfEmpty(initialStore);
  saveStore(initialStore);
  return initialStore;
}

function seedExpiringSubscriptionsIfEmpty(store: StoreData) {
  const now = new Date();
  const currentMonthKey = getCurrentMonthKey();

  if (!store.payments || store.payments.length === 0) {
    store.payments = [
      {
        id: 'pay_rec_demo_pending',
        order_id: 'ord_gv_rahul_299',
        payment_id: 'pay_UPI_rahul_299',
        user_id: 'usr-cust-02',
        user_name: 'राहुल पाटील (पाटील सुपरमार्ट)',
        user_email: 'rahul.patil@gmail.com',
        user_phone: '+91 98220 12345',
        business_name: 'पाटील सुपरमार्ट',
        plan_id: 'business-monthly',
        plan_name: 'BUSINESS MONTHLY',
        billing_cycle: 'monthly',
        amount: 299,
        transaction_id: 'UPI/528392019482/PAY',
        screenshot_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        payment_date: new Date().toISOString().split('T')[0],
        submitted_at: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
        status: 'pending',
        previous_plan: 'free',
        previous_status: 'ACTIVE',
      },
      {
        id: 'pay_rec_demo_approved',
        order_id: 'ord_gv_sagar_1199',
        payment_id: 'pay_UPI_sagar_1199',
        user_id: 'usr_sagar_kadam',
        user_name: 'सागर कदम (कादंबरी ज्वेलर्स)',
        user_email: 'sagar.kadam@gmail.com',
        user_phone: '+91 98901 23456',
        business_name: 'कादंबरी ज्वेलर्स',
        plan_id: 'business-yearly',
        plan_name: 'BUSINESS YEARLY',
        billing_cycle: 'yearly',
        amount: 1199,
        transaction_id: 'UPI/492019385012/APPROVED',
        screenshot_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        payment_date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        submitted_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        verified_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
        verified_by: 'admin@growview.com',
        admin_notes: 'SBI UPI द्वारे ₹1199 प्राप्त झाले आणि कन्फर्म झाले.',
      },
      {
        id: 'pay_rec_demo_rejected',
        order_id: 'ord_gv_nilesh_599',
        payment_id: 'pay_UPI_nilesh_599',
        user_id: 'usr-exp-0d',
        user_name: 'निलेश चव्हाण (चव्हाण हार्डवेअर)',
        user_email: 'nilesh.chavan@gmail.com',
        user_phone: '+91 97654 32109',
        business_name: 'चव्हाण हार्डवेअर',
        plan_id: 'starter-yearly',
        plan_name: 'STARTER YEARLY',
        billing_cycle: 'yearly',
        amount: 599,
        transaction_id: 'UPI/000000000000/INVALID',
        screenshot_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        payment_date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        submitted_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'rejected',
        verified_at: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
        verified_by: 'admin@growview.com',
        rejection_reason: 'बँक खात्यात रक्कम जमा झालेली नाही व UTR क्रमांक अमान्य आहे.',
        admin_notes: 'Duplicate or invalid UTR reported.',
      },
    ];
  }

  if (!store.approvalRequests || store.approvalRequests.length === 0) {
    store.approvalRequests = [
      {
        id: 'appr_demo_01',
        order_id: 'ord_gv_rahul_299',
        payment_id: 'pay_UPI_rahul_299',
        user_id: 'usr-cust-02',
        user_email: 'rahul.patil@gmail.com',
        user_name: 'राहुल पाटील (पाटील सुपरमार्ट)',
        user_phone: '+91 98220 12345',
        business_name: 'पाटील सुपरमार्ट',
        plan_id: 'business-monthly',
        plan_name: 'BUSINESS MONTHLY',
        billing_cycle: 'monthly',
        amount: 299,
        payment_method: 'upi',
        transaction_id: 'UPI/528392019482/PAY',
        screenshot_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        status: 'pending',
        requested_at: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
      },
    ];
  }

  // Expiring in 7 Days: Rahul Patil (Starter Monthly ₹99)
  if (!store.subscriptions['usr-exp-7d']) {
    const exp7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    store.subscriptions['usr-exp-7d'] = {
      id: 'sub-exp-7d',
      user_id: 'usr-exp-7d',
      plan_id: 'starter-monthly',
      plan_name: 'STARTER MONTHLY',
      billing_cycle: 'monthly',
      payment_id: 'pay_rahul_99',
      order_id: 'ord_rahul_99',
      subscription_status: 'ACTIVE',
      start_date: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      expiry_date: exp7.toISOString(),
      business_limit: 1,
      team_member_limit: 0,
      poster_limit: -1,
      watermark_status: 'NO_WATERMARK',
      monthly_free_clean_used: 0,
      current_month_key: currentMonthKey,
      created_at: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: now.toISOString(),
    };
  }

  // Expiring in 3 Days: Mahesh Shinde (Business Yearly ₹1199)
  if (!store.subscriptions['usr-exp-3d']) {
    const exp3 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    store.subscriptions['usr-exp-3d'] = {
      id: 'sub-exp-3d',
      user_id: 'usr-exp-3d',
      plan_id: 'business-yearly',
      plan_name: 'BUSINESS YEARLY',
      billing_cycle: 'yearly',
      payment_id: 'pay_mahesh_1199',
      order_id: 'ord_mahesh_1199',
      subscription_status: 'ACTIVE',
      start_date: new Date(now.getTime() - 362 * 24 * 60 * 60 * 1000).toISOString(),
      expiry_date: exp3.toISOString(),
      business_limit: 5,
      team_member_limit: 0,
      poster_limit: -1,
      watermark_status: 'NO_WATERMARK',
      monthly_free_clean_used: 0,
      current_month_key: currentMonthKey,
      created_at: new Date(now.getTime() - 362 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: now.toISOString(),
    };
  }

  // Expiring Tomorrow: Swapnil Jadhav (Business Monthly ₹299)
  if (!store.subscriptions['usr-exp-1d']) {
    const exp1 = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    store.subscriptions['usr-exp-1d'] = {
      id: 'sub-exp-1d',
      user_id: 'usr-exp-1d',
      plan_id: 'business-monthly',
      plan_name: 'BUSINESS MONTHLY',
      billing_cycle: 'monthly',
      payment_id: 'pay_swapnil_299',
      order_id: 'ord_swapnil_299',
      subscription_status: 'ACTIVE',
      start_date: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      expiry_date: exp1.toISOString(),
      business_limit: 5,
      team_member_limit: 0,
      poster_limit: -1,
      watermark_status: 'NO_WATERMARK',
      monthly_free_clean_used: 0,
      current_month_key: currentMonthKey,
      created_at: new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: now.toISOString(),
    };
  }

  // Expired: Nilesh Chavan (Starter Yearly ₹599)
  if (!store.subscriptions['usr-exp-0d']) {
    const expPast = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    store.subscriptions['usr-exp-0d'] = {
      id: 'sub-exp-0d',
      user_id: 'usr-exp-0d',
      plan_id: 'starter-yearly',
      plan_name: 'STARTER YEARLY',
      billing_cycle: 'yearly',
      payment_id: 'pay_nilesh_599',
      order_id: 'ord_nilesh_599',
      subscription_status: 'EXPIRED',
      start_date: new Date(now.getTime() - 367 * 24 * 60 * 60 * 1000).toISOString(),
      expiry_date: expPast.toISOString(),
      business_limit: 1,
      team_member_limit: 0,
      poster_limit: -1,
      watermark_status: 'WATERMARK_AFTER_3_FREE',
      monthly_free_clean_used: 3,
      current_month_key: currentMonthKey,
      created_at: new Date(now.getTime() - 367 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: now.toISOString(),
    };
  }
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[SUBSCRIPTION ENGINE] Failed to save store:', err);
  }
}

let memoryStore: StoreData = loadStore();

export interface UserSubscriptionResolution {
  subscription: UserSubscriptionRecord;
  planConfig: PlanConfig;
  planId?: PlanId;
  planName?: string;
  planNameMarathi?: string;
  price?: number;
  billingPeriod?: string;
  expiresAt?: string | null;
  isActivePaid?: boolean;
  isPaidActive: boolean;
  businessLimit: number;
  canExportClean: boolean;
  canExportCleanPosters?: boolean;
  freePostersLeft: number;
  freePostersUsed?: number;
  freePostsLimit?: number;
  freePostsUsed?: number;
  freePostsRemaining?: number;
  monthlyFreeCleanUsed: number;
  needsWatermark: boolean;
  isTeamMember: boolean;
  teamOwnerId?: string;
  teamRole?: 'business_admin' | 'team_member';
  teamOwnerEmail?: string;
  maxTeamMembers?: number;
  maxBusinesses?: number;
  daysRemaining: number;
  hasPendingApproval?: boolean;
  pendingApproval?: SubscriptionApprovalRequest | null;
  latestPayment?: PaymentVerificationRecord | null;
  pendingPayment?: PaymentVerificationRecord | null;
  paymentHistory?: PaymentVerificationRecord[];
}

/**
 * Returns all active plans sorted by display order.
 */
export function getAllConfiguredPlans(includeInactive: boolean = false): PlanConfig[] {
  const plans = Object.values(memoryStore.plans);
  const filtered = includeInactive ? plans : plans.filter((p) => p.is_active);
  return filtered.sort((a, b) => a.display_order - b.display_order);
}

/**
 * Gets a specific plan by ID from database or default.
 */
export function getConfiguredPlanById(planId: string): PlanConfig {
  if (memoryStore.plans[planId]) {
    return memoryStore.plans[planId];
  }
  return DEFAULT_PLANS[planId] || DEFAULT_PLANS.free;
}

/**
 * Saves or updates a plan configuration in the database.
 */
export function adminSavePlan(planData: PlanConfig): PlanConfig {
  if (!planData.plan_id || !planData.plan_name) {
    throw new Error('प्लॅन आयडी आणि नाव आवश्यक आहे.');
  }

  // Calculate default duration in days if not provided
  let durationDays = planData.duration_days;
  if (!durationDays || durationDays <= 0) {
    if (planData.billing_cycle === 'yearly') durationDays = 365;
    else if (planData.billing_cycle === 'quarterly') durationDays = 90;
    else if (planData.billing_cycle === 'free') durationDays = 0;
    else durationDays = 30;
  }

  // Sanitize and save
  const existing = memoryStore.plans[planData.plan_id] || {};
  const updated: PlanConfig = {
    ...existing,
    ...planData,
    price: Number(planData.price) || 0,
    originalPrice: planData.originalPrice !== undefined ? Number(planData.originalPrice) : existing.originalPrice,
    billing_cycle: planData.billing_cycle || existing.billing_cycle || 'monthly',
    duration_days: durationDays,
    periodLabel: planData.periodLabel || (planData.billing_cycle === 'yearly' ? '/ Year' : planData.billing_cycle === 'quarterly' ? '/ 3 Months' : planData.billing_cycle === 'free' ? 'Forever Free' : '/ Month'),
    periodLabelMarathi: planData.periodLabelMarathi || (planData.billing_cycle === 'yearly' ? '/ वर्ष' : planData.billing_cycle === 'quarterly' ? '/ ३ महिने' : planData.billing_cycle === 'free' ? 'कायमस्वरूपी' : '/ महिना'),
    business_limit: Number(planData.business_limit) || 1,
    team_member_limit: Number(planData.team_member_limit) || 0,
    poster_limit: Number(planData.poster_limit) ?? -1,
    display_order: Number(planData.display_order) || 10,
    is_active: planData.is_active !== undefined ? planData.is_active : true,
    features: Array.isArray(planData.features) ? planData.features : [],
  };

  memoryStore.plans[planData.plan_id] = updated;
  saveStore(memoryStore);
  return updated;
}

/**
 * Creates an additional/custom plan.
 */
export function adminCreateCustomPlan(planData: Partial<PlanConfig>): PlanConfig {
  const planId = planData.plan_id
    ? planData.plan_id.toLowerCase().replace(/[^a-z0-9_-]/g, '-')
    : `custom-${Date.now()}`;

  const newPlan: PlanConfig = {
    plan_id: planId,
    plan_name: planData.plan_name || 'Custom Plan',
    nameMarathi: planData.nameMarathi || planData.plan_name || 'कस्टम प्लॅन',
    price: Number(planData.price) || 0,
    originalPrice: Number(planData.originalPrice) || 0,
    billing_cycle: planData.billing_cycle || 'monthly',
    periodLabel: planData.periodLabel || (planData.billing_cycle === 'yearly' ? '/ Year' : '/ Month'),
    periodLabelMarathi: planData.periodLabelMarathi || '',
    business_limit: Number(planData.business_limit) || 1,
    team_member_limit: Number(planData.team_member_limit) || 0,
    poster_limit: Number(planData.poster_limit) ?? -1,
    features: planData.features || ['Custom Business Access', 'No GROW VIEW watermark'],
    watermark_status: planData.watermark_status || 'NO_WATERMARK',
    is_active: true,
    display_order: Number(planData.display_order) || 20,
    description: planData.description || 'Custom Enterprise Plan',
    button_text: planData.button_text || 'BUY NOW',
    badge: planData.badge || 'CUSTOM',
    is_popular: false,
    highlight_text: planData.highlight_text || 'NO GROW VIEW WATERMARK',
    premium_access: planData.premium_access !== undefined ? planData.premium_access : true,
    premium_templates: planData.premium_templates !== undefined ? planData.premium_templates : true,
    premium_export: planData.premium_export !== undefined ? planData.premium_export : true,
  };

  memoryStore.plans[planId] = newPlan;
  saveStore(memoryStore);
  return newPlan;
}

/**
 * Toggles a plan active/inactive status.
 */
export function adminTogglePlanStatus(planId: string): PlanConfig {
  const plan = memoryStore.plans[planId];
  if (!plan) throw new Error('प्लॅन सापडला नाही.');
  plan.is_active = !plan.is_active;
  saveStore(memoryStore);
  return plan;
}

export function getOrInitFreeUsage(userId: string): FreeUsageRecord {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (!memoryStore.freeUsages) {
    memoryStore.freeUsages = {};
  }

  let usage = memoryStore.freeUsages[userId];
  if (!usage || usage.month !== currentMonth || usage.year !== currentYear) {
    const sub = memoryStore.subscriptions[userId];
    const existingUsed = (sub && sub.current_month_key === getCurrentMonthKey()) ? (sub.monthly_free_clean_used || 0) : 0;

    usage = {
      id: `fu_${userId}_${currentYear}_${currentMonth}`,
      userId,
      month: currentMonth,
      year: currentYear,
      freePostLimit: 5,
      freePostsUsed: existingUsed,
      freePostsRemaining: Math.max(0, 5 - existingUsed),
      lastUpdated: now.toISOString(),
    };
    memoryStore.freeUsages[userId] = usage;
    saveStore(memoryStore);
  }
  return usage;
}

export function getUpgradeNotificationMsg(used: number): string {
  if (used === 1) {
    return 'You have 4 free posts remaining this month.';
  } else if (used === 2) {
    return 'You have 3 free posts remaining this month.';
  } else if (used === 3) {
    return 'You have 2 free posts remaining this month.';
  } else if (used === 4) {
    return 'You have 1 free post remaining this month. Upgrade anytime for continued access.';
  } else if (used >= 5) {
    return 'You have completed your 5 free posts. Please upgrade to a paid plan to continue creating and downloading business posters.';
  }
  return '';
}

export function checkUserPostCreationAccess(userId: string, userEmail?: string): {
  allowed: boolean;
  isPaid: boolean;
  freePostsUsed: number;
  freePostsRemaining: number;
  notificationMsg?: string;
  error?: string;
} {
  const resolution = resolveUserSubscription(userId, userEmail);
  if (resolution.isPaidActive) {
    return {
      allowed: true,
      isPaid: true,
      freePostsUsed: 0,
      freePostsRemaining: 999999,
    };
  }

  const freeUsage = getOrInitFreeUsage(resolution.subscription.user_id);
  if (freeUsage.freePostsUsed < 5) {
    const remaining = 5 - freeUsage.freePostsUsed;
    const notificationMsg = getUpgradeNotificationMsg(freeUsage.freePostsUsed);
    return {
      allowed: true,
      isPaid: false,
      freePostsUsed: freeUsage.freePostsUsed,
      freePostsRemaining: remaining,
      notificationMsg,
    };
  }

  return {
    allowed: false,
    isPaid: false,
    freePostsUsed: 5,
    freePostsRemaining: 0,
    error: "You have completed your 5 free posts. Please upgrade to a paid plan to continue creating and downloading business posters.",
    notificationMsg: "You have completed your 5 free posts. Please upgrade to a paid plan to continue creating and downloading business posters.",
  };
}

/**
 * Resolves a user's subscription with strict backend verification and automatic expiration/rollover checks.
 */
export function resolveUserSubscription(
  userId: string,
  userEmail?: string
): UserSubscriptionResolution {
  const currentMonthKey = getCurrentMonthKey();
  const now = new Date();

  // Check if user is part of an active team
  let teamMemberRec: TeamMemberRecord | undefined;
  if (userEmail) {
    const cleanEmail = userEmail.toLowerCase().trim();
    teamMemberRec = memoryStore.teamMembers.find(
      (m) => m.member_email.toLowerCase().trim() === cleanEmail && m.status === 'active'
    );
  }

  let targetUserId = userId;
  let isTeamMember = false;
  if (teamMemberRec) {
    targetUserId = teamMemberRec.owner_id;
    isTeamMember = true;
  }

  let sub = memoryStore.subscriptions[targetUserId];

  // If no record exists, initialize strictly on the FREE PLAN
  if (!sub) {
    const freePlan = getConfiguredPlanById('free');
    sub = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: targetUserId,
      plan_id: 'free',
      plan_name: freePlan.plan_name,
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
      current_month_key: currentMonthKey,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
    memoryStore.subscriptions[targetUserId] = sub;
    saveStore(memoryStore);
  }

  // Automatic Monthly Rollover: Reset 3 free clean posters every month
  if (sub.current_month_key !== currentMonthKey) {
    sub.current_month_key = currentMonthKey;
    sub.monthly_free_clean_used = 0;
    sub.updated_at = now.toISOString();
    saveStore(memoryStore);
  }

  const freeUsage = getOrInitFreeUsage(targetUserId);

  const isPaidPlan = sub.plan_id !== 'free';
  const expiryDate = new Date(sub.expiry_date);
  const diffMs = expiryDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // Expiration check: If paid subscription passed expiry date, mark EXPIRED
  if (isPaidPlan && sub.subscription_status === 'ACTIVE') {
    if (now.getTime() > expiryDate.getTime()) {
      sub.subscription_status = 'EXPIRED';
      sub.updated_at = now.toISOString();
      saveStore(memoryStore);

      // Trigger ON_EXPIRY notification
      triggerExpiryReminder(targetUserId, sub.id, 'ON_EXPIRY', userEmail);
    } else {
      // Check for approaching expiry reminders
      if (daysRemaining <= 1) {
        triggerExpiryReminder(targetUserId, sub.id, '1_DAY', userEmail);
      } else if (daysRemaining <= 3) {
        triggerExpiryReminder(targetUserId, sub.id, '3_DAYS', userEmail);
      } else if (daysRemaining <= 7) {
        triggerExpiryReminder(targetUserId, sub.id, '7_DAYS', userEmail);
      }
    }
  }

  const isPaidActive = isPaidPlan && sub.subscription_status === 'ACTIVE';
  const planConfig = getConfiguredPlanById(sub.plan_id);

  // Free plan gets 5 free posters per month. After 5, upgrade is required or watermark applies.
  const freePostersLeft = isPaidActive ? 999999 : Math.max(0, 5 - freeUsage.freePostsUsed);
  const canExportClean = isPaidActive || freePostersLeft > 0;
  const needsWatermark = !canExportClean;

  const pendingReq = (memoryStore.approvalRequests || []).find(
    (r) => r.user_id === targetUserId && r.status === 'pending'
  );
  const hasPendingApproval = Boolean(pendingReq || sub.subscription_status === 'PENDING_APPROVAL');

  const userPayments = (memoryStore.payments || []).filter((p) => p.user_id === targetUserId);
  const pendingPayment = userPayments.find((p) => p.status === 'pending') || null;
  const latestPayment = userPayments[0] || null;

  return {
    subscription: sub,
    planConfig,
    planId: sub.plan_id as PlanId,
    planName: planConfig.plan_name,
    planNameMarathi: planConfig.nameMarathi || planConfig.plan_name,
    price: planConfig.price,
    billingPeriod: planConfig.periodLabel || (planConfig.billing_cycle === 'yearly' ? '/ Year' : '/ Month'),
    expiresAt: isPaidPlan ? sub.expiry_date : null,
    isPaidActive,
    isActivePaid: isPaidActive,
    businessLimit: isPaidActive ? sub.business_limit : 1,
    canExportClean,
    canExportCleanPosters: canExportClean,
    freePostersLeft,
    freePostsLimit: 5,
    freePostsUsed: freeUsage.freePostsUsed,
    freePostsRemaining: isPaidActive ? 999999 : freeUsage.freePostsRemaining,
    monthlyFreeCleanUsed: freeUsage.freePostsUsed,
    needsWatermark,
    isTeamMember,
    teamOwnerId: teamMemberRec?.owner_id,
    teamRole: teamMemberRec?.role,
    teamOwnerEmail: teamMemberRec?.owner_email,
    maxTeamMembers: sub.team_member_limit || 0,
    maxBusinesses: isPaidActive ? sub.business_limit : 1,
    daysRemaining,
    hasPendingApproval,
    pendingApproval: pendingReq || null,
    pendingPayment,
    latestPayment,
    paymentHistory: userPayments,
  };
}

/**
 * Triggers an automated expiry reminder notification if not already sent.
 */
function triggerExpiryReminder(
  userId: string,
  subscriptionId: string,
  stage: '7_DAYS' | '3_DAYS' | '1_DAY' | 'ON_EXPIRY',
  userEmail?: string
): ExpiryReminderNotification | null {
  // Prevent duplicate reminder for the same subscription and stage
  const existing = memoryStore.notifications.find(
    (n) => n.subscription_id === subscriptionId && n.reminder_stage === stage
  );
  if (existing) return existing;

  const sub = memoryStore.subscriptions[userId];
  const planName = sub?.plan_name || 'GROW VIEW';

  let message = '';
  switch (stage) {
    case '7_DAYS':
      message = 'Your GROW VIEW plan expires in 7 days. Renew your subscription to continue premium access.';
      break;
    case '3_DAYS':
      message = 'Your GROW VIEW plan expires in 3 days. Renew now to avoid interruption.';
      break;
    case '1_DAY':
      message = 'Your GROW VIEW plan expires tomorrow. Renew your plan to continue using premium features.';
      break;
    case 'ON_EXPIRY':
      message = 'Your GROW VIEW plan has expired. Your account has returned to the FREE plan. Renew to restore premium access.';
      break;
  }

  const notification: ExpiryReminderNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    notification_type: 'expiry_reminder',
    user_id: userId,
    user_email: userEmail || `${userId}@growview.in`,
    subscription_id: subscriptionId,
    plan_id: sub?.plan_id || 'starter-monthly',
    plan_name: planName,
    sent_at: new Date().toISOString(),
    notification_status: 'sent',
    reminder_stage: stage,
    message,
    days_remaining: stage === 'ON_EXPIRY' ? 0 : stage === '1_DAY' ? 1 : stage === '3_DAYS' ? 3 : 7,
  };

  memoryStore.notifications.unshift(notification);
  saveStore(memoryStore);
  return notification;
}

/**
 * Manually sends an expiry reminder (Admin triggered).
 */
export function sendSubscriptionReminder(
  userId: string,
  subscriptionId: string,
  stage: '7_DAYS' | '3_DAYS' | '1_DAY' | 'ON_EXPIRY' | 'MANUAL',
  customMessage?: string
): ExpiryReminderNotification {
  const sub = memoryStore.subscriptions[userId];
  if (!sub) throw new Error('सबस्क्रिप्शन सापडले नाही.');

  const planName = sub.plan_name;
  let message = customMessage;
  if (!message) {
    switch (stage) {
      case '7_DAYS':
        message = 'Your GROW VIEW plan expires in 7 days. Renew your subscription to continue premium access.';
        break;
      case '3_DAYS':
        message = 'Your GROW VIEW plan expires in 3 days. Renew now to avoid interruption.';
        break;
      case '1_DAY':
        message = 'Your GROW VIEW plan expires tomorrow. Renew your plan to continue using premium features.';
        break;
      case 'ON_EXPIRY':
        message = 'Your GROW VIEW plan has expired. Your account has returned to the FREE plan. Renew to restore premium access.';
        break;
      default:
        message = `Your ${planName} plan is active. Please renew your subscription to continue premium features.`;
        break;
    }
  }

  const now = new Date();
  const expiryDate = new Date(sub.expiry_date);
  const diffMs = expiryDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const notification: ExpiryReminderNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    notification_type: 'manual_admin',
    user_id: userId,
    user_email: `${userId}@growview.in`,
    subscription_id: subscriptionId,
    plan_id: sub.plan_id,
    plan_name: planName,
    sent_at: new Date().toISOString(),
    notification_status: 'sent',
    reminder_stage: stage,
    message,
    days_remaining: daysRemaining,
  };

  memoryStore.notifications.unshift(notification);
  saveStore(memoryStore);
  return notification;
}

/**
 * Expiring subscriptions aggregation for Admin Dashboard widget.
 */
export function getExpiringSubscriptionsData() {
  const now = new Date();
  const subscriptions = Object.values(memoryStore.subscriptions);

  const activePaidSubs = subscriptions.filter(
    (s) => s.plan_id !== 'free'
  );

  const categorized: {
    expiresIn7Days: Array<UserSubscriptionRecord & { daysRemaining: number }>;
    expiresIn3Days: Array<UserSubscriptionRecord & { daysRemaining: number }>;
    expiresTomorrow: Array<UserSubscriptionRecord & { daysRemaining: number }>;
    expired: Array<UserSubscriptionRecord & { daysRemaining: number }>;
  } = {
    expiresIn7Days: [],
    expiresIn3Days: [],
    expiresTomorrow: [],
    expired: [],
  };

  activePaidSubs.forEach((sub) => {
    const expiryTime = new Date(sub.expiry_date).getTime();
    const diffDays = Math.ceil((expiryTime - now.getTime()) / (1000 * 60 * 60 * 24));

    if (sub.subscription_status === 'EXPIRED' || diffDays <= 0) {
      categorized.expired.push({ ...sub, daysRemaining: Math.max(0, diffDays) });
    } else if (diffDays <= 1) {
      categorized.expiresTomorrow.push({ ...sub, daysRemaining: diffDays });
    } else if (diffDays <= 3) {
      categorized.expiresIn3Days.push({ ...sub, daysRemaining: diffDays });
    } else if (diffDays <= 7) {
      categorized.expiresIn7Days.push({ ...sub, daysRemaining: diffDays });
    }
  });

  return {
    counts: {
      expiresIn7Days: categorized.expiresIn7Days.length,
      expiresIn3Days: categorized.expiresIn3Days.length,
      expiresTomorrow: categorized.expiresTomorrow.length,
      expired: categorized.expired.length,
    },
    lists: categorized,
    recentNotifications: memoryStore.notifications.slice(0, 50),
  };
}

/**
 * Retrieves in-app notifications for a specific user.
 */
export function getUserNotifications(userId: string): {
  notifications: ExpiryReminderNotification[];
  unreadCount: number;
} {
  const userNotifs = memoryStore.notifications.filter((n) => n.user_id === userId);
  const unreadCount = userNotifs.filter((n) => n.notification_status !== 'read').length;
  return { notifications: userNotifs, unreadCount };
}

/**
 * Marks a notification as read.
 */
export function markNotificationAsRead(notificationId: string, userId: string): boolean {
  const notif = memoryStore.notifications.find((n) => n.id === notificationId && n.user_id === userId);
  if (notif) {
    notif.notification_status = 'read';
    saveStore(memoryStore);
    return true;
  }
  return false;
}

/**
 * Creates a pending payment order server-side with strictly verified price.
 * Backend determines plan_id -> current database price (never trusts price sent by browser).
 */
export function createSubscriptionOrder(
  userId: string,
  userEmail: string,
  planId: string
): PaymentOrderRecord {
  const plan = getConfiguredPlanById(planId);
  if (!plan || !plan.is_active || planId === 'free' || planId === 'business-team') {
    throw new Error('अवैध किंवा बंद केलेला सबस्क्रिप्शन प्लॅन निवडला आहे.');
  }

  const orderId = `order_gv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const order: PaymentOrderRecord = {
    order_id: orderId,
    user_id: userId,
    user_email: userEmail,
    plan_id: plan.plan_id as PlanId,
    plan_name: plan.plan_name,
    amount: plan.price, // STRICT SERVER-SIDE DATABASE PRICE
    currency: 'INR',
    status: 'created',
    created_at: new Date().toISOString(),
  };

  memoryStore.orders.push(order);
  saveStore(memoryStore);
  return order;
}

/**
 * Server-side payment verification and Admin Approval workflow.
 * Per business requirement: Premium plan purchases must NOT be activated directly.
 * Instead, they create an approval request and an admin notification.
 * Activation only occurs when Admin approves the request.
 */
export function verifyAndActivateSubscription(
  orderId: string,
  paymentId: string,
  userId: string,
  planId: string,
  paymentMethod?: string,
  userName?: string,
  userPhone?: string
): { subscription: UserSubscriptionRecord; approvalRequest: SubscriptionApprovalRequest } {
  const orderIndex = memoryStore.orders.findIndex((o) => o.order_id === orderId);
  if (orderIndex === -1) {
    throw new Error('ऑर्डर आयडी सापडला नाही किंवा व्यवहार अवैध आहे.');
  }

  const order = memoryStore.orders[orderIndex];
  if (order.user_id !== userId || order.plan_id !== planId) {
    throw new Error('ऑर्डर आणि वापरकर्ता माहिती जुळत नाही (Security Mismatch).');
  }

  const plan = getConfiguredPlanById(planId);
  if (!plan) {
    throw new Error('प्लॅन उपलब्ध नाही.');
  }

  // Update order status to paid
  const now = new Date();
  order.status = 'paid';
  order.payment_id = paymentId;
  order.payment_method = paymentMethod || 'upi';
  order.verified_at = now.toISOString();

  // Create Approval Request
  if (!memoryStore.approvalRequests) {
    memoryStore.approvalRequests = [];
  }

  const approvalReq: SubscriptionApprovalRequest = {
    id: `appr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    order_id: orderId,
    payment_id: paymentId,
    user_id: userId,
    user_email: order.user_email || '',
    user_name: userName || (order as any).user_name || 'ग्राहक',
    user_phone: userPhone || (order as any).user_phone || '',
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    billing_cycle: plan.billing_cycle,
    amount: order.amount,
    payment_method: paymentMethod || 'upi',
    status: 'pending',
    requested_at: now.toISOString(),
  };

  memoryStore.approvalRequests.unshift(approvalReq);

  // Set subscription status to PENDING_APPROVAL (NOT directly activated)
  const currentSub = memoryStore.subscriptions[userId];
  const pendingSub: UserSubscriptionRecord = {
    id: currentSub?.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId,
    plan_id: plan.plan_id as PlanId,
    plan_name: plan.plan_name,
    billing_cycle: plan.billing_cycle,
    payment_id: paymentId,
    order_id: orderId,
    subscription_status: 'PENDING_APPROVAL',
    start_date: now.toISOString(),
    expiry_date: now.toISOString(), // Expired/inactive until Admin approves
    business_limit: currentSub?.business_limit || 1,
    team_member_limit: 0,
    poster_limit: -1,
    watermark_status: 'WATERMARK_AFTER_3_FREE', // Free watermark rules until approved
    monthly_free_clean_used: currentSub?.monthly_free_clean_used || 0,
    current_month_key: getCurrentMonthKey(),
    created_at: currentSub?.created_at || now.toISOString(),
    updated_at: now.toISOString(),
  };

  memoryStore.subscriptions[userId] = pendingSub;

  // Dispatch Admin Notification for immediate action
  memoryStore.notifications.unshift({
    id: `notif_adm_appr_${Date.now()}`,
    notification_type: 'manual_admin',
    user_id: 'admin_broadcast',
    user_email: 'admin@growview.com',
    user_name: 'प्रशासक (Admin)',
    subscription_id: pendingSub.id,
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    sent_at: now.toISOString(),
    notification_status: 'sent',
    reminder_stage: 'MANUAL',
    message: `🔔 नवीन प्रीमियम खरेदी: ${order.user_email} ने "${plan.plan_name}" (₹${order.amount}) खरेदी केला आहे. कृपया ॲडमिन पॅनेलमधून तपासून मंजुरी द्या.`,
    days_remaining: 0,
  });

  saveStore(memoryStore);

  console.log(`[SUBSCRIPTION PENDING APPROVAL] User: ${userId} -> Plan: ${planId} (Awaiting Admin Activation)`);
  return { subscription: pendingSub, approvalRequest: approvalReq };
}

/**
 * Admin action: Approve & activate subscription for a user.
 */
export function adminApproveSubscription(
  approvalId: string,
  adminEmail: string = 'admin@growview.com',
  notes?: string
): { subscription: UserSubscriptionRecord; approvalRequest: SubscriptionApprovalRequest } {
  const req = (memoryStore.approvalRequests || []).find((r) => r.id === approvalId);
  if (!req) {
    throw new Error('मंजुरी विनंती सापडली नाही (Approval request not found).');
  }

  if (req.status === 'approved') {
    throw new Error('ही सबस्क्रिप्शन विनंती आधीच मंजूर केली आहे.');
  }

  const now = new Date();
  const plan = getConfiguredPlanById(req.plan_id);
  const durationDays = plan.duration_days || (plan.billing_cycle === 'yearly' ? 365 : plan.billing_cycle === 'quarterly' ? 90 : 30);
  const expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  // Mark request approved
  req.status = 'approved';
  req.reviewed_at = now.toISOString();
  req.reviewed_by = adminEmail;
  if (notes) req.admin_notes = notes;

  // Fully activate the user subscription
  let sub = memoryStore.subscriptions[req.user_id];
  if (!sub) {
    sub = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: req.user_id,
      plan_id: plan.plan_id as PlanId,
      plan_name: plan.plan_name,
      billing_cycle: plan.billing_cycle,
      payment_id: req.payment_id,
      order_id: req.order_id,
      subscription_status: 'ACTIVE',
      start_date: now.toISOString(),
      expiry_date: expiryDate,
      business_limit: plan.business_limit,
      team_member_limit: plan.team_member_limit,
      poster_limit: plan.poster_limit,
      watermark_status: plan.watermark_status,
      monthly_free_clean_used: 0,
      current_month_key: getCurrentMonthKey(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
  } else {
    sub.plan_id = plan.plan_id as PlanId;
    sub.plan_name = plan.plan_name;
    sub.billing_cycle = plan.billing_cycle;
    sub.subscription_status = 'ACTIVE';
    sub.start_date = now.toISOString();
    sub.expiry_date = expiryDate;
    sub.watermark_status = plan.watermark_status;
    sub.business_limit = plan.business_limit;
    sub.team_member_limit = plan.team_member_limit;
    sub.poster_limit = plan.poster_limit;
    sub.updated_at = now.toISOString();
  }

  memoryStore.subscriptions[req.user_id] = sub;

  // Notify user that Admin has activated their plan
  memoryStore.notifications.unshift({
    id: `notif_user_appr_${Date.now()}`,
    notification_type: 'manual_admin',
    user_id: req.user_id,
    user_email: req.user_email,
    user_name: req.user_name || 'ग्राहक',
    subscription_id: sub.id,
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    sent_at: now.toISOString(),
    notification_status: 'sent',
    reminder_stage: 'MANUAL',
    message: `🎉 अभिनंदन! ॲडमिनने आपला "${plan.plan_name}" प्लॅन मंजूर केला आहे. सर्व प्रीमियम डिझाईन्स व वॉटरमार्क-फ्री डाऊनलोड्स आता सुरू झाले आहेत!`,
    days_remaining: durationDays,
  });

  saveStore(memoryStore);
  console.log(`[SUBSCRIPTION APPROVED BY ADMIN] User: ${req.user_id} -> Plan: ${plan.plan_id} Active until ${expiryDate}`);
  return { subscription: sub, approvalRequest: req };
}

/**
 * Admin action: Reject a subscription request.
 */
export function adminRejectSubscription(
  approvalId: string,
  reason: string = 'पेमेंट पडताळणी जुळली नाही.',
  adminEmail: string = 'admin@growview.com'
): { approvalRequest: SubscriptionApprovalRequest } {
  const req = (memoryStore.approvalRequests || []).find((r) => r.id === approvalId);
  if (!req) {
    throw new Error('मंजुरी विनंती सापडली नाही.');
  }

  const now = new Date();
  req.status = 'rejected';
  req.rejection_reason = reason;
  req.reviewed_at = now.toISOString();
  req.reviewed_by = adminEmail;

  const sub = memoryStore.subscriptions[req.user_id];
  if (sub && sub.subscription_status === 'PENDING_APPROVAL') {
    sub.subscription_status = 'REJECTED';
    sub.updated_at = now.toISOString();
  }

  // Notify user
  memoryStore.notifications.unshift({
    id: `notif_user_rej_${Date.now()}`,
    notification_type: 'manual_admin',
    user_id: req.user_id,
    user_email: req.user_email,
    user_name: req.user_name || 'ग्राहक',
    subscription_id: sub?.id || 'sub_rej',
    plan_id: req.plan_id,
    plan_name: req.plan_name,
    sent_at: now.toISOString(),
    notification_status: 'sent',
    reminder_stage: 'MANUAL',
    message: `⚠️ आपली "${req.plan_name}" सबस्क्रिप्शन विनंती नाकारण्यात आली आहे. कारण: ${reason}`,
    days_remaining: 0,
  });

  saveStore(memoryStore);
  console.log(`[SUBSCRIPTION REJECTED BY ADMIN] Request: ${approvalId}, User: ${req.user_id}`);
  return { approvalRequest: req };
}

/**
 * Returns all subscription approval requests for Admin panel.
 */
export function getSubscriptionApprovalRequests(): SubscriptionApprovalRequest[] {
  return [...(memoryStore.approvalRequests || [])];
}

/**
 * Server-side export decision engine. Atomically validates quota or stamps watermark.
 */
export function recordAndAuthorizeExport(
  userId: string,
  userEmail?: string
): {
  allowed: boolean;
  needsWatermark: boolean;
  planId: PlanId;
  cleanPostersRemaining: number;
  monthlyFreeCleanUsed: number;
  message: string;
  limitReached?: boolean;
  freePostsRemaining?: number;
  error?: string;
} {
  const resolution = resolveUserSubscription(userId, userEmail);
  const now = new Date();

  memoryStore.usageStats.totalExports += 1;

  if (resolution.isPaidActive) {
    memoryStore.usageStats.cleanExports += 1;
    memoryStore.usageStats.premiumExports += 1;
    saveStore(memoryStore);

    return {
      allowed: true,
      needsWatermark: false,
      planId: resolution.subscription.plan_id,
      cleanPostersRemaining: 999999,
      monthlyFreeCleanUsed: resolution.subscription.monthly_free_clean_used,
      message: 'प्रीमियम VIP ॲक्सेस: अमर्यादित वॉटरमार्क-फ्री डाऊनलोड मंजूर.',
    };
  }

  // Free Tier logic
  const targetSub = memoryStore.subscriptions[resolution.subscription.user_id];
  if (targetSub.monthly_free_clean_used < 3) {
    targetSub.monthly_free_clean_used += 1;
    targetSub.updated_at = now.toISOString();
    memoryStore.usageStats.cleanExports += 1;
    saveStore(memoryStore);

    const remaining = 3 - targetSub.monthly_free_clean_used;
    return {
      allowed: true,
      needsWatermark: false,
      planId: 'free',
      cleanPostersRemaining: remaining,
      monthlyFreeCleanUsed: targetSub.monthly_free_clean_used,
      message: `मोफत कोटा: ३ पैकी ${targetSub.monthly_free_clean_used} वापरले. ${remaining} वॉटरमार्क-फ्री पोस्टर्स शिल्लक आहेत.`,
    };
  }

  // Limit exceeded: User has used all 3 free posts this month!
  return {
    allowed: false,
    limitReached: true,
    needsWatermark: true,
    planId: 'free',
    cleanPostersRemaining: 0,
    freePostsRemaining: 0,
    monthlyFreeCleanUsed: 3,
    error: "🎉 You've used all 3 free posts this month. Upgrade your plan to continue creating unlimited premium posts.",
    message: "🎉 You've used all 3 free posts this month. Upgrade your plan to continue creating unlimited premium posts.",
  };
}

/**
 * Returns current Admin Payment Settings (UPI ID, QR code, instructions, contact).
 */
export function getAdminPaymentSettings(): AdminPaymentSettings {
  if (!memoryStore.paymentSettings) {
    memoryStore.paymentSettings = { ...DEFAULT_PAYMENT_SETTINGS };
    saveStore(memoryStore);
  }
  return memoryStore.paymentSettings;
}

/**
 * Admin updates Payment Settings.
 */
export function updateAdminPaymentSettings(
  settings: Partial<AdminPaymentSettings>,
  adminEmail: string = 'admin@growview.com'
): AdminPaymentSettings {
  const current = getAdminPaymentSettings();
  const updated: AdminPaymentSettings = {
    ...current,
    ...settings,
    upiId: (settings.upiId !== undefined ? settings.upiId : current.upiId || '').trim(),
    upiName: (settings.upiName !== undefined ? settings.upiName : current.upiName || '').trim(),
    qrCodeUrl: settings.qrCodeUrl !== undefined ? settings.qrCodeUrl : current.qrCodeUrl,
    instructions: settings.instructions !== undefined ? settings.instructions : current.instructions,
    supportPhone: settings.supportPhone !== undefined ? settings.supportPhone : current.supportPhone,
    supportEmail: settings.supportEmail !== undefined ? settings.supportEmail : current.supportEmail,
    isEnabled: settings.isEnabled !== undefined ? settings.isEnabled : current.isEnabled,
    updatedAt: new Date().toISOString(),
    updatedBy: adminEmail,
  };
  memoryStore.paymentSettings = updated;
  saveStore(memoryStore);
  return updated;
}

/**
 * Customer submits manual UPI payment verification form with transaction ID and screenshot.
 * CRITICAL RULE: Plan does NOT activate! Status becomes 'pending'.
 */
export function submitPaymentVerification(data: {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  businessName?: string;
  planId: string;
  amount: number;
  transactionId: string;
  screenshotUrl: string;
  paymentDate?: string;
}): { payment: PaymentVerificationRecord; message: string } {
  const {
    userId,
    userName,
    userEmail,
    userPhone = '',
    businessName = '',
    planId,
    amount,
    transactionId,
    screenshotUrl,
    paymentDate,
  } = data;

  if (!planId) {
    throw new Error('कृपया प्लॅन निवडा.');
  }
  if (!transactionId || !transactionId.trim()) {
    throw new Error('UPI Transaction ID / UTR नंबर भरणे अनिवार्य आहे.');
  }
  if (!screenshotUrl || !screenshotUrl.trim()) {
    throw new Error('पेमेंटचा स्क्रीनशॉट अपलोड करणे अनिवार्य आहे.');
  }

  const normalizedTx = transactionId.trim().toUpperCase();

  // Validate duplicate Transaction ID / UTR
  if (!memoryStore.payments) {
    memoryStore.payments = [];
  }
  const duplicate = memoryStore.payments.find(
    (p) =>
      p.transaction_id.toUpperCase() === normalizedTx &&
      (p.status === 'approved' || p.status === 'pending')
  );
  if (duplicate) {
    throw new Error(`या UPI Transaction ID / UTR क्रमांक (${normalizedTx}) साठी आधीच पेमेंट नोंदवलेले आहे.`);
  }

  const plan = getConfiguredPlanById(planId);
  const now = new Date();
  const paymentDateStr = paymentDate || now.toISOString().split('T')[0];

  const paymentRecord: PaymentVerificationRecord = {
    id: `pay_ver_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    order_id: `ord_gv_${Date.now()}`,
    payment_id: `upi_${normalizedTx}`,
    user_id: userId,
    user_name: userName || 'ग्राहक',
    user_email: userEmail,
    user_phone: userPhone,
    business_name: businessName,
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    billing_cycle: plan.billing_cycle,
    amount: plan.price || amount,
    transaction_id: normalizedTx,
    screenshot_url: screenshotUrl,
    payment_date: paymentDateStr,
    submitted_at: now.toISOString(),
    status: 'pending',
    previous_plan: memoryStore.subscriptions[userId]?.plan_id || 'free',
    previous_status: memoryStore.subscriptions[userId]?.subscription_status || 'ACTIVE',
  };

  memoryStore.payments.unshift(paymentRecord);

  // Synchronize approvalRequests for backward compatibility
  if (!memoryStore.approvalRequests) {
    memoryStore.approvalRequests = [];
  }
  const approvalReq: SubscriptionApprovalRequest = {
    id: paymentRecord.id,
    order_id: paymentRecord.order_id,
    payment_id: paymentRecord.payment_id,
    user_id: userId,
    user_email: userEmail,
    user_name: userName,
    user_phone: userPhone,
    business_name: businessName,
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    billing_cycle: plan.billing_cycle,
    amount: paymentRecord.amount,
    payment_method: 'upi',
    transaction_id: normalizedTx,
    screenshot_url: screenshotUrl,
    payment_date: paymentDateStr,
    status: 'pending',
    requested_at: now.toISOString(),
  };
  memoryStore.approvalRequests.unshift(approvalReq);

  // Mark user subscription as PENDING_APPROVAL without activating!
  let currentSub = memoryStore.subscriptions[userId];
  if (!currentSub) {
    resolveUserSubscription(userId, userEmail);
    currentSub = memoryStore.subscriptions[userId];
  }
  currentSub.subscription_status = 'PENDING_APPROVAL';
  currentSub.updated_at = now.toISOString();

  // Create Admin Notification
  memoryStore.notifications.unshift({
    id: `notif_adm_ver_${Date.now()}`,
    notification_type: 'manual_admin',
    user_id: 'admin_broadcast',
    user_email: 'admin@growview.com',
    user_name: 'प्रशासक (Admin)',
    subscription_id: currentSub.id,
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    sent_at: now.toISOString(),
    notification_status: 'sent',
    reminder_stage: 'MANUAL',
    message: `🔔 New payment verification request from ${userName || userEmail} for ${plan.plan_name} (₹${paymentRecord.amount}). Transaction ID: ${normalizedTx}`,
    days_remaining: 0,
  });

  saveStore(memoryStore);

  return {
    payment: paymentRecord,
    message: 'Your payment has been submitted successfully. Our admin will verify your payment and activate your plan.',
  };
}

/**
 * Returns payment verification records (optionally filtered by user).
 */
export function getPaymentVerificationRecords(userId?: string): PaymentVerificationRecord[] {
  if (!memoryStore.payments) {
    memoryStore.payments = [];
  }
  if (userId) {
    return memoryStore.payments.filter((p) => p.user_id === userId);
  }
  return [...memoryStore.payments];
}

/**
 * Calculates payment overview metrics for Admin Dashboard widget.
 */
export function getPaymentOverviewMetrics(): PaymentOverviewMetrics {
  const payments = memoryStore.payments || [];
  const subscriptions = Object.values(memoryStore.subscriptions || {});
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const thisMonthKey = getCurrentMonthKey();

  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const approvedCount = payments.filter((p) => p.status === 'approved').length;
  const rejectedCount = payments.filter((p) => p.status === 'rejected').length;

  const todayRevenue = payments
    .filter((p) => p.status === 'approved' && p.verified_at && p.verified_at.startsWith(todayStr))
    .reduce((sum, p) => sum + p.amount, 0);

  const thisMonthRevenue = payments
    .filter((p) => p.status === 'approved' && p.verified_at && p.verified_at.startsWith(thisMonthKey))
    .reduce((sum, p) => sum + p.amount, 0);

  const activePremiumUsers = subscriptions.filter(
    (s) => s.subscription_status === 'ACTIVE' && s.plan_id !== 'free'
  ).length;

  const expiredSubscriptions = subscriptions.filter(
    (s) => s.subscription_status === 'EXPIRED'
  ).length;

  return {
    pendingCount,
    approvedCount,
    rejectedCount,
    todayRevenue,
    thisMonthRevenue,
    activePremiumUsers,
    expiredSubscriptions,
  };
}

/**
 * Admin action: Approve payment and activate customer's plan.
 */
export function adminApprovePayment(
  paymentId: string,
  adminEmail: string = 'admin@growview.com',
  notes?: string
): { payment: PaymentVerificationRecord; subscription: UserSubscriptionRecord; message: string } {
  const payment = (memoryStore.payments || []).find((p) => p.id === paymentId);
  if (!payment) {
    throw new Error('पेमेंट रेकॉर्ड सापडले नाही.');
  }
  if (payment.status === 'approved') {
    throw new Error('हे पेमेंट आधीच मंजूर केलेले आहे.');
  }

  const now = new Date();
  const plan = getConfiguredPlanById(payment.plan_id);
  const durationDays = plan.duration_days || (plan.billing_cycle === 'yearly' ? 365 : plan.billing_cycle === 'quarterly' ? 90 : 30);
  const expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  // 1. Mark payment approved
  payment.status = 'approved';
  payment.verified_at = now.toISOString();
  payment.verified_by = adminEmail;
  if (notes) payment.admin_notes = notes;

  // 2. Synchronize approval request if present
  const req = (memoryStore.approvalRequests || []).find(
    (r) => r.id === paymentId || r.payment_id === payment.payment_id
  );
  if (req) {
    req.status = 'approved';
    req.reviewed_at = now.toISOString();
    req.reviewed_by = adminEmail;
    if (notes) req.admin_notes = notes;
  }

  // 3. Fully activate user subscription
  let sub = memoryStore.subscriptions[payment.user_id];
  if (!sub) {
    sub = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: payment.user_id,
      plan_id: plan.plan_id as PlanId,
      plan_name: plan.plan_name,
      billing_cycle: plan.billing_cycle,
      payment_id: payment.payment_id,
      order_id: payment.order_id,
      subscription_status: 'ACTIVE',
      start_date: now.toISOString(),
      expiry_date: expiryDate,
      business_limit: plan.business_limit,
      team_member_limit: plan.team_member_limit,
      poster_limit: plan.poster_limit,
      watermark_status: 'NO_WATERMARK',
      monthly_free_clean_used: 0,
      current_month_key: getCurrentMonthKey(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };
  } else {
    sub.plan_id = plan.plan_id as PlanId;
    sub.plan_name = plan.plan_name;
    sub.billing_cycle = plan.billing_cycle;
    sub.subscription_status = 'ACTIVE';
    sub.start_date = now.toISOString();
    sub.expiry_date = expiryDate;
    sub.business_limit = plan.business_limit;
    sub.team_member_limit = plan.team_member_limit;
    sub.poster_limit = plan.poster_limit;
    sub.watermark_status = 'NO_WATERMARK';
    sub.updated_at = now.toISOString();
  }
  memoryStore.subscriptions[payment.user_id] = sub;

  // 4. Synchronize Orders
  const order = memoryStore.orders.find((o) => o.order_id === payment.order_id);
  if (order) {
    order.status = 'paid';
    order.verified_at = now.toISOString();
  } else {
    memoryStore.orders.unshift({
      order_id: payment.order_id,
      user_id: payment.user_id,
      user_email: payment.user_email,
      plan_id: plan.plan_id as PlanId,
      plan_name: plan.plan_name,
      amount: payment.amount,
      currency: 'INR',
      status: 'paid',
      payment_id: payment.payment_id,
      payment_method: 'upi',
      created_at: payment.submitted_at,
      verified_at: now.toISOString(),
    });
  }

  // 5. Customer Notification
  memoryStore.notifications.unshift({
    id: `notif_user_appr_${Date.now()}`,
    notification_type: 'manual_admin',
    user_id: payment.user_id,
    user_email: payment.user_email,
    user_name: payment.user_name || 'ग्राहक',
    subscription_id: sub.id,
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    sent_at: now.toISOString(),
    notification_status: 'sent',
    reminder_stage: 'MANUAL',
    message: `Payment verified successfully. Your GrowView plan is now active. (${plan.plan_name})`,
    days_remaining: durationDays,
  });

  saveStore(memoryStore);

  return {
    payment,
    subscription: sub,
    message: 'Payment verified successfully. Your GrowView plan is now active.',
  };
}

/**
 * Admin action: Reject payment with mandatory reason.
 */
export function adminRejectPayment(
  paymentId: string,
  reason: string,
  adminEmail: string = 'admin@growview.com'
): { payment: PaymentVerificationRecord; message: string } {
  const payment = (memoryStore.payments || []).find((p) => p.id === paymentId);
  if (!payment) {
    throw new Error('पेमेंट रेकॉर्ड सापडले नाही.');
  }

  const now = new Date();
  payment.status = 'rejected';
  payment.rejection_reason = reason;
  payment.verified_at = now.toISOString();
  payment.verified_by = adminEmail;

  // Synchronize approval request
  const req = (memoryStore.approvalRequests || []).find(
    (r) => r.id === paymentId || r.payment_id === payment.payment_id
  );
  if (req) {
    req.status = 'rejected';
    req.rejection_reason = reason;
    req.reviewed_at = now.toISOString();
    req.reviewed_by = adminEmail;
  }

  // Revert user subscription to free plan if it was pending approval
  const sub = memoryStore.subscriptions[payment.user_id];
  if (sub && sub.subscription_status === 'PENDING_APPROVAL') {
    sub.subscription_status = 'ACTIVE';
    sub.plan_id = 'free';
    sub.plan_name = 'FREE';
    sub.billing_cycle = 'free';
    sub.watermark_status = 'WATERMARK_AFTER_3_FREE';
    sub.updated_at = now.toISOString();
  }

  // Customer Notification
  memoryStore.notifications.unshift({
    id: `notif_user_rej_${Date.now()}`,
    notification_type: 'manual_admin',
    user_id: payment.user_id,
    user_email: payment.user_email,
    user_name: payment.user_name || 'ग्राहक',
    subscription_id: payment.id,
    plan_id: payment.plan_id,
    plan_name: payment.plan_name,
    sent_at: now.toISOString(),
    notification_status: 'sent',
    reminder_stage: 'MANUAL',
    message: `Your payment verification request was rejected.\n\nReason: ${reason}\n\nPlease check your payment details and submit again.`,
    days_remaining: 0,
  });

  saveStore(memoryStore);

  return {
    payment,
    message: 'Payment verification request was rejected.',
  };
}

/**
 * Team lead registration for corporate inquiries (10-20+ users).
 */
export function registerTeamLead(leadData: Omit<TeamLeadRecord, 'id' | 'status' | 'created_at'>): TeamLeadRecord {
  const newLead: TeamLeadRecord = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  memoryStore.teamLeads.unshift(newLead);
  saveStore(memoryStore);
  return newLead;
}

/**
 * Team member management methods.
 */
export function getTeamMembers(ownerId: string): TeamMemberRecord[] {
  return memoryStore.teamMembers.filter((m) => m.owner_id === ownerId);
}

export function inviteTeamMember(
  ownerId: string,
  ownerEmail: string,
  ownerBusinessName: string,
  memberEmail: string,
  memberName: string,
  role: 'business_admin' | 'team_member',
  assignedBusinessIds: string[],
  isVIPOverride?: boolean
): TeamMemberRecord {
  const resolution = resolveUserSubscription(ownerId, ownerEmail);
  const isPaidActive = resolution.isPaidActive || Boolean(isVIPOverride);

  // If customer's plan is not active, give clear informative message
  if (!isPaidActive) {
    throw new Error('आपला बिझनेस किंवा VIP प्लॅन सध्या ॲक्टिव्ह नाही. टीम सदस्यांना ॲक्सेस देण्यासाठी कृपया प्रथम VIP किंवा बिझनेस प्लॅन ॲक्टिव्हेट करा.');
  }

  const currentMembers = getTeamMembers(ownerId);
  const maxAllowed = resolution.subscription.team_member_limit > 0
    ? resolution.subscription.team_member_limit
    : 10;

  if (currentMembers.length >= maxAllowed && resolution.subscription.plan_id !== 'business-team') {
    throw new Error(`आपल्या सध्याच्या प्लॅनमध्ये जास्तीत जास्त ${maxAllowed} टीम सदस्यांची मर्यादा आहे. अधिक सदस्यांसाठी बिझनेस टीम प्लॅन अपग्रेड करा.`);
  }

  const cleanEmail = memberEmail.toLowerCase().trim();
  const existing = memoryStore.teamMembers.find(
    (m) => m.owner_id === ownerId && m.member_email.toLowerCase().trim() === cleanEmail
  );
  if (existing) {
    throw new Error('हा ईमेल पत्ता आधीच आपल्या टीममध्ये जोडलेला आहे.');
  }

  const newMember: TeamMemberRecord = {
    id: `tm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    owner_id: ownerId,
    owner_email: ownerEmail,
    owner_business_name: ownerBusinessName,
    member_email: cleanEmail,
    member_name: memberName.trim(),
    role,
    status: 'active',
    assigned_business_ids: assignedBusinessIds,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  memoryStore.teamMembers.push(newMember);
  saveStore(memoryStore);
  return newMember;
}

export function removeTeamMember(ownerId: string, memberId: string): boolean {
  const initialLen = memoryStore.teamMembers.length;
  memoryStore.teamMembers = memoryStore.teamMembers.filter(
    (m) => !(m.id === memberId && m.owner_id === ownerId)
  );
  const removed = memoryStore.teamMembers.length < initialLen;
  if (removed) saveStore(memoryStore);
  return removed;
}

export function toggleTeamMemberStatus(ownerId: string, memberId: string): TeamMemberRecord {
  const member = memoryStore.teamMembers.find((m) => m.id === memberId && m.owner_id === ownerId);
  if (!member) throw new Error('टीम सदस्य सापडला नाही.');

  member.status = member.status === 'active' ? 'deactivated' : 'active';
  member.updated_at = new Date().toISOString();
  saveStore(memoryStore);
  return member;
}

/**
 * Admin Panel aggregations and controls.
 */
export function getAdminSubscriptionOverview() {
  const subscriptions = Object.values(memoryStore.subscriptions);
  const activePaid = subscriptions.filter((s) => s.subscription_status === 'ACTIVE' && s.plan_id !== 'free');
  const freeUsers = subscriptions.filter((s) => s.plan_id === 'free');
  const expired = subscriptions.filter((s) => s.subscription_status === 'EXPIRED');

  const totalRevenue = memoryStore.orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.amount, 0);

  const approvalRequests = [...(memoryStore.approvalRequests || [])];
  const pendingApprovalCount = approvalRequests.filter((r) => r.status === 'pending').length;

  return {
    metrics: {
      totalUsersCount: subscriptions.length,
      activePaidCount: activePaid.length,
      freeUsersCount: freeUsers.length,
      expiredCount: expired.length,
      pendingApprovalCount,
      totalRevenue,
      teamLeadsCount: memoryStore.teamLeads.length,
      usageStats: memoryStore.usageStats,
    },
    plans: getAllConfiguredPlans(true),
    subscriptions,
    orders: [...memoryStore.orders].reverse(),
    teamLeads: [...memoryStore.teamLeads],
    notifications: [...memoryStore.notifications],
    approvalRequests,
  };
}

export function adminActivateCustomPlan(
  userId: string,
  userEmail: string,
  planId: string,
  durationDays: number = 365,
  businessLimit: number = 10,
  teamLimit: number = 20
): UserSubscriptionRecord {
  const plan = getConfiguredPlanById(planId);
  const now = new Date();
  const expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const customSub: UserSubscriptionRecord = {
    id: `sub_admin_${Date.now()}`,
    user_id: userId,
    plan_id: plan.plan_id as PlanId,
    plan_name: plan.plan_name,
    billing_cycle: durationDays > 40 ? 'yearly' : 'monthly',
    payment_id: `admin_granted_${Date.now()}`,
    order_id: `admin_order_${Date.now()}`,
    subscription_status: 'ACTIVE',
    start_date: now.toISOString(),
    expiry_date: expiryDate,
    business_limit: businessLimit,
    team_member_limit: teamLimit,
    poster_limit: -1,
    watermark_status: 'NO_WATERMARK',
    monthly_free_clean_used: 0,
    current_month_key: getCurrentMonthKey(),
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };

  memoryStore.subscriptions[userId] = customSub;
  saveStore(memoryStore);
  return customSub;
}

export function updateTeamLeadStatus(
  leadId: string,
  status: TeamLeadRecord['status']
): TeamLeadRecord {
  const lead = memoryStore.teamLeads.find((l) => l.id === leadId);
  if (!lead) throw new Error('Lead not found');
  lead.status = status;
  saveStore(memoryStore);
  return lead;
}

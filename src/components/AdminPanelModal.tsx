import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  CreditCard,
  Layers,
  Calendar,
  Bell,
  LifeBuoy,
  Tag,
  Star,
  Sparkles,
  HardDrive,
  ShieldCheck,
  Settings,
  X,
  LogOut,
  ChevronRight,
  Shield,
  CheckCircle2,
  Lock,
  UserCheck,
  Zap,
  LayoutTemplate,
  Palette,
  Globe,
  Flame,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Video,
  Maximize2,
  Clock,
  QrCode,
} from 'lucide-react';
import {
  BusinessProfile,
  CategoryInfo,
  PosterTemplate,
  UserAccount,
  CustomerActivityLog,
  AdminRole,
} from '../types';
import { fetchAdminApprovalRequests, fetchAdminPayments } from '../services/subscriptionService';

import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminLiveUsersTab } from './admin/AdminLiveUsersTab';
import { AdminUserManagementTab } from './admin/AdminUserManagementTab';
import { AdminSubscriptionTab } from './admin/AdminSubscriptionTab';
import { AdminTemplatesTab } from './admin/AdminTemplatesTab';
import { AdminFestivalSchedulerTab } from './admin/AdminFestivalSchedulerTab';
import { AdminPushNotificationTab } from './admin/AdminPushNotificationTab';
import { AdminSupportTicketsTab } from './admin/AdminSupportTicketsTab';
import { AdminCouponsRewardsTab } from './admin/AdminCouponsRewardsTab';
import { AdminReviewsTab } from './admin/AdminReviewsTab';
import { AdminAIAnalyticsTab } from './admin/AdminAIAnalyticsTab';
import { AdminStorageExportTab } from './admin/AdminStorageExportTab';
import { AdminSecurityAuditTab } from './admin/AdminSecurityAuditTab';
import { AdminSettingsBackupTab } from './admin/AdminSettingsBackupTab';
import { AdminElementsTab } from './admin/AdminElementsTab';
import { AdminTeamManagementTab } from './admin/AdminTeamManagementTab';
import { AdminLandingPageTab } from './admin/AdminLandingPageTab';
import { AdminFramesTab } from './admin/AdminFramesTab';
import { AdminSiteControlTab } from './admin/AdminSiteControlTab';
import { AdminUserDashboardTab } from './admin/AdminUserDashboardTab';
import { AdminVideoSettingsTab } from './admin/AdminVideoSettingsTab';
import { AdminVideoStudioTab } from './admin/AdminVideoStudioTab';
import { AdminMasterTemplatesTab } from './admin/AdminMasterTemplatesTab';
import { AdminDesignSizesTab } from './admin/AdminDesignSizesTab';
import { VideoStudioModal } from './video-studio/VideoStudioModal';
import { LandingPageConfig, AdminVideoSettings, VideoStudioProject } from '../types';
import { DEFAULT_LANDING_CONFIG } from '../data/landingPageConfig';
import { WebsiteManualConfig, DEFAULT_WEBSITE_CONFIG } from '../data/websiteConfig';

export type AdminTabKey =
  | 'design_sizes'
  | 'master_templates'
  | 'video_studio'
  | 'user_dashboard'
  | 'overview'
  | 'video_settings'
  | 'site_control'
  | 'landing_page'
  | 'templates'
  | 'frames'
  | 'team_access'
  | 'users'
  | 'live_users'
  | 'subscriptions'
  | 'payment_verification'
  | 'payment_settings'
  | 'elements'
  | 'scheduler'
  | 'notifications'
  | 'support'
  | 'coupons_rewards'
  | 'reviews'
  | 'ai_analytics'
  | 'storage_export'
  | 'security_audit'
  | 'settings';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PosterTemplate[];
  categories: CategoryInfo[];
  activeProfile: BusinessProfile;
  users?: UserAccount[];
  activityLogs?: CustomerActivityLog[];
  landingConfig?: LandingPageConfig;
  onSaveLandingConfig?: (config: LandingPageConfig) => void;
  onPreviewLandingPage?: () => void;
  websiteConfig?: WebsiteManualConfig;
  onSaveWebsiteConfig?: (config: WebsiteManualConfig) => void;
  onSaveTemplate: (template: PosterTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate?: (template: PosterTemplate) => void;
  onSaveCategory?: (category: CategoryInfo) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onResetToDefaults?: () => void;
  onImportBackup?: (data: { templates?: PosterTemplate[]; categories?: CategoryInfo[] }) => void;
  onOpenInStudio?: (template: PosterTemplate) => void;
  onOpenQuickDesignStudio?: () => void;
  videoSettings?: AdminVideoSettings;
  onUpdateVideoSettings?: (settings: AdminVideoSettings) => void;
  onOpenVideoStudio?: (poster?: PosterTemplate | null, project?: VideoStudioProject | null) => void;
  onToggleUserStatus?: (userId: string) => void;
  onResetUserPassword?: (userId: string, newPass: string) => void;
  onDeleteUser?: (userId: string) => void;
  onAdminLogout?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  templates,
  categories,
  activeProfile,
  users = [],
  activityLogs = [],
  landingConfig = DEFAULT_LANDING_CONFIG,
  onSaveLandingConfig,
  onPreviewLandingPage,
  websiteConfig = DEFAULT_WEBSITE_CONFIG,
  onSaveWebsiteConfig,
  onSaveTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onSaveCategory,
  onDeleteCategory,
  onResetToDefaults,
  onImportBackup,
  onOpenInStudio,
  onOpenQuickDesignStudio,
  videoSettings = {
    enabled: true,
    defaultResolution: '1080p',
    maxDurationSeconds: 15,
    watermarkEnabled: false,
    autoAnimateEnabled: true,
    fps60Enabled: true,
    allowedRoles: ['MASTER_ADMIN', 'ADMIN', 'VIDEO_EDITOR'],
  },
  onUpdateVideoSettings,
  onOpenVideoStudio,
  onToggleUserStatus,
  onResetUserPassword,
  onDeleteUser,
  onAdminLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabKey>('templates');
  const [adminRole, setAdminRole] = useState<AdminRole>('super_admin');
  const [localUsers, setLocalUsers] = useState<UserAccount[]>(users);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingApprovalCount, setPendingApprovalCount] = useState<number>(0);
  const [pendingPaymentCount, setPendingPaymentCount] = useState<number>(0);
  const [internalVideoStudioPoster, setInternalVideoStudioPoster] = useState<PosterTemplate | null>(null);
  const [internalVideoStudioProject, setInternalVideoStudioProject] = useState<VideoStudioProject | null>(null);
  const [isInternalVideoStudioOpen, setIsInternalVideoStudioOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAdminApprovalRequests()
        .then((reqs) => {
          const count = reqs.filter((r) => r.status === 'pending').length;
          setPendingApprovalCount(count);
        })
        .catch(() => {});

      fetchAdminPayments()
        .then((res: any) => {
          const list = Array.isArray(res) ? res : (res?.payments || []);
          const pCount = list.filter((r: any) => r.status === 'pending').length;
          setPendingPaymentCount(pCount);
        })
        .catch(() => {});
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleToggleUser = (userId: string) => {
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
    if (onToggleUserStatus) onToggleUserStatus(userId);
  };

  const handleResetPass = (userId: string, pass: string) => {
    if (onResetUserPassword) onResetUserPassword(userId, pass);
  };

  const handleUpgradeVip = (userId: string) => {
    setLocalUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isPremium: true, subscriptionPlan: 'yearly' } : u
      )
    );
  };

  const menuItems: {
    key: AdminTabKey;
    label: string;
    labelMarathi: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
    rolesAllowed: AdminRole[];
  }[] = [
    {
      key: 'design_sizes',
      label: '📏 डिझाईन आकार (Design Sizes)',
      labelMarathi: '१:१, ४:५ व ९:१६ साईझ मॅट्रिक्स व कंट्रोल्स',
      icon: Maximize2,
      badge: '3 FIXED SIZES',
      badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black',
      rolesAllowed: ['super_admin', 'content_manager', 'editor'],
    },
    {
      key: 'video_studio',
      label: '🎬 Video Studio (व्हिडिओ स्टुडिओ)',
      labelMarathi: 'पोस्टर ॲनिमेशन व रील्स स्टुडिओ',
      icon: Video,
      badge: 'PRO Studio',
      badgeColor: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-black shadow-sm',
      rolesAllowed: ['super_admin', 'content_manager', 'editor'],
    },
    {
      key: 'user_dashboard',
      label: '🚩 मुख्य सण, बॅनर व पोस्टर CMS',
      labelMarathi: 'वरती सण On/Off, पोस्टर बदला, ३-दिवसीय सण',
      icon: Flame,
      badge: 'सण व पोस्टर बदला',
      badgeColor: 'bg-gradient-to-r from-red-600 to-amber-500 text-white font-black animate-pulse shadow-sm',
      rolesAllowed: ['super_admin', 'content_manager', 'editor'],
    },
    {
      key: 'video_settings',
      label: '🎬 सर्व व्हिडिओ ॲनिमेशन सेटींग्ज',
      labelMarathi: 'व्हिडिओ ॲडमिन सेटींग्ज',
      icon: Video,
      badge: '२० ॲनिमेशन्स',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black',
      rolesAllowed: ['super_admin', 'content_manager', 'editor'],
    },
    {
      key: 'site_control',
      label: '⚙️ संपूर्ण वेबसाईट मॅन्युअल बदल',
      labelMarathi: 'मॅन्युअल कंट्रोल पॅनल',
      icon: Globe,
      badge: 'Manual Control',
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
      rolesAllowed: ['super_admin', 'content_manager'],
    },
    {
      key: 'landing_page',
      label: '🌐 Landing Page CMS',
      labelMarathi: 'वेबसाईट होमपेज बिल्डर',
      icon: LayoutTemplate,
      badge: 'Live CMS',
      badgeColor: 'bg-emerald-500 text-slate-950 font-black',
      rolesAllowed: ['super_admin', 'content_manager'],
    },
    {
      key: 'master_templates',
      label: '👑 १५० युनिक मास्टर डिझाईन्स',
      labelMarathi: 'लग्न, साखरपुडा व CV लायब्ररी',
      icon: Sparkles,
      badge: '150 Designs',
      badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-xs',
      rolesAllowed: ['super_admin', 'content_manager', 'editor'],
    },
    {
      key: 'templates',
      label: '🎨 पोस्ट अपलोड व एडिट',
      labelMarathi: 'डिझाईन मॅनेजर',
      icon: Layers,
      badge: `${templates.length} पोस्ट्स`,
      badgeColor: 'bg-amber-500 text-slate-950 font-black',
      rolesAllowed: ['super_admin', 'content_manager', 'editor'],
    },
    {
      key: 'frames',
      label: '🖼️ २७ कलर थीम्स व फ्रेम्स',
      labelMarathi: 'फूटर फ्रेम मॅनेजर',
      icon: Palette,
      badge: '27 Frames',
      badgeColor: 'bg-blue-500/20 text-blue-300',
      rolesAllowed: ['super_admin', 'content_manager', 'editor'],
    },
    {
      key: 'team_access',
      label: '👥 ॲडमिन व टीम ॲक्सेस',
      labelMarathi: 'युझरनेम व पासवर्ड',
      icon: ShieldCheck,
      badge: 'Editor / Manager',
      badgeColor: 'bg-purple-500/20 text-purple-300',
      rolesAllowed: ['super_admin'],
    },
    {
      key: 'overview',
      label: 'Dashboard Overview',
      labelMarathi: 'मुख्य डॅशबोर्ड',
      icon: LayoutDashboard,
      rolesAllowed: ['super_admin', 'support_admin', 'content_manager', 'editor'],
    },
    {
      key: 'users',
      label: 'User Management',
      labelMarathi: 'वापरकर्ते व्यवस्थापन',
      icon: Users,
      badge: `${localUsers.length || '12.4k'}`,
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      rolesAllowed: ['super_admin', 'support_admin'],
    },
    {
      key: 'live_users',
      label: 'Live Active Users',
      labelMarathi: 'लाइव्ह वापरकर्ते',
      icon: Activity,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 animate-pulse',
      rolesAllowed: ['super_admin', 'support_admin', 'content_manager'],
    },
    {
      key: 'payment_verification',
      label: '🔔 Payment Verification',
      labelMarathi: 'पेमेंट पडताळणी व मंजुरी केंद्र',
      icon: ShieldCheck,
      badge: pendingPaymentCount > 0 ? `🔔 ${pendingPaymentCount} Pending!` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-black animate-pulse shadow-md',
      rolesAllowed: ['super_admin', 'support_admin'],
    },
    {
      key: 'payment_settings',
      label: '💳 Payment Settings',
      labelMarathi: 'UPI आयडी, QR कोड व सूचना',
      icon: QrCode,
      badge: 'UPI + QR',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 font-bold',
      rolesAllowed: ['super_admin'],
    },
    {
      key: 'subscriptions',
      label: 'Subscriptions & Approvals',
      labelMarathi: 'सबस्क्रिप्शन व मंजुरी केंद्र',
      icon: CreditCard,
      badge: pendingApprovalCount > 0 ? `⏳ ${pendingApprovalCount} मंजुरी बाकी!` : '₹4.82L',
      badgeColor: pendingApprovalCount > 0 ? 'bg-amber-500 text-slate-950 font-black animate-pulse shadow-md' : 'bg-amber-500/20 text-amber-300',
      rolesAllowed: ['super_admin'],
    },
    {
      key: 'elements',
      label: 'Elements & Icons Library',
      labelMarathi: 'एलिमेंट्स व आयकॉन्स',
      icon: Sparkles,
      badge: '50+ Assets',
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
      rolesAllowed: ['super_admin', 'content_manager'],
    },
    {
      key: 'scheduler',
      label: 'Festival Scheduler',
      labelMarathi: 'सण मोहीम शेड्युलर',
      icon: Calendar,
      rolesAllowed: ['super_admin', 'content_manager'],
    },
    {
      key: 'notifications',
      label: 'Push Broadcast Center',
      labelMarathi: 'पुश नोटिफिकेशन्स',
      icon: Bell,
      rolesAllowed: ['super_admin', 'support_admin', 'content_manager'],
    },
    {
      key: 'support',
      label: 'Support Tickets',
      labelMarathi: 'सपोर्ट हेल्पडेस्क',
      icon: LifeBuoy,
      badge: '4 New',
      badgeColor: 'bg-rose-500/20 text-rose-300',
      rolesAllowed: ['super_admin', 'support_admin'],
    },
    {
      key: 'coupons_rewards',
      label: 'Coupons & Daily Rewards',
      labelMarathi: 'कूपन्स व कॉईन्स',
      icon: Tag,
      rolesAllowed: ['super_admin', 'content_manager'],
    },
    {
      key: 'reviews',
      label: 'Play Store Reviews',
      labelMarathi: 'रिव्ह्यूज व रेटिंग्ज',
      icon: Star,
      badge: '4.8★',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      rolesAllowed: ['super_admin', 'support_admin'],
    },
    {
      key: 'ai_analytics',
      label: 'AI Gemini Usage',
      labelMarathi: 'AI स्लोगन वापर',
      icon: Sparkles,
      rolesAllowed: ['super_admin'],
    },
    {
      key: 'storage_export',
      label: 'Storage & Exports',
      labelMarathi: 'स्टोरेज व 4K डाऊनलोड',
      icon: HardDrive,
      rolesAllowed: ['super_admin'],
    },
    {
      key: 'security_audit',
      label: 'Security & Audit Logs',
      labelMarathi: 'सुरक्षा व ऑडिट लॉग',
      icon: ShieldCheck,
      rolesAllowed: ['super_admin'],
    },
    {
      key: 'settings',
      label: 'Settings & Backups',
      labelMarathi: 'सेटिंग्ज व बॅकअप',
      icon: Settings,
      rolesAllowed: ['super_admin'],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.rolesAllowed.includes(adminRole));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full h-full max-w-[1600px] max-h-[96vh] bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl shadow-2xl flex overflow-hidden relative">
        {/* Mobile Backdrop Overlay when sidebar is open */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute inset-0 z-25 bg-black/60 backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Left Sidebar - Toggleable on Mobile & Desktop */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-200 ease-in-out ${
            isSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:-ml-72'
          }`}
        >
          <div>
            {/* Brand Logo Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                </div>
                <div>
                  <h2 className="font-black text-sm text-white tracking-wide flex items-center gap-1.5">
                    <span>GrowView Admin</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 font-mono rounded">
                      PRO
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">Festival & Business Maker</p>
                </div>
              </div>

              {/* Close Button for Mobile Drawer */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="बार बंद करा"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role Switcher Pill */}
            <div className="p-3 mx-3 my-2 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1.5 px-1">
                <span className="text-slate-400 font-semibold">Active Role:</span>
                <span className="font-mono font-bold text-amber-400 uppercase text-[10px]">
                  {adminRole.replace('_', ' ')}
                </span>
              </div>
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value as AdminRole)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-xs font-semibold rounded-xl text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="super_admin">Super Admin (Full Access)</option>
                <option value="support_admin">Support Admin</option>
                <option value="content_manager">Content Manager</option>
              </select>
            </div>

            {/* Navigation Menu */}
            <nav className="p-2.5 space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1.5">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.key);
                      if (window.innerWidth < 1024) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer with Master Email & Logout */}
          <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="truncate">
              <span className="text-[11px] font-bold text-slate-200 truncate block">
                gunashreedigital@gmail.com
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                सुरक्षित ॲडमिन सत्र (Active)
              </span>
            </div>

            <button
              type="button"
              onClick={onAdminLogout || onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout / Close"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
          {/* Top Bar Header */}
          <header className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle Button for Mobile Preview & Desktop */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isSidebarOpen
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700'
                }`}
                title={isSidebarOpen ? 'ॲडमिन बार बंद करा (Hide Sidebar)' : 'ॲडमिन बार चालू करा (Show Sidebar)'}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4 text-amber-400" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-xs">
                  {isSidebarOpen ? 'बार बंद करा' : 'ॲडमिन मेनू बार'}
                </span>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white capitalize">
                    {visibleMenuItems.find((m) => m.key === activeTab)?.label}
                  </h1>
                  <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                    ({visibleMenuItems.find((m) => m.key === activeTab)?.labelMarathi})
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
                  GrowView Super Admin Dashboard • Real-time Sync & Postgres Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {pendingApprovalCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('subscriptions')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 animate-pulse transition-transform active:scale-95"
                  title="प्रलंबित सबस्क्रिप्शन मंजुरी तपासा"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{pendingApprovalCount} सबस्क्रिप्शन मंजुरी प्रलंबित!</span>
                </button>
              )}

              {/* Direct Video Studio Button in Admin Header */}
              <button
                type="button"
                onClick={() => {
                  setInternalVideoStudioPoster(templates?.[0] || null);
                  setInternalVideoStudioProject(null);
                  setIsInternalVideoStudioOpen(true);
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white rounded-xl text-xs font-black shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                title="व्हिडिओ स्टुडिओ थेट उघडा (Launch Video Studio)"
              >
                <Video className="w-3.5 h-3.5" />
                <span>🎬 व्हिडिओ स्टुडिओ</span>
              </button>

              {onOpenQuickDesignStudio && (
                <button
                  type="button"
                  onClick={onOpenQuickDesignStudio}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
                  title="सोपे डिझाईन स्टुडिओ (Simple Design Studio) उघडा"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">⚡ सोपे डिझाईन मॅनेजर</span>
                </button>
              )}

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono font-bold text-emerald-400">184 Live Active Users</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                title="Close Admin Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>


          {/* Tab Content Body with Scroll */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {activeTab === 'design_sizes' && (
              <AdminDesignSizesTab templates={templates} />
            )}

            {activeTab === 'video_studio' && (
              <AdminVideoStudioTab
                templates={templates}
                activeProfile={activeProfile}
                currentUser={localUsers.find((u) => u.role === 'admin')}
                videoSettings={videoSettings}
                onUpdateVideoSettings={(s) => onUpdateVideoSettings?.(s)}
                onOpenVideoStudio={(poster, project) => {
                  setInternalVideoStudioPoster(poster || templates?.[0] || null);
                  setInternalVideoStudioProject(project || null);
                  setIsInternalVideoStudioOpen(true);
                }}
              />
            )}

            {activeTab === 'user_dashboard' && (
              <AdminUserDashboardTab
                templates={templates}
                categories={categories}
              />
            )}

            {activeTab === 'overview' && (
              <AdminOverviewTab onNavigateTab={(tab) => setActiveTab(tab)} />
            )}

            {activeTab === 'team_access' && (
              <AdminTeamManagementTab
                users={localUsers}
                currentUser={localUsers.find(u => u.role === 'admin')}
                onSaveUser={(u) => {
                  setLocalUsers(prev => {
                    const idx = prev.findIndex(item => item.id === u.id);
                    if (idx >= 0) {
                      const copy = [...prev];
                      copy[idx] = u;
                      return copy;
                    }
                    return [u, ...prev];
                  });
                }}
                onDeleteUser={(id) => {
                  setLocalUsers(prev => prev.filter(u => u.id !== id));
                  if (onDeleteUser) onDeleteUser(id);
                }}
                onResetPassword={(id, p) => handleResetPass(id, p)}
                onToggleStatus={(id) => handleToggleUser(id)}
              />
            )}

            {activeTab === 'users' && (
              <AdminUserManagementTab
                users={localUsers}
                onToggleUserStatus={handleToggleUser}
                onResetUserPassword={handleResetPass}
                onUpgradeToVip={handleUpgradeVip}
              />
            )}

            {activeTab === 'live_users' && <AdminLiveUsersTab />}

            {activeTab === 'payment_verification' && (
              <AdminSubscriptionTab initialSubTab="payment_verification" />
            )}

            {activeTab === 'payment_settings' && (
              <AdminSubscriptionTab initialSubTab="payment_settings" />
            )}

            {activeTab === 'subscriptions' && <AdminSubscriptionTab initialSubTab="subscriptions" />}

            {activeTab === 'video_settings' && (
              <AdminVideoSettingsTab
                templates={templates}
                onOpenVideoStudio={() => {
                  setInternalVideoStudioPoster(templates?.[0] || null);
                  setInternalVideoStudioProject(null);
                  setIsInternalVideoStudioOpen(true);
                }}
              />
            )}

            {activeTab === 'site_control' && (
              <AdminSiteControlTab
                config={websiteConfig || DEFAULT_WEBSITE_CONFIG}
                onSaveConfig={(newCfg) => {
                  if (onSaveWebsiteConfig) onSaveWebsiteConfig(newCfg);
                }}
              />
            )}

            {activeTab === 'landing_page' && (
              <AdminLandingPageTab
                config={landingConfig}
                templates={templates}
                categories={categories}
                onSaveConfig={(newCfg) => {
                  if (onSaveLandingConfig) onSaveLandingConfig(newCfg);
                }}
                onPreviewLandingPage={onPreviewLandingPage}
              />
            )}

            {activeTab === 'frames' && (
              <AdminFramesTab activeProfile={activeProfile} />
            )}

            {activeTab === 'master_templates' && (
              <AdminMasterTemplatesTab />
            )}

            {activeTab === 'templates' && (
              <AdminTemplatesTab
                templates={templates}
                categories={categories}
                activeProfile={activeProfile}
                adminRole={adminRole}
                onSaveTemplate={onSaveTemplate}
                onDeleteTemplate={onDeleteTemplate}
                onDuplicateTemplate={onDuplicateTemplate}
                onOpenInStudio={onOpenInStudio}
                onSaveCategory={onSaveCategory}
                onDeleteCategory={onDeleteCategory}
              />
            )}

            {activeTab === 'elements' && <AdminElementsTab />}

            {activeTab === 'scheduler' && <AdminFestivalSchedulerTab />}

            {activeTab === 'notifications' && <AdminPushNotificationTab />}

            {activeTab === 'support' && <AdminSupportTicketsTab />}

            {activeTab === 'coupons_rewards' && <AdminCouponsRewardsTab />}

            {activeTab === 'reviews' && <AdminReviewsTab />}

            {activeTab === 'ai_analytics' && <AdminAIAnalyticsTab />}

            {activeTab === 'storage_export' && <AdminStorageExportTab />}

            {activeTab === 'security_audit' && <AdminSecurityAuditTab />}

            {activeTab === 'settings' && (
              <AdminSettingsBackupTab
                users={localUsers}
                templates={templates}
                onImportBackup={onImportBackup}
              />
            )}
          </div>
        </main>
      </div>

      {/* Internal Video Studio Modal fallback */}
      {isInternalVideoStudioOpen && (
        <VideoStudioModal
          isOpen={isInternalVideoStudioOpen}
          onClose={() => {
            setIsInternalVideoStudioOpen(false);
            setInternalVideoStudioPoster(null);
            setInternalVideoStudioProject(null);
          }}
          basePoster={internalVideoStudioPoster}
          sourcePoster={internalVideoStudioPoster}
          availablePosters={templates}
          initialProject={internalVideoStudioProject}
          activeProfile={activeProfile}
          currentUser={localUsers.find((u) => u.role === 'admin')}
          userId={localUsers.find((u) => u.role === 'admin')?.id || 'admin_user'}
          adminSettings={videoSettings}
        />
      )}
    </div>
  );
};

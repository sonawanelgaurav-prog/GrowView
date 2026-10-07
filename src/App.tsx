import React, { useState, useEffect, useCallback } from 'react';
import {
  AspectRatio,
  BusinessProfile,
  CanvasCustomElement,
  CategoryInfo,
  FrameId,
  PosterTemplate,
  UserAccount,
  CustomerActivityLog,
  LanguageCode,
  AdminVideoSettings,
  VideoStudioProject,
} from './types';
import { DEFAULT_PROFILES } from './data/defaultProfiles';
import { CATEGORIES } from './data/categories';
import { POSTER_TEMPLATES } from './data/templates';
import { deduplicateCategories } from './utils/categoryUtils';
import { INITIAL_USER_ACCOUNTS, INITIAL_ACTIVITY_LOGS, validatePassword } from './utils/authUtils';
import { BrandsLiveHeader } from './components/brands/BrandsLiveHeader';
import { BrandsLiveMobileBottomNav } from './components/brands/BrandsLiveMobileBottomNav';
import { VIPPlanModal } from './components/brands/VIPPlanModal';
import { PricingModal } from './components/pricing/PricingModal';
import { BusinessTeamModal } from './components/team/BusinessTeamModal';
import { WhatsAppSupportFloat } from './components/brands/WhatsAppSupportFloat';
import { TemplateGallery } from './components/TemplateGallery';
import { PosterEditor, PosterEditorExportPayload } from './components/PosterEditor';
import { BrandProfileModal } from './components/BrandProfileModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { GaneshAIGeneratorModal } from './components/GaneshAIGeneratorModal';
import { ExportModal } from './components/ExportModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { QuickDesignStudioModal } from './components/admin/QuickDesignStudioModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { getStoredAuthToken, verifyCurrentSession, clearStoredAuthToken, logoutUser } from './services/authService';
import { Loader2, Sparkles } from 'lucide-react';
import { PosterPreviewModal } from './components/PosterPreviewModal';
import { VideoStudioModal } from './components/video-studio/VideoStudioModal';
import { AutoPosterReelModal } from './components/video-studio/AutoPosterReelModal';
import { InstallAppModal } from './components/InstallAppModal';
import { CustomerActivityModal } from './components/CustomerActivityModal';
import { AIFestivalAutoCreatorModal } from './components/ai-festival/AIFestivalAutoCreatorModal';
import { LandingPage } from './components/landing/LandingPage';
import { LandingPageConfig, FooterFrameConfig } from './types';
import { detectDateFromSearchQuery, isTemplateForSelectedCalendarDate } from './data/calendarFestivals';
import { DEFAULT_LANDING_CONFIG, loadLandingPageConfig, saveLandingPageConfig } from './data/landingPageConfig';
import { WebsiteManualConfig, loadWebsiteConfig, saveWebsiteConfig } from './data/websiteConfig';
import {
  saveUserToFirestore,
  getUserFromFirestore,
  saveBusinessProfileToFirestore,
  getBusinessProfilesFromFirestore,
  saveActivityLogToFirestore,
  saveTemplateToFirestore,
  signOutUser,
  auth,
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // Language State
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('mr');
  const [isVIPModalOpen, setIsVIPModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  // 1. Profiles State
  const [profiles, setProfiles] = useState<BusinessProfile[]>(() => {
    try {
      const saved = localStorage.getItem('growview_profiles') || localStorage.getItem('design1123_profiles');
      if (saved) {
        const parsed: BusinessProfile[] = JSON.parse(saved);
        return parsed.map((p, idx) => {
          if (idx === 0 && (!p.phone || p.phone.includes('98765'))) {
            return { ...p, phone: '7774914906', whatsapp: '7774914906' };
          }
          return p;
        });
      }
    } catch (e) {
      console.warn('Error loading profiles from localStorage:', e);
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfile, setActiveProfile] = useState<BusinessProfile>(() => {
    return profiles.find(p => p.isDefault) || profiles[0];
  });

  // Save profiles to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('growview_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.warn('Error saving profiles:', e);
    }
  }, [profiles]);

  // 2. User Accounts State with Persistence
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('growview_users') || localStorage.getItem('design1123_users');
      if (saved) {
        const parsed: UserAccount[] = JSON.parse(saved);
        // Sanitize any legacy hardcoded default passwords from client storage
        return parsed.map((u) => {
          if (
            u.password === 'Admin@GrowView#Secure' ||
            u.password === 'Editor@GrowView#Secure' ||
            u.password === 'Content@GrowView#Secure' ||
            u.password === 'Ganesh@2026#Mart' ||
            u.password === 'Patil#Realty99' ||
            u.password === 'Admin@1123#Secure'
          ) {
            const { password, ...cleanUser } = u;
            return cleanUser as UserAccount;
          }
          return u;
        });
      }
    } catch (e) {
      console.warn('Error loading users from localStorage:', e);
    }
    return INITIAL_USER_ACCOUNTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('growview_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Error saving users:', e);
    }
  }, [users]);

  // 3. Customer Activity Logs State with Persistence
  const [activityLogs, setActivityLogs] = useState<CustomerActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('growview_activity_logs') || localStorage.getItem('design1123_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error loading activity logs from localStorage:', e);
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('growview_activity_logs', JSON.stringify(activityLogs));
    } catch (e) {
      console.warn('Error saving activity logs:', e);
    }
  }, [activityLogs]);

  // 4. Current Logged In User State - Strict Authentication Enforced (Never auto-logins)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState<boolean>(true);

  // Strictly verify session token against backend on mount
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      try {
        const token = getStoredAuthToken();
        if (token) {
          const verifiedUser = await verifyCurrentSession();
          if (isMounted) {
            if (verifiedUser) {
              setCurrentUser(verifiedUser);
            } else {
              clearStoredAuthToken();
              setCurrentUser(null);
            }
          }
        } else {
          clearStoredAuthToken();
          if (isMounted) setCurrentUser(null);
        }
      } catch (err) {
        clearStoredAuthToken();
        if (isMounted) setCurrentUser(null);
      } finally {
        if (isMounted) setIsAuthInitializing(false);
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Firebase Auth State Listener & Firestore Synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const cloudUser = await getUserFromFirestore(fbUser.uid);
          if (cloudUser) {
            setCurrentUser(cloudUser);
            // Fetch cloud-saved business profiles
            const cloudProfiles = await getBusinessProfilesFromFirestore(fbUser.uid);
            if (cloudProfiles && cloudProfiles.length > 0) {
              setProfiles(cloudProfiles);
              const def = cloudProfiles.find((p) => p.isDefault) || cloudProfiles[0];
              setActiveProfile(def);
            }
          }
        } catch (err) {
          console.warn('Firebase state sync notice:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Activity Logger Helper
  const logActivity = useCallback(
    (
      actionType: CustomerActivityLog['actionType'],
      actionTitle: string,
      actionTitleMarathi: string,
      details: string,
      templateId?: string,
      templateTitle?: string,
      specificUserId?: string,
      specificUserEmail?: string
    ) => {
      const targetUserId = specificUserId || currentUser?.id || 'guest-anon';
      const targetUserEmail = specificUserEmail || currentUser?.email || 'guest@user.com';

      const newLog: CustomerActivityLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: targetUserId,
        userEmail: targetUserEmail,
        timestamp: new Date().toISOString(),
        actionType,
        actionTitle,
        actionTitleMarathi,
        details,
        templateId,
        templateTitle,
        deviceInfo: navigator.userAgent.includes('Mobile') ? 'Mobile Web App' : 'Desktop Browser (Chrome/Edge)',
      };

      setActivityLogs(prev => [newLog, ...prev]);

      if (targetUserId && targetUserId !== 'guest-anon') {
        saveActivityLogToFirestore(targetUserId, newLog).catch(() => {});
      }
    },
    [currentUser]
  );

  // 5. Dynamic Categories State with LocalStorage Persistence
  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem('growview_categories') || localStorage.getItem('design1123_categories');
      if (saved) {
        const parsed: CategoryInfo[] = JSON.parse(saved);
        const systemCategoryMap = new Map(CATEGORIES.map(c => [c.id, c]));
        const updated = parsed.map(c => systemCategoryMap.get(c.id) || c);
        const missing = CATEGORIES.filter(c => !parsed.some(p => p.id === c.id));
        const combined = deduplicateCategories([...updated, ...missing]);
        localStorage.setItem('growview_categories', JSON.stringify(combined));
        return combined;
      }
    } catch (e) {
      console.warn('Error loading categories from localStorage:', e);
    }
    return deduplicateCategories(CATEGORIES);
  });

  useEffect(() => {
    try {
      localStorage.setItem('growview_categories', JSON.stringify(deduplicateCategories(categories)));
    } catch (e) {
      console.warn('Error saving categories:', e);
    }
  }, [categories]);

  // 6. Dynamic Poster Templates State with LocalStorage Persistence
  const [templates, setTemplates] = useState<PosterTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('growview_templates') || localStorage.getItem('design1123_templates');
      if (saved) {
        const parsed: PosterTemplate[] = JSON.parse(saved);
        const systemTemplateMap = new Map(POSTER_TEMPLATES.map(t => [t.id, t]));
        // Keep updated system templates and all custom user-created templates, preserving user edits!
        const updated = parsed.map(t => {
          const sys = systemTemplateMap.get(t.id);
          return sys ? { ...sys, ...t } : t;
        });
        const missingSystemTemplates = POSTER_TEMPLATES.filter(t => !parsed.some(p => p.id === t.id));
        const combined = [...updated, ...missingSystemTemplates];
        // Sort so uploaded / custom designs appear at the very start
        const sorted = [...combined].sort((a, b) => {
          const aCustom = Boolean(a.isCustomUpload || a.id.startsWith('tpl-admin-') || a.id.startsWith('tpl-custom-'));
          const bCustom = Boolean(b.isCustomUpload || b.id.startsWith('tpl-admin-') || b.id.startsWith('tpl-custom-'));
          if (aCustom && !bCustom) return -1;
          if (!aCustom && bCustom) return 1;
          return 0;
        });
        localStorage.setItem('growview_templates', JSON.stringify(sorted));
        return sorted;
      }
    } catch (e) {
      console.warn('Error loading templates from localStorage:', e);
    }
    return POSTER_TEMPLATES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('growview_templates', JSON.stringify(templates));
    } catch (e) {
      console.warn('Error saving templates:', e);
    }
  }, [templates]);

  // AI Modal States
  const [isGaneshAIModalOpen, setIsGaneshAIModalOpen] = useState(false);

  // Gallery Navigation & Filter State
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Poster in Studio Editor (null = gallery view)
  const [editingTemplate, setEditingTemplate] = useState<PosterTemplate | null>(null);

  // Active Poster in Interactive Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<PosterTemplate | null>(null);

  // Pending items queued before user completes authentication
  const [pendingTemplate, setPendingTemplate] = useState<PosterTemplate | null>(null);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  // View Mode: 'landing' (public marketing homepage) or 'app' (poster studio / gallery)
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('app');

  // Landing Page CMS Configuration with Persistence
  const [landingConfig, setLandingConfig] = useState<LandingPageConfig>(() => {
    return loadLandingPageConfig();
  });

  useEffect(() => {
    saveLandingPageConfig(landingConfig);
  }, [landingConfig]);

  // Website Manual CMS / Admin Site Configuration with Persistence
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteManualConfig>(() => {
    return loadWebsiteConfig();
  });

  useEffect(() => {
    saveWebsiteConfig(websiteConfig);
  }, [websiteConfig]);

  // Global Frame Style & Flexible Arrangement State (Synchronized everywhere)
  const [activeFrameId, setActiveFrameId] = useState<FrameId>(() => {
    return websiteConfig.defaultFrameId || 'footer-01';
  });

  const [globalFrameConfig, setGlobalFrameConfig] = useState<Partial<FooterFrameConfig>>(() => {
    return {
      arrangement: websiteConfig.defaultFrameArrangement || 'bottom',
      customFontSize: websiteConfig.defaultFrameFontSize || 14,
      isBold: websiteConfig.defaultFrameIsBold !== false,
      bgColor: websiteConfig.defaultFrameBgColor || '',
      textColor: websiteConfig.defaultFrameTextColor || '',
    };
  });

  const handleSaveWebsiteConfig = (newCfg: WebsiteManualConfig) => {
    setWebsiteConfig(newCfg);
    setActiveFrameId(newCfg.defaultFrameId);
    setGlobalFrameConfig(prev => ({
      ...prev,
      arrangement: newCfg.defaultFrameArrangement,
      customFontSize: newCfg.defaultFrameFontSize,
      isBold: newCfg.defaultFrameIsBold,
      bgColor: newCfg.defaultFrameBgColor,
      textColor: newCfg.defaultFrameTextColor,
    }));
  };

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAIFestivalModalOpen, setIsAIFestivalModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isQuickDesignModalOpen, setIsQuickDesignModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | undefined>(undefined);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Video Studio & Reels Generator State
  const [isVideoStudioOpen, setIsVideoStudioOpen] = useState(false);
  const [videoStudioTargetPoster, setVideoStudioTargetPoster] = useState<PosterTemplate | null>(null);
  const [videoStudioInitialProject, setVideoStudioInitialProject] = useState<VideoStudioProject | null>(null);
  const [videoSettings, setVideoSettings] = useState<AdminVideoSettings>(() => {
    try {
      const saved = localStorage.getItem('gunashree_video_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load video settings:', e);
    }
    return {
      enabled: true,
      defaultResolution: '1080p',
      maxDurationSeconds: 15,
      watermarkEnabled: false,
      autoAnimateEnabled: true,
      fps60Enabled: true,
      allowedRoles: ['MASTER_ADMIN', 'ADMIN', 'VIDEO_EDITOR'],
    };
  });

  const handleUpdateVideoSettings = (settings: AdminVideoSettings) => {
    setVideoSettings(settings);
    try {
      localStorage.setItem('gunashree_video_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save video settings:', e);
    }
  };

  const handleOpenVideoStudio = (poster?: PosterTemplate | null, project?: VideoStudioProject | null) => {
    setVideoStudioTargetPoster(poster || null);
    setVideoStudioInitialProject(project || null);
    setIsVideoStudioOpen(true);
  };

  // 1-Click Auto Poster Animated Reel Generator State
  const [isAutoReelModalOpen, setIsAutoReelModalOpen] = useState(false);
  const [autoReelPoster, setAutoReelPoster] = useState<PosterTemplate | null>(null);

  const handleOpenAutoPosterReel = (poster: PosterTemplate) => {
    setAutoReelPoster(poster);
    setIsAutoReelModalOpen(true);
  };

  const [exportModalConfig, setExportModalConfig] = useState<{
    isOpen: boolean;
    template: PosterTemplate | null;
    profile: BusinessProfile;
    frameId: FrameId;
    aspectRatio: AspectRatio;
    showFooter?: boolean;
    headline: string;
    subtext: string;
    quote: string;
    elements: CanvasCustomElement[];
    customBgImage?: string | null;
    customBgGradient?: string;
    companyLogoUrl?: string | null;
    companyLogoPosition?: { x: number; y: number; size: number };
    headlineStyle?: any;
    subtextStyle?: any;
    quoteStyle?: any;
    dateBadgeStyle?: any;
    motifStyle?: any;
    footerConfig?: any;
  }>({
    isOpen: false,
    template: null,
    profile: activeProfile,
    frameId: 'footer-01',
    aspectRatio: '1:1',
    showFooter: true,
    headline: '',
    subtext: '',
    quote: '',
    elements: [],
  });

  // Filter templates based on group, category, and search query
  const filteredTemplates = templates.filter((tpl) => {
    // 1. Group filter
    if (activeGroup === 'festivals' && tpl.subCategory !== 'festivals') return false;
    if (activeGroup === 'business' && tpl.subCategory !== 'business') return false;
    if (activeGroup === 'daily' && tpl.subCategory !== 'daily' && tpl.category !== 'good-morning-quotes' && tpl.category !== 'good-night-quotes' && tpl.category !== 'suvichar-morning' && tpl.category !== 'quotes-motivation') return false;
    if (activeGroup === 'upcoming' && !tpl.isTrending && !tpl.isToday) return false;

    // 2. Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'upcoming' && !tpl.isTrending && !tpl.isToday) return false;
      if (selectedCategory !== 'upcoming' && tpl.category !== selectedCategory) return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      // Check if user is searching for a specific date (e.g. "14 एप्रिल", "4 ऑक्टोबर", "14 सप्टेंबर", "24 मार्च", "19 फेब्रुवारी")
      const detectedDate = detectDateFromSearchQuery(searchQuery);
      if (detectedDate) {
        // User specifically searched for a date: STRICTLY return ONLY posters that match that date!
        return isTemplateForSelectedCalendarDate(tpl, detectedDate.fullDateStr);
      }

      // Normal text search
      const q = searchQuery.toLowerCase();
      const matchTitle = tpl.title.toLowerCase().includes(q);
      const matchNative = tpl.titleNative?.toLowerCase().includes(q);
      const matchHeadline = tpl.headline.toLowerCase().includes(q);
      const matchSubtext = tpl.subtext?.toLowerCase().includes(q);
      const matchQuote = tpl.quote?.toLowerCase().includes(q);
      const matchCategory = tpl.category.toLowerCase().includes(q);
      const matchSubCategory = tpl.subCategory?.toLowerCase().includes(q);
      const matchDateBadge = tpl.dateBadge?.toLowerCase().includes(q);
      const matchTags = Array.isArray((tpl as any).tags) && (tpl as any).tags.some((t: string) => t.toLowerCase().includes(q));
      const matchFestivals = Array.isArray(tpl.festivalNames) && tpl.festivalNames.some((f: string) => f.toLowerCase().includes(q));
      if (!matchTitle && !matchNative && !matchHeadline && !matchSubtext && !matchQuote && !matchCategory && !matchSubCategory && !matchDateBadge && !matchTags && !matchFestivals) return false;
    }

    return true;
  }).sort((a, b) => {
    // Priority: Custom / Uploaded designs ALWAYS appear at the very beginning, sorted newest first
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
    if (aTime && bTime && aTime !== bTime) {
      return bTime - aTime;
    }
    const aCustom = Boolean(a.isCustomUpload || a.isNew || a.isJustUploaded || a.id.startsWith('tpl-admin-') || a.id.startsWith('tpl-custom-'));
    const bCustom = Boolean(b.isCustomUpload || b.isNew || b.isJustUploaded || b.id.startsWith('tpl-admin-') || b.id.startsWith('tpl-custom-'));
    if (aCustom && !bCustom) return -1;
    if (!aCustom && bCustom) return 1;
    return 0;
  });

  // Strict Video Studio Access Permission Gate (Admins & Authorized Video Editors)
  const hasVideoEditorAccess = Boolean(
    currentUser?.role === 'admin' ||
    currentUser?.adminRole === 'super_admin' ||
    currentUser?.adminRole === 'editor' ||
    currentUser?.platformRole === 'MASTER_ADMIN' ||
    currentUser?.platformRole === 'VIDEO_EDITOR' ||
    currentUser?.permissions?.video_editor_access === true
  );

  // --- AUTHENTICATION & CUSTOMER ACCOUNT HANDLERS ---
  const handleLogin = (user: UserAccount) => {
    // Check if account is suspended
    if (user.status === 'suspended') {
      alert('Your account has been suspended by the administrator. Please contact support.');
      return;
    }

    const updatedUser: UserAccount = {
      ...user,
      lastLoginAt: new Date().toISOString(),
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));

    // Sync business profile if user has one
    if (updatedUser.businessName) {
      const matchedProfile = profiles.find(
        p => p.name.toLowerCase() === updatedUser.businessName?.toLowerCase()
      );
      if (matchedProfile) {
        setActiveProfile(matchedProfile);
      }
    }

    logActivity(
      'login',
      'User Logged In',
      'वापरकर्ता लॉग इन झाला',
      `Logged in from ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'} browser`,
      undefined,
      undefined,
      updatedUser.id,
      updatedUser.email
    );

    setIsAuthModalOpen(false);
    setAuthPromptMessage(undefined);
    setViewMode('app');
    if (pendingTemplate) {
      setEditingTemplate(pendingTemplate);
      setPendingTemplate(null);
    } else if (pendingCategory) {
      setSelectedCategory(pendingCategory);
      setPendingCategory(null);
    }
  };

  const handleRegister = (newUser: UserAccount) => {
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Also automatically create a business brand profile for the new user
    const newProfile: BusinessProfile = {
      id: `profile-${Date.now()}`,
      name: newUser.businessName || newUser.name,
      tagline: 'Quality Products & Best Service (उत्तम दर्जा व विश्वासार्ह सेवा)',
      phone: newUser.phone || '+91 98765 43210',
      whatsapp: newUser.phone || '+91 98765 43210',
      email: newUser.email,
      address: newUser.city ? `${newUser.city}, Maharashtra` : 'Pune, Maharashtra',
      ownerName: newUser.name,
      designation: 'Proprietor',
      logoUrl: '',
      website: 'www.growview.com',
      socialHandle: `@${(newUser.businessName || newUser.name).toLowerCase().replace(/\s+/g, '')}`,
      brandColor: '#4f46e5',
      isDefault: true,
    };
    setProfiles(prev => [newProfile, ...prev]);
    setActiveProfile(newProfile);

    // Sync to Cloud Firestore
    saveUserToFirestore(newUser).catch(() => {});
    saveBusinessProfileToFirestore(newUser.id, newProfile).catch(() => {});

    logActivity(
      'register',
      'New Account Registered',
      'नवीन ग्राहक खाते तयार झाले',
      `Registered new business: ${newUser.businessName || 'Personal'} (${newUser.businessCategory}) with secure password`,
      undefined,
      undefined,
      newUser.id,
      newUser.email
    );

    setIsAuthModalOpen(false);
    setAuthPromptMessage(undefined);
    setViewMode('app');
    if (pendingTemplate) {
      setEditingTemplate(pendingTemplate);
      setPendingTemplate(null);
    } else if (pendingCategory) {
      setSelectedCategory(pendingCategory);
      setPendingCategory(null);
    }
  };

  const handleLogout = async () => {
    if (currentUser) {
      logActivity(
        'logout',
        'User Logged Out',
        'वापरकर्ता लॉग आऊट झाला',
        'Customer signed out of the application'
      );
    }
    await logoutUser();
    signOutUser().catch(() => {});
    setCurrentUser(null);
    setPendingTemplate(null);
    setPendingCategory(null);
    setAuthPromptMessage(undefined);
    setViewMode('landing');
    setEditingTemplate(null);
  };

  const handleUpdatePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return;
    if (currentUser.password !== oldPass) {
      alert('Current password does not match. Please try again.');
      return;
    }

    const validation = validatePassword(newPass);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const updatedUser: UserAccount = {
      ...currentUser,
      password: newPass,
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    logActivity(
      'password_change',
      'Password Changed by Customer',
      'ग्राहकाने पासवर्ड बदलला',
      'Customer updated their account password following strict security format'
    );
  };

  const handleAdminResetPassword = (userId: string, newPass: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return { ...u, password: newPass };
        }
        return u;
      })
    );

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, password: newPass } : null));
    }

    const targetUser = users.find(u => u.id === userId);
    logActivity(
      'password_change',
      'Password Reset by Admin',
      'ॲडमीन द्वारे पासवर्ड रिसेट केला',
      `Admin updated password for account: ${targetUser?.email || userId}`,
      undefined,
      undefined,
      userId,
      targetUser?.email
    );
  };

  const handleResetPasswordByEmail = (emailOrPhone: string, newPass: string): boolean => {
    const clean = emailOrPhone.trim().toLowerCase();
    const targetUser = users.find(
      u => u.email.toLowerCase() === clean || u.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );
    if (!targetUser) return false;

    setUsers(prev =>
      prev.map(u => (u.id === targetUser.id ? { ...u, password: newPass } : u))
    );

    if (currentUser && currentUser.id === targetUser.id) {
      setCurrentUser(prev => (prev ? { ...prev, password: newPass } : null));
    }

    logActivity(
      'password_change',
      'Password Reset via Email OTP',
      'ईमेल OTP द्वारे पासवर्ड रिसेट केला',
      `User reset password via verified OTP sent from gunashreedigital@gmail.com to ${targetUser.email}`,
      undefined,
      undefined,
      targetUser.id,
      targetUser.email
    );

    return true;
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          logActivity(
            'profile_update',
            `Account Status Changed: ${nextStatus.toUpperCase()}`,
            `खाते स्थिती बदलली: ${nextStatus === 'active' ? 'सक्रिय' : 'निलंबित'}`,
            `Administrator changed status to ${nextStatus}`,
            undefined,
            undefined,
            u.id,
            u.email
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    logActivity(
      'profile_update',
      'Customer Account Deleted',
      'ग्राहक खाते हटवले',
      `Administrator removed customer account: ${targetUser?.email || userId}`
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
  };

  // Dedicated Admin Login & Access Handlers
  const handleOpenAdmin = () => {
    if (currentUser?.role === 'admin') {
      setIsAdminModalOpen(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = (adminUser: UserAccount) => {
    // Ensure admin user exists in list or update it
    setUsers(prev => {
      const exists = prev.some(u => u.id === adminUser.id || u.email.toLowerCase() === adminUser.email.toLowerCase());
      if (exists) {
        return prev.map(u => (u.id === adminUser.id || u.email.toLowerCase() === adminUser.email.toLowerCase() ? { ...u, role: 'admin', lastLoginAt: new Date().toISOString() } : u));
      }
      return [adminUser, ...prev];
    });

    setCurrentUser(adminUser);
    logActivity(
      'login',
      'Super Admin Authenticated',
      'ॲडमीन सुरक्षित प्रवेश मंजूर',
      `Admin logged in via Dedicated Admin Portal (${adminUser.email})`,
      undefined,
      undefined,
      adminUser.id,
      adminUser.email
    );
    setIsAdminLoginModalOpen(false);
    setIsAdminModalOpen(true);
    setViewMode('app');
  };

  const handleAdminLogout = async () => {
    if (currentUser) {
      logActivity(
        'logout',
        'Admin Console Locked / Logged Out',
        'ॲडमीन सत्र सुरक्षित लॉक केले',
        `Admin logged out from Admin Studio Console (${currentUser.email})`
      );
    }
    await logoutUser();
    signOutUser().catch(() => {});
    setCurrentUser(null);
    setIsAdminModalOpen(false);
    setViewMode('landing');
  };

  // Save profile updates
  const handleSaveProfile = (updatedProfile: BusinessProfile) => {
    setProfiles(prev => {
      const exists = prev.some(p => p.id === updatedProfile.id);
      if (exists) {
        return prev.map(p => (p.id === updatedProfile.id ? updatedProfile : p));
      }
      return [...prev, updatedProfile];
    });
    setActiveProfile(updatedProfile);

    if (currentUser?.id) {
      saveBusinessProfileToFirestore(currentUser.id, updatedProfile).catch(() => {});
    }

    logActivity(
      'profile_update',
      'Brand Profile Updated',
      'ब्रँड प्रोफाइल अपडेट केले',
      `Updated business frame details for "${updatedProfile.name}"`
    );
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter(p => p.id !== id);
    setProfiles(remaining);
    if (activeProfile.id === id) {
      setActiveProfile(remaining[0]);
    }
  };

  // --- ADMIN PANEL CRUD HANDLERS ---
  const handleSaveTemplate = (tpl: PosterTemplate) => {
    const nowIso = new Date().toISOString();

    setTemplates(prev => {
      const existing = prev.find(t => t.id === tpl.id);
      const stampedTpl: PosterTemplate = {
        ...(existing || {}),
        ...tpl,
        isCustomUpload: existing?.isCustomUpload ?? true,
        isNew: true,
        isJustUploaded: true,
        createdAt: tpl.createdAt || (tpl as any).created_at || existing?.createdAt || nowIso,
        created_at: tpl.createdAt || (tpl as any).created_at || existing?.createdAt || nowIso,
        isTrending: tpl.isTrending ?? true,
      };

      const rest = prev.filter(t => t.id !== stampedTpl.id);
      const nextTemplates = [stampedTpl, ...rest];

      try {
        localStorage.setItem('growview_templates', JSON.stringify(nextTemplates));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }

      if (currentUser?.id) {
        saveTemplateToFirestore(stampedTpl, currentUser.id).catch(() => {});
      }

      return nextTemplates;
    });

    // Auto-switch to 'all' category and clear any search so user immediately sees newly uploaded poster right at the top
    setSelectedCategory('all');
    setActiveGroup('all');
    setSearchQuery('');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleDuplicateTemplate = (tpl: PosterTemplate) => {
    const dup: PosterTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
      title: `${tpl.title} (Copy)`,
      titleNative: tpl.titleNative ? `${tpl.titleNative} (प्रत)` : undefined,
      isCustomUpload: true,
      createdAt: new Date().toISOString(),
    };
    setTemplates(prev => [dup, ...prev]);
  };

  const handleSaveCategory = (cat: CategoryInfo) => {
    setCategories(prev => {
      const rest = prev.filter(c => c.id !== cat.id);
      return deduplicateCategories([cat, ...rest]);
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    if (selectedCategory === categoryId) {
      setSelectedCategory('all');
    }
  };

  const handleResetToDefaults = () => {
    setTemplates(POSTER_TEMPLATES);
    setCategories(CATEGORIES);
    try {
      localStorage.removeItem('growview_templates');
      localStorage.removeItem('growview_categories');
      localStorage.removeItem('design1123_templates');
      localStorage.removeItem('design1123_categories');
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
  };

  const handleImportBackup = (data: { templates?: PosterTemplate[]; categories?: CategoryInfo[] }) => {
    if (data.templates && Array.isArray(data.templates)) {
      setTemplates(data.templates);
    }
    if (data.categories && Array.isArray(data.categories)) {
      setCategories(data.categories);
    }
  };

  // Quick download from gallery card
  const handleQuickDownload = (tpl: PosterTemplate) => {
    setExportModalConfig({
      isOpen: true,
      template: tpl,
      profile: activeProfile,
      frameId: activeFrameId || tpl.defaultFrameId,
      aspectRatio: tpl.aspectRatio || '1:1',
      headline: tpl.headline,
      subtext: tpl.subtext,
      quote: tpl.quote || '',
      elements: (tpl as any).customElements || (tpl as any).elements || [],
      customBgImage: (tpl as any).customBgImage || (tpl as any).customBgUrl || (tpl.motifType === 'custom-image' ? tpl.imageUrl : undefined),
      customBgGradient: tpl.theme?.bgGradient,
      footerConfig: globalFrameConfig,
    });

    // Increment download count for current user
    if (currentUser) {
      const nextDownloads = (currentUser.totalDownloads || 0) + 1;
      const updated = { ...currentUser, totalDownloads: nextDownloads };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    }

    logActivity(
      'download_poster',
      'Poster Downloaded / Exported',
      'पोस्टर डाऊनलोड केले',
      `Exported high-res PNG for "${tpl.title}" with frame: ${tpl.defaultFrameId}`,
      tpl.id,
      tpl.title
    );
  };

  // Open Export Modal from Studio Editor
  const handleOpenExportFromEditor = (payload: PosterEditorExportPayload) => {
    setExportModalConfig({
      isOpen: true,
      template: payload.template,
      profile: payload.profile,
      frameId: payload.frameId,
      aspectRatio: payload.aspectRatio,
      showFooter: payload.showFooter !== undefined ? payload.showFooter : true,
      headline: payload.headline,
      subtext: payload.subtext,
      quote: payload.quote,
      elements: payload.elements,
      customBgImage: payload.customBgImage,
      customBgGradient: payload.customBgGradient,
      companyLogoUrl: payload.companyLogoUrl,
      companyLogoPosition: payload.companyLogoPosition,
      headlineStyle: payload.headlineStyle,
      subtextStyle: payload.subtextStyle,
      quoteStyle: payload.quoteStyle,
      dateBadgeStyle: payload.dateBadgeStyle,
      motifStyle: payload.motifStyle,
      footerConfig: payload.footerConfig,
    });

    if (currentUser) {
      const nextDownloads = (currentUser.totalDownloads || 0) + 1;
      const updated = { ...currentUser, totalDownloads: nextDownloads };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    }

    logActivity(
      'customize_poster',
      'Poster Customized & Exported',
      'पोस्टर कस्टमाइझ करून सेव्ह केले',
      `Customized "${payload.template.title}" with custom elements (${payload.elements.length}) and brand frame: ${payload.frameId}`,
      payload.template.id,
      payload.template.title
    );
  };

  // Apply AI Generated Text to active editor template or create new poster
  const handleApplyAIText = (headline: string, subtext: string, quote?: string, occasion?: string) => {
    if (editingTemplate) {
      setEditingTemplate(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          headline,
          subtext,
          quote: quote || prev.quote,
        };
      });

      logActivity(
        'customize_poster',
        'Applied AI Festive Slogan',
        'AI द्वारे घोषवाक्य लागू केले',
        `Applied AI generated headline: "${headline.slice(0, 30)}..."`,
        editingTemplate.id,
        editingTemplate.title
      );
    } else {
      // If no active poster is open, create a new AI poster and open in studio!
      const isGanesh = (occasion || '').toLowerCase().includes('ganesh');
      const newTemplate: PosterTemplate = {
        id: `ai-poster-${Date.now()}`,
        template_id: `ai-poster-${Date.now()}`,
        title: occasion ? `AI ${occasion} Poster` : 'AI Generated Poster',
        titleNative: headline,
        category: isGanesh ? 'ganesh-chaturthi' : 'festivals',
        subCategory: 'royal-premium',
        style_group: 'royal',
        dateBadge: 'AI Special 2026',
        isTrending: true,
        is_premium: false,
        is_free: true,
        is_published: true,
        headline,
        subtext,
        quote: quote || '',
        motifType: isGanesh ? 'ganesh-dagdusheth-royal' : 'diwali-diya',
        defaultFrameId: activeFrameId || 'footer-01',
        aspectRatio: '1:1',
        theme: {
          bgGradient: 'from-amber-600 via-orange-600 to-red-700',
          primaryColor: '#ffffff',
          accentColor: '#fef08a',
          textColor: '#ffffff',
          ornamentColor: '#fbbf24',
          cardBg: 'rgba(20, 15, 10, 0.85)',
        },
      };

      handleSaveTemplate(newTemplate);
      setEditingTemplate(newTemplate);

      logActivity(
        'customize_poster',
        'Created AI Festive Poster',
        'AI द्वारे नवीन पोस्टर तयार केले',
        `Created new AI poster: "${headline}"`,
        newTemplate.id,
        newTemplate.title
      );
    }
  };

  // Loading state while verifying backend session
  if (isAuthInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-xl shadow-amber-500/20 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white font-['Outfit']">GROW VIEW FESTIVAL</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>सुरक्षित प्रमाणीकरण तपासत आहे...</span>
          </div>
        </div>
      </div>
    );
  }

  // STRICT AUTHENTICATION GATE:
  // No user can access the app studio, template editor, or customer dashboards without valid login.
  // The Landing Page is the public showcase & main entrance.
  if (!currentUser) {
    return (
      <>
        <LandingPage
          config={landingConfig}
          currentUser={null}
          templates={templates}
          categories={categories}
          activeProfile={activeProfile}
          onOpenAuthModal={(mode) => {
            setAuthPromptMessage(undefined);
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
          onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
          onNavigateToStudio={() => {
            setAuthPromptMessage('पोस्टर स्टुडिओमध्ये प्रवेश करण्यासाठी व डिझाईन सुरू करण्यासाठी कृपया प्रथम लॉगिन करा.');
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onSelectTemplate={(tpl) => {
            setPendingTemplate(tpl);
            setAuthPromptMessage(`"${tpl.title}" पोस्टर कस्टमाइझ करण्यासाठी कृपया प्रथम लॉगिन करा किंवा नवीन नोंदणी करा.`);
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onSelectCategory={(catId) => {
            setPendingCategory(catId);
            const cat = categories.find((c) => c.id === catId);
            setAuthPromptMessage(`${cat?.nameMarathi || cat?.name || ''} श्रेणीतील पोस्टर्स वापरण्यासाठी कृपया प्रथम लॉगिन करा.`);
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onOpenProfileModal={() => {
            setAuthPromptMessage('आपली बिझनेस प्रोफाईल पाहण्यासाठी व सेव्ह करण्यासाठी कृपया प्रथम लॉगिन करा.');
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => {
            setIsAuthModalOpen(false);
            setAuthPromptMessage(undefined);
          }}
          initialMode={authModalMode}
          promptMessage={authPromptMessage}
          users={users}
          currentUser={null}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onResetPassword={handleResetPasswordByEmail}
          onOpenAdminLogin={() => {
            setIsAuthModalOpen(false);
            setIsAdminLoginModalOpen(true);
          }}
        />

        <AdminLoginModal
          isOpen={isAdminLoginModalOpen}
          onClose={() => setIsAdminLoginModalOpen(false)}
          users={users}
          currentUser={null}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
      </>
    );
  }

  // If in Landing Page mode and not editing a template, render the high-conversion Landing Page
  if (viewMode === 'landing' && !editingTemplate) {
    return (
      <>
        <LandingPage
          config={landingConfig}
          currentUser={currentUser}
          templates={templates}
          categories={categories}
          activeProfile={activeProfile}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
          onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
          onNavigateToStudio={() => {
            setViewMode('app');
          }}
          onSelectTemplate={(tpl) => {
            setViewMode('app');
            setEditingTemplate(tpl);
          }}
          onSelectCategory={(catId) => {
            setViewMode('app');
            setSelectedCategory(catId);
          }}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onLogout={handleLogout}
          onOpenAIFestivalModal={() => setIsAIFestivalModalOpen(true)}
        />

        {/* Global Modals for Auth, Admin, and Profiles accessible from Landing Page */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          users={users}
          currentUser={currentUser}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onResetPassword={handleResetPasswordByEmail}
          onOpenAdminLogin={() => {
            setIsAuthModalOpen(false);
            setIsAdminLoginModalOpen(true);
          }}
        />

        <AdminLoginModal
          isOpen={isAdminLoginModalOpen}
          onClose={() => setIsAdminLoginModalOpen(false)}
          users={users}
          currentUser={currentUser}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          templates={templates}
          categories={categories}
          activeProfile={activeProfile}
          users={users}
          activityLogs={activityLogs}
          landingConfig={landingConfig}
          onSaveLandingConfig={setLandingConfig}
          websiteConfig={websiteConfig}
          onSaveWebsiteConfig={handleSaveWebsiteConfig}
          onPreviewLandingPage={() => {
            setIsAdminModalOpen(false);
            setViewMode('landing');
          }}
          onSaveTemplate={handleSaveTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onDuplicateTemplate={handleDuplicateTemplate}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
          onResetToDefaults={handleResetToDefaults}
          onImportBackup={handleImportBackup}
          onOpenInStudio={(tpl) => {
            setIsAdminModalOpen(false);
            setViewMode('app');
            setEditingTemplate(tpl);
          }}
          onOpenQuickDesignStudio={() => {
            setIsAdminModalOpen(false);
            setIsQuickDesignModalOpen(true);
          }}
          videoSettings={videoSettings}
          onUpdateVideoSettings={handleUpdateVideoSettings}
          onOpenVideoStudio={(poster, project) => {
            setIsAdminModalOpen(false);
            handleOpenVideoStudio(poster, project);
          }}
          onToggleUserStatus={handleToggleUserStatus}
          onResetUserPassword={handleAdminResetPassword}
          onDeleteUser={handleDeleteUser}
          onAdminLogout={handleAdminLogout}
        />

        <BrandProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profiles={profiles}
          activeProfile={activeProfile}
          onSelectProfile={setActiveProfile}
          onSaveProfile={handleSaveProfile}
          onDeleteProfile={handleDeleteProfile}
          currentUser={currentUser}
          onOpenPricingModal={() => setIsVIPModalOpen(true)}
        />

        {/* Video Studio Modal accessible from Landing branch */}
        {isVideoStudioOpen && (
          <VideoStudioModal
            isOpen={isVideoStudioOpen}
            onClose={() => {
              setIsVideoStudioOpen(false);
              setVideoStudioTargetPoster(null);
              setVideoStudioInitialProject(null);
            }}
            basePoster={videoStudioTargetPoster}
            sourcePoster={videoStudioTargetPoster}
            availablePosters={templates}
            initialProject={videoStudioInitialProject}
            activeProfile={activeProfile}
            currentUser={currentUser}
            userId={currentUser?.id || 'admin_user'}
            adminSettings={videoSettings}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans pb-12 md:pb-0">
      {/* Dynamic Announcement Bar (Admin Configurable) */}
      {websiteConfig.announcementBar?.enabled && (
        <div
          className="px-4 py-2 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all z-20"
          style={{
            backgroundColor: websiteConfig.announcementBar.bgColor || '#d97706',
            color: websiteConfig.announcementBar.textColor || '#ffffff',
          }}
        >
          {websiteConfig.announcementBar.badgeText && (
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase tracking-wider font-extrabold">
              {websiteConfig.announcementBar.badgeText}
            </span>
          )}
          <span>{websiteConfig.announcementBar.text}</span>
        </div>
      )}

      {/* GrowView Header */}
      {!editingTemplate && (
        <BrandsLiveHeader
          activeProfile={activeProfile}
          currentUser={currentUser}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          onNavigateToLanding={() => setViewMode('landing')}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenAIModal={() => setIsAIModalOpen(true)}
          onOpenVideoStudio={() => handleOpenVideoStudio(null, null)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenAdminModal={handleOpenAdmin}
          onOpenAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
          onOpenQuickDesignStudio={() => setIsQuickDesignModalOpen(true)}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
          onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
          onOpenVIPModal={() => setIsVIPModalOpen(true)}
          onOpenTeamModal={() => setIsTeamModalOpen(true)}
          onOpenAIFestivalModal={() => setIsAIFestivalModalOpen(true)}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickSearchTag={(tag) => {
            if (['master-designs', 'wedding-invitation', 'engagement-ceremony', 'biodata-resume'].includes(tag)) {
              setSelectedCategory(tag);
              setSearchQuery('');
            } else {
              setSearchQuery(tag);
              setSelectedCategory('all');
            }
          }}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSearchQuery('');
          }}
        />
      )}

      {/* Main Container */}
      <main className="flex-1">
        {editingTemplate ? (
          /* Poster Studio Customizer (with Selection Tool & Bounding Box) */
          <PosterEditor
            template={editingTemplate}
            profile={activeProfile}
            initialFrameId={activeFrameId}
            initialFrameConfig={globalFrameConfig}
            onSaveFrameSettings={(fId, cfg) => {
              setActiveFrameId(fId);
              setGlobalFrameConfig(cfg);
            }}
            onBack={() => setEditingTemplate(null)}
            onOpenExportModal={handleOpenExportFromEditor}
            onOpenAIModal={() => setIsAIModalOpen(true)}
            currentUser={currentUser}
            onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
            onOpenPricingModal={() => setIsVIPModalOpen(true)}
            onSaveTemplateGlobally={
              (currentUser?.role === 'admin' || currentUser?.adminRole === 'super_admin' || currentUser?.adminRole === 'editor')
                ? handleSaveTemplate
                : undefined
            }
          />
        ) : (
          /* Template Explorer Gallery */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <TemplateGallery
              templates={filteredTemplates}
              categories={categories}
              activeProfile={activeProfile}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              activeGroup={activeGroup}
              selectedFrameId={activeFrameId}
              onSelectFrameId={setActiveFrameId}
              frameConfig={globalFrameConfig}
              onUpdateFrameConfig={setGlobalFrameConfig}
              onSelectTemplate={(tpl) => {
                setPreviewTemplate(tpl);
                logActivity(
                  'view_poster',
                  'Opened Poster Preview',
                  'पोस्टर प्रिव्ह्यू उघडले',
                  `Previewed design "${tpl.title}" with sliding brand frames`,
                  tpl.id,
                  tpl.title
                );
              }}
              onQuickDownload={handleQuickDownload}
              onOpenAIModal={() => setIsAIModalOpen(true)}
              onOpenGaneshAIModal={() => setIsGaneshAIModalOpen(true)}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
              onOpenVideoStudio={(tpl) => handleOpenVideoStudio(tpl, null)}
              onOpenAutoVideo={handleOpenAutoPosterReel}
              onOpenAdminModal={handleOpenAdmin}
              onOpenVIPModal={() => setIsVIPModalOpen(true)}
              onOpenAIFestivalModal={() => setIsAIFestivalModalOpen(true)}
              currentUser={currentUser}
            />

            {/* Clean App Bottom Footer with Company Mobile & Admin Link */}
            <footer className="mt-14 pb-24 sm:pb-8 pt-6 border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <span className="font-bold text-slate-800 font-['Outfit']">GrowView Poster Studio</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span>📞 कंपनी संपर्क:</span>
                  <a href="tel:7774914906" className="font-bold text-slate-900 hover:text-amber-600 transition-colors">
                    7774914906
                  </a>
                </span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <a
                  href="https://wa.me/917774914906"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold"
                >
                  WhatsApp मदत
                </a>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>© 2026 GrowView</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser?.role === 'admin') {
                      handleOpenAdmin();
                    } else {
                      setIsAdminLoginModalOpen(true);
                    }
                  }}
                  className="hover:text-slate-700 transition-colors cursor-pointer"
                >
                  Admin
                </button>
              </div>
            </footer>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation (GrowView UX) */}
      {!editingTemplate && (
        <BrandsLiveMobileBottomNav
          activeTab={
            selectedCategory === 'all' && activeGroup === 'all'
              ? 'home'
              : 'festivals'
          }
          onSelectTab={(tab) => {
            if (tab === 'home') {
              setSelectedCategory('all');
              setActiveGroup('all');
              setSearchQuery('');
            } else if (tab === 'festivals') {
              setActiveGroup('festivals');
              setSelectedCategory('all');
            } else if (tab === 'frames') {
              setIsProfileModalOpen(true);
            } else if (tab === 'vip') {
              setIsVIPModalOpen(true);
            }
          }}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onOpenVIPModal={() => setIsVIPModalOpen(true)}
          onOpenAIModal={() => setIsAIModalOpen(true)}
        />
      )}

      {/* Floating WhatsApp Support Button */}
      <WhatsAppSupportFloat
        businessName={activeProfile.name}
        supportNumber={activeProfile.phone && !activeProfile.phone.includes('98765') ? activeProfile.phone : '+917774914906'}
      />

      {/* GrowView VIP Membership Modal */}
      <VIPPlanModal
        isOpen={isVIPModalOpen}
        onClose={() => setIsVIPModalOpen(false)}
        businessName={activeProfile.name}
      />

      {/* Brand Profile Manager Modal */}
      <BrandProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={setActiveProfile}
        onSaveProfile={handleSaveProfile}
        onDeleteProfile={handleDeleteProfile}
        currentUser={currentUser}
        onOpenPricingModal={() => setIsVIPModalOpen(true)}
      />

      {/* Admin Panel Modal for Designs, Categories, & Customer Management */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        templates={templates}
        categories={categories}
        activeProfile={activeProfile}
        users={users}
        activityLogs={activityLogs}
        landingConfig={landingConfig}
        onSaveLandingConfig={setLandingConfig}
        onPreviewLandingPage={() => {
          setIsAdminModalOpen(false);
          setViewMode('landing');
        }}
        onSaveTemplate={handleSaveTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onDuplicateTemplate={handleDuplicateTemplate}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onResetToDefaults={handleResetToDefaults}
        onImportBackup={handleImportBackup}
        onOpenInStudio={(tpl) => {
          setIsAdminModalOpen(false);
          setEditingTemplate(tpl);
        }}
        onOpenQuickDesignStudio={() => {
          setIsAdminModalOpen(false);
          setIsQuickDesignModalOpen(true);
        }}
        videoSettings={videoSettings}
        onUpdateVideoSettings={handleUpdateVideoSettings}
        onOpenVideoStudio={(poster, project) => {
          setIsAdminModalOpen(false);
          handleOpenVideoStudio(poster, project);
        }}
        onToggleUserStatus={handleToggleUserStatus}
        onResetUserPassword={handleAdminResetPassword}
        onDeleteUser={handleDeleteUser}
        onAdminLogout={handleAdminLogout}
      />

      {/* Quick Simple Admin Design Studio (Upload & Edit) */}
      <QuickDesignStudioModal
        isOpen={isQuickDesignModalOpen}
        onClose={() => setIsQuickDesignModalOpen(false)}
        templates={templates}
        categories={categories}
        activeProfile={activeProfile}
        adminRole={currentUser?.adminRole || 'super_admin'}
        onSaveTemplate={handleSaveTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onDuplicateTemplate={handleDuplicateTemplate}
        onOpenInStudio={(tpl) => {
          setIsQuickDesignModalOpen(false);
          setEditingTemplate(tpl);
        }}
        onOpenFullAdminModal={() => {
          setIsQuickDesignModalOpen(false);
          setIsAdminModalOpen(true);
        }}
      />

      {/* Dedicated Admin Login & Security Gate Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        users={users}
        currentUser={currentUser}
        onAdminLoginSuccess={handleAdminLoginSuccess}
      />

      {/* AI Festival Auto Creator Modal (Sections 1-35) */}
      <AIFestivalAutoCreatorModal
        isOpen={isAIFestivalModalOpen}
        onClose={() => setIsAIFestivalModalOpen(false)}
        activeProfile={activeProfile}
        currentUser={currentUser}
        onOpenStudioWithTemplate={(tpl) => {
          handleSaveTemplate(tpl);
          setEditingTemplate(tpl);
          setIsAIFestivalModalOpen(false);
          logActivity(
            'customize_poster',
            'Opened AI Festival Design in Studio',
            'AI फेस्टिव्हल डिझाईन एडिटरमध्ये उघडले',
            `Opened AI generated design "${tpl.titleNative || tpl.title}"`,
            tpl.id,
            tpl.title
          );
        }}
        onQuickDownload={(tpl) => handleQuickDownload(tpl)}
        onSaveToMyDesigns={(tpl) => {
          handleSaveTemplate(tpl);
          logActivity(
            'save_design',
            'Saved AI Festival Design',
            'AI फेस्टिव्हल डिझाईन सेव्ह केले',
            `Saved design "${tpl.titleNative || tpl.title}" to My Designs`,
            tpl.id,
            tpl.title
          );
        }}
        onOpenVIPModal={() => {
          setIsAIFestivalModalOpen(false);
          setIsVIPModalOpen(true);
        }}
      />

      {/* AI Festival & Business Slogan Modal */}
      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentOccasion={editingTemplate ? (editingTemplate.titleNative || editingTemplate.title) : 'Ganesh Chaturthi'}
        businessName={activeProfile.name}
        activeProfile={activeProfile}
        hasEditingTemplate={!!editingTemplate}
        onApplyText={handleApplyAIText}
        onCreateNewPoster={(newTemplate) => {
          handleSaveTemplate(newTemplate);
          setEditingTemplate(newTemplate);
          logActivity(
            'customize_poster',
            'Created AI Festive Poster',
            'AI द्वारे नवीन पोस्टर तयार केले',
            `Created AI poster "${newTemplate.titleNative || newTemplate.title}"`,
            newTemplate.id,
            newTemplate.title
          );
        }}
        onQuickDownload={(tpl) => handleQuickDownload(tpl)}
      />

      {/* AI Ganesh Poster Generator Modal */}
      <GaneshAIGeneratorModal
        isOpen={isGaneshAIModalOpen}
        onClose={() => setIsGaneshAIModalOpen(false)}
        activeProfile={activeProfile}
        onCreatePoster={(newTemplate) => {
          handleSaveTemplate(newTemplate);
          setEditingTemplate(newTemplate);
        }}
      />

      {/* Export & WhatsApp Share Modal */}
      {exportModalConfig.template && (
        <ExportModal
          isOpen={exportModalConfig.isOpen}
          onClose={() => setExportModalConfig(prev => ({ ...prev, isOpen: false }))}
          template={exportModalConfig.template}
          profile={exportModalConfig.profile}
          frameId={exportModalConfig.frameId}
          aspectRatio={exportModalConfig.aspectRatio}
          showFooter={exportModalConfig.showFooter !== undefined ? exportModalConfig.showFooter : true}
          customHeadline={exportModalConfig.headline}
          customSubtext={exportModalConfig.subtext}
          customQuote={exportModalConfig.quote}
          customElements={exportModalConfig.elements}
          customBgImage={exportModalConfig.customBgImage}
          customBgGradient={exportModalConfig.customBgGradient}
          companyLogoUrl={exportModalConfig.companyLogoUrl}
          companyLogoPosition={exportModalConfig.companyLogoPosition}
          headlineStyle={exportModalConfig.headlineStyle}
          subtextStyle={exportModalConfig.subtextStyle}
          quoteStyle={exportModalConfig.quoteStyle}
          dateBadgeStyle={exportModalConfig.dateBadgeStyle}
          motifStyle={exportModalConfig.motifStyle}
          footerConfig={exportModalConfig.footerConfig}
          currentUser={currentUser}
          onOpenPricingModal={() => setIsVIPModalOpen(true)}
        />
      )}

      {/* Interactive Poster Preview Modal with Corner Edit Button & Sliding Frames */}
      <PosterPreviewModal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        activeProfile={activeProfile}
        selectedFrameId={activeFrameId}
        onSelectFrameId={setActiveFrameId}
        frameConfig={globalFrameConfig}
        hasVideoEditorAccess={hasVideoEditorAccess}
        onOpenVideoStudio={(tpl) => {
          setPreviewTemplate(null);
          handleOpenVideoStudio(tpl, null);
        }}
        onDownloadVideo={(tpl) => {
          setPreviewTemplate(null);
          handleOpenAutoPosterReel(tpl);
        }}
        onOpenStudio={(tpl) => {
          setPreviewTemplate(null);
          setEditingTemplate(tpl);
          logActivity(
            'customize_poster',
            'Opened Poster in Studio',
            'पोस्टर स्टुडिओमध्ये उघडले',
            `Started editing design "${tpl.title}"`,
            tpl.id,
            tpl.title
          );
        }}
        onQuickDownload={handleQuickDownload}
        onShareWhatsApp={(tpl) => {
          const text = encodeURIComponent(
            `*${tpl.headline || tpl.titleNative || tpl.title}*\n\n${tpl.subtext || ''}\n\n✨ *${activeProfile.name}*\n📞 ${activeProfile.phone}\n📍 ${activeProfile.address}\n\nCreated with GrowView - Poster Maker app\n${window.location.href}`
          );
          window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Gunashree Pro Video Studio & Reels Generator Modal */}
      {isVideoStudioOpen && (
        <VideoStudioModal
          isOpen={isVideoStudioOpen}
          onClose={() => setIsVideoStudioOpen(false)}
          basePoster={videoStudioTargetPoster}
          sourcePoster={videoStudioTargetPoster}
          availablePosters={templates}
          initialProject={videoStudioInitialProject}
          activeProfile={activeProfile}
          currentUser={currentUser}
          userId={currentUser?.id || 'admin_user'}
          adminSettings={videoSettings}
        />
      )}

      {/* 1-Tap Auto Video Generator & Live Preview Modal for Any Poster */}
      {isAutoReelModalOpen && autoReelPoster && (
        <AutoPosterReelModal
          isOpen={isAutoReelModalOpen}
          poster={autoReelPoster}
          activeProfile={activeProfile}
          userId={currentUser?.id || 'user_1'}
          onClose={() => {
            setIsAutoReelModalOpen(false);
            setAutoReelPoster(null);
          }}
          onOpenInStudio={(project) => {
            setIsAutoReelModalOpen(false);
            handleOpenVideoStudio(autoReelPoster, project);
          }}
        />
      )}

      {/* Mobile App Download / PWA Installation Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Customer Authentication Modal (Login / Register / Password Reset with Email OTP) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        users={users}
        currentUser={currentUser}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onResetPassword={handleResetPasswordByEmail}
        onOpenAdminLogin={() => {
          setIsAuthModalOpen(false);
          setIsAdminLoginModalOpen(true);
        }}
      />

      {/* Customer Profile, Activity Logs & Security Modal */}
      {currentUser && (
        <CustomerActivityModal
          isOpen={isCustomerModalOpen}
          onClose={() => setIsCustomerModalOpen(false)}
          currentUser={currentUser}
          activeProfile={activeProfile}
          activityLogs={activityLogs.filter(l => l.userId === currentUser.id)}
          templates={templates}
          onSelectTemplate={(tpl) => {
            setIsCustomerModalOpen(false);
            setPreviewTemplate(tpl);
          }}
          onOpenProfileModal={() => {
            setIsCustomerModalOpen(false);
            setIsProfileModalOpen(true);
          }}
          onOpenPricingModal={() => {
            setIsCustomerModalOpen(false);
            setIsVIPModalOpen(true);
          }}
          onOpenAIFestivalModal={() => {
            setIsCustomerModalOpen(false);
            setIsAIFestivalModalOpen(true);
          }}
          onUpdatePassword={handleUpdatePassword}
          onLogout={handleLogout}
        />
      )}

      {/* GrowView VIP Subscription, Pricing & Payment Modal */}
      <PricingModal
        isOpen={isVIPModalOpen}
        onClose={() => setIsVIPModalOpen(false)}
        currentUser={currentUser}
        onOpenAuthModal={() => {
          setIsVIPModalOpen(false);
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        onSubscriptionSuccess={() => {
          // Trigger any refresh if needed
        }}
      />

      {/* Business Team Access & Members Management Modal (5 Team Members for Business Plan) */}
      <BusinessTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        currentUser={currentUser}
        onOpenPricing={() => {
          setIsTeamModalOpen(false);
          setIsVIPModalOpen(true);
        }}
      />
    </div>
  );
}

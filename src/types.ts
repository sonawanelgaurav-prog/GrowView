export type AspectRatio = '1:1' | '4:5' | '9:16';

export type PosterFormatId = 'square' | 'portrait' | 'story' | 'vertical';

export type SystemSizeId = 'square' | 'portrait' | 'vertical';

export interface SystemSizeConfig {
  id: SystemSizeId;
  ratio: AspectRatio;
  name: string;
  nameMarathi: string;
  width: number;
  height: number;
  aspectRatioLabel: string;
  dimensionsLabel: string;
  description: string;
  defaultEnabled: boolean;
}

export const SYSTEM_SIZES: Record<SystemSizeId, SystemSizeConfig> = {
  square: {
    id: 'square',
    ratio: '1:1',
    name: 'Square',
    nameMarathi: 'चौरस (1:1)',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1',
    dimensionsLabel: '1080 × 1080 px',
    description: 'Instagram Post, Facebook Post, WhatsApp Square',
    defaultEnabled: true,
  },
  portrait: {
    id: 'portrait',
    ratio: '4:5',
    name: 'Portrait',
    nameMarathi: 'पोर्ट्रेट (4:5)',
    width: 1080,
    height: 1350,
    aspectRatioLabel: '4:5',
    dimensionsLabel: '1080 × 1350 px',
    description: 'Instagram Feed, Facebook Feed',
    defaultEnabled: true,
  },
  vertical: {
    id: 'vertical',
    ratio: '9:16',
    name: 'Vertical',
    nameMarathi: 'व्हर्टिकल (9:16)',
    width: 1080,
    height: 1920,
    aspectRatioLabel: '9:16',
    dimensionsLabel: '1080 × 1920 px',
    description: 'WhatsApp Status, Instagram Story, Reels',
    defaultEnabled: true,
  },
};

export interface PosterFormatConfig {
  id: PosterFormatId;
  aspectRatio: AspectRatio;
  name: string;
  nameMarathi: string;
  width: number;
  height: number;
  ratio: number;
  footerHeight: number; // 20% of canvas height
  contentHeight: number; // 80% of canvas height
  description: string;
  dimensionsLabel: string;
}

export const POSTER_FORMATS: Record<PosterFormatId, PosterFormatConfig> = {
  square: {
    id: 'square',
    aspectRatio: '1:1',
    name: 'Square Post',
    nameMarathi: 'चौकोनी पोस्ट (1:1)',
    width: 1080,
    height: 1080,
    ratio: 1,
    footerHeight: 216, // 1080 * 0.20
    contentHeight: 864, // 1080 * 0.80
    description: '1080 × 1080 px • Instagram, Facebook, WhatsApp Status',
    dimensionsLabel: '1080 × 1080 px',
  },
  portrait: {
    id: 'portrait',
    aspectRatio: '4:5',
    name: 'Portrait Feed',
    nameMarathi: 'पोर्ट्रेट फीड (4:5)',
    width: 1080,
    height: 1350,
    ratio: 4 / 5,
    footerHeight: 270, // 1350 * 0.20
    contentHeight: 1080, // 1350 * 0.80
    description: '1080 × 1350 px • Instagram Feed, Facebook Feed',
    dimensionsLabel: '1080 × 1350 px',
  },
  story: {
    id: 'story',
    aspectRatio: '9:16',
    name: 'Story / Reel / Vertical',
    nameMarathi: 'व्हर्टिकल / स्टोरी / रील (9:16)',
    width: 1080,
    height: 1920,
    ratio: 9 / 16,
    footerHeight: 384, // 1920 * 0.20
    contentHeight: 1536, // 1920 * 0.80
    description: '1080 × 1920 px • WhatsApp Status, Instagram Story, Reels',
    dimensionsLabel: '1080 × 1920 px',
  },
  vertical: {
    id: 'vertical',
    aspectRatio: '9:16',
    name: 'Vertical',
    nameMarathi: 'व्हर्टिकल (9:16)',
    width: 1080,
    height: 1920,
    ratio: 9 / 16,
    footerHeight: 384, // 1920 * 0.20
    contentHeight: 1536, // 1920 * 0.80
    description: '1080 × 1920 px • WhatsApp Status, Instagram Story, Reels',
    dimensionsLabel: '1080 × 1920 px',
  },
};

export const getPosterFormatByRatio = (ratio?: AspectRatio | string): PosterFormatConfig => {
  if (ratio === '9:16' || ratio === 'story' || ratio === 'vertical') return POSTER_FORMATS.vertical;
  if (ratio === '4:5' || ratio === 'portrait') return POSTER_FORMATS.portrait;
  return POSTER_FORMATS.square;
};

export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu';

export interface BusinessProfile {
  id: string;
  name: string;
  ownerName: string;
  designation: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  socialHandle: string;
  tagline: string;
  leaderPhotoUrl?: string;
  brandColor: string;
  isDefault?: boolean;
}

export type FooterFrameId =
  // CATEGORY 1: 10 Standard Footer Frames
  | 'footer-01' // Clean Corporate
  | 'footer-02' // Modern Split
  | 'footer-03' // Bold Business
  | 'footer-04' // Elegant Line
  | 'footer-05' // Left Accent
  | 'footer-06' // Centered Professional
  | 'footer-07' // Business Card
  | 'footer-08' // Premium Border
  | 'footer-09' // Double Divider
  | 'footer-10' // Minimal Modern
  // CATEGORY 2: 10 Right-Side Logo Footer Frames
  | 'footer-11' // Right Square Logo
  | 'footer-12' // Right Circle Logo
  | 'footer-13' // Right Rounded Logo
  | 'footer-14' // Right Hexagon Logo
  | 'footer-15' // Right Diagonal Logo
  | 'footer-16' // Right Floating Logo
  | 'footer-17' // Right Badge Logo
  | 'footer-18' // Right Cut-Corner Logo
  | 'footer-19' // Right Creative Logo
  | 'footer-20' // Right Premium Logo
  // CATEGORY 3: 7 Top-Right Floating Logo Frames
  | 'footer-21' // Floating Circle Logo
  | 'footer-22' // Floating Square Logo
  | 'footer-23' // Floating Rounded Logo
  | 'footer-24' // Floating Badge
  | 'footer-25' // Floating Freeform
  | 'footer-26' // Floating Geometric
  | 'footer-27'; // Premium Business

export type LegacyFrameId =
  | 'frame-modern-ribbon'
  | 'frame-golden-royal'
  | 'frame-glassmorphism'
  | 'frame-double-bar'
  | 'frame-leader-cutout'
  | 'frame-minimal-dark'
  | 'frame-rangoli-ethnic'
  | 'frame-tech-corporate'
  | 'frame-retail-stamp'
  | 'frame-wave-gradient'
  | 'frame-ornate-border'
  | 'frame-compact-pill';

export type FrameId = FooterFrameId | LegacyFrameId | string;

export type FooterCategory = 'standard' | 'right-logo' | 'top-right-logo' | 'banner-portrait';

export type LogoShape = 'square' | 'circle' | 'rounded' | 'hexagon' | 'badge' | 'cut-corner' | 'freeform';

export type FooterColorMode = 'auto' | 'light' | 'dark' | 'custom';

export type FrameArrangement = 'bottom' | 'top' | 'compact' | 'split' | 'floating';

export type FrameSizePreset = 'compact' | 'regular' | 'large' | 'extralarge';

export interface FooterFrameConfig {
  colorMode: FooterColorMode;
  accentColor?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  fontFamily?: string;
  fontSizeModifier?: number; // -4 to +8
  customFontSize?: number; // 9 to 24
  arrangement?: FrameArrangement;
  paddingLevel?: 'compact' | 'normal' | 'relaxed';
  isBold?: boolean;
  logoShape?: LogoShape;
  logoSize?: number; // 24 to 80
  showPersonalName?: boolean;
  showCompanyName?: boolean;
  showDesignation?: boolean;
  showMobileNumber?: boolean;
  showCompanyWork?: boolean;
  showCompanyLogo?: boolean;
  // Admin Adjustable Frame Sizing:
  frameHeightPercent?: number; // 10 to 35 (%)
  frameSizePreset?: FrameSizePreset; // 'compact' (14%) | 'regular' (18%) | 'large' (24%) | 'extralarge' (28%)
  borderRadius?: number; // 0 to 24
  borderWidth?: number; // 0 to 6
}

export interface FrameDefinition {
  id: FrameId;
  name: string;
  nameMarathi?: string;
  category: FooterCategory;
  frameNumber: number; // 1 to 35
  badge: string;
  description: string;
  accent: string;
  // Predefined visual color identity
  backgroundColor: string;
  secondaryColor?: string;
  textColor: string;
  mutedTextColor: string;
  borderColor?: string;
  colorFamily: string; // e.g., 'Royal Blue', 'Deep Navy', 'Burgundy', 'Emerald', 'Warm Cream', 'White / Light', etc.
  isLightBg?: boolean;
  layoutStyle?: string;
  defaultLogoShape?: LogoShape;
  hasTopLogo?: boolean;
  hasLeaderPhoto?: boolean;
  leaderPhotoPosition?: 'left' | 'right';
  isActive?: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  nameHindi?: string;
  nameMarathi?: string;
  sectionLabel?: string;
  description?: string;
  group: 'festivals' | 'business' | 'daily' | 'special';
  icon: string;
  count: number;
  allowedSizes?: AspectRatio[]; // e.g. ['1:1', '4:5', '9:16']
  allowedVideoSizes?: AspectRatio[];
  subCategories?: {
    id: string;
    name: string;
    allowedSizes?: AspectRatio[];
  }[];
}

export type CanvasElementType = 
  | 'text' 
  | 'sticker' 
  | 'badge' 
  | 'custom-photo'
  | 'image'
  | 'icon'
  | 'shape'
  | 'line'
  | 'arrow'
  | 'photo-frame'
  | 'decoration'
  | 'ribbon'
  | 'border';

export interface CanvasCustomElement {
  id: string;
  type: CanvasElementType;
  subType?: string; // e.g. 'circle', 'heart', 'star', 'instagram', 'mandala', 'polaroid'
  category?: string; // 'business' | 'social' | 'festival' | 'food' | 'healthcare' | ...
  name?: string;
  content?: string; // text content, icon identifier, badge text, or SVG path
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width?: number; // percentage 0-100 or px width
  height?: number; // percentage 0-100 or px height
  rotation?: number; // deg 0-360
  opacity?: number; // 0 to 1
  isLocked?: boolean;
  isHidden?: boolean;
  isPremium?: boolean;
  zIndex?: number;

  // Typography / Text & Badges
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number; // e.g. 1.2, 1.3, 1.5
  letterSpacing?: number; // e.g. 0, 1, 2
  boxWidth?: number; // percentage of canvas width (e.g. 75%)
  boxHeight?: number; // percentage of canvas height
  badgeText?: string;
  badgeSubtext?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  isPersonalityPhoto?: boolean;
  fieldBinding?: string; // Optional dynamic binding e.g. 'brideName', 'groomName', 'date', 'venue', 'hosts'

  // Shapes & Vectors Styling
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  cornerRadius?: number;
  shadow?: boolean;
  shadowBlur?: number;
  shadowColor?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: [string, string];
    angle?: number;
  };

  // Icon specific
  iconName?: string;
  iconBgColor?: string;
  iconBorderColor?: string;
  iconBorderSize?: number;
  iconShape?: 'none' | 'circle' | 'square' | 'rounded';

  // Lines & Arrows
  lineLength?: number;
  arrowStartStyle?: 'none' | 'arrow' | 'dot' | 'square';
  arrowEndStyle?: 'none' | 'arrow' | 'dot' | 'square' | 'triangle';
  isCurved?: boolean;
  curveDepth?: number;

  // Photo Frames & Image Uploads
  frameShape?: 'square' | 'rounded' | 'circle' | 'oval' | 'polaroid' | 'arch' | 'hexagon' | 'diamond' | 'heart' | 'star' | 'blob' | 'decorative';
  photoUrl?: string;
  imageUrl?: string; // Custom uploaded PNG/JPEG/WhatsApp sticker URL
  originalImageUrl?: string; // Original image before background removal for restore
  isTransparentBg?: boolean;
  bgRemoveTolerance?: number;
  isFlippedX?: boolean;
  isFlippedY?: boolean;
  photoZoom?: number; // 0.5 to 3.0 (default: 1.0)
  photoOffsetX?: number; // -100 to 100
  photoOffsetY?: number; // -100 to 100
  photoRotation?: number; // 0 to 360
  photoFilter?: 'none' | 'warm' | 'cool' | 'vintage' | 'bw' | 'festive';
  polaroidLabel?: string;

  // Custom Raw SVG/Vector
  svgPath?: string;
  svgViewBox?: string;
}

export interface ElementLibraryItem {
  id: string;
  title: string;
  titleMarathi?: string;
  type: CanvasElementType;
  category: string; // 'business' | 'social' | 'contact' | 'festival' | 'food' | 'education' | 'healthcare' | 'real_estate' | 'technology' | 'shapes' | 'lines' | 'arrows' | 'frames' | 'decorations' | 'badges' | 'ribbons' | 'borders'
  tags: string[];
  isPremium?: boolean;
  isPublished?: boolean;
  previewSvg?: string;
  iconName?: string;
  subType?: string;
  defaultConfig: Partial<CanvasCustomElement>;
  usageCount?: number;
  downloadsCount?: number;
}

export interface ElementAnalyticsStat {
  id: string;
  title: string;
  type: CanvasElementType;
  category: string;
  isPremium: boolean;
  usageCount: number;
  downloadsCount: number;
  rating: number;
  trend: '+12%' | '+28%' | '+45%' | '+8%' | '-3%';
}

export interface PosterTemplate {
  id: string;
  title: string;
  titleNative?: string;
  category: string;
  subCategory?: string;
  dateBadge?: string;
  isTrending?: boolean;
  isToday?: boolean;
  festivalDate?: string; // e.g. '2026-09-14' (YYYY-MM-DD)
  festivalNames?: string[]; // e.g. ['गणेश चतुर्थी', 'हरतालिका']
  imageUrl?: string; // Custom uploaded image / artwork URL or data URL
  thumbnailUrl?: string;
  titleMarathi?: string;
  customBgUrl?: string;
  isCustomUpload?: boolean;
  bgGradient?: string;
  bgImage?: string;
  headlineStyle?: any;
  subtextStyle?: any;
  quoteStyle?: any;
  researchSources?: AIFestivalEventSource[];
  verifiedHistoricalRef?: {
    sourcePage?: string;
    sourceName: string;
    license?: string;
    credit?: string;
  };
  theme?: {
    bgGradient: string;
    primaryColor: string;
    accentColor: string;
    textColor: string;
    ornamentColor: string;
    cardBg: string;
  };
  headline: string;
  subtext: string;
  quote?: string;
  quoteAuthor?: string;
  motifType?: 
    | 'diwali-diya'
    | 'ganesh-murti'
    | 'navratri-garba'
    | 'independence-flag'
    | 'krishna-flute'
    | 'rakhi-thread'
    | 'holi-gulal'
    | 'eid-crescent'
    | 'republic-chakra'
    | 'shiva-trishul'
    | 'makar-kite'
    | 'business-growth'
    | 'real-estate-house'
    | 'jewelry-gold'
    | 'doctor-medical'
    | 'education-coaching'
    | 'restaurant-food'
    | 'salon-beauty'
    | 'travel-adventure'
    | 'morning-sun'
    | 'motivational-mountain'
    | 'birthday-cake'
    | 'sale-discount'
    | 'kisan-agriculture'
    | 'custom-image'
    // Morning Motifs
    | 'morning-sun-peaks'
    | 'morning-coffee-cup'
    | 'morning-lotus-sunrise'
    | 'morning-bird-tree'
    | 'morning-tea-kettle'
    | 'morning-dew-leaf'
    | 'morning-mandala-rays'
    | 'morning-om-sun'
    | 'morning-tulsi-vrindavan'
    | 'morning-running-shoes'
    | 'morning-mountain-path'
    | 'morning-village-nature'
    | 'morning-lotus-dew'
    | 'morning-ocean-wave'
    | 'morning-tea-cup'
    | 'morning-blooming-rose'
    | 'morning-golden-birds'
    | 'morning-forest-lake'
    | 'morning-sunflower'
    | 'morning-road-horizon'
    | 'morning-wellness-yoga'
    // Night Motifs
    | 'night-crescent-clouds'
    | 'night-full-moon-lake'
    | 'night-starry-galaxy'
    | 'night-candle-lamp'
    | 'night-moon-silhouette'
    | 'night-dream-catcher'
    | 'night-lantern-light'
    | 'night-sleeping-owl'
    | 'night-peace-stars'
    | 'night-marathi-moon'
    | 'night-city-skyline'
    | 'night-aurora-glow'
    // Ganesh Chaturthi 100 Special Motifs
    | 'ganesh-dagdusheth-royal'
    | 'ganesh-lalbaug-raja'
    | 'ganesh-clay-ecofriendly'
    | 'ganesh-abstract-lineart'
    | 'ganesh-lotus-seat'
    | 'ganesh-diya-aarti'
    | 'ganesh-trishul-tilak'
    | 'ganesh-marigold-toran'
    | 'ganesh-modak-bhog'
    | 'ganesh-temple-arch'
    | 'ganesh-mandala-cosmic'
    | 'ganesh-dhol-tasha-utsav'
    | 'ganesh-peacock-feather'
    | 'ganesh-swastik-manglik'
    | 'ganesh-silver-chhatra'
    | 'ganesh-panchamrut-abhishek'
    | 'ganesh-siddhivinayak'
    | 'ganesh-minimalist-silhouette'
    | 'ganesh-shree-calligraphy'
    | 'ganesh-ashtavinayak-divine';
  stickers?: string[];
  defaultFrameId?: FrameId;
  aspectRatio: AspectRatio;
  allowedSizes?: AspectRatio[]; // e.g. ['1:1', '4:5', '9:16']
  isVideo?: boolean;
  videoDuration?: string;
  videoAnimationPreset?: VideoAnimationPresetId;
  videoAudioTrack?: 'dhol-tasha' | 'shehnai' | 'temple-bells' | 'none';
  videoResolution?: '1080p' | '720p';
  isVIP?: boolean;
  language?: LanguageCode;
  downloadCount?: number;
  viewsCount?: number;
  template_id?: string;
  template_name?: string;
  template_number?: number;
  style_group?: string;
  elements?: CanvasCustomElement[];
  text_layers?: any[];
  image_layers?: any[];
  logo_layers?: any[];
  fonts?: string[];
  colors?: string[];
  effects?: any;
  tags?: string[];
  is_free?: boolean;
  is_premium?: boolean;
  isPremium?: boolean;
  is_trending?: boolean;
  is_published?: boolean;
  usage_count?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  isNew?: boolean;
  isJustUploaded?: boolean;
  marathi_description?: string;
  decorative_elements?: string[];
  composition_style?: string;
  idol_placement?: string;
  lighting_style?: string;
}

export interface GeneratedAICopy {
  headlines: string[];
  subtext: string;
  hashtags: string[];
  callToAction: string;
}

export type UserRole = 'customer' | 'admin';

export type PlatformRole = 'MASTER_ADMIN' | 'ADMIN' | 'VIDEO_EDITOR' | 'CONTENT_MANAGER' | 'USER';

export interface UserPermissions {
  video_editor_access: boolean;
  can_manage_posters?: boolean;
  can_upload_media?: boolean;
  can_edit_posters?: boolean;
  can_create_videos?: boolean;
  can_export_videos?: boolean;
  can_manage_presets?: boolean;
  can_manage_music?: boolean;
  can_publish_content?: boolean;
}

export type AdminRole = 'super_admin' | 'content_manager' | 'editor' | 'support_admin' | 'finance_admin';
export type AdminRoleType = AdminRole;

export interface UserAccount {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone: string;
  businessName: string;
  businessType?: string;
  businessCategory?: string;
  password?: string; // Optional - sensitive credentials should never be hardcoded
  role: UserRole;
  adminRole?: AdminRole;
  platformRole?: PlatformRole;
  permissions?: UserPermissions;
  status: 'active' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  lastLoginAt?: string;
  avatarUrl?: string;
  totalDownloads: number;
  city?: string;
  country?: string;
  language?: 'mr' | 'hi' | 'en' | 'gu';
  isPremium?: boolean;
  subscriptionPlan?: 'free' | 'trial' | 'monthly' | 'yearly' | 'lifetime' | 'expired';
  subscriptionExpiry?: string;
  device?: string;
  coins?: number;
  referralCode?: string;
  referredBy?: string;
  totalReferred?: number;
}

export interface AdminAuditLog {
  id: string;
  adminName: string;
  adminEmail: string;
  adminRole: AdminRoleType;
  action: string;
  actionMarathi?: string;
  targetType: 'user' | 'template' | 'coupon' | 'notification' | 'subscription' | 'settings' | 'festival';
  targetId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  status: 'success' | 'warning' | 'failed';
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'payment' | 'download_issue' | 'custom_design' | 'bug_report' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    id: string;
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface PushNotificationCampaign {
  id: string;
  title: string;
  body: string;
  type: 'festival_reminder' | 'premium_offer' | 'new_templates' | 'flash_sale' | 'abandoned_draft';
  targetAudience: 'all' | 'free_users' | 'premium_users' | 'marathi_users' | 'hindi_users' | 'inactive_users';
  targetCount: number;
  sentAt?: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledDate?: string;
  deepLink?: string;
  imageUrl?: string;
  openRate?: number;
  clicks?: number;
}

export interface CouponCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  planApplicable: 'all' | 'monthly' | 'yearly' | 'lifetime';
  minOrderAmount?: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
  revenueGenerated: number;
  createdAt: string;
}

export interface PlayStoreReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  reviewText: string;
  appVersion: string;
  device: string;
  replyText?: string;
  repliedAt?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ScheduledFestivalCampaign {
  id: string;
  festivalName: string;
  festivalNameMarathi: string;
  festivalDate: string;
  category: string;
  templatePackCount: number;
  isAutoPublish: boolean;
  status: 'upcoming' | 'live' | 'completed';
  bannerImageUrl?: string;
  targetLanguages: ('mr' | 'hi' | 'en' | 'gu')[];
  expectedSpikePercent: number;
  posterSizes?: AspectRatio[];
  videoSizes?: AspectRatio[];
}

export interface FeatureFlagsConfig {
  aiSloganGenerator: boolean;
  ultraHd4kExport: boolean;
  dailyRewardCoins: boolean;
  autoWatermarkFreeTier: boolean;
  festivalCountdownBanner: boolean;
  referralProgram: boolean;
  leaderLeaderboard: boolean;
  maintenanceMode: boolean;
}

export interface LiveUserActivityItem {
  id: string;
  userName: string;
  userEmail: string;
  actionText: string;
  category: 'edit' | 'export' | 'ai' | 'upgrade' | 'login';
  templateTitle?: string;
  timestamp: string;
  timeAgo: string;
  device: string;
  city: string;
}

export interface DailyRewardDay {
  day: number;
  coins: number;
  label: string;
  isSpecial?: boolean;
}

export interface CustomerActivityLog {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  action?: 'login' | 'register' | 'download_poster' | 'edit_profile' | 'create_design' | 'ai_slogan' | 'password_change' | 'logout' | 'customize_poster' | 'profile_update';
  actionType?: 'login' | 'register' | 'download_poster' | 'edit_profile' | 'create_design' | 'ai_slogan' | 'password_change' | 'logout' | 'customize_poster' | 'profile_update';
  actionTitle?: string;
  actionTitleMarathi?: string;
  description?: string;
  descriptionMarathi?: string;
  timestamp: string;
  device?: string;
  deviceInfo?: string;
  details?: string;
  templateId?: string;
  templateTitle?: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  message?: string;
  hasMinLength: boolean; // >= 8 chars
  hasUpperCase: boolean; // >= 1 uppercase letter (A-Z)
  hasLowerCase: boolean; // >= 1 lowercase letter (a-z)
  hasNumber: boolean; // >= 1 number (0-9)
  hasSpecialChar: boolean; // >= 1 special character (@#$%^&*!?)
  score: number; // 0-100 score
  strengthLevel: 'weak' | 'fair' | 'good' | 'strong';
  strengthLabelMarathi: string;
  criteria?: {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

// ==========================================
// LANDING PAGE CONFIGURATION & CMS TYPES
// ==========================================

export type LandingPageSectionKey =
  | 'hero'
  | 'festivalCategories'
  | 'popularTemplates'
  | 'festivalSpecial'
  | 'businessTemplates'
  | 'howItWorks'
  | 'features'
  | 'businessBranding'
  | 'supportedFormats'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'footer';

export interface LandingPageSectionConfig {
  key: LandingPageSectionKey;
  name: string;
  nameMarathi?: string;
  isEnabled: boolean;
  order: number;
}

export interface LandingPageAsset {
  id: string;
  name: string;
  url: string;
  section: LandingPageSectionKey | 'general';
  isVisible: boolean;
  order: number;
  title?: string;
  description?: string;
  createdAt: string;
}

export interface LandingPageContent {
  // Hero Section
  heroHeadline: string;
  heroHeadlineMarathi?: string;
  heroSubtitle: string;
  heroSubtitleMarathi?: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroBadge: string;
  
  // Section Titles
  categoriesTitle: string;
  categoriesSubtitle: string;
  popularTemplatesTitle: string;
  popularTemplatesSubtitle: string;
  festivalSpecialTitle: string;
  festivalSpecialSubtitle: string;
  businessTemplatesTitle: string;
  businessTemplatesSubtitle: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  brandingTitle: string;
  brandingSubtitle: string;
  formatsTitle: string;
  formatsSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  supportWhatsApp: string;
}

export interface LandingPageConfig {
  sections: LandingPageSectionConfig[];
  content: LandingPageContent;
  assets: LandingPageAsset[];
  hiddenTemplateIds: string[];
  hiddenCategoryIds: string[];
  updatedAt: string;
  updatedBy?: string;
}

// ==========================================
// 🎬 20 Video Animation Presets & Settings
// ==========================================

export type VideoAnimationPresetId =
  | 'pulse-glow'
  | 'ken-burns'
  | 'golden-sparkles'
  | 'diya-float'
  | 'confetti-burst'
  | 'saffron-wave'
  | 'text-slide-up'
  | 'chakra-spin'
  | 'gold-light-sweep'
  | 'flower-shower'
  | 'cinematic-smoke'
  | 'blessing-auras'
  | 'neon-border-pulse'
  | 'parallax-drift'
  | 'beat-flash'
  | 'lens-flare'
  | 'water-ripples'
  | 'fireworks'
  | 'dhol-tasha-shake'
  | 'floating-3d-tilt';

export interface VideoAnimationPreset {
  id: VideoAnimationPresetId;
  name: string;
  nameMarathi: string;
  descriptionMarathi: string;
  iconName: string;
  category: 'festive' | 'royal' | 'modern' | 'divine';
  speedMultiplier?: number;
  previewColor?: string;
}

export interface VideoRenderOptions {
  durationSeconds: number; // 5, 10, 15, 30
  resolution: '1080p' | '720p' | '480p';
  fps: 30 | 60;
  format: 'mp4' | 'webm';
  animationPresetId: VideoAnimationPresetId;
  animationSpeed: 'slow' | 'normal' | 'fast';
  audioTrack: 'dhol-tasha' | 'shehnai' | 'temple-bells' | 'none';
  includeBranding: boolean;
  aspectRatio?: AspectRatio;
}

export interface AdminVideoSettings {
  enabled: boolean;
  enableVideoExports?: boolean;
  defaultPreset: VideoAnimationPresetId;
  defaultDuration: number;
  defaultResolution: '1080p' | '720p' | '480p';
  defaultAudio: 'dhol-tasha' | 'shehnai' | 'temple-bells' | 'none';
  allowClientCustomization: boolean;
  watermarkForFreeUsers: boolean;
  watermarkEnabled?: boolean;
  watermarkText?: string;
  maxDurationSeconds: number;
  maxVideoDurationSeconds?: number;
  activePresets: VideoAnimationPresetId[];
  fps60Enabled?: boolean;
}

// ==========================================
// 🎬 GUNASHREE VIDEO STUDIO ARCHITECTURE
// ==========================================

export type VideoStudioAspectRatio = '9:16' | '1:1' | '4:5';

export type VideoStudioLayerType =
  | 'background'
  | 'poster_image'
  | 'deity'
  | 'heading'
  | 'subheading'
  | 'logo'
  | 'decoration'
  | 'text'
  | 'particles'
  | 'audio';

export type VideoEasing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';

export interface VideoKeyframe {
  id: string;
  time: number; // in seconds (e.g. 0.0, 1.5, 3.0)
  x?: number; // relative to canvas or px
  y?: number;
  scale?: number; // 1.0 = 100%
  rotation?: number; // degrees
  opacity?: number; // 0 to 1
  blur?: number; // px
  brightness?: number; // 0 to 2
  easing?: VideoEasing;
}

export type VideoEntrancePresetId =
  | 'none'
  | 'fade_in'
  | 'fade_zoom_in'
  | 'slide_from_left'
  | 'slide_from_right'
  | 'slide_from_top'
  | 'slide_from_bottom'
  | 'zoom_in'
  | 'zoom_out'
  | 'pop_in'
  | 'bounce_in';

export type VideoMovementPresetId =
  | 'none'
  | 'slow_pan_left'
  | 'slow_pan_right'
  | 'slow_pan_up'
  | 'slow_pan_down'
  | 'floating'
  | 'gentle_zoom'
  | 'cinematic_zoom'
  | 'parallax_movement'
  | 'circular_motion'
  | 'wave_movement';

export type VideoExitPresetId =
  | 'none'
  | 'fade_out'
  | 'zoom_out_fade'
  | 'slide_left_out'
  | 'slide_right_out'
  | 'slide_down_out';

export type VideoTextAnimation =
  | 'none'
  | 'fade'
  | 'typewriter'
  | 'slide'
  | 'zoom'
  | 'pop'
  | 'bounce'
  | 'tracking'
  | 'char_reveal'
  | 'word_reveal';

export interface VideoStudioLayer {
  id: string;
  name: string;
  nameMarathi?: string;
  type: VideoStudioLayerType;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  // Position & Size (relative to base coordinate system e.g. 1080 x 1920)
  x: number;
  y: number;
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  // Transform
  scale: number;
  rotation: number;
  skewX?: number;
  skewY?: number;
  // Appearance
  opacity: number;
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  // Media / Content
  imageUrl?: string;
  svgIcon?: string;
  motifType?: string;
  bgGradient?: string;
  primaryColor?: string;
  accentColor?: string;
  // Text Specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  shadowColor?: string;
  shadowBlur?: number;
  strokeColor?: string;
  strokeWidth?: number;
  textAnimation?: VideoTextAnimation;
  // Animation Presets
  entrancePreset: VideoEntrancePresetId;
  entranceDuration: number; // e.g. 1.2s
  entranceDelay: number; // e.g. 0.3s
  entranceEasing: VideoEasing;
  movementPreset: VideoMovementPresetId;
  movementSpeed: number; // 0.5 to 2.0
  exitPreset: VideoExitPresetId;
  exitDuration: number;
  exitDelay: number;
  // Keyframes
  keyframes: VideoKeyframe[];
  // Particle / Effect Config
  effectType?: 'glow' | 'shadow' | 'blur' | 'light_leak' | 'sparkle' | 'particles' | 'confetti' | 'smoke' | 'bokeh';
  effectIntensity?: number;
  // Frame Branding Metadata (Keeps logo and frame static exactly as in poster)
  frameId?: FrameId;
  profile?: BusinessProfile;
  footerConfig?: Partial<FooterFrameConfig>;
}

export type VideoSceneTransition = 'fade' | 'crossfade' | 'zoom' | 'slide' | 'push' | 'blur' | 'flash';

export interface VideoStudioScene {
  id: string;
  name: string;
  duration: number; // default 6s
  posterId?: string;
  layers: VideoStudioLayer[];
  transition: VideoSceneTransition;
  transitionDuration: number; // default 0.6s
}

export interface VideoStudioProject {
  id: string;
  title: string;
  posterId?: string;
  ownerId: string;
  createdBy: string;
  creatorName?: string;
  duration: number; // total duration
  aspectRatio: VideoStudioAspectRatio;
  scenes: VideoStudioScene[];
  // Audio
  audioTrack: string;
  audioName?: string;
  audioVolume: number; // 0 to 1
  audioFadeIn: number; // seconds
  audioFadeOut: number; // seconds
  audioTrimStart: number;
  audioTrimEnd: number;
  // Status & URLs
  status: 'draft' | 'exported' | 'published';
  previewUrl?: string;
  exportUrl?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  // Frame Branding Metadata
  frameId?: FrameId;
  profile?: BusinessProfile;
  footerConfig?: Partial<FooterFrameConfig>;
}

export interface VideoAnimationTemplate {
  id: string;
  name: string;
  nameMarathi: string;
  description: string;
  category: 'festive' | 'devotional' | 'business' | 'celebration' | 'quotes' | 'modern';
  duration: number;
  aspectRatio: VideoStudioAspectRatio;
  allowedSizes?: AspectRatio[];
  defaultAudio: string;
  presetRules: {
    background: { entrance: VideoEntrancePresetId; movement: VideoMovementPresetId };
    mainObject: { entrance: VideoEntrancePresetId; movement: VideoMovementPresetId };
    heading: { entrance: VideoEntrancePresetId; textAnim: VideoTextAnimation };
    subheading: { entrance: VideoEntrancePresetId; textAnim: VideoTextAnimation };
    logo: { entrance: VideoEntrancePresetId; movement: VideoMovementPresetId };
    decoration: { entrance: VideoEntrancePresetId; movement: VideoMovementPresetId };
  };
}

export interface VideoStudioExportJob {
  id: string;
  projectId: string;
  status: 'preparing' | 'rendering' | 'encoding' | 'uploading' | 'complete' | 'failed';
  statusText: string;
  progress: number; // 0 to 100
  downloadUrl?: string;
  fileName?: string;
  error?: string;
}

// ==========================================
// GROW VIEW SUBSCRIPTION & TEAM SYSTEM TYPES
// ==========================================

export type PlanId =
  | 'free'
  | 'starter-monthly'
  | 'business-monthly'
  | 'starter-yearly'
  | 'business-yearly'
  | 'business-team';

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'PENDING_APPROVAL'
  | 'FAILED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'REJECTED';

export interface SubscriptionApprovalRequest {
  id: string;
  order_id: string;
  payment_id: string;
  user_id: string;
  user_email: string;
  user_name?: string;
  user_phone?: string;
  business_name?: string;
  plan_id: PlanId | string;
  plan_name: string;
  billing_cycle: 'monthly' | 'yearly' | 'free' | 'custom';
  amount: number;
  payment_method: string;
  transaction_id?: string;
  screenshot_url?: string;
  payment_date?: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
}

export interface PaymentVerificationRecord {
  id: string;
  order_id: string;
  payment_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  business_name?: string;
  plan_id: PlanId | string;
  plan_name: string;
  billing_cycle: 'monthly' | 'yearly' | 'free' | 'custom';
  amount: number;
  transaction_id: string;
  screenshot_url: string;
  payment_date: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  admin_notes?: string;
  previous_plan?: string;
  previous_status?: string;
}

export interface AdminPaymentSettings {
  upiId: string;
  upiName: string;
  qrCodeUrl: string;
  instructions: string;
  supportPhone: string;
  supportEmail: string;
  isEnabled: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export interface FreeUsageRecord {
  id: string;
  userId: string;
  month: number;
  year: number;
  freePostLimit: number;
  freePostsUsed: number;
  freePostsRemaining: number;
  lastUpdated: string;
}

export interface PaymentOverviewMetrics {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  todayRevenue: number;
  thisMonthRevenue: number;
  activePremiumUsers: number;
  expiredSubscriptions: number;
}

export interface UserSubscriptionRecord {
  id: string;
  user_id: string;
  plan_id: PlanId;
  plan_name: string;
  billing_cycle: 'monthly' | 'yearly' | 'free' | 'custom';
  payment_id: string;
  order_id: string;
  subscription_status: SubscriptionStatus;
  start_date: string;
  expiry_date: string;
  business_limit: number;
  team_member_limit: number;
  poster_limit: number; // -1 for unlimited
  watermark_status: 'NO_WATERMARK' | 'WATERMARK_AFTER_3_FREE';
  monthly_free_clean_used: number;
  current_month_key: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberRecord {
  id: string;
  owner_id: string;
  owner_email?: string;
  owner_business_name?: string;
  member_email: string;
  member_name: string;
  member_user_id?: string;
  role: 'business_admin' | 'team_member';
  status: 'active' | 'invited' | 'deactivated';
  assigned_business_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamLeadRecord {
  id: string;
  name: string;
  company_name: string;
  mobile_number: string;
  email: string;
  team_members_count: string;
  businesses_count: string;
  requirements: string;
  message: string;
  status: 'new' | 'contacted' | 'approved' | 'rejected' | 'converted';
  created_at: string;
}

export interface PlanConfig {
  plan_id: PlanId | string;
  plan_name: string;
  nameMarathi?: string;
  price: number;
  originalPrice?: number;
  billing_cycle: 'monthly' | 'yearly' | 'free' | 'quarterly' | 'custom';
  duration_days?: number;
  periodLabel?: string;
  periodLabelMarathi?: string;
  business_limit: number;
  team_member_limit: number;
  poster_limit: number; // -1 for unlimited
  features: string[];
  watermark_status: 'NO_WATERMARK' | 'WATERMARK_AFTER_3_FREE';
  is_active: boolean;
  display_order: number;
  description?: string;
  button_text: string;
  badge?: string;
  is_popular?: boolean;
  highlight_text?: string;
  premium_access?: boolean;
  premium_templates?: boolean;
  premium_export?: boolean;
}

export interface ExpiryReminderNotification {
  id: string;
  notification_type: 'expiry_reminder' | 'expiry_alert' | 'manual_admin';
  user_id: string;
  user_email: string;
  user_name?: string;
  subscription_id: string;
  plan_id: string;
  plan_name: string;
  sent_at: string;
  notification_status: 'sent' | 'read' | 'delivered';
  reminder_stage: '7_DAYS' | '3_DAYS' | '1_DAY' | 'ON_EXPIRY' | 'MANUAL';
  message: string;
  days_remaining: number;
}

export interface PaymentOrderRecord {
  order_id: string;
  user_id: string;
  user_email: string;
  plan_id: PlanId;
  plan_name: string;
  amount: number;
  currency: 'INR';
  status: 'created' | 'paid' | 'failed' | 'refunded';
  payment_id?: string;
  payment_method?: string;
  created_at: string;
  verified_at?: string;
}

export interface PosterWatermarkConfig {
  enabled: boolean;
  text?: string;
  brandSubtext?: string;
  subText?: string;
}

export interface UserSubscriptionResolution {
  subscription?: UserSubscriptionRecord;
  planConfig?: PlanConfig;
  planId: PlanId;
  planName: string;
  planNameMarathi: string;
  price: number;
  billingPeriod: string;
  expiresAt: string | null;
  isActivePaid: boolean;
  needsWatermark: boolean;
  canExportCleanPosters: boolean;
  canExportClean?: boolean;
  freePostersUsed: number;
  freePostersLeft: number;
  freePostsLimit: number;
  freePostsUsed: number;
  freePostsRemaining: number;
  monthlyFreeCleanUsed?: number;
  isTeamMember: boolean;
  teamOwnerId?: string;
  teamRole?: 'business_admin' | 'team_member';
  teamOwnerEmail?: string;
  maxTeamMembers: number;
  maxBusinesses: number;
  businessLimit?: number;
  daysRemaining?: number;
  hasPendingApproval?: boolean;
  pendingApproval?: SubscriptionApprovalRequest | null;
  latestPayment?: PaymentVerificationRecord | null;
  pendingPayment?: PaymentVerificationRecord | null;
  paymentHistory?: PaymentVerificationRecord[];
}

// ============================================================
// MASTER TEMPLATE LIBRARY — 150 UNIQUE DESIGNS (WEDDING, ENGAGEMENT, RESUME)
// ============================================================

export type MasterTemplateCategory = 'wedding' | 'engagement' | 'resume';

export interface MasterTemplateConfig {
  layoutVariant: string; // e.g. 'peshwai-royal', 'floral-botanical', 'vivah-biodata', 'modern-sidebar', etc.
  bgPattern?: string; // e.g. 'damask', 'mandala', 'mesh', 'dots', 'lines', 'watercolor', 'solid'
  bgGradient?: string;
  bgImageUrl?: string;
  bgPatternType?: 'none' | 'damask' | 'mandala' | 'dots' | 'brocade' | 'geometric' | 'floral-corners' | string;
  borderStyle?: string;
  headerStyle?: string;
  cardRadius?: number;
  headingFontSize?: number; // e.g. 24, 28, 32, 36
  bodyFontSize?: number; // e.g. 10, 11, 12, 14
  ornamentIcon?: string; // 'ganpati', 'kalash', 'haldi-kumkum', 'shehnai', 'rings', 'couple-silhouette', 'peacock', 'lotus', 'none'
  accentGlow?: boolean;
  showCouplePhotoPlaceholder?: boolean;
  showRingPlaceholder?: boolean;
  showProfilePhotoPlaceholder?: boolean;
  isAtsClean?: boolean;
  sidebarWidthPercent?: number; // for two-column resumes (e.g. 33)
  spacingDensity?: 'compact' | 'balanced' | 'relaxed';
  customElements?: CanvasCustomElement[]; // Drag & drop custom stickers, motifs, text, badges added by admin
  elementPositions?: Record<string, { x: number; y: number; scale?: number; isHidden?: boolean }>;
}

export interface MasterTemplate {
  id: string; // WED-001..050, ENG-001..050, RES-001..050
  name: string;
  nameMarathi?: string;
  category: MasterTemplateCategory;
  subcategory: string;
  style: string;
  preview_image?: string;
  template_config: MasterTemplateConfig;
  font_family: string;
  heading_font: string;
  body_font: string;
  primary_color: string;
  secondary_color: string;
  accent_color?: string;
  text_color?: string;
  bg_color?: string;
  layout_type: string;
  supported_sizes: string[];
  is_free: boolean;
  is_premium: boolean;
  is_active: boolean;
  is_ats_friendly?: boolean;
  has_photo?: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface WeddingFormData {
  brideName: string;
  groomName: string;
  brideParents: string;
  groomParents: string;
  weddingDate: string; // e.g. '२२ नोव्हेंबर २०२६'
  weddingDay: string; // e.g. 'रविवार'
  weddingTime: string; // e.g. 'सकाळी ११:४५ वाजता'
  muhurat: string; // e.g. 'शुभ मुहूर्त दुपारी १२:२८'
  venue: string; // e.g. 'महालक्ष्मी मंगल कार्यालय'
  address: string; // e.g. 'पुणे-बंगलोर हायवे, कोल्हापूर'
  invitationMessage: string; // e.g. 'स्नेहपूर्वक निमंत्रण...'
  contactDetails: string; // e.g. '९८XXXXXX१० / ९७XXXXXX२०'
  hosts?: string; // e.g. 'समस्त इंगळे व शिंदे परिवार'
  couplePhotoUrl?: string;
  ganpatiImageUrl?: string;
  rsvp?: string;
}

export interface EngagementFormData {
  brideName: string;
  groomName: string;
  brideParents: string;
  groomParents: string;
  engagementDate: string;
  day: string;
  time: string;
  venue: string;
  address: string;
  invitationMessage: string;
  contactNumber: string;
  ringCeremonyDetails?: string;
  couplePhotoUrl?: string;
  specialNote?: string;
}

export interface ResumeWorkExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location: string;
  points: string[];
}

export interface ResumeEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
  score?: string;
}

export interface ResumeProject {
  id: string;
  title: string;
  link?: string;
  techStack?: string;
  description: string;
}

export interface ResumeFormData {
  fullName: string;
  professionalTitle: string;
  profilePhotoUrl?: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  professionalSummary: string;
  workExperience: ResumeWorkExperience[];
  education: ResumeEducation[];
  skills: string[];
  technicalSkills: string[];
  projects: ResumeProject[];
  certifications: string[];
  languages: string[];
  achievements: string[];
  interests: string[];
  references: string;
  declaration: string;
  sectionVisibility: Record<string, boolean>;
  sectionOrder: string[];
}

// ---------------------------------------------------------------------
// AI FESTIVAL AUTO CREATOR TYPES & INTERFACES (Sections 1-35)
// ---------------------------------------------------------------------

export interface AIFestivalEventSource {
  title: string;
  url: string;
  sourceName: string;
  verifiedAt: string;
}

export interface AIFestivalEvent {
  id: string;
  name: string;
  nameMarathi: string;
  nameHindi?: string;
  dateStr: string; // 'YYYY-MM-DD'
  dayOfWeek: string;
  daysAway: number;
  eventType: 'festival' | 'jayanti' | 'punyatithi' | 'national_day' | 'historical_event' | 'awareness_day' | 'cultural' | 'religious';
  personOrSubject?: string;
  location: string;
  relevance: string;
  shortDescription: string;
  shortDescriptionMarathi?: string;
  historicalSignificance?: string;
  isPersonality?: boolean;
  authenticImage?: {
    url: string;
    sourcePage?: string;
    sourceName: string;
    license?: string;
    credit?: string;
  };
  sources: AIFestivalEventSource[];
}

export type AIFestivalDesignStyle =
  | 'historical_archive'
  | 'modern_patriotic'
  | 'cinematic_portrait'
  | 'minimal_clean'
  | 'vintage_newspaper'
  | 'modern_youth'
  | 'premium_royal'
  | 'artistic_illustrative'
  | 'quote_focus'
  | 'community_branding';

export interface AIFestivalCampaignResult {
  eventId: string;
  eventName: string;
  eventNameMarathi: string;
  dateStr: string;
  dayOfWeek: string;
  researchSummary: string;
  sources: AIFestivalEventSource[];
  posters: PosterTemplate[];
  totalGenerated: number;
  generatedAt: string;
}

export interface AIFestivalAdminSettings {
  enabled: boolean;
  maxPostersPerCampaign: number;
  allowedCategories: string[];
  allowedRegions: string[];
  defaultLanguage: 'mr' | 'hi' | 'en' | 'mixed';
  defaultPosterCount: number;
  searchGroundedResearch: boolean;
  freeTierLimitPerMonth: number;
  vipTierLimitPerMonth: number;
}

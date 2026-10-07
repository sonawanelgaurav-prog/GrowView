import { PosterTemplate } from '../types';
import { getUpcoming3DaysEvents, DayCalendarEvent } from './calendarFestivals';

export interface DashboardStoryItem {
  id: string;
  label: string;
  labelMarathi: string;
  iconName: string; // e.g. 'Flame', 'Crown', 'Moon', 'Sun', 'Palette', 'Video', 'Sunrise', 'Tag', 'Sparkles', 'Zap', 'Briefcase', 'Heart', 'Smile'
  gradient: string;
  badge?: string;
  isLive?: boolean;
  categoryFilter: string;
  groupFilter?: string;
  formatFilter?: 'all' | '1:1' | '9:16' | 'video';
  enabled: boolean;
  order: number;
}

export interface DashboardHeroSlide {
  id: string;
  tag: string;
  tagMarathi: string;
  title: string;
  titleMarathi: string;
  dateText: string;
  countdownText: string;
  gradient: string;
  accentColor: string;
  headline: string;
  subtext: string;
  category: string;
  targetTemplateId?: string;
  posterImageUrl?: string; // Custom poster image URL or uploaded poster
  buttonText?: string;
  enabled: boolean;
  isFlashPinned?: boolean; // When true, pinned as the primary flash design
  order: number;
  festivalDate?: string; // e.g. '2026-10-04'
  isAuto3Day?: boolean; // When auto generated from rolling 3-day calendar
}

export interface DashboardSectionConfig {
  id: string;
  type: 'rail' | 'custom_rail' | 'featured_grid';
  title: string;
  titleMarathi: string;
  subtitle?: string;
  badge: string;
  iconName: string; // e.g. 'Flame', 'Sun', 'Video', 'Sunrise', 'Moon', 'Building2', 'Tag', 'Users', 'Sparkles'
  categoryFilter: string; // e.g. 'festivals', 'ganesh-chaturthi', 'video-posts', 'good-morning-quotes', etc.
  viewAllCategory?: string;
  enabled: boolean;
  order: number;
  isSystem?: boolean;
  filterChips?: { id: string; label: string }[];
  pinnedTemplateIds?: string[]; // Admin can optionally pin specific template IDs
}

export interface UserDashboardConfig {
  // Global Section Toggles
  showCalendarStrip?: boolean; // 8-Day Live Upcoming Festival Calendar
  showStoryTray: boolean;
  storyTrayTitle: string;
  storyTrayTitleMarathi: string;
  
  showHeroBanner: boolean;
  heroBannerAutoRotate: boolean;
  heroBannerRotationSeconds: number;
  flashBannerMode: 'carousel' | 'pinned' | 'auto_3days'; // 'pinned' locks to pinned slide, 'auto_3days' strictly follows next 3 days
  pinnedFlashSlideId?: string;
  autoUpcoming3DaysOnly: boolean; // When true, strictly only festivals in the upcoming 3 days appear in hero

  showControlBar: boolean; // Format and Frame Switcher
  showQuickFormatFilter: boolean;
  showQuickFrameSwitcher: boolean;

  // Items
  stories: DashboardStoryItem[];
  heroSlides: DashboardHeroSlide[];
  sections: DashboardSectionConfig[];

  updatedAt: string;
}

export const DEFAULT_DASHBOARD_STORIES: DashboardStoryItem[] = [
  {
    id: 'today-special',
    label: "Today's Special",
    labelMarathi: 'आजचे विशेष',
    iconName: 'Flame',
    gradient: 'from-red-500 via-orange-500 to-amber-500',
    badge: 'LIVE',
    isLive: true,
    categoryFilter: 'all',
    groupFilter: 'upcoming',
    enabled: true,
    order: 1,
  },
  {
    id: 'navratri-special',
    label: 'Navratri Mahotsav',
    labelMarathi: 'शारदीय नवरात्रोत्सव',
    iconName: 'Flame',
    gradient: 'from-amber-600 via-rose-600 to-purple-600',
    badge: 'दिवस २',
    isLive: true,
    categoryFilter: 'navratri',
    groupFilter: 'festivals',
    enabled: true,
    order: 2,
  },
  {
    id: 'dussehra-special',
    label: 'Dussehra Special',
    labelMarathi: 'दसरा महाउत्सव',
    iconName: 'Sun',
    gradient: 'from-amber-500 via-yellow-500 to-orange-600',
    badge: '१२ ऑक्टोबर',
    categoryFilter: 'navratri',
    groupFilter: 'festivals',
    enabled: true,
    order: 3,
  },
  {
    id: 'diwali-special',
    label: 'Diwali Dhamaka',
    labelMarathi: 'दिवाळी विशेष',
    iconName: 'Sparkles',
    gradient: 'from-amber-500 via-orange-600 to-red-600',
    badge: 'आगामी सण',
    categoryFilter: 'diwali',
    groupFilter: 'festivals',
    enabled: true,
    order: 4,
  },
  {
    id: 'good-morning-quotes',
    label: 'Good Morning',
    labelMarathi: 'शुभ सकाळ ५०',
    iconName: 'Sunrise',
    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
    badge: '50 Designs',
    categoryFilter: 'good-morning-quotes',
    groupFilter: 'daily',
    enabled: true,
    order: 6,
  },
  {
    id: 'good-night-quotes',
    label: 'Good Night',
    labelMarathi: 'शुभ रात्र ५०',
    iconName: 'Moon',
    gradient: 'from-indigo-600 via-purple-700 to-slate-900',
    badge: '50 Designs',
    categoryFilter: 'good-night-quotes',
    groupFilter: 'daily',
    enabled: true,
    order: 7,
  },
  {
    id: 'video-status',
    label: 'Video Status',
    labelMarathi: 'व्हिडिओ स्टेटस',
    iconName: 'Video',
    gradient: 'from-purple-600 via-pink-600 to-red-600',
    badge: '15s Reels',
    categoryFilter: 'video-posts',
    groupFilter: 'video',
    formatFilter: 'video',
    enabled: true,
    order: 8,
  },
  {
    id: 'business-promo',
    label: 'Daily Business',
    labelMarathi: 'व्यवसाय जाहिरात',
    iconName: 'Briefcase',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    badge: 'Hot Offer',
    categoryFilter: 'business-promo',
    groupFilter: 'business',
    enabled: true,
    order: 9,
  },
  {
    id: 'political-greetings',
    label: 'Political & Birthday',
    labelMarathi: 'वाढदिवस व सत्कार',
    iconName: 'Tag',
    gradient: 'from-orange-500 via-amber-600 to-yellow-500',
    badge: 'Greetings',
    categoryFilter: 'political-greetings',
    groupFilter: 'political',
    enabled: true,
    order: 10,
  },
];

export const DEFAULT_HERO_SLIDES: DashboardHeroSlide[] = [
  {
    id: 'navratri-hero',
    tag: 'AUSPICIOUS NAVRATRI FESTIVAL',
    tagMarathi: 'शारदीय नवरात्रोत्सव विशेष',
    title: 'Shardiya Navratri Mahotsav 2026',
    titleMarathi: 'शारदीय नवरात्रौत्सव • जय माता दी',
    dateText: '3 - 12 October 2026',
    countdownText: '🚩 चालू व येत्या ३ दिवसांतील सण • दांडिया व गरबा',
    gradient: 'from-amber-950 via-rose-950 to-purple-950',
    accentColor: '#f43f5e',
    headline: '।। सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके ।।',
    subtext: 'आई दुर्गेच्या आशीर्वादाने आपल्या कुटुंबात व व्यापारात सुख, समृद्धी आणि भरभराट लाभो. नवरात्रीच्या हार्दिक शुभेच्छा!',
    category: 'navratri',
    targetTemplateId: 'navratri-1',
    buttonText: 'Create Navratri Poster',
    enabled: true,
    isFlashPinned: true,
    order: 1,
    festivalDate: '2026-10-04',
    isAuto3Day: true,
  },
  {
    id: 'dussehra-hero',
    tag: 'UPCOMING GRAND FESTIVAL',
    tagMarathi: 'विजयादशमी दसरा महामोहीम',
    title: 'Dussehra Vijayadashami 2026',
    titleMarathi: 'विजयादशमी - दसरा • सोनं लुटूया!',
    dateText: '12 October 2026',
    countdownText: '⏳ आगामी मोठा सण • १२ ऑक्टोबर',
    gradient: 'from-amber-950 via-yellow-950 to-orange-950',
    accentColor: '#f59e0b',
    headline: '।। अनिष्टावर इष्टाचा विजय • दसरा सण मोठा ।।',
    subtext: 'सोन्यासारख्या माणसांना विजयादशमीच्या मनःपूर्वक शुभेच्छा! आपल्या व्यवसायाचे ब्रँडेड दसरा पोस्टर १-क्लिकमध्ये तयार करा.',
    category: 'navratri',
    targetTemplateId: 'dussehra-1',
    buttonText: 'Create Dussehra Poster',
    enabled: true,
    order: 2,
    festivalDate: '2026-10-12',
  },
  {
    id: 'diwali-hero',
    tag: 'FESTIVAL OF LIGHTS',
    tagMarathi: 'दिवाळी महाउत्सव मोहीम',
    title: 'Deepawali Mahotsav 2026',
    titleMarathi: 'दीपावली महाउत्सव • आनंदाचे दीप तेवू दे',
    dateText: '29 Oct - 2 Nov 2026',
    countdownText: '🪔 आगामी महादिवाळी • २९ ऑक्टो - २ नोव्हें',
    gradient: 'from-amber-950 via-red-950 to-orange-950',
    accentColor: '#fbbf24',
    headline: '।। शुभ दीपावली • धनत्रयोदशी, लक्ष्मीपूजन व पाडवा ।।',
    subtext: 'दिवाळीच्या मंगल पर्वावर आपल्या ग्राहकांसाठी व हितचिंतकांसाठी १-क्लिकमध्ये ब्रँडेड शुभेच्छा पोस्टर्स बनवा.',
    category: 'diwali',
    targetTemplateId: 'diwali-1',
    buttonText: 'Explore Diwali Posters',
    enabled: true,
    order: 3,
    festivalDate: '2026-10-31',
  },
  {
    id: 'shivaji-hero',
    tag: 'GRAND FESTIVAL SPECIAL',
    tagMarathi: 'शिवजयंती विशेष मोहीम',
    title: 'Chhatrapati Shivaji Maharaj Jayanti',
    titleMarathi: 'छत्रपती शिवाजी महाराज जयंती २०२६',
    dateText: '19 February 2026',
    countdownText: '⏳ १९ फेब्रुवारी • शिवजन्मोत्सव',
    gradient: 'from-amber-950 via-orange-900 to-red-950',
    accentColor: '#f97316',
    headline: '।। प्रौढ प्रताप पुरंधर • क्षत्रियकुलावतंस ।।',
    subtext: 'शिवरायांच्या शौर्याला त्रिवार मानाचा मुजरा! आपल्या व्यवसायाचे ब्रँडेड पोस्टर १-क्लिकमध्ये तयार करा.',
    category: 'shivaji-jayanti',
    buttonText: 'Create Brand Poster',
    enabled: true,
    order: 4,
    festivalDate: '2026-02-19',
  },
  {
    id: 'shivratri-hero',
    tag: 'AUSPICIOUS CELEBRATION',
    tagMarathi: 'महाशिवरात्री उत्सव',
    title: 'Maha Shivratri Mahotsav',
    titleMarathi: 'महाशिवरात्रीच्या पावन पर्वाच्या हार्दिक शुभेच्छा',
    dateText: '26 February 2026',
    countdownText: '🔱 २६ फेब्रुवारी • हर हर महादेव',
    gradient: 'from-slate-950 via-cyan-950 to-indigo-950',
    accentColor: '#38bdf8',
    headline: '।। ॐ नमः शिवाय • हर हर महादेव ।।',
    subtext: 'देवों के देव महादेव की कृपा से आपके व्यापार व परिवार में सुख, शांति व आरोग्य सदैव बना रहे।',
    category: 'shivratri',
    buttonText: 'Create Brand Poster',
    enabled: true,
    isFlashPinned: false,
    order: 5,
    festivalDate: '2026-02-26',
  },
  {
    id: 'ganesh-hero',
    tag: 'FESTIVAL OF WISDOM',
    tagMarathi: 'गणेशोत्सव महामोहीम',
    title: 'Ganesh Chaturthi Premium Library',
    titleMarathi: 'गणपती बाप्पा मोरया • ५० भव्य डिझाईन्स',
    dateText: 'Ganesh Festival Season',
    countdownText: '🚩 50+ Royal, Devotional & Mandal Designs',
    gradient: 'from-amber-950 via-red-900 to-orange-950',
    accentColor: '#f59e0b',
    headline: '।। वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।।',
    subtext: 'मंडळ, आगमन, आरती आणि व्यावसायिक शुभेच्छांसाठी ५० सर्वोत्तम प्रीमियम पोस्टर डिझाईन्स उपलब्ध!',
    category: 'ganesh-chaturthi',
    buttonText: 'Explore 50 Ganesh Posters',
    enabled: true,
    order: 6,
  },
  {
    id: 'business-dhamaka-hero',
    tag: 'BUSINESS GROWTH 2026',
    tagMarathi: 'व्यापार वृद्धी व जाहिरात',
    title: 'Daily Business Branding & Offers',
    titleMarathi: 'दररोज नवीन ऑफर्स व व्यवसाय जाहिराती',
    dateText: '365 Days Auto-Branding',
    countdownText: '🚀 500+ Business Categories Available',
    gradient: 'from-red-950 via-rose-900 to-amber-950',
    accentColor: '#fbbf24',
    headline: 'GROW YOUR BUSINESS WITH GROWVIEW',
    subtext: 'Jewellery, Real Estate, Grocery, Clinic, Education & Restaurant posters with automatic logo & address!',
    category: 'business-promo',
    buttonText: 'Boost My Business',
    enabled: true,
    order: 7,
  },
  {
    id: 'holi-hero',
    tag: 'COLORFUL FESTIVAL',
    tagMarathi: 'रंगोत्सव व धुलिवंदन',
    title: 'Shubh Holi & Rangpanchami',
    titleMarathi: 'रंग प्रेमाचा, रंग आनंदाचा • होळी उत्सव',
    dateText: '14 March 2026',
    countdownText: '🎨 Advance Festive Campaign',
    gradient: 'from-pink-950 via-purple-950 to-amber-950',
    accentColor: '#f43f5e',
    headline: 'HAPPY HOLI • बुरा न मानो होली है!',
    subtext: 'रंगपंचमीच्या मंगल पर्वावर आपल्या ग्राहकांसाठी आकर्षक डिस्काउंट व सदिच्छा पोस्टर्स तयार करा.',
    category: 'holi',
    buttonText: 'Make Holi Poster',
    enabled: true,
    order: 8,
    festivalDate: '2026-03-14',
  },
];

export const DEFAULT_DASHBOARD_SECTIONS: DashboardSectionConfig[] = [
  {
    id: 'upcoming-festivals',
    type: 'rail',
    title: 'Upcoming Indian Festivals & Events',
    titleMarathi: 'आगामी सण, उत्सव व दिनविशेष',
    badge: 'HOT TRENDING',
    iconName: 'Flame',
    categoryFilter: 'festivals',
    viewAllCategory: 'festivals',
    enabled: true,
    order: 1,
    isSystem: true,
  },
  {
    id: 'navratri-festival-library',
    type: 'rail',
    title: 'शारदीय नवरात्रोत्सव Special – Premium Templates',
    titleMarathi: 'घटस्थापना, गरबा, दांडिया, शैलपुत्री व देवी पूजन ५० Professional Designs',
    badge: 'नऊ दिवस महाउत्सव',
    iconName: 'Flame',
    categoryFilter: 'navratri',
    viewAllCategory: 'navratri',
    enabled: true,
    order: 2,
    isSystem: true,
    filterChips: [
      { id: 'all', label: 'सर्व नवरात्री डिझाईन्स' },
      { id: 'ghatsthapana', label: '🪔 घटस्थापना' },
      { id: 'garba-dandiya', label: '💃 गरबा व दांडिया' },
      { id: 'devi-bhakti', label: '🚩 देवी भक्ती व आरती' },
      { id: 'business-offers', label: '💼 नवरात्र ऑफर्स' },
    ],
  },
  {
    id: 'video-status',
    type: 'rail',
    title: 'WhatsApp Animated & Video Status',
    titleMarathi: 'व्हिडिओ स्टेटस व 9:16 रील्स',
    badge: '15s VIDEO',
    iconName: 'Video',
    categoryFilter: 'video-posts',
    viewAllCategory: 'video-posts',
    enabled: true,
    order: 3,
    isSystem: true,
  },
  {
    id: 'good-morning-library',
    type: 'rail',
    title: 'Good Morning / शुभ सकाळ Quotes Library',
    titleMarathi: 'शुभ सकाळ व प्रेरणादायी विचार (५० डिझाईन्स)',
    badge: '50 DESIGNS',
    iconName: 'Sunrise',
    categoryFilter: 'good-morning-quotes',
    viewAllCategory: 'good-morning-quotes',
    enabled: true,
    order: 4,
    isSystem: true,
  },
  {
    id: 'good-night-library',
    type: 'rail',
    title: 'Good Night / शुभ रात्र Peaceful Quotes',
    titleMarathi: 'शुभ रात्र व शांतता विचार (५० डिझाईन्स)',
    badge: '50 DESIGNS',
    iconName: 'Moon',
    categoryFilter: 'good-night-quotes',
    viewAllCategory: 'good-night-quotes',
    enabled: true,
    order: 5,
    isSystem: true,
  },
  {
    id: 'business-marketing',
    type: 'rail',
    title: 'Business & Industry Marketing Posts',
    titleMarathi: 'व्यवसाय व उद्योग वर्ग जाहिराती',
    badge: '500+ CATEGORIES',
    iconName: 'Building2',
    categoryFilter: 'business',
    viewAllCategory: 'business',
    enabled: true,
    order: 6,
    isSystem: true,
  },
  {
    id: 'wedding-invitations-rail',
    type: 'rail',
    title: 'Wedding Invitation & Lagna Patrika',
    titleMarathi: '💍 लग्नपत्रिका व विवाह निमंत्रण',
    badge: 'ROYAL DESIGNS',
    iconName: 'Heart',
    categoryFilter: 'wedding-invitation',
    viewAllCategory: 'wedding-invitation',
    enabled: true,
    order: 7,
    isSystem: true,
  },
  {
    id: 'sakharpuda-rail',
    type: 'rail',
    title: 'Engagement & Sakharpuda Ceremony',
    titleMarathi: '💍 साखरपुडा व वाङ्निश्चय सोहळा',
    badge: 'ENGAGEMENT',
    iconName: 'Gem',
    categoryFilter: 'engagement-ceremony',
    viewAllCategory: 'engagement-ceremony',
    enabled: true,
    order: 8,
    isSystem: true,
  },
  {
    id: 'biodata-resume-rail',
    type: 'rail',
    title: 'Biodata & Job Resume (CV)',
    titleMarathi: '📄 विवाह बायोडाटा व जॉब सीव्ही (Resume)',
    badge: 'CV MAKER',
    iconName: 'FileText',
    categoryFilter: 'biodata-resume',
    viewAllCategory: 'biodata-resume',
    enabled: true,
    order: 9,
    isSystem: true,
  },
  {
    id: 'grand-offers',
    type: 'rail',
    title: 'Festival Dhamaka & Grand Sale Offers',
    titleMarathi: 'भव्य डिस्काउंट व धमाका ऑफर्स',
    badge: 'DISCOUNTS',
    iconName: 'Tag',
    categoryFilter: 'business-promo',
    viewAllCategory: 'business-promo',
    enabled: true,
    order: 10,
    isSystem: true,
  },
  {
    id: 'political-greetings',
    type: 'rail',
    title: 'Political, Birthday & Leader Greetings',
    titleMarathi: 'राजकीय, सत्कार व वाढदिवस शुभेच्छा',
    badge: 'GREETINGS',
    iconName: 'Users',
    categoryFilter: 'birthday-wishes',
    viewAllCategory: 'birthday-wishes',
    enabled: true,
    order: 11,
    isSystem: true,
  },
];

export const DEFAULT_USER_DASHBOARD_CONFIG: UserDashboardConfig = {
  showCalendarStrip: true,
  showStoryTray: false,
  storyTrayTitle: 'Trending Daily Stories & Events',
  storyTrayTitleMarathi: 'दैनिक ट्रेंड्स',

  showHeroBanner: true,
  heroBannerAutoRotate: true,
  heroBannerRotationSeconds: 6,
  flashBannerMode: 'pinned',
  pinnedFlashSlideId: 'navratri-hero',
  autoUpcoming3DaysOnly: true,

  showControlBar: true,
  showQuickFormatFilter: true,
  showQuickFrameSwitcher: true,

  stories: DEFAULT_DASHBOARD_STORIES,
  heroSlides: DEFAULT_HERO_SLIDES,
  sections: DEFAULT_DASHBOARD_SECTIONS,

  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = 'growview_dashboard_config';

export function loadUserDashboardConfig(): UserDashboardConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('design1123_dashboard_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If the saved config still has 'shivratri-hero' pinned while we are in October, migrate to 'navratri-hero'
      let pinnedId = parsed.pinnedFlashSlideId || 'navratri-hero';
      if (pinnedId === 'shivratri-hero') {
        pinnedId = 'navratri-hero';
      }
      
      let slides: DashboardHeroSlide[] = Array.isArray(parsed.heroSlides) && parsed.heroSlides.length > 0 
        ? parsed.heroSlides 
        : DEFAULT_HERO_SLIDES;

      // Ensure navratri-hero and dussehra-hero exist in heroSlides
      if (!slides.some((s) => s.id === 'navratri-hero')) {
        slides = [DEFAULT_HERO_SLIDES[0], DEFAULT_HERO_SLIDES[1], ...slides];
      }

      // Sanitize stories so expired festivals (Holi, Shivratri, Ganesh) are replaced by active Navratri/Dussehra/Diwali
      let stories: DashboardStoryItem[] = Array.isArray(parsed.stories) && parsed.stories.length > 0 
        ? parsed.stories.filter((s: DashboardStoryItem) => s.id !== 'ganesh-chaturthi' && s.id !== 'maha-shivratri' && s.id !== 'holi-festival' && s.id !== 'shivaji-jayanti')
        : DEFAULT_DASHBOARD_STORIES;
      if (!stories.some((s) => s.id === 'navratri-special')) {
        stories = DEFAULT_DASHBOARD_STORIES;
      }

      // Sanitize sections so expired ganesh-chaturthi-library becomes navratri-festival-library
      let sections: DashboardSectionConfig[] = Array.isArray(parsed.sections) && parsed.sections.length > 0
        ? parsed.sections.map((sec: DashboardSectionConfig) => sec.id === 'ganesh-chaturthi-library' ? DEFAULT_DASHBOARD_SECTIONS[1] : sec)
        : DEFAULT_DASHBOARD_SECTIONS;

      return {
        ...DEFAULT_USER_DASHBOARD_CONFIG,
        ...parsed,
        pinnedFlashSlideId: pinnedId,
        autoUpcoming3DaysOnly: parsed.autoUpcoming3DaysOnly !== undefined ? parsed.autoUpcoming3DaysOnly : true,
        stories,
        heroSlides: slides,
        sections,
      };
    }
  } catch (e) {
    console.warn('Error loading UserDashboardConfig:', e);
  }
  return DEFAULT_USER_DASHBOARD_CONFIG;
}

export function saveUserDashboardConfig(config: UserDashboardConfig): void {
  try {
    const updated = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Broadcast change for instant live-reloading without page refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('growview:dashboard_config_updated', { detail: updated }));
    }
  } catch (e) {
    console.warn('Error saving UserDashboardConfig:', e);
  }
}

export function resetUserDashboardConfig(): UserDashboardConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('design1123_dashboard_config');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('growview:dashboard_config_updated', { detail: DEFAULT_USER_DASHBOARD_CONFIG }));
    }
  } catch (e) {
    console.warn('Error resetting UserDashboardConfig:', e);
  }
  return DEFAULT_USER_DASHBOARD_CONFIG;
}

/**
 * Intelligent Festival Resolution Engine:
 * Strictly resolves which festival and poster appear on the Hero banner:
 * 1. If 'autoUpcoming3DaysOnly' is true, strictly finds the festival coming in the NEXT 3 DAYS
 *    (Today, Tomorrow, Day 2, Day 3).
 * 2. If Admin has pinned a slide, checks whether that slide is relevant or if Admin specifically overrode it.
 * 3. Pairs the slide with a real, high-resolution PosterTemplate.
 */
export function resolveActiveHeroSlide(
  config: UserDashboardConfig,
  allTemplates: PosterTemplate[],
  activeSlideIndex: number = 0,
  customRefDate?: string
): {
  slide: DashboardHeroSlide;
  matchedTemplate?: PosterTemplate;
  isFrom3DaysCalendar: boolean;
  upcoming3DaysList: DayCalendarEvent[];
} {
  const upcoming3Days = getUpcoming3DaysEvents(customRefDate);
  const activeSlides = (config?.heroSlides || DEFAULT_HERO_SLIDES).filter((s) => s.enabled);
  
  // Extract all festival items from the upcoming 3 days
  const upcomingFestivalsList = upcoming3Days.flatMap((d) => 
    d.festivals.map((f) => ({
      ...f,
      dateStr: d.dateStr,
      relativeLabel: d.relativeLabel,
      dayNumber: d.dayNumber,
      monthNameMarathi: d.monthNameMarathi,
    }))
  );

  let selectedSlide: DashboardHeroSlide | undefined;
  let isFrom3Days = false;

  // 1. Strict 3-day rule enforcement:
  // If autoUpcoming3DaysOnly is true OR mode is 'auto_3days', search for an active slide matching the upcoming 3 days!
  if (config?.autoUpcoming3DaysOnly || config?.flashBannerMode === 'auto_3days') {
    // Check if any active slide matches the category or title of an upcoming 3-day festival
    const matchInSlides = activeSlides.find((slide) => {
      return upcomingFestivalsList.some((fest) => {
        if (fest.category === slide.category) return true;
        if (slide.title.toLowerCase().includes(fest.name.toLowerCase())) return true;
        if (slide.titleMarathi.includes(fest.nameMarathi) || fest.nameMarathi.includes(slide.titleMarathi)) return true;
        return false;
      });
    });

    if (matchInSlides) {
      selectedSlide = matchInSlides;
      isFrom3Days = true;
    } else if (upcomingFestivalsList.length > 0) {
      // Auto-construct a dynamic slide for today's / immediate upcoming festival!
      const topFest = upcomingFestivalsList[0];
      selectedSlide = {
        id: `auto-3day-${topFest.id}`,
        tag: topFest.relativeLabel ? `${topFest.relativeLabel} • पावन सण` : 'येत्या ३ दिवसांतील आगामी सण',
        tagMarathi: `${topFest.dayNumber} ${topFest.monthNameMarathi} • ${topFest.nameMarathi}`,
        title: topFest.name,
        titleMarathi: topFest.nameMarathi,
        dateText: `${topFest.dayNumber} ${topFest.monthNameMarathi}`,
        countdownText: `⏳ ${topFest.relativeLabel || 'आगामी सण'} • ${topFest.badge || 'विशेष मुहूर्त'}`,
        gradient: topFest.color || 'from-amber-950 via-rose-950 to-purple-950',
        accentColor: '#f59e0b',
        headline: `।। ${topFest.nameMarathi} हार्दिक शुभेच्छा ।।`,
        subtext: topFest.descriptionMarathi || `${topFest.nameMarathi}च्या मंगल पर्वावर आपल्या व्यवसायाचे ब्रँडेड पोस्टर १-क्लिकमध्ये तयार करा.`,
        category: topFest.category,
        buttonText: `${topFest.nameMarathi} पोस्टर बनवा`,
        enabled: true,
        order: 1,
        isAuto3Day: true,
      };
      isFrom3Days = true;
    }
  }

  // 2. Fallback to Pinned or Carousel mode if not resolved by strict 3-day filter
  if (!selectedSlide) {
    if (config?.flashBannerMode === 'pinned') {
      const pinned = activeSlides.find((s) => s.id === config.pinnedFlashSlideId) || activeSlides.find((s) => s.isFlashPinned);
      selectedSlide = pinned || activeSlides[0] || DEFAULT_HERO_SLIDES[0];
    } else {
      selectedSlide = activeSlides[activeSlideIndex % (activeSlides.length || 1)] || DEFAULT_HERO_SLIDES[0];
    }
  }

  // 3. Match real PosterTemplate for this slide
  let matchedTemplate: PosterTemplate | undefined;
  if (selectedSlide.targetTemplateId) {
    matchedTemplate = allTemplates.find((t) => t.id === selectedSlide!.targetTemplateId);
  }

  if (!matchedTemplate && selectedSlide.category) {
    // Find best template matching the category
    matchedTemplate = allTemplates.find(
      (t) =>
        t.category === selectedSlide!.category ||
        (Array.isArray(t.tags) && t.tags.includes(selectedSlide!.category)) ||
        t.title.toLowerCase().includes(selectedSlide!.category.toLowerCase())
    );
  }

  // If still not matched, grab the first festival template
  if (!matchedTemplate) {
    matchedTemplate = allTemplates.find((t) => t.subCategory === 'festivals') || allTemplates[0];
  }

  return {
    slide: selectedSlide,
    matchedTemplate,
    isFrom3DaysCalendar: isFrom3Days,
    upcoming3DaysList: upcoming3Days,
  };
}

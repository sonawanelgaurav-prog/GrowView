import { AspectRatio, PosterTemplate, SystemSizeId, SystemSizeConfig, SYSTEM_SIZES } from '../types';

export interface GlobalSizeSettings {
  square: boolean;
  portrait: boolean;
  vertical: boolean;
}

export const DEFAULT_GLOBAL_SIZE_SETTINGS: GlobalSizeSettings = {
  square: true,
  portrait: true,
  vertical: true,
};

const GLOBAL_SIZE_STORAGE_KEY = 'growview_global_size_settings';
const CATEGORY_SIZE_STORAGE_KEY = 'growview_category_size_settings';
const VIDEO_CATEGORY_SIZE_STORAGE_KEY = 'growview_video_category_size_settings';
const FESTIVAL_SIZE_STORAGE_KEY = 'growview_festival_size_settings';

export interface CategorySizeRule {
  id: string;
  name: string;
  nameMarathi?: string;
  group: 'business' | 'festival' | 'quotes' | 'social' | 'special';
  allowedSizes: AspectRatio[]; // ['1:1', '4:5', '9:16']
  defaultRatio: AspectRatio;
  subcategories?: {
    id: string;
    name: string;
    allowedSizes: AspectRatio[];
  }[];
}

// Predefined Category Rules specified in GrowView prompt
export const DEFAULT_CATEGORY_SIZE_RULES: CategorySizeRule[] = [
  // 10. Business Category & Subcategories
  {
    id: 'business-promo',
    name: 'Business Promotion',
    nameMarathi: 'व्यवसाय जाहिरात व ऑफर्स',
    group: 'business',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
    subcategories: [
      { id: 'product-promo', name: 'Product Promotion', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'service-promo', name: 'Service Promotion', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'offer', name: 'Offer', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'discount', name: 'Discount', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'new-opening', name: 'New Opening', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'shop-ad', name: 'Shop Advertisement', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'restaurant', name: 'Restaurant', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'real-estate', name: 'Real Estate', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'education', name: 'Education', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'medical', name: 'Medical', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'salon', name: 'Salon', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'digital-marketing', name: 'Digital Marketing', allowedSizes: ['1:1', '4:5', '9:16'] },
      { id: 'event-promo', name: 'Event Promotion', allowedSizes: ['1:1', '4:5', '9:16'] },
    ],
  },
  {
    id: 'product-promo',
    name: 'Product Promotion',
    nameMarathi: 'उत्पादन जाहिरात',
    group: 'business',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'offer-discount',
    name: 'Offer & Discount',
    nameMarathi: 'ऑफर व डिस्काउंट',
    group: 'business',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },

  // 9. Festivals
  {
    id: 'festivals',
    name: 'Festival',
    nameMarathi: 'सण व उत्सव',
    group: 'festival',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    nameMarathi: 'गणेश चतुर्थी उत्सव',
    group: 'festival',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'whatsapp-status-festivals',
    name: 'WhatsApp Festival Status',
    nameMarathi: 'व्हॉट्सॲप सण स्टेटस',
    group: 'festival',
    allowedSizes: ['9:16'],
    defaultRatio: '9:16',
  },

  // 11. Quote Categories
  {
    id: 'good-morning-quotes',
    name: 'Good Morning',
    nameMarathi: 'शुभ सकाळ सुविचार',
    group: 'quotes',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'good-night-quotes',
    name: 'Good Night',
    nameMarathi: 'शुभ रात्र संदेश',
    group: 'quotes',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'quotes-motivation',
    name: 'Motivational Quote',
    nameMarathi: 'प्रेरणादायी विचार',
    group: 'quotes',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'success-quotes',
    name: 'Success',
    nameMarathi: 'यशस्वी विचार',
    group: 'quotes',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'business-quotes',
    name: 'Business Quote',
    nameMarathi: 'व्यावसायिक विचार',
    group: 'quotes',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'inspirational-quotes',
    name: 'Inspirational',
    nameMarathi: 'मार्गदर्शक विचार',
    group: 'quotes',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },
  {
    id: 'festival-quotes',
    name: 'Festival Quote',
    nameMarathi: 'उत्सव कोट्स',
    group: 'quotes',
    allowedSizes: ['1:1', '4:5', '9:16'],
    defaultRatio: '1:1',
  },

  // 12. Social Media Categories (Predefined Rules)
  {
    id: 'social-feed-post',
    name: 'Instagram Feed / Feed Post',
    nameMarathi: 'इन्स्टाग्राम व फेसबुक फीड',
    group: 'social',
    allowedSizes: ['4:5', '1:1'], // Portrait ON, Square ON, Vertical OFF
    defaultRatio: '4:5',
  },
  {
    id: 'social-story',
    name: 'Instagram Story',
    nameMarathi: 'इन्स्टाग्राम स्टोरी',
    group: 'social',
    allowedSizes: ['9:16'], // Vertical ON only
    defaultRatio: '9:16',
  },
  {
    id: 'whatsapp-status',
    name: 'WhatsApp Status',
    nameMarathi: 'व्हॉट्सॲप स्टेटस',
    group: 'social',
    allowedSizes: ['9:16'], // Vertical ON only
    defaultRatio: '9:16',
  },
  {
    id: 'social-reel',
    name: 'Reel',
    nameMarathi: 'इन्स्टा रील्स',
    group: 'social',
    allowedSizes: ['9:16', '4:5'], // Vertical ON, Portrait Optional
    defaultRatio: '9:16',
  },

  // Special Categories from Matrix
  {
    id: 'wedding-invitation',
    name: 'Wedding Invitation',
    nameMarathi: 'विवाह निमंत्रण पत्रिका',
    group: 'special',
    allowedSizes: ['9:16'], // Vertical ON only
    defaultRatio: '9:16',
  },
  {
    id: 'engagement-ceremony',
    name: 'Engagement Ceremony',
    nameMarathi: 'साखरपुडा निमंत्रण',
    group: 'special',
    allowedSizes: ['9:16', '1:1'],
    defaultRatio: '9:16',
  },
  {
    id: 'news',
    name: 'News',
    nameMarathi: 'बातम्या व घडामोडी',
    group: 'special',
    allowedSizes: ['4:5', '9:16', '1:1'], // Portrait ON, Vertical ON, Square Optional
    defaultRatio: '4:5',
  },
  {
    id: 'govt-scheme',
    name: 'Government Scheme',
    nameMarathi: 'शासकीय योजना',
    group: 'special',
    allowedSizes: ['1:1', '4:5', '9:16'], // All ON
    defaultRatio: '1:1',
  },
];

// Read global size settings
export function getGlobalSizeSettings(): GlobalSizeSettings {
  try {
    const raw = localStorage.getItem(GLOBAL_SIZE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        square: parsed.square !== false,
        portrait: parsed.portrait !== false,
        vertical: parsed.vertical !== false,
      };
    }
  } catch (e) {
    console.warn('Failed to parse global size settings', e);
  }
  return { ...DEFAULT_GLOBAL_SIZE_SETTINGS };
}

// Save global size settings
export function saveGlobalSizeSettings(settings: GlobalSizeSettings): void {
  try {
    localStorage.setItem(GLOBAL_SIZE_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('growview:sizes-updated', { detail: settings }));
  } catch (e) {
    console.error('Failed to save global size settings', e);
  }
}

// Read Category Allowed Sizes Map
export function getCategorySizeSettingsMap(): Record<string, AspectRatio[]> {
  try {
    const raw = localStorage.getItem(CATEGORY_SIZE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load category size settings', e);
  }
  const defaults: Record<string, AspectRatio[]> = {};
  DEFAULT_CATEGORY_SIZE_RULES.forEach((rule) => {
    defaults[rule.id] = rule.allowedSizes;
    if (rule.subcategories) {
      rule.subcategories.forEach((sub) => {
        defaults[`${rule.id}:${sub.id}`] = sub.allowedSizes;
        defaults[sub.id] = sub.allowedSizes;
      });
    }
  });
  return defaults;
}

// Save Category Allowed Sizes Map
export function saveCategorySizeSettingsMap(map: Record<string, AspectRatio[]>): void {
  try {
    localStorage.setItem(CATEGORY_SIZE_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('growview:category-sizes-updated', { detail: map }));
  } catch (e) {
    console.error('Failed to save category size settings', e);
  }
}

// Get allowed sizes for a specific category ID or category name
export function getCategoryAllowedSizes(categoryIdOrName?: string): AspectRatio[] {
  if (!categoryIdOrName) return ['1:1', '4:5', '9:16'];
  const key = categoryIdOrName.toLowerCase().trim();
  const map = getCategorySizeSettingsMap();

  // Check direct key match
  if (map[key] && Array.isArray(map[key]) && map[key].length > 0) {
    return map[key];
  }

  // Predefined matching
  if (key.includes('wedding')) return ['9:16'];
  if (key.includes('story')) return ['9:16'];
  if (key.includes('status') && !key.includes('fest')) return ['9:16'];
  if (key.includes('reel')) return ['9:16', '4:5'];
  if (key.includes('feed')) return ['4:5', '1:1'];

  return ['1:1', '4:5', '9:16'];
}

/**
 * CORE PLATFORM LOGIC:
 * CATEGORY ALLOWED SIZES
 * ↓
 * TEMPLATE ALLOWED SIZES
 * ↓
 * USER AVAILABLE SIZES
 *
 * Only sizes allowed by BOTH the category and template should be returned.
 * Filtered by Global Admin enabled sizes.
 * If intersection is empty, falls back safely to first valid global size.
 */
export function getAllowedSizesForTemplate(
  categoryIdOrName: string | undefined,
  template?: { allowedSizes?: AspectRatio[]; aspectRatio?: AspectRatio } | null
): AspectRatio[] {
  // 1. Global size status
  const globalSettings = getGlobalSizeSettings();
  const globallyEnabled: AspectRatio[] = [];
  if (globalSettings.square) globallyEnabled.push('1:1');
  if (globalSettings.portrait) globallyEnabled.push('4:5');
  if (globalSettings.vertical) globallyEnabled.push('9:16');

  // If all disabled (admin edge case), enable at least square
  if (globallyEnabled.length === 0) globallyEnabled.push('1:1');

  // 2. Category Allowed Sizes
  const categoryAllowed = getCategoryAllowedSizes(categoryIdOrName);

  // 3. Template Allowed Sizes
  let templateAllowed: AspectRatio[];
  if (template?.allowedSizes && Array.isArray(template.allowedSizes) && template.allowedSizes.length > 0) {
    templateAllowed = template.allowedSizes;
  } else if (template?.aspectRatio) {
    // If only single aspect ratio is stored, template allows at least that one, plus matching category sizes
    templateAllowed = ['1:1', '4:5', '9:16'];
  } else {
    templateAllowed = ['1:1', '4:5', '9:16'];
  }

  // 4. Strict Intersection
  const intersection = categoryAllowed.filter(
    (ratio) => templateAllowed.includes(ratio) && globallyEnabled.includes(ratio)
  );

  if (intersection.length > 0) {
    return intersection;
  }

  // Fallback safe: filter template or category by globally enabled
  const catGlobal = categoryAllowed.filter((r) => globallyEnabled.includes(r));
  if (catGlobal.length > 0) return catGlobal;

  const tplGlobal = templateAllowed.filter((r) => globallyEnabled.includes(r));
  if (tplGlobal.length > 0) return tplGlobal;

  return [globallyEnabled[0]];
}

// Video Size Settings
export function getVideoCategorySizeSettings(): Record<string, AspectRatio[]> {
  try {
    const raw = localStorage.getItem(VIDEO_CATEGORY_SIZE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load video category size settings', e);
  }
  return {
    'wedding-video': ['9:16'],
    'business-video': ['1:1', '4:5', '9:16'],
    'festival-video': ['1:1', '4:5', '9:16'],
    'reel-video': ['9:16'],
    'status-video': ['9:16'],
    'all': ['1:1', '4:5', '9:16'],
  };
}

export function saveVideoCategorySizeSettings(map: Record<string, AspectRatio[]>): void {
  try {
    localStorage.setItem(VIDEO_CATEGORY_SIZE_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save video category sizes', e);
  }
}

// Festival Poster & Video Size Settings
export interface FestivalSizeConfig {
  posterSizes: AspectRatio[];
  videoSizes: AspectRatio[];
}

export function getFestivalSizeSettings(): Record<string, FestivalSizeConfig> {
  try {
    const raw = localStorage.getItem(FESTIVAL_SIZE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load festival size settings', e);
  }
  return {
    'default': {
      posterSizes: ['1:1', '4:5', '9:16'],
      videoSizes: ['1:1', '4:5', '9:16'],
    },
    'whatsapp-status': {
      posterSizes: ['9:16'],
      videoSizes: ['9:16'],
    },
  };
}

export function saveFestivalSizeSettings(settings: Record<string, FestivalSizeConfig>): void {
  try {
    localStorage.setItem(FESTIVAL_SIZE_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save festival size settings', e);
  }
}

// Utility: convert ratio string to human label
export function getAspectRatioLabel(ratio: AspectRatio): string {
  switch (ratio) {
    case '1:1':
      return 'Square (1:1 • 1080×1080)';
    case '4:5':
      return 'Portrait (4:5 • 1080×1350)';
    case '9:16':
      return 'Vertical (9:16 • 1080×1920)';
    default:
      return 'Square (1:1 • 1080×1080)';
  }
}

export function getAspectRatioSimpleName(ratio: AspectRatio): string {
  switch (ratio) {
    case '1:1':
      return 'Square';
    case '4:5':
      return 'Portrait';
    case '9:16':
      return 'Vertical';
    default:
      return 'Square';
  }
}

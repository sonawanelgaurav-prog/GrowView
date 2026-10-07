import { FrameArrangement, FrameId } from '../types';

export interface WebsiteRailConfig {
  id: string;
  title: string;
  titleMarathi: string;
  subtitle: string;
  badge: string;
  enabled: boolean;
  order: number;
  categoryFilter?: string;
  isSpecial?: boolean;
  isVideo?: boolean;
}

export interface WebsiteManualConfig {
  siteName: string;
  siteNameMarathi: string;
  tagline: string;
  taglineMarathi: string;
  logoUrl: string;
  supportPhone: string;
  supportWhatsapp: string;
  supportEmail: string;
  announcementBar: {
    enabled: boolean;
    text: string;
    bgColor: string;
    textColor: string;
    badgeText: string;
  };
  rails: WebsiteRailConfig[];
  defaultFrameId: FrameId;
  defaultFrameArrangement: FrameArrangement;
  defaultFrameFontSize: number;
  defaultFrameIsBold: boolean;
  defaultFrameBgColor: string;
  defaultFrameTextColor: string;
  updatedAt: string;
}

export const DEFAULT_WEBSITE_CONFIG: WebsiteManualConfig = {
  siteName: 'GrowView - Poster Maker',
  siteNameMarathi: 'ग्रोव्ह्यू - पोस्टर मेकर',
  tagline: 'Instant Festival & Business Branding Posters in 30 Seconds',
  taglineMarathi: 'गणेशोत्सव, सण आणि व्यवसायासाठी ३० सेकंदात उच्च दर्जाचे पोस्टर्स बनवा',
  logoUrl: '',
  supportPhone: '+91 98765 43210',
  supportWhatsapp: '+91 98765 43210',
  supportEmail: 'support@growview.in',
  announcementBar: {
    enabled: true,
    text: '🪔 गणेश चतुर्थी Special – ५०+ नवीन प्रीमियम डिझाईन्स उपलब्ध! आताच स्वतःचे ब्रँड नाव व फोटो लावून डाऊनलोड करा 🚩',
    bgColor: '#d97706',
    textColor: '#ffffff',
    badgeText: 'नवीन अपडेट',
  },
  rails: [
    {
      id: 'rail-ganesh',
      title: 'Ganesh Chaturthi Special',
      titleMarathi: '🪔 गणेश चतुर्थी Special – Premium Templates',
      subtitle: 'गणेशोत्सव, गणेश चतुर्थी, गणपती आगमन, स्थापना, आरती आणि शुभेच्छांसाठी आकर्षक Professional Poster Designs',
      badge: '५० डिझाईन्स • भाद्रपद स्पेशल',
      enabled: true,
      order: 1,
      categoryFilter: 'ganesh-chaturthi',
      isSpecial: true,
    },
    {
      id: 'rail-video',
      title: 'WhatsApp Animated & Video Status',
      titleMarathi: '🎬 व्हॉट्सॲप ॲनिमेटेड व व्हिडिओ स्टेटस (Video Reels)',
      subtitle: 'सण, उत्सव व बिझनेससाठी 15 सेकंदांचे मोशन व म्युझिक स्टेटस व्हिडिओ',
      badge: '15s HD Reels',
      enabled: true,
      order: 2,
      categoryFilter: 'video-posts',
      isVideo: true,
    },
    {
      id: 'rail-morning',
      title: 'Good Morning Quotes Library',
      titleMarathi: '🌅 शुभ सकाळ / Good Morning Special Library',
      subtitle: 'दररोज सकाळी प्रेरणादायी, सुविचार आणि सकारात्मक संदेश शेअर करण्यासाठी',
      badge: '५०+ डिझाईन्स',
      enabled: true,
      order: 3,
      categoryFilter: 'good-morning-quotes',
    },
    {
      id: 'rail-night',
      title: 'Good Night Quotes Library',
      titleMarathi: '🌙 शुभ रात्र / Good Night Peaceful Quotes',
      subtitle: 'रात्रीचे शांत, देखणे आणि स्नेहपूर्ण संदेश पाठवण्यासाठी',
      badge: '५०+ डिझाईन्स',
      enabled: true,
      order: 4,
      categoryFilter: 'good-night-quotes',
    },
    {
      id: 'rail-business',
      title: 'Trending Business & Daily Posts',
      titleMarathi: '💼 ट्रेंडिंग बिझनेस व दैनिक पोस्टर्स',
      subtitle: 'दुकान, कंपनी, उद्योग, सेवा व ऑफरसाठी ऑटोमॅटिक ब्रँडिंग पोस्टर्स',
      badge: 'दैनिक अपडेट्स',
      enabled: true,
      order: 5,
      categoryFilter: 'all',
    },
  ],
  defaultFrameId: 'footer-01',
  defaultFrameArrangement: 'bottom',
  defaultFrameFontSize: 13,
  defaultFrameIsBold: false,
  defaultFrameBgColor: '#0f172a',
  defaultFrameTextColor: '#ffffff',
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = 'growview_website_config';

export function loadWebsiteConfig(): WebsiteManualConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('design1123_website_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      const res: WebsiteManualConfig = {
        ...DEFAULT_WEBSITE_CONFIG,
        ...parsed,
        announcementBar: {
          ...DEFAULT_WEBSITE_CONFIG.announcementBar,
          ...(parsed.announcementBar || {}),
        },
        rails: parsed.rails && parsed.rails.length > 0 ? parsed.rails : DEFAULT_WEBSITE_CONFIG.rails,
      };
      if (!res.siteName || res.siteName.includes('GoPost') || res.siteName.includes('Brands.live') || res.siteName.includes('Design 1123')) {
        res.siteName = 'GrowView - Poster Maker';
      }
      if (!res.siteNameMarathi || res.siteNameMarathi.includes('गोपोस्ट')) {
        res.siteNameMarathi = 'ग्रोव्ह्यू - पोस्टर मेकर';
      }
      return res;
    }
  } catch (e) {
    console.warn('Error loading website manual config from localStorage:', e);
  }
  return DEFAULT_WEBSITE_CONFIG;
}

export function saveWebsiteConfig(config: WebsiteManualConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Error saving website manual config to localStorage:', e);
  }
}

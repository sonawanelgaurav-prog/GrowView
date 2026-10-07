import { FrameDefinition, FooterCategory } from '../types';

export interface FooterCategoryInfo {
  id: FooterCategory;
  name: string;
  nameMarathi: string;
  count: number;
  description: string;
}

export const FOOTER_CATEGORIES: FooterCategoryInfo[] = [
  {
    id: 'banner-portrait',
    name: 'Banner Pop-Out Cutout Photo Frames',
    nameMarathi: 'बॅनर डिझाईन पॉप-आउट फोटो फ्रेम्स',
    count: 8,
    description: 'Personal banner design with personal cutout photo extending above frame height, Marathi name, business, designation & mobile (with & without top logo).',
  },
  {
    id: 'standard',
    name: 'Standard Footer Frames',
    nameMarathi: 'स्टँडर्ड फुटर फ्रेम्स',
    count: 10,
    description: 'Clean horizontal footer layouts with crisp professional typography, no logo required.',
  },
  {
    id: 'right-logo',
    name: 'Right-Side Logo Frames',
    nameMarathi: 'उजव्या बाजूचा लोगो फ्रेम्स',
    count: 10,
    description: 'Dedicated right-side logo container with balanced left business information.',
  },
  {
    id: 'top-right-logo',
    name: 'Top-Right Floating Logo Frames',
    nameMarathi: 'टॉप-राइट फ्लोटिंग लोगो फ्रेम्स',
    count: 7,
    description: 'Floating brand identity at top-right with bottom 20% business information frame.',
  },
];

export const FOOTER_FRAMES: FrameDefinition[] = [
  // ==========================================
  // CATEGORY 1: 10 STANDARD FOOTER FRAMES (DIVERSE VIBRANT COLORS)
  // ==========================================
  {
    id: 'footer-01',
    frameNumber: 1,
    category: 'standard',
    name: 'Royal Blue Corporate',
    nameMarathi: 'रॉयल ब्लू कॉर्पोरेट',
    badge: 'Royal Blue',
    description: 'Rich royal blue background with bright cyan-blue accents and crisp white typography.',
    accent: '#38bdf8',
    backgroundColor: '#0f2b5c',
    secondaryColor: '#1e3a8a',
    textColor: '#ffffff',
    mutedTextColor: '#93c5fd',
    borderColor: '#2563eb',
    colorFamily: 'Royal Blue',
    isLightBg: false,
    layoutStyle: 'left-owner-right-phone',
  },
  {
    id: 'footer-02',
    frameNumber: 2,
    category: 'standard',
    name: 'Deep Navy Modern',
    nameMarathi: 'डीप नेव्ही मॉडर्न',
    badge: 'Deep Navy',
    description: 'Sophisticated deep navy background with emerald highlights and clean split layout.',
    accent: '#34d399',
    backgroundColor: '#0c192e',
    secondaryColor: '#1e293b',
    textColor: '#ffffff',
    mutedTextColor: '#cbd5e1',
    borderColor: '#334155',
    colorFamily: 'Deep Navy',
    isLightBg: false,
    layoutStyle: 'split-balanced',
  },
  {
    id: 'footer-03',
    frameNumber: 3,
    category: 'standard',
    name: 'Maroon Bold',
    nameMarathi: 'मरून बोल्ड',
    badge: 'Maroon',
    description: 'Deep festival maroon with vibrant coral-red accents and strong header bar.',
    accent: '#f87171',
    backgroundColor: '#450a0a',
    secondaryColor: '#7f1d1d',
    textColor: '#ffffff',
    mutedTextColor: '#fca5a5',
    borderColor: '#991b1b',
    colorFamily: 'Maroon',
    isLightBg: false,
    layoutStyle: 'top-bar-accent',
  },
  {
    id: 'footer-04',
    frameNumber: 4,
    category: 'standard',
    name: 'Burgundy & Gold Line',
    nameMarathi: 'बर्गंडी आणि गोल्ड',
    badge: 'Burgundy',
    description: 'Royal burgundy background framed by luxury gold separator lines and centered layout.',
    accent: '#fbbf24',
    backgroundColor: '#4a0404',
    secondaryColor: '#5c0632',
    textColor: '#ffffff',
    mutedTextColor: '#fde68a',
    borderColor: '#d97706',
    colorFamily: 'Burgundy',
    isLightBg: false,
    layoutStyle: 'elegant-lines',
  },
  {
    id: 'footer-05',
    frameNumber: 5,
    category: 'standard',
    name: 'Dark Green Accent',
    nameMarathi: 'डार्क ग्रीन ॲक्सेंट',
    badge: 'Dark Green',
    description: 'Deep forest green with bright mint-green vertical accent bar and contact pill.',
    accent: '#a7f3d0',
    backgroundColor: '#064e3b',
    secondaryColor: '#065f46',
    textColor: '#ffffff',
    mutedTextColor: '#6ee7b7',
    borderColor: '#059669',
    colorFamily: 'Dark Green',
    isLightBg: false,
    layoutStyle: 'left-vertical-accent',
  },
  {
    id: 'footer-06',
    frameNumber: 6,
    category: 'standard',
    name: 'Emerald Centered',
    nameMarathi: 'एमराल्ड सेंटर्ड',
    badge: 'Emerald',
    description: 'Lush emerald green background with symmetrical centered branding and glowing cyan accents.',
    accent: '#6ee7b7',
    backgroundColor: '#022c22',
    secondaryColor: '#064e3b',
    textColor: '#ffffff',
    mutedTextColor: '#a7f3d0',
    borderColor: '#10b981',
    colorFamily: 'Emerald',
    isLightBg: false,
    layoutStyle: 'centered-symmetric',
  },
  {
    id: 'footer-07',
    frameNumber: 7,
    category: 'standard',
    name: 'Royal Purple Business',
    nameMarathi: 'रॉयल पर्पल बिझनेस',
    badge: 'Purple',
    description: 'Vibrant royal purple background with lavender borders and compact business card structure.',
    accent: '#c084fc',
    backgroundColor: '#3b0764',
    secondaryColor: '#581c87',
    textColor: '#ffffff',
    mutedTextColor: '#e9d5ff',
    borderColor: '#9333ea',
    colorFamily: 'Purple',
    isLightBg: false,
    layoutStyle: 'business-card',
  },
  {
    id: 'footer-08',
    frameNumber: 8,
    category: 'standard',
    name: 'Warm Cream Premium',
    nameMarathi: 'वॉर्म क्रीम प्रीमियम',
    badge: 'Warm Cream',
    description: 'High-contrast warm cream background with rich dark brown text and luxury amber borders.',
    accent: '#d97706',
    backgroundColor: '#fef3c7',
    secondaryColor: '#fffbeb',
    textColor: '#451a03',
    mutedTextColor: '#78350f',
    borderColor: '#fde68a',
    colorFamily: 'Warm Cream',
    isLightBg: true,
    layoutStyle: 'double-border-luxury',
  },
  {
    id: 'footer-09',
    frameNumber: 9,
    category: 'standard',
    name: 'White / Light Clean',
    nameMarathi: 'व्हाईट / लाईट क्लीन',
    badge: 'White / Light',
    description: 'Pristine light canvas with deep slate-900 typography, sapphire badge, and dual clean dividers.',
    accent: '#2563eb',
    backgroundColor: '#ffffff',
    secondaryColor: '#f8fafc',
    textColor: '#0f172a',
    mutedTextColor: '#475569',
    borderColor: '#e2e8f0',
    colorFamily: 'White / Light',
    isLightBg: true,
    layoutStyle: 'double-divider-light',
  },
  {
    id: 'footer-10',
    frameNumber: 10,
    category: 'standard',
    name: 'Golden Dark Luxury',
    nameMarathi: 'गोल्डन डार्क लक्झरी',
    badge: 'Golden Dark',
    description: 'Deep onyx charcoal with warm 24K gold accents, ultra-fine typography, and maximum contrast.',
    accent: '#f59e0b',
    backgroundColor: '#1c1917',
    secondaryColor: '#292524',
    textColor: '#ffffff',
    mutedTextColor: '#fde68a',
    borderColor: '#d97706',
    colorFamily: 'Golden Dark',
    isLightBg: false,
    layoutStyle: 'minimal-modern',
  },

  // ==========================================
  // CATEGORY 2: 10 RIGHT-SIDE LOGO FOOTER FRAMES (DIVERSE STYLES)
  // ==========================================
  {
    id: 'footer-11',
    frameNumber: 11,
    category: 'right-logo',
    name: 'Violet Square Logo',
    nameMarathi: 'व्हायलेट स्क्वेअर लोगो',
    badge: 'Violet',
    description: 'Deep violet background with a dedicated right square logo container and left metadata rows.',
    accent: '#a855f7',
    backgroundColor: '#2e1065',
    secondaryColor: '#3b0764',
    textColor: '#ffffff',
    mutedTextColor: '#e9d5ff',
    borderColor: '#7e22ce',
    colorFamily: 'Violet',
    isLightBg: false,
    defaultLogoShape: 'square',
  },
  {
    id: 'footer-12',
    frameNumber: 12,
    category: 'right-logo',
    name: 'Deep Teal Circle Logo',
    nameMarathi: 'डीप टील सर्कल लोगो',
    badge: 'Teal',
    description: 'Rich ocean teal with circular logo emblem on the right and soft cyan-tinted text on the left.',
    accent: '#2dd4bf',
    backgroundColor: '#134e4a',
    secondaryColor: '#0f766e',
    textColor: '#ffffff',
    mutedTextColor: '#99f6e4',
    borderColor: '#0d9488',
    colorFamily: 'Teal',
    isLightBg: false,
    defaultLogoShape: 'circle',
  },
  {
    id: 'footer-13',
    frameNumber: 13,
    category: 'right-logo',
    name: 'Espresso Brown Rounded',
    nameMarathi: 'एस्प्रेसो ब्राऊन',
    badge: 'Brown',
    description: 'Warm espresso brown background with soft rounded logo box and glowing orange badge.',
    accent: '#fb923c',
    backgroundColor: '#451a03',
    secondaryColor: '#3b1d11',
    textColor: '#ffffff',
    mutedTextColor: '#fed7aa',
    borderColor: '#c2410c',
    colorFamily: 'Brown',
    isLightBg: false,
    defaultLogoShape: 'rounded',
  },
  {
    id: 'footer-14',
    frameNumber: 14,
    category: 'right-logo',
    name: 'Modern Slate Hexagon',
    nameMarathi: 'मॉडर्न स्लेट हेक्सागॉन',
    badge: 'Modern Slate',
    description: 'Contemporary slate gray with high-tech geometric hexagon logo container on right.',
    accent: '#38bdf8',
    backgroundColor: '#1e293b',
    secondaryColor: '#334155',
    textColor: '#ffffff',
    mutedTextColor: '#cbd5e1',
    borderColor: '#475569',
    colorFamily: 'Modern Slate',
    isLightBg: false,
    defaultLogoShape: 'hexagon',
  },
  {
    id: 'footer-15',
    frameNumber: 15,
    category: 'right-logo',
    name: 'Festival Orange Diagonal',
    nameMarathi: 'फेस्टिव्हल ऑरेंज डायगोनल',
    badge: 'Festival Orange',
    description: 'Vibrant festival burnt orange with dynamic diagonal accent cut behind the right logo.',
    accent: '#fdba74',
    backgroundColor: '#7c2d12',
    secondaryColor: '#9a3412',
    textColor: '#ffffff',
    mutedTextColor: '#ffedd5',
    borderColor: '#ea580c',
    colorFamily: 'Festival Orange',
    isLightBg: false,
    defaultLogoShape: 'rounded',
  },
  {
    id: 'footer-16',
    frameNumber: 16,
    category: 'right-logo',
    name: 'Crimson Red Floating',
    nameMarathi: 'क्रिम्सन रेड फ्लोटिंग',
    badge: 'Red',
    description: 'Rich royal red background with elevated floating circular logo and sharp contrast phone pill.',
    accent: '#fca5a5',
    backgroundColor: '#7f1d1d',
    secondaryColor: '#991b1b',
    textColor: '#ffffff',
    mutedTextColor: '#fee2e2',
    borderColor: '#dc2626',
    colorFamily: 'Red',
    isLightBg: false,
    defaultLogoShape: 'circle',
  },
  {
    id: 'footer-17',
    frameNumber: 17,
    category: 'right-logo',
    name: 'Amber Gold Shield Badge',
    nameMarathi: 'अंबर गोल्ड शिल्ड बॅज',
    badge: 'Amber Gold',
    description: 'Warm amber gold background with logo encased inside a luxury shield badge.',
    accent: '#fde047',
    backgroundColor: '#78350f',
    secondaryColor: '#92400e',
    textColor: '#ffffff',
    mutedTextColor: '#fef08a',
    borderColor: '#d97706',
    colorFamily: 'Amber Gold',
    isLightBg: false,
    defaultLogoShape: 'badge',
  },
  {
    id: 'footer-18',
    frameNumber: 18,
    category: 'right-logo',
    name: 'Indigo Night Cut-Corner',
    nameMarathi: 'इंडिगो नाईट कट-कॉर्नर',
    badge: 'Indigo Night',
    description: 'Midnight indigo background with modern graphic cut-corner polygon for the business logo.',
    accent: '#818cf8',
    backgroundColor: '#1e1b4b',
    secondaryColor: '#312e81',
    textColor: '#ffffff',
    mutedTextColor: '#c7d2fe',
    borderColor: '#4f46e5',
    colorFamily: 'Indigo Night',
    isLightBg: false,
    defaultLogoShape: 'cut-corner',
  },
  {
    id: 'footer-19',
    frameNumber: 19,
    category: 'right-logo',
    name: 'Rose Wine Freeform',
    nameMarathi: 'रोझ वाईन फ्रीफॉर्म',
    badge: 'Rose Wine',
    description: 'Deep rose wine background with organic artistic logo badge and celebratory styling.',
    accent: '#f472b6',
    backgroundColor: '#4c0519',
    secondaryColor: '#831843',
    textColor: '#ffffff',
    mutedTextColor: '#fbcfe8',
    borderColor: '#db2777',
    colorFamily: 'Rose Wine',
    isLightBg: false,
    defaultLogoShape: 'freeform',
  },
  {
    id: 'footer-20',
    frameNumber: 20,
    category: 'right-logo',
    name: 'Royal Velvet & Gold',
    nameMarathi: 'रॉयल मखमली आणि सुवर्ण',
    badge: 'Royal Velvet & Gold',
    description: 'Deep charcoal velvet background with double gold circular emblem and bold typography.',
    accent: '#eab308',
    backgroundColor: '#18181b',
    secondaryColor: '#27272a',
    textColor: '#ffffff',
    mutedTextColor: '#fef08a',
    borderColor: '#ca8a04',
    colorFamily: 'Golden Dark',
    isLightBg: false,
    defaultLogoShape: 'circle',
  },

  // ==========================================
  // CATEGORY 3: 7 TOP-RIGHT FLOATING LOGO FRAMES
  // ==========================================
  {
    id: 'footer-21',
    frameNumber: 21,
    category: 'top-right-logo',
    name: 'Cyan Ocean Floating Circle',
    nameMarathi: 'सयान ओशन फ्लोटिंग सर्कल',
    badge: 'Cyan Ocean',
    description: 'Deep ocean cyan with floating circular logo at top-right and matching bottom information bar.',
    accent: '#22d3ee',
    backgroundColor: '#083344',
    secondaryColor: '#0e7490',
    textColor: '#ffffff',
    mutedTextColor: '#a5f3fc',
    borderColor: '#06b6d4',
    colorFamily: 'Cyan Ocean',
    isLightBg: false,
    defaultLogoShape: 'circle',
  },
  {
    id: 'footer-22',
    frameNumber: 22,
    category: 'top-right-logo',
    name: 'Sapphire Blue Floating Square',
    nameMarathi: 'सॅफायर ब्लू फ्लोटिंग स्क्वेअर',
    badge: 'Sapphire Blue',
    description: 'Rich sapphire blue with crisp floating square logo top-right and corporate bottom bar.',
    accent: '#60a5fa',
    backgroundColor: '#172554',
    secondaryColor: '#1e3a8a',
    textColor: '#ffffff',
    mutedTextColor: '#bfdbfe',
    borderColor: '#3b82f6',
    colorFamily: 'Royal Blue',
    isLightBg: false,
    defaultLogoShape: 'square',
  },
  {
    id: 'footer-23',
    frameNumber: 23,
    category: 'top-right-logo',
    name: 'Forest Moss Floating Rounded',
    nameMarathi: 'फॉरेस्ट मॉस फ्लोटिंग राऊंडेड',
    badge: 'Forest Moss',
    description: 'Deep pine forest moss with floating rounded-square logo and clean contact frame.',
    accent: '#4ade80',
    backgroundColor: '#14532d',
    secondaryColor: '#15803d',
    textColor: '#ffffff',
    mutedTextColor: '#bbf7d0',
    borderColor: '#16a34a',
    colorFamily: 'Dark Green',
    isLightBg: false,
    defaultLogoShape: 'rounded',
  },
  {
    id: 'footer-24',
    frameNumber: 24,
    category: 'top-right-logo',
    name: 'Luxury Onyx & Gold Floating Badge',
    nameMarathi: 'लक्झरी ऑनिक्स आणि गोल्ड बॅज',
    badge: 'Golden Dark',
    description: 'Onyx dark styling with top-right luxury gold badge container connecting to bottom footer.',
    accent: '#fbbf24',
    backgroundColor: '#09090b',
    secondaryColor: '#18181b',
    textColor: '#ffffff',
    mutedTextColor: '#fde68a',
    borderColor: '#d97706',
    colorFamily: 'Golden Dark',
    isLightBg: false,
    defaultLogoShape: 'badge',
  },
  {
    id: 'footer-25',
    frameNumber: 25,
    category: 'top-right-logo',
    name: 'Sunset Plum Floating Freeform',
    nameMarathi: 'सनसेट प्लम फ्लोटिंग फ्रीफॉर्म',
    badge: 'Sunset Plum',
    description: 'Deep plum twilight with creative organic logo emblem at top-right and vivid pink accents.',
    accent: '#f472b6',
    backgroundColor: '#4a044e',
    secondaryColor: '#701a75',
    textColor: '#ffffff',
    mutedTextColor: '#fbcfe8',
    borderColor: '#c026d3',
    colorFamily: 'Purple',
    isLightBg: false,
    defaultLogoShape: 'freeform',
  },
  {
    id: 'footer-26',
    frameNumber: 26,
    category: 'top-right-logo',
    name: 'Titanium Bronze Floating Hexagon',
    nameMarathi: 'टायटॅनियम ब्राँझ फ्लोटिंग',
    badge: 'Modern Slate',
    description: 'Titanium stone and bronze with geometric hexagon logo at top-right and sleek metadata footer.',
    accent: '#cbd5e1',
    backgroundColor: '#292524',
    secondaryColor: '#44403c',
    textColor: '#ffffff',
    mutedTextColor: '#e2e8f0',
    borderColor: '#78716c',
    colorFamily: 'Modern Slate',
    isLightBg: false,
    defaultLogoShape: 'hexagon',
  },
  {
    id: 'footer-27',
    frameNumber: 27,
    category: 'top-right-logo',
    name: 'Gradient Premium Royal Indigo',
    nameMarathi: 'ग्रॅडिएंट प्रीमियम रॉयल इंडिगो',
    badge: 'Gradient Premium',
    description: 'Gradient royal indigo backdrop with double gold top-right circle and high-end typography.',
    accent: '#fde047',
    backgroundColor: '#1e1b4b',
    secondaryColor: '#312e81',
    textColor: '#ffffff',
    mutedTextColor: '#fef08a',
    borderColor: '#ca8a04',
    colorFamily: 'Gradient Premium',
    isLightBg: false,
    defaultLogoShape: 'circle',
  },

  // ==========================================
  // CATEGORY 4: 8 BANNER PORTRAIT POP-OUT PHOTO FRAMES
  // (Marathi Name, Business, Designation, Mobile - With & Without Top Logo)
  // ==========================================
  {
    id: 'footer-28',
    frameNumber: 28,
    category: 'banner-portrait',
    name: 'Saffron Maratha Royal Pop-out (With Logo)',
    nameMarathi: 'छत्रपती प्रेरणा भगवा बॅनर (लोगो सहीत)',
    badge: 'Saffron Royal',
    description: 'Left pop-out portrait cutout extending above frame height, rich saffron slant bar, gold badge, and top-right logo.',
    accent: '#f59e0b',
    backgroundColor: '#7c2d12',
    secondaryColor: '#ea580c',
    textColor: '#ffffff',
    mutedTextColor: '#fed7aa',
    borderColor: '#f59e0b',
    colorFamily: 'Saffron Royal',
    isLightBg: false,
    hasTopLogo: true,
    hasLeaderPhoto: true,
    leaderPhotoPosition: 'left',
    isActive: true,
  },
  {
    id: 'footer-29',
    frameNumber: 29,
    category: 'banner-portrait',
    name: 'Royal Blue Executive Pop-out (No Logo)',
    nameMarathi: 'रॉयल ब्लू बिझनेस बॅनर (विना लोगो)',
    badge: 'Royal Blue',
    description: 'Left pop-out portrait cutout, deep royal blue & cyan gradient slant bar, bold Marathi name, designation pill & mobile.',
    accent: '#38bdf8',
    backgroundColor: '#0f2b5c',
    secondaryColor: '#1e3a8a',
    textColor: '#ffffff',
    mutedTextColor: '#93c5fd',
    borderColor: '#2563eb',
    colorFamily: 'Royal Blue',
    isLightBg: false,
    hasTopLogo: false,
    hasLeaderPhoto: true,
    leaderPhotoPosition: 'left',
    isActive: true,
  },
  {
    id: 'footer-30',
    frameNumber: 30,
    category: 'banner-portrait',
    name: 'Gold Rajmudra Onyx Pop-out (With Logo)',
    nameMarathi: 'सुवर्ण राजमुद्रा ऑनिक्स बॅनर (लोगो सहीत)',
    badge: 'Golden Onyx',
    description: 'Right pop-out portrait cutout, jet black onyx with double 24K gold border, gold Marathi typography, and top-right logo.',
    accent: '#fbbf24',
    backgroundColor: '#18181b',
    secondaryColor: '#27272a',
    textColor: '#fef08a',
    mutedTextColor: '#e4e4e7',
    borderColor: '#ca8a04',
    colorFamily: 'Golden Dark',
    isLightBg: false,
    hasTopLogo: true,
    hasLeaderPhoto: true,
    leaderPhotoPosition: 'right',
    isActive: true,
  },
  {
    id: 'footer-31',
    frameNumber: 31,
    category: 'banner-portrait',
    name: 'Emerald Prestige Pop-out (No Logo)',
    nameMarathi: 'एमराल्ड ग्रीन प्रतिष्ठा बॅनर (विना लोगो)',
    badge: 'Emerald Green',
    description: 'Left pop-out portrait cutout, lush forest emerald backdrop, glowing mint green designation badge, and clean mobile pill.',
    accent: '#34d399',
    backgroundColor: '#064e3b',
    secondaryColor: '#022c22',
    textColor: '#ffffff',
    mutedTextColor: '#a7f3d0',
    borderColor: '#10b981',
    colorFamily: 'Emerald',
    isLightBg: false,
    hasTopLogo: false,
    hasLeaderPhoto: true,
    leaderPhotoPosition: 'left',
    isActive: true,
  },
  {
    id: 'footer-32',
    frameNumber: 32,
    category: 'banner-portrait',
    name: 'Deep Navy Modern Leader (With Logo)',
    nameMarathi: 'डीप नेव्ही मॉडर्न लीडर बॅनर (लोगो सहीत)',
    badge: 'Deep Navy',
    description: 'Right pop-out portrait cutout, midnight navy with warm amber accent ribbons, Marathi name, business, designation & top logo.',
    accent: '#f59e0b',
    backgroundColor: '#0c192e',
    secondaryColor: '#1e293b',
    textColor: '#ffffff',
    mutedTextColor: '#cbd5e1',
    borderColor: '#d97706',
    colorFamily: 'Deep Navy',
    isLightBg: false,
    hasTopLogo: true,
    hasLeaderPhoto: true,
    leaderPhotoPosition: 'right',
    isActive: true,
  },
  {
    id: 'footer-33',
    frameNumber: 33,
    category: 'banner-portrait',
    name: 'Maroon Festival Classic Pop-out (No Logo)',
    nameMarathi: 'मरून उत्सव क्लासिक बॅनर (विना लोगो)',
    badge: 'Festive Maroon',
    description: 'Left pop-out portrait cutout, traditional festival rich maroon, gold filigree separators, Marathi name, designation & phone.',
    accent: '#f87171',
    backgroundColor: '#450a0a',
    secondaryColor: '#7f1d1d',
    textColor: '#ffffff',
    mutedTextColor: '#fca5a5',
    borderColor: '#b91c1c',
    colorFamily: 'Maroon',
    isLightBg: false,
    hasTopLogo: false,
    hasLeaderPhoto: true,
    leaderPhotoPosition: 'left',
    isActive: true,
  },
  {
    id: 'footer-34',
    frameNumber: 34,
    category: 'banner-portrait',
    name: 'Violet Dynamic VIP Pop-out (With Logo)',
    nameMarathi: 'व्हायलेट डायनॅमिक व्हीआयपी बॅनर (लोगो सहीत)',
    badge: 'Royal Violet',
    description: 'Right pop-out portrait cutout, royal purple backdrop with neon violet geometry, clean business metadata & top-right logo.',
    accent: '#c084fc',
    backgroundColor: '#3b0764',
    secondaryColor: '#581c87',
    textColor: '#ffffff',
    mutedTextColor: '#e9d5ff',
    borderColor: '#9333ea',
    colorFamily: 'Purple',
    isLightBg: false,
    hasTopLogo: true,
    hasLeaderPhoto: true,
    leaderPhotoPosition: 'right',
    isActive: true,
  },
  {
    id: 'footer-35',
    frameNumber: 35,
    category: 'banner-portrait',
    name: 'Silver White Clean Pop-out (No Logo)',
    nameMarathi: 'सिल्व्हर व्हाईट क्लीन बॅनर (विना लोगो)',
    badge: 'White / Silver',
    description: 'Left pop-out portrait cutout, high-contrast pristine white canvas, sapphire blue badge, deep navy Marathi typography & mobile.',
    accent: '#2563eb',
    backgroundColor: '#ffffff',
    secondaryColor: '#f8fafc',
    textColor: '#0f172a',
    mutedTextColor: '#475569',
    borderColor: '#cbd5e1',
    colorFamily: 'White / Light',
    isLightBg: true,
    hasTopLogo: false,
    hasLeaderPhoto: true,
    leaderPhotoPosition: 'left',
    isActive: true,
  },
];

// Master Admin Customization Persistence Helpers
const OVERRIDES_STORAGE_KEY = 'growview_frame_overrides';
const DISABLED_FRAMES_STORAGE_KEY = 'growview_disabled_frame_ids';

export interface FrameColorOverride {
  backgroundColor?: string;
  secondaryColor?: string;
  accent?: string;
  textColor?: string;
  borderColor?: string;
}

export function getStoredFrameOverrides(): Record<string, FrameColorOverride> {
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveFrameOverride(frameId: string, override: FrameColorOverride) {
  try {
    const current = getStoredFrameOverrides();
    current[frameId] = { ...current[frameId], ...override };
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save frame override:', err);
  }
}

export function getDisabledFrameIds(): string[] {
  try {
    const raw = localStorage.getItem(DISABLED_FRAMES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFrameActive(frameId: string, isActive?: boolean): string[] {
  try {
    const disabled = getDisabledFrameIds();
    const currentlyDisabled = disabled.includes(frameId);
    const shouldBeActive = isActive !== undefined ? isActive : currentlyDisabled;
    let updated: string[];
    if (shouldBeActive) {
      updated = disabled.filter((id) => id !== frameId);
    } else {
      updated = Array.from(new Set([...disabled, frameId]));
    }
    localStorage.setItem(DISABLED_FRAMES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to toggle frame active status:', err);
    return getDisabledFrameIds();
  }
}

export function resetFrameCustomizations(frameId?: string) {
  try {
    if (frameId) {
      const overrides = getStoredFrameOverrides();
      delete overrides[frameId];
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
      const disabled = getDisabledFrameIds().filter((id) => id !== frameId);
      localStorage.setItem(DISABLED_FRAMES_STORAGE_KEY, JSON.stringify(disabled));
    } else {
      localStorage.removeItem(OVERRIDES_STORAGE_KEY);
      localStorage.removeItem(DISABLED_FRAMES_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to reset frame customizations:', err);
  }
}

/**
 * Returns all frames merged with Admin color customizations and active state
 */
export function getActiveFrames(includeDisabled = false): FrameDefinition[] {
  const overrides = getStoredFrameOverrides();
  const disabledIds = new Set(getDisabledFrameIds());

  return FOOTER_FRAMES.map((frame) => {
    const override = overrides[frame.id] || {};
    const isDisabled = disabledIds.has(frame.id);
    return {
      ...frame,
      ...override,
      isActive: !isDisabled,
    };
  }).filter((frame) => includeDisabled || frame.isActive !== false);
}

// Re-export as FRAMES for backward compatibility
export const FRAMES = FOOTER_FRAMES;

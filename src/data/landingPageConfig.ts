import { LandingPageConfig } from '../types';

export const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  sections: [
    {
      key: 'hero',
      name: 'Hero Section',
      nameMarathi: 'हिरो विभाग (मुख्य शीर्षक)',
      isEnabled: true,
      order: 1,
    },
    {
      key: 'festivalCategories',
      name: 'Festival Categories',
      nameMarathi: 'सण व उत्सव कॅटेगरी',
      isEnabled: true,
      order: 2,
    },
    {
      key: 'popularTemplates',
      name: 'Popular Templates',
      nameMarathi: 'लोकप्रिय पोस्टर्स',
      isEnabled: true,
      order: 3,
    },
    {
      key: 'festivalSpecial',
      name: 'Festival Special Showcase',
      nameMarathi: 'खास सण उत्सव पोस्टर्स',
      isEnabled: true,
      order: 4,
    },
    {
      key: 'businessTemplates',
      name: 'Business Poster Templates',
      nameMarathi: 'व्यवसाय व जाहिरात पोस्टर्स',
      isEnabled: true,
      order: 5,
    },
    {
      key: 'howItWorks',
      name: 'How It Works',
      nameMarathi: 'वापर कसा करावा (३ सोप्या पायऱ्या)',
      isEnabled: true,
      order: 6,
    },
    {
      key: 'features',
      name: 'Features & Capabilities',
      nameMarathi: 'महत्त्वाची वैशिष्ट्ये',
      isEnabled: true,
      order: 7,
    },
    {
      key: 'businessBranding',
      name: 'Business Branding & Frames',
      nameMarathi: 'बिझनेस ब्रँडिंग व फ्रेम्स',
      isEnabled: true,
      order: 8,
    },
    {
      key: 'supportedFormats',
      name: 'Supported Social Formats',
      nameMarathi: 'सोशल मीडिया फॉरमॅट्स (१:१, ९:१६, ४:५)',
      isEnabled: true,
      order: 9,
    },
    {
      key: 'testimonials',
      name: 'Testimonials & Reviews',
      nameMarathi: 'ग्राहकांचे अनुभव व प्रतिक्रिया',
      isEnabled: true,
      order: 10,
    },
    {
      key: 'faq',
      name: 'Frequently Asked Questions',
      nameMarathi: 'नेहमी विचारले जाणारे प्रश्न (FAQ)',
      isEnabled: true,
      order: 11,
    },
    {
      key: 'cta',
      name: 'Call To Action Banner',
      nameMarathi: 'सुरुवात करा (CTA बॅनर)',
      isEnabled: true,
      order: 12,
    },
    {
      key: 'footer',
      name: 'Footer & Support',
      nameMarathi: 'फुटर व संपर्क माहिती',
      isEnabled: true,
      order: 13,
    },
  ],
  content: {
    heroHeadline: 'Create Professional Festival & Business Posters in Minutes.',
    heroHeadlineMarathi: 'सण, उत्सव व व्यवसायाची आकर्षक पोस्टर्स बनवा काही मिनिटांत.',
    heroSubtitle:
      'Create festival greetings, business promotions and social media creatives with ready-made designs and your own business branding.',
    heroSubtitleMarathi:
      'आपल्या व्यवसायाचा लोगो, नाव, पत्ता व मोबाईल नंबरसह दर्जेदार मराठी, हिंदी व इंग्रजी पोस्टर्स तयार करा आणि थेट सोशल मीडियावर शेअर करा.',
    heroCtaPrimary: 'Create Your First Poster',
    heroCtaSecondary: 'Login / Sign Up',
    heroBadge: '✨ Trusted by 50,000+ Indian Businesses & Creators',

    categoriesTitle: 'Popular Festival & Daily Categories',
    categoriesSubtitle: 'Explore thousands of ready-made designs curated for every Indian festival and daily business need.',

    popularTemplatesTitle: 'Trending & Popular Templates',
    popularTemplatesSubtitle: 'Select any design and auto-apply your personalized business branding in one click.',

    festivalSpecialTitle: 'Grand Festival Special Collection',
    festivalSpecialSubtitle: 'Special festival series for Shivaji Maharaj Jayanti, Ganesh Chaturthi, Diwali, and more.',

    businessTemplatesTitle: 'Business Promotion Templates',
    businessTemplatesSubtitle: 'Tailored designs for Real Estate, Doctors, Retail, Coaching Classes, Restaurants, and Salons.',

    howItWorksTitle: 'How GrowView Works',
    howItWorksSubtitle: '3 simple steps to create professional social media posters for your brand.',

    featuresTitle: 'Why Choose GrowView?',
    featuresSubtitle: 'Everything you need to grow your local brand with automated daily creatives.',

    brandingTitle: 'Auto Business Branding',
    brandingSubtitle: 'Setup your business profile once. We auto-place your photo, company name, phone & logo onto 27+ vibrant custom frames.',

    formatsTitle: 'Perfect for Every Social Platform',
    formatsSubtitle: 'Export high-definition graphics for WhatsApp Status, Instagram Feeds, Facebook Posts, and Stories.',

    testimonialsTitle: 'Loved by Local Business Owners',
    testimonialsSubtitle: 'See how entrepreneurs across Maharashtra & India elevate their daily customer engagement.',

    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Have questions? Here are quick answers to help you get started.',

    ctaTitle: 'Ready to Boost Your Brand Presence?',
    ctaSubtitle: 'Join thousands of smart business owners creating daily festive & promotional posters.',
    ctaButtonText: 'Start Creating for Free',

    footerText: '© 2026 GrowView. All rights reserved. Made for Indian Businesses & Creators.',
    contactEmail: 'support@growview.in',
    contactPhone: '+91 77749 14906',
    supportWhatsApp: '+91 77749 14906',
  },
  assets: [
    {
      id: 'asset-hero-banner',
      name: 'Hero Showcase Mockup',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      section: 'hero',
      isVisible: true,
      order: 1,
      title: 'GrowView Poster Creator Studio',
      description: 'Main landing page hero graphic preview',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'asset-festival-banner',
      name: 'Shivaji Maharaj Festival Banner',
      url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1000&q=80',
      section: 'festivalSpecial',
      isVisible: true,
      order: 2,
      title: 'Shivjayanti Mega Special',
      description: 'Chhatrapati Shivaji Maharaj Jayanti Festival Feature',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'asset-business-banner',
      name: 'Business Category Banner',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80',
      section: 'businessTemplates',
      isVisible: true,
      order: 3,
      title: 'Business Marketing Pack',
      description: 'Real estate, health, and local store business ads',
      createdAt: new Date().toISOString(),
    },
  ],
  hiddenTemplateIds: [],
  hiddenCategoryIds: [],
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = 'growvies_landing_config';

export function loadLandingPageConfig(): LandingPageConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: LandingPageConfig = JSON.parse(saved);
      // Merge with default sections in case new sections were added
      const existingKeys = new Set(parsed.sections.map((s) => s.key));
      const missingSections = DEFAULT_LANDING_CONFIG.sections.filter(
        (s) => !existingKeys.has(s.key)
      );
      if (missingSections.length > 0) {
        parsed.sections = [...parsed.sections, ...missingSections];
      }
      if (parsed.content) {
        if (!parsed.content.contactPhone || parsed.content.contactPhone.includes('98765')) {
          parsed.content.contactPhone = '+91 77749 14906';
        }
        if (!parsed.content.supportWhatsApp || parsed.content.supportWhatsApp.includes('98765')) {
          parsed.content.supportWhatsApp = '+91 77749 14906';
        }
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Error loading landing config:', e);
  }
  return DEFAULT_LANDING_CONFIG;
}

export function saveLandingPageConfig(config: LandingPageConfig): void {
  try {
    const updated = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving landing config:', e);
  }
}

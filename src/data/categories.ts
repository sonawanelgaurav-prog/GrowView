import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: 'All Templates', group: 'special', icon: 'Sparkles', count: 48 },
  { id: 'upcoming', name: 'Upcoming Days & Events', group: 'special', icon: 'Calendar', count: 12 },
  
  // Festivals
  { id: 'shivaji-jayanti', name: 'Shivaji Maharaj Jayanti', nameHindi: 'शिवाजी महाराज जयंती', nameMarathi: 'शिवजयंती', group: 'festivals', icon: 'Crown', count: 12 },
  { id: 'shivratri', name: 'Maha Shivratri', nameHindi: 'महाशिवरात्रि', nameMarathi: 'महाशिवरात्री', group: 'festivals', icon: 'Moon', count: 10 },
  { id: 'holi', name: 'Holi & Dhulivandan', nameHindi: 'होली उत्सव', nameMarathi: 'होळी व रंगपंचमी', group: 'festivals', icon: 'Palette', count: 9 },
  { id: 'gudi-padwa', name: 'Gudi Padwa & New Year', nameHindi: 'गुड़ी पड़वा', nameMarathi: 'गुढीपाडवा', group: 'festivals', icon: 'Flag', count: 8 },
  { id: 'ram-navami', name: 'Shree Ram Navami', nameHindi: 'राम नवमी', nameMarathi: 'रामनवमी', group: 'festivals', icon: 'Sun', count: 7 },
  { id: 'ambedkar-jayanti', name: 'Dr. B.R. Ambedkar Jayanti', nameHindi: 'आंबेडकर जयंती', nameMarathi: 'भीमजयंती', group: 'festivals', icon: 'Award', count: 6 },
  { 
    id: 'ganesh-chaturthi', 
    name: '🪔 गणेश चतुर्थी Special', 
    nameHindi: 'गणेश चतुर्थी Special', 
    nameMarathi: '🪔 गणेश चतुर्थी Special',
    sectionLabel: 'गणेश चतुर्थी Special – Premium Templates',
    description: 'गणेशोत्सव, गणेश चतुर्थी, गणपती आगमन, स्थापना, आरती आणि शुभेच्छांसाठी आकर्षक Professional Poster Designs',
    group: 'festivals', 
    icon: 'Sun', 
    count: 50 
  },
  { id: 'diwali', name: 'Diwali & Dhanteras', nameHindi: 'दीपावली', nameMarathi: 'दिवाळी', group: 'festivals', icon: 'Flame', count: 10 },
  { id: 'navratri', name: 'Navratri & Dussehra', nameHindi: 'नवरात्रि', nameMarathi: 'नवरात्रोत्सव', group: 'festivals', icon: 'Music', count: 6 },
  { id: 'janmashtami', name: 'Krishna Janmashtami', nameHindi: 'जन्माष्टमी', nameMarathi: 'दहीहंडी', group: 'festivals', icon: 'Feather', count: 5 },
  { id: 'independence-day', name: 'Independence & Republic Day', nameHindi: 'स्वतंत्रता दिवस', nameMarathi: 'स्वातंत्र्य दिन', group: 'festivals', icon: 'Flag', count: 6 },
  { id: 'raksha-bandhan', name: 'Raksha Bandhan', nameHindi: 'रक्षाबंधन', nameMarathi: 'रक्षाबंधन', group: 'festivals', icon: 'Heart', count: 5 },
  { id: 'eid', name: 'Eid Mubarak', nameHindi: 'ईद मुबारक', nameMarathi: 'ईद', group: 'festivals', icon: 'Star', count: 4 },
  { id: 'makar-sankranti', name: 'Makar Sankranti', nameHindi: 'मकर संक्रांति', nameMarathi: 'संक्रांत', group: 'festivals', icon: 'Send', count: 4 },

  // Video Posts & Animated
  { id: 'video-posts', name: 'WhatsApp Video Status', nameHindi: 'वीडियो स्टेटस', nameMarathi: 'व्हिडिओ स्टेटस', group: 'special', icon: 'Video', count: 14 },

  // Marriage, Engagement & Biodata Cards
  { id: 'wedding-invitation', name: 'Wedding Invitation Card', nameHindi: 'विवाह निमंत्रण पत्रिका', nameMarathi: 'लग्नपत्रिका (Wedding Card)', group: 'festivals', icon: 'Heart', count: 15 },
  { id: 'engagement-ceremony', name: 'Engagement Ceremony Card', nameHindi: 'सगाई निमंत्रण', nameMarathi: 'साखरपुडा (Sakharpuda)', group: 'festivals', icon: 'Gem', count: 12 },
  { id: 'biodata-resume', name: 'Biodata & Resume Maker', nameHindi: 'बायोडाटा व रिज्यूमे', nameMarathi: 'बायोडाटा / Resume (CV)', group: 'business', icon: 'FileText', count: 15 },

  // Business Banners
  { id: 'business-promo', name: 'Business Grand Offer', group: 'business', icon: 'BadgePercent', count: 8 },
  { id: 'real-estate', name: 'Real Estate & Properties', group: 'business', icon: 'Building2', count: 6 },
  { id: 'jewelry', name: 'Jewelry & Gold Mart', group: 'business', icon: 'Gem', count: 5 },
  { id: 'healthcare', name: 'Doctors & Hospital', group: 'business', icon: 'Activity', count: 6 },
  { id: 'education', name: 'Schools & Coaching Classes', group: 'business', icon: 'GraduationCap', count: 6 },
  { id: 'restaurant', name: 'Restaurant, Cafe & Bakery', group: 'business', icon: 'UtensilsCrossed', count: 6 },
  { id: 'salon-beauty', name: 'Salon, Spa & Makeup', group: 'business', icon: 'Scissors', count: 4 },
  { id: 'tech-digital', name: 'IT & Digital Marketing', group: 'business', icon: 'Laptop', count: 5 },
  { id: 'kisan-agro', name: 'Agriculture & Krushi Seva', group: 'business', icon: 'Wheat', count: 4 },

  // Daily & Social Quotes Library (100 Posters)
  { id: 'good-morning-quotes', name: 'Good Morning / शुभ सकाळ', nameHindi: 'शुभ प्रभात विचार', nameMarathi: 'शुभ सकाळ (५० डिझाईन्स)', group: 'daily', icon: 'Sunrise', count: 50 },
  { id: 'good-night-quotes', name: 'Good Night / शुभ रात्र', nameHindi: 'शुभ रात्रि संदेश', nameMarathi: 'शुभ रात्र (५० डिझाईन्स)', group: 'daily', icon: 'Moon', count: 50 },
  { id: 'suvichar-morning', name: 'Daily Suvichar & Thoughts', nameHindi: 'शुभ विचार', nameMarathi: 'दैनिक सुविचार', group: 'daily', icon: 'Sun', count: 8 },
  { id: 'quotes-motivation', name: 'Motivation & Success', nameHindi: 'प्रेरणादायी विचार', nameMarathi: 'यशस्वी विचार', group: 'daily', icon: 'Lightbulb', count: 6 },
  { id: 'birthday-wishes', name: 'Birthday & Anniversary', nameHindi: 'जन्मदिन बधाई', nameMarathi: 'वाढदिवस शुभेच्छा', group: 'daily', icon: 'Gift', count: 6 },
  { id: 'political-greetings', name: 'Leader & Political Posts', group: 'special', icon: 'Users', count: 5 }
];

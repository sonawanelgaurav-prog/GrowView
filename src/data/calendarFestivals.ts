import { PosterTemplate } from '../types';

/**
 * Calendar Festival Helper & Dynamic 8-Day Upcoming Festival Engine
 * Automatically calculates rolling calendar days:
 * - Exactly 1 day of yesterday (कालचा १ दिवस)
 * - Drops all older days before yesterday (अगोदरचे दिवस काढून टाकले जातात)
 * - Today (आज)
 * - Tomorrow (उद्या)
 * - Next upcoming 8 days (पुढील आठ दिवसांचे आगामी कॅलेंडर)
 * Auto-updates dynamically from real-world date (new Date()).
 */

export interface CalendarFestivalItem {
  id: string;
  name: string;
  nameMarathi: string;
  category: string;
  badge?: string;
  icon?: string;
  descriptionMarathi?: string;
  color?: string;
}

export interface DayCalendarEvent {
  dateStr: string; // 'YYYY-MM-DD' e.g. '2026-09-14'
  dayNumber: number; // 14
  monthNumber: number; // 9
  monthNameMarathi: string; // 'सप्टेंबर'
  monthShortMarathi: string; // 'सप्टें'
  year: number; // 2026
  weekdayNameMarathi: string; // 'सोमवार'
  weekdayShortMarathi: string; // 'सोम'
  isYesterday: boolean; // 1 past day (कालचा दिवस)
  isToday: boolean; // today (आजचा दिवस)
  isTomorrow: boolean; // tomorrow (उद्याचा दिवस)
  relativeLabel: string; // 'काल' | 'आज' | 'उद्या' | ''
  festivals: CalendarFestivalItem[];
  highlightGradient?: string;
  postersCount?: number;
}

// Known Maharashtra and Indian Festival calendar mapping (keyed by MM-DD or YYYY-MM-DD)
export const FESTIVAL_DATE_REGISTRY: Record<string, CalendarFestivalItem[]> = {
  // January
  '01-01': [{ id: 'new-year', name: 'New Year Day', nameMarathi: 'नवीन वर्षाभिनंदन', category: 'festivals', badge: 'नवीन वर्ष', icon: 'Sparkles', color: 'from-blue-600 to-indigo-600' }],
  '01-12': [{ id: 'jijau-vivekananda', name: 'Rajmata Jijau & Swami Vivekananda Jayanti', nameMarathi: 'राजमाता जिजाऊ व स्वामी विवेकानंद जयंती', category: 'political-greetings', badge: 'राष्ट्रीय युवा दिन', icon: 'Crown', color: 'from-amber-600 to-orange-600' }],
  '01-14': [{ id: 'makar-sankranti', name: 'Makar Sankranti', nameMarathi: 'मकर संक्रांती • तिळगुळ घ्या गोड गोड बोला', category: 'festivals', badge: 'संक्रांत सण', icon: 'Sun', color: 'from-amber-500 to-yellow-500' }],
  '01-23': [{ id: 'netaji-jayanti', name: 'Netaji Subhash Chandra Bose Jayanti', nameMarathi: 'नेताजी सुभाषचंद्र बोस जयंती', category: 'political-greetings', badge: 'पराक्रम दिवस', icon: 'Flame', color: 'from-red-600 to-orange-600' }],
  '01-26': [{ id: 'republic-day', name: 'Republic Day', nameMarathi: 'प्रजासत्ताक दिन', category: 'political-greetings', badge: 'राष्ट्रीय सण', icon: 'Crown', color: 'from-orange-500 via-white to-emerald-600' }],

  // February
  '02-19': [{ id: 'shivjayanti', name: 'Chhatrapati Shivaji Maharaj Jayanti', nameMarathi: 'छत्रपती शिवाजी महाराज जयंती (शिवजयंती)', category: 'political-greetings', badge: 'शिवजन्मोत्सव', icon: 'Crown', color: 'from-orange-600 to-red-600' }],
  '02-27': [{ id: 'marathi-diwas', name: 'Marathi Bhasha Gaurav Din', nameMarathi: 'मराठी भाषा गौरव दिन • कुसुमाग्रज जयंती', category: 'quotes-motivation', badge: 'मायबोली मराठी', icon: 'Sparkles', color: 'from-purple-600 to-indigo-600' }],

  // March
  '03-08': [
    { id: 'womens-day', name: "International Women's Day", nameMarathi: 'जागतिक महिला दिन', category: 'quotes-motivation', badge: 'स्त्री शक्ती', icon: 'Sparkles', color: 'from-pink-600 to-rose-600' },
    { id: 'mahashivratri-mar', name: 'Mahashivratri', nameMarathi: 'महाशिवरात्री • हर हर महादेव', category: 'festivals', badge: 'महाउत्सव', icon: 'Flame', color: 'from-indigo-600 to-blue-700' }
  ],
  '03-23': [{ id: 'shaheed-diwas', name: 'Shaheed Diwas', nameMarathi: 'शहीद दिन (भगतसिंग, सुखदेव, राजगुरू)', category: 'political-greetings', badge: 'बलिदान स्मरण', icon: 'Flame', color: 'from-red-600 to-amber-600' }],
  '03-24': [{ id: 'holika-dahan', name: 'Holika Dahan', nameMarathi: 'होलिका दहन • वाईट विचारांचे दहन', category: 'festivals', badge: 'होळी सण', icon: 'Flame', color: 'from-orange-600 to-red-600' }],
  '03-25': [{ id: 'dhulivandan-holi', name: 'Dhulivandan Rangpanchami', nameMarathi: 'धुलिवंदन • रंगपंचमी सण', category: 'festivals', badge: 'रंगांचा सण', icon: 'Sparkles', color: 'from-pink-500 via-amber-500 to-cyan-500' }],
  '03-30': [{ id: 'gudi-padwa', name: 'Gudi Padwa', nameMarathi: 'गुढीपाडवा • मराठी नववर्ष', category: 'festivals', badge: 'नववर्ष प्रारंभ', icon: 'Sun', color: 'from-amber-500 via-orange-600 to-red-600' }],

  // April
  '04-06': [{ id: 'ram-navami', name: 'Shri Ram Navami', nameMarathi: 'श्री राम नवमी', category: 'festivals', badge: 'प्रभू श्रीराम', icon: 'Sun', color: 'from-amber-500 to-orange-500' }],
  '04-11': [{ id: 'phule-jayanti', name: 'Mahatma Jyotirao Phule Jayanti', nameMarathi: 'क्रांतिसूर्य महात्मा जोतीराव फुले जयंती', category: 'political-greetings', badge: 'सत्यशोधक', icon: 'Crown', color: 'from-emerald-600 to-teal-600' }],
  '04-14': [{ id: 'ambedkar-jayanti', name: 'Dr. Babasaheb Ambedkar Jayanti', nameMarathi: 'भारतरत्न डॉ. बाबासाहेब आंबेडकर जयंती', category: 'political-greetings', badge: 'ज्ञानसूर्य', icon: 'Crown', color: 'from-blue-600 to-indigo-700' }],
  '04-18': [{ id: 'akshay-tritiya', name: 'Akshaya Tritiya', nameMarathi: 'अक्षय्य तृतीया • शुभ मुहूर्त', category: 'festivals', badge: 'सुवर्ण खरेदी', icon: 'Gift', color: 'from-yellow-500 to-amber-600' }],

  // May
  '05-01': [{ id: 'maharashtra-din', name: 'Maharashtra Din & Kamgar Din', nameMarathi: 'महाराष्ट्र दिन व कामगार दिन', category: 'political-greetings', badge: 'जय महाराष्ट्र', icon: 'Crown', color: 'from-orange-600 to-amber-600' }],
  '05-28': [{ id: 'savarkar-jayanti', name: 'Swatantryaveer Savarkar Jayanti', nameMarathi: 'स्वातंत्र्यवीर विनायक दामोदर सावरकर जयंती', category: 'political-greetings', badge: 'तेजस्वी विचारवंत', icon: 'Flame', color: 'from-amber-600 to-red-600' }],

  // June
  '06-06': [{ id: 'shivrajyabhishek', name: 'Shivrajyabhishek Din', nameMarathi: 'शिवराज्याभिषेक सोहळा दिन', category: 'political-greetings', badge: 'स्वराज्य दिन', icon: 'Crown', color: 'from-orange-600 to-amber-500' }],
  '06-21': [{ id: 'yoga-day', name: 'International Yoga Day', nameMarathi: 'आंतरराष्ट्रीय योग दिन', category: 'quotes-motivation', badge: 'आरोग्य संपदा', icon: 'Sun', color: 'from-emerald-600 to-teal-600' }],

  // July
  '07-02': [{ id: 'ashadhi-ekadashi', name: 'Ashadhi Ekadashi', nameMarathi: 'आषाढी एकादशी • विठू माऊली', category: 'festivals', badge: 'पंढरपूर वारी', icon: 'Crown', color: 'from-amber-600 to-orange-600' }],
  '07-21': [{ id: 'guru-purnima', name: 'Guru Purnima', nameMarathi: 'गुरुपौर्णिमा • गुरुस्मरण', category: 'festivals', badge: 'गुरुवंदना', icon: 'Sun', color: 'from-yellow-600 to-amber-600' }],

  // August
  '08-01': [{ id: 'tilak-sathe-diwas', name: 'Lokmanya Tilak & Annabhau Sathe Jayanti', nameMarathi: 'लोकमान्य टिळक पुण्यतिथी व साहित्यरत्न अण्णाभाऊ साठे जयंती', category: 'political-greetings', badge: 'युगपुरुष', icon: 'Crown', color: 'from-orange-600 to-red-600' }],
  '08-15': [{ id: 'independence-day', name: 'Independence Day', nameMarathi: 'स्वातंत्र्य दिन • १५ ऑगस्ट', category: 'political-greetings', badge: 'जय हिंद', icon: 'Crown', color: 'from-orange-500 via-white to-emerald-600' }],
  '08-19': [{ id: 'raksha-bandhan', name: 'Raksha Bandhan & Narali Purnima', nameMarathi: 'रक्षाबंधन व नारळी पौर्णिमा', category: 'festivals', badge: 'बहीण-भाऊ सण', icon: 'Gift', color: 'from-pink-600 to-rose-600' }],
  '08-26': [{ id: 'janmashtami-dahihandi', name: 'Shri Krishna Janmashtami & Dahi Handi', nameMarathi: 'श्रीकृष्ण जन्माष्टमी व गोपाळकाला दहीहंडी', category: 'festivals', badge: 'गोविंदा आला रे', icon: 'Sparkles', color: 'from-blue-600 via-amber-500 to-yellow-500' }],

  // September (Bhadrapada month)
  '09-05': [{ id: 'teachers-day', name: "Teachers' Day", nameMarathi: 'शिक्षक दिन • डॉ. सर्वपल्ली राधाकृष्णन जयंती', category: 'political-greetings', badge: 'गुरुगौरव', icon: 'Crown', color: 'from-blue-600 to-indigo-600' }],
  '09-12': [{ id: 'bail-pola', name: 'Bail Pola', nameMarathi: 'बैलपोळा • सर्जा-राजाचा सण', category: 'festivals', badge: 'कृषि सण', icon: 'Crown', color: 'from-amber-600 to-emerald-600' }],
  '09-13': [
    {
      id: 'hartalika-prep',
      name: 'Hartalika Teej Eve',
      nameMarathi: 'हरतालिका व्रत पूर्वतयारी',
      category: 'hartalika',
      badge: 'उद्या हरतालिका',
      icon: 'Sparkles',
      color: 'from-emerald-600 to-teal-500',
      descriptionMarathi: 'शिव-पार्वती अखंड सौभाग्य हरतालिका व्रत पूर्वतयारी',
    },
  ],
  '09-14': [
    {
      id: 'ganesh-chaturthi',
      name: 'Ganesh Chaturthi',
      nameMarathi: 'श्री गणेश चतुर्थी',
      category: 'ganesh-chaturthi',
      badge: 'महाउत्सव',
      icon: 'Sun',
      color: 'from-amber-500 via-orange-600 to-red-600',
      descriptionMarathi: 'गणपती बाप्पा मोरया! भाद्रपद शुक्ल चतुर्थी गणेश आगमन सोहळा',
    },
    {
      id: 'hartalika-teej',
      name: 'Hartalika Teej',
      nameMarathi: 'हरतालिका तृतीया व्रत',
      category: 'hartalika',
      badge: 'अखंड सौभाग्य व्रत',
      icon: 'Sparkles',
      color: 'from-pink-600 via-rose-500 to-amber-500',
      descriptionMarathi: 'शिव-पार्वती अखंड सौभाग्य व मनोभावे हरतालिका पूजन',
    },
  ],
  '09-15': [
    {
      id: 'rishi-panchami',
      name: 'Rishi Panchami',
      nameMarathi: 'ऋषी पंचमी व्रत',
      category: 'rishi-panchami',
      badge: 'सप्तर्षी पूजन',
      icon: 'Sparkles',
      color: 'from-amber-600 to-yellow-600',
      descriptionMarathi: 'सप्तर्षींचे स्मरण व पवित्र ऋषी पंचमी पूजन',
    },
    {
      id: 'engineers-day',
      name: "Engineer's Day",
      nameMarathi: 'अभियंता दिन (Engineer\'s Day)',
      category: 'political-greetings',
      badge: 'भारतरत्न एम. विश्वेश्वरय्या',
      icon: 'Crown',
      color: 'from-blue-600 to-indigo-600',
      descriptionMarathi: 'अभियांत्रिकी क्षेत्रातील नवकल्पना व योगदानाचा गौरव',
    },
  ],
  '09-16': [
    {
      id: 'gauri-aavahan',
      name: 'Gauri Aavahan',
      nameMarathi: 'ज्येष्ठा गौरी आवाहन',
      category: 'gauri-utsav',
      badge: 'माहेरवाशीण गौरी आगमन',
      icon: 'Crown',
      color: 'from-rose-600 to-pink-600',
      descriptionMarathi: 'महालक्ष्मी ज्येष्ठा व कनिष्ठा गौरी आगमन सोहळा',
    },
  ],
  '09-17': [
    {
      id: 'gauri-pujan',
      name: 'Gauri Pujan',
      nameMarathi: 'गौरी पूजन व महानैवेद्य',
      category: 'gauri-utsav',
      badge: 'गौरी जेवण',
      icon: 'Gift',
      color: 'from-yellow-600 to-amber-600',
      descriptionMarathi: 'गौरी पूजन व पारंपरिक १६ भाज्यांचा महानैवेद्य',
    },
    {
      id: 'vishwakarma-jayanti',
      name: 'Vishwakarma Jayanti',
      nameMarathi: 'विश्वकर्मा जयंती पूजन',
      category: 'festivals',
      badge: 'शिल्पकार व वास्तुकार',
      icon: 'Tag',
      color: 'from-orange-600 to-amber-600',
      descriptionMarathi: 'सृष्टीचे शिल्पकार भगवान विश्वकर्मा जयंती',
    },
  ],
  '09-18': [
    {
      id: 'gauri-visarjan',
      name: 'Gauri Visarjan',
      nameMarathi: 'गौरी विसर्जन',
      category: 'gauri-utsav',
      badge: 'गौरी निरोप',
      icon: 'Moon',
      color: 'from-slate-700 to-indigo-900',
      descriptionMarathi: 'लाडक्या गौरी मातेला भावपूर्ण निरोप',
    },
  ],
  '09-19': [
    {
      id: 'ganeshotsav-day-6',
      name: 'Ganeshotsav Special Day 6',
      nameMarathi: 'गणेशोत्सव विशेष • महाआरती',
      category: 'ganesh-chaturthi',
      badge: 'बाप्पाची सेवा',
      icon: 'Flame',
      color: 'from-amber-600 to-orange-600',
      descriptionMarathi: 'गणपती बाप्पा मोरया! आरती व मोदक नैवेद्य',
    },
  ],
  '09-20': [
    {
      id: 'ganeshotsav-day-7',
      name: 'Ganeshotsav Bhajan Sandhya',
      nameMarathi: 'गणेशोत्सव भजन संध्या',
      category: 'ganesh-chaturthi',
      badge: 'सांस्कृतिक उत्सव',
      icon: 'Sparkles',
      color: 'from-purple-600 to-pink-600',
      descriptionMarathi: 'सार्वजनिक गणेशोत्सव भजन, कीर्तन व सांस्कृतिक कार्यक्रम',
    },
  ],
  '09-21': [
    {
      id: 'ganeshotsav-day-8',
      name: 'Ganeshotsav Mahaprasad',
      nameMarathi: 'गणेशोत्सव महाप्रसाद',
      category: 'ganesh-chaturthi',
      badge: 'महाप्रसाद',
      icon: 'Gift',
      color: 'from-emerald-600 to-teal-600',
      descriptionMarathi: 'श्री गणेश महाप्रसाद व सेवा दिवस',
    },
  ],
  '09-22': [
    {
      id: 'parivartini-ekadashi',
      name: 'Parivartini Ekadashi',
      nameMarathi: 'परिवर्तिनी एकादशी व्रत',
      category: 'festivals',
      badge: 'पवित्र एकादशी',
      icon: 'Sun',
      color: 'from-amber-500 to-yellow-500',
      descriptionMarathi: 'भाद्रपद शुक्ल एकादशी - परिवर्तिनी / वामन एकादशी',
    },
  ],
  '09-23': [
    {
      id: 'anant-chaturdashi',
      name: 'Anant Chaturdashi',
      nameMarathi: 'अनंत चतुर्दशी व विसर्जन',
      category: 'ganesh-chaturthi',
      badge: 'बाप्पाला निरोप',
      icon: 'Sun',
      color: 'from-orange-600 to-red-600',
      descriptionMarathi: 'पुढच्या वर्षी लवकर या! अनंत चतुर्दशी गणेश विसर्जन सोहळा',
    },
  ],
  '09-24': [
    {
      id: 'pitrupaksha-start',
      name: 'Pitrupaksha Begins',
      nameMarathi: 'पितृपक्ष प्रारंभ • पौर्णिमा',
      category: 'festivals',
      badge: 'पितृ तर्पण',
      icon: 'Moon',
      color: 'from-slate-700 to-slate-900',
    },
  ],
  '09-25': [
    {
      id: 'antyodaya-diwas',
      name: 'Antyodaya Diwas',
      nameMarathi: 'पंडित दीनदयाळ उपाध्याय जयंती',
      category: 'political-greetings',
      badge: 'अंत्योदय दिन',
      icon: 'Crown',
      color: 'from-blue-600 to-indigo-600',
    },
  ],
  '09-26': [
    {
      id: 'environmental-health-day',
      name: 'Environmental Health Day',
      nameMarathi: 'जागतिक पर्यावरण आरोग्य दिन',
      category: 'quotes-motivation',
      badge: 'पर्यावरण रक्षण',
      icon: 'Sparkles',
      color: 'from-emerald-600 to-teal-600',
    },
  ],
  '09-27': [
    {
      id: 'world-tourism-day',
      name: 'World Tourism Day',
      nameMarathi: 'जागतिक पर्यटन दिन',
      category: 'quotes-motivation',
      badge: 'पर्यटन विशेष',
      icon: 'Sun',
      color: 'from-cyan-600 to-blue-600',
    },
  ],
  '09-28': [
    {
      id: 'bhagat-singh-jayanti',
      name: 'Shaheed Bhagat Singh Jayanti',
      nameMarathi: 'शहीद भगतसिंग जयंती',
      category: 'political-greetings',
      badge: 'क्रांतीसूर्य',
      icon: 'Flame',
      color: 'from-red-600 to-orange-600',
    },
  ],
  '09-29': [
    {
      id: 'world-heart-day',
      name: 'World Heart Day',
      nameMarathi: 'जागतिक हृदय दिन',
      category: 'business-promo',
      badge: 'आरोग्य जनजागृती',
      icon: 'Sparkles',
      color: 'from-rose-600 to-red-600',
    },
  ],
  '09-30': [
    {
      id: 'ashwin-prep',
      name: 'Navratri Preparation',
      nameMarathi: 'शारदीय नवरात्रोत्सव पूर्वतयारी',
      category: 'festivals',
      badge: 'उद्या घटस्थापना',
      icon: 'Sparkles',
      color: 'from-amber-600 to-rose-600',
    },
  ],
  '10-02': [
    {
      id: 'gandhi-shastri-jayanti',
      name: 'Mahatma Gandhi & Shastri Jayanti',
      nameMarathi: 'महात्मा गांधी व लाल बहादूर शास्त्री जयंती',
      category: 'political-greetings',
      badge: 'राष्ट्रीय सुट्टी',
      icon: 'Crown',
      color: 'from-emerald-700 to-amber-600',
    },
  ],
  '10-03': [
    {
      id: 'navratri-ghatsthapana',
      name: 'Navratri Ghatsthapana',
      nameMarathi: 'शारदीय नवरात्रोत्सव घटस्थापना (दिवस १)',
      category: 'navratri',
      badge: 'शैलपुत्री पूजन',
      icon: 'Sun',
      color: 'from-amber-500 via-rose-600 to-purple-600',
      descriptionMarathi: 'शारदीय नवरात्रोत्सव प्रारंभ • घटस्थापना व शैलपुत्री पूजन',
    },
  ],
  '10-04': [
    {
      id: 'navratri-day-2',
      name: 'Navratri Day 2 - Brahmacharini Pujan',
      nameMarathi: 'शारदीय नवरात्रोत्सव (दिवस २) • ब्रह्मचारिणी पूजन',
      category: 'navratri',
      badge: 'आजचा सण (DAY 2)',
      icon: 'Sparkles',
      color: 'from-pink-500 via-rose-600 to-amber-500',
      descriptionMarathi: 'तप व संयमाची अधिष्ठात्री देवी ब्रह्मचारिणी पूजन • नवरात्रौत्सव',
    },
  ],
  '10-05': [
    {
      id: 'navratri-day-3',
      name: 'Navratri Day 3 - Chandraghanta Pujan',
      nameMarathi: 'शारदीय नवरात्रोत्सव (दिवस ३) • चंद्रघंटा पूजन',
      category: 'navratri',
      badge: 'उद्याचा सण (DAY 3)',
      icon: 'Moon',
      color: 'from-amber-500 via-orange-600 to-red-600',
      descriptionMarathi: 'साहस आणि शौर्याचे प्रतीक देवी चंद्रघंटा पूजन',
    },
  ],
  '10-06': [
    {
      id: 'navratri-day-4',
      name: 'Navratri Day 4 - Kushmanda Pujan',
      nameMarathi: 'शारदीय नवरात्रोत्सव (दिवस ४) • कुष्मांडा पूजन',
      category: 'navratri',
      badge: 'येत्या ३ दिवसांत',
      icon: 'Sun',
      color: 'from-purple-600 via-pink-600 to-amber-500',
      descriptionMarathi: 'सृष्टी निर्माती देवी कुष्मांडा पूजन • सुख समृद्धी',
    },
  ],
  '10-07': [
    {
      id: 'navratri-day-5',
      name: 'Navratri Day 5 - Lalita Panchami Skandamata',
      nameMarathi: 'ललिता पंचमी • स्कंदमाता पूजन (दिवस ५)',
      category: 'navratri',
      badge: 'ललिता पंचमी',
      icon: 'Crown',
      color: 'from-emerald-600 via-teal-600 to-amber-500',
      descriptionMarathi: 'उपांग ललिता पंचमी व वात्सल्यमूर्ती देवी स्कंदमाता पूजन',
    },
  ],
  '10-08': [
    {
      id: 'navratri-day-6',
      name: 'Navratri Day 6 - Katyayani Pujan',
      nameMarathi: 'नवरात्रोत्सव षष्ठी • कात्यायनी पूजन (दिवस ६)',
      category: 'navratri',
      badge: 'कात्यायनी देवी',
      icon: 'Flame',
      color: 'from-orange-600 to-red-600',
      descriptionMarathi: 'शत्रू संहारक व फलदायी देवी कात्यायनी पूजन',
    },
  ],
  '10-09': [
    {
      id: 'navratri-day-7',
      name: 'Navratri Day 7 - Kalaratri Pujan & Saraswati Avahan',
      nameMarathi: 'कालरात्री पूजन • सरस्वती आवाहन (दिवस ७)',
      category: 'navratri',
      badge: 'सरस्वती आवाहन',
      icon: 'Sparkles',
      color: 'from-indigo-600 to-purple-700',
      descriptionMarathi: 'शारदीय नवरात्र सप्तमी • ज्ञानदायिनी देवी सरस्वती आवाहन',
    },
  ],
  '10-10': [
    {
      id: 'navratri-day-8',
      name: 'Navratri Day 8 - Mahagauri Pujan',
      nameMarathi: 'दुर्गाष्टमी पूर्वसंध्या • महागौरी पूजन (दिवस ८)',
      category: 'navratri',
      badge: 'महागौरी पूजन',
      icon: 'Crown',
      color: 'from-pink-600 via-purple-600 to-amber-500',
      descriptionMarathi: 'पवित्रता व शांततेची देवी महागौरी पूजन',
    },
  ],
  '10-11': [
    {
      id: 'durgashtami-navami',
      name: 'Durga Ashtami & Navami',
      nameMarathi: 'महाअष्टमी व महानवमी पूजन',
      category: 'festivals',
      badge: 'देवी उपासना',
      icon: 'Crown',
      color: 'from-pink-600 to-purple-600',
    },
  ],
  '10-12': [
    {
      id: 'dussehra-vijayadashami',
      name: 'Dussehra Vijayadashami',
      nameMarathi: 'विजयादशमी - दसरा',
      category: 'festivals',
      badge: 'सोनं लुटूया!',
      icon: 'Sun',
      color: 'from-amber-500 via-yellow-500 to-orange-600',
    },
  ],
  '10-17': [
    {
      id: 'kojagiri-purnima',
      name: 'Kojagiri Purnima',
      nameMarathi: 'कोजागरी पौर्णिमा',
      category: 'festivals',
      badge: 'मसाला दूध उत्सव',
      icon: 'Moon',
      color: 'from-indigo-600 to-purple-600',
    },
  ],
  '10-29': [
    {
      id: 'dhanteras',
      name: 'Dhanatrayodashi Dhanteras',
      nameMarathi: 'धनत्रयोदशी - धन्वंतरी जयंती',
      category: 'festivals',
      badge: 'दिवाळी प्रारंभ',
      icon: 'Sparkles',
      color: 'from-amber-500 to-yellow-500',
    },
  ],
  '10-31': [
    {
      id: 'narak-chaturdashi-laxmipujan',
      name: 'Laxmi Pujan & Narak Chaturdashi',
      nameMarathi: 'दिवाळी लक्ष्मीपूजन',
      category: 'festivals',
      badge: 'महादीपावली',
      icon: 'Sun',
      color: 'from-amber-500 via-rose-600 to-red-600',
    },
  ],
  '11-01': [
    {
      id: 'diwali-padwa',
      name: 'Diwali Padwa & Balipratipada',
      nameMarathi: 'दिवाळी पाडवा व बलिप्रतिपदा',
      category: 'festivals',
      badge: 'शुभ पाडवा',
      icon: 'Sparkles',
      color: 'from-rose-600 to-pink-600',
    },
  ],
  '11-02': [
    {
      id: 'bhai-dooj',
      name: 'Bhai Dooj Bhaubeej',
      nameMarathi: 'भाऊबीज (यमद्वितीया)',
      category: 'festivals',
      badge: 'भाऊ-बहीण प्रेम',
      icon: 'Gift',
      color: 'from-purple-600 to-indigo-600',
    },
  ],
};

const MARATHI_MONTHS = [
  'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
];

const MARATHI_MONTHS_SHORT = [
  'जाने', 'फेब्रु', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसें'
];

const MARATHI_WEEKDAYS = [
  'रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'
];

const MARATHI_WEEKDAYS_SHORT = [
  'रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'
];

/**
 * Intelligent Marathi day observance fallback for any arbitrary date
 */
function generateMarathiDayObservance(d: Date, month: number, dateNum: number, dayOfWeek: number): CalendarFestivalItem {
  const fullDateStr = `${d.getFullYear()}-${String(month + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;

  const weekdayObservances: Array<{ name: string; badge: string; icon: string; color: string }> = [
    { name: 'रविवार विशेष • सूर्य उपासना व कुटुंब स्नेह', badge: 'रविवार विशेष', icon: 'Sun', color: 'from-amber-600 to-orange-600' },
    { name: 'सोमवार विशेष • महादेव शिव उपासना व सुविचार', badge: 'शुभ सोमवार', icon: 'Sparkles', color: 'from-blue-600 to-indigo-600' },
    { name: 'मंगळवार विशेष • श्री गणेश व हनुमान कृपा', badge: 'मंगलवार', icon: 'Flame', color: 'from-red-600 to-orange-600' },
    { name: 'बुधवार विशेष • व्यवसाय वृद्धी व प्रेरणा', badge: 'व्यापार दिन', icon: 'Tag', color: 'from-emerald-600 to-teal-600' },
    { name: 'गुरुवार विशेष • श्री स्वामी समर्थ व दत्त कृपा', badge: 'गुरुवार विशेष', icon: 'Crown', color: 'from-yellow-600 to-amber-600' },
    { name: 'शुक्रवार विशेष • कुलदेवी व महालक्ष्मी कृपा', badge: 'महालक्ष्मी दिन', icon: 'Sparkles', color: 'from-pink-600 to-rose-600' },
    { name: 'शनिवार विशेष • मारुती व शनी उपासना', badge: 'शनिवार विशेष', icon: 'Flame', color: 'from-purple-600 to-indigo-600' },
  ];

  const obs = weekdayObservances[dayOfWeek] || weekdayObservances[0];

  return {
    id: `day-${fullDateStr}`,
    name: `${dateNum} ${MARATHI_MONTHS[month]} विशेष`,
    nameMarathi: obs.name,
    category: 'quotes-motivation',
    badge: obs.badge,
    icon: obs.icon,
    color: obs.color,
  };
}

/**
 * Generates the dynamic rolling upcoming festival calendar:
 * - Exactly 1 day of yesterday (offset -1, 'काल (YESTERDAY)')
 * - Removes any prior days before yesterday (older days like offset < -1 dropped)
 * - Today (offset 0, 'आज (TODAY)')
 * - Tomorrow (offset 1, 'उद्या (TOMORROW)')
 * - Next upcoming 8 days (offsets 1 to 8)
 * Auto-generated dynamically using current system time (new Date()).
 */
export const getNext8DaysEvents = (customStartDate?: Date): DayCalendarEvent[] => {
  // Use custom date if provided, or the real current date (e.g. 2026-09-14)
  const now = customStartDate ? new Date(customStartDate) : new Date();
  
  // Normalize to local midnight
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const days: DayCalendarEvent[] = [];

  // Offset -1: Yesterday (कालचा एक दिवस राहू द्यायचा)
  // Older dates before yesterday (offset -2, -3, ...) are excluded (काढून टाकले जातात)
  // Offset 0: Today (आज)
  // Offset 1: Tomorrow (उद्या)
  // Offsets 1 to 8: Upcoming 8 days (पुढील आठ दिवसांचा आगामी कॅलेंडर)
  for (let offset = -1; offset <= 8; offset++) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);

    const year = d.getFullYear();
    const month = d.getMonth(); // 0-11
    const dateNum = d.getDate();
    const dayOfWeek = d.getDay(); // 0-6

    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dateNum).padStart(2, '0');
    const dateKeyMMDD = `${mm}-${dd}`;
    const fullDateStr = `${year}-${mm}-${dd}`;

    const isYesterday = offset === -1;
    const isToday = offset === 0;
    const isTomorrow = offset === 1;

    let relativeLabel = '';
    if (isYesterday) {
      relativeLabel = 'काल (YESTERDAY)';
    } else if (isToday) {
      relativeLabel = 'आज (TODAY)';
    } else if (isTomorrow) {
      relativeLabel = 'उद्या (TOMORROW)';
    }

    // Get festivals for this date
    let festivals = FESTIVAL_DATE_REGISTRY[dateKeyMMDD] || FESTIVAL_DATE_REGISTRY[fullDateStr] || [];

    // Fallback if no specific festival is configured for this day
    if (festivals.length === 0) {
      festivals = [generateMarathiDayObservance(d, month, dateNum, dayOfWeek)];
    }

    days.push({
      dateStr: fullDateStr,
      dayNumber: dateNum,
      monthNumber: month + 1,
      monthNameMarathi: MARATHI_MONTHS[month],
      monthShortMarathi: MARATHI_MONTHS_SHORT[month],
      year,
      weekdayNameMarathi: MARATHI_WEEKDAYS[dayOfWeek],
      weekdayShortMarathi: MARATHI_WEEKDAYS_SHORT[dayOfWeek],
      isYesterday,
      isToday,
      isTomorrow,
      relativeLabel,
      festivals,
      highlightGradient:
        festivals.length > 1
          ? 'from-amber-500 via-rose-500 to-purple-600'
          : festivals[0]?.color || 'from-amber-500 to-orange-500',
    });
  }

  return days;
};

/**
 * Returns strictly the upcoming 3-day events (Today, Tomorrow, Day 2, Day 3)
 * Used to ensure only upcoming festivals in the next 3 days are featured on top.
 */
export const getUpcoming3DaysEvents = (customStartDate?: Date | string): DayCalendarEvent[] => {
  const allEvents = getNext8DaysEvents(customStartDate ? new Date(customStartDate) : undefined);
  // Filter for Today (offset 0), Tomorrow (offset 1), Day 2, and Day 3 (excluding yesterday offset -1)
  return allEvents.filter((d) => !d.isYesterday).slice(0, 4);
};

/**
 * Auto-generates exactly 10 distinct, production-ready festival posters
 * for any festival with unique visual themes, layouts, colors, and Marathi copy.
 */
export const generate10AutoFestivalPosters = (
  festival: CalendarFestivalItem,
  festivalDate: string
): PosterTemplate[] => {
  const fName = festival.nameMarathi || festival.name;
  const cleanId = festival.id.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  const themes = [
    {
      suffix: '01-royal-gold',
      titleNative: `${fName} • भव्य सुवर्ण महाआरती`,
      headline: `${fName}च्या हार्दिक मंगलमय शुभेच्छा!`,
      subtext: 'आपणास व आपल्या संपूर्ण परिवारास सुख, समाधान व भरभराट लाभो हीच प्रार्थना.',
      bgGradient: 'from-amber-600 via-yellow-600 to-amber-800',
      primaryColor: '#b45309',
      accentColor: '#fbbf24',
      textColor: '#ffffff',
      ornamentColor: '#fef08a',
      cardBg: '#78350f',
      motifType: 'ganesh-murti' as const,
    },
    {
      suffix: '02-modern-minimal',
      titleNative: `${fName} • मॉडर्न मिनिमल डिझाईन`,
      headline: `मंगलमय ${fName}`,
      subtext: 'सण उत्साहाचा, आनंदाचा व भरभराटीचा!',
      bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
      primaryColor: '#6366f1',
      accentColor: '#38bdf8',
      textColor: '#ffffff',
      ornamentColor: '#818cf8',
      cardBg: '#1e1b4b',
      motifType: 'diwali-diya' as const,
    },
    {
      suffix: '03-traditional-rangoli',
      titleNative: `${fName} • पारंपरिक तोरण व रांगोळी`,
      headline: `सस्नेह नमस्कार! ${fName} निमित्त मनःपूर्वक सदिच्छा`,
      subtext: 'घरोघरी आनंद आणि चैतन्याचे दीप उजळू देत!',
      bgGradient: 'from-rose-700 via-pink-700 to-rose-900',
      primaryColor: '#be123c',
      accentColor: '#fde047',
      textColor: '#ffffff',
      ornamentColor: '#fbcfe8',
      cardBg: '#881337',
      motifType: 'navratri-garba' as const,
    },
    {
      suffix: '04-morning-divine',
      titleNative: `${fName} • शुभ सकाळ व सण सदिच्छा`,
      headline: `सुप्रभात! ${fName}च्या अनंत शुभेच्छा`,
      subtext: 'नवीन दिवसाची सुरुवात सणाच्या पवित्र आशीर्वादाने होवो.',
      bgGradient: 'from-orange-500 via-amber-500 to-yellow-500',
      primaryColor: '#c2410c',
      accentColor: '#ffffff',
      textColor: '#431407',
      ornamentColor: '#fed7aa',
      cardBg: '#7c2d12',
      motifType: 'ganesh-murti' as const,
    },
    {
      suffix: '05-business-prosperity',
      titleNative: `${fName} • व्यापार वृद्धी व ग्राहक सदिच्छा`,
      headline: `आमच्या सर्व आदरणीय ग्राहकांना ${fName}च्या शुभेच्छा`,
      subtext: 'आपला विश्वास आणि आमची सेवा • प्रगतीचे नवे पर्व',
      bgGradient: 'from-emerald-800 via-teal-900 to-slate-900',
      primaryColor: '#059669',
      accentColor: '#34d399',
      textColor: '#ffffff',
      ornamentColor: '#6ee7b7',
      cardBg: '#064e3b',
      motifType: 'diwali-diya' as const,
    },
    {
      suffix: '06-marathi-heritage',
      titleNative: `${fName} • अस्सल महाराष्ट्रीयन वारसा`,
      headline: `उत्सव संस्कृतीचा, जागर महाराष्ट्राचा!`,
      subtext: `${fName}च्या सर्वांना मंगलमय शुभेच्छा!`,
      bgGradient: 'from-orange-600 via-red-600 to-amber-700',
      primaryColor: '#ea580c',
      accentColor: '#facc15',
      textColor: '#ffffff',
      ornamentColor: '#ffedd5',
      cardBg: '#9a3412',
      motifType: 'ganesh-murti' as const,
    },
    {
      suffix: '07-twilight-deepotsav',
      titleNative: `${fName} • दीपोत्सव व संध्या आरती`,
      headline: `दीप तेजोमय, सोहळा चैतन्याचा!`,
      subtext: `${fName} निमित्त आपल्या परिवारास सुख-समृद्धी लाभो!`,
      bgGradient: 'from-purple-900 via-indigo-900 to-slate-950',
      primaryColor: '#7c3aed',
      accentColor: '#fbbf24',
      textColor: '#ffffff',
      ornamentColor: '#c4b5fd',
      cardBg: '#4c1d95',
      motifType: 'diwali-diya' as const,
    },
    {
      suffix: '08-youth-mandal',
      titleNative: `${fName} • सार्वजनिक मंडळ व युवा शक्ती`,
      headline: `एकजूट आणि अखंड सेवा! ${fName} सोहळा`,
      subtext: 'सर्व भक्तगणांचे व नागरिकांचे हार्दिक स्वागत!',
      bgGradient: 'from-blue-700 via-cyan-800 to-slate-900',
      primaryColor: '#1d4ed8',
      accentColor: '#38bdf8',
      textColor: '#ffffff',
      ornamentColor: '#bfdbfe',
      cardBg: '#1e3a8a',
      motifType: 'ganesh-murti' as const,
    },
    {
      suffix: '09-family-harmony',
      titleNative: `${fName} • कौटुंबिक स्नेहभाव सोहळा`,
      headline: `नात्यांमधील गोडवा आणि सणाचा आनंद!`,
      subtext: `${fName}च्या पवित्र पर्वावर आपणा सर्वांना हार्दिक शुभेच्छा!`,
      bgGradient: 'from-pink-600 via-rose-600 to-amber-600',
      primaryColor: '#db2777',
      accentColor: '#fef08a',
      textColor: '#ffffff',
      ornamentColor: '#fbcfe8',
      cardBg: '#831843',
      motifType: 'diwali-diya' as const,
    },
    {
      suffix: '10-vip-grand',
      titleNative: `${fName} • ग्रँड VIP सेलिब्रेशन एडिशन`,
      headline: `|| ${fName} महामहोत्सव ||`,
      subtext: 'आरोग्य, ऐश्वर्य आणि कीर्ती वृद्धिंगत होवो हीच ईश्वरचरणी प्रार्थना.',
      bgGradient: 'from-amber-500 via-orange-600 to-red-700',
      primaryColor: '#d97706',
      accentColor: '#ffffff',
      textColor: '#ffffff',
      ornamentColor: '#fef3c7',
      cardBg: '#78350f',
      motifType: 'ganesh-murti' as const,
    },
  ];

  return themes.map((t, idx) => ({
    id: `auto-${cleanId}-${t.suffix}`,
    title: `${festival.name} - Design ${idx + 1}`,
    titleNative: t.titleNative,
    category: festival.category || 'festivals',
    subCategory: festival.id,
    dateBadge: festivalDate,
    festivalDate,
    festivalNames: [festival.nameMarathi || festival.name],
    isTrending: idx < 3,
    isToday: true,
    theme: {
      bgGradient: t.bgGradient,
      primaryColor: t.primaryColor,
      accentColor: t.accentColor,
      textColor: t.textColor,
      ornamentColor: t.ornamentColor,
      cardBg: t.cardBg,
    },
    defaultFrameId: 'frame-bottom-strip',
    aspectRatio: '1:1',
    headline: t.headline,
    subtext: t.subtext,
    quote: 'सण आणि संस्कृती, महाराष्ट्राची अभिमान गाथा!',
    quoteAuthor: 'ग्रोव्ह्यू फेस्टिव्हल सिरीज',
    motifType: t.motifType,
  }));
};

/**
 * Known Festival Date Windows (Start MM-DD to End MM-DD)
 */
export const FESTIVAL_DATE_WINDOWS: Record<string, { startMMDD: string; endMMDD: string; nameMarathi: string }> = {
  // January
  'new-year': { startMMDD: '01-01', endMMDD: '01-01', nameMarathi: 'नवीन वर्ष' },
  'makar-sankranti': { startMMDD: '01-14', endMMDD: '01-15', nameMarathi: 'मकर संक्रांती' },
  'republic-day': { startMMDD: '01-26', endMMDD: '01-26', nameMarathi: 'प्रजासत्ताक दिन' },

  // February
  'shivaji-jayanti': { startMMDD: '02-19', endMMDD: '02-19', nameMarathi: 'शिवजयंती' },
  'shivratri': { startMMDD: '02-26', endMMDD: '03-08', nameMarathi: 'महाशिवरात्री' },

  // March
  'holi': { startMMDD: '03-24', endMMDD: '03-26', nameMarathi: 'होळी व धुलिवंदन' },
  'gudi-padwa': { startMMDD: '03-30', endMMDD: '03-31', nameMarathi: 'गुढीपाडवा' },

  // April
  'ram-navami': { startMMDD: '04-06', endMMDD: '04-07', nameMarathi: 'श्री राम नवमी' },
  'ambedkar-jayanti': { startMMDD: '04-14', endMMDD: '04-14', nameMarathi: 'डॉ. बाबासाहेब आंबेडकर जयंती' },
  'akshay-tritiya': { startMMDD: '04-18', endMMDD: '04-19', nameMarathi: 'अक्षय्य तृतीया' },

  // May
  'maharashtra-din': { startMMDD: '05-01', endMMDD: '05-01', nameMarathi: 'महाराष्ट्र दिन' },

  // August
  'independence-day': { startMMDD: '08-15', endMMDD: '08-15', nameMarathi: 'स्वातंत्र्य दिन' },
  'raksha-bandhan': { startMMDD: '08-19', endMMDD: '08-19', nameMarathi: 'रक्षाबंधन' },
  'janmashtami': { startMMDD: '08-26', endMMDD: '08-27', nameMarathi: 'श्रीकृष्ण जन्माष्टमी' },

  // September
  'teachers-day': { startMMDD: '09-05', endMMDD: '09-05', nameMarathi: 'शिक्षक दिन' },
  'bail-pola': { startMMDD: '09-12', endMMDD: '09-12', nameMarathi: 'बैलपोळा' },
  'hartalika': { startMMDD: '09-13', endMMDD: '09-14', nameMarathi: 'हरतालिका तृतीया' },
  'ganesh-chaturthi': { startMMDD: '09-14', endMMDD: '09-23', nameMarathi: 'श्री गणेश चतुर्थी व गणेशोत्सव' },
  'gauri-utsav': { startMMDD: '09-16', endMMDD: '09-18', nameMarathi: 'गौरी आवाहन व पूजन' },

  // October & November
  'gandhi-jayanti': { startMMDD: '10-02', endMMDD: '10-02', nameMarathi: 'महात्मा गांधी जयंती' },
  'navratri': { startMMDD: '10-03', endMMDD: '10-12', nameMarathi: 'शारदीय नवरात्रोत्सव' },
  'dussehra': { startMMDD: '10-12', endMMDD: '10-12', nameMarathi: 'विजयादशमी दसरा' },
  'kojagiri': { startMMDD: '10-17', endMMDD: '10-17', nameMarathi: 'कोजागिरी पौर्णिमा' },
  'diwali': { startMMDD: '10-29', endMMDD: '11-03', nameMarathi: 'दीपावली व लक्ष्मीपूजन' },
};

/**
 * Resolves the annual festival date window for any given PosterTemplate
 */
export function getTemplateFestivalWindow(template: PosterTemplate): { startMMDD: string; endMMDD: string } | null {
  if (!template) return null;

  // 1. Explicit festivalDate on template (e.g. '2026-09-14' or '09-14')
  if (template.festivalDate) {
    const mmdd = template.festivalDate.length >= 5 ? template.festivalDate.slice(-5) : template.festivalDate;
    if (/^\d{2}-\d{2}$/.test(mmdd)) {
      // Check multi-day festivals
      if (template.category === 'ganesh-chaturthi' || template.tags?.includes('ganesh')) {
        return { startMMDD: '09-14', endMMDD: '09-23' };
      }
      if (template.category === 'navratri' || template.tags?.includes('navratri')) {
        return { startMMDD: '10-03', endMMDD: '10-12' };
      }
      if (template.category === 'diwali' || template.tags?.includes('diwali')) {
        return { startMMDD: '10-29', endMMDD: '11-03' };
      }
      return { startMMDD: mmdd, endMMDD: mmdd };
    }
  }

  // 2. Specific Template ID checks
  const id = (template.id || '').toLowerCase();
  const title = (template.title || '').toLowerCase();
  const titleNative = template.titleNative || '';
  const dateBadge = (template.dateBadge || '').toLowerCase();

  // 14 April Dr. Babasaheb Ambedkar Jayanti
  if (id.includes('ambedkar') || title.includes('ambedkar') || titleNative.includes('आंबेडकर') || dateBadge.includes('14 april') || (dateBadge.includes('14') && dateBadge.includes('एप्रिल')) || dateBadge.includes('जय भीम')) {
    return { startMMDD: '04-14', endMMDD: '04-14' };
  }

  // 1 May Maharashtra Din
  if (id.includes('maharashtra-din') || titleNative.includes('महाराष्ट्र दिन') || dateBadge.includes('1 may') || (dateBadge.includes('1') && dateBadge.includes('मे'))) {
    return { startMMDD: '05-01', endMMDD: '05-01' };
  }

  // Ram Navami
  if (id.includes('ram-navami') || title.includes('ram navami') || titleNative.includes('राम नवमी')) {
    return { startMMDD: '04-06', endMMDD: '04-07' };
  }

  // Gudi Padwa
  if (id.includes('gudi-padwa') || template.category === 'gudi-padwa' || title.includes('gudi padwa') || titleNative.includes('गुढीपाडवा')) {
    return { startMMDD: '03-30', endMMDD: '03-31' };
  }

  // Holi / Rangpanchami
  if (id.includes('holi') || template.category === 'holi' || title.includes('holi') || titleNative.includes('होळी') || titleNative.includes('धुलिवंदन') || titleNative.includes('रंगपंचमी') || ((dateBadge.includes('24') || dateBadge.includes('25')) && (dateBadge.includes('mar') || dateBadge.includes('मार्च')))) {
    return { startMMDD: '03-24', endMMDD: '03-26' };
  }

  // Shivaji Maharaj Jayanti
  if (id.includes('shivaji') || template.category === 'shivaji-jayanti' || title.includes('shivaji') || titleNative.includes('शिवजयंती') || dateBadge.includes('19 feb') || (dateBadge.includes('19') && dateBadge.includes('फेब्रु'))) {
    return { startMMDD: '02-19', endMMDD: '02-19' };
  }

  // Mahashivratri
  if (id.includes('shivratri') || template.category === 'shivratri' || title.includes('shivratri') || titleNative.includes('महाशिवरात्री') || dateBadge.includes('26 feb') || (dateBadge.includes('शिव') && (dateBadge.includes('feb') || dateBadge.includes('mar')))) {
    return { startMMDD: '02-26', endMMDD: '03-08' };
  }

  // Independence Day
  if (id.includes('independence') || template.category === 'independence-day' || title.includes('15 august') || titleNative.includes('स्वातंत्र्य दिन')) {
    return { startMMDD: '08-15', endMMDD: '08-15' };
  }

  // Raksha Bandhan
  if (id.includes('rakhi') || template.category === 'raksha-bandhan' || title.includes('raksha bandhan') || titleNative.includes('रक्षाबंधन')) {
    return { startMMDD: '08-19', endMMDD: '08-19' };
  }

  // Janmashtami
  if (id.includes('janmashtami') || template.category === 'janmashtami' || title.includes('janmashtami') || titleNative.includes('जन्माष्टमी')) {
    return { startMMDD: '08-26', endMMDD: '08-27' };
  }

  // Hartalika
  if (id.includes('hartalika') || template.category === 'hartalika' || title.includes('hartalika') || titleNative.includes('हरतालिका')) {
    return { startMMDD: '09-13', endMMDD: '09-14' };
  }

  // Ganesh Chaturthi
  if (id.includes('ganesh') || template.category === 'ganesh-chaturthi' || title.includes('ganesh') || titleNative.includes('गणेश')) {
    return { startMMDD: '09-14', endMMDD: '09-23' };
  }

  // Gauri Utsav
  if (id.includes('gauri') || template.category === 'gauri-utsav' || title.includes('gauri') || titleNative.includes('गौरी')) {
    return { startMMDD: '09-16', endMMDD: '09-18' };
  }

  // Navratri
  if (id.includes('navratri') || template.category === 'navratri' || title.includes('navratri') || titleNative.includes('नवरात्र') || titleNative.includes('गरबा')) {
    return { startMMDD: '10-03', endMMDD: '10-12' };
  }

  // Dussehra
  if (id.includes('dussehra') || title.includes('dussehra') || titleNative.includes('दसरा') || titleNative.includes('विजयादशमी')) {
    return { startMMDD: '10-12', endMMDD: '10-12' };
  }

  // Diwali
  if (id.includes('diwali') || template.category === 'diwali' || title.includes('diwali') || title.includes('deepavali') || titleNative.includes('दिवाळी') || titleNative.includes('लक्ष्मीपूजन') || titleNative.includes('धनत्रयोदशी')) {
    return { startMMDD: '10-29', endMMDD: '11-03' };
  }

  // Check category against registry
  if (FESTIVAL_DATE_WINDOWS[template.category]) {
    return FESTIVAL_DATE_WINDOWS[template.category];
  }

  return null;
}

/**
 * Checks if a festival template is within the active season window:
 * Rule (from user prompt):
 * - Visible up to 1 month (30 days) BEFORE the festival start date.
 * - Visible DURING the festival.
 * - Visible up to 2 days AFTER the festival end date.
 * - Beyond 2 days after the festival, customers no longer need it -> HIDDEN!
 * - Non-festival / evergreen templates (business, suvichar, good morning, birthday): always return true.
 */
export function isFestivalInSeason(template: PosterTemplate, refDate = new Date()): boolean {
  const window = getTemplateFestivalWindow(template);
  // If not an annual festival template (e.g. business branding, quotes, etc.), it's always in season for its category
  if (!window) return true;

  const currentYear = refDate.getFullYear();
  const currentMonth = refDate.getMonth(); // 0-11
  const currentDate = refDate.getDate();

  // Parse start and end month/day
  const [sMonthStr, sDayStr] = window.startMMDD.split('-');
  const [eMonthStr, eDayStr] = window.endMMDD.split('-');
  const sMonth = parseInt(sMonthStr, 10) - 1;
  const sDay = parseInt(sDayStr, 10);
  const eMonth = parseInt(eMonthStr, 10) - 1;
  const eDay = parseInt(eDayStr, 10);

  // Check in current year
  const festivalStart = new Date(currentYear, sMonth, sDay);
  const festivalEnd = new Date(currentYear, eMonth, eDay);

  // 30 days before start
  const windowStart = new Date(festivalStart);
  windowStart.setDate(windowStart.getDate() - 30);

  // 2 days after end
  const windowEnd = new Date(festivalEnd);
  windowEnd.setDate(windowEnd.getDate() + 2);

  // Normalize refDate to local midnight
  const target = new Date(currentYear, currentMonth, currentDate);

  if (target >= windowStart && target <= windowEnd) {
    return true;
  }

  // Handle year wraparound (e.g. late December looking at mid January Makar Sankranti, or early Jan looking back at late Dec)
  const prevYearEnd = new Date(windowEnd);
  prevYearEnd.setFullYear(currentYear - 1);
  const prevYearStart = new Date(windowStart);
  prevYearStart.setFullYear(currentYear - 1);
  if (target >= prevYearStart && target <= prevYearEnd) {
    return true;
  }

  const nextYearStart = new Date(windowStart);
  nextYearStart.setFullYear(currentYear + 1);
  const nextYearEnd = new Date(windowEnd);
  nextYearEnd.setFullYear(currentYear + 1);
  if (target >= nextYearStart && target <= nextYearEnd) {
    return true;
  }

  return false;
}

/**
 * Strict calendar date matcher for when a user clicks/searches a specific date:
 * Rule (from user prompt):
 * - On a specific date, ONLY posters for that exact day's festivals and special days should show!
 * - Never show Holi, Shivratri, Ganesh Chaturthi, Hartalika, or 14 April on October 4!
 */
export function isTemplateForSelectedCalendarDate(
  template: PosterTemplate,
  selectedDateStr: string,
  dayEvent?: DayCalendarEvent
): boolean {
  if (!selectedDateStr || !template) return false;

  // Extract MM-DD from date string (e.g. '2026-10-04' -> '10-04')
  const mmdd = selectedDateStr.length >= 5 ? selectedDateStr.slice(-5) : selectedDateStr;

  // 1. Check if template belongs to a known festival window FIRST
  const window = getTemplateFestivalWindow(template);
  if (window) {
    // If template belongs to an annual festival:
    // Does selected date's mmdd fall strictly within startMMDD and endMMDD?
    let fallsInWindow = false;
    if (window.startMMDD <= window.endMMDD) {
      fallsInWindow = mmdd >= window.startMMDD && mmdd <= window.endMMDD;
    } else {
      // Wraparound (e.g. Dec to Jan)
      fallsInWindow = mmdd >= window.startMMDD || mmdd <= window.endMMDD;
    }

    // IF IT DOES NOT FALL IN THE WINDOW, STRICTLY RETURN FALSE!
    // This strictly prevents 14 April Ambedkar Jayanti from showing on October 4,
    // and prevents Holi (March) or Ganesh Chaturthi (Sep) from showing on October 4!
    if (!fallsInWindow) {
      return false;
    }
    return true;
  }

  // 2. Direct festivalDate match
  if (template.festivalDate) {
    const tMMDD = template.festivalDate.length >= 5 ? template.festivalDate.slice(-5) : template.festivalDate;
    if (tMMDD === mmdd || template.festivalDate === selectedDateStr) return true;
    // If template explicitly set a festivalDate that differs from current date, do not match
    return false;
  }

  // 3. Check against dayEvent festivals (for registered day festivals)
  if (dayEvent && dayEvent.festivals.length > 0) {
    const hasMatchingFestival = dayEvent.festivals.some((f) => {
      if (f.category === 'all' || f.category === 'quotes-motivation') return false;
      if (template.category === f.category) return true;
      if (template.tags && template.tags.includes(f.category)) return true;
      if (Array.isArray(template.festivalNames) && template.festivalNames.some((fn) => fn.includes(f.nameMarathi) || f.nameMarathi.includes(fn))) return true;
      return false;
    });

    if (hasMatchingFestival) return true;
  }

  return false;
}

/**
 * Intelligent Date Search Detector:
 * Parses query for explicit date references in Marathi & English
 * e.g. "14 एप्रिल", "14 april", "4 ऑक्टोबर", "४ ऑक्टोबर", "14 सप्टेंबर", "24 मार्च", "19 फेब्रुवारी"
 * Returns normalized MMDD string (e.g. '10-04') or null if not a date query.
 */
export function detectDateFromSearchQuery(rawQuery: string): { mmdd: string; fullDateStr: string; labelMarathi: string } | null {
  if (!rawQuery || typeof rawQuery !== 'string') return null;

  // Convert Marathi numerals to English
  const marathiDigits: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  const normalized = rawQuery.replace(/[०-९]/g, (d) => marathiDigits[d] || d).toLowerCase().trim();

  // Month dictionary mapping
  const monthMap: Record<string, number> = {
    'जानेवारी': 1, 'जाने': 1, 'january': 1, 'jan': 1,
    'फेब्रुवारी': 2, 'फेब्रु': 2, 'february': 2, 'feb': 2,
    'मार्च': 3, 'march': 3, 'mar': 3,
    'एप्रिल': 4, 'april': 4, 'apr': 4,
    'मे': 5, 'may': 5,
    'जून': 6, 'june': 6, 'jun': 6,
    'जुलै': 7, 'july': 7, 'jul': 7,
    'ऑगस्ट': 8, 'august': 8, 'aug': 8,
    'सप्टेंबर': 9, 'सप्टें': 9, 'september': 9, 'sept': 9, 'sep': 9,
    'ऑक्टोबर': 10, 'ऑक्टो': 10, 'october': 10, 'oct': 10,
    'नोव्हेंबर': 11, 'नोव्हें': 11, 'november': 11, 'nov': 11,
    'डिसेंबर': 12, 'डिसें': 12, 'december': 12, 'dec': 12,
  };

  // Match pattern: Day + Month or Month + Day (e.g. "14 एप्रिल", "4 ऑक्टोबर", "october 4", "14-09", "2026-10-04")
  // 1. Check ISO or MM-DD / DD-MM format
  const isoMatch = normalized.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const m = String(parseInt(isoMatch[2], 10)).padStart(2, '0');
    const d = String(parseInt(isoMatch[3], 10)).padStart(2, '0');
    return { mmdd: `${m}-${d}`, fullDateStr: `2026-${m}-${d}`, labelMarathi: `${parseInt(d, 10)} ${isoMatch[2]}` };
  }

  // 2. Check "DD Month" or "Month DD"
  for (const [monthKey, monthNum] of Object.entries(monthMap)) {
    if (normalized.includes(monthKey)) {
      // Find adjacent number
      const numbers = normalized.match(/\b\d{1,2}\b/);
      if (numbers) {
        const dayNum = parseInt(numbers[0], 10);
        if (dayNum >= 1 && dayNum <= 31) {
          const mStr = String(monthNum).padStart(2, '0');
          const dStr = String(dayNum).padStart(2, '0');
          return {
            mmdd: `${mStr}-${dStr}`,
            fullDateStr: `2026-${mStr}-${dStr}`,
            labelMarathi: `${dayNum} ${monthKey}`,
          };
        }
      }
    }
  }

  return null;
}



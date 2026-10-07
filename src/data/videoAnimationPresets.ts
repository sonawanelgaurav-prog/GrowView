import { VideoAnimationPreset, VideoAnimationPresetId, AdminVideoSettings } from '../types';

export const VIDEO_ANIMATION_PRESETS: VideoAnimationPreset[] = [
  {
    id: 'pulse-glow',
    name: 'Pulse & Glow',
    nameMarathi: '१. धडकणारा प्रकाश व पल्स',
    descriptionMarathi: 'बॉर्डर व मुख्य प्रतिमेभोवती रिदमिक दिव्य प्रकाश लहरींची धडधड',
    iconName: 'Activity',
    category: 'divine',
    speedMultiplier: 1.0,
    previewColor: '#f59e0b',
  },
  {
    id: 'ken-burns',
    name: 'Cinematic Ken Burns',
    nameMarathi: '२. सिनेमॅटिक झूम व पॅन',
    descriptionMarathi: 'हळुवार मोहक झूम-इन व पॅन कॅमेरा मोशन',
    iconName: 'Film',
    category: 'royal',
    speedMultiplier: 0.8,
    previewColor: '#3b82f6',
  },
  {
    id: 'golden-sparkles',
    name: 'Golden Sparkles',
    nameMarathi: '३. सुवर्ण कण चमक व स्पार्कल्स',
    descriptionMarathi: 'हवेत तरंगणारे चकचकीत सोन्याचे कण व चांदण्यांचा प्रकाश',
    iconName: 'Sparkles',
    category: 'festive',
    speedMultiplier: 1.2,
    previewColor: '#eab308',
  },
  {
    id: 'diya-float',
    name: 'Diya & Lantern Float',
    nameMarathi: '४. दीप ज्योती व कंदील फ्लोट',
    descriptionMarathi: 'उत्सव दीवे आणि मंद तेवणारी शांत सुवर्ण ज्योत',
    iconName: 'Flame',
    category: 'divine',
    speedMultiplier: 0.9,
    previewColor: '#f97316',
  },
  {
    id: 'confetti-burst',
    name: 'Festive Confetti Burst',
    nameMarathi: '५. रंगबेरंगी गुलाल व फुले वर्षाव',
    descriptionMarathi: 'उत्सवाचा सळसळता उत्साह, रंगीत गुलाल आणि कन्फेटी ब्लास्ट',
    iconName: 'Zap',
    category: 'festive',
    speedMultiplier: 1.3,
    previewColor: '#ec4899',
  },
  {
    id: 'saffron-wave',
    name: 'Saffron Silk Waves',
    nameMarathi: '६. भगवा ध्वज व रेशमी लहरी',
    descriptionMarathi: 'भव्य भगव्या रेशमी पट आणि शिवकालीन ध्वज लहरी',
    iconName: 'Wind',
    category: 'royal',
    speedMultiplier: 1.1,
    previewColor: '#ea580c',
  },
  {
    id: 'text-slide-up',
    name: 'Typography Slide & Fade',
    nameMarathi: '७. मराठी मजकूर स्लाईड अप',
    descriptionMarathi: 'शुभेच्छा आणि ब्रँड नाव स्मूथ स्लाईड होऊन दिमाखात प्रकट होते',
    iconName: 'Sliders',
    category: 'modern',
    speedMultiplier: 1.0,
    previewColor: '#10b981',
  },
  {
    id: 'chakra-spin',
    name: 'Divine Chakra Spin',
    nameMarathi: '८. सुदर्शन चक्र / प्रभामंडळ',
    descriptionMarathi: 'देवाच्या मागे फिरणारे तेजस्वी सुवर्ण प्रभामंडळ चक्र',
    iconName: 'Compass',
    category: 'divine',
    speedMultiplier: 0.7,
    previewColor: '#fbbf24',
  },
  {
    id: 'gold-light-sweep',
    name: 'Royal Shimmer Sweep',
    nameMarathi: '९. रॉयल गोल्ड लाईट स्वीप',
    descriptionMarathi: 'मजकूर आणि फ्रेमवरून आरपार जाणारी चकचकीत सोन्याची तिरकी किरण',
    iconName: 'Sun',
    category: 'royal',
    speedMultiplier: 1.1,
    previewColor: '#d97706',
  },
  {
    id: 'flower-shower',
    name: 'Fresh Petal Shower',
    nameMarathi: '१०. झेंडू-गुलाब पुष्पवृष्टी',
    descriptionMarathi: 'आकाशातून हळूहळू पडणाऱ्या ताज्या झेंडू आणि गुलाबाच्या पाकळ्या',
    iconName: 'Heart',
    category: 'festive',
    speedMultiplier: 1.0,
    previewColor: '#f43f5e',
  },
  {
    id: 'cinematic-smoke',
    name: 'Royal Smoke & Fire',
    nameMarathi: '११. राजेशाही धूर व अग्नी प्रभाव',
    descriptionMarathi: 'पार्श्वभूमीवर मंद धुराचे वलय आणि धगधगती राजेशाही आभा',
    iconName: 'Flame',
    category: 'royal',
    speedMultiplier: 0.9,
    previewColor: '#c2410c',
  },
  {
    id: 'blessing-auras',
    name: 'Divine Blessing Aura',
    nameMarathi: '१२. दैवी आशीर्वाद व प्रकाश किरणे',
    descriptionMarathi: 'देवाच्या मूर्तीमधून चारही बाजूंना पसरणाऱ्या दिव्य सूर्यकिरणांचा प्रभाव',
    iconName: 'Sun',
    category: 'divine',
    speedMultiplier: 0.8,
    previewColor: '#fde047',
  },
  {
    id: 'neon-border-pulse',
    name: 'Cyber Neon Border Pulse',
    nameMarathi: '१३. निऑन बॉर्डर ग्लिट्स व पल्स',
    descriptionMarathi: 'आधुनिक सोशल मीडिया निऑन बॉर्डर जी संगीताच्या तालावर चमकते',
    iconName: 'Layers',
    category: 'modern',
    speedMultiplier: 1.4,
    previewColor: '#06b6d4',
  },
  {
    id: 'parallax-drift',
    name: '3D Parallax Drift',
    nameMarathi: '१४. 3D पॅरलॅक्स पार्श्वभूमी ड्रिफ्ट',
    descriptionMarathi: 'मजकूर स्थिर आणि बॅकग्राऊंड हळूवार तरंगत खोली (Depth) निर्माण करते',
    iconName: 'Eye',
    category: 'modern',
    speedMultiplier: 0.8,
    previewColor: '#8b5cf6',
  },
  {
    id: 'beat-flash',
    name: 'Festival Rhythm Flash',
    nameMarathi: '१५. ढोल-ताशा रिदम फ्लॅश',
    descriptionMarathi: 'ढोल ताशांच्या ठेक्यावर हलकासा व्हायब्रंट फ्लॅश स्टेटससाठी परफेक्ट',
    iconName: 'Music',
    category: 'festive',
    speedMultiplier: 1.5,
    previewColor: '#e11d48',
  },
  {
    id: 'lens-flare',
    name: 'Golden Lens Flare',
    nameMarathi: '१६. सूर्यकिरण व सिनेमॅटिक लेन्स फ्लेअर',
    descriptionMarathi: 'हॉलीवूड स्टाईल सिनेमा लेन्स फ्लेअर व प्रकाशाचा तेजस्वी झोत',
    iconName: 'Sun',
    category: 'royal',
    speedMultiplier: 1.0,
    previewColor: '#f59e0b',
  },
  {
    id: 'water-ripples',
    name: 'Holy Water Wave Ripples',
    nameMarathi: '१७. शुभ जल लहरी व रिपल्स',
    descriptionMarathi: 'शांत पवित्र जलाशयाच्या पाण्यावर उमटणाऱ्या मंजुळ लहरी',
    iconName: 'Waves',
    category: 'divine',
    speedMultiplier: 0.9,
    previewColor: '#0ea5e9',
  },
  {
    id: 'fireworks',
    name: 'Grand Fireworks Celebration',
    nameMarathi: '१८. भव्य आतषबाजी व फटाके',
    descriptionMarathi: 'आभाळात फुटणारे रंगबेरंगी फटाके आणि रोषणाईचा झगमगाट',
    iconName: 'Sparkles',
    category: 'festive',
    speedMultiplier: 1.3,
    previewColor: '#a855f7',
  },
  {
    id: 'dhol-tasha-shake',
    name: 'High Energy Beat Shake',
    nameMarathi: '१९. उत्सव बीट शेक व व्हायब्रेशन',
    descriptionMarathi: 'इन्स्टाग्राम रील्स आणि व्हॉट्सॲप स्टेटससाठी जबरदस्त बीट शेक',
    iconName: 'Activity',
    category: 'modern',
    speedMultiplier: 1.4,
    previewColor: '#ef4444',
  },
  {
    id: 'floating-3d-tilt',
    name: '3D Card Float & Swing',
    nameMarathi: '२०. 3D कार्ड फ्लोट आणि स्विंग',
    descriptionMarathi: 'संपूर्ण पोस्टर कार्ड 3D अवकाशात तरंगत असल्याचा मोहक दृश्य अनुभव',
    iconName: 'Radio',
    category: 'modern',
    speedMultiplier: 0.9,
    previewColor: '#14b8a6',
  },
];

export const DEFAULT_ADMIN_VIDEO_SETTINGS: AdminVideoSettings = {
  enabled: true,
  defaultPreset: 'golden-sparkles',
  defaultDuration: 15,
  defaultResolution: '1080p',
  defaultAudio: 'dhol-tasha',
  allowClientCustomization: true,
  watermarkForFreeUsers: false,
  maxDurationSeconds: 30,
  activePresets: VIDEO_ANIMATION_PRESETS.map((p) => p.id),
};

const STORAGE_KEY_ADMIN_VIDEO_SETTINGS = 'growview_admin_video_settings_v1';

export function getStoredAdminVideoSettings(): AdminVideoSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_VIDEO_SETTINGS);
    if (!raw) return DEFAULT_ADMIN_VIDEO_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADMIN_VIDEO_SETTINGS,
      ...parsed,
      activePresets: parsed.activePresets || DEFAULT_ADMIN_VIDEO_SETTINGS.activePresets,
    };
  } catch {
    return DEFAULT_ADMIN_VIDEO_SETTINGS;
  }
}

export function saveStoredAdminVideoSettings(settings: AdminVideoSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_VIDEO_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save admin video settings:', err);
  }
}

export const saveAdminVideoSettings = saveStoredAdminVideoSettings;

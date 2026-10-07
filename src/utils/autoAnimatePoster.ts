import {
  PosterTemplate,
  BusinessProfile,
  VideoStudioLayer,
  VideoStudioScene,
  VideoStudioProject,
  VideoAnimationTemplate,
} from '../types';

export const DEFAULT_ANIMATION_TEMPLATES: VideoAnimationTemplate[] = [
  {
    id: 'sweet_dreams_night',
    name: 'Sweet Dreams & Night Glow (शुभ रात्री व शांत चंद्र)',
    nameMarathi: 'शुभ रात्री, चंद्र व ढग शांत ॲनिमेशन',
    description: 'Serene starry midnight sky, floating crescent moon, glowing dreamy clouds, and gentle motivational text reveal',
    category: 'quotes',
    duration: 6,
    aspectRatio: '9:16',
    defaultAudio: 'motivational_cinematic',
    presetRules: {
      background: { entrance: 'fade_in', movement: 'slow_pan_up' },
      mainObject: { entrance: 'fade_zoom_in', movement: 'floating' },
      heading: { entrance: 'fade_in', textAnim: 'tracking' },
      subheading: { entrance: 'fade_in', textAnim: 'fade' },
      logo: { entrance: 'fade_in', movement: 'none' },
      decoration: { entrance: 'fade_in', movement: 'circular_motion' },
    },
  },
  {
    id: 'ganesh_royal_intro',
    name: 'Ganesh Royal Intro (गणेशोत्सव स्पेशल)',
    nameMarathi: 'गणेशोत्सव भव्य आगमन व आरती ॲनिमेशन',
    description: 'Cinematic zoom for background, divine floating bappa with golden sparkles, bold pop-in heading',
    category: 'festive',
    duration: 6,
    aspectRatio: '9:16',
    defaultAudio: 'dhol_tasha_utsav',
    presetRules: {
      background: { entrance: 'fade_in', movement: 'cinematic_zoom' },
      mainObject: { entrance: 'pop_in', movement: 'floating' },
      heading: { entrance: 'slide_from_bottom', textAnim: 'pop' },
      subheading: { entrance: 'fade_in', textAnim: 'typewriter' },
      logo: { entrance: 'slide_from_bottom', movement: 'none' },
      decoration: { entrance: 'fade_zoom_in', movement: 'wave_movement' },
    },
  },
  {
    id: 'daily_suvichar_peace',
    name: 'Daily Suvichar & Morning Flow',
    nameMarathi: 'शुभ सकाळ व दैनिक विचार फ्लो',
    description: 'Slow upward panning, peaceful font transitions, and serene background auras',
    category: 'quotes',
    duration: 6,
    aspectRatio: '9:16',
    defaultAudio: 'motivational_cinematic',
    presetRules: {
      background: { entrance: 'fade_in', movement: 'slow_pan_up' },
      mainObject: { entrance: 'fade_zoom_in', movement: 'gentle_zoom' },
      heading: { entrance: 'fade_in', textAnim: 'tracking' },
      subheading: { entrance: 'fade_in', textAnim: 'char_reveal' },
      logo: { entrance: 'fade_in', movement: 'none' },
      decoration: { entrance: 'fade_in', movement: 'floating' },
    },
  },
  {
    id: 'business_brand_boost',
    name: 'Business Growth & Brand Spotlight',
    nameMarathi: 'बिझनेस ब्रँडिंग व प्रॉडक्ट प्रोमो',
    description: 'Dynamic parallax motion, high contrast slide-in typography, and branded logo bounce',
    category: 'business',
    duration: 6,
    aspectRatio: '9:16',
    defaultAudio: 'business_modern_groove',
    presetRules: {
      background: { entrance: 'fade_in', movement: 'slow_pan_left' },
      mainObject: { entrance: 'zoom_in', movement: 'parallax_movement' },
      heading: { entrance: 'slide_from_left', textAnim: 'slide' },
      subheading: { entrance: 'slide_from_right', textAnim: 'fade' },
      logo: { entrance: 'bounce_in', movement: 'none' },
      decoration: { entrance: 'pop_in', movement: 'circular_motion' },
    },
  },
  {
    id: 'shubh_utsav_vibrant',
    name: 'Festive Dhamaka & Celebration',
    nameMarathi: 'सण व उत्सव जल्लोष ॲनिमेशन',
    description: 'Wave movement, vibrant confetti explosion, and joyful festive particle celebration',
    category: 'celebration',
    duration: 6,
    aspectRatio: '9:16',
    defaultAudio: 'gulal_celebration',
    presetRules: {
      background: { entrance: 'fade_zoom_in', movement: 'wave_movement' },
      mainObject: { entrance: 'bounce_in', movement: 'floating' },
      heading: { entrance: 'pop_in', textAnim: 'bounce' },
      subheading: { entrance: 'fade_in', textAnim: 'word_reveal' },
      logo: { entrance: 'slide_from_bottom', movement: 'none' },
      decoration: { entrance: 'fade_zoom_in', movement: 'parallax_movement' },
    },
  },
];

/**
 * Derives the most accurate contextual animation preset for any poster
 */
export function getContextualAnimId(poster: PosterTemplate): string {
  const cat = (poster.category || '').toLowerCase();
  const title = (poster.title || '').toLowerCase();
  const titleNative = (poster.titleNative || '').toLowerCase();
  const headline = (poster.headline || '').toLowerCase();
  const motif = (poster.motifType || '').toLowerCase();
  const textToCheck = `${cat} ${title} ${titleNative} ${headline} ${motif} ${poster.id || ''}`.toLowerCase();

  // 1. Good Night / Sweet Dreams / Moon & Clouds (Priority 1)
  if (
    textToCheck.includes('night') ||
    textToCheck.includes('sweet') ||
    textToCheck.includes('dream') ||
    textToCheck.includes('चंद्र') ||
    textToCheck.includes('रात्री') ||
    textToCheck.includes('चांदणे') ||
    textToCheck.includes('moon') ||
    textToCheck.includes('crescent') ||
    textToCheck.includes('cloud') ||
    motif.includes('night') ||
    cat === 'good-night-quotes' ||
    (poster.id || '').startsWith('gn-')
  ) {
    return 'sweet_dreams_night';
  }

  // 2. Good Morning / Suvichar / Peace / Thought
  if (
    textToCheck.includes('morning') ||
    textToCheck.includes('सकाळ') ||
    textToCheck.includes('प्रभात') ||
    textToCheck.includes('suvichar') ||
    textToCheck.includes('विचार') ||
    textToCheck.includes('peace') ||
    cat === 'good-morning-quotes' ||
    cat === 'daily-suvichar' ||
    (poster.id || '').startsWith('gm-')
  ) {
    return 'daily_suvichar_peace';
  }

  // 3. Business / Store / Marketing
  if (
    textToCheck.includes('business') ||
    textToCheck.includes('दुकाना') ||
    textToCheck.includes('ऑफर्स') ||
    textToCheck.includes('मार्केट') ||
    textToCheck.includes('sale') ||
    textToCheck.includes('growth') ||
    cat === 'business'
  ) {
    return 'business_brand_boost';
  }

  // 4. Shiva / Navratri / Utsav / Festive celebrations
  if (
    textToCheck.includes('utsav') ||
    textToCheck.includes('diwali') ||
    textToCheck.includes('navratri') ||
    textToCheck.includes('shiv') ||
    textToCheck.includes('महाकाल') ||
    textToCheck.includes('सण')
  ) {
    return 'shubh_utsav_vibrant';
  }

  // 5. Lord Ganesha / Bappa (Only if genuinely Ganesha!)
  if (
    textToCheck.includes('ganesh') ||
    textToCheck.includes('bappa') ||
    textToCheck.includes('गणेश') ||
    textToCheck.includes('मोरया') ||
    cat === 'ganesh-chaturthi' ||
    cat === 'ganesh-festival'
  ) {
    return 'ganesh_royal_intro';
  }

  if (cat.includes('quote') || cat.includes('suvichar')) {
    return 'daily_suvichar_peace';
  }

  return 'daily_suvichar_peace';
}

/**
 * Intelligent Poster-to-Video Engine:
 * Converts a static PosterTemplate into a multi-layered, keyframe-ready VideoStudioProject
 */
export function generateVideoProjectFromPoster(
  template: PosterTemplate,
  profile: BusinessProfile,
  animationTemplateId: string = 'ganesh_royal_intro',
  userId: string = 'admin_system'
): VideoStudioProject {
  // Contextually determine the best animation template if not explicitly chosen or default
  const contextualId = getContextualAnimId(template);
  const actualAnimId =
    animationTemplateId && animationTemplateId !== 'ganesh_royal_intro'
      ? animationTemplateId
      : contextualId;

  const chosenAnimTemplate =
    DEFAULT_ANIMATION_TEMPLATES.find((t) => t.id === actualAnimId) ||
    DEFAULT_ANIMATION_TEMPLATES.find((t) => t.id === animationTemplateId) ||
    DEFAULT_ANIMATION_TEMPLATES[0];

  const rules = chosenAnimTemplate.presetRules;
  const canvasW = 1080;
  const canvasH = 1920; // Default 9:16

  const normCat = (template.category || '').toLowerCase();
  const normTitle = `${template.title || ''} ${template.titleNative || ''} ${template.headline || ''} ${template.motifType || ''} ${template.id || ''}`.toLowerCase();
  const isNight =
    normCat.includes('night') ||
    normCat.includes('sweet') ||
    normCat.includes('dream') ||
    normCat.includes('रात्री') ||
    normTitle.includes('night') ||
    normTitle.includes('sweet') ||
    normTitle.includes('dream') ||
    normTitle.includes('moon') ||
    normTitle.includes('crescent') ||
    normTitle.includes('cloud') ||
    normTitle.includes('चंद्र') ||
    normTitle.includes('रात्री') ||
    normTitle.includes('चांदणे') ||
    (template.id || '').startsWith('gn-') ||
    (template.motifType || '').includes('night') ||
    (template.motifType || '').includes('crescent') ||
    (template.motifType || '').includes('moon');
  const isMorning =
    !isNight &&
    (normCat.includes('morning') ||
      normCat.includes('सकाळ') ||
      normTitle.includes('morning') ||
      normTitle.includes('सकाळ') ||
      normTitle.includes('प्रभात') ||
      normTitle.includes('sun') ||
      (template.id || '').startsWith('gm-'));

  // Ensure motif is genuinely correct (never default to ganesh for night/sweet dreams)
  let resolvedMotif = template.motifType;
  if (!resolvedMotif || (isNight && resolvedMotif.includes('ganesh'))) {
    resolvedMotif = isNight ? 'night-crescent-clouds' : isMorning ? 'morning-sun' : 'ganesh-murti';
  }

  // Ensure background gradient matches night theme
  let resolvedBgGradient = template.theme?.bgGradient;
  if (
    isNight &&
    (!resolvedBgGradient ||
      resolvedBgGradient.includes('amber') ||
      resolvedBgGradient.includes('orange') ||
      resolvedBgGradient.includes('saffron') ||
      resolvedBgGradient.includes('red'))
  ) {
    resolvedBgGradient = 'from-slate-950 via-indigo-950 to-purple-950';
  }

  const layers: VideoStudioLayer[] = [];

  // Layer 1: Background Layer
  layers.push({
    id: `layer-bg-${Date.now()}-1`,
    name: isNight ? 'Night Sky (रात्रीचे निळे आकाश)' : 'Background (पार्श्वभूमी)',
    nameMarathi: isNight ? 'रात्रीचे निळे आकाश व चांदण्या' : 'पार्श्वभूमी रंग व ग्रेडियंट',
    type: 'background',
    visible: true,
    locked: false,
    zIndex: 1,
    x: canvasW / 2,
    y: canvasH / 2,
    width: canvasW,
    height: canvasH,
    maintainAspectRatio: false,
    scale: 1.0,
    rotation: 0,
    opacity: 1,
    blur: 0,
    brightness: 1,
    contrast: 1,
    saturation: 1,
    imageUrl: template.customBgUrl || template.imageUrl || undefined,
    bgGradient: resolvedBgGradient,
    motifType: resolvedMotif,
    primaryColor: isNight ? '#c084fc' : template.theme?.primaryColor,
    accentColor: isNight ? '#fef08a' : template.theme?.accentColor,
    entrancePreset: rules.background.entrance,
    entranceDuration: 1.2,
    entranceDelay: 0,
    entranceEasing: 'easeOut',
    movementPreset: rules.background.movement,
    movementSpeed: 0.8,
    exitPreset: 'none',
    exitDuration: 0.8,
    exitDelay: 0,
    keyframes: [],
  });

  // Layer 2: Main Subject / Deity Motif
  if (resolvedMotif || template.imageUrl || template.customBgUrl) {
    layers.push({
      id: `layer-deity-${Date.now()}-2`,
      name: isNight ? 'Moon & Clouds (चंद्र व ढग)' : isMorning ? 'Morning Sun (सूर्य)' : 'Main Motif (मुख्य प्रतिमा)',
      nameMarathi: isNight ? 'चंद्र व ढग शुभरात्री' : isMorning ? 'शुभ सकाळ सूर्य प्रतिमा' : 'मुख्य प्रतिमा व डिझाइन',
      type: 'deity',
      visible: true,
      locked: false,
      zIndex: 2,
      x: canvasW / 2,
      y: canvasH * 0.38,
      width: 520,
      height: 520,
      maintainAspectRatio: true,
      scale: 1.0,
      rotation: 0,
      opacity: 1,
      blur: 0,
      brightness: 1.05,
      contrast: 1.05,
      saturation: 1.1,
      imageUrl: template.imageUrl || undefined,
      svgIcon: resolvedMotif,
      motifType: resolvedMotif,
      bgGradient: resolvedBgGradient,
      primaryColor: isNight ? '#c084fc' : (template.theme?.primaryColor || '#f59e0b'),
      accentColor: isNight ? '#fef08a' : (template.theme?.accentColor || '#fde047'),
      entrancePreset: rules.mainObject.entrance,
      entranceDuration: 1.4,
      entranceDelay: 0.3,
      entranceEasing: 'bounce',
      movementPreset: rules.mainObject.movement,
      movementSpeed: 1.0,
      exitPreset: 'none',
      exitDuration: 0.8,
      exitDelay: 0,
      keyframes: [],
      effectType: 'glow',
      effectIntensity: 0.7,
    });
  }

  // Layer 3: Main Headline
  const fallbackHeadline = isNight ? 'शुभ रात्री • Sweet Dreams' : isMorning ? 'शुभ सकाळ • सुविचार' : 'हार्दिक शुभेच्छा';
  const headlineText = template.headline || template.titleNative || template.title || fallbackHeadline;
  layers.push({
    id: `layer-heading-${Date.now()}-3`,
    name: 'Main Heading (मुख्य मथळा)',
    nameMarathi: 'मुख्य मथळा व शुभसंदेश',
    type: 'heading',
    visible: true,
    locked: false,
    zIndex: 3,
    x: canvasW / 2,
    y: canvasH * 0.62,
    width: 920,
    height: 160,
    maintainAspectRatio: false,
    scale: 1.0,
    rotation: 0,
    opacity: 1,
    blur: 0,
    brightness: 1,
    contrast: 1,
    saturation: 1,
    text: headlineText,
    fontFamily: 'Yatra One, Rozha One, serif',
    fontSize: 58,
    fontWeight: '900',
    color: isNight ? '#fde047' : (template.theme?.accentColor || '#fde047'),
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 1.3,
    shadowColor: 'rgba(0,0,0,0.85)',
    shadowBlur: 14,
    strokeColor: isNight ? '#3b0764' : '#78350f',
    strokeWidth: 2,
    textAnimation: rules.heading.textAnim,
    entrancePreset: rules.heading.entrance,
    entranceDuration: 1.2,
    entranceDelay: 0.6,
    entranceEasing: 'easeOut',
    movementPreset: 'none',
    movementSpeed: 1,
    exitPreset: 'none',
    exitDuration: 0.8,
    exitDelay: 0,
    keyframes: [],
  });

  // Layer 4: Subtext / Quote
  if (template.subtext || template.quote) {
    layers.push({
      id: `layer-subtext-${Date.now()}-4`,
      name: 'Subheading (उपशीर्षक व विचार)',
      nameMarathi: 'उपशीर्षक व विचार',
      type: 'subheading',
      visible: true,
      locked: false,
      zIndex: 4,
      x: canvasW / 2,
      y: canvasH * 0.74,
      width: 860,
      height: 120,
      maintainAspectRatio: false,
      scale: 1.0,
      rotation: 0,
      opacity: 0.95,
      blur: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      text: template.subtext || template.quote || '',
      fontFamily: 'Poppins, Mukta, sans-serif',
      fontSize: 32,
      fontWeight: '600',
      color: template.theme?.textColor || '#ffffff',
      textAlign: 'center',
      letterSpacing: 0.5,
      lineHeight: 1.4,
      shadowColor: 'rgba(0,0,0,0.7)',
      shadowBlur: 8,
      textAnimation: rules.subheading.textAnim,
      entrancePreset: rules.subheading.entrance,
      entranceDuration: 1.3,
      entranceDelay: 0.9,
      entranceEasing: 'easeOut',
      movementPreset: 'none',
      movementSpeed: 1,
      exitPreset: 'none',
      exitDuration: 0.8,
      exitDelay: 0,
      keyframes: [],
    });
  }

  // Layer 5: Business Branding & Logo
  // USER MANDATE: The company logo and frame info must remain static and identical to the poster! DO NOT MOVE IT!
  const footerH = Math.round(canvasH * 0.18);
  layers.push({
    id: `layer-branding-${Date.now()}-5`,
    name: 'Brand Footer (कंपनी लोगो व फ्रेम)',
    nameMarathi: 'कंपनी लोगो व फ्रेम (स्थिर - हलवू नका)',
    type: 'logo',
    visible: true,
    locked: true,
    zIndex: 10,
    x: canvasW / 2,
    y: canvasH - footerH / 2,
    width: canvasW,
    height: footerH,
    maintainAspectRatio: false,
    scale: 1.0,
    rotation: 0,
    opacity: 1,
    blur: 0,
    brightness: 1,
    contrast: 1,
    saturation: 1,
    text: `${profile.name} • 📞 ${profile.phone}`,
    fontFamily: 'Poppins, sans-serif',
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    entrancePreset: 'none', // STRICTLY NONE - DO NOT MOVE!
    entranceDuration: 0,
    entranceDelay: 0,
    entranceEasing: 'linear',
    movementPreset: 'none', // STRICTLY NONE - DO NOT MOVE!
    movementSpeed: 1,
    exitPreset: 'none',
    exitDuration: 0,
    exitDelay: 0,
    keyframes: [],
    frameId: template.defaultFrameId || 'footer-01',
    profile: profile,
    footerConfig: (template as any).footerConfig || {},
  });

  // Layer 6: Starry Twinkles / Particles
  layers.push({
    id: `layer-particles-${Date.now()}-6`,
    name: isNight ? 'Starry Night Twinkles (चांदण्या)' : 'Festive Particles (स्पार्कल्स)',
    nameMarathi: isNight ? 'आकाशातील चमचमत्या चांदण्या' : 'सोन्याची उधळण व स्पार्कल्स',
    type: 'particles',
    visible: true,
    locked: false,
    zIndex: 6,
    x: canvasW / 2,
    y: canvasH / 2,
    width: canvasW,
    height: canvasH,
    maintainAspectRatio: false,
    scale: 1.0,
    rotation: 0,
    opacity: isNight ? 0.9 : 0.8,
    blur: 0,
    brightness: 1,
    contrast: 1,
    saturation: 1,
    effectType: 'sparkle',
    effectIntensity: isNight ? 0.75 : 0.85,
    entrancePreset: 'fade_in',
    entranceDuration: 1.5,
    entranceDelay: 0.2,
    entranceEasing: 'easeOut',
    movementPreset: 'circular_motion',
    movementSpeed: 1.2,
    exitPreset: 'none',
    exitDuration: 0.8,
    exitDelay: 0,
    keyframes: [],
  });

  const scene: VideoStudioScene = {
    id: `scene-1-${Date.now()}`,
    name: 'Scene 1 (मुख्य दृश्य)',
    duration: chosenAnimTemplate.duration || 6,
    posterId: template.id,
    layers,
    transition: 'fade',
    transitionDuration: 0.6,
  };

  const defaultAudio = isNight ? 'motivational_cinematic' : chosenAnimTemplate.defaultAudio || 'dhol_tasha_utsav';
  const defaultAudioName = isNight ? 'शांत रात्री सूर (Peaceful Night Chimes)' : 'Dhol Tasha Mahautsav';

  const project: VideoStudioProject = {
    id: `vproject-${template.id}-${Date.now()}`,
    title: `${template.titleNative || template.title} Animated Video`,
    posterId: template.id,
    ownerId: userId,
    createdBy: userId,
    creatorName: profile.name,
    duration: chosenAnimTemplate.duration || 6,
    aspectRatio: '9:16',
    scenes: [scene],
    audioTrack: defaultAudio,
    audioName: defaultAudioName,
    audioVolume: 0.85,
    audioFadeIn: 0.5,
    audioFadeOut: 0.8,
    audioTrimStart: 0,
    audioTrimEnd: 6,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    frameId: template.defaultFrameId || 'footer-01',
    profile: profile,
    footerConfig: (template as any).footerConfig || {},
  };

  return project;
}

// Local Storage Drafts Management
const STORAGE_KEY_VIDEO_PROJECTS = 'gunashree_video_studio_projects_v1';
const STORAGE_KEY_EXPORTED_VIDEOS = 'gunashree_exported_videos_v1';

export function getStoredVideoProjects(): VideoStudioProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VIDEO_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load video projects:', e);
    return [];
  }
}

export function batchSaveStoredVideoProjects(projects: VideoStudioProject[]): void {
  try {
    const all = getStoredVideoProjects();
    const map = new Map(all.map((p) => [p.id, p]));
    for (const proj of projects) {
      map.set(proj.id, {
        ...proj,
        updatedAt: new Date().toISOString(),
        version: (proj.version || 1) + 1,
      });
    }
    const combined = Array.from(map.values());
    localStorage.setItem(STORAGE_KEY_VIDEO_PROJECTS, JSON.stringify(combined));
  } catch (e) {
    console.warn('Failed to batch save video projects:', e);
  }
}

export function saveStoredVideoProject(project: VideoStudioProject): void {
  try {
    const all = getStoredVideoProjects();
    const existingIndex = all.findIndex((p) => p.id === project.id);
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString(),
      version: (project.version || 1) + 1,
    };
    if (existingIndex >= 0) {
      all[existingIndex] = updatedProject;
    } else {
      all.unshift(updatedProject);
    }
    localStorage.setItem(STORAGE_KEY_VIDEO_PROJECTS, JSON.stringify(all));
  } catch (e) {
    console.warn('Failed to save video project:', e);
  }
}

export function deleteStoredVideoProject(projectId: string): void {
  try {
    const all = getStoredVideoProjects().filter((p) => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY_VIDEO_PROJECTS, JSON.stringify(all));
  } catch (e) {
    console.warn('Failed to delete video project:', e);
  }
}

export interface ExportedVideoRecord {
  id: string;
  projectId: string;
  posterId?: string;
  title: string;
  downloadUrl: string;
  aspectRatio: string;
  duration: number;
  fileSizeBytes?: number;
  exportedAt: string;
}

export function getStoredExportedVideos(): ExportedVideoRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXPORTED_VIDEOS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredExportedVideo(record: ExportedVideoRecord): void {
  try {
    const all = getStoredExportedVideos();
    all.unshift(record);
    localStorage.setItem(STORAGE_KEY_EXPORTED_VIDEOS, JSON.stringify(all));
  } catch (e) {
    console.warn('Failed to save exported video record:', e);
  }
}

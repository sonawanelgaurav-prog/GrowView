import { 
  MasterTemplate, 
  MasterTemplateConfig,
  CanvasCustomElement, 
  WeddingFormData, 
  EngagementFormData, 
  ResumeFormData 
} from '../types';
import { 
  DEFAULT_WEDDING_FORM_DATA, 
  DEFAULT_ENGAGEMENT_FORM_DATA, 
  DEFAULT_RESUME_FORM_DATA 
} from '../data/masterTemplates';

/**
 * Curated list of high-quality Devanagari and Latin fonts for template cards
 */
export const AVAILABLE_TEMPLATE_FONTS = [
  { name: 'Rozha One (शाही मराठी)', value: 'Rozha One, serif' },
  { name: 'Tiro Devanagari (पारंपरिक)', value: 'Tiro Devanagari Marathi, serif' },
  { name: 'Yatra One (मराठा राजेशाही)', value: 'Yatra One, cursive' },
  { name: 'Baloo 2 (ठळक व आकर्षक)', value: 'Baloo 2, cursive' },
  { name: 'Kalam (हस्तलिखित कॅलिग्राफी)', value: 'Kalam, cursive' },
  { name: 'Mukta (आधुनिक मराठी)', value: 'Mukta, sans-serif' },
  { name: 'Noto Serif Devanagari (क्लासिक)', value: 'Noto Serif Devanagari, serif' },
  { name: 'Eczar (रॉयल हेडिंग)', value: 'Eczar, serif' },
  { name: 'Modak (ठळक उत्सव)', value: 'Modak, cursive' },
  { name: 'Cinzel (Royal Western/Heritage)', value: 'Cinzel, serif' },
  { name: 'Playfair Display (Luxury Elegant)', value: 'Playfair Display, serif' },
  { name: 'Great Vibes (Calligraphy Script)', value: 'Great Vibes, cursive' },
  { name: 'Poppins (Modern Clean)', value: 'Poppins, sans-serif' },
  { name: 'Inter (Standard Minimal)', value: 'Inter, sans-serif' },
];

/**
 * Curated color swatches for quick formatting
 */
export const CURATED_COLOR_SWATCHES = [
  { name: 'रॉयल मरून', color: '#800000' },
  { name: 'शाही गोल्ड', color: '#d4af37' },
  { name: 'केशरी नारंगी', color: '#ff6600' },
  { name: 'गडद लाल (Crimson)', color: '#991b1b' },
  { name: 'राणी गुलाबी (Magenta)', color: '#9d174d' },
  { name: 'रॉयल नेव्ही ब्लू', color: '#1e3a8a' },
  { name: 'पिवळा / अंबर', color: '#f59e0b' },
  { name: 'शुभ्र पांढरा (Pure White)', color: '#ffffff' },
  { name: 'शाही काळा (Jet Black)', color: '#0f172a' },
  { name: 'हिरवा (Emerald)', color: '#047857' },
];

/**
 * Generates the default set of interactive, draggable canvas elements
 * for a MasterTemplate based on its archetype, category, fonts, and colors.
 */
export function generateDefaultElementsForTemplate(template: MasterTemplate): CanvasCustomElement[] {
  const primaryColor = template.primary_color || '#800000';
  const secondaryColor = template.secondary_color || '#d4af37';
  const textColor = template.text_color || '#1e293b';
  const headingFont = template.heading_font || 'Rozha One, serif';
  const bodyFont = template.body_font || 'Noto Serif Devanagari, serif';
  const cfg: Partial<MasterTemplateConfig> = template.template_config || {};

  // 1. WEDDING CARDS (लग्नपत्रिका)
  if (template.category === 'wedding') {
    const symbolIcon = cfg.ornamentIcon === 'kalash' ? '🏺' : cfg.ornamentIcon === 'dhol-shehnai' ? '🎺' : '卐';
    
    return [
      {
        id: 'tpl-symbol',
        type: 'text',
        name: 'शुभ चिन्ह (Symbol)',
        content: symbolIcon,
        x: 50,
        y: 7,
        fontSize: 26,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 20,
        zIndex: 10,
        fieldBinding: 'symbol',
      },
      {
        id: 'tpl-shloka',
        type: 'text',
        name: 'मंत्र / श्लोक (Shloka)',
        content: '॥ श्री गणेशाय नमः ॥',
        x: 50,
        y: 12,
        fontSize: 13,
        isBold: true,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 60,
        zIndex: 11,
        fieldBinding: 'shloka',
      },
      {
        id: 'tpl-subshloka',
        type: 'text',
        name: 'उप-श्लोक (Sub-Shloka)',
        content: '॥ मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः ॥',
        x: 50,
        y: 15,
        fontSize: 11,
        isItalic: true,
        color: secondaryColor,
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 80,
        zIndex: 12,
        fieldBinding: 'subshloka',
      },
      {
        id: 'tpl-title',
        type: 'text',
        name: 'मुख्य शीर्षक (Title)',
        content: '॥ शुभ विवाह ॥',
        x: 50,
        y: 21,
        fontSize: 28,
        isBold: true,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 70,
        zIndex: 13,
        fieldBinding: 'title',
      },
      {
        id: 'tpl-invitation',
        type: 'text',
        name: 'निमंत्रण संदेश (Invitation Message)',
        content: DEFAULT_WEDDING_FORM_DATA.invitationMessage,
        x: 50,
        y: 28,
        fontSize: 11,
        color: textColor,
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 82,
        zIndex: 14,
        fieldBinding: 'invitationMessage',
      },
      {
        id: 'tpl-bride',
        type: 'text',
        name: 'वधूचे नाव व तपशील (Bride)',
        content: `${DEFAULT_WEDDING_FORM_DATA.brideName}\n(सुपुत्री: ${DEFAULT_WEDDING_FORM_DATA.brideParents})`,
        x: 50,
        y: 40,
        fontSize: 20,
        isBold: true,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 84,
        zIndex: 15,
        fieldBinding: 'brideName',
      },
      {
        id: 'tpl-divider-heart',
        type: 'text',
        name: 'विवाह चिन्ह / चिन्ह (Heart/Divider)',
        content: '❤️',
        x: 50,
        y: 48,
        fontSize: 22,
        color: secondaryColor,
        align: 'center',
        boxWidth: 20,
        zIndex: 16,
      },
      {
        id: 'tpl-groom',
        type: 'text',
        name: 'वराचे नाव व तपशील (Groom)',
        content: `${DEFAULT_WEDDING_FORM_DATA.groomName}\n(सुपुत्र: ${DEFAULT_WEDDING_FORM_DATA.groomParents})`,
        x: 50,
        y: 55,
        fontSize: 20,
        isBold: true,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 84,
        zIndex: 17,
        fieldBinding: 'groomName',
      },
      {
        id: 'tpl-date',
        type: 'text',
        name: 'विवाह दिनांक व मुहूर्त (Date & Muhurat)',
        content: `📅 ${DEFAULT_WEDDING_FORM_DATA.weddingDate}\n${DEFAULT_WEDDING_FORM_DATA.weddingDay} • ${DEFAULT_WEDDING_FORM_DATA.muhurat}`,
        x: 50,
        y: 68,
        fontSize: 12,
        isBold: true,
        color: '#0f172a',
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 86,
        zIndex: 18,
        fieldBinding: 'weddingDate',
      },
      {
        id: 'tpl-venue',
        type: 'text',
        name: 'विवाह स्थळ व पत्ता (Venue & Address)',
        content: `📍 ${DEFAULT_WEDDING_FORM_DATA.venue}\n${DEFAULT_WEDDING_FORM_DATA.address}`,
        x: 50,
        y: 79,
        fontSize: 11,
        isBold: true,
        color: '#334155',
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 86,
        zIndex: 19,
        fieldBinding: 'venue',
      },
      {
        id: 'tpl-inviter',
        type: 'text',
        name: 'निमंत्रक व संपर्क (Inviter & Hosts)',
        content: `निमंत्रक: ${DEFAULT_WEDDING_FORM_DATA.hosts}\nसंपर्क: ${DEFAULT_WEDDING_FORM_DATA.contactDetails}`,
        x: 50,
        y: 90,
        fontSize: 11,
        isBold: true,
        color: primaryColor,
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 86,
        zIndex: 20,
        fieldBinding: 'hosts',
      },
    ];
  }

  // 2. ENGAGEMENT CARDS (साखरपुडा)
  if (template.category === 'engagement') {
    return [
      {
        id: 'tpl-symbol',
        type: 'text',
        name: 'शुभ चिन्ह (Ring Symbol)',
        content: '💍',
        x: 50,
        y: 7,
        fontSize: 26,
        color: secondaryColor,
        align: 'center',
        boxWidth: 20,
        zIndex: 10,
        fieldBinding: 'symbol',
      },
      {
        id: 'tpl-shloka',
        type: 'text',
        name: 'मंत्र / श्लोक (Shloka)',
        content: '॥ श्री गणेशाय नमः ॥',
        x: 50,
        y: 12,
        fontSize: 13,
        isBold: true,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 60,
        zIndex: 11,
        fieldBinding: 'shloka',
      },
      {
        id: 'tpl-subshloka',
        type: 'text',
        name: 'उप-श्लोक (Sub-Shloka)',
        content: '॥ दोन जीवांचे रेशीमबंध जुळताना ॥',
        x: 50,
        y: 15,
        fontSize: 11,
        isItalic: true,
        color: secondaryColor,
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 80,
        zIndex: 12,
        fieldBinding: 'subshloka',
      },
      {
        id: 'tpl-title',
        type: 'text',
        name: 'मुख्य शीर्षक (Title)',
        content: '॥ साखरपुडा सोहळा ॥',
        x: 50,
        y: 21,
        fontSize: 28,
        isBold: true,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 70,
        zIndex: 13,
        fieldBinding: 'title',
      },
      {
        id: 'tpl-invitation',
        type: 'text',
        name: 'निमंत्रण संदेश (Invitation Message)',
        content: DEFAULT_ENGAGEMENT_FORM_DATA.invitationMessage,
        x: 50,
        y: 28,
        fontSize: 11,
        color: textColor,
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 82,
        zIndex: 14,
        fieldBinding: 'invitationMessage',
      },
      {
        id: 'tpl-bride',
        type: 'text',
        name: 'वधूचे नाव व तपशील (Bride)',
        content: `${DEFAULT_ENGAGEMENT_FORM_DATA.brideName}\n(सुपुत्री: ${DEFAULT_ENGAGEMENT_FORM_DATA.brideParents})`,
        x: 50,
        y: 40,
        fontSize: 20,
        isBold: true,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 84,
        zIndex: 15,
        fieldBinding: 'brideName',
      },
      {
        id: 'tpl-divider-heart',
        type: 'text',
        name: 'साखरपुडा चिन्ह (Rings)',
        content: '✨ 💍 ✨',
        x: 50,
        y: 48,
        fontSize: 18,
        color: secondaryColor,
        align: 'center',
        boxWidth: 25,
        zIndex: 16,
      },
      {
        id: 'tpl-groom',
        type: 'text',
        name: 'वराचे नाव व तपशील (Groom)',
        content: `${DEFAULT_ENGAGEMENT_FORM_DATA.groomName}\n(सुपुत्र: ${DEFAULT_ENGAGEMENT_FORM_DATA.groomParents})`,
        x: 50,
        y: 55,
        fontSize: 20,
        isBold: true,
        color: primaryColor,
        fontFamily: headingFont,
        align: 'center',
        boxWidth: 84,
        zIndex: 17,
        fieldBinding: 'groomName',
      },
      {
        id: 'tpl-date',
        type: 'text',
        name: 'साखरपुडा दिनांक व वेळ (Date & Time)',
        content: `📅 ${DEFAULT_ENGAGEMENT_FORM_DATA.engagementDate}\n${DEFAULT_ENGAGEMENT_FORM_DATA.day} • ${DEFAULT_ENGAGEMENT_FORM_DATA.time}`,
        x: 50,
        y: 68,
        fontSize: 12,
        isBold: true,
        color: '#0f172a',
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 86,
        zIndex: 18,
        fieldBinding: 'engagementDate',
      },
      {
        id: 'tpl-venue',
        type: 'text',
        name: 'सोहळा स्थळ व पत्ता (Venue & Address)',
        content: `📍 ${DEFAULT_ENGAGEMENT_FORM_DATA.venue}\n${DEFAULT_ENGAGEMENT_DATA_ADDRESS(DEFAULT_ENGAGEMENT_FORM_DATA)}`,
        x: 50,
        y: 79,
        fontSize: 11,
        isBold: true,
        color: '#334155',
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 86,
        zIndex: 19,
        fieldBinding: 'venue',
      },
      {
        id: 'tpl-inviter',
        type: 'text',
        name: 'संपर्क व विशेष नोंद (Contact & Note)',
        content: `संपर्क: ${DEFAULT_ENGAGEMENT_FORM_DATA.contactNumber}\n${DEFAULT_ENGAGEMENT_FORM_DATA.specialNote}`,
        x: 50,
        y: 90,
        fontSize: 11,
        isBold: true,
        color: primaryColor,
        fontFamily: bodyFont,
        align: 'center',
        boxWidth: 86,
        zIndex: 20,
        fieldBinding: 'contactNumber',
      },
    ];
  }

  // 3. RESUME TEMPLATES (बायोडाटा / रेझ्युमे)
  return [
    {
      id: 'tpl-name',
      type: 'text',
      name: 'उमेदवाराचे नाव (Full Name)',
      content: DEFAULT_RESUME_FORM_DATA.fullName,
      x: 50,
      y: 7,
      fontSize: 24,
      isBold: true,
      color: primaryColor,
      fontFamily: headingFont,
      align: 'center',
      boxWidth: 88,
      zIndex: 10,
      fieldBinding: 'fullName',
    },
    {
      id: 'tpl-title',
      type: 'text',
      name: 'पद / हुद्दा (Job Title)',
      content: DEFAULT_RESUME_FORM_DATA.professionalTitle,
      x: 50,
      y: 13,
      fontSize: 14,
      isBold: true,
      color: '#475569',
      fontFamily: headingFont,
      align: 'center',
      boxWidth: 88,
      zIndex: 11,
      fieldBinding: 'professionalTitle',
    },
    {
      id: 'tpl-contact',
      type: 'text',
      name: 'संपर्क तपशील (Contact Details)',
      content: `📞 ${DEFAULT_RESUME_FORM_DATA.phone}  |  ✉️ ${DEFAULT_RESUME_FORM_DATA.email}  |  📍 ${DEFAULT_RESUME_FORM_DATA.address}`,
      x: 50,
      y: 18,
      fontSize: 10,
      color: '#64748b',
      fontFamily: bodyFont,
      align: 'center',
      boxWidth: 88,
      zIndex: 12,
      fieldBinding: 'contact',
    },
    {
      id: 'tpl-summary',
      type: 'text',
      name: 'कार्य सारांश (Professional Summary)',
      content: `🎯 कार्य सारांश (Summary):\n${DEFAULT_RESUME_FORM_DATA.professionalSummary}`,
      x: 50,
      y: 30,
      fontSize: 11,
      color: '#1e293b',
      fontFamily: bodyFont,
      align: 'left',
      boxWidth: 88,
      zIndex: 13,
      fieldBinding: 'professionalSummary',
    },
    {
      id: 'tpl-skills',
      type: 'text',
      name: 'कौशल्ये (Key Skills)',
      content: `🛠️ कौशल्ये (Key Skills):\nReact, TypeScript, Node.js, Tailwind CSS, PostgreSQL, UI/UX Design, Git, Docker, Cloud Deployment`,
      x: 50,
      y: 47,
      fontSize: 11,
      color: '#1e293b',
      fontFamily: bodyFont,
      align: 'left',
      boxWidth: 88,
      zIndex: 14,
      fieldBinding: 'skills',
    },
    {
      id: 'tpl-experience',
      type: 'text',
      name: 'कार्य अनुभव (Work Experience)',
      content: `💼 कार्य अनुभव (Experience):\n• Senior Full-Stack Engineer (TechCorp Solutions Pvt. Ltd.) [2022 - Present]\n• Full-Stack Web Developer (InnovateX Systems) [2020 - 2022]`,
      x: 50,
      y: 65,
      fontSize: 11,
      color: '#1e293b',
      fontFamily: bodyFont,
      align: 'left',
      boxWidth: 88,
      zIndex: 15,
      fieldBinding: 'experience',
    },
    {
      id: 'tpl-education',
      type: 'text',
      name: 'शिक्षण (Education)',
      content: `🎓 शिक्षण (Education):\n• B.Tech in Computer Science & Engineering (First Class with Distinction)\n• सावित्रीबाई फुले पुणे विद्यापीठ (SPPU) [२०१६ - २०२०]`,
      x: 50,
      y: 83,
      fontSize: 11,
      color: '#1e293b',
      fontFamily: bodyFont,
      align: 'left',
      boxWidth: 88,
      zIndex: 16,
      fieldBinding: 'education',
    },
  ];
}

function DEFAULT_ENGAGEMENT_DATA_ADDRESS(d: EngagementFormData): string {
  return d.address || '';
}

/**
 * Resolves the dynamic customer values into a CanvasCustomElement for real-time customer preview
 */
export function resolveElementDynamicContent(
  el: CanvasCustomElement,
  data?: {
    weddingData?: WeddingFormData;
    engagementData?: EngagementFormData;
    resumeData?: ResumeFormData;
  }
): string {
  if (!data) return el.content || '';

  // 1. Wedding resolution
  if (data.weddingData) {
    const w = data.weddingData;
    if (el.id === 'tpl-bride' || el.fieldBinding === 'brideName') {
      return `${w.brideName || 'वधू'}\n(सुपुत्री: ${w.brideParents || ''})`;
    }
    if (el.id === 'tpl-groom' || el.fieldBinding === 'groomName') {
      return `${w.groomName || 'वर'}\n(सुपुत्र: ${w.groomParents || ''})`;
    }
    if (el.id === 'tpl-date' || el.fieldBinding === 'weddingDate') {
      return `📅 ${w.weddingDate || ''}\n${w.weddingDay ? w.weddingDay + ' • ' : ''}${w.muhurat || w.weddingTime || ''}`;
    }
    if (el.id === 'tpl-venue' || el.fieldBinding === 'venue') {
      return `📍 ${w.venue || ''}\n${w.address || ''}`;
    }
    if (el.id === 'tpl-inviter' || el.fieldBinding === 'hosts') {
      return `निमंत्रक: ${w.hosts || ''}\nसंपर्क: ${w.contactDetails || ''}`;
    }
    if (el.id === 'tpl-invitation' || el.fieldBinding === 'invitationMessage') {
      return w.invitationMessage || el.content || '';
    }
  }

  // 2. Engagement resolution
  if (data.engagementData) {
    const e = data.engagementData;
    if (el.id === 'tpl-bride' || el.fieldBinding === 'brideName') {
      return `${e.brideName || 'वधू'}\n(सुपुत्री: ${e.brideParents || ''})`;
    }
    if (el.id === 'tpl-groom' || el.fieldBinding === 'groomName') {
      return `${e.groomName || 'वर'}\n(सुपुत्र: ${e.groomParents || ''})`;
    }
    if (el.id === 'tpl-date' || el.fieldBinding === 'engagementDate') {
      return `📅 ${e.engagementDate || ''}\n${e.day ? e.day + ' • ' : ''}${e.time || ''}`;
    }
    if (el.id === 'tpl-venue' || el.fieldBinding === 'venue') {
      return `📍 ${e.venue || ''}\n${e.address || ''}`;
    }
    if (el.id === 'tpl-inviter' || el.fieldBinding === 'contactNumber') {
      return `संपर्क: ${e.contactNumber || ''}\n${e.specialNote || ''}`;
    }
    if (el.id === 'tpl-invitation' || el.fieldBinding === 'invitationMessage') {
      return e.invitationMessage || el.content || '';
    }
  }

  // 3. Resume resolution
  if (data.resumeData) {
    const r = data.resumeData;
    if (el.id === 'tpl-name' || el.fieldBinding === 'fullName') {
      return r.fullName || el.content || '';
    }
    if (el.id === 'tpl-title' || el.fieldBinding === 'professionalTitle') {
      return r.professionalTitle || el.content || '';
    }
    if (el.id === 'tpl-contact' || el.fieldBinding === 'contact') {
      return `📞 ${r.phone || ''}  |  ✉️ ${r.email || ''}  |  📍 ${r.address || ''}`;
    }
    if (el.id === 'tpl-summary' || el.fieldBinding === 'professionalSummary') {
      return `🎯 कार्य सारांश (Summary):\n${r.professionalSummary || ''}`;
    }
  }

  return el.content || '';
}

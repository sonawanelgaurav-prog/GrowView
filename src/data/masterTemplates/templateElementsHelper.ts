import { 
  MasterTemplate, 
  MasterTemplateConfig,
  CanvasCustomElement, 
  WeddingFormData, 
  EngagementFormData, 
  ResumeFormData 
} from '../../types';
import { 
  DEFAULT_WEDDING_FORM_DATA, 
  DEFAULT_ENGAGEMENT_FORM_DATA, 
  DEFAULT_RESUME_FORM_DATA 
} from './index';

/**
 * Generates the full set of interactive, pre-designed canvas elements for a Master Template
 * based on its category, archetype, colors, and typography.
 * This allows the admin to directly click, drag, drop, format, and reposition every single element!
 */
export function getInitialTemplateElements(
  template: MasterTemplate,
  weddingData: WeddingFormData = DEFAULT_WEDDING_FORM_DATA,
  engagementData: EngagementFormData = DEFAULT_ENGAGEMENT_FORM_DATA,
  resumeData: ResumeFormData = DEFAULT_RESUME_FORM_DATA
): CanvasCustomElement[] {
  const cfg: Partial<MasterTemplateConfig> = template.template_config || {};
  const primaryColor = template.primary_color || '#831843';
  const secondaryColor = template.secondary_color || '#d97706';
  const textColor = template.text_color || '#1e293b';
  const headingFont = template.heading_font || 'Rozha One, serif';
  const bodyFont = template.body_font || 'Tiro Devanagari Marathi, serif';
  const headingSize = cfg.headingFontSize || 28;

  // --------------------------------------------------------------------------
  // 1. WEDDING TEMPLATES (50 DESIGNS)
  // --------------------------------------------------------------------------
  if (template.category === 'wedding') {
    const isPeshwai = (template.layout_type || '').includes('peshwai') || 
                      (cfg.layoutVariant || '').includes('peshwai') || 
                      (template.style || '').includes('Traditional');
    const isModern = (template.layout_type || '').includes('modern') || (template.style || '').includes('Modern');
    const isFloral = (template.layout_type || '').includes('floral') || (template.style || '').includes('Floral');

    const motifType = cfg.ornamentIcon || (isFloral ? 'lotus' : isModern ? 'rings' : 'ganpati');

    const elements: CanvasCustomElement[] = [
      // 1. Top Sacred Motif / Symbol
      {
        id: 'el_wed_motif',
        type: 'sticker',
        subType: motifType,
        name: 'शुभ चिन्ह (Sacred Motif)',
        content: motifType === 'lotus' ? 'Lotus' : motifType === 'rings' ? 'Rings' : 'Ganesh',
        x: 50,
        y: 7,
        width: 11,
        height: 8,
        color: secondaryColor,
        zIndex: 10,
      },

      // 2. Shloka Line 1
      {
        id: 'el_wed_shloka_1',
        type: 'text',
        name: 'श्री गणेशाय नमः (Shloka 1)',
        content: '॥ श्री गणेशाय नमः ॥',
        x: 50,
        y: 12.5,
        fontSize: 13,
        fontFamily: headingFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 70,
        zIndex: 11,
      },

      // 3. Shloka Line 2 (Sub-verse)
      {
        id: 'el_wed_shloka_2',
        type: 'text',
        name: 'मंगल श्लोक (Shloka 2)',
        content: '॥ मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः ॥',
        x: 50,
        y: 15.5,
        fontSize: 10.5,
        fontFamily: bodyFont,
        color: secondaryColor,
        isItalic: true,
        align: 'center',
        boxWidth: 75,
        zIndex: 12,
      },

      // 4. Main Event Title
      {
        id: 'el_wed_title',
        type: 'text',
        name: 'शुभ विवाह शीर्षक (Main Title)',
        content: '॥ शुभ विवाह ॥',
        x: 50,
        y: 21,
        fontSize: headingSize,
        fontFamily: headingFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 80,
        zIndex: 13,
        fieldBinding: 'title',
      },

      // 5. Invitation Message
      {
        id: 'el_wed_invitation_msg',
        type: 'text',
        name: 'निमंत्रण संदेश (Invitation Message)',
        content: weddingData.invitationMessage || DEFAULT_WEDDING_FORM_DATA.invitationMessage,
        x: 50,
        y: 26.5,
        fontSize: 11,
        fontFamily: bodyFont,
        color: textColor,
        align: 'center',
        boxWidth: 84,
        zIndex: 14,
        fieldBinding: 'invitationMessage',
      },

      // 6. Bride Label
      {
        id: 'el_wed_bride_lbl',
        type: 'text',
        name: 'वधू लेबल (Bride Label)',
        content: 'वधू',
        x: 50,
        y: 33,
        fontSize: 11,
        fontFamily: bodyFont,
        color: secondaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 40,
        zIndex: 15,
      },

      // 7. Bride Name
      {
        id: 'el_wed_bride_name',
        type: 'text',
        name: 'वधूचे नाव (Bride Name)',
        content: weddingData.brideName || DEFAULT_WEDDING_FORM_DATA.brideName,
        x: 50,
        y: 37,
        fontSize: 23,
        fontFamily: headingFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 88,
        zIndex: 16,
        fieldBinding: 'brideName',
      },

      // 8. Bride Parents
      {
        id: 'el_wed_bride_parents',
        type: 'text',
        name: 'वधूचे पालक (Bride Parents)',
        content: `(सुपुत्री: ${weddingData.brideParents || DEFAULT_WEDDING_FORM_DATA.brideParents})`,
        x: 50,
        y: 41,
        fontSize: 11,
        fontFamily: bodyFont,
        color: textColor,
        align: 'center',
        boxWidth: 84,
        zIndex: 17,
        fieldBinding: 'brideParents',
      },

      // 9. Wedding Knot / Ornate Divider
      {
        id: 'el_wed_knot',
        type: 'sticker',
        subType: 'heart',
        name: 'रेशीमबंध चिन्ह (Wedding Knot / Divider)',
        content: 'Heart',
        x: 50,
        y: 45.5,
        width: 14,
        height: 4.5,
        color: secondaryColor,
        zIndex: 18,
      },

      // 10. Groom Label
      {
        id: 'el_wed_groom_lbl',
        type: 'text',
        name: 'वर लेबल (Groom Label)',
        content: 'वर',
        x: 50,
        y: 50,
        fontSize: 11,
        fontFamily: bodyFont,
        color: secondaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 40,
        zIndex: 19,
      },

      // 11. Groom Name
      {
        id: 'el_wed_groom_name',
        type: 'text',
        name: 'वराचे नाव (Groom Name)',
        content: weddingData.groomName || DEFAULT_WEDDING_FORM_DATA.groomName,
        x: 50,
        y: 54,
        fontSize: 23,
        fontFamily: headingFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 88,
        zIndex: 20,
        fieldBinding: 'groomName',
      },

      // 12. Groom Parents
      {
        id: 'el_wed_groom_parents',
        type: 'text',
        name: 'वराचे पालक (Groom Parents)',
        content: `(सुपुत्र: ${weddingData.groomParents || DEFAULT_WEDDING_FORM_DATA.groomParents})`,
        x: 50,
        y: 58,
        fontSize: 11,
        fontFamily: bodyFont,
        color: textColor,
        align: 'center',
        boxWidth: 84,
        zIndex: 21,
        fieldBinding: 'groomParents',
      },

      // 13. Wedding Date & Day
      {
        id: 'el_wed_date',
        type: 'text',
        name: 'विवाह तारीख (Wedding Date & Day)',
        content: `📅 ${weddingData.weddingDay || DEFAULT_WEDDING_FORM_DATA.weddingDay}, ${weddingData.weddingDate || DEFAULT_WEDDING_FORM_DATA.weddingDate}`,
        x: 34,
        y: 65,
        fontSize: 12,
        fontFamily: bodyFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 50,
        zIndex: 22,
        fieldBinding: 'weddingDate',
      },

      // 14. Muhurat & Time
      {
        id: 'el_wed_muhurat',
        type: 'text',
        name: 'शुभ मुहूर्त (Muhurat)',
        content: `⏰ ${weddingData.muhurat || DEFAULT_WEDDING_FORM_DATA.muhurat}`,
        x: 74,
        y: 65,
        fontSize: 12,
        fontFamily: bodyFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 42,
        zIndex: 23,
        fieldBinding: 'muhurat',
      },

      // 15. Venue & Address
      {
        id: 'el_wed_venue',
        type: 'text',
        name: 'विवाह स्थळ व पत्ता (Venue & Address)',
        content: `📍 ${weddingData.venue || DEFAULT_WEDDING_FORM_DATA.venue}\n${weddingData.address || DEFAULT_WEDDING_FORM_DATA.address}`,
        x: 50,
        y: 73.5,
        fontSize: 11,
        fontFamily: bodyFont,
        color: textColor,
        align: 'center',
        boxWidth: 86,
        zIndex: 24,
        fieldBinding: 'venue',
      },

      // 16. Inviter & Contact Details
      {
        id: 'el_wed_inviter',
        type: 'text',
        name: 'निमंत्रक व संपर्क (Inviters & Contact)',
        content: `निमंत्रक: ${weddingData.hosts || DEFAULT_WEDDING_FORM_DATA.hosts}\nस्नेही: ${weddingData.rsvp || DEFAULT_WEDDING_FORM_DATA.rsvp} | संपर्क: ${weddingData.contactDetails || DEFAULT_WEDDING_FORM_DATA.contactDetails}`,
        x: 50,
        y: 83.5,
        fontSize: 10,
        fontFamily: bodyFont,
        color: textColor,
        align: 'center',
        boxWidth: 88,
        zIndex: 25,
        fieldBinding: 'inviterName',
      },
    ];

    return elements;
  }

  // --------------------------------------------------------------------------
  // 2. ENGAGEMENT TEMPLATES (50 DESIGNS)
  // --------------------------------------------------------------------------
  if (template.category === 'engagement') {
    const elements: CanvasCustomElement[] = [
      // 1. Top Rings Motif
      {
        id: 'el_eng_motif',
        type: 'sticker',
        subType: 'rings',
        name: 'अंगठी चिन्ह (Rings Motif)',
        content: 'Rings',
        x: 50,
        y: 8,
        width: 12,
        height: 8,
        color: secondaryColor,
        zIndex: 10,
      },

      // 2. Shloka
      {
        id: 'el_eng_shloka',
        type: 'text',
        name: 'मंगल श्लोक (Shloka)',
        content: '॥ श्री गणेशाय नमः ॥',
        x: 50,
        y: 13.5,
        fontSize: 13,
        fontFamily: headingFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 60,
        zIndex: 11,
      },

      // 3. Event Title
      {
        id: 'el_eng_title',
        type: 'text',
        name: 'साखरपुडा सोहळा शीर्षक (Title)',
        content: '॥ साखरपुडा सोहळा ॥',
        x: 50,
        y: 20,
        fontSize: headingSize,
        fontFamily: headingFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 80,
        zIndex: 12,
        fieldBinding: 'title',
      },

      // 4. Invitation Note
      {
        id: 'el_eng_msg',
        type: 'text',
        name: 'निमंत्रण संदेश (Invitation Message)',
        content: engagementData.invitationMessage || DEFAULT_ENGAGEMENT_FORM_DATA.invitationMessage,
        x: 50,
        y: 26,
        fontSize: 11,
        fontFamily: bodyFont,
        color: textColor,
        align: 'center',
        boxWidth: 84,
        zIndex: 13,
        fieldBinding: 'invitationMessage',
      },

      // 5. Bride Label & Name
      {
        id: 'el_eng_bride',
        type: 'text',
        name: 'वधू नाव व तपशील (Bride Info)',
        content: `${engagementData.brideName || DEFAULT_ENGAGEMENT_FORM_DATA.brideName}\n(सुपुत्री: ${engagementData.brideParents || DEFAULT_ENGAGEMENT_FORM_DATA.brideParents})`,
        x: 50,
        y: 36,
        fontSize: 20,
        fontFamily: headingFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 86,
        zIndex: 14,
        fieldBinding: 'brideName',
      },

      // 6. Ring Ceremony Details
      {
        id: 'el_eng_ceremony',
        type: 'text',
        name: 'अंगठी बदल सोहळा (Ceremony Note)',
        content: engagementData.ringCeremonyDetails || DEFAULT_ENGAGEMENT_FORM_DATA.ringCeremonyDetails,
        x: 50,
        y: 44,
        fontSize: 11,
        fontFamily: bodyFont,
        color: secondaryColor,
        isItalic: true,
        align: 'center',
        boxWidth: 80,
        zIndex: 15,
      },

      // 7. Groom Label & Name
      {
        id: 'el_eng_groom',
        type: 'text',
        name: 'वर नाव व तपशील (Groom Info)',
        content: `${engagementData.groomName || DEFAULT_ENGAGEMENT_FORM_DATA.groomName}\n(सुपुत्र: ${engagementData.groomParents || DEFAULT_ENGAGEMENT_FORM_DATA.groomParents})`,
        x: 50,
        y: 52,
        fontSize: 20,
        fontFamily: headingFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 86,
        zIndex: 16,
        fieldBinding: 'groomName',
      },

      // 8. Engagement Date & Time
      {
        id: 'el_eng_date',
        type: 'text',
        name: 'साखरपुडा दिनांक व वेळ (Date & Time)',
        content: `📅 ${engagementData.day || DEFAULT_ENGAGEMENT_FORM_DATA.day}, ${engagementData.engagementDate || DEFAULT_ENGAGEMENT_FORM_DATA.engagementDate} • ${engagementData.time || DEFAULT_ENGAGEMENT_FORM_DATA.time}`,
        x: 50,
        y: 63,
        fontSize: 12,
        fontFamily: bodyFont,
        color: primaryColor,
        isBold: true,
        align: 'center',
        boxWidth: 85,
        zIndex: 17,
        fieldBinding: 'engagementDate',
      },

      // 9. Venue
      {
        id: 'el_eng_venue',
        type: 'text',
        name: 'समारंभ स्थळ (Venue)',
        content: `📍 ${engagementData.venue || DEFAULT_ENGAGEMENT_FORM_DATA.venue}\n${engagementData.address || DEFAULT_ENGAGEMENT_FORM_DATA.address}`,
        x: 50,
        y: 72,
        fontSize: 11,
        fontFamily: bodyFont,
        color: textColor,
        align: 'center',
        boxWidth: 86,
        zIndex: 18,
        fieldBinding: 'venue',
      },

      // 10. Inviter
      {
        id: 'el_eng_inviter',
        type: 'text',
        name: 'निमंत्रक व स्नेहभोजन (Inviter Details)',
        content: `${engagementData.specialNote || DEFAULT_ENGAGEMENT_FORM_DATA.specialNote}\nसस्नेह निमंत्रक: समस्त पाटील व जोशी परिवार | संपर्क: ${engagementData.contactNumber || DEFAULT_ENGAGEMENT_FORM_DATA.contactNumber}`,
        x: 50,
        y: 83,
        fontSize: 10,
        fontFamily: bodyFont,
        color: textColor,
        align: 'center',
        boxWidth: 88,
        zIndex: 19,
        fieldBinding: 'inviterName',
      },
    ];

    return elements;
  }

  // --------------------------------------------------------------------------
  // 3. RESUME & BIODATA TEMPLATES (50 DESIGNS)
  // --------------------------------------------------------------------------
  const elements: CanvasCustomElement[] = [
    // 1. Candidate Full Name
    {
      id: 'el_res_name',
      type: 'text',
      name: 'उमेदवाराचे नाव (Full Name)',
      content: resumeData.fullName || DEFAULT_RESUME_FORM_DATA.fullName,
      x: 50,
      y: 7,
      fontSize: 24,
      fontFamily: headingFont,
      color: primaryColor,
      isBold: true,
      align: 'center',
      boxWidth: 90,
      zIndex: 10,
      fieldBinding: 'fullName',
    },

    // 2. Professional Job Title
    {
      id: 'el_res_title',
      type: 'text',
      name: 'पदवी / प्रोफेशन (Professional Title)',
      content: resumeData.professionalTitle || DEFAULT_RESUME_FORM_DATA.professionalTitle,
      x: 50,
      y: 11.5,
      fontSize: 13,
      fontFamily: bodyFont,
      color: secondaryColor,
      isBold: true,
      align: 'center',
      boxWidth: 85,
      zIndex: 11,
      fieldBinding: 'professionalTitle',
    },

    // 3. Contact Details Bar
    {
      id: 'el_res_contact',
      type: 'text',
      name: 'संपर्क माहिती (Contact Info Bar)',
      content: `📧 ${resumeData.email || DEFAULT_RESUME_FORM_DATA.email}  |  📱 ${resumeData.phone || DEFAULT_RESUME_FORM_DATA.phone}  |  📍 ${resumeData.address || DEFAULT_RESUME_FORM_DATA.address}`,
      x: 50,
      y: 15.5,
      fontSize: 10,
      fontFamily: bodyFont,
      color: textColor,
      align: 'center',
      boxWidth: 92,
      zIndex: 12,
      fieldBinding: 'contact',
    },

    // 4. Professional Summary
    {
      id: 'el_res_summary',
      type: 'text',
      name: 'प्रोफेशनल सारांश (Career Objective / Summary)',
      content: `🎯 व्यावसायिक सारांश (Career Profile):\n${resumeData.professionalSummary || DEFAULT_RESUME_FORM_DATA.professionalSummary}`,
      x: 50,
      y: 26,
      fontSize: 10.5,
      fontFamily: bodyFont,
      color: textColor,
      align: 'left',
      boxWidth: 90,
      zIndex: 13,
      fieldBinding: 'professionalSummary',
    },

    // 5. Work Experience
    {
      id: 'el_res_exp',
      type: 'text',
      name: 'कामाचा अनुभव (Work Experience)',
      content: `💼 कार्य अनुभव (Work Experience):\n• Senior Full-Stack Engineer — TechCorp Solutions (2022 - Present)\n  - Microservices आर्किटेक्चरचे नेतृत्व आणि ४०% परफॉर्मन्स वाढविला.\n• Software Developer — Infoway Systems (2019 - 2022)\n  - React, TypeScript व Node.js सह हाय-ट्रॅफिक वेब ॲप्स विकसित केले.`,
      x: 50,
      y: 47,
      fontSize: 10.5,
      fontFamily: bodyFont,
      color: textColor,
      align: 'left',
      boxWidth: 90,
      zIndex: 14,
      fieldBinding: 'workExperience',
    },

    // 6. Education
    {
      id: 'el_res_edu',
      type: 'text',
      name: 'शिक्षण (Education)',
      content: `🎓 शैक्षणिक पात्रता (Education):\n• B.Tech in Computer Engineering — PICT Pune University (2015 - 2019) | 8.8 CGPA\n• HSC Science — Fergusson College, Pune (2015) | 89.4%`,
      x: 50,
      y: 69,
      fontSize: 10.5,
      fontFamily: bodyFont,
      color: textColor,
      align: 'left',
      boxWidth: 90,
      zIndex: 15,
      fieldBinding: 'education',
    },

    // 7. Technical Skills
    {
      id: 'el_res_skills',
      type: 'text',
      name: 'कौशल्ये (Skills & Technologies)',
      content: `⚡ तांत्रिक कौशल्ये (Technical Skills):\nReact.js, TypeScript, Node.js, Next.js, PostgreSQL, Docker, AWS Cloud, Git, CI/CD, Marathi & English Communication`,
      x: 50,
      y: 85,
      fontSize: 10.5,
      fontFamily: bodyFont,
      color: textColor,
      align: 'left',
      boxWidth: 90,
      zIndex: 16,
      fieldBinding: 'skills',
    },
  ];

  return elements;
}

/**
 * Resolves element text content with user dynamic form data if available
 */
export function resolveElementTextWithData(
  element: CanvasCustomElement,
  weddingData?: WeddingFormData,
  engagementData?: EngagementFormData,
  resumeData?: ResumeFormData
): string {
  if (element.type !== 'text') return element.content || '';

  const fb = element.fieldBinding;
  if (!fb) return element.content || '';

  // Wedding bindings
  if (weddingData) {
    if (fb === 'brideName') return weddingData.brideName || element.content || '';
    if (fb === 'groomName') return weddingData.groomName || element.content || '';
    if (fb === 'brideParents') return weddingData.brideParents ? `(सुपुत्री: ${weddingData.brideParents})` : element.content || '';
    if (fb === 'groomParents') return weddingData.groomParents ? `(सुपुत्र: ${weddingData.groomParents})` : element.content || '';
    if (fb === 'weddingDate') {
      const day = weddingData.weddingDay ? `${weddingData.weddingDay}, ` : '';
      return `📅 ${day}${weddingData.weddingDate || ''}`;
    }
    if (fb === 'muhurat') return `⏰ ${weddingData.muhurat || ''}`;
    if (fb === 'venue') return `📍 ${weddingData.venue || ''}\n${weddingData.address || ''}`;
    if (fb === 'invitationMessage') return weddingData.invitationMessage || element.content || '';
    if (fb === 'inviterName') {
      return `निमंत्रक: ${weddingData.hosts || ''}\nस्नेही: ${weddingData.rsvp || ''} | संपर्क: ${weddingData.contactDetails || ''}`;
    }
  }

  // Engagement bindings
  if (engagementData) {
    if (fb === 'brideName') return `${engagementData.brideName || ''}\n(सुपुत्री: ${engagementData.brideParents || ''})`;
    if (fb === 'groomName') return `${engagementData.groomName || ''}\n(सुपुत्र: ${engagementData.groomParents || ''})`;
    if (fb === 'engagementDate') {
      return `📅 ${engagementData.day || ''}, ${engagementData.engagementDate || ''} • ${engagementData.time || ''}`;
    }
    if (fb === 'venue') return `📍 ${engagementData.venue || ''}\n${engagementData.address || ''}`;
    if (fb === 'invitationMessage') return engagementData.invitationMessage || element.content || '';
    if (fb === 'inviterName') {
      return `${engagementData.specialNote || ''}\nसस्नेह निमंत्रक: समस्त पाटील व जोशी परिवार | संपर्क: ${engagementData.contactNumber || ''}`;
    }
  }

  // Resume bindings
  if (resumeData) {
    if (fb === 'fullName') return resumeData.fullName || element.content || '';
    if (fb === 'professionalTitle') return resumeData.professionalTitle || element.content || '';
    if (fb === 'contact') {
      return `📧 ${resumeData.email || ''}  |  📱 ${resumeData.phone || ''}  |  📍 ${resumeData.address || ''}`;
    }
    if (fb === 'professionalSummary') {
      return `🎯 व्यावसायिक सारांश (Career Profile):\n${resumeData.professionalSummary || element.content || ''}`;
    }
  }

  return element.content || '';
}

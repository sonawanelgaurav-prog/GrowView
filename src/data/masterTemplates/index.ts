import { MasterTemplate, WeddingFormData, EngagementFormData, ResumeFormData } from '../../types';
import { MASTER_WEDDING_TEMPLATES } from './weddingTemplates';
import { MASTER_ENGAGEMENT_TEMPLATES } from './engagementTemplates';
import { MASTER_RESUME_TEMPLATES } from './resumeTemplates';

export { MASTER_WEDDING_TEMPLATES } from './weddingTemplates';
export { MASTER_ENGAGEMENT_TEMPLATES } from './engagementTemplates';
export { MASTER_RESUME_TEMPLATES } from './resumeTemplates';

// All 150 Master Templates aggregated
export const ALL_MASTER_TEMPLATES: MasterTemplate[] = [
  ...MASTER_WEDDING_TEMPLATES,
  ...MASTER_ENGAGEMENT_TEMPLATES,
  ...MASTER_RESUME_TEMPLATES,
];

export const MASTER_TEMPLATES_STORAGE_KEY = 'growview_master_templates';
export const MASTER_TEMPLATES_UPDATED_EVENT = 'growview_master_templates_updated';

/**
 * Loads master templates, merging default templates with any Admin custom modifications from localStorage
 */
export function loadMasterTemplates(): MasterTemplate[] {
  try {
    const saved = localStorage.getItem(MASTER_TEMPLATES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Create lookup map of saved customized templates
        const savedMap = new Map<string, MasterTemplate>();
        parsed.forEach((item: MasterTemplate) => {
          if (item && item.id) savedMap.set(item.id, item);
        });

        // Merge defaults with customized so new fields/templates are preserved
        return ALL_MASTER_TEMPLATES.map((defTpl) => {
          const customized = savedMap.get(defTpl.id);
          return customized ? { ...defTpl, ...customized } : defTpl;
        });
      }
    }
  } catch (e) {
    console.error('Error loading customized master templates:', e);
  }
  return ALL_MASTER_TEMPLATES;
}

/**
 * Saves customized master templates to localStorage and notifies listeners
 */
export function saveMasterTemplates(templates: MasterTemplate[]): void {
  try {
    localStorage.setItem(MASTER_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(MASTER_TEMPLATES_UPDATED_EVENT, { detail: templates }));
    }
  } catch (e) {
    console.error('Error saving master templates:', e);
  }
}

/**
 * Resets a single template or all templates back to default factory settings
 */
export function resetMasterTemplateToDefault(templateId?: string): MasterTemplate[] {
  try {
    if (templateId) {
      const current = loadMasterTemplates();
      const defaultTpl = ALL_MASTER_TEMPLATES.find(t => t.id === templateId);
      if (defaultTpl) {
        const updated = current.map(t => t.id === templateId ? { ...defaultTpl } : t);
        saveMasterTemplates(updated);
        return updated;
      }
    } else {
      localStorage.removeItem(MASTER_TEMPLATES_STORAGE_KEY);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(MASTER_TEMPLATES_UPDATED_EVENT, { detail: ALL_MASTER_TEMPLATES }));
      }
      return ALL_MASTER_TEMPLATES;
    }
  } catch (e) {
    console.error('Error resetting master templates:', e);
  }
  return ALL_MASTER_TEMPLATES;
}

// Verify distribution counts
export const MASTER_TEMPLATE_STATS = {
  total: ALL_MASTER_TEMPLATES.length, // 150
  weddingCount: MASTER_WEDDING_TEMPLATES.length, // 50
  engagementCount: MASTER_ENGAGEMENT_TEMPLATES.length, // 50
  resumeCount: MASTER_RESUME_TEMPLATES.length, // 50
  freeCount: ALL_MASTER_TEMPLATES.filter(t => t.is_free).length, // 35 (10 + 10 + 15)
  premiumCount: ALL_MASTER_TEMPLATES.filter(t => t.is_premium).length, // 115 (40 + 40 + 35)
  atsResumeCount: MASTER_RESUME_TEMPLATES.filter(t => t.is_ats_friendly).length, // >= 10
};

// Helper lookup
export function getMasterTemplateById(id: string): MasterTemplate | undefined {
  return ALL_MASTER_TEMPLATES.find(t => t.id.toLowerCase() === id.toLowerCase());
}

export function getMasterTemplatesByCategory(category: 'wedding' | 'engagement' | 'resume'): MasterTemplate[] {
  return ALL_MASTER_TEMPLATES.filter(t => t.category === category);
}

// Sample Default Form Data for instantaneous preview
export const DEFAULT_WEDDING_FORM_DATA: WeddingFormData = {
  brideName: 'चि. सौ. कां. सानिका (Sanika)',
  groomName: 'चि. रोहन (Rohan)',
  brideParents: 'श्री. सुरेश व सौ. संगीता सावंत',
  groomParents: 'श्री. विलासराव व सौ. सुमित्रा कदम',
  weddingDate: 'रविवार, २२ नोव्हेंबर २०२६',
  weddingDay: 'रविवार',
  weddingTime: 'सकाळी ११:४५ वाजता',
  muhurat: 'शुभ मुहूर्त दुपारी १२:२८ वाजता',
  venue: 'महालक्ष्मी मंगल कार्यालय',
  address: 'पुणे-बंगलोर राष्ट्रीय महामार्ग, शिरोली, कोल्हापूर - ४१६१२२',
  invitationMessage: 'आम्हाला आपल्या आशीर्वादाची व उपस्थितीची नम्र अपेक्षा आहे. तरी आपण या शुभप्रसंगी उपस्थित राहून वधु-वरांस शुभाशीर्वाद द्यावेत, ही नम्र विनंती.',
  contactDetails: '+91 98221 12345 / +91 94220 54321',
  hosts: 'समस्त कदम व सावंत परिवार',
  rsvp: 'सर्व आप्तेष्ट, मित्रपरिवार व नातेवाईक',
};

export const DEFAULT_ENGAGEMENT_FORM_DATA: EngagementFormData = {
  brideName: 'चि. सौ. कां. प्रिया (Priya)',
  groomName: 'चि. अजिंक्य (Ajinkya)',
  brideParents: 'श्री. आनंद व सौ. आशा जोशी',
  groomParents: 'श्री. प्रकाश व सौ. प्रतिभा पाटील',
  engagementDate: 'शनिवार, २४ ऑक्टोबर २०२६',
  day: 'शनिवार',
  time: 'सायंकाळी ५:३० वाजता',
  venue: 'हॉटेल सयाजी, ग्रँड बॉलरूम हॉल',
  address: 'जुना पुणे-बंगलोर हायवे, कावळा नाका, कोल्हापूर - ४१६००३',
  invitationMessage: 'दोन जीवांचे रेशीमबंध जुळताना... आमच्या मुलाचा साखरपुडा (वाङ्निश्चय) समारंभ साजरा करण्याचे ठरले आहे. या मंगलप्रसंगी आपले सस्नेह निमंत्रण!',
  contactNumber: '+91 98812 34567 / +91 91234 56789',
  ringCeremonyDetails: 'शुभमुहूर्तावर अंगठी बदलण्याचा सोहळा सायं. ६:१५ वाजता संपन्न होईल.',
  specialNote: 'कार्यक्रमानंतर स्नेहभोजनाचे आयोजन केले आहे.',
};

export const DEFAULT_RESUME_FORM_DATA: ResumeFormData = {
  fullName: 'राहुल विलास शिंदे (Rahul Shinde)',
  professionalTitle: 'Senior Full-Stack Software Engineer',
  profilePhotoUrl: '',
  email: 'rahul.shinde@example.com',
  phone: '+91 98765 43210',
  address: 'Pune, Maharashtra, India',
  linkedin: 'linkedin.com/in/rahulshinde-dev',
  github: 'github.com/rahulshinde',
  portfolio: 'rahulshinde.dev',
  professionalSummary: 'Result-driven Senior Full-Stack Engineer with 5+ years of experience building scalable enterprise web applications, microservices, and reactive user interfaces. Proven track record in boosting platform performance by 40% and leading cross-functional engineering teams.',
  workExperience: [
    {
      id: 'exp-1',
      role: 'Senior Full-Stack Engineer',
      company: 'TechCorp Solutions Pvt. Ltd.',
      duration: '2022 - Present',
      location: 'Pune, India',
      points: [
        'Designed and spearheaded migration of monolithic architecture into event-driven microservices handling 2M+ daily requests.',
        'Reduced page load times by 45% using React, Vite, code splitting, and server-side rendering.',
        'Mentored a high-performing team of 8 junior and mid-level developers in Agile sprints.',
      ],
    },
    {
      id: 'exp-2',
      role: 'Software Developer',
      company: 'Infoway Systems',
      duration: '2019 - 2022',
      location: 'Mumbai, India',
      points: [
        'Developed responsive client web dashboards in React and TypeScript with Tailwind CSS.',
        'Integrated secure REST & GraphQL APIs, payment gateways (Razorpay/Stripe), and Redis caching.',
        'Implemented end-to-end automated testing suites boosting release stability.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Engineering',
      institution: 'Pune Institute of Computer Technology (PICT), Pune University',
      year: '2015 - 2019',
      score: '8.8 CGPA (First Class Distinction)',
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary Certificate (HSC) Science',
      institution: 'Fergusson College, Pune',
      year: '2015',
      score: '89.4%',
    },
  ],
  skills: ['React.js', 'TypeScript', 'Node.js', 'Express', 'Next.js', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS Cloud', 'Tailwind CSS', 'Git & GitHub'],
  technicalSkills: ['Full-Stack Web Architecture', 'REST & GraphQL APIs', 'Database Optimization', 'CI/CD Pipelines', 'ATS-Friendly Formatting'],
  projects: [
    {
      id: 'proj-1',
      title: 'E-Commerce Marketplace Engine',
      link: 'github.com/rahulshinde/ecommerce-engine',
      techStack: 'React, Node.js, PostgreSQL, Redis',
      description: 'Engineered a scalable multi-vendor portal with real-time inventory management, payment escrow, and analytical sales dashboard.',
    },
    {
      id: 'proj-2',
      title: 'Smart Poster Generation SaaS Platform',
      link: 'github.com/rahulshinde/poster-saas',
      techStack: 'React, TypeScript, Canvas API, Tailwind',
      description: 'Built vector graphics generation web tool enabling 10,000+ business owners to brand and export high-resolution social posters.',
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate (Amazon Web Services)',
    'Meta Certified Frontend Professional Developer',
  ],
  languages: ['English (Fluent / Professional)', 'Marathi (Native)', 'Hindi (Fluent)'],
  achievements: [
    'First Prize Winner – Pune State-Level Hackathon 2023 (Smart Cities Track)',
    'Employee of the Year (TechCorp Solutions 2023) for outstanding project delivery',
  ],
  interests: ['Open-Source Contributing', 'Tech Blogging & Mentoring', 'UI/UX Design', 'Chess'],
  references: 'Available upon request.',
  declaration: 'I hereby declare that all the details and qualifications provided above are true and correct to the best of my knowledge.',
  sectionVisibility: {
    professionalSummary: true,
    workExperience: true,
    education: true,
    skills: true,
    technicalSkills: true,
    projects: true,
    certifications: true,
    languages: true,
    achievements: true,
    interests: true,
    references: false,
    declaration: true,
  },
  sectionOrder: [
    'professionalSummary',
    'workExperience',
    'education',
    'skills',
    'technicalSkills',
    'projects',
    'certifications',
    'languages',
    'achievements',
    'interests',
    'declaration',
  ],
};

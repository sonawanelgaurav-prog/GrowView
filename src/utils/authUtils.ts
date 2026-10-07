import { CustomerActivityLog, PasswordValidationResult, UserAccount } from '../types';

export const validatePassword = (password: string): PasswordValidationResult => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(password);

  let score = 0;
  if (hasMinLength) score += 25;
  if (hasUpperCase) score += 20;
  if (hasLowerCase) score += 15;
  if (hasNumber) score += 20;
  if (hasSpecialChar) score += 20;

  // Bonus for longer password
  if (password.length >= 12 && score >= 80) {
    score = Math.min(100, score + 10);
  }

  let strengthLevel: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  let strengthLabelMarathi = 'कमकुवत (Weak)';

  if (score >= 90) {
    strengthLevel = 'strong';
    strengthLabelMarathi = 'अतिशय मजबूत (Strong)';
  } else if (score >= 70) {
    strengthLevel = 'good';
    strengthLabelMarathi = 'मजबूत (Good)';
  } else if (score >= 45) {
    strengthLevel = 'fair';
    strengthLabelMarathi = 'मध्यम (Fair)';
  }

  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  let message = '';
  if (!hasMinLength) message = 'Password must be at least 8 characters long / पासवर्ड किमान ८ अक्षरांचा असावा';
  else if (!hasUpperCase) message = 'Password must contain at least 1 uppercase letter / किमान १ मोठे अक्षर (A-Z) असावे';
  else if (!hasNumber) message = 'Password must contain at least 1 number / किमान १ अंक (0-9) असावा';
  else if (!hasSpecialChar) message = 'Password must contain at least 1 special character (!@#$%^&*) / किमान १ चिन्ह असावे';

  return {
    isValid,
    message,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    score,
    strengthLevel,
    strengthLabelMarathi,
    criteria: {
      hasMinLength,
      hasUppercase: hasUpperCase,
      hasNumber,
      hasSpecialChar,
    },
  };
};

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-admin-01',
    name: 'Gaurav Sonawane (मालक / Master Admin)',
    username: 'admin',
    email: 'sonawanel.gaurav@gmail.com',
    phone: '+91 98765 43210',
    businessName: 'GrowView Official Studio',
    businessType: 'Owner & Master Admin Studio',
    role: 'admin',
    adminRole: 'super_admin',
    status: 'active',
    createdAt: '2026-01-10T10:00:00.000Z',
    lastLoginAt: '2026-08-30T08:30:00.000Z',
    totalDownloads: 142,
    city: 'Pune, Maharashtra',
  },
  {
    id: 'usr-editor-01',
    name: 'राहुल जोशी (Design Editor)',
    username: 'editor',
    email: 'editor@growview.com',
    phone: '+91 98221 22334',
    businessName: 'GrowView Creative Studio',
    businessType: 'Poster & Canva Designer',
    role: 'admin',
    adminRole: 'editor',
    status: 'active',
    createdAt: '2026-02-01T10:00:00.000Z',
    lastLoginAt: '2026-08-30T09:15:00.000Z',
    totalDownloads: 88,
    city: 'Mumbai, Maharashtra',
  },
  {
    id: 'usr-content-01',
    name: 'प्रिया कुलकर्णी (Content Manager)',
    username: 'content',
    email: 'content@growview.com',
    phone: '+91 98334 55667',
    businessName: 'GrowView Content & Festivals',
    businessType: 'Festival & Marketing Copywriter',
    role: 'admin',
    adminRole: 'content_manager',
    status: 'active',
    createdAt: '2026-02-15T10:00:00.000Z',
    lastLoginAt: '2026-08-30T07:45:00.000Z',
    totalDownloads: 54,
    city: 'Nashik, Maharashtra',
  },
  {
    id: 'usr-cust-01',
    name: 'गणेश विजय शिंदे',
    username: 'ganesh_mart',
    email: 'ganesh.mart@gmail.com',
    phone: '+91 98220 12345',
    businessName: 'श्री गणेश सुपरमार्ट व किराणा',
    businessType: 'Retail & Grocery Mart',
    role: 'customer',
    status: 'active',
    createdAt: '2026-03-15T14:20:00.000Z',
    lastLoginAt: '2026-08-28T18:45:00.000Z',
    totalDownloads: 38,
    city: 'Nashik, Maharashtra',
  },
  {
    id: 'usr-cust-02',
    name: 'सचिन बापूराव पाटील',
    username: 'rajmudra',
    email: 'rajmudra.realty@gmail.com',
    phone: '+91 94220 88990',
    businessName: 'राजमुद्रा बिल्डर्स अँड रिअल्टर्स',
    businessType: 'Real Estate & Properties',
    role: 'customer',
    status: 'active',
    createdAt: '2026-05-02T11:10:00.000Z',
    lastLoginAt: '2026-08-29T06:15:00.000Z',
    totalDownloads: 27,
    city: 'Kolhapur, Maharashtra',
  },
];

export const INITIAL_ACTIVITY_LOGS: CustomerActivityLog[] = [
  {
    id: 'log-101',
    userId: 'usr-admin-01',
    userName: 'Gaurav Sonawane (Admin)',
    userEmail: 'admin@growview.com',
    action: 'login',
    description: 'Admin logged in to Studio dashboard',
    descriptionMarathi: 'ॲडमिन डॅशबोर्डमध्ये यशस्वी लॉगिन',
    timestamp: '2026-08-29T08:30:00.000Z',
    device: 'Desktop Chrome (Windows 11)',
    details: 'IP: 103.21.24.89 (Pune)',
  },
  {
    id: 'log-102',
    userId: 'usr-cust-01',
    userName: 'गणेश विजय शिंदे',
    userEmail: 'ganesh.mart@gmail.com',
    action: 'download_poster',
    description: 'Downloaded HD Poster: गणेश चतुर्थी विशेष शुभेच्छा (1080x1080)',
    descriptionMarathi: 'गणेश चतुर्थी शुभेच्छा पोस्टर डाऊनलोड केले (HD 1:1)',
    timestamp: '2026-08-28T18:45:00.000Z',
    device: 'Mobile Safari (iPhone 15)',
    details: 'Format: PNG with Frame "Golden Royal"',
  },
  {
    id: 'log-103',
    userId: 'usr-cust-01',
    userName: 'गणेश विजय शिंदे',
    userEmail: 'ganesh.mart@gmail.com',
    action: 'ai_slogan',
    description: 'Generated AI Festival Marketing Slogans for "Ganesh Chaturthi Offers"',
    descriptionMarathi: 'गणेश चतुर्थी ऑफर्ससाठी AI जाहिरात मथळा तयार केला',
    timestamp: '2026-08-28T18:40:00.000Z',
    device: 'Mobile Safari (iPhone 15)',
    details: 'Language: Marathi',
  },
  {
    id: 'log-104',
    userId: 'usr-cust-02',
    userName: 'सचिन बापूराव पाटील',
    userEmail: 'rajmudra.realty@gmail.com',
    action: 'download_poster',
    description: 'Downloaded Business Poster: रिअल इस्टेट ड्रीम होम ऑफर',
    descriptionMarathi: 'ड्रीम होम ऑफर व्यवसाय बॅनर डाऊनलोड केले',
    timestamp: '2026-08-29T06:15:00.000Z',
    device: 'Android Chrome (OnePlus 12)',
    details: 'Aspect: 9:16 Story Status',
  },
  {
    id: 'log-105',
    userId: 'usr-cust-02',
    userName: 'सचिन बापूराव पाटील',
    userEmail: 'rajmudra.realty@gmail.com',
    action: 'edit_profile',
    description: 'Updated Brand profile details & RERA Registration number',
    descriptionMarathi: 'ब्रँड प्रोफाईल व संपर्क माहिती अपडेट केली',
    timestamp: '2026-08-29T06:05:00.000Z',
    device: 'Android Chrome (OnePlus 12)',
    details: 'Profile: राजमुद्रा बिल्डर्स',
  },
];

export const SENDER_EMAIL = 'gunashreedigital@gmail.com';
export const SENDER_NAME = 'Gunashree Digital & GrowView';

export interface OtpRecord {
  email: string;
  code: string;
  purpose: 'register' | 'forgot_password';
  createdAt: number;
  expiresAt: number;
  userName?: string;
}

export interface EmailNotificationPayload {
  fromEmail: string;
  fromName: string;
  toEmail: string;
  subject: string;
  subjectMarathi: string;
  otpCode: string;
  purpose: 'register' | 'forgot_password';
  userName?: string;
  timestamp: string;
  deliveryMode?: 'live_resend' | 'resend_sandbox_restricted' | 'resend_error_fallback' | 'preview_simulation';
  serverMessage?: string;
  resendOwnerEmail?: string;
  isResendRestricted?: boolean;
}

// In-memory / localStorage storage for client verification
const OTP_STORAGE_KEY = 'growview_email_otps';

const getStoredOtps = (): OtpRecord[] => {
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY) || localStorage.getItem('design1123_email_otps');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading OTPs from localStorage:', e);
  }
  return [];
};

const saveStoredOtps = (otps: OtpRecord[]) => {
  try {
    // filter out records older than 15 minutes
    const now = Date.now();
    const clean = otps.filter((o) => now - o.createdAt < 15 * 60 * 1000);
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(clean));
  } catch (e) {
    console.warn('Error saving OTPs:', e);
  }
};

/**
 * Generate 6-digit OTP and trigger email dispatch
 */
export const dispatchEmailOtp = async (
  email: string,
  purpose: 'register' | 'forgot_password',
  userName?: string
): Promise<{ success: boolean; code: string; message: string; payload: EmailNotificationPayload }> => {
  const cleanEmail = email.trim().toLowerCase();
  // Generate cryptographically-strong looking 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity

  const record: OtpRecord = {
    email: cleanEmail,
    code,
    purpose,
    createdAt: now,
    expiresAt,
    userName: userName || (purpose === 'register' ? 'नवीन ग्राहक' : 'वापरकर्ता'),
  };

  // Update local storage
  const existing = getStoredOtps().filter((o) => !(o.email === cleanEmail && o.purpose === purpose));
  existing.push(record);
  saveStoredOtps(existing);

  const subject =
    purpose === 'register'
      ? `GrowView: Your Account Verification Code is ${code}`
      : `GrowView: Password Reset Code is ${code}`;

  const subjectMarathi =
    purpose === 'register'
      ? `नवीन खाते पडताळणी कोड: ${code} (GrowView)`
      : `पासवर्ड रिसेट पडताळणी कोड: ${code} (GrowView)`;

  const payload: EmailNotificationPayload = {
    fromEmail: SENDER_EMAIL,
    fromName: SENDER_NAME,
    toEmail: cleanEmail,
    subject,
    subjectMarathi,
    otpCode: code,
    purpose,
    userName: record.userName,
    timestamp: new Date().toISOString(),
  };

  // Attempt backend API call if server is accessible
  let deliveryMode: 'live_resend' | 'resend_sandbox_restricted' | 'resend_error_fallback' | 'preview_simulation' = 'preview_simulation';
  let serverMessage = '';
  let resendOwnerEmail = '';

  try {
    const res = await fetch('/api/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data) {
      if (data.deliveryMode) deliveryMode = data.deliveryMode;
      if (data.message) serverMessage = data.message;
      if (data.resendOwnerEmail) resendOwnerEmail = data.resendOwnerEmail;
    }
  } catch (e) {
    console.warn('Backend send-email-otp call failed:', e);
  }

  payload.deliveryMode = deliveryMode;
  payload.serverMessage = serverMessage;
  payload.resendOwnerEmail = resendOwnerEmail;
  payload.isResendRestricted = deliveryMode === 'resend_sandbox_restricted';

  // Screen OTP has been turned off per user request. No UI events dispatched.

  return {
    success: true,
    code,
    message: serverMessage || `Verification code generated for ${cleanEmail}`,
    payload,
  };
};

/**
 * Verify submitted OTP against stored code
 */
export const verifySubmittedOtp = (
  email: string,
  enteredCode: string,
  purpose: 'register' | 'forgot_password'
): { isValid: boolean; message: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = enteredCode.trim();

  if (!cleanCode || cleanCode.length !== 6) {
    return { isValid: false, message: 'कृपया ६ अंकी OTP कोड प्रविष्ट करा / Please enter 6-digit OTP' };
  }

  const records = getStoredOtps();
  const matched = records.find(
    (r) => r.email === cleanEmail && r.purpose === purpose
  );

  if (!matched) {
    return {
      isValid: false,
      message: 'या ईमेलसाठी कोणताही सक्रिय OTP सापडला नाही. कृपया पुन्हा OTP पाठवा.',
    };
  }

  if (Date.now() > matched.expiresAt) {
    return {
      isValid: false,
      message: 'हा OTP कालबाह्य (Expired) झाला आहे. कृपया "पुन्हा OTP पाठवा" वर क्लिक करा.',
    };
  }

  if (matched.code !== cleanCode) {
    return {
      isValid: false,
      message: 'चुकीचा OTP कोड! कृपया ईमेलमध्ये आलेला ६ अंकी कोड पुन्हा तपासा.',
    };
  }

  // Clear matched OTP after successful verification
  const remaining = records.filter((r) => r !== matched);
  saveStoredOtps(remaining);

  return { isValid: true, message: 'OTP पडताळणी यशस्वी झाली!' };
};

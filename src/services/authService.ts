import { UserAccount } from '../types';

const TOKEN_KEY = 'growview_auth_token';
const USER_KEY = 'growview_current_user';

export function getStoredAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error('Failed to store auth token:', err);
  }
}

export function clearStoredAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('growview_user_subscription_cache');
  } catch (err) {
    console.error('Failed to clear auth token:', err);
  }
}

export function getStoredUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.email) return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function setStoredUser(user: UserAccount): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to store user:', err);
  }
}

export async function loginWithCredentials(
  identifier: string,
  password: string
): Promise<{ user: UserAccount; token: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'लॉगिन अयशस्वी झाले. कृपया माहिती तपासा.');
  }

  setStoredAuthToken(data.token);
  setStoredUser(data.user);
  return { user: data.user, token: data.token };
}

export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string; code?: string }> {
  const res = await fetch('/api/auth/send-verification-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पडताळणी कोड पाठवण्यात त्रुटी आली.');
  }
  return data;
}

export async function verifyEmailCode(email: string, code: string): Promise<{ success: boolean; verified: boolean; message: string }> {
  const res = await fetch('/api/auth/verify-email-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'पडताळणी अयशस्वी झाली.');
  }
  return data;
}

export async function registerWithDetails(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName?: string;
  businessType?: string;
  city?: string;
  emailVerified?: boolean;
}): Promise<{ user: UserAccount; token: string }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'नोंदणी अयशस्वी झाली.');
  }

  setStoredAuthToken(data.token);
  setStoredUser(data.user);
  return { user: data.user, token: data.token };
}

export async function verifyCurrentSession(): Promise<UserAccount | null> {
  const token = getStoredAuthToken();
  if (!token) {
    clearStoredAuthToken();
    return null;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        setStoredUser(data.user);
        return data.user;
      }
    }
  } catch (err) {
    console.warn('[AUTH SERVICE] Session verification network error:', err);
  }

  // Token is invalid or expired
  clearStoredAuthToken();
  return null;
}

export async function logoutUser(): Promise<void> {
  const token = getStoredAuthToken();
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
    } catch {}
  }
  clearStoredAuthToken();
}

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { UserAccount } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

export interface StoredUser extends UserAccount {
  passwordHash: string;
  passwordSalt: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
  userEmail: string;
  role: string;
  createdAt: string;
  expiresAt: number; // timestamp in ms
}

interface AuthStore {
  users: Record<string, StoredUser>;
  sessions: Record<string, SessionRecord>;
}

// Cryptographic password hashing using PBKDF2 (SHA-512)
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const effectiveSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, effectiveSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: effectiveSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  const recalculated = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(recalculated, 'hex'), Buffer.from(hash, 'hex'));
}

function loadAuthStore(): AuthStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    let users: Record<string, StoredUser> = {};
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      users = JSON.parse(raw);
    } else {
      // Seed default accounts with secure initial credentials
      // Note: Admin credentials are protected and require valid password verification
      const adminCreds = hashPassword('GrowView@Admin2026#');
      const editorCreds = hashPassword('Editor@GrowView2026#');
      const contentCreds = hashPassword('Content@GrowView2026#');
      const ganeshCreds = hashPassword('Ganesh@Mart2026#');
      const rajmudraCreds = hashPassword('Rajmudra@Realty2026#');

      users = {
        'usr-admin-01': {
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
          passwordHash: adminCreds.hash,
          passwordSalt: adminCreds.salt,
        },
        'usr-editor-01': {
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
          passwordHash: editorCreds.hash,
          passwordSalt: editorCreds.salt,
        },
        'usr-content-01': {
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
          passwordHash: contentCreds.hash,
          passwordSalt: contentCreds.salt,
        },
        'usr-cust-01': {
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
          passwordHash: ganeshCreds.hash,
          passwordSalt: ganeshCreds.salt,
        },
        'usr-cust-02': {
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
          passwordHash: rajmudraCreds.hash,
          passwordSalt: rajmudraCreds.salt,
        },
      };
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    }

    let sessions: Record<string, SessionRecord> = {};
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      sessions = JSON.parse(raw);
    }

    return { users, sessions };
  } catch (err) {
    console.error('[AUTH ENGINE] Load store error:', err);
    return { users: {}, sessions: {} };
  }
}

function saveUsers(users: Record<string, StoredUser>) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AUTH ENGINE] Save users error:', err);
  }
}

function saveSessions(sessions: Record<string, SessionRecord>) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AUTH ENGINE] Save sessions error:', err);
  }
}

const authStore = loadAuthStore();

export function sanitizeUser(u: StoredUser): UserAccount {
  const { passwordHash, passwordSalt, ...clean } = u;
  return clean;
}

export function findUserByIdentifier(identifier: string): StoredUser | undefined {
  const clean = identifier.trim().toLowerCase();
  const digits = clean.replace(/\D/g, '');

  for (const user of Object.values(authStore.users)) {
    if (user.email.toLowerCase() === clean) return user;
    if (user.username && user.username.toLowerCase() === clean) return user;
    if (user.phone) {
      const userDigits = user.phone.replace(/\D/g, '');
      if (digits.length >= 10 && userDigits.slice(-10) === digits.slice(-10)) {
        return user;
      }
    }
  }
  return undefined;
}

export function createSession(user: StoredUser, rememberMe = true): SessionRecord {
  // 30 days if rememberMe, otherwise 24 hours
  const ttlMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const token = `gv_sess_${crypto.randomBytes(32).toString('hex')}`;
  const session: SessionRecord = {
    token,
    userId: user.id,
    userEmail: user.email,
    role: user.role,
    createdAt: new Date().toISOString(),
    expiresAt: Date.now() + ttlMs,
  };

  authStore.sessions[token] = session;
  saveSessions(authStore.sessions);
  return session;
}

export function validateSessionToken(token?: string): { valid: boolean; user?: UserAccount; error?: string } {
  if (!token) return { valid: false, error: 'Authentication required. No session token provided.' };

  const session = authStore.sessions[token];
  if (!session) {
    return { valid: false, error: 'Invalid or expired session. Please log in.' };
  }

  if (Date.now() > session.expiresAt) {
    delete authStore.sessions[token];
    saveSessions(authStore.sessions);
    return { valid: false, error: 'Session expired. Please log in again.' };
  }

  const user = authStore.users[session.userId];
  if (!user) {
    delete authStore.sessions[token];
    saveSessions(authStore.sessions);
    return { valid: false, error: 'User account not found.' };
  }

  if (user.status === 'suspended') {
    return { valid: false, error: 'Account suspended. Access denied.' };
  }

  return { valid: true, user: sanitizeUser(user) };
}

export function invalidateSession(token: string): boolean {
  if (authStore.sessions[token]) {
    delete authStore.sessions[token];
    saveSessions(authStore.sessions);
    return true;
  }
  return false;
}

export function authenticateUser(identifier: string, password: string): { user: UserAccount; session: SessionRecord } {
  if (!identifier || !identifier.trim() || !password || !password.trim()) {
    throw new Error('कृपया नोंदणीकृत ईमेल/मोबाईल आणि पासवर्ड प्रविष्ट करा.');
  }

  const user = findUserByIdentifier(identifier);
  if (!user) {
    throw new Error('⚠️ हे खाते नोंदणीकृत नाही! नोंदणी केल्याशिवाय लॉगिन करता येणार नाही.');
  }

  if (user.status === 'suspended') {
    throw new Error('हे खाते तात्पुरते निष्क्रिय (Suspended) केले गेले आहे. कृपया ॲडमिनशी संपर्क साधा.');
  }

  // Strictly verify password!
  const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!isValid) {
    throw new Error('पासवर्ड चुकीचा आहे! कृपया योग्य पासवर्ड प्रविष्ट करा.');
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString();
  saveUsers(authStore.users);

  const session = createSession(user, true);
  return { user: sanitizeUser(user), session };
}

export function registerUser(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName?: string;
  businessType?: string;
  city?: string;
}): { user: UserAccount; session: SessionRecord } {
  const { name, email, phone, password, businessName, businessType, city } = payload;

  if (!name || !name.trim()) throw new Error('कृपया आपले पूर्ण नाव प्रविष्ट करा.');
  if (!email || !email.trim() || !email.includes('@')) throw new Error('कृपया वैध ईमेल पत्ता प्रविष्ट करा.');

  const cleanPhone = (phone || '').replace(/\D/g, '');
  if (cleanPhone.length < 10) throw new Error('कृपया वैध १०-अंकी मोबाईल नंबर प्रविष्ट करा.');

  if (!password || password.length < 8) {
    throw new Error('पासवर्ड किमान ८ अक्षरांचा आणि सुरक्षित असावा.');
  }

  // Check unique constraints
  const existingEmail = findUserByIdentifier(email);
  if (existingEmail) {
    throw new Error('हा ईमेल पत्ता आधीच नोंदणीकृत आहे. कृपया लॉगिन करा.');
  }

  const existingPhone = findUserByIdentifier(cleanPhone);
  if (existingPhone) {
    throw new Error('हा मोबाईल नंबर आधीच नोंदणीकृत आहे. कृपया लॉगिन करा.');
  }

  const userId = `usr_cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const { hash, salt } = hashPassword(password);

  const newUser: StoredUser = {
    id: userId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: `+91 ${cleanPhone.slice(-10)}`,
    username: email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase(),
    businessName: businessName?.trim() || 'माझा व्यवसाय',
    businessType: businessType?.trim() || 'Retail & General Business',
    city: city?.trim() || 'Maharashtra, India',
    role: 'customer',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    totalDownloads: 0,
    passwordHash: hash,
    passwordSalt: salt,
  };

  authStore.users[userId] = newUser;
  saveUsers(authStore.users);

  const session = createSession(newUser, true);
  return { user: sanitizeUser(newUser), session };
}

export function getAllUsers(): UserAccount[] {
  return Object.values(authStore.users).map(sanitizeUser);
}

export function updateUserStatus(userId: string, status: 'active' | 'suspended'): UserAccount {
  const u = authStore.users[userId];
  if (!u) throw new Error('User not found');
  u.status = status;
  saveUsers(authStore.users);
  return sanitizeUser(u);
}

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BusinessProfile, CustomerActivityLog, PosterTemplate, UserAccount } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId to getFirestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling Specification as mandated by Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation Test
export async function testConnection(): Promise<boolean> {
  try {
    // Use getDoc with a gentle fallback so it does not block or timeout for 10s
    const testDocPromise = getDoc(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore connection check timeout')), 3000)
    );
    await Promise.race([testDocPromise, timeoutPromise]);
    return true;
  } catch (error) {
    // Soft fallback without throwing or triggering backend 10s warnings
    return false;
  }
}

// Google Sign-In with Popup
export async function signInWithGoogle(): Promise<{
  firebaseUser: FirebaseUser;
  userAccount: UserAccount;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const email = fbUser.email || '';
    const name = fbUser.displayName || email.split('@')[0] || 'User';

    const isAdminEmail =
      email.toLowerCase() === 'sonawanel.gaurav@gmail.com' ||
      email.toLowerCase() === 'gunashreedigital@gmail.com';

    const userAccount: UserAccount = {
      id: fbUser.uid,
      name,
      email,
      phone: fbUser.phoneNumber || '',
      businessName: `${name} Graphics & Business`,
      password: '', // Firebase OAuth handled
      role: isAdminEmail ? 'admin' : 'customer',
      adminRole: isAdminEmail ? 'super_admin' : undefined,
      status: 'active',
      emailVerified: fbUser.emailVerified,
      phoneVerified: Boolean(fbUser.phoneNumber),
      createdAt: new Date().toISOString(),
      avatarUrl: fbUser.photoURL || undefined,
      totalDownloads: 0,
      coins: 50,
      isPremium: isAdminEmail,
      subscriptionPlan: isAdminEmail ? 'lifetime' : 'free',
    };

    // Save to Firestore
    await saveUserToFirestore(userAccount);

    return { firebaseUser: fbUser, userAccount };
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

// Firestore Database Sync Operations

export async function saveUserToFirestore(user: UserAccount): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== user.id) {
    return;
  }
  const userPath = `users/${user.id}`;
  try {
    await setDoc(
      doc(db, 'users', user.id),
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        businessName: user.businessName || '',
        role: user.role,
        adminRole: user.adminRole || null,
        status: user.status || 'active',
        subscriptionPlan: user.subscriptionPlan || 'free',
        coins: user.coins || 0,
        totalDownloads: user.totalDownloads || 0,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('User cloud sync notice:', error);
  }
}

export async function getUserFromFirestore(userId: string): Promise<UserAccount | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return null;
  }
  const userPath = `users/${userId}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data() as UserAccount;
    }
    return null;
  } catch (error) {
    console.warn('User fetch notice:', error);
    return null;
  }
}

export async function saveBusinessProfileToFirestore(userId: string, profile: BusinessProfile): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return;
  }
  const path = `users/${userId}/profiles/${profile.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'profiles', profile.id), {
      ...profile,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Profile cloud sync notice:', error);
  }
}

export async function getBusinessProfilesFromFirestore(userId: string): Promise<BusinessProfile[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return [];
  }
  const path = `users/${userId}/profiles`;
  try {
    const qSnap = await getDocs(collection(db, 'users', userId, 'profiles'));
    const profiles: BusinessProfile[] = [];
    qSnap.forEach((d) => {
      profiles.push(d.data() as BusinessProfile);
    });
    return profiles;
  } catch (error) {
    console.warn('Profiles fetch notice:', error);
    return [];
  }
}

export async function saveActivityLogToFirestore(userId: string, log: CustomerActivityLog): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return;
  }
  const path = `users/${userId}/activityLogs/${log.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'activityLogs', log.id), {
      id: log.id,
      userId,
      userEmail: log.userEmail || '',
      actionType: log.actionType || 'activity',
      actionTitle: log.actionTitle || '',
      details: log.details || '',
      timestamp: log.timestamp || new Date().toISOString(),
    });
  } catch (error) {
    // Non-blocking log save
    console.warn('Activity log sync warning:', error);
  }
}

export async function saveTemplateToFirestore(template: PosterTemplate, authorId: string): Promise<void> {
  // Only attempt Firestore cloud write if user is authenticated with Firebase Auth
  if (!auth.currentUser) {
    return;
  }
  const effectiveAuthorId = auth.currentUser.uid;
  const path = `templates/${template.id}`;
  try {
    await setDoc(
      doc(db, 'templates', template.id),
      {
        id: template.id,
        title: template.title || 'Untitled Poster',
        category: template.category || 'festivals',
        authorId: effectiveAuthorId,
        isCustomUpload: Boolean(template.isCustomUpload),
        isPublished: true,
        isPremium: Boolean(template.isVIP),
        headline: template.headline || '',
        subtext: template.subtext || '',
        aspectRatio: template.aspectRatio || '1:1',
        downloadCount: template.downloadCount || 0,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    // Non-fatal warning so local state and editor are never interrupted
    console.warn('Template sync notice (local copy preserved):', error);
  }
}

export async function getCommunityTemplatesFromFirestore(): Promise<PosterTemplate[]> {
  const path = 'templates';
  try {
    const qSnap = await getDocs(query(collection(db, 'templates'), limit(50)));
    const list: PosterTemplate[] = [];
    qSnap.forEach((d) => {
      list.push(d.data() as PosterTemplate);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

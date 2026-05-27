import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import firebaseConfig from '../../../firebase-applet-config.json';

let app: FirebaseApp | undefined;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    } catch (error) {
      console.error('Firebase initialization error:', error);
      app = {} as FirebaseApp;
    }
  }
  return app;
}

export const db: Firestore = getFirestore(getFirebaseApp(), (firebaseConfig as { firestoreDatabaseId: string }).firestoreDatabaseId);
export const auth: Auth = getAuth(getFirebaseApp());

// Initialize App Check with user's reCAPTCHA v3 siteKey
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const siteKey = (firebaseConfig as { recaptchaSiteKey?: string }).recaptchaSiteKey;
  if (siteKey) {
    try {
      const isDev = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('ais-dev');
      if (isDev) {
        const win = window as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string };
        win.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        console.log('Firebase App Check: Local/Dev environment detected. App Check Debug Token enabled.');
      }
      initializeAppCheck(getFirebaseApp(), {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true
      });
      console.log('Firebase App Check initialized successfully using reCAPTCHA.');
    } catch (e) {
      console.warn('Could not initialize Firebase App Check (this is normal if reCAPTCHA script fails to load):', e);
    }
  }
}

console.log('Firebase init module loaded');

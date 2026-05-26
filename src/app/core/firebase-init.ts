import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
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

console.log('Firebase init module loaded');

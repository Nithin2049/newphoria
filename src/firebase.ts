import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAHVxziVcl2tgHowEyu-I19yDALHOblIk4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'newphoria-c73c2.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'newphoria-c73c2',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'newphoria-c73c2.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '615698919659',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:615698919659:web:c1c1b4904f6d78eaab0eae',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-KGXV121T0L',
};

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;
let auth: Auth;
let initError: Error | null = null;

try {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      'Missing Firebase environment configuration. Please verify VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID in .env.local.'
    );
  }
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  initError = error as Error;
}

export { app, db, storage, auth, initError };
export default app!;

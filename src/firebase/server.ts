

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFirebaseConfig } from './config';

// This is a server-only module.
// It is used to initialize Firebase on the server-side for Server Actions and Server Components.

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

function initializeFirebase() {
  const firebaseConfig = getFirebaseConfig();
  if (getApps().length === 0) {
    if (!firebaseConfig.apiKey) {
      // Return a dummy object to satisfy type checks, but it won't be used
      // as getDb will throw an error. This prevents crashing during build.
      return;
    }
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  firestore = getFirestore(app);
  auth = getAuth(app);
}

// Initialize on module load
initializeFirebase();

export function getDb(): Firestore {
    if (!firestore) {
        throw new Error("Firestore is not initialized. Make sure your Firebase environment variables are set for your deployment.");
    }
    return firestore;
}

export function getAuthService(): Auth {
    if (!auth) {
        throw new Error("Firebase Auth is not initialized. Make sure your Firebase environment variables are set for your deployment.");
    }
    return auth;
}

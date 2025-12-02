import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFirebaseConfig } from './config';

// This is a server-only module.
// It is used to initialize Firebase on the server-side for Server Actions and Server Components.

let firebaseApp: FirebaseApp;

// This function initializes Firebase for the SERVER-SIDE and should only be called in server components or actions.
export function initializeFirebase() {
  if (getApps().length === 0) {
    const firebaseConfig = getFirebaseConfig();
    // Prevent initialization if the config is not available, which can happen during build time.
    if (!firebaseConfig.apiKey) {
      // In a real-world scenario, you might want to throw an error or handle this differently.
      // For this sample, we'll return a dummy object to avoid crashing the build.
      console.warn("Server-side Firebase config not available. Skipping initialization.");
      // @ts-ignore
      return { firebaseApp: null, firestore: null, auth: null };
    }
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  
  return { firebaseApp, firestore, auth };
}

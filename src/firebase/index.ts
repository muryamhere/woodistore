import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFirebaseConfig } from './config';

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

// This function initializes Firebase for the CLIENT-SIDE and should only be called in client components.
function initializeFirebase() {
  if (getApps().length === 0) {
    const firebaseConfig = getFirebaseConfig();
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  return { firebaseApp, firestore, auth };
}

// We are NOT exporting the initialized instances directly to prevent them from being used on the server.
// Instead, components should use the `useFirebase` hooks from the provider.
export { initializeFirebase };
export * from './provider';

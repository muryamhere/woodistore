import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFirebaseConfig } from './config';

// This is a server-only module.
// It is used to initialize Firebase on the server-side for Server Actions and Server Components.

let firebaseApp: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

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

// Export the initialized services for server-side use.
const initialized = initializeFirebase();
firebaseApp = initialized.firebaseApp;
firestore = initialized.firestore;
auth = initialized.auth;

export { firebaseApp, firestore, auth };

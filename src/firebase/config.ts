
import { FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// This function is used to get the Firebase config.
export function getFirebaseConfig() {
  // If we are in the browser (client-side) OR in a build that requires keys,
  // check if the key exists.
  if (!firebaseConfig.apiKey) {
    // If valid keys are missing, throw an error immediately so you know WHY it failed.
    // Don't swallow the error.
    throw new Error(
      `Firebase API Key is missing! 
       Make sure you have a .env.local file with NEXT_PUBLIC_FIREBASE_API_KEY defined.`
    );
  }

  return firebaseConfig;
}

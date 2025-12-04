
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
  // During the build process on the server, env variables might not be available.
  // This check prevents errors during the build.
  if (!firebaseConfig.apiKey && process.env.NODE_ENV === 'production') {
    // In production build, we expect the variables to be set in the environment.
    // Returning an empty object or null could be an option if you have a fallback mechanism.
    // However, throwing an error during development is better to catch missing configuration early.
    if(process.env.NODE_ENV === 'development') {
      throw new Error('Missing Firebase environment variables. Please check your .env file.');
    }
  }
  return firebaseConfig;
}

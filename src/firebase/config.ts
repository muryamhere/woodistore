
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
  // 1. Validate the critical key exists
  if (!firebaseConfig.apiKey) {
    // 2. If it's missing, SCREAM about it. Don't fail silently.
    throw new Error(
      `CRITICAL ERROR: Your Firebase API Key is missing. This is required for the app to connect to Firebase.

       TROUBLESHOOTING:
       1. LOCAL: Ensure you have a .env.local file in the root of your project.
       2. VERCEL: Go to your Project Settings > Environment Variables on Vercel and add all variables starting with 'NEXT_PUBLIC_'.
       3. All Firebase environment variables *must* be prefixed with 'NEXT_PUBLIC_' to be accessible.
       
       Example: NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
       
       After adding the variables, you must redeploy on Vercel or restart your local server.`
    );
  }
  
  return firebaseConfig;
}

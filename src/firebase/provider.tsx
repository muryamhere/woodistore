'use client';
import { createContext, useContext, ReactNode, useMemo } from 'react';
import { initializeFirebase } from './index';

// Initialize Firebase and create a context for it.
const FirebaseContext = createContext<ReturnType<typeof initializeFirebase> | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // useMemo ensures that initializeFirebase is only called once per render.
  const value = useMemo(() => initializeFirebase(), []);
  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

// Custom hook to use the Firebase context.
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Export individual hooks for convenience.
export const useFirebaseApp = () => useFirebase().firebaseApp;
export const useFirestore = () => useFirebase().firestore;
export const useAuth = () => useFirebase().auth;

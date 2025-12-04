'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const isAuthPage = pathname === '/admin/login';

    if (!user && !isAuthPage) {
      router.push('/admin/login');
    } else if (user && isAuthPage) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, pathname, router]);

  // If loading, or if we are about to redirect, show a loader
  const isAuthPage = pathname === '/admin/login';
  if (loading || (!user && !isAuthPage) || (user && isAuthPage)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is authenticated and not on the login page, show the children
  return <>{children}</>;
}

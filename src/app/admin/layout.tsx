import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import { AuthProvider } from './auth-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <FirebaseProvider>
        <div className='font-sans antialiased'>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </div>
      </FirebaseProvider>
  );
}

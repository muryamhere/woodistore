
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type { SiteContent } from '@/lib/types';
import { getSiteContent } from '@/lib/firebase-actions';
import { AdminLogosForm } from './_components/admin-logos-form';
import { Separator } from '@/components/ui/separator';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const content = await getSiteContent();
        setSiteContent(content);
      } catch (error) {
        console.error("Failed to fetch site content:", error);
      } finally {
        setLoadingContent(false);
      }
    }
    fetchContent();
  }, []);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const { formState: { isSubmitting } } = form;
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };


  const onSubmit = async (data: PasswordFormValues) => {
    if (!user || !user.email) {
      toast({ variant: 'destructive', title: 'Error', description: 'No user is signed in.' });
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      // Re-authenticate the user to ensure they are who they say they are
      await reauthenticateWithCredential(user, credential);
      
      // If re-authentication is successful, update the password
      await updatePassword(user, data.newPassword);
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      form.reset();
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.code === 'auth/wrong-password' ? 'The current password you entered is incorrect.' : error.message,
      });
    }
  };
  
  if (!user || loadingContent) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  const contentToEdit: SiteContent = {
    ...(siteContent || {}),
    hero: siteContent?.hero || { title: '', subtitle: '', image: { id: '', url: '', alt: '', hint: ''}},
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your profile and admin panel appearance.</p>
       </div>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{getInitials(user.email)}</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-2xl font-bold font-headline">{user.displayName || 'Admin User'}</h2>
            <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Enter your current password and a new password to update your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <AdminLogosForm content={contentToEdit} />
    </div>
  );
}

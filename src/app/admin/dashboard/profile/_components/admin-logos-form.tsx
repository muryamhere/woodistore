
// This is a new file src/app/admin/dashboard/profile/_components/admin-logos-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateAdminLogos } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

const logosSchema = z.object({
  adminLogoLight: z.any().optional(),
  adminLogoDark: z.any().optional(),
  adminLogoShort: z.any().optional(),
});

type LogosFormValues = z.infer<typeof logosSchema>;

const LogoUploader = ({ name, label, content, currentLogo, preview, bgClass = 'bg-white', isSquare = false }: any) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">{label}</h3>
       <div className={`p-4 border rounded-lg flex items-center justify-center ${bgClass} ${isSquare ? 'h-24 w-24' : 'h-24'}`}>
          {preview ? (
            <Image src={preview} alt={`${label} preview`} width={isSquare ? 80 : 150} height={isSquare ? 80 : 40} className="object-contain" />
          ) : currentLogo ? (
            <Image
              src={currentLogo.url}
              alt={currentLogo.alt ?? label}
              width={isSquare ? 80 : 150}
              height={isSquare ? 80 : 40}
              className="object-contain"
              data-ai-hint={currentLogo.hint}
            />
          ) : <div className="text-sm text-muted-foreground text-center">No Logo Set</div>}
        </div>
      <FormField
        control={content}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormControl>
               <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};


export function AdminLogosForm({ content }: { content: SiteContent }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<LogosFormValues>({
    resolver: zodResolver(logosSchema),
  });

  const { watch, formState: { isSubmitting } } = form;
  
  const watchedFiles = watch();

  const previews = {
    adminLogoLight: watchedFiles.adminLogoLight?.[0] ? URL.createObjectURL(watchedFiles.adminLogoLight[0]) : null,
    adminLogoDark: watchedFiles.adminLogoDark?.[0] ? URL.createObjectURL(watchedFiles.adminLogoDark[0]) : null,
    adminLogoShort: watchedFiles.adminLogoShort?.[0] ? URL.createObjectURL(watchedFiles.adminLogoShort[0]) : null,
  };


  const onSubmit = async (data: LogosFormValues) => {
    const formData = new FormData();
    if (data.adminLogoLight?.[0]) formData.append('adminLogoLight', data.adminLogoLight[0]);
    if (data.adminLogoDark?.[0]) formData.append('adminLogoDark', data.adminLogoDark[0]);
    if (data.adminLogoShort?.[0]) formData.append('adminLogoShort', data.adminLogoShort[0]);

    if (Array.from(formData.keys()).length === 0) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select at least one logo to upload.',
      });
      return;
    }

    try {
      await updateAdminLogos(formData);
      toast({
        title: 'Admin Logos Updated',
        description: 'Your new logos have been saved.',
      });
      router.refresh();
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating your logos.',
      });
      console.error('Failed to update logos:', error);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
          <CardHeader>
            <CardTitle>Admin Panel Logos</CardTitle>
            <CardDescription>Update the logos for the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">
              <LogoUploader name="adminLogoDark" label="Dark Logo (for light bg)" content={form.control} currentLogo={content.adminLogoDark} preview={previews.adminLogoDark} bgClass="bg-white" />
              <LogoUploader name="adminLogoLight" label="Light Logo (for dark bg)" content={form.control} currentLogo={content.adminLogoLight} preview={previews.adminLogoLight} bgClass="bg-gray-800" />
              <LogoUploader name="adminLogoShort" label="Collapsed/Short Logo" content={form.control} currentLogo={content.adminLogoShort} preview={previews.adminLogoShort} bgClass="bg-muted" isSquare={true} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Admin Logos
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

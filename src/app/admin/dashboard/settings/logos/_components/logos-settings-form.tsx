
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateAllLogos } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

const logosSchema = z.object({
  headerLogoLight: z.any().optional(),
  headerLogoDark: z.any().optional(),
  footerLogoLight: z.any().optional(),
  footerLogoDark: z.any().optional(),
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


export function LogosSettingsForm({ content }: { content: SiteContent }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<LogosFormValues>({
    resolver: zodResolver(logosSchema),
  });

  const { watch, formState: { isSubmitting } } = form;
  
  const watchedFiles = watch();

  const previews = {
    headerLogoLight: watchedFiles.headerLogoLight?.[0] ? URL.createObjectURL(watchedFiles.headerLogoLight[0]) : null,
    headerLogoDark: watchedFiles.headerLogoDark?.[0] ? URL.createObjectURL(watchedFiles.headerLogoDark[0]) : null,
    footerLogoLight: watchedFiles.footerLogoLight?.[0] ? URL.createObjectURL(watchedFiles.footerLogoLight[0]) : null,
    footerLogoDark: watchedFiles.footerLogoDark?.[0] ? URL.createObjectURL(watchedFiles.footerLogoDark[0]) : null,
  };


  const onSubmit = async (data: LogosFormValues) => {
    const formData = new FormData();
    if (data.headerLogoLight?.[0]) formData.append('headerLogoLight', data.headerLogoLight[0]);
    if (data.headerLogoDark?.[0]) formData.append('headerLogoDark', data.headerLogoDark[0]);
    if (data.footerLogoLight?.[0]) formData.append('footerLogoLight', data.footerLogoLight[0]);
    if (data.footerLogoDark?.[0]) formData.append('footerLogoDark', data.footerLogoDark[0]);

    if (Array.from(formData.keys()).length === 0) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select at least one logo to upload.',
      });
      return;
    }

    try {
      await updateAllLogos(formData);
      toast({
        title: 'Logos Updated',
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
            <CardTitle>Public Site Logos</CardTitle>
            <CardDescription>Update your site's logos for the public-facing header and footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Header Logos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4">
                <LogoUploader name="headerLogoLight" label="Light Logo (for dark backgrounds)" content={form.control} currentLogo={content.headerLogoLight} preview={previews.headerLogoLight} bgClass="bg-gray-800" />
                <LogoUploader name="headerLogoDark" label="Dark Logo (for light backgrounds)" content={form.control} currentLogo={content.headerLogoDark} preview={previews.headerLogoDark} bgClass="bg-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Footer Logos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4">
                <LogoUploader name="footerLogoLight" label="Light Logo (for dark backgrounds)" content={form.control} currentLogo={content.footerLogoLight} preview={previews.footerLogoLight} bgClass="bg-gray-800" />
                <LogoUploader name="footerLogoDark" label="Dark Logo (for light backgrounds)" content={form.control} currentLogo={content.footerLogoDark} preview={previews.footerLogoDark} bgClass="bg-white" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Site Logos
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

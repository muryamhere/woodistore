
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateHeaderLogo } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

const brandingSchema = z.object({
  headerLogoLight: z.any().optional(),
  headerLogoDark: z.any().optional(),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

export function BrandingSettingsForm({ content }: { content: SiteContent }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
  });

  const { watch, formState: { isSubmitting } } = form;

  const lightFile = watch('headerLogoLight');
  const darkFile = watch('headerLogoDark');

  const lightPreview = lightFile?.[0] ? URL.createObjectURL(lightFile[0]) : null;
  const darkPreview = darkFile?.[0] ? URL.createObjectURL(darkFile[0]) : null;


  const onSubmit = async (data: BrandingFormValues) => {
    const formData = new FormData();
    if (data.headerLogoLight?.[0]) {
      formData.append('headerLogoLight', data.headerLogoLight[0]);
    }
    if (data.headerLogoDark?.[0]) {
      formData.append('headerLogoDark', data.headerLogoDark[0]);
    }

    if (!formData.has('headerLogoLight') && !formData.has('headerLogoDark')) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select at least one logo to upload.',
      });
      return;
    }

    try {
      await updateHeaderLogo(formData);
      toast({
        title: 'Header Logos Updated',
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
      console.error('Failed to update header logos:', error);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Update your site's logos for light and dark backgrounds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Light Logo Uploader */}
              <div className="space-y-2">
                <h3 className="font-medium">Light Logo (for dark backgrounds)</h3>
                <div className="p-4 border rounded-lg h-24 flex items-center justify-center bg-gray-800">
                  {lightPreview ? (
                    <Image src={lightPreview} alt="New light logo preview" width={150} height={40} className="object-contain" />
                  ) : content.headerLogoLight ? (
                    <Image
                      src={content.headerLogoLight.url}
                      alt={content.headerLogoLight.alt ?? 'Light Logo'}
                      width={150}
                      height={40}
                      className="object-contain"
                      data-ai-hint={content.headerLogoLight.hint}
                    />
                  ) : <div className="text-sm text-gray-400">No Light Logo Set</div>}
                </div>
                <FormField
                  control={form.control}
                  name="headerLogoLight"
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

              {/* Dark Logo Uploader */}
              <div className="space-y-2">
                <h3 className="font-medium">Dark Logo (for light backgrounds)</h3>
                 <div className="p-4 border rounded-lg h-24 flex items-center justify-center bg-white">
                    {darkPreview ? (
                      <Image src={darkPreview} alt="New dark logo preview" width={150} height={40} className="object-contain" />
                    ) : content.headerLogoDark ? (
                      <Image
                        src={content.headerLogoDark.url}
                        alt={content.headerLogoDark.alt ?? 'Dark Logo'}
                        width={150}
                        height={40}
                        className="object-contain"
                        data-ai-hint={content.headerLogoDark.hint}
                      />
                    ) : <div className="text-sm text-muted-foreground">No Dark Logo Set</div>}
                  </div>
                <FormField
                  control={form.control}
                  name="headerLogoDark"
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Logos
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

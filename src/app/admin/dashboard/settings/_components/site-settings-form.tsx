
'use client';

import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateHeaderLogo } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const headerLogoSchema = z.object({
  headerLogo: z
    .any()
    .refine(files => files?.length === 1, 'Logo is required.')
    .refine(files => files?.[0]?.size <= 1_000_000, `Max file size is 1MB.`)
    .refine(
      files => files?.[0]?.type === 'image/svg+xml',
      'Only .svg files are accepted for the logo.'
    ),
});

type HeaderLogoFormValues = z.infer<typeof headerLogoSchema>;

export function SiteSettingsForm({ content }: { content: SiteContent }) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<HeaderLogoFormValues>({
    resolver: zodResolver(headerLogoSchema),
  });

  const { isSubmitting } = useFormState({ control: form.control });

  const onSubmit = async (data: HeaderLogoFormValues) => {
    const formData = new FormData();
    if (data.headerLogo && data.headerLogo[0]) {
      formData.append('headerLogo', data.headerLogo[0]);
    } else {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select an SVG logo to upload.',
      });
      return;
    }

    try {
      await updateHeaderLogo(content, formData);
      toast({
        title: 'Header Logo Updated',
        description: 'Your new logo has been saved.',
      });
      router.refresh();
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating your logo.',
      });
      console.error('Failed to update header logo:', error);
    }
  };

  return (
    <Card>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
                <CardHeader>
                    <CardTitle>Branding</CardTitle>
                    <CardDescription>Update your site's logo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-4">Header Logo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <FormItem>
                            <FormLabel>Current Logo</FormLabel>
                            <div className="flex items-center justify-center p-4 aspect-video relative rounded-lg overflow-hidden border w-full bg-muted">
                                {content.headerLogo ? (
                                <Image
                                    src={content.headerLogo.url}
                                    alt={content.headerLogo.alt}
                                    width={200}
                                    height={50}
                                    className="object-contain"
                                    data-ai-hint={content.headerLogo.hint}
                                />
                                ) : (
                                <div className="text-sm text-muted-foreground">
                                    No Logo Set
                                </div>
                                )}
                            </div>
                            </FormItem>
                            <FormField
                            control={form.control}
                            name="headerLogo"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>New Header Logo (SVG)</FormLabel>
                                <FormControl>
                                    <Input type="file" accept="image/svg+xml" onChange={(e) => field.onChange(e.target.files)} />
                                </FormControl>
                                <FormDescription>Upload an SVG file for your logo. Max size 1MB.</FormDescription>
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
                        Save Logo
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

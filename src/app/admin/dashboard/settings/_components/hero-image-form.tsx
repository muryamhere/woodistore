

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateHeroImage } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageUploadWidget } from '@/components/ui/image-upload-widget';

const heroImageSchema = z.object({
  heroImage: z
    .any()
    .optional()
    .refine(file => !file || file instanceof File, 'Invalid file provided.')
    .refine(files => !files || files.size <= 7_000_000, `Max file size is 7MB.`)
    .refine(
      files => !files || ['image/jpeg', 'image/png', 'image/webp'].includes(files.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
});

type HeroImageFormValues = z.infer<typeof heroImageSchema>;

export function HeroImageForm({ content }: { content: SiteContent }) {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<HeroImageFormValues>({
    resolver: zodResolver(heroImageSchema),
  });

  const { formState: { isSubmitting }, watch } = form;
  const imageFile = watch('heroImage');

  useEffect(() => {
    if (imageFile instanceof File) {
      const file = imageFile;
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  const onSubmit = async (data: HeroImageFormValues) => {
    const formData = new FormData();
    if (data.heroImage instanceof File) {
      formData.append('heroImage', data.heroImage);
    } else {
        toast({
            variant: 'destructive',
            title: 'No image selected',
            description: 'Please select an image to update.',
        });
        return;
    }

    try {
      await updateHeroImage(content, formData);
      toast({
        title: 'Hero Image Updated',
        description: 'Your homepage hero image has been saved.',
      });
      router.refresh();
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating your hero image.',
      });
      console.error('Failed to update hero image:', error);
    }
  };

  return (
    <Card>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
                <CardHeader>
                    <CardTitle>Homepage Hero Image</CardTitle>
                    <CardDescription>Update the background image for the main section of your homepage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <FormItem>
                            <FormLabel>Current Hero Image</FormLabel>
                            <div className="aspect-video relative rounded-lg overflow-hidden border w-full">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="New hero preview" fill className="object-cover" />
                                ) : content.hero.image ? (
                                    <Image
                                        src={content.hero.image.url}
                                        alt={content.hero.image.alt}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={content.hero.image.hint}
                                    />
                                ) : (
                                <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                                    No Image
                                </div>
                                )}
                            </div>
                        </FormItem>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="heroImage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Hero Image</FormLabel>
                                        <FormControl>
                                            <ImageUploadWidget onImageCropped={field.onChange} aspect={16/9} />
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
                        Save Hero Image
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}

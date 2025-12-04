
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateAboutUsImages } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { AboutPageContent } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageUploadWidget } from '@/components/ui/image-upload-widget';

const imageSchema = z.any().optional();

const aboutUsImagesSchema = z.object({
  heroImage: imageSchema,
  philosophyImage: imageSchema,
  workshopImage: imageSchema,
});

type AboutUsImagesFormValues = z.infer<typeof aboutUsImagesSchema>;

const createPreview = (file: unknown): string | null => {
  if (file instanceof File) {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error creating object URL", error);
      return null;
    }
  }
  return null;
};

export function AboutUsImagesForm({ content }: { content: AboutPageContent }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<AboutUsImagesFormValues>({
    resolver: zodResolver(aboutUsImagesSchema),
  });

  const { formState: { isSubmitting }, watch } = form;

  const watchedFiles = watch();
  const heroPreview = createPreview(watchedFiles.heroImage);
  const philosophyPreview = createPreview(watchedFiles.philosophyImage);
  const workshopPreview = createPreview(watchedFiles.workshopImage);

  const onSubmit = async (data: AboutUsImagesFormValues) => {
    const formData = new FormData();
    if (data.heroImage instanceof File) formData.append('heroImage', data.heroImage);
    if (data.philosophyImage instanceof File) formData.append('philosophyImage', data.philosophyImage);
    if (data.workshopImage instanceof File) formData.append('workshopImage', data.workshopImage);

    if (formData.entries().next().done) {
        toast({
            variant: 'destructive',
            title: 'No images selected',
            description: 'Please select at least one image to update.',
        });
        return;
    }
    
    try {
      await updateAboutUsImages(content, formData);
      toast({
        title: 'About Us Images Updated',
        description: 'Your new images have been saved.',
      });
      router.refresh();
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating your images.',
      });
      console.error('Error updating images:', error);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
          <CardHeader>
            <CardTitle>About Us Page Images</CardTitle>
            <CardDescription>Update the images for the "About Us" page. Leave fields blank to keep current images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <div className="aspect-video relative rounded-lg overflow-hidden border w-full">
                      <Image src={heroPreview || content.heroImage?.url || '/placeholder.svg'} alt="Current hero image" fill className="object-cover" />
                    </div>
                    <FormControl>
                      <ImageUploadWidget onImageCropped={field.onChange} aspect={16/9}>
                        <Button type="button" variant="outline">Choose File</Button>
                      </ImageUploadWidget>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="philosophyImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Philosophy Section Image</FormLabel>
                    <div className="aspect-video relative rounded-lg overflow-hidden border w-full">
                      <Image src={philosophyPreview || content.philosophyImage?.url || '/placeholder.svg'} alt="Current philosophy image" fill className="object-cover" />
                    </div>
                    <FormControl>
                      <ImageUploadWidget onImageCropped={field.onChange} aspect={2/1}>
                        <Button type="button" variant="outline">Choose File</Button>
                      </ImageUploadWidget>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="workshopImage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>From Our Workshop Image</FormLabel>
                        <div className="aspect-video relative rounded-lg overflow-hidden border w-full">
                          <Image src={workshopPreview || content.workshopImage?.url || '/placeholder.svg'} alt="Current workshop image" fill className="object-cover" />
                        </div>
                        <FormControl>
                            <ImageUploadWidget onImageCropped={field.onChange} aspect={2/1}>
                                <Button type="button" variant="outline">Choose File</Button>
                            </ImageUploadWidget>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Images
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

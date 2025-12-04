

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateHomepageImages } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageUploadWidget } from '@/components/ui/image-upload-widget';

const imageSchema = z.any().optional();

const homepageImagesSchema = z.object({
  exploreImage1: imageSchema,
  exploreImage2: imageSchema,
  exploreImage3: imageSchema,
  craftsmanshipImage: imageSchema,
});

type HomepageImagesFormValues = z.infer<typeof homepageImagesSchema>;

// Helper to create a preview URL for a File object, or return null.
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

export function HomepageImagesForm({ content }: { content: SiteContent }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<HomepageImagesFormValues>({
    resolver: zodResolver(homepageImagesSchema),
  });

  const { formState: { isSubmitting }, watch } = form;

  const watchedFiles = watch();
  const preview1 = createPreview(watchedFiles.exploreImage1);
  const preview2 = createPreview(watchedFiles.exploreImage2);
  const preview3 = createPreview(watchedFiles.exploreImage3);
  const previewCraft = createPreview(watchedFiles.craftsmanshipImage);


  const onSubmit = async (data: HomepageImagesFormValues) => {
    const formData = new FormData();
    if (data.exploreImage1 instanceof File) formData.append('exploreImage1', data.exploreImage1, 'explore-1');
    if (data.exploreImage2 instanceof File) formData.append('exploreImage2', data.exploreImage2, 'explore-2');
    if (data.exploreImage3 instanceof File) formData.append('exploreImage3', data.exploreImage3, 'explore-3');
    if (data.craftsmanshipImage instanceof File) formData.append('craftsmanshipImage', data.craftsmanshipImage, 'craftsmanship');

    if (formData.entries().next().done) {
        toast({
            variant: 'destructive',
            title: 'No images selected',
            description: 'Please select at least one image to update.',
        });
        return;
    }
    
    try {
      await updateHomepageImages(content, formData);
      toast({
        title: 'Homepage Images Updated',
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
      console.error('Failed to update images:', error);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
          <CardHeader>
            <CardTitle>Homepage Section Images</CardTitle>
            <CardDescription>Update the images for various sections on your homepage. Leave fields blank to keep current images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Explore By Space Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="exploreImage1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{content.exploreSections?.[0]?.title || 'Home'}</FormLabel>
                      <div className="aspect-square relative rounded-lg overflow-hidden border w-full">
                        <Image src={preview1 || content.exploreSections?.[0]?.image.url || '/placeholder.svg'} alt="Current explore section image 1" fill className="object-cover" />
                      </div>
                      <FormControl>
                        <ImageUploadWidget onImageCropped={field.onChange} aspect={1}>
                          <Button type="button" variant="outline">Choose File</Button>
                        </ImageUploadWidget>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exploreImage2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{content.exploreSections?.[1]?.title || 'Kitchen'}</FormLabel>
                      <div className="aspect-square relative rounded-lg overflow-hidden border w-full">
                        <Image src={preview2 || content.exploreSections?.[1]?.image.url || '/placeholder.svg'} alt="Current explore section image 2" fill className="object-cover" />
                      </div>
                      <FormControl>
                        <ImageUploadWidget onImageCropped={field.onChange} aspect={1}>
                          <Button type="button" variant="outline">Choose File</Button>
                        </ImageUploadWidget>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exploreImage3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{content.exploreSections?.[2]?.title || 'Office'}</FormLabel>
                      <div className="aspect-square relative rounded-lg overflow-hidden border w-full">
                        <Image src={preview3 || content.exploreSections?.[2]?.image.url || '/placeholder.svg'} alt="Current explore section image 3" fill className="object-cover" />
                      </div>
                      <FormControl>
                        <ImageUploadWidget onImageCropped={field.onChange} aspect={1}>
                          <Button type="button" variant="outline">Choose File</Button>
                        </ImageUploadWidget>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Crafted with Character Section</h3>
               <FormField
                control={form.control}
                name="craftsmanshipImage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <div className="aspect-[3/1] relative rounded-lg overflow-hidden border w-full">
                          <Image src={previewCraft || content.craftsmanshipSection?.image.url || '/placeholder.svg'} alt="Current craftsmanship background" fill className="object-cover" />
                        </div>
                        <FormControl>
                            <ImageUploadWidget onImageCropped={field.onChange} aspect={3/1}>
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

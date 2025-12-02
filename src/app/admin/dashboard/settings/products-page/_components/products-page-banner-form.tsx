// This is a new file src/app/admin/dashboard/settings/products-page/_components/products-page-banner-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateProductsPageBanner } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { SiteContent } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageUploadWidget } from '@/components/ui/image-upload-widget';

const bannerSchema = z.object({
  banner1: z.any().optional(),
  banner2: z.any().optional(),
  banner3: z.any().optional(),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

export function ProductsPageBannerForm({ content }: { content: SiteContent }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
  });

  const { formState: { isSubmitting }, watch } = form;

  const watchedFiles = watch();
  
  const banners = content.productsPageBanners || [];

  const previews = {
      banner1: watchedFiles.banner1 instanceof File ? URL.createObjectURL(watchedFiles.banner1) : banners[0]?.url,
      banner2: watchedFiles.banner2 instanceof File ? URL.createObjectURL(watchedFiles.banner2) : banners[1]?.url,
      banner3: watchedFiles.banner3 instanceof File ? URL.createObjectURL(watchedFiles.banner3) : banners[2]?.url,
  }


  const onSubmit = async (data: BannerFormValues) => {
    const formData = new FormData();
    if (data.banner1 instanceof File) formData.append('banner1', data.banner1);
    if (data.banner2 instanceof File) formData.append('banner2', data.banner2);
    if (data.banner3 instanceof File) formData.append('banner3', data.banner3);


    if (!formData.entries().next().value) {
        toast({
            variant: 'destructive',
            title: 'No image selected',
            description: 'Please select an image to update.',
        });
        return;
    }

    try {
      await updateProductsPageBanner(content, formData);
      toast({
        title: 'Products Page Banner Updated',
        description: 'Your new banner image has been saved.',
      });
      router.refresh();
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating the banner.',
      });
      console.error('Error updating banner:', error);
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
          <CardHeader>
            <CardTitle>Products Page Banner</CardTitle>
            <CardDescription>Update the banner image for the main products listing page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3].map((num) => (
              <FormField
                key={num}
                control={form.control}
                name={`banner${num}` as keyof BannerFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image {num}</FormLabel>
                    <div className="aspect-[4/1] relative rounded-lg overflow-hidden border w-full max-w-4xl">
                      <Image 
                        src={previews[`banner${num}` as keyof typeof previews] || '/placeholder.svg'} 
                        alt={`Current banner image ${num}`} 
                        fill className="object-cover" 
                      />
                    </div>
                    <FormControl>
                      <ImageUploadWidget onImageCropped={field.onChange} aspect={4 / 1}>
                        <Button type="button" variant="outline">Choose File</Button>
                      </ImageUploadWidget>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Banners
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

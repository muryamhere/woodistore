

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateInSituImages } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import type { SiteContent, Product } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageUploadWidget } from '@/components/ui/image-upload-widget';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const imageSchema = z.any().optional();

const inSituImagesSchema = z.object({
  background: imageSchema,
  spot1: imageSchema,
  spot2: imageSchema,
  spot1ProductId: z.string().optional(),
  spot2ProductId: z.string().optional(),
});

type InSituImagesFormValues = z.infer<typeof inSituImagesSchema>;

// Helper to create a preview URL for a File object, or return null.
const createPreview = (file: unknown): string | null => {
  if (file instanceof File) {
    try {
      // Note: This creates a temporary URL. React will manage its lifecycle.
      // For more complex scenarios, manual cleanup with URL.revokeObjectURL might be needed.
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error creating object URL", error);
      return null;
    }
  }
  return null;
};


export function InSituImagesForm({ content, products }: { content: SiteContent, products: Product[] }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<InSituImagesFormValues>({
    resolver: zodResolver(inSituImagesSchema),
    defaultValues: {
      spot1ProductId: content.inSituSection?.spots?.[0]?.productId,
      spot2ProductId: content.inSituSection?.spots?.[1]?.productId,
    }
  });

  const { formState: { isSubmitting }, watch } = form;
  const watchedFiles = watch();

  const previews = {
      background: createPreview(watchedFiles.background),
      spot1: createPreview(watchedFiles.spot1),
      spot2: createPreview(watchedFiles.spot2),
  }

  const onSubmit = async (data: InSituImagesFormValues) => {
    const formData = new FormData();
    if (data.background instanceof File) formData.append('background', data.background);
    if (data.spot1 instanceof File) formData.append('spot1', data.spot1);
    if (data.spot2 instanceof File) formData.append('spot2', data.spot2);
    if (data.spot1ProductId) formData.append('spot1ProductId', data.spot1ProductId);
    if (data.spot2ProductId) formData.append('spot2ProductId', data.spot2ProductId);


    if (!formData.entries().next().value) {
        toast({
            variant: 'destructive',
            title: 'No changes detected',
            description: 'Please select an image or product to update.',
        });
        return;
    }
    
    try {
      await updateInSituImages(content, formData);
      toast({
        title: 'In-Situ Section Updated',
        description: 'Your new content has been saved.',
      });
      router.refresh();
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
            <CardTitle>In-Situ Products Section Images</CardTitle>
            <CardDescription>Update the images for the in-situ section on your homepage. Leave fields blank to keep current images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
             <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <div className="aspect-video relative rounded-lg overflow-hidden border w-full">
                          <Image src={previews.background || content.inSituSection?.background?.url || '/placeholder.svg'} alt="Current in-situ background" fill className="object-cover" />
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="spot1"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Spot 1 Image</FormLabel>
                            <div className="aspect-square relative rounded-lg overflow-hidden border w-full">
                                <Image src={previews.spot1 || content.inSituSection?.spots?.[0]?.image.url || '/placeholder.svg'} alt="Current Spot 1 Image" fill className="object-cover" />
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
                    name="spot1ProductId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spot 1 Product</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product to link" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="spot2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Spot 2 Image</FormLabel>
                            <div className="aspect-square relative rounded-lg overflow-hidden border w-full">
                                <Image src={previews.spot2 || content.inSituSection?.spots?.[1]?.image.url || '/placeholder.svg'} alt="Current Spot 2 Image" fill className="object-cover" />
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
                    name="spot2ProductId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spot 2 Product</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product to link" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}


// This is a new file src/app/admin/dashboard/settings/product-page/_components/product-page-settings-form.tsx
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateProductPageContent } from '@/lib/actions';
import { Loader2, Trash2 } from 'lucide-react';
import type { ProductPageContent, Guarantee, Testimonial } from '@/lib/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageUploadWidget } from '@/components/ui/image-upload-widget';
import { Separator } from '@/components/ui/separator';

const guaranteeSchema = z.object({
    icon: z.enum(['Truck', 'Clock', 'Globe', 'Recycle']),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
});

const testimonialSchema = z.object({
    quote: z.string().min(1, "Quote is required"),
    author: z.string().min(1, "Author is required"),
});

const productPageContentSchema = z.object({
  promoBannerImage: z.any().optional(),
  guarantees: z.array(guaranteeSchema),
  testimonials: z.array(testimonialSchema),
});

type FormValues = z.infer<typeof productPageContentSchema>;

export function ProductPageSettingsForm({ content }: { content: ProductPageContent }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(productPageContentSchema),
    defaultValues: {
        guarantees: content.guarantees || [],
        testimonials: content.testimonials || [],
    }
  });

  const { control, formState: { isSubmitting }, watch, handleSubmit } = form;

  const { fields: guaranteeFields, append: appendGuarantee, remove: removeGuarantee } = useFieldArray({ control, name: "guarantees" });
  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({ control, name: "testimonials" });

  const watchedBannerFile = watch('promoBannerImage');
  const bannerPreview = watchedBannerFile instanceof File ? URL.createObjectURL(watchedBannerFile) : null;

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    if (data.promoBannerImage instanceof File) {
      formData.append('promoBannerImage', data.promoBannerImage);
    }
    formData.append('guarantees', JSON.stringify(data.guarantees));
    formData.append('testimonials', JSON.stringify(data.testimonials));

    try {
      await updateProductPageContent(content, formData);
      toast({
        title: 'Product Page Content Updated',
        description: 'Your changes have been saved successfully.',
      });
      router.refresh();
      form.reset(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating the content.',
      });
      console.error('Error updating content:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Promotional Banner</CardTitle>
            <CardDescription>Update the promotional banner image displayed at the bottom of the product page.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={control}
              name="promoBannerImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <div className="aspect-video relative rounded-lg overflow-hidden border w-full max-w-2xl">
                    <Image src={bannerPreview || content.promoBannerImage?.url || '/placeholder.svg'} alt="Current promo banner" fill className="object-cover" />
                  </div>
                  <FormControl>
                    <ImageUploadWidget onImageCropped={field.onChange} aspect={16 / 9}>
                      <Button type="button" variant="outline">Choose File</Button>
                    </ImageUploadWidget>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Separator />

        <Card>
            <CardHeader>
                <CardTitle>Our Guarantees Section</CardTitle>
                <CardDescription>Manage the guarantees shown on the product page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {guaranteeFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-start p-4 border rounded-lg">
                        <FormField
                            control={control}
                            name={`guarantees.${index}.icon`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Truck">Truck</SelectItem>
                                            <SelectItem value="Clock">Clock</SelectItem>
                                            <SelectItem value="Globe">Globe</SelectItem>
                                            <SelectItem value="Recycle">Recycle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`guarantees.${index}.title`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={control}
                            name={`guarantees.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" className="mt-8" onClick={() => removeGuarantee(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendGuarantee({ icon: 'Truck', title: '', description: '' })}
                    disabled={guaranteeFields.length >= 4}
                >
                    Add Guarantee
                </Button>
            </CardContent>
        </Card>

        <Separator />
        
        <Card>
            <CardHeader>
                <CardTitle>Testimonials Section</CardTitle>
                <CardDescription>Manage the customer testimonials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {testimonialFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_auto] gap-4 items-start p-4 border rounded-lg">
                        <div className="space-y-4">
                            <FormField
                                control={control}
                                name={`testimonials.${index}.quote`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quote</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`testimonials.${index}.author`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Author</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTestimonial(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendTestimonial({ quote: '', author: '' })}
                >
                    Add Testimonial
                </Button>
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save All Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}

    
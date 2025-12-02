
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { updateProduct } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, Trash2, GripVertical } from 'lucide-react';
import type { Product, ImageAsset } from '@/lib/types';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ImageUploadWidget } from '@/components/ui/image-upload-widget';
import { cn } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer'),
  category: z.enum(['Furniture', 'Home Decor', 'Kitchenware', 'Toys']),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [existingImages, setExistingImages] = useState<ImageAsset[]>(product.images || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      stock: product.stock || 0,
      category: product.category || 'Furniture'
    },
  });

  const {formState: {isSubmitting}} = form;

  const handleFileChange = (file: File) => {
    if (existingImages.length + newImageFiles.length >= 5) {
      toast({ title: "Maximum images reached", description: "You can upload a maximum of 5 images.", variant: "destructive" });
      return;
    }
    setNewImageFiles(prev => [...prev, file]);
    const previewUrl = URL.createObjectURL(file);
    setNewImagePreviews(prev => [...prev, previewUrl]);
  };

  const setPrimaryImage = (index: number, isNew: boolean) => {
    if (isNew) {
      // This is complex to handle with previews. For simplicity, we can only set primary on existing images.
      // Or we can rebuild the state management. Let's do it simply for now.
      toast({ title: "Please save new images first", description: "You can set a primary image after saving the product."});
    } else {
        setExistingImages(currentImages => {
            return currentImages.map((img, i) => ({
                ...img,
                isPrimary: i === index
            }));
        });
    }
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  }


  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append('id', product.id);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('stock', String(data.stock));
    formData.append('category', data.category);

    formData.append('existingImagesData', JSON.stringify(existingImages));
    newImageFiles.forEach(file => {
        formData.append('newImages', file);
    });

    try {
      await updateProduct(formData);
      toast({
        title: 'Product Updated',
        description: `${data.name} has been successfully updated.`,
      });
      router.push('/admin/dashboard/products');
      router.refresh();
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating the product.',
      });
      console.error('Failed to update product:', error);
    }
  };

  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Edit Product</h1>
                <p className="text-muted-foreground">Update the details for &quot;{product.name}&quot;.</p>
            </div>
             <Button variant="outline" asChild>
                <Link href="/admin/dashboard/products">
                    Cancel
                </Link>
            </Button>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Modify the information and click save.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Artisan Oak Chair" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. A beautifully handcrafted chair made from solid oak..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <p className="text-sm text-muted-foreground">The first image is the primary one. Drag and drop to reorder.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image.id} className="relative group aspect-square border rounded-lg">
                        <Image src={image.url} alt={image.alt} fill className="object-cover rounded-lg" data-ai-hint={image.hint} />
                        <div className="absolute top-1 right-1 flex items-center gap-1">
                            <Button type="button" variant="outline" size="icon" className="h-7 w-7 bg-white/80 hover:bg-white cursor-pointer" onClick={() => setPrimaryImage(index, false)}>
                                <Star className={cn("h-4 w-4", image.isPrimary ? "text-yellow-400 fill-yellow-400" : "text-gray-400")} />
                            </Button>
                            <Button type="button" variant="destructive" size="icon" className="h-7 w-7" onClick={() => removeExistingImage(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                  ))}
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square border rounded-lg">
                        <Image src={preview} alt={`New image ${index + 1}`} fill className="object-cover rounded-lg" />
                         <div className="absolute top-1 right-1 flex items-center gap-1">
                            <Button type="button" variant="destructive" size="icon" className="h-7 w-7" onClick={() => removeNewImage(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                  ))}

                  {(existingImages.length + newImageFiles.length) < 5 && (
                    <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                        <ImageUploadWidget onImageCropped={handleFileChange} aspect={1}>
                             <div className="text-center p-2">
                                <p className="text-sm text-muted-foreground">Add Image</p>
                            </div>
                        </ImageUploadWidget>
                    </div>
                  )}
                </div>
              </FormItem>


              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g. 249.99" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="e.g. 15" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <select {...field} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                            <option value="Furniture">Furniture</option>
                            <option value="Home Decor">Home Decor</option>
                            <option value="Kitchenware">Kitchenware</option>
                            <option value="Toys">Toys</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <div className="flex justify-end gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { createProduct } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { ImageUploadWidget } from '@/components/ui/image-upload-widget';
import type { ImageAsset } from '@/lib/types';

const imageSchema = z.object({
  file: z.any().refine(file => file instanceof File, 'Image file is required.'),
  isPrimary: z.boolean().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer'),
  category: z.enum(['Furniture', 'Home Decor', 'Kitchenware', 'Toys']),
  sku: z.string().optional(),
  images: z.array(imageSchema).min(1, "At least one image is required."),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'Furniture',
      sku: '',
      images: [],
    },
  });
  
  const { control, handleSubmit, formState: { isSubmitting }, setValue } = form;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "images",
  });
  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFileChange = (file: File) => {
    if (fields.length >= 5) {
      toast({ title: "Maximum images reached", description: "You can upload a maximum of 5 images.", variant: "destructive" });
      return;
    }
    const isPrimary = fields.length === 0;
    append({ file: file, isPrimary: isPrimary });
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews(prev => [...prev, previewUrl]);
  };

  const setPrimaryImage = (index: number) => {
    fields.forEach((field, i) => {
      setValue(`images.${i}.isPrimary`, i === index);
    });
  };
  
  const removeImage = (index: number) => {
    remove(index);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('stock', String(data.stock));
    formData.append('category', data.category);
    if(data.sku) formData.append('sku', data.sku);

    const imagesData = data.images.map(img => ({ isPrimary: !!img.isPrimary }));
    formData.append('imagesData', JSON.stringify(imagesData));
    data.images.forEach((image) => {
        formData.append('images', image.file);
    });

    try {
      await createProduct(formData);
      toast({
        title: 'Product Created',
        description: `${data.name} has been added to the store.`,
      });
      router.push('/admin/dashboard/products');
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem creating the product.',
      });
      console.error('Failed to create product:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
                <p className="text-muted-foreground">Fill out the form to add a new product to your store.</p>
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
            Enter the information for the new product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={control}
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
                control={control}
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="relative group aspect-square border rounded-lg">
                      <Image src={imagePreviews[index]} alt={`Preview ${index + 1}`} fill className="object-cover rounded-lg" />
                      <div className="absolute top-1 right-1 flex items-center gap-1">
                          <Button type="button" variant="outline" size="icon" className="h-7 w-7 bg-white/80 hover:bg-white" onClick={() => setPrimaryImage(index)}>
                            <Star className={field.isPrimary ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} />
                          </Button>
                          <Button type="button" variant="destructive" size="icon" className="h-7 w-7" onClick={() => removeImage(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>
                    </div>
                  ))}
                   {fields.length < 5 && (
                    <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                        <ImageUploadWidget onImageCropped={handleFileChange} aspect={1}>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Add Image</p>
                            </div>
                        </ImageUploadWidget>
                    </div>
                   )}
                </div>
                 <FormMessage>{form.formState.errors.images?.message || form.formState.errors.images?.root?.message}</FormMessage>
              </FormItem>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                 <FormField
                    control={control}
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
                    control={control}
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
                    control={control}
                    name="sku"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g. OAK-CHR-01" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={control}
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
                    Add Product
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

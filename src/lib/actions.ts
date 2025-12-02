

'use server';

import 'dotenv/config';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { initializeFirebase as initializeServerFirebase } from '@/firebase/server';
import type { Product, LineItem, OrderStatus, SiteContent, ExploreSection, InSituSection, ImageAsset, AboutPageContent, TeamMember, ProductPageContent, Guarantee, Testimonial } from './types';
import { v4 as uuidv4 } from 'uuid';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to get the firestore instance for server actions
function getDb() {
  const { firestore } = initializeServerFirebase();
  if (!firestore) {
    throw new Error("Firestore is not initialized. Make sure your Firebase environment variables are set for your deployment.");
  }
  return firestore;
}

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock must be a non-negative integer'),
  category: z.enum(['Furniture', 'Home Decor', 'Kitchenware', 'Toys']),
  sku: z.string().optional(),
});

async function uploadImageToCloudinary(image: File, folder: string = 'woodistore-products') {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({folder, resource_type: 'auto'}, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        }).end(buffer);
    });
    return result as { secure_url: string, public_id: string };
}

export async function createProduct(formData: FormData) {
    const validatedFields = productSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
        throw new Error('Invalid product data.');
    }

    const imageFiles = formData.getAll('images') as File[];
    const imagesData = JSON.parse(formData.get('imagesData') as string || '[]') as ImageAsset[];

    if (imageFiles.length === 0) {
        throw new Error('At least one image is required.');
    }
    
    if (imagesData.length === 0) {
      // Fallback if imagesData is missing
      imagesData.push({ id: '', url: '', alt: validatedFields.data.name, hint: 'product image', isPrimary: true });
    }

    try {
        const uploadedImages = await Promise.all(
            imageFiles.map(async (file, index) => {
                const uploadedImage = await uploadImageToCloudinary(file);
                const imageData = imagesData[index] || {};
                return {
                    id: uploadedImage.public_id,
                    url: uploadedImage.secure_url,
                    alt: validatedFields.data.name,
                    hint: validatedFields.data.category.toLowerCase(),
                    isPrimary: imageData.isPrimary || false,
                };
            })
        );
        
        if (!uploadedImages.some(img => img.isPrimary)) {
            uploadedImages[0].isPrimary = true;
        }

        const newProductData = {
            ...validatedFields.data,
            images: uploadedImages,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        const firestore = getDb();
        const productsCollection = collection(firestore, 'products');
        await addDoc(productsCollection, newProductData);

        revalidatePath('/admin/dashboard/products');
        revalidatePath('/products');

    } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product.');
    }
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) {
    throw new Error('Product ID is required for update.');
  }
  
  const validatedFields = productSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
      throw new Error('Invalid product data.');
  }
  
  const { ...productData } = validatedFields.data;
  const newImageFiles = formData.getAll('newImages') as File[];
  const existingImagesData = JSON.parse(formData.get('existingImagesData') as string) as ImageAsset[];

  const firestore = getDb();
  const productRef = doc(firestore, 'products', id);

  try {
    let finalImages: ImageAsset[] = [...existingImagesData];
    
    if (newImageFiles.length > 0) {
        const uploadedImages = await Promise.all(
            newImageFiles.map(async (file) => {
                const uploadedImage = await uploadImageToCloudinary(file);
                return {
                    id: uploadedImage.public_id,
                    url: uploadedImage.secure_url,
                    alt: productData.name,
                    hint: productData.category.toLowerCase(),
                    isPrimary: false, 
                };
            })
        );
        finalImages.push(...uploadedImages);
    }
    
    // Ensure there is one and only one primary image
    const primaryImageExists = finalImages.some(img => img.isPrimary);
    if (!primaryImageExists && finalImages.length > 0) {
        finalImages[0].isPrimary = true;
    }
    if (finalImages.filter(img => img.isPrimary).length > 1) {
        let firstPrimaryFound = false;
        finalImages = finalImages.map(img => {
            if(img.isPrimary && !firstPrimaryFound) {
                firstPrimaryFound = true;
                return img;
            }
            return { ...img, isPrimary: false };
        });
    }
    
    const productUpdate: Partial<Omit<Product, 'id' | 'createdAt'>> & { updatedAt: any } = { 
        ...productData,
        images: finalImages,
        updatedAt: serverTimestamp(),
     };
    
    await updateDoc(productRef, productUpdate);

    revalidatePath('/admin/dashboard/products');
    revalidatePath(`/admin/dashboard/products/${id}/edit`);
    revalidatePath(`/products/${id}`);
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product.');
  }
}


export async function deleteProduct(productId: string, imagePublicId: string) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }
  
  const firestore = getDb();
  const productRef = doc(firestore, 'products', productId);

  try {
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) throw new Error("Product not found");

    const product = productSnap.data() as Product;
    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
        const publicIds = product.images.map(img => img.id);
        await cloudinary.api.delete_resources(publicIds);
    }

    // Delete from Firestore
    await deleteDoc(productRef);

    // Revalidate paths to reflect changes
    revalidatePath('/admin/dashboard/products');
    revalidatePath('/products');
    revalidatePath('/');

  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product.');
  }
}

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Invalid email address'),
  shippingAddress: z.string().min(10, 'A full address is required'),
});

export async function createOrder(formData: FormData, items: LineItem[], total: number) {
  const validatedFields = checkoutSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    // This is a simplified error handling. In a real app, you'd want to return these errors to the form.
    throw new Error(`Invalid checkout data: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`);
  }
  
  if (items.length === 0) {
      throw new Error("Cannot create an order with no items.");
  }

  const newOrder = {
    ...validatedFields.data,
    items,
    total,
    status: 'Pending' as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    trackingNumber: null,
  };

  try {
    const firestore = getDb();
    const ordersCollection = collection(firestore, 'orders');
    await addDoc(ordersCollection, newOrder);

    revalidatePath('/admin/dashboard/orders');
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order.');
  }
}


export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!orderId) {
    throw new Error('Order ID is required.');
  }

  const validStatuses: OrderStatus[] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const firestore = getDb();
  const orderRef = doc(firestore, 'orders', orderId);

  try {
    await updateDoc(orderRef, { 
        status,
        updatedAt: serverTimestamp()
     });
    revalidatePath('/admin/dashboard/orders');
    revalidatePath(`/admin/dashboard/orders/${orderId}`);
    revalidatePath('/admin/dashboard');
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status.');
  }
}

export async function updateHeaderLogo(formData: FormData) {
  const lightLogoFile = formData.get('headerLogoLight') as File | null;
  const darkLogoFile = formData.get('headerLogoDark') as File | null;

  if (!lightLogoFile && !darkLogoFile) {
    throw new Error('No logo files provided.');
  }
  
  const firestore = getDb();
  const contentRef = doc(firestore, 'site_content', 'homepage');
  
  try {
    const docSnap = await getDoc(contentRef);
    const currentContent = docSnap.exists() ? docSnap.data() : {};
    const newContent: Partial<SiteContent> = {};

    if (lightLogoFile) {
      const uploadedLight = await uploadImageToCloudinary(lightLogoFile, 'woodistore-site');
      newContent.headerLogoLight = {
        id: uploadedLight.public_id,
        url: uploadedLight.secure_url,
        alt: 'WoodiStore Light Logo',
        hint: 'company logo light',
      };
    }

    if (darkLogoFile) {
      const uploadedDark = await uploadImageToCloudinary(darkLogoFile, 'woodistore-site');
      newContent.headerLogoDark = {
        id: uploadedDark.public_id,
        url: uploadedDark.secure_url,
        alt: 'WoodiStore Dark Logo',
        hint: 'company logo dark',
      };
    }
    
    await setDoc(contentRef, { ...currentContent, ...newContent }, { merge: true });
    
    revalidatePath('/admin/dashboard/settings/branding');
    revalidatePath('/(shop)', 'layout');

  } catch (error) {
    console.error('Error updating header logos:', error);
    throw new Error('Failed to update header logos.');
  }
}

export async function updateAllLogos(formData: FormData) {
  const firestore = getDb();
  const contentRef = doc(firestore, 'site_content', 'homepage');
  
  try {
    const docSnap = await getDoc(contentRef);
    const currentContent = docSnap.exists() ? docSnap.data() : {};
    const newContent: Partial<SiteContent> = {};

    const logoFields: (keyof SiteContent)[] = ['headerLogoLight', 'headerLogoDark', 'footerLogoLight', 'footerLogoDark', 'adminLogoLight', 'adminLogoDark'];

    for (const field of logoFields) {
      const file = formData.get(field) as File | null;
      if (file) {
        const uploadedImage = await uploadImageToCloudinary(file, 'woodistore-site');
        (newContent as any)[field] = {
          id: uploadedImage.public_id,
          url: uploadedImage.secure_url,
          alt: `${field} logo`,
          hint: 'company logo'
        };
      }
    }
    
    if (Object.keys(newContent).length > 0) {
      await setDoc(contentRef, { ...currentContent, ...newContent }, { merge: true });
    }
    
    revalidatePath('/admin/dashboard/settings/logos');
    revalidatePath('/(shop)', 'layout');
    revalidatePath('/admin', 'layout');

  } catch (error) {
    console.error('Error updating logos:', error);
    throw new Error('Failed to update logos.');
  }
}

export async function updateHeroImage(currentState: SiteContent, formData: FormData) {
  const newHeroImage = formData.get('heroImage') as File | null;
  
  if (!newHeroImage || newHeroImage.size === 0) {
      throw new Error('No image file provided for hero.');
  }

  const firestore = getDb();
  const contentRef = doc(firestore, 'site_content', 'homepage');

  try {
      const uploadedImage = await uploadImageToCloudinary(newHeroImage, 'woodistore-site');
      
      const docSnap = await getDoc(contentRef);
      const currentContent = docSnap.exists() ? docSnap.data() : {};

      const newContent: Partial<SiteContent> = {
          hero: {
              ...(currentState.hero || {}),
              title: currentState.hero?.title || '',
              subtitle: currentState.hero?.subtitle || '',
              image: {
                  id: uploadedImage.public_id,
                  url: uploadedImage.secure_url,
                  alt: 'Homepage hero image',
                  hint: 'interior design',
              }
          }
      };

      await setDoc(contentRef, { ...currentContent, ...newContent }, { merge: true });

      revalidatePath('/'); // Revalidate homepage
      revalidatePath('/admin/dashboard/settings/homepage');
  } catch (error) {
      console.error('Error updating hero content:', error);
      throw new Error('Failed to update hero content.');
  }
}

export async function updateHomepageImages(currentState: SiteContent, formData: FormData) {
  const firestore = getDb();
  const contentRef = doc(firestore, 'site_content', 'homepage');
  
  const docSnap = await getDoc(contentRef);
  const currentContent = docSnap.exists() ? docSnap.data() as SiteContent : {};

  const exploreImage1 = formData.get('exploreImage1') as File | null;
  const exploreImage2 = formData.get('exploreImage2') as File | null;
  const exploreImage3 = formData.get('exploreImage3') as File | null;
  const craftsmanshipImage = formData.get('craftsmanshipImage') as File | null;

  try {
    const updatedExploreSections: ExploreSection[] = [...(currentContent.exploreSections || currentState.exploreSections || [])];
    
    if (exploreImage1) {
      const uploaded = await uploadImageToCloudinary(exploreImage1, 'woodistore-site');
      updatedExploreSections[0].image = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'A comfortable home setting with wooden furniture', hint: 'home furniture' };
    }
    if (exploreImage2) {
      const uploaded = await uploadImageToCloudinary(exploreImage2, 'woodistore-site');
      updatedExploreSections[1].image = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'A modern kitchen with wooden utensils and decor', hint: 'kitchen decor' };
    }
    if (exploreImage3) {
      const uploaded = await uploadImageToCloudinary(exploreImage3, 'woodistore-site');
      updatedExploreSections[2].image = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'A stylish office with a wooden desk and chair', hint: 'office furniture' };
    }

    const newContent: Partial<SiteContent> = { exploreSections: updatedExploreSections };

    if (craftsmanshipImage) {
      const uploaded = await uploadImageToCloudinary(craftsmanshipImage, 'woodistore-site');
      newContent.craftsmanshipSection = {
        image: { id: uploaded.public_id, url: uploaded.secure_url, alt: 'Detailed shot of woodworking craftsmanship', hint: 'woodworking detail' }
      };
    }
    
    await setDoc(contentRef, { ...currentContent, ...newContent }, { merge: true });

    revalidatePath('/');
    revalidatePath('/admin/dashboard/settings/homepage');

  } catch(error) {
    console.error('Error updating homepage images:', error);
    throw new Error('Failed to update homepage images.');
  }
}

export async function updateInSituImages(currentState: SiteContent, formData: FormData) {
  const firestore = getDb();
  const contentRef = doc(firestore, 'site_content', 'homepage');
  
  const docSnap = await getDoc(contentRef);
  const currentContent = docSnap.exists() ? docSnap.data() as SiteContent : {};

  const background = formData.get('background') as File | null;
  const spot1 = formData.get('spot1') as File | null;
  const spot2 = formData.get('spot2') as File | null;
  const spot1ProductId = formData.get('spot1ProductId') as string | null;
  const spot2ProductId = formData.get('spot2ProductId') as string | null;

  try {
    const updatedInSituSection: InSituSection = JSON.parse(JSON.stringify(currentContent.inSituSection || currentState.inSituSection || {}));

    if (background) {
      const uploaded = await uploadImageToCloudinary(background, 'woodistore-site');
      updatedInSituSection.background = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'A collection of handcrafted wooden items', hint: 'woodcrafts assortment' };
    }
    if (spot1) {
      const uploaded = await uploadImageToCloudinary(spot1, 'woodistore-site');
      updatedInSituSection.spots[0].image = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'Wooden Spice Box', hint: 'wooden spicebox' };
    }
    if (spot2) {
      const uploaded = await uploadImageToCloudinary(spot2, 'woodistore-site');
      updatedInSituSection.spots[1].image = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'Wooden Minar Replica', hint: 'wooden minaret' };
    }
    
    if (spot1ProductId) {
        updatedInSituSection.spots[0].productId = spot1ProductId;
    }
    if (spot2ProductId) {
        updatedInSituSection.spots[1].productId = spot2ProductId;
    }

    const newContent: Partial<SiteContent> = { inSituSection: updatedInSituSection };
    
    await setDoc(contentRef, { ...currentContent, ...newContent }, { merge: true });

    revalidatePath('/');
    revalidatePath('/admin/dashboard/settings/homepage');

  } catch(error) {
    console.error('Error updating in-situ images:', error);
    throw new Error('Failed to update in-situ images.');
  }
}

export async function updateAboutUsImages(currentState: AboutPageContent, formData: FormData) {
  const firestore = getDb();
  const contentRef = doc(firestore, 'site_content', 'about');
  
  const docSnap = await getDoc(contentRef);
  const currentContent = docSnap.exists() ? docSnap.data() as AboutPageContent : {};

  const heroImageFile = formData.get('heroImage') as File | null;
  const philosophyImageFile = formData.get('philosophyImage') as File | null;
  const workshopImageFile = formData.get('workshopImage') as File | null;

  try {
    const updatedAboutPageContent: AboutPageContent = { ...currentContent, ...currentState };

    if (heroImageFile) {
      const uploaded = await uploadImageToCloudinary(heroImageFile, 'woodistore-site');
      updatedAboutPageContent.heroImage = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'Close-up of beautiful wood grain', hint: 'wood texture' };
    }
    if (philosophyImageFile) {
      const uploaded = await uploadImageToCloudinary(philosophyImageFile, 'woodistore-site');
      updatedAboutPageContent.philosophyImage = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'Artisan woodworking tools laid out on a workbench', hint: 'woodworking tools' };
    }
    if (workshopImageFile) {
      const uploaded = await uploadImageToCloudinary(workshopImageFile, 'woodistore-site');
      updatedAboutPageContent.workshopImage = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'A bright and organized woodworking workshop', hint: 'woodworking workshop' };
    }

    await setDoc(contentRef, updatedAboutPageContent, { merge: true });

    revalidatePath('/about');
    revalidatePath('/admin/dashboard/settings/about');

  } catch(error) {
    console.error('Error updating About Us images:', error);
    throw new Error('Failed to update About Us images.');
  }
}

export async function updateAboutUsTeam(currentState: AboutPageContent, formData: FormData) {
  const firestore = getDb();
  const contentRef = doc(firestore, 'site_content', 'about');
  const docSnap = await getDoc(contentRef);
  const currentContent = docSnap.exists() ? docSnap.data() as AboutPageContent : {};
  
  const teamData = JSON.parse(formData.get('teamData') as string) as TeamMember[];

  try {
    const updatedTeam = await Promise.all(teamData.map(async (member) => {
      const newAvatarFile = formData.get(`avatar_${member.id}`) as File | null;
      let updatedMember = { ...member };
      
      // The client sends the File object in `newAvatar` property. We need to remove it before saving to Firestore.
      if ('newAvatar' in updatedMember) {
        delete (updatedMember as any).newAvatar;
      }
      
      if (newAvatarFile) {
        const uploaded = await uploadImageToCloudinary(newAvatarFile, 'woodistore-team');
        updatedMember.avatarUrl = uploaded.secure_url;
        // Optionally update an avatarId if you want to track it for deletion
      }
      return updatedMember;
    }));
    
    const updatedAboutPageContent: AboutPageContent = {
      ...(currentContent || currentState),
      team: updatedTeam,
    };
    
    await setDoc(contentRef, updatedAboutPageContent, { merge: true });

    revalidatePath('/about');
    revalidatePath('/admin/dashboard/settings/about');

  } catch(error) {
    console.error('Error updating About Us team:', error);
    throw new Error('Failed to update About Us team.');
  }
}

export async function updateProductPageContent(currentState: ProductPageContent, formData: FormData) {
    const firestore = getDb();
    const contentRef = doc(firestore, 'site_content', 'product_page');
    const docSnap = await getDoc(contentRef);
    const currentContent = docSnap.exists() ? docSnap.data() as ProductPageContent : {};

    const bannerImageFile = formData.get('promoBannerImage') as File | null;
    const guaranteesData = formData.get('guarantees') as string | null;
    const testimonialsData = formData.get('testimonials') as string | null;

    try {
        const newContent: ProductPageContent = { ...currentContent, ...currentState };

        if (bannerImageFile) {
            const uploaded = await uploadImageToCloudinary(bannerImageFile, 'woodistore-site');
            newContent.promoBannerImage = { id: uploaded.public_id, url: uploaded.secure_url, alt: 'Promotional banner', hint: 'home decor' };
        }

        if (guaranteesData) {
            newContent.guarantees = JSON.parse(guaranteesData);
        }

        if (testimonialsData) {
            newContent.testimonials = JSON.parse(testimonialsData);
        }

        await setDoc(contentRef, newContent, { merge: true });

        revalidatePath('/products/[id]', 'page');
        revalidatePath('/admin/dashboard/settings/product-page');
    } catch(error) {
        console.error('Error updating Product Page content:', error);
        throw new Error('Failed to update Product Page content.');
  }
}

export async function updateProductsPageBanner(currentState: SiteContent, formData: FormData) {
  const firestore = getDb();
  const contentRef = doc(firestore, 'site_content', 'homepage');
  
  const docSnap = await getDoc(contentRef);
  const currentContent = docSnap.exists() ? docSnap.data() as SiteContent : {};
  
  const newBanners: { file: File, id: string }[] = [
    { file: formData.get('banner1') as File, id: 'banner1' },
    { file: formData.get('banner2') as File, id: 'banner2' },
    { file: formData.get('banner3') as File, id: 'banner3' },
  ].filter(item => item.file instanceof File);
  
  if (newBanners.length === 0) {
      throw new Error('No image files provided for the banner.');
  }

  try {
      const updatedBanners = [...(currentContent.productsPageBanners || currentState.productsPageBanners || [])];
      
      for (const banner of newBanners) {
          const uploadedImage = await uploadImageToCloudinary(banner.file, 'woodistore-site');
          const bannerIndex = parseInt(banner.id.replace('banner', ''), 10) - 1;

          const newBannerData: ImageAsset = {
              id: uploadedImage.public_id,
              url: uploadedImage.secure_url,
              alt: `Products page banner ${bannerIndex + 1}`,
              hint: 'wooden products collection',
          };
          
          if (updatedBanners[bannerIndex]) {
              updatedBanners[bannerIndex] = newBannerData;
          } else {
              updatedBanners.push(newBannerData);
          }
      }

      const newContent: Partial<SiteContent> = {
          productsPageBanners: updatedBanners,
      };

      await setDoc(contentRef, { ...currentContent, ...newContent }, { merge: true });

      revalidatePath('/products');
      revalidatePath('/admin/dashboard/settings/products-page');
  } catch (error) {
      console.error('Error updating products page banner:', error);
      throw new Error('Failed to update products page banner.');
  }
}


// Stubs for actions not implemented in this step
export async function trackProductView(productId: string) {
  // console.log('Tracked view for product:', productId);
}

export async function getRecommendedProducts(currentProductId: string) {
    const { getProducts } = await import('./firebase-actions');
    const allProducts = await getProducts();
    
    return allProducts.filter(p => p.id !== currentProductId).slice(0, 4);
}

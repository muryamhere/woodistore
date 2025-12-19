

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

type ProductCardProps = {
  product: Product;
};

// Create a new type for the product card that uses a serializable timestamp
type SerializableProduct = Omit<Product, 'createdAt' | 'updatedAt'> & {
    createdAt: { seconds: number; nanoseconds: number; };
    updatedAt: { seconds: number; nanoseconds: number; };
}

export function ProductCard({ product }: { product: SerializableProduct }) {
  const formattedPrice = `Rs. ${product.price.toFixed(2)}`;

  const primaryImage = useMemo(() => {
    return product.images.find(img => img.isPrimary) || product.images[0];
  }, [product.images]);

  const secondaryImage = useMemo(() => {
    if (product.images.length < 2) return null;
    const secondary = product.images.find(img => !img.isPrimary);
    return secondary || product.images.find(img => img.id !== primaryImage.id);
  }, [product.images, primaryImage]);

  if (!primaryImage) {
    return null; // or a placeholder
  }

  return (
    <div className="group flex flex-col overflow-hidden h-full">
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block overflow-hidden aspect-square">
            {secondaryImage && (
                <Image
                    src={secondaryImage.url}
                    alt={secondaryImage.alt}
                    width={600}
                    height={600}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={secondaryImage.hint}
                />
            )}
            <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                width={600}
                height={600}
                className={cn(
                    "absolute inset-0 object-cover w-full h-full transition-all duration-300 group-hover:scale-105",
                    secondaryImage ? 'group-hover:opacity-0' : ''
                )}
                data-ai-hint={primaryImage.hint}
            />
        </Link>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full backdrop-blur-sm">
            <Heart className="h-5 w-5 text-primary"/>
        </Button>
      </div>
      <div className="mt-2 flex justify-between items-start text-sm">
        <h3 className="uppercase font-body flex-grow font-medium text-xs lg:text-sm">
            <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">{product.name}</Link>
        </h3>
        <p className="font-semibold font-body text-xs lg:text-sm">{formattedPrice}</p>
      </div>
    </div>
  );
}

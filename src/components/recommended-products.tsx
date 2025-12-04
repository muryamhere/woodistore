
'use client';

import { useEffect, useState } from 'react';
import { getRecommendedProducts } from '@/lib/actions';
import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';

export function RecommendedProducts({
  currentProductId,
}: {
  currentProductId: string;
}) {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      try {
        const recommendedProducts = await getRecommendedProducts(currentProductId);
        setRecommended(recommendedProducts);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommendations();
  }, [currentProductId]);

  if (loading) {
    return (
      <div className="mt-24">
        <h2 className="text-center font-headline text-4xl font-bold mb-12">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommended.length === 0) {
    return null;
  }

  return (
    <div className="mt-24">
      <h2 className="text-center font-headline text-4xl font-bold mb-12">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommended.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

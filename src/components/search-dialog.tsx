'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getDocs, collection } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

function SearchResult({ product, onSelect }: { product: Product; onSelect: () => void }) {
  return (
    <Link
      href={`/products/${product.id}`}
      onClick={onSelect}
      className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
    >
      <Image
        src={product.images[0].url}
        alt={product.images[0].alt}
        width={48}
        height={48}
        className="rounded-md object-cover"
        data-ai-hint={product.images[0].hint}
      />
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-muted-foreground">Rs. {product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

export function SearchDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const firestore = useFirestore();

  useEffect(() => {
    async function fetchProducts() {
      if (isOpen && allProducts.length === 0) {
        setLoading(true);
        try {
          const productsCollection = collection(firestore, 'products');
          const snapshot = await getDocs(productsCollection);
          if (!snapshot.empty) {
            const products = snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Product)
            );
            setAllProducts(products);
          }
        } catch (err) {
          console.error('Failed to fetch products for search', err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProducts();
  }, [isOpen, allProducts.length, firestore]);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return [];
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, allProducts]);

  const handleSelect = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search for Products</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="mt-4 min-h-[200px] max-h-[60vh] overflow-y-auto">
          {loading && query === '' && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {debouncedQuery && filteredProducts.length === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">
              No products found for &quot;{debouncedQuery}&quot;.
            </p>
          )}
          {filteredProducts.length > 0 && (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <SearchResult key={product.id} product={product} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

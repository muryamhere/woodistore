
'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/lib/types';
import { useState } from 'react';

export const AddToCartButton = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <Button size="lg" onClick={() => addToCart(product, quantity)}>
      Add to Cart
    </Button>
  );
};

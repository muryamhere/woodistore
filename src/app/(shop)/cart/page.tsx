
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, Loader2, ShoppingCart } from 'lucide-react';
import { getProducts } from '@/lib/firebase-actions';
import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import { SectionHeading } from '@/components/section-heading';

function QuickAddSection() {
    const [quickAddProducts, setQuickAddProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchQuickAddProducts() {
            try {
                setLoading(true);
                const allProducts = await getProducts();
                setQuickAddProducts(allProducts.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch products for quick add:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchQuickAddProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-12">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (quickAddProducts.length === 0) {
        return null;
    }

    return (
        <section className="mt-16 md:mt-24">
            <SectionHeading className="mb-8">Quick Add</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {quickAddProducts.map(product => (
                    <Card key={product.id}>
                        <CardContent className="p-0">
                             <Link href={`/products/${product.id}`} className="block overflow-hidden aspect-square relative">
                                <Image
                                    src={product.images[0].url}
                                    alt={product.images[0].alt}
                                    fill
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                    data-ai-hint={product.images[0].hint}
                                />
                            </Link>
                        </CardContent>
                        <CardFooter className="flex-col items-start p-4">
                             <h3 className="font-semibold text-base">{product.name}</h3>
                             <p className="text-muted-foreground">Rs. {product.price.toFixed(2)}</p>
                             <Button className="w-full" onClick={() => addToCart(product)}>
                                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                             </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}


export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  
  const formattedTotal = `Rs. ${cartTotal.toFixed(2)}`;

  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto py-12 md:py-24 px-4 md:px-0">
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild className="mt-6">
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
            <QuickAddSection />
        </div>
    );
  }

  return (
    <div className="container mx-auto py-12 md:py-16 px-4 md:px-0">
        <h1 className="font-headline text-4xl font-bold mb-8">Your Cart</h1>
          <div className="grid md:grid-cols-3 gap-12 w-full">
            <div className="md:col-span-2 space-y-6">
              {cartItems.map(item => (
                <Card key={item.product.id} className="flex items-center p-4">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.images[0].alt}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                    data-ai-hint={item.product.images[0].hint}
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">Rs. {item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input readOnly value={item.quantity} className="h-8 w-12 text-center" />
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rs. {(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="mt-2 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground mt-2">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formattedTotal}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        <QuickAddSection />
    </div>
  );
}

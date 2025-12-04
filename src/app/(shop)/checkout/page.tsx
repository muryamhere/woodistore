
'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/lib/actions';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Invalid email address'),
  shippingAddress: z.string().min(10, 'A full address is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { cartItems, cartTotal, clearCart } = useCart();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      shippingAddress: '',
    },
  });

  const {formState: {isSubmitting}} = form;
  const formattedTotal = `Rs. ${cartTotal.toFixed(2)}`;

  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting) {
      router.replace('/cart');
    }
  }, [cartItems, isSubmitting, router]);

  if (cartItems.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const onSubmit = async (data: CheckoutFormValues) => {
    const formData = new FormData();
    formData.append('customerName', data.customerName);
    formData.append('customerEmail', data.customerEmail);
    formData.append('shippingAddress', data.shippingAddress);

    const lineItems = cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
    }));

    try {
      await createOrder(formData, lineItems, cartTotal);
      toast({
        title: 'Order Placed!',
        description: "Thank you for your purchase. We'll notify you when it ships.",
      });
      clearCart();
      router.push('/'); // Redirect to home page after successful order
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem placing your order.',
      });
      console.error('Failed to create order:', error);
    }
  };

  return (
    <div className="container py-12 md:py-16 px-4 md:px-0">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-headline text-4xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your details to complete the purchase.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="123 Main St, Anytown, USA 12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                          <Image
                              src={item.product.images?.[0].url ?? ''}
                              alt={item.product.images?.[0].alt ?? item.product.name}
                              width={64}
                              height={64}
                              className="rounded-md object-cover"
                              data-ai-hint={item.product.images?.[0].hint}
                          />
                          <div>
                              <p className="font-semibold">{item.product.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                      </div>
                      <p className="font-medium">Rs. {(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formattedTotal}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" form="checkout-form" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Footer({ logoUrlDark }: { logoUrlDark?: string }) {

  const defaultLogoDark = "https://picsum.photos/seed/logo-dark/200/50";

  return (
    <footer className="bg-background text-foreground py-12 md:py-12">
      <div className="container pl-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="relative flex items-center" style={{ width: 200, height: 50 }}>
              <Image
                src={logoUrlDark || defaultLogoDark}
                alt="WoodiStore Dark Logo"
                width={200}
                height={50}
                className="object-contain"
              />
            </Link>
            <p className="text-foreground text-xs md:text-sm">
              Handcrafted wooden goods for the modern home.
            </p>
            <div className="mt-4">
                <h4 className="font-headline font-bold text-base md:text-lg mb-4">Follow Us</h4>
                <ul className="space-y-2">
                <li><a href="#" className="text-xs md:text-sm text-foreground hover:text-primary">Instagram</a></li>
                <li><a href="#" className="text-xs md:text-sm text-foreground hover:text-primary">Pinterest</a></li>
                <li><a href="#" className="text-xs md:text-sm text-foreground hover:text-primary">Facebook</a></li>
                </ul>
            </div>
          </div>
          <div>
            <h4 className="font-headline font-bold text-base md:text-lg mb-4">
              <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
            </h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-xs md:text-sm text-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="/products?category=Furniture" className="text-xs md:text-sm text-foreground hover:text-primary">Furniture</Link></li>
              <li><Link href="/products?category=Home+Decor" className="text-xs md:text-sm text-foreground hover:text-primary">Home Decor</Link></li>
              <li><Link href="/products?category=Kitchenware" className="text-xs md:text-sm text-foreground hover:text-primary">Kitchenware</Link></li>
              <li><Link href="/products?category=Toys" className="text-xs md:text-sm text-foreground hover:text-primary">Toys</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-base md:text-lg mb-4">
               <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            </h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-xs md:text-sm text-foreground hover:text-primary">Our Story</Link></li>
              <li><Link href="/contact" className="text-xs md:text-sm text-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/faq" className="text-xs md:text-sm text-foreground hover:text-primary">FAQ</Link></li>
              <li><Link href="/admin/dashboard" className="text-xs md:text-sm text-foreground hover:text-primary">Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-base md:text-lg mb-4">
               Support
            </h4>
            <ul className="space-y-2">
              <li><Link href="/warranty" className="text-xs md:text-sm text-foreground hover:text-primary">Warranty & Refund</Link></li>
              <li><Link href="/shipping-delivery" className="text-xs mdtext-sm text-foreground hover:text-primary">Shipping & Delivery</Link></li>
              <li><Link href="/privacy-policy" className="text-xs md:text-sm text-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="text-xs md:text-sm text-foreground hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
         <div className="mt-12">
            <h4 className="font-headline font-bold text-base md:text-lg mb-4">Join our circle for updates & new arrivals</h4>
            <form className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Enter email" className="bg-transparent" />
                <Button type="submit" variant="outline" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                </Button>
            </form>
        </div>
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-xs md:text-sm text-foreground">
            © {new Date().getFullYear()} WoodiStore. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

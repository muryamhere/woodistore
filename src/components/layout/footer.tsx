
'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Footer({ logoUrlDark }: { logoUrlDark?: string }) {

  const defaultLogoDark = "https://picsum.photos/seed/logo-dark/200/50";

  return (
    <footer className="bg-background text-foreground py-12 md:py-16">
      <div className="container px-4">
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
            <p className="text-muted-foreground text-sm">
              Handcrafted wooden goods for the modern home.
            </p>
          </div>
          <div>
            <h4 className="font-body font-bold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-body font-bold text-sm uppercase tracking-wider mb-4">
               Support
            </h4>
            <ul className="space-y-2">
              <li><Link href="/warranty" className="text-sm text-muted-foreground hover:text-primary">Warranty & Refund</Link></li>
              <li><Link href="/shipping-delivery" className="text-sm text-muted-foreground hover:text-primary">Shipping & Delivery</Link></li>
              <li><Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-primary">Admin Panel</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="text-sm text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>
           <div className="col-span-2 md:col-span-1">
            <h4 className="font-body font-bold text-sm uppercase tracking-wider mb-4">Join our circle</h4>
            <p className="text-muted-foreground text-sm mb-4">
                Get updates on new arrivals and special offers.
            </p>
            <form className="flex w-full max-w-sm items-center space-x-2">
                <Input type="email" placeholder="Enter your email" className="bg-transparent" />
                <Button type="submit" variant="outline" size="icon">
                    <ArrowUpRight className="h-4 w-4" />
                </Button>
            </form>
             <div className="mt-8">
                <h4 className="font-body font-bold text-sm uppercase tracking-wider mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Instagram</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Pinterest</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary">Facebook</a>
                </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex justify-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} WoodiStore. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

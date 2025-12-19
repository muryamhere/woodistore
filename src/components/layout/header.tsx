
'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '../ui/separator';
import { SearchDialog } from '@/components/search-dialog';
import { useUser } from '@/hooks/use-user';


export function Header({ logoUrlLight, logoUrlDark }: { logoUrlLight?: string, logoUrlDark?: string }) {
  const { cartCount, cartItems, cartTotal, removeFromCart } = useCart();
  const { user } = useUser();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  const formattedTotal = useMemo(() => `Rs. ${cartTotal.toFixed(2)}`, [cartTotal]);

  const defaultLogoLight = "https://picsum.photos/seed/logo-light/150/40";
  const defaultLogoDark = "https://picsum.photos/seed/logo-dark/150/40";

  return (
    <header className={cn(
        "top-0 left-0 w-full z-10 transition-colors duration-300",
        isHomePage ? "absolute text-white" : "sticky bg-background text-foreground border-b"
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center">
            <Link href="/" className="relative flex items-center gap-2" style={{ width: 150, height: 40 }}>
                <Image
                    src={logoUrlLight || defaultLogoLight}
                    alt="WoodiStore Light Logo"
                    width={150}
                    height={40}
                    className={cn("absolute inset-0 transition-opacity duration-300", isHomePage ? 'opacity-100' : 'opacity-0')}
                />
                <Image
                    src={logoUrlDark || defaultLogoDark}
                    alt="WoodiStore Dark Logo"
                    width={150}
                    height={40}
                    className={cn("absolute inset-0 transition-opacity duration-300", isHomePage ? 'opacity-0' : 'opacity-100')}
                />
            </Link>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-6">
          <DropdownMenu>
              <DropdownMenuTrigger className={cn("flex items-center gap-1 text-sm font-medium outline-none transition-colors duration-300", isHomePage ? "text-white hover:text-white/80" : "hover:text-foreground/80")}>
              Categories <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
              <DropdownMenuItem asChild><Link href="/products?category=Furniture">Furniture</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/products?category=Home+Decor">Home Decor</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/products?category=Kitchenware">Kitchenware</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/products?category=Toys">Toys</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/products">All Products</Link></DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/about" className={cn("text-sm font-medium transition-colors duration-300", isHomePage ? "text-white hover:text-white/80" : "hover:text-foreground/80")}>About us</Link>
          <Link href="/blog" className={cn("text-sm font-medium transition-colors duration-300", isHomePage ? "text-white hover:text-white/80" : "hover:text-foreground/80")}>Blog</Link>
          <Link href="/faq" className={cn("text-sm font-medium transition-colors duration-300", isHomePage ? "text-white hover:text-white/80" : "hover:text-foreground/80")}>FAQ</Link>
          <Link href="/contact" className={cn("text-sm font-medium transition-colors duration-300", isHomePage ? "text-white hover:text-white/80" : "hover:text-foreground/80")}>Contacts</Link>
        </nav>


        {/* Right Side: Actions */}
        <div className="flex items-center justify-end gap-2">
          <SearchDialog>
            <Button variant="ghost" size="icon" className={cn("transition-colors duration-300", isHomePage ? "text-white hover:bg-white/10" : "hover:bg-accent")}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </SearchDialog>
          
          <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("relative transition-colors duration-300", isHomePage ? "text-white hover:bg-white/10" : "hover:bg-accent")}>
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs bg-primary text-primary-foreground">
                        {cartCount}
                    </span>
                    )}
                    <span className="sr-only">Shopping Cart</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 text-foreground">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Shopping Cart</h4>
                        <p className="text-sm text-muted-foreground">
                            You have {cartCount} item(s) in your cart.
                        </p>
                    </div>
                     {cartItems.length > 0 ? (
                        <div className="grid gap-2">
                           <div className="max-h-60 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.product.id} className="flex items-center gap-4 py-2">
                                     <Image
                                        src={item.product.images?.[0].url ?? ''}
                                        alt={item.product.images?.[0].alt ?? item.product.name}
                                        width={48}
                                        height={48}
                                        className="rounded-md"
                                        data-ai-hint={item.product.images?.[0].hint}
                                    />
                                    <div className="flex-1">
                                        <h5 className="text-sm font-medium truncate">{item.product.name}</h5>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium">Rs. {(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                           </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-base">
                                <span>Subtotal:</span>
                                <span>{formattedTotal}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <Button variant="outline" asChild>
                                    <Link href="/cart">View Cart</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/checkout">Checkout</Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-4">Your cart is empty.</p>
                    )}
                </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="icon" asChild className={cn("transition-colors duration-300", isHomePage ? "text-white hover:bg-white/10" : "hover:bg-accent")}>
            <Link href={user ? "/account" : "/login"}>
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">Account</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

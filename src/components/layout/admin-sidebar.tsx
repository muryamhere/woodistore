
'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Store,
  User as UserIcon,
  Settings,
  ChevronDown,
  Home,
  Palette,
  Sparkles,
  BookUser,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { signOut, User } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Image from 'next/image';
import { getSiteContent } from '@/lib/firebase-actions';
import type { SiteContent } from '@/lib/types';


const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/dashboard/products', icon: Package, label: 'Products' },
  { href: '/admin/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/dashboard/customers', icon: Users, label: 'Customers' },
  { 
    label: 'Site Settings', 
    icon: Settings, 
    href: '/admin/dashboard/settings',
    subItems: [
        { href: '/admin/dashboard/settings/homepage', label: 'Homepage', icon: Home },
        { href: '/admin/dashboard/settings/about', label: 'About Page', icon: BookUser },
        { 
            label: 'Product Pages', 
            icon: Package, 
            href: '/admin/dashboard/settings/product-pages',
            subItems: [
                 { href: '/admin/dashboard/settings/product-page', label: 'Product Detail', icon: Package },
                 { href: '/admin/dashboard/settings/products-page', label: 'Product List', icon: Package },
            ]
        },
        { href: '/admin/dashboard/settings/branding', label: 'Branding', icon: Sparkles },
        { href: '/admin/dashboard/settings/logos', label: 'Logos', icon: ImageIcon },
        { href: '/admin/dashboard/settings/theme', label: 'Theme', icon: Palette },
    ]
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    async function fetchSiteContent() {
      const content = await getSiteContent();
      setSiteContent(content);
    }
    fetchSiteContent();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'There was an error logging you out.',
      });
    }
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  };

  const isActive = (href: string, isExact = false) => {
    if (isExact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };
  
  const renderNavItems = (items: any[], isSubmenu = false) => {
    return items.map((item, index) => {
        const itemIsActive = isActive(item.href);

        if (item.subItems) {
            return (
                 <Collapsible key={`${item.href}-${index}`} defaultOpen={itemIsActive}>
                    <CollapsibleTrigger className="w-full">
                         <div className={cn(
                            'flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground',
                             itemIsActive && !isSubmenu
                                ? 'bg-accent text-accent-foreground'
                                : '',
                             isSubmenu ? 'text-sm' : ''
                        )}>
                            <div className="flex items-center gap-3">
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </div>
                            <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className={cn("py-1", isSubmenu ? "pl-10" : "pl-6")}>
                        <div className="flex flex-col space-y-1">
                            {renderNavItems(item.subItems, true)}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )
        }

        return (
             <Link
                key={item.href}
                href={item.href}
                className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground',
                isActive(item.href, item.href === '/admin/dashboard')
                    ? 'bg-accent text-accent-foreground'
                    : '',
                isSubmenu ? 'text-sm' : ''
                )}
            >
                <item.icon className="h-4 w-4" />
                {item.label}
            </Link>
        )
    })
  }


  return (
    <aside className="sticky top-0 h-screen hidden w-64 flex-col border-r bg-secondary text-secondary-foreground md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 relative" style={{ width: 150, height: 40 }}>
            {siteContent?.adminLogoDark?.url ? (
                <Image
                    src={siteContent.adminLogoDark.url}
                    alt={siteContent.adminLogoDark.alt || 'Admin Logo'}
                    width={150}
                    height={40}
                    className="object-contain"
                />
            ) : (
                <span className="font-bold font-headline text-2xl text-primary">WoodiStore</span>
            )}
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {renderNavItems(navItems)}
      </nav>

      <div className="mt-auto border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-accent">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  {user?.photoURL && <AvatarImage src={user.photoURL} alt="Admin" />}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium truncate">
                    {user?.email ?? 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">
                <Store className="mr-2 h-4 w-4" />
                <span>Back to Shop</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

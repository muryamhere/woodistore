
'use client';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronDown,
  Home,
  Palette,
  BookUser,
  ImageIcon,
  Bell,
  SlidersHorizontal,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Image from 'next/image';
import { getSiteContent } from '@/lib/firebase-actions';
import type { SiteContent } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from '../ui/sidebar';

const mainNavItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/dashboard/products', icon: Package, label: 'Products' },
  { href: '/admin/dashboard/customers', icon: Users, label: 'Customers' },
  { href: '/admin/dashboard/notifications', icon: Bell, label: 'Notifications' },
];

const settingsNavItems = [
  { href: '/admin/dashboard/settings/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/dashboard/settings/about', label: 'About Page', icon: BookUser },
  { href: '/admin/dashboard/settings/product-page', label: 'Product Detail Page', icon: Package },
  { href: '/admin/dashboard/settings/products-page', label: 'Product List Page', icon: Package },
  { href: '/admin/dashboard/settings/logos', label: 'Site Logos', icon: ImageIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const { state: sidebarState } = useSidebar();
  
  const isSettingsActive = pathname.startsWith('/admin/dashboard/settings');
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);

  useEffect(() => {
    if (sidebarState === 'collapsed') {
      setIsSettingsOpen(false);
    }
  }, [sidebarState]);
  
  useEffect(() => {
    async function fetchSiteContent() {
      const content = await getSiteContent();
      setSiteContent(content);
    }
    fetchSiteContent();
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href;
    if (href === '/admin/dashboard/settings') return pathname.startsWith(href);
    return pathname.startsWith(href) && href !== '/admin/dashboard';
  };
  
  return (
    <Sidebar collapsible="icon">
        <SidebarHeader>
             <div className="flex h-14 items-center justify-between p-2 group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:py-2">
                 <Link href="/admin/dashboard" className="w-full group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center">
                    {/* Expanded Logo */}
                    <div className="hidden group-data-[state=expanded]:block">
                         {siteContent?.adminLogoDark?.url ? (
                            <div className="relative h-10 w-full">
                                <Image
                                    src={siteContent.adminLogoDark.url}
                                    alt={siteContent.adminLogoDark.alt || "Admin Logo"}
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                         ) : (
                            <span className="font-bold font-headline text-2xl text-primary">WoodiStore</span>
                         )}
                    </div>
                    {/* Collapsed Logo */}
                    <div className="hidden group-data-[state=collapsed]:block">
                         {siteContent?.adminLogoShort?.url ? (
                             <div className="relative h-8 w-8">
                                <Image
                                    src={siteContent.adminLogoShort.url}
                                    alt={siteContent.adminLogoShort.alt || "Admin Logo"}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                         ) : (
                            <div className="h-8 w-8 flex items-center justify-center bg-muted rounded-lg">
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                         )}
                    </div>
                </Link>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} className="w-full">
                            <SidebarMenuButton isActive={isActive(item.href)} tooltip={item.label}>
                                <item.icon />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
                
                 <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen} className="w-full">
                    <CollapsibleTrigger asChild>
                         <SidebarMenuButton className="w-full justify-between" isActive={isSettingsActive} tooltip="Site Settings">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal />
                                <span>Site Settings</span>
                            </div>
                            <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="py-1 pl-10">
                        <div className="flex flex-col space-y-1">
                            {settingsNavItems.map((subItem) => (
                                <SidebarMenuItem key={subItem.href}>
                                    <Link href={subItem.href} className="w-full">
                                        <SidebarMenuButton variant="ghost" size="sm" isActive={isActive(subItem.href)} tooltip={subItem.label}>
                                            <subItem.icon />
                                            <span>{subItem.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu className="flex flex-row items-center justify-between group-data-[collapsible=icon]:flex-col">
                <SidebarMenuItem className="flex-1">
                    <Link href="/admin/dashboard/profile" className="w-full">
                        <SidebarMenuButton tooltip="Settings">
                            <Settings />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarTrigger />
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}

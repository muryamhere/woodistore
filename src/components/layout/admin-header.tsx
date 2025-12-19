
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  Search,
  Store,
  User as UserIcon,
} from 'lucide-react';
import { AdminNotifications } from '../admin-notifications';
import { useAuth } from '@/firebase';
import { signOut, User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { SearchDialog } from '../search-dialog';


export function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const auth = useAuth();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const { state: sidebarState } = useSidebar();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return unsubscribe;
    }, [auth]);

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

    const breadcrumbs = useMemo(() => {
        const pathParts = pathname.split('/').filter(part => part);
        if (pathParts.length <= 1) return null; // No breadcrumbs on root admin page

        let href = '';
        const items = pathParts.map((part, index) => {
            href += `/${part}`;
            const isLast = index === pathParts.length - 1;
            return {
                href: isLast ? undefined : href,
                name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
            }
        });
        return items;
    }, [pathname]);

    return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger className="sm:hidden" />

        <div className="flex items-center gap-4">
             {breadcrumbs && (
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.href || crumb.name}>
                                <BreadcrumbItem>
                                    {crumb.href ? (
                                        <BreadcrumbLink asChild>
                                            <Link href={crumb.href}>{crumb.name}</Link>
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </div>
       
        <div className="relative ml-auto flex-1 md:grow-0">
          <SearchDialog>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  readOnly
                  type="search"
                  placeholder="Search..."
                  className="w-full cursor-pointer rounded-full bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
          </SearchDialog>
        </div>
        <AdminNotifications />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <Avatar className="h-8 w-8">
                        {user?.photoURL && <AvatarImage src={user.photoURL} alt="Admin" />}
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user?.email)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
    </header>
    );
}

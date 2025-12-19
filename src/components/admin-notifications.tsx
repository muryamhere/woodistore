
'use client';

import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot, query, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import type { Notification } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

function NotificationIcon({ type }: { type: Notification['type'] }) {
    switch (type) {
        case 'new_order':
            return <ShoppingCart className="h-4 w-4 text-primary" />;
        default:
            return <Bell className="h-4 w-4" />;
    }
}

export function AdminNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => {
        const notificationsRef = collection(firestore, 'notifications');
        const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(20));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications: Notification[] = [];
            let newUnreadCount = 0;
            snapshot.forEach((doc) => {
                const data = doc.data() as Omit<Notification, 'firestoreDocId'>;
                if (!data.isRead) {
                    newUnreadCount++;
                }
                newNotifications.push({ ...data, firestoreDocId: doc.id });
            });
            setNotifications(newNotifications);
            setUnreadCount(newUnreadCount);
        }, (error) => {
            console.error("Error fetching notifications:", error);
            toast({
                variant: 'destructive',
                title: 'Could not load notifications',
                description: 'There was an error connecting to the notification service.'
            })
        });

        return () => unsubscribe();
    }, [firestore, toast]);
    
    const handleMarkAsRead = async (firestoreDocId: string | undefined) => {
        if (!firestoreDocId) return;
        const notificationRef = doc(firestore, 'notifications', firestoreDocId);
        try {
            await updateDoc(notificationRef, { isRead: true });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs bg-destructive text-destructive-foreground">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
                <div className="p-4">
                    <h4 className="font-medium leading-none">Notifications</h4>
                    <p className="text-sm text-muted-foreground">You have {unreadCount} unread messages.</p>
                </div>
                <Separator />
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <Link 
                                key={notif.id} 
                                href={notif.href} 
                                className={cn(
                                    "flex items-start gap-4 p-4 transition-colors hover:bg-accent",
                                    !notif.isRead && "bg-accent/50"
                                )}
                                onClick={() => handleMarkAsRead(notif.firestoreDocId)}
                            >
                                <div className="mt-1">
                                    <NotificationIcon type={notif.type} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">{notif.message}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true })}
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-sm text-muted-foreground p-8">No notifications yet.</p>
                    )}
                </div>
                 <Separator />
                 <div className="p-2 text-center">
                    <Button variant="link" size="sm" asChild>
                        <Link href="/admin/dashboard/notifications">View all notifications</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

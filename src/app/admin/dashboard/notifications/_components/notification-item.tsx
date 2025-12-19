'use client';

import type { Notification } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ShoppingCart, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { markNotificationAsRead } from '@/lib/actions';

function NotificationIcon({ type }: { type: Notification['type'] }) {
    return type === 'new_order' ? <ShoppingCart className="h-5 w-5 text-muted-foreground" /> : <Bell className="h-5 w-5 text-muted-foreground" />;
}

export function NotificationItem({ notification }: { notification: Notification }) {
    
    // Convert server-side Timestamp to client-side Date object
    const createdAtDate = new Date(notification.createdAt.seconds * 1000);

    const handleRead = async () => {
        if (!notification.isRead && notification.firestoreDocId) {
            try {
                await markNotificationAsRead(notification.firestoreDocId);
            } catch (error) {
                console.error("Failed to mark notification as read:", error);
                // Optionally show a toast to the user
            }
        }
    };

    return (
        <Link href={notification.href} onClick={handleRead}>
            <div className={cn(
                "flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-accent",
                !notification.isRead && "bg-blue-50"
            )}>
                 <div className="mt-1">
                    <NotificationIcon type={notification.type} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(createdAtDate, { addSuffix: true })}
                    </p>
                </div>
                {!notification.isRead && <Badge>New</Badge>}
            </div>
        </Link>
    );
}

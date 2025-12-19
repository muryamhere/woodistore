// This is a new file src/app/admin/dashboard/notifications/page.tsx
import { getNotifications } from '@/lib/firebase-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Notification } from '@/lib/types';
import { Bell } from 'lucide-react';
import { NotificationItem } from './_components/notification-item';
import { Timestamp } from 'firebase/firestore';


export default async function AdminNotificationsPage() {
    const notifications = await getNotifications();

    // The data from Firestore needs to be serializable to be passed to a client component.
    const serializableNotifications = notifications.map(notif => ({
        ...notif,
        createdAt: {
            seconds: (notif.createdAt as Timestamp).seconds,
            nanoseconds: (notif.createdAt as Timestamp).nanoseconds,
        } as unknown as Timestamp, // Cast to avoid type issues in the component
    }));
    
    return (
        <div>
             <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Notifications</h1>
                <p className="text-muted-foreground">A history of all notifications for your store.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Notifications</CardTitle>
                    <CardDescription>Click on a notification to view its details and mark it as read.</CardDescription>
                </CardHeader>
                <CardContent>
                    {serializableNotifications.length > 0 ? (
                        <div className="space-y-2">
                            {serializableNotifications.map(notif => (
                                <NotificationItem key={notif.id} notification={notif} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-semibold">No Notifications Yet</h2>
                            <p className="text-muted-foreground mt-2">When something important happens in your store, you'll see it here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

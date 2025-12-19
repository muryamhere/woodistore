// This is a new file src/app/admin/dashboard/orders/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/firebase-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpdateStatusForm } from './_components/update-status-form';
import { CopyButton } from './_components/copy-button';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Shipped': return 'secondary';
      case 'Delivered': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  }

  const createdAt = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A';
  const updatedAt = order.updatedAt ? new Date(order.updatedAt.seconds * 1000).toLocaleString() : 'N/A';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold font-headline">Order Details</h1>
            <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">Order ID: {order.id}</p>
                <CopyButton textToCopy={order.id} />
            </div>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.productName}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">Rs. {item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">Rs. {(item.price * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Customer & Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div className="text-sm">
                            <p className="font-medium">{order.customerName}</p>
                             <Link href={`/admin/dashboard/customers/${encodeURIComponent(order.customerEmail)}`} className="text-primary hover:underline">{order.customerEmail}</Link>
                        </div>
                    </div>
                     <Separator/>
                    <div className="flex items-start gap-4">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                         <div className="text-sm">
                            <p className="font-medium">Shipping Address</p>
                            <p className="text-muted-foreground">{order.shippingAddress}</p>
                        </div>
                    </div>
                     <Separator/>
                    <div className="flex items-start gap-4">
                        <Package className="h-5 w-5 text-muted-foreground" />
                         <div className="text-sm">
                            <p className="font-medium">Tracking Number</p>
                            <p className="text-muted-foreground">{order.trackingNumber ?? 'Not available'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Created At</span>
                            <span>{createdAt}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Updated</span>
                            <span>{updatedAt}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>Rs. {order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Update Order</CardTitle>
                    <CardDescription>Change the status of the order.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UpdateStatusForm orderId={order.id} currentStatus={order.status} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

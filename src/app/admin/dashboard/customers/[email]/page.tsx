// This is a new file src/app/admin/dashboard/customers/[email]/page.tsx
import { notFound } from 'next/navigation';
import { getCustomerByEmail, getOrdersByCustomerEmail } from '@/lib/firebase-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default async function CustomerDetailsPage({ params }: { params: { email: string } }) {
  const decodedEmail = decodeURIComponent(params.email);
  const customer = await getCustomerByEmail(decodedEmail);

  if (!customer) {
    notFound();
  }

  const orders = await getOrdersByCustomerEmail(decodedEmail);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Shipped': return 'secondary';
      case 'Delivered': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/dashboard/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-4">
             <Avatar className="h-12 w-12">
                <AvatarFallback>{customer.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold font-headline">{customer.name}</h1>
                <a href={`mailto:${customer.email}`} className="text-muted-foreground text-sm hover:underline">{customer.email}</a>
            </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lifetime Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. {customer.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {customer.totalOrders} orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.totalOrders}</div>
             <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Ordered</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.lastOrdered ? customer.lastOrdered.toDate().toDateString() : 'N/A'}</div>
             <p className="text-xs text-muted-foreground">Date of most recent order</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>A list of all orders placed by this customer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No orders found.</TableCell>
                </TableRow>
              ) : (
                orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id.substring(0, 7)}...</TableCell>
                    <TableCell>
                      {order.createdAt ? order.createdAt.toDate().toDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">Rs. {order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/dashboard/orders/${order.id}`}>
                                View Order
                            </Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

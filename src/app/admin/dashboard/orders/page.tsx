// This is a new file src/app/admin/dashboard/orders/page.tsx
import { getOrders } from '@/lib/firebase-actions';
import { Order, columns } from './_components/columns';
import { DataTable } from '@/components/ui/data-table';


export default async function AdminOrdersPage() {
  const orders = await getOrders();
  const plainOrders = orders.map(order => ({
    ...order,
    createdAt: order.createdAt ? {
        seconds: order.createdAt.seconds,
        nanoseconds: order.createdAt.nanoseconds,
    } : { seconds: 0, nanoseconds: 0 },
    updatedAt: order.updatedAt ? {
        seconds: order.updatedAt.seconds,
        nanoseconds: order.updatedAt.nanoseconds,
    } : { seconds: 0, nanoseconds: 0 },
  }));
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </div>
      <DataTable 
        columns={columns} 
        data={plainOrders}
        searchKey="customerName"
        searchPlaceholder='Filter by customer...'
        filterColumn='status'
        filterOptions={[
            { value: 'Pending', label: 'Pending' },
            { value: 'Shipped', label: 'Shipped' },
            { value: 'Delivered', label: 'Delivered' },
            { value: 'Cancelled', label: 'Cancelled' },
        ]}
       />
    </div>
  );
}

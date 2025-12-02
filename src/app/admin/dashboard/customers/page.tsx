// This is a new file src/app/admin/dashboard/customers/page.tsx
import { getCustomers } from '@/lib/firebase-actions';
import { Customer, columns } from './_components/columns';
import { DataTable } from '@/components/ui/data-table';


export default async function AdminCustomersPage() {
  const customers = await getCustomers();
  const plainCustomers = customers.map(customer => ({
    ...customer,
    lastOrdered: customer.lastOrdered ? {
      seconds: customer.lastOrdered.seconds,
      nanoseconds: customer.lastOrdered.nanoseconds,
    } : { seconds: 0, nanoseconds: 0 },
  }));
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Customers</h1>
        <p className="text-muted-foreground">View and manage your customers.</p>
      </div>
        <DataTable 
            columns={columns} 
            data={plainCustomers} 
            searchKey="name"
            searchPlaceholder="Filter customers..."
        />
    </div>
  );
}


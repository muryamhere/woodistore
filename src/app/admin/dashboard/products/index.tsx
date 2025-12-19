import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/firebase-actions";
import { Product, columns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";

export default async function AdminProductsPage() {
    const products = await getProducts();
    const plainProducts = products.map(product => ({
        ...product,
        createdAt: product.createdAt ? {
            seconds: product.createdAt.seconds,
            nanoseconds: product.createdAt.nanoseconds,
        } : { seconds: 0, nanoseconds: 0 },
        updatedAt: product.updatedAt ? {
            seconds: product.updatedAt.seconds,
            nanoseconds: product.updatedAt.nanoseconds,
        } : { seconds: 0, nanoseconds: 0 },
    }));

  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Products</h1>
                <p className="text-muted-foreground">Manage your products and view their sales performance.</p>
            </div>
            <Button asChild>
                <Link href="/admin/dashboard/products/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                </Link>
            </Button>
        </div>

        <DataTable 
            columns={columns} 
            data={plainProducts} 
            searchKey="name"
            searchPlaceholder="Filter products..."
            filterColumn="category"
            filterOptions={[
                { value: 'Furniture', label: 'Furniture' },
                { value: 'Home Decor', label: 'Home Decor' },
                { value: 'Kitchenware', label: 'Kitchenware' },
                { value: 'Toys', label: 'Toys' },
            ]}
        />

    </div>
  );
}

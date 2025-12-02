// This is a new file src/app/admin/dashboard/products/_components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { DeleteProductDialog } from "./delete-product-dialog"
import { Timestamp } from "firebase/firestore"

export { type Product } from "@/lib/types"

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
        const product = row.original;
        return (
             <div className="flex items-center gap-4">
                {product.images && product.images[0] ? (
                    <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="48"
                        src={product.images[0].url}
                        width="48"
                        data-ai-hint={product.images[0].hint}
                    />
                ) : (
                    <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                    </div>
                )}
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.sku ?? 'No SKU'}</div>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const stock = parseFloat(row.getValue("stock"))
        
        let status: "In Stock" | "Low Stock" | "Out of Stock";
        let variant: "default" | "secondary" | "destructive";
        let className: string = '';

        if (stock > 10) {
            status = "In Stock";
            variant = "default";
            className = 'bg-green-600 hover:bg-green-700';
        } else if (stock > 0) {
            status = "Low Stock";
            variant = "secondary";
            className = 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600';
        } else {
            status = "Out of Stock";
            variant = "destructive";
        }
        
        return (
            <div className="flex items-center gap-2">
                <Badge variant={variant} className={className}>
                    {status}
                </Badge>
                ({stock})
            </div>
        )
    }
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = `Rs. ${amount.toFixed(2)}`;

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
    {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
     cell: ({ row }) => {
      const date = row.getValue("updatedAt") as any;
      if (!date || !date.seconds) return null;
      const ts = new Timestamp(date.seconds, date.nanoseconds);
      return <div className="text-left">{ts.toDate().toDateString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href={`/admin/dashboard/products/${product.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href={`/products/${product.id}`} target="_blank">View on site</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteProductDialog
                productId={product.id}
                productName={product.name}
                imagePublicId={product.images?.[0]?.id ?? ''}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

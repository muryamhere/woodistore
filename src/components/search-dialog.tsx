
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getProducts, getOrders, getCustomers } from '@/lib/firebase-actions';
import type { Product, Order, Customer } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Search, Package, ShoppingCart, User } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Separator } from './ui/separator';

function ProductSearchResult({ product, onSelect }: { product: Product; onSelect: () => void }) {
  return (
    <Link
      href={`/admin/dashboard/products/${product.id}/edit`}
      onClick={onSelect}
      className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
    >
      <Image
        src={product.images[0]?.url || '/placeholder.svg'}
        alt={product.images[0]?.alt || product.name}
        width={40}
        height={40}
        className="rounded-md object-cover"
        data-ai-hint={product.images[0]?.hint}
      />
      <div className="flex-1">
        <p className="font-medium text-sm">{product.name}</p>
        <p className="text-xs text-muted-foreground">Rs. {product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

function OrderSearchResult({ order, onSelect }: { order: Order; onSelect: () => void }) {
    return (
        <Link
            href={`/admin/dashboard/orders/${order.id}`}
            onClick={onSelect}
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
        >
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
                <p className="font-medium text-sm">Order #{order.id.substring(0, 7)}...</p>
                <p className="text-xs text-muted-foreground">{order.customerName} - Rs. {order.total.toFixed(2)}</p>
            </div>
        </Link>
    )
}

function CustomerSearchResult({ customer, onSelect }: { customer: Customer; onSelect: () => void }) {
    return (
        <Link
            href={`/admin/dashboard/customers/${encodeURIComponent(customer.email)}`}
            onClick={onSelect}
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
        >
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
                <p className="font-medium text-sm">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
            </div>
        </Link>
    )
}


export function SearchDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function fetchAllData() {
      if (isOpen && allProducts.length === 0 && allOrders.length === 0 && allCustomers.length === 0) {
        setLoading(true);
        try {
          const [products, orders, customers] = await Promise.all([
            getProducts(),
            getOrders(),
            getCustomers(),
          ]);
          setAllProducts(products);
          setAllOrders(orders);
          setAllCustomers(customers);
        } catch (err) {
          console.error('Failed to fetch data for search', err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchAllData();
  }, [isOpen, allProducts.length, allOrders.length, allCustomers.length]);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return [];
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, allProducts]);

  const filteredOrders = useMemo(() => {
    if (!debouncedQuery) return [];
    return allOrders.filter((order) =>
      order.id.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, allOrders]);

  const filteredCustomers = useMemo(() => {
    if (!debouncedQuery) return [];
    return allCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, allCustomers]);
  
  const totalResults = filteredProducts.length + filteredOrders.length + filteredCustomers.length;

  const handleSelect = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Global Search</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, orders, or customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="mt-4 min-h-[200px] max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center h-full py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {debouncedQuery && totalResults === 0 && !loading && (
            <p className="text-center text-muted-foreground py-8">
              No results found for &quot;{debouncedQuery}&quot;.
            </p>
          )}

          {!loading && totalResults > 0 && (
            <div className="space-y-4">
                {filteredProducts.length > 0 && (
                    <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Products</h3>
                        <div className="space-y-1">
                            {filteredProducts.map((product) => (
                                <ProductSearchResult key={`product-${product.id}`} product={product} onSelect={handleSelect} />
                            ))}
                        </div>
                    </div>
                )}
                {filteredOrders.length > 0 && (
                    <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Orders</h3>
                        <div className="space-y-1">
                            {filteredOrders.map((order) => (
                                <OrderSearchResult key={`order-${order.id}`} order={order} onSelect={handleSelect} />
                            ))}
                        </div>
                    </div>
                )}
                {filteredCustomers.length > 0 && (
                    <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Customers</h3>
                         <div className="space-y-1">
                            {filteredCustomers.map((customer) => (
                                <CustomerSearchResult key={`customer-${customer.email}`} customer={customer} onSelect={handleSelect} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

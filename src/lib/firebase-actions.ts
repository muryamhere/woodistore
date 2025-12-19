

'use server';

import { collection, doc, getDoc, getDocs, orderBy, query, where, limit, Timestamp } from 'firebase/firestore';
import { getDb } from '@/firebase/server';
import type { Product, Order, Customer, CustomerDetail, SiteContent, AboutPageContent, ProductPageContent, Notification } from './types';
import { cache } from 'react';

export async function getProducts(): Promise<Product[]> {
    const firestore = getDb();
    const productsCollection = collection(firestore, 'products');
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        console.log('No products found.');
        return [];
    }
    // Manually convert Timestamps to plain objects
    return snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt as Timestamp;
        const updatedAt = data.updatedAt as Timestamp;
        return {
            id: doc.id,
            ...data,
            createdAt: {
                seconds: createdAt.seconds,
                nanoseconds: createdAt.nanoseconds,
            },
            updatedAt: {
                seconds: updatedAt.seconds,
                nanoseconds: updatedAt.nanoseconds,
            },
        } as Product;
    });
}

export const getProductById = cache(async (id: string): Promise<Product | undefined> => {
    if (!id) return undefined;
    const firestore = getDb();
    const productDoc = doc(firestore, 'products', id);
    const snapshot = await getDoc(productDoc);

    if (!snapshot.exists()) {
        return undefined;
    }

    const data = snapshot.data();
    const createdAt = data.createdAt as Timestamp;
    const updatedAt = data.updatedAt as Timestamp;
    return { 
        id: snapshot.id, 
        ...data,
        createdAt: {
            seconds: createdAt.seconds,
            nanoseconds: createdAt.nanoseconds,
        },
        updatedAt: {
            seconds: updatedAt.seconds,
            nanoseconds: updatedAt.nanoseconds,
        },
    } as Product;
});

export async function getOrders(options: { limit?: number } = {}): Promise<Order[]> {
    const firestore = getDb();
    const ordersCollection = collection(firestore, 'orders');
    const constraints = [orderBy('createdAt', 'desc')];
    if (options.limit) {
        constraints.push(limit(options.limit));
    }
    const q = query(ordersCollection, ...constraints);
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        console.log('No orders found.');
        return [];
    }
    return snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt as Timestamp;
        const updatedAt = data.updatedAt as Timestamp;
        return {
            id: doc.id,
            ...data,
             createdAt: {
                seconds: createdAt.seconds,
                nanoseconds: createdAt.nanoseconds,
            },
            updatedAt: {
                seconds: updatedAt.seconds,
                nanoseconds: updatedAt.nanoseconds,
            },
        } as Order
    });
}

export async function getOrderById(id: string): Promise<Order | undefined> {
    const firestore = getDb();
    const orderDoc = doc(firestore, 'orders', id);
    const snapshot = await getDoc(orderDoc);

    if (!snapshot.exists()) {
        return undefined;
    }
    
    const data = snapshot.data();
    const createdAt = data.createdAt as Timestamp;
    const updatedAt = data.updatedAt as Timestamp;

    return { 
        id: snapshot.id, 
        ...data,
        createdAt: {
            seconds: createdAt.seconds,
            nanoseconds: createdAt.nanoseconds,
        },
        updatedAt: {
            seconds: updatedAt.seconds,
            nanoseconds: updatedAt.nanoseconds,
        },
    } as Order;
}


export async function getOrdersByCustomerEmail(email: string): Promise<Order[]> {
    const firestore = getDb();
    const ordersCollection = collection(firestore, 'orders');
    const q = query(ordersCollection, where('customerEmail', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
        return [];
    }
    
    const orders = snapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt as Timestamp;
        const updatedAt = data.updatedAt as Timestamp;
        return {
            id: doc.id,
            ...data,
            createdAt: {
                seconds: createdAt.seconds,
                nanoseconds: createdAt.nanoseconds,
            },
            updatedAt: {
                seconds: updatedAt.seconds,
                nanoseconds: updatedAt.nanoseconds,
            },
        } as Order;
    });
    
    return orders.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
}


export async function getCustomers(): Promise<Customer[]> {
    const orders = await getOrders();
    if (orders.length === 0) {
        return [];
    }

    const customerMap = new Map<string, Customer>();

    orders.forEach(order => {
        const existingCustomer = customerMap.get(order.customerEmail);
        const orderTimestamp = new Timestamp(order.createdAt.seconds, order.createdAt.nanoseconds);

        if (existingCustomer) {
            existingCustomer.totalOrders += 1;
            existingCustomer.totalSpent += order.total;
            const existingTimestamp = new Timestamp(existingCustomer.lastOrdered.seconds, existingCustomer.lastOrdered.nanoseconds);
            if (orderTimestamp > existingTimestamp) {
                existingCustomer.lastOrdered = order.createdAt;
                existingCustomer.name = order.customerName; // Update name to the latest one
            }
        } else {
            customerMap.set(order.customerEmail, {
                email: order.customerEmail,
                name: order.customerName,
                totalOrders: 1,
                totalSpent: order.total,
                lastOrdered: order.createdAt,
            });
        }
    });
    
    const customers = Array.from(customerMap.values());

    return customers.sort((a, b) => {
        const tsA = new Timestamp(a.lastOrdered.seconds, a.lastOrdered.nanoseconds);
        const tsB = new Timestamp(b.lastOrdered.seconds, b.lastOrdered.nanoseconds);
        return tsB.toMillis() - tsA.toMillis();
    });
}

export async function getCustomerByEmail(email: string): Promise<CustomerDetail | undefined> {
    const orders = await getOrdersByCustomerEmail(email);
    if (orders.length === 0) {
        return undefined;
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    const mostRecentOrder = orders[0];

    return {
        email: mostRecentOrder.customerEmail,
        name: mostRecentOrder.customerName,
        totalOrders,
        totalSpent,
        lastOrdered: mostRecentOrder.createdAt,
        orders,
    };
}

export const getSiteContent = cache(async (): Promise<SiteContent | null> => {
    const firestore = getDb();
    const contentDoc = doc(firestore, 'site_content', 'homepage');
    const snapshot = await getDoc(contentDoc);

    if (!snapshot.exists()) {
        console.warn('Homepage site content not found in Firestore. Using default values.');
        return null;
    }

    return snapshot.data() as SiteContent;
});

export const getAboutPageContent = cache(async (): Promise<AboutPageContent | null> => {
    const firestore = getDb();
    const contentDoc = doc(firestore, 'site_content', 'about');
    const snapshot = await getDoc(contentDoc);

    if (!snapshot.exists()) {
        console.warn('"About Us" page content not found in Firestore.');
        return null;
    }
    return snapshot.data() as AboutPageContent;
});

export const getProductPageContent = cache(async (): Promise<ProductPageContent | null> => {
    const firestore = getDb();
    const contentDoc = doc(firestore, 'site_content', 'product_page');
    const snapshot = await getDoc(contentDoc);

    if (!snapshot.exists()) {
        console.warn('"Product Page" content not found in Firestore.');
        return null;
    }
    return snapshot.data() as ProductPageContent;
});

export const getNotifications = cache(async (): Promise<Notification[]> => {
    const firestore = getDb();
    const notificationsCollection = collection(firestore, 'notifications');
    const q = query(notificationsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => ({ ...doc.data(), firestoreDocId: doc.id }) as Notification);
});

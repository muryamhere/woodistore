'use client';
import { collection, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Product } from './types';

// This function is deprecated because useFirestore cannot be used in a non-component function.
// The logic has been moved to SearchDialog.tsx
export async function getProducts(): Promise<Product[]> {
    return [];
}

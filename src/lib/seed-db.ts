import { products as mockProducts } from './mock-data';
import { collection, writeBatch, getDocs, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export async function seedDatabase() {
    const { firestore } = initializeFirebase();
    const productsCollection = collection(firestore, 'products');

    // Check if the collection is already seeded
    const snapshot = await getDocs(productsCollection);
    if (!snapshot.empty) {
        console.log('Database already seeded. Skipping.');
        return;
    }
    
    console.log('Seeding database with mock products...');

    const batch = writeBatch(firestore);

    mockProducts.forEach(product => {
        const docRef = collection(firestore, 'products').doc(product.id);
        batch.set(docRef, product);
    });

    try {
        await batch.commit();
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Call this function to seed the database if needed, for example in a script.
// Be careful not to run this in a production environment without proper checks.

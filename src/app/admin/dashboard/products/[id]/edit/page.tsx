import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/firebase-actions';
import { ProductEditForm } from './_components/product-edit-form';

// This is a server component that fetches data and passes it to the client component form.
export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
      <div className="max-w-4xl mx-auto">
        <ProductEditForm product={product} />
      </div>
  );
}

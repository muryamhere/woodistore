// This file is no longer needed for the edit functionality and can be removed or repurposed.
// For now, it will redirect to the edit page as a fallback.
import { redirect } from 'next/navigation';

export default function ProductDetailsRedirect({ params }: { params: { id: string } }) {
  redirect(`/admin/dashboard/products/${params.id}/edit`);
}

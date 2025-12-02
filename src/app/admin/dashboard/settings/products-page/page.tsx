// This is a new file src/app/admin/dashboard/settings/products-page/page.tsx
import { getSiteContent } from "@/lib/firebase-actions";
import type { SiteContent } from "@/lib/types";
import { ProductsPageBannerForm } from "./_components/products-page-banner-form";

export default async function ProductsPageSettingsPage() {
    
    const siteContent = await getSiteContent();

    const contentToEdit: SiteContent = {
        ...(siteContent || {}),
        hero: siteContent?.hero || { title: '', subtitle: '', image: { id: '', url: '', alt: '', hint: ''}},
        productsPageBanners: siteContent?.productsPageBanners?.length ? siteContent.productsPageBanners : [
            { id: 'products-banner-1', url: 'https://picsum.photos/seed/shop-banner-1/1600/400', alt: 'Banner 1', hint: 'wooden products' },
            { id: 'products-banner-2', url: 'https://picsum.photos/seed/shop-banner-2/1600/400', alt: 'Banner 2', hint: 'craftsmanship detail' },
            { id: 'products-banner-3', url: 'https://picsum.photos/seed/shop-banner-3/1600/400', alt: 'Banner 3', hint: 'artisan workshop' },
        ],
    };

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Products Page Settings</h1>
                <p className="text-muted-foreground">Manage content for the "All Products" page.</p>
            </div>
            
            <ProductsPageBannerForm content={contentToEdit} />

        </div>
    )
}

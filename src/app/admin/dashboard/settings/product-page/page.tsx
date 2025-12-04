
// This is a new file src/app/admin/dashboard/settings/product-page/page.tsx
import { getProductPageContent } from "@/lib/firebase-actions";
import type { ProductPageContent } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { ProductPageSettingsForm } from "./_components/product-page-settings-form";

export default async function ProductPageSettingsPage() {
    
    const productPageContent = await getProductPageContent();

    const defaultContent: ProductPageContent = {
        promoBannerImage: { id: 'promo-banner', url: 'https://picsum.photos/seed/decor-accessories/1600/900', alt: 'Elegant home decor accessories on a table', hint: 'home decor' },
        guarantees: [
            { icon: 'Truck', title: 'Doorstep Delivery', description: 'Receive purchases at your doorstep throughout all major cities in Pakistan.' },
            { icon: 'Clock', title: 'After Sale Support', description: 'All our products come with our promise of long-term after sales service.' },
            { icon: 'Globe', title: 'International Standard', description: 'Our products are created locally and adhere to global manufacturing standards.' },
            { icon: 'Recycle', title: 'Assembly Assistance', description: 'After delivery, our team of experts helps you assemble your products in your location for maximum ease.' },
        ],
        testimonials: [
            { quote: "Shopping with Interwood. The breeze and the service was... As per their promise, their... fitting of the table. Great...", author: "ASHRAF" },
            { quote: "I was very happy with the product I purchased from Interwood. The product was delivered on time and a professional team came to assemble it at my residence. Thanks Interwood.", author: "MAZHAR AWAN" },
            { quote: "I was really impressed with Interwood. The staff was very helpful and answered all my questions. The delivery time was as promised and I would definitely recommend them to anyone looking for high-quality furniture.", author: "MALEEHA" },
            { quote: "The quality is top-notch, and the design is simply elegant. It has transformed my living room completely. A truly wonderful experience.", author: "SARA K." },
            { quote: "From ordering to assembly, everything was seamless. The furniture is even more beautiful in person. I couldn't be happier with my purchase.", author: "DAVID L." },
        ],
    };
    
    const contentToEdit: ProductPageContent = {
        ...defaultContent,
        ...productPageContent,
    };

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Product Page Settings</h1>
                <p className="text-muted-foreground">Manage dynamic content for the product detail pages.</p>
            </div>
            
            <ProductPageSettingsForm content={contentToEdit} />

        </div>
    )
}

    
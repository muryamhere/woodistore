// This is a new file src/app/admin/dashboard/settings/homepage/page.tsx
import { getSiteContent, getProducts } from "@/lib/firebase-actions";
import type { SiteContent, ExploreSection, InSituSection } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { HomepageImagesForm } from "@/app/admin/dashboard/settings/_components/homepage-images-form";
import { HeroImageForm } from "@/app/admin/dashboard/settings/_components/hero-image-form";
import { InSituImagesForm } from "@/app/admin/dashboard/settings/_components/in-situ-images-form";

export default async function HomepageSettingsPage() {

    const [siteContent, products] = await Promise.all([getSiteContent(), getProducts()]);

    const defaultExploreSections: ExploreSection[] = [
      {
        href: "/products?category=Furniture",
        image: { id: 'explore-home', url: "https://picsum.photos/seed/livingroom/600/600", alt: "A comfortable home setting with wooden furniture", hint: "home furniture" },
        title: "Home",
      },
      {
        href: "/products?category=Kitchenware",
        image: { id: 'explore-kitchen', url: "https://picsum.photos/seed/dining/600/600", alt: "A modern kitchen with wooden utensils and decor", hint: "kitchen decor" },
        title: "Kitchen",
      },
      {
        href: "/products?category=Furniture",
        image: { id: 'explore-office', url: "https://picsum.photos/seed/bedroom/600/600", alt: "A stylish office with a wooden desk and chair", hint: "office furniture" },
        title: "Office",
      },
    ];

    const defaultInSituSection: InSituSection = {
        background: { id: 'insitu-bg', url: 'https://picsum.photos/seed/woodcrafts/1200/600', alt: 'A collection of handcrafted wooden items', hint: 'woodcrafts assortment' },
        spots: [
            { productId: 'w-bowl-01', title: 'Spice Box', price: 'Rs. 2500', image: { id: 'insitu-spot-1', url: 'https://picsum.photos/seed/spicebox/400/400', alt: 'Wooden Spice Box', hint: 'wooden spicebox' } },
            { productId: 'w-lamp-01', title: 'Minar Replica', price: 'Rs. 3000', image: { id: 'insitu-spot-2', url: 'https://picsum.photos/seed/minaret/400/400', alt: 'Wooden Minar Replica', hint: 'wooden minaret' } }
        ]
    };

    const defaultContent: SiteContent = {
        hero: {
            title: "Handcrafted <em>heirlooms</em><br />for the modern home",
            subtitle: "Discover timeless pieces, meticulously crafted from solid wood to bring natural elegance and warmth into your life.",
            image: { id: 'img-hero-1', url: 'https://images.unsplash.com/photo-1678184095759-db539ff697a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxjYXJwZW50ZXIlMjB3b3Jrc2hvcHxlbnwwfHx8fDE3NjM5MzQxODN8MA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Carpenter workshop', hint: 'carpenter workshop' },
        },
        exploreSections: defaultExploreSections,
        craftsmanshipSection: {
            image: { id: 'craftsmanship-bg', url: 'https://picsum.photos/seed/craftsmanship/1200/400', alt: 'Detailed shot of woodworking craftsmanship', hint: 'woodworking detail' }
        },
        inSituSection: defaultInSituSection,
    };

    const contentToEdit: SiteContent = {
        ...defaultContent,
        ...siteContent,
    };


    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Homepage Settings</h1>
                <p className="text-muted-foreground">Manage content for your homepage.</p>
            </div>
            
            <HeroImageForm content={contentToEdit} />

            <Separator />
            
            <HomepageImagesForm content={contentToEdit} />

            <Separator />

            <InSituImagesForm content={contentToEdit} products={products} />
        </div>
    );
}

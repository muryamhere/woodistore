

// This is a new file src/app/admin/dashboard/settings/about/page.tsx
import { getAboutPageContent } from "@/lib/firebase-actions";
import type { AboutPageContent } from "@/lib/types";
import { AboutUsImagesForm } from "@/app/admin/dashboard/settings/_components/about-us-images-form";
import { Separator } from "@/components/ui/separator";

export default async function AboutSettingsPage() {
    
    const aboutPageContent = await getAboutPageContent();

    const defaultAboutPageContent: AboutPageContent = {
        heroImage: { id: 'about-hero', url: 'https://picsum.photos/seed/wood-texture/1600/900', alt: 'Close-up of beautiful wood grain', hint: 'wood texture' },
        philosophyImage: { id: 'about-philosophy', url: 'https://picsum.photos/seed/workshop-tools/1200/600', alt: 'Artisan woodworking tools laid out on a workbench', hint: 'woodworking tools' },
        workshopImage: { id: 'about-workshop', url: 'https://picsum.photos/seed/carpenter-shop/1600/800', alt: 'A bright and organized woodworking workshop', hint: 'woodworking workshop'},
    };
    
    const contentToEdit: AboutPageContent = {
        ...defaultAboutPageContent,
        ...aboutPageContent,
    };

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">About Us Page Settings</h1>
                <p className="text-muted-foreground">Manage content for the "About Us" page.</p>
            </div>
            
            <AboutUsImagesForm content={contentToEdit} />

        </div>
    )
}

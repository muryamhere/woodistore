// This is a new file src/app/admin/dashboard/settings/branding/page.tsx
import { getSiteContent } from "@/lib/firebase-actions";
import type { SiteContent } from "@/lib/types";
import { BrandingSettingsForm } from "@/app/admin/dashboard/settings/_components/branding-settings-form";

export default async function BrandingSettingsPage() {

    const siteContent = await getSiteContent();

    const contentToEdit: SiteContent = {
        ...(siteContent || {}),
        hero: siteContent?.hero || { title: '', subtitle: '', image: { id: '', url: '', alt: '', hint: ''}},
        headerLogoLight: siteContent?.headerLogoLight ?? { id: 'placeholder-logo-light', url: 'https://picsum.photos/seed/logo/150/40', alt: 'WoodiStore Placeholder Logo Light', hint: 'company logo' },
        headerLogoDark: siteContent?.headerLogoDark ?? { id: 'placeholder-logo-dark', url: 'https://picsum.photos/seed/logo-dark/150/40', alt: 'WoodiStore Placeholder Logo Dark', hint: 'company logo' },
    };

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Branding Settings</h1>
                <p className="text-muted-foreground">Manage your site's logos.</p>
            </div>
            
            <BrandingSettingsForm content={contentToEdit} />
        </div>
    );
}

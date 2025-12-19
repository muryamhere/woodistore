
// This is a new file src/app/admin/dashboard/settings/logos/page.tsx
import { getSiteContent } from "@/lib/firebase-actions";
import type { SiteContent } from "@/lib/types";
import { LogosSettingsForm } from "@/app/admin/dashboard/settings/logos/_components/logos-settings-form";

export default async function LogosSettingsPage() {

    const siteContent = await getSiteContent();

    const contentToEdit: SiteContent = {
        ...(siteContent || {}),
        hero: siteContent?.hero || { title: '', subtitle: '', image: { id: '', url: '', alt: '', hint: ''}},
    };

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">Site Logo Settings</h1>
                <p className="text-muted-foreground">Manage your public-facing site logos for various sections.</p>
            </div>
            
            <LogosSettingsForm content={contentToEdit} />
        </div>
    );
}

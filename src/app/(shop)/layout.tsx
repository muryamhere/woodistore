
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/context/cart-context";
import { FirebaseProvider } from "@/firebase/provider";
import { Toaster } from "@/components/ui/toaster";
import { getSiteContent } from "@/lib/firebase-actions";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteContent = await getSiteContent();

  return (
     <FirebaseProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header logoUrlLight={siteContent?.headerLogoLight?.url} logoUrlDark={siteContent?.headerLogoDark?.url} />
          <main className="flex-1">{children}</main>
          <Footer logoUrlDark={siteContent?.footerLogoDark?.url} />
        </div>
        <Toaster />
      </CartProvider>
    </FirebaseProvider>
  );
}

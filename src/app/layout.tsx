
import type { Metadata } from 'next';
import './globals.css';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import { cn } from '@/lib/utils';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant-garamond',
});

export const metadata: Metadata = {
  title: 'WoodiStore - Handcrafted Wooden Goods',
  description:
    'Discover unique, handcrafted wooden goods. Quality craftsmanship, timeless design.',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased',
          manrope.variable,
          cormorantGaramond.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}

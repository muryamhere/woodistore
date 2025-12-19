
'use client';

import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';
import { useState, useEffect } from 'react';

export default function TermsConditionsPage() {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto py-16 md:py-24 max-w-4xl px-4 md:px-0">
      <div className="text-center">
        <SectionHeading>Terms & Conditions</SectionHeading>
        <SectionSubheading className="mt-4">
          The terms and conditions governing the sale of products on our website.
        </SectionSubheading>
      </div>

      <div className="prose prose-lg mx-auto mt-12 text-muted-foreground">
        <p>Last updated: {date}</p>

        <p>
          Please read these terms and conditions carefully before using Our Service.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">1. Introduction</h2>
        <p>
          These Terms and Conditions govern your use of the WoodiStore website and the purchase of any products from it. The website is owned and operated by WoodiStore LLC. By accessing the website, you agree to be bound by these Terms and Conditions.
        </p>
        
        <h2 className="text-xl font-semibold text-foreground mt-8">2. Products</h2>
        <p>
          All products are subject to availability, and we reserve the right to impose quantity limits on any order, to reject all or part of an order, and to discontinue products without notice, even if you have already placed your order.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">3. Pricing and Payment</h2>
        <p>
          All prices are shown in U.S. dollars and applicable taxes and other charges, if any, are additional. We accept various forms of payment, as listed at checkout. You represent and warrant that you have the legal right to use any payment method you use to complete any transaction.
        </p>
        
        <h2 className="text-xl font-semibold text-foreground mt-8">4. Intellectual Property</h2>
        <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of WoodiStore LLC and its licensors.
        </p>
      </div>
    </div>
  );
}

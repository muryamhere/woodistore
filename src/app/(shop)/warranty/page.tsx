
'use client';

import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';
import { useState, useEffect } from 'react';

export default function WarrantyPage() {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="container mx-auto py-16 md:py-24 max-w-4xl px-4 md:px-0">
      <div className="text-center">
        <SectionHeading>Warranty & Refund Policy</SectionHeading>
        <SectionSubheading className="mt-4">
          We are sorry to hear that you are not satisfied with your product and want a refund or have a warranty claim.
        </SectionSubheading>
      </div>

      <div className="prose prose-lg mx-auto mt-12 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Our Promise</h2>
        <p>
          At WoodiStore, we stand behind the quality of our handcrafted products. Each piece is meticulously inspected before it leaves our workshop. We offer a 1-year limited warranty on all our products against manufacturing defects.
        </p>
        
        <h2 className="text-xl font-semibold text-foreground mt-8">Refund Policy</h2>
        <p>
          If you are not completely satisfied with your purchase, you may return it within 30 days of receipt for a full refund, provided the item is in its original, unused condition. Custom orders are not eligible for returns unless there is a manufacturing defect.
        </p>
        <p>
          To initiate a return, please contact our support team at <a href="mailto:support@woodistore.com" className="text-primary hover:underline">support@woodistore.com</a> with your order number and reason for return. Return shipping costs are the responsibility of the customer.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Warranty Claims</h2>
        <p>
          Our warranty covers defects in material and workmanship. It does not cover damage caused by misuse, accidents, or normal wear and tear. To make a warranty claim, please email us with your order number, a description of the issue, and photos of the defect. We will assess the claim and, if approved, repair or replace the item at our discretion.
        </p>
      </div>
    </div>
  );
}

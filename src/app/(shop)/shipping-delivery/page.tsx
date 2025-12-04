
import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';

export default function ShippingDeliveryPage() {
  return (
    <div className="container mx-auto py-16 md:py-24 max-w-4xl px-4 md:px-0">
      <div className="text-center">
        <SectionHeading>Shipping & Delivery</SectionHeading>
        <SectionSubheading className="mt-4">
          We know you are keen to get your hands on your WoodiStore product, so we try to ship your orders out as soon as possible. Check this section for details.
        </SectionSubheading>
      </div>

       <div className="prose prose-lg mx-auto mt-12 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Processing Time</h2>
        <p>
          All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
        </p>
        
        <h2 className="text-xl font-semibold text-foreground mt-8">Shipping Rates & Delivery Estimates</h2>
        <p>
          Shipping charges for your order will be calculated and displayed at checkout. We currently offer standard shipping to all states within the USA.
        </p>
        <ul className="list-disc pl-5">
            <li><strong>Standard Shipping (5-7 business days):</strong> Free on all orders.</li>
            <li><strong>Expedited Shipping (2-3 business days):</strong> $25.00</li>
        </ul>
        <p>
          You will receive a shipment confirmation email once your order has shipped, containing your tracking number(s). The tracking number will be active within 24 hours.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">International Shipping</h2>
        <p>
          We currently do not ship outside the United States. We are working on making our products available worldwide and will update this section as soon as we do.
        </p>
      </div>
    </div>
  );
}


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';

export default function FaqPage() {
  const faqs = [
    {
      question: 'What materials do you use for your products?',
      answer:
        'All our products are crafted from high-quality, sustainably sourced solid woods like oak, walnut, and maple. We believe in using natural materials that are both beautiful and durable. Each product description specifies the type of wood used.',
    },
    {
      question: 'How do I care for my wooden items?',
      answer:
        'To keep your wooden goods looking their best, we recommend dusting regularly with a soft cloth. Avoid using harsh chemical cleaners. For spills, wipe immediately with a damp cloth and dry. For items like cutting boards, periodically apply a food-safe mineral oil.',
    },
    {
      question: 'Do you ship internationally?',
      answer:
        'Currently, we ship only within the United States. We are working on expanding our shipping options to include international destinations in the near future. Please subscribe to our newsletter to stay updated!',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns on non-custom items within 30 days of delivery. The item must be in its original, unused condition. Please visit our returns portal or contact our customer service team to initiate a return. Custom orders are final sale.',
    },
    {
      question: 'Can I request a custom order?',
      answer:
        "We love working on unique pieces! While our capacity for custom work is limited, we are always open to hearing your ideas. Please contact us through our contact page with details of your project, and we'll see if it's a good fit.",
    },
     {
      question: 'How long will it take to receive my order?',
      answer:
        'Orders are typically processed within 2-3 business days. Standard shipping takes an additional 5-7 business days, depending on your location. You will receive a shipping confirmation email with a tracking number once your order is on its way.',
    },
  ];

  return (
    <div className="container mx-auto py-16 md:py-24 px-4 md:px-0">
      <div className="text-center">
        <SectionHeading>Frequently Asked Questions</SectionHeading>
        <SectionSubheading className="mt-4">
          Have questions? We're here to help. If you don't find your answer
          below, feel free to reach out to us.
        </SectionSubheading>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

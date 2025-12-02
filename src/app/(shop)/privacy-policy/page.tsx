
import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-16 md:py-24 max-w-4xl px-4 md:px-0">
      <div className="text-center">
        <SectionHeading>Privacy Policy</SectionHeading>
        <SectionSubheading className="mt-4">
          Worried about privacy issues? If you want to know what information we collect from you and how we use them, check this section.
        </SectionSubheading>
      </div>

       <div className="prose prose-lg mx-auto mt-12 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Information We Collect</h2>
        <p>
          While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:
        </p>
        <ul className="list-disc pl-5">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Shipping address</li>
            <li>Usage Data</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">How We Use Your Information</h2>
        <p>
          We use the information we collect for various purposes, including to:
        </p>
        <ul className="list-disc pl-5">
            <li>Provide, operate, and maintain our website</li>
            <li>Process your transactions and manage your orders</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
            <li>Find and prevent fraud</li>
        </ul>
      </div>
    </div>
  );
}

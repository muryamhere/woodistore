
import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';

export default function BlogPage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4 md:px-0">
      <div className="text-center">
        <SectionHeading>Our Blog</SectionHeading>
        <SectionSubheading className="mt-4">
          Insights, stories, and updates from the workshop.
        </SectionSubheading>
      </div>

      <div className="mx-auto mt-12 max-w-3xl text-center">
        <p className="text-lg text-muted-foreground">
            Our blog is coming soon! Check back for updates on our craft, new products, and stories from the world of woodworking.
        </p>
      </div>
    </div>
  );
}

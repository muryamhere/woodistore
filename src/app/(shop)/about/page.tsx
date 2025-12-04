

import Image from 'next/image';
import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';
import { getAboutPageContent } from '@/lib/firebase-actions';
import type { AboutPageContent } from '@/lib/types';
import { Leaf, Gem, Feather } from 'lucide-react';

const defaultAboutContent: AboutPageContent = {
    heroImage: {
        id: 'about-hero',
        url: 'https://picsum.photos/seed/wood-texture/1600/900',
        alt: 'Close-up of beautiful wood grain',
        hint: 'wood texture',
    },
    philosophyImage: {
        id: 'about-philosophy',
        url: 'https://picsum.photos/seed/workshop-tools/1200/600',
        alt: 'Artisan woodworking tools laid out on a workbench',
        hint: 'woodworking tools',
    },
    workshopImage: {
        id: 'about-workshop',
        url: 'https://picsum.photos/seed/carpenter-shop/1600/800',
        alt: 'A bright and organized woodworking workshop',
        hint: 'woodworking workshop',
    },
};


export default async function AboutPage() {
    const fetchedContent = await getAboutPageContent();
    const finalContent = fetchedContent ? { ...defaultAboutContent, ...fetchedContent } : defaultAboutContent;


  return (
    <div className="px-4 md:px-0">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center -mx-4 md:mx-0">
        <div className="absolute inset-0 bg-black/50">
          <Image
            src={finalContent.heroImage.url}
            alt={finalContent.heroImage.alt}
            fill
            className="object-cover"
            priority
            data-ai-hint={finalContent.heroImage.hint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        <div className="relative container mx-auto text-center text-white">
          <h1 className="font-headline text-5xl md:text-7xl font-medium">
            About Us
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            From a humble workshop to homes around the world, our journey is carved from a passion for wood and a dedication to timeless design.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto text-center">
          <SectionHeading className="mb-6">
            Rooted in <em>Craftsmanship</em> & a passion for quality.
          </SectionHeading>
          <div className="prose prose-lg mx-auto mt-12 text-foreground text-center max-w-4xl space-y-6">
            <p>
                We believe that the best products are born from a deep respect for the material. For us, that material is wood. It is more than a mere commodity; it is a living chronicle, a silent witness to the passage of time. Each grain tells a story of a life lived, of seasons passed, and of the enduring strength of nature. From the tight rings of a slow-growing oak to the rich, swirling patterns of walnut, every board possesses a unique character and a distinct personality. We see it as our profound privilege not to conquer this material, but to listen to its stories, to understand its language, and to collaborate with it. Our role is to guide the wood into its second life, preserving the integrity and history that make it so special. This philosophy is the bedrock of our workshop; it informs every cut, every joint, and every finishing touch.
            </p>
            <p>
                Every piece we create is an ode to this natural beauty, a tangible conversation between the artisan's hand and the timber's soul. It is a process of discovery. The artisan does not simply impose a design upon the wood, but rather works to reveal the form that lies within it. This requires patience, skill, and an intuitive connection to the material. We combine age-old techniques, passed down through generations of woodworkers, with contemporary design sensibilities to craft heirlooms that are both relevant and timeless. It's a delicate balance—honoring the traditions that have proven their worth over centuries while embracing modern aesthetics that fit seamlessly into today's homes. This fusion of old and new ensures that each item is not just a transient trend, but a piece of functional art.
            </p>
            <p>
                Ultimately, our goal is to create more than just objects. We aim to craft the silent companions to your life's moments. The dining table that will host decades of family celebrations, the favorite chair where stories are read to children, the sturdy shelves that hold your most treasured books and memories. These are not just objects in your home; they are destined to become part of your family's story, absorbing the echoes of daily life and becoming imbued with personal significance. They are heirlooms in the making, designed to be used, loved, and passed down, carrying with them the legacy of both the forest they came from and the home they helped create. In a world of the temporary and disposable, we choose to create things of permanence, beauty, and soul.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto">
          <SectionHeading className="mb-12">Our Core Principles</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                    <Leaf className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-semibold mb-2">Sustainable Sourcing</h3>
                <p className="text-muted-foreground">
                    We partner with suppliers who share our commitment to responsible forestry, ensuring our craft honors the planet.
                </p>
            </div>
             <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                    <Gem className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-semibold mb-2">Artisanal Quality</h3>
                <p className="text-muted-foreground">
                    Every item is handcrafted with meticulous attention to detail, resulting in a unique piece that's built to last for generations.
                </p>
            </div>
             <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                    <Feather className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-semibold mb-2">Timeless Design</h3>
                <p className="text-muted-foreground">
                    Our designs blend modern aesthetics with classic forms, creating functional art that complements any home.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Section */}
       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto text-center">
          <SectionHeading className="mb-6">From Our Workshop</SectionHeading>
          <SectionSubheading className="mb-12">
            The magic happens. Our workshop is a space of focus and creativity, where traditional tools and modern techniques come together. It's where raw lumber is transformed by skilled hands into the beautiful, functional pieces you welcome into your home.
          </SectionSubheading>
          {finalContent.workshopImage && (
             <div className="aspect-video relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl">
                <Image
                src={finalContent.workshopImage.url}
                alt={finalContent.workshopImage.alt}
                fill
                className="object-cover"
                data-ai-hint={finalContent.workshopImage.hint}
                />
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

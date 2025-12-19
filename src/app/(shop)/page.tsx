

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { getProducts, getSiteContent, getProductById } from '@/lib/firebase-actions';
import { ArrowRight, Feather, Gem, Leaf, ArrowUpRight, Plus } from 'lucide-react';
import type { SiteContent, Product, ExploreSection, InSituSection } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionHeading } from '@/components/section-heading';
import { SectionSubheading } from '@/components/section-subheading';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';

export default async function HomePage() {
  const allProducts = await getProducts();
  const signatureProducts = allProducts.slice(0, 6);
  const siteContent = await getSiteContent();

  const heroTitle = "Handcrafted <em>heirlooms</em><br />for the modern home";
  const heroSubtitle = "Discover timeless pieces, meticulously crafted from solid wood to bring natural elegance and warmth into your life.";

  const defaultExploreSections: ExploreSection[] = [
    {
      href: "/products?category=Furniture",
      image: {
          id: 'explore-home',
          url: "https://picsum.photos/seed/livingroom/600/600",
          alt: "A comfortable home setting with wooden furniture",
          hint: "home furniture",
      },
      title: "Home",
    },
    {
      href: "/products?category=Kitchenware",
      image: {
          id: 'explore-kitchen',
          url: "https://picsum.photos/seed/dining/600-600",
          alt: "A modern kitchen with wooden utensils and decor",
          hint: "kitchen decor",
      },
      title: "Kitchen",
    },
    {
      href: "/products?category=Furniture",
      image: {
          id: 'explore-office',
          url: "https://picsum.photos/seed/bedroom/600-600",
          alt: "A stylish office with a wooden desk and chair",
          hint: "office furniture",
      },
      title: "Office",
    },
  ];

  const defaultInSituSection: InSituSection = {
    background: {
        id: 'insitu-bg',
        url: 'https://picsum.photos/seed/woodcrafts/1200/600',
        alt: 'A collection of handcrafted wooden items',
        hint: 'woodcrafts assortment'
    },
    spots: [
        {
            productId: 'w-bowl-01',
            title: 'Spice Box',
            price: '2500',
            image: {
                id: 'insitu-spot-1',
                url: 'https://picsum.photos/seed/spicebox/400/400',
                alt: 'Wooden Spice Box',
                hint: 'wooden spicebox'
            }
        },
        {
            productId: 'w-lamp-01',
            title: 'Minar Replica',
            price: '3000',
            image: {
                id: 'insitu-spot-2',
                url: 'https://picsum.photos/seed/minaret/400/400',
                alt: 'Wooden Minar Replica',
                hint: 'wooden minaret'
            }
        }
    ]
  };

  const content: SiteContent = {
    hero: siteContent?.hero ?? {
      title: heroTitle,
      subtitle: heroSubtitle,
      image: {
        id: 'img-hero-1',
        url: 'https://images.unsplash.com/photo-1678184095759-db539ff697a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxjYXJwZW50ZXIlMjB3b3Jrc2hvcHxlbnwwfHx8fDE3NjM5MzQxODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        alt: 'Carpenter workshop',
        hint: 'carpenter workshop',
      },
    },
    exploreSections: siteContent?.exploreSections ?? defaultExploreSections,
    craftsmanshipSection: siteContent?.craftsmanshipSection ?? {
        image: {
            id: 'craftsmanship-bg',
            url: 'https://picsum.photos/seed/craftsmanship/1200/400',
            alt: 'Detailed shot of woodworking craftsmanship',
            hint: 'woodworking detail'
        }
    },
    inSituSection: siteContent?.inSituSection ?? defaultInSituSection,
  };

  const inSituProducts = await Promise.all(
    (content.inSituSection?.spots || []).map(async (spot) => {
      if (spot.productId) {
        return getProductById(spot.productId);
      }
      return null;
    })
  );


  const signatureTabs = [
    {
      value: 'bestsellers',
      label: 'Bestsellers',
      getProducts: (products: Product[]) => products,
    },
    {
      value: 'new-arrivals',
      label: 'New Arrivals',
      getProducts: (products: Product[]) => products.slice(0, 4),
    },
    {
      value: 'curated-sets',
      label: 'Curated Sets',
      getProducts: (products: Product[]) => products.slice(2, 6),
    },
    {
      value: 'timeless-classics',
      label: 'Timeless Classics',
      getProducts: (products: Product[]) => products.slice(1, 5),
    },
  ];

  return (
    <div className="md:px-0">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center -mx-4 md:mx-0">
          <div className="absolute inset-0 bg-black/50">
             {content.hero.image && (
                <Image
                    src={content.hero.image.url}
                    alt={content.hero.image.alt}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={content.hero.image.hint}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
        <div className="relative container mx-auto text-center text-white px-4">
          <h1 
            className="font-headline text-5xl md:text-[84px] lg:text-[108px] leading-[0.9] font-medium"
            dangerouslySetInnerHTML={{ __html: heroTitle }}
          />
          <p className="mt-4 max-w-xl mx-auto text-base md:text-lg text-white/90 lg:text-xl">
            {heroSubtitle}
          </p>
          <Button asChild size="lg" className="group mt-8 md:mt-12 bg-white text-primary hover:bg-white/90 rounded-full font-semibold">
            <Link href="/products">Shop The Collection <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:-rotate-45" strokeWidth={2.5} /></Link>
          </Button>
        </div>
      </section>

      {/* Our Signature Pieces Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading className="mb-8 md:mb-12">
            Our Signature Pieces
          </SectionHeading>
          <Tabs defaultValue={signatureTabs[0].value} className="w-full">
            <ScrollArea className="w-full">
              <TabsList className="bg-transparent mb-8 flex justify-start md:justify-center">
                {signatureTabs.map(tab => (
                   <TabsTrigger 
                      key={tab.value} 
                      value={tab.value} 
                      className="text-muted-foreground text-sm md:text-lg data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                      {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" className="md:hidden" />
            </ScrollArea>
            {signatureTabs.map(tab => (
                 <TabsContent key={tab.value} value={tab.value}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        {tab.getProducts(signatureProducts).map(product => (
                        <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Explore by Space Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading className="mb-8 md:mb-12">
            Explore By Space or Style
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {content.exploreSections?.map((section) => (
              <Link key={section.title} href={section.href} className="group relative block overflow-hidden rounded-lg aspect-square">
                <Image
                  src={section.image.url}
                  alt={section.image.alt}
                  width={600}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={section.image.hint}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white">
                  <h3 className="font-headline text-2xl md:text-3xl lg:text-5xl font-semibold">{section.title}</h3>
                </div>
                <div className="absolute top-4 right-4 md:top-6 md:right-6 h-8 w-8 lg:h-12 lg:w-12 bg-white/90 text-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-12">
                  <ArrowUpRight className="h-4 w-4 lg:h-6 lg:w-6" strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Crafted with Character Section */}
      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto text-center px-4">
          <SectionHeading className="text-3xl md:text-4xl lg:text-5xl mb-6">
            Crafted to bring warmth, Clarity,
            <br />
            and <em className="italic">Timeless</em> character into your home.
          </SectionHeading>
          <SectionSubheading className="mb-8 md:mb-12">
            Each of our pieces is thoughtfully designed and meticulously handcrafted from sustainably sourced wood. We believe in creating beautiful, functional objects that are not just furniture, but heirlooms that will be part of your family's story.
          </SectionSubheading>
          <div className="aspect-[3/1] lg:aspect-[4/1] relative w-full mx-auto overflow-hidden rounded-2xl">
            <Image
                src={content.craftsmanshipSection?.image.url ?? "https://picsum.photos/seed/craftsmanship/1200/400"}
                alt={content.craftsmanshipSection?.image.alt ?? "Detailed shot of woodworking craftsmanship"}
                fill
                className="object-cover"
                data-ai-hint={content.craftsmanshipSection?.image.hint}
            />
          </div>
        </div>
      </section>
      
      {/* New In-Situ Products Section */}
      <section className="w-full h-screen py-12 md:py-24">
        <div className="relative w-full h-full overflow-hidden">
            <Image
              src={content.inSituSection?.background.url ?? 'https://picsum.photos/seed/woodcrafts/1200/600'}
              alt={content.inSituSection?.background.alt ?? 'A collection of handcrafted wooden items'}
              fill
              className="object-cover"
              data-ai-hint={content.inSituSection?.background.hint}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                 {content.inSituSection?.spots?.[0] && inSituProducts?.[0] && (
                    <div className="absolute top-[25%] left-[35%] w-1/4 max-w-xs transform -translate-x-1/2 -translate-y-1/2">
                        <Link href={`/products/${content.inSituSection.spots[0].productId}`} className="block group">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl p-2 md:p-3 group-hover:scale-105 transition-transform duration-300">
                                <Image src={content.inSituSection.spots[0].image.url} alt={content.inSituSection.spots[0].image.alt} width={400} height={400} className="rounded-md" data-ai-hint={content.inSituSection.spots[0].image.hint} />
                                <div className="flex justify-between items-center mt-2 md:mt-3">
                                <h4 className="font-semibold text-xs md:text-sm">{inSituProducts[0].name}</h4>
                                <p className="text-xs md:text-sm font-medium text-foreground/80">Rs. {inSituProducts[0].price.toFixed(2)}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                 )}
                 {content.inSituSection?.spots?.[1] && inSituProducts?.[1] && (
                    <div className="absolute bottom-[25%] right-[35%] w-1/4 max-w-xs transform translate-x-1/2 translate-y-1/2">
                       <Link href={`/products/${content.inSituSection.spots[1].productId}`} className="block group">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl p-2 md:p-3 group-hover:scale-105 transition-transform duration-300">
                                <Image src={content.inSituSection.spots[1].image.url} alt={content.inSituSection.spots[1].image.alt} width={400} height={400} className="rounded-md" data-ai-hint={content.inSituSection.spots[1].image.hint} />
                                <div className="flex justify-between items-center mt-2 md:mt-3">
                                <h4 className="font-semibold text-xs md:text-sm">{inSituProducts[1].name}</h4>
                                <p className="text-xs md:text-sm font-medium text-foreground/80">Rs. {inSituProducts[1].price.toFixed(2)}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                 )}
              </div>
            </div>
        </div>
      </section>

      <ScrollToTopButton />
    </div>
  );
}

    

    

    


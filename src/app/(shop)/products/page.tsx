

'use client';

import { useEffect, useState, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { getProducts, getSiteContent, getProductPageContent } from '@/lib/firebase-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { Product, SiteContent, ImageAsset, Testimonial, ProductPageContent } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { SectionHeading } from '@/components/section-heading';


const ALL_CATEGORIES = ['All', 'Furniture', 'Home Decor', 'Kitchenware', 'Toys'];

const defaultTestimonials: Testimonial[] = [
    { quote: "Shopping with Interwood. The breeze and the service was... As per their promise, their... fitting of the table. Great...", author: "ASHRAF" },
    { quote: "I was very happy with the product I purchased from Interwood. The product was delivered on time and a professional team came to assemble it at my residence. Thanks Interwood.", author: "MAZHAR AWAN" },
    { quote: "I was really impressed with Interwood. The staff was very helpful and answered all my questions. The delivery time was as promised and I would definitely recommend them to anyone looking for high-quality furniture.", author: "MALEEHA" },
    { quote: "The quality is top-notch, and the design is simply elegant. It has transformed my living room completely. A truly wonderful experience.", author: "SARA K." },
    { quote: "From ordering to assembly, everything was seamless. The furniture is even more beautiful in person. I couldn't be happier with my purchase.", author: "DAVID L." },
    { quote: "This is my third purchase and the quality is consistently outstanding. You can feel the passion in every piece.", author: "AMINA H." },
    { quote: "A perfect blend of modern design and traditional craftsmanship. My new desk is the envy of all my colleagues.", author: "MARK T." },
    { quote: "I appreciate the sustainable sourcing. It's beautiful furniture you can feel good about owning.", author: "CHLOE R." },
];

const DotButton = ({ selected, onClick }: { selected: boolean, onClick: () => void }) => (
  <button
    className={`embla__dot ${selected ? 'embla__dot--selected' : ''}`}
    type="button"
    onClick={onClick}
  />
);

function ProductListContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [productPageContent, setProductPageContent] = useState<ProductPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Filter states
  const [availability, setAvailability] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  
  const [bannerApi, setBannerApi] = useState<CarouselApi>();
  const [testimonialApi, setTestimonialApi] = useState<CarouselApi>();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!bannerApi) return;
    
    setCurrentBanner(bannerApi.selectedScrollSnap() + 1);

    bannerApi.on("select", () => {
      setCurrentBanner(bannerApi.selectedScrollSnap() + 1);
    });
  }, [bannerApi]);

  useEffect(() => {
    if (!testimonialApi) return;
    const onSelect = () => setCurrentTestimonial(testimonialApi.selectedScrollSnap());
    testimonialApi.on("select", onSelect);
    return () => testimonialApi.off("select", onSelect);
  }, [testimonialApi]);

  const scrollToTestimonial = (index: number) => testimonialApi?.scrollTo(index);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [fetchedProducts, fetchedSiteContent, fetchedProductPageContent] = await Promise.all([
          getProducts(),
          getSiteContent(),
          getProductPageContent()
        ]);
        setProducts(fetchedProducts);
        setSiteContent(fetchedSiteContent);
        setProductPageContent(fetchedProductPageContent);
      } catch (error) {
        console.error("Failed to fetch page data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  useEffect(() => {
    if (initialCategory) {
        // Ensure category from URL is valid before setting it
        const validCategory = ALL_CATEGORIES.find(c => c.toLowerCase() === initialCategory.toLowerCase());
        if (validCategory) {
            setSelectedCategory(validCategory);
        }
    }
  }, [initialCategory]);

  const handleAvailabilityChange = (status: string) => {
    setAvailability(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Availability filter
    if (availability.length > 0) {
      filtered = filtered.filter(p => {
        const isInStock = p.stock > 0;
        if (availability.includes('in-stock') && availability.includes('out-of-stock')) return true;
        if (availability.includes('in-stock')) return isInStock;
        if (availability.includes('out-of-stock')) return !isInStock;
        return false;
      });
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
          return timeB - timeA;
        });
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        // Assuming default order is "featured"
        break;
    }

    return filtered;
  }, [products, selectedCategory, availability, priceRange, sortBy]);
  
  const productsPageBanners = useMemo(() => {
    const defaultBanners: ImageAsset[] = [
        { id: 'products-banner-1', url: 'https://picsum.photos/seed/shop-banner-1/1600/400', alt: 'Banner 1', hint: 'wooden products' },
        { id: 'products-banner-2', url: 'https://picsum.photos/seed/shop-banner-2/1600/400', alt: 'Banner 2', hint: 'craftsmanship detail' },
        { id: 'products-banner-3', url: 'https://picsum.photos/seed/shop-banner-3/1600/400', alt: 'Banner 3', hint: 'artisan workshop' },
    ];
    return siteContent?.productsPageBanners && siteContent.productsPageBanners.length > 0 ? siteContent.productsPageBanners : defaultBanners;
  }, [siteContent]);

  const testimonials = useMemo(() => {
    return productPageContent?.testimonials?.length ? productPageContent.testimonials : defaultTestimonials;
  }, [productPageContent]);


  return (
    <div className="container mx-auto py-8 md:py-12 px-4 md:px-0">
        <section className="relative rounded-2xl overflow-hidden mb-8 md:mb-12 h-[30vh] md:h-[40vh]">
           <Carousel
                setApi={setBannerApi}
                plugins={[autoplayPlugin.current]}
                onMouseEnter={autoplayPlugin.current.stop}
                onMouseLeave={autoplayPlugin.current.reset}
                opts={{ loop: true }}
                className="absolute inset-0 h-full w-full"
            >
                <CarouselContent>
                    {productsPageBanners.map(banner => (
                         <CarouselItem key={banner.id}>
                            <div className="relative h-[30vh] md:h-[40vh] w-full">
                                <Image
                                    src={banner.url}
                                    alt={banner.alt}
                                    fill
                                    className="object-cover"
                                    priority
                                    data-ai-hint={banner.hint}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center text-center text-white p-4">
                 <div className="relative max-w-2xl px-4 md:px-8">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold">All Products</h1>
                    <p className="text-white/90 mt-2 text-sm md:text-base">
                    Explore our complete collection of artisan-crafted wooden goods. Each item is made with passion and precision, ready to bring natural elegance into your life.
                    </p>
                </div>
            </div>
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {productsPageBanners.map((_, index) => (
                    <div
                        key={index}
                        className={cn(
                            "h-2 w-2 rounded-full bg-white/50 transition-all",
                            (bannerApi?.selectedScrollSnap() === index) && 'w-4 bg-white'
                        )}
                    />
                ))}
            </div>
        </section>
      

      <div className="flex flex-col md:flex-row items-center justify-between border-t border-b py-2 md:py-4 px-2 mb-8 md:mb-12 gap-4">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto w-full md:w-auto">
              <span className="text-xs md:text-sm font-medium text-muted-foreground">Filter:</span>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs md:text-sm">
                          Availability <ChevronDown className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuCheckboxItem checked={availability.includes('in-stock')} onCheckedChange={() => handleAvailabilityChange('in-stock')}>
                        In Stock
                    </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem checked={availability.includes('out-of-stock')} onCheckedChange={() => handleAvailabilityChange('out-of-stock')}>
                        Out of Stock
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
              </DropdownMenu>

               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs md:text-sm">
                          Price <ChevronDown className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 md:w-64 p-4">
                      <Slider
                        min={0}
                        max={1000}
                        step={10}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Rs. {priceRange[0]}</span>
                        <span>Rs. {priceRange[1]}</span>
                      </div>
                  </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs md:text-sm">
                          Products <ChevronDown className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent align="start">
                        {ALL_CATEGORIES.map(category => (
                            <DropdownMenuCheckboxItem
                                key={category}
                                checked={selectedCategory === category}
                                onCheckedChange={() => setSelectedCategory(category)}
                            >
                                {category}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
              </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between">
              <div className="flex items-center gap-1 md:gap-2">
                  <span className="text-xs md:text-sm font-medium text-muted-foreground">Sort by:</span>
                   <Select onValueChange={setSortBy} defaultValue={sortBy}>
                      <SelectTrigger className="w-[120px] md:w-[180px] h-8 md:h-9 text-xs md:text-sm">
                          <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
               <p className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">{sortedAndFilteredProducts.length} products</p>
          </div>
      </div>

      <main>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <Skeleton className="h-48 md:h-64 w-full" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                ))}
            </div>
          ) : (
             sortedAndFilteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {sortedAndFilteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl md:text-2xl font-semibold">No Products Found</h2>
                    <p className="text-muted-foreground mt-2 text-sm md:text-base">Try adjusting your filters to find what you're looking for.</p>
                </div>
            )
          )}
      </main>

      {testimonials.length > 0 && (
        <section className="bg-primary text-primary-foreground w-full overflow-hidden rounded-2xl mt-12 md:mt-24">
            <SectionHeading className="mb-12 container mx-auto pt-12 md:pt-24 text-3xl md:text-5xl">
            We take <em>Pride</em> in our work and <br />
            our customer testimonials reflect that
            </SectionHeading>
            <Carousel
            setApi={setTestimonialApi}
            opts={{
                align: 'center',
                loop: true,
            }}
            className="w-full"
            >
            <CarouselContent>
                {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                    <div className="h-full">
                    <div
                        className={cn(
                        'text-center h-full flex flex-col justify-center items-center transition-all duration-300 p-4',
                        currentTestimonial === index
                            ? 'opacity-100 transform scale-105'
                            : 'opacity-50 transform scale-90'
                        )}
                    >
                        <p
                        className={cn(
                            'font-semibold',
                            currentTestimonial === index ? 'text-base md:text-lg text-primary-foreground' : 'text-sm md:text-base text-primary-foreground/70'
                        )}
                        >
                        &quot;{testimonial.quote}&quot;
                        </p>
                        <p className="mt-4 font-semibold uppercase text-xs md:text-sm tracking-wider text-primary-foreground/90">
                        - {testimonial.author}
                        </p>
                    </div>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8 pb-12 md:pb-24">
                {testimonials.map((_, index) => (
                <DotButton
                    key={index}
                    selected={index === currentTestimonial}
                    onClick={() => scrollToTestimonial(index)}
                />
                ))}
            </div>
            </Carousel>
        </section>
      )}
    </div>
  );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ProductListContent />
        </Suspense>
    )
}

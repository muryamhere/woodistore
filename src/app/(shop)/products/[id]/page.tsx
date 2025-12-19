

'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductById, getProductPageContent } from '@/lib/firebase-actions';
import { RecommendedProducts } from '@/components/recommended-products';
import { Star, Heart, Share2, Minus, Plus, Truck, Clock, Globe, Recycle } from 'lucide-react';
import { trackProductView } from '@/lib/actions';
import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Product, ImageAsset, Guarantee, ProductPageContent, Testimonial } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { SectionHeading } from '@/components/section-heading';

function QuantitySelector({ quantity, setQuantity, stock }: { quantity: number; setQuantity: (q: number) => void; stock: number }) {
  const { toast } = useToast();

  const handleIncrement = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    } else {
      toast({
        title: 'Stock limit reached',
        description: `You cannot add more than ${stock} items.`,
        variant: 'destructive',
      });
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrement}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-12 text-center font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrement}
        disabled={quantity >= stock}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

const placeholderReviews = [
    {
        author: 'Jane Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        date: '2 weeks ago',
        rating: 5,
        comment: "Absolutely stunning craftsmanship. The wood is beautiful and it's the perfect centerpiece for my living room. Exceeded my expectations!"
    },
    {
        author: 'John Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        date: '1 month ago',
        rating: 4,
        comment: "Great quality and looks fantastic. Shipping was a bit slow, but it was worth the wait. Very solid piece of furniture."
    },
    {
        author: 'Emily White',
        avatar: 'https://i.pravatar.cc/150?img=3',
        date: '3 months ago',
        rating: 5,
        comment: "I'm in love with this! The attention to detail is incredible. It feels like a true piece of art. Highly recommend this shop."
    }
];

const defaultGuarantees: Guarantee[] = [
    { icon: 'Truck', title: 'Doorstep Delivery', description: 'Receive purchases at your doorstep throughout all major cities in Pakistan.' },
    { icon: 'Clock', title: 'After Sale Support', description: 'All our products come with our promise of long-term after sales service.' },
    { icon: 'Globe', title: 'International Standard', description: 'Our products are created locally and adhere to global manufacturing standards.' },
    { icon: 'Recycle', title: 'Assembly Assistance', description: 'After delivery, our team of experts helps you assemble your products in your location for maximum ease.' },
];

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


const defaultProductPageContent: ProductPageContent = {
    promoBannerImage: { id: 'promo-banner', url: 'https://picsum.photos/seed/decor-accessories/1600/900', alt: 'Elegant home decor accessories on a table', hint: 'home decor' },
    guarantees: defaultGuarantees,
    testimonials: defaultTestimonials,
};

const DotButton = ({ selected, onClick }: { selected: boolean, onClick: () => void }) => (
  <button
    className={`embla__dot ${selected ? 'embla__dot--selected' : ''}`}
    type="button"
    onClick={onClick}
  />
);

const GuaranteeIcon = ({ iconName }: { iconName: string }) => {
    switch (iconName) {
        case 'Truck': return <Truck className="h-8 w-8 md:h-10 md:w-10 text-primary mb-4" />;
        case 'Clock': return <Clock className="h-8 w-8 md:h-10 md:w-10 text-primary mb-4" />;
        case 'Globe': return <Globe className="h-8 w-8 md:h-10 md:w-10 text-primary mb-4" />;
        case 'Recycle': return <Recycle className="h-8 w-8 md:h-10 md:w-10 text-primary mb-4" />;
        default: return null;
    }
}


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [pageContent, setPageContent] = useState<ProductPageContent>(defaultProductPageContent);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<ImageAsset | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [fetchedProduct, fetchedContent] = await Promise.all([
          getProductById(params.id),
          getProductPageContent(),
        ]);
        
        if (!fetchedProduct) {
          notFound();
        } else {
          setProduct(fetchedProduct);
          const primary = fetchedProduct.images.find(img => img.isPrimary) || fetchedProduct.images[0];
          setActiveImage(primary);
        }

        if (fetchedContent) {
            setPageContent({
                ...defaultProductPageContent,
                ...fetchedContent,
                guarantees: fetchedContent.guarantees?.length ? fetchedContent.guarantees : defaultGuarantees,
                testimonials: fetchedContent.testimonials?.length ? fetchedContent.testimonials : defaultTestimonials,
            });
        }

      } catch (error) {
        console.error("Failed to fetch product data", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    trackProductView(params.id);
  }, [params.id]);

  const formattedPrice = useMemo(() => {
    if (!product) return '';
    return `Rs. ${product.price.toFixed(2)}`;
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4">
             <div className="order-first md:order-first flex md:flex-col gap-2">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)}
             </div>
             <Skeleton className="w-full aspect-square" />
          </div>
          <div>
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/4 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-10 w-48" />
             <Skeleton className="h-24 w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="bg-background px-4 md:px-0">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="md:sticky top-24 self-start">
            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4">
                <div className="order-first md:order-first flex md:flex-col gap-2">
                {product.images.map((image) => (
                    <button
                    key={image.id}
                    className={cn(
                        "aspect-square relative rounded-md overflow-hidden border-2 transition",
                        activeImage?.id === image.id ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
                    )}
                    onClick={() => setActiveImage(image)}
                    >
                    <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 20vw, 10vw"
                        className="object-cover"
                        data-ai-hint={image.hint}
                    />
                    </button>
                ))}
                </div>
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                {activeImage && (
                    <Image
                    src={activeImage.url}
                    alt={activeImage.alt}
                    fill
                    sizes="(max-width: 768px) 80vw, 40vw"
                    className="object-cover"
                    data-ai-hint={activeImage.hint}
                    priority
                    />
                )}
                </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-sm text-muted-foreground mb-2">
                <Link href="/" className="hover:text-primary">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/products" className="hover:text-primary">Products</Link>
                <span className="mx-2">/</span>
                <Link href={`/products?category=${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
            </div>
            <h1 className="font-headline text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl md:text-2xl font-semibold mb-4">{formattedPrice}</p>
            
            <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                </div>
                <span className="text-sm text-muted-foreground">(34 reviews)</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            <Separator className="my-2"/>

            <div className="py-6 space-y-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-base font-semibold w-20">Quantity</h3>
                    <QuantitySelector quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
                </div>
                <Button size="lg" className="w-full" onClick={() => addToCart(product, quantity)}>
                    Add to Cart
                </Button>
                <p className="text-sm text-muted-foreground mt-2">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
            </div>

            <Separator className="my-2"/>

            <div className="flex items-center gap-4 py-4">
                <Button variant="outline" size="sm">
                    <Heart className="mr-2 h-4 w-4"/> Add to Favorites
                </Button>
                 <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4"/>
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue="overview">
              <AccordionItem value="overview">
                <AccordionTrigger>Overview</AccordionTrigger>
                <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>Handcrafted from sustainably sourced {product.category === 'Furniture' ? 'solid wood' : 'materials'}.</li>
                        <li>Designed for timeless appeal and durability.</li>
                        <li>Finished with non-toxic, eco-friendly oils.</li>
                    </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="dimensions">
                <AccordionTrigger>Dimensions &amp; Care</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-4">Dimensions are approximate as each piece is unique.</p>
                  <strong className="font-semibold">Care:</strong>
                  <p className="text-muted-foreground">Wipe clean with a soft, dry cloth. Avoid using harsh chemicals or abrasive cleaners. For deep cleaning, use a damp cloth and mild soap.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reviews">
                <AccordionTrigger>Reviews (34)</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-8">
                             <div className="flex-shrink-0 sm:w-1/3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl font-bold">4.9</h3>
                                    <div className="flex text-yellow-400">
                                        <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">Based on 34 reviews</p>
                                <Button variant="outline" className="w-full mt-2">Write a review</Button>
                             </div>
                             <div className="flex-1 space-y-2">
                                {[
                                    {stars: 5, percentage: 92},
                                    {stars: 4, percentage: 5},
                                    {stars: 3, percentage: 2},
                                    {stars: 2, percentage: 1},
                                    {stars: 1, percentage: 0},
                                ].map(item => (
                                    <div key={item.stars} className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{item.stars} star</span>
                                        <Progress value={item.percentage} className="w-full h-2" />
                                        <span className="text-sm text-muted-foreground w-8 text-right">{item.percentage}%</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <Separator/>
                        
                        <div className="space-y-6">
                            {placeholderReviews.map((review, index) => (
                                <div key={index} className="flex gap-4">
                                    <Avatar>
                                        <AvatarImage src={review.avatar} />
                                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-4 h-4", i < review.rating ? 'fill-current' : 'fill-muted stroke-muted-foreground')}/>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="font-semibold text-sm">{review.author}</p>
                                        <p className="text-xs text-muted-foreground mb-2">{review.date}</p>
                                        <p className="text-muted-foreground">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Ships within 3-5 business days. We offer a 30-day return policy for items in original condition. Please see our <Link href="/shipping-delivery" className="underline hover:text-primary">Shipping</Link> and <Link href="/warranty" className="underline hover:text-primary">Returns</Link> pages for more details.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RecommendedProducts currentProductId={product.id} />
      </div>

      <div className="py-12 space-y-12">
        <section className="relative h-[60vh] flex items-center justify-center rounded-2xl overflow-hidden container mx-auto">
            <div className="absolute inset-0 bg-black/50">
                <Image
                    src={pageContent.promoBannerImage.url}
                    alt={pageContent.promoBannerImage.alt}
                    fill
                    className="object-cover"
                    data-ai-hint={pageContent.promoBannerImage.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent"></div>
            </div>
            <div className="relative container mx-auto text-left text-white max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-md md:max-w-xl">
                    <h2 className="font-headline text-3xl md:text-5xl font-medium">
                        Elevate your interior with captivating <em>Home Decor</em> accessories
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-white/90">
                        Discover a world of enchanting home decor accessories that will elevate your living space to new heights of beauty and charm. Each accessory is thoughtfully crafted to add a touch of unique style to every nook and corner of your home.
                    </p>
                </div>
            </div>
        </section>

        <section className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                {pageContent.guarantees.map((guarantee, index) => (
                    <div key={index} className="flex flex-col items-center p-2">
                        <GuaranteeIcon iconName={guarantee.icon} />
                        <h3 className="font-headline text-lg md:text-xl font-semibold mb-2">{guarantee.title}</h3>
                        <p className="text-muted-foreground text-xs md:text-sm">{guarantee.description}</p>
                    </div>
                ))}
            </div>
        </section>

        <section className="bg-primary text-primary-foreground w-full overflow-hidden rounded-2xl">
            <SectionHeading className="mb-12 container mx-auto pt-12 md:pt-24 text-3xl md:text-5xl">
            We take <em>Pride</em> in our work and <br />
            our customer testimonials reflect that
            </SectionHeading>
            <Carousel
            setApi={setApi}
            opts={{
                align: 'center',
                loop: true,
            }}
            className="w-full"
            >
            <CarouselContent>
                {pageContent.testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/5">
                    <div className="h-full">
                    <div
                        className={cn(
                        'text-center h-full flex flex-col justify-center items-center transition-all duration-300 p-4',
                        current === index
                            ? 'opacity-100 transform scale-105'
                            : 'opacity-50 transform scale-90'
                        )}
                    >
                        <p
                        className={cn(
                            'font-semibold',
                            current === index ? 'text-base md:text-lg text-primary-foreground' : 'text-sm md:text-base text-primary-foreground/70'
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
                {pageContent.testimonials.map((_, index) => (
                <DotButton
                    key={index}
                    selected={index === current}
                    onClick={() => scrollTo(index)}
                />
                ))}
            </div>
            </Carousel>
        </section>
      </div>
    </div>
  );
}

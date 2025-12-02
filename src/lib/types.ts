

import { Timestamp } from "firebase/firestore";

export type ImageAsset = {
  id: string;
  url: string;
  alt: string;
  hint: string;
  isPrimary?: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: ImageAsset[];
  category: 'Furniture' | 'Home Decor' | 'Kitchenware' | 'Toys';
  stock: number;
  sku?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type LineItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number; // Price at the time of purchase
};

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  items: LineItem[];
};

export type Customer = {
    email: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
    lastOrdered: Timestamp;
}

export type CustomerDetail = Customer & {
  orders: Order[];
}

export type ExploreSection = {
  title: string;
  href: string;
  image: ImageAsset;
};

export type InSituSpot = {
    productId: string;
    title: string;
    price: string;
    image: ImageAsset;
}

export type InSituSection = {
    background: ImageAsset;
    spots: InSituSpot[];
}

export type TeamMember = {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
    avatarHint: string;
    bio: string;
    newAvatar?: File;
}

export type Guarantee = {
    icon: 'Truck' | 'Clock' | 'Globe' | 'Recycle';
    title: string;
    description: string;
};

export type Testimonial = {
    quote: string;
    author: string;
};

export type ProductPageContent = {
    promoBannerImage: ImageAsset;
    guarantees: Guarantee[];
    testimonials: Testimonial[];
};


export type AboutPageContent = {
    heroImage: ImageAsset;
    philosophyImage: ImageAsset;
    workshopImage: ImageAsset;
    team?: TeamMember[];
};

export type SiteContent = {
  hero: {
    title: string;
    subtitle: string;
    image: ImageAsset;
  };
  headerLogoLight?: ImageAsset;
  headerLogoDark?: ImageAsset;
  footerLogoLight?: ImageAsset;
  footerLogoDark?: ImageAsset;
  adminLogoLight?: ImageAsset;
  adminLogoDark?: ImageAsset;
  exploreSections?: ExploreSection[];
  craftsmanshipSection?: {
    image: ImageAsset;
  };
  inSituSection?: InSituSection;
  aboutPage?: AboutPageContent;
  productPage?: ProductPageContent;
  productsPageBanners?: ImageAsset[];
};

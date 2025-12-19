import type { Product } from './types';

export const products: Product[] = [
  {
    id: 'w-chair-01',
    name: 'Artisan Oak Chair',
    description:
      'A beautifully handcrafted chair made from solid oak. Its minimalist design and natural finish bring warmth and elegance to any room. Built to last for generations.',
    price: 249.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/chair1/600/600', alt: 'Front view of the Artisan Oak Chair', hint: 'wooden chair' },
    ],
    category: 'Furniture',
    stock: 15,
  },
  {
    id: 'w-table-01',
    name: 'Solid Walnut Table',
    description:
      'A large dining table that comfortably seats six. Made from rich, dark walnut wood, this table is a statement piece for any dining area. Perfect for family gatherings.',
    price: 899.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/table1/600/600', alt: 'A solid walnut dining table', hint: 'dining table' },
    ],
    category: 'Furniture',
    stock: 8,
  },
  {
    id: 'w-bowl-01',
    name: 'Hand-Turned Maple Bowl',
    description:
      'A versatile and beautiful bowl, hand-turned from a single piece of maple wood. Ideal for serving salads, fruits, or as a stunning decorative centerpiece.',
    price: 79.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/bowl1/600/600', alt: 'A hand-turned maple bowl', hint: 'wooden bowl' },
    ],
    category: 'Kitchenware',
    stock: 32,
  },
  {
    id: 'w-lamp-01',
    name: 'Modern Wooden Lamp',
    description:
      'Illuminate your space with this modern desk lamp. Featuring an adjustable arm and a warm, natural wood finish, it combines functionality with sleek design.',
    price: 129.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/lamp1/600/600', alt: 'A modern wooden desk lamp', hint: 'desk lamp' },
    ],
    category: 'Home Decor',
    stock: 20,
  },
  {
    id: 'w-shelf-01',
    name: 'Reclaimed Pine Shelves',
    description:
      'A set of two floating shelves made from reclaimed pine. These rustic shelves add character and practical storage to any wall, perfect for books, plants, or decor.',
    price: 159.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/shelf1/600/600', alt: 'Two floating shelves made of reclaimed pine', hint: 'floating shelves' },
    ],
    category: 'Furniture',
    stock: 25,
  },
  {
    id: 'w-board-01',
    name: 'Walnut Cutting Board',
    description:
      'A large, durable cutting board made from premium walnut. Its generous size is perfect for all your kitchen prep, and its beauty makes it a great serving platter.',
    price: 99.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/board1/600/600', alt: 'A large walnut cutting board', hint: 'cutting board' },
    ],
    category: 'Kitchenware',
    stock: 40,
  },
  {
    id: 'w-toy-01',
    name: 'Classic Wooden Racer',
    description:
      "A timeless toy for all ages. This classic wooden racing car is handcrafted from smooth beech wood and finished with non-toxic paint. Sparks imagination and endless fun.",
    price: 39.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/toy1/600/600', alt: 'A classic wooden toy race car', hint: 'wooden toy' },
    ],
    category: 'Toys',
    stock: 50,
  },
  {
    id: 'w-clock-01',
    name: 'Minimalist Wall Clock',
    description:
      'Keep time in style with this minimalist wall clock. Crafted from a single piece of birch plywood with simple brass hands, it adds a touch of modern elegance.',
    price: 89.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/clock1/600/600', alt: 'A minimalist wooden wall clock', hint: 'wall clock' },
    ],
    category: 'Home Decor',
    stock: 18,
  },
    {
    id: 'w-chair-02',
    name: 'Rustic Armchair',
    description:
      'A comfortable armchair with a rustic charm. Made from solid teak with a woven rattan seat, it is perfect for a covered porch or a cozy reading nook.',
    price: 349.99,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/chair2/600/600', alt: 'Rustic armchair with woven seat', hint: 'rustic armchair' },
    ],
    category: 'Furniture',
    stock: 12,
  },
  {
    id: 'w-utensils-01',
    name: 'Olive Wood Utensils',
    description:
      'A set of five essential kitchen utensils, handcrafted from beautiful olive wood. Includes a spatula, spoon, slotted spoon, fork, and corner spoon. Naturally durable and gentle on cookware.',
    price: 65.00,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/utensils1/600/600', alt: 'Set of handcrafted wooden kitchen utensils', hint: 'kitchen utensils' },
    ],
    category: 'Kitchenware',
    stock: 28,
  },
  {
    id: 'w-frame-01',
    name: 'Simple Ash Frame',
    description:
      'Display your favorite memories in this simple yet elegant picture frame. Made from solid ash wood with a clean, modern profile. Fits a 5x7 photo.',
    price: 45.00,
    images: [
      { id: '1', url: 'https://picsum.photos/seed/frame1/600/600', alt: 'A simple wooden picture frame', hint: 'picture frame' },
    ],
    category: 'Home Decor',
    stock: 35,
  }
];

export function getProductById(id: string) {
    throw new Error('getProductById from mock-data is deprecated. Use from lib/firebase-actions instead.');
}

export function getProducts() {
    throw new Error('getProducts from mock-data is deprecated. Use from lib/firebase-actions instead.');
}

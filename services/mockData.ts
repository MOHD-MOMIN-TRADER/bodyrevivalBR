
import { Product, Review, Coupon, Order } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Natural Peanut Butter',
    shortDescription: '100% Roasted Peanuts, No Added Sugar.',
    description: 'Experience the pure taste of high-quality peanuts roasted to perfection. Our Natural Peanut Butter is rich in protein, heart-healthy fats, and contains zero added sugar or preservatives. Perfect for fitness enthusiasts.',
    image: '/natural1.png',
      images: [
       '/natural1.png',
       '/natural2.png',
      '/natural3.png'
      ],
    rating: 4.8,
    reviewsCount: 1240,
    tags: ['Best Seller', 'Vegan', 'Keto'],
    variants: [
      { weight: '500g', price: 262, sku: 'NPB-500' },
      { weight: '1kg', price: 449, sku: 'NPB-1000' }
    ]
  },
  {
    id: 'p2',
    name: 'Choco Nut Delights',
    shortDescription: 'Decadent chocolate swirl with crunch.',
    description: 'A guilt-free indulgence. Premium cocoa blended with our signature roasted peanuts creates a smooth, chocolatey treat that satisfies cravings without the excess sugar.',
    image: '/choco1.png',
    images: [
        '/choco1.png','choco2.png','/choco3.png'
    ],
    rating: 4.9,
    reviewsCount: 856,
    tags: ['New Arrival', 'Sweet', 'Kids Favorite'],
    variants: [
      { weight: '500g', price: 349, sku: 'CND-500' },
      { weight: '1kg', price: 599, sku: 'CND-1000' }
    ]
  },
  {
    id: 'p3',
    name: 'Crunchy Honey Roast',
    shortDescription: 'Sweetened with organic honey.',
    description: 'For those who like a little sweetness and a lot of crunch. Roasted with organic honey for a caramelized flavor profile that pairs perfectly with toast or oatmeal.',
    image: '/Honey1.png',
    images: [
        '/Honey1.png','/honey2.png','/honey3.png'
    ],
    rating: 4.7,
    reviewsCount: 620,
    tags: ['Organic', 'Crunchy'],
    variants: [
      { weight: '500g', price: 299, sku: 'CHR-500' },
      { weight: '1kg', price: 549, sku: 'CHR-1000' }
    ]
  }
];

// Using placeholder video URLs that are safe for general audiences (mix of food/fitness)
export const REVIEWS: Review[] = [
  { 
    id: 'r1', 
    author: 'Raksha P.', 
    rating: 5, 
    text: 'Best protein kick ever! The natural taste is unmatched.', 
    date: '2 days ago', 
    avatar: 'https://picsum.photos/id/1005/100/100',
    videoUrl: 'v2.mp4',
    thumbnail: 'choco1.png'
  },
  { 
    id: 'r2', 
    author: 'Priya M.', 
    rating: 5, 
    text: 'Finally a healthy choco spread my kids actually eat.', 
    date: '1 week ago', 
    avatar: 'https://picsum.photos/id/1011/100/100',
    videoUrl: 'v3.mp4',
    thumbnail: 'image2.jpg'
  },
  { 
    id: 'r3', 
    author: 'Amit K.', 
    rating: 4, 
    text: 'Delivery was super fast. Packaging is premium.', 
    date: '3 days ago', 
    avatar: 'https://picsum.photos/id/1012/100/100',
    videoUrl: 'v4.mp4',
    thumbnail: 'image1.png'
  },
  { 
    id: 'r4', 
    author: 'Sneha R.', 
    rating: 5, 
    text: 'Love the consistency. Not too oily, just perfect.', 
    date: '5 days ago', 
    avatar: 'https://picsum.photos/id/1027/100/100',
    videoUrl: 'v5.mp4',
    thumbnail: 'natural1.png'
  },
  { 
    id: 'r5', 
    author: 'unknown.', 
    rating: 2, 
    text: 'Gym essential. 1kg tub lasts me a month.', 
    date: 'Just now', 
    avatar: 'https://picsum.photos/id/1006/100/100',
    videoUrl: 'v6.mp4',
    thumbnail: 'image.png'
  },
];

export const COUPONS: Coupon[] = [
  { code: 'WELCOME20', discountType: 'PERCENTAGE', value: 20, description: '20% Off your first order' },
  { code: 'SAVE50', discountType: 'FIXED', value: 50, minOrderValue: 500, description: 'Flat ₹50 off on orders above ₹500' }
];

export const ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Arjun Verma', total: 898, status: 'Delivered', date: '2023-10-15', items: [] },
  { id: 'ORD-002', customerName: 'Zara Khan', total: 1198, status: 'Shipped', date: '2023-10-20', items: [] },
  { id: 'ORD-003', customerName: 'Leo Das', total: 449, status: 'Processing', date: '2023-10-22', items: [] },
];

export interface Variant {
  weight: '500g' | '1kg';
  price: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  images?: string[]; // Added support for multiple gallery images
  rating: number;
  reviewsCount: number;
  variants: Variant[];
  tags: string[];
}

export interface CartItem {
  productId: string;
  variantWeight: '500g' | '1kg';
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderValue?: number;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
  videoUrl?: string;
  thumbnail?: string;
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  date: string;
  items: CartItem[];
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  savedAddresses: Address[];
}
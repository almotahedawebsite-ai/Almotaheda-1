import { TranslatableString } from './settings';

export interface Category {
  id: string;
  name: TranslatableString;
  description?: TranslatableString;
  image?: string;
  order?: number;
  slug: string;
}

export interface Product {
  id: string;
  name: TranslatableString;
  description: TranslatableString;
  price: number;
  salePrice?: number;
  stock: number;
  images: string[];
  categoryId: string;
  slug: string;
  isFeatured?: boolean;
  attributes?: { name: string; value: string }[];
}

export interface StoreConfig {
  currency: string;             // e.g. "EGP", "USD"
  taxPercentage: number;
  shippingFee: number;
  minOrderAmount: number;
  storeName: TranslatableString;
  storeStatus: 'open' | 'closed' | 'maintenance';
}

export interface PaymentMethod {
  id: string;
  name: string;
  provider: 'cod' | 'stripe' | 'paypal' | 'fawry' | 'paymob' | 'wallet' | 'bank' | 'custom';
  enabled: boolean;
  config?: any;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: any;
}

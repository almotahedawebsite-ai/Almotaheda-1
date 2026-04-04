import { unstable_cache } from 'next/cache';
import { adminDb } from '@/infrastructure/firebase/admin';
import { Category, Product, StoreConfig, PaymentMethod, Order } from '@/domain/types/store';
import * as admin from 'firebase-admin';

export class ServerStoreRepository {
  private db = adminDb;

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    return unstable_cache(
      async () => {
        const snap = await this.db.collection('categories').orderBy('order', 'asc').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      },
      ['all-categories'],
      { tags: ['categories'] }
    )();
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    return unstable_cache(
      async () => {
        const snap = await this.db.collection('products').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      },
      ['all-products'],
      { tags: ['products'] }
    )();
  }

  // --- Store Config ---
  async getStoreConfig(): Promise<StoreConfig | null> {
    return unstable_cache(
      async () => {
        const snap = await this.db.collection('settings').doc('store').get();
        if (!snap.exists) return null;
        return snap.data() as StoreConfig;
      },
      ['store-config'],
      { tags: ['settings'] }
    )();
  }

  // --- Payment Methods ---
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const snap = await this.db.collection('payment_methods').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod));
  }

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    const snap = await this.db.collection('orders').orderBy('createdAt', 'desc').get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  }

  async saveOrder(order: Partial<Order>): Promise<string> {
    const res = await this.db.collection('orders').add({
      ...order,
      createdAt: admin.firestore.Timestamp.now()
    });
    return res.id;
  }
}

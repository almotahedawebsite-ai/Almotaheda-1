import { 
  Firestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { Category, Product, StoreConfig, PaymentMethod, Order, OrderItem } from '@/domain/types/store';

export class StoreRepository {
  constructor(private db: Firestore) {}

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    const snap = await getDocs(query(collection(this.db, 'categories'), orderBy('order', 'asc')));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  }

  async saveCategory(category: Partial<Category>): Promise<void> {
    if (category.id) {
      await setDoc(doc(this.db, 'categories', category.id), category, { merge: true });
    } else {
      await addDoc(collection(this.db, 'categories'), category);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'categories', id));
  }

  // --- Products ---
  async getProducts(): Promise<Product[]> {
    const snap = await getDocs(collection(this.db, 'products'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  async saveProduct(product: Partial<Product>): Promise<void> {
    if (product.id) {
      await setDoc(doc(this.db, 'products', product.id), product, { merge: true });
    } else {
      await addDoc(collection(this.db, 'products'), product);
    }
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'products', id));
  }

  // --- Store Config ---
  async getStoreConfig(): Promise<StoreConfig | null> {
    const snap = await getDoc(doc(this.db, 'settings', 'store'));
    if (!snap.exists()) return null;
    return snap.data() as StoreConfig;
  }

  async saveStoreConfig(config: Partial<StoreConfig>): Promise<void> {
    await setDoc(doc(this.db, 'settings', 'store'), config, { merge: true });
  }

  // --- Payment Methods ---
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const snap = await getDocs(collection(this.db, 'payment_methods'));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentMethod));
  }

  async savePaymentMethod(method: Partial<PaymentMethod>): Promise<void> {
    if (method.id) {
      await setDoc(doc(this.db, 'payment_methods', method.id), method, { merge: true });
    } else {
      await addDoc(collection(this.db, 'payment_methods'), method);
    }
  }

  async deletePaymentMethod(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'payment_methods', id));
  }

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    const snap = await getDocs(query(collection(this.db, 'orders'), orderBy('createdAt', 'desc')));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  }

  async saveOrder(order: Partial<Order>): Promise<string> {
    const res = await addDoc(collection(this.db, 'orders'), {
      ...order,
      createdAt: new Date()
    });
    return res.id;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    await updateDoc(doc(this.db, 'orders', id), { status });
  }
}

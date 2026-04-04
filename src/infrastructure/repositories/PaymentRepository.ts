import { Firestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { Payment } from '../../domain/types/booking';

export class PaymentRepository extends BaseRepository<Payment> {
  constructor(db: Firestore) {
    super(db, 'payments');
  }

  async getAll(): Promise<Payment[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Payment);
  }

  async getPending(): Promise<Payment[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Payment);
  }

  async getByBookingId(bookingId: string): Promise<Payment | null> {
    const results = await this.find([
      { field: 'bookingId', operator: '==', value: bookingId }
    ]);
    return results[0] || null;
  }
}

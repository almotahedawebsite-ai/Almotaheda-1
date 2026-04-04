import { Firestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { Booking } from '../../domain/types/booking';

export class BookingRepository extends BaseRepository<Booking> {
  constructor(db: Firestore) {
    super(db, 'bookings');
  }

  async getAll(): Promise<Booking[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Booking);
  }

  async getByStatus(status: string): Promise<Booking[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('status', '==', status), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Booking);
  }

  async getByCustomerUid(uid: string): Promise<Booking[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('customerUid', '==', uid), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Booking);
  }
}

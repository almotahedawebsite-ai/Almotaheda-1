import { Firestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { BeforeAfterImage } from '../../domain/types/beforeAfter';

export class BeforeAfterRepository extends BaseRepository<BeforeAfterImage> {
  constructor(db: Firestore) {
    super(db, 'before_after_images');
  }

  async getAll(): Promise<BeforeAfterImage[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as BeforeAfterImage);
  }

  async getActive(): Promise<BeforeAfterImage[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('isActive', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as BeforeAfterImage);
  }
}

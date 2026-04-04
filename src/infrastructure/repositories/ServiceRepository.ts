import { Firestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { Service } from '../../domain/types/service';

export class ServiceRepository extends BaseRepository<Service> {
  constructor(db: Firestore) {
    super(db, 'services');
  }

  async getBySlug(slug: string): Promise<Service | null> {
    const results = await this.find([
      { field: 'slug', operator: '==', value: slug }
    ]);
    return results[0] || null;
  }

  async getAll(): Promise<Service[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Service);
  }

  async getActive(): Promise<Service[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('isActive', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Service);
  }
}

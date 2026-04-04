import { Firestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { Branch } from '../../domain/types/branch';

export class BranchRepository extends BaseRepository<Branch> {
  constructor(db: Firestore) {
    super(db, 'branches');
  }

  async getAll(): Promise<Branch[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Branch);
  }

  async getActive(): Promise<Branch[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('isActive', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Branch);
  }
}

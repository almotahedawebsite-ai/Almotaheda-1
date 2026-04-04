import { Firestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { Contract } from '../../domain/types/contract';

export class ContractRepository extends BaseRepository<Contract> {
  constructor(db: Firestore) {
    super(db, 'contracts');
  }

  async getAll(): Promise<Contract[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Contract);
  }

  async getByStatus(status: string): Promise<Contract[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('status', '==', status), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Contract);
  }

  async getActive(): Promise<Contract[]> {
    return this.getByStatus('active');
  }
}

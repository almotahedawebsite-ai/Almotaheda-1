import { Firestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { KeyClient } from '../../domain/types/keyClient';

export class KeyClientRepository extends BaseRepository<KeyClient> {
  constructor(db: Firestore) {
    super(db, 'key_clients');
  }

  async getAll(): Promise<KeyClient[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as KeyClient);
  }

  async getActive(): Promise<KeyClient[]> {
    const colRef = collection(this.db, this.collectionName);
    const q = query(colRef, where('isActive', '==', true), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as KeyClient);
  }
}

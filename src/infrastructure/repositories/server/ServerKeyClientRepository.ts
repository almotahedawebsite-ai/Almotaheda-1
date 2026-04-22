import { unstable_cache } from 'next/cache';
import { adminDb } from '../../firebase/admin';
import { ServerBaseRepository } from './ServerBaseRepository';
import { KeyClient } from '../../../domain/types/keyClient';

export class ServerKeyClientRepository extends ServerBaseRepository<KeyClient> {
  constructor() {
    super(adminDb, 'key_clients');
  }

  async getAll(): Promise<KeyClient[]> {
    return unstable_cache(
      async () => {
        const snapshot = await this.collection.orderBy('order', 'asc').get();
        return snapshot.docs.map(doc => doc.data() as KeyClient);
      },
      ['all-key-clients-v3'],
      { tags: ['key_clients'] }
    )();
  }

  async getActive(): Promise<KeyClient[]> {
    return unstable_cache(
      async () => {
        const snapshot = await this.collection
          .where('isActive', '==', true)
          .orderBy('order', 'asc')
          .get();
        return snapshot.docs.map(doc => doc.data() as KeyClient);
      },
      ['active-key-clients-v3'],
      { tags: ['key_clients'] }
    )();
  }

  async getById(id: string): Promise<KeyClient | null> {
    return unstable_cache(
      async () => {
        const doc = await this.collection.doc(id).get();
        return doc.exists ? (doc.data() as KeyClient) : null;
      },
      [`key-client-${id}`],
      { tags: ['key_clients'] }
    )();
  }
}

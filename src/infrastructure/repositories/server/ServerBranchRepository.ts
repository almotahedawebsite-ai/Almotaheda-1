import { unstable_cache } from 'next/cache';
import { adminDb } from '../../firebase/admin';
import { ServerBaseRepository } from './ServerBaseRepository';
import { Branch } from '../../../domain/types/branch';

export class ServerBranchRepository extends ServerBaseRepository<Branch> {
  constructor() {
    super(adminDb, 'branches');
  }

  async getAll(): Promise<Branch[]> {
    return unstable_cache(
      async () => {
        const snapshot = await this.collection.orderBy('order', 'asc').get();
        return snapshot.docs.map(doc => doc.data() as Branch);
      },
      ['all-branches-v2'],
      { tags: ['branches'] }
    )();
  }

  async getActive(): Promise<Branch[]> {
    return unstable_cache(
      async () => {
        const snapshot = await this.collection
          .where('isActive', '==', true)
          .orderBy('order', 'asc')
          .get();
        return snapshot.docs.map(doc => doc.data() as Branch);
      },
      ['active-branches-v2'],
      { tags: ['branches'] }
    )();
  }
}

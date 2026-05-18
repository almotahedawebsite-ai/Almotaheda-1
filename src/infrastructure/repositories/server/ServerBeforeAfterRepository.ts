import { unstable_cache } from 'next/cache';
import { adminDb } from '../../firebase/admin';
import { ServerBaseRepository } from './ServerBaseRepository';
import { BeforeAfterImage } from '../../../domain/types/beforeAfter';

export class ServerBeforeAfterRepository extends ServerBaseRepository<BeforeAfterImage> {
  constructor() {
    super(adminDb, 'before_after_images');
  }

  async getAll(): Promise<BeforeAfterImage[]> {
    return unstable_cache(
      async () => {
        const snapshot = await this.collection.orderBy('order', 'asc').get();
        return snapshot.docs.map(doc => doc.data() as BeforeAfterImage);
      },
      ['all-before-after-v2'],
      { tags: ['before_after_images'] }
    )();
  }

  async getActive(): Promise<BeforeAfterImage[]> {
    return unstable_cache(
      async () => {
        const snapshot = await this.collection
          .where('isActive', '==', true)
          .orderBy('order', 'asc')
          .get();
        return snapshot.docs.map(doc => doc.data() as BeforeAfterImage);
      },
      ['active-before-after-v2'],
      { tags: ['before_after_images'] }
    )();
  }

  override async getById(id: string): Promise<BeforeAfterImage | null> {
    return unstable_cache(
      async () => {
        const doc = await this.collection.doc(id).get();
        return doc.exists ? (doc.data() as BeforeAfterImage) : null;
      },
      [`before-after-${id}`],
      { tags: ['before_after_images'] }
    )();
  }
}

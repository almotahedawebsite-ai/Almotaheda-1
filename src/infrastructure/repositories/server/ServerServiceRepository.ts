import { unstable_cache } from 'next/cache';
import { adminDb } from '../../firebase/admin';
import { ServerBaseRepository } from './ServerBaseRepository';
import { Service } from '../../../domain/types/service';

export class ServerServiceRepository extends ServerBaseRepository<Service> {
  constructor() {
    super(adminDb, 'services');
  }

  async getBySlug(slug: string): Promise<Service | null> {
    return unstable_cache(
      async () => {
        const results = await this.find([
          { field: 'slug', operator: '==', value: slug }
        ]);
        return results[0] || null;
      },
      [`service-${slug}`],
      { tags: ['services'] }
    )();
  }

  async getAll(): Promise<Service[]> {
    return unstable_cache(
      async () => {
        const snapshot = await this.collection.orderBy('order', 'asc').get();
        return snapshot.docs.map(doc => doc.data() as Service);
      },
      ['all-services-v2'],
      { tags: ['services'] }
    )();
  }

  async getActive(): Promise<Service[]> {
    return unstable_cache(
      async () => {
        const snapshot = await this.collection
          .where('isActive', '==', true)
          .orderBy('order', 'asc')
          .get();
        return snapshot.docs.map(doc => doc.data() as Service);
      },
      ['active-services-v2'],
      { tags: ['services'] }
    )();
  }
}

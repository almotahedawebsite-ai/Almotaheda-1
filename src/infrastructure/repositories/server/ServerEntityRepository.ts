import { unstable_cache } from 'next/cache';
import { adminDb } from '../../firebase/admin';
import { ServerBaseRepository } from './ServerBaseRepository';
import { BaseEntity } from '../../../domain/types/entity';

export class ServerEntityRepository extends ServerBaseRepository<BaseEntity> {
  constructor() {
    super(adminDb, 'entities');
  }

  async getBySlug(slug: string): Promise<BaseEntity | null> {
    return unstable_cache(
      async () => {
        const results = await this.find([
          { field: 'slug', operator: '==', value: slug }
        ]);
        return results[0] || null;
      },
      [`entity-${slug}`],
      { tags: ['entities'] }
    )();
  }

  async getAll(): Promise<BaseEntity[]> {
    return unstable_cache(
      async () => {
        return this.find([]);
      },
      ['all-entities'],
      { tags: ['entities'] }
    )();
  }
}

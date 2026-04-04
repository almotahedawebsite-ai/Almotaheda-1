import { Firestore } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { BaseEntity } from '../../domain/types/entity';

export class EntityRepository extends BaseRepository<BaseEntity> {
  constructor(db: Firestore) {
    super(db, 'entities');
  }

  async getBySlug(slug: string): Promise<BaseEntity | null> {
    const results = await this.find([
      { field: 'slug', operator: '==', value: slug }
    ]);
    return results[0] || null;
  }

  async getAll(): Promise<BaseEntity[]> {
    return this.find([]);
  }
}

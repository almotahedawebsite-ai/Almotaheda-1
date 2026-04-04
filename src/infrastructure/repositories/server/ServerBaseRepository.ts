import * as admin from 'firebase-admin';

export class ServerBaseRepository<T extends { id: string }> {
  protected db: admin.firestore.Firestore;
  protected collection: admin.firestore.CollectionReference;

  constructor(db: admin.firestore.Firestore, protected collectionName: string) {
    this.db = db;
    this.collection = db.collection(collectionName);
  }

  async getById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async find(conditions: { field: string; operator: any; value: any }[]): Promise<T[]> {
    let q: admin.firestore.Query = this.collection;
    
    conditions.forEach(c => {
      q = q.where(c.field, c.operator, c.value);
    });

    const snapshot = await q.get();
    return snapshot.docs.map(doc => doc.data() as T);
  }

  async create(id: string, item: T): Promise<void> {
    await this.collection.doc(id).set(item);
  }

  async update(id: string, updates: Partial<T>): Promise<void> {
    await this.collection.doc(id).update(updates);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}

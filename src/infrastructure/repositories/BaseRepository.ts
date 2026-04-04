import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  DocumentData
} from 'firebase/firestore';

export class BaseRepository<T extends { id: string }> {
  constructor(protected db: Firestore, protected collectionName: string) {}

  async getById(id: string): Promise<T | null> {
    const docRef = doc(this.db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  }

  async find(conditions: { field: string; operator: any; value: any }[]): Promise<T[]> {
    const colRef = collection(this.db, this.collectionName);
    let q = query(colRef);
    
    conditions.forEach(c => {
      q = query(q, where(c.field, c.operator, c.value));
    });

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as T);
  }

  async create(id: string, item: T): Promise<void> {
    await setDoc(doc(this.db, this.collectionName, id), item);
  }

  async update(id: string, updates: Partial<T>): Promise<void> {
    const docRef = doc(this.db, this.collectionName, id);
    await updateDoc(docRef, updates as DocumentData);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.db, this.collectionName, id));
  }
}

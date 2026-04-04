import { Firestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ContactMessage } from '@/domain/types/message';

export class MessageRepository {
  private collectionRef;

  constructor(db: Firestore) {
    this.collectionRef = collection(db, 'messages');
  }

  async getAllMessages(): Promise<ContactMessage[]> {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as ContactMessage[];
  }

  async saveMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>): Promise<void> {
    await addDoc(this.collectionRef, {
      ...message,
      isRead: false,
      createdAt: Date.now()
    });
  }

  async markAsRead(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await updateDoc(docRef, { isRead: true });
  }

  async deleteMessage(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }
}

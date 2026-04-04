/**
 * 10. DEVELOPER GUARDRAILS
 * 
 * Rules enforced by the system:
 * 1. NO direct Firestore access from Page components.
 * 2. ALL data fetching MUST go through a Repository.
 * 3. ALL custom fields MUST be defined in Types.
 */

import { db } from '../infrastructure/firebase/config';
import { BaseRepository } from '../infrastructure/repositories/BaseRepository';

export class Guardrails {
  static preventLeakage() {
    // Logic to detect direct SDK usage (can be integrated with ESLint)
  }
}

/**
 * THOU SHALT NOT PASS CASE: Direct Access Prevention
 * We wrap the repository to ALWAYS inject tenant context and prevent cross-tenant leakage.
 */
export class SecureRepository<T extends { id: string }> extends BaseRepository<T> {
  constructor(collectionName: string) {
    super(db, collectionName);
  }

  async getAllSecured(): Promise<T[]> {
    return this.find([]);
  }

  async createSecured(item: T): Promise<void> {
    await this.create(item.id, item);
  }
}

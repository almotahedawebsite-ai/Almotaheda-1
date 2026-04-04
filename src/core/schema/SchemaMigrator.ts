import { BaseEntity } from '../../domain/types';

/**
 * 5. ENTERPRISE SCHEMA (LAZY) MIGRATION
 * 
 * Logic:
 * - Perform migrations as entities are indexed/read.
 * - This allows O(1) migration overhead instead of O(N) database locks.
 */

export interface MigrationMap {
  [entityType: string]: {
    [targetVersion: number]: (data: any) => any;
  };
}

const MIGRATIONS: MigrationMap = {
  products: {
    2: (data) => ({
      ...data,
      customFields: [...data.customFields, { fieldId: 'stockStatus', value: 'in_stock' }]
    }),
    3: (data) => {
      // Logic for structural changes (e.g., nesting price)
      const price = data.customFields.find((f: any) => f.fieldId === 'price')?.value;
      return { ...data, priceInfo: { value: price, currency: 'USD' } };
    }
  }
};

export class SchemaMigrator {
  static migrate(data: any, latestVersion: number): any {
    const type = data.type;
    let currentVersion = data.schemaVersion || 1;
    let migratedData = { ...data };

    if (!MIGRATIONS[type]) return data;

    while (currentVersion < latestVersion) {
      currentVersion++;
      const transform = MIGRATIONS[type][currentVersion];
      if (transform) {
        migratedData = transform(migratedData);
        migratedData.schemaVersion = currentVersion;
        console.log(`[SchemaMigrator] Migrated ${type} to v${currentVersion}`);
      }
    }

    return migratedData;
  }
}

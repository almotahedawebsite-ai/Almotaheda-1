import { EntityType, CustomFieldDefinition } from '../../domain/types';
import { eventBus } from '../events/EventBus';

/**
 * 2. MODULE DISCOVERY & REGISTRATION SYSTEM
 */

export interface ModuleConfig {
  name: string;
  order?: number;
  dependencies?: string[];
  entityTypes?: EntityTypeDefinition[];
  blocks?: any[];
  adminPages?: RouteDefinition[];
  init?: () => Promise<void>;
}

export interface EntityTypeDefinition {
  type: string;
  label: string;
  fields: CustomFieldDefinition[];
  version: number;
}

export interface RouteDefinition {
  path: string;
  label: string;
  component: any;
}

class ModuleRegistry {
  private static instance: ModuleRegistry;
  private modules: Map<string, ModuleConfig> = new Map();
  private entityTypes: Map<string, EntityTypeDefinition> = new Map();

  private constructor() {}

  static getInstance() {
    if (!ModuleRegistry.instance) ModuleRegistry.instance = new ModuleRegistry();
    return ModuleRegistry.instance;
  }

  async register(config: ModuleConfig) {
    if (this.modules.has(config.name)) {
      console.warn(`[ModuleRegistry] Module ${config.name} already registered.`);
      return;
    }

    this.modules.set(config.name, config);
    
    // Register Entity Types for the schema evolution engine
    config.entityTypes?.forEach(et => {
      this.entityTypes.set(et.type, et);
    });

    if (config.init) {
      try {
        await config.init();
      } catch (e) {
        console.error(`[ModuleRegistry] Failed to init module ${config.name}:`, e);
      }
    }
    
    console.log(`[Platform] Module registered and initialized: ${config.name}`);
  }

  getEntityType(type: string): EntityTypeDefinition | null {
    return this.entityTypes.get(type) || null;
  }

  getAllModules() {
    return Array.from(this.modules.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async bootstrap() {
    console.log("[Platform] Bootstrapping enterprise core...");
    // Future: Dependency graph resolution logic
  }
}

export const registry = ModuleRegistry.getInstance();

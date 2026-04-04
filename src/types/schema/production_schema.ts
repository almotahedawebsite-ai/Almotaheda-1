import { BaseEntity, EntityType, CustomFieldDefinition } from '@/domain/types';

/**
 * 1. DATABASE ARCHITECTURE (FIRESTORE)
 * 
 * Collections Structure:
 * 
 * - /types/{typeId}
 *   Defining the schema for each entity (fields, validation, SEO defaults).
 * 
 * - /entities/{entityId}
 *   Flat collection of all dynamic content. Uses 'type' field for filtering.
 *   Scalability: Flat collections scale infinitely in Firestore. Indices on 'type' and 'status' allow O(1) lookups.
 * 
 * - /categories/{categoryId}
 *   Infinite nesting via 'parentId'. Logic: Client pulls all categories and builds tree, or queries by parentId.
 * 
 * - /pages/{pageId}
 *   Page builder docs. Contains 'slug' and 'blocks' array.
 * 
 * - /slugs/{slug}
 *   Inverse index for fast routing: maps { slug: string } -> { type: 'page'|'entity', id: string }.
 */

export interface PageBlock {
  id: string;
  type: 'hero' | 'text' | 'gallery' | 'product_list' | 'cta' | 'faq';
  data: Record<string, any>;
  order: number;
}

export interface DynamicPage {
  id: string;
  slug: string;
  title: string;
  metadata: any;
  blocks: PageBlock[];
  status: 'draft' | 'published';
}

export interface CourseEntity extends BaseEntity {
  type: 'courses';
  customFields: [
    { fieldId: 'price', value: number },
    { fieldId: 'duration', value: string },
    { fieldId: 'lessons', value: number }
  ];
}

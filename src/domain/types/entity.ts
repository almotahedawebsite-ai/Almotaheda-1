import { TranslatableString } from './settings';

export interface CustomField {
  fieldId: string;
  value: string | number | boolean | TranslatableString; // supports plain strings, numbers, booleans and bilingual objects
}

export interface BaseEntity {
  id: string;
  type: string;
  slug: string;
  title: TranslatableString;   // bilingual title
  description: TranslatableString; // bilingual description
  media: string[]; // URLs of images
  customFields: CustomField[];
  createdAt: string;
  updatedAt?: string;
}

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'number' | 'image' | 'boolean' | 'textarea';
  required?: boolean;
  translatable?: boolean; // mark text fields as needing bilingual input
}

export interface EntityType {
  id: string;
  label: string;
  fields: CustomFieldDefinition[];
}

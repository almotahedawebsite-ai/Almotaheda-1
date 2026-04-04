import { TranslatableString } from './settings';

export interface Service {
  id: string;
  name: TranslatableString;
  slug: string;
  description: TranslatableString;
  image: string;
  video: string;
  icon: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

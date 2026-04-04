import { TranslatableString } from './settings';

export interface KeyClient {
  id: string;
  name: TranslatableString;
  logo: string;
  description: TranslatableString;
  image: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

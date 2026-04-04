import { TranslatableString } from './settings';

export interface Branch {
  id: string;
  name: TranslatableString;
  image: string;
  address: TranslatableString;
  googleMapUrl: string;
  phone: string;
  workingHours: TranslatableString;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

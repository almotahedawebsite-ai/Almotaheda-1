export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerUid?: string;
  serviceId: string;
  serviceName: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface BookingFormState {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceId: string;
  notes: string;
}

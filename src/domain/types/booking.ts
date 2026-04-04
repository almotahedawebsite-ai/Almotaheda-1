export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'confirmed' | 'rejected';
export type PaymentMethod = 'instapay_qr' | 'e_wallet';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerUid?: string;
  serviceId: string;
  serviceName: string;
  notes: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentProofUrl: string;
  paymentMethod: PaymentMethod | '';
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  amount: string;
  method: PaymentMethod;
  proofImageUrl: string;
  status: PaymentStatus;
  confirmedBy: string;
  confirmedAt: string;
  createdAt: string;
}

export type ContractStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export interface Contract {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  notes: string;
  value: string;
  createdAt: string;
  updatedAt?: string;
}

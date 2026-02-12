export interface Event {
  id?: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: string;
  createdAt?: string;
}

export const EVENT_STATUSES = ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'] as const;

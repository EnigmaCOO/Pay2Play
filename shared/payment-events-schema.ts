
export interface PaymentEvent {
  id: string;
  eventId: string; // Provider's unique event ID
  provider: string;
  eventType: string;
  paymentIntentId: string;
  status: 'succeeded' | 'failed' | 'pending';
  processed: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

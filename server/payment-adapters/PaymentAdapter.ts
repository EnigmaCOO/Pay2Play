
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  clientSecret?: string;
  metadata?: Record<string, any>;
}

export interface PaymentAdapter {
  createPaymentIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntent>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
  handleWebhook(payload: any): Promise<{ eventId: string; type: string; data: any }>;
}

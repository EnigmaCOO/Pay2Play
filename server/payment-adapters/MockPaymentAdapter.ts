
import { PaymentAdapter, PaymentIntent } from './PaymentAdapter';

export class MockPaymentAdapter implements PaymentAdapter {
  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    const intentId = `mock_pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: intentId,
      amount,
      currency,
      status: 'pending',
      clientSecret: `${intentId}_secret`,
      metadata,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Mock always returns true for testing
    return signature === 'mock_signature';
  }

  async handleWebhook(payload: any): Promise<{ eventId: string; type: string; data: any }> {
    return {
      eventId: `mock_evt_${Date.now()}`,
      type: payload.type || 'payment_intent.succeeded',
      data: payload.data || {},
    };
  }
}


import crypto from 'crypto';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  clientSecret?: string;
  metadata?: Record<string, any>;
}

export interface PaymentAdapter {
  name: string;
  createIntent(amount: number, metadata?: Record<string, any>): Promise<PaymentIntent>;
  verifyWebhook(signature: string, body: string): boolean;
  processWebhook(body: any): {
    eventType: string;
    paymentIntentId: string;
    status: 'succeeded' | 'failed' | 'pending';
  };
}

// Mock Provider (for development)
export class MockPaymentAdapter implements PaymentAdapter {
  name = 'mock';

  async createIntent(amount: number, metadata?: Record<string, any>): Promise<PaymentIntent> {
    return {
      id: `pi_mock_${Date.now()}`,
      amount,
      currency: 'PKR',
      clientSecret: `mock_secret_${Date.now()}`,
      metadata,
    };
  }

  verifyWebhook(signature: string, body: string): boolean {
    const secret = process.env.PROVIDER_WEBHOOK_SECRET || 'dev-secret';
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
    return signature === expectedSig;
  }

  processWebhook(body: any) {
    return {
      eventType: body.event || 'payment.succeeded',
      paymentIntentId: body.paymentIntentId || body.id,
      status: body.status || 'succeeded' as any,
    };
  }
}

// Paymob Adapter (for production)
export class PaymobAdapter implements PaymentAdapter {
  name = 'paymob';
  private apiKey: string;
  private integrationId: string;

  constructor() {
    this.apiKey = process.env.PAYMOB_API_KEY || '';
    this.integrationId = process.env.PAYMOB_INTEGRATION_ID || '';
  }

  async createIntent(amount: number, metadata?: Record<string, any>): Promise<PaymentIntent> {
    // TODO: Implement Paymob API integration
    // For now, return mock structure
    console.log('[Paymob] Creating payment intent:', { amount, metadata });
    
    return {
      id: `paymob_${Date.now()}`,
      amount: amount * 100, // Paymob uses cents
      currency: 'PKR',
      clientSecret: `paymob_secret_${Date.now()}`,
      metadata,
    };
  }

  verifyWebhook(signature: string, body: string): boolean {
    // Paymob uses HMAC verification
    const secret = process.env.PAYMOB_HMAC_SECRET || '';
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');
    return signature === expectedSig;
  }

  processWebhook(body: any) {
    return {
      eventType: body.type || 'TRANSACTION',
      paymentIntentId: body.obj?.id?.toString() || '',
      status: body.obj?.success ? 'succeeded' : 'failed' as any,
    };
  }
}

// Factory function
export function createPaymentAdapter(): PaymentAdapter {
  const provider = process.env.PAYMENT_PROVIDER || 'mock';
  
  switch (provider) {
    case 'paymob':
      return new PaymobAdapter();
    case 'mock':
    default:
      return new MockPaymentAdapter();
  }
}

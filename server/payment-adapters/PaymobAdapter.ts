
import crypto from 'crypto';
import { PaymentAdapter, PaymentIntent } from './PaymentAdapter';

export class PaymobAdapter implements PaymentAdapter {
  private apiKey: string;
  private integrationId: string;
  private hmacSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.PAYMOB_API_KEY || '';
    this.integrationId = process.env.PAYMOB_INTEGRATION_ID || '';
    this.hmacSecret = process.env.PAYMOB_HMAC_SECRET || '';
    this.baseUrl = process.env.PAYMOB_BASE_URL || 'https://accept.paymob.com/api';
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, any>
  ): Promise<PaymentIntent> {
    try {
      // Step 1: Authenticate
      const authResponse = await fetch(`${this.baseUrl}/auth/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: this.apiKey }),
      });
      const { token } = await authResponse.json();

      // Step 2: Create order
      const orderResponse = await fetch(`${this.baseUrl}/ecommerce/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: token,
          delivery_needed: false,
          amount_cents: amount * 100, // Convert to cents
          currency,
          merchant_order_id: metadata?.orderId || Date.now(),
          items: [],
        }),
      });
      const order = await orderResponse.json();

      // Step 3: Create payment key
      const paymentKeyResponse = await fetch(`${this.baseUrl}/acceptance/payment_keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: token,
          amount_cents: amount * 100,
          expiration: 3600,
          order_id: order.id,
          billing_data: {
            email: metadata?.email || 'customer@example.com',
            first_name: metadata?.firstName || 'Customer',
            last_name: metadata?.lastName || 'Name',
            phone_number: metadata?.phone || '+201000000000',
            country: 'EG',
            city: 'Cairo',
            street: 'NA',
            building: 'NA',
            floor: 'NA',
            apartment: 'NA',
          },
          currency,
          integration_id: parseInt(this.integrationId),
        }),
      });
      const { token: paymentKey } = await paymentKeyResponse.json();

      return {
        id: order.id.toString(),
        amount,
        currency,
        status: 'pending',
        clientSecret: paymentKey,
        metadata,
      };
    } catch (error) {
      console.error('Paymob payment intent creation failed:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const parsedPayload = JSON.parse(payload);
    const data = parsedPayload.obj;

    // Paymob HMAC verification
    const concatenatedString = [
      data.amount_cents,
      data.created_at,
      data.currency,
      data.error_occured,
      data.has_parent_transaction,
      data.id,
      data.integration_id,
      data.is_3d_secure,
      data.is_auth,
      data.is_capture,
      data.is_refunded,
      data.is_standalone_payment,
      data.is_voided,
      data.order.id,
      data.owner,
      data.pending,
      data.source_data.pan,
      data.source_data.sub_type,
      data.source_data.type,
      data.success,
    ].join('');

    const calculatedHmac = crypto
      .createHmac('sha512', this.hmacSecret)
      .update(concatenatedString)
      .digest('hex');

    return calculatedHmac === signature;
  }

  async handleWebhook(payload: any): Promise<{ eventId: string; type: string; data: any }> {
    const transaction = payload.obj;
    
    let eventType = 'payment_intent.unknown';
    if (transaction.success === true) {
      eventType = 'payment_intent.succeeded';
    } else if (transaction.success === false) {
      eventType = 'payment_intent.failed';
    }

    return {
      eventId: `paymob_evt_${transaction.id}`,
      type: eventType,
      data: {
        transactionId: transaction.id,
        orderId: transaction.order.id,
        amount: transaction.amount_cents / 100,
        currency: transaction.currency,
        success: transaction.success,
      },
    };
  }
}

import crypto from 'crypto';
import type { Request, Response } from "express";
import { db } from "./db";
import { paymentEvents } from "@db/schema";
import { eq } from "drizzle-orm";


export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  clientSecret?: string;
  metadata?: Record<string, any>;
}

export interface PaymentAdapter {
  name: string;
  createIntent(amount: number, currency: string, metadata: any): Promise<PaymentIntent>;
  handleWebhook(req: Request, res: Response): Promise<void>;
  verifyWebhookSignature(req: Request): boolean;
}

// Mock Provider (for development)
export class MockPaymentAdapter implements PaymentAdapter {
  name = 'mock';
  private webhookSecret = process.env.WEBHOOK_SECRET || "dev_secret_for_hmac";

  async createIntent(amount: number, currency: string, metadata: any): Promise<PaymentIntent> {
    return {
      id: `mock_${Date.now()}`,
      amount,
      currency,
      status: "succeeded",
      clientSecret: `mock_secret_${Date.now()}`,
      metadata,
    };
  }

  verifyWebhookSignature(req: Request): boolean {
    const signature = req.headers["x-webhook-signature"] as string;
    if (!signature) return false;

    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    // Verify signature
    if (!this.verifyWebhookSignature(req)) {
      console.error("❌ Invalid webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const { event_id, event_type, data } = req.body;

    // Check for duplicate event (idempotency)
    const existing = await db.query.paymentEvents.findFirst({
      where: eq(paymentEvents.eventId, event_id),
    });

    if (existing) {
      console.log(`✅ Event ${event_id} already processed (idempotent skip)`);
      return res.status(200).json({ received: true, duplicate: true });
    }

    // Store event
    await db.insert(paymentEvents).values({
      eventId: event_id,
      provider: this.name,
      eventType: event_type,
      payload: data,
    });

    console.log(`✅ Processed webhook event: ${event_type} (${event_id})`);
    res.status(200).json({ received: true });
  }
}

// Paymob Adapter (for production)
export class PaymobAdapter implements PaymentAdapter {
  name = 'paymob';
  private apiKey: string;
  private integrationId: string;
  private webhookSecret: string;

  constructor() {
    this.apiKey = process.env.PAYMOB_API_KEY || '';
    this.integrationId = process.env.PAYMOB_INTEGRATION_ID || '';
    this.webhookSecret = process.env.PAYMOB_HMAC_SECRET || '';
  }

  async createIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<PaymentIntent> {
    // TODO: Implement Paymob API integration
    // For now, return mock structure
    console.log('[Paymob] Creating payment intent:', { amount, currency, metadata });

    return {
      id: `paymob_${Date.now()}`,
      amount: amount * 100, // Paymob uses cents
      currency: currency,
      status: 'pending',
      clientSecret: `paymob_secret_${Date.now()}`,
      metadata,
    };
  }

  verifyWebhookSignature(req: Request): boolean {
    const signature = req.headers["paymob-hmac-signature"] as string;
    if (!signature) return false;

    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto.createHmac('sha256', this.webhookSecret).update(payload).digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    // Verify signature
    if (!this.verifyWebhookSignature(req)) {
      console.error("❌ Invalid Paymob webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const { obj } = req.body;
    const eventId = obj?.id?.toString();

    if (!eventId) {
      console.error("❌ Missing payment intent ID in webhook body");
      return res.status(400).json({ error: "Missing payment intent ID" });
    }

    // Check for duplicate event (idempotency)
    const existing = await db.query.paymentEvents.findFirst({
      where: eq(paymentEvents.eventId, eventId),
    });

    if (existing) {
      console.log(`✅ Event ${eventId} already processed (idempotent skip)`);
      return res.status(200).json({ received: true, duplicate: true });
    }

    const eventType = req.body.type || 'TRANSACTION';
    const status = obj?.success ? 'succeeded' : 'failed';

    // Store event
    await db.insert(paymentEvents).values({
      eventId: eventId,
      provider: this.name,
      eventType: eventType,
      payload: req.body,
    });

    console.log(`✅ Processed Paymob webhook event: ${eventType} for Payment Intent ${eventId} with status ${status}`);
    res.status(200).json({ received: true });
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
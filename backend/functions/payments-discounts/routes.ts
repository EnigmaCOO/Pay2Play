import { Request, type Response, Express } from "express";
import { storage } from "../db.js";
import crypto from "crypto";
import { notificationService, notifications } from "../notifications/notifications.js";
import { authenticate } from "../auth-profiles/auth.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY', {
  apiVersion: '2025-10-29.clover',
});

// Helper to verify HMAC webhook signatures
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export function registerPaymentsDiscountsRoutes(app: Express) {
  // ========== PAYMENTS (Bookings) ==========
  app.post("/api/payments/intent", authenticate, async (req: Request, res) => {
    try {
      const { bookingId, userId, amountPkr, provider = "mock", idempotencyKey } = req.body as any;
      
      if (!idempotencyKey) {
        return res.status(400).json({ error: "idempotencyKey is required" });
      }
      
      // Check for existing payment with this idempotency key
      const existing = await storage.getPaymentByIdempotencyKey(idempotencyKey);
      if (existing) {
        return res.json(existing);
      }
      
      const payment = await storage.createPayment({
        bookingId,
        userId,
        amountPkr,
        provider,
        idempotencyKey,
        status: "pending",
        redirectUrl: `${(req as any).protocol}://${(req as any).get('host')}/bookings/${bookingId}/confirm`
      });
      
      return res.json(payment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/payments/webhook/:provider", async (req, res) => {
    const { provider } = req.params;
    let event;

    if (provider === "stripe") {
      const sig = req.headers['stripe-signature'] as string;
      let rawBody;
      // Assuming raw body is available from a previous middleware, or read it here
      // For Firebase Functions, (req as any).rawBody is often available. For Express, need body-parser.raw()
      if ((req as any).rawBody) {
        rawBody = (req as any).rawBody;
      } else {
        // Fallback for local testing if rawBody is not automatically attached
        // In a real production environment, ensure rawBody is correctly parsed by middleware
        console.warn("(req as any).rawBody not found. Webhook signature verification might fail.");
        rawBody = JSON.stringify(req.body);
      }

      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_YOUR_STRIPE_WEBHOOK_SECRET');
      } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else if (provider !== "mock") {
      const signature = req.headers['x-webhook-signature'] as string;
      const webhookSecret = process.env.PROVIDER_WEBHOOK_SECRET || "test-secret";
      
      const payload = JSON.stringify(req.body);
      if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    try {
      if (provider === "stripe" && event) {
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
            const bookingIdSucceeded = paymentIntentSucceeded.metadata?.bookingId;
            const userIdSucceeded = paymentIntentSucceeded.metadata?.userId;

            if (bookingIdSucceeded && userIdSucceeded) {
              const payment = await storage.getPaymentByIdempotencyKey(paymentIntentSucceeded.client_secret || '');
              if (payment) {
                await storage.updatePaymentStatus(payment.id, 'succeeded', paymentIntentSucceeded.id);
                await storage.updateBookingStatus(bookingIdSucceeded, 'confirmed');
              }
            }
            break;
          case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
            const clientSecretFailed = paymentIntentFailed.client_secret;
            if (clientSecretFailed) {
              const payment = await storage.getPaymentByIdempotencyKey(clientSecretFailed);
              if (payment) {
                await storage.updatePaymentStatus(payment.id, 'failed', paymentIntentFailed.id);
              }
            }
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } else {
        const { paymentId, status, providerRef } = req.body as any;
        await storage.updatePaymentStatus(paymentId, status, providerRef);
        
        if (status === 'succeeded') {
          const payment = await storage.getPayment(paymentId);
          if (payment?.bookingId) {
            await storage.updateBookingStatus(payment.bookingId, 'confirmed');
          }
        }
      }
      
      return res.json({ received: true });
    } catch (error: any) {
      console.error("Error processing webhook:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== GAME PAYMENTS (Join Game) ==========
  app.post("/api/game-pay/:gameId/intent", authenticate, async (req: Request, res) => {
    try {
      const { gameId } = (req.params as any);
      const { userId, provider = "mock", idempotencyKey } = req.body as any;
      
      if (!idempotencyKey) {
        return res.status(400).json({ error: "idempotencyKey is required" });
      }
      
      // Check for existing payment
      const existing = await storage.getGamePaymentByIdempotencyKey(idempotencyKey);
      if (existing) {
        return res.json(existing);
      }
      
      const game = await storage.getGame(gameId);
      if (!game) return res.status(404).json({ error: "Game not found" });
      
      if (game.currentPlayers >= game.maxPlayers) {
        return res.status(400).json({ error: "Game is full" });
      }
      
      const payment = await storage.createGamePayment({
        gameId,
        userId,
        amountPkr: game.pricePerPlayerPkr,
        provider,
        idempotencyKey,
        status: "pending",
        redirectUrl: `${(req as any).protocol}://${(req as any).get('host')}/games/${gameId}/confirm`
      });
      
      return res.json(payment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/game-pay/webhook/:provider", async (req, res) => {
    const { provider } = req.params;
    let event;

    if (provider === "stripe") {
      const sig = req.headers['stripe-signature'] as string;
      let rawBody;
      if ((req as any).rawBody) {
        rawBody = (req as any).rawBody;
      } else {
        console.warn("(req as any).rawBody not found. Webhook signature verification might fail.");
        rawBody = JSON.stringify(req.body);
      }

      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_YOUR_STRIPE_WEBHOOK_SECRET');
      } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else if (provider !== "mock") {
      const signature = req.headers['x-webhook-signature'] as string;
      const webhookSecret = process.env.PROVIDER_WEBHOOK_SECRET || "test-secret";
      
      const payload = JSON.stringify(req.body);
      if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    try {
      if (provider === "stripe" && event) {
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
            const gameIdSucceeded = paymentIntentSucceeded.metadata?.gameId;
            const userIdSucceeded = paymentIntentSucceeded.metadata?.userId;

            if (gameIdSucceeded && userIdSucceeded) {
              const gamePayment = await storage.getGamePaymentByIdempotencyKey(paymentIntentSucceeded.client_secret || '');
              if (gamePayment) {
                await storage.updateGamePaymentStatus(gamePayment.id, 'succeeded', paymentIntentSucceeded.id);
                
                // Add player to game
                await storage.addGamePlayer({
                  gameId: gameIdSucceeded,
                  userId: userIdSucceeded,
                  isHost: false
                });
                
                // Increment player count
                await storage.incrementGamePlayers(gameIdSucceeded);
                
                // Check if game is now confirmed or filled
                const game = await storage.getGame(gameIdSucceeded);
                if (game) {
                  const wasFilled = game.currentPlayers >= game.maxPlayers;
                  
                  if (wasFilled) {
                    await storage.updateGameStatus(game.id, 'filled');
                    // Notify all players game is full
                    const gamePlayers = await storage.getGamePlayers(game.id);
                    const playerIds = gamePlayers.map(p => p.userId);
                    await notificationService.sendToMultipleUsers(
                      playerIds,
                      notifications.gameFull(game.sport.name)
                    );
                  } else if (game.currentPlayers >= game.minPlayers && game.status === 'open') {
                    await storage.updateGameStatus(game.id, 'confirmed');
                  }
                  
                  // Notify the joining player
                  await notificationService.sendToUser(
                    userIdSucceeded,
                    notifications.paymentSuccess(gamePayment.amountPkr)
                  );
                  
                  // Notify host about new player
                  if (!wasFilled) {
                    await notificationService.sendToUser(
                      game.hostId,
                      notifications.gameJoined(game.sport.name, game.currentPlayers, game.maxPlayers)
                    );
                  }
                }
              }
            }
            break;
          case 'payment_intent.payment_failed':
            const gamePaymentIntentFailed = event.data.object as Stripe.PaymentIntent;
            const gameClientSecretFailed = gamePaymentIntentFailed.client_secret;
            if (gameClientSecretFailed) {
              const gamePayment = await storage.getGamePaymentByIdempotencyKey(gameClientSecretFailed);
              if (gamePayment) {
                await storage.updateGamePaymentStatus(gamePayment.id, 'failed', gamePaymentIntentFailed.id);
              }
            }
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } else {
        const { paymentId, status, providerRef } = req.body as any;
        await storage.updateGamePaymentStatus(paymentId, status, providerRef);
        
        if (status === 'succeeded') {
          const payment = await storage.getGamePayment(paymentId);
          if (payment) {
            // Add player to game
            await storage.addGamePlayer({
              gameId: payment.gameId,
              userId: payment.userId,
              isHost: false
            });
            
            // Increment player count
            await storage.incrementGamePlayers(payment.gameId);
            
            // Check if game is now confirmed or filled
            const game = await storage.getGame(payment.gameId);
            if (game) {
              const wasFilled = game.currentPlayers >= game.maxPlayers;
              
              if (wasFilled) {
                await storage.updateGameStatus(game.id, 'filled');
                // Notify all players game is full
                const gamePlayers = await storage.getGamePlayers(game.id);
                const playerIds = gamePlayers.map(p => p.userId);
                await notificationService.sendToMultipleUsers(
                  playerIds,
                  notifications.gameFull(game.sport.name)
                );
              } else if (game.currentPlayers >= game.minPlayers && game.status === 'open') {
                await storage.updateGameStatus(game.id, 'confirmed');
              }
              
              // Notify the joining player
              await notificationService.sendToUser(
                payment.userId,
                notifications.paymentSuccess(payment.amountPkr)
              );
              
              // Notify host about new player
              if (!wasFilled) {
                await notificationService.sendToUser(
                  game.hostId,
                  notifications.gameJoined(game.sport.name, game.currentPlayers, game.maxPlayers)
                );
              }
            }
          }
        }
      }
      
      return res.json({ received: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Wallet
  app.get("/api/wallet", authenticate, async (req: Request, res) => {
    try {
      const userId = (req as any).user.uid;
      const balance = await storage.getUserWalletBalance(userId);
      return res.json({ balancePkr: balance });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallet/add-funds/intent", authenticate, async (req: Request, res) => {
    try {
      const { amountPkr, provider = "mock", idempotencyKey } = req.body as any;
      const userId = (req as any).user.uid;

      if (!idempotencyKey) {
        return res.status(400).json({ error: "idempotencyKey is required" });
      }

      const existing = await storage.getWalletPaymentByIdempotencyKey(idempotencyKey);
      if (existing) {
        return res.json(existing);
      }

      const walletPayment = await storage.createWalletPayment({
        userId,
        amountPkr,
        provider,
        idempotencyKey,
        status: "pending",
        redirectUrl: `${(req as any).protocol}://${(req as any).get('host')}/dashboard/wallet` // Redirect to wallet page
      });

      return res.json(walletPayment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/wallet/webhook/:provider", async (req, res) => {
    const { provider } = req.params;
    let event;

    if (provider === "stripe") {
      const sig = req.headers['stripe-signature'] as string;
      let rawBody;
      if ((req as any).rawBody) {
        rawBody = (req as any).rawBody;
      } else {
        console.warn("(req as any).rawBody not found. Webhook signature verification might fail.");
        rawBody = JSON.stringify(req.body);
      }

      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_YOUR_STRIPE_WEBHOOK_SECRET');
      } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else if (provider !== "mock") {
      const signature = req.headers['x-webhook-signature'] as string;
      const webhookSecret = process.env.PROVIDER_WEBHOOK_SECRET || "test-secret";
      
      const payload = JSON.stringify(req.body);
      if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    try {
      if (provider === "stripe" && event) {
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object as Stripe.PaymentIntent;
            const userIdSucceeded = paymentIntentSucceeded.metadata?.userId;
            const typeSucceeded = paymentIntentSucceeded.metadata?.type;

            if (userIdSucceeded && typeSucceeded === "wallet_topup") {
              const walletPayment = await storage.getWalletPaymentByIdempotencyKey(paymentIntentSucceeded.client_secret || '');
              if (walletPayment) {
                await storage.updateWalletPaymentStatus(walletPayment.id, 'succeeded', paymentIntentSucceeded.id);
                await storage.updateUserWalletBalance(userIdSucceeded, walletPayment.amountPkr);
                await notificationService.sendToUser(
                  userIdSucceeded,
                  notifications.walletTopUpSuccess(walletPayment.amountPkr)
                );
              }
            }
            break;
          case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
            const clientSecretFailed = paymentIntentFailed.client_secret;
            if (clientSecretFailed) {
              const walletPayment = await storage.getWalletPaymentByIdempotencyKey(clientSecretFailed);
              if (walletPayment) {
                await storage.updateWalletPaymentStatus(walletPayment.id, 'failed', paymentIntentFailed.id);
              }
            }
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } else {
        const { paymentId, status, providerRef } = req.body as any;
        await storage.updateWalletPaymentStatus(paymentId, status, providerRef);
        
        if (status === 'succeeded') {
          const payment = await storage.getWalletPayment(paymentId);
          if (payment) {
            await storage.updateUserWalletBalance(payment.userId, payment.amountPkr);
            await notificationService.sendToUser(
              payment.userId,
              notifications.walletTopUpSuccess(payment.amountPkr)
            );
          }
        }
      }
      
      return res.json({ received: true });
    } catch (error: any) {
      console.error("Error processing wallet webhook:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallet/withdraw-funds", authenticate, async (req: Request, res) => {
    try {
      const { amountPkr } = req.body as any;
      const userId = (req as any).user.uid;

      if (typeof amountPkr !== 'number' || amountPkr <= 0) {
        return res.status(400).json({ error: "Invalid amount." });
      }

      const currentBalance = await storage.getUserWalletBalance(userId);
      if (currentBalance < amountPkr) {
        return res.status(400).json({ error: "Insufficient funds." });
      }

      // Deduct funds from wallet
      await storage.updateUserWalletBalance(userId, -amountPkr);

      // In a real application, you would integrate with a payout service here
      // For MVP, we just deduct the balance.

      return res.status(200).json({ message: "Withdrawal initiated successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });
}

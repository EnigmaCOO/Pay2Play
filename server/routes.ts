import type { Express, Request, Response, Server } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertVenueSchema, insertFieldSchema, insertSlotSchema, insertBookingSchema, insertPaymentSchema, insertGameSchema, insertGamePaymentSchema, insertSeasonSchema, insertTeamSchema, insertFixtureSchema } from "@shared/schema";
import crypto from "crypto";
import { notificationService, notifications } from "./notifications";
import { createPaymentAdapter } from './payment-adapter';

// Helper to verify HMAC webhook signatures
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Helper for generating round-robin fixtures
function generateRoundRobinFixtures(teamIds: string[], seasonId: string, startDate: Date): any[] {
  const fixtures: any[] = [];
  const n = teamIds.length;

  if (n < 2) return fixtures;

  // Ensure even number of teams
  const teams = n % 2 === 0 ? [...teamIds] : [...teamIds, null];
  const rounds = teams.length - 1;
  const matchesPerRound = teams.length / 2;

  let currentDate = new Date(startDate);

  for (let round = 0; round < rounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = teams[match];
      const away = teams[teams.length - 1 - match];

      if (home && away) {
        fixtures.push({
          seasonId,
          homeTeamId: home,
          awayTeamId: away,
          scheduledDate: new Date(currentDate),
          status: 'scheduled'
        });
      }
    }

    // Rotate teams (keep first team fixed)
    const last = teams.pop();
    if (last !== undefined) {
      teams.splice(1, 0, last);
    }

    // Move to next week
    currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  return fixtures;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ========== VENUES ==========
  app.get("/api/venues", async (req, res) => {
    try {
      const { verified, sport } = req.query;
      let venues = await storage.getVenues(verified === 'true');

      if (sport && typeof sport === 'string') {
        // Filter venues that have fields of the requested sport
        const venuesWithFields = await Promise.all(
          venues.map(async (venue) => {
            const fields = await storage.getFieldsByVenue(venue.id);
            const hasRequestedSport = fields.some(f => f.sport === sport);
            return hasRequestedSport ? venue : null;
          })
        );
        venues = venuesWithFields.filter(v => v !== null) as any[];
      }

      res.json(venues);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/venues", async (req, res) => {
    try {
      const data = insertVenueSchema.parse(req.body);
      const venue = await storage.createVenue(data);
      res.json(venue);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const venue = await storage.getVenue(req.params.id);
      if (!venue) return res.status(404).json({ error: "Venue not found" });

      const fields = await storage.getFieldsByVenue(venue.id);
      res.json({ ...venue, fields });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== FIELDS ==========
  app.post("/api/fields", async (req, res) => {
    try {
      const data = insertFieldSchema.parse(req.body);
      const field = await storage.createField(data);
      res.json(field);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ========== SLOTS ==========
  app.get("/api/slots/search", async (req, res) => {
    try {
      const { fieldId, startTime, endTime } = req.query;

      if (!fieldId || !startTime || !endTime) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const slots = await storage.searchAvailableSlots(
        fieldId as string,
        new Date(startTime as string),
        new Date(endTime as string)
      );

      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/slots", async (req, res) => {
    try {
      const data = insertSlotSchema.parse(req.body);
      const slot = await storage.createSlot(data);
      res.json(slot);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ========== BOOKINGS ==========
  app.post("/api/bookings", async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const bookings = await storage.getUserBookings(userId as string);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== PAYMENTS (Bookings) ==========
  app.post("/api/payments/intent", async (req, res) => {
    try {
      const { bookingId, userId, amountPkr, provider = "mock", idempotencyKey } = req.body;

      if (!idempotencyKey) {
        return res.status(400).json({ error: "idempotencyKey is required" });
      }

      // Check for existing payment with this idempotency key
      const existing = await storage.getPaymentByIdempotencyKey(idempotencyKey);
      if (existing) {
        return res.json(existing);
      }

      const paymentAdapter = createPaymentAdapter();
      const paymentIntent = await paymentAdapter.createIntent(amountPkr, {
        bookingId,
        userId,
        // Add other relevant details to the intent creation as needed by the adapter
      });

      // Save payment details with pending status and the provider's intent ID
      const payment = await storage.createPayment({
        bookingId,
        userId,
        amountPkr,
        provider: paymentIntent.provider, // Store the actual provider used
        idempotencyKey,
        status: "pending",
        providerIntentId: paymentIntent.id, // Store the ID from the payment provider
        redirectUrl: paymentIntent.redirectUrl || `${req.protocol}://${req.get('host')}/bookings/${bookingId}/confirm` // Use adapter's redirect URL if available
      });

      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Payment webhook
  app.post('/api/payments/webhook', async (req, res) => {
    try {
      const signature = req.headers['x-payment-signature'] as string || req.query.hmac as string || '';
      const payload = JSON.stringify(req.body);

      const isValid = paymentAdapter.verifyWebhookSignature(payload, signature);
      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return res.status(400).json({ error: 'Invalid signature' });
      }

      // Handle webhook via adapter
      const event = await paymentAdapter.handleWebhook(req.body);
      console.log('✅ Payment webhook received:', event.type, event.eventId);

      // Store payment event (idempotency check will be added in Stage 7)
      // For now, just log it

      res.json({ received: true, eventId: event.eventId });
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // ========== GAMES ==========
  app.post("/api/games", async (req, res) => {
    try {
      const data = insertGameSchema.parse(req.body);
      const game = await storage.createGame(data);
      res.json(game);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/games/search", async (req, res) => {
    try {
      const { sport } = req.query;
      const games = await storage.getGames(sport === 'all' ? undefined : sport as string);
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) return res.status(404).json({ error: "Game not found" });
      res.json(game);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== GAME PAYMENTS (Join Game) ==========
  app.post("/api/game-pay/:gameId/intent", async (req, res) => {
    try {
      const { gameId } = req.params;
      const { userId, provider = "mock", idempotencyKey } = req.body;

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

      const paymentAdapter = createPaymentAdapter();
      const paymentIntent = await paymentAdapter.createIntent(game.pricePerPlayerPkr, {
        gameId,
        userId: userId, // Use provided userId
      });

      const payment = await storage.createGamePayment({
        gameId,
        userId,
        amountPkr: game.pricePerPlayerPkr,
        provider: paymentIntent.provider, // Store the actual provider used
        idempotencyKey,
        status: "pending",
        providerIntentId: paymentIntent.id, // Store the ID from the payment provider
        redirectUrl: paymentIntent.redirectUrl || `${req.protocol}://${req.get('host')}/games/${gameId}/confirm` // Use adapter's redirect URL if available
      });

      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/game-pay/webhook/:provider", async (req, res) => {
    try {
      const { provider } = req.params;

      const paymentAdapter = createPaymentAdapter(provider); // Pass provider to adapter
      const signature = req.headers['x-webhook-signature'] as string;
      const body = JSON.stringify(req.body);

      // Verify webhook signature
      if (!paymentAdapter.verifyWebhook(signature, body)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Check for duplicate events (idempotency)
      const eventId = req.body.id || req.body.eventId || `${req.body.paymentIntentId}_${Date.now()}`; // Derive a unique event ID
      const isDuplicate = await storage.getPaymentEvent(eventId);

      if (isDuplicate) {
        console.log(`⚠️ Duplicate webhook event ignored: ${eventId}`);
        return res.json({ received: true, duplicate: true });
      }

      // Save event to prevent duplicates
      await storage.savePaymentEvent(eventId, req.body);

      const { paymentId, status, providerRef } = req.body; // Assuming webhook body contains these

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
                notifications.gameFull(game.sport)
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
                notifications.gameJoined(game.sport, game.currentPlayers, game.maxPlayers)
              );
            }
          }
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== USERS ==========
  app.post("/api/users/push-token", async (req, res) => {
    try {
      const { userId, expoPushToken } = req.body;

      if (!userId || !expoPushToken) {
        return res.status(400).json({ error: "userId and expoPushToken required" });
      }

      await storage.updateUserPushToken(userId, expoPushToken);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== SEASONS/LEAGUES ==========
  app.post("/api/leagues/season", async (req, res) => {
    try {
      const data = insertSeasonSchema.parse(req.body);
      const season = await storage.createSeason(data);
      res.json(season);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season", async (req, res) => {
    try {
      const seasons = await storage.getSeasons();
      res.json(seasons);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season/:id", async (req, res) => {
    try {
      const season = await storage.getSeason(req.params.id);
      if (!season) return res.status(404).json({ error: "Season not found" });
      res.json(season);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== TEAMS ==========
  app.post("/api/leagues/season/:id/team", async (req, res) => {
    try {
      const seasonId = req.params.id;
      const data = insertTeamSchema.parse({ ...req.body, seasonId });
      const team = await storage.createTeam(data);
      res.json(team);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season/:id/teams", async (req, res) => {
    try {
      const teams = await storage.getTeamsBySeason(req.params.id);
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== FIXTURES ==========
  app.post("/api/leagues/season/:id/fixtures/generate", async (req, res) => {
    try {
      const seasonId = req.params.id;
      const season = await storage.getSeason(seasonId);
      if (!season) return res.status(404).json({ error: "Season not found" });

      const teams = await storage.getTeamsBySeason(seasonId);
      if (teams.length < 2) {
        return res.status(400).json({ error: "Need at least 2 teams to generate fixtures" });
      }

      const teamIds = teams.map(t => t.id);
      const fixtureData = generateRoundRobinFixtures(teamIds, seasonId, season.startDate);

      const fixtures = await storage.createFixtures(fixtureData);
      res.json(fixtures);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season/:id/fixtures", async (req, res) => {
    try {
      const fixtures = await storage.getFixturesBySeason(req.params.id);
      res.json(fixtures);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== STANDINGS ==========
  app.get("/api/leagues/season/:id/standings", async (req, res) => {
    try {
      const standings = await storage.getStandings(req.params.id);
      res.json(standings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ========== DASHBOARD ==========
  app.get("/api/dashboard/venues/:partnerId", async (req, res) => {
    try {
      const venues = await storage.getVenuesByPartner(req.params.partnerId);
      res.json(venues);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dashboard/bookings/:venueId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByVenue(req.params.venueId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dashboard/payouts/:venueId", async (req, res) => {
    try {
      const payouts = await storage.getPayoutsByVenue(req.params.venueId);
      res.json(payouts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create payment intent
  app.post('/api/payments/create-intent', async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { amount, currency, metadata } = req.body;
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Missing amount or currency' });
    }

    try {
      const intent = await paymentAdapter.createPaymentIntent(amount, currency, {
        ...metadata,
        userId: req.user.id,
        email: req.user.email,
      });
      res.json(intent);
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
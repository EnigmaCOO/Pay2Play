import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVenueSchema, insertFieldSchema, insertSlotSchema, insertBookingSchema, insertPaymentSchema, insertGameSchema, insertGamePaymentSchema, insertSeasonSchema, insertTeamSchema, insertFixtureSchema } from "@shared/schema";
import crypto from "crypto";

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
      
      const payment = await storage.createPayment({
        bookingId,
        userId,
        amountPkr,
        provider,
        idempotencyKey,
        status: "pending",
        redirectUrl: `${req.protocol}://${req.get('host')}/bookings/${bookingId}/confirm`
      });
      
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/payments/webhook/:provider", async (req, res) => {
    try {
      const { provider } = req.params;
      
      // For mock provider in development, skip HMAC verification
      if (provider !== "mock") {
        const signature = req.headers['x-webhook-signature'] as string;
        const webhookSecret = process.env.PROVIDER_WEBHOOK_SECRET || "test-secret";
        
        // Verify HMAC signature for real providers
        const payload = JSON.stringify(req.body);
        if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
          return res.status(401).json({ error: "Invalid signature" });
        }
      }
      
      const { paymentId, status, providerRef } = req.body;
      
      await storage.updatePaymentStatus(paymentId, status, providerRef);
      
      // Update booking status if payment succeeded
      if (status === 'succeeded') {
        const payment = await storage.getPayment(paymentId);
        if (payment?.bookingId) {
          await storage.updateBookingStatus(payment.bookingId, 'confirmed');
        }
      }
      
      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
      
      const payment = await storage.createGamePayment({
        gameId,
        userId,
        amountPkr: game.pricePerPlayerPkr,
        provider,
        idempotencyKey,
        status: "pending",
        redirectUrl: `${req.protocol}://${req.get('host')}/games/${gameId}/confirm`
      });
      
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/game-pay/webhook/:provider", async (req, res) => {
    try {
      const { provider } = req.params;
      
      // For mock provider in development, skip HMAC verification
      if (provider !== "mock") {
        const signature = req.headers['x-webhook-signature'] as string;
        const webhookSecret = process.env.PROVIDER_WEBHOOK_SECRET || "test-secret";
        
        // Verify HMAC signature for real providers
        const payload = JSON.stringify(req.body);
        if (!signature || !verifyWebhookSignature(payload, signature, webhookSecret)) {
          return res.status(401).json({ error: "Invalid signature" });
        }
      }
      
      const { paymentId, status, providerRef } = req.body;
      
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
            if (game.currentPlayers >= game.maxPlayers) {
              await storage.updateGameStatus(game.id, 'filled');
            } else if (game.currentPlayers >= game.minPlayers && game.status === 'open') {
              await storage.updateGameStatus(game.id, 'confirmed');
            }
            
            // TODO: Send push notification to user
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

  const httpServer = createServer(app);
  return httpServer;
}

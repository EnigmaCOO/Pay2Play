import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVenueSchema, insertFieldSchema, insertSlotSchema, insertBookingSchema, insertGameSchema, insertSeasonSchema, insertTeamSchema, insertSportSchema } from "@shared/schema";
import crypto from "crypto";
import { notificationService, notifications } from "./notifications";
import { authenticate, registerUser, loginUser } from "./auth";

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
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Authentication routes
  app.post("/api/register", registerUser);
  app.post("/api/login", loginUser);

  // ========== SPORTS ==========
  app.post("/api/sports", authenticate, async (req, res) => {
    try {
      const data = insertSportSchema.parse(req.body);
      const sport = await storage.createSport(data);
      return res.json(sport);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/sports", async (req, res) => {
    try {
      const sports = await storage.getSports();
      return res.json(sports);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/sports/:id", async (req, res) => {
    try {
      const sport = await storage.getSport(req.params.id);
      if (!sport) return res.status(404).json({ error: "Sport not found" });
      return res.json(sport);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== VENUES ==========
  app.get("/api/venues", async (req, res) => {
    try {
      const { verified, sportId } = req.query;
      const venues = await storage.getVenues(verified === 'true', sportId as string | undefined);
      
      return res.json(venues);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/venues", authenticate, async (req, res) => {
    try {
      const data = insertVenueSchema.parse(req.body);
      const venue = await storage.createVenue(data);
      return res.json(venue);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const venue = await storage.getVenue(req.params.id);
      if (!venue) return res.status(404).json({ error: "Venue not found" });
      
      const fields = await storage.getFieldsByVenue(venue.id);
      return res.json({ ...venue, fields });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== FIELDS ==========
  app.post("/api/fields", authenticate, async (req, res) => {
    try {
      const data = insertFieldSchema.parse(req.body);
      const field = await storage.createField(data);
      return res.json(field);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
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
      
      return res.json(slots);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/slots", authenticate, async (req, res) => {
    try {
      const data = insertSlotSchema.parse(req.body);
      const slot = await storage.createSlot(data);
      return res.json(slot);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  // ========== BOOKINGS ==========
  app.post("/api/bookings", authenticate, async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      return res.json(booking);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/bookings", authenticate, async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "userId required" });
      
      const bookings = await storage.getUserBookings(userId as string);
      return res.json(bookings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== PAYMENTS (Bookings) ==========
  app.post("/api/payments/intent", authenticate, async (req, res) => {
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
      
      return res.json(payment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
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
      
      return res.json({ received: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== GAMES ==========
  app.post("/api/games", authenticate, async (req, res) => {
    try {
      const data = insertGameSchema.parse(req.body);
      const game = await storage.createGame({ ...data, sportId: data.sportId });
      return res.json(game);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/games/search", authenticate, async (req, res) => {
    try {
      const { sportId, skillLevel } = req.query;
      const userId = (req as any).user.uid;
      const games = await storage.getGames(
        userId,
        sportId === 'all' ? undefined : sportId as string,
        skillLevel as "beginner" | "intermediate" | "advanced" | undefined
      );
      return res.json(games);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(req.params.id);
      if (!game) return res.status(404).json({ error: "Game not found" });
      return res.json(game);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== USERS ==========
  app.put("/api/users/:userId/skill-level", authenticate, async (req, res) => {
    try {
      const { userId } = req.params;
      const { skillLevel } = req.body;

      if (!skillLevel || !["beginner", "intermediate", "advanced"].includes(skillLevel)) {
        return res.status(400).json({ error: "Invalid skill level provided." });
      }

      await storage.updateUserSkillLevel(userId, skillLevel);
      return res.status(200).json({ message: "Skill level updated successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== USER BLOCKING ==========
  app.post("/api/users/:userId/block", authenticate, async (req, res) => {
    try {
      const { userId } = req.params;
      const { blockedUserId } = req.body;

      if (!blockedUserId) {
        return res.status(400).json({ error: "blockedUserId is required" });
      }

      await storage.blockUser(userId, blockedUserId);
      return res.status(200).json({ message: "User blocked successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/users/:userId/unblock", authenticate, async (req, res) => {
    try {
      const { userId } = req.params;
      const { blockedUserId } = req.body;

      if (!blockedUserId) {
        return res.status(400).json({ error: "blockedUserId is required" });
      }

      await storage.unblockUser(userId, blockedUserId);
      return res.status(200).json({ message: "User unblocked successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/users/:userId/blocked", authenticate, async (req, res) => {
    try {
      const { userId } = req.params;
      const blockedUsers = await storage.getBlockedUsers(userId);
      return res.json(blockedUsers);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });
  
  // ========== GAME WAITLIST ==========
  app.post("/api/games/:gameId/waitlist", authenticate, async (req, res) => {
    try {
      const { gameId } = req.params;
      const userId = (req as any).user.uid;

      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }

      // Add user to waitlist
      const waitlistEntry = await storage.addUserToGameWaitlist(gameId, userId);

      return res.status(201).json(waitlistEntry);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/games/:gameId/waitlist", authenticate, async (req, res) => {
    try {
      const { gameId } = req.params;
      const userId = (req as any).user.uid;

      await storage.removeUserFromGameWaitlist(gameId, userId);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/games/:gameId/cancel", authenticate, async (req, res) => {
    try {
      const { gameId } = req.params;
      const userId = (req as any).user.uid;

      // 1. Get the user's payment for the game
      const payment = await storage.getGamePaymentByUserAndGame(userId, gameId);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found for this game." });
      }

      // 2. Remove the player from the game
      await storage.removeGamePlayer(gameId, userId);

      // 3. Decrement the player count
      await storage.decrementGamePlayers(gameId);

      // 4. Issue a refund
      if (payment.status === 'succeeded') {
        await storage.createRefund({
          gamePaymentId: payment.id,
          amountPkr: payment.amountPkr,
          reason: "Player cancelled their spot.",
          status: "succeeded", // Mock provider auto-succeeds
        });
        await notificationService.sendToUser(
          userId,
          notifications.refundIssued(payment.amountPkr)
        );
      }

      // 5. Check for waitlist and notify
      const waitlist = await storage.getGameWaitlist(gameId);
      if (waitlist.length > 0) {
        const firstInWaitlist = waitlist[0];
        // TODO: Generate a unique token
        const joinToken = "dummy-token"; // Replace with actual token generation
        await notificationService.sendToUser(
          firstInWaitlist.userId,
          notifications.waitlistSpotOpen(gameId, joinToken)
        );
        console.log(`Notifying user ${firstInWaitlist.userId} to join the game.`);
      }

      return res.status(200).json({ message: "Successfully cancelled your spot." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/games/:gameId/join-from-waitlist", authenticate, async (req, res) => {
    try {
      const { gameId } = req.params;
      const { token } = req.body;
      const userId = (req as any).user.uid;

      // 1. Verify the join token (dummy verification for now)
      if (token !== "dummy-token") {
        return res.status(401).json({ error: "Invalid join token." });
      }

      // 2. Remove the user from the waitlist
      await storage.removeUserFromGameWaitlist(gameId, userId);

      // 3. Add the user to the game
      await storage.addGamePlayer({ gameId, userId, isHost: false });

      // 4. Increment the player count
      await storage.incrementGamePlayers(gameId);

      // 5. Decrement the waitlist count
      await storage.decrementGameWaitlistCount(gameId);

      // 6. Create a payment for the user
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ error: "Game not found" });
      }
      const payment = await storage.createGamePayment({
        gameId,
        userId,
        amountPkr: game.pricePerPlayerPkr,
        provider: "mock",
        idempotencyKey: crypto.randomUUID(),
        status: "succeeded", // Auto-succeed for waitlist joins
      });

      return res.status(200).json({ message: "Successfully joined the game from the waitlist.", payment });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== GAME PAYMENTS (Join Game) ==========
  app.post("/api/game-pay/:gameId/intent", authenticate, async (req, res) => {
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
      
      return res.json(payment);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
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
      
      return res.json({ received: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== USERS ==========
  app.post("/api/users/push-token", authenticate, async (req, res) => {
    try {
      const { userId, expoPushToken } = req.body;
      
      if (!userId || !expoPushToken) {
        return res.status(400).json({ error: "userId and expoPushToken required" });
      }
      
      await storage.updateUserPushToken(userId, expoPushToken);
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== SEASONS/LEAGUES ==========
  app.post("/api/leagues/season", authenticate, async (req, res) => {
    try {
      const data = insertSeasonSchema.parse(req.body);
      const season = await storage.createSeason({ ...data, sportId: data.sportId });
      return res.json(season);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season", async (req, res) => {
    try {
      const seasons = await storage.getSeasons();
      return res.json(seasons);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season/:id", async (req, res) => {
    try {
      const season = await storage.getSeason(req.params.id);
      if (!season) return res.status(404).json({ error: "Season not found" });
      return res.json(season);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== TEAMS ==========
  app.post("/api/leagues/season/:id/team", authenticate, async (req, res) => {
    try {
      const seasonId = req.params.id;
      const data = insertTeamSchema.parse({ ...req.body, seasonId });
      const team = await storage.createTeam(data);
      return res.json(team);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season/:id/teams", async (req, res) => {
    try {
      const teams = await storage.getTeamsBySeason(req.params.id);
      return res.json(teams);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== FIXTURES ==========
  app.post("/api/leagues/season/:id/fixtures/generate", authenticate, async (req, res) => {
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
      return res.json(fixtures);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season/:id/fixtures", async (req, res) => {
    try {
      const fixtures = await storage.getFixturesBySeason(req.params.id);
      return res.json(fixtures);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== STANDINGS ==========
  app.get("/api/leagues/season/:id/standings", async (req, res) => {
    try {
      const standings = await storage.getStandings(req.params.id);
      return res.json(standings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== DASHBOARD ==========
  app.get("/api/dashboard/venues/:partnerId", authenticate, async (req, res) => {
    try {
      const venues = await storage.getVenuesByPartner(req.params.partnerId);
      return res.json(venues);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dashboard/bookings/:venueId", authenticate, async (req, res) => {
    try {
      const bookings = await storage.getBookingsByVenue(req.params.venueId);
      return res.json(bookings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dashboard/payouts/:venueId", authenticate, async (req, res) => {
    try {
      const payouts = await storage.getPayoutsByVenue(req.params.venueId);
      return res.json(payouts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
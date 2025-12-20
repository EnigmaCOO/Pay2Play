import { Request, Express } from "express";
import { storage } from "../storage.js";
import { insertVenueSchema, insertFieldSchema, insertSlotSchema, insertBookingSchema, insertGameSchema, insertSeasonSchema, insertTeamSchema, insertSportSchema } from "../shared/schema.js";
import crypto from "crypto";
import { notificationService, notifications } from "../notifications/notifications.js";
import { authenticate } from "../auth-profiles/auth.js";


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

export function registerBookingRoutes(app: Express) {
  // Health check
  app.get("/api/health", (req, res) => {
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ========== SPORTS ==========
  app.post("/api/sports", authenticate, async (req: Request, res) => {

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
      const sport = await storage.getSport((req.params as any).id);
      if (!sport) return res.status(404).json({ error: "Sport not found" });
      return res.json(sport);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== VENUES ==========
  app.get("/api/venues", async (req, res) => {
    try {
      const { verified, sportId } = req.query as any;
      const venues = await storage.getVenues(verified === 'true', sportId as string | undefined);
      
      return res.json(venues);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/venues", authenticate, async (req: Request, res) => {

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
      const venue = await storage.getVenue((req.params as any).id);
      if (!venue) return res.status(404).json({ error: "Venue not found" });
      
      const fields = await storage.getFieldsByVenue(venue.id);
      return res.json({ ...venue, fields });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== FIELDS ==========
  app.post("/api/fields", authenticate, async (req: Request, res) => {

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

  app.post("/api/slots", authenticate, async (req: Request, res) => {

    try {
      const data = insertSlotSchema.parse(req.body);
      const slot = await storage.createSlot(data);
      return res.json(slot);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  // ========== BOOKINGS ==========
  app.post("/api/bookings", authenticate, async (req: Request, res) => {

    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      return res.json(booking);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/bookings", authenticate, async (req: Request, res) => {

    try {
      const { userId } = req.query as any;
      if (!userId) return res.status(400).json({ error: "userId required" });
      
      const bookings = await storage.getUserBookings(userId as string);
      return res.json(bookings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/bookings/:bookingId/cancel", authenticate, async (req: Request, res) => {

    try {
      const { bookingId } = (req.params as any);
      const userId = (req as any).user.uid;

      const booking = await storage.getBooking(bookingId);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found." });
      }
      if (booking.userId !== userId) {
        return res.status(403).json({ error: "You are not authorized to cancel this booking." });
      }
      if (booking.status === "cancelled") {
        return res.status(400).json({ error: "Booking is already cancelled." });
      }

      await storage.updateBookingStatus(bookingId, "cancelled");

      const payment = await storage.getPaymentByBookingId(bookingId); // Assuming this function exists or will be created
      if (payment && payment.status === "succeeded") {
        await storage.createRefund({
          paymentId: payment.id,
          amountPkr: payment.amountPkr,
          reason: "User initiated cancellation.",
          status: "pending", // Refund status
        });
        await notificationService.sendToUser(
          userId,
          notifications.refundIssued(payment.amountPkr)
        );
      }

      return res.status(200).json({ message: "Booking cancelled successfully." });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== GAMES ==========
  app.post("/api/games", authenticate, async (req: Request, res) => {

    try {
      const data = insertGameSchema.parse(req.body as any);
      const game = await storage.createGame({ ...data, sportId: data.sportId });
      return res.json(game);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/games/search", authenticate, async (req: Request, res) => {

    try {

      const userId = (req as any).user.uid;
      const games = await storage.getGames(
        userId,
        (req.query as any).sportId === 'all' ? undefined : (req.query as any).sportId as string,
        (req.query as any).skillLevel as "beginner" | "intermediate" | "advanced" | undefined
      );
      return res.json(games);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame((req.params as any).id);
      if (!game) return res.status(404).json({ error: "Game not found" });
      return res.json(game);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== GAME WAITLIST ==========
  app.post("/api/games/:gameId/waitlist", authenticate, async (req: Request, res) => {
    try {
      const { gameId } = (req.params as any);
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

  app.delete("/api/games/:gameId/waitlist", authenticate, async (req: Request, res) => {
    try {
      const { gameId } = (req.params as any);
      const userId = (req as any).user.uid;

      await storage.removeUserFromGameWaitlist(gameId, userId);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/games/:gameId/cancel", authenticate, async (req: Request, res) => {
    try {
      const { gameId } = (req.params as any);
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

  app.post("/api/games/:gameId/join-from-waitlist", authenticate, async (req: Request, res) => {
    try {
      const { gameId } = (req.params as any);
      const { token } = req.body as any;
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
  // ========== SEASONS/LEAGUES ==========
  app.post("/api/leagues/season", authenticate, async (req: Request, res) => {
    try {
      const data = insertSeasonSchema.parse(req.body as any);
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
      const season = await storage.getSeason((req.params as any).id);
      if (!season) return res.status(404).json({ error: "Season not found" });
      return res.json(season);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== TEAMS ==========
  app.post("/api/leagues/season/:id/team", authenticate, async (req: Request, res) => {
    try {
      const seasonId = (req.params as any).id;
      const data = insertTeamSchema.parse({ ...req.body as any, seasonId });
      const team = await storage.createTeam(data);
      return res.json(team);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/leagues/season/:id/teams", async (req, res) => {
    try {
      const teams = await storage.getTeamsBySeason((req.params as any).id);
      return res.json(teams);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== FIXTURES ==========
  app.post("/api/leagues/season/:id/fixtures/generate", authenticate, async (req: Request, res) => {
    try {
      const seasonId = (req.params as any).id;
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
      const fixtures = await storage.getFixturesBySeason((req.params as any).id);
      return res.json(fixtures);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== STANDINGS ==========
  app.get("/api/leagues/season/:id/standings", async (req, res) => {
    try {
      const standings = await storage.getStandings((req.params as any).id);
      return res.json(standings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // ========== DASHBOARD ==========
  app.get("/api/dashboard/venues/:partnerId", authenticate, async (req: Request, res) => {
    try {
      const venues = await storage.getVenuesByPartner((req.params as any).partnerId);
      return res.json(venues);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dashboard/bookings/:venueId", authenticate, async (req: Request, res) => {
    try {
      const bookings = await storage.getBookingsByVenue((req.params as any).venueId);
      return res.json(bookings);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dashboard/payouts/:venueId", authenticate, async (req: Request, res) => {
    try {
      const payouts = await storage.getPayoutsByVenue((req.params as any).venueId);
      return res.json(payouts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  return app;
}
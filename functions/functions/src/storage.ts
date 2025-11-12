import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import type {
  User, InsertUser,
  Venue, InsertVenue,
  Field, InsertField,
  Slot, InsertSlot,
  Booking, InsertBooking,
  Payment, InsertPayment,
  Game, InsertGame, GameWithDetails,
  GamePlayer, InsertGamePlayer,
  GamePayment, InsertGamePayment,
  Refund, InsertRefund,
  Season, InsertSeason,
  Team, InsertTeam, TeamStanding,
  Fixture, InsertFixture,
  Sport, InsertSport,
  BlockedUser,
} from "@shared/schema";
import * as schema from "@shared/schema";

export interface IStorage {
  // Sports
  createSport(sport: InsertSport): Promise<Sport>;
  getSport(id: string): Promise<Sport | undefined>;
  getSports(): Promise<Sport[]>;

  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPushToken(userId: string, expoPushToken: string): Promise<void>;
  updateUserSkillLevel(userId: string, skillLevel: "beginner" | "intermediate" | "advanced"): Promise<void>;
  blockUser(userId: string, blockedUserId: string): Promise<void>;
  unblockUser(userId: string, blockedUserId: string): Promise<void>;
  getBlockedUsers(userId: string): Promise<BlockedUser[]>;

  // Venues
  getVenues(verified?: boolean, sportId?: string): Promise<Venue[]>;
  getVenue(id: string): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;

  // Fields
  getFieldsByVenue(venueId: string): Promise<Field[]>;
  getField(id: string): Promise<Field | undefined>;
  createField(field: InsertField): Promise<Field>;

  // Slots
  searchAvailableSlots(fieldId: string, startTime: Date, endTime: Date): Promise<Slot[]>;
  createSlot(slot: InsertSlot): Promise<Slot>;
  getSlot(id: string): Promise<Slot | undefined>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getUserBookings(userId: string): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: string): Promise<void>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentByIdempotencyKey(key: string): Promise<Payment | undefined>;
  updatePaymentStatus(id: string, status: string, providerRef?: string): Promise<void>;

  // Games
  createGame(game: InsertGame): Promise<Game>;
  getGames(userId: string, sportIdFilter?: string, skillLevelFilter?: "beginner" | "intermediate" | "advanced"): Promise<GameWithDetails[]>;
  getGame(id: string): Promise<GameWithDetails | undefined>;
  updateGameStatus(id: string, status: string): Promise<void>;
  incrementGamePlayers(id: string): Promise<void>;
  getGamesNeedingCancellation(minutesBeforeStart: number): Promise<Game[]>;
  getUpcomingGames(beforeTime: Date): Promise<GameWithDetails[]>;

  // Game Players
  addGamePlayer(gamePlayer: InsertGamePlayer): Promise<GamePlayer>;
  getGamePlayers(gameId: string): Promise<GamePlayer[]>;
  removeGamePlayer(gameId: string, userId: string): Promise<void>;
  decrementGamePlayers(id: string): Promise<void>;

  // Game Waitlist
  addUserToGameWaitlist(gameId: string, userId: string): Promise<GameWaitlist>;
  removeUserFromGameWaitlist(gameId: string, userId: string): Promise<void>;
  getGameWaitlist(gameId: string): Promise<GameWaitlist[]>;
  incrementGameWaitlistCount(gameId: string): Promise<void>;
  decrementGameWaitlistCount(gameId: string): Promise<void>;

  // Game Payments
  createGamePayment(payment: InsertGamePayment): Promise<GamePayment>;
  getGamePayment(id: string): Promise<GamePayment | undefined>;
  getGamePaymentByIdempotencyKey(key: string): Promise<GamePayment | undefined>;
  getGamePaymentByUserAndGame(userId: string, gameId: string): Promise<GamePayment | undefined>;
  updateGamePaymentStatus(id: string, status: string, providerRef?: string): Promise<void>;

  // Seasons/Leagues
  createSeason(season: InsertSeason): Promise<Season>;
  getSeasons(): Promise<Season[]>;
  getSeason(id: string): Promise<Season | undefined>;

  // Teams
  createTeam(team: InsertTeam): Promise<Team>;
  getTeamsBySeason(seasonId: string): Promise<Team[]>;

  // Fixtures
  createFixtures(fixtures: InsertFixture[]): Promise<Fixture[]>;
  getFixturesBySeason(seasonId: string): Promise<Fixture[]>;
  updateFixtureScore(id: string, homeScore: number, awayScore: number, status: string): Promise<void>;

  // Standings
  getStandings(seasonId: string): Promise<TeamStanding[]>;
  
  // Refunds
  createRefund(refund: InsertRefund): Promise<Refund>;
  getUserById(userId: string): Promise<User | undefined>;
  
  // Dashboard
  getVenuesByPartner(partnerId: string): Promise<Venue[]>;
  getBookingsByVenue(venueId: string): Promise<Booking[]>;
  getPayoutsByVenue(venueId: string): Promise<any[]>;
}

type Payout = {
  id: string;
  venueId: string;
  amountPkr: number;
  status: string;
  payoutDate?: Date | null;
  createdAt: Date;
};

export class DbStorage implements IStorage {
  private ensureDb() {
    if (!db) {
      throw new Error("Database client is not initialized");
    }
    return db;
  }

  // Sports
  async createSport(sport: InsertSport): Promise<Sport> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.sports).values(sport).returning();
    return created;
  }

  async getSport(id: string): Promise<Sport | undefined> {
    const db = this.ensureDb();
    const [sport] = await db.select().from(schema.sports).where(eq(schema.sports.id, id));
    return sport;
  }

  async getSports(): Promise<Sport[]> {
    const db = this.ensureDb();
    return db.select().from(schema.sports);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const db = this.ensureDb();
    const [user] = await db.select().from(schema.users).where(eq(schema.users.firebaseUid, firebaseUid));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.users).values(user).returning();
    return created;
  }

  async updateUserPushToken(userId: string, expoPushToken: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.users).set({ expoPushToken }).where(eq(schema.users.id, userId));
  }

  async updateUserSkillLevel(userId: string, skillLevel: "beginner" | "intermediate" | "advanced"): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.users).set({ skillLevel }).where(eq(schema.users.id, userId));
  }

  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    const db = this.ensureDb();
    await db.insert(schema.blockedUsers).values({ userId, blockedUserId });
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<void> {
    const db = this.ensureDb();
    await db.delete(schema.blockedUsers).where(and(eq(schema.blockedUsers.userId, userId), eq(schema.blockedUsers.blockedUserId, blockedUserId)));
  }

  async getBlockedUsers(userId: string): Promise<BlockedUser[]> {
    const db = this.ensureDb();
    return db.select().from(schema.blockedUsers).where(eq(schema.blockedUsers.userId, userId));
  }

  // Venues
  async getVenues(verified?: boolean, sportId?: string): Promise<Venue[]> {
    const db = this.ensureDb();
    if (sportId) {
      const venuesWithSportFields = await db.select({ venue: schema.venues }).from(schema.venues)
        .innerJoin(schema.fields, eq(schema.venues.id, schema.fields.venueId))
        .where(and(
          eq(schema.fields.sportId, sportId),
          verified !== undefined ? eq(schema.venues.verified, verified) : undefined
        ))
        .groupBy(schema.venues.id);
      return venuesWithSportFields.map(row => row.venue);
    } else if (verified !== undefined) {
      return db.select().from(schema.venues).where(eq(schema.venues.verified, verified));
    }
    return db.select().from(schema.venues);
  }

  async getVenue(id: string): Promise<Venue | undefined> {
    const db = this.ensureDb();
    const [venue] = await db.select().from(schema.venues).where(eq(schema.venues.id, id));
    return venue;
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.venues).values(venue).returning();
    return created;
  }

  // Fields
  async getFieldsByVenue(venueId: string): Promise<Field[]> {
    const db = this.ensureDb();
    return db.select().from(schema.fields).where(eq(schema.fields.venueId, venueId));
  }

  async getField(id: string): Promise<Field | undefined> {
    const db = this.ensureDb();
    const [field] = await db.select().from(schema.fields).where(eq(schema.fields.id, id));
    return field;
  }

  async createField(field: InsertField): Promise<Field> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.fields).values({ ...field, sportId: field.sportId }).returning();
    return created;
  }

  // Slots
  async searchAvailableSlots(fieldId: string, startTime: Date, endTime: Date): Promise<Slot[]> {
    const db = this.ensureDb();
    return db.select().from(schema.slots).where(
      and(
        eq(schema.slots.fieldId, fieldId),
        gte(schema.slots.startTime, startTime),
        lte(schema.slots.endTime, endTime),
        eq(schema.slots.availableForBooking, true)
      )
    );
  }

  async createSlot(slot: InsertSlot): Promise<Slot> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.slots).values(slot).returning();
    return created;
  }

  async getSlot(id: string): Promise<Slot | undefined> {
    const db = this.ensureDb();
    const [slot] = await db.select().from(schema.slots).where(eq(schema.slots.id, id));
    return slot;
  }

  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.bookings).values(booking).returning();
    return created;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const db = this.ensureDb();
    return db.select().from(schema.bookings).where(eq(schema.bookings.userId, userId)).orderBy(desc(schema.bookings.createdAt));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const db = this.ensureDb();
    const [booking] = await db.select().from(schema.bookings).where(eq(schema.bookings.id, id));
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.bookings).set({ status: status as any }).where(eq(schema.bookings.id, id));
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.payments).values(payment).returning();
    return created;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const db = this.ensureDb();
    const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.id, id));
    return payment;
  }

  async getPaymentByIdempotencyKey(key: string): Promise<Payment | undefined> {
    const db = this.ensureDb();
    const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.idempotencyKey, key));
    return payment;
  }

  async updatePaymentStatus(id: string, status: string, providerRef?: string): Promise<void> {
    const db = this.ensureDb();
    const updates: any = { status: status as any, updatedAt: new Date() };
    if (providerRef) updates.providerRef = providerRef;
    await db.update(schema.payments).set(updates).where(eq(schema.payments.id, id));
  }

  // Games
  async createGame(game: InsertGame): Promise<Game> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.games).values({ ...game, sportId: game.sportId }).returning();
    // Add host as first player
    await this.addGamePlayer({ gameId: created.id, userId: game.hostId, isHost: true });
    return created;
  }

  async getGames(userId: string, sportIdFilter?: string, skillLevelFilter?: "beginner" | "intermediate" | "advanced"): Promise<GameWithDetails[]> {
    const db = this.ensureDb();
    const blockedUsers = await this.getBlockedUsers(userId);
    const blockedUserIds = blockedUsers.map(u => u.blockedUserId);

    const conditions = [];
    if (sportIdFilter) {
      conditions.push(eq(schema.games.sportId, sportIdFilter));
    }
    if (skillLevelFilter) {
      conditions.push(eq(schema.games.skillLevel, skillLevelFilter));
    }
    if (blockedUserIds.length > 0) {
      conditions.push(sql`${schema.games.hostId} NOT IN ${blockedUserIds}`);
    }

    const query = db.query.games.findMany({
      where: and(...conditions),
      with: {
        field: {
          with: { venue: true }
        },
        host: true,
        sport: true,
        players: {
          with: { user: true }
        }
      },
      orderBy: [desc(schema.games.createdAt)]
    });
    
    return query as Promise<GameWithDetails[]>;
  }

  async getGame(id: string): Promise<GameWithDetails | undefined> {
    const db = this.ensureDb();
    const game = await db.query.games.findFirst({
      where: eq(schema.games.id, id),
      with: {
        field: {
          with: { venue: true }
        },
        host: true,
        sport: true,
        players: {
          with: { user: true }
        }
      }
    });
    
    return game as GameWithDetails | undefined;
  }

  async updateGameStatus(id: string, status: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.games).set({ status: status as any }).where(eq(schema.games.id, id));
  }

  async incrementGamePlayers(id: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.games).set({
      currentPlayers: sql`${schema.games.currentPlayers} + 1`
    }).where(eq(schema.games.id, id));
  }

  async getGamesNeedingCancellation(minutesBeforeStart: number): Promise<Game[]> {
    const db = this.ensureDb();
    const threshold = new Date(Date.now() + minutesBeforeStart * 60 * 1000);
    return db.select().from(schema.games).where(
      and(
        eq(schema.games.status, "open"),
        lte(schema.games.startTime, threshold),
        sql`${schema.games.currentPlayers} < ${schema.games.minPlayers}`
      )
    );
  }

  // Game Players
  async addGamePlayer(gamePlayer: InsertGamePlayer): Promise<GamePlayer> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.gamePlayers).values(gamePlayer).returning();
    return created;
  }

  async getGamePlayers(gameId: string): Promise<GamePlayer[]> {
    const db = this.ensureDb();
    return db.select().from(schema.gamePlayers).where(eq(schema.gamePlayers.gameId, gameId));
  }

  async removeGamePlayer(gameId: string, userId: string): Promise<void> {
    const db = this.ensureDb();
    await db.delete(schema.gamePlayers).where(and(eq(schema.gamePlayers.gameId, gameId), eq(schema.gamePlayers.userId, userId)));
  }

  async decrementGamePlayers(id: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.games).set({
      currentPlayers: sql`${schema.games.currentPlayers} - 1`
    }).where(eq(schema.games.id, id));
  }

  // Game Waitlist
  async addUserToGameWaitlist(gameId: string, userId: string): Promise<GameWaitlist> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.gameWaitlist).values({ gameId, userId }).returning();
    await this.incrementGameWaitlistCount(gameId);
    return created;
  }

  async removeUserFromGameWaitlist(gameId: string, userId: string): Promise<void> {
    const db = this.ensureDb();
    await db.delete(schema.gameWaitlist).where(and(eq(schema.gameWaitlist.gameId, gameId), eq(schema.gameWaitlist.userId, userId)));
    await this.decrementGameWaitlistCount(gameId);
  }

  async getGameWaitlist(gameId: string): Promise<GameWaitlist[]> {
    const db = this.ensureDb();
    return db.select().from(schema.gameWaitlist).where(eq(schema.gameWaitlist.gameId, gameId));
  }

  async incrementGameWaitlistCount(gameId: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.games).set({
      waitlistCount: sql`${schema.games.waitlistCount} + 1`
    }).where(eq(schema.games.id, gameId));
  }

  async decrementGameWaitlistCount(gameId: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.games).set({
      waitlistCount: sql`${schema.games.waitlistCount} - 1`
    }).where(eq(schema.games.id, gameId));
  }

  // Game Payments
  async createGamePayment(payment: InsertGamePayment): Promise<GamePayment> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.gamePayments).values(payment).returning();
    return created;
  }

  async getGamePayment(id: string): Promise<GamePayment | undefined> {
    const db = this.ensureDb();
    const [payment] = await db.select().from(schema.gamePayments).where(eq(schema.gamePayments.id, id));
    return payment;
  }

  async getGamePaymentByIdempotencyKey(key: string): Promise<GamePayment | undefined> {
    const db = this.ensureDb();
    const [payment] = await db.select().from(schema.gamePayments).where(eq(schema.gamePayments.idempotencyKey, key));
    return payment;
  }

  async updateGamePaymentStatus(id: string, status: string, providerRef?: string): Promise<void> {
    const db = this.ensureDb();
    const updates: any = { status: status as any, updatedAt: new Date() };
    if (providerRef) updates.providerRef = providerRef;
    await db.update(schema.gamePayments).set(updates).where(eq(schema.gamePayments.id, id));
  }

  // Seasons
  async createSeason(season: InsertSeason): Promise<Season> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.seasons).values({ ...season, sportId: season.sportId }).returning();
    return created;
  }

  async getSeasons(): Promise<Season[]> {
    const db = this.ensureDb();
    return db.select().from(schema.seasons).orderBy(desc(schema.seasons.startDate));
  }

  async getSeason(id: string): Promise<Season | undefined> {
    const db = this.ensureDb();
    const [season] = await db.select().from(schema.seasons).where(eq(schema.seasons.id, id));
    return season;
  }

  // Teams
  async createTeam(team: InsertTeam): Promise<Team> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.teams).values(team).returning();
    return created;
  }

  async getTeamsBySeason(seasonId: string): Promise<Team[]> {
    const db = this.ensureDb();
    return db.select().from(schema.teams).where(eq(schema.teams.seasonId, seasonId));
  }

  // Fixtures
  async createFixtures(fixtures: InsertFixture[]): Promise<Fixture[]> {
    const db = this.ensureDb();
    return db.insert(schema.fixtures).values(fixtures).returning();
  }

  async getFixturesBySeason(seasonId: string): Promise<Fixture[]> {
    const db = this.ensureDb();
    return db.query.fixtures.findMany({
      where: eq(schema.fixtures.seasonId, seasonId),
      with: {
        homeTeam: true,
        awayTeam: true,
        venue: true
      },
      orderBy: [schema.fixtures.scheduledDate]
    });
  }

  async updateFixtureScore(id: string, homeScore: number, awayScore: number, status: string): Promise<void> {
    const db = this.ensureDb();
    await db.update(schema.fixtures).set({ homeScore, awayScore, status }).where(eq(schema.fixtures.id, id));
  }

  // Standings
  async getStandings(seasonId: string): Promise<TeamStanding[]> {
    const teams = await this.getTeamsBySeason(seasonId);
    return teams.map(team => ({
      ...team,
      goalDifference: 0 // Calculate based on fixtures if needed
    }));
  }
  
  // Refunds
  async createRefund(refund: InsertRefund): Promise<Refund> {
    const db = this.ensureDb();
    const [created] = await db.insert(schema.refunds).values(refund).returning();
    return created;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.getUser(userId);
  }

  async getUpcomingGames(beforeTime: Date): Promise<GameWithDetails[]> {
    const db = this.ensureDb();
    const now = new Date();
    return db.query.games.findMany({
      where: and(
        gte(schema.games.startTime, now),
        lte(schema.games.startTime, beforeTime),
        // Only process games that are still open or confirmed (not already cancelled/filled)
        sql`${schema.games.status} IN ('open', 'confirmed')`
      ),
      with: {
        field: { with: { venue: true } },
        host: true,
        players: { with: { user: true } },
      },
    });
  }
  
  async getGamePaymentByUserAndGame(userId: string, gameId: string): Promise<GamePayment | undefined> {
    const db = this.ensureDb();
    const [payment] = await db.select()
      .from(schema.gamePayments)
      .where(and(
        eq(schema.gamePayments.userId, userId),
        eq(schema.gamePayments.gameId, gameId)
      ));
    return payment;
  }
  
  // Dashboard
  async getVenuesByPartner(partnerId: string): Promise<Venue[]> {
    const db = this.ensureDb();
    return db.select().from(schema.venues).where(eq(schema.venues.partnerId, partnerId));
  }

  async getBookingsByVenue(venueId: string): Promise<Booking[]> {
    const db = this.ensureDb();
    return db.query.bookings.findMany({
      where: (bookings) => {
        return sql`EXISTS (
          SELECT 1 FROM ${schema.slots} s
          JOIN ${schema.fields} f ON s.field_id = f.id
          WHERE s.id = ${bookings.slotId}
          AND f.venue_id = ${venueId}
        )`;
      },
      with: {
        user: true,
        slot: { with: { field: true } },
      },
      orderBy: [desc(schema.bookings.createdAt)],
    });
  }

  async getPayoutsByVenue(venueId: string): Promise<any[]> {
    const db = this.ensureDb();
    return db.select().from(schema.payouts).where(eq(schema.payouts.venueId, venueId));
  }
}

class InMemoryStorage implements IStorage {
  private users: User[] = [];
  private venues: Venue[] = [];
  private fields: Field[] = [];
  private slots: Slot[] = [];
  private bookings: Booking[] = [];
  private payments: Payment[] = [];
  private games: Game[] = [];
  private gamePlayers: GamePlayer[] = [];
  private gameWaitlist: GameWaitlist[] = [];
  private gamePayments: GamePayment[] = [];
  private refunds: Refund[] = [];
  private seasons: Season[] = [];
  private teams: Team[] = [];
  private fixtures: Fixture[] = [];
  private payouts: Payout[] = [];
  private sports: Sport[] = [];
  private blockedUsers: BlockedUser[] = [];

  constructor() {
    void this.seed();
  }

  private clone<T>(value: T): T {
    return structuredClone(value);
  }

  private async seed() {
    const user = await this.createUser({
      firebaseUid: "demo-user-123",
      email: "demo@pay2play.app",
      displayName: "Demo User",
      phoneNumber: "+92300123456",
    });

    const sports = await Promise.all(
      [
        { name: "cricket", description: "Cricket is a bat-and-ball game played between two teams of eleven players on a field with a wicket at each end." },
        { name: "football", description: "Football, also known as soccer, is a team sport played with a spherical ball between two teams of 11 players." },
        { name: "futsal", description: "Futsal is a modified form of soccer played with five players per side on a smaller, typically indoor, field." },
        { name: "padel", description: "Padel is a racket sport typically played in doubles on an enclosed court a third the size of a tennis court." },
      ].map((sport) => this.createSport(sport)),
    );

    const venues = await Promise.all(
      [
        {
          name: "DHA Sports Complex",
          address: "Phase 5, DHA",
          city: "Lahore",
          description: "Premium sports facility with multiple cricket and football fields",
          verified: true,
          partnerId: user.id,
        },
        {
          name: "Model Town Arena",
          address: "Model Town Link Road",
          city: "Lahore",
          description: "Modern futsal and padel courts in the heart of the city",
          verified: true,
          partnerId: user.id,
        },
        {
          name: "Cantt Cricket Stadium",
          address: "Mall Road, Cantt",
          city: "Lahore",
          description: "Professional cricket facility with excellent pitches",
          verified: true,
          partnerId: user.id,
        },
      ].map((venue) => this.createVenue(venue)),
    );

    const fieldSeeds: InsertField[] = [
      { venueId: venues[0].id, name: "Cricket Ground A", sportId: sports.find(s => s.name === "cricket")?.id || "", pricePerHourPkr: 3000, capacity: 22 },
      { venueId: venues[0].id, name: "Football Field 1", sportId: sports.find(s => s.name === "football")?.id || "", pricePerHourPkr: 2500, capacity: 22 },
      { venueId: venues[1].id, name: "Futsal Court 1", sportId: sports.find(s => s.name === "futsal")?.id || "", pricePerHourPkr: 2000, capacity: 10 },
      { venueId: venues[1].id, name: "Padel Court A", sportId: sports.find(s => s.name === "padel")?.id || "", pricePerHourPkr: 1800, capacity: 4 },
      { venueId: venues[2].id, name: "Main Cricket Pitch", sportId: sports.find(s => s.name === "cricket")?.id || "", pricePerHourPkr: 3500, capacity: 22 },
    ];

    const fields = await Promise.all(fieldSeeds.map((field) => this.createField(field)));

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    for (const field of fields) {
      for (const day of [now, tomorrow]) {
        for (let hour = 18; hour <= 21; hour++) {
          const start = new Date(day);
          start.setHours(hour, 0, 0, 0);
          const end = new Date(start);
          end.setHours(hour + 1, 0, 0, 0);

          await this.createSlot({
            fieldId: field.id,
            startTime: start,
            endTime: end,
            availableForBooking: true,
          });
        }
      }
    }

    const gameSeeds: InsertGame[] = [
      {
        hostId: user.id,
        fieldId: fields[1].id,
        sportId: sports.find(s => s.name === "football")?.id || "",
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 18, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 19, 0),
        minPlayers: 8,
        maxPlayers: 14,
        pricePerPlayerPkr: 400,
        status: "open",
      },
      {
        hostId: user.id,
        fieldId: fields[2].id,
        sportId: sports.find(s => s.name === "futsal")?.id || "",
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 20, 0),
        minPlayers: 6,
        maxPlayers: 10,
        pricePerPlayerPkr: 350,
        status: "open",
      },
      {
        hostId: user.id,
        fieldId: fields[0].id,
        sportId: sports.find(s => s.name === "cricket")?.id || "",
        startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 17, 0),
        endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 19, 0),
        minPlayers: 12,
        maxPlayers: 22,
        pricePerPlayerPkr: 300,
        status: "open",
      },
    ];

    await Promise.all(gameSeeds.map((game) => this.createGame(game)));

    const season = await this.createSeason({
      name: "Lahore Premier League - Spring 2025",
      sportId: sports.find(s => s.name === "cricket")?.id || "",
      startDate: new Date(now.getFullYear(), 2, 1),
      endDate: new Date(now.getFullYear(), 4, 31),
      organizerId: user.id,
    });

    await Promise.all(
      ["Lahore Lions", "Karachi Kings", "Islamabad United", "Multan Sultans"].map((name) =>
        this.createTeam({
          seasonId: season.id,
          name,
          captainId: user.id,
        }),
      ),
    );
  }

  private ensureDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value);
  }

  private findVenue(venueId: string): Venue | undefined {
    return this.venues.find((venue) => venue.id === venueId);
  }

  private findField(fieldId: string): Field | undefined {
    return this.fields.find((field) => field.id === fieldId);
  }

  private findSport(sportId: string): Sport | undefined {
    return this.sports.find((sport) => sport.id === sportId);
  }

  private toGameWithDetails(game: Game): GameWithDetails {
    const field = this.findField(game.fieldId);
    if (!field) {
      throw new Error(`Field ${game.fieldId} not found`);
    }

    const venue = this.findVenue(field.venueId);
    if (!venue) {
      throw new Error(`Venue ${field.venueId} not found`);
    }

    const host = this.users.find((user) => user.id === game.hostId);
    if (!host) {
      throw new Error(`Host ${game.hostId} not found`);
    }

    const sport = this.findSport(game.sportId);
    if (!sport) {
      throw new Error(`Sport ${game.sportId} not found`);
    }

    const players = this.gamePlayers
      .filter((player) => player.gameId === game.id)
      .map((player) => ({
        ...player,
        user: this.users.find((user) => user.id === player.userId)!,
      }));

    const waitlist = this.gameWaitlist
      .filter((entry) => entry.gameId === game.id)
      .map((entry) => ({
        ...entry,
        user: this.users.find((user) => user.id === entry.userId)!,
      }));

    return {
      ...game,
      field: {
        ...field,
        venue: this.clone(venue),
      },
      host: this.clone(host),
      sport: this.clone(sport),
      players: players.map((player) => this.clone(player)),
      waitlist: waitlist.map((entry) => this.clone(entry)),
      _count: { players: players.length },
    };
  }

  // Sports
  async createSport(sport: InsertSport): Promise<Sport> {
    const created: Sport = {
      id: randomUUID(),
      createdAt: new Date(),
      name: sport.name,
      description: sport.description ?? null,
      imageUrl: sport.imageUrl ?? null,
    };
    this.sports.push(created);
    return this.clone(created);
  }

  async getSport(id: string): Promise<Sport | undefined> {
    const sport = this.sports.find((item) => item.id === id);
    return sport ? this.clone(sport) : undefined;
  }

  async getSports(): Promise<Sport[]> {
    return this.clone(this.sports);
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = this.users.find((item) => item.id === id);
    return user ? this.clone(user) : undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const user = this.users.find((item) => item.firebaseUid === firebaseUid);
    return user ? this.clone(user) : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const created: User = {
      id: randomUUID(),
      createdAt: new Date(),
      expoPushToken: user.expoPushToken ?? null,
      firebaseUid: user.firebaseUid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      phoneNumber: user.phoneNumber ?? null,
    };
    this.users.push(created);
    return this.clone(created);
  }

  async updateUserPushToken(userId: string, expoPushToken: string): Promise<void> {
    const user = this.users.find((item) => item.id === userId);
    if (user) {
      user.expoPushToken = expoPushToken;
    }
  }

  async updateUserSkillLevel(userId: string, skillLevel: "beginner" | "intermediate" | "advanced"): Promise<void> {
    const user = this.users.find((item) => item.id === userId);
    if (user) {
      user.skillLevel = skillLevel;
    }
  }

  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    const created: BlockedUser = {
      id: randomUUID(),
      userId,
      blockedUserId,
      createdAt: new Date(),
    };
    this.blockedUsers.push(created);
  }

  async unblockUser(userId: string, blockedUserId: string): Promise<void> {
    const index = this.blockedUsers.findIndex((item) => item.userId === userId && item.blockedUserId === blockedUserId);
    if (index !== -1) {
      this.blockedUsers.splice(index, 1);
    }
  }

  async getBlockedUsers(userId: string): Promise<BlockedUser[]> {
    return this.clone(this.blockedUsers.filter((item) => item.userId === userId));
  }

  async getVenues(verified?: boolean): Promise<Venue[]> {
    const venues = verified === undefined
      ? this.venues
      : this.venues.filter((venue) => venue.verified === verified);
    return this.clone(venues);
  }

  async getVenue(id: string): Promise<Venue | undefined> {
    const venue = this.venues.find((item) => item.id === id);
    return venue ? this.clone(venue) : undefined;
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const created: Venue = {
      id: randomUUID(),
      createdAt: new Date(),
      imageUrl: venue.imageUrl ?? null,
      verified: venue.verified ?? false,
      partnerId: venue.partnerId ?? null,
      name: venue.name,
      address: venue.address,
      city: venue.city ?? "Lahore",
      description: venue.description ?? null,
    } as Venue;
    this.venues.push(created);
    return this.clone(created);
  }

  async getFieldsByVenue(venueId: string): Promise<Field[]> {
    const fields = this.fields.filter((field) => field.venueId === venueId);
    return this.clone(fields);
  }

  async getField(id: string): Promise<Field | undefined> {
    const field = this.fields.find((item) => item.id === id);
    return field ? this.clone(field) : undefined;
  }

  async createField(field: InsertField): Promise<Field> {
    const created: Field = {
      id: randomUUID(),
      createdAt: new Date(),
      capacity: field.capacity ?? null,
      venueId: field.venueId,
      name: field.name,
      sportId: field.sportId,
      pricePerHourPkr: field.pricePerHourPkr,
    } as Field;
    this.fields.push(created);
    return this.clone(created);
  }

  async searchAvailableSlots(fieldId: string, startTime: Date, endTime: Date): Promise<Slot[]> {
    const slots = this.slots.filter((slot) =>
      slot.fieldId === fieldId &&
      this.ensureDate(slot.startTime) >= startTime &&
      this.ensureDate(slot.endTime) <= endTime &&
      slot.availableForBooking,
    );
    return this.clone(slots);
  }

  async createSlot(slot: InsertSlot): Promise<Slot> {
    const created: Slot = {
      id: randomUUID(),
      createdAt: new Date(),
      fieldId: slot.fieldId,
      startTime: this.ensureDate(slot.startTime),
      endTime: this.ensureDate(slot.endTime),
      availableForBooking: slot.availableForBooking ?? true,
    } as Slot;
    this.slots.push(created);
    return this.clone(created);
  }

  async getSlot(id: string): Promise<Slot | undefined> {
    const slot = this.slots.find((item) => item.id === id);
    return slot ? this.clone(slot) : undefined;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const created: Booking = {
      id: randomUUID(),
      createdAt: new Date(),
      userId: booking.userId,
      slotId: booking.slotId,
      status: booking.status ?? "pending",
      amountPkr: booking.amountPkr,
    } as Booking;
    this.bookings.push(created);
    return this.clone(created);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const bookings = this.bookings
      .filter((booking) => booking.userId === userId)
      .sort((a, b) => this.ensureDate(b.createdAt).getTime() - this.ensureDate(a.createdAt).getTime());
    return this.clone(bookings);
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const booking = this.bookings.find((item) => item.id === id);
    return booking ? this.clone(booking) : undefined;
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    const booking = this.bookings.find((item) => item.id === id);
    if (booking) {
      booking.status = status as Booking["status"];
    }
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const created: Payment = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      bookingId: payment.bookingId ?? null,
      userId: payment.userId,
      amountPkr: payment.amountPkr,
      provider: payment.provider ?? "mock",
      providerRef: payment.providerRef ?? null,
      status: payment.status ?? "pending",
      idempotencyKey: payment.idempotencyKey ?? null,
      redirectUrl: payment.redirectUrl ?? null,
    } as Payment;
    this.payments.push(created);
    return this.clone(created);
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const payment = this.payments.find((item) => item.id === id);
    return payment ? this.clone(payment) : undefined;
  }

  async getPaymentByIdempotencyKey(key: string): Promise<Payment | undefined> {
    const payment = this.payments.find((item) => item.idempotencyKey === key);
    return payment ? this.clone(payment) : undefined;
  }

  async updatePaymentStatus(id: string, status: string, providerRef?: string): Promise<void> {
    const payment = this.payments.find((item) => item.id === id);
    if (payment) {
      payment.status = status as Payment["status"];
      payment.updatedAt = new Date();
      if (providerRef) {
        payment.providerRef = providerRef;
      }
    }
  }

  async createGame(game: InsertGame): Promise<Game> {
    const created: Game = {
      id: randomUUID(),
      createdAt: new Date(),
      currentPlayers: 0,
      status: game.status ?? "open",
      hostId: game.hostId,
      fieldId: game.fieldId,
      sportId: game.sportId,
      startTime: this.ensureDate(game.startTime),
      endTime: this.ensureDate(game.endTime),
      minPlayers: game.minPlayers,
      maxPlayers: game.maxPlayers,
      pricePerPlayerPkr: game.pricePerPlayerPkr,
    } as Game;

    this.games.push(created);
    await this.addGamePlayer({ gameId: created.id, userId: game.hostId, isHost: true });
    return this.clone(created);
  }

  async getGames(userId: string, sportIdFilter?: string, skillLevelFilter?: "beginner" | "intermediate" | "advanced"): Promise<GameWithDetails[]> {
    let games = this.games.slice();
    const blockedUsers = await this.getBlockedUsers(userId);
    const blockedUserIds = blockedUsers.map(u => u.blockedUserId);

    if (sportIdFilter) {
      games = games.filter((game) => game.sportId === sportIdFilter);
    }
    if (skillLevelFilter) {
      games = games.filter((game) => game.skillLevel === skillLevelFilter);
    }
    if (blockedUserIds.length > 0) {
      games = games.filter((game) => !blockedUserIds.includes(game.hostId));
    }

    games.sort((a, b) => this.ensureDate(b.createdAt).getTime() - this.ensureDate(a.createdAt).getTime());
    return games.map((game) => this.clone(this.toGameWithDetails(game)));
  }

  async getGame(id: string): Promise<GameWithDetails | undefined> {
    const game = this.games.find((item) => item.id === id);
    return game ? this.clone(this.toGameWithDetails(game)) : undefined;
  }

  async updateGameStatus(id: string, status: string): Promise<void> {
    const game = this.games.find((item) => item.id === id);
    if (game) {
      game.status = status as Game["status"];
    }
  }

  async incrementGamePlayers(id: string): Promise<void> {
    const game = this.games.find((item) => item.id === id);
    if (game) {
      game.currentPlayers = (game.currentPlayers ?? 0) + 1;
    }
  }

  async getGamesNeedingCancellation(minutesBeforeStart: number): Promise<Game[]> {
    const threshold = new Date(Date.now() + minutesBeforeStart * 60 * 1000);
    const games = this.games.filter((game) =>
      game.status === "open" &&
      this.ensureDate(game.startTime) <= threshold &&
      (game.currentPlayers ?? 0) < game.minPlayers,
    );
    return this.clone(games);
  }

  async getUpcomingGames(beforeTime: Date): Promise<GameWithDetails[]> {
    const now = new Date();
    const games = this.games.filter((game) => {
      const start = this.ensureDate(game.startTime);
      return start >= now && start <= beforeTime && ["open", "confirmed"].includes(game.status as string);
    });
    return games.map((game) => this.clone(this.toGameWithDetails(game)));
  }

  async addGamePlayer(gamePlayer: InsertGamePlayer): Promise<GamePlayer> {
    const created: GamePlayer = {
      id: randomUUID(),
      joinedAt: new Date(),
      gameId: gamePlayer.gameId,
      userId: gamePlayer.userId,
      isHost: gamePlayer.isHost ?? false,
    } as GamePlayer;
    this.gamePlayers.push(created);

    const game = this.games.find((item) => item.id === created.gameId);
    if (game) {
      game.currentPlayers = (game.currentPlayers ?? 0) + 1;
    }

    return this.clone(created);
  }

  async getGamePlayers(gameId: string): Promise<GamePlayer[]> {
    const players = this.gamePlayers.filter((player) => player.gameId === gameId);
    return this.clone(players);
  }

  async removeGamePlayer(gameId: string, userId: string): Promise<void> {
    const index = this.gamePlayers.findIndex((item) => item.gameId === gameId && item.userId === userId);
    if (index !== -1) {
      this.gamePlayers.splice(index, 1);
    }
  }

  async decrementGamePlayers(id: string): Promise<void> {
    const game = this.games.find((item) => item.id === id);
    if (game) {
      game.currentPlayers = (game.currentPlayers ?? 0) - 1;
    }
  }

  // Game Waitlist
  async addUserToGameWaitlist(gameId: string, userId: string): Promise<GameWaitlist> {
    const created: GameWaitlist = {
      id: randomUUID(),
      gameId,
      userId,
      joinedAt: new Date(),
    };
    this.gameWaitlist.push(created);
    await this.incrementGameWaitlistCount(gameId);
    return this.clone(created);
  }

  async removeUserFromGameWaitlist(gameId: string, userId: string): Promise<void> {
    const index = this.gameWaitlist.findIndex((item) => item.gameId === gameId && item.userId === userId);
    if (index !== -1) {
      this.gameWaitlist.splice(index, 1);
      await this.decrementGameWaitlistCount(gameId);
    }
  }

  async getGameWaitlist(gameId: string): Promise<GameWaitlist[]> {
    const waitlist = this.gameWaitlist.filter((item) => item.gameId === gameId);
    return this.clone(waitlist);
  }

  async incrementGameWaitlistCount(gameId: string): Promise<void> {
    const game = this.games.find((item) => item.id === gameId);
    if (game) {
      game.waitlistCount = (game.waitlistCount ?? 0) + 1;
    }
  }

  async decrementGameWaitlistCount(gameId: string): Promise<void> {
    const game = this.games.find((item) => item.id === gameId);
    if (game) {
      game.waitlistCount = (game.waitlistCount ?? 0) - 1;
    }
  }

  // Game Payments
  async createGamePayment(payment: InsertGamePayment): Promise<GamePayment> {
    const created: GamePayment = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      gameId: payment.gameId,
      userId: payment.userId,
      amountPkr: payment.amountPkr,
      provider: payment.provider ?? "mock",
      providerRef: payment.providerRef ?? null,
      status: payment.status ?? "pending",
      idempotencyKey: payment.idempotencyKey ?? null,
      redirectUrl: payment.redirectUrl ?? null,
    } as GamePayment;
    this.gamePayments.push(created);
    return this.clone(created);
  }

  async getGamePayment(id: string): Promise<GamePayment | undefined> {
    const payment = this.gamePayments.find((item) => item.id === id);
    return payment ? this.clone(payment) : undefined;
  }

  async getGamePaymentByIdempotencyKey(key: string): Promise<GamePayment | undefined> {
    const payment = this.gamePayments.find((item) => item.idempotencyKey === key);
    return payment ? this.clone(payment) : undefined;
  }

  async getGamePaymentByUserAndGame(userId: string, gameId: string): Promise<GamePayment | undefined> {
    const payment = this.gamePayments.find((item) => item.userId === userId && item.gameId === gameId);
    return payment ? this.clone(payment) : undefined;
  }

  async updateGamePaymentStatus(id: string, status: string, providerRef?: string): Promise<void> {
    const payment = this.gamePayments.find((item) => item.id === id);
    if (payment) {
      payment.status = status as GamePayment["status"];
      payment.updatedAt = new Date();
      if (providerRef) {
        payment.providerRef = providerRef;
      }
    }
  }

  async createSeason(season: InsertSeason): Promise<Season> {
    const created: Season = {
      id: randomUUID(),
      createdAt: new Date(),
      name: season.name,
      sportId: season.sportId,
      startDate: this.ensureDate(season.startDate),
      endDate: this.ensureDate(season.endDate),
      organizerId: season.organizerId,
    } as Season;
    this.seasons.push(created);
    return this.clone(created);
  }

  async getSeasons(): Promise<Season[]> {
    const seasons = this.seasons
      .slice()
      .sort((a, b) => this.ensureDate(b.startDate).getTime() - this.ensureDate(a.startDate).getTime());
    return this.clone(seasons);
  }

  async getSeason(id: string): Promise<Season | undefined> {
    const season = this.seasons.find((item) => item.id === id);
    return season ? this.clone(season) : undefined;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const created: Team = {
      id: randomUUID(),
      createdAt: new Date(),
      seasonId: team.seasonId,
      name: team.name,
      captainId: team.captainId,
      logoUrl: team.logoUrl ?? null,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      points: 0,
    } as Team;
    this.teams.push(created);
    return this.clone(created);
  }

  async getTeamsBySeason(seasonId: string): Promise<Team[]> {
    const teams = this.teams.filter((team) => team.seasonId === seasonId);
    return this.clone(teams);
  }

  async createFixtures(fixtures: InsertFixture[]): Promise<Fixture[]> {
    const createdFixtures = fixtures.map((fixture) => {
      const created: Fixture = {
        id: randomUUID(),
        createdAt: new Date(),
        seasonId: fixture.seasonId,
        homeTeamId: fixture.homeTeamId,
        awayTeamId: fixture.awayTeamId,
        scheduledDate: this.ensureDate(fixture.scheduledDate),
        venueId: fixture.venueId ?? null,
        homeScore: fixture.homeScore ?? null,
        awayScore: fixture.awayScore ?? null,
        status: fixture.status ?? "scheduled",
      } as Fixture;
      this.fixtures.push(created);
      return created;
    });

    return this.clone(createdFixtures);
  }

  async getFixturesBySeason(seasonId: string): Promise<Fixture[]> {
    const fixtures = this.fixtures
      .filter((fixture) => fixture.seasonId === seasonId)
      .sort((a, b) => this.ensureDate(a.scheduledDate).getTime() - this.ensureDate(b.scheduledDate).getTime())
      .map((fixture) => ({
        ...fixture,
        homeTeam: this.teams.find((team) => team.id === fixture.homeTeamId) ?? null,
        awayTeam: this.teams.find((team) => team.id === fixture.awayTeamId) ?? null,
        venue: fixture.venueId ? this.findVenue(fixture.venueId) ?? null : null,
      }));

    return this.clone(fixtures);
  }

  async updateFixtureScore(id: string, homeScore: number, awayScore: number, status: string): Promise<void> {
    const fixture = this.fixtures.find((item) => item.id === id);
    if (!fixture) return;

    fixture.homeScore = homeScore;
    fixture.awayScore = awayScore;
    fixture.status = status;
  }

  async getStandings(seasonId: string): Promise<TeamStanding[]> {
    const teams = this.teams.filter((team) => team.seasonId === seasonId);
    const standings = teams.map((team) => ({
      ...team,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      points: 0,
    }));

    const map = new Map<string, TeamStanding>();
    standings.forEach((team) => map.set(team.id, team));

    for (const fixture of this.fixtures.filter((item) => item.seasonId === seasonId && item.homeScore !== null && item.awayScore !== null)) {
      const home = map.get(fixture.homeTeamId);
      const away = map.get(fixture.awayTeamId);
      if (!home || !away) continue;

      const homeScore = fixture.homeScore ?? 0;
      const awayScore = fixture.awayScore ?? 0;

      home.goalsFor! += homeScore;
      home.goalsAgainst! += awayScore;
      home.goalDifference = (home.goalsFor ?? 0) - (home.goalsAgainst ?? 0);
      home.played! += 1;

      away.goalsFor! += awayScore;
      away.goalsAgainst! += homeScore;
      away.goalDifference = (away.goalsFor ?? 0) - (away.goalsAgainst ?? 0);
      away.played! += 1;

      if (homeScore > awayScore) {
        home.won! += 1;
        home.points! += 2;
        away.lost! += 1;
      } else if (homeScore < awayScore) {
        away.won! += 1;
        away.points! += 2;
        home.lost! += 1;
      } else {
        home.drawn! += 1;
        away.drawn! += 1;
        home.points! += 1;
        away.points! += 1;
      }
    }

    return this.clone(standings);
  }

  async createRefund(refund: InsertRefund): Promise<Refund> {
    const created: Refund = {
      id: randomUUID(),
      createdAt: new Date(),
      paymentId: refund.paymentId ?? null,
      gamePaymentId: refund.gamePaymentId ?? null,
      amountPkr: refund.amountPkr,
      reason: refund.reason,
      status: refund.status ?? "pending",
      providerRef: refund.providerRef ?? null,
    } as Refund;
    this.refunds.push(created);
    return this.clone(created);
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.getUser(userId);
  }

  async getVenuesByPartner(partnerId: string): Promise<Venue[]> {
    const venues = this.venues.filter((venue) => venue.partnerId === partnerId);
    return this.clone(venues);
  }

  async getBookingsByVenue(venueId: string): Promise<Booking[]> {
    const fieldsForVenue = this.fields.filter((field) => field.venueId === venueId).map((field) => field.id);
    const slotsForVenue = this.slots.filter((slot) => fieldsForVenue.includes(slot.fieldId)).map((slot) => slot.id);

    const bookings = this.bookings
      .filter((booking) => slotsForVenue.includes(booking.slotId))
      .sort((a, b) => this.ensureDate(b.createdAt).getTime() - this.ensureDate(a.createdAt).getTime())
      .map((booking) => ({
        ...booking,
        user: this.users.find((user) => user.id === booking.userId) ?? null,
        slot: this.slots.find((slot) => slot.id === booking.slotId) ?? null,
      }));

    return this.clone(bookings);
  }

  async getPayoutsByVenue(venueId: string): Promise<any[]> {
    const payouts = this.payouts.filter((payout) => payout.venueId === venueId);
    return this.clone(payouts);
  }
}

const storageInstance: IStorage = db ? new DbStorage() : new InMemoryStorage();

export const storage = storageInstance;

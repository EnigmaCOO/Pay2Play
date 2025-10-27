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
} from "@shared/schema";
import * as schema from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPushToken(userId: string, expoPushToken: string): Promise<void>;
  updateUserProfile(userId: string, profile: Partial<User>): Promise<User>;

  // Venues
  getVenues(verified?: boolean): Promise<Venue[]>;
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
  getUserBookings(userId: string): Promise<any[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: string): Promise<void>;

  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentByIdempotencyKey(key: string): Promise<Payment | undefined>;
  updatePaymentStatus(id: string, status: string, providerRef?: string): Promise<void>;

  // Games
  createGame(game: InsertGame): Promise<Game>;
  getGames(sportFilter?: string): Promise<GameWithDetails[]>;
  getGame(id: string): Promise<GameWithDetails | undefined>;
  updateGameStatus(id: string, status: string): Promise<void>;
  incrementGamePlayers(id: string): Promise<void>;
  getGamesNeedingCancellation(minutesBeforeStart: number): Promise<Game[]>;
  getUpcomingGames(beforeTime: Date): Promise<GameWithDetails[]>;

  // Game Players
  addGamePlayer(gamePlayer: InsertGamePlayer): Promise<GamePlayer>;
  getGamePlayers(gameId: string): Promise<GamePlayer[]>;

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

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.firebaseUid, firebaseUid));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(schema.users).values(user).returning();
    return created;
  }

  async updateUserPushToken(userId: string, expoPushToken: string): Promise<void> {
    await db.update(schema.users).set({ expoPushToken }).where(eq(schema.users.id, userId));
  }

  async updateUserProfile(userId: string, profile: Partial<User>): Promise<User> {
    const [updated] = await db.update(schema.users)
      .set(profile)
      .where(eq(schema.users.id, userId))
      .returning();
    return updated;
  }

  // Venues
  async getVenues(verified?: boolean): Promise<Venue[]> {
    if (verified !== undefined) {
      return db.select().from(schema.venues).where(eq(schema.venues.verified, verified));
    }
    return db.select().from(schema.venues);
  }

  async getVenue(id: string): Promise<Venue | undefined> {
    const [venue] = await db.select().from(schema.venues).where(eq(schema.venues.id, id));
    return venue;
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [created] = await db.insert(schema.venues).values(venue).returning();
    return created;
  }

  // Fields
  async getFieldsByVenue(venueId: string): Promise<Field[]> {
    return db.select().from(schema.fields).where(eq(schema.fields.venueId, venueId));
  }

  async getField(id: string): Promise<Field | undefined> {
    const [field] = await db.select().from(schema.fields).where(eq(schema.fields.id, id));
    return field;
  }

  async createField(field: InsertField): Promise<Field> {
    const [created] = await db.insert(schema.fields).values(field).returning();
    return created;
  }

  // Slots
  async searchAvailableSlots(fieldId: string, startTime: Date, endTime: Date): Promise<Slot[]> {
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
    const [created] = await db.insert(schema.slots).values(slot).returning();
    return created;
  }

  async getSlot(id: string): Promise<Slot | undefined> {
    const [slot] = await db.select().from(schema.slots).where(eq(schema.slots.id, id));
    return slot;
  }

  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(schema.bookings).values(booking).returning();
    return created;
  }

  async getUserBookings(userId: string): Promise<any[]> {
    return db.query.bookings.findMany({
      where: eq(schema.bookings.userId, userId),
      with: {
        slot: {
          with: {
            field: {
              with: { venue: true }
            }
          }
        }
      },
      orderBy: [desc(schema.bookings.createdAt)]
    });
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(schema.bookings).where(eq(schema.bookings.id, id));
    return booking;
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    await db.update(schema.bookings).set({ status: status as any }).where(eq(schema.bookings.id, id));
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [created] = await db.insert(schema.payments).values(payment).returning();
    return created;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.id, id));
    return payment;
  }

  async getPaymentByIdempotencyKey(key: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.idempotencyKey, key));
    return payment;
  }

  async updatePaymentStatus(id: string, status: string, providerRef?: string): Promise<void> {
    const updates: any = { status: status as any, updatedAt: new Date() };
    if (providerRef) updates.providerRef = providerRef;
    await db.update(schema.payments).set(updates).where(eq(schema.payments.id, id));
  }

  // Games
  async createGame(game: InsertGame): Promise<Game> {
    const [created] = await db.insert(schema.games).values(game).returning();
    // Add host as first player
    await this.addGamePlayer({ gameId: created.id, userId: game.hostId, isHost: true });
    return created;
  }

  async getGames(sportFilter?: string): Promise<GameWithDetails[]> {
    const query = db.query.games.findMany({
      where: sportFilter ? eq(schema.games.sport, sportFilter as any) : undefined,
      with: {
        field: {
          with: { venue: true }
        },
        host: true,
        players: {
          with: { user: true }
        }
      },
      orderBy: [desc(schema.games.createdAt)]
    });

    return query as Promise<GameWithDetails[]>;
  }

  async getGame(id: string): Promise<GameWithDetails | undefined> {
    const game = await db.query.games.findFirst({
      where: eq(schema.games.id, id),
      with: {
        field: {
          with: { venue: true }
        },
        host: true,
        players: {
          with: { user: true }
        }
      }
    });

    return game as GameWithDetails | undefined;
  }

  async updateGameStatus(id: string, status: string): Promise<void> {
    await db.update(schema.games).set({ status: status as any }).where(eq(schema.games.id, id));
  }

  async incrementGamePlayers(id: string): Promise<void> {
    await db.update(schema.games).set({
      currentPlayers: sql`${schema.games.currentPlayers} + 1`
    }).where(eq(schema.games.id, id));
  }

  async getGamesNeedingCancellation(minutesBeforeStart: number): Promise<Game[]> {
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
    const [created] = await db.insert(schema.gamePlayers).values(gamePlayer).returning();
    return created;
  }

  async getGamePlayers(gameId: string): Promise<GamePlayer[]> {
    return db.select().from(schema.gamePlayers).where(eq(schema.gamePlayers.gameId, gameId));
  }

  // Game Payments
  async createGamePayment(payment: InsertGamePayment): Promise<GamePayment> {
    const [created] = await db.insert(schema.gamePayments).values(payment).returning();
    return created;
  }

  async getGamePayment(id: string): Promise<GamePayment | undefined> {
    const [payment] = await db.select().from(schema.gamePayments).where(eq(schema.gamePayments.id, id));
    return payment;
  }

  async getGamePaymentByIdempotencyKey(key: string): Promise<GamePayment | undefined> {
    const [payment] = await db.select().from(schema.gamePayments).where(eq(schema.gamePayments.idempotencyKey, key));
    return payment;
  }

  async updateGamePaymentStatus(id: string, status: string, providerRef?: string): Promise<void> {
    const updates: any = { status: status as any, updatedAt: new Date() };
    if (providerRef) updates.providerRef = providerRef;
    await db.update(schema.gamePayments).set(updates).where(eq(schema.gamePayments.id, id));
  }

  // Seasons
  async createSeason(season: InsertSeason): Promise<Season> {
    const [created] = await db.insert(schema.seasons).values(season).returning();
    return created;
  }

  async getSeasons(): Promise<Season[]> {
    return db.select().from(schema.seasons).orderBy(desc(schema.seasons.startDate));
  }

  async getSeason(id: string): Promise<Season | undefined> {
    const [season] = await db.select().from(schema.seasons).where(eq(schema.seasons.id, id));
    return season;
  }

  // Teams
  async createTeam(team: InsertTeam): Promise<Team> {
    const [created] = await db.insert(schema.teams).values(team).returning();
    return created;
  }

  async getTeamsBySeason(seasonId: string): Promise<Team[]> {
    return db.select().from(schema.teams).where(eq(schema.teams.seasonId, seasonId));
  }

  // Fixtures
  async createFixtures(fixtures: InsertFixture[]): Promise<Fixture[]> {
    return db.insert(schema.fixtures).values(fixtures).returning();
  }

  async getFixturesBySeason(seasonId: string): Promise<Fixture[]> {
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
    const [created] = await db.insert(schema.refunds).values(refund).returning();
    return created;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.getUser(userId);
  }

  async getUpcomingGames(beforeTime: Date): Promise<GameWithDetails[]> {
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
    return db.select().from(schema.venues).where(eq(schema.venues.partnerId, partnerId));
  }

  async getBookingsByVenue(venueId: string): Promise<Booking[]> {
    return db.query.bookings.findMany({
      where: (bookings, { eq, and }) => {
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
    return db.select().from(schema.payouts).where(eq(schema.payouts.venueId, venueId));
  }
}

export const storage = new DbStorage();
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sportEnum = pgEnum("sport", ["cricket", "football", "futsal", "padel"]);
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "succeeded", "failed", "refunded"]);
export const gameStatusEnum = pgEnum("game_status", ["open", "confirmed", "filled", "cancelled", "completed"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firebaseUid: varchar("firebase_uid").notNull().unique(),
  email: text("email"),
  displayName: text("display_name"),
  phoneNumber: text("phone_number"),
  expoPushToken: text("expo_push_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Venues table
export const venues = pgTable("venues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull().default("Lahore"),
  description: text("description"),
  imageUrl: text("image_url"),
  verified: boolean("verified").notNull().default(false),
  partnerId: varchar("partner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fields table (attached to venues)
export const fields = pgTable("fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id").notNull().references(() => venues.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sport: sportEnum("sport").notNull(),
  pricePerHourPkr: integer("price_per_hour_pkr").notNull(),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Slots table (time slots for field bookings)
export const slots = pgTable("slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").notNull().references(() => fields.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  availableForBooking: boolean("available_for_booking").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bookings table (field reservations)
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  slotId: varchar("slot_id").notNull().references(() => slots.id),
  status: bookingStatusEnum("status").notNull().default("pending"),
  amountPkr: integer("amount_pkr").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payments table (for bookings and games)
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingId: varchar("booking_id").references(() => bookings.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  amountPkr: integer("amount_pkr").notNull(),
  provider: text("provider").notNull().default("mock"),
  providerRef: text("provider_ref"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  idempotencyKey: text("idempotency_key").unique(),
  redirectUrl: text("redirect_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payouts table (for venues)
export const payouts = pgTable("payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id").notNull().references(() => venues.id),
  amountPkr: integer("amount_pkr").notNull(),
  status: text("status").notNull().default("pending"),
  payoutDate: timestamp("payout_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Games table (pickup games)
export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").notNull().references(() => users.id),
  fieldId: varchar("field_id").notNull().references(() => fields.id),
  sport: sportEnum("sport").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  minPlayers: integer("min_players").notNull(),
  maxPlayers: integer("max_players").notNull(),
  pricePerPlayerPkr: integer("price_per_player_pkr").notNull(),
  status: gameStatusEnum("status").notNull().default("open"),
  currentPlayers: integer("current_players").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// GamePlayers table (players who joined a game)
export const gamePlayers = pgTable("game_players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull().references(() => games.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  isHost: boolean("is_host").notNull().default(false),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// GamePayments table (payments for joining games)
export const gamePayments = pgTable("game_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id").notNull().references(() => games.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  amountPkr: integer("amount_pkr").notNull(),
  provider: text("provider").notNull().default("mock"),
  providerRef: text("provider_ref"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  idempotencyKey: text("idempotency_key").unique(),
  redirectUrl: text("redirect_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Refunds table
export const refunds = pgTable("refunds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: varchar("payment_id").references(() => payments.id),
  gamePaymentId: varchar("game_payment_id").references(() => gamePayments.id),
  amountPkr: integer("amount_pkr").notNull(),
  reason: text("reason").notNull(),
  status: paymentStatusEnum("status").notNull().default("pending"),
  providerRef: text("provider_ref"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leagues/Seasons table
export const seasons = pgTable("seasons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sport: sportEnum("sport").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  organizerId: varchar("organizer_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Teams table
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seasonId: varchar("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  captainId: varchar("captain_id").notNull().references(() => users.id),
  logoUrl: text("logo_url"),
  played: integer("played").notNull().default(0),
  won: integer("won").notNull().default(0),
  drawn: integer("drawn").notNull().default(0),
  lost: integer("lost").notNull().default(0),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fixtures table
export const fixtures = pgTable("fixtures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seasonId: varchar("season_id").notNull().references(() => seasons.id, { onDelete: "cascade" }),
  homeTeamId: varchar("home_team_id").notNull().references(() => teams.id),
  awayTeamId: varchar("away_team_id").notNull().references(() => teams.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  venueId: varchar("venue_id").references(() => venues.id),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payment Events table (for idempotency)
export const paymentEvents = pgTable("payment_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // e.g., 'payment.succeeded', 'payment.failed'
  payload: text("payload").notNull(), // JSON string of the event payload
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"), // Null if not yet processed
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  payments: many(payments),
  hostedGames: many(games),
  gameParticipations: many(gamePlayers),
  gamePayments: many(gamePayments),
  organizedSeasons: many(seasons),
  captainedTeams: many(teams),
}));

export const venuesRelations = relations(venues, ({ one, many }) => ({
  partner: one(users, { fields: [venues.partnerId], references: [users.id] }),
  fields: many(fields),
  payouts: many(payouts),
  fixtures: many(fixtures),
}));

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  venue: one(venues, { fields: [fields.venueId], references: [venues.id] }),
  slots: many(slots),
  games: many(games),
}));

export const slotsRelations = relations(slots, ({ one, many }) => ({
  field: one(fields, { fields: [slots.fieldId], references: [fields.id] }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  slot: one(slots, { fields: [bookings.slotId], references: [slots.id] }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, { fields: [payments.bookingId], references: [bookings.id] }),
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  host: one(users, { fields: [games.hostId], references: [users.id] }),
  field: one(fields, { fields: [games.fieldId], references: [fields.id] }),
  players: many(gamePlayers),
  payments: many(gamePayments),
}));

export const gamePlayersRelations = relations(gamePlayers, ({ one }) => ({
  game: one(games, { fields: [gamePlayers.gameId], references: [games.id] }),
  user: one(users, { fields: [gamePlayers.userId], references: [users.id] }),
}));

export const gamePaymentsRelations = relations(gamePayments, ({ one }) => ({
  game: one(games, { fields: [gamePayments.gameId], references: [games.id] }),
  user: one(users, { fields: [gamePayments.userId], references: [users.id] }),
}));

export const seasonsRelations = relations(seasons, ({ one, many }) => ({
  organizer: one(users, { fields: [seasons.organizerId], references: [users.id] }),
  teams: many(teams),
  fixtures: many(fixtures),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  season: one(seasons, { fields: [teams.seasonId], references: [seasons.id] }),
  captain: one(users, { fields: [teams.captainId], references: [users.id] }),
  homeFixtures: many(fixtures, { relationName: "homeTeam" }),
  awayFixtures: many(fixtures, { relationName: "awayTeam" }),
}));

export const fixturesRelations = relations(fixtures, ({ one }) => ({
  season: one(seasons, { fields: [fixtures.seasonId], references: [seasons.id] }),
  homeTeam: one(teams, { fields: [fixtures.homeTeamId], references: [teams.id], relationName: "homeTeam" }),
  awayTeam: one(teams, { fields: [fixtures.awayTeamId], references: [teams.id], relationName: "awayTeam" }),
  venue: one(venues, { fields: [fixtures.venueId], references: [venues.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertVenueSchema = createInsertSchema(venues).omit({ id: true, createdAt: true });
export const insertFieldSchema = createInsertSchema(fields).omit({ id: true, createdAt: true });
export const insertSlotSchema = createInsertSchema(slots).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true, createdAt: true, currentPlayers: true });
export const insertGamePlayerSchema = createInsertSchema(gamePlayers).omit({ id: true, joinedAt: true });
export const insertGamePaymentSchema = createInsertSchema(gamePayments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRefundSchema = createInsertSchema(refunds).omit({ id: true, createdAt: true });
export const insertSeasonSchema = createInsertSchema(seasons).omit({ id: true, createdAt: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true, played: true, won: true, drawn: true, lost: true, points: true });
export const insertFixtureSchema = createInsertSchema(fixtures).omit({ id: true, createdAt: true });
export const insertPaymentEventSchema = createInsertSchema(paymentEvents).omit({ id: true, receivedAt: true, processedAt: true });

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Field = typeof fields.$inferSelect;
export type InsertField = z.infer<typeof insertFieldSchema>;
export type Slot = typeof slots.$inferSelect;
export type InsertSlot = z.infer<typeof insertSlotSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type GamePlayer = typeof gamePlayers.$inferSelect;
export type InsertGamePlayer = z.infer<typeof insertGamePlayerSchema>;
export type GamePayment = typeof gamePayments.$inferSelect;
export type InsertGamePayment = z.infer<typeof insertGamePaymentSchema>;
export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = z.infer<typeof insertRefundSchema>;
export type Season = typeof seasons.$inferSelect;
export type InsertSeason = z.infer<typeof insertSeasonSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Fixture = typeof fixtures.$inferSelect;
export type InsertFixture = z.infer<typeof insertFixtureSchema>;
export type PaymentEvent = typeof paymentEvents.$inferSelect;
export type InsertPaymentEvent = z.infer<typeof insertPaymentEventSchema>;

// Extended types with relations
export type GameWithDetails = Game & {
  field: Field & { venue: Venue };
  host: User;
  players: (GamePlayer & { user: User })[];
  _count?: { players: number };
};

export type BookingWithDetails = Booking & {
  slot: Slot & { field: Field & { venue: Venue } };
  user: User;
};

export type TeamStanding = Team & {
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
};
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);
export const gameStatusEnum = pgEnum("game_status", [
  "open",
  "confirmed",
  "filled",
  "cancelled",
  "completed",
]);
export const skillLevelEnum = pgEnum("skill_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const sports = pgTable("sports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firebaseUid: varchar("firebase_uid").notNull().unique(),
  email: text("email"),
  displayName: text("display_name"),
  phoneNumber: text("phone_number"),
  expoPushToken: text("expo_push_token"),
  skillLevel: skillLevelEnum("skill_level"),
  balancePkr: integer("balance_pkr").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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

export const fields = pgTable("fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id")
    .notNull()
    .references(() => venues.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sportId: varchar("sport_id").notNull().references(() => sports.id),
  pricePerHourPkr: integer("price_per_hour_pkr").notNull(),
  capacity: integer("capacity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const slots = pgTable("slots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id")
    .notNull()
    .references(() => fields.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  availableForBooking: boolean("available_for_booking")
    .notNull()
    .default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  slotId: varchar("slot_id").notNull().references(() => slots.id),
  status: bookingStatusEnum("status").notNull().default("pending"),
  amountPkr: integer("amount_pkr").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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

export const payouts = pgTable("payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id").notNull().references(() => venues.id),
  amountPkr: integer("amount_pkr").notNull(),
  status: text("status").notNull().default("pending"),
  payoutDate: timestamp("payout_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").notNull().references(() => users.id),
  fieldId: varchar("field_id").notNull().references(() => fields.id),
  sportId: varchar("sport_id").notNull().references(() => sports.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  minPlayers: integer("min_players").notNull(),
  maxPlayers: integer("max_players").notNull(),
  pricePerPlayerPkr: integer("price_per_player_pkr").notNull(),
  status: gameStatusEnum("status").notNull().default("open"),
  skillLevel: skillLevelEnum("skill_level"),
  currentPlayers: integer("current_players").notNull().default(1),
  waitlistCount: integer("waitlist_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameWaitlist = pgTable("game_waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const gamePlayers = pgTable("game_players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameId: varchar("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  isHost: boolean("is_host").notNull().default(false),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

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

export const walletPayments = pgTable("wallet_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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

export const blockedUsers = pgTable("blocked_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  blockedUserId: varchar("blocked_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const seasons = pgTable("seasons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sportId: varchar("sport_id").notNull().references(() => sports.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  organizerId: varchar("organizer_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seasonId: varchar("season_id")
    .notNull()
    .references(() => seasons.id, { onDelete: "cascade" }),
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

export const fixtures = pgTable("fixtures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seasonId: varchar("season_id")
    .notNull()
    .references(() => seasons.id, { onDelete: "cascade" }),
  homeTeamId: varchar("home_team_id")
    .notNull()
    .references(() => teams.id),
  awayTeamId: varchar("away_team_id")
    .notNull()
    .references(() => teams.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  homeScore: integer("home_score").default(0),
  awayScore: integer("away_score").default(0),
  status: text("status").notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const standings = pgTable("standings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seasonId: varchar("season_id")
    .notNull()
    .references(() => seasons.id, { onDelete: "cascade" }),
  teamId: varchar("team_id").notNull().references(() => teams.id),
  played: integer("played").notNull().default(0),
  won: integer("won").notNull().default(0),
  drawn: integer("drawn").notNull().default(0),
  lost: integer("lost").notNull().default(0),
  goalsFor: integer("goals_for").notNull().default(0),
  goalsAgainst: integer("goals_against").notNull().default(0),
  goalDifference: integer("goal_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations (kept minimal)
export const venuesRelations = relations(venues, ({ many }) => ({
  fields: many(fields),
}));

export const fieldsRelations = relations(fields, ({ one }) => ({
  venue: one(venues, { fields: [fields.venueId], references: [venues.id] }),
  sport: one(sports, { fields: [fields.sportId], references: [sports.id] }),
}));

// zod schemas for inserts
export const insertSportSchema = createInsertSchema(sports, {
  name: z.string().min(1),
});
export const insertUserSchema = createInsertSchema(users, {});
export const insertVenueSchema = createInsertSchema(venues, {});
export const insertFieldSchema = createInsertSchema(fields, {});
export const insertSlotSchema = createInsertSchema(slots, {});
export const insertBookingSchema = createInsertSchema(bookings, {});
export const insertPaymentSchema = createInsertSchema(payments, {});
export const insertPayoutSchema = createInsertSchema(payouts, {});
export const insertGameSchema = createInsertSchema(games, {});
export const insertGameWaitlistSchema = createInsertSchema(gameWaitlist, {});
export const insertGamePlayerSchema = createInsertSchema(gamePlayers, {});
export const insertGamePaymentSchema = createInsertSchema(gamePayments, {});
export const insertWalletPaymentSchema = createInsertSchema(walletPayments, {});
export const insertRefundSchema = createInsertSchema(refunds, {});
export const insertBlockedUserSchema = createInsertSchema(blockedUsers, {});
export const insertSeasonSchema = createInsertSchema(seasons, {});
export const insertTeamSchema = createInsertSchema(teams, {});
export const insertFixtureSchema = createInsertSchema(fixtures, {});
export const insertStandingSchema = createInsertSchema(standings, {});

// Inferred types
export type Sport = typeof sports.$inferSelect;
export type InsertSport = typeof sports.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Venue = typeof venues.$inferSelect;
export type InsertVenue = typeof venues.$inferInsert;
export type Field = typeof fields.$inferSelect;
export type InsertField = typeof fields.$inferInsert;
export type Slot = typeof slots.$inferSelect;
export type InsertSlot = typeof slots.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;
export type Payout = typeof payouts.$inferSelect;
export type InsertPayout = typeof payouts.$inferInsert;
export type Game = typeof games.$inferSelect;
export type InsertGame = typeof games.$inferInsert;
export type GameWaitlist = typeof gameWaitlist.$inferSelect;
export type InsertGameWaitlist = typeof gameWaitlist.$inferInsert;
export type GamePlayer = typeof gamePlayers.$inferSelect;
export type InsertGamePlayer = typeof gamePlayers.$inferInsert;
export type GamePayment = typeof gamePayments.$inferSelect;
export type InsertGamePayment = typeof gamePayments.$inferInsert;
export type WalletPayment = typeof walletPayments.$inferSelect;
export type InsertWalletPayment = typeof walletPayments.$inferInsert;
export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = typeof refunds.$inferInsert;
export type BlockedUser = typeof blockedUsers.$inferSelect;
export type InsertBlockedUser = typeof blockedUsers.$inferInsert;
export type Season = typeof seasons.$inferSelect;
export type InsertSeason = typeof seasons.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;
export type Fixture = typeof fixtures.$inferSelect;
export type InsertFixture = typeof fixtures.$inferInsert;
export type Standing = typeof standings.$inferSelect;
export type InsertStanding = typeof standings.$inferInsert;

// Convenience composite types
export type TeamStanding = Standing & { team?: Team };
export type GameWithDetails = Game & {
  host?: User | null;
  field?: (Field & { venue?: Venue | null }) | null;
  sport?: Sport | null;
  players?: GamePlayer[];
  waitlist?: GameWaitlist[];
  _count?: { players: number };
};


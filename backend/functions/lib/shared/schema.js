"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertStandingSchema = exports.insertFixtureSchema = exports.insertTeamSchema = exports.insertSeasonSchema = exports.insertBlockedUserSchema = exports.insertRefundSchema = exports.insertWalletPaymentSchema = exports.insertGamePaymentSchema = exports.insertGamePlayerSchema = exports.insertGameWaitlistSchema = exports.insertGameSchema = exports.insertPayoutSchema = exports.insertPaymentSchema = exports.insertBookingSchema = exports.insertSlotSchema = exports.insertFieldSchema = exports.insertVenueSchema = exports.insertUserSchema = exports.insertSportSchema = exports.fieldsRelations = exports.venuesRelations = exports.standings = exports.fixtures = exports.teams = exports.seasons = exports.blockedUsers = exports.refunds = exports.walletPayments = exports.gamePayments = exports.gamePlayers = exports.gameWaitlist = exports.games = exports.payouts = exports.payments = exports.bookings = exports.slots = exports.fields = exports.venues = exports.users = exports.sports = exports.skillLevelEnum = exports.gameStatusEnum = exports.paymentStatusEnum = exports.bookingStatusEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_2 = require("drizzle-orm");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
exports.bookingStatusEnum = (0, pg_core_1.pgEnum)("booking_status", [
    "pending",
    "confirmed",
    "cancelled",
]);
exports.paymentStatusEnum = (0, pg_core_1.pgEnum)("payment_status", [
    "pending",
    "succeeded",
    "failed",
    "refunded",
]);
exports.gameStatusEnum = (0, pg_core_1.pgEnum)("game_status", [
    "open",
    "confirmed",
    "filled",
    "cancelled",
    "completed",
]);
exports.skillLevelEnum = (0, pg_core_1.pgEnum)("skill_level", [
    "beginner",
    "intermediate",
    "advanced",
]);
exports.sports = (0, pg_core_1.pgTable)("sports", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull().unique(),
    description: (0, pg_core_1.text)("description"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    firebaseUid: (0, pg_core_1.varchar)("firebase_uid").notNull().unique(),
    email: (0, pg_core_1.text)("email"),
    displayName: (0, pg_core_1.text)("display_name"),
    phoneNumber: (0, pg_core_1.text)("phone_number"),
    expoPushToken: (0, pg_core_1.text)("expo_push_token"),
    skillLevel: (0, exports.skillLevelEnum)("skill_level"),
    balancePkr: (0, pg_core_1.integer)("balance_pkr").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.venues = (0, pg_core_1.pgTable)("venues", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    address: (0, pg_core_1.text)("address").notNull(),
    city: (0, pg_core_1.text)("city").notNull().default("Lahore"),
    description: (0, pg_core_1.text)("description"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    verified: (0, pg_core_1.boolean)("verified").notNull().default(false),
    partnerId: (0, pg_core_1.varchar)("partner_id").references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.fields = (0, pg_core_1.pgTable)("fields", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    venueId: (0, pg_core_1.varchar)("venue_id")
        .notNull()
        .references(() => exports.venues.id, { onDelete: "cascade" }),
    name: (0, pg_core_1.text)("name").notNull(),
    sportId: (0, pg_core_1.varchar)("sport_id").notNull().references(() => exports.sports.id),
    pricePerHourPkr: (0, pg_core_1.integer)("price_per_hour_pkr").notNull(),
    capacity: (0, pg_core_1.integer)("capacity"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.slots = (0, pg_core_1.pgTable)("slots", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    fieldId: (0, pg_core_1.varchar)("field_id")
        .notNull()
        .references(() => exports.fields.id, { onDelete: "cascade" }),
    startTime: (0, pg_core_1.timestamp)("start_time").notNull(),
    endTime: (0, pg_core_1.timestamp)("end_time").notNull(),
    availableForBooking: (0, pg_core_1.boolean)("available_for_booking")
        .notNull()
        .default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.bookings = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    slotId: (0, pg_core_1.varchar)("slot_id").notNull().references(() => exports.slots.id),
    status: (0, exports.bookingStatusEnum)("status").notNull().default("pending"),
    amountPkr: (0, pg_core_1.integer)("amount_pkr").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.payments = (0, pg_core_1.pgTable)("payments", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    bookingId: (0, pg_core_1.varchar)("booking_id").references(() => exports.bookings.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    amountPkr: (0, pg_core_1.integer)("amount_pkr").notNull(),
    provider: (0, pg_core_1.text)("provider").notNull().default("mock"),
    providerRef: (0, pg_core_1.text)("provider_ref"),
    status: (0, exports.paymentStatusEnum)("status").notNull().default("pending"),
    idempotencyKey: (0, pg_core_1.text)("idempotency_key").unique(),
    redirectUrl: (0, pg_core_1.text)("redirect_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.payouts = (0, pg_core_1.pgTable)("payouts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    venueId: (0, pg_core_1.varchar)("venue_id").notNull().references(() => exports.venues.id),
    amountPkr: (0, pg_core_1.integer)("amount_pkr").notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("pending"),
    payoutDate: (0, pg_core_1.timestamp)("payout_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.games = (0, pg_core_1.pgTable)("games", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    hostId: (0, pg_core_1.varchar)("host_id").notNull().references(() => exports.users.id),
    fieldId: (0, pg_core_1.varchar)("field_id").notNull().references(() => exports.fields.id),
    sportId: (0, pg_core_1.varchar)("sport_id").notNull().references(() => exports.sports.id),
    startTime: (0, pg_core_1.timestamp)("start_time").notNull(),
    endTime: (0, pg_core_1.timestamp)("end_time").notNull(),
    minPlayers: (0, pg_core_1.integer)("min_players").notNull(),
    maxPlayers: (0, pg_core_1.integer)("max_players").notNull(),
    pricePerPlayerPkr: (0, pg_core_1.integer)("price_per_player_pkr").notNull(),
    status: (0, exports.gameStatusEnum)("status").notNull().default("open"),
    skillLevel: (0, exports.skillLevelEnum)("skill_level"),
    currentPlayers: (0, pg_core_1.integer)("current_players").notNull().default(1),
    waitlistCount: (0, pg_core_1.integer)("waitlist_count").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.gameWaitlist = (0, pg_core_1.pgTable)("game_waitlist", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    gameId: (0, pg_core_1.varchar)("game_id")
        .notNull()
        .references(() => exports.games.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow().notNull(),
});
exports.gamePlayers = (0, pg_core_1.pgTable)("game_players", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    gameId: (0, pg_core_1.varchar)("game_id")
        .notNull()
        .references(() => exports.games.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    isHost: (0, pg_core_1.boolean)("is_host").notNull().default(false),
    joinedAt: (0, pg_core_1.timestamp)("joined_at").defaultNow().notNull(),
});
exports.gamePayments = (0, pg_core_1.pgTable)("game_payments", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    gameId: (0, pg_core_1.varchar)("game_id").notNull().references(() => exports.games.id),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    amountPkr: (0, pg_core_1.integer)("amount_pkr").notNull(),
    provider: (0, pg_core_1.text)("provider").notNull().default("mock"),
    providerRef: (0, pg_core_1.text)("provider_ref"),
    status: (0, exports.paymentStatusEnum)("status").notNull().default("pending"),
    idempotencyKey: (0, pg_core_1.text)("idempotency_key").unique(),
    redirectUrl: (0, pg_core_1.text)("redirect_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.walletPayments = (0, pg_core_1.pgTable)("wallet_payments", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    amountPkr: (0, pg_core_1.integer)("amount_pkr").notNull(),
    provider: (0, pg_core_1.text)("provider").notNull().default("mock"),
    providerRef: (0, pg_core_1.text)("provider_ref"),
    status: (0, exports.paymentStatusEnum)("status").notNull().default("pending"),
    idempotencyKey: (0, pg_core_1.text)("idempotency_key").unique(),
    redirectUrl: (0, pg_core_1.text)("redirect_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.refunds = (0, pg_core_1.pgTable)("refunds", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    paymentId: (0, pg_core_1.varchar)("payment_id").references(() => exports.payments.id),
    gamePaymentId: (0, pg_core_1.varchar)("game_payment_id").references(() => exports.gamePayments.id),
    amountPkr: (0, pg_core_1.integer)("amount_pkr").notNull(),
    reason: (0, pg_core_1.text)("reason").notNull(),
    status: (0, exports.paymentStatusEnum)("status").notNull().default("pending"),
    providerRef: (0, pg_core_1.text)("provider_ref"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.blockedUsers = (0, pg_core_1.pgTable)("blocked_users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    blockedUserId: (0, pg_core_1.varchar)("blocked_user_id").notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.seasons = (0, pg_core_1.pgTable)("seasons", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    sportId: (0, pg_core_1.varchar)("sport_id").notNull().references(() => exports.sports.id),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    organizerId: (0, pg_core_1.varchar)("organizer_id").notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.teams = (0, pg_core_1.pgTable)("teams", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    seasonId: (0, pg_core_1.varchar)("season_id")
        .notNull()
        .references(() => exports.seasons.id, { onDelete: "cascade" }),
    name: (0, pg_core_1.text)("name").notNull(),
    captainId: (0, pg_core_1.varchar)("captain_id").notNull().references(() => exports.users.id),
    logoUrl: (0, pg_core_1.text)("logo_url"),
    played: (0, pg_core_1.integer)("played").notNull().default(0),
    won: (0, pg_core_1.integer)("won").notNull().default(0),
    drawn: (0, pg_core_1.integer)("drawn").notNull().default(0),
    lost: (0, pg_core_1.integer)("lost").notNull().default(0),
    points: (0, pg_core_1.integer)("points").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.fixtures = (0, pg_core_1.pgTable)("fixtures", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    seasonId: (0, pg_core_1.varchar)("season_id")
        .notNull()
        .references(() => exports.seasons.id, { onDelete: "cascade" }),
    homeTeamId: (0, pg_core_1.varchar)("home_team_id")
        .notNull()
        .references(() => exports.teams.id),
    awayTeamId: (0, pg_core_1.varchar)("away_team_id")
        .notNull()
        .references(() => exports.teams.id),
    scheduledDate: (0, pg_core_1.timestamp)("scheduled_date").notNull(),
    homeScore: (0, pg_core_1.integer)("home_score").default(0),
    awayScore: (0, pg_core_1.integer)("away_score").default(0),
    status: (0, pg_core_1.text)("status").notNull().default("scheduled"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.standings = (0, pg_core_1.pgTable)("standings", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    seasonId: (0, pg_core_1.varchar)("season_id")
        .notNull()
        .references(() => exports.seasons.id, { onDelete: "cascade" }),
    teamId: (0, pg_core_1.varchar)("team_id").notNull().references(() => exports.teams.id),
    played: (0, pg_core_1.integer)("played").notNull().default(0),
    won: (0, pg_core_1.integer)("won").notNull().default(0),
    drawn: (0, pg_core_1.integer)("drawn").notNull().default(0),
    lost: (0, pg_core_1.integer)("lost").notNull().default(0),
    goalsFor: (0, pg_core_1.integer)("goals_for").notNull().default(0),
    goalsAgainst: (0, pg_core_1.integer)("goals_against").notNull().default(0),
    goalDifference: (0, pg_core_1.integer)("goal_difference").notNull().default(0),
    points: (0, pg_core_1.integer)("points").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// Relations (kept minimal)
exports.venuesRelations = (0, drizzle_orm_2.relations)(exports.venues, ({ many }) => ({
    fields: many(exports.fields),
}));
exports.fieldsRelations = (0, drizzle_orm_2.relations)(exports.fields, ({ one }) => ({
    venue: one(exports.venues, { fields: [exports.fields.venueId], references: [exports.venues.id] }),
    sport: one(exports.sports, { fields: [exports.fields.sportId], references: [exports.sports.id] }),
}));
// zod schemas for inserts
exports.insertSportSchema = (0, drizzle_zod_1.createInsertSchema)(exports.sports, {
    name: zod_1.z.string().min(1),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users, {});
exports.insertVenueSchema = (0, drizzle_zod_1.createInsertSchema)(exports.venues, {});
exports.insertFieldSchema = (0, drizzle_zod_1.createInsertSchema)(exports.fields, {});
exports.insertSlotSchema = (0, drizzle_zod_1.createInsertSchema)(exports.slots, {});
exports.insertBookingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.bookings, {});
exports.insertPaymentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.payments, {});
exports.insertPayoutSchema = (0, drizzle_zod_1.createInsertSchema)(exports.payouts, {});
exports.insertGameSchema = (0, drizzle_zod_1.createInsertSchema)(exports.games, {});
exports.insertGameWaitlistSchema = (0, drizzle_zod_1.createInsertSchema)(exports.gameWaitlist, {});
exports.insertGamePlayerSchema = (0, drizzle_zod_1.createInsertSchema)(exports.gamePlayers, {});
exports.insertGamePaymentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.gamePayments, {});
exports.insertWalletPaymentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.walletPayments, {});
exports.insertRefundSchema = (0, drizzle_zod_1.createInsertSchema)(exports.refunds, {});
exports.insertBlockedUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.blockedUsers, {});
exports.insertSeasonSchema = (0, drizzle_zod_1.createInsertSchema)(exports.seasons, {});
exports.insertTeamSchema = (0, drizzle_zod_1.createInsertSchema)(exports.teams, {});
exports.insertFixtureSchema = (0, drizzle_zod_1.createInsertSchema)(exports.fixtures, {});
exports.insertStandingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.standings, {});
//# sourceMappingURL=schema.js.map
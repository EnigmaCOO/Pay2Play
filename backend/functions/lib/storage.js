"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DbStorage = void 0;
const crypto_1 = require("crypto");
const db_js_1 = require("./db.js");
const drizzle_orm_1 = require("drizzle-orm");
const schema = __importStar(require("./shared/schema.js"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY', {
    apiVersion: '2025-10-29.clover',
});
class DbStorage {
    ensureDb() {
        if (!db_js_1.db) {
            throw new Error("Database client is not initialized");
        }
        return db_js_1.db;
    }
    // Sports
    async createSport(sport) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.sports).values(sport).returning();
        return created;
    }
    async getSport(id) {
        const db = this.ensureDb();
        const [sport] = await db.select().from(schema.sports).where((0, drizzle_orm_1.eq)(schema.sports.id, id));
        return sport;
    }
    async getSports() {
        const db = this.ensureDb();
        return db.select().from(schema.sports);
    }
    // Users
    async getUser(id) {
        const db = this.ensureDb();
        const [user] = await db.select().from(schema.users).where((0, drizzle_orm_1.eq)(schema.users.id, id));
        return user;
    }
    async getUserByFirebaseUid(firebaseUid) {
        const db = this.ensureDb();
        const [user] = await db.select().from(schema.users).where((0, drizzle_orm_1.eq)(schema.users.firebaseUid, firebaseUid));
        return user;
    }
    async createUser(user) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.users).values(user).returning();
        return created;
    }
    async updateUserPushToken(userId, expoPushToken) {
        const db = this.ensureDb();
        await db.update(schema.users).set({ expoPushToken }).where((0, drizzle_orm_1.eq)(schema.users.id, userId));
    }
    async updateUserSkillLevel(userId, skillLevel) {
        const db = this.ensureDb();
        await db.update(schema.users).set({ skillLevel }).where((0, drizzle_orm_1.eq)(schema.users.id, userId));
    }
    async blockUser(userId, blockedUserId) {
        const db = this.ensureDb();
        await db.insert(schema.blockedUsers).values({ userId, blockedUserId });
    }
    async unblockUser(userId, blockedUserId) {
        const db = this.ensureDb();
        await db.delete(schema.blockedUsers).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.blockedUsers.userId, userId), (0, drizzle_orm_1.eq)(schema.blockedUsers.blockedUserId, blockedUserId)));
    }
    async getBlockedUsers(userId) {
        const db = this.ensureDb();
        return db.select().from(schema.blockedUsers).where((0, drizzle_orm_1.eq)(schema.blockedUsers.userId, userId));
    }
    async getUserWalletBalance(userId) {
        const db = this.ensureDb();
        const [user] = await db.select({ balancePkr: schema.users.balancePkr }).from(schema.users).where((0, drizzle_orm_1.eq)(schema.users.id, userId));
        return (user === null || user === void 0 ? void 0 : user.balancePkr) || 0;
    }
    async updateUserWalletBalance(userId, amount) {
        const db = this.ensureDb();
        await db.update(schema.users).set({
            balancePkr: (0, drizzle_orm_1.sql) `${schema.users.balancePkr} + ${amount}`
        }).where((0, drizzle_orm_1.eq)(schema.users.id, userId));
    }
    // Venues
    async getVenues(verified, sportId) {
        const db = this.ensureDb();
        if (sportId) {
            const venuesWithSportFields = await db.select({ venue: schema.venues }).from(schema.venues)
                .innerJoin(schema.fields, (0, drizzle_orm_1.eq)(schema.venues.id, schema.fields.venueId))
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.fields.sportId, sportId), verified !== undefined ? (0, drizzle_orm_1.eq)(schema.venues.verified, verified) : undefined))
                .groupBy(schema.venues.id);
            return venuesWithSportFields.map(row => row.venue);
        }
        else if (verified !== undefined) {
            return db.select().from(schema.venues).where((0, drizzle_orm_1.eq)(schema.venues.verified, verified));
        }
        return db.select().from(schema.venues);
    }
    async getVenue(id) {
        const db = this.ensureDb();
        const [venue] = await db.select().from(schema.venues).where((0, drizzle_orm_1.eq)(schema.venues.id, id));
        return venue;
    }
    async createVenue(venue) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.venues).values(venue).returning();
        return created;
    }
    // Fields
    async getFieldsByVenue(venueId) {
        const db = this.ensureDb();
        return db.select().from(schema.fields).where((0, drizzle_orm_1.eq)(schema.fields.venueId, venueId));
    }
    async getField(id) {
        const db = this.ensureDb();
        const [field] = await db.select().from(schema.fields).where((0, drizzle_orm_1.eq)(schema.fields.id, id));
        return field;
    }
    async createField(field) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.fields).values(Object.assign(Object.assign({}, field), { sportId: field.sportId })).returning();
        return created;
    }
    // Slots
    async searchAvailableSlots(fieldId, startTime, endTime) {
        const db = this.ensureDb();
        return db.select().from(schema.slots).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.slots.fieldId, fieldId), (0, drizzle_orm_1.gte)(schema.slots.startTime, startTime), (0, drizzle_orm_1.lte)(schema.slots.endTime, endTime), (0, drizzle_orm_1.eq)(schema.slots.availableForBooking, true)));
    }
    async createSlot(slot) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.slots).values(slot).returning();
        return created;
    }
    async getSlot(id) {
        const db = this.ensureDb();
        const [slot] = await db.select().from(schema.slots).where((0, drizzle_orm_1.eq)(schema.slots.id, id));
        return slot;
    }
    // Bookings
    async createBooking(booking) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.bookings).values(booking).returning();
        return created;
    }
    async getUserBookings(userId) {
        const db = this.ensureDb();
        return db.select().from(schema.bookings).where((0, drizzle_orm_1.eq)(schema.bookings.userId, userId)).orderBy((0, drizzle_orm_1.desc)(schema.bookings.createdAt));
    }
    async getBooking(id) {
        const db = this.ensureDb();
        const [booking] = await db.select().from(schema.bookings).where((0, drizzle_orm_1.eq)(schema.bookings.id, id));
        return booking;
    }
    async updateBookingStatus(id, status) {
        const db = this.ensureDb();
        await db.update(schema.bookings).set({ status: status }).where((0, drizzle_orm_1.eq)(schema.bookings.id, id));
    }
    // Payments
    async createPayment(payment) {
        const db = this.ensureDb();
        let createdPayment;
        if (payment.provider === "stripe") {
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: payment.amountPkr * 100, // Amount in cents
                    currency: 'pkr',
                    metadata: { bookingId: payment.bookingId || '', userId: payment.userId },
                });
                const [created] = await db.insert(schema.payments).values(Object.assign(Object.assign({}, payment), { providerRef: paymentIntent.client_secret, status: "pending" })).returning();
                createdPayment = created;
            }
            catch (error) {
                console.error("Error creating Stripe Payment Intent:", error);
                throw new Error("Failed to create Stripe Payment Intent.");
            }
        }
        else {
            const [created] = await db.insert(schema.payments).values(payment).returning();
            createdPayment = created;
        }
        return createdPayment;
    }
    async getPayment(id) {
        const db = this.ensureDb();
        const [payment] = await db.select().from(schema.payments).where((0, drizzle_orm_1.eq)(schema.payments.id, id));
        return payment;
    }
    async getPaymentByIdempotencyKey(key) {
        const db = this.ensureDb();
        const [payment] = await db.select().from(schema.payments).where((0, drizzle_orm_1.eq)(schema.payments.idempotencyKey, key));
        return payment;
    }
    async getPaymentByBookingId(bookingId) {
        const db = this.ensureDb();
        const [payment] = await db.select().from(schema.payments).where((0, drizzle_orm_1.eq)(schema.payments.bookingId, bookingId));
        return payment;
    }
    async updatePaymentStatus(id, status, providerRef) {
        const db = this.ensureDb();
        const updates = { status: status, updatedAt: new Date() };
        if (providerRef)
            updates.providerRef = providerRef;
        await db.update(schema.payments).set(updates).where((0, drizzle_orm_1.eq)(schema.payments.id, id));
    }
    // Games
    async createGame(game) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.games).values(Object.assign(Object.assign({}, game), { sportId: game.sportId })).returning();
        // Add host as first player
        await this.addGamePlayer({ gameId: created.id, userId: game.hostId, isHost: true });
        return created;
    }
    async getGames(userId, sportIdFilter, skillLevelFilter) {
        const db = this.ensureDb();
        const blockedUsers = await this.getBlockedUsers(userId);
        const blockedUserIds = blockedUsers.map(u => u.blockedUserId);
        const conditions = [];
        if (sportIdFilter) {
            conditions.push((0, drizzle_orm_1.eq)(schema.games.sportId, sportIdFilter));
        }
        if (skillLevelFilter) {
            conditions.push((0, drizzle_orm_1.eq)(schema.games.skillLevel, skillLevelFilter));
        }
        if (blockedUserIds.length > 0) {
            conditions.push((0, drizzle_orm_1.sql) `${schema.games.hostId} NOT IN ${blockedUserIds}`);
        }
        const query = db.query.games.findMany({
            where: (0, drizzle_orm_1.and)(...conditions),
            with: {
                field: {
                    with: { venue: true }
                },
                host: true,
                sport: true,
                players: {
                    with: { user: true }
                },
                waitlist: {
                    with: { user: true }
                }
            },
            orderBy: [(0, drizzle_orm_1.desc)(schema.games.createdAt)]
        });
        return query;
    }
    async getGame(id) {
        const db = this.ensureDb();
        const game = await db.query.games.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.games.id, id),
            with: {
                field: {
                    with: { venue: true }
                },
                host: true,
                sport: true,
                players: {
                    with: { user: true }
                },
                waitlist: {
                    with: { user: true }
                }
            }
        });
        return game;
    }
    async updateGameStatus(id, status) {
        const db = this.ensureDb();
        await db.update(schema.games).set({ status: status }).where((0, drizzle_orm_1.eq)(schema.games.id, id));
    }
    async incrementGamePlayers(id) {
        const db = this.ensureDb();
        await db.update(schema.games).set({
            currentPlayers: (0, drizzle_orm_1.sql) `${schema.games.currentPlayers} + 1`
        }).where((0, drizzle_orm_1.eq)(schema.games.id, id));
    }
    async getGamesNeedingCancellation(minutesBeforeStart) {
        const db = this.ensureDb();
        const threshold = new Date(Date.now() + minutesBeforeStart * 60 * 1000);
        return db.select().from(schema.games).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.games.status, "open"), (0, drizzle_orm_1.lte)(schema.games.startTime, threshold), (0, drizzle_orm_1.sql) `${schema.games.currentPlayers} < ${schema.games.minPlayers}`));
    }
    // Game Players
    async addGamePlayer(gamePlayer) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.gamePlayers).values(gamePlayer).returning();
        return created;
    }
    async getGamePlayers(gameId) {
        const db = this.ensureDb();
        return db.select().from(schema.gamePlayers).where((0, drizzle_orm_1.eq)(schema.gamePlayers.gameId, gameId));
    }
    async removeGamePlayer(gameId, userId) {
        const db = this.ensureDb();
        await db.delete(schema.gamePlayers).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.gamePlayers.gameId, gameId), (0, drizzle_orm_1.eq)(schema.gamePlayers.userId, userId)));
    }
    async decrementGamePlayers(id) {
        const db = this.ensureDb();
        await db.update(schema.games).set({
            currentPlayers: (0, drizzle_orm_1.sql) `${schema.games.currentPlayers} - 1`
        }).where((0, drizzle_orm_1.eq)(schema.games.id, id));
    }
    // Game Waitlist
    async addUserToGameWaitlist(gameId, userId) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.gameWaitlist).values({ gameId, userId }).returning();
        await this.incrementGameWaitlistCount(gameId);
        return created;
    }
    async removeUserFromGameWaitlist(gameId, userId) {
        const db = this.ensureDb();
        await db.delete(schema.gameWaitlist).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.gameWaitlist.gameId, gameId), (0, drizzle_orm_1.eq)(schema.gameWaitlist.userId, userId)));
        await this.decrementGameWaitlistCount(gameId);
    }
    async getGameWaitlist(gameId) {
        const db = this.ensureDb();
        return db.select().from(schema.gameWaitlist).where((0, drizzle_orm_1.eq)(schema.gameWaitlist.gameId, gameId));
    }
    async incrementGameWaitlistCount(gameId) {
        const db = this.ensureDb();
        await db.update(schema.games).set({
            waitlistCount: (0, drizzle_orm_1.sql) `${schema.games.waitlistCount} + 1`
        }).where((0, drizzle_orm_1.eq)(schema.games.id, gameId));
    }
    async decrementGameWaitlistCount(gameId) {
        const db = this.ensureDb();
        await db.update(schema.games).set({
            waitlistCount: (0, drizzle_orm_1.sql) `${schema.games.waitlistCount} - 1`
        }).where((0, drizzle_orm_1.eq)(schema.games.id, gameId));
    }
    // Game Payments
    async createGamePayment(payment) {
        const db = this.ensureDb();
        let createdGamePayment;
        if (payment.provider === "stripe") {
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: payment.amountPkr * 100, // Amount in cents
                    currency: 'pkr',
                    metadata: { gameId: payment.gameId, userId: payment.userId },
                });
                const [created] = await db.insert(schema.gamePayments).values(Object.assign(Object.assign({}, payment), { providerRef: paymentIntent.client_secret, status: "pending" })).returning();
                createdGamePayment = created;
            }
            catch (error) {
                console.error("Error creating Stripe Payment Intent:", error);
                throw new Error("Failed to create Stripe Payment Intent.");
            }
        }
        else {
            const [created] = await db.insert(schema.gamePayments).values(payment).returning();
            createdGamePayment = created;
        }
        return createdGamePayment;
    }
    async getGamePayment(id) {
        const db = this.ensureDb();
        const [payment] = await db.select().from(schema.gamePayments).where((0, drizzle_orm_1.eq)(schema.gamePayments.id, id));
        return payment;
    }
    async getGamePaymentByIdempotencyKey(key) {
        const db = this.ensureDb();
        const [payment] = await db.select().from(schema.gamePayments).where((0, drizzle_orm_1.eq)(schema.gamePayments.idempotencyKey, key));
        return payment;
    }
    async updateGamePaymentStatus(id, status, providerRef) {
        const db = this.ensureDb();
        const updates = { status: status, updatedAt: new Date() };
        if (providerRef)
            updates.providerRef = providerRef;
        await db.update(schema.gamePayments).set(updates).where((0, drizzle_orm_1.eq)(schema.gamePayments.id, id));
    }
    // Wallet Payments
    async createWalletPayment(payment) {
        const db = this.ensureDb();
        let createdWalletPayment;
        if (payment.provider === "stripe") {
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: payment.amountPkr * 100, // Amount in cents
                    currency: 'pkr',
                    metadata: { userId: payment.userId, type: "wallet_topup" },
                });
                const [created] = await db.insert(schema.walletPayments).values(Object.assign(Object.assign({}, payment), { providerRef: paymentIntent.client_secret, status: "pending" })).returning();
                createdWalletPayment = created;
            }
            catch (error) {
                console.error("Error creating Stripe Payment Intent for wallet:", error);
                throw new Error("Failed to create Stripe Payment Intent for wallet.");
            }
        }
        else {
            const [created] = await db.insert(schema.walletPayments).values(payment).returning();
            createdWalletPayment = created;
        }
        return createdWalletPayment;
    }
    async getWalletPayment(id) {
        const db = this.ensureDb();
        const [payment] = await db.select().from(schema.walletPayments).where((0, drizzle_orm_1.eq)(schema.walletPayments.id, id));
        return payment;
    }
    async getWalletPaymentByIdempotencyKey(key) {
        const db = this.ensureDb();
        const [payment] = await db.select().from(schema.walletPayments).where((0, drizzle_orm_1.eq)(schema.walletPayments.idempotencyKey, key));
        return payment;
    }
    async updateWalletPaymentStatus(id, status, providerRef) {
        const db = this.ensureDb();
        const updates = { status: status, updatedAt: new Date() };
        if (providerRef)
            updates.providerRef = providerRef;
        await db.update(schema.walletPayments).set(updates).where((0, drizzle_orm_1.eq)(schema.walletPayments.id, id));
    }
    // Seasons
    async createSeason(season) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.seasons).values(Object.assign(Object.assign({}, season), { sportId: season.sportId })).returning();
        return created;
    }
    async getSeasons() {
        const db = this.ensureDb();
        return db.select().from(schema.seasons).orderBy((0, drizzle_orm_1.desc)(schema.seasons.startDate));
    }
    async getSeason(id) {
        const db = this.ensureDb();
        const [season] = await db.select().from(schema.seasons).where((0, drizzle_orm_1.eq)(schema.seasons.id, id));
        return season;
    }
    // Teams
    async createTeam(team) {
        const db = this.ensureDb();
        const [created] = await db.insert(schema.teams).values(team).returning();
        return created;
    }
    async getTeamsBySeason(seasonId) {
        const db = this.ensureDb();
        return db.select().from(schema.teams).where((0, drizzle_orm_1.eq)(schema.teams.seasonId, seasonId));
    }
    // Fixtures
    async createFixtures(fixtures) {
        const db = this.ensureDb();
        return db.insert(schema.fixtures).values(fixtures).returning();
    }
    async getFixturesBySeason(seasonId) {
        const db = this.ensureDb();
        return db.query.fixtures.findMany({
            where: (0, drizzle_orm_1.eq)(schema.fixtures.seasonId, seasonId),
            with: {
                homeTeam: true,
                awayTeam: true,
                venue: true
            },
            orderBy: [schema.fixtures.scheduledDate]
        });
    }
    async updateFixtureScore(id, homeScore, awayScore, status) {
        const db = this.ensureDb();
        await db.update(schema.fixtures).set({ homeScore, awayScore, status }).where((0, drizzle_orm_1.eq)(schema.fixtures.id, id));
    }
    // Standings
    async getStandings(seasonId) {
        const teams = await this.getTeamsBySeason(seasonId);
        return teams.map((team) => {
            var _a;
            return ({
                id: (0, crypto_1.randomUUID)(),
                teamId: team.id,
                seasonId: team.seasonId,
                createdAt: (_a = team.createdAt) !== null && _a !== void 0 ? _a : new Date(),
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                points: 0,
                team,
            });
        });
    }
    // Refunds
    async createRefund(refund) {
        const db = this.ensureDb();
        if (refund.paymentId) {
            const payment = await this.getPayment(refund.paymentId);
            if (payment && payment.provider === "stripe") {
                return this.createStripeRefund(payment.id, refund.amountPkr);
            }
        }
        // For other providers or game payments, use the existing logic
        const [created] = await db.insert(schema.refunds).values(refund).returning();
        return created;
    }
    async createStripeRefund(paymentId, amount) {
        const db = this.ensureDb();
        const payment = await this.getPayment(paymentId);
        if (!payment) {
            throw new Error("Payment not found.");
        }
        if (payment.provider !== "stripe") {
            throw new Error("Cannot create Stripe refund for non-Stripe payment.");
        }
        if (!payment.providerRef) {
            throw new Error("Missing providerRef for Stripe refund.");
        }
        try {
            const stripeRefund = await stripe.refunds.create({
                payment_intent: payment.providerRef, // Assuming providerRef holds the Payment Intent ID
                amount: amount * 100, // Amount in cents
            });
            const [created] = await db.insert(schema.refunds).values({
                paymentId: payment.id,
                amountPkr: amount,
                reason: "Stripe refund",
                status: "succeeded",
                providerRef: stripeRefund.id,
            }).returning();
            return created;
        }
        catch (error) {
            console.error("Error creating Stripe refund:", error);
            throw new Error("Failed to create Stripe refund.");
        }
    }
    async getUserById(userId) {
        return this.getUser(userId);
    }
    async getUpcomingGames(beforeTime) {
        const db = this.ensureDb();
        const now = new Date();
        return db.query.games.findMany({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema.games.startTime, now), (0, drizzle_orm_1.lte)(schema.games.startTime, beforeTime), 
            // Only process games that are still open or confirmed (not already cancelled/filled)
            (0, drizzle_orm_1.sql) `${schema.games.status} IN ('open', 'confirmed')`),
            with: {
                field: { with: { venue: true } },
                host: true,
                sport: true,
                players: {
                    with: { user: true }
                },
            },
        });
    }
    async getGamePaymentByUserAndGame(userId, gameId) {
        const db = this.ensureDb();
        const [payment] = await db.select()
            .from(schema.gamePayments)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.gamePayments.userId, userId), (0, drizzle_orm_1.eq)(schema.gamePayments.gameId, gameId)));
        return payment;
    }
    // Dashboard
    async getVenuesByPartner(partnerId) {
        const db = this.ensureDb();
        return db.select().from(schema.venues).where((0, drizzle_orm_1.eq)(schema.venues.partnerId, partnerId));
    }
    async getBookingsByVenue(venueId) {
        const db = this.ensureDb();
        return db.query.bookings.findMany({
            where: (bookings) => {
                return (0, drizzle_orm_1.sql) `EXISTS (
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
            orderBy: [(0, drizzle_orm_1.desc)(schema.bookings.createdAt)],
        });
    }
    async getPayoutsByVenue(venueId) {
        const db = this.ensureDb();
        return db.select().from(schema.payouts).where((0, drizzle_orm_1.eq)(schema.payouts.venueId, venueId));
    }
}
exports.DbStorage = DbStorage;
class InMemoryStorage {
    constructor() {
        this.users = [];
        this.venues = [];
        this.fields = [];
        this.slots = [];
        this.bookings = [];
        this.payments = [];
        this.games = [];
        this.gamePlayers = [];
        this.gameWaitlist = [];
        this.gamePayments = [];
        this.walletPayments = [];
        this.refunds = [];
        this.seasons = [];
        this.teams = [];
        this.fixtures = [];
        this.payouts = [];
        this.sports = [];
        this.blockedUsers = [];
        void this.seed();
    }
    clone(value) {
        return structuredClone(value);
    }
    async seed() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const user = await this.createUser({
            firebaseUid: "demo-user-123",
            email: "demo@pay2play.app",
            displayName: "Demo User",
            phoneNumber: "+92300123456",
        });
        const sports = await Promise.all([
            { name: "cricket", description: "Cricket is a bat-and-ball game played between two teams of eleven players on a field with a wicket at each end." },
            { name: "football", description: "Football, also known as soccer, is a team sport played with a spherical ball between two teams of 11 players." },
            { name: "futsal", description: "Futsal is a modified form of soccer played with five players per side on a smaller, typically indoor, field." },
            { name: "padel", description: "Padel is a racket sport typically played in doubles on an enclosed court a third the size of a tennis court." },
        ].map((sport) => this.createSport(sport)));
        const venues = await Promise.all([
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
        ].map((venue) => this.createVenue(venue)));
        const fieldSeeds = [
            { venueId: venues[0].id, name: "Cricket Ground A", sportId: ((_a = sports.find(s => s.name === "cricket")) === null || _a === void 0 ? void 0 : _a.id) || "", pricePerHourPkr: 3000, capacity: 22 },
            { venueId: venues[0].id, name: "Football Field 1", sportId: ((_b = sports.find(s => s.name === "football")) === null || _b === void 0 ? void 0 : _b.id) || "", pricePerHourPkr: 2500, capacity: 22 },
            { venueId: venues[1].id, name: "Futsal Court 1", sportId: ((_c = sports.find(s => s.name === "futsal")) === null || _c === void 0 ? void 0 : _c.id) || "", pricePerHourPkr: 2000, capacity: 10 },
            { venueId: venues[1].id, name: "Padel Court A", sportId: ((_d = sports.find(s => s.name === "padel")) === null || _d === void 0 ? void 0 : _d.id) || "", pricePerHourPkr: 1800, capacity: 4 },
            { venueId: venues[2].id, name: "Main Cricket Pitch", sportId: ((_e = sports.find(s => s.name === "cricket")) === null || _e === void 0 ? void 0 : _e.id) || "", pricePerHourPkr: 3500, capacity: 22 },
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
        const gameSeeds = [
            {
                hostId: user.id,
                fieldId: fields[1].id,
                sportId: ((_f = sports.find(s => s.name === "football")) === null || _f === void 0 ? void 0 : _f.id) || "",
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
                sportId: ((_g = sports.find(s => s.name === "futsal")) === null || _g === void 0 ? void 0 : _g.id) || "",
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
                sportId: ((_h = sports.find(s => s.name === "cricket")) === null || _h === void 0 ? void 0 : _h.id) || "",
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
            sportId: ((_j = sports.find(s => s.name === "cricket")) === null || _j === void 0 ? void 0 : _j.id) || "",
            startDate: new Date(now.getFullYear(), 2, 1),
            endDate: new Date(now.getFullYear(), 4, 31),
            organizerId: user.id,
        });
        await Promise.all(["Lahore Lions", "Karachi Kings", "Islamabad United", "Multan Sultans"].map((name) => this.createTeam({
            seasonId: season.id,
            name,
            captainId: user.id,
        })));
    }
    ensureDate(value) {
        return value instanceof Date ? value : new Date(value);
    }
    findVenue(venueId) {
        return this.venues.find((venue) => venue.id === venueId);
    }
    findField(fieldId) {
        return this.fields.find((field) => field.id === fieldId);
    }
    findSport(sportId) {
        return this.sports.find((sport) => sport.id === sportId);
    }
    toGameWithDetails(game) {
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
            .map((player) => (Object.assign(Object.assign({}, player), { user: this.users.find((user) => user.id === player.userId) })));
        const waitlist = this.gameWaitlist
            .filter((entry) => entry.gameId === game.id)
            .map((entry) => (Object.assign(Object.assign({}, entry), { user: this.users.find((user) => user.id === entry.userId) })));
        return Object.assign(Object.assign({}, game), { field: Object.assign(Object.assign({}, field), { venue: this.clone(venue) }), host: this.clone(host), sport: this.clone(sport), players: players.map((player) => this.clone(player)), waitlist: waitlist.map((entry) => this.clone(entry)), _count: { players: players.length } });
    }
    // Sports
    async createSport(sport) {
        var _a, _b;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            name: sport.name,
            description: (_a = sport.description) !== null && _a !== void 0 ? _a : null,
            imageUrl: (_b = sport.imageUrl) !== null && _b !== void 0 ? _b : null,
        };
        this.sports.push(created);
        return this.clone(created);
    }
    async getSport(id) {
        const sport = this.sports.find((item) => item.id === id);
        return sport ? this.clone(sport) : undefined;
    }
    async getSports() {
        return this.clone(this.sports);
    }
    async getUser(id) {
        const user = this.users.find((item) => item.id === id);
        return user ? this.clone(user) : undefined;
    }
    async getUserByFirebaseUid(firebaseUid) {
        const user = this.users.find((item) => item.firebaseUid === firebaseUid);
        return user ? this.clone(user) : undefined;
    }
    async createUser(user) {
        var _a, _b, _c, _d, _e, _f;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            expoPushToken: (_a = user.expoPushToken) !== null && _a !== void 0 ? _a : null,
            firebaseUid: user.firebaseUid,
            email: (_b = user.email) !== null && _b !== void 0 ? _b : null,
            displayName: (_c = user.displayName) !== null && _c !== void 0 ? _c : null,
            phoneNumber: (_d = user.phoneNumber) !== null && _d !== void 0 ? _d : null,
            skillLevel: (_e = user.skillLevel) !== null && _e !== void 0 ? _e : null,
            balancePkr: (_f = user.balancePkr) !== null && _f !== void 0 ? _f : 0,
        };
        this.users.push(created);
        return this.clone(created);
    }
    async updateUserPushToken(userId, expoPushToken) {
        const user = this.users.find((item) => item.id === userId);
        if (user) {
            user.expoPushToken = expoPushToken;
        }
    }
    async updateUserSkillLevel(userId, skillLevel) {
        const user = this.users.find((item) => item.id === userId);
        if (user) {
            user.skillLevel = skillLevel;
        }
    }
    async blockUser(userId, blockedUserId) {
        const created = {
            id: (0, crypto_1.randomUUID)(),
            userId,
            blockedUserId,
            createdAt: new Date(),
        };
        this.blockedUsers.push(created);
    }
    async unblockUser(userId, blockedUserId) {
        const index = this.blockedUsers.findIndex((item) => item.userId === userId && item.blockedUserId === blockedUserId);
        if (index !== -1) {
            this.blockedUsers.splice(index, 1);
        }
    }
    async getBlockedUsers(userId) {
        return this.clone(this.blockedUsers.filter((item) => item.userId === userId));
    }
    async getUserWalletBalance(userId) {
        const user = this.users.find((item) => item.id === userId);
        return (user === null || user === void 0 ? void 0 : user.balancePkr) || 0;
    }
    async updateUserWalletBalance(userId, amount) {
        var _a;
        const user = this.users.find((item) => item.id === userId);
        if (user) {
            user.balancePkr = ((_a = user.balancePkr) !== null && _a !== void 0 ? _a : 0) + amount;
        }
    }
    async getVenues(verified) {
        const venues = verified === undefined
            ? this.venues
            : this.venues.filter((venue) => venue.verified === verified);
        return this.clone(venues);
    }
    async getVenue(id) {
        const venue = this.venues.find((item) => item.id === id);
        return venue ? this.clone(venue) : undefined;
    }
    async createVenue(venue) {
        var _a, _b, _c, _d, _e;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            imageUrl: (_a = venue.imageUrl) !== null && _a !== void 0 ? _a : null,
            verified: (_b = venue.verified) !== null && _b !== void 0 ? _b : false,
            partnerId: (_c = venue.partnerId) !== null && _c !== void 0 ? _c : null,
            name: venue.name,
            address: venue.address,
            city: (_d = venue.city) !== null && _d !== void 0 ? _d : "Lahore",
            description: (_e = venue.description) !== null && _e !== void 0 ? _e : null,
        };
        this.venues.push(created);
        return this.clone(created);
    }
    async getFieldsByVenue(venueId) {
        const fields = this.fields.filter((field) => field.venueId === venueId);
        return this.clone(fields);
    }
    async getField(id) {
        const field = this.fields.find((item) => item.id === id);
        return field ? this.clone(field) : undefined;
    }
    async createField(field) {
        var _a;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            capacity: (_a = field.capacity) !== null && _a !== void 0 ? _a : null,
            venueId: field.venueId,
            name: field.name,
            sportId: field.sportId,
            pricePerHourPkr: field.pricePerHourPkr,
        };
        this.fields.push(created);
        return this.clone(created);
    }
    async searchAvailableSlots(fieldId, startTime, endTime) {
        const slots = this.slots.filter((slot) => slot.fieldId === fieldId &&
            this.ensureDate(slot.startTime) >= startTime &&
            this.ensureDate(slot.endTime) <= endTime &&
            slot.availableForBooking);
        return this.clone(slots);
    }
    async createSlot(slot) {
        var _a;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            fieldId: slot.fieldId,
            startTime: this.ensureDate(slot.startTime),
            endTime: this.ensureDate(slot.endTime),
            availableForBooking: (_a = slot.availableForBooking) !== null && _a !== void 0 ? _a : true,
        };
        this.slots.push(created);
        return this.clone(created);
    }
    async getSlot(id) {
        const slot = this.slots.find((item) => item.id === id);
        return slot ? this.clone(slot) : undefined;
    }
    async createBooking(booking) {
        var _a;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            userId: booking.userId,
            slotId: booking.slotId,
            status: (_a = booking.status) !== null && _a !== void 0 ? _a : "pending",
            amountPkr: booking.amountPkr,
        };
        this.bookings.push(created);
        return this.clone(created);
    }
    async getUserBookings(userId) {
        const bookings = this.bookings
            .filter((booking) => booking.userId === userId)
            .sort((a, b) => this.ensureDate(b.createdAt).getTime() - this.ensureDate(a.createdAt).getTime());
        return this.clone(bookings);
    }
    async getBooking(id) {
        const booking = this.bookings.find((item) => item.id === id);
        return booking ? this.clone(booking) : undefined;
    }
    async updateBookingStatus(id, status) {
        const booking = this.bookings.find((item) => item.id === id);
        if (booking) {
            booking.status = status;
        }
    }
    async createPayment(payment) {
        var _a, _b, _c, _d, _e, _f;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            bookingId: (_a = payment.bookingId) !== null && _a !== void 0 ? _a : null,
            userId: payment.userId,
            amountPkr: payment.amountPkr,
            provider: (_b = payment.provider) !== null && _b !== void 0 ? _b : "mock",
            providerRef: (_c = payment.providerRef) !== null && _c !== void 0 ? _c : null,
            status: (_d = payment.status) !== null && _d !== void 0 ? _d : "pending",
            idempotencyKey: (_e = payment.idempotencyKey) !== null && _e !== void 0 ? _e : null,
            redirectUrl: (_f = payment.redirectUrl) !== null && _f !== void 0 ? _f : null,
        };
        this.payments.push(created);
        return this.clone(created);
    }
    async getPayment(id) {
        const payment = this.payments.find((item) => item.id === id);
        return payment ? this.clone(payment) : undefined;
    }
    async getPaymentByIdempotencyKey(key) {
        const payment = this.payments.find((item) => item.idempotencyKey === key);
        return payment ? this.clone(payment) : undefined;
    }
    async getPaymentByBookingId(bookingId) {
        const payment = this.payments.find((item) => item.bookingId === bookingId);
        return payment ? this.clone(payment) : undefined;
    }
    async updatePaymentStatus(id, status, providerRef) {
        const payment = this.payments.find((item) => item.id === id);
        if (payment) {
            payment.status = status;
            payment.updatedAt = new Date();
            if (providerRef) {
                payment.providerRef = providerRef;
            }
        }
    }
    async createGame(game) {
        var _a;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            currentPlayers: 0,
            status: (_a = game.status) !== null && _a !== void 0 ? _a : "open",
            hostId: game.hostId,
            fieldId: game.fieldId,
            sportId: game.sportId,
            startTime: this.ensureDate(game.startTime),
            endTime: this.ensureDate(game.endTime),
            minPlayers: game.minPlayers,
            maxPlayers: game.maxPlayers,
            pricePerPlayerPkr: game.pricePerPlayerPkr,
        };
        this.games.push(created);
        await this.addGamePlayer({ gameId: created.id, userId: game.hostId, isHost: true });
        return this.clone(created);
    }
    async getGames(userId, sportIdFilter, skillLevelFilter) {
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
    async getGame(id) {
        const game = this.games.find((item) => item.id === id);
        return game ? this.clone(this.toGameWithDetails(game)) : undefined;
    }
    async updateGameStatus(id, status) {
        const game = this.games.find((item) => item.id === id);
        if (game) {
            game.status = status;
        }
    }
    async incrementGamePlayers(id) {
        var _a;
        const game = this.games.find((item) => item.id === id);
        if (game) {
            game.currentPlayers = ((_a = game.currentPlayers) !== null && _a !== void 0 ? _a : 0) + 1;
        }
    }
    async getGamesNeedingCancellation(minutesBeforeStart) {
        const threshold = new Date(Date.now() + minutesBeforeStart * 60 * 1000);
        const games = this.games.filter((game) => {
            var _a;
            return game.status === "open" &&
                this.ensureDate(game.startTime) <= threshold &&
                ((_a = game.currentPlayers) !== null && _a !== void 0 ? _a : 0) < game.minPlayers;
        });
        return this.clone(games);
    }
    async getUpcomingGames(beforeTime) {
        const now = new Date();
        const games = this.games.filter((game) => {
            const start = this.ensureDate(game.startTime);
            return start >= now && start <= beforeTime && ["open", "confirmed"].includes(game.status);
        });
        return games.map((game) => this.clone(this.toGameWithDetails(game)));
    }
    async addGamePlayer(gamePlayer) {
        var _a, _b;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            joinedAt: new Date(),
            gameId: gamePlayer.gameId,
            userId: gamePlayer.userId,
            isHost: (_a = gamePlayer.isHost) !== null && _a !== void 0 ? _a : false,
        };
        this.gamePlayers.push(created);
        const game = this.games.find((item) => item.id === created.gameId);
        if (game) {
            game.currentPlayers = ((_b = game.currentPlayers) !== null && _b !== void 0 ? _b : 0) + 1;
        }
        return this.clone(created);
    }
    async getGamePlayers(gameId) {
        const players = this.gamePlayers.filter((player) => player.gameId === gameId);
        return this.clone(players);
    }
    async removeGamePlayer(gameId, userId) {
        const index = this.gamePlayers.findIndex((item) => item.gameId === gameId && item.userId === userId);
        if (index !== -1) {
            this.gamePlayers.splice(index, 1);
        }
    }
    async decrementGamePlayers(id) {
        var _a;
        const game = this.games.find((item) => item.id === id);
        if (game) {
            game.currentPlayers = ((_a = game.currentPlayers) !== null && _a !== void 0 ? _a : 0) - 1;
        }
    }
    // Game Waitlist
    async addUserToGameWaitlist(gameId, userId) {
        const created = {
            id: (0, crypto_1.randomUUID)(),
            gameId,
            userId,
            joinedAt: new Date(),
        };
        this.gameWaitlist.push(created);
        await this.incrementGameWaitlistCount(gameId);
        return this.clone(created);
    }
    async removeUserFromGameWaitlist(gameId, userId) {
        const index = this.gameWaitlist.findIndex((item) => item.gameId === gameId && item.userId === userId);
        if (index !== -1) {
            this.gameWaitlist.splice(index, 1);
            await this.decrementGameWaitlistCount(gameId);
        }
    }
    async getGameWaitlist(gameId) {
        const waitlist = this.gameWaitlist.filter((item) => item.gameId === gameId);
        return this.clone(waitlist);
    }
    async incrementGameWaitlistCount(gameId) {
        var _a;
        const game = this.games.find((item) => item.id === gameId);
        if (game) {
            game.waitlistCount = ((_a = game.waitlistCount) !== null && _a !== void 0 ? _a : 0) + 1;
        }
    }
    async decrementGameWaitlistCount(gameId) {
        var _a;
        const game = this.games.find((item) => item.id === gameId);
        if (game) {
            game.waitlistCount = ((_a = game.waitlistCount) !== null && _a !== void 0 ? _a : 0) - 1;
        }
    }
    // Game Payments
    async createGamePayment(payment) {
        var _a, _b, _c, _d, _e;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            gameId: payment.gameId,
            userId: payment.userId,
            amountPkr: payment.amountPkr,
            provider: (_a = payment.provider) !== null && _a !== void 0 ? _a : "mock",
            providerRef: (_b = payment.providerRef) !== null && _b !== void 0 ? _b : null,
            status: (_c = payment.status) !== null && _c !== void 0 ? _c : "pending",
            idempotencyKey: (_d = payment.idempotencyKey) !== null && _d !== void 0 ? _d : null,
            redirectUrl: (_e = payment.redirectUrl) !== null && _e !== void 0 ? _e : null,
        };
        this.gamePayments.push(created);
        return this.clone(created);
    }
    async getGamePayment(id) {
        const payment = this.gamePayments.find((item) => item.id === id);
        return payment ? this.clone(payment) : undefined;
    }
    async getGamePaymentByIdempotencyKey(key) {
        const payment = this.gamePayments.find((item) => item.idempotencyKey === key);
        return payment ? this.clone(payment) : undefined;
    }
    async getGamePaymentByUserAndGame(userId, gameId) {
        const payment = this.gamePayments.find((item) => item.userId === userId && item.gameId === gameId);
        return payment ? this.clone(payment) : undefined;
    }
    async updateGamePaymentStatus(id, status, providerRef) {
        const payment = this.gamePayments.find((item) => item.id === id);
        if (payment) {
            payment.status = status;
            payment.updatedAt = new Date();
            if (providerRef) {
                payment.providerRef = providerRef;
            }
        }
    }
    // Wallet Payments
    async createWalletPayment(payment) {
        var _a, _b, _c, _d, _e;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: payment.userId,
            amountPkr: payment.amountPkr,
            provider: (_a = payment.provider) !== null && _a !== void 0 ? _a : "mock",
            providerRef: (_b = payment.providerRef) !== null && _b !== void 0 ? _b : null,
            status: (_c = payment.status) !== null && _c !== void 0 ? _c : "pending",
            idempotencyKey: (_d = payment.idempotencyKey) !== null && _d !== void 0 ? _d : null,
            redirectUrl: (_e = payment.redirectUrl) !== null && _e !== void 0 ? _e : null,
        };
        this.walletPayments.push(created);
        return this.clone(created);
    }
    async getWalletPayment(id) {
        const payment = this.walletPayments.find((item) => item.id === id);
        return payment ? this.clone(payment) : undefined;
    }
    async getWalletPaymentByIdempotencyKey(key) {
        const payment = this.walletPayments.find((item) => item.idempotencyKey === key);
        return payment ? this.clone(payment) : undefined;
    }
    async updateWalletPaymentStatus(id, status, providerRef) {
        const payment = this.walletPayments.find((item) => item.id === id);
        if (payment) {
            payment.status = status;
            payment.updatedAt = new Date();
            if (providerRef) {
                payment.providerRef = providerRef;
            }
        }
    }
    async createSeason(season) {
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            name: season.name,
            sportId: season.sportId,
            startDate: this.ensureDate(season.startDate),
            endDate: this.ensureDate(season.endDate),
            organizerId: season.organizerId,
        };
        this.seasons.push(created);
        return this.clone(created);
    }
    async getSeasons() {
        const seasons = this.seasons
            .slice()
            .sort((a, b) => this.ensureDate(b.startDate).getTime() - this.ensureDate(a.startDate).getTime());
        return this.clone(seasons);
    }
    async getSeason(id) {
        const season = this.seasons.find((item) => item.id === id);
        return season ? this.clone(season) : undefined;
    }
    async createTeam(team) {
        var _a;
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            seasonId: team.seasonId,
            name: team.name,
            captainId: team.captainId,
            logoUrl: (_a = team.logoUrl) !== null && _a !== void 0 ? _a : null,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            points: 0,
        };
        this.teams.push(created);
        return this.clone(created);
    }
    async getTeamsBySeason(seasonId) {
        const teams = this.teams.filter((team) => team.seasonId === seasonId);
        return this.clone(teams);
    }
    async createFixtures(fixtures) {
        const createdFixtures = fixtures.map((fixture) => {
            var _a, _b, _c;
            const created = {
                id: (0, crypto_1.randomUUID)(),
                createdAt: new Date(),
                seasonId: fixture.seasonId,
                homeTeamId: fixture.homeTeamId,
                awayTeamId: fixture.awayTeamId,
                scheduledDate: this.ensureDate(fixture.scheduledDate),
                homeScore: (_a = fixture.homeScore) !== null && _a !== void 0 ? _a : null,
                awayScore: (_b = fixture.awayScore) !== null && _b !== void 0 ? _b : null,
                status: (_c = fixture.status) !== null && _c !== void 0 ? _c : "scheduled",
            };
            this.fixtures.push(created);
            return created;
        });
        return this.clone(createdFixtures);
    }
    async getFixturesBySeason(seasonId) {
        const fixtures = this.fixtures
            .filter((fixture) => fixture.seasonId === seasonId)
            .sort((a, b) => this.ensureDate(a.scheduledDate).getTime() - this.ensureDate(b.scheduledDate).getTime())
            .map((fixture) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, fixture), { homeTeam: (_a = this.teams.find((team) => team.id === fixture.homeTeamId)) !== null && _a !== void 0 ? _a : null, awayTeam: (_b = this.teams.find((team) => team.id === fixture.awayTeamId)) !== null && _b !== void 0 ? _b : null }));
        });
        return this.clone(fixtures);
    }
    async updateFixtureScore(id, homeScore, awayScore, status) {
        const fixture = this.fixtures.find((item) => item.id === id);
        if (!fixture)
            return;
        fixture.homeScore = homeScore;
        fixture.awayScore = awayScore;
        fixture.status = status;
    }
    async getStandings(seasonId) {
        var _a, _b, _c, _d, _e, _f;
        const teams = this.teams.filter((team) => team.seasonId === seasonId);
        const standings = teams.map((team) => {
            var _a;
            return ({
                id: (0, crypto_1.randomUUID)(),
                teamId: team.id,
                seasonId: team.seasonId,
                createdAt: (_a = team.createdAt) !== null && _a !== void 0 ? _a : new Date(),
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                points: 0,
                team,
            });
        });
        const map = new Map();
        standings.forEach((team) => map.set(team.id, team));
        for (const fixture of this.fixtures.filter((item) => item.seasonId === seasonId && item.homeScore !== null && item.awayScore !== null)) {
            const home = map.get(fixture.homeTeamId);
            const away = map.get(fixture.awayTeamId);
            if (!home || !away)
                continue;
            const homeScore = (_a = fixture.homeScore) !== null && _a !== void 0 ? _a : 0;
            const awayScore = (_b = fixture.awayScore) !== null && _b !== void 0 ? _b : 0;
            home.goalsFor += homeScore;
            home.goalsAgainst += awayScore;
            home.goalDifference = ((_c = home.goalsFor) !== null && _c !== void 0 ? _c : 0) - ((_d = home.goalsAgainst) !== null && _d !== void 0 ? _d : 0);
            home.played += 1;
            away.goalsFor += awayScore;
            away.goalsAgainst += homeScore;
            away.goalDifference = ((_e = away.goalsFor) !== null && _e !== void 0 ? _e : 0) - ((_f = away.goalsAgainst) !== null && _f !== void 0 ? _f : 0);
            away.played += 1;
            if (homeScore > awayScore) {
                home.won += 1;
                home.points += 2;
                away.lost += 1;
            }
            else if (homeScore < awayScore) {
                away.won += 1;
                away.points += 2;
                home.lost += 1;
            }
            else {
                home.drawn += 1;
                away.drawn += 1;
                home.points += 1;
                away.points += 1;
            }
        }
        return this.clone(standings);
    }
    async createRefund(refund) {
        var _a, _b, _c, _d;
        if (refund.paymentId) {
            const payment = this.payments.find((p) => p.id === refund.paymentId);
            if (payment && payment.provider === "stripe") {
                return this.createStripeRefund(payment.id, refund.amountPkr);
            }
        }
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            paymentId: (_a = refund.paymentId) !== null && _a !== void 0 ? _a : null,
            gamePaymentId: (_b = refund.gamePaymentId) !== null && _b !== void 0 ? _b : null,
            amountPkr: refund.amountPkr,
            reason: refund.reason,
            status: (_c = refund.status) !== null && _c !== void 0 ? _c : "pending",
            providerRef: (_d = refund.providerRef) !== null && _d !== void 0 ? _d : null,
        };
        this.refunds.push(created);
        return this.clone(created);
    }
    async createStripeRefund(paymentId, amount) {
        const payment = this.payments.find((p) => p.id === paymentId);
        if (!payment) {
            throw new Error("Payment not found.");
        }
        if (payment.provider !== "stripe") {
            throw new Error("Cannot create Stripe refund for non-Stripe payment.");
        }
        const created = {
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date(),
            paymentId: payment.id,
            gamePaymentId: null,
            amountPkr: amount,
            reason: "Stripe refund",
            status: "succeeded",
            providerRef: `stripe_refund_${(0, crypto_1.randomUUID)()}`,
        };
        this.refunds.push(created);
        return this.clone(created);
    }
    async getUserById(userId) {
        return this.getUser(userId);
    }
    async getVenuesByPartner(partnerId) {
        const venues = this.venues.filter((venue) => venue.partnerId === partnerId);
        return this.clone(venues);
    }
    async getBookingsByVenue(venueId) {
        const fieldsForVenue = this.fields.filter((field) => field.venueId === venueId).map((field) => field.id);
        const slotsForVenue = this.slots.filter((slot) => fieldsForVenue.includes(slot.fieldId)).map((slot) => slot.id);
        const bookings = this.bookings
            .filter((booking) => slotsForVenue.includes(booking.slotId))
            .sort((a, b) => this.ensureDate(b.createdAt).getTime() - this.ensureDate(a.createdAt).getTime())
            .map((booking) => {
            var _a, _b;
            return (Object.assign(Object.assign({}, booking), { user: (_a = this.users.find((user) => user.id === booking.userId)) !== null && _a !== void 0 ? _a : null, slot: (_b = this.slots.find((slot) => slot.id === booking.slotId)) !== null && _b !== void 0 ? _b : null }));
        });
        return this.clone(bookings);
    }
    async getPayoutsByVenue(venueId) {
        const payouts = this.payouts.filter((payout) => payout.venueId === venueId);
        return this.clone(payouts);
    }
}
const storageInstance = db_js_1.db ? new DbStorage() : new InMemoryStorage();
exports.storage = storageInstance;
//# sourceMappingURL=storage.js.map
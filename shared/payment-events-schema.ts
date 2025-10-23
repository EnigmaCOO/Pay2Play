import { pgTable, text, timestamp, uuid, jsonb, index } from "drizzle-orm/pg-core";

export const paymentEvents = pgTable("payment_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: text("event_id").notNull().unique(),
  provider: text("provider").notNull(), // 'mock', 'paymob', etc.
  eventType: text("event_type").notNull(), // 'payment.succeeded', 'payment.failed'
  payload: jsonb("payload").notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  eventIdIdx: index("payment_events_event_id_idx").on(table.eventId),
  createdAtIdx: index("payment_events_created_at_idx").on(table.createdAt),
}));
/**
 * @fileoverview Defines the TypeScript interfaces for the Firestore data model.
 * This file is the single source of truth for the data structures used across
 * the Pay2Play platform, ensuring type safety between the backend (Cloud Functions)
 * and frontend applications.
 *
 * It's important to note that Firestore uses `Timestamp` for date/time fields,
 * which is different from the `Date` object used in the previous relational schema.
 */

import { Timestamp } from "firebase/firestore";

// ==============
// Enums
// ==============

export type UserRole = "player" | "venueAdmin" | "superAdmin";
export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";
export type NotificationType = "booking_confirmation" | "game_reminder" | "payment_receipt" | "new_promotion";

// ==============
// Core Collections
// ==============

/**
 * Represents a user in the system. The document ID should be the Firebase Auth UID.
 * /users/{userId}
 */
export interface User {
  id: string; // Firebase Auth UID
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  roles: UserRole[];
  skillLevel?: SkillLevel;
  expoPushToken?: string;
  createdAt: Timestamp;

  // Wallet and financial details
  balancePkr: number; // Stored in the smallest currency unit (paisa)
}

/**
 * Represents a sports venue.
 * /venues/{venueId}
 */
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  imageUrls: string[];
  verified: boolean;
  // The UID of the user who owns/manages this venue.
  ownerId: string;
  createdAt: Timestamp;
}

/**
 * Represents a specific field or court within a venue.
 * Stored as a subcollection of a venue.
 * /venues/{venueId}/fields/{fieldId}
 */
export interface Field {
  id:string;
  name: string;
  sport: "football" | "cricket" | "padel" | "tennis";
  pricePerHourPkr: number; // Stored in the smallest currency unit (paisa)
  capacity?: number;
  createdAt: Timestamp;
}

/**
 * Represents an available time slot for a field.
 * This can be generated on the fly or pre-created.
 * For this model, we'll assume they are queryable documents.
 * /slots/{slotId} - Can be queried by fieldId and startTime.
 */
export interface Slot {
  id: string;
  fieldId: string;
  venueId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  // This flag will be updated based on bookings.
  isBooked: boolean;
  // A reference to the booking that reserved this slot.
  bookingId?: string;
}

/**
 * Represents a booking made by a user for a specific slot.
 * /bookings/{bookingId}
 */
export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  fieldId: string;
  venueId: string;
  status: BookingStatus;
  amountPkr: number; // Stored in the smallest currency unit (paisa)
  createdAt: Timestamp;
  // Denormalized data for easier querying
  userDisplayName?: string;
  venueName?: string;
  fieldName?: string;
  slotStartTime?: Timestamp;
}

// ==============
// Financial Collections
// ==============

/**
 * Represents a payment transaction for a booking or other service.
 * /payments/{paymentId}
 */
export interface Payment {
  id: string;
  userId: string;
  bookingId?: string; // Link to a booking
  promotionId?: string; // Link to a promotion purchase
  amountPkr: number;
  provider: "stripe" | "easypaisa" | "jazzcash" | "wallet";
  providerRef?: string; // Reference from the payment provider
  status: PaymentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Represents a promotion or special offer created by a venue owner.
 * /promotions/{promotionId}
 */
export interface Promotion {
  id: string;
  venueId: string;
  title: string;
  description: string;
  discountPercentage: number;
  validFrom: Timestamp;
  validUntil: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
}

/**
 * Represents a pool of funds that a venue owner has paid for
 * to offer discounts to players.
 * /discountPools/{venueId}
 */
export interface DiscountPool {
  id: string; // Same as venueId
  venueId: string;
  balancePkr: number; // Current balance of the discount pool
  totalFundedPkr: number; // Lifetime total funded amount
  updatedAt: Timestamp;
}

// ==============
// User-Facing Collections
// ==============

/**
 * Represents a notification sent to a user.
 * Stored as a subcollection of a user.
 * /users/{userId}/notifications/{notificationId}
 */
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Timestamp;
  // Optional link to relevant data, e.g., a booking ID
  relatedEntityId?: string;
}
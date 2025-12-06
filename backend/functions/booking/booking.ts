import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Booking, Slot } from "@pay2play/types";
import { Timestamp } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Callable Cloud Function to retrieve available slots for a given field within a date range.
 */
export const getAvailableSlots = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in to view slots.");
  }

  const { fieldId, startDate, endDate } = data;
  if (!fieldId || !startDate || !endDate) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with 'fieldId', 'startDate', and 'endDate'."
    );
  }

  try {
    const startTimestamp = Timestamp.fromDate(new Date(startDate));
    const endTimestamp = Timestamp.fromDate(new Date(endDate));

    const slotsQuery = db.collection("slots")
      .where("fieldId", "==", fieldId)
      .where("isBooked", "==", false)
      .where("startTime", ">=", startTimestamp)
      .where("startTime", "<=", endTimestamp)
      .orderBy("startTime");

    const snapshot = await slotsQuery.get();
    const availableSlots = snapshot.docs.map(doc => doc.data() as Slot);

    return { success: true, slots: availableSlots };

  } catch (error) {
    functions.logger.error(`Error fetching available slots for field ${fieldId}:`, error);
    throw new functions.https.HttpsError("internal", "An unexpected error occurred while fetching slots.");
  }
});


/**
 * Callable Cloud Function to create a booking for a specific time slot.
 * Uses a Firestore transaction to ensure atomic updates.
 */
export const createBooking = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const { slotId } = data;
  if (!slotId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a 'slotId'."
    );
  }

  const userId = context.auth.uid;
  const slotRef = db.collection("slots").doc(slotId);
  const newBookingRef = db.collection("bookings").doc(); // Create a new booking with a random ID

  try {
    // 2. Run a Firestore Transaction
    const bookingId = await db.runTransaction(async (transaction) => {
      const slotDoc = await transaction.get(slotRef);

      if (!slotDoc.exists) {
        throw new functions.https.HttpsError("not-found", "The specified slot does not exist.");
      }

      const slotData = slotDoc.data() as Slot;

      // 3. Check Slot Availability
      if (slotData.isBooked) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "This slot has already been booked."
        );
      }
      
      const fieldRef = db.collection(`venues/${slotData.venueId}/fields`).doc(slotData.fieldId);
      const fieldDoc = await transaction.get(fieldRef);
      if (!fieldDoc.exists) {
        throw new functions.https.HttpsError("not-found", "The associated field does not exist.");
      }
      const fieldData = fieldDoc.data();

      // 4. Create New Booking Document
      const newBookingData: Booking = {
        id: newBookingRef.id,
        userId,
        slotId,
        fieldId: slotData.fieldId,
        venueId: slotData.venueId,
        status: "pending", // Pending until payment is confirmed
        amountPkr: fieldData?.pricePerHourPkr || 0,
        createdAt: Timestamp.now(),
        // Denormalized data
        slotStartTime: slotData.startTime,
      };
      transaction.set(newBookingRef, newBookingData);

      // 5. Update Slot Document
      transaction.update(slotRef, { isBooked: true, bookingId: newBookingRef.id });

      return newBookingRef.id;
    });

    functions.logger.info(`Booking ${bookingId} created successfully by user ${userId} for slot ${slotId}.`);
    return { success: true, bookingId: bookingId };

  } catch (error) {
    functions.logger.error(
      `Error creating booking for slot ${slotId} by user ${userId}:`,
      error
    );
    if (error instanceof functions.https.HttpsError) {
      throw error; // Re-throw HttpsError
    }
    throw new functions.https.HttpsError("internal", "An unexpected error occurred while creating the booking.");
  }
});

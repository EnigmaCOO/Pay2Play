import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Callable Cloud Function to create a payment intent for a booking.
 */
type BookingDoc = {
  id: string;
  userId: string;
  amountPkr: number;
  status: string;
};

type PaymentDoc = {
  id: string;
  userId: string;
  bookingId: string;
  amountPkr: number;
  provider: string;
  providerRef?: string;
  status: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};

export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in to make a payment.");
  }

  const { bookingId } = data;
  if (!bookingId) {
    throw new functions.https.HttpsError("invalid-argument", "A 'bookingId' is required.");
  }

  const userId = context.auth.uid;
  const bookingRef = db.collection("bookings").doc(bookingId);

  try {
    const bookingDoc = await bookingRef.get();
    if (!bookingDoc.exists) {
      throw new functions.https.HttpsError("not-found", "The specified booking does not exist.");
    }

    const bookingData = bookingDoc.data() as BookingDoc;

    // Verify the booking belongs to the authenticated user.
    if (bookingData.userId !== userId) {
      throw new functions.https.HttpsError("permission-denied", "You are not authorized to pay for this booking.");
    }

    // Verify the booking is in a state that allows payment.
    if (bookingData.status !== "pending") {
      throw new functions.https.HttpsError("failed-precondition", `Booking is not pending, its status is '${bookingData.status}'.`);
    }

    const amount = bookingData.amountPkr;

    // --- Placeholder for Stripe Payment Intent Creation ---
    // In a real implementation, you would call the Stripe API here.
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: amount, // Stripe expects the amount in the smallest currency unit
    //   currency: "pkr",
    //   metadata: { bookingId, userId },
    // });
    // const clientSecret = paymentIntent.client_secret;
    const clientSecret = `mock_secret_${bookingId}`; // Mock secret for now
    const mockPaymentIntentId = `pi_mock_${bookingId}`; // Mock ID
    // --- End of Placeholder ---

    // Create a corresponding Payment document in Firestore to track the transaction.
    const newPaymentRef = db.collection("payments").doc();
    const newPayment: PaymentDoc = {
      id: newPaymentRef.id,
      userId,
      bookingId,
      amountPkr: amount,
      provider: "stripe", // Assuming Stripe for this flow
      providerRef: mockPaymentIntentId, // Store the payment intent ID
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await newPaymentRef.set(newPayment);

    functions.logger.info(`Payment intent ${mockPaymentIntentId} created for booking ${bookingId} by user ${userId}.`);

    // Return the client secret to the frontend to complete the payment.
    return { success: true, clientSecret: clientSecret };

  } catch (error) {
    functions.logger.error(`Error creating payment intent for booking ${bookingId} by user ${userId}:`, error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError("internal", "An unexpected error occurred while creating the payment intent.");
  }
});

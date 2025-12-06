import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Booking, User, Notification as UserNotification } from "@pay2play/types";
import { Timestamp } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Note: To send push notifications, you would use a library like 'expo-server-sdk'.
// import { Expo } from "expo-server-sdk";
// const expo = new Expo();


/**
 * Firestore trigger that sends a notification when a booking is confirmed.
 */
export const onBookingConfirmed = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change, context) => {
    const bookingBefore = change.before.data() as Booking;
    const bookingAfter = change.after.data() as Booking;

    // Check if the booking status changed to 'confirmed'.
    if (bookingBefore.status === "pending" && bookingAfter.status === "confirmed") {
      const userId = bookingAfter.userId;
      const bookingId = context.params.bookingId;

      functions.logger.info(`Booking ${bookingId} confirmed for user ${userId}. Preparing notification.`);

      // 1. Create a Notification document in Firestore
      const notificationPayload: UserNotification = {
        id: db.collection("users").doc(userId).collection("notifications").doc().id,
        userId,
        type: "booking_confirmation",
        title: "Booking Confirmed!",
        body: `Your booking for ${bookingAfter.fieldName || 'a field'} at ${bookingAfter.venueName || 'a venue'} is confirmed.`,
        isRead: false,
        createdAt: Timestamp.now(),
        relatedEntityId: bookingId,
      };
      
      const notificationRef = db.collection(`users/${userId}/notifications`).doc(notificationPayload.id);
      await notificationRef.set(notificationPayload);
      
      // 2. Send a Push Notification
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data() as User;
        const expoPushToken = userData.expoPushToken;

        if (expoPushToken) {
          // --- Placeholder for Expo Push Notification ---
          // if (Expo.isExpoPushToken(expoPushToken)) {
          //   try {
          //     await expo.sendPushNotificationsAsync([{
          //       to: expoPushToken,
          //       sound: "default",
          //       title: notificationPayload.title,
          //       body: notificationPayload.body,
          //       data: { bookingId },
          //     }]);
          //     functions.logger.info(`Push notification sent to user ${userId} for booking ${bookingId}.`);
          //   } catch (error) {
          //     functions.logger.error(`Failed to send push notification to user ${userId}:`, error);
          //   }
          // }
          // --- End Placeholder ---
          functions.logger.info(`(Mock) Push notification payload for user ${userId}:`, {
            to: expoPushToken,
            title: notificationPayload.title,
            body: notificationPayload.body,
          });
        } else {
          functions.logger.warn(`User ${userId} does not have an Expo push token. Skipping push notification.`);
        }
      }
    }
  });
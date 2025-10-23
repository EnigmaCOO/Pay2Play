import { storage } from "./storage";
import { notificationService, notifications } from "./notifications";
import { db } from "./db";
import { games, bookings, paymentEvents } from "@shared/schema";
import { eq, and, lt } from "drizzle-orm";
import { sendPushNotification } from "./notifications";

const MINUTES_BEFORE_START = 30;
const AUTO_CANCEL_MINUTES = 60; // Cancel games with <2 players after 60 min
const MIN_PLAYERS = 2;
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // Run every 5 minutes
const INITIAL_DELAY_MS = 10 * 1000; // Wait 10 seconds on startup
const EVENT_RETENTION_DAYS = 14; // Keep payment events for 14 days


export async function checkAndCancelUnderfilledGames() {
  console.log("🔍 Checking for underfilled games...");

  try {
    const now = new Date();
    const threshold = new Date(now.getTime() + MINUTES_BEFORE_START * 60 * 1000);

    // Get all open or confirmed games starting within the threshold
    const upcomingGames = await storage.getUpcomingGames(threshold);

    for (const game of upcomingGames) {
      if (game.startTime <= threshold && game.currentPlayers < game.minPlayers) {
        console.log(`⚠️  Cancelling underfilled game ${game.id} (${game.currentPlayers}/${game.minPlayers} players)`);

        // Get all players who paid
        const gamePlayers = await storage.getGamePlayers(game.id);
        const payments = await Promise.all(
          gamePlayers.map(p => storage.getGamePaymentByUserAndGame(p.userId, game.id))
        );

        // Issue refunds for all successful payments
        for (const payment of payments) {
          if (payment && payment.status === 'succeeded') {
            // Create refund record
            const refund = await storage.createRefund({
              gamePaymentId: payment.id,
              amountPkr: payment.amountPkr,
              reason: `Game cancelled - minimum ${game.minPlayers} players not reached`,
              status: "succeeded", // Mock provider auto-succeeds
            });

            console.log(`💸 Refunded PKR ${payment.amountPkr} to user ${payment.userId}`);

            // Notify player about refund
            await notificationService.sendToUser(
              payment.userId,
              notifications.refundIssued(payment.amountPkr)
            );
          }
        }

        // Update game status to cancelled
        await storage.updateGameStatus(game.id, 'cancelled');

        // Notify all players about cancellation
        const playerIds = gamePlayers.map(p => p.userId);
        if (playerIds.length > 0) {
          await notificationService.sendToMultipleUsers(
            playerIds,
            notifications.gameCancelled(
              game.sport,
              `Only ${game.currentPlayers}/${game.minPlayers} players joined`
            )
          );
        }

        // Also notify host
        await notificationService.sendToUser(
          game.hostId,
          notifications.gameCancelled(
            game.sport,
            `Only ${game.currentPlayers}/${game.minPlayers} players joined`
          )
        );
      }
    }

    console.log("✅ Auto-cancel check complete");
  } catch (error) {
    console.error("❌ Auto-cancel check failed:", error);
  }
}

async function cleanupOldPaymentEvents() {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - EVENT_RETENTION_DAYS);

    const deleted = await db
      .delete(paymentEvents)
      .where(lt(paymentEvents.createdAt, cutoffDate));

    console.log(`🧹 Cleaned up old payment events (older than ${EVENT_RETENTION_DAYS} days)`);
  } catch (error) {
    console.error("❌ Error cleaning up payment events:", error);
  }
}

// Run every 5 minutes
export function startAutoCancelScheduler() {
  console.log(
    `🕐 Starting auto-cancel scheduler (runs every ${CHECK_INTERVAL_MS / 60000} minutes, first run in ${INITIAL_DELAY_MS / 1000} seconds)`
  );

  setTimeout(() => {
    checkAndCancelUnderfilledGames();
    cleanupOldPaymentEvents();
    setInterval(() => {
      checkAndCancelUnderfilledGames();
      cleanupOldPaymentEvents();
    }, CHECK_INTERVAL_MS);
  }, INITIAL_DELAY_MS);
}
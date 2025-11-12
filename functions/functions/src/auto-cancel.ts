import { storage } from "./storage";
import { notificationService, notifications } from "./notifications";

const MINUTES_BEFORE_START = 30;

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
            await storage.createRefund({
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

// Run every 5 minutes
export function startAutoCancelScheduler() {
  const FIVE_MINUTES = 5 * 60 * 1000;
  const STARTUP_DELAY = 10 * 1000; // 10 seconds
  
  console.log("🕐 Starting auto-cancel scheduler (runs every 5 minutes, first run in 10 seconds)");
  
  // Delay initial run to allow server to fully start
  setTimeout(() => {
    checkAndCancelUnderfilledGames();
    // Then run every 5 minutes
    setInterval(checkAndCancelUnderfilledGames, FIVE_MINUTES);
  }, STARTUP_DELAY);
}

class MockNotificationService {
    async sendToUser(userId, notification) {
        console.log(`📱 [MOCK] Push notification to user ${userId}:`, notification);
    }
    async sendToMultipleUsers(userIds, notification) {
        console.log(`📱 [MOCK] Push notification to ${userIds.length} users:`, notification);
    }
}
// TODO: Implement ExpoNotificationService once expo-server-sdk is installable
// class ExpoNotificationService implements NotificationService {
//   private expo: Expo;
//   
//   constructor() {
//     this.expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
//   }
//   
//   async sendToUser(userId: string, notification: PushNotification): Promise<void> {
//     const user = await storage.getUserById(userId);
//     if (!user?.pushToken) return;
//     
//     if (!Expo.isExpoPushToken(user.pushToken)) {
//       console.error(`Invalid push token for user ${userId}`);
//       return;
//     }
//     
//     await this.expo.sendPushNotificationsAsync([{
//       to: user.pushToken,
//       title: notification.title,
//       body: notification.body,
//       data: notification.data,
//     }]);
//   }
//   
//   async sendToMultipleUsers(userIds: string[], notification: PushNotification): Promise<void> {
//     const users = await Promise.all(userIds.map(id => storage.getUserById(id)));
//     const validTokens = users
//       .filter(u => u?.pushToken && Expo.isExpoPushToken(u.pushToken))
//       .map(u => u!.pushToken!);
//     
//     if (validTokens.length === 0) return;
//     
//     const messages = validTokens.map(token => ({
//       to: token,
//       title: notification.title,
//       body: notification.body,
//       data: notification.data,
//     }));
//     
//     const chunks = this.expo.chunkPushNotifications(messages);
//     for (const chunk of chunks) {
//       await this.expo.sendPushNotificationsAsync(chunk);
//     }
//   }
// }
// Use mock service until expo-server-sdk can be installed
export const notificationService = new MockNotificationService();
// Notification templates
export const notifications = {
    gameJoined: (gameSport, playerCount, maxPlayers) => ({
        title: `Player Joined Your ${gameSport} Game!`,
        body: `${playerCount}/${maxPlayers} players confirmed. Game filling up!`,
        data: { type: "game_joined" },
    }),
    gameFull: (gameSport) => ({
        title: `Game Full!`,
        body: `Your ${gameSport} game is now full. Get ready to play!`,
        data: { type: "game_full" },
    }),
    gameCancelled: (gameSport, reason) => ({
        title: `Game Cancelled`,
        body: `Your ${gameSport} game was cancelled: ${reason}. Full refund issued.`,
        data: { type: "game_cancelled" },
    }),
    gameReminder: (gameSport, minutesUntilStart) => ({
        title: `Game Starting Soon!`,
        body: `Your ${gameSport} game starts in ${minutesUntilStart} minutes. See you there!`,
        data: { type: "game_reminder" },
    }),
    paymentSuccess: (amount) => ({
        title: `Payment Confirmed`,
        body: `Your payment of PKR ${amount} was successful. You're all set!`,
        data: { type: "payment_success" },
    }),
    refundIssued: (amount) => ({
        title: `Refund Processed`,
        body: `PKR ${amount} has been refunded to your account.`,
        data: { type: "refund_issued" },
    }),
    walletTopUpSuccess: (amount) => ({
        title: `Wallet Top-Up Successful`,
        body: `Your wallet has been topped up with PKR ${amount}.`,
        data: { type: "wallet_top_up_success" },
    }),
    waitlistSpotOpen: (gameId, token) => ({
        title: "A spot has opened up!",
        body: "A spot has opened up in a game you're on the waitlist for. Join now!",
        data: { type: "waitlist_spot_open", gameId, token },
    }),
};
//# sourceMappingURL=notifications.js.map
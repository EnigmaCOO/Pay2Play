
# P2P – Dev Walkthrough (OTP + Bookings + Payments + Games + Leagues)

## 1) Secrets (Replit)
- DATABASE_URL, FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
- PROVIDER_WEBHOOK_SECRET (for signing payloads to /payments and /game-pay webhooks)
- Optional SMS: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM

## 2) Migrate & Seed
```bash
pnpm prisma migrate dev
pnpm prisma generate
pnpm ts-node scripts/seed.ts
```

## 3) Run
```bash
pnpm dev
```

## 4) Postman
Import:
- P2P_Postman_Collection.json
- P2P_Postman_Env.json

Set `id_token` to a Firebase ID token from your mobile auth.
Set `base_url` to your API (Replit or local).

### Flow: Booking
1) Create slot via seed (already created).
2) POST /bookings (with id_token) to book the slot.
3) POST /payments/intent with { bookingId } → returns paymentId + redirectUrl.
4) Simulate success: POST /payments/webhook/mock with HMAC signature → payment `succeeded`.

### Flow: Games (Pay to Join)
1) POST /games (host) to create a game.
2) POST /game-pay/:gameId/intent (with id_token) → returns `gamePaymentId`.
3) Simulate success: POST /game-pay/webhook-game/mock → adds player, may flip game to `filled` and pushes notifications.

### Flow: Leagues
1) POST /leagues/season
2) POST /leagues/season/:id/team (repeat)
3) POST /leagues/season/:id/fixtures → generates round-robin.
4) GET /leagues/season/:id/standings

## 5) Push notifications
- Open /debug/push-token on web, paste Expo token, it saves to /users/push-token.
- On game join/refund/cancel, push is sent to users.

## Useful Endpoints Reference
- /venues, /slots/search
- /bookings (POST), /bookings/me
- /payments/intent, /payments/webhook/:provider
- /games (POST), /games/search, /game-pay/:gameId/intent, /game-pay/webhook-game/:provider
- /leagues/season, /leagues/season/:id/team, /leagues/season/:id/fixtures, /leagues/season/:id/standings

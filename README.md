
# P2P (Pay 2 Play) — Unified Repo (All Modules Integrated)
Includes:
- OTP Authentication
- Booking Engine
- Payments + Payouts
- Pickup Games + Matchmaking
- Leagues + Fixtures
- Push Notifications + Refund Logic
- Venue Dashboard (Web)
- Postman Collection & Dev Walkthrough

## Run (Replit)
1. Add secrets (DATABASE_URL, FIREBASE_*, PROVIDER_WEBHOOK_SECRET, TWILIO_* optional).
2. `pnpm i`
3. `pnpm prisma migrate dev`
4. `pnpm prisma generate`
5. `pnpm ts-node scripts/seed.ts`
6. `pnpm dev`

The API runs on port :3001, Web on :3000.
Use /debug/push-token to store Expo push tokens.

# NEXT Steps

This plan turns the Pay2Play Firebase/Expo architecture into focused, near-term execution steps to ship a Lahore-first sports booking MVP (player app, venue dashboard, and Firebase Functions backend).

## 1) Data Model & Security (Week 1)
- Finalize Firestore collections and indexes for `users`, `venues`, `fields`, `slots`, `bookings`, `payments`, `promotions`, `discountPools`, and `notifications`; document ownership and role semantics (player vs venueAdmin vs superAdmin).
- Implement Firestore security rules for authenticated reads, role-based writes, slot/booking atomicity, and promotion/discount accounting; add emulator test cases for common and abuse flows.
- Configure Firebase Auth (phone/email first) and profile creation hooks so every sign-in yields a synchronized profile document with role claims.

## 2) Backend Functions Enablement (Weeks 1–2)
- Stand up Cloud Functions modules per folder ownership:
  - `backend/functions/auth-profiles`: auth middleware, role claims, profile CRUD.
  - `backend/functions/booking`: availability lookup, atomic booking creation, lifecycle updates.
  - `backend/functions/payments-discounts`: payment intents, promo purchase, discount pool debits/credits, refunds.
  - `backend/functions/notifications`: booking/payment events → push/email; Expo/FCM token handling.
- Add structured logging, metrics, and budget alerts for function latency/errors and payment/discount anomalies.
- Migrate any remaining legacy Express endpoints to Functions parity, then retire the old code path after emulator regression passes.

## 3) Monorepo Foundations (Weeks 1–2)
- Create `packages/ui`, `packages/types`, and `packages/config` with shared ESLint/TSConfig/Vite presets; wire Husky to run `npm run lint`, `npm run test`, `npm run typecheck`, and `npm run build` pre-commit.
- Publish shared UI primitives (buttons, cards, list items, form controls) and booking/payments domain types to unblock apps and functions.
- Define environment configuration patterns (dev/staging/prod Firebase project IDs, API endpoints) in `packages/config` and document consumption examples.

## 4) Player App (Expo) Delivery (Weeks 2–4)
- Initialize the Expo app in `apps/player-app` with navigation, Firebase Auth integration, and Firestore hooks; ensure layouts adapt to iOS/Android/Web.
- Build discovery → venue detail → slot picker → booking confirmation flow; surface venue-funded discounts clearly ("You saved PKR X").
- Integrate booking and payment Cloud Functions (intent creation/confirmation) plus booking history and notifications (Expo push + Firestore listeners).

## 5) Venue Dashboard (Web) Delivery (Weeks 2–4)
- Bring up the web-first dashboard (Expo Web or React) in `apps/venue-dashboard` with admin auth and role checks.
- Implement venue/field CRUD, slot templates/exceptions, and a booking calendar view fed by Firestore queries and booking functions.
- Add promotion purchase UI tied to `payments-discounts` functions and revenue/discount pool widgets.

## 6) AI Foundations (Weeks 4–5)
- Enable a minimal Gemini/Genkit callable in `backend/functions/ai` for FAQ-style assistance (booking, payments, venue setup) and document safety prompts.
- Optionally surface a lightweight in-app FAQ chat entry point in the player app; log interactions for monitoring and guardrails.

## 7) QA, Release, and Readiness (Ongoing)
- Add Vitest suites for functions (with emulators), Firestore rule sims, and client flows; keep CI green on `npm run lint`, `npm run test`, `npm run typecheck`, and `npm run build`.
- Document local dev in `DEVELOPMENT.md` (Expo start, Firebase emulators, environment setup) and maintain a CHANGELOG mapped to Action Plan items.
- Prepare release checklists in `qa-release/` (EAS builds, Firebase Hosting deploys, soft-launch criteria) and track known issues/rollbacks.

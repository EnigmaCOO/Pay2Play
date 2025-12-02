# AGENT: `apps/player-app/`

## Purpose

Own the **player-facing Expo application** that runs on:

- iOS
- Android
- Web (Expo Web → Firebase Hosting)

This app delivers the core promise:  
> A player can discover a venue, see real prices & discounts, and confirm a booking in **under 60 seconds**.

## Scope

- Expo React Native app code (mobile + web targets).
- Screens & navigation flows for players.
- Integration with Firebase Auth, Firestore, Cloud Functions, and Notifications.
- Optional AI assistant UI for FAQs and smart suggestions.

## Major Screens & Flows

- **Auth & Onboarding**
  - Phone/email login via Firebase Auth (OTP or passwordless).
  - Profile setup (name, preferred sports, location).
- **Home / Discovery**
  - List of venues with filters (sport, location, price, rating).
  - Highlight promoted venues and visible discounts.
- **Venue & Slot Selection**
  - Venue detail view (photos, amenities, availability).
  - Time-slot picker (calendar/time grid).
- **Booking & Payments**
  - Booking summary (price, discount, final amount).
  - Payment screen (integration with local gateways via Cloud Functions).
  - Booking confirmation + “Add to calendar” or “Share with team”.
- **Games & History**
  - My bookings.
  - Joined/hosted pickup games.
- **Notifications**
  - Booking confirmations, reminders, changes.
- **AI Assistant (MVP+)**
  - Simple chat/FAQ powered by `backend/functions/ai`.

## Key Responsibilities

1. **Implement MVP Booking UX**
   - Smooth search, filter, and booking flows.
   - Minimal friction: fewer screens, clear CTAs, visible discounts.

2. **Integrate with Backend**
   - Use Cloud Functions for:
     - Atomic booking creation.
     - Price/discount validation.
     - Payment intent creation & confirmation.
   - Subscribe to Firestore for updates (booking status, payments, notifications).

3. **Cross-Platform Quality**
   - Ensure layouts work on:
     - Small mobile screens.
     - Tablets.
     - Web via Expo web build.

4. **Analytics & Telemetry**
   - Emit events for:
     - Search, slot views, booking attempts, completed bookings, payment failures.

## To-Dos (from CSV Mapping)

- [ ] Implement venue listing screen with filters (sport, location).
- [ ] Implement venue detail screen (photos, description, pricing, ratings).
- [ ] Implement availability UI (calendar / time-slot picker).
- [ ] Implement booking creation flow (select slot, confirm participants, price).
- [ ] Integrate with booking Cloud Function for atomic booking.
- [ ] Show discounts clearly (e.g., “You saved PKR X”).
- [ ] Implement booking history & basic profile screen.
- [ ] Integrate push notifications (Expo + Firebase).

## Definition of Done

- Player can:
  - Sign in.
  - Discover venues.
  - Select a slot.
  - Pay (in supported modes).
  - Receive confirmation + notifications.
- All flows work on iOS, Android, and Web.
- All MVP booking engine, payments, auth, and notifications tasks that touch the app are implemented and tested.
- No critical UX blockers preventing real users from booking venue slots in Lahore.

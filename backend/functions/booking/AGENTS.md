# AGENT: `backend/functions/booking/`

## Purpose

Implement all **server-side booking logic** as Firebase Cloud Functions, ensuring:

- Atomic creation of bookings.
- Consistent handling of availability and pricing.
- Auditable and reliable booking lifecycle.

## Scope

- HTTP/callable Cloud Functions responsible for:
  - Searching venues/slots (with indexing via Firestore).
  - Validating slot availability.
  - Creating bookings atomically.
  - Updating booking status (confirmed, cancelled, completed).
- Firestore triggers for related booking workflows if needed.

## Key Responsibilities

1. **Atomic Booking Creation**
   - Accept booking requests from `apps/player-app`.
   - Validate:
     - Authenticated user.
     - Slot existence & availability.
     - Pricing & discount consistency with discount pool.
   - Write booking + any associated records in a single transaction.

2. **Slot & Availability Management**
   - Provide APIs to:
     - Fetch available slots per venue/field.
     - Respect venue-defined operating hours, blackout dates, existing bookings.

3. **Booking Lifecycle Updates**
   - Handle:
     - User cancellations (with policy checks).
     - Venue cancellations (with compensation logic).
     - Completion (for historical stats and payouts).

4. **Integration with Other Modules**
   - Trigger or call:
     - `backend/functions/payments-discounts` for payment intents & refund logic.
     - `backend/functions/notifications` for confirmations and reminders.
     - `backend/functions/ai` for potential scheduling/optimization in future phases.

## To-Dos (from CSV Mapping)

- [ ] Implement search & browse venues backend endpoints.
- [ ] Implement availability lookup API.
- [ ] Create Cloud Function to validate & write bookings atomically.
- [ ] Add endpoints to:
  - [ ] Cancel bookings.
  - [ ] Mark bookings as completed.
- [ ] Integrate booking events with notifications (confirmation/reminders).

## Definition of Done

- Booking-related CSV tasks are implemented as functions with:
  - Input validation.
  - Auth checks.
  - Firestore transactions.
- A comprehensive test suite (unit + integration) validates:
  - Successful booking.
  - Overbooking prevention.
  - Cancellations and lifecycle updates.
- App clients can rely on this module as the **single source of truth** for booking state.

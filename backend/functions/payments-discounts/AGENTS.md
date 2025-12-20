# AGENT: `backend/functions/payments-discounts/`

## Purpose

Handle **payments and the venue-funded discount model**:

- Connect to payment providers (Stripe/JazzCash/EasyPaisa).
- Manage the “promotion pool” and discount mechanics described in the business plan.
- Orchestrate refunds and future wallet/split-payments logic.

## Scope

- Cloud Functions for:
  - Creating and confirming payment intents.
  - Applying discount pool logic to bookings.
  - Handling webhooks from payment providers.
  - Updating booking/payment statuses.
- Firestore models for:
  - `payments`, `promotionPackages`, `discountPools`.

## Key Responsibilities

1. **Payment Integration**
   - Implement secure payment flows:
     - Create payment intent upon booking confirmation.
     - Confirm payment and record transaction IDs.
   - Manage payment status updates:
     - pending → succeeded/failed/refunded.

2. **Discount Pool Mechanics**
   - Implement venue-funded discount model:
     - Promotion purchases top up a discount pool.
     - Each booking at that venue consumes a portion of the pool to fund player discounts.
   - Ensure:
     - Accurate accounting.
     - Configurable allocation (e.g. 50–70% of promo fees go into discount pool).

3. **Promotion Packages**
   - APIs for:
     - Buying promotion packages.
     - Viewing remaining promotion/discount pool balances.
   - Integration with `apps/venue-dashboard` for admin UX.

4. **Refunds & Cancellations**
   - Implement refund logic:
     - When bookings are cancelled by user/venue within policies.
   - Sync with booking status changes from `backend/functions/booking`.

## To-Dos (from CSV Mapping)

- [ ] Implement initial payment flow with chosen provider(s).
- [ ] Implement discount pool calculations and decrements per booking.
- [ ] Expose API to show “You saved PKR X” to the player app.
- [ ] Implement venue promotion purchase flow.
- [ ] Implement refund logic on cancellation.
- [ ] Add reporting endpoints for venue revenue and discount usage.

## Definition of Done

- Real payment provider integrated in non-sandbox mode for production.
- Discount pool mechanics working end-to-end:
  - Venue buys promotion → pool topped up → bookings consume pool → players see savings.
- Refund + cancellation flows implemented and tested.
- Financial records and logs are sufficient for reconciliation with venues and internal reporting.

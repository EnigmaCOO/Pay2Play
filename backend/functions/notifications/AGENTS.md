# AGENT: `backend/functions/notifications/`

## Purpose

Provide a unified **notification engine** for Pay2Play:

- Booking confirmations and reminders.
- Admin alerts for new bookings/cancellations.
- Future marketing and retention campaigns.

## Scope

- Cloud Functions that:
  - Send push notifications (Expo + FCM).
  - Send transactional emails/SMS (optional, via providers).
- Notification templates and delivery logic.

## Key Responsibilities

1. **Notification Orchestration**
   - Trigger notifications from:
     - Booking events (created, updated, cancelled).
     - Payment events (succeeded, failed, refunded).
   - Handle both player and admin recipients.

2. **Push Notification Integration**
   - Store Expo push tokens and FCM tokens.
   - Implement functions to send push notifications reliably.

3. **Templates & Localization**
   - Standard templates for:
     - Booking confirmation.
     - Booking reminder.
     - Booking cancellation.
     - Venue new booking alert.
   - Keep text consistent with product copy.

4. **Failure Handling & Logging**
   - Track failed deliveries.
   - Provide dashboards/logs for debugging.

## To-Dos (from CSV Mapping)

- [ ] Implement notification sending on booking creation and confirmation.
- [ ] Implement reminder notifications before game time.
- [ ] Implement admin notifications for new bookings / cancellations.
- [ ] Integrate Expo push notifications with token registration via `apps/player-app`.
- [ ] Add monitoring for notification failures.

## Definition of Done

- All major flows (booking, cancellations, payments) produce appropriate notifications.
- Notification delivery is reliable with retries and clear error logging.
- Players and venue admins receive timely, relevant messages across supported channels.

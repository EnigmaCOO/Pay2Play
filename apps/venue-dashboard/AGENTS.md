# AGENT: `apps/venue-dashboard/`

## Purpose

Provide venue owners and managers a **web-first dashboard** (Expo web or React web) to:

- Manage venues, fields, and time slots.
- View bookings, revenue, and promotion performance.
- Adjust promotions and track discount usage.

## Scope

- Web app for venue admins (optimized for desktop).
- Admin authentication and role-based access.
- Calendar views and booking management tools.
- Revenue, payouts, and promotion analytics.

## Key Responsibilities

1. **Venue Setup & Management**
   - CRUD for:
     - Venue details (name, location, amenities, photos).
     - Fields (sport, price/hour, capacity).
     - Timeslot templates and exceptions.
   - Upload & manage venue images via Firebase Storage.

2. **Booking & Revenue Views**
   - Calendar of upcoming bookings by field.
   - Booking detail view (player, price, discount, status).
   - Revenue and payout summary views.

3. **Promotions & Discount Pool**
   - UI to purchase promotion packages.
   - UI to set discount levels and see current discount pool usage.
   - Expose ROI via metrics from `backend/functions/payments-discounts`.

4. **Notifications & Admin Alerts**
   - Show alerts for:
     - New bookings.
     - Cancellations.
     - Payment issues.

## To-Dos (from CSV Mapping)

- [ ] Design venue dashboard UI for:
  - [ ] Basic venue and field management.
  - [ ] Slot/availability management.
- [ ] Implement venue-side booking calendar.
- [ ] Implement revenue & discount pool analytics widgets.
- [ ] Integrate promotions purchase flow with payments backend.
- [ ] Implement admin notifications for new bookings / cancellations.

## Definition of Done

- Venue admin can:
  - Log in securely.
  - Configure venues, fields, and availability.
  - See bookings in a calendar and list form.
  - View revenue and payouts.
  - Manage promotions and see the impact of discount pools.
- The dashboard is usable on desktop browsers and integrates seamlessly with Firestore and Cloud Functions.

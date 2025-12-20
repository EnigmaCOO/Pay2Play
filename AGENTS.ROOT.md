# AGENT: `AGENTS.ROOT.md`

## Mission Summary

Pay2Play is a **B2B2C sports booking and discovery platform** for Pakistan, starting in Lahore.

- Players: discover and book **verified venues** in under 60 seconds, with visible, venue-funded **discounts**.
- Venues: pay for **promotion and tools** (dashboard, analytics, bookings), not for access to the platform itself.
- Platform: recycles a portion of promotion revenue into **discount pools**, creating a win–win loop:
  - Venues gain utilization and visibility.
  - Players pay less but play more.
  - Pay2Play captures recurring B2B revenue.

This repository is the **single monorepo** powering:

- The Expo player app (`apps/player-app`) for iOS, Android, and Web.
- The venue dashboard (`apps/venue-dashboard`) for venue admins.
- The Firebase Functions backend (`backend/functions/*`).
- Shared domain models, UI, and config (`shared/`).
- Architecture/infra definitions (`infra/`).
- Product docs (`product/`) and QA/release processes (`qa-release/`).

## Architecture Overview

### Client Layer

- **Expo React Native** for:
  - iOS and Android native apps.
  - Web build via Expo Web → deployed to Firebase Hosting.
- **Key responsibilities:**
  - Provide fast, intuitive UX for players and venue admins.
  - Integrate with Firebase Auth, Firestore, and Cloud Functions.
  - Display venue-funded discounts and booking outcomes clearly.

### Backend Layer (Firebase Functions + GCP)

- **Firebase Cloud Functions** organized under `backend/functions/`:
  - `booking/` – booking engine, availability, lifecycle.
  - `payments-discounts/` – payment integrations, discount pools, promotions.
  - `auth-profiles/` – auth checks, role management, profiles.
  - `notifications/` – push/email/SMS notifications.
  - `ai/` – Genkit/Vertex AI (Gemini) flows and assistants.

- **Data & Services:**
  - Firestore – primary store for users, venues, bookings, payments, promotions, discount pools, notifications.
  - Firebase Auth – identity for players and admins.
  - Firebase Storage – images and media.
  - Vertex AI / Genkit – AI assistants and future ML-powered insights.
  - Firebase Hosting – web hosting for Expo web builds and APIs (via rewrites to functions).

### Shared Layer

- `shared/`:
  - Domain models, validation schemas, and TypeScript types.
  - Cross-platform design system components and themes.
  - Config and utilities used by all apps and functions.

### Governance & Quality

- `product/` – product vision, PRDs, user stories, and mapping to the Action Plan CSV.
- `infra/` – architecture and environment setup, including IAM, rules, and local dev guidance.
- `qa-release/` – test strategy, test plans, E2E flows, and launch readiness.

## Relationship to CSV Action Plan

The **Pay2Play Action Plan CSV** is the canonical timeline and task breakdown. Its categories map to folders as follows:

- **Product & Strategy** → `product/`
- **Architecture & Infra** → `infra/`
- **MVP – Booking Engine** → `apps/player-app/`, `backend/functions/booking/`
- **MVP – Payments & Discounts** → `apps/player-app/`, `apps/venue-dashboard/`, `backend/functions/payments-discounts/`
- **MVP – Auth & Profiles** → `apps/player-app/`, `apps/venue-dashboard/`, `backend/functions/auth-profiles/`
- **MVP – Venue Dashboard** → `apps/venue-dashboard/`, `backend/functions/booking/`, `backend/functions/payments-discounts/`
- **MVP – Notifications** → `apps/player-app/`, `apps/venue-dashboard/`, `backend/functions/notifications/`
- **AI Foundations** → `backend/functions/ai/`, `infra/`, `apps/player-app/` (UI)
- **QA & Release** → `qa-release/` (with deep links into all other folders)

Each row in the CSV should be traceable to:

1. A **folder** where work is implemented.
2. A corresponding **AGENTS.md** responsibility.
3. A **Definition of Done** that clarifies when the task is complete.

## Timeline & Milestones (High-Level)

> Exact dates are defined in the CSV. This is the conceptual grouping.

1. **Discovery & Product Definition (late Nov 2025)**
   - Finalize MVP scope and user stories (`product/`).
   - Approve high-level architecture (`infra/`).

2. **Architecture & Infra Setup (late Nov–early Dec 2025)**
   - Spin up Firebase & GCP projects.
   - Configure Auth, Firestore, Storage, Functions, Hosting.
   - Define data model and security rules.

3. **MVP Feature Build (Dec 2025)**
   - Booking engine:
     - Venue listing, availability, booking creation.
   - Payments & discounts:
     - Payment provider integration.
     - Discount pool mechanics.
   - Auth & profiles:
     - Firebase Auth integrated with Expo and functions.
   - Venue dashboard:
     - Basic venue/field management, booking calendar.
   - Notifications:
     - Booking confirmations, reminders, admin alerts.

4. **AI Foundations (late Dec 2025 – early Jan 2026)**
   - Enable Vertex AI & Genkit.
   - Implement a callable Gemini-based FAQ assistant.
   - Integrate basic AI UI into player app (optional MVP+).

5. **QA & Release (early Jan 2026)**
   - Manual and E2E testing on staging.
   - App store listing prep and EAS build config.
   - Soft-launch with controlled users and venue partners.
   - Iterate based on feedback.

## Global Definition of Done (Project-Level)

Pay2Play MVP is considered **Done** when:

1. **End-to-End User Value**
   - A player in Lahore can:
     - Install or open the Pay2Play app (mobile or web).
     - Sign in, discover a venue, view real-time availability, and book a slot.
     - See **transparent pricing** and **venue-funded discount**.
     - Pay through a supported method.
     - Receive confirmation and reminders.
   - A venue admin can:
     - Log into the dashboard.
     - Configure venue, fields, and time slots.
     - View bookings and revenue.
     - Purchase promotions and see the effect on discount pools.

2. **Technical Robustness**
   - All core flows (booking, payments, notifications, AI FAQ) are:
     - Covered by tests.
     - Stable in staging and production.
   - Firebase rules protect data correctly.
   - Monitoring and logging are sufficient for operations.

3. **Operational Readiness**
   - At least a handful of **real venues** in Lahore are onboarded.
   - The team can:
     - Support bookings and handle incidents.
     - Reconcile financial data with venues.
   - A soft-launch has been executed and lessons captured.

4. **Documentation & Maintainability**
   - Every folder has an up-to-date `AGENTS.md` (this set).
   - `README`, `product/`, `infra/`, and `qa-release/` all reflect the current state.
   - New engineers can onboard and ship a small feature within a few days.
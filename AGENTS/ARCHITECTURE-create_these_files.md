Here’s the proposed Expo + Firebase/GCP architecture expressed as a set of AGENTS.md files, one per key folder, followed by AGENTS.ROOT.md at the end.

⸻

product/AGENTS.md

# AGENT: `product/`

## Purpose

This folder owns the **product brain** of Pay2Play:

- Translate the **business plan** and **Action Plan CSV** into concrete product requirements.
- Maintain a **single source of truth** for MVP scope, user stories, PRDs, and roadmap.
- Ensure all app and backend work aligns with the core promise:
  > Players book verified sports venues in under 60 seconds, with venue-funded discounts.

## Scope

- Product strategy docs
- PRDs for:
  - Player app MVP
  - Venue dashboard MVP
- User stories & acceptance criteria
- Roadmap and release notes

## Key Responsibilities

1. **MVP Scope & Prioritization**
   - Confirm MVP vs Growth vs Scale features.
   - Map CSV categories into product epics:
     - Product & Strategy
     - Architecture & Infra
     - MVP – Booking Engine
     - MVP – Payments & Discounts
     - MVP – Auth & Profiles
     - MVP – Venue Dashboard
     - MVP – Notifications
     - AI Foundations
     - QA & Release

2. **User Stories & Flows**
   - Write user stories for:
     - Player booking flow (search → slot select → payment → confirmation).
     - Discount visualization (show savings clearly).
     - Venue discovery and reviews.
     - Basic player profile & login.
     - Venue owner workflows for managing slots & promotions.

3. **PRD Ownership**
   - Maintain PRDs for:
     - `apps/player-app`
     - `apps/venue-dashboard`
     - Core backend flows (bookings, payments, discounts, notifications, AI assistant).

4. **Alignment & Decisions**
   - Document tradeoffs between:
     - Firestore vs SQL for specific data.
     - Client-side vs Cloud Functions logic.
     - Expo mobile vs web-only experiences.
   - Keep the roadmap aligned with **Lahore-first, Pakistan-scale** strategy.

## To-Dos (from CSV Mapping)

- [ ] Review business plan and finalize MVP features list.
- [ ] Prioritize MVP vs Growth vs Scale features.
- [ ] Document user stories for:
  - [ ] MVP booking, discounts, venue view.
  - [ ] Auth & profiles.
  - [ ] Venue dashboard basics.
- [ ] Write PRD for:
  - [ ] Player app MVP.
  - [ ] Venue dashboard MVP.

## Definition of Done

- Clear, versioned **MVP scope document** stored here.
- PRDs for player app and venue dashboard completed and shared.
- User stories and acceptance criteria defined for all MVP CSV items.
- Every task in the Action Plan CSV is traceable to:
  - A product epic, and
  - A responsible folder (apps, backend, infra, qa-release).
- Stakeholders agree on “**MVP complete means…**” and that statement lives in this folder.


⸻

infra/AGENTS.md

# AGENT: `infra/`

## Purpose

Design and maintain the **technical foundation** for Pay2Play:

- Expo React Native (mobile + web) as the unified client.
- Firebase Hosting + Cloud Functions as the backend entrypoints.
- Firestore, Storage, Auth, and GCP (Vertex AI / Genkit) as core services.

## Scope

- High-level architecture diagrams and decisions.
- Firebase project configuration (dev, staging, prod).
- GCP project configuration and IAM.
- Environments & secrets management.
- Firestore rules, indexes, and data model references.

## Key Responsibilities

1. **Architecture Design**
   - Define how:
     - `apps/player-app` runs on iOS/Android and web (Expo web).
     - Web build is deployed to **Firebase Hosting**.
     - APIs and AI flows are exposed via **Firebase Functions**.
   - Decide boundaries between:
     - `backend/functions/*` modules.
     - Client-side vs server-side logic.

2. **Firebase & GCP Setup**
   - Choose and configure:
     - Firebase Auth.
     - Firestore (primary transactional store for users, venues, bookings, discounts).
     - Cloud Storage (images for venues, games, avatars).
     - Cloud Functions (HTTP, callable, Firestore triggers).
   - Provision GCP resources:
     - Vertex AI / Genkit for Gemini-based flows.
     - Secret Manager for API keys.
     - Monitoring/Logging (Cloud Logging, Error Reporting).

3. **Data Model & Security**
   - Document Firestore collections for:
     - `users`, `venues`, `fields`, `slots`, `bookings`, `payments`, `promotions`, `discountPools`, `games`, `notifications`.
   - Maintain Firestore security rules and indexes.
   - Define multi-environment strategy:
     - `dev`, `staging`, `prod` projects and matching configs in `shared/`.

4. **Developer Experience**
   - Define local dev workflow:
     - `expo start` for `apps/player-app`.
     - `firebase emulators:start` for functions + Firestore.
   - Ensure simple onboarding from README to first successful booking in dev.

## To-Dos (from CSV Mapping)

- [ ] Design high-level system architecture (Expo app + Firebase + GCP services).
- [ ] Define data model for users, venues, bookings, promotions, discount pool.
- [ ] Choose Firebase products (Auth, Firestore, Storage, Functions, Hosting).
- [ ] Set up Firebase projects for dev/staging/prod.
- [ ] Configure GCP project, IAM roles, and billing for Cloud Functions / Vertex AI.
- [ ] Document environment variables and secret handling.

## Definition of Done

- Architecture diagram checked into `infra/`.
- Fully configured Firebase + GCP projects with:
  - Auth, Firestore, Storage, Functions, Hosting enabled.
- Firestore rules and indexes committed and tested.
- Local dev instructions verified by a fresh developer.
- Every other folder (`apps/*`, `backend/functions/*`, `shared/*`) can run against the defined infra with minimal manual tweaks.


⸻

apps/player-app/AGENTS.md

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


⸻

apps/venue-dashboard/AGENTS.md

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


⸻

backend/functions/booking/AGENTS.md

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


⸻

backend/functions/payments-discounts/AGENTS.md

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


⸻

backend/functions/auth-profiles/AGENTS.md

# AGENT: `backend/functions/auth-profiles/`

## Purpose

Own **server-side authentication and user profile management**, wrapping Firebase Auth with domain-specific logic.

## Scope

- Cloud Functions that:
  - Validate Firebase Auth tokens.
  - Enforce role-based access (player, venue admin, super admin).
  - Manage profile data in Firestore.
- Integration with external identity providers if needed.

## Key Responsibilities

1. **Auth Guard Rails**
   - Middleware/helpers for other functions to:
     - Decode and verify Firebase ID tokens.
     - Enforce claims such as `role: "player"` or `role: "venueAdmin"`.

2. **Profile Management**
   - Create user profile documents on first sign-in.
   - Support updates for:
     - Personal info.
     - Preferred sports/location.
     - Notification preferences.

3. **Role & Permissions**
   - Player vs venue admin vs super admin roles.
   - Support for inviting new venue admins and assigning them to venues.

4. **Security & Compliance**
   - Minimal PII storage.
   - Audit trails for key changes (role updates, venue ownership).

## To-Dos (from CSV Mapping)

- [ ] Setup Firebase Auth (phone/email, optional social logins).
- [ ] Implement signup/login flows integrated with Expo app.
- [ ] Implement Cloud Functions helpers for auth validation and roles.
- [ ] Implement user profile CRUD in Firestore.
- [ ] Implement role assignment for venue admins.
- [ ] Add tests to ensure only authorized users can access admin APIs.

## Definition of Done

- Player app and venue dashboard authenticate via Firebase.
- Every call to backend functions is authenticated and authorized.
- Profiles exist for every active user and are in sync with Auth.
- Auth & profile-related CSV tasks are fully covered with tests and docs.


⸻

backend/functions/notifications/AGENTS.md

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


⸻

backend/functions/ai/AGENTS.md

# AGENT: `backend/functions/ai/`

## Purpose

Own all **AI-related backend logic**, leveraging **Vertex AI / Genkit** and Gemini models to enhance:

- Player and venue support.
- Smart recommendations.
- Internal operations in future phases.

## Scope

- Genkit/Vertex AI flows exposed via Cloud Functions.
- AI assistants for:
  - Player FAQs (MVP+).
  - Venue guidance (MVP+).
- AI-powered insights over usage data (post-MVP).

## Key Responsibilities

1. **Foundational Setup**
   - Configure Genkit with Vertex AI (Gemini 2.x).
   - Secure API keys via Secret Manager.
   - Provide a simple callable function demonstrating AI chat.

2. **Player-Facing AI Assistant (MVP+)**
   - Provide a simple FAQ-style assistant:
     - “Where can I book futsal near DHA?”
     - “What happens if my booking is cancelled?”
   - Integrate with `apps/player-app` via callable function.

3. **Venue & Operations AI (Future)**
   - Suggestions for off-peak promotions.
   - Drafting league descriptions and social posts.
   - Forecasting demand (future phase).

4. **Safety & Guardrails**
   - Ensure prompts and responses are:
     - Aligned with business policies.
     - Safe and on-topic (sports, bookings, support).

## To-Dos (from CSV Mapping)

- [ ] Enable Vertex AI & Genkit in GCP project.
- [ ] Create a basic Cloud Function calling Gemini via Genkit.
- [ ] Implement an in-app AI FAQ assistant endpoint.
- [ ] Document examples and integration for `apps/player-app`.

## Definition of Done

- At least one callable AI endpoint live in dev/staging:
  - Tested from the Expo app.
- AI assistant can answer core FAQs reliably.
- Configuration, prompts, and safety guidelines documented in this folder.


⸻

shared/AGENTS.md

# AGENT: `shared/`

## Purpose

Provide **shared, reusable building blocks** for the entire monorepo:

- Domain models and TypeScript types.
- UI design system primitives (for Expo/React Native).
- Common utilities (config, logging, analytics).

## Scope

- `domain/` – schemas and domain logic for users, venues, bookings, payments, promotions, games.
- `ui/` – cross-platform UI components and themes for Expo.
- `config/` – environment configuration, feature flags.
- `utils/` – helpers shared across apps and functions.

## Key Responsibilities

1. **Domain Modeling**
   - Mirror Firestore/DB collections in code:
     - Types/interfaces for `User`, `Venue`, `Booking`, `Payment`, etc.
   - Provide validation schemas (e.g., zod) used by functions and apps.

2. **Design System**
   - Shared RN/Expo components:
     - Buttons, cards, forms, list items.
     - Layout primitives consistent with Pay2Play branding.
   - Themes for light/dark and sport-specific accents.

3. **Configuration & Environment**
   - Centralize environment configs (Firebase project IDs, API endpoints).
   - Provide typed access to env variables.

4. **Utilities & Analytics**
   - Logging helpers aligned with Cloud Logging.
   - Analytics event shapes used by apps and backend.

## To-Dos (from CSV Mapping)

- [ ] Define and maintain data model for core entities.
- [ ] Provide shared validation schemas used by all functions.
- [ ] Extract common UI components from player app + venue dashboard.
- [ ] Implement shared config module for dev/staging/prod.
- [ ] Document how other folders should depend on `shared/`.

## Definition of Done

- All core entities have shared, versioned types & schemas.
- Apps and backend do **not** duplicate domain models independently.
- UI components and themes are shared where reasonable between apps.
- Changing a core field (e.g., booking status enum) can be done in one place and propagated safely.


⸻

qa-release/AGENTS.md

# AGENT: `qa-release/`

## Purpose

Coordinate **testing, QA, and release readiness** for Pay2Play across:

- Expo player app (iOS/Android/Web).
- Venue dashboard web.
- Backend functions and infra.

## Scope

- Test plans, Gherkin scenarios, and test cases.
- Manual and automated test scripts.
- Store listing assets and release checklists.

## Key Responsibilities

1. **Test Strategy & Coverage**
   - Define coverage for:
     - Booking flows.
     - Payments & discounts.
     - Auth & profiles.
     - Notifications.
     - AI assistant endpoints (MVP+).
   - Maintain test matrices for platforms and devices.

2. **Execution**
   - Run E2E tests on staging:
     - Bookings.
     - Payments.
     - Notifications.
     - Venue dashboard workflows.

3. **Store Readiness**
   - Prepare:
     - App store descriptions.
     - Screenshots.
     - Privacy policy links.
   - Configure EAS builds (iOS/Android) and web release for Firebase Hosting.

4. **Release Management**
   - Maintain release checklist.
   - Track known issues and go/no-go criteria.

## To-Dos (from CSV Mapping)

- [ ] Write manual test cases and Gherkin scenarios for main flows.
- [ ] Run end-to-end tests on staging (booking, payments, notifications).
- [ ] Prepare app store listings (copy, screenshots, privacy policy).
- [ ] Configure EAS builds and upload to TestFlight / Play Console.
- [ ] Plan and execute soft-launch beta with limited users.
- [ ] Collect and document feedback for next iterations.

## Definition of Done

- All MVP stories tagged as “tested” with documented outcomes.
- Staging environment stable with green E2E runs for core flows.
- App store listings prepared and accepted (where applicable).
- Soft-launch completed with feedback documented.
- A clear sign-off that MVP is ready for a broader launch in Lahore.


⸻

AGENTS.ROOT.md

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


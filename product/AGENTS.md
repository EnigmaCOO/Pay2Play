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

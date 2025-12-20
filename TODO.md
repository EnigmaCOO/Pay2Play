# Pay2Play TODO List

This document outlines the remaining tasks to complete the Pay2Play application, based on the vision in `GEMINI.md`.

## Phase 1: MVP Completion

- [X] **Implement Payment Integration:**
    - [X] Replace mock payment provider with a real one (Stripe, EasyPaisa, JazzCash).
    - [X] Build the complete checkout flow.
    - [X] Implement secure checkout with real payment processing.
- [X] **Build User Dashboard:**
    - [X] Create a user dashboard to view booking history.
    - [X] Add a section to the user dashboard to view joined/hosted games.
- [X] **Complete Venue Dashboard:**
    - [X] Implement the bookings view for venue owners.
    - [X] Implement the revenue and payouts view for venue owners.
- [X] **Implement Player Wallets:**
    - [X] Design the database schema for player wallets.
    - [X] Implement backend APIs for managing wallet balances.
    - [X] Build the frontend UI for users to view and manage their wallets.
- [X] **Implement Authentication:**
    - [X] Replace hardcoded user IDs with a proper authentication system (e.g., OTP, Google, Apple).
- [X] **Enhance Cancellation & Refund Engine:**
    - [X] Add support for user-initiated cancellations.
    - [X] Add support for cancellations of regular pitch bookings (not just pickup games).
    - [X] Integrate with the real payment provider for refunds.

## Phase 2: Expansion

- [ ] **Implement Split Payments:**
    - [ ] Allow teammates to split the cost of a booking.
- [ ] **Implement Dynamic Pricing:**
    - [ ] Allow venues to set different prices for peak and off-peak hours.
- [ ] **Implement Weather & Attendance Prediction AI:**
    - [ ] Develop a system to predict weather and attendance.
    - [ ] Implement automatic rescheduling and notifications.
- [ ] **Implement Gamification Layer:**
    - [ ] Add player stats, XP points, and badges.
- [ ] **Implement Venue Ratings & Match Reviews:**
    - [ ] Allow users to rate venues and review matches.
- [ ] **Develop Pay2Play Pro:**
    - [ ] Create a subscription-based premium feature set for clubs.

## Phase 3: Ecosystem Buildout

- [ ] **Complete Tournament Management Suite:**
    - [ ] Build the frontend UI for the existing backend and database support.
- [ ] **Implement Marketplace:**
    - [ ] Create a marketplace for equipment, kits, and local coaching services.
- [ ] **Implement Real-Time Match Streaming & Highlights:**
    - [ ] Partner with streaming providers to offer real-time match streaming and highlights.
- [ ] **Implement AI-Driven Matchmaking Engine:**
    - [ ] Develop an AI-driven matchmaking engine to find ideal opponents or teammates.
- [ ] **Build National Sports Graph:**
    - [ ] Create a national analytics dashboard mapping Pakistan’s sports trends.
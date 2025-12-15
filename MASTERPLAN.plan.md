# Pay2Play Master Plan

## 1. Vision & Business Model

**Vision:** To become the premier B2B2C digital platform for recreational sports in Pakistan, starting with Lahore. Pay2Play will connect players with sports venues, digitizing the booking process and fostering a connected community.

**Core Problem:** The current system for booking sports venues is fragmented, manual (phone-based), and inefficient for both players and venue owners.

**Solution:** A unified platform that offers:
-   **For Players:** Instant, real-time booking of vetted venues, access to discounts, and the ability to find teammates or join games.
-   **For Venue Owners:** A dashboard to manage bookings, automate scheduling, and increase utilization through targeted promotions.

**Monetization Strategy:**
-   **Primary:** A B2B, venue-focused model. Venues pay for promotional packages (e.g., "Venue of the Week," "Promoted Slots") to boost their visibility and bookings.
-   **Secondary:** A small, transparent booking fee (`1-3%`) added to each transaction to cover operational costs.
-   **Player-Facing:** The app is free for players, with discounts subsidized by the venue promotions.

## 2. Technical Architecture

The project is built on a modern, scalable, serverless architecture using Firebase, organized within a monorepo.

-   **Backend:** Firebase Functions (Node.js/TypeScript) for all business logic, database interactions, and authentication.
-   **Database:** Firestore for the primary database, following the security rules defined in `firestore.rules`.
-   **Frontend Applications:**
    -   **Player App:** A mobile application built with React Native (Expo) for a native iOS and Android experience.
    -   **Venue Dashboard:** A web application built with React (Vite) for venue owners to manage their facilities.
-   **Local Development:** The entire stack is designed to be run locally using the **Firebase Emulator Suite**, ensuring consistency between development and production environments.

## 3. Product Roadmap & MVP Scope

The immediate goal is to deliver a Minimum Viable Product (MVP) that validates the core booking flow and user experience. The MVP is broken down into the following key deliverables, based on the `NEXT_steps.md` and `PLAYERS_APP_PRD.md` documents.

### **MVP Features:**

| Feature Area         | Player App (React Native)                                                                 | Venue Dashboard (Web)                               | Backend (Firebase Functions)                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Core Booking**     | - Venue discovery & search<br>- Real-time slot availability<br>- Booking & payment flow     | - Real-time availability grid<br>- Booking management | - `createBooking`<br>- `getVenueAvailability`<br>- Payment gateway integration                |
| **User Management**  | - Phone-based OTP authentication<br>- Player profile (name, sports, location)               | - Venue profile management                          | - `createUserProfile`<br>- `onUserCreate` trigger<br>- Authentication logic                 |
| **Community**        | - "Matches" tab to find games<br>- "Host a Match" functionality                            | - N/A for MVP                                       | - `createMatch`<br>- `joinMatch`                                                              |
| **Profile & Wallet** | - "Me" tab with booking history<br>- Basic wallet to show credits earned from promotions | - Revenue & booking analytics                     | - `getUserBookings`<br>- `calculateVenueRevenue`<br>- Logic for applying promotional credits |

### **Execution Timeline (5-Week MVP Plan):**

-   **Week 1: Data Model & Security**
    -   Finalize and implement the Firestore data model (`venues`, `bookings`, `users`, `matches`).
    -   Implement strict Firestore security rules (`firestore.rules`).
    -   Set up initial backend functions for core data access.

-   **Weeks 1–2: Backend Enablement**
    -   Develop all core Firebase Functions for the booking flow, user profiles, and match management.
    -   Integrate with a payment gateway for secure transactions.
    -   Implement the logic for applying venue-sponsored discounts.

-   **Weeks 2–4: Player App Delivery**
    -   Implement all screens as defined in `shared/PLAYERS_APP_PRD.md`, from onboarding to booking confirmation.
    -   Connect the app to the live backend functions.
    -   Conduct thorough testing on both iOS and Android using Expo.

-   **Weeks 2–4: Venue Dashboard Delivery**
    -   Develop the web-based dashboard for venues to see and manage their bookings.
    -   Implement the real-time availability grid.
    -   Connect the dashboard to the backend functions.

-   **Week 5: Integration & Testing**
    -   Perform end-to-end testing of the entire user journey, from a player booking a slot to the venue seeing the confirmation.
    -   Deploy all functions and frontend applications to production Firebase services.
    -   Prepare for a soft launch with a select group of venues in Lahore.

## 4. Next Steps Beyond MVP

Once the MVP is launched and validated, the project will move towards its long-term vision of building a comprehensive sports ecosystem.

-   **Enhanced Community Features:** Advanced matchmaking, player stats, and social features.
-   **Expanded Monetization:** Introduce subscription tiers for venues ("Pay2Play Pro") with advanced analytics and features.
-   **Geographic Expansion:** Scale the platform to other major cities in Pakistan (e.g., Karachi, Islamabad).
-   **Ecosystem Growth:** Integrate with local sports leagues, tournament organizers, and equipment vendors.

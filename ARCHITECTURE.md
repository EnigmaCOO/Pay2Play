# Pay2Play Architectural Overview

This document outlines the architectural vision, structure, and technology stack for the Pay2Play platform. Our goal is to build a scalable, maintainable, and modern ecosystem that supports web and mobile clients through a unified serverless backend.

## 1. Core Architectural Principles

- **Monorepo Strategy:** All applications (player-facing, venue-facing, admin) and shared packages will reside in a single `pnpm/yarn` monorepo. This simplifies dependency management, promotes code sharing, and streamlines development and deployment processes.
- **Serverless-First Backend:** We are migrating away from a self-managed Node.js Express server to a fully serverless architecture leveraging the Google Firebase suite. This reduces operational overhead, enables automatic scaling, and provides tight integration with other Firebase services.
- **Decoupled Frontend Applications:** Each frontend (player, venue, admin) will be a standalone application, allowing for independent development cycles and deployments. They will all communicate with the same backend services.
- **Cross-Platform Mobile:** A native mobile experience for both iOS and Android will be delivered through a single codebase using React Native and the Expo platform.

---

## 2. Monorepo Structure

The project will be organized into a multi-package monorepo with the following structure:

```
/
├── apps/
│   ├── player-app/       # (Current) React/Vite app for players
│   ├── venue-dashboard/  # (Future) React/Vite app for venue owners
│   ├── admin-panel/      # (Future) React/Vite app for platform administrators
│   └── mobile-app/       # (Future) React Native/Expo app for players/venues
│
├── backend/
│   └── functions/        # (Legacy) Express server, to be deprecated
│
├── packages/             # (Future) Shared code and components
│   ├── ui/               # Shared React UI components (Buttons, Cards, etc.)
│   ├── config/           # Shared configurations (ESLint, TypeScript, etc.)
│   └── types/            # Shared TypeScript types and interfaces
│
└── services/             # Firebase-specific configurations
    ├── firestore/        # Firestore rules and index definitions
    └── functions/        # Cloud Functions for Firebase (replaces backend/)
```

---

## 3. Technology Stack & Services

### 3.1. Backend: Firebase

The custom Express server in `/backend/functions` will be deprecated and its logic migrated to Cloud Functions for Firebase.

- **Firebase Authentication:** Secure user authentication with email/password, social providers (Google, Apple), and OTP. It will manage user profiles and sessions across all applications.
- **Firestore:** The primary NoSQL database for all application data, including user profiles, venue information, bookings, payments, and game matchmaking. Its real-time capabilities will be leveraged to provide live updates in the client applications.
- **Cloud Functions for Firebase:** The core of our serverless backend. All business logic, from creating bookings and processing payments to handling automated cancellations and sending notifications, will be implemented as individual functions. These functions will expose HTTPS endpoints for the clients and respond to events from other Firebase services.
- **Cloud Storage for Firebase:** Used for storing user-generated content such as profile pictures, venue photos, and other necessary assets.

### 3.2. Frontend Applications

All web applications will be built using **Vite**, **React**, and **TypeScript**, leveraging shared component libraries from the `/packages` directory.

- **Player App (`apps/player-app`):** The main customer-facing web application for discovering and booking venues.
- **Venue App (`apps/venue-dashboard`):** A dedicated dashboard for venue owners to manage their listings, view bookings, handle payouts, and see analytics.
- **Admin Panel (`apps-admin-panel`):** A comprehensive tool for the Pay2Play team to manage users, venues, bookings, and platform-wide settings.

### 3.3. Mobile Application

- **Expo (React Native):** We will use the Expo framework to develop a cross-platform mobile app for iOS and Android from a single codebase. This allows us to reuse some of our web-based logic and skills.
- **Expo Application Services (EAS):** For building, deploying, and updating the mobile application. EAS will handle the complexities of app store submissions and over-the-air (OTA) updates, enabling us to push new features and fixes to users rapidly.

---

## 4. Architectural Migration Plan

1.  **Establish Firebase Backend:**
    -   Define the complete Firestore data model and security rules.
    -   Begin migrating API endpoints from the legacy Express application to new **Cloud Functions for Firebase**.
    -   Set up **Firebase Authentication** and integrate it with the frontend.
2.  **Refine Monorepo Structure:**
    -   Create the `/packages` directory for shared code.
    -   Start building out a shared UI library in `packages/ui`.
    -   Initialize the placeholder applications for the venue and admin dashboards.
3.  **Initialize Mobile Application:**
    -   Set up a new Expo project within `apps/mobile-app`.
    -   Establish basic navigation and integrate Firebase services (Auth, Firestore).
4.  **Decommission Legacy Backend:**
    -   Once all logic is successfully migrated to Cloud Functions, the `/backend/functions` directory will be removed.

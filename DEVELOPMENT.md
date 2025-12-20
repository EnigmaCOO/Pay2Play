# Pay2Play Local Development Setup

This document outlines how to set up and run the Pay2Play monorepo locally for development.

## 1. Introduction

The Pay2Play project is structured as a monorepo using Yarn workspaces. It consists of:
-   `apps/player-app`: The Expo React Native application for players (iOS, Android, Web).
-   `apps/venue-dashboard`: The Vite React web application for venue administrators.
-   `packages/types`: Shared TypeScript type definitions (e.g., Firestore schemas).
-   `packages/ui`: Shared UI components (placeholder for now).
-   `packages/config`: Shared configurations (placeholder for now).
-   `backend/functions`: Firebase Cloud Functions (backend logic).

## 2. Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js**: Version 18 or later (check `backend/functions/package.json` for exact engine version).
-   **Yarn**: v1.x (classic).
-   **Firebase CLI**: Version 13 or later.
    ```bash
    npm install -g firebase-tools
    firebase login
    firebase use --add  # Select your Firebase project
    ```

## 3. Initial Setup

Navigate to the project root and install all dependencies for the monorepo:

```bash
yarn install
```

## 4. Running Firebase Emulators

The Firebase Emulators suite allows you to run a local version of Firebase services (Firestore, Authentication, Functions, etc.) without deploying to the cloud.

To start the emulators:

```bash
yarn emulators
# Or (recommended) to kill any stale emulator processes first:
yarn emulators:restart
```
Leave this command running in a dedicated terminal. Access the Firebase Emulator UI at `http://localhost:4000`.

## 4.1 Local domains (Caddy)

This repo uses Caddy as a local reverse proxy so you can access the Firebase Hosting emulator on custom domains:

- `http://pay2play.local` → Hosting emulator `127.0.0.1:5001`
- `http://app.pay2play.local` → Hosting emulator `127.0.0.1:5002`
- `http://venues.pay2play.local` → Hosting emulator `127.0.0.1:5007`

The proxy is configured in `Caddyfile` and the hostnames are mapped in `/etc/hosts`.

## 4.2 Local Auth (Google/Firebase) on `app.pay2play.local`

To complete Google sign-in on the custom local domain, you must allow it in both:

- Firebase Console → Authentication → Settings → **Authorized domains**: add `app.pay2play.local`
- Google Cloud Console → OAuth client → **Authorized redirect URIs**: add `http://app.pay2play.local/__/auth/handler`

The player app reads the auth domain from `EXPO_PUBLIC_AUTH_DOMAIN` (and `start.js` defaults it to `app.pay2play.local` when starting `yarn players:dev`).

## 5. Integration Testing with Firebase Emulators

Follow these steps to perform basic end-to-end integration tests using the local Firebase Emulators.

### 5.1 Preparation

1.  Ensure the Firebase Emulators are running (`pnpm dev`).
2.  Open the Player App (`cd apps/player-app && pnpm start`) in your web browser or simulator.
3.  Open the Venue Dashboard (`cd apps/venue-dashboard && pnpm dev`) in your web browser.
4.  Access the Firebase Emulator UI in your browser at `http://localhost:4000` to monitor Auth, Firestore, and Functions logs.

### 5.2 Scenario 1: Player Authentication and Profile Creation

1.  **Action**: In the Player App (Profile tab), click "Login Anonymously".
2.  **Verification**:
    *   The app should display "Welcome, User: [UID]".
    *   Check the Firebase Auth Emulator UI (`http://localhost:4000/auth`) for a new anonymous user entry.
    *   Check the Firestore Emulator UI (`http://localhost:4000/firestore`) in the `users` collection for a new document matching the player's UID. This document should have the default `player` role and `balancePkr: 0`.
    *   Check the Functions Logs in the Emulator UI (`http://localhost:4000/logs`) for output from the `onUserCreate` Cloud Function, confirming profile creation.

### 5.3 Scenario 2: Venue Exploration and Booking

1.  **Preparation**:
    *   **Crucially, you need to manually add some test data to Firestore via the Emulator UI (`http://localhost:4000/firestore`)**:
        *   **users Collection**: Create a user document with an `id` matching the UID of an authenticated user (e.g., from Scenario 1). Add `roles: ["venueAdmin"]` to this user. This simulates a venue admin user.
        *   **venues Collection**: Create a venue document. Example:
            ```json
            {
              "id": "venue-123",
              "name": "Super Dome Sports",
              "address": "123 Main St",
              "city": "Lahore",
              "description": "State-of-the-art sports facility",
              "imageUrls": ["https://example.com/image.jpg"],
              "ownerId": "[UID_OF_VENUE_ADMIN_USER]", // Link to the venueAdmin user created above
              "verified": true,
              "createdAt": { "__datatype__": "Timestamp", "value": { "seconds": 1678886400, "nanoseconds": 0 } }
            }
            ```
        *   **fields Subcollection**: Under the `venue-123` document, create a subcollection named `fields`. Add a field document. Example:
            ```json
            // Path: venues/venue-123/fields/field-abc
            {
              "id": "field-abc",
              "name": "Futsal Court 1",
              "sport": "football",
              "pricePerHourPkr": 2500,
              "capacity": 10,
              "createdAt": { "__datatype__": "Timestamp", "value": { "seconds": 1678886400, "nanoseconds": 0 } }
            }
            ```
        *   **slots Collection**: Create a few slots for the `field-abc`. Example:
            ```json
            // Path: slots/slot-001
            {
              "id": "slot-001",
              "fieldId": "field-abc",
              "venueId": "venue-123",
              "startTime": { "__datatype__": "Timestamp", "value": { "seconds": 1678900000, "nanoseconds": 0 } }, // Tomorrow 10:00 AM
              "endTime": { "__datatype__": "Timestamp", "value": { "seconds": 1678903600, "nanoseconds": 0 } },   // Tomorrow 11:00 AM
              "isBooked": false
            }
            // Add more slots as needed
            ```
1.  **Action**: In the Player App, go to the "Explore" tab. You should see "Super Dome Sports". Click on it.
2.  **Action**: On the Venue Detail screen, select "Futsal Court 1" (or your created field), select a date (matching your slot data), and then select an available time slot. Click "Book Now".
3.  **Verification**:
    *   The app should show an "Booking Successful!" alert.
    *   Check the Firestore Emulator UI in the `bookings` collection for a new document.
    *   Check the `slots` collection; the booked slot's `isBooked` field should now be `true`.
    *   Check Functions Logs for `createBooking` output.

### 5.4 Scenario 3: Payment Intent Creation (after successful booking)

1.  **Preparation**: Ensure you have successfully completed Scenario 2, resulting in a new booking.
2.  **Action**: On the Venue Detail screen (after booking), click "Pay Now" (if visible).
3.  **Verification**:
    *   The app should show a "Payment Intent Created!" alert with a mock client secret.
    *   Check the Firestore Emulator UI in the `payments` collection for a new document linked to your booking.
    *   Check Functions Logs for `createPaymentIntent` output.

### 5.5 Scenario 4: Venue Admin Login

1.  **Action**: In the Venue Dashboard app, use the email and password of the `venueAdmin` user created in "Scenario 2: Preparation" to log in.
2.  **Verification**:
    *   The app should display "Welcome, [Admin Name]!" and list the "Super Dome Sports" venue.
    *   You should see the fields for the venue.

## 6. Running the Player App (Expo)

The player app is an Expo project. Ensure the Firebase Emulators are running first.

From the repo root, start the player app (this also starts Caddy for local routing):

```bash
yarn players:dev
```

Then open `http://app.pay2play.local/` in your browser.

## 7. Running the Venue Dashboard (Vite)

The venue dashboard is a Vite React application. Ensure the Firebase Emulators are running first.

Navigate to the `apps/venue-dashboard` directory and start the development server:

```bash
cd apps/venue-dashboard
yarn dev
```
This will typically start the app on `http://localhost:5173` (or another available port).

## 8. Key Development Commands

These commands can be run from the project root.

-   **Install dependencies**:
    ```bash
    yarn install
    ```
-   **Run linting across specified packages**:
    ```bash
    yarn lint
    ```
-   **Run type-checking across specified packages**:
    ```bash
    yarn typecheck
    ```
-   **Build all production assets**:
    ```bash
    yarn build
    ```

## 9. Firebase Deployment

To deploy Cloud Functions and Hosting to your Firebase project:

```bash
firebase deploy
# Or for specific targets:
firebase deploy --only functions
firebase deploy --only hosting
```
Always ensure your code is thoroughly tested before deployment.

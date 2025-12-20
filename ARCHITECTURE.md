# Pay2Play Architecture Document

## 1. Architecture Overview

Pay2Play will be built on a modern, serverless architecture using the **Google Firebase** platform. This choice ensures scalability, maintainability, and rapid development. The architecture is designed to support a growing ecosystem of applications, starting with a player-facing mobile app and a venue management dashboard.

The core principles of this architecture are:
- **Serverless-First:** All backend logic is encapsulated in ephemeral, auto-scaling functions.
- **Managed Services:** We leverage Firebase's managed services for the database, authentication, storage, and hosting to reduce operational overhead.
- **Monorepo Structure:** The codebase is organized as a `yarn` monorepo, allowing for shared types, utilities, and streamlined dependency management across different applications.

---

## 2. Core Components

The system is composed of the following key components:

### 2.1. Frontend Applications
- **Player App (`/apps/player-app`):** A mobile application built with **React Native** and **Expo**. It provides the primary interface for players to discover venues, book slots, and manage their profiles.
- **Venue Dashboard (`/apps/venue-dashboard`):** A web application built with **React** and **Vite**. This dashboard allows venue owners to manage their venue details, view bookings, and access analytics.

### 2.2. Backend Services
- **Firebase Functions (`/backend/functions`):** The entire backend is a collection of **Node.js** TypeScript functions deployed to Firebase. These functions expose a RESTful API and handle all business logic, from bookings to payments.

### 2.3. Data & Storage
- **Firestore (`/packages/types/src/firestore-schema.ts`):** Our primary database is **Cloud Firestore**, a NoSQL, document-based database. It provides flexible data modeling and real-time capabilities. The schema is defined in TypeScript interfaces for type safety.
- **Firebase Storage:** Used for storing user-generated content such as profile pictures and venue images.

### 2.4. Authentication & Security
- **Firebase Authentication:** Handles all user authentication (email/password, Google, Apple). It integrates seamlessly with Firestore to provide secure, rule-based data access.
- **Firestore Security Rules (`/firestore.rules`):** Defines granular access control rules for the database, ensuring that users can only read or write data they are permitted to.

### 2.5. Deployment & Hosting
- **Firebase Hosting:** Hosts our static web applications (like the Venue Dashboard) and provides a global CDN for fast content delivery.
- **GitHub Actions (`/.github/workflows`):** Our Continuous Integration and Continuous Deployment (CI/CD) pipeline is managed via GitHub Actions, which automates testing and deployment to Firebase.

### 2.6 Monorepo Structure

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

## 3. Data Flow

The data flow is designed to be simple and unidirectional, ensuring predictability and ease of debugging.

**Example: Booking a Slot**
1.  **User Action:** A player selects a time slot in the **Player App**.
2.  **API Request:** The app sends a `POST` request to the `/bookings` endpoint on our **Firebase Functions** backend. The request includes the user's auth token in the header.
3.  **Backend Processing:**
    - The backend API gateway routes the request to the `createBooking` function.
    - The function first verifies the user's Firebase Auth token.
    - It then validates the request payload (e.g., `slotId`, `userId`).
    - The function checks in **Firestore** if the requested slot is still available.
    - If available, it creates a new `booking` document and atomically updates the `slot` document to mark it as booked.
    - It can also trigger a payment flow if required.
4.  **Database Update:** Firestore is updated with the new booking information.
5.  **API Response:** The backend returns a success response (e.g., `201 Created`) with the new booking details.
6.  **UI Update:** The Player App receives the response and updates the UI to show the confirmed booking.
7.  **Notification (Async):** A `onWrite` trigger on the `bookings` collection can invoke another function to send a confirmation push notification to the user.

---

## 4. API Contracts

The API is exposed via Firebase Functions. All endpoints are prefixed with `/api`.

### Core Endpoints

#### **`POST /api/bookings`**
- **Description:** Creates a new booking.
- **Request Body:**
  ```json
  {
    "slotId": "string",
    "userId": "string",
    "paymentNonce": "string" // From payment provider
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "id": "booking_123",
    "status": "confirmed",
    ... // Full booking object
  }
  ```
- **Error Response (`400 Bad Request`, `409 Conflict`):**
  ```json
  { "error": "Slot is no longer available." }
  ```

#### **`GET /api/venues`**
- **Description:** Retrieves a list of all venues.
- **Query Params:** `?city=Lahore`
- **Success Response (`200 OK`):**
  ```json
  [
    { ...venue1 },
    { ...venue2 }
  ]
  ```

#### **`GET /api/users/{userId}`**
- **Description:** Retrieves a user's profile.
- **Success Response (`200 OK`):**
  ```json
  {
    "id": "user_123",
    "displayName": "Player One",
    "balancePkr": 50000
  }
  ```

---

## 5. Error Handling

A consistent error handling strategy is crucial for a reliable API.

- **HTTP Status Codes:** We will use standard HTTP status codes to indicate the outcome of a request (e.g., `200` for success, `400` for bad input, `401` for unauthorized, `404` for not found, `500` for server errors).
- **Error Response Body:** All error responses will have a consistent JSON format:
  ```json
  {
    "error": {
      "message": "A human-readable error message.",
      "code": "SLOT_UNAVAILABLE" // A machine-readable error code
    }
  }
  ```
- **Logging:** All unexpected errors in Firebase Functions will be logged to **Google Cloud Logging** for debugging.

---

## 6. Security Protocols

Security is a top priority. Our security strategy includes:

- **Authentication:** Every API request that accesses or modifies user-specific data will be protected. The client will send a Firebase ID Token in the `Authorization` header, and the backend will verify it using the Firebase Admin SDK.
- **Authorization (Firestore Rules):** We will implement strict Firestore security rules to control data access at the database level. For example, a user should only be able to write to their own `user` document.
  ```
  // Example firestore.rules
  match /users/{userId} {
    allow read, write: if request.auth.uid == userId;
  }
  match /bookings/{bookingId} {
    allow create: if request.auth.uid == request.resource.data.userId;
    allow read: if request.auth.uid == resource.data.userId || isVenueOwner(resource.data.venueId);
  }
  ```
- **Input Validation:** All incoming data from the client will be rigorously validated on the backend (using a library like `zod`) to prevent malformed data and potential security vulnerabilities.
- **Secret Management:** All API keys and secrets will be stored as environment variables in Firebase Functions configuration, never in the codebase.

---

## 7. Deployment Strategy

- **CI/CD:** We use **GitHub Actions** to automate our deployment process.
- **Workflow:**
  1.  **Push to `main`:** When code is merged into the `main` branch, the workflow is triggered.
  2.  **Install & Build:** It installs dependencies (`yarn install`), runs linters, and builds all applications in the monorepo.
  3.  **Test:** It runs the unit and integration test suites.
  4.  **Deploy:**
      - The `venue-dashboard` (web app) is deployed to **Firebase Hosting**.
      - The backend functions are deployed to **Firebase Functions**.
- **Rollbacks:** Firebase allows for easy rollbacks to previous versions of functions and hosted files via the Firebase Console.

---

## 8. Scalability Measures

The serverless architecture is inherently scalable.
- **Firebase Functions:** Auto-scales based on incoming traffic. We can configure `minInstances` for functions that need to be "warm" to reduce cold starts.
- **Firestore:** Scales automatically to handle millions of concurrent users.
- **Caching:** For frequently accessed, non-user-specific data (like a list of all sports), we can implement caching at the API level or use a CDN. Firebase Hosting's CDN caches static assets by default.

---

## 9. Logging Mechanisms

- **Cloud Logging:** By default, all logs from Firebase Functions (`console.log`, `console.error`) are sent to Google Cloud Logging. This allows for searching, filtering, and setting up alerts on specific log messages.
- **Structured Logging:** We will use structured JSON logs to make them easily machine-readable.
  ```typescript
  console.log(JSON.stringify({
    message: "User created a booking",
    severity: "INFO",
    context: { userId: "user_123", bookingId: "booking_456" }
  }));
  ```

---

## 10. Performance Benchmarks

Initial performance targets for the API:
- **P95 Latency for Core Reads (e.g., `GET /venues`):** < 200ms
- **P95 Latency for Core Writes (e.g., `POST /bookings`):** < 500ms
- **Cold Start Time for Critical Functions:** < 1.5s (to be optimized with `minInstances`)
- **App Load Time (Venue Dashboard):** First Contentful Paint (FCP) < 2s

These benchmarks will be monitored and refined as the application evolves.
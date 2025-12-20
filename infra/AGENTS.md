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

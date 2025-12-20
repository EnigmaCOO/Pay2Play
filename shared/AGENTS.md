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

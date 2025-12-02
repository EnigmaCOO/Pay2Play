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

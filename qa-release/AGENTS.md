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

---
name: Stabilize player app navigation, auth, and local routing
overview: Unify React Navigation versions with expo-router expectations, finish hardening Firebase/Booking logic, fix the Expo dev/start scripts, and validate the app end-to-end via local Caddy routing and Firebase Hosting, including a redeploy and browser verification.
todos:
  - id: nav-version-align
    content: Confirm and, if needed, revert React Navigation versions in root and player-app to the Expo/expo-router compatible 6.x set, then verify builds no longer hit the m.default error
    status: completed
  - id: expo-dev-script-fix
    content: Update start.js and players:dev to use supported Expo CLI flags and handle Caddy already running on the admin port
    status: in_progress
  - id: firebase-auth-config
    content: Verify single Firebase initialization, wire authDomain overrides for local dev, and ensure Firebase/Google consoles include app.pay2play.local as authorized domain/redirect URI
    status: pending
  - id: booking-null-safety
    content: Confirm BookingCard.tsx and bookings.tsx safely handle optional Booking fields and pass lint/typecheck
    status: pending
  - id: caddy-routing-verify
    content: Double-check Caddyfile + /etc/hosts for HTTP-only IPv4 routing to 127.0.0.1:500{1,2,7} and confirm curl equality between app.pay2play.local and 127.0.0.1:5002
    status: pending
  - id: local-e2e-checks
    content: Run emulators and players:dev, then exercise auth, navigation, and bookings via http://app.pay2play.local in a normal browser
    status: pending
  - id: build-deploy-browser-verify
    content: Build the player app for web, deploy hosting:pay2play, and use @Browser to validate the deployed site matches local behavior
    status: pending
---

### Stabilize player app navigation, auth, and local routing

**Goal:** Address all discovered issues: React Navigation version skew with `expo-router`, Firebase init and booking null-safety, local Caddy routing to `app.pay2play.local`, Expo dev/start script problems, and ensure the app builds, deploys, and runs correctly both locally and via Firebase Hosting.

---

### 1. React Navigation and expo-router compatibility

**Files:**

- Root [`package.json`](/Users/lionking/Pay2Play/code/Pay2Play/package.json)
- Player app [`apps/player-app/package.json`](/Users/lionking/Pay2Play/code/Pay2Play/apps/player-app/package.json)

**Plan:**

1. **Confirm React Navigation 6.x alignment for Expo SDK 54 / expo-router 3.5.20.**

   - Keep / revert root `resolutions` to the Expo-compatible set:
     - `"@react-navigation/native": "6.1.18"`
     - `"@react-navigation/bottom-tabs": "6.6.1"`
     - `"@react-navigation/elements": "1.3.31"`
     - `"@react-navigation/core": "7.13.6"`
     - `"@react-navigation/routers": "7.5.2"`
     - `"@react-navigation/native-stack": "7.8.6"`

2. **Ensure player app dependencies match those versions:**

   - In `apps/player-app/package.json`, set:
     - `"@react-navigation/native": "~6.1.6"`
     - `"@react-navigation/bottom-tabs": "~6.5.7"`
     - `"@react-navigation/elements": "~1.3.31"`
   - Remove any stray 7.x pins in other apps if present.

3. **Reinstall and verify resolution:**

   - Run `yarn install --mode=skip-builds` at the repo root.
   - Use `yarn why @react-navigation/native` to verify a single 6.1.x instance is used, satisfying expo-router.

4. **Re-run the failing build/export:**

   - From `apps/player-app`, re-run `yarn build` and confirm the `Metro error: (0 , m.default) is not a function` (from `NavigationContainer.js`) is gone.

Result: expo-router and React Navigation are on compatible versions, eliminating the `m.default` runtime/build error.

---

### 2. Expo dev/start script cleanup

**Files:**

- Root [`package.json`](/Users/lionking/Pay2Play/code/Pay2Play/package.json)
- Player app [`apps/player-app/package.json`](/Users/lionking/Pay2Play/code/Pay2Play/apps/player-app/package.json)
- `start.js` at [`start.js`](/Users/lionking/Pay2Play/code/Pay2Play/start.js)

**Plan:**

1. **Fix player dev command flags:**

   - Expo CLI 54 no longer supports `expo start --dev-client --dev --clear` exactly as used.
   - Update `start.js` default branch to call a supported command, e.g.:
     - `expo start --dev-client --clear` or plain `expo start --clear` depending on desired behavior.
   - Ensure `players:dev` in `package.json` remains wired to `node start.js`.

2. **Avoid Caddy admin port conflicts:**

   - `start.js` currently fails when Caddy admin (127.0.0.1:2019) is already running.
   - Add a simple guard to detect when Caddy is already active (e.g. attempt a quick HTTP request to the admin endpoint or log and continue on EADDRINUSE) so re-running `players:dev` doesn’t crash.

3. **Verify local dev flow:**

   - With emulators running (`yarn emulators:restart`), run `yarn players:dev` and confirm Metro/Expo starts without flag errors.

Result: a stable `players:dev` experience that coexists with the Caddy process and Expo 54’s CLI semantics.

---

### 3. Firebase initialization and auth domain configuration

**Files:**

- Player Firebase config [`apps/player-app/lib/firebase.ts`](/Users/lionking/Pay2Play/code/Pay2Play/apps/player-app/lib/firebase.ts)
- Venue dashboard Firebase config [`apps/venue-dashboard/src/firebase.ts`](/Users/lionking/Pay2Play/code/Pay2Play/apps/venue-dashboard/src/firebase.ts)
- Shared Firebase types [`packages/types/src/firestore-schema.ts`](/Users/lionking/Pay2Play/code/Pay2Play/packages/types/src/firestore-schema.ts)
- Firebase config [`firebase.json`](/Users/lionking/Pay2Play/code/Pay2Play/firebase.json)

**Plan:**

1. **Verify duplicate Firebase init is gone (Bug 1).**

   - Confirm `apps/player-app/lib/firebase.ts` contains a **single** `initializeApp` / emulator connection block using `process.env.NODE_ENV` and no trailing duplicate block.

2. **Lock in local authDomain overrides:**

   - Player app: ensure `authDomain` is read from `process.env.EXPO_PUBLIC_AUTH_DOMAIN ?? "pay-2-play-f1da3.firebaseapp.com"`.
   - Venue dashboard: ensure `authDomain` uses `import.meta.env.VITE_AUTH_DOMAIN || "pay-2-play-f1da3.firebaseapp.com"`.

3. **Document and apply local env values:**

   - For dev, set:
     - `EXPO_PUBLIC_AUTH_DOMAIN=app.pay2play.local` (for the player app runtime)
     - `VITE_AUTH_DOMAIN=app.pay2play.local` (if the venue dashboard needs the same behavior).

4. **Console configuration (Firebase & Google OAuth):**

   - Firebase Auth → Settings → Authorized domains: add `app.pay2play.local`.
   - Google Cloud OAuth client: add `http://app.pay2play.local/__/auth/handler` as an authorized redirect URI (keeping the existing `127.0.0.1:5002` handler too).

Result: Firebase is initialized once per app, and the full Google/Firebase Auth flow can legitimately run on `app.pay2play.local` in local dev.

---

### 4. Booking null-safety and type correctness

**Files:**

- Booking card [`apps/player-app/app/components/booking/BookingCard.tsx`](/Users/lionking/Pay2Play/code/Pay2Play/apps/player-app/app/components/booking/BookingCard.tsx)
- Bookings tab screen `[apps/player-app/app/(tabs)/bookings.tsx](/Users/lionking/Pay2Play/code/Pay2Play/apps/player-app/app/\\\\(tabs)/bookings.tsx)`
- Booking type [`packages/types/src/firestore-schema.ts`](/Users/lionking/Pay2Play/code/Pay2Play/packages/types/src/firestore-schema.ts)

**Plan:**

1. **`BookingCard.tsx` safeguards:**

   - Confirm use of safe locals:
     - `const slotStart = booking.slotStartTime;`
     - `const slotDate = slotStart ? new Date(slotStart.seconds * 1000) : null;`
     - `const isUpcoming = slotDate ? slotDate > new Date() : false;`
     - `const dateLabel = slotDate ? slotDate.toLocaleDateString() : "Date TBD";`
     - `const venueName = booking.venueName ?? "Unknown venue";`
     - `const fieldName = booking.fieldName ?? "Field TBD";`
   - Ensure JSX uses these safe values rather than directly dereferencing optional fields.

2. **`bookings.tsx` filter safety:**

   - Confirm the filter uses a guard for missing `slotStartTime`:
     ```ts
     const filteredBookings = bookings.filter((b) => {
       const slot = b.slotStartTime;
       if (!slot) return false;
       const isUpcoming = new Date(slot.seconds * 1000) > new Date();
       return activeTab === 'Upcoming' ? isUpcoming : !isUpcoming;
     });
     ```

   - This implicitly handles the fact that `orderBy('slotStartTime')` is on an optional field—any docs missing it are dropped from the list.

3. **Run lints/types:**

   - `yarn lint apps/player-app` and `yarn typecheck` to validate no TS/ESLint issues around these changes.

Result: bookings UI can safely handle documents missing optional fields without runtime crashes.

---

### 5. Caddy + local domain routing stability

**Files:**

- [`Caddyfile`](/Users/lionking/Pay2Play/code/Pay2Play/Caddyfile)
- `/etc/hosts` (manual system file, not in repo)

**Plan:**

1. **Confirm HTTP-only, IPv4 routing:**

   - `Caddyfile` should have:
     ```
     {
         auto_https off
     }
     
     http://pay2play.local {
       reverse_proxy 127.0.0.1:5001
     }
     
     http://app.pay2play.local {
       reverse_proxy 127.0.0.1:5002
     }
     
     http://venues.pay2play.local {
       reverse_proxy 127.0.0.1:5007
     }
     ```

   - This prevents `::1` connection-refused issues and avoids HTTP→HTTPS redirects.

2. **Verify hosts file:**

   - Ensure `/etc/hosts` contains:
     ```
     127.0.0.1  pay2play.local
     127.0.0.1  app.pay2play.local
     127.0.0.1  venues.pay2play.local
     ```


3. **Smoke-test routing:**

   - With `yarn emulators:restart` running (Caddy + emulators), run:
     - `curl -I http://127.0.0.1:5002/` and `curl -I http://app.pay2play.local/`.
     - Confirm both return `200 OK` and identical HTML bodies (as already validated), proving transparent proxying.

Result: `http://app.pay2play.local/` reliably serves the same content as the hosting emulator at 127.0.0.1:5002 without SSL or IPv6 issues.

---

### 6. End-to-end local verification (navigation, auth, bookings)

**Plan:**

1. **Start emulators and Caddy:**

   - From repo root: `yarn emulators:restart`.

2. **Run the player app via `start.js`:**

   - `yarn players:dev` (after fixing the Expo CLI flags).
   - Open `http://app.pay2play.local/` in a regular browser.

3. **Exercise critical flows:**

   - Auth:
     - Run Google/Firebase sign-in, verify redirect returns to `http://app.pay2play.local/?state=...&code=...` and the app completes login.
   - Navigation:
     - Move between auth stack, onboarding, and main tabs to confirm there are no expo-router / navigation errors.
   - Bookings:
     - Go to the **Bookings** tab.
     - Confirm Upcoming/Past lists render, with safe fallbacks for any bookings missing `slotStartTime`, `venueName`, or `fieldName`.

Result: a fully working local experience rooted at `app.pay2play.local`.

---

### 7. Build, deploy, and verify in Browser (`@Browser`)

**Files:**

- Player app build config [`apps/player-app/package.json`](/Users/lionking/Pay2Play/code/Pay2Play/apps/player-app/package.json)
- Firebase hosting config [`firebase.json`](/Users/lionking/Pay2Play/code/Pay2Play/firebase.json)

**Plan:**

1. **Build the player app for web hosting:**

   - From `apps/player-app`: `yarn build` (which runs `expo export --output-dir dist`).
   - Ensure artifacts land in `apps/player-app/dist` as referenced in `firebase.json` (hosting target `pay2play`).

2. **Deploy to Firebase Hosting:**

   - From repo root: `firebase deploy --only hosting:pay2play` or `yarn deploy:hosting` (depending on preferred script).

3. **Verify via Browser tooling:**

   - Use the `@Browser` integration to:
     - Load the production hosting URL (e.g. the `pay-2-play-f1da3.web.app` / `firebaseapp.com` domain for `pay2play`).
     - Exercise the same flows: landing page, auth, bookings.
   - Optionally, confirm that Caddy-based local routing still mirrors the deployed behavior for dev/testing.

Result: the same fixed app is running both locally via Caddy and remotely via Firebase Hosting, with navigation, auth, and bookings all behaving correctly.
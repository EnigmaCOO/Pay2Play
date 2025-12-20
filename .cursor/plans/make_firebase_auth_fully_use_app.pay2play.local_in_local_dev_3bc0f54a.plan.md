---
name: Make Firebase Auth fully use app.pay2play.local in local dev
overview: Extend the Caddy/hosts setup so that the entire Firebase/Google OAuth flow uses app.pay2play.local as the authDomain and redirect target in local development.
todos:
  - id: player-firebase-config-app-domain
    content: Update player app Firebase config to use app.pay2play.local as authDomain in local dev via env var override
    status: completed
  - id: venue-firebase-config-app-domain
    content: (If needed) Update venue-dashboard Firebase config to support authDomain override for dev
    status: completed
  - id: console-auth-config
    content: Update Firebase Auth authorized domains and Google OAuth redirect URIs to include http://app.pay2play.local/__/auth/handler
    status: completed
  - id: auth-flow-validation
    content: Run the Google sign-in flow starting from http://app.pay2play.local and confirm it completes without redirecting to firebaseapp.com or erroring
    status: completed
---

### Make Firebase Auth fully use app.pay2play.local in local dev

**Goal:** Fix the broken OAuth callback so that the entire Google/Firebase Auth flow starts and ends on `http://app.pay2play.local/` instead of bouncing through `*.firebaseapp.com`, while keeping Caddy + emulators working.

---

### 1. Confirm and lock in working Caddy + emulator routing

- **Files involved:**
  - [`Caddyfile`](/Users/lionking/Pay2Play/code/Pay2Play/Caddyfile)
  - [`firebase.json`](/Users/lionking/Pay2Play/code/Pay2Play/firebase.json)
- **Assumed current good state:**
  - Global block in `Caddyfile` disables auto-HTTPS:
    ```
    {
        auto_https off
    }
    ```

  - HTTP-only site blocks:
    ```
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

  - `firebase.json` hosting emulators:
    - `pay2play` → port `5002`
    - `pay2play-venues` → port `5007`
- **Validation step (non-code):**
  - With `sudo yarn emulators` running, ensure:
    - `http://127.0.0.1:5002/sign-in` returns 200.
    - `http://app.pay2play.local/sign-in` returns the same content (via `Via: 1.1 Caddy`).

This confirms the proxy is solid before touching auth.

---

### 2. Make Firebase Auth think app.pay2play.local is the authDomain (local-only)

We’ll introduce a **dev-only Firebase config** so that in local development the JS SDK uses `app.pay2play.local` as its `authDomain`.

#### 2.1. Add env-based config in the player app

- **Files to adjust (expected):**
  - Player app Firebase config, e.g. `[apps/player-app/app/firebase.ts]` or similar entry point the app already uses.
- **Planned code changes:**

  1. Introduce environment-driven config:

     - Read something like `process.env.EXPO_PUBLIC_AUTH_DOMAIN` (or a similar env var) for `authDomain`.

  1. For dev, set that env var to `app.pay2play.local` (in Expo config or `.env` the app reads in dev).
  2. Fallback to the production `pay-2-play-f1da3.firebaseapp.com` in non-dev builds.

Conceptually:

- In the config file:
  - `authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN ?? "pay-2-play-f1da3.firebaseapp.com"`.
- In local dev environment:
  - `EXPO_PUBLIC_AUTH_DOMAIN=app.pay2play.local`.

#### 2.2. Mirror this for any web-facing auth config in the venue dashboard (if used for sign-in)

- **File:** [`apps/venue-dashboard/src/firebase.ts`](/Users/lionking/Pay2Play/code/Pay2Play/apps/venue-dashboard/src/firebase.ts)
- Adjust `firebaseConfig.authDomain` similarly to support an env override, defaulting to the production domain.

---

### 3. Update Firebase Auth & Google OAuth console settings

These are **console steps**, not code, but they’re required for the flow to succeed.

1. **Firebase project console → Authentication → Settings → Authorized domains**:

   - Add `app.pay2play.local` as an authorized domain.

2. **Google Cloud console → OAuth client (the one used by this app)**:

   - Add a redirect URI that matches what Firebase will use on `app.pay2play.local`, typically:
     - `http://app.pay2play.local/__/auth/handler`
   - Keep the existing `http://127.0.0.1:5002/__/auth/handler` URI for safety if currently working.

3. Confirm that the Google sign-in button / flow is configured to use the same client.

---

### 4. Align emulator & SDK behavior with the new domain

- Ensure that when running `sudo yarn emulators`:
  - Hosting emulator still serves the player app at `127.0.0.1:5002`.
  - Caddy proxies `http://app.pay2play.local` → `127.0.0.1:5002`.
- With the updated `authDomain` and console config:
  - Start the flow from `http://app.pay2play.local/`.
  - Google should redirect back to a long URL starting with `http://app.pay2play.local/?state=…&code=…`.
  - The Firebase JS SDK, seeing `authDomain = app.pay2play.local`, should accept and complete the flow on that domain instead of trying to move to `firebaseapp.com`.

---

### 5. End-to-end validation

1. Run `sudo yarn emulators`.
2. Open `http://app.pay2play.local/` in a normal browser (not just Cursor’s embedded one, if possible).
3. Start the Google sign-in flow.
4. On successful sign-in:

   - You should land back on `http://app.pay2play.local/...` without a connection error.
   - The app should show an authenticated state.

5. If there’s still an error, check:

   - Browser devtools network log for any redirect still going to `pay-2-play-f1da3.firebaseapp.com`.
   - Caddy logs for any remaining 502s against `127.0.0.1:5002`.

Once these steps are complete, the full auth loop will run entirely through `app.pay2play.local` in local development, with Caddy and the Firebase emulators underneath.
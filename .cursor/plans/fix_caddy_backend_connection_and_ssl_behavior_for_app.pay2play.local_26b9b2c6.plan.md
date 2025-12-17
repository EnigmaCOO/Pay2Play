---
name: Fix Caddy backend connection and SSL behavior for app.pay2play.local
overview: Update the Caddy reverse proxy to avoid IPv6 connection-refused errors against the Firebase hosting emulator and simplify app.pay2play.local to HTTP-only for local development.
todos:
  - id: update-caddyfile-ipv4-http
    content: Update Caddyfile to use 127.0.0.1 backends and HTTP-only site blocks for app.pay2play.local, pay2play.local, and venues.pay2play.local
    status: completed
  - id: reload-caddy-test-routing
    content: Reload Caddy and validate that http://app.pay2play.local/ correctly proxies to the Firebase hosting emulator at 127.0.0.1:5002 without SSL issues
    status: completed
---

### Fix Caddy backend connection and SSL behavior for app.pay2play.local

**Goal:** Make `http://app.pay2play.local/` reliably load the player app (currently on `http://127.0.0.1:5002`) without SSL issues, and remove HTTPS for this local domain.

---

### 1. Diagnose the current failure

- **Symptom from logs** (Caddy output):
  - `dial tcp [::1]:5002: connect: connection refused `with `host": "app.pay2play.local"` and `status": 502`.
- **Root cause:**
  - Caddy uses `reverse_proxy localhost:5002` for `app.pay2play.local` (see [`Caddyfile`](/Users/lionking/Pay2Play/code/Pay2Play/Caddyfile)).
  - On macOS, `localhost` resolves to both IPv4 (`127.0.0.1`) and IPv6 (`::1`).
  - Firebase hosting emulator is listening on `127.0.0.1:5002` **only**, so when Caddy tries to connect to `[::1]:5002`, the backend connection is refused, producing the 502.
- **Additional behavior:**
  - Caddy auto-enables HTTPS and local certificates (`http.auto_https` + `tls.obtain` logs), which can also cause SSL warnings in the browser if the cert isn’t fully trusted.

---

### 2. Update Caddyfile to use IPv4 and HTTP-only

**File:** [`Caddyfile`](/Users/lionking/Pay2Play/code/Pay2Play/Caddyfile)

1. **Force IPv4 loopback for all backends** to avoid the `::1` issue:

   - Change each `reverse_proxy localhost:PORT` to `reverse_proxy 127.0.0.1:PORT`:
     - `pay2play.local` → `reverse_proxy 127.0.0.1:5001`
     - `app.pay2play.local` → `reverse_proxy 127.0.0.1:5002`
     - `venues.pay2play.local` → `reverse_proxy 127.0.0.1:5007`

2. **Disable automatic HTTPS for local dev** so `app.pay2play.local` serves plain HTTP:

   - For each site block (`pay2play.local`, `app.pay2play.local`, `venues.pay2play.local`), add:
     ```
     http://<domain> {
       reverse_proxy 127.0.0.1:<port>
     }
     ```

   - And **remove or comment out** the TLS/HTTPS-inducing configuration by:
     - Using `http://` scheme on the site labels.
     - Ensuring there is no explicit `tls` directive or `auto_https` behavior for these local domains.
   - The final intent is that visiting `http://app.pay2play.local/` uses HTTP only and simply proxies to `http://127.0.0.1:5002`.

*(We’ll keep the config minimal and focused on HTTP to avoid any SSL prompts during local dev.)*

---

### 3. Reload Caddy and validate routing

1. **Restart/reload Caddy** from the project root (where `Caddyfile` lives):

   - If running in the foreground: stop it and re-run with `caddy run --config Caddyfile`.
   - If running as a service: use the appropriate `caddy reload` or service restart command.

2. **Validation steps:**

   - Ensure Firebase emulators are running (e.g. `yarn emulators`).
   - In a browser:
     - Open `http://127.0.0.1:5002/sign-in` and confirm the player app loads (baseline check).
     - Open `http://app.pay2play.local/` and verify the same content loads **without HTTPS warnings**.
   - Watch the Caddy logs:
     - Confirm there are no more `dial tcp [::1]:5002` errors.
     - Confirm requests to `app.pay2play.local` show successful proxying to `127.0.0.1:5002`.

---

### 4. Optional cleanup / hardening

- Optionally run `caddy fmt --overwrite` on the `Caddyfile` to apply consistent formatting.
- If you later want HTTPS again for local, we can:
  - Re-introduce TLS via Caddy’s automatic HTTPS,
  - Ensure your OS trusts Caddy’s local CA,
  - But keep the backends pinned to `127.0.0.1` to avoid the IPv6 issue.
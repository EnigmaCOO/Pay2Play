---
name: Fix hosts file and setup local domain routing
overview: Fix the /etc/hosts file format (remove invalid port syntax) and set up Caddy reverse proxy to route app.pay2play.local:80 to localhost:5002, then validate in browser.
todos:
  - id: fix_hosts
    content: Fix /etc/hosts file - remove port numbers from hostname entries
    status: completed
  - id: install_caddy
    content: Install Caddy reverse proxy using Homebrew
    status: completed
  - id: create_caddyfile
    content: Create Caddyfile with reverse proxy rules for all three domains
    status: completed
  - id: update_firebase_config
    content: Verify/update firebase.json to use port 5007 for venue-dashboard
    status: completed
  - id: start_caddy
    content: Start Caddy reverse proxy server
    status: completed
  - id: validate_browser
    content: Validate http://app.pay2play.local/ loads correctly in browser
    status: completed
---

# Fix Hosts File and Setup Local Domain Routing

## Problem

The `/etc/hosts` file has invalid syntax - it includes port numbers (`127.0.0.1:5001`), but hosts files only map hostnames to IP addresses, not ports. To access `http://app.pay2play.local/` (without a port) and route it to `127.0.0.1:5002`, we need a reverse proxy.

## Solution Overview

1. Fix `/etc/hosts` file format (remove port numbers)
2. Install and configure Caddy reverse proxy
3. Configure Caddy to route domains to correct ports
4. Validate routing in browser

## Implementation Steps

### 1. Fix `/etc/hosts` File

**File:** `/etc/hosts`

Remove port numbers from hostname entries. The hosts file should only contain:

```
127.0.0.1  pay2play.local
127.0.0.1  app.pay2play.local
127.0.0.1  venues.pay2play.local
```

**Note:** This requires sudo access to edit `/etc/hosts`.

### 2. Install Caddy

Install Caddy using Homebrew (macOS):

```bash
brew install caddy
```

### 3. Create Caddy Configuration

**File:** `Caddyfile` (project root)

Create a Caddyfile with reverse proxy rules:

```
pay2play.local {
    reverse_proxy localhost:5001
}

app.pay2play.local {
    reverse_proxy localhost:5002
}

venues.pay2play.local {
    reverse_proxy localhost:5007
}
```

### 4. Start Caddy

Run Caddy with the configuration:

```bash
caddy run --config Caddyfile
```

Or run as a service:

```bash
caddy start --config Caddyfile
```

### 5. Update Firebase Hosting Emulator Port

**File:** `firebase.json`

Verify that the hosting emulator for `pay2play-venues` uses port 5007 (currently shows 5003 in the config). Update if needed:

```json
"pay2play-venues": {
  "port": 5007
}
```

### 6. Validation Steps

1. Ensure Firebase emulators are running (`pnpm dev`)
2. Ensure Caddy is running
3. Open browser and navigate to `http://app.pay2play.local/`
4. Verify it loads the player app from port 5002
5. Test other domains:

   - `http://pay2play.local/` → port 5001
   - `http://venues.pay2play.local/` → port 5007

## Alternative: Simple Node.js Proxy (if Caddy is not preferred)

If you prefer not to install Caddy, we can create a simple Node.js proxy server using `http-proxy-middleware` or Express, but Caddy is simpler and handles HTTPS automatically.

## Files to Modify/Create

- `/etc/hosts` - Fix hostname entries (remove ports)
- `Caddyfile` - Create Caddy reverse proxy configuration
- `firebase.json` - Verify/update venue dashboard port to 5007

## Notes

- Caddy will run on port 80 (HTTP) and 443 (HTTPS) by default, requiring sudo for binding
- Alternatively, run Caddy on a non-privileged port (e.g., 8080) and access via `http://app.pay2play.local:8080/`
- For production-like local development, running on port 80 is ideal but requires admin privileges
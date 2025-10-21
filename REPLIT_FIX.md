# Fix .replit Configuration

## The Problem

Your `.replit` file currently has configuration for a **different project** (pnpm + Prisma + monorepo). 
This is why clicking the "Run" button shows "Your app crashed".

Your actual project uses: **npm + Drizzle + single package**

## The Solution

You need to manually update two protected files. Copy the contents below:

---

## 1. Update `.replit` File

**Location:** `.replit` (root of your project)

**Replace entire contents with:**

```
run = "bash -lc 'npm install && npm run dev'"
language = "nodejs"
env = { PORT = "5000" }

[nix]
channel = "stable-25_05"

[[ports]]
localPort = 5000
externalPort = 80
```

**What this does:**
- `npm install` - Ensures dependencies are installed
- `npm run dev` - Starts your Express+Vite unified server
- `PORT = "5000"` - Sets the correct port
- Removes all pnpm/Prisma/monorepo commands

---

## 2. Update `replit.nix` File

**Location:** `replit.nix` (root of your project)

**Replace entire contents with:**

```nix
{ pkgs }:
{
  deps = [
    pkgs.nodejs_20
    pkgs.git
    pkgs.openssl
  ];
}
```

**What this does:**
- Ensures Node.js 20 is available
- Includes git and openssl (required by some npm packages)

---

## 3. How to Update These Files

### Option A: Using Replit UI
1. Click on `.replit` file in the file tree
2. Select all content (Ctrl+A / Cmd+A)
3. Delete and paste the new content from above
4. Save (Ctrl+S / Cmd+S)
5. Repeat for `replit.nix`

### Option B: Using Shell
```bash
# Backup current files
cp .replit .replit.backup
cp replit.nix replit.nix.backup

# Then manually edit using nano or vim
nano .replit
nano replit.nix
```

---

## 4. After Updating

1. **Click the green "Run" button** (or click "Stop" then "Run" if already running)
2. You should see:
   ```
   11:XX:XX AM [express] serving on port 5000
   🕐 Starting auto-cancel scheduler...
   ```
3. **Refresh the webview** and your app will load!

---

## Alternative: Keep Using Shell

If you prefer not to modify these files, you can always run in the Shell:

```bash
npm run dev
```

This works perfectly and doesn't require changing the protected files.

---

## What Your App Does

Once running, your P2P Sports Platform includes:
- ✅ Venue booking system (Cricket, Football, Padel)
- ✅ Pickup games with auto-cancel and refunds
- ✅ Payment processing with webhooks
- ✅ League management with fixtures
- ✅ Partner venue dashboard
- ✅ Mock notifications (Firebase/Expo blocked by Nix)

Access at: `http://localhost:5000`
- Frontend: React app (Vite)
- Backend: API at `/api/*`
- Health check: `/api/health`

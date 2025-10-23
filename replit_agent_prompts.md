
# P2P Platform - AI Agent Build Orchestration

## 🎯 MISSION
Build a production-ready, 3-platform sports booking ecosystem (Web + iOS + Android) for Pakistan market with real-time payments, matchmaking, and league management.

---

## 📦 DEPENDENCIES

### Core Backend
```bash
npm install drizzle-orm postgres express cors dotenv zod node-cron axios crypto-js posthog-js @sentry/node
```

### Mobile (install in /mobile directory)
```bash
cd mobile
npm install expo expo-firebase-auth @tanstack/react-query @react-native-async-storage/async-storage
```

### Database Extension
```sql
CREATE EXTENSION postgis;
```

---

## 🔐 ENVIRONMENT VARIABLES

Required in `.env`:
```env
# Database
DATABASE_URL=

# Firebase Auth
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Payment Providers
PAYMENT_PROVIDER=mock
PAYMOB_API_KEY=
PAYMOB_INTEGRATION_ID=
PAYMOB_HMAC_SECRET=

# Webhooks
PROVIDER_WEBHOOK_SECRET=

# Email (optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CONTACT_TO=

# Mobile (optional)
EXPO_ACCESS_TOKEN=

# Observability
POSTHOG_API_KEY=
SENTRY_DSN=
```

---

## 🚀 13-STAGE BUILD PLAN

### **Stage 1 – Core Stabilization**
**Objective:** Fix module resolution and ensure server starts cleanly.

**Tasks:**
1. Fix `@db/schema` import paths (use `@shared/schema` instead)
2. Update all imports in `server/auto-cancel.ts`, `server/routes.ts`, `server/storage.ts`
3. Verify no Prisma references remain (this is a Drizzle project)
4. Test health endpoint

**Verification:**
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok","timestamp":"..."}
```

**Commit:** `fix: resolve module paths and remove Prisma references`

---

### **Stage 2 – Scheduler Hardening**
**Objective:** Ensure auto-cancel scheduler runs reliably.

**Tasks:**
1. Add error boundaries to `checkAndCancelUnderfilledGames()`
2. Implement retry logic for failed DB queries
3. Add scheduler health logging
4. Test with mock underfilled game

**Verification:**
Check logs for:
```
🕐 Starting auto-cancel scheduler (runs every 5 minutes)
🔍 Checking for underfilled games...
✅ Auto-cancel check complete
```

**Commit:** `feat: harden auto-cancel scheduler with retries`

---

### **Stage 3 – Persistence Layer**
**Objective:** Optimize database queries and add indexes.

**Tasks:**
1. Add indexes to `games` table: `status`, `startTime`
2. Add indexes to `paymentEvents` table: `eventId`, `createdAt`
3. Create composite index on `gamePlayers(gameId, userId)`
4. Run migration

**Verification:**
```bash
npm run db:push
```

**Commit:** `perf: add database indexes for queries`

---

### **Stage 4 – Mobile App Foundation**
**Objective:** Complete React Native + Expo setup.

**Tasks:**
1. Navigate to `mobile/` directory
2. Install mobile-specific dependencies
3. Configure Firebase Auth in `app.config.js`
4. Test OTP login flow
5. Connect to unified API

**Verification:**
- Login screen loads
- OTP verification works
- API calls reach backend

**Commit:** `feat: complete mobile app setup with Firebase Auth`

---

### **Stage 5 – Offline Caching**
**Objective:** Add offline support for mobile app.

**Tasks:**
1. Configure React Query persistence
2. Implement AsyncStorage adapter
3. Add offline indicators in UI
4. Test with network disabled

**Verification:**
- Games list loads from cache when offline
- "Offline" badge appears in UI

**Commit:** `feat: add offline caching with React Query`

---

### **Stage 6 – Payment Integration**
**Objective:** Switch from mock to real payment provider.

**Tasks:**
1. Complete `PaymobAdapter` implementation
2. Add Paymob API authentication
3. Implement payment intent creation
4. Test with Paymob sandbox

**Verification:**
- Create test payment
- Verify webhook receives callback
- Check payment status updates

**Commit:** `feat: integrate Paymob payment gateway`

---

### **Stage 7 – Webhook Security**
**Objective:** Harden webhook endpoints.

**Tasks:**
1. Implement HMAC signature verification
2. Add rate limiting to webhook endpoints
3. Create idempotency layer for events
4. Add webhook retry logic

**Verification:**
- Invalid signatures rejected with 401
- Duplicate events handled correctly
- Rate limit blocks spam

**Commit:** `feat: secure webhooks with HMAC and rate limiting`

---

### **Stage 8 – Geolocation Search**
**Objective:** Add location-based venue search.

**Tasks:**
1. Enable PostGIS extension
2. Add `location` column to `venues` table (geography type)
3. Implement `/api/venues/nearby?lat=&lng=&radius=` endpoint
4. Add distance calculation
5. Test with Lahore coordinates

**Verification:**
```bash
curl "http://localhost:5000/api/venues/nearby?lat=31.5497&lng=74.3436&radius=5"
```

**Commit:** `feat: add geolocation-based venue search`

---

### **Stage 9 – Smart Matchmaking**
**Objective:** Improve team balance in pickup games.

**Tasks:**
1. Add skill rating to user profiles
2. Create team balancing algorithm
3. Auto-assign teams when game fills
4. Send team assignments via notifications

**Verification:**
- Teams balanced by skill level
- Players notified of assignments

**Commit:** `feat: add skill-based team matchmaking`

---

### **Stage 10 – Venue Dashboard V2**
**Objective:** Empower partner venues.

**Tasks:**
1. Add calendar slot editor with drag interface
2. Create pricing rule manager
3. Add promo code system
4. Build utilization metrics dashboard
5. Generate payout reports (CSV export)

**Verification:**
- Venue partner can create/edit slots
- Dashboard shows bookings metrics
- Payout CSV downloads correctly

**Commit:** `feat: partner dashboard v2 with analytics`

---

### **Stage 11 – Reviews & Trust System**
**Objective:** Build reliability via feedback.

**Tasks:**
1. Create `reviews` table (rating, comment, userId, venueId/gameId)
2. Add post-game review prompt
3. Track no-shows and assign badges
4. Display average ratings on venues/players

**Verification:**
- Reviews appear under venues
- Badges show on user profiles
- No-show tracking works

**Commit:** `feat: add reviews and trust system`

---

### **Stage 12 – Observability**
**Objective:** Track performance and issues.

**Tasks:**
1. Integrate PostHog analytics
2. Add Sentry error tracking
3. Implement rate limiting middleware
4. Set up automated DB backups
5. Add feature flags: `ENABLE_PADEL`, `PAYMENT_PROVIDER`

**Verification:**
- PostHog dashboard receives events
- Sentry captures errors
- Feature flags toggle correctly

**Commit:** `chore: add observability with PostHog and Sentry`

---

### **Stage 13 – Store Launch Prep**
**Objective:** Publish mobile apps to stores.

**Tasks:**
1. Configure EAS builds for iOS/Android
2. Add app icons and splash screens
3. Generate store metadata and screenshots
4. Submit to TestFlight (iOS) and Internal Testing (Android)
5. Test on physical devices

**Verification:**
- EAS build completes successfully
- App installs on test devices
- All features work in production build

**Commit:** `release: mobile store preparation complete`

---

## 🧪 VERIFICATION MATRIX

| Stage | Command/Action | Expected Result |
|-------|----------------|-----------------|
| 1 | `curl http://localhost:5000/api/health` | `{"status":"ok"}` |
| 2 | Check logs after 10 seconds | Scheduler runs successfully |
| 3 | `npm run db:push` | Migration applied |
| 4 | Login on mobile | OTP verification works |
| 5 | Disable network | App loads cached data |
| 6 | Create test payment | Paymob redirects correctly |
| 7 | Send invalid signature | 401 Unauthorized |
| 8 | Query nearby venues | Returns venues within radius |
| 9 | Fill game to max | Teams auto-assigned |
| 10 | Access dashboard | Metrics display correctly |
| 11 | Submit review | Shows under venue |
| 12 | Trigger error | Sentry logs it |
| 13 | `eas build --platform all` | APK/IPA generated |

---

## 🧭 EXECUTION ORDER

Execute stages **sequentially**. Do not proceed to next stage until current stage verification passes.

1. ✅ Core stabilization
2. ✅ Scheduler hardening
3. ⏳ Persistence (CURRENT)
4. ⏳ Mobile app
5. ⏳ Offline caching
6. ⏳ Payments
7. ⏳ Webhooks
8. ⏳ Geolocation
9. ⏳ Matchmaking
10. ⏳ Dashboard
11. ⏳ Reviews
12. ⏳ Observability
13. ⏳ Store launch

---

## 🔧 CURRENT ISSUES TO FIX

### Critical Path Blockers:
1. **Module resolution error:** `@db/schema` doesn't exist (use `@shared/schema`)
2. **Prisma references:** Project uses Drizzle, not Prisma
3. **Workflow configuration:** `.replit` file references pnpm/Prisma

### Fix Script:
```bash
# 1. Fix imports
find server -type f -name "*.ts" -exec sed -i 's/@db\/schema/@shared\/schema/g' {} +

# 2. Verify drizzle-kit is installed
npm install drizzle-kit --save-dev

# 3. Run migration
npm run db:push

# 4. Start server
npm run dev
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Replit Configuration
```toml
# .replit
run = ["npm", "run", "dev"]
language = "nodejs"

[env]
PORT = "5000"

[deployment]
run = ["npm", "start"]
build = ["npm", "run", "build"]
```

### Port Binding
- Server MUST bind to `0.0.0.0:5000` (not localhost)
- This is the only non-firewalled port
- Mapped to 80/443 in production

---

## ✅ AGENT AUTONOMY RULES

1. **Read verification output** before proceeding
2. **Commit after each stage** with descriptive message
3. **Log all actions** to console
4. **Stop on errors** and report to user
5. **Test endpoints** before marking stage complete

---

## 📞 SUPPORT CONTACTS

- **Technical Issues:** Check `server/index.ts` logs
- **Payment Issues:** Verify webhook signatures
- **Mobile Issues:** Check Expo logs with `npx expo start`

---

**Last Updated:** 2025-01-23
**Agent Version:** P2P-v1.0.0
**Target Launch:** Q1 2025

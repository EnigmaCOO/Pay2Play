# P2P Sports Platform

## Overview

P2P (Pay 2 Play) is a unified sports booking and matchmaking platform for Lahore, Pakistan. The application enables users to book sports facilities, join pickup games, organize leagues, and manage payments across multiple sports (Cricket, Football/Futsal, and Padel). The platform serves three primary user types: players who book and join games, venue partners who manage facilities, and league organizers who run tournaments.

The system combines a mobile-first web application for players with a comprehensive venue dashboard for facility management. Core features include OTP-based authentication via Firebase, real-time slot booking, integrated payment processing, pickup game matchmaking with automatic refunds, league fixture generation, and push notifications for game updates.

## How to Run the Application

### 🚨 **IMPORTANT: .replit File Needs Fixing**

Your `.replit` file has **wrong configuration** for a different project (pnpm/Prisma/monorepo). 
This is why clicking "Run" shows "Your app crashed".

**📖 SEE `REPLIT_FIX.md` FOR COMPLETE FIX INSTRUCTIONS**

### **Quick Start (Until You Fix .replit):**

Open the Shell and run:
```bash
npm run dev
```

You'll see:
```
11:XX:XX AM [express] serving on port 5000
🕐 Starting auto-cancel scheduler (runs every 5 minutes, first run in 10 seconds)
```

Then **refresh the webview** and your app loads!

### **What Runs:**
- ✅ Express server on port 5000 (binds to 0.0.0.0)
- ✅ Vite dev server for React frontend (integrated into Express)
- ✅ All API routes at `/api/*`
- ✅ Auto-cancel scheduler (checks underfilled games every 5 minutes)
- ✅ Health endpoint at `/api/health`

### **Verify It's Working:**

```bash
curl http://localhost:5000/api/health
# Returns: {"status":"ok","timestamp":"..."}
```

### **After Fixing .replit (see REPLIT_FIX.md):**

Once you update `.replit` and `replit.nix` files:
1. Click the green **"Run"** button
2. Server starts automatically
3. Webview shows your app!

### **Project Architecture:**
- **Unified Server**: Single Express process serves both API and frontend
- **Backend**: `server/` - Express + Drizzle ORM + PostgreSQL
- **Frontend**: `client/` - Vite + React (served by Express)
- **Package Manager**: npm (single package.json at root)
- **Database**: Drizzle ORM with `npm run db:push` (not Prisma)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for component-based UI
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for server state management and API data fetching
- Tailwind CSS with shadcn/ui component library for styling
- React Hook Form with Zod for form validation

**Design System:**
- Custom theming with light/dark mode support
- Sport-specific color schemes (Cricket: Orange, Football: Blue, Padel: Purple)
- Primary brand color: Vibrant teal-green (HSL 142 71% 45%)
- Typography: Inter (body), Outfit (headings/display)
- Component variants using class-variance-authority for consistent styling

**Application Structure:**
- Monorepo structure with `client/` directory for web app
- Path aliases: `@/` for client source, `@shared/` for shared types
- Main pages: Landing, Games (list/detail), Create Game, Venues, Leagues, Dashboard
- Debug utility for push token registration

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js for REST API
- TypeScript with ES Modules
- Drizzle ORM for database access (PostgreSQL via Neon serverless)
- Server runs on port 3001, web client on port 3000

**Core Modules:**

1. **Authentication & Users**
   - Firebase-based OTP authentication (phone/email)
   - User management with push token storage for notifications
   - No session-based auth shown; likely token-based via Firebase

2. **Venue & Booking System**
   - Venues with associated fields (sports facilities)
   - Time slots for field availability
   - Booking engine with status tracking (pending, confirmed, cancelled)
   - Payment integration tied to bookings

3. **Pickup Games & Matchmaking**
   - User-created games with min/max player requirements
   - Pay-to-join model with per-player pricing
   - Game states: open → confirmed → filled → completed/cancelled
   - Automatic cancellation with refunds if minimum players not reached 30 minutes before start
   - Real-time player count tracking

4. **Payment Processing**
   - Mock payment provider for development (simulated webhook callbacks)
   - HMAC signature verification for webhook security
   - Payment intents for bookings and game joins
   - Refund system for cancelled games

5. **Leagues & Tournaments**
   - Season management with multiple teams
   - Round-robin fixture generation
   - Match scheduling and standings tracking
   - Sport-specific league organization

6. **Notification System**
   - Push notifications via Expo (currently mocked)
   - Notifications for: game joins, cancellations, refunds, confirmations
   - User-specific push token management

**Data Model:**
- Users (Firebase UID, contact info, push tokens)
- Venues → Fields → Slots (hierarchical relationship)
- Bookings (user + slot + payment)
- Games → GamePlayers + GamePayments
- Seasons → Teams → Fixtures
- Payments & Refunds with status tracking

**Auto-Cancellation Scheduler:**
- Background job checking for underfilled games
- Triggers 30 minutes before game start time
- Automatically issues refunds and sends notifications

**API Patterns:**
- RESTful endpoints under `/api/` prefix
- CRUD operations for all major entities
- Search/filter endpoints for slots and games
- Webhook endpoints for payment provider callbacks
- Mock webhook endpoints for development testing

### External Dependencies

**Database:**
- PostgreSQL (Neon serverless provider)
- Connection pooling via `@neondatabase/serverless`
- WebSocket support for serverless connections
- Drizzle ORM for type-safe queries and migrations

**Authentication Service:**
- Firebase Authentication
- Required environment variables:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

**Payment Provider:**
- Mock provider for development
- Webhook signature verification using HMAC-SHA256
- Environment variable: `PROVIDER_WEBHOOK_SECRET`
- Designed for easy swap to real provider (Stripe/PayPal pattern)

**SMS Service (Optional):**
- Twilio for OTP delivery
- Environment variables:
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_FROM`

**Push Notifications:**
- Expo Push Notification service (implementation pending)
- Current implementation uses mock service for development
- Stores Expo push tokens per user

**UI Component Library:**
- Radix UI primitives for accessible components
- shadcn/ui configuration for styled variants
- Lucide React for icons

**Development Tools:**
- Postman collection included for API testing
- Replit-specific plugins for development environment
- TypeScript strict mode for type safety
- ESBuild for server bundling in production
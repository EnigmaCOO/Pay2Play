# prisma/ Directory

## Purpose

This directory was originally intended to hold the database schema definition using the Prisma ORM.

## Goal State

Ideally, this directory would contain a single, comprehensive `schema.prisma` file that defines the entire data model for the Pay2Play application. This includes tables for users, venues, bookings, payments, player wallets, teams, tournaments, and ratings.

## Implementation & Integration

**Current Status:** This directory contains a `schema.prisma` file that appears to be a remnant of a previous technical stack. The project has since migrated to using **Drizzle ORM**, and the active, canonical database schema is now defined in `/shared/schema.ts`.

**Action Required:** A decision must be made regarding this directory:
1.  **Remove:** To avoid confusion, this directory and its contents should be removed from the project, and all database development should focus on the Drizzle schema in `/shared/schema.ts`.
2.  **Migrate Back:** If Prisma is preferred over Drizzle, the project should be formally migrated back. This would involve updating the schema here to match the current application needs and replacing all Drizzle-related code in the `/functions` directory with Prisma Client calls.

Until a decision is made, this directory should be considered **deprecated and inactive**.

# shared/ Directory

## Purpose

This directory is designed to hold code that is shared across different parts of the Pay2Play application, primarily between the backend (`/functions`) and the frontend (`/client`). This prevents code duplication and ensures consistency.

## Goal State

A centralized and lean module for all shared code, which primarily includes:
- **Database Schema:** The single source of truth for the database structure.
- **Type Definitions:** Shared TypeScript types and interfaces that define the shape of data exchanged between the client and server.
- **Validation Schemas:** Reusable validation logic (e.g., using Zod) that can be applied on both the client and server side.

## Implementation & Integration

This directory currently contains `schema.ts`, which is the most critical file in the repository as it defines the entire database schema using **Drizzle ORM**.

- **Integration:**
    - The **backend** (`/functions`) imports the schema from this file to initialize Drizzle and perform all database operations.
    - The **frontend** (`/client`) can import types derived from this schema to ensure type safety when handling API responses.
- **Future Development:** Any new data models (tables) or complex types that need to be understood by both the frontend and backend must be defined here. This is the foundation of the application's data architecture.

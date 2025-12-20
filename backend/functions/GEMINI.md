# functions/ Directory

## Purpose

This directory contains all the backend logic for the Pay2Play application. It is structured as a Node.js project and is intended to be deployed as a set of serverless functions (e.g., Firebase Functions). It handles all business logic, database interactions, and communication with third-party services.

## Goal State

A robust, scalable, and secure backend that fully implements all features outlined in the `GEMINI.md` and `TODO.md`. This includes:
- **Complete API:** A comprehensive set of RESTful API endpoints for all frontend features, including bookings, user profiles, games, and payments.
- **Secure Payment Integration:** Full integration with Stripe, EasyPaisa, and JazzCash for processing payments, handling payouts to venues, and managing refunds.
- **Player Wallets & Authentication:** Backend support for the player wallet system and a secure authentication system (OTP/Google/Apple).
- **Automated Processes:** The fully enhanced automated cancellation and refund engine, plus any future AI-driven features like weather prediction.
- **Tournament & League Management:** The complete backend logic for the Tournament Management Suite.

## Implementation & Integration

This is a Node.js application written in TypeScript.
- **Framework:** It uses Express.js to define API routes (`routes.ts`).
- **Database:** It interacts with the PostgreSQL database via the Drizzle ORM, with the schema defined in `/shared/schema.ts`.
- **Deployment:** It is configured for deployment as serverless functions, as seen in `firebase.json` and `apphosting.yaml`.
- **Integration:** It serves as the single source of truth for the `client` application. All data is fetched from and sent to the endpoints defined here. It will also integrate with external services like payment gateways and potentially notification services.

# client/ Directory

## Purpose

This directory contains the main web application for Pay2Play. It is the primary interface for players to discover, book, and manage their sporting activities.

## Goal State

A fully-featured, responsive, and mobile-optimized web application that delivers a seamless user experience. It will implement all player-facing features outlined in the main `GEMINI.md` and `TODO.md`, including:
- **Instant Pitch Booking:** A smooth, 60-second booking process.
- **Player Dashboard:** A central hub for users to view their booking history and manage their joined or hosted games.
- **Secure Checkout & Player Wallets:** Full integration with payment gateways (Stripe, EasyPaisa, JazzCash) and an in-app wallet system.
- **Team Finder:** The complete UI for finding and joining pickup games.
- **Venue & Game Discovery:** Pages for browsing venues and available games.

## Implementation & Integration

This is a React application built with Vite and styled with Tailwind CSS and shadcn/ui components. It communicates with the backend via API calls to the endpoints defined in the `/functions` directory. 

- **State Management:** Uses React Query for managing server state (caching data from the backend) and standard React hooks for local UI state.
- **Authentication:** Will integrate with the new authentication system to manage user sessions.
- **Project Structure Note:** This directory holds the core frontend code. For better monorepo organization, its contents should eventually be migrated to the `/apps/web` directory.

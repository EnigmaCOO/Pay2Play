# apps/web/ Directory

## Purpose

This directory contains the main web application for Pay2Play. It serves as the primary interface for players to find, book, and manage their games.

## Goal State

A fully-featured, responsive, and mobile-optimized web application that delivers a seamless user experience. It will implement all player-facing features outlined in the main `GEMINI.md` and `TODO.md`, including:
- Instant Pitch Booking
- Player Dashboard (booking history, joined/hosted games)
- Secure Checkout and Payment Flows
- Team Finder and Game Listings

## Implementation & Integration

This is a React application built with Vite and styled with Tailwind CSS and shadcn/ui components. It is located in the `/client` directory (a project structure inconsistency to be resolved). It interacts with the backend by making API calls to the endpoints defined in the `/functions` directory. The application state is managed using React Query for server state and React hooks for local state.

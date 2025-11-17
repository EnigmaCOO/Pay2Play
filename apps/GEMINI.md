# apps/ Directory

## Purpose

This directory houses the various applications within the Pay2Play ecosystem. It follows a monorepo pattern, allowing for shared code and streamlined development across different platforms.

## Goal State

This directory will contain all user-facing applications, including:
- The main **web application** for players.
- A potential future **mobile application** for a native experience.
- A dedicated application or dashboard for **venue owners**.

## Implementation & Integration

Each subdirectory within `apps/` is a self-contained application with its own dependencies and build process. They all integrate with the central backend APIs defined in the `/functions` directory and utilize the shared database schema.

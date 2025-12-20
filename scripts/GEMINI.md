# scripts/ Directory

## Purpose

This directory stores utility scripts for automating development, administrative, and operational tasks. These scripts are not part of the main application runtime but are crucial for maintaining the development environment and managing data.

## Goal State

A collection of well-documented and robust scripts that automate common tasks, including:
- **Database Seeding:** A comprehensive script (`seed.ts`) that can populate the database with realistic test data for all models (users, venues, bookings, games, etc.) to facilitate testing and development.
- **Data Migration:** Scripts to handle future database schema changes and data migrations.
- **Deployment Automation:** Scripts that could assist in the build and deployment process.
- **Data Cleanup:** Scripts for cleaning up old or irrelevant data from the database.

## Implementation & Integration

Scripts in this directory are written in TypeScript and are typically executed using `pnpm` scripts defined in `package.json`. They can import modules from other parts of the project, such as the database schema and ORM from `/shared` and `/functions`, to interact directly with the database. The existing `seed.ts` script serves as a foundation and should be expanded to cover all data models as the application grows.

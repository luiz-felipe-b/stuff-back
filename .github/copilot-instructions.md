# Copilot Instructions for AI Coding Agents

This document provides guidance for AI coding agents working in this codebase. Follow these instructions to maximize productivity and maintain code quality.

## Architecture Overview
- **Backend:** TypeScript, Fastify, Drizzle ORM (PostgreSQL)
- **Frontend:** React (integrated via API)
- **Build Tools:** Vite (SSR, ES modules), pnpm
- **Containerization:** Docker (multi-stage builds)
- **Validation:** Zod schemas for API and DB

## Key Conventions
- **TypeScript:**
  - Use strict types; prefer explicit null/undefined handling.
  - Use `skipLibCheck` for Drizzle ORM type issues.
  - Organize code by service/repository/controller pattern.
- **Database:**
  - Migrations in `src/db/migrations/`.
  - Schemas in `src/db/schemas/` (Zod + Drizzle).
  - Foreign keys and unique constraints must match schema definitions.
- **API:**
  - Validate all requests/responses with Zod.
  - Return errors using custom error classes in `src/http/lib/util/errors/`.
  - Ensure nullability and array/object types match Zod schemas.
- **Assets/Attributes Logic:**
  - Aggregate attribute values using Map-based grouping.
  - Always return consistent structure for asset/attribute endpoints.
- **Frontend Integration:**
  - Use unique keys for React lists (avoid index as key).
  - Align API response structure with frontend validation.

## Build & Run Workflow
- **Build:** `pnpm build` (Vite, outputs ES modules)
- **Run:** `pnpm start` or `node dist/http/server.js` (SSR entry)
- **Docker:** Use provided `Dockerfile` and `docker-compose.yml` for production.

## Error Handling
- Use custom error classes for API errors.
- Always propagate errors with meaningful messages.
- Validate all external data (API, DB, env).

## Example Patterns
- **Service/Repository:**
  - Service checks existence, handles errors, calls repository.
  - Repository performs DB operations, returns typed results.
- **Schema Alignment:**
  - Zod schemas must match DB schema and API responses.
- **Asset Aggregation:**
  - Use Map to group attributes by asset ID, return as array/object per API contract.

## Integration Points
- **Fastify:** API server in `src/http/app.ts`, routes in `src/http/routes.ts`.
- **Drizzle ORM:** DB connection in `src/db/connection.ts`, migrations in `src/db/migrations/`.
- **Frontend:** Consumes API, expects validated responses.

## Additional Notes
- Keep code modular and type-safe.
- Document new endpoints and schemas.
- Update this file if conventions change.

---
_Last updated: 2024-06_

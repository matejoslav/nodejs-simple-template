# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Build:** `npm run build` (runs `tsc`, outputs to `dist/`)
- **Dev server:** `npm run dev` (runs `ts-node src/index.ts`)
- **Run tests:** `npm test`
- **Run single test:** `npx jest path/to/file.test.ts`
- **Start production:** `npm start` (runs `node dist/index.js`)

## Architecture

TypeScript/Express backend service that proxies weather data from the Open-Meteo API. Uses **tsyringe** for dependency injection with decorator-based constructor injection.

### Layered structure

- **Routes** (`src/routes/`) — Express routers that resolve controllers from the DI container and wire up HTTP endpoints
- **Controllers** (`src/controllers/`) — Parse/validate request params, delegate to services, format HTTP responses
- **Services** (`src/services/`) — Business logic and validation
- **Repositories** (`src/repositories/`) — External API calls (Open-Meteo); map third-party response shapes to internal interfaces

### Dependency injection

- DI container configured in `src/config/container.ts` using tsyringe
- Injection tokens defined as string constants in `src/config/tokens.ts`
- Interfaces for each injectable live in `src/interfaces/`
- Classes use `@injectable()` and `@inject(TOKENS.X)` decorators
- `reflect-metadata` must be imported before any DI usage (tests import it at top of file)

### API

- `GET /api/weather?lat={latitude}&lon={longitude}` — returns current weather + 7-day forecast
- `GET /health` — health check

### Environment

Requires a `.env` file with `OPEN_METEO_API_URL` (base URL for the Open-Meteo forecast endpoint).

### Testing patterns

Tests use Jest with ts-jest. Each layer is unit tested by manually constructing the class with mock dependencies (no DI container in tests). Repository tests spy on `globalThis.fetch`.

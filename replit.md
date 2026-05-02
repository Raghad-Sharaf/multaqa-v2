# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the **Multaqa** coworking space booking platform prototype.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server)
- **Database**: PostgreSQL + Drizzle ORM (provisioned but unused in prototype)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Multaqa (react-vite) — preview path: `/`
A fully clickable web prototype for a coworking space booking platform targeting Palestine. All data is hardcoded in React context — no backend calls.

**18 screens:**
- `/` — Homepage / Landing
- `/desks` — Desk Browsing (Nablus/Ramallah toggle, filters)
- `/desks/:id` — Desk Detail (amenities, reviews, Book CTA)
- `/rooms` — Room Browsing
- `/rooms/:id` — Room Detail
- `/book/step1` — Booking Step 1 (date/time picker)
- `/book/step2` — Booking Step 2 (review + guest email + cash payment)
- `/book/confirmation` — Booking Confirmation
- `/my-reservations` — My Reservations (logged-in only)
- `/my-reservations/modify/:id` — Modify Booking
- `/login` — Login (simulated, any credentials work; "admin" email → admin role)
- `/register` — Registration
- `/community` — Who's In The Space Today
- `/admin` — Admin Dashboard Overview
- `/admin/bookings` — Admin All Bookings
- `/admin/unpaid` — Admin Unpaid Cash Bookings
- `/admin/seats` — Admin Seat Management
- `/admin/create-booking` — Admin Create Booking

**Brand colors:**
- Primary Orange: `#FF5100`
- Navy Dark: `#001279`
- Mid Gray: `#535060`
- Success Green: `#1A7A4A`
- Error Red: `#CC1A00`

**Key files:**
- `artifacts/multaqa/src/context/AppContext.tsx` — all mock data and state
- `artifacts/multaqa/src/App.tsx` — router with all 18 routes
- `artifacts/multaqa/src/pages/` — all 18 page components
- `artifacts/multaqa/src/components/UserLayout.tsx` — top nav layout
- `artifacts/multaqa/src/components/AdminLayout.tsx` — admin sidebar layout

### API Server (express) — preview path: `/api`
Shared backend. Currently only has health check endpoint. Not used by Multaqa prototype.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

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
- **Charts**: recharts (Analytics dashboard)
- **Animation**: framer-motion

## Artifacts

### Multaqa (react-vite) — preview path: `/`
A fully clickable web prototype for a coworking space booking platform targeting Palestine (Nablus + Ramallah). All data is hardcoded in React context — no backend calls.

**27 screens (18 original + 9 new feature pages):**

**Core User Flow:**
- `/` — Homepage / Landing (rich navy gradient hero, live seat counter, onboarding modal on first visit)
- `/desks` — Desk Browsing (Nablus/Ramallah toggle, filters, ♥ favourite heart, waitlist button on Reserved)
- `/desks/:id` — Desk Detail (♥ favourite button, Join Waitlist button when Reserved)
- `/rooms` — Room Browsing
- `/rooms/:id` — Room Detail (♥ favourite button, Join Waitlist button when Reserved)
- `/book/step1` — Booking Step 1 (4-mode tabs: Single / Multi-Day / Recurring / Team)
- `/book/step2` — Booking Step 2 (review + guest email + per-mode extended summary)
- `/book/confirmation` — Booking Confirmation (mode badges + team/multi-day/recurring detail sections)
- `/my-reservations` — My Reservations (mode badges: Single/Multi-Day/Recurring/Team)
- `/my-reservations/modify/:id` — Modify Booking
- `/support` — Customer Support (contact form, ticket history, FAQs, contact info)
- `/onboarding` — Onboarding Tour page (explainer video placeholder, 4 feature cards)
- `/login` — Login (any credentials; "admin" email → admin role → /admin)
- `/register` — Registration
- `/community` — Who's In The Space Today

**Admin Panel:**
- `/admin` — Admin Dashboard Overview
- `/admin/bookings` — Admin All Bookings
- `/admin/unpaid` — Admin Unpaid Cash Bookings
- `/admin/seats` — Admin Seat Management
- `/admin/create-booking` — Admin Create Booking
- `/admin/analytics` — Analytics & Reporting (revenue bar, occupancy line, popular seats, peak hours heatmap, drop-off funnel)

**9 New Features:**
1. **Team Booking** — BookingStep1 team tab: select seat count + enter team member emails; adjacent desks auto-assigned
2. **Recurring Booking** — BookingStep1 recurring tab: weekly/daily pattern + end date; ~4 or ~20 sessions created
3. **Multi-Day Booking** — BookingStep1 multi-day tab: Calendar in "multiple" mode; price × days
4. **Onboarding Flow & Tutorial** — `OnboardingModal` (4-step modal with explainer video placeholder on first visit); `/onboarding` standalone page
5. **Analytics & Reporting** — `/admin/analytics` with recharts: revenue bar, occupancy line, popular spaces bar, peak hours heatmap (color grid), drop-off funnel
6. **Customer Service** — `/support` with submit form (name/email/category/message), success state with ticket ID, past tickets view, FAQs sidebar, contact info
7. **Preferred Seats & Favourites** — Heart button on Desk/Room cards and detail pages; saved in context; count badge in Navbar; "★ Favourite" tag on cards
8. **Waitlist** — `WaitlistModal` with email + date + time preference; confirmation state; triggered from Reserved desks/rooms in Desks page and detail pages
9. **Hero Gradient** — Rich navy radial gradient (`#000840 → #001279 → #001C9E → #0A22B0`) with orange glow overlays and noise texture

**Brand colors:**
- Primary Orange: `#FF5100`
- Navy Dark: `#001279`
- Mid Gray: `#535060`
- Success Green: `#1A7A4A`
- Error Red: `#CC1A00`

**Key files:**
- `artifacts/multaqa/src/context/AppContext.tsx` — all mock data, types (BookingMode, RecurringPattern, WaitlistEntry, SupportTicket), and state
- `artifacts/multaqa/src/App.tsx` — router with all 27 routes
- `artifacts/multaqa/src/pages/` — all page components
- `artifacts/multaqa/src/components/OnboardingModal.tsx` — first-visit 4-step onboarding modal
- `artifacts/multaqa/src/components/WaitlistModal.tsx` — waitlist join modal
- `artifacts/multaqa/src/components/UserLayout.tsx` — top nav layout (Support + Favourites + Tour links)
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

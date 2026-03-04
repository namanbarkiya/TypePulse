# Niya — Next.js Starter Template

> **For AI coding assistants (Claude Code, Cursor, Copilot, etc.):**
> Read this file fully before touching any code. It documents every key decision, the folder contract, and what is intentionally left as a placeholder.

---

## What this is

A production-ready Next.js 16 starter with:

- Auth system that is **off by default** — flip one env var to turn it on
- Database layer that uses **SQLite locally** and **PostgreSQL in production** — same code, zero config switching
- A **minimal landing page** where your product flow starts (no marketing noise)
- Full dashboard shell with sidebar, breadcrumbs, and profile pages — all accessible without login

The template is intentionally thin on product logic. Everything you see is infrastructure. Your job is to build on top of it, not around it.

---

## Quick start

```bash
npm install
cp env-example.env .env.local
npm run db:setup     # creates local.db with base tables
npm run dev
```

Open `http://localhost:3000` — you land on the product page, no login required.

---

## Environment variables

| Variable | Default | What it does |
|---|---|---|
| `NEXT_PUBLIC_AUTH_ENABLED` | `false` | `true` = full login/signup flow active. `false` = all routes public, guest session used |
| `DATABASE_URL` | unset | PostgreSQL connection string. Unset = SQLite fallback (`./local.db`) |
| `DATABASE_SSL` | enabled | Set to `false` for local Docker PG without SSL |
| `SQLITE_DB_PATH` | `./local.db` | Override SQLite file location |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base (only relevant when auth is enabled) |
| `NEXT_PUBLIC_APP_NAME` | `MyApp` | App name shown in the UI |

Copy `env-example.env` to `.env.local`. You only need to change what you use.

---

## Folder structure

```
app/
  page.tsx                  ← ROOT: your product starts here. Replace with your main UI.
  dashboard/
    layout.tsx              ← Dashboard shell (sidebar + breadcrumbs). Auth-guarded but bypass active.
    page.tsx                ← Dashboard home. Replace with your product's main view.
    account/page.tsx        ← User profile / settings page
  api/
    db-status/route.ts      ← GET /api/db-status — verify DB adapter + connection
    auth/confirm/route.ts   ← Auth confirmation callback (used when auth is enabled)

components/
  auth/
    auth-guard.tsx          ← Wraps protected pages. Renders children directly when auth is off.
  providers/
    auth-provider.tsx       ← Auth context. Returns guest session when auth is off.
    query-provider.tsx      ← React Query setup
    sonner-provider.tsx     ← Toast notifications
  dashboard/layout/         ← Sidebar, breadcrumbs, team switcher, user popover
  landing/sections/         ← Full marketing landing (hero, pricing, testimonials). NOT active by default.
  forms/                    ← Login, signup, OTP forms (used when auth is enabled)
  ui/                       ← shadcn/ui base components + Magic UI extras

lib/
  db/
    index.ts                ← DB entry point. Import { db } from here in API routes.
    pg-client.ts            ← PostgreSQL adapter (pg package)
    sqlite-client.ts        ← SQLite adapter (better-sqlite3)
    types.ts                ← DbClient interface
    scripts/
      setup.sql             ← Base schema: users, user_profiles, sessions
      run-setup.mjs         ← Runner: node lib/db/scripts/run-setup.mjs
  auth/
    middleware.ts           ← Session verification. No-ops when AUTH_ENABLED=false.
  api/
    client.ts               ← Fetch wrapper with auto token refresh
    auth.ts / users.ts      ← API calls for auth + user endpoints
  query/hooks/              ← React Query hooks (auth, profile)
  store/
    user-store.ts           ← Zustand store: user session + loading state
    app-store.ts / ui-store.ts ← App-level and UI state
  hooks/                    ← useBreakpoint, useDarkMode, useBreadcrumbs, useNotifications
  validations/              ← Zod schemas for forms
  utils/                    ← cn(), error handlers, profile utilities
  supabase/                 ← Legacy Supabase stubs (kept for reference, not active)
```

---

## Database

### How the adapter is selected

```
DATABASE_URL set?
  YES → PostgreSQL via pg pool (lib/db/pg-client.ts)
  NO  → SQLite via better-sqlite3 (lib/db/sqlite-client.ts), file: ./local.db
```

### Using the DB in API routes

```ts
import { db, dbAdapter } from "@/lib/db";

// Works identically on PG and SQLite
const user = await db.queryOne<User>(
  "SELECT * FROM users WHERE email = $1",
  [email]
);

await db.execute(
  "INSERT INTO users (email, name) VALUES ($1, $2)",
  [email, name]
);
```

Use `$1`, `$2`, ... placeholders in all queries. The SQLite adapter converts them to `?` automatically.

### First-time DB setup

```bash
npm run db:setup
# or directly:
node lib/db/scripts/run-setup.mjs
```

This runs `lib/db/scripts/setup.sql` which creates:
- `users` — core user records
- `user_profiles` — extended profile data
- `sessions` — server-side sessions (optional)

**Add your product tables at the bottom of `setup.sql`.** Re-run the script when you add new tables — all `CREATE TABLE IF NOT EXISTS` statements are idempotent.

### Verify connection

```bash
curl http://localhost:3000/api/db-status
# → { "adapter": "sqlite", "connected": true }
```

---

## Auth system

### Default state: auth off

`NEXT_PUBLIC_AUTH_ENABLED` defaults to `false`. When off:

- Middleware passes all requests through — no redirect to `/login`
- `AuthProvider` returns `{ isAuthenticated: true, isLoading: false, user: GUEST_USER }`
- `AuthGuard` renders children unconditionally
- All pages including `/dashboard/*` are accessible without cookies

This lets you build the product first and add real auth later with one env var change.

### Turning auth on

```env
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_API_URL=http://localhost:8000
```

With auth enabled:
- Unauthenticated requests to protected routes redirect to `/login`
- The login/signup/OTP flow activates
- `AuthProvider` fetches the real session via `GET /api/v1/users/me`
- The backend must be running (see `niya-fastapi-template` for the API)

### Auth-related files

| File | Role |
|---|---|
| `lib/auth/middleware.ts` | Reads `access_token` cookie, verifies with backend, handles refresh |
| `components/auth/auth-guard.tsx` | Client-side route guard — wraps protected pages |
| `components/providers/auth-provider.tsx` | Auth context — exposes `useAuth()` |
| `app/login/`, `app/signup/`, `app/verify-otp/` | Auth pages (visible when auth is on) |
| `lib/query/hooks/auth.ts` | `useCurrentUser()` hook via React Query |

---

## Landing page vs product flow

| File | What to do |
|---|---|
| `app/page.tsx` | **Replace this** with your product's main UI. This is where users land. |
| `components/landing/` | Full marketing landing (hero, features, pricing, tweets). Import these in `app/page.tsx` when you're ready to add a marketing page. |
| `app/dashboard/page.tsx` | Replace with your product's authenticated view. |

The root page intentionally shows a minimal placeholder. Do not build the marketing page until the product works.

---

## Tech stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js | 16 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| Components | shadcn/ui + Radix UI | latest |
| Animation | Framer Motion | 12 |
| Server state | TanStack Query | 5 |
| Client state | Zustand | 5 |
| Forms | React Hook Form + Zod | latest |
| Database (PG) | pg | 8 |
| Database (local) | better-sqlite3 | 11 |
| Toasts | Sonner | 2 |
| Analytics | Vercel Analytics | 1 |

---

## NPM scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format all files |
| `npm run db:setup` | Run `setup.sql` against configured DB |

---

## Instructions for AI assistants

If you are an AI assistant helping build a product on top of this template, follow these rules:

**Understand before building**
- Read `plan.md` in the project root first if it exists — it has the phased build plan
- The template has intentional placeholders. Do not "fix" them; replace them with product code
- `app/page.tsx` and `app/dashboard/page.tsx` are stubs — they expect to be replaced

**Database**
- Always import `db` from `@/lib/db` — never import `pg-client` or `sqlite-client` directly
- Add new tables to `lib/db/scripts/setup.sql` and re-run `npm run db:setup`
- Use `$1`, `$2` placeholders — not template literals with user input (SQL injection)
- DB is only available in server components, API routes, and server actions — never in client components

**Auth**
- Do not add `AuthGuard` to new pages unless you are intentionally adding an auth wall
- `useAuth()` always works — it returns the guest user when auth is off
- When auth is off, `user.id` is `"guest"` — don't write real data under the guest ID

**Components**
- Use `components/ui/` for base elements (Button, Input, Card, etc.)
- Use `sonner` via the existing `sonner-provider` for toasts — do not add another toast library
- Prefer server components. Only add `"use client"` when you need browser APIs or React state

**State**
- Client UI state → Zustand stores in `lib/store/`
- Server data → React Query hooks in `lib/query/hooks/`
- Do not use `useState` for data that should survive navigation

**What not to touch**
- `lib/db/pg-client.ts`, `lib/db/sqlite-client.ts` — adapter internals, do not modify
- `lib/auth/middleware.ts` — only modify if you are changing the auth protocol
- `components/landing/` — marketing components, leave them alone until launch

---

Built by [Naman Barkiya](https://github.com/namanbarkiya)

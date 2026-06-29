# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use **Yarn** as the package manager (not npm or pnpm).

```bash
yarn dev        # Vite dev server (HMR), default `development` mode = local env
yarn dev:dev    # Dev server pointed at the shared `dev` backend
yarn build      # Type-check (tsc -b) + production bundle (--mode production)
yarn build:dev  # Build for the `dev` environment
yarn build:test # Build for the `test`/QA environment
yarn build:prod # Alias of `yarn build` (--mode production)
yarn lint       # Run ESLint
yarn preview    # Preview a build locally (also preview:dev / preview:test / preview:prod)
yarn test       # Run Vitest in watch mode
yarn test:run   # Run the test suite once (CI mode)
yarn coverage   # Run tests once with a v8 coverage report
yarn test:e2e   # Run Playwright E2E tests (test:e2e:ui for the UI runner, test:e2e:report for the HTML report)
```

**Environments — 4 of them: `local` / `dev` / `test` / `production`.** Vite forbids `local` as a `--mode` name (it clashes with the `.local` env-file postfix), so **local maps to Vite's default `development` mode** (`yarn dev`, no `--mode`); the other three use `--mode <dev|test|production>`. Each mode loads its own `.env.<mode>` on top of the shared `.env`. Per-env files (`.env.dev`, `.env.test`, `.env.production`) are **committed** — frontend `VITE_*` vars end up in the public bundle, so they hold non-secret config (API URLs, flags), never secrets. The `local` env has no per-mode file: it runs on the shared `.env` defaults (which carry local-friendly values: `VITE_APP_ENV=local`, localhost API) plus your personal `.env.local` (gitignored via `*.local`; copy `.env.example` → `.env.local`). Vitest runs in `test` mode, so it also loads `.env.test` — harmless since tests mock the network. Env vars are read & **validated by zod** in `src/configs/env.config.ts` (fail-fast on missing/invalid), then exposed as the typed `ENV` object (`ENV.APP_ENV`, `ENV.API_BASE_URL`, `ENV.IS_PROD`, …) — import config from there, never `import.meta.env` directly. Add a new var → declare it in `envSchema` **and** in `ImportMetaEnv` (`src/vite-env.d.ts`).

**Testing — Vitest + React Testing Library.** `jsdom` environment, globals enabled (`describe`/`it`/`expect` need no import). Config lives under the `test` key in `vite.config.ts`; `src/test/setup.ts` registers `@testing-library/jest-dom` matchers and runs `cleanup()` after each test. Test files are colocated as `*.test.ts` / `*.test.tsx` next to the code they cover (see `useDebouncedValue.test.ts`, `InputText.test.tsx`). `src/test/README.md` is a catalog: one example test per category (pure fn, reducer, zod schema, hook, React Query, Redux, Zustand, component, context, form, router, service, single-flight, integration). Use `@testing-library/user-event` for interaction and query by accessible role/label, not test IDs. `vitest/globals` + `@testing-library/jest-dom` types are wired into `tsconfig.app.json`, so `tsc -b` type-checks tests too.

**E2E — Playwright.** Separate from Vitest: E2E specs live in `e2e/*.spec.ts` (outside `src/`), drive the real app in a real browser (Chromium only by default) and mock the backend at the network layer with `page.route` (no `:3000` server needed). `playwright.config.ts` auto-starts `yarn dev` via `webServer` (reuses a running dev server locally, `baseURL` `:5173`). The two runners must not collide: Vitest's `test.include` in `vite.config.ts` is narrowed to `src/**/*.{test,spec}.{ts,tsx}` so it never picks up `e2e/*.spec.ts`. Run with `yarn test:e2e`. E2E artifacts (`test-results/`, `playwright-report/`, …) are gitignored. The payoff over unit tests: E2E surfaces *integration* behavior — e.g. the axios 401-interceptor trying to refresh on a failed login — that module-level mocks hide (see `e2e/login.spec.ts`).

## Stack

- **React 19** + **TypeScript 6** frontend-only SPA, **Vite 8** (`@vitejs/plugin-react`, Oxc transformer)
- **Redux Toolkit** + react-redux — auth state
- **Zustand** v5 — local feature state (notifications)
- **@tanstack/react-query** v5 — server state (data fetching/caching)
- **react-router-dom** v7 — routing
- **react-hook-form** + **zod** (`@hookform/resolvers`) — forms & validation
- **axios** — HTTP client with auth interceptors
- **ESLint** flat config (`eslint.config.js`); **Prettier** — no semicolons, single quotes, 100-char width, ES5 trailing commas

## Architecture

State is split by purpose — pick the right home, do not mix them:
- **Server state → react-query.** Anything fetched from the API lives in query hooks (`src/features/*/hooks/use*.ts`). The shared `QueryClient` (`src/app/query.client.ts`) sets `staleTime: 30s`, `retry: 1`, no refetch-on-focus, and logs all errors centrally via `QueryCache`/`MutationCache` `onError` — individual hooks should not `console.error`. Use query-key factories (e.g. `productKeys` in `useProducts.ts`) so filters live in the key and invalidation/prefetch stay consistent. Mutations invalidate by key rather than hand-patching the cache (see `useAddProduct.ts`). When no detail endpoint exists, derive a single item from the shared list cache instead of a new query (see `useProduct.ts`). Service functions **validate API responses with zod** at the boundary rather than casting — e.g. `product.service.ts` parses with `productsResponseSchema` (uses `z.coerce.number()` for `id`/`price`) so the typed result is true at runtime, not just a compile-time assertion.
- **Auth state → Redux Toolkit.** `src/app/store.ts` (single `auth` slice today). Always use the typed `useAppDispatch`/`useAppSelector` from `src/app/hooks.ts`, never the bare react-redux hooks.
- **Local feature state → Zustand.** Self-contained UI state that isn't server data and isn't auth (today: notifications, `src/features/notification/stores/notification.store.ts`). Stores use the `persist` middleware for localStorage and export standalone selectors (e.g. `selectUnreadCount`) so components subscribe to a slice and only re-render when it changes. **Side-effects stay out of the store**: the Web Notifications (OS-level) API is wrapped in `features/notification/services/notification.service.ts` (`showOsNotification`/`requestOsPermission`/`getOsPermission`, `OsPermission` type) — the store stays pure (easy to test), the UI calls the service to fire an OS notification. The service is feature-internal but re-exported through the notification barrel for any cross-feature caller.

All providers are composed in one place — `src/app/AppProviders.tsx`: `LangProvider > Redux Provider > QueryClientProvider > BrowserRouter`. `App.tsx` just renders `<AppProviders><AppRouter /></AppProviders>`, so `AppRouter` sits inside every provider (it must: `useRoutes` needs the router, guards need Redux, pages need Query/i18n).

**Auth & token refresh** (`src/services/`) — the most cross-cutting flow:
- `axios.client.ts` attaches the access token on every request and, on a `401`, refreshes once (`_retry` guard) then replays the original request.
- `token.refresh.ts` implements **single-flight refresh**: concurrent 401s share one `refreshPromise`; on failure it dispatches `logout()`.
- The refresh call (`features/auth/services/token.service.ts`) uses a *bare* axios instance (no interceptors) to avoid infinite recursion.
- Access token lives **only in Redux memory** — deliberately NOT persisted (so an XSS/rogue script can't read it). The refresh token lives in an **HttpOnly cookie** set by the backend (JS never sees it); `auth.storage.ts` persists only the non-sensitive `user`. Non-React code reads the access token from the store via `selectToken(store.getState())`. The refresh flow is cookie-based: `token.service.ts` calls `/auth/refresh` with `withCredentials: true` and no body token; `login`/`register`/`/auth/logout` also send `withCredentials` so the browser stores/sends the cookie. **Backend requirement:** credentialed CORS — the auth endpoints must return a specific `Access-Control-Allow-Origin` (NOT `*`) plus `Access-Control-Allow-Credentials: true`. On startup `AuthBootstrap` (`src/app/`) does **refresh-on-load behind a loading gate**: if a `user` is persisted but the access token is gone (post-F5), it calls `refreshAuthToken()` and renders a splash (`RouteFallback`) instead of the app until the refresh settles — so routing only decides once auth is resolved (no login-flash, no guest→authed UI jump). Guests (no persisted `user`) skip straight to the app.

Cross-cutting code (`axios.client.ts`, `token.refresh.ts`, `Header`, `store.ts`, route guards) imports auth/notification only through the feature **public API** (`features/auth`, `features/notification` — see Conventions), never deep paths.

**Routing** (`src/router/AppRouter.tsx`) — `AppRouter` calls `useRoutes` on a `RouteObject` tree whose only job is to **compose layouts and guards**: layout routes wrap guard routes wrap pages. It does **not** enumerate routes — each feature owns its own routes in `features/<name>/<name>.routes.tsx`, exporting a `RouteObject[]` through its public API (`productRoutes`, `cartRoutes`, `authGuestRoutes`/`authProtectedRoutes`); AppRouter just splices each array into the correct guard branch. Add/remove a route → edit it in the feature, not the central router. auth splits into two arrays because its pages live under different guards (`GuestRoute` for login/register, `ProtectedRoute` for the user page). `ProtectedRoute` requires auth; `GuestRoute` keeps logged-in users off `/login` & `/register` and stores `from` so login can redirect back. `React.lazy` for pages is declared inside the feature's `*.routes.tsx`; the `<Suspense>` boundary (fallback in `components/common/RouteFallback`) lives in the layouts (`MainLayout`/`MainLayoutAuth`), above the `<Outlet>`. Route paths are centralized in `src/constants/route.constants.ts`.

**i18n** (`src/i18n/`) is a small custom system, EN/VI, with dot-path keys and EN fallback. It has **two access paths**: the `useTranslation` hook for components (re-renders on language change via `LangContext`), and a module-level `t()` / `setActiveLang()` for code outside React (e.g. `getErrorMessage`). `LangProvider` keeps the two in sync and persists the choice.

**Error handling** funnels through `src/helpers/getErrorMessage.ts` (uses `axios.isAxiosError` + custom error classes in `features/auth/auth.errors.ts`) so UI shows a translated message with a sensible fallback.

## Conventions

- **Feature-based structure** under `src/features/<domain>/` (`auth`, `product`, `cart`, `notification`), each with its own `services/`, `hooks/`, `stores/` (or `reducer/` for cart's local reducer), `components/`, `pages/`, plus `*.types.ts` / `*.schemas.ts` / `*.errors.ts` / `*.constants.ts` / `*.routes.tsx`. App-wide wiring lives in `src/app/`; cross-feature reusable code in `src/components/common/`, `src/hooks/`, `src/i18n/`, `src/services/`, `src/helpers/`. Cross-feature/shared **types** live in `src/types/` (e.g. the canonical `Product` in `product.types.ts` — features import it, they do not redefine it).
- **Module boundaries (enforced by ESLint).** Each feature exposes a curated **public API** via `src/features/<name>/index.ts`. Code *outside* a feature must import only from `features/<name>` (the barrel), never deep paths into `stores/` `services/` `hooks/` `components/` `reducer/` or `*.slice`/`*.store`/`*.service`/`*.reducer`/`*.schemas`/`*.types`/etc. This is enforced by `no-restricted-imports` in `eslint.config.js` — a deep cross-feature import fails `yarn lint`. Routes are part of this public API: `AppRouter` imports each feature's `RouteObject[]` from the barrel, never a page path. **Exception:** `pages/` stays exempt from the rule (so `React.lazy(() => import('…/pages/…'))` is allowed) — today only used by each feature's own `*.routes.tsx` via relative imports, kept defensively for any future lazy page import. Imports *within* the same feature use relative paths (no `features/` segment) and are unaffected.
- **File naming.** Components and pages are `PascalCase.tsx`, each wrapped in a folder of the same name (e.g. `components/LoginForm/LoginForm.tsx`); a stylesheet shared by sibling components stays at the `components/` root (e.g. `AuthForm.css`). Hooks are `useX.ts` (camelCase, `use` prefix). All other role modules use **dot-case** `<subject>.<role>.ts`: `*.service.ts`, `*.slice.ts`, `*.store.ts`, `*.reducer.ts`, `*.client.ts`, `*.types.ts`, `*.schemas.ts`, `*.errors.ts`, `*.constants.ts`, `*.routes.tsx`. `*.routes.tsx` files export route config (a `RouteObject[]`), not a component, so `eslint.config.js` turns off `react-refresh/only-export-components` for the `**/*.routes.tsx` glob.
- **Styling: plain CSS with custom properties** — no CSS-in-JS or utility framework. Write styles in a dedicated `.css` file imported into the component. Do **not** use inline `style={{ ... }}` props or inline style objects.
- Strict TypeScript: `noUnusedLocals` / `noUnusedParameters` are enforced, so unused variables fail `yarn build`. Config splits into `tsconfig.app.json` (src, `es2023`) and `tsconfig.node.json` (Vite config).

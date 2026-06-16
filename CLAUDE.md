# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use **Yarn** as the package manager (not npm or pnpm).

```bash
yarn dev        # Start Vite dev server with HMR
yarn build      # Type-check (tsc -b) + bundle for production
yarn lint       # Run ESLint
yarn preview    # Preview the production build locally
```

There is no test runner configured in this project.

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
- **Local feature state → Zustand.** Self-contained UI state that isn't server data and isn't auth (today: notifications, `src/features/notification/stores/notification.store.ts`). Stores use the `persist` middleware for localStorage and export standalone selectors (e.g. `selectUnreadCount`) so components subscribe to a slice and only re-render when it changes.

All providers are composed in one place — `src/app/AppProviders.tsx`: `LangProvider > Redux Provider > QueryClientProvider > BrowserRouter`. `App.tsx` just renders `<AppProviders><AppRouter /></AppProviders>`, so `AppRouter` sits inside every provider (it must: `useRoutes` needs the router, guards need Redux, pages need Query/i18n).

**Auth & token refresh** (`src/services/`) — the most cross-cutting flow:
- `axios.client.ts` attaches the access token on every request and, on a `401`, refreshes once (`_retry` guard) then replays the original request.
- `token.refresh.ts` implements **single-flight refresh**: concurrent 401s share one `refreshPromise`; on failure it dispatches `logout()`.
- The refresh call (`features/auth/services/token.service.ts`) uses a *bare* axios instance (no interceptors) to avoid infinite recursion.
- Auth state is persisted to localStorage inside the slice reducers (`features/auth/stores/auth.slice.ts` ↔ `auth.storage.ts`). Non-React code reads the token via the slice's `getStoredToken`/`getStoredRefreshToken` selectors.

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

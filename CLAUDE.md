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
- **Redux Toolkit** + react-redux — auth / client state
- **@tanstack/react-query** v5 — server state (data fetching/caching)
- **react-router-dom** v7 — routing
- **react-hook-form** + **zod** (`@hookform/resolvers`) — forms & validation
- **axios** — HTTP client with auth interceptors
- **ESLint** flat config (`eslint.config.js`); **Prettier** — no semicolons, single quotes, 100-char width, ES5 trailing commas

## Architecture

State is split by purpose — do not mix the two:
- **Server state → react-query.** Anything fetched from the API lives in query hooks (`src/features/*/hooks/use*.ts`). The shared `QueryClient` (`src/app/queryClient.ts`) sets `staleTime: 30s`, `retry: 1`, no refetch-on-focus, and logs all errors centrally via `QueryCache`/`MutationCache` `onError` — individual hooks should not `console.error`. Use query-key factories (e.g. `productKeys` in `useProducts.ts`) so filters live in the key and invalidation/prefetch stay consistent.
- **Client/auth state → Redux Toolkit.** `src/app/store.ts` (single `auth` slice today). Always use the typed `useAppDispatch`/`useAppSelector` from `src/app/hooks.ts`, never the bare react-redux hooks.

Providers are nested in `src/app/AppProviders.tsx`: `Redux Provider > QueryClientProvider > BrowserRouter`. A separate `LangProvider` supplies i18n.

**Auth & token refresh** (`src/services/`) — the most cross-cutting flow:
- `axiosClient.ts` attaches the access token on every request and, on a `401`, refreshes once (`_retry` guard) then replays the original request.
- `tokenRefresh.ts` implements **single-flight refresh**: concurrent 401s share one `refreshPromise`; on failure it dispatches `logout()`.
- The refresh call (`features/auth/services/tokenService.ts`) uses a *bare* axios instance (no interceptors) to avoid infinite recursion.
- Auth state is persisted to localStorage inside the slice reducers (`features/auth/stores/authSlice.ts` ↔ `authStorage.ts`). Non-React code reads the token via the slice's `getStoredToken`/`getStoredRefreshToken` selectors.

**Routing** (`src/router/AppRouter.tsx`) — layout routes wrap guard routes wrap pages. `ProtectedRoute` requires auth; `GuestRoute` keeps logged-in users off `/login` & `/register` and stores `from` so login can redirect back. Auth pages and product detail are `React.lazy` + `<Suspense>` (fallback in `components/common/RouteFallback`). Route paths are centralized in `src/constants/route.constants.ts`.

**i18n** (`src/i18n/`) is a small custom system, EN/VI, with dot-path keys and EN fallback. It has **two access paths**: the `useTranslation` hook for components (re-renders on language change via `LangContext`), and a module-level `t()` / `setActiveLang()` for code outside React (e.g. `getErrorMessage`). `LangProvider` keeps the two in sync and persists the choice.

**Error handling** funnels through `src/utils/getErrorMessage.ts` (uses `axios.isAxiosError` + custom error classes in `features/auth/auth.errors.ts`) so UI shows a translated message with a sensible fallback.

## Conventions

- **Feature-based structure** under `src/features/<domain>/` (`auth`, `product`, `cart`), each with its own `services/`, `hooks/`, `stores/`, `components/`, `pages/`, plus `*.types.ts` / `*.schemas.ts`. App-wide wiring lives in `src/app/`; cross-feature reusable code in `src/components/common/`, `src/hooks/`, `src/services/`, `src/utils/`.
- **Styling: plain CSS with custom properties** — no CSS-in-JS or utility framework. Write styles in a dedicated `.css` file imported into the component. Do **not** use inline `style={{ ... }}` props or inline style objects.
- Strict TypeScript: `noUnusedLocals` / `noUnusedParameters` are enforced, so unused variables fail `yarn build`. Config splits into `tsconfig.app.json` (src, `es2023`) and `tsconfig.node.json` (Vite config).

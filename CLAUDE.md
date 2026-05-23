# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use **Yarn** as the package manager (not npm or pnpm).

```bash
yarn dev        # Start Vite dev server with HMR
yarn build      # Type-check + bundle for production
yarn lint       # Run ESLint
yarn preview    # Preview the production build locally
```

## Stack

- **React 19** + **TypeScript 6** frontend-only SPA
- **Vite 8** with `@vitejs/plugin-react` (uses Oxc transformer)
- **ESLint** flat config (`eslint.config.js`) with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins
- **Prettier** — no semicolons, single quotes, 100-char print width, trailing commas (ES5)

## TypeScript

`tsconfig.json` splits into two references: `tsconfig.app.json` (src files, `es2023` target) and `tsconfig.node.json` (Vite config only). Strict mode is on with `noUnusedLocals` and `noUnusedParameters` enforced — unused variables will fail the build.

## Project Structure

- `src/main.tsx` — app entry, mounts `<App>` into `#root`
- `src/App.tsx` — root component
- `src/index.css` — global CSS custom properties (light/dark theming via `color-scheme`)
- `src/App.css` — component-scoped styles

Styling uses plain CSS with custom properties — no CSS-in-JS or utility framework. Write styles in a dedicated `.css` file imported into the component — do not use inline `style={{ ... }}` props or inline style objects.

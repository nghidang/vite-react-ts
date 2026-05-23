# Copilot instructions for the vite-react-ts project

This is a minimal React + TypeScript application powered by Vite.

## Project essentials

- Frontend-only single-page application in `src/`.
- Entry points: `src/main.tsx`, `src/App.tsx`.
- Static styles in `src/index.css` and `src/App.css`.
- Assets live in `src/assets/`.
- No backend or API server code is present in this repo.

## Build and development commands

- `yarn dev` → start Vite dev server.
- `yarn build` → compile TypeScript with `tsc -b` and bundle with Vite.
- `yarn lint` → run `eslint .`.
- `yarn preview` → preview the built production output.

## Tooling and conventions

- Uses Vite with `@vitejs/plugin-react`.
- Uses TypeScript 6 and React 19.
- ESLint is configured through `eslint.config.js`.
- Keep changes small and idiomatic for a Vite + React + TS starter app.
- Prefer React component and hook conventions over class components.

## What an AI agent should do first

- Read `package.json`, `vite.config.ts`, `eslint.config.js`, and `README.md`.
- Keep existing app structure intact unless a change is needed.
- Preserve Vite/HMR-friendly code and avoid introducing build-time complexity.

## Notes

- This repository is a template-style starter project, so avoid over-engineering.
- When updating lint or TypeScript settings, follow the existing simple developer experience.

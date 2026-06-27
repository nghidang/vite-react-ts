// ============================================================
// index.ts
// 🔗 SHARED
//
// Web bundler (Vite/Webpack) → resolves Button.tsx
// Metro (React Native)       → resolves Button.native.tsx
// ============================================================

export { Button }              from './Button'
export type { ButtonBaseProps } from './button.types'
export type { ButtonVariant, ButtonSize } from './button.types'

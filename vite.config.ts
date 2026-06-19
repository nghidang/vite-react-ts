/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
    // Chỉ Vitest quản unit test trong `src/`. E2E (`e2e/*.spec.ts`) do Playwright chạy riêng,
    // không để Vitest "nuốt" nhầm (mặc định include cả `**/*.spec.ts`).
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{types,schemas,constants,routes}.{ts,tsx}', 'src/main.tsx'],
    },
  },
})

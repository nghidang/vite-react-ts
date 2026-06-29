/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

/**
 * Inject Content-Security-Policy qua thẻ <meta> — CHỈ khi build (`apply: 'build'`),
 * KHÔNG áp vào dev server: ở dev, Vite/react-refresh inject inline script cho HMR nên
 * `script-src 'self'` sẽ làm vỡ `yarn dev`. Production bundle không còn inline script.
 *
 * `connect-src` lấy origin từ VITE_API_BASE_URL theo mode (nơi DUY NHẤT app gọi mạng tới).
 *
 * LƯU Ý: `frame-ancestors` (chống clickjacking) bị trình duyệt BỎ QUA khi đặt qua <meta> —
 * phải set bằng HTTP header phía server/CDN (cùng với X-Content-Type-Options, HSTS...).
 */
function cspPlugin(apiOrigin: string): Plugin {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${apiOrigin}`.trim(),
    "form-action 'self'",
  ].join('; ')

  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: csp },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let apiOrigin = ''
  try {
    apiOrigin = new URL(env.VITE_API_BASE_URL).origin
  } catch {
    if (env.VITE_API_BASE_URL) {
      console.warn('[cspPlugin] VITE_API_BASE_URL không hợp lệ:', env.VITE_API_BASE_URL)
    }
    // Nếu không set → bỏ qua, env.config.ts sẽ báo lỗi rõ ràng lúc runtime.
  }

  return {
    plugins: [react(), cspPlugin(apiOrigin)],
    test: {
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.{types,schemas,constants,routes}.{ts,tsx}', 'src/main.tsx'],
      },
      projects: [
        // ── Unit tests (jsdom) ──────────────────────────────────
        {
          extends: true,
          test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/test/setup.ts',
            css: false,
            // Chỉ Vitest quản unit test trong `src/`. E2E (`e2e/*.spec.ts`) do Playwright chạy riêng,
            // không để Vitest "nuốt" nhầm (mặc định include cả `**/*.spec.ts`).
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
          },
        },
        // ── Storybook tests (Chromium) ──────────────────────────
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
            }),
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [
                { 
                  browser: 'chromium',
                },
              ],
            },
          },
        },
      ],
    },
  }
})

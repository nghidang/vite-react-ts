import { defineConfig, devices } from '@playwright/test'

/**
 * Cấu hình Playwright cho E2E test.
 *
 * - Test E2E nằm ở thư mục `e2e/` (đuôi `*.spec.ts`), TÁCH RIÊNG khỏi unit test của Vitest
 *   (đuôi `*.test.ts(x)` trong `src/`) để hai runner không "nuốt" test của nhau.
 * - `webServer` tự chạy `yarn dev` và đợi server lên trước khi test — khỏi phải start thủ công.
 * - Mặc định chỉ chạy Chromium cho gọn; thêm Firefox/WebKit khi cần (nhớ `npx playwright install`).
 *
 * Tài liệu: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // CI: cấm `test.only` lỡ commit
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry', // lưu trace khi retry để debug
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI, // local: tái dùng dev server đang chạy
    timeout: 120_000,
  },
})

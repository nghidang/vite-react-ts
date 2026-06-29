import { test, expect, type Page } from '@playwright/test'

/**
 * E2E luồng đăng nhập — chạy app THẬT trong trình duyệt (Chromium).
 *
 * Backend được MOCK ở tầng mạng bằng `page.route`, nên test tự chạy được mà không cần
 * server `:3000` thật. Đây là khác biệt cốt lõi so với unit test (jsdom + mock module):
 * ở đây ta tương tác qua DOM thật, điều hướng router thật, và chặn HTTP thật.
 *
 * App gọi `POST {VITE_API_BASE_URL}/login` = http://localhost:3000/api/login (xem .env).
 */

const loginUrl = '**/api/login'

const loginResponse = {
  user: { id: '1', username: 'john' },
  token: 'fake-access-token',
  refreshToken: 'fake-refresh-token',
  expireAt: Date.now() + 3_600_000,
}

/** Điền form đăng nhập rồi submit. Tách ra để cả 2 ca (thành công/thất bại) dùng chung. */
async function submitLogin(page: Page, username: string, password: string) {
  await page.goto('/login')
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

test.describe('Login flow', () => {
  test('đăng nhập thành công -> chuyển sang trang user', async ({ page }) => {
    // Mock API login trả 200 + phiên hợp lệ.
    await page.route(loginUrl, async (route) => {
      expect(route.request().method()).toBe('POST')
      expect(route.request().postDataJSON()).toEqual({ username: 'john', password: 'secret123' })
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(loginResponse),
      })
    })

    await submitLogin(page, 'john', 'secret123')

    // useAuthSuccess điều hướng (replace) sang /user; UserPage hiển thị lời chào.
    await expect(page).toHaveURL(/\/user$/)
    await expect(page.getByRole('heading', { name: 'User Page' })).toBeVisible()
    await expect(page.getByText(/Xin chào, john/)).toBeVisible()
  })

  test('sai thông tin -> hiện lỗi và ở lại trang login', async ({ page }) => {
    // Mock API login trả 401.
    await page.route(loginUrl, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      })
    })

    await submitLogin(page, 'john', 'wrong-password')

    // Endpoint auth gắn cờ `skipAuthRefresh` nên interceptor 401 KHÔNG cố refresh ở đây
    // (401 lúc login = sai thông tin, không phải token hết hạn). Nhờ vậy AxiosError 401
    // gốc đi thẳng tới `getErrorMessage` và message thật của server được hiển thị.
    await expect(page.getByText('Invalid credentials')).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('validate phía client: bỏ trống -> không gọi API', async ({ page }) => {
    let apiCalled = false
    await page.route(loginUrl, async (route) => {
      apiCalled = true
      await route.fulfill({ status: 200, body: '{}' })
    })

    await page.goto('/login')
    await page.getByRole('button', { name: 'Login' }).click()

    // zod resolver chặn submit -> hiện lỗi "required", chưa gọi mạng.
    await expect(page.getByText('Please enter your username')).toBeVisible()
    expect(apiCalled).toBe(false)
  })
})

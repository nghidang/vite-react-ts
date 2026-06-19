import { store } from '../app/store'
import { logout, refreshAccessToken, tokenRefreshed } from '../features/auth'

let refreshPromise: Promise<string> | null = null

// Single-flight: while a refresh is in flight, concurrent callers share the same
// promise instead of each firing their own refresh request. Resolves to the new
// access token, or rejects (after logging out) if the refresh token is missing
// or rejected by the server.
export function refreshAuthToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = runRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

async function runRefresh(): Promise<string> {
  try {
    // Không truyền refresh token từ JS — server đọc nó từ cookie HttpOnly.
    const data = await refreshAccessToken()
    store.dispatch(tokenRefreshed(data))
    return data.token
  } catch (error) {
    // Cookie thiếu/hết hạn hoặc bị server từ chối → đăng xuất.
    store.dispatch(logout())
    throw error
  }
}

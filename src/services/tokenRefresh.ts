import { store } from '../app/store'
import { refreshAccessToken } from '../features/auth/services/tokenService'
import { getStoredRefreshToken, logout, tokenRefreshed } from '../features/auth/stores/authSlice'

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
  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) {
    store.dispatch(logout())
    throw new Error('No refresh token available')
  }

  try {
    const data = await refreshAccessToken(refreshToken)
    store.dispatch(tokenRefreshed(data))
    return data.token
  } catch (error) {
    // Refresh token is invalid/expired too — give up and log the user out.
    store.dispatch(logout())
    throw error
  }
}

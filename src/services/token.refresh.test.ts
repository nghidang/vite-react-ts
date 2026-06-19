import { describe, it, expect, vi, beforeEach } from 'vitest'

// Keep the real slice action creators (logout/tokenRefreshed) and reducer so the real store
// reacts; only stub the I/O boundary: the refresh request. The refresh token now lives in an
// HttpOnly cookie (server-side), so refreshAccessToken() takes no argument — there is no
// client-side "missing token" check anymore; failure only comes from the server rejecting.
vi.mock('../features/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../features/auth')>()
  return {
    ...actual,
    refreshAccessToken: vi.fn(),
  }
})

import { refreshAuthToken } from './token.refresh'
import { refreshAccessToken, logout } from '../features/auth'
import { store } from '../app/store'

const refreshResponse = { token: 'new-token', expireAt: 999 }

describe('refreshAuthToken (single-flight)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    store.dispatch(logout()) // reset store về trạng thái chưa đăng nhập
  })

  it('shares one in-flight refresh among concurrent callers', async () => {
    let resolveRefresh!: (value: typeof refreshResponse) => void
    vi.mocked(refreshAccessToken).mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve
      })
    )

    const first = refreshAuthToken()
    const second = refreshAuthToken()

    expect(refreshAccessToken).toHaveBeenCalledTimes(1) // not once per caller

    resolveRefresh(refreshResponse)

    await expect(first).resolves.toBe('new-token')
    await expect(second).resolves.toBe('new-token')
    expect(store.getState().auth.token).toBe('new-token') // tokenRefreshed dispatched
  })

  it('starts a fresh refresh after the previous one settled', async () => {
    vi.mocked(refreshAccessToken).mockResolvedValue(refreshResponse)

    await refreshAuthToken()
    await refreshAuthToken()

    expect(refreshAccessToken).toHaveBeenCalledTimes(2)
  })

  it('logs out and rejects when the refresh request fails (cookie missing/expired)', async () => {
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error('refresh rejected'))

    await expect(refreshAuthToken()).rejects.toThrow('refresh rejected')
    expect(store.getState().auth.token).toBeNull()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Keep the real slice action creators (logout/tokenRefreshed) and reducer so the real store
// reacts; only stub the I/O boundary: the refresh request and the stored-token lookup.
vi.mock('../features/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../features/auth')>()
  return {
    ...actual,
    refreshAccessToken: vi.fn(),
    getStoredRefreshToken: vi.fn(),
  }
})

import { refreshAuthToken } from './token.refresh'
import { refreshAccessToken, getStoredRefreshToken } from '../features/auth'
import { store } from '../app/store'

const refreshResponse = { token: 'new-token', refreshToken: 'refresh-2', expireAt: 999 }

describe('refreshAuthToken (single-flight)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shares one in-flight refresh among concurrent callers', async () => {
    vi.mocked(getStoredRefreshToken).mockReturnValue('refresh-1')
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
    vi.mocked(getStoredRefreshToken).mockReturnValue('refresh-1')
    vi.mocked(refreshAccessToken).mockResolvedValue(refreshResponse)

    await refreshAuthToken()
    await refreshAuthToken()

    expect(refreshAccessToken).toHaveBeenCalledTimes(2)
  })

  it('logs out and rejects when there is no refresh token', async () => {
    vi.mocked(getStoredRefreshToken).mockReturnValue(null)

    await expect(refreshAuthToken()).rejects.toThrow('No refresh token available')
    expect(refreshAccessToken).not.toHaveBeenCalled()
    expect(store.getState().auth.token).toBeNull()
  })

  it('logs out and rejects when the refresh request fails', async () => {
    vi.mocked(getStoredRefreshToken).mockReturnValue('refresh-1')
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error('refresh rejected'))

    await expect(refreshAuthToken()).rejects.toThrow('refresh rejected')
    expect(store.getState().auth.token).toBeNull()
  })
})

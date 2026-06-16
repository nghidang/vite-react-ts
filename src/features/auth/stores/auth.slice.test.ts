import { describe, it, expect, beforeEach } from 'vitest'
import reducer, {
  loginSuccess,
  tokenRefreshed,
  logout,
  selectIsAuthenticated,
} from './auth.slice'
import type { AuthState } from '../auth.types'

const empty: AuthState = { user: null, token: null, refreshToken: null, expireAt: null }
const loginPayload = {
  user: { id: '1', username: 'john' },
  token: 'access-1',
  refreshToken: 'refresh-1',
  expireAt: 1000,
}

const storedAuth = () => JSON.parse(localStorage.getItem('auth') ?? 'null')

describe('auth.slice reducer', () => {
  beforeEach(() => localStorage.clear())

  it('loginSuccess stores the session and persists it', () => {
    const next = reducer(empty, loginSuccess(loginPayload))
    expect(next).toEqual(loginPayload)
    expect(storedAuth()).toEqual(loginPayload)
  })

  it('tokenRefreshed updates the tokens but keeps the user', () => {
    const loggedIn = reducer(empty, loginSuccess(loginPayload))
    const next = reducer(
      loggedIn,
      tokenRefreshed({ token: 'access-2', refreshToken: 'refresh-2', expireAt: 2000 })
    )
    expect(next.user).toEqual(loginPayload.user)
    expect(next.token).toBe('access-2')
    expect(next.refreshToken).toBe('refresh-2')
    expect(next.expireAt).toBe(2000)
    expect(storedAuth().token).toBe('access-2')
  })

  it('logout clears the session and storage', () => {
    const loggedIn = reducer(empty, loginSuccess(loginPayload))
    localStorage.setItem('auth', JSON.stringify(loggedIn))
    const next = reducer(loggedIn, logout())
    expect(next).toEqual(empty)
    expect(localStorage.getItem('auth')).toBeNull()
  })
})

describe('selectIsAuthenticated', () => {
  it('is true only when a token is present', () => {
    expect(selectIsAuthenticated({ auth: empty })).toBe(false)
    expect(selectIsAuthenticated({ auth: { ...empty, token: 'x' } })).toBe(true)
  })
})

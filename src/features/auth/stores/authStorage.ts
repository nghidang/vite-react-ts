import type { AuthState } from '../auth.types'

const STORAGE_KEY = 'auth'

const emptyAuthState = (): AuthState => ({
  user: null,
  token: null,
  refreshToken: null,
  expireAt: null,
})

export function loadAuthState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as AuthState
    }
  } catch (err) {
    console.error('Failed to load auth state from localStorage:', err)
  }

  return emptyAuthState()
}

export function saveAuthState(state: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('Failed to save auth state to localStorage:', err)
  }
}

export function clearAuthState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('Failed to clear auth state from localStorage:', err)
  }
}

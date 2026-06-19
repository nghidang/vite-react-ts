import type { AuthState } from '../auth.types'

const STORAGE_KEY = 'auth'

// Bậc 2 bảo mật: access/refresh token KHÔNG còn ghi vào localStorage (tránh bị JS
// lạ/XSS đọc trộm). Chúng chỉ sống trong Redux memory → mất khi F5.
// localStorage chỉ giữ phần KHÔNG nhạy cảm (`user`) để còn render shell ngay khi load.
type PersistedAuth = Pick<AuthState, 'user'>

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
      const persisted = JSON.parse(raw) as PersistedAuth
      // Token cố tình không persist → luôn null sau khi load (mất khi F5).
      return { ...emptyAuthState(), user: persisted.user ?? null }
    }
  } catch (err) {
    console.error('Failed to load auth state from localStorage:', err)
  }

  return emptyAuthState()
}

export function saveAuthState(state: AuthState) {
  try {
    const persisted: PersistedAuth = { user: state.user }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
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

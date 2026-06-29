export type User = {
  id: string
  username: string
}

export type LoginCredentials = {
  username: string
  password: string
}

export type RegisterCredentials = {
  username: string
  password: string
}

// Refresh token KHÔNG xuất hiện trong body nữa — nó nằm trong cookie HttpOnly do
// backend set/đọc, JS không bao giờ thấy. Vì vậy không có field `refreshToken` ở đây.
export type LoginResponse = {
  user: User
  token: string
  expireAt: number
}

export type RefreshResponse = {
  token: string
  expireAt: number
}

export type AuthState = {
  user: User | null
  token: string | null
  expireAt: number | null
}

export type LoginPayload = {
  [K in keyof Pick<AuthState, 'user' | 'token' | 'expireAt'>]: NonNullable<AuthState[K]>
}

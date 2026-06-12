export type User = {
  id: string
  username: string
}

export type LoginCredentials = {
  username: string
  password: string
}

export type LoginResponse = {
  user: User
  token: string
  refreshToken: string
  expireAt: number
}

export type RefreshResponse = {
  token: string
  refreshToken: string
  expireAt: number
}

export type AuthState = {
  user: User | null
  token: string | null
  refreshToken: string | null
  expireAt: number | null
}

export type LoginPayload = {
  [K in keyof Pick<AuthState, 'user' | 'token' | 'refreshToken' | 'expireAt'>]: NonNullable<
    AuthState[K]
  >
}

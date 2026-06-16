import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, LoginPayload, RefreshResponse } from '../auth.types'
import { clearAuthState, loadAuthState, saveAuthState } from './auth.storage'

const initialState: AuthState = loadAuthState()

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.expireAt = action.payload.expireAt
      saveAuthState(state)
    },
    tokenRefreshed: (state, action: PayloadAction<RefreshResponse>) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.expireAt = action.payload.expireAt
      saveAuthState(state)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.expireAt = null
      clearAuthState()
    },
  },
})

export const { loginSuccess, tokenRefreshed, logout } = AuthSlice.actions

export const selectIsAuthenticated = (state: { auth: AuthState }) => Boolean(state.auth.token)

export const getStoredToken = () => loadAuthState().token

export const getStoredRefreshToken = () => loadAuthState().refreshToken

export default AuthSlice.reducer

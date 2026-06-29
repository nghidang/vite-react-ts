import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ENV } from '../configs/env.config'
import { store } from '../app/store'
import { selectToken } from '../features/auth'
import { refreshAuthToken } from './token.refresh'

// Cho phép một request tự loại mình khỏi luồng auto-refresh khi gặp 401.
// Dùng cho endpoint auth (login/register): 401 ở đó là "sai thông tin đăng nhập",
// KHÔNG phải access token hết hạn → gọi refresh là vô nghĩa (và tốn 1 request thừa).
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean
  }
}

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

export const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the current access token to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = selectToken(store.getState())
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On a 401, refresh the token once and replay the original request.
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequest | undefined

    // Only react to a 401 once per request, only if we have something to retry,
    // and never for requests that opted out (auth endpoints).
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.skipAuthRefresh
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const token = await refreshAuthToken()
    originalRequest.headers.Authorization = `Bearer ${token}`

    return axiosClient(originalRequest)
  }
)

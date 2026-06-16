import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../configs/env.config'
import { getStoredToken } from '../features/auth/stores/auth.slice'
import { refreshAuthToken } from './token.refresh'

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the current access token to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = getStoredToken()
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

    // Only react to a 401 once per request, and only if we have something to retry.
    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const token = await refreshAuthToken()
    originalRequest.headers.Authorization = `Bearer ${token}`

    return axiosClient(originalRequest)
  }
)

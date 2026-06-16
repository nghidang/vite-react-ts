import { API_ENDPOINTS } from '../../../constants/api.constants'
import { axiosClient } from '../../../services/axios.client'
import type { LoginCredentials, LoginResponse, RegisterCredentials } from '../auth.types'

export async function login(username: string, password: string): Promise<LoginResponse> {
  const payload: LoginCredentials = { username, password }
  const { data } = await axiosClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, payload)

  return data
}

export async function register(username: string, password: string): Promise<LoginResponse> {
  const payload: RegisterCredentials = { username, password }
  const { data } = await axiosClient.post<LoginResponse>(API_ENDPOINTS.REGISTER, payload)

  return data
}

import { API_ENDPOINTS } from '../../../constants/api.constants'
import { axiosClient } from '../../../services/axiosClient'
import type { LoginCredentials, LoginResponse } from '../auth.types'

export async function login(username: string, password: string): Promise<LoginResponse> {
  const payload: LoginCredentials = { username, password }
  const { data } = await axiosClient.post<LoginResponse>(API_ENDPOINTS.LOGIN, payload)

  return data
}

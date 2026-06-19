import { API_ENDPOINTS } from '../../../constants/api.constants'
import { axiosClient } from '../../../services/axios.client'
import type { LoginCredentials, LoginResponse, RegisterCredentials } from '../auth.types'

// `withCredentials`: để trình duyệt CHẤP NHẬN & LƯU cookie HttpOnly (refresh token)
//   server set trong response. Chỉ cần ở endpoint auth — request thường dùng Bearer.
// `skipAuthRefresh`: 401 ở đây là sai thông tin đăng nhập, không phải token hết hạn →
//   không cho interceptor gọi refresh.
const authRequestConfig = { withCredentials: true, skipAuthRefresh: true }

export async function login(username: string, password: string): Promise<LoginResponse> {
  const payload: LoginCredentials = { username, password }
  const { data } = await axiosClient.post<LoginResponse>(
    API_ENDPOINTS.LOGIN,
    payload,
    authRequestConfig
  )

  return data
}

export async function register(username: string, password: string): Promise<LoginResponse> {
  const payload: RegisterCredentials = { username, password }
  const { data } = await axiosClient.post<LoginResponse>(
    API_ENDPOINTS.REGISTER,
    payload,
    authRequestConfig
  )

  return data
}

// Refresh token nằm trong cookie HttpOnly → JS không tự xoá được. Gọi backend
// (kèm cookie) để nó `clearCookie`, sau đó FE mới dọn state phía client.
export async function logout(): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.LOGOUT, null, { withCredentials: true })
}

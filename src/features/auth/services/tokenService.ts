import axios from 'axios'
import { API_ENDPOINTS, BASE_URL } from '../../../constants/api.constants'
import type { RefreshResponse } from '../auth.types'

// Uses a bare axios call (not axiosClient) so it never triggers the 401
// response interceptor — that would recurse if the refresh request itself 401s.
export async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  const { data } = await axios.post<RefreshResponse>(`${BASE_URL}/${API_ENDPOINTS.REFRESH}`, {
    refreshToken,
  })

  return data
}

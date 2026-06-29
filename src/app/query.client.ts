import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Log lỗi an toàn. KHÔNG in nguyên axios error ra console: `error.config.headers`
 * chứa `Authorization: Bearer <access token>` nên `console.error(error)` sẽ RÒ token
 * ra console (kể cả ở production). Với axios error chỉ log method/url/status/message;
 * lỗi khác (không phải HTTP) thì log nguyên vì không mang dữ liệu nhạy cảm.
 */
function logError(error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error('[API error]', {
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    })
    return
  }
  console.error(error)
}

/**
 * QueryClient dùng chung cho toàn app.
 * - staleTime: dữ liệu được coi là "tươi" trong 30s -> tránh refetch thừa khi điều hướng qua lại.
 * - retry: thử lại 1 lần khi request lỗi (mạng chập chờn), không spam server.
 * - query/mutationCache.onError: log lỗi tập trung 1 chỗ (thay cho console.error rải rác ở từng hook).
 *   Request bị huỷ không vào đây nên không log nhiễu.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: logError }),
  mutationCache: new MutationCache({ onError: logError }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

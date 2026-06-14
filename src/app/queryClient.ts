import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

/**
 * QueryClient dùng chung cho toàn app.
 * - staleTime: dữ liệu được coi là "tươi" trong 30s -> tránh refetch thừa khi điều hướng qua lại.
 * - retry: thử lại 1 lần khi request lỗi (mạng chập chờn), không spam server.
 * - query/mutationCache.onError: log lỗi tập trung 1 chỗ (thay cho console.error rải rác ở từng hook).
 *   Request bị huỷ không vào đây nên không log nhiễu.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (error) => console.error(error) }),
  mutationCache: new MutationCache({ onError: (error) => console.error(error) }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

import { QueryClient } from '@tanstack/react-query'

/**
 * QueryClient dùng chung cho toàn app.
 * - staleTime: dữ liệu được coi là "tươi" trong 30s -> tránh refetch thừa khi điều hướng qua lại.
 * - retry: thử lại 1 lần khi request lỗi (mạng chập chờn), không spam server.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

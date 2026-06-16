import { keepPreviousData, useQuery } from '@tanstack/react-query'
import * as productService from '../services/product.service'

type ProductFilters = { name?: string; category?: string }

/**
 * Query key tập trung cho feature product -> dễ invalidate/prefetch ở nơi khác.
 * Filters nằm trong key nên đổi search/category là tự refetch + cache riêng từng bộ lọc.
 */
export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => [...productKeys.all, 'list', filters] as const,
}

/** Lấy danh sách product theo filter. signal của react-query truyền xuống axios để tự huỷ request cũ. */
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ signal }) => productService.getProducts(filters, signal),
    // Đổi filter: giữ list cũ hiển thị trong lúc fetch bộ mới -> không nháy "Loading..." mỗi lần search.
    // Dùng kèm `isPlaceholderData` ở component để làm mờ list khi đang tải.
    placeholderData: keepPreviousData,
  })
}

import { useProducts } from './useProducts'

/**
 * Lấy 1 product theo id. Backend chưa có endpoint get-details nên tái dùng query list dùng chung
 * (`useProducts`) rồi tìm phía client. Nhờ vậy:
 * - List chỉ fetch 1 lần rồi cache; đổi id trên URL chỉ .find lại từ cùng cache, KHÔNG gọi API mới.
 * - Deep-link/reload (cache rỗng) -> list tự fetch 1 lần.
 * Trả `data` = product khớp id, `null` nếu list đã tải xong mà không có, `undefined` khi đang tải.
 */
export function useProduct(id: number) {
  const { data: products, isPending, error } = useProducts({})

  return {
    data: products ? (products.find((product) => product.id === id) ?? null) : undefined,
    isPending,
    error,
  }
}

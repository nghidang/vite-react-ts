import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as productService from '../services/product.service'
import { productKeys } from './useProducts'

/**
 * Mutation tạo product. Sau khi thành công, invalidate mọi list product (`productKeys.all`)
 * -> react-query tự refetch list đang hiển thị, khỏi gọi lại thủ công.
 * Dùng invalidate thay vì setQueryData vì list có filter/search -> chèn tay dễ lệch.
 */
export function useAddProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productService.addProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

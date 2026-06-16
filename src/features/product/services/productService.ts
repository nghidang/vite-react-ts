import { API_ENDPOINTS } from '../../../constants/api.constants'
import { axiosClient } from '../../../services/axiosClient'
import type { NewProduct, Product } from '../../../types/product.types'
import { productResponseSchema, productsResponseSchema } from '../product.schemas'

export async function getProducts(
  filters?: { name?: string; category?: string },
  signal?: AbortSignal
): Promise<Product[]> {
  const params: Record<string, string> = {}
  if (filters?.name) params.name = filters.name
  if (filters?.category) params.category = filters.category

  const { data } = await axiosClient.get(API_ENDPOINTS.PRODUCTS, {
    params: Object.keys(params).length ? params : undefined,
    signal,
  })

  return productsResponseSchema.parse(data)
}

/** Tạo product mới. Server trả về product đã tạo kèm `id`. */
export async function addProduct(input: NewProduct): Promise<Product> {
  const { data } = await axiosClient.post(API_ENDPOINTS.PRODUCTS, input)

  return productResponseSchema.parse(data)
}

import { API_ENDPOINTS } from '../../../constants/api.constants'
import { axiosClient } from '../../../services/axiosClient'
import type { Product } from '../product.types'

export async function getProducts(
  filters?: { name?: string; category?: string },
  signal?: AbortSignal
): Promise<Product[]> {
  const params: Record<string, string> = {}
  if (filters?.name) params.name = filters.name
  if (filters?.category) params.category = filters.category

  const { data } = await axiosClient.get<Product[]>(API_ENDPOINTS.PRODUCTS, {
    params: Object.keys(params).length ? params : undefined,
    signal,
  })

  return data
}

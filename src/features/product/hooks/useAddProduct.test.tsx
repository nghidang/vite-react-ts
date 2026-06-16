import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useAddProduct } from './useAddProduct'
import { productKeys } from './useProducts'
import * as productService from '../services/product.service'
import { createTestQueryClient, createQueryWrapper } from '../../../test/queryWrapper'
import type { NewProduct, Product } from '../../../types/product.types'

vi.mock('../services/product.service')

const newProduct: NewProduct = { name: 'New', price: 10, category: 'c', status: true }
const created: Product = { id: 7, ...newProduct }

describe('useAddProduct', () => {
  beforeEach(() => vi.resetAllMocks())

  it('creates a product and invalidates all product lists on success', async () => {
    vi.mocked(productService.addProduct).mockResolvedValue(created)
    const client = createTestQueryClient()
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries')

    const { result } = renderHook(() => useAddProduct(), {
      wrapper: createQueryWrapper(client),
    })

    act(() => result.current.mutate(newProduct))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // react-query v5 passes a mutation context as a second arg — assert only the variables.
    expect(productService.addProduct).toHaveBeenCalledWith(newProduct, expect.anything())
    expect(result.current.data).toEqual(created)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: productKeys.all })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProducts, productKeys } from './useProducts'
import * as productService from '../services/product.service'
import { createQueryWrapper } from '../../../test/queryWrapper'
import type { Product } from '../../../types/product.types'

vi.mock('../services/product.service')

const products: Product[] = [{ id: 1, name: 'A', price: 1, category: 'c', status: true }]

describe('productKeys', () => {
  it('builds stable query keys with filters embedded', () => {
    expect(productKeys.all).toEqual(['products'])
    expect(productKeys.list({ name: 'a', category: 'c' })).toEqual([
      'products',
      'list',
      { name: 'a', category: 'c' },
    ])
  })
})

describe('useProducts', () => {
  beforeEach(() => vi.resetAllMocks())

  it('fetches products for the given filters', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue(products)

    const { result } = renderHook(() => useProducts({ name: 'A' }), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(products)
    expect(productService.getProducts).toHaveBeenCalledWith({ name: 'A' }, expect.any(AbortSignal))
  })

  it('surfaces an error when the service rejects', async () => {
    vi.mocked(productService.getProducts).mockRejectedValue(new Error('boom'))

    const { result } = renderHook(() => useProducts({}), { wrapper: createQueryWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(Error)
  })
})

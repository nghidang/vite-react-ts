import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

vi.mock('../../../services/axios.client', () => ({
  axiosClient: { get: vi.fn(), post: vi.fn() },
}))

import { getProducts, addProduct } from './product.service'
import { axiosClient } from '../../../services/axios.client'

const get = axiosClient.get as unknown as Mock
const post = axiosClient.post as unknown as Mock

describe('getProducts', () => {
  beforeEach(() => vi.resetAllMocks())

  it('sends no params when there are no filters', async () => {
    get.mockResolvedValue({ data: [] })
    await getProducts()
    expect(get).toHaveBeenCalledWith('products', { params: undefined, signal: undefined })
  })

  it('sends only the provided filters and forwards the abort signal', async () => {
    get.mockResolvedValue({ data: [] })
    const controller = new AbortController()
    await getProducts({ name: 'phone' }, controller.signal)
    expect(get).toHaveBeenCalledWith('products', {
      params: { name: 'phone' },
      signal: controller.signal,
    })
  })

  it('validates and coerces the response at the boundary', async () => {
    get.mockResolvedValue({
      data: [{ id: '1', name: 'A', price: '9.5', category: 'c', status: true }],
    })
    await expect(getProducts()).resolves.toEqual([
      { id: 1, name: 'A', price: 9.5, category: 'c', status: true },
    ])
  })

  it('rejects when the response shape is invalid', async () => {
    get.mockResolvedValue({ data: [{ id: 1 }] })
    await expect(getProducts()).rejects.toThrow()
  })
})

describe('addProduct', () => {
  beforeEach(() => vi.resetAllMocks())

  it('posts the new product and returns the parsed result', async () => {
    const input = { name: 'New', price: 10, category: 'c', status: true }
    post.mockResolvedValue({ data: { id: '7', ...input } })

    await expect(addProduct(input)).resolves.toEqual({ id: 7, ...input })
    expect(post).toHaveBeenCalledWith('products', input)
  })
})

import { describe, it, expect } from 'vitest'
import { cartReducer, initialCartState } from './cart.reducer'
import { CartActionType, type CartItem } from '../cart.types'
import type { Product } from '../../../types/product.types'

const product = (id: number, price = 10): Product => ({
  id,
  name: `Product ${id}`,
  price,
  category: 'c',
  status: true,
})

const lineItem = (id: number, quantity: number, price = 10): CartItem => ({
  product: product(id, price),
  quantity,
})

describe('cartReducer', () => {
  it('ADD_ITEM adds a new product with quantity 1', () => {
    const next = cartReducer(initialCartState, { type: CartActionType.ADD_ITEM, payload: product(1) })
    expect(next).toEqual([lineItem(1, 1)])
  })

  it('ADD_ITEM increments quantity for an existing product', () => {
    const state = [lineItem(1, 1)]
    const next = cartReducer(state, { type: CartActionType.ADD_ITEM, payload: product(1) })
    expect(next).toEqual([lineItem(1, 2)])
    expect(next).not.toBe(state) // new reference, immutable update
  })

  it('REMOVE_ITEM drops the product by id', () => {
    const state = [lineItem(1, 1), lineItem(2, 3)]
    const next = cartReducer(state, { type: CartActionType.REMOVE_ITEM, payload: 1 })
    expect(next).toEqual([lineItem(2, 3)])
  })

  it('UPDATE_QUANTITY applies the delta to the matching product', () => {
    const state = [lineItem(1, 2), lineItem(2, 1)]
    const inc = cartReducer(state, {
      type: CartActionType.UPDATE_QUANTITY,
      payload: { productId: 1, delta: 2 },
    })
    expect(inc.find((i) => i.product.id === 1)?.quantity).toBe(4)

    const dec = cartReducer(state, {
      type: CartActionType.UPDATE_QUANTITY,
      payload: { productId: 1, delta: -1 },
    })
    expect(dec.find((i) => i.product.id === 1)?.quantity).toBe(1)
  })

  it('UPDATE_QUANTITY removes the item when quantity drops to zero or below', () => {
    const state = [lineItem(1, 1), lineItem(2, 3)]

    const toZero = cartReducer(state, {
      type: CartActionType.UPDATE_QUANTITY,
      payload: { productId: 1, delta: -1 },
    })
    expect(toZero).toEqual([lineItem(2, 3)])

    const belowZero = cartReducer(state, {
      type: CartActionType.UPDATE_QUANTITY,
      payload: { productId: 1, delta: -5 },
    })
    expect(belowZero).toEqual([lineItem(2, 3)])
  })

  it('CLEAR_CART empties the cart', () => {
    expect(cartReducer([lineItem(1, 5)], { type: CartActionType.CLEAR_CART })).toEqual([])
  })

  it('returns the same state for an unknown action', () => {
    const state = [lineItem(1, 1)]
    expect(cartReducer(state, { type: 'UNKNOWN' } as never)).toBe(state)
  })
})

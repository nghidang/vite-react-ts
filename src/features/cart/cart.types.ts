import type { Product } from '../../types/product.types'

export type CartItem = {
  product: Product
  quantity: number
}

export const CartActionType = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
} as const

export type CartAction =
  | { type: typeof CartActionType.ADD_ITEM; payload: Product }
  | { type: typeof CartActionType.REMOVE_ITEM; payload: number } // payload is product id
  | {
      type: typeof CartActionType.UPDATE_QUANTITY
      payload: { productId: number; delta: number }
    }
  | { type: typeof CartActionType.CLEAR_CART }

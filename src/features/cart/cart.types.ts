export type Product = {
  id: string
  name: string
  price: number
}

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
  | { type: typeof CartActionType.REMOVE_ITEM; payload: string } // payload is product id
  | {
      type: typeof CartActionType.UPDATE_QUANTITY
      payload: { productId: string; delta: number }
    }
  | { type: typeof CartActionType.CLEAR_CART }

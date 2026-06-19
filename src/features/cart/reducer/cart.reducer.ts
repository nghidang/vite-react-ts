import { CartActionType, type CartAction, type CartItem } from '../cart.types'

export const initialCartState: CartItem[] = []

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case CartActionType.ADD_ITEM: {
      const existingItem = state.find((item) => item.product.id === action.payload.id)
      if (existingItem) {
        return state.map((item) =>
          item.product.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...state, { product: action.payload, quantity: 1 }]
    }
    case CartActionType.REMOVE_ITEM:
      return state.filter((item) => item.product.id !== action.payload)
    case CartActionType.UPDATE_QUANTITY:
      // Áp delta rồi clamp: số lượng về <= 0 thì xóa luôn item khỏi giỏ (hành vi nút "-").
      return state.flatMap((item) => {
        if (item.product.id !== action.payload.productId) return [item]
        const quantity = item.quantity + action.payload.delta
        return quantity > 0 ? [{ ...item, quantity }] : []
      })
    case CartActionType.CLEAR_CART:
      return []
    default:
      return state
  }
}

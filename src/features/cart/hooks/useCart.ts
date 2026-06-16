import { useReducer } from 'react'
import { cartReducer, initialCartState } from '../reducer/cart.reducer'

export function useCart() {
  const [items, dispatch] = useReducer(cartReducer, initialCartState)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return { items, dispatch, totalPrice }
}

import { useSearchParams } from 'react-router-dom'
import type { Product } from '../../../types/product.types'
import { CartActionType } from '../cart.types'
import { useCart } from '../hooks/useCart'

const SAMPLE: Product = {
  id: 1,
  name: 'Áo thun',
  price: 150000,
  category: 'Thời trang',
  status: true,
}

export function CartPage() {
  const [searchParams] = useSearchParams()
  const { items, dispatch, totalPrice } = useCart()

  return (
    <div>
      <h1>Shopping Cart</h1>
      <p>This is the shopping cart page - {searchParams.get('search')}</p>

      <button
        type="button"
        onClick={() => dispatch({ type: CartActionType.ADD_ITEM, payload: SAMPLE })}
      >
        Thêm Áo thun
      </button>

      <ul>
        {items.map((item) => (
          <li key={item.product.id}>
            <span>
              {item.product.name} - ${item.product.price.toFixed(2)} x {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: CartActionType.UPDATE_QUANTITY,
                  payload: { productId: item.product.id, delta: 1 },
                })
              }
            >
              +
            </button>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: CartActionType.UPDATE_QUANTITY,
                  payload: { productId: item.product.id, delta: -1 },
                })
              }
            >
              -
            </button>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: CartActionType.REMOVE_ITEM, payload: item.product.id })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>Total: ${totalPrice.toFixed(2)}</p>
    </div>
  )
}

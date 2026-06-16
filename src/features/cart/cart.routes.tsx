import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '../../constants/route.constants'
import { CartPage } from './pages/CartPage'

/** Route của feature cart (cần đăng nhập → AppRouter đặt dưới ProtectedRoute). */
export const cartRoutes: RouteObject[] = [{ path: ROUTES.CART, element: <CartPage /> }]

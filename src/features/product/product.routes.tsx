import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '../../constants/route.constants'
import { ProductListPage } from './pages/ProductListPage'

const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))

/** Route của feature product (đều cần đăng nhập → AppRouter đặt dưới ProtectedRoute). */
export const productRoutes: RouteObject[] = [
  { path: ROUTES.PRODUCT_LIST, element: <ProductListPage /> },
  { path: ROUTES.PRODUCT_DETAIL, element: <ProductDetailPage /> },
]

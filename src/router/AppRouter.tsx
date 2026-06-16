import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../constants/route.constants'
import { CartPage } from '../features/cart/pages/CartPage'
import { ProductListPage } from '../features/product/pages/ProductListPage'
import { MainLayout } from '../layouts/MainLayout'
import { MainLayoutAuth } from '../layouts/MainLayoutAuth'
import { HomePage } from '../pages/HomePage'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'))
const UserPage = lazy(() => import('../features/auth/pages/UserPage'))
const ProductDetailPage = lazy(() => import('../features/product/pages/ProductDetailPage'))

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* Route cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.PRODUCT_LIST} element={<ProductListPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.USER} element={<UserPage />} />
        </Route>
      </Route>

      <Route element={<MainLayoutAuth />}>
        <Route element={<GuestRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
    </Routes>
  )
}

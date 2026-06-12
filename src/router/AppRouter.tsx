import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../constants/route.constants'
import { Cart } from '../features/cart/pages/Cart'
import { ProductList } from '../features/product/pages/List'
import { MainLayout } from '../layouts/MainLayout'
import { MainLayoutAuth } from '../layouts/MainLayoutAuth'
import { HomePage } from '../pages/HomePage'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const UserPage = lazy(() => import('../features/auth/pages/UserPage'))
const ProductDetail = lazy(() => import('../features/product/pages/Detail'))

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* Route cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.PRODUCT_LIST} element={<ProductList />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
          <Route path={ROUTES.CART} element={<Cart />} />
          <Route path={ROUTES.USER} element={<UserPage />} />
        </Route>
      </Route>

      <Route element={<MainLayoutAuth />}>
        <Route element={<GuestRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
    </Routes>
  )
}

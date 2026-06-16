import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { ROUTES } from '../../constants/route.constants'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const UserPage = lazy(() => import('./pages/UserPage'))

// auth nằm ở 2 nhánh guard khác nhau nên phải tách 2 mảng để AppRouter ghép vào đúng chỗ.

/** Trang chỉ dành cho khách chưa đăng nhập → AppRouter đặt dưới GuestRoute. */
export const authGuestRoutes: RouteObject[] = [
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
]

/** Trang cần đăng nhập → AppRouter đặt dưới ProtectedRoute. */
export const authProtectedRoutes: RouteObject[] = [{ path: ROUTES.USER, element: <UserPage /> }]

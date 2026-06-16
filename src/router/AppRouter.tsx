import { Navigate, useRoutes, type RouteObject } from 'react-router-dom'
import { ROUTES } from '../constants/route.constants'
import { authGuestRoutes, authProtectedRoutes } from '../features/auth'
import { cartRoutes } from '../features/cart'
import { productRoutes } from '../features/product'
import { MainLayout } from '../layouts/MainLayout'
import { MainLayoutAuth } from '../layouts/MainLayoutAuth'
import { HomePage } from '../pages/HomePage'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'

// AppRouter chỉ GHÉP cây layout/guard; danh sách route do từng feature sở hữu và
// export qua public API (`features/<name>`). Thêm/bớt route → sửa trong feature.
const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      // Route cần đăng nhập
      {
        element: <ProtectedRoute />,
        children: [...productRoutes, ...cartRoutes, ...authProtectedRoutes],
      },
    ],
  },
  {
    element: <MainLayoutAuth />,
    children: [{ element: <GuestRoute />, children: [...authGuestRoutes] }],
  },
  { path: '*', element: <Navigate to={ROUTES.HOME} /> },
]

export function AppRouter() {
  return useRoutes(routes)
}

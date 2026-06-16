import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { ROUTES } from '../constants/route.constants'
import { selectIsAuthenticated } from '../features/auth/stores/auth.slice'

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const location = useLocation()

  // Chưa đăng nhập → đá về trang login; replace để không lưu /user vào history
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return <Outlet />
}

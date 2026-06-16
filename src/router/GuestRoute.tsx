import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { ROUTES } from '../constants/route.constants'
import { selectIsAuthenticated } from '../features/auth/stores/auth.slice'
import type { FromLocationState } from '../types/router.types'

export function GuestRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const location = useLocation()

  // Đã đăng nhập → không cho vào /login nữa. Nếu trước đó bị đá về login từ
  // một trang cần auth thì quay lại trang đó, mặc định về /user.
  if (isAuthenticated) {
    const from = (location.state as FromLocationState)?.from
    return <Navigate to={from ?? ROUTES.USER} replace />
  }

  return <Outlet />
}

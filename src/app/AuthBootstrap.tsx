import { useEffect, useRef, type ReactNode } from 'react'
import { selectIsAuthenticated } from '../features/auth'
import { refreshAuthToken } from '../services/token.refresh'
import { useAppSelector } from './hooks'

/**
 * Refresh-on-load: khi app khởi động mà người dùng "đã từng đăng nhập" (còn `user`
 * trong localStorage) nhưng access token đã mất sau F5, thử khôi phục phiên bằng
 * refresh token trong cookie HttpOnly.
 *
 * CHỦ Ý (chưa làm bootstrapping): KHÔNG có loading gate. Children được render NGAY
 * trong lúc refresh còn đang chạy → router ra quyết định trên `token = null`, nên:
 *   - Lỗi 1: đang ở route cần auth → ProtectedRoute đá về /login, refresh xong lại
 *            đá ngược về trang cũ → màn login nhấp nháy.
 *   - Lỗi 2: UI render ở trạng thái "guest" rồi đột ngột nhảy sang "đã đăng nhập".
 * Bước 2 (bootstrapping) sẽ thêm cổng chặn 'loading' để vá hai lỗi này.
 */
export function AuthBootstrap({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const attempted = useRef(false)

  useEffect(() => {
    if (user && !isAuthenticated && !attempted.current) {
      attempted.current = true
      // Thất bại (cookie hết hạn/không có) → runRefresh đã tự dispatch logout().
      refreshAuthToken().catch(() => {})
    }
  }, [user, isAuthenticated])

  return <>{children}</>
}

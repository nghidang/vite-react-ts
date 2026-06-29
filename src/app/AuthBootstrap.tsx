import { useEffect, useRef, useState, type ReactNode } from 'react'
import { RouteFallback } from '../components/common/RouteFallback/RouteFallback'
import { selectIsAuthenticated } from '../features/auth'
import { refreshAuthToken } from '../services/token.refresh'
import { useAppSelector } from './hooks'

/**
 * Bootstrapping: khi app khởi động mà người dùng "đã từng đăng nhập" (còn `user`
 * trong localStorage) nhưng access token đã mất sau F5, khôi phục phiên bằng refresh
 * token trong cookie HttpOnly.
 *
 * Loading gate: trong lúc refresh-on-load còn chạy, GIỮ router lại (hiện splash) thay
 * vì render app. Nhờ vậy router chỉ ra quyết định khi trạng thái auth đã chốt → KHÔNG
 * còn nháy màn login (Lỗi 1) và KHÔNG còn giật UI guest→authed (Lỗi 2).
 *
 * `needsRecovery` được tính MỘT LẦN lúc mount: app vừa load nên access token luôn null
 * (chỉ nằm trong memory) → tín hiệu phân biệt là có `user` đã persist hay không.
 */
export function AuthBootstrap({ children }: { children: ReactNode }) {
  const hasPersistedUser = useAppSelector((state) => state.auth.user !== null)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // Lazy initializer → chỉ tính ở lần render đầu (mount), không đọc lại về sau.
  const [needsRecovery] = useState(() => hasPersistedUser && !isAuthenticated)
  const [booting, setBooting] = useState(needsRecovery)
  const started = useRef(false)

  useEffect(() => {
    if (!needsRecovery || started.current) return
    started.current = true
    refreshAuthToken()
      .catch(() => {
        // Thất bại (cookie hết hạn/không có) → runRefresh đã tự dispatch logout().
      })
      .finally(() => setBooting(false))
  }, [needsRecovery])

  if (booting) return <RouteFallback />

  return <>{children}</>
}

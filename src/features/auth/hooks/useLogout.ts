import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { queryClient } from '../../../app/query.client'
import { ROUTES } from '../../../constants/route.constants'
import * as authService from '../services/auth.service'
import { logout } from '../stores/auth.slice'

/**
 * Đăng xuất đầy đủ cho luồng cookie HttpOnly:
 *  1. Gọi POST /logout (kèm cookie) để backend xoá refresh-token cookie — JS không tự xoá được.
 *  2. Dọn state phía client: auth (memory + `user` trong localStorage) + cache react-query
 *     (tránh phiên sau thấy dữ liệu server đã cache của phiên trước), rồi về /login.
 *
 * Bước 1 là best-effort: dù request lỗi (mạng hỏng, cookie đã hết hạn) vẫn phải đăng xuất
 * phía client, nên dọn state nằm trong `finally`.
 */
export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Nuốt lỗi: client vẫn đăng xuất bất kể backend phản hồi thế nào.
    } finally {
      dispatch(logout())
      queryClient.clear()
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [dispatch, navigate])
}

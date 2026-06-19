import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { ROUTES } from '../../../constants/route.constants'
import * as authService from '../services/auth.service'
import { logout } from '../stores/auth.slice'

/**
 * Đăng xuất đầy đủ cho luồng cookie HttpOnly:
 *  1. Gọi POST /logout (kèm cookie) để backend xoá refresh-token cookie — JS không tự xoá được.
 *  2. Dọn state phía client (access token trong memory + `user` trong localStorage) và về /login.
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
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [dispatch, navigate])
}

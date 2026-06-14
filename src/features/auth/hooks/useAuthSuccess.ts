import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { ROUTES } from '../../../constants/route.constants'
import type { FromLocationState } from '../../../types/router.types'
import type { LoginResponse } from '../auth.types'
import { loginSuccess } from '../stores/authSlice'

/**
 * Side-effect dùng chung sau khi login/register thành công: lưu phiên vào redux rồi điều hướng
 * về trang trước đó (nếu bị đá ra từ route cần auth, qua `location.state.from`) hoặc trang user.
 * Trả thẳng callback để truyền vào `mutate(..., { onSuccess })`.
 */
export function useAuthSuccess() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    ({ user, token, refreshToken, expireAt }: LoginResponse) => {
      dispatch(loginSuccess({ user, token, refreshToken, expireAt }))
      const from = (location.state as FromLocationState)?.from
      navigate(from ?? ROUTES.USER, { replace: true })
    },
    [dispatch, navigate, location.state]
  )
}

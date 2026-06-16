import { useMutation } from '@tanstack/react-query'
import { InvalidAuthDataError } from '../auth.errors'
import type { LoginCredentials, LoginResponse } from '../auth.types'
import * as authService from '../services/auth.service'

/**
 * Factory dùng chung cho login/register: gọi service, validate payload, trả về data đã hợp lệ.
 * Validate ngay trong mutationFn để mọi lỗi (mạng, HTTP, dữ liệu rỗng) đi qua một kênh `error` duy nhất.
 * Hook giữ "thuần API" — không biết i18n / redux / điều hướng; phần đó component lo qua onSuccess.
 */
function useAuthMutation(authFn: (username: string, password: string) => Promise<LoginResponse>) {
  return useMutation({
    mutationFn: async ({ username, password }: LoginCredentials) => {
      const result = await authFn(username, password)
      if (!result.user || !result.token) throw new InvalidAuthDataError()
      return result
    },
  })
}

/** Mutation đăng nhập. */
export const useLogin = () => useAuthMutation(authService.login)

/** Mutation đăng ký. Server trả luôn token nên dùng chung factory với login (auto-login). */
export const useRegister = () => useAuthMutation(authService.register)

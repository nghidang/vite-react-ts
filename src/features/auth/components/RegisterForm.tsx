import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { ControlledInputText } from '../../../components/common/InputText/ControlledInputText'
import { ROUTES } from '../../../constants/route.constants'
import { useApiRequest } from '../../../hooks/useApiRequest'
import { useTranslation } from '../../../hooks/useTranslation'
import { createRegisterSchema, type RegisterFormValues } from '../auth.schemas'
import type { LoginResponse } from '../auth.types'
import * as authService from '../services/authService'
import { loginSuccess } from '../stores/authSlice'
import './RegisterForm.css'

export function RegisterForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { error, run, setError } = useApiRequest<LoginResponse>()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: { username: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  // confirmPassword chỉ phục vụ validate phía client -> không gửi lên server.
  const onSubmit = async ({ username, password }: RegisterFormValues) => {
    const result = await run(
      () => authService.register(username, password),
      t('auth.register.error.failed')
    )

    if (!result) return // request lỗi — error đã được set trong hook

    if (!result.user || !result.token) {
      setError(t('auth.register.error.invalidData'))
      return
    }

    // Đăng ký xong tự đăng nhập luôn.
    const { user, token, refreshToken, expireAt } = result
    dispatch(loginSuccess({ user, token, refreshToken, expireAt }))
    navigate(ROUTES.USER, { replace: true })
  }

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>{t('auth.register.title')}</h2>

      <div className="register-field">
        <label htmlFor="username">{t('auth.register.username')}</label>
        <ControlledInputText
          control={control}
          name="username"
          id="username"
          autoComplete="username"
        />
      </div>
      {errors.username && <p className="register-error">{errors.username.message}</p>}

      <div className="register-field">
        <label htmlFor="password">{t('auth.register.password')}</label>
        <ControlledInputText
          control={control}
          name="password"
          type="password"
          id="password"
          autoComplete="new-password"
        />
      </div>
      {errors.password && <p className="register-error">{errors.password.message}</p>}

      <div className="register-field">
        <label htmlFor="confirmPassword">{t('auth.register.confirmPassword')}</label>
        <ControlledInputText
          control={control}
          name="confirmPassword"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
        />
      </div>
      {errors.confirmPassword && <p className="register-error">{errors.confirmPassword.message}</p>}

      {error && <p className="register-error">{error}</p>}

      <button type="submit" className="register-submit" disabled={isSubmitting}>
        {isSubmitting ? t('auth.register.submitting') : t('auth.register.submit')}
      </button>

      <p className="register-switch">
        {t('auth.register.haveAccount')} <Link to={ROUTES.LOGIN}>{t('auth.register.toLogin')}</Link>
      </p>
    </form>
  )
}

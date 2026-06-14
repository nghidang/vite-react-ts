import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { ControlledInputText } from '../../../components/common/InputText/ControlledInputText'
import { ROUTES } from '../../../constants/route.constants'
import { useApiRequest } from '../../../hooks/useApiRequest'
import { useTranslation } from '../../../hooks/useTranslation'
import type { FromLocationState } from '../../../types/router.types'
import { createLoginSchema, type LoginFormValues } from '../auth.schemas'
import type { LoginResponse } from '../auth.types'
import * as authService from '../services/authService'
import { loginSuccess } from '../stores/authSlice'
import './LoginForm.css'

export function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const { error, run, setError } = useApiRequest<LoginResponse>()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async ({ username, password }: LoginFormValues) => {
    const result = await run(
      () => authService.login(username, password),
      t('auth.login.error.failed')
    )

    if (!result) return // request lỗi — error đã được set trong hook

    if (!result.user || !result.token) {
      setError(t('auth.login.error.invalidData'))
      return
    }

    const { user, token, refreshToken, expireAt } = result
    dispatch(loginSuccess({ user, token, refreshToken, expireAt }))

    const from = (location.state as FromLocationState)?.from
    navigate(from ?? ROUTES.USER, { replace: true })
  }

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>{t('auth.login.title')}</h2>

      <div className="login-field">
        <label htmlFor="username">{t('auth.login.username')}</label>
        <ControlledInputText
          control={control}
          name="username"
          id="username"
          autoComplete="username"
        />
      </div>
      {errors.username && <p className="login-error">{errors.username.message}</p>}

      <div className="login-field">
        <label htmlFor="password">{t('auth.login.password')}</label>
        <ControlledInputText
          control={control}
          name="password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
      </div>
      {errors.password && <p className="login-error">{errors.password.message}</p>}

      {error && <p className="login-error">{error}</p>}

      <button type="submit" className="login-submit" disabled={isSubmitting}>
        {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
      </button>

      <p className="login-switch">
        {t('auth.login.noAccount')} <Link to={ROUTES.REGISTER}>{t('auth.login.toRegister')}</Link>
      </p>
    </form>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/route.constants'
import { useTranslation } from '../../../i18n/useTranslation'
import { resolveAuthError } from '../auth.errors'
import { createLoginSchema, type LoginFormValues } from '../auth.schemas'
import { useLogin } from '../hooks/authMutations'
import { useAuthSuccess } from '../hooks/useAuthSuccess'
import { AuthField } from './AuthField'
import './AuthForm.css'

export function LoginForm() {
  const { t } = useTranslation()
  const login = useLogin()
  const onAuthSuccess = useAuthSuccess()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = (values: LoginFormValues) => login.mutate(values, { onSuccess: onAuthSuccess })

  const errorMessage = resolveAuthError(login.error, {
    invalidData: t('auth.login.error.invalidData'),
    failed: t('auth.login.error.failed'),
  })

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>{t('auth.login.title')}</h2>

      <AuthField
        control={control}
        name="username"
        label={t('auth.login.username')}
        autoComplete="username"
        error={errors.username?.message}
      />
      <AuthField
        control={control}
        name="password"
        type="password"
        label={t('auth.login.password')}
        autoComplete="current-password"
        error={errors.password?.message}
      />

      {errorMessage && <p className="auth-error">{errorMessage}</p>}

      <button type="submit" className="auth-submit" disabled={login.isPending}>
        {login.isPending ? t('auth.login.submitting') : t('auth.login.submit')}
      </button>

      <p className="auth-switch">
        {t('auth.login.noAccount')} <Link to={ROUTES.REGISTER}>{t('auth.login.toRegister')}</Link>
      </p>
    </form>
  )
}

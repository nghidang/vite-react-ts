import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../constants/route.constants'
import { useTranslation } from '../../../hooks/useTranslation'
import { resolveAuthError } from '../auth.errors'
import { createRegisterSchema, type RegisterFormValues } from '../auth.schemas'
import { useRegister } from '../hooks/authMutations'
import { useAuthSuccess } from '../hooks/useAuthSuccess'
import { AuthField } from './AuthField'
import './AuthForm.css'

export function RegisterForm() {
  const { t } = useTranslation()
  const register = useRegister()
  const onAuthSuccess = useAuthSuccess()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: { username: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  // confirmPassword chỉ phục vụ validate phía client -> không gửi lên server.
  const onSubmit = ({ username, password }: RegisterFormValues) =>
    register.mutate({ username, password }, { onSuccess: onAuthSuccess })

  const errorMessage = resolveAuthError(register.error, {
    invalidData: t('auth.register.error.invalidData'),
    failed: t('auth.register.error.failed'),
  })

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>{t('auth.register.title')}</h2>

      <AuthField
        control={control}
        name="username"
        label={t('auth.register.username')}
        autoComplete="username"
        error={errors.username?.message}
      />
      <AuthField
        control={control}
        name="password"
        type="password"
        label={t('auth.register.password')}
        autoComplete="new-password"
        error={errors.password?.message}
      />
      <AuthField
        control={control}
        name="confirmPassword"
        type="password"
        label={t('auth.register.confirmPassword')}
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
      />

      {errorMessage && <p className="auth-error">{errorMessage}</p>}

      <button type="submit" className="auth-submit" disabled={register.isPending}>
        {register.isPending ? t('auth.register.submitting') : t('auth.register.submit')}
      </button>

      <p className="auth-switch">
        {t('auth.register.haveAccount')} <Link to={ROUTES.LOGIN}>{t('auth.register.toLogin')}</Link>
      </p>
    </form>
  )
}

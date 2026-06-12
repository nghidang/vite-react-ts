import { useState, type SyntheticEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { InputText } from '../../../components/common/InputText/InputText'
import { ROUTES } from '../../../constants/route.constants'
import { useApiRequest } from '../../../hooks/useApiRequest'
import { useTranslation } from '../../../hooks/useTranslation'
import type { FromLocationState } from '../../../types/router.types'
import type { LoginResponse } from '../auth.types'
import * as authService from '../services/authService'
import { loginSuccess } from '../stores/authSlice'
import './LoginForm.css'

export function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const { loading, error, run, setError } = useApiRequest<LoginResponse>()

  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('123456')

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username || !password) {
      setError(t('auth.login.validation.required'))
      return
    }

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
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>{t('auth.login.title')}</h2>
      <div className="login-field">
        <label htmlFor="username">{t('auth.login.username')}</label>
        <InputText
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="login-field">
        <label htmlFor="password">{t('auth.login.password')}</label>
        <InputText
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="login-error">{error}</p>}

      <button type="submit" className="login-submit" disabled={loading}>
        {loading ? t('auth.login.submitting') : t('auth.login.submit')}
      </button>
    </form>
  )
}

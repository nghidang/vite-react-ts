import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LangContext } from './LangContext'
import { LangProvider } from './LangProvider'
import { useTranslation } from './useTranslation'
import { LangSwitcher } from '../components/common/LangSwitcher/LangSwitcher'

function ShowTitle() {
  const { t, lang } = useTranslation()
  return (
    <span>
      {lang}:{t('auth.login.title')}
    </span>
  )
}

describe('useTranslation', () => {
  it('translates using the language from context', () => {
    render(
      <LangContext.Provider value={{ lang: 'vi', setLang: () => {} }}>
        <ShowTitle />
      </LangContext.Provider>
    )
    expect(screen.getByText('vi:Đăng nhập')).toBeInTheDocument()
  })
})

describe('LangProvider integration', () => {
  beforeEach(() => localStorage.clear())

  it('re-renders consumers and persists the choice when the language changes', async () => {
    const user = userEvent.setup()
    render(
      <LangProvider>
        <LangSwitcher />
        <ShowTitle />
      </LangProvider>
    )

    expect(screen.getByText('en:Login')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tiếng Việt' }))

    expect(screen.getByText('vi:Đăng nhập')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('lang')!)).toBe('vi')
  })
})

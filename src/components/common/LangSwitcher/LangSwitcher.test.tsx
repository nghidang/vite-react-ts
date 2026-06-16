import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LangSwitcher } from './LangSwitcher'
import { LangContext } from '../../../i18n/LangContext'

const renderWithLang = (lang: string, setLang = vi.fn()) => {
  render(
    <LangContext.Provider value={{ lang, setLang }}>
      <LangSwitcher />
    </LangContext.Provider>
  )
  return { setLang }
}

describe('LangSwitcher', () => {
  it('disables the button for the active language', () => {
    renderWithLang('en')
    expect(screen.getByRole('button', { name: 'English' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toBeEnabled()
  })

  it('switches language on click', async () => {
    const user = userEvent.setup()
    const { setLang } = renderWithLang('en')
    await user.click(screen.getByRole('button', { name: 'Tiếng Việt' }))
    expect(setLang).toHaveBeenCalledWith('vi')
  })

  it('reflects the active language the other way around', () => {
    renderWithLang('vi')
    expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'English' })).toBeEnabled()
  })
})

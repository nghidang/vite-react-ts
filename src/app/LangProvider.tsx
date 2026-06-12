import { useEffect, useMemo } from 'react'
import { LangContext } from '../contexts/LangContext'
import useLocalStorage from '../hooks/useLocalStorage'
import { setActiveLang, type Lang } from '../i18n'

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useLocalStorage('lang', 'en')

  useEffect(() => {
    setActiveLang(lang as Lang)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

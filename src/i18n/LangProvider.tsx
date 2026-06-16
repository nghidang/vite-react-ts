import { useEffect, useMemo } from 'react'
import { LangContext } from './LangContext'
import useLocalStorage from '../hooks/useLocalStorage'
import { setActiveLang, type Lang } from '.'

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useLocalStorage('lang', 'en')

  useEffect(() => {
    setActiveLang(lang as Lang)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}
